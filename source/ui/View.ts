/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../lang/System.ts"/>
/// <reference path="../ui/IWidget.ts"/>
/// <reference path="../util/Bom.ts"/>

module JS {

    export namespace ui {

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

        export interface ViewConfig {}

        /**
         * An View is a widgets container which initialize, render and destroy its widgets.
         */
        export abstract class View implements IComponent {
            protected _widgets: JsonObject<IWidget> = {};
            protected _model: Modelable<any>;
            protected _eventBus = new EventBus(this);
            protected _config: ViewConfig;

            public initialize() { }
            public destroy() {
                if (this._widgets) {
                    Jsons.forEach(this._widgets, w => {
                        w.destroy();
                    })
                }
            }

            public config(): ViewConfig {
                return this._config;
            }

            protected abstract _render();

            protected _fire(e: ViewEvents, args?: Array<any>) {
                return this._eventBus.fire(<any>e, args);
            }

            public render() {
                Bom.ready(() => {
                    this._fire('rendering');
                    this._render();
                    this._fire('rendered');
                })
            }

            public getModel(): Modelable<any> {
                return this._model;
            }

            public getWidget<W extends IWidget>(id: string): W {
                return <W>this._widgets[id];
            }

            public getWidgets(): JsonObject<IWidget> {
                return this._widgets;
            }

            public addWidget(wgt: IWidget): View {
                if (wgt) this._widgets[wgt.id] = wgt;
                return this;
            }

            public removeWidget(id: string): View {
                delete this._widgets[id];
                return this;
            }

            public destroyWidget(id: string): View {
                let w = this._widgets[id];
                if (!w) return this;

                w.destroy();
                delete this._widgets.id;
                return this;
            }

            public on(type: 'rendering', handler: EventHandler<this>)
            public on(type: 'rendered', handler: EventHandler<this>)
            public on(type: 'widgetiniting', handler: EventHandler2<this, string|Klass<IWidget>, ViewWidgetConfig>)
            public on(type: 'widgetinited', handler: EventHandler1<this, IWidget>)
            public on(type: 'dataupdated', handler: EventHandler2<this, any, any>)//[newVal, oldVal]
            public on(type: 'validated', handler: EventHandler2<this, ValidateResult, any>)//[result, val]
            public on(type: string, handler: EventHandler<this>) {
                this._eventBus.on(<any>type, handler);
            }
            
            /**
             * @param type 
             */
            public off(type?: string) {
                this._eventBus.off(type);
            }

            public eachWidget(fn: (w: IWidget) => void) {
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
                    klass = newConfig.klass || $1('#' + id).attr('jsfx-alias');

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
import ViewEvents = JS.ui.ViewEvents;
import ViewWidgetConfig = JS.ui.ViewWidgetConfig;
import ViewConfig = JS.ui.ViewConfig;
import View = JS.ui.View;

