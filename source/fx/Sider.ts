/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../../libs/slidereveal/1.1.2/jquery.slidereveal.d.ts"/>
/// <reference path="Widget.ts"/>
/// <reference path="../util/Bom.ts"/>

module JS {

    export namespace fx {

        export type SiderEvents = WidgetEvents | 'opening' | 'opened' | 'closing' | 'closed' | 'loaded';

        export interface SiderListeners extends WidgetListeners<Sider> {
            opening?: EventHandler<Sider>
            opened?: EventHandler<Sider>
            closing?: EventHandler<Sider>
            closed?: EventHandler<Sider>
            loaded?: EventHandler1<Sider, Window> //frame
        }

        export enum SiderFaceMode {
            /**
             * over to the main content.
             */
            over = 'over',
            /**
             * overlay to the main content.
             */
            overlay = 'overlay',
            /**
             * push the main content.
             */
            push = 'push'
        }

        export class SiderConfig extends WidgetConfig<Sider> {
            title?: string;
            titleCls?: string;
            titleStyle?: string;

            hidden?: boolean = true;

            /**
             * Width of a side panel. Integer value will be evaluated as px. String value will be assigned directly e.g. '100px', '50%'
             */
            width?: string | number;

            /**
             * @default SiderFaceMode.over
             */
            faceMode?: SiderFaceMode = SiderFaceMode.over;

            /**
             * Where you want to show a side panel from. You can only set it to either left or right.
             * @default 'left'
             */
            place?: 'left' | 'right';
            /**
             * Whether you want to enable users to use ESC to hide a panel.
             * @default true
             */
            escKey?: boolean;

            /**
             * Animating time for showing a side panel. The unit is millisecond.
             */
            speed?: number;

            url?: string;
            html?: string | Element | JQuery;
            /**
             * DOM element that you want to use as a trigger to show and hide a panel.
             */
            trigger?: string | Element | JQuery;

            listeners?: SiderListeners;
        }

        @widget('JS.fx.Sider')
        export class Sider extends Widget {

            private _overlay: JQuery;
            constructor(cfg: SiderConfig) {
                if (cfg.hidden === undefined) cfg.hidden = true;
                cfg.appendTo = 'body';
                if (!cfg.faceMode) cfg.faceMode = SiderFaceMode.over;
                super(cfg);
            }

            public toggle() {
                this.widgetEl.slideReveal('toggle');
            }

            public show() {
                this.widgetEl.slideReveal('show');
                return this
            }

            public hide() {
                this.widgetEl.slideReveal('hide');
                return this
            }

            public loadHtml(html: string | Element | JQuery) {
                let cfg = <SiderConfig>this._config;
                if (html) cfg.html = html;
                if (!cfg.html) return;

                let h = Types.isString(cfg.html) ? <string>cfg.html : $(cfg.html).html();
                this._mainEl.off().empty().html(h);
                this._fire<SiderEvents>('loaded');
                return this
            }
            public loadUrl(url: string) {
                let cfg = <SiderConfig>this._config;
                if (url) cfg.url = url;
                if (!cfg.url) return;

                this._mainEl.off().empty();
                let iframe = document.createElement('iframe'), fn = () => {
                    let ifr = $(`#${this.id}_iframe`)[0], fWin = Bom.iframeWindow(ifr);
                    (<any>fWin).Page.onEvent(<PageEvents>'close', (e, ...args: any[]) => {
                        this._fire<SiderEvents>('closing', args);
                        this.widgetEl.slideReveal('hide', false);
                        this._fire<SiderEvents>('closed', args);
                    })
                    this._fire<SiderEvents>('loaded', [fWin]);
                };
                iframe.id = this.id + '_iframe';
                iframe.src = cfg.url;
                if (iframe['attachEvent']) {
                    iframe['attachEvent']('onload', fn)
                } else {
                    iframe.onload = fn
                }

                this._mainEl.append(iframe);
                return this
            }
            public reload() {
                let cfg = <SiderConfig>this._config;
                cfg.html ? this.loadHtml(null) : this.loadUrl(null);
                return this
            }

            public getFrame(){
                return $(`#${this.id}_iframe`)[0]
            }

            /**
             * 在父类构造函数中的初始化之后，由子类重载实现
             */
            protected _onAfterInit() {
                let cfg = <SiderConfig>this._config;
                this.reload();
                if (!cfg.hidden) this.show();
            }

            protected _mainEl: JQuery<HTMLElement>;/** 组件内部主DOM对象 */

            protected _render() {
                let cfg = <SiderConfig>this._config,
                    html = `
                    <div class="jsfx-sider-head ${cfg.titleCls || ''}" style="${cfg.titleStyle || ''}">
                        <div jsfx-role="title" class="text-truncate">${cfg.title || ''}</div>
                        <button type="button" class="close" aria-label="Close"><i class="la la-arrow-${cfg.place || 'left'}"></i></button>                            
                    </div>
                    <div class="jsfx-sider-body" jsfx-role="main"></div>
                    `;
                this.widgetEl.addClass(`jsfx-sider ${cfg.place || 'left'}`).html(html);

                let isPush = cfg.faceMode == SiderFaceMode.push;
                this.widgetEl = $('#' + this.id).slideReveal({
                    width: cfg.width || undefined,
                    trigger: cfg.trigger ? $(cfg.trigger) : undefined,
                    push: isPush,
                    overlay: !isPush,
                    overlayColor: 'rgba(0, 0, 0, 0.25)',
                    position: cfg.place,
                    speed: cfg.speed,
                    autoEscape: cfg.escKey == false ? false : true,
                    show: () => {
                        this.widgetEl.addClass((cfg.faceMode == SiderFaceMode.overlay ? 'overlay-' : '') + 'sider-shadow');
                        this._fire<SiderEvents>('opening');
                    },
                    shown: () => { this._fire<SiderEvents>('opened') },
                    hide: () => {
                        this.widgetEl.removeClass((cfg.faceMode == SiderFaceMode.overlay ? 'overlay-' : '') + 'sider-shadow');
                        this._fire<SiderEvents>('closing');
                    },
                    hidden: () => { this._fire<SiderEvents>('closed') }
                })

                let overs = $('.slide-reveal-overlay');
                if (overs.length > 0) {
                    this._overlay = $(overs[0]);
                    if (cfg.faceMode == SiderFaceMode.over) this._overlay.remove();
                }

                this.widgetEl.find('button.close').click(() => {
                    this.hide()
                })
                this._mainEl = this.widgetEl.find('[jsfx-role=main]');
            }

            protected _destroy() {
                if (this._overlay) this._overlay.remove();
                super._destroy();
            }

            public title(): string
            public title(text: string): this
            public title(text?: string): any {
                let cfg = <SiderConfig>this._config;
                if (arguments.length == 0) return cfg.title;
                this.widgetEl.find('div[jsfx-role="title"]').html(text);
                cfg.title = text;
                return this
            }

        }
    }

}
import SiderFaceMode = JS.fx.SiderFaceMode;
import SiderConfig = JS.fx.SiderConfig;
import SiderEvents = JS.fx.SiderEvents;
import SiderListeners = JS.fx.SiderListeners;
import Sider = JS.fx.Sider;
