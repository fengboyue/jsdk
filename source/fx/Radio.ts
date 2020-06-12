/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="Choice.ts"/>
module JS {

    export namespace fx {

        export class RadioConfig extends ChoiceConfig<Radio>{
            iniValue?: string;
            faceMode?: RadioFaceMode | Array<RadioFaceMode> = RadioFaceMode.inline;
        } 

        export enum RadioFaceMode {
            dot = 'dot',
            ring = 'ring',
            inline = 'inline',
            list = 'list'
        }

        @widget('JS.fx.Radio')
        export class Radio extends Choice {

            protected _getDomValue() {
                return <string>this.widgetEl.find('input:checked').val()
            }
            protected _setDomValue(v: string) {
                v?this.widgetEl.find(`input[value=${v}]`).prop('checked', true):this.widgetEl.find('input').prop('checked', false);
            }

            constructor(cfg: RadioConfig) {
                super(cfg);
            }

            public value(): string
            public value(val: string, silent?: boolean): this
            public value(val?: string, silent?: boolean): any {
                if(arguments.length==0) return super.value();
                return super.value(val, silent)
            }

            protected _renderData(){
                super._renderData('radio');
            }

            public select(val?: string ) {
                return this.value(val)
            }
            public unselect() {
                return this.value(null)
            }
        }

    }

}
import RadioConfig = JS.fx.RadioConfig;
import RadioFaceMode = JS.fx.RadioFaceMode;
import Radio = JS.fx.Radio;
