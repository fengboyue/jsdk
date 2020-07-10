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

        export interface FormViewConfig extends ViewConfig {
            valueModel?: Klass<Model>;
             /**
             * The common config for all widgets.
             */
            defaultConfig?: IWidgetConfig;
            /**
             * Each widget's config.
             */
            widgetConfigs?: JsonObject<ViewWidgetConfig | IWidgetConfig>;
        }

        /**
         * For form widgets.
         */
        export abstract class FormView extends View {
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
                if (arguments.length == 0) {
                    let vals = {};
                    this.eachWidget((w: IValueWidget) => {
                        if(w.iniValue) vals[w.id] = w.iniValue();
                    })
                    return vals;
                } else {
                    if (values) {
                        Jsons.forEach(values, (val: any, id: string) => {
                            let w = <IValueWidget>this._widgets[id];
                            if (w && w.iniValue) w.iniValue(val, render);
                        })
                    } else {
                        this.eachWidget((w: IValueWidget) => {
                            if(w.iniValue) w.iniValue(null, render);
                        })
                    }
                }
                return this
            }

            /**
             * True when all widgets are right.
             */
            public validate(id?: string): boolean {
                let wgts = this._widgets;
                if (Check.isEmpty(wgts)) return true;

                if (!id) {
                    let ok = true;
                    Jsons.forEach(wgts, (wgt: IValueWidget) => {
                        if (this._validateWidget(wgt) !== true) ok = false;
                    })
                    return ok
                }
                return this._validateWidget(<any>this._widgets[id]);
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
                if (this._config) {
                    let cfg = this._config;
                    Jsons.forEach(cfg.widgetConfigs, (config: ViewWidgetConfig, id: string) => {
                        config['valueModel'] = this._model || this._config.valueModel;
                        let wgt = this._newWidget(id, config, cfg.defaultConfig);
                        if (wgt && (<IValueWidget>wgt).valueModel && !this._model) this._model = (<IValueWidget>wgt).valueModel();
                        this.addWidget(wgt);
                    })

                    if (this._model) {
                        this._model.on('validated', (e, result, data) => {
                            this._fire('validated', [result, data]);
                        });
                        this._model.on('dataupdated', (e, newData, oldData) => {
                            this._fire('dataupdated', [newData, oldData]);
                        });
                    }
                }
            }
        }

    }
}
import FormView = JS.view.FormView;
import FormViewConfig = JS.view.FormViewConfig;