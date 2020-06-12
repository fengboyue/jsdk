/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="View.ts"/>
/// <reference path="../util/Templator.ts"/>

module JS {
    export namespace ui {

        export interface TemplateViewConfig extends ViewConfig {
            /**
             * The dom element of this view.
             */
            container: string | HTMLElement;
            /**
             * The template html for rendering.
             */
            tpl: string;
            /**
             * The json data for rendering.
             */
            data?: any;
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
         * An TemplateView is a widgets container rendering with Templator.
         */
        export abstract class TemplateView extends View {
            protected _config: TemplateViewConfig;
            protected _engine: Templator;
            protected _model = new ListModel();

            public initialize() {
                this._engine = new Templator();
                let me = this;
                this._model.on('dataupdated', function (e, newData, oldData) {
                    me._config.data = this.getData();
                    me.render();
                    me._fire('dataupdated', [newData, oldData]);
                });
            }

            public data(data: any) {
                this._model.setData(data);
            }

            public load(api: string | AjaxRequest) {
                return this._model.load(api);
            }

            protected _render() {
                let cfg = this._config;
                if (cfg && cfg.data && cfg.container && cfg.tpl) {
                    let html = this._engine.compile(cfg.tpl)(cfg.data), ctr = $1(cfg.container);
                    ctr.off().html('').html(html);

                    let wConfigs = cfg.widgetConfigs;
                    if (!Check.isEmpty(wConfigs)) ctr.findAll('[jsfx-alias]').forEach((el: HTMLElement) => {
                        let realId = $1(el).attr('id'),
                            prefixId = realId.replace(/(\d)*/g, '');
                        this.addWidget(this._newWidget(realId, wConfigs[prefixId], cfg.defaultConfig))
                    })
                }
            }
        }
    }
}
import TemplateViewConfig = JS.ui.TemplateViewConfig;
import TemplateView = JS.ui.TemplateView;