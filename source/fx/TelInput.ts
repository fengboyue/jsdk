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

        export class TelInputConfig extends LineInputConfig<TelInput> {
            innerIcon?: string | LineInputIcon = 'fa fa-mobile';
        }

        @widget('JS.fx.TelInput')
        export class TelInput extends TextInput {

            /**
             * @constructor
             */
            constructor(cfg: TelInputConfig) {
                super(cfg);
            }

            protected _bodyFragment() {
                return super._bodyFragment('tel')
            }
        }

    }

}
import TelInput = JS.fx.TelInput;
import TelInputConfig = JS.fx.TelInputConfig;
