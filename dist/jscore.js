//# sourceURL=../dist/jscore.js
//JSDK 2.7.0 MIT
Promise.prototype.always = function (fn) {
    return this.then((t1) => {
        return fn.call(this, t1, true);
    }).catch((t2) => {
        return fn.call(this, t2, false);
    });
};
var JS;
(function (JS) {
    let core;
    (function (core) {
        let AS = Array.prototype.slice, newArray = (a, from) => {
            return a == void 0 ? [] : AS.apply(a, [from == void 0 ? 0 : from]);
        };
        class Promises {
            static create(fn, ...args) {
                return new Promise((resolve, reject) => {
                    fn.apply({
                        resolve: resolve,
                        reject: reject
                    }, newArray(arguments, 1));
                });
            }
            static createPlan(fn) {
                return function () {
                    return Promises.create.apply(Promises, [fn].concat(Array.prototype.slice.apply(arguments)));
                };
            }
            static newPlan(p, args, ctx) {
                return () => { return p.apply(ctx || p, args); };
            }
            static resolvePlan(v) {
                return () => { return Promise.resolve(v); };
            }
            static rejectPlan(v) {
                return () => { return Promise.reject(v); };
            }
            static order(ps) {
                var seq = Promise.resolve();
                ps.forEach(plan => {
                    seq = seq.then(plan);
                });
                return seq;
            }
            static all(ps) {
                var a = [];
                ps.forEach(task => {
                    a.push(task());
                });
                return Promise.all(a);
            }
            static race(ps) {
                var a = [];
                ps.forEach(task => {
                    a.push(task());
                });
                return Promise.race(a);
            }
        }
        core.Promises = Promises;
    })(core = JS.core || (JS.core = {}));
})(JS || (JS = {}));
var Promises = JS.core.Promises;
var JS;
(function (JS) {
    let core;
    (function (core) {
        let D, _head = () => { return D.querySelector('head'); }, _uncached = (u) => {
            return `${u}${u.indexOf('?') < 0 ? '?' : '&'}_=${new Date().getTime()}`;
        }, _loading = (k, a, b) => {
            if (!a) {
                k['onreadystatechange'] = () => {
                    if (k['readyState'] == 'loaded' || k['readyState'] == 'complete')
                        b();
                };
                k.onload = k.onerror = b;
            }
        };
        if (self['HTMLElement'])
            D = document;
        class Loader {
            static css(url, async = false, uncached) {
                if (!url)
                    return Promise.reject(null);
                return core.Promises.create(function () {
                    let k = D.createElement('link'), back = () => {
                        k.onload = k.onerror = k['onreadystatechange'] = null;
                        k = null;
                        this.resolve(url);
                    };
                    k.type = 'text/css';
                    k.rel = 'stylesheet';
                    k.charset = 'utf-8';
                    _loading(k, async, back);
                    k.href = uncached ? _uncached(url) : url;
                    _head().appendChild(k);
                    if (async)
                        back();
                });
            }
            static js(url, async = false, uncached) {
                if (!url)
                    return Promise.reject(null);
                return core.Promises.create(function () {
                    let s = D.createElement('script'), back = () => {
                        s.onload = s.onerror = s['onreadystatechange'] = null;
                        s = null;
                        this.resolve(url);
                    };
                    s.type = 'text/javascript';
                    s.async = async;
                    _loading(s, async, back);
                    s.src = uncached ? _uncached(url) : url;
                    _head().appendChild(s);
                    if (async)
                        back();
                });
            }
        }
        core.Loader = Loader;
    })(core = JS.core || (JS.core = {}));
})(JS || (JS = {}));
var Loader = JS.core.Loader;
var JS;
(function (JS) {
    JS.version = '2.7.0';
    function config(d, v) {
        let l = arguments.length;
        if (l == 0)
            return _cfg;
        if (!d)
            return;
        if (typeof d === 'string') {
            if (l == 1) {
                return _cfg[d];
            }
            else {
                _cfg[d] = v;
                return;
            }
        }
        else {
            for (let k in d) {
                if (d.hasOwnProperty(k))
                    _cfg[k] = d[k];
            }
        }
    }
    JS.config = config;
    let P = Promises, _cfg = {}, _ldd = {}, _ts = (u) => {
        let c = JS.config('cachedImport');
        if (c === true)
            return u;
        let s = '_=' + (c ? c : '' + Date.now());
        return u.lastIndexOf('?') > 0 ? `${u}&${s}` : `${u}?${s}`;
    }, _min = (u, t) => {
        if (JS.config('minImport')) {
            if (u.endsWith('.min.' + t))
                return u;
            if (u.endsWith('.' + t))
                return u.slice(0, u.length - t.length - 1) + '.min.' + t;
        }
        else
            return u;
    }, _impLib = (v) => {
        let a = v.endsWith('#async'), n = a ? v.slice(0, v.length - 6) : v, c = JS.config('libs')[n];
        if (c) {
            let ps = typeof c == 'string' ? [c] : c, tasks = [];
            ps.forEach(path => {
                if (path.startsWith('$')) {
                    tasks.push(_impLib(path.slice(1)));
                }
                else {
                    tasks.push(_impFile(path + (a ? '#async' : '')));
                }
            });
            return P.newPlan(P.order, [tasks]);
        }
        else {
            console.error('Not found the <' + n + '> library in JSDK settings.');
            return P.resolvePlan(null);
        }
    }, _impFile = (s) => {
        let u = s;
        if (s.startsWith('!')) {
            let jr = JS.config('jsdkRoot');
            jr = jr ? jr : (JS.config('libRoot') + '/jsdk/' + JS.version);
            u = jr + s.slice(1);
        }
        else if (s.startsWith('~')) {
            u = JS.config('libRoot') + s.slice(1);
        }
        let us = u.split('#'), len = us.length, u0 = us[0], ayc = len > 1 && us[1] == 'async';
        if (_ldd[u0])
            return P.resolvePlan(null);
        _ldd[u0] = 1;
        if (u0.endsWith('.js')) {
            return P.newPlan(Loader.js, [_ts(_min(u0, 'js')), ayc]);
        }
        else if (u0.endsWith('.css')) {
            return P.newPlan(Loader.css, [_ts(_min(u0, 'css')), ayc]);
        }
    };
    function imports(url) {
        if (JS.config('closeImport'))
            return Promise.resolve();
        let us = typeof url === 'string' ? [url] : url, tasks = [];
        us.forEach(uri => {
            tasks.push(uri.startsWith('$') ? _impLib(uri.slice(1)) : _impFile(uri));
        });
        return P.order(tasks);
    }
    JS.imports = imports;
})(JS || (JS = {}));
