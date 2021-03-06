//# sourceURL=../dist/jsvp.js
//JSDK 2.7.0 MIT
var JS;
(function (JS) {
    let app;
    (function (app) {
        class AppEvent extends CustomEvent {
            constructor(type, initDict) {
                super(type, initDict);
            }
        }
        app.AppEvent = AppEvent;
        class App {
            static init(cfg) {
                this._cfg = cfg;
                this._cfg.properties = this._cfg.properties || {};
                this._logger = new Log(this.NS(), cfg.logLevel || LogLevel.INFO);
            }
            static NS() {
                return this._cfg.name + '/' + this.version();
            }
            static appName() {
                return this._cfg.name;
            }
            static version() {
                return this._cfg.version;
            }
            static logger() {
                return this._logger;
            }
            static properties(properties) {
                if (arguments.length == 0)
                    return this._cfg.properties;
                this._cfg.properties = Jsons.union(this._cfg.properties, properties);
                return this;
            }
            static property(key, val) {
                if (arguments.length == 1)
                    return this.properties()[key];
                return this.properties({ key: val });
            }
            static fireEvent(e, arg) {
                let p = app.Page.currentPage(), pn = p && p.className, k = `${e}|${pn ? `${pn}|` : ''}${App.NS()}`;
                LocalStore.remove(k);
                LocalStore.set(k, arg);
            }
            static onEvent(e, handler, once) {
                this._bus.on(e, handler, once);
            }
            static offEvent(e) {
                this._bus.off(e);
            }
        }
        App._bus = new EventBus(App);
        app.App = App;
    })(app = JS.app || (JS.app = {}));
})(JS || (JS = {}));
var App = JS.app.App;
var AppEvent = JS.app.AppEvent;
(function () {
    var oldSetItem = localStorage.setItem;
    localStorage.setItem = function (key, val) {
        let ev = new CustomEvent('AppEvent');
        ev['key'] = key;
        ev['newValue'] = val;
        window.dispatchEvent(ev);
        oldSetItem.apply(this, arguments);
    };
    window.on('AppEvent storage', (e) => {
        if (e.newValue == null)
            return;
        let name = e.key;
        if (!name || name.indexOf('|' + App.NS()) < 0)
            return;
        let ps = name.split('|'), ev = new AppEvent(ps[0]);
        ev.fromUrl = e.url;
        ev.fromPage = ps.length == 3 ? ps[1] : null;
        App._bus.fire(ev, [StoreHelper.parse(e.newValue)]);
    });
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var JS;
(function (JS) {
    let app;
    (function (app) {
        let Page = class Page {
            initialize() { }
            destroy() { }
            static fireEvent(e, args) {
                this._bus.fire(e, args);
            }
            static onEvent(e, handler, once) {
                this._bus.on(e, handler, once);
            }
            static offEvent(e) {
                this._bus.off(e);
            }
            static init(page) {
                let T = this, p = Compos.get(page);
                T._page = p;
                T._bus.context(T._page);
                Bom.ready(() => {
                    T._page.enter();
                });
            }
            static currentPage() {
                return this._page;
            }
            static view(v) {
                return Compos.get(v);
            }
            static redirect(url, query) {
                let T = this, p = T._page;
                if (p) {
                    T.fireEvent('leaving', [p]);
                    Compos.remove(p.className);
                }
                let uri = new URI(url);
                if (query)
                    Types.isString(query) ? uri.queryString(query) : uri.queryObject(query);
                location.href = uri.toString();
            }
            static open(url, specs) {
                let args = [url, 'blank'];
                if (specs) {
                    let spe = '';
                    Jsons.forEach(specs, (v, k) => {
                        spe += `${k}=${Types.isNumber(v) ? v : (v ? 'yes' : 'no')},`;
                    });
                    if (spe)
                        args.push(spe);
                }
                return window.open.apply(window, args);
            }
            static fullscreen(onoff) {
                let T = this;
                if (onoff) {
                    T.fireEvent('fullscreening');
                    Bom.fullscreen();
                    T.fireEvent('fullscreened');
                }
                else {
                    T.fireEvent('normalscreening');
                    Bom.normalscreen();
                    T.fireEvent('normalscreened');
                }
            }
        };
        Page._bus = new EventBus();
        Page = __decorate([
            klass('JS.app.Page')
        ], Page);
        app.Page = Page;
    })(app = JS.app || (JS.app = {}));
})(JS || (JS = {}));
var Page = JS.app.Page;
var JS;
(function (JS) {
    let app;
    (function (app) {
        var Service_1;
        let Service = Service_1 = class Service {
            initialize() { }
            ;
            destroy() {
                this._proxy = null;
            }
            proxy(proxy) {
                if (arguments.length == 0)
                    return this._proxy;
                this._proxy = proxy;
                return this;
            }
            call(api, params) {
                if (!this._proxy)
                    this._proxy = Class.newInstance(Service_1.DEFAULT_PROXY);
                return new Promise((resolve, reject) => {
                    api.data = params;
                    return this._proxy.execute(api).then((result) => {
                        let model = Class.newInstance(api.dataKlass || Model), rds = result.data();
                        Types.ofKlass(model, Model) ? model.setData(rds) : model = rds;
                        resolve(model);
                    }).catch((res) => {
                        reject(res);
                    });
                });
            }
        };
        Service.DEFAULT_PROXY = JsonProxy;
        Service = Service_1 = __decorate([
            klass('JS.app.Service')
        ], Service);
        app.Service = Service;
    })(app = JS.app || (JS.app = {}));
})(JS || (JS = {}));
var Service = JS.app.Service;
