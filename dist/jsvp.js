//# sourceURL=jsvp.js
/**
* JSDK 2.4.0 
* https://github.com/fengboyue/jsdk/
* (c) 2007-2020 Frank.Feng<boyue.feng@foxmail.com>
* MIT license
*/
var JS;
(function (JS) {
    let store;
    (function (store) {
        let D = document;
        class CookieStore {
            static get(key) {
                let reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)", "gi"), data = reg.exec(D.cookie), str = data ? window['unescape'](data[2]) : null;
                return store.StoreHelper.parse(str);
            }
            ;
            static set(key, value, expireHours, path) {
                if (!key)
                    return;
                let exp = CookieStore.EXPIRES_DATETIME;
                if (Types.isDefined(expireHours) && expireHours > 0) {
                    var date = new Date();
                    date.setTime(date.getTime() + expireHours * 3600 * 1000);
                    exp = date.toUTCString();
                }
                let p = path ? path : CookieStore.PATH;
                let domain = CookieStore.DOMAIN;
                if (domain)
                    domain = 'domain=' + domain;
                D.cookie = key + '=' + window['escape']('' + store.StoreHelper.toString(value)) + '; path=' + p + '; expires=' + exp + domain;
            }
            ;
            static remove(key) {
                let date = new Date();
                date.setTime(date.getTime() - 10000);
                D.cookie = key + "=; expire=" + date.toUTCString();
            }
            ;
            static clear() {
                D.cookie = '';
            }
            ;
        }
        CookieStore.EXPIRES_DATETIME = 'Wed, 15 Apr 2099 00:00:00 GMT';
        CookieStore.PATH = '/';
        CookieStore.DOMAIN = self.document ? D.domain : null;
        store.CookieStore = CookieStore;
    })(store = JS.store || (JS.store = {}));
})(JS || (JS = {}));
var CookieStore = JS.store.CookieStore;
var JS;
(function (JS) {
    let store;
    (function (store) {
        let L = localStorage;
        class LocalStore {
            static get(key) {
                let str = L.getItem(key);
                if (!str)
                    return undefined;
                return store.StoreHelper.parse(str);
            }
            ;
            static set(key, value) {
                L.setItem(key, store.StoreHelper.toString(value));
            }
            ;
            static remove(key) {
                L.removeItem(key);
            }
            ;
            static key(i) {
                return L.key(i);
            }
            ;
            static size() {
                return L.length;
            }
            ;
            static clear() {
                L.clear();
            }
            ;
        }
        store.LocalStore = LocalStore;
    })(store = JS.store || (JS.store = {}));
})(JS || (JS = {}));
var LocalStore = JS.store.LocalStore;
var JS;
(function (JS) {
    let store;
    (function (store) {
        let S = sessionStorage;
        class SessionStore {
            static get(key) {
                let str = S.getItem(key);
                if (!str)
                    return undefined;
                return store.StoreHelper.parse(str);
            }
            ;
            static set(key, value) {
                S.setItem(key, store.StoreHelper.toString(value));
            }
            ;
            static remove(key) {
                S.removeItem(key);
            }
            ;
            static key(i) {
                return S.key(i);
            }
            ;
            static size() {
                return S.length;
            }
            ;
            static clear() {
                S.clear();
            }
            ;
        }
        store.SessionStore = SessionStore;
    })(store = JS.store || (JS.store = {}));
})(JS || (JS = {}));
var SessionStore = JS.store.SessionStore;
var JS;
(function (JS) {
    let store;
    (function (store) {
        let T = Types, J = Jsons, TP = Type, S = J.stringify;
        class StoreHelper {
            static toString(value) {
                if (T.isUndefined(value))
                    return 'undefined';
                if (T.isNull(value))
                    return 'null';
                if (T.isString(value))
                    return S(['string', value]);
                if (T.isBoolean(value))
                    return S(['boolean', value]);
                if (T.isNumber(value))
                    return S(['number', value]);
                if (T.isDate(value))
                    return S(['date', '' + value.valueOf()]);
                if (T.isArray(value) || T.isJsonObject(value))
                    return S(['object', S(value)]);
            }
            static parse(data) {
                if (TP.null == data)
                    return null;
                if (TP.undefined == data)
                    return undefined;
                let [type, val] = J.parse(data), v = val;
                switch (type) {
                    case TP.boolean:
                        v = Boolean(val);
                        break;
                    case TP.number:
                        v = Number(val);
                        break;
                    case TP.date:
                        v = new Date(val);
                        break;
                    case TP.array:
                        v = J.parse(val);
                        break;
                    case TP.json:
                        v = J.parse(val);
                        break;
                }
                return v;
            }
        }
        store.StoreHelper = StoreHelper;
    })(store = JS.store || (JS.store = {}));
})(JS || (JS = {}));
var StoreHelper = JS.store.StoreHelper;
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
                let T = this, p = Components.get(page);
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
                return Components.get(v);
            }
            static redirect(url, query) {
                let T = this, p = T._page;
                if (p) {
                    T.fireEvent('leaving', [p]);
                    Components.remove(p.className);
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
                    return this._proxy.execute(api, params).then((result) => {
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
