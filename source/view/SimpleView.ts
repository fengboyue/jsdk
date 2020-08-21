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

        export interface SimpleViewConfig extends ViewConfig {}
        /**
         * For simple widgets without data-model.
         * 适合放置一组不需要DataModel的widgets
         */
        export class SimpleView extends View {
            protected _config: SimpleViewConfig;

            protected _render() {
                if (this._config) {
                    let cfg = this._config;
                    Jsons.forEach(cfg.widgetConfigs, (config: ViewWidgetConfig, id: string) => {
                        this.addWidget(this._newWidget(id,config,cfg.defaultConfig));
                    })
                }
            }
        }
    }
}
import SimpleViewConfig = JS.view.SimpleViewConfig;
import SimpleView = JS.view.SimpleView;