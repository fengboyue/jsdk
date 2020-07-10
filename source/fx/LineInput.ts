/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="Input.ts"/>
module JS {

    export namespace fx {

        export enum LineInputFaceMode {
            square = 'square',
            round = 'round',
            pill = 'pill',
            shadow = 'shadow'
        }

        export interface LineInputIcon {
            tip?: string;
            onClick?: ((this: Input, ...args) => any); //单击回调
            cls: string;
        }

        export interface LineInputAddon {
            tip?: string;
            onClick?: ((this: Input, ...args) => any); //单击回调
            faceMode?: ButtonFaceMode | Array<ButtonFaceMode>;
            colorMode?: ColorMode;
            outline?: boolean;
            text: string;
            gradient?: {from: HEX, to: HEX};
            iconCls?: string;
            dropMenu?: DropMenuOptions;
        }

        export class LineInputConfig<T extends LineInput> extends InputConfig<T> {
            inputCls?: string = '';
            inputStyle?: string = '';
            innerIcon?: string | LineInputIcon;
            leftAddon?: string | LineInputAddon;
            rightAddon?: string | LineInputAddon;
            textAlign?: LR = 'left';
            faceMode?: LineInputFaceMode | Array<LineInputFaceMode> = LineInputFaceMode.square;
        }

        export abstract class LineInput extends Input {

            constructor(cfg: InputConfig<any>) {
                super(cfg);
            }

            private _inputAttrs(type: string = 'text'): JsonObject<string> {
                let cfg = <LineInputConfig<any>>this._config, cls = '', shape = <string>LineInputFaceMode.square;

                this._eachMode('faceMode', mode => {
                    cls += ' border-' + mode;
                    if (mode != LineInputFaceMode.shadow) shape = mode;
                });
                if (cfg.leftAddon || cfg.rightAddon) cls += ` border-${cfg.leftAddon ? 'square' : shape}-left border-${cfg.rightAddon ? 'square' : shape}-right`;

                let color = cfg.colorMode;
                if(color) cls += ` ${cfg.outline?'border':'focus'}-${color}`;

                let style = `text-align:${cfg.textAlign};${cfg.inputStyle}`;
                return {
                    'jsfx-role': 'main',
                    type: type,
                    placeholder: Strings.escapeHTML(cfg.placeholder),
                    autofocus: cfg.autofocus ? 'autofocus' : undefined,
                    readonly: cfg.readonly ? 'readonly' : undefined,
                    disabled: cfg.disabled ? 'disabled' : undefined,
                    maxlength: Number.isFinite(cfg.maxlength) && cfg.maxlength > 0 ? cfg.maxlength + '' : '',
                    style: style,
                    'class': `form-control ${cls} ${cfg.inputCls}`,
                    'data-toggle': 'tooltip',
                    'data-trigger': 'hover focus'
                }
            }

            protected _inputHtml(type: string = 'text') {
                return Strings.nodeHTML('input', this._inputAttrs(type))
            }

            private _iconHtml(icon: LineInputIcon, id: string, lr:'left'|'right'): string {
                if (!icon) return '';

                let me = this, cfg = this._config;
                if (icon.onClick) $(document).on('click', '#' + id, function (e) {
                    if (me.isEnabled()) icon.onClick.apply(me, [e.originalEvent, this])
                    return false
                });
                //for clear-icon
                let display = id.endsWith('-clear') && (this.readonly() || !this.isEnabled() || Check.isEmpty(this.value())) ? 'style="display:none;"' : '';

                return `<span id="${id}" title="${icon.tip || ''}" ${display} class="jsfx-input-icon ${lr}-icon">
                <span><i class="${icon.cls} ${cfg.colorMode?'text-'+cfg.colorMode:''}"></i></span></span>`;
            }

            private _inputGroup(type: string): string {
                let cfg = <LineInputConfig<any>>this._config,
                    cls = 'jsfx-input-div', 
                    innerIcon = Types.isString(cfg.innerIcon) ? <LineInputIcon>{ cls: <string>cfg.innerIcon } : <LineInputIcon>cfg.innerIcon,
                    clearIcon = cfg.autoclear? {
                        cls: 'fas fa-times-circle',
                        tip: 'Clear',
                        onClick: function (e, el: HTMLElement) {
                            this.clear();
                            $(el).hide();
                            return false
                        }
                    } : null,
                    leftIcon = cfg.textAlign=='right'?clearIcon:innerIcon,
                    rightIcon = cfg.textAlign=='right'?innerIcon:clearIcon;
                if (leftIcon) cls += ' left-icon';
                if (rightIcon) cls += ' right-icon';
                return `
                    <div class="${cls}">
                    ${this._inputHtml(type)}
                    ${this._iconHtml(leftIcon, this.id+'-icon'+(cfg.textAlign=='right'?'-clear':''), 'left')}
                    ${this._iconHtml(rightIcon, this.id+'-icon'+(cfg.textAlign=='right'?'':'-clear'), 'right')}
                    </div>`
            }

            protected _bodyFragment(type: string = 'text'): string {
                let cfg = <LineInputConfig<any>>this._config, cls = 'jsfx-input-group input-group font-'+(cfg.sizeMode||'md');

                return `<div class="${cls}">
                            ${cfg.leftAddon ? '<div id="' + this.id + '-btn-left" class="input-group-prepend"/>' : ''}
                            ${this._inputGroup(type)}
                            ${cfg.rightAddon ? '<div id="' + this.id + '-btn-right" class="input-group-append"/>' : ''}
                        </div>`
            }

            protected _render() {
                super._render();
                this._renderAddons();
            }

            protected _onAfterRender() {
                let cfg = (<LineInputConfig<any>>this._config);
                if (cfg.autoclear) this._mainEl.on('change input focus blur', () => {
                    if (cfg.disabled || cfg.readonly) return;
                    let clear = $('#' + this.id + '-icon-clear');
                    Check.isEmpty(this._mainEl.val()) ? clear.hide() : clear.show();
                })

                super._onAfterRender();
            }

            private _renderAddon(cfg: LineInputAddon, id: string, isLeft: boolean) {
                cfg['sizeMode'] = this._config.sizeMode || 'md';

                let fm = [];
                if (this._hasFaceMode('shadow')) fm.push('shadow');

                fm.push(ButtonFaceMode.square);
                if (this._hasFaceMode('round', cfg)) {
                    fm.push(isLeft ? ButtonFaceMode.round_left : ButtonFaceMode.round_right);
                } else if (this._hasFaceMode('round')) {
                    fm.push(isLeft ? ButtonFaceMode.round_left : ButtonFaceMode.round_right);
                } else if (this._hasFaceMode('pill', cfg)) {
                    fm.push(isLeft ? ButtonFaceMode.pill_left : ButtonFaceMode.pill_right);
                } else if (this._hasFaceMode('pill')) {
                    fm.push(isLeft ? ButtonFaceMode.pill_left : ButtonFaceMode.pill_right);
                }
                cfg.faceMode = fm;

                if (!cfg.onClick && !cfg.dropMenu) cfg['style'] = 'cursor:default;';
                cfg['id'] = id;

                cfg.colorMode = cfg.colorMode || this._config.colorMode || ColorMode.primary;
                let btn = new Button(cfg);
                if (cfg.onClick) btn.on('click', ()=>{
                    cfg.onClick.apply(this);
                });
            }

            private _toAddon(addon: string | LineInputAddon) {
                return Types.isString(addon) ? <LineInputAddon>{ text: <string>addon } : <LineInputAddon>addon;
            }
            private _renderAddons() {
                let cfg = <LineInputConfig<any>>this._config;
                if (cfg.leftAddon) this._renderAddon(this._toAddon(cfg.leftAddon), this.id + '-btn-left', true);
                if (cfg.rightAddon) this._renderAddon(this._toAddon(cfg.rightAddon), this.id + '-btn-right', false);
            }

            protected _showError(msg:string) {
                super._showError(msg);
                this._mainEl.addClass('jsfx-input-error');
                this.widgetEl.find('[jsfx-role=body]').find('.jsfx-input-icon i').addClass('text-danger');
            }
            protected _hideError() {
                super._hideError();
                this._mainEl.removeClass('jsfx-input-error');
                this.widgetEl.find('[jsfx-role=body]').find('.jsfx-input-icon i').removeClass('text-danger');
            }
            
        }
    }
}

import LineInputFaceMode = JS.fx.LineInputFaceMode;
import LineInputIcon = JS.fx.LineInputIcon;
import LineInputAddon = JS.fx.LineInputAddon;
import LineInputConfig = JS.fx.LineInputConfig;
import LineInput = JS.fx.LineInput;