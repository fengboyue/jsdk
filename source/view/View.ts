/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../lang/System.ts"/>
/// <reference path="../util/Bom.ts"/>
/// <reference path="../ui/IWidget.ts"/>

module JS {

    export namespace view {

        export interface ViewWidgetConfig extends IWidgetConfig {
            /**
             * The dom id of this widget.
             */
            id?: string;
            /**
             * The type of this widget.
             */
            klass?: string | Klass<IWidget>
        }

        
        export type ViewEvents ='rendering'|'rendered'|'widgetiniting'|'widgetinited'|'dataupdated'|'validated';

        export interface ViewConfig {
            defaultConfig?: IWidgetConfig;            
            widgetConfigs?: JsonObject<ViewWidgetConfig|IWidgetConfig>;
        }

        /**
         * An View is a widgets container which initialize, render and destroy its widgets.
         */
        export abstract class View implements ICompo {
            protected _widgets: JsonObject<IWidget> = {};
            protected _model: Modelable<any>;
            protected _eventBus = new EventBus(this);
            protected _config: ViewConfig;

            static WIDGET_ATTRIBUTE = 'js-wgt';

            initialize() { }
            destroy() {
                if (this._widgets) {
                    Jsons.forEach(this._widgets, w => {
                        w.destroy();
                    })
                }
            }

            config(): ViewConfig {
                return this._config;
            }

            protected abstract _render();

            protected _fire(e: ViewEvents, args?: Array<any>) {
                return this._eventBus.fire(<any>e, args);
            }

            render() {
                Bom.ready(() => {
                    this._fire('rendering');
                    this._render();
                    this._fire('rendered');
                })
            }

            getModel(): Modelable<any> {
                return this._model;
            }

            getWidget<W extends IWidget>(id: string): W {
                return <W>this._widgets[id];
            }

            getWidgets(): JsonObject<IWidget> {
                return this._widgets;
            }

            addWidget(wgt: IWidget): View {
                if (wgt) this._widgets[wgt.id] = wgt;
                return this;
            }

            removeWidget(id: string): View {
                delete this._widgets[id];
                return this;
            }

            destroyWidget(id: string): View {
                let w = this._widgets[id];
                if (!w) return this;

                w.destroy();
                delete this._widgets.id;
                return this;
            }

            on(type: 'rendering', handler: EventHandler<this>)
            on(type: 'rendered', handler: EventHandler<this>)
            on(type: 'widgetiniting', handler: EventHandler2<this, string|Klass<IWidget>, ViewWidgetConfig>)
            on(type: 'widgetinited', handler: EventHandler1<this, IWidget>)
            on(type: 'dataupdated', handler: EventHandler2<this, any, any>)//[newVal, oldVal]
            on(type: 'validated', handler: EventHandler2<this, ValidateResult, any>)//[result, val]
            on(type: string, handler: EventHandler<this>) {
                this._eventBus.on(<any>type, handler);
            }
            
            /**
             * @param type 
             */
            off(type?: string) {
                this._eventBus.off(type);
            }

            eachWidget(fn: (w: IWidget) => void) {
                Jsons.forEach(this._widgets, (w: IWidget) => {
                    fn.apply(this, [w])
                })
            }

            protected _newWidget<T extends IWidget>(id: string, cfg: ViewWidgetConfig | IWidgetConfig, defaults: IWidgetConfig): T {
                if (!id) {
                    JSLogger.error('The widget\'s id was empty when be inited!');
                    return null
                }

                let vconfig: ViewWidgetConfig = cfg,
                    newConfig: ViewWidgetConfig = Jsons.union(defaults, vconfig, { id: id }),
                    klass = newConfig.klass || $1('#' + id).attr(View.WIDGET_ATTRIBUTE);

                if (!klass) {
                    JSLogger.error(`The widget<${id}> was not configured for its klass type!`);
                    return null
                }
                this._fire('widgetiniting', [klass, newConfig]);
                let wgt = Class.aliasInstance<T>(klass, newConfig);
                this._fire('widgetinited', [wgt]);
                return wgt
            }
        }

    }

}
import ViewEvents = JS.view.ViewEvents;
import ViewWidgetConfig = JS.view.ViewWidgetConfig;
import ViewConfig = JS.view.ViewConfig;
import View = JS.view.View;

