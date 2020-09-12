/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="Widget.ts"/>

module JS {

    export namespace fx {

        export enum DialogFaceMode {
            round = 'round',
            square = 'square'
        }

        export interface DialogButtonOption {
            text: string;
            colorMode?: ColorMode | string;
            onClick?: ((this: Dialog, e: Event, button: HTMLElement, index: number) => boolean | void);
        }
        export class DialogConfig extends WidgetConfig<Dialog> {
            title?: string = '';
            faceMode?: DialogFaceMode = DialogFaceMode.square;
            hidden?: boolean = true;
            buttons?: Array<DialogButtonOption>;
            html?: string | Element | JQuery<HTMLElement> = '';
            url?: string;
            autoDestroy?: boolean = true;
            childWidgets?: JsonObject<WidgetConfig<any>>;
            listeners?: DialogListeners;
        }

        export type DialogEvents = WidgetEvents;
        export interface DialogListeners extends WidgetListeners<Dialog> {};

        @widget('JS.fx.Dialog')
        export class Dialog extends Widget {

            private _children: JsonObject<Widget>;

            constructor(config: DialogConfig) {
                super(config);
            }

            private _loaded = false;

            public load(api?: string, params?: JsonObject, encode?:boolean) {
                let cfg = <DialogConfig>this._config,
                    remote: string = api || <string>cfg.url;
                if (!remote) return;

                let url = new URI(remote).queryObject(params, encode).toString();
                cfg.url = url;
                this._mainEl.find('div.modal-body').off().empty().html('<iframe frameborder="0" width="100%" height="100%" src="' + url + '"></iframe>');
            }

            public show<Dialog>() {
                if (!this._loaded) this.load();
                this._mainEl.modal('show');
                return this;
            }
            public hide<Dialog>() {
                this._mainEl.modal('hide');
                return this;
            }
            public toggle() {
                this._mainEl.modal('toggle');
                return this;
            }
            public isShown(): boolean {
                let d = this._mainEl.data('bs.modal');
                return d ? d._isShown : false;
            }

            protected _mainEl: JQuery<HTMLElement>;/** 组件内部主DOM对象 */

            protected _render() {
                let cfg = <DialogConfig>this._config,
                    cHtml = cfg.html ? (Types.isString(cfg.html) ? cfg.html : $(cfg.html).html()) : '';

                let btnHtml = '', buttons = cfg.buttons;
                if (buttons && buttons.length > 0) {
                    btnHtml = '<div class="modal-footer">';
                    buttons.forEach((opt, i) => {
                        btnHtml += `<button id="${this.id + '_button' + i}" type="button" class="btn btn-${opt.colorMode || ColorMode.primary}" data-dismiss="modal">${opt.text}</button>`;
                    })
                    btnHtml += '</div>';
                }

                let titleHtml = '';
                if(cfg.title) titleHtml = `
                <div class="modal-header">
                <div class="modal-title">${cfg.title}</div>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
                </div>
                `

                let html = `
                <div class="modal fade" tabindex="-1" role="dialog" aria-hidden="false" jsfx-role="main">
                    <div class="modal-dialog modal-dialog-centered" role="document" style="min-width:${CssTool.normValue(cfg.width,'auto')}">
                    <div class="modal-content" style="border-radius:${this._hasFaceMode(DialogFaceMode.round) ? '0.3rem' : '0px'}">
                        ${titleHtml}
                        <div class="modal-body jsfx-dialog-body" style="height:${CssTool.normValue(cfg.height,'100%')}">
                        ${cHtml}
                        </div>
                        ${btnHtml}
                    </div>
                    </div>
                </div>
                `;
                this.widgetEl.html(html);
                this._renderChildren();

                //bind buttons click
                let btnCt = this.widgetEl.find('div.modal-footer');
                if (buttons && btnCt.length == 1) {
                    buttons.forEach((opt, i) => {
                        let me = this;
                        if (opt.onClick) $('#' + this.id + '_button' + i).click(function (e: JQuery.Event) {
                            return opt.onClick.apply(me, [e.originalEvent, this, i])
                        })
                    })
                }

                //rebind events
                this._mainEl = this.widgetEl.find('[jsfx-role=main]');
                this._mainEl.off();
                this._mainEl.on('show.bs.modal', () => { this._fire('showing') });
                this._mainEl.on('shown.bs.modal', () => { this._fire('shown') });
                this._mainEl.on('hide.bs.modal', () => { this._fire('hiding') });
                this._mainEl.on('hidden.bs.modal', () => {
                    this._fire('hidden');
                    if ((<DialogConfig>this._config).autoDestroy) this.destroy();
                });

                this._mainEl.modal({
                    backdrop:'static',
                    show: !cfg.hidden
                })
            }

            protected _destroy() {
                super._destroy();
                this._mainEl.modal('dispose');
                $('div.modal-backdrop').remove();

                Jsons.forEach(this._children, wgt => {
                    wgt.destroy()
                })
            }

            public buttons(): JQuery {
                return this._mainEl.find('div.modal-footer button')
            }

            public child<T = Widget | JsonObject<Widget>>(id?: string): T {
                return id ? this._children : <any>this._children[id];
            }

            private _renderChildren() {
                let els = this.widgetEl.find(`div.modal-body div[${View.WIDGET_ATTRIBUTE}]`);
                if (els.length < 1) return;

                this._children = {};
                let wConfigs = (<DialogConfig>this._config).childWidgets;
                els.each((i: number, e: HTMLElement) => {
                    let el = $(e),
                        name = el.attr('name'),
                        id = el.attr('id'),
                        alias = el.attr(View.WIDGET_ATTRIBUTE);

                    let cfg: WidgetConfig<Widget> = Jsons.union(wConfigs && wConfigs[id], { id: id, name: name });
                    this._children[id] = Class.aliasInstance<Widget>(alias, cfg);
                });
            }

            protected _onAfterInit() {
                if (!this._config.hidden) this.show();
            }

        }

    }

}
import Dialog = JS.fx.Dialog;
import DialogConfig = JS.fx.DialogConfig;
import DialogEvents = JS.fx.DialogEvents;
import DialogListeners = JS.fx.DialogListeners;
import DialogFaceMode = JS.fx.DialogFaceMode;