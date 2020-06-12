/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="LineInput.ts"/>
module JS {

    export namespace fx {

        export class NumberInputConfig extends LineInputConfig<NumberInput> {

            min?: number = -Infinity;

            max?: number = Infinity;

            step?: number = 1;
            
            iniValue?: number = 0;

            //小数位精度
            fractionDigits?: number = Infinity;

            textAlign?: 'left'|'right' = 'right';
        }
        @widget('JS.fx.NumberInput')
        export class NumberInput extends LineInput {

            constructor(cfg: NumberInputConfig) {
                super(cfg);
            }
            
            protected _onAfterRender() {
                let cfg = <NumberInputConfig>this._config;
                this.min(cfg.min);
                this.max(cfg.max);
                this.step(cfg.step);

                this._mainEl.off('input change paste').on('input change paste', ()=>{
                    this._setValue(this._mainEl.val())
                })
                super._onAfterRender();
            }

            protected _bodyFragment() {
                return super._bodyFragment('number')
            }

            public min(min?: number): number {
                let cfg = <NumberInputConfig>this._config;
                if (arguments.length == 0) return cfg.min;

                if (!Number.isFinite(min)) return;
                if (min > this.max()) throw new Errors.RangeError('The min value greater than max value!');

                cfg.min = min;
                this._mainEl.prop('min', cfg.min);
                return cfg.min
            }
            public max(max?: number): number {
                let cfg = <NumberInputConfig>this._config;
                if (arguments.length == 0) return cfg.max;

                if (!Number.isFinite(max)) return;
                if (max < this.min()) throw new Errors.RangeError('The max value less than min value!');

                cfg.max = max;
                this._mainEl.prop('max', cfg.max);
                return cfg.max
            }
            public step(st?: number): number {
                let cfg = <NumberInputConfig>this._config;
                if (arguments.length == 0) return cfg.step;
                
                cfg.step = st;
                this._mainEl.prop('step', cfg.step);
                return cfg.step
            }

            public value(): number
            public value(val: number, silent?: boolean): this
            public value(val?: number, silent?: boolean): any {
                let cfg = <NumberInputConfig>this._config;
                if (arguments.length == 0) return super.value();

                let v = val==void 0?null:Math.min(Math.max(Number(val), cfg.min), cfg.max);
                return super.value(v==null?null:v.round(cfg.fractionDigits), silent)
            }

            protected _renderValue() {
                let cfg = <NumberInputConfig>this._config,
                v = this.value();

                if(v==null) {
                    this._mainEl.val('');
                }else{
                    let s = v.format(cfg.fractionDigits);
                    if (this._mainEl.val() !== s)
                        this._mainEl.val(s);
                }
            }

        }
    }
}
import NumberInput = JS.fx.NumberInput;
import NumberInputConfig = JS.fx.NumberInputConfig;

