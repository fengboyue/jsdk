/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path='Input.ts'/>
module JS {

    export namespace fx {

        export enum RowsInputFaceMode {
            square = 'square',
            round = 'round',
            shadow = 'shadow'
        }

        export interface RowsInputCounterOptions {
            tpl?: string;
            place?: 'left' | 'right';
            cls?: string;
        }

        export class RowsInputConfig<T extends RowsInput> extends InputConfig<T> {
            counter?: false|RowsInputCounterOptions = {
                tpl: '{length}/{maxLength}',
                place: 'right',
                cls: ''
            };
            iniValue?: string;
            faceMode?: RowsInputFaceMode | RowsInputFaceMode[] = RowsInputFaceMode.square;
        }

        export abstract class RowsInput extends Input {

            constructor(cfg: RowsInputConfig<RowsInput>) {
                super(cfg);
            }

            public value(): string
            public value(val: string, silent?: boolean): this
            public value(val?: string, silent?: boolean): any {
                if (arguments.length == 0) return super.value();
                return super.value(val, silent)
            }

            private _counterHtml() {
                let cfg = <RowsInputConfig<any>>this._config;
                if (!cfg.counter || !cfg.counter.tpl) return '';
                let max = cfg.maxlength;
                if (!max || !Number.isFinite(max)) return '';

                let v = this.value()||'', len = v.length;
                return Strings.merge(cfg.counter.tpl, {
                    length: len,
                    maxLength: max
                })
            }

            protected _updateCounter() {
                let cfg = <RowsInputConfig<any>>this._config;
                if (!cfg.counter) return;

                let counter = this.widgetEl.find('.counter');
                counter.off().empty().html(this._counterHtml());

                if(!cfg.autoValidate) return;
                let v = this.value(), len = v ? v.length : 0, max = this.maxlength();
                len > max ? this._showError('') : this._hideError();
            }

            protected _setValue(val, silent?: boolean) {
                super._setValue(val, silent);
                this._updateCounter();
            }

            protected _showError(msg:string) {
                super._showError(msg);
                this.widgetEl.find('.counter').addClass('error');
            }
            protected _hideError() {
                super._hideError();
                this.widgetEl.find('.counter').removeClass('error');
            }
        }


    }
}
import RowsInput = JS.fx.RowsInput;
import RowsInputConfig = JS.fx.RowsInputConfig;
import RowsInputFaceMode = JS.fx.RowsInputFaceMode;
