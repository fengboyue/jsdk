/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="FormWidget.ts"/>

module JS {

    export namespace fx {

        export enum ButtonFaceMode {
            square = 'square',
            round = 'round',
            round_left = 'round-left',
            round_right = 'round-right',
            pill = 'pill',
            pill_left = 'pill-left',
            pill_right = 'pill-right',
            shadow = 'shadow'
        }

        export interface ButtonListeners extends WidgetListeners<Button> {
            'click': EventHandler<Button>;
        }

        export class ButtonConfig extends WidgetConfig<Button> {
            faceMode?: ButtonFaceMode | Array<ButtonFaceMode> = ButtonFaceMode.square;
            text?: string;
            iconCls?: string;
            cls?: string;
            outline?: boolean = false;
            badge?: string|{text:string,color?:ColorMode};
            dropMenu?: DropMenuOptions = null;
            listeners? : ButtonListeners;
            disabled?: boolean = false;
        }

        export type DropMenuOptions = {
            dir?: 'left'|'right'|'up'|'down';
            items: Array<DropMenuItem>;
        }

        export type DropMenuItem = {
            caption?: string,//组标题
            text?: string,//字符串文本，置于a标签中，
            html?: string,//html片段，替换a标签
            href?: string,//点击跳转的超链接，a标签存在时使用
            selected?: boolean,
            hasDivider?: boolean,//下方是否带有分割线
            iconCls?: string,//图标
            onClick?: EventHandler<Button>;//点击后的回调
        }

        export type ButtonEvents = WidgetEvents | 'click';

        @widget('JS.fx.Button')
        export class Button extends Widget {

            constructor(cfg: ButtonConfig) {
                super(cfg);
            }
            
            protected _mainEl: JQuery<HTMLElement>;/** 组件内部主DOM对象 */

            protected _render() {
                let cfg = <ButtonConfig>this._config,
                    text = cfg.text||'',
                    cls = 'btn btn-block',
                    bdgAttr = '';
                if (cfg.colorMode)
                    cls += ` btn-${cfg.colorMode}`;
                if (cfg.outline)
                    cls += ' btn-outline';
                if (cfg.sizeMode)
                    cls += ` btn-${cfg.sizeMode}`;
                if (cfg.badge) {
                    let isStr = Types.isString(cfg.badge),
                    bdg = {
                        text: isStr?<string>cfg.badge:(<JsonObject>cfg.badge).text||'',
                        color: isStr?ColorMode.danger:(<JsonObject>cfg.badge).color||ColorMode.danger
                    }
                    cls += ' jsfx-badge jsfx-badge-'+bdg.color;
                    bdgAttr = ` data-badge="${bdg.text}"` 
                }
                if (cfg.dropMenu)
                    cls += ` dropdown-toggle`;

                this._eachMode('faceMode', mode => {
                    cls += ' border-' + mode;
                });

                if (cfg.cls) cls += ' ' + cfg.cls;

                let icon = '';
                if (cfg.iconCls) icon = `<i class="${cfg.iconCls}"></i>`;

                let button =
                    `<button type="button" ${cfg.style?'style="'+cfg.style+'"':''} ${cfg.disabled?'disabled':''} ${bdgAttr} title="${cfg.tip}" ${cfg.dropMenu ? 'data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"' : ''} class="${cls}" jsfx-role="main">
                ${icon}${text ? (icon ? ` ${text}` : text) : ''}</button>`;

                if (cfg.dropMenu) button = this._dropDown(button);
                this.widgetEl.html(button);
                this._mainEl = this.widgetEl.find('[jsfx-role=main]');
            }

            protected _onAfterRender() {
                this._mainEl.on('click', ()=>{
                    return this._fire<ButtonEvents>('click')
                })
            }

            private _dropDown(buttonHtml: string): string {
                let dropDown = (<ButtonConfig>this._config).dropMenu,
                    html = `
                    <div class="btn-group ${'drop' + (dropDown.dir || 'down')}">
                        ${buttonHtml}
                        <div class="dropdown-menu">
                        ${this._dropDownItems(dropDown.items)}
                        </div>
                    </div>
                `;
                return html;
            }

            private _dropDownItems(items?: Array<DropMenuItem>): string {
                if (!Types.isDefined(items)) return '';

                let html = '';
                items.forEach((item, i) => {
                    html += this._dropDownItem(item, i);
                })
                return html;
            }

            private _dropDownItem(item: DropMenuItem, index: number): string {
                let id = 'dropdown-item' + index + '-' + Random.uuid(3,10),
                    span = item.html || `${item.iconCls ? `<i class="${item.iconCls}"></i>` : ''}<span class="">${Strings.escapeHTML(item.text)}</span>`,
                    html = '';
                if (item.caption) html += `<h6 class='dropdown-header'>${Strings.escapeHTML(item.caption)}</h6>`;
                html += `<a class='dropdown-item ${this._config.colorMode} ${item.selected ? 'active' : ''}' id='${id}'  href='${item.href?encodeURI(item.href) : 'javascript:void(0);'}'>${span}</a>`;
                if (item.hasDivider) html += `<div class='dropdown-divider'></div>`;
                let me = this;
                if (item.onClick) $(document).on(<any>'click', '#' + id, function (e) {
                    return item.onClick.apply(me, [e.originalEvent, item]);
                });
                return html;
            }

            public disable() {
                this._mainEl.prop('disabled', true);
                (<ButtonConfig>this._config).disabled = true;
                return this
            }
            public enable() {
                this._mainEl.prop('disabled', false);
                (<ButtonConfig>this._config).disabled = false;
                return this
            }

            /**
             * Toggle dropdown menu
             */
            public toggle(): Button {
                let d = this._mainEl.find('.dropdown-toggle');
                if (d.length < 1) return;
                d.dropdown('toggle');
                return this;
            }

            public badge() : string
            public badge(option: string|{text:string,color?:ColorMode}) : this
            public badge(option?: string|{text:string,color?:ColorMode}) : any{
                if(arguments.length==0) {
                    return <any>this._mainEl.attr('data-badge')
                }else if(Check.isEmpty(option)) {
                    this._mainEl.removeAttr('data-badge');
                }else{
                    let isStr = Types.isString(option),
                    bdg = {
                        text: isStr?<string>option:(<JsonObject>option).text||'',
                        color: isStr?ColorMode.danger:(<JsonObject>option).color||ColorMode.danger
                    } 
                    this._mainEl.addClass('jsfx-badge jsfx-badge-'+bdg.color);
                    bdg.text?this._mainEl.attr('data-badge',bdg.text):this._mainEl.removeAttr('data-badge');
                }
                return this;
            }

        }
    }
}
import Button = JS.fx.Button;
import ButtonConfig = JS.fx.ButtonConfig;
import ButtonFaceMode = JS.fx.ButtonFaceMode;
import DropDownOptions = JS.fx.DropMenuOptions;
import DropDownItem = JS.fx.DropMenuItem;
import ButtonEvents = JS.fx.ButtonEvents;
import ButtonListeners = JS.fx.ButtonListeners;
