/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path='LineInput.ts'/>

module JS {

    export namespace fx {

        export class TextInputConfig extends LineInputConfig<TextInput>{}
        
        @widget('JS.fx.TextInput')
        export class TextInput extends LineInput {

            constructor(cfg:TextInputConfig){
                super(cfg)
            }

            public value(): string
            public value(val: string, silent?: boolean): this
            public value(val?: string, silent?: boolean): any {
                if(arguments.length==0) return super.value();
                return super.value(val, silent)
            }

            protected _onAfterRender(){
                this._mainEl.off('input change paste').on('input change paste', ()=>{
                    this._setValue(this._mainEl.val())
                })
                super._onAfterRender()
            }

        }

    }
}
import TextInput = JS.fx.TextInput;
import TextInputConfig = JS.fx.TextInputConfig;
