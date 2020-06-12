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

        export enum SwitchFaceMode {
            shadow = 'shadow'
        }

        export class SwitchConfig extends FormWidgetConfig<Switch> {

            iniValue?: 'on'|'off' = 'off'; 
            faceMode?: SwitchFaceMode;
            listeners?: SwitchListeners;
        }
        
        export type SwitchEvents = FormWidgetEvents|'on'|'off';

        export interface SwitchListeners extends FormWidgetListeners<Switch> {
            on?: EventHandler<Switch>;
            off?: EventHandler<Switch>;
        }

        @widget('JS.fx.Switch')
        export class Switch extends FormWidget {

            /**
             * @constructor
             * @param {SwitchConfig} config
             */
            constructor(config: SwitchConfig) {
                super(config);
            }

            protected _onAfterRender(){
                let me = this;
                this._mainEl.on('change',  function() {
                    let is = $(this).is(':checked');
                    me._setValue(is?'on':'off');
                    me._fire(is?'on':'off');
                });
                super._onAfterRender()
            }

            protected _bodyFragment(){
                let cls = '', cfg = <SwitchConfig>this._config;
                if(this._hasFaceMode(SwitchFaceMode.shadow)) cls+= ' border-shadow';

                return `<input name="${this.name()}" jsfx-role="main" type="checkbox" class="${cls}" ${cfg.readonly ? 'readonly' : ''}/>`
            }

            public value(): 'on'|'off'
            public value(val: 'on'|'off', silent?: boolean): this
            public value(val?: 'on'|'off', silent?: boolean): any {
                if(arguments.length==0) return super.value()||'off';
                return super.value(val, silent)
            }

            public _renderValue(){
                this._mainEl.prop('checked', this.value()=='on');
            }

            public toggle() {
                let v = this.value();
                return this.value(v=='on'?'off':'on')
            }

        }

    }

}
import Switch = JS.fx.Switch;
import SwitchFaceMode = JS.fx.SwitchFaceMode;
import SwitchEvents = JS.fx.SwitchEvents;
import SwitchConfig = JS.fx.SwitchConfig;