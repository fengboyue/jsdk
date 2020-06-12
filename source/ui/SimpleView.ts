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
    export namespace ui {

        export interface SimpleViewConfig extends ViewConfig {
            defaultConfig?: IWidgetConfig;            
            widgetConfigs?: JsonObject<ViewWidgetConfig|IWidgetConfig>;
        }
        /**
         * For simple widgets without data-model.
         * 适合放置一组不需要DataModel的widgets
         */
        export abstract class SimpleView extends View {
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
import SimpleViewConfig = JS.ui.SimpleViewConfig;
import SimpleView = JS.ui.SimpleView;