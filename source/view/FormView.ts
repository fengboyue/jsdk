/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="View.ts"/>

module JS {
    export namespace view {

        let J = Jsons;

        export interface FormViewConfig extends ViewConfig {
            valueModel?: Klass<Model>;
        }

        /**
         * For form widgets.
         */
        export class FormView extends View {
            protected _config: FormViewConfig;
            protected _model: Model;

            /**
             * 重置每个IWidget的值
             */
            public reset() {
                this.eachWidget((w: IValueWidget) => {
                    if (w.reset) w.reset();
                })
                return this
            }

            /**
             * Clear all widgets.
             */
            public clear() {
                this.eachWidget((w: IValueWidget) => {
                    if(w.clear) w.clear();
                })
                return this
            }

            /**
             * Read ini-values of all widgets or Write ini-values of designative widgets.
             */
            public iniValues(): JsonObject<any>
            public iniValues(values: JsonObject<any>, render?:boolean): this
            public iniValues(values?: JsonObject<any>, render?:boolean): any {
                let T = this;
                if (arguments.length == 0) {
                    let vals = {};
                    T.eachWidget((w: IValueWidget) => {
                        if(w.iniValue) vals[w.id] = w.iniValue();
                    })
                    return vals;
                } else {
                    if (values) {
                        J.forEach(values, (val: any, id: string) => {
                            let w = <IValueWidget>T._widgets[id];
                            if (w && w.iniValue) w.iniValue(val, render);
                        })
                    } else {
                        T.eachWidget((w: IValueWidget) => {
                            if(w.iniValue) w.iniValue(null, render);
                        })
                    }
                }
                return T
            }

            /**
             * True when all widgets are right.
             */
            public validate(id?: string): boolean {
                let T = this, wgts = T._widgets;
                if (Check.isEmpty(wgts)) return true;

                if (!id) {
                    let ok = true;
                    J.forEach(wgts, (wgt: IValueWidget) => {
                        if (T._validateWidget(wgt) !== true) ok = false;
                    })
                    return ok
                }
                return T._validateWidget(<any>T._widgets[id]);
            }

            /**
             * 校验某个id的IWidget。正确则返回True；错误则自动显示错误信息。
             */
            private _validateWidget(wgt: IValueWidget): boolean {
                if (!wgt || !wgt.validate) return true;
                return wgt.validate() === true;
            }

            public getModel(): Model {
                return this._model;
            }
            /**
             * Read values of all widgets or Write values of designative widgets.
             */
            public values(): JsonObject
            public values(values: any): this
            public values(values?: any): any {
                if (arguments.length == 1) {
                    this._model.setData(values);
                    return this
                } else {
                    let d = {};
                    this.eachWidget(w => {
                        if((<any>w).value && (<any>w).isEnabled()) {
                            d[w.name()] = 
                            (<any>w).isCrud && (<any>w).isCrud()?(<any>w).crudValue():(<any>w).value()
                        }
                    })
                    return d;
                }
            }

            protected _render() {
                let T = this;
                if (T._config) {
                    let cfg = T._config;
                    J.forEach(cfg.widgetConfigs, (config: ViewWidgetConfig, id: string) => {
                        config['valueModel'] = T._model || T._config.valueModel;
                        let wgt = T._newWidget(id, config, cfg.defaultConfig);
                        if (wgt && (<IValueWidget>wgt).valueModel && !T._model) T._model = (<IValueWidget>wgt).valueModel();
                        T.addWidget(wgt);
                    })

                    if (T._model) {
                        T._model.on('validated', (e, result, data) => {
                            T._fire('validated', [result, data]);
                        });
                        T._model.on('dataupdated', (e, newData, oldData) => {
                            T._fire('dataupdated', [newData, oldData]);
                        });
                    }
                }
            }
        }

    }
}
import FormView = JS.view.FormView;
import FormViewConfig = JS.view.FormViewConfig;