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
        /**
         * @interface PasswordConfig
         * @extends TextInput
         */
        export class PasswordConfig extends TextInputConfig {
            visible?: boolean = true;
        }
        @widget('JS.fx.Password')
        export class Password extends TextInput {

            constructor(cfg: PasswordConfig) {
                super(cfg);
            }

            protected _render(): void {
                let cfg = <PasswordConfig>this._config;
                if(cfg.visible) cfg.innerIcon = {
                    cls: this.visible() ? 'fa fa-eye' : 'fa fa-eye-slash',
                    onClick: () => {
                        this.toggleVisible()
                    }
                }
                super._render();
            }

            protected _bodyFragment() {
                return super._bodyFragment('password')
            }

            private _visible = false;
            public visible(visible?: boolean): boolean {
                if (!(<PasswordConfig>this._config).visible || arguments.length == 0) return this._visible;

                this._visible = visible;
                this._mainEl.prop('type', visible ? 'text' : 'password');
                let icon = $('#' + this.id + '-icon-left').find('i');
                if (visible) {
                    icon.removeClass('fa-eye-slash').addClass('fa-eye');
                } else {
                    icon.removeClass('fa-eye').addClass('fa-eye-slash');
                }
                return visible
            }

            public toggleVisible() {
                this.visible(!this.visible());
            }
        }
    }

}
import Password = JS.fx.Password;
import PasswordConfig = JS.fx.PasswordConfig;
