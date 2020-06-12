/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="TextInput.ts"/>
module JS {

    export namespace fx {

        export class EmailInputConfig extends TextInputConfig {
            /**
             * Allows multiple email addresses
             */
            multiple?: boolean = false;
            innerIcon?: string | LineInputIcon = 'fa fa-envelope-o';
        }

        @widget('JS.fx.EmailInput')
        export class EmailInput extends TextInput {

            constructor(cfg: EmailInputConfig) {
                super(cfg);
            }

            protected _bodyFragment() {
                return super._bodyFragment('email')
            }

            protected _onAfterRender() {
                super._onAfterRender();
                this._mainEl.prop('multiple', (<EmailInputConfig>this._config).multiple)
            }

        }

    }

}
import EmailInput = JS.fx.EmailInput;
import EmailInputConfig = JS.fx.EmailInputConfig;
