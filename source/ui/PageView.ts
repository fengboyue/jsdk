/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="View.ts"/>
/// <reference path="../model/PageModel.ts"/>

module JS {
    export namespace ui {

        export interface PageViewConfig extends ViewConfig, ViewWidgetConfig {

        }

        /**
         * For a pagation widget such as Grid.
         */
        export abstract class PageView extends View {
            protected _config: PageViewConfig;
            protected _model: PageModel;

            public load(api: PageQuery) {
                return this.getWidget<IDataWidget>(this._config.id).load(api);
            }
            public reload() {
                this.getWidget<IDataWidget>(this._config.id).reload();
                return this
            }

            protected _render() {
                if (this._config) {
                    this._fire('widgetiniting', [this._config.klass, this._config]);
                    let wgt = Class.aliasInstance<IDataWidget>(this._config.klass, this._config);
                    this._fire('widgetinited', [wgt]);
                    
                    this._model = <PageModel>wgt.dataModel();
                    this._model.on('dataupdated', (e, data: JsonObject[]) => {
                        this._fire('dataupdated', [data]);
                    });
                    this.addWidget(wgt);
                }
            }

        }
    }
}

import PageViewConfig = JS.ui.PageViewConfig;
import PageView = JS.ui.PageView;