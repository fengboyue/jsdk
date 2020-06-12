/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="FormWidget.ts"/>
/// <reference path="Choice.ts"/>

module JS {

    export namespace fx {

        export class CheckboxConfig extends ChoiceConfig<Checkbox> {
            iniValue?: Array<string>;
            faceMode?: CheckboxFaceMode | Array<CheckboxFaceMode> = CheckboxFaceMode.inline;
        }

        export enum CheckboxFaceMode {
            square = 'square',
            round = 'round',
            inline = 'inline',
            list = 'list'
        }

        @widget('JS.fx.Checkbox')
        export class Checkbox extends Choice {

            protected _getDomValue():string[] {
                let v = [], els = this.widgetEl.find('input:checked');
                els.each((i, el) => {
                    v.push($(el).val())
                })
                return v;
            }
            protected _setDomValue(v: String[]) {
                this.widgetEl.find('input').each((i, el) => {
                    let n = $(el);
                    n.prop('checked', !Check.isEmpty(v) && v.findIndex(it=>{return it==n.val()}) > -1 ? true : false);
                })
            }

            constructor(cfg: CheckboxConfig) {
                super(cfg);
            }

            protected _equalValues(newVal: Array<string>, oldVal: Array<string>): boolean {
                return Arrays.same(newVal, oldVal)
            }

            protected _renderData() {
                super._renderData('checkbox')
            }

            public value(): Array<string>
            public value(val: Array<string>, silent?: boolean): this
            public value(val?: Array<string>, silent?: boolean): any {
                if(arguments.length==0) return super.value();
                return super.value(val||[], silent)
            }

            public select(val?: string | Array<string>) {
                if (Check.isEmpty(val)) {
                    let v = [], els = this.widgetEl.find('input:checkbox');
                    els.each((i, el) => {
                        v.push($(el).val())
                    })
                    this._setDomValue(v);
                } else {
                    this.unselect();
                    let oldVal = this.value() || [], addVal = Arrays.toArray(val);
                    addVal.forEach(v => {
                        if (oldVal.findIndex(it=>{return it==v}) == -1) oldVal.push(v)
                    })
                    this.value(oldVal);
                }
                return this
            }
            public unselect(val?: string | Array<string>) {
                if (!val) {
                    this.value(null)
                } else {
                    let oldVal = this.value() || [], delVal = Arrays.toArray(val);
                    delVal.forEach(v => {
                        oldVal.remove(it=>{
                            return it==v
                        })
                    })
                    this.value(oldVal);
                }
                return this
            }
        }

    }

}
import CheckboxConfig = JS.fx.CheckboxConfig;
import CheckboxFaceMode = JS.fx.CheckboxFaceMode;
import Checkbox = JS.fx.Checkbox;