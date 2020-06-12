/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path='RowsInput.ts'/>
module JS {

    export namespace fx {

        export class TextAreaConfig extends RowsInputConfig<TextArea> {
            resize?: 'auto' | 'both' | 'vertical' | 'horizontal' | 'none' = 'none';//可拉伸方向
            rows?: number = 3;
        }

        @widget('JS.fx.TextArea')
        export class TextArea extends RowsInput {

            constructor(cfg: TextAreaConfig) {
                super(cfg);
            }

            protected _bodyFragment(): string {
                let cfg = <TextAreaConfig>this._config,
                    cls = 'form-control font-' + cfg.sizeMode,
                    readonly = cfg.readonly ? ' readonly' : '',
                    autofocus = cfg.autofocus ? ' autofocus' : '',
                    max = cfg.maxlength, maxLength = max && Number.isFinite(max) ? (' maxLength=' + max) : '';

                if (cfg.colorMode) {
                    cls += ` ${cfg.outline ? 'border' : 'focus'}-${cfg.colorMode}`;
                }

                this._eachMode('faceMode', mode => {
                    cls += ' border-' + mode;
                });

                let counter = Number.isFinite(cfg.maxlength) && cfg.counter ? `
                <div style="float:${cfg.counter.place}">
                <span class="counter ${cfg.counter.cls}"></span>
                </div>
                `: '';
                return `
                    <textarea name="${this.name()}" jsfx-role="main" 
                    ${readonly}
                    ${autofocus}
                    ${maxLength}
                    style="resize:${cfg.resize}"
                    class="${cls}"
                    rows="${cfg.rows}"
                    placeholder="${cfg.placeholder}"></textarea>${counter}`
            }

            protected _renderValue() {
                let v = <string>this.value() || '';
                if (this._mainEl.val() == v) return;

                this._mainEl.val(v);
            }
            protected _onAfterRender() {
                this._mainEl.on('input change paste', () => {
                    this._setValue(this._mainEl.val())
                    this._updateCounter()
                })
                super._onAfterRender();
            }
            protected _showError(msg: string) {
                super._showError(msg);
                this._mainEl.addClass('jsfx-input-error');
            }
            protected _hideError() {
                super._hideError();
                this._mainEl.removeClass('jsfx-input-error');
            }
        }
    }
}
import TextArea = JS.fx.TextArea;
import TextAreaConfig = JS.fx.TextAreaConfig;
