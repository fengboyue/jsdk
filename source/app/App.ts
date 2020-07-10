/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../lang/System.ts"/>
/// <reference path="../view/View.ts"/>
/// <reference path="Page.ts"/>

module JS {

    export namespace model {

        /**
         * Application-level Event broadcasts to all pages of the app.
         * 应用级事件，广播到该应用的所有页面
         */
        export class AppEvent extends CustomEvent<any> {
            public url: string;
            
            constructor(type: string, initDict?:any){
                super(type, initDict)
            }
        }

        /**
         * Application's settings
         * 应用的设置
         */
        export type AppSettings = {
            /**
             * Application's name
             * 应用名称
             */
            name: string,
            /**
             * Application's version: {x}.{y}.{z}
             * 版本号: {x}.{y}.{z}
             */
            version?: string,
            /**
             * Log level
             * 日志级别
             */
            logLevel?: LogLevel,
            /**
             * Custom global options
             * 自定义全局配置
             */
            properties?: JsonObject
        }

        /**
         * Application Class
         * 应用主类
         */
        export class App {

            private static _sets: AppSettings;
            private static _logger: Log;

            /**
             * Application needs to be initialized first. 
             * 应用需要先初始化
             * @param settings 
             */
            public static init(settings: AppSettings) {
                this._sets = settings;
                this._sets.properties = this._sets.properties || {};
                this._logger = new Log(this.namespace(), settings.logLevel || LogLevel.INFO);
            }

            /**
             * Application's namespace: {appName}/{appVersion}
             * 应用的名称空间：{应用名}/{版本号}
             */
            public static namespace() {
                return this._sets.name + '/' + this.version()
            }
            /**
             * Application's name
             * 应用名称
             */
            public static appName() {
                return this._sets.name
            }
            /**
             * Application's version: {x}.{y}.{z}
             * 版本号: {x}.{y}.{z}
             */
            public static version() {
                return this._sets.version
            }
            /**
             * Returns the logger of application.
             * 返回应用的日志类
             */
            public static logger() {
                return this._logger
            }
            /**
             * Read the global options.
             * 读取所有自定义配置
             */
            public static properties(): JsonObject
            /**
             * Write the global options.
             * 覆写所有自定义配置
             */
            public static properties(properties: JsonObject): App
            public static properties(properties?: JsonObject): any {
                if (arguments.length == 0) return this._sets.properties;
                this._sets.properties = Jsons.union(this._sets.properties, properties);
                return this
            }

            /**
             * Read the key option.
             * 读取配置项
             */
            public static property(key: string): any
            /**
             * Write the key option.
             * 覆写配置项
             */
            public static property(key: string, val: any): App
            public static property(key: string, val?: any): any {
                if (arguments.length == 1) return this.properties()[key];
                return this.properties({ key: val });
            }

            public static _bus = new EventBus(App);

            /**
             * Fires an applition-level event.
             * 触发一个应用事件
             * @param e 
             * @param arg 
             */
            public static fireEvent<E>(e: E, arg?: StoreDataType) {
                LocalStore.remove(e + '.' + App.namespace());
                LocalStore.set(e + '.' + App.namespace(), arg);
            }
            /**
             * Listen an applition-level event.
             * 监听一个应用事件
             */
            public static onEvent<H = EventHandler<App>>(e: string, handler: H, once?:boolean) {
                this._bus.on(<any>e, handler, once)
            }
            /**
             * Cancels all listeners of an applition-level event.
             * 取消一个应用事件的所有监听
             */
            public static offEvent(e: string) {
                this._bus.off(e)
            }
        }

    }
}
import App = JS.model.App;
import AppEvent = JS.model.AppEvent;
import AppSettings = JS.model.AppSettings;

//////////////////////////////////////////////////
(function(){
    var oldSetItem = localStorage.setItem;
    localStorage.setItem = function (key, newValue) {
        var ev = document.createEvent('CustomEvent');
        ev.initCustomEvent('AppEvent', false, false, '');
        ev['key'] = key;
        ev['newValue'] = newValue;
        ev['url'] = Page.uri().toString();
        window.dispatchEvent(ev);
        oldSetItem.apply(this, arguments);
    }
    $(window).on('AppEvent storage', (evt: JQuery.Event) => {
        let e = <StorageEvent>evt.originalEvent, name = e.key;
        if (!name) return;
    
        let namespace = '.' + App.namespace();
        if (!name.endsWith(namespace)) return;//非APP事件则忽略
    
        if (e.newValue == null) return;//删除数据项则忽略
    
        let ev = new AppEvent(name.slice(0, name.length - namespace.length));
        ev.url = e.url;
        App._bus.fire(ev, [StoreHelper.parse(e.newValue)]);
    });
})()
