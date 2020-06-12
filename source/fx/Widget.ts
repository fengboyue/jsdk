/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="Base.ts"/>

module JS {

    export namespace fx {

        @klass('JS.fx.Widget')
        export abstract class Widget implements IWidget {

            public readonly id: string;
            public widgetEl: JQuery<HTMLElement>;/** 组件DOM对象 */

            protected _eventBus: EventBus;
            protected _config: WidgetConfig<Widget> = null;//当前配置
            protected _initialConfig: WidgetConfig<Widget> = null;//初始配置

            constructor(cfg: WidgetConfig<Widget>) {
                if(!cfg.id && cfg.renderTo) {
                    let wgt = $(cfg.renderTo);
                    if(wgt.length==1) {
                        this.widgetEl = wgt;
                        let id = wgt.attr('id');
                        if(id){
                            this.id = id
                        }else{
                            this.id = Random.uuid(4,10).toString();
                            wgt.attr('id', this.id);
                        }
                    }
                }else{
                    this.id = cfg.id || Random.uuid(4,10).toString();
                }
                
                this._initConfig(cfg);
                this._onBeforeInit();
                this._initDom();
                this._onAfterInit();
            }

            /**
             * 在父类构造函数中的初始化之前，由子类重载实现
             */
            protected _onBeforeInit() { }
            /**
             * 在父类构造函数中的初始化之后，由子类重载实现
             */
            protected _onAfterInit() { }

            /**
             * 初始化DOM
             */
            protected _initDom(): void {
                let cfg = this._config;
                this.widgetEl = $('#'+this.id);

                if (this.widgetEl.length == 0) {
                    this.widgetEl = $('<div />', {
                        id: this.id,
                        width: cfg.width,
                        height: cfg.height,
                        title: cfg.tip,
                        style: cfg.style,
                        'klass-name': this.className
                    }).appendTo(cfg.appendTo||'body');
                }else{
                    let attrs = {};
                    if (cfg.tip) attrs['title'] = cfg.tip;
                    if (cfg.style) attrs['style'] = (this.widgetEl.attr('style') || '') + cfg.style;
                    if(!Check.isEmpty(attrs)) this.widgetEl.attr(attrs);
                    if (cfg.width) this.widgetEl.css('width', cfg.width);
                }
                    
                this._eventBus = new EventBus(this);

                //监听渲染事件
                let listeners = cfg.listeners;
                if (listeners && listeners.rendering) this.on('rendering', listeners.rendering);
                this.render();
            }

            private _initConfig(cfg: WidgetConfig<Widget>) {
                let defaultCfg = Class.newInstance<WidgetConfig<Widget>>(this.className + 'Config');
                cfg.name = cfg.name||this.id;
                this._config = Jsons.union(defaultCfg, cfg);
                this._initialConfig = Jsons.clone(this._config);
            }
            public initialConfig<V>(key?: string): V {
                return <V>Jsons.clone(key ? this._initialConfig[key] : this._initialConfig);
            }

            protected _onBeforeRender() { }
            protected _onAfterRender() { }

            public render<T extends Widget>(): T {
                this._onBeforeRender();
                this._fire('rendering');
                //渲染前注销所有事件监听
                this.off();
                this.widgetEl.off().empty();
                //添加组件缺省样式
                let cfg = this._config;
                this.widgetEl.addClass(`jsfx-${(<Object>this).getClass().shortName.toLowerCase()} ${cfg.colorMode?'color-'+cfg.colorMode:''} size-${cfg.sizeMode} ${cfg.cls||''}`);
                let is = this._render();
                
                //渲染后重新注册事件监听
                let lts = cfg.listeners || {};
                Jsons.forEach(<any>lts, function (handler: EventHandler<Widget>, type: string) {
                    if (handler) this.on(type, handler);
                }, this);
                this._onAfterRender();
                if (is !== false) this._fire('rendered');
                return <any>this;
            }
            /**
             * 渲染DOM（不触发事件）
             * 返回false表示异步渲染
             */
            protected abstract _render(): void | false

            /**
             * 返回控件name属性
             */
            public name() {
                return this._config.name||'';
            }

            /**
             * 是否包含指定模式
             * @param key 模式键值
             * @param type 模式类型
             */
            protected _hasFaceMode(key: string, cfg?: WidgetConfig<Widget>): boolean {
                cfg = cfg || this._config;
                let t:any = cfg.faceMode;
                if (!t) return false;

                return t == key || t[key] === true || $.inArray(key, t) != -1;
            }

            /**
             * 按指定模式类型渲染
             * @param type 模式类型
             * @param fn 渲染函数
             */
            protected _eachMode(type: 'sizeMode' | 'colorMode' | 'faceMode', fn: (this: Widget, mode: string) => void, cfg?: WidgetConfig<Widget>) {
                cfg = cfg || this._config;
                let mode = cfg[type];
                if (!mode) return;

                let me = this;
                if (Types.isArray(mode)) {
                    (<string[]>mode).forEach(m => {
                        fn.apply(this, [m])
                    });
                } else {
                    fn.apply(me, [mode])
                }
            }

            private _isD = false;
            public destroy(): void {
                this._fire('destroying');
                this._destroy();
                this._fire('destroyed');
            }
            protected _destroy(): void {
                this.off();
                this.widgetEl.remove();
                this._eventBus.destroy();
                this._isD = true;
            }

            public show() {
                this._fire('showing');
                this.widgetEl.css('display', '');
                this._fire('shown');
                return this
            }
            public hide() {
                this._fire('hiding');
                this.widgetEl.css('display', 'none');
                this._fire('hidden');
                return this
            }
            public isShown(): boolean {
                return this.widgetEl.css('display') != 'none'
            }

            public on<H = EventHandler<this>>(types: string, fn: H, once?:boolean) {
                this._eventBus.on(types, fn, once);
                return this
            }
            public off(types?: string) {
                this._eventBus.off(types);
                return this;
            }
            protected _fire<E>(e: E, args?: Array<any>) {
                return this._eventBus.fire(<any>e, args);
            }

            public static I18N: Resource = null;
            private _i18nBundle: Bundle = null;
            private _createBundle() {
                let defaults = new Bundle((<Object>this).getClass().getKlass<Widget>()['I18N'], this._config.locale);
                if(!this._config.i18n) return defaults;
                let b = new Bundle(this._config.i18n, this._config.locale);
                return defaults? defaults.set(Jsons.union(defaults.get(), b.get())):b
            }
            
            protected _i18n(): JsonObject
            protected _i18n<T>(key: string): T
            protected _i18n(key?: string): any {
                if (!this._i18nBundle) this._i18nBundle = this._createBundle();
                return this._i18nBundle? this._i18nBundle.get(<any>key) : undefined;
            }

            public locale(): string
            public locale(locale: string): this
            public locale(locale?: string): any {
                if (arguments.length == 0) return this._config.locale;

                this._config.locale = locale;
                if (locale !== this._config.locale) this._i18nBundle = this._createBundle();
                return this
            }

        }

    }

}
import Widget = JS.fx.Widget;
