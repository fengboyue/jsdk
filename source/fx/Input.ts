/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
module JS {

    export namespace fx {

        export type InputEvents = FormWidgetEvents;
        export interface InputListeners<T extends Input> extends FormWidgetListeners<T> {};

        export class InputConfig<T extends Input> extends FormWidgetConfig<T> {
            inputCls?: string = '';
            inputStyle?: string = '';
            maxlength?: number = Infinity;
            placeholder?: string = '';
            autoclear?: boolean = true;
            autofocus?: boolean = false;
            outline?: boolean = false;
            listeners?: InputListeners<T>;
        }

        export abstract class Input extends FormWidget {

            constructor(cfg: InputConfig<any>) {
                super(cfg);
            }

            public maxlength(): number
            public maxlength(len: number): this
            public maxlength(len?: number): any {
                if (arguments.length == 0) return (<InputConfig<any>>this._config).maxlength;
                this._mainEl.prop('maxlength', len);
                (<InputConfig<any>>this._config).maxlength = len;
                return this;
            }

            /**
             * @method placeholder 
             * @param? {string} text
             */
            public placeholder(): string
            public placeholder(holder: string): this
            public placeholder(holder?: string): any {
                if (arguments.length == 0) return (<InputConfig<any>>this._config).placeholder;

                holder = holder || '';
                (<InputConfig<any>>this._config).placeholder = holder;
                this._mainEl.attr('placeholder', holder);
                return this;
            }

            
        }
    }
}

import InputEvents = JS.fx.InputEvents;
import InputListeners = JS.fx.InputListeners;
import InputConfig = JS.fx.InputConfig;
import Input = JS.fx.Input;