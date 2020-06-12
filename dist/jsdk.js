//@ sourceURL=jsdk.js
/**
* JSDK 2.0.0 
* https://github.com/fengboyue/jsdk/
* (c) 2007-2020 Frank.Feng<boyue.feng@foxmail.com>
* MIT license
*/
(function () {
    var $A = Array.prototype;
    $A.add = function (obj, from) {
        if (obj == void 0)
            return this;
        let arr = obj instanceof Array ? obj : [obj], i = from == void 0 ? this.length : (from < 0 ? 0 : from);
        Array.prototype.splice.apply(this, [i, 0].concat(arr));
        return this;
    };
    $A.remove = function (obj) {
        let index = typeof obj === 'number' ? obj : this.findIndex(obj);
        if (index > -1)
            this.splice(index, 1);
        return this;
    };
}());
var JS;
(function (JS) {
    let util;
    (function (util) {
        class Arrays {
            static newArray(a, from) {
                return a == void 0 ? [] : Array.prototype.slice.apply(a, [from == void 0 ? 0 : from]);
            }
            static toArray(a) {
                return a == void 0 ? [] : (util.Types.isArray(a) ? a : [a]);
            }
            static equal(a1, a2, equal) {
                if (a1 === a2)
                    return true;
                let empty1 = util.Check.isEmpty(a1), empty2 = util.Check.isEmpty(a2);
                if (empty1 && empty2)
                    return true;
                if (empty1 !== empty2)
                    return false;
                if (a1.length != a2.length)
                    return false;
                return a1.every((item1, i) => {
                    return equal ? equal(item1, a2[i], i) : item1 === a2[i];
                });
            }
            static equalToString(a1, a2) {
                if (a1 === a2)
                    return true;
                if (a1 == void 0 && a2 == void 0)
                    return true;
                if (!a1 || !a2)
                    return false;
                if (a1.length != a2.length)
                    return false;
                return a1.toString() == a2.toString();
            }
            static same(a1, a2) {
                if (a1 === a2 || (util.Check.isEmpty(a1) && util.Check.isEmpty(a2)))
                    return true;
                if (a1.length != a2.length)
                    return false;
                let arr2 = this.newArray(a2);
                a1.forEach(item1 => {
                    arr2.remove((v) => {
                        return v == item1;
                    });
                });
                return arr2.length == 0;
            }
            static slice(args, fromIndex, endIndex) {
                return Array.prototype.slice.apply(args, [fromIndex || 0, endIndex || args.length]);
            }
        }
        util.Arrays = Arrays;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Arrays = JS.util.Arrays;
Promise.prototype.always = function (fn) {
    return this.then((t1) => {
        return fn.call(this, t1, true);
    }).catch((t2) => {
        return fn.call(this, t2, false);
    });
};
var JS;
(function (JS) {
    let util;
    (function (util) {
        class Promises {
            static create(fn, ...args) {
                return new Promise((resolve, reject) => {
                    fn.apply({
                        resolve: resolve,
                        reject: reject
                    }, util.Arrays.newArray(arguments, 1));
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
            static order(plans) {
                var seq = Promise.resolve();
                plans.forEach(plan => {
                    seq = seq.then(plan);
                });
                return seq;
            }
            static all(plans) {
                var rst = [];
                plans.forEach(task => {
                    rst.push(task());
                });
                return Promise.all(rst);
            }
            static race(plans) {
                var rst = [];
                plans.forEach(task => {
                    rst.push(task());
                });
                return Promise.race(rst);
            }
        }
        util.Promises = Promises;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Promises = JS.util.Promises;
var JS;
(function (JS) {
    let util;
    (function (util) {
        let ACCEPTS = {
            '*': '*/*',
            text: 'text/plain',
            html: 'text/html',
            xml: 'application/xml, text/xml',
            json: 'application/json, text/javascript',
            script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
        };
        let _judgeType = (cType) => {
            if (!cType)
                return 'json';
            if (cType == ACCEPTS['text'])
                return 'text';
            if (cType == ACCEPTS['html'])
                return 'html';
            if (cType.indexOf('/xml') > 0)
                return 'xml';
            return 'json';
        };
        let PARSERS = {
            html: (str) => {
                if (!str)
                    return null;
                return new DOMParser().parseFromString(str, 'text/html');
            },
            xml: (str) => {
                if (!str)
                    return null;
                let xml = new DOMParser().parseFromString(str, 'text/xml');
                if (!xml || xml.getElementsByTagName("parsererror").length)
                    throw new Error();
                return xml;
            },
            json: (str) => {
                return util.Jsons.parse(str);
            },
            text: (str) => {
                return str;
            }
        }, _headers = function (xhr) {
            let headers = {}, hString = xhr.getAllResponseHeaders(), hRegexp = /([^\s]*?):[ \t]*([^\r\n]*)/mg, match = null;
            while ((match = hRegexp.exec(hString))) {
                headers[match[1]] = match[2];
            }
            return headers;
        }, _response = function (req, xhr, error) {
            let type = req.type, headers = _headers(xhr);
            if (!type && xhr.status > 0)
                type = _judgeType(headers['Content-Type']);
            return {
                request: req,
                url: xhr.responseURL,
                raw: xhr.response,
                type: req.type,
                data: null,
                status: xhr.status,
                statusText: error || (xhr.status == 0 ? 'error' : xhr.statusText),
                headers: headers,
                xhr: xhr
            };
        }, _parseResponse = function (res, req, xhr) {
            try {
                let raw = xhr.response, parser = req.parsers && req.parsers[res.type] || PARSERS[res.type];
                if (req.responseFilter)
                    raw = req.responseFilter(raw, res.type);
                res.data = parser(raw);
            }
            catch (e) {
                res.statusText = 'parseerror';
                if (req.error)
                    req.error(res);
                if (Ajax._ON['error'])
                    Ajax._ON['error'](res);
                this.reject(res);
            }
        }, _rejectError = function (req, xhr, error) {
            let res = _response(req, xhr, error);
            if (req.error)
                req.error(res);
            if (Ajax._ON['error'])
                Ajax._ON['error'](res);
            this.reject(res);
        };
        let CACHE = {
            lastModified: {},
            etag: {}
        }, _done = function (uncacheURL, req, xhr) {
            if (xhr['_isTimeout'])
                return;
            let status = xhr.status, res = _response(req, xhr);
            if (req.complete)
                req.complete(res);
            if (Ajax._ON['complete'])
                Ajax._ON['complete'](res);
            if (status >= 200 && status < 300 || status === 304) {
                let modified = null;
                if (req.ifModified) {
                    modified = xhr.getResponseHeader('Last-Modified');
                    if (modified)
                        CACHE.lastModified[uncacheURL] = modified;
                    modified = xhr.getResponseHeader('etag');
                    if (modified)
                        CACHE.etag[uncacheURL] = modified;
                }
                if (status === 204 || req.method === "HEAD") {
                    res.statusText = 'nocontent';
                }
                else if (status === 304) {
                    res.statusText = 'notmodified';
                }
                _parseResponse.call(this, res, req, xhr);
                this.resolve(res);
            }
            else {
                this.reject(res);
            }
        };
        let _queryString = function (data) {
            if (util.Types.isString(data))
                return encodeURI(data);
            let str = '';
            util.Jsons.forEach(data, (v, k) => {
                str += `&${k}=${encodeURIComponent(v)}`;
            });
            return str;
        }, _queryURL = (req) => {
            let url = req.url.replace(/^\/\//, location.protocol + '//');
            if (!util.Check.isEmpty(req.data))
                url = `${url}${url.indexOf('?') < 0 ? '?' : ''}${_queryString(req.data)}`;
            return url;
        }, _uncacheURL = (url, cache) => {
            url = url.replace(/([?&])_=[^&]*/, '$1');
            if (!cache)
                url = `${url}${url.indexOf('?') < 0 ? '?' : '&'}_=${new Date().getTime()}`;
            return url;
        };
        let _beforeSend = function (fn, req) {
            if (fn) {
                if (fn(req) === false)
                    return false;
            }
            return true;
        }, _send = function (request) {
            let req = util.Types.isString(request) ? { url: request } : request;
            if (!req.url)
                JSLogger.error('Sent an ajax request without URL.');
            req = util.Jsons.union({
                method: 'GET',
                crossCookie: false,
                async: true,
                type: 'text',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                cache: true
            }, req);
            let xhr = self.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'), queryURL = _queryURL(req), url = _uncacheURL(queryURL, req.cache), headers = req.headers || {};
            xhr.open(req.method, url, req.async, req.username, req.password);
            xhr.setRequestHeader('Accept', req.type && ACCEPTS[req.type] ? ACCEPTS[req.type] + ',' + ACCEPTS['*'] + ';q=0.01' : ACCEPTS['*']);
            if (req.data && req.contentType)
                xhr.setRequestHeader('Content-Type', req.contentType);
            if (!headers['X-Requested-With'])
                headers['X-Requested-With'] = "XMLHttpRequest";
            if (req.mimeType && xhr.overrideMimeType)
                xhr.overrideMimeType(req.mimeType);
            if (req.ifModified) {
                if (CACHE.lastModified[queryURL])
                    xhr.setRequestHeader('If-Modified-Since', CACHE.lastModified[queryURL]);
                if (CACHE.etag[queryURL])
                    xhr.setRequestHeader('If-None-Match', CACHE.etag[queryURL]);
            }
            for (let h in headers)
                xhr.setRequestHeader(h, headers[h]);
            xhr.onerror = (e) => {
                _rejectError.call(this, req, xhr, 'error');
            };
            xhr.onabort = () => { _rejectError.call(this, req, xhr, xhr['_isTimeout'] ? 'timeout' : 'abort'); };
            xhr.withCredentials = req.crossCookie;
            if (req.async) {
                xhr.timeout = req.timeout || 0;
                xhr.ontimeout = () => {
                    _rejectError.call(this, req, xhr, 'timeout');
                };
                xhr.onreadystatechange = () => {
                    if (xhr.readyState == 4 && xhr.status > 0)
                        _done.call(this, queryURL, req, xhr);
                };
            }
            let rst = _beforeSend(Ajax._ON['beforeSend'], req);
            if (rst === false) {
                _rejectError.call(this, req, xhr, 'cancel');
                return;
            }
            rst = _beforeSend(req.beforeSend, req);
            if (rst === false) {
                _rejectError.call(this, req, xhr, 'cancel');
                return;
            }
            if (req.async)
                xhr.responseType = 'text';
            let data = req.method == 'HEAD' || req.method == 'GET' ? null : (util.Types.isString(req.data) ? req.data : util.Jsons.stringfy(req.data));
            try {
                if (req.async && req.timeout > 0) {
                    var timer = self.setTimeout(function () {
                        xhr['_isTimeout'] = true;
                        xhr.abort();
                        self.clearTimeout(timer);
                    }, req.timeout);
                }
                xhr.send(data);
            }
            catch (e) {
                _rejectError.call(this, req, xhr, 'error');
            }
            if (!req.async && xhr.status > 0)
                _done.call(this, queryURL, req, xhr);
        };
        class Ajax {
            static _toQuery(q) {
                if (!q)
                    return {};
                return util.Types.isString(q) ? util.URI.parseQueryString(q) : q;
            }
            static toRequest(quy, data) {
                let req = util.Types.isString(quy) ? { url: quy } : quy;
                if (quy && data)
                    req.data = util.Jsons.union(this._toQuery(req.data), this._toQuery(data));
                return req;
            }
            static send(req) {
                let q = this.toRequest(req);
                return q.thread ? this.sendInThread(req) : this.sendInMain(req);
            }
            static sendInMain(req) {
                return util.Promises.create(function () {
                    _send.call(this, req);
                });
            }
            static get(req) {
                let r = util.Types.isString(req) ? { url: req } : req;
                r.method = 'GET';
                return this.send(r);
            }
            static post(req) {
                let r = util.Types.isString(req) ? { url: req } : req;
                r.method = 'POST';
                return this.send(r);
            }
            static on(ev, fn) {
                this._ON[ev] = fn;
            }
            static sendBeacon(e, fn, scope) {
                window.addEventListener('unload', scope ? fn : function (e) { fn.call(scope, e); }, false);
            }
            static sendInThread(req) {
                let r = this.toRequest(req);
                r.url = util.URI.toAbsoluteURL(r.url);
                return util.Promises.create(function () {
                    let ctx = this;
                    new Thread({
                        run: function () {
                            this.onposted((request) => {
                                self.Ajax.sendInMain(request).then((res) => {
                                    delete res.xhr;
                                    this.postMain(res);
                                });
                            });
                        }
                    }, typeof r.thread === 'boolean' ? null : r.thread).on('message', function (e, res) {
                        ctx.resolve(res);
                        this.terminate();
                    }).start().postThread(r);
                });
            }
        }
        Ajax._ON = {};
        util.Ajax = Ajax;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Ajax = JS.util.Ajax;
var JS;
(function (JS) {
    let lang;
    (function (lang) {
        let Type;
        (function (Type) {
            Type["null"] = "null";
            Type["undefined"] = "undefined";
            Type["string"] = "string";
            Type["boolean"] = "boolean";
            Type["number"] = "number";
            Type["date"] = "date";
            Type["array"] = "array";
            Type["object"] = "object";
            Type["function"] = "function";
            Type["class"] = "class";
            Type["symbol"] = "symbol";
        })(Type = lang.Type || (lang.Type = {}));
    })(lang = JS.lang || (JS.lang = {}));
})(JS || (JS = {}));
var Type = JS.lang.Type;
var JS;
(function (JS) {
    let util;
    (function (util) {
        let _of = function (a, s) {
            return typeof a === s;
        };
        let _is = function (a, s) {
            return toString.call(a) === `[object ${s}]`;
        };
        let _isKlass = function (obj) {
            if (typeof obj != 'function')
                return false;
            let proto = obj.prototype;
            if (proto === undefined || proto.constructor !== obj)
                return false;
            if (Object.getOwnPropertyNames(proto).length >= 2)
                return true;
            var str = obj.toString();
            if (str.slice(0, 5) == "class")
                return true;
            if (/^function\s+\(|^function\s+anonymous\(/.test(str))
                return false;
            if (/\b\(this\b|\bthis[\.\[]\b/.test(str)) {
                if (/classCallCheck\(this/.test(str))
                    return true;
                return /^function\sdefault_\d+\s*\(/.test(str);
            }
            return false;
        };
        class Types {
            static isSymbol(o) {
                return _of(o, 'symbol');
            }
            static isArguments(o) {
                return _is(o, 'Arguments');
            }
            static isNaN(n) {
                return n != null && isNaN(n);
            }
            static isNumber(n) {
                return _of(n, 'number');
            }
            static isNumeric(n) {
                return (this.isNumber(n) || this.isString(n)) && !isNaN(n - parseFloat(n));
            }
            static isFloat(n) {
                return Number(n).isFloat();
            }
            static isInt(n) {
                return Number(n).isInt();
            }
            static isBoolean(obj) {
                return _of(obj, 'boolean');
            }
            static isString(obj) {
                return _of(obj, 'string');
            }
            static isDate(obj) {
                return _is(obj, 'Date');
            }
            static isDefined(obj) {
                return obj != void 0;
            }
            static isNull(obj) {
                return obj === null;
            }
            static isUndefined(obj) {
                return obj === void 0;
            }
            static isObject(obj) {
                return _is(obj, 'Object');
            }
            static isJsonObject(obj) {
                let OP = Object.prototype;
                if (!obj || OP.toString.call(obj) !== '[object Object]')
                    return false;
                let proto = Object.getPrototypeOf(obj);
                if (!proto)
                    return true;
                let ctor = OP.hasOwnProperty.call(proto, 'constructor') && proto.constructor, fnToString = Function.prototype.toString;
                return typeof ctor === 'function' && fnToString.call(ctor) === fnToString.call(Object);
            }
            static isArray(obj) {
                return Array.isArray(obj) || obj instanceof Array;
            }
            static isError(obj) {
                return _of(obj, 'Error');
            }
            static isFile(obj) {
                return _is(obj, 'File');
            }
            static isFormData(obj) {
                return _is(obj, 'FormData');
            }
            static isBlob(obj) {
                return _is(obj, 'Blob');
            }
            static isFunction(fn, pure) {
                return _of(fn, 'function') && (!pure ? true : !this.equalKlass(fn));
            }
            static isRegExp(obj) {
                return _is(obj, 'RegExp');
            }
            static isArrayBuffer(obj) {
                return _is(obj, 'ArrayBuffer');
            }
            static isElement(el) {
                return el && typeof el === 'object' && (el.nodeType === 1 || el.nodeType === 9);
            }
            static isWindow(el) {
                return el != null && el === el.window;
            }
            static isKlass(obj, klass) {
                return obj.constructor && obj.constructor === klass;
            }
            static ofKlass(obj, klass) {
                if (obj == void 0)
                    return false;
                if (this.isKlass(obj, klass))
                    return true;
                return obj instanceof klass;
            }
            static equalKlass(kls, klass) {
                if (!_isKlass(kls))
                    return false;
                return klass ? (kls === klass) : true;
            }
            static subKlass(kls1, kls2) {
                if (kls2 === Object || kls1 === kls2)
                    return true;
                let superXls = Class.getSuperklass(kls1);
                while (superXls != null) {
                    if (superXls === kls2)
                        return true;
                    superXls = Class.getSuperklass(superXls);
                }
                return false;
            }
            static equalClass(cls1, cls2) {
                return cls1.equals(cls2);
            }
            static subClass(cls1, cls2) {
                return cls1.subclassOf(cls2);
            }
            static isTypedArray(value) {
                return value && this.isNumber(value.length) && /^\[object (?:Uint8|Uint8Clamped|Uint16|Uint32|Int8|Int16|Int32|Float32|Float64)Array]$/.test(toString.call(value));
            }
            static type(obj) {
                if (obj === null)
                    return Type.null;
                let type = typeof obj;
                if (type == 'number' || type == 'bigint')
                    return Type.number;
                if (type == 'object') {
                    if (this.isArray(obj))
                        return Type.array;
                    if (this.isDate(obj))
                        return Type.date;
                    ;
                    return Type.object;
                }
                return _isKlass(obj) ? Type.class : type;
            }
        }
        util.Types = Types;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Types = JS.util.Types;
var JS;
(function (JS) {
    let util;
    (function (util) {
        let _test = function (str, pattern) {
            return str && pattern.test(str.trim());
        };
        class Check {
            static isEmpty(obj) {
                return obj == void 0
                    || obj === ''
                    || (obj.hasOwnProperty('length') && obj.length == 0)
                    || this.isEmptyObject(obj);
            }
            static isEmptyObject(obj) {
                var name;
                for (name in obj) {
                    return false;
                }
                return true;
            }
            static isBlank(s) {
                return s == void 0 || s.trim() === '';
            }
            static isFormatDate(str, format) {
                return _test(str, format || this.YYYY_MM_DD);
            }
            static isEmail(str, pattern) {
                return _test(str, pattern ? pattern : this.EMAIL);
            }
            static isEmails(str, pattern) {
                str = str || '';
                if (this.isBlank(str))
                    return false;
                var arr = str.split(/;|\s+/);
                for (var i = 0; i < arr.length; i++) {
                    var str = arr[i];
                    if (str.length > 0 && !this.isEmail(str, pattern))
                        return false;
                }
                return true;
            }
            static isEmailDomain(str) {
                return _test(str, this.EMAIL_DOMAIN);
            }
            static isOnlyNumber(str) {
                return _test(str, this.NUMBERS_ONLY);
            }
            static isPositive(n) {
                return Number(n).isPositive();
            }
            static isNegative(n) {
                return Number(n).isNegative();
            }
            static isHalfwidthChars(str) {
                return _test(str, this.HALFWIDTH_CHARS);
            }
            static isFullwidthChars(str) {
                return _test(str, this.FULLWIDTH_CHARS);
            }
            static isEnglishOnly(str) {
                return _test(str, this.ENGLISH_ONLY);
            }
            static isChineseOnly(str) {
                return _test(str, this.CHINESE_ONLY);
            }
            static isFormatNumber(n, integerLength, fractionLength) {
                if (!util.Types.isNumeric(n))
                    return false;
                let num = Number(n);
                let iLen = num.integerLength();
                let dLen = num.fractionLength();
                if (iLen > integerLength)
                    return false;
                if (util.Types.isDefined(fractionLength) && dLen > fractionLength)
                    return false;
                return true;
            }
            static greater(n1, n2) {
                return Number(n1) > Number(n2);
            }
            static greaterEqual(n1, n2) {
                return Number(n1) >= Number(n2);
            }
            static less(n1, n2) {
                return Number(n1) < Number(n2);
            }
            static lessEqual(n1, n2) {
                return Number(n1) <= Number(n2);
            }
            static isBetween(n, min, max) {
                let num = Number(n);
                return num > Number(min) && num < Number(max);
            }
            static shorter(str, len) {
                return str && str.length < len;
            }
            static longer(str, len) {
                return str && str.length > len;
            }
            static equalLength(str, len) {
                return str && str.length == len;
            }
            static isLettersOnly(str) {
                return _test(str, this.LETTERS_ONLY);
            }
            static isLettersOrNumbers(str) {
                return _test(str, this.LETTERS_OR_NUMBERS);
            }
            static isIP(str) {
                return _test(str.trim(), this.IP);
            }
            static isExistUrl(url) {
                let xhr = self.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
                xhr.open('HEAD', url, false);
                xhr.send();
                return xhr.status == 200;
            }
            static isPattern(str, exp) {
                return _test(str, exp);
            }
            static byServer(settings, judge) {
                return new Promise(function (resolve, reject) {
                    util.Ajax.send(settings).then(res => {
                        resolve(judge.apply(null, [res]));
                    });
                });
            }
        }
        Check.EMAIL = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@([A-Za-z0-9]+(?:-[A-Za-z0-9]+)?\.)+[A-Za-z0-9]+(?:-[A-Za-z0-9]+)?$/;
        Check.EMAIL_DOMAIN = /^@([A-Za-z0-9]+(?:-[A-Za-z0-9]+)?\.)+[A-Za-z0-9]+(?:-[A-Za-z0-9]+)?$/;
        Check.YYYY_MM_DD = /^(\d{1,4})(-|\/)(\d{1,2})(-|\/)(\d{1,2})$/;
        Check.HALFWIDTH_CHARS = /^[\u0000-\u00FF]+$/;
        Check.FULLWIDTH_CHARS = /^[\u0391-\uFFE5]+$/;
        Check.NUMBERS_ONLY = /^\d+$/;
        Check.LETTERS_ONLY = /^[A-Za-z]+$/;
        Check.LETTERS_OR_NUMBERS = /^[A-Za-z\d]+$/;
        Check.ENGLISH_ONLY = /^[A-Za-z\d\s\`\~\!\@\#\$\%\^\&\*\(\)\_\-\+\=\[\]\{\}\|\:\;\"\'\<\>\,\.\?\\\/]+$/;
        Check.CHINESE_ONLY = /^[\u4E00-\u9FA5]+$/;
        Check.IP = /^(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5])$/;
        util.Check = Check;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Check = JS.util.Check;
var JS;
(function (JS) {
    let util;
    (function (util) {
        let EUID = 1;
        class EventBus {
            constructor(context) {
                this._isD = false;
                this._map = new Map();
                this._ctx = util.Jsons.clone(context);
            }
            context(ctx) {
                if (arguments.length == 0)
                    return this._ctx;
                this._ctx = ctx;
            }
            destroy() {
                this.off();
                this._ctx = null;
                this._isD = true;
            }
            isDestroyed() {
                return this._isD;
            }
            _add(type, h) {
                let fns = this._map.get(type) || [];
                fns[fns.length] = h;
                this._map.set(type, fns);
            }
            _remove(type, h) {
                if (!h) {
                    this._map.set(type, []);
                }
                else {
                    let fns = this._map.get(type);
                    if (!util.Check.isEmpty(fns)) {
                        fns.remove(fn => {
                            return fn['euid'] === h['euid'];
                        });
                        this._map.set(type, fns);
                    }
                }
            }
            _removeByEuid(type, euid) {
                let fns = this._map.get(type);
                if (!util.Check.isEmpty(fns)) {
                    fns.remove(fn => {
                        return fn['euid'] === euid;
                    });
                    this._map.set(type, fns);
                }
            }
            _euid(h, one, type) {
                let me = this, euid = h['euid'] || EUID++, fn = function () {
                    if (one)
                        me._removeByEuid(type, euid);
                    return h.apply(this, arguments);
                };
                fn['euid'] = h['euid'] = euid;
                return fn;
            }
            on(types, handler, once) {
                if (this.isDestroyed())
                    return false;
                types.split(' ').forEach((tp) => {
                    this._add(tp, this._euid(handler, once, tp));
                });
                return true;
            }
            find(type, euid) {
                let fns = this._map.get(type);
                if (arguments.length >= 1) {
                    if (!util.Check.isEmpty(fns)) {
                        let i = fns.findIndex(fn => {
                            return fn['euid'] === euid;
                        });
                        if (i > -1)
                            return fns[i];
                    }
                    return null;
                }
                return fns || null;
            }
            types() {
                return this._map.keys;
            }
            off(types, handler) {
                if (this.isDestroyed())
                    return false;
                if (types) {
                    types.split(' ').forEach((tp) => {
                        this._remove(tp, handler);
                    });
                }
                else {
                    this._map.clear();
                }
                return true;
            }
            _call(e, fn, args) {
                let evt = e['originalEvent'] ? e['originalEvent'] : e, arr = [evt];
                if (args && args.length > 0)
                    arr = arr.concat(args);
                let rst = fn.apply(this._ctx, arr);
                return rst === false;
            }
            fire(e, args) {
                let is = util.Types.isString(e), fns = this._map.get(is ? e : e.type);
                if (!util.Check.isEmpty(fns)) {
                    let evt = is ? new CustomEvent(e) : e;
                    return !fns.some(fn => {
                        return this._call(evt, fn, args);
                    });
                }
                return true;
            }
        }
        util.EventBus = EventBus;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var EventBus = JS.util.EventBus;
if (self['HTMLElement'])
    (function () {
        const HP = HTMLElement.prototype, oAppend = HP['append'], oPrepend = HP['prepend'], _append = function (html) {
            if (!html)
                return;
            let div = document.createElement('div'), nodes = null, fg = document.createDocumentFragment();
            div.innerHTML = html;
            nodes = div.childNodes;
            for (let i = 0, len = nodes.length; i < len; i++) {
                fg.appendChild(nodes[i].cloneNode(true));
            }
            this.appendChild(fg);
            nodes = null;
            fg = null;
        }, _prepend = function (html) {
            if (!html)
                return;
            let div = document.createElement('div'), nodes = null, fg = document.createDocumentFragment();
            div.innerHTML = html;
            nodes = div.childNodes;
            for (let i = 0, len = nodes.length; i < len; i++) {
                fg.appendChild(nodes[i].cloneNode(true));
            }
            this.insertBefore(fg, this.firstChild);
            nodes = null;
            fg = null;
        };
        HP['append'] = function (...nodes) {
            nodes.forEach(n => {
                typeof n == 'string' ? _append.call(this, n) : oAppend.call(this, n.cloneNode(true));
            });
        };
        HP['prepend'] = function (...nodes) {
            nodes.forEach(n => {
                typeof n == 'string' ? _prepend.call(this, n) : oPrepend.call(this, n.cloneNode(true));
            });
        };
        HP['attr'] = function (key, val) {
            if (arguments.length == 1)
                return this.getAttribute(key);
            this.setAttribute(key, val);
            return this;
        };
        HP['html'] = function (html) {
            if (arguments.length == 0)
                return this.innerHTML;
            this.innerHTML = html;
            return this;
        };
        HP['addClass'] = function (cls) {
            if (!cls)
                return this;
            let cs = this.attr('class');
            return this.attr('class', cs + ' ' + cls);
        };
        HP['removeClass'] = function (cls) {
            if (!cls)
                return this;
            let cs = this.attr('class').trim();
            if (!cs)
                return this;
            let clss = cls.split(' ');
            cs += ' ';
            clss.forEach(c => {
                cs = cs.replace(new RegExp(c + ' ', 'g'), '');
            });
            return this.attr('class', cs);
        };
        HP['hasClass'] = function (cls) {
            if (!cls)
                return this;
            let cs = this.attr('class').trim();
            if (!cs)
                return this;
            return (cs + ' ').indexOf(cls + ' ') >= 0;
        };
        HP['toggleClass'] = function (cls, isAdd) {
            if (!cls)
                return this;
            if (isAdd === true)
                return this.addClass(cls);
            if (isAdd === false)
                return this.removeClass(cls);
            let clss = cls.split(' ');
            return this.hasClass(clss[0]) ? this.removeClass(cls) : this.addClass(cls);
        };
        let _on = function (type, fn, once) {
            if (!this['_bus'])
                this['_bus'] = new EventBus(this);
            let bus = this['_bus'], cb = (e) => {
                bus.fire(e);
            };
            bus.on(type, fn, once);
            if (this.addEventListener) {
                this.addEventListener(type, cb);
            }
            else if (this['attachEvent']) {
                this['attachEvent']('on' + type, cb);
            }
        };
        HP['on'] = function (type, fn, once) {
            let types = type.split(' ');
            types.forEach(t => {
                _on.call(this, t, fn, once);
            });
            return this;
        };
        let _remove = function (type, fn) {
            if (!fn)
                return;
            if (this.removeEventListener) {
                this.removeEventListener(type, fn);
            }
            else if (this['detachEvent']) {
                this['detachEvent']('on' + type, fn);
            }
        }, _removes = function (type, fns) {
            if (fns)
                fns.forEach(f => { _remove.call(this, type, f); });
        }, _off = function (type, fn) {
            let bus = this['_bus'];
            if (bus) {
                let obj = fn ? bus.find(type, fn['euid']) : undefined;
                bus.off(type, obj);
                _remove.call(this, type, obj);
            }
            else {
                _remove.call(this, type, fn);
            }
        };
        HP['off'] = function (type, fn) {
            if (!type) {
                let bus = this['_bus'];
                if (bus) {
                    let types = bus.types();
                    for (let i = 0, len = types.length; i < len; i++) {
                        let ty = types[i];
                        _removes.call(this, ty, bus.find(ty));
                    }
                    bus.off();
                }
            }
            else {
                let types = type.split(' ');
                types.forEach(t => {
                    _off.call(this, t, fn);
                });
            }
            return this;
        };
        HP['find'] = HP.querySelector;
        HP['findAll'] = HP.querySelectorAll;
        let WP = Window.prototype;
        WP['on'] = HP['on'];
        WP['off'] = HP['off'];
    })();
var JS;
(function (JS) {
    let util;
    (function (util) {
        let _head = () => { return document.querySelector('head'); }, _uncached = (url) => {
            return `${url}${url.indexOf('?') < 0 ? '?' : '&'}_=${new Date().getTime()}`;
        };
        class Dom {
            static $1(selector) {
                return typeof selector == 'string' ? document.querySelector(selector) : selector;
            }
            static $L(selector) {
                return document.querySelectorAll(selector);
            }
            static rename(node, newTagName) {
                let newNode = document.createElement(newTagName), aNames = node['getAttributeNames']();
                if (aNames)
                    aNames.forEach(name => {
                        newNode.setAttribute(name, node.getAttribute(name));
                    });
                newNode.append.apply(newNode, node.childNodes);
                node.parentNode.replaceChild(newNode, node);
            }
            static applyStyle(code, id) {
                if (!code)
                    return;
                this.$1('head').append(`<style${id ? ' id="' + id + '"' : ''}>${code}</style>`);
            }
            static applyHtml(html, appendTo, ignore) {
                if (!html)
                    return Promise.reject(null);
                return util.Promises.create(function () {
                    let doc = typeof html == 'string' ? new DOMParser().parseFromString(html, 'text/html') : html, url = doc.URL, el = Dom.$1(appendTo || document.body);
                    el.append.apply(el, doc.body.childNodes);
                    el = null;
                    let ignoreCss = ignore === true || (ignore && ignore.css) ? true : false;
                    if (!ignoreCss) {
                        let cssFiles = doc.querySelectorAll('link[rel=stylesheet]');
                        if (cssFiles) {
                            for (let i = 0, len = cssFiles.length; i < len; i++) {
                                let css = cssFiles[i], href = css.getAttribute('href');
                                if (href)
                                    Dom.loadCSS(href, true);
                            }
                        }
                        let styles = doc.querySelectorAll('style');
                        if (styles) {
                            for (let i = 0, len = styles.length; i < len; i++) {
                                Dom.applyStyle(styles[i].textContent);
                            }
                        }
                    }
                    let ignoreScript = ignore === true || (ignore && ignore.script) ? true : false;
                    if (!ignoreScript) {
                        let scs = doc.getElementsByTagName('script'), syncs = [], back = () => {
                            syncs = null;
                            scs = null;
                            if (typeof html == 'string')
                                doc = null;
                            this.resolve(url);
                        };
                        if (scs && scs.length > 0) {
                            for (let i = 0, len = scs.length; i < len; i++) {
                                let sc = scs[i];
                                sc.src ? (sc.async ? Dom.loadJS(sc.src, true) : syncs.push(Dom.loadJS(sc.src, false))) : eval(sc.text);
                            }
                            util.Promises.order(syncs).then(() => {
                                back();
                            }).catch((u) => {
                                JSLogger.error('Load inner script error in loading html!\nscript url=' + u + '\nhtml url=' + url);
                                back();
                            });
                        }
                        else {
                            back();
                        }
                    }
                    else {
                        if (typeof html == 'string')
                            doc = null;
                        this.resolve(url);
                    }
                });
            }
            static loadCSS(url, async = false, uncache) {
                if (!url)
                    return Promise.reject(null);
                return util.Promises.create(function () {
                    let k = document.createElement('link'), back = () => {
                        k.onload = k.onerror = k['onreadystatechange'] = null;
                        k = null;
                        this.resolve(url);
                    };
                    k.type = 'text/css';
                    k.rel = 'stylesheet';
                    if (!async) {
                        k['onreadystatechange'] = () => {
                            if (k['readyState'] == 'loaded' || k['readyState'] == 'complete')
                                back();
                        };
                        k.onload = k.onerror = back;
                    }
                    k.href = uncache ? _uncached(url) : url;
                    _head().appendChild(k);
                    if (async)
                        back();
                });
            }
            static loadJS(url, async = false, uncache) {
                if (!url)
                    return Promise.reject(null);
                return util.Promises.create(function () {
                    let s = document.createElement('script'), back = () => {
                        s.onload = s.onerror = s['onreadystatechange'] = null;
                        s = null;
                        this.resolve(url);
                    };
                    s.type = 'text/javascript';
                    s.async = async;
                    if (!async) {
                        s['onreadystatechange'] = () => {
                            if (s['readyState'] == 'loaded' || s['readyState'] == 'complete')
                                back();
                        };
                        s.onload = s.onerror = back;
                    }
                    s.src = uncache ? _uncached(url) : url;
                    _head().appendChild(s);
                    if (async)
                        back();
                });
            }
            static loadHTML(url, async, appendTo, ignore, preHandler) {
                if (!url)
                    return Promise.reject(null);
                return util.Promises.create(function () {
                    util.Ajax.get({
                        type: 'html',
                        url: url,
                        cache: false,
                        async: async
                    }).then((res) => {
                        Dom.applyHtml(preHandler ? preHandler(res.data) : res.data, appendTo, ignore).then(() => {
                            this.resolve(url);
                        });
                    });
                });
            }
        }
        util.Dom = Dom;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Dom = JS.util.Dom;
const $1 = Dom.$1;
const $L = Dom.$L;
var JS;
(function (JS) {
    JS.version = '2.0.0';
    function config(d, v) {
        let len = arguments.length;
        if (len == 0)
            return _props;
        if (!d)
            return;
        if (typeof d === 'string') {
            if (len == 1) {
                return _props[d];
            }
            else {
                _props[d] = v;
                return;
            }
        }
        else {
            for (let k in d) {
                if (d.hasOwnProperty(k))
                    _props[k] = d[k];
            }
        }
    }
    JS.config = config;
    let _props = {}, _loaded = {}, _min = (uri, type) => {
        if (JS.config('minimize')) {
            if (uri.endsWith('.min.' + type))
                return uri;
            if (uri.endsWith('.' + type))
                return uri.slice(0, uri.length - type.length - 1) + '.min.' + type;
        }
        else
            return uri;
    }, _impLib = (lib) => {
        let async = lib.endsWith('#async'), libName = async ? lib.slice(0, lib.length - 6) : lib, paths = JS.config('libs')[libName];
        if (paths) {
            let ps = typeof paths == 'string' ? [paths] : paths, tasks = [];
            ps.forEach(path => {
                if (path.startsWith('$')) {
                    tasks.push(_impLib(path.slice(1)));
                }
                else {
                    tasks.push(_impFile(path + (async ? '#async' : '')));
                }
            });
            return Promises.newPlan(Promises.order, [tasks]);
        }
        else {
            console.error('Not found the <' + libName + '> library in JSDK settings.');
            return Promises.resolvePlan(null);
        }
    }, _impFile = (url) => {
        let u = url;
        if (url.startsWith('!')) {
            let jr = JS.config('jsdkRoot');
            jr = jr ? jr : (JS.config('libRoot') + '/jsdk/' + JS.version);
            u = jr + url.slice(1);
        }
        else if (url.startsWith('~')) {
            u = JS.config('libRoot') + url.slice(1);
        }
        let us = u.split('#'), len = us.length, u0 = us[0], ayc = len > 1 && us[1] == 'async';
        if (_loaded[u0])
            return Promises.resolvePlan(null);
        _loaded[u0] = 1;
        if (u0.endsWith('.js')) {
            return Promises.newPlan(Dom.loadJS, [_min(u0, 'js'), ayc]);
        }
        else if (u0.endsWith('.css')) {
            return Promises.newPlan(Dom.loadCSS, [_min(u0, 'css'), ayc]);
        }
        else {
            return Promises.newPlan(Dom.loadHTML, [u0, ayc]);
        }
    };
    function imports(url) {
        if (JS.config('importMode') == 'html')
            return Promise.resolve();
        let uris = typeof url === 'string' ? [url] : url, tasks = [];
        uris.forEach(uri => {
            tasks.push(uri.startsWith('$') ? _impLib(uri.slice(1)) : _impFile(uri));
        });
        return Promises.order(tasks);
    }
    JS.imports = imports;
})(JS || (JS = {}));
var JS;
(function (JS) {
    let util;
    (function (util) {
        class Jsons {
            static parse(text, reviver) {
                return text ? JSON.parse(text, reviver) : null;
            }
            static stringfy(value, replacer, space) {
                return JSON.stringify(value, replacer, space);
            }
            static clone(obj) {
                if (obj == void 0 || 'object' != typeof obj)
                    return obj;
                let copy;
                if (obj instanceof Date) {
                    copy = new Date();
                    copy.setTime(obj.getTime());
                    return copy;
                }
                if (obj instanceof Array) {
                    copy = [];
                    for (var i = 0, len = obj.length; i < len; ++i) {
                        copy[i] = this.clone(obj[i]);
                    }
                    return copy;
                }
                if (util.Types.isJsonObject(obj)) {
                    copy = {};
                    var keys = Reflect.ownKeys(obj);
                    keys.forEach(key => {
                        copy[key] = this.clone(obj[key]);
                    });
                    return copy;
                }
                return obj;
            }
            static forEach(json, fn, that) {
                if (!json)
                    return;
                let keys = Object.keys(json);
                keys.forEach((key, i) => {
                    fn.apply(that || json, [json[key], key]);
                });
            }
            static some(json, fn, that) {
                if (!json)
                    return;
                let keys = Object.keys(json);
                return keys.some((key, i) => {
                    return fn.apply(that || json, [json[key], key]);
                });
            }
            static hasKey(json, key) {
                return json && key && json.hasOwnProperty(key);
            }
            static values(json) {
                if (!json)
                    return null;
                let arr = [];
                Jsons.forEach(json, v => {
                    arr[arr.length] = v;
                });
                return arr;
            }
            static keys(json) {
                if (!json)
                    return null;
                let keys = [];
                Jsons.forEach(json, (v, k) => {
                    keys[keys.length] = k;
                });
                return keys;
            }
            static equalKeys(json1, json2) {
                let empty1 = util.Check.isEmpty(json1), empty2 = util.Check.isEmpty(json2);
                if (empty1 && empty2)
                    return true;
                if (empty1 || empty2)
                    return false;
                let map2 = Jsons.clone(json2);
                Jsons.forEach(json1, (v, k) => {
                    delete map2[k];
                });
                return util.Check.isEmpty(map2);
            }
            static equal(json1, json2) {
                let empty1 = util.Check.isEmpty(json1), empty2 = util.Check.isEmpty(json2);
                if (empty1 && empty2)
                    return true;
                if (empty1 || empty2)
                    return false;
                let map2 = Jsons.clone(json2);
                Jsons.forEach(json1, (v, k) => {
                    if ((k in map2) && map2[k] === v)
                        delete map2[k];
                });
                return util.Check.isEmpty(map2);
            }
            static replaceKeys(json, keyMapping, needClone) {
                if (!keyMapping)
                    return json;
                let clone = needClone ? Jsons.clone(json) : json;
                this.forEach(clone, function (val, oldKey) {
                    let newKey = util.Types.isFunction(keyMapping) ? keyMapping.apply(clone, [val, oldKey]) : keyMapping[oldKey];
                    if (newKey != oldKey && clone.hasOwnProperty(oldKey)) {
                        let temp = clone[oldKey];
                        delete clone[oldKey];
                        clone[newKey] = temp;
                    }
                });
                return clone;
            }
            static _union(...args) {
                var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
                if (typeof target === "boolean") {
                    deep = target;
                    target = arguments[i] || {};
                    i++;
                }
                if (typeof target !== "object" && !util.Types.isFunction(target)) {
                    target = {};
                }
                for (; i < length; i++) {
                    if ((options = arguments[i]) != null) {
                        for (name in options) {
                            src = target[name];
                            copy = options[name];
                            if (target === copy) {
                                continue;
                            }
                            if (deep && copy && (util.Types.isJsonObject(copy) ||
                                (copyIsArray = Array.isArray(copy)))) {
                                if (copyIsArray) {
                                    copyIsArray = false;
                                    clone = src && Array.isArray(src) ? src : [];
                                }
                                else {
                                    clone = src && util.Types.isJsonObject(src) ? src : {};
                                }
                                target[name] = Jsons._union(deep, clone, copy);
                            }
                            else if (copy !== undefined) {
                                target[name] = copy;
                            }
                        }
                    }
                }
                return target;
            }
            ;
            static union(...jsons) {
                if (arguments.length <= 1)
                    return jsons[0];
                return this._union.apply(this, [true, {}].concat(jsons));
            }
            static minus(json1, json2) {
                if (util.Check.isEmpty(json1) || util.Check.isEmpty(json2))
                    return json1;
                let newJson = {};
                Jsons.forEach(json1, (v, k) => {
                    if (!json2.hasOwnProperty(k))
                        newJson[k] = v;
                });
                return newJson;
            }
            static intersect(json1, json2) {
                if (util.Check.isEmpty(json1) || util.Check.isEmpty(json2))
                    return json1;
                let newJson = {};
                Jsons.forEach(json1, (v, k) => {
                    if (json2.hasOwnProperty(k))
                        newJson[k] = v;
                });
                return newJson;
            }
            static filter(json, fn) {
                let newJson = {};
                Jsons.forEach(json, (v, k) => {
                    if (fn.apply(json, [v, k]))
                        newJson[k] = v;
                });
                return newJson;
            }
            static getValueByPath(data, path) {
                if (!path)
                    return data;
                const array = path.split('.');
                if (array.length == 1)
                    return data[path];
                let v = data;
                array.forEach((a) => {
                    if (v && a)
                        v = v[a];
                });
                return v;
            }
        }
        util.Jsons = Jsons;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Jsons = JS.util.Jsons;
var JS;
(function (JS) {
    let util;
    (function (util) {
        class Functions {
            static call(fb) {
                let isFn = util.Types.isFunction(fb), fn = isFn ? fb : fb.fn, ctx = isFn ? undefined : fb.ctx, args = isFn ? undefined : fb.args;
                return fn.apply(ctx, args);
            }
            static execute(code, ctx, argsExpression, args) {
                let argsList = argsExpression || '';
                return Function.constructor.apply(null, argsList.split(',').concat([code])).apply(ctx, util.Arrays.newArray(args));
            }
        }
        util.Functions = Functions;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Functions = JS.util.Functions;
var JS;
(function (JS) {
    let util;
    (function (util) {
        class Strings {
            static padStart(text, maxLength, fill) {
                let s = text || '';
                if (s.length >= maxLength)
                    return s;
                let fs = fill ? fill : ' ';
                for (let i = 0; i < maxLength; i++) {
                    let tmp = fs + s, d = tmp.length - maxLength;
                    if (d < 0) {
                        s = tmp;
                    }
                    else {
                        s = fs.substr(0, fs.length - d) + s;
                        break;
                    }
                }
                return s;
            }
            static padEnd(text, maxLength, fill) {
                let s = text || '';
                if (s.length >= maxLength)
                    return s;
                let fs = fill ? fill : ' ';
                for (let i = 0; i < maxLength; i++) {
                    let tmp = s + fs, d = tmp.length - maxLength;
                    if (d < 0) {
                        s = tmp;
                    }
                    else {
                        s += fs.substr(0, fs.length - d);
                        break;
                    }
                }
                return s;
            }
            static nodeHTML(nodeType, attrs, text) {
                let a = '';
                if (attrs)
                    util.Jsons.forEach(attrs, (v, k) => {
                        if (v !== void 0)
                            a += ` ${k}="${v || ''}"`;
                    });
                return `<${nodeType}${a}>${text || ''}</${nodeType}>`;
            }
            static escapeHTML(html) {
                if (!html)
                    return '';
                let chars = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;',
                    '/': '&#x2F;',
                    '`': '&#x60;',
                    '=': '&#x3D;'
                };
                return html.replace(/[&<>"'`=\/]/g, function (s) {
                    return chars[s];
                });
            }
            static format(tpl, ...data) {
                if (!tpl)
                    return tpl;
                let i = 0;
                data = data || [];
                return tpl.replace(/\%(%|s|b|d|f|n)/gm, (s, ...args) => {
                    let v = i >= data.length ? '' : data[i++];
                    switch (args[0]) {
                        case 'b': {
                            v = Boolean(v).toString();
                            break;
                        }
                        case 'd': {
                            v = Number(v).toInt().toString();
                            break;
                        }
                        case 'f': {
                            v = Number(v).stringfy();
                            break;
                        }
                        case 'n': {
                            v = '\n';
                            break;
                        }
                        case '%': {
                            v = '%';
                        }
                    }
                    return v;
                });
            }
            static merge(tpl, data) {
                if (!tpl || !data)
                    return tpl;
                return tpl.replace(/\{(\w+)\}/g, (str, ...args) => {
                    let m = args[0], s = data[m];
                    return s === undefined ? str : (util.Types.isFunction(s) ? s(data, str, m) : (s == null ? '' : String(s)));
                });
            }
        }
        util.Strings = Strings;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Strings = JS.util.Strings;
var JS;
(function (JS) {
    let util;
    (function (util) {
        class Konsole {
            static clear() {
                console.clear();
            }
            static count(label) {
                console.count(label);
            }
            static countReset(label) {
                console.countReset(label);
            }
            static time(label) {
                console.time(label);
            }
            static timeEnd(label) {
                console.timeEnd(label);
            }
            static trace(data, css) {
                if (!data)
                    console.trace();
                let arr = [data];
                if (typeof data == 'string' && css)
                    arr[arr.length] = css;
                console.trace.apply(null, arr);
            }
            static text(data, css) {
                typeof css ? console.log('%c' + data, css) : console.log(data);
            }
            static _print(d) {
                typeof d == 'string' ? console.log(d) : console.dirxml(d);
            }
            static print(...data) {
                data.forEach(d => {
                    this._print(d);
                });
            }
        }
        util.Konsole = Konsole;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Konsole = JS.util.Konsole;
var JS;
(function (JS) {
    let util;
    (function (util) {
        let LogLevel;
        (function (LogLevel) {
            LogLevel[LogLevel["ALL"] = 6] = "ALL";
            LogLevel[LogLevel["TRACE"] = 5] = "TRACE";
            LogLevel[LogLevel["DEBUG"] = 4] = "DEBUG";
            LogLevel[LogLevel["INFO"] = 3] = "INFO";
            LogLevel[LogLevel["WARN"] = 2] = "WARN";
            LogLevel[LogLevel["ERROR"] = 1] = "ERROR";
            LogLevel[LogLevel["OFF"] = 0] = "OFF";
        })(LogLevel = util.LogLevel || (util.LogLevel = {}));
        let LogLevels = ['OFF', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE', 'ALL'], LogLevelStyles = [
            '',
            'color:red;background-color:#fff0f0;',
            'color:orange;background-color:#fffbe6;',
            'color:black;background-color:white;',
            'color:white;background-color:gray;',
            'color:white;background-color:black;',
            ''
        ];
        class ConsoleAppender {
            constructor(name) {
                this.name = '';
                this.name = name;
            }
            log(level, ...data) {
                this._log(LogLevels[level], LogLevelStyles[level], data);
            }
            _log(cmd, css, data) {
                console.group(`%c${cmd} ${this.name ? '[' + this.name + '] ' : ''}${new Date().toISOString()}`, css);
                if (data)
                    data.forEach(a => {
                        cmd != 'INFO' && cmd != 'WARN' ? util.Konsole.trace(a) : util.Konsole.print(a);
                    });
                console.groupEnd();
            }
        }
        util.ConsoleAppender = ConsoleAppender;
        class Log {
            constructor(name, level, appender) {
                this._appender = !appender ? new ConsoleAppender(name) : Class.newInstance(appender, name);
                this.level = level || LogLevel.ALL;
                this._name = name;
            }
            name() {
                return this._name;
            }
            _log(level, data) {
                if (level <= this.level) {
                    this._appender.log.apply(this._appender, [level].concat(data));
                }
            }
            trace(...data) {
                this._log(LogLevel.TRACE, data);
            }
            debug(...data) {
                this._log(LogLevel.DEBUG, data);
            }
            info(...data) {
                this._log(LogLevel.INFO, data);
            }
            warn(...data) {
                this._log(LogLevel.WARN, data);
            }
            error(...data) {
                this._log(LogLevel.ERROR, data);
            }
            clear() {
                this._appender.clear();
            }
        }
        util.Log = Log;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var LogLevel = JS.util.LogLevel;
var Log = JS.util.Log;
let JSLogger = new Log(`JSDK ${JS.version}`, LogLevel.INFO);
Konsole.text(`Welcome to JSDK ${JS.version}`, `font-weight:bold;color:blue;text-shadow:1px 1px 1px #D2E9FF;`);
var JS;
(function (JS) {
    let lang;
    (function (lang) {
        let AnnotationTarget;
        (function (AnnotationTarget) {
            AnnotationTarget[AnnotationTarget["ANY"] = 1] = "ANY";
            AnnotationTarget[AnnotationTarget["CLASS"] = 2] = "CLASS";
            AnnotationTarget[AnnotationTarget["FIELD"] = 4] = "FIELD";
            AnnotationTarget[AnnotationTarget["METHOD"] = 8] = "METHOD";
            AnnotationTarget[AnnotationTarget["PARAMETER"] = 16] = "PARAMETER";
        })(AnnotationTarget = lang.AnnotationTarget || (lang.AnnotationTarget = {}));
        class Annotation extends Function {
        }
        lang.Annotation = Annotation;
        class Annotations {
            static getPropertyType(obj, propertyKey) {
                return Reflect.getMetadata('design:type', obj, propertyKey);
            }
            static getValue(anno, obj, propertyKey) {
                return Reflect.getMetadata(anno.name, obj, propertyKey);
            }
            static setValue(annoName, metaValue, obj, propertyKey) {
                Reflect.defineMetadata(typeof annoName == 'string' ? annoName : annoName.name, metaValue, obj, propertyKey);
            }
            static hasAnnotation(anno, obj, propertyKey) {
                return Reflect.hasMetadata(anno.name, obj, propertyKey);
            }
            static getAnnotations(obj) {
                return Reflect.getMetadataKeys(obj);
            }
            static define(definition, params) {
                let args = Arrays.newArray(params), isStr = Types.isString(definition), annoName = isStr ? definition : definition.name, handler = isStr ? null : definition.handler, target = (isStr ? AnnotationTarget.ANY : definition.target) || AnnotationTarget.ANY, fn = function (anno, values, obj, key, d) {
                    if (0 == (target & AnnotationTarget.ANY)) {
                        if (Types.equalKlass(obj)) {
                            if (0 == (target & AnnotationTarget.CLASS))
                                return _wrongTarget(anno, obj.name);
                        }
                        else if (key) {
                            if (Types.isFunction(obj[key])) {
                                if (0 == (target & AnnotationTarget.METHOD))
                                    return _wrongTarget(anno, obj.constructor.name, key, 'method');
                            }
                            else {
                                if (0 == (target & AnnotationTarget.FIELD))
                                    return _wrongTarget(anno, obj.constructor.name, key, 'field');
                            }
                        }
                    }
                    Annotations.setValue(anno, values, obj, key);
                    if (handler)
                        handler.apply(null, [anno, values, obj, key, d]);
                };
                if (Types.equalKlass(args[0])) {
                    let obj = args[0];
                    let detor = function (tar) {
                        fn.call(null, annoName, undefined, tar);
                    };
                    return Reflect.decorate([detor], obj);
                }
                else if (args.length == 3 && args[0]['constructor']) {
                    let obj = args[0], key = args[1], desc = args[2];
                    let detor = function (tar, k) {
                        fn.call(null, annoName, undefined, tar, k, desc);
                    };
                    return Reflect.decorate([detor], obj, key);
                }
                let values = args;
                return function (tar, key, d) {
                    fn.call(null, annoName, values, tar, key, d);
                };
            }
        }
        lang.Annotations = Annotations;
        var _wrongTarget = function (anno, klass, key, type) {
            JSLogger.error(key ?
                `A [${anno}] annotation should not be marked on the '${key}' ${type} of ${klass}.`
                :
                    `A [${anno}] annotation should not be marked on the '${klass}' class.`);
        };
        var _getClassName = function (klass) {
            let clazz = klass.class;
            return clazz ? clazz.name : klass.name;
        };
        function deprecated(info) {
            return Annotations.define({
                name: 'deprecated',
                handler: (anno, values, obj, propertyKey) => {
                    let info = values ? (values[0] || '') : '', text = null;
                    if (Types.equalKlass(obj)) {
                        let name = _getClassName(obj);
                        text = `The [${name}] class`;
                    }
                    else {
                        let klass = obj.constructor, name = _getClassName(klass);
                        text = `The [${propertyKey}] ${Types.isFunction(obj[propertyKey]) ? 'method' : 'field'} of ${name}`;
                    }
                    JSLogger.warn(text + ' has been deprecated. ' + info);
                }
            }, arguments);
        }
        lang.deprecated = deprecated;
        var _aop = function (args, fn, anno) {
            return Annotations.define({
                name: anno,
                handler: (anno, values, obj, methodName) => {
                    let adv = {};
                    if (Types.isFunction(values[0])) {
                        adv[anno] = values[0];
                    }
                    else {
                        adv = values[0];
                        if (!adv)
                            return;
                    }
                    Class.aop(obj.constructor, methodName, adv);
                },
                target: AnnotationTarget.METHOD
            }, args);
        };
        function before(fn) {
            return _aop(arguments, fn, 'before');
        }
        lang.before = before;
        function after(fn) {
            return _aop(arguments, fn, 'after');
        }
        lang.after = after;
        function around(fn) {
            return _aop(arguments, fn, 'around');
        }
        lang.around = around;
        function throws(fn) {
            return _aop(arguments, fn, 'throws');
        }
        lang.throws = throws;
        function aop(advisor) {
            return _aop(arguments, advisor);
        }
        lang.aop = aop;
    })(lang = JS.lang || (JS.lang = {}));
})(JS || (JS = {}));
var AnnotationTarget = JS.lang.AnnotationTarget;
var Annotation = JS.lang.Annotation;
var Annotations = JS.lang.Annotations;
var deprecated = JS.lang.deprecated;
var before = JS.lang.before;
var after = JS.lang.after;
var around = JS.lang.around;
var throws = JS.lang.throws;
var aop = JS.lang.aop;
var JS;
(function (JS) {
    let reflect;
    (function (reflect) {
        function klass(fullName) {
            return Annotations.define({
                name: 'klass',
                handler: (anno, values, obj) => {
                    Class.register(obj, values[0]);
                },
                target: AnnotationTarget.CLASS
            }, [fullName]);
        }
        reflect.klass = klass;
        class Method {
            constructor(clazz, name, isStatic, fn, paramTypes, returnType) {
                this.isStatic = false;
                this.annotations = [];
                this.parameterAnnotations = [];
                this.ownerClass = clazz;
                this.name = name;
                this.paramTypes = paramTypes;
                this.returnType = returnType;
                this.fn = fn;
                this.isStatic = isStatic;
            }
            invoke(obj, ...args) {
                let fn = this.isStatic ? this.ownerClass.getKlass() : this.fn, context = this.isStatic ? this.ownerClass.getKlass() : obj;
                return Reflect.apply(fn, context, args);
            }
        }
        reflect.Method = Method;
        class Field {
            constructor(clazz, name, isStatic, type) {
                this.isStatic = false;
                this.annotations = [];
                this.ownerClass = clazz;
                this.name = name;
                this.type = type;
                this.isStatic = isStatic;
            }
            set(value, obj) {
                let target = this.isStatic ? this.ownerClass.getKlass() : obj;
                target[this.name] = value;
            }
            get(obj) {
                let target = this.isStatic ? this.ownerClass.getKlass() : obj;
                return target[this.name];
            }
        }
        reflect.Field = Field;
        class Class {
            constructor(name, klass) {
                this._methods = {};
                this._fields = {};
                this.name = name;
                klass.class = this;
                this._klass = klass;
                this.shortName = this._klass.name;
                this._superklass = Class.getSuperklass(this._klass);
                this._init();
            }
            static getSuperklass(klass) {
                if (Object === klass)
                    return null;
                let sup = Object.getPrototypeOf(klass);
                return Object.getPrototypeOf(Object) === sup ? Object : sup;
            }
            static _reflectable(obj, className) {
                obj.className = className;
                if (!obj.getClass) {
                    obj.getClass = function () {
                        return Class.forName(this.className);
                    };
                }
            }
            static byName(name) {
                if (!name)
                    return null;
                var p = name.split('.'), len = p.length, p0 = p[0], b = window[p0] || eval(p0);
                if (!b)
                    throw new TypeError('Can\'t found class:' + name);
                for (var i = 1; i < len; i++) {
                    var pi = p[i];
                    if (!pi)
                        break;
                    b[pi] = b[pi] || {};
                    b = b[pi];
                }
                return b;
            }
            static newInstance(ctor, ...args) {
                let tar = Types.isString(ctor) ? Class.byName(ctor) : ctor;
                if (!tar)
                    throw new Errors.NotFoundError(`The class<${ctor}> is not found!`);
                return Reflect.construct(tar, Jsons.clone(args));
            }
            static aliasInstance(alias, ...args) {
                let cls = Class.forName(alias, true);
                if (!cls)
                    throw new Errors.NotFoundError(`The class<${alias}> is not found!`);
                return cls.newInstance.apply(cls, args);
            }
            static aop(klass, method, advisor) {
                let isStatic = klass.hasOwnProperty(method), m = isStatic ? klass[method] : klass.prototype[method];
                if (!Types.isFunction(m))
                    return;
                let obj = isStatic ? klass : klass.prototype;
                if (!obj.hasOwnProperty('__' + method))
                    obj['__' + method] = m;
                Object.defineProperty(obj, method, {
                    value: m.aop(advisor),
                    writable: true
                });
            }
            static cancelAop(klass, method) {
                let isStatic = klass.hasOwnProperty(method), m = isStatic ? klass[method] : klass.prototype[method];
                if (!Types.isFunction(m))
                    return;
                let obj = isStatic ? klass : klass.prototype;
                obj[method] = obj['__' + method];
            }
            aop(method, advisor) {
                let m = this.method(method);
                if (!m)
                    return;
                let pro = m.isStatic ? this._klass : this._klass.prototype;
                pro[method] = m.fn.aop(advisor);
            }
            _cancelAop(m) {
                let pro = m.isStatic ? this._klass : this._klass.prototype;
                pro[m.name] = m.fn;
            }
            cancelAop(method) {
                let ms = method ? [this.method(method)] : this.methods();
                ms.forEach(m => {
                    this._cancelAop(m);
                });
            }
            equals(cls) {
                return cls && this.getKlass() === cls.getKlass();
            }
            equalsKlass(cls) {
                return cls && this.getKlass() === cls;
            }
            subclassOf(cls) {
                let klass = (cls.constructor && cls.constructor === Class) ? cls.getKlass() : cls;
                return Types.subKlass(this.getKlass(), klass);
            }
            newInstance(...args) {
                let obj = Reflect.construct(this._klass, Arrays.newArray(arguments));
                Class._reflectable(obj, this.name);
                return obj;
            }
            getSuperclass() {
                if (this === Object.class)
                    return null;
                return this._superklass ? this._superklass.class : Object.class;
            }
            getKlass() {
                return this._klass.prototype.constructor;
            }
            _parseStaticMembers(ctor) {
                let mKeys = ctor === Object ? ['class'] : Reflect.ownKeys(ctor);
                for (let i = 0, len = mKeys.length; i < len; i++) {
                    const key = mKeys[i].toString();
                    if (!this._isValidStatic(key))
                        continue;
                    const obj = ctor[key];
                    if (Types.isFunction(obj)) {
                        this._methods[key] = new Method(this, key, true, obj, null, null);
                    }
                    else {
                        this._fields[key] = new Field(this, key, true, Types.type(obj));
                    }
                }
            }
            _parseInstanceMembers(proto) {
                let protoKeys = proto === Object.prototype ? ['toString'] : Reflect.ownKeys(proto);
                for (let i = 0, len = protoKeys.length; i < len; i++) {
                    const key = protoKeys[i].toString();
                    if (!this._isValidInstance(key))
                        continue;
                    const obj = this._forceProto(proto, key);
                    if (Types.isFunction(obj)) {
                        this._methods[key] = new Method(this, key, false, obj, null, null);
                    }
                    else {
                        this._fields[key] = new Field(this, key, false, Types.type(obj));
                    }
                }
            }
            _forceProto(proto, key) {
                let rst;
                try {
                    rst = proto[key];
                }
                catch (e) {
                    if (this._klass === File) {
                        if (key == 'lastModified')
                            return 0;
                        if (key == 'lastModifiedDate')
                            return new Date();
                    }
                    try {
                        let obj = this.newInstance();
                        return obj[key];
                    }
                    catch (e1) {
                        return '';
                    }
                }
                return rst;
            }
            _isValidStatic(mName) {
                return ['prototype', 'name', 'length'].findIndex(v => {
                    return v == mName;
                }) < 0;
            }
            _isValidInstance(mName) {
                return !mName.startsWith('__') && mName != 'constructor';
            }
            _init() {
                this._parseStaticMembers(this._klass);
                this._parseInstanceMembers(this._klass.prototype);
            }
            _toArray(json) {
                let arr = [];
                Jsons.forEach(json, v => {
                    arr[arr.length] = v;
                });
                return arr;
            }
            method(name) {
                return this.methodsMap()[name];
            }
            methodsMap() {
                return this._methods;
            }
            methods() {
                return this._toArray(this.methodsMap());
            }
            field(name, instance) {
                return this.fieldsMap(instance)[name];
            }
            _instanceFields(instance) {
                let instanceFields = {};
                let keys = Reflect.ownKeys(instance);
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i].toString();
                    if (this._isValidInstance(key)) {
                        const obj = instance[key];
                        if (!Types.isFunction(obj))
                            instanceFields[key] = new Field(this, key, false, Types.type(obj));
                    }
                }
                this._fields = Jsons.union(instanceFields, this._fields);
            }
            fieldsMap(instance, anno) {
                if (instance)
                    this._instanceFields(instance);
                let fields = {};
                if (anno && instance) {
                    Jsons.forEach(this._fields, (field, key) => {
                        if (Annotations.hasAnnotation(anno, instance, key))
                            fields[key] = field;
                    });
                }
                else {
                    fields = this._fields;
                }
                return fields;
            }
            fields(instance, anno) {
                return this._toArray(this.fieldsMap(instance, anno));
            }
            static forName(name, isAlias) {
                if (!name)
                    return null;
                let isStr = Types.isString(name);
                if (!isStr && name.class)
                    return name.class;
                let classname = isStr ? name : name.name;
                return isAlias ? this._ALIAS_MAP[classname] : this._MAP[classname];
            }
            static all() {
                return this._MAP;
            }
            static register(klass, className, alias) {
                let name = className || klass.name, cls = this.forName(name);
                if (cls)
                    return;
                if (klass !== Object) {
                    var $P = klass.prototype;
                    $P.className = name;
                    $P.getClass = function () { return Class.forName(name); };
                }
                let cs = new Class(name, klass);
                this._MAP[name] = cs;
                if (alias)
                    this._ALIAS_MAP[alias] = cs;
            }
            static classesOf(ns) {
                if (!ns)
                    return null;
                if (ns.endsWith('.*'))
                    ns = ns.slice(0, ns.length - 2);
                let a = [];
                Jsons.forEach(this._MAP, (cls, name) => {
                    if (name.startsWith(ns))
                        a.push(cls);
                });
                return a;
            }
        }
        Class._MAP = {};
        Class._ALIAS_MAP = {};
        reflect.Class = Class;
    })(reflect = JS.reflect || (JS.reflect = {}));
})(JS || (JS = {}));
var Method = JS.reflect.Method;
var Field = JS.reflect.Field;
var Class = JS.reflect.Class;
var klass = JS.reflect.klass;
Class.register(Object);
Class.register(String);
Class.register(Boolean);
Class.register(Number);
Class.register(Array);
let $F = Function.prototype;
$F.aop = function (advisor, that) {
    let old = this, fn = function () {
        let args = Arrays.newArray(arguments), ctx = that || this, rst = undefined;
        if (advisor.before)
            advisor.before.apply(ctx, args);
        try {
            rst = advisor.around ? advisor.around.apply(ctx, [old].concat(args)) : old.apply(ctx, args);
        }
        catch (e) {
            if (advisor.throws)
                advisor.throws.apply(ctx, [e]);
        }
        if (advisor.after)
            advisor.after.apply(ctx, [rst]);
        return rst;
    };
    return fn;
};
$F.mixin = function (kls, methodNames) {
    if (!kls)
        return;
    let kp = kls.prototype, tp = this.prototype, ms = Reflect.ownKeys(kp);
    for (let i = 0, len = ms.length; i < len; i++) {
        let m = ms[i];
        if ('constructor' != m && !tp[m]) {
            if (methodNames) {
                if (methodNames.findIndex(v => { return v == m; }) > -1)
                    tp[m] = kp[m];
            }
            else {
                tp[m] = kp[m];
            }
        }
    }
};
var __decorate = function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    if (key && r && typeof target[key] == 'function')
        delete r.value;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var JS;
(function (JS) {
    let lang;
    (function (lang) {
        class JSError extends Error {
            constructor(msg, cause) {
                super(cause ? (cause.message || '') + ' -> ' + (msg || '') : msg || '');
                this.cause = null;
                this.name = this.className;
                if (cause)
                    this.cause = cause;
            }
        }
        lang.JSError = JSError;
        class NotHandledError extends JSError {
        }
        lang.NotHandledError = NotHandledError;
        class NotFoundError extends JSError {
        }
        lang.NotFoundError = NotFoundError;
        class ArithmeticError extends JSError {
        }
        lang.ArithmeticError = ArithmeticError;
        class ArgumentError extends JSError {
        }
        lang.ArgumentError = ArgumentError;
        class StateError extends JSError {
        }
        lang.StateError = StateError;
        class NetworkError extends JSError {
        }
        lang.NetworkError = NetworkError;
        class TimeoutError extends JSError {
        }
        lang.TimeoutError = TimeoutError;
    })(lang = JS.lang || (JS.lang = {}));
})(JS || (JS = {}));
var JSError = JS.lang.JSError;
var NotHandledError = JS.lang.NotHandledError;
var NotFoundError = JS.lang.NotFoundError;
var ArithmeticError = JS.lang.ArithmeticError;
var ArgumentError = JS.lang.ArgumentError;
var StateError = JS.lang.StateError;
var NetworkError = JS.lang.NetworkError;
var TimeoutError = JS.lang.TimeoutError;
var JS;
(function (JS) {
    let lang;
    (function (lang) {
        lang.Errors = {
            Error: Error,
            JSError: lang.JSError,
            URIError: URIError,
            ReferenceError: ReferenceError,
            TypeError: TypeError,
            RangeError: RangeError,
            SyntaxError: SyntaxError,
            EvalError: EvalError,
            NotHandledError: lang.NotHandledError,
            NotFoundError: lang.NotFoundError,
            ArithmeticError: lang.ArithmeticError,
            ArgumentError: lang.ArgumentError,
            StateError: lang.StateError,
            NetworkError: lang.NetworkError,
            TimeoutError: lang.TimeoutError
        };
    })(lang = JS.lang || (JS.lang = {}));
})(JS || (JS = {}));
var Errors = JS.lang.Errors;
var JS;
(function (JS) {
    let util;
    (function (util) {
        let _URI_REG = /^(([^\:\/\?\#]+)\:)?(\/\/([^\/\?\#]*))?([^\?\#]*)(\\?([^\#]*))?(\#(.*))?/;
        let _AUTH_REG = /^(([^\:@]*)(\:([^\:@]*))?@)?([^\:@]*)(\:(\d{1,3}))?/;
        let _ADU = null;
        class URI {
            constructor(cfg) {
                this._scheme = null;
                this._user = null;
                this._pwd = null;
                this._host = null;
                this._port = null;
                this._path = null;
                this._params = null;
                this._frag = null;
                this._parse(cfg);
            }
            _parse(cfg) {
                if (util.Types.isString(cfg)) {
                    this._parseStr(cfg);
                }
                else if (cfg && cfg.href) {
                    this._parseStr(cfg.href);
                }
                else if (cfg) {
                    let uri = cfg;
                    this.scheme(uri.scheme ? uri.scheme : 'http');
                    this.user(uri.user);
                    this.password(uri.password);
                    this.host(uri.host);
                    this.port(util.Types.isDefined(uri.port) ? uri.port : 80);
                    this.path(uri.path);
                    this._params = uri.params;
                    this.fragment(uri.fragment);
                }
            }
            _parseStr(uri) {
                let array = _URI_REG.exec(uri);
                if (!array)
                    throw new Errors.URIError('URI maybe an invalid format: ' + uri);
                this._scheme = array[2];
                this._frag = array[9];
                let auth = array[4];
                if (auth) {
                    let authArr = _AUTH_REG.exec(auth);
                    if (!authArr)
                        throw new Errors.TypeError('Auth part of URI maybe an invalid format: ' + uri);
                    if (authArr[2])
                        this._user = authArr[2];
                    if (authArr[4])
                        this._pwd = authArr[4];
                    if (authArr[5])
                        this._host = authArr[5];
                    if (util.Types.isDefined(authArr[7]))
                        this._port = parseInt(authArr[7]);
                }
                let path = array[5];
                if (path && path != '/') {
                    if (!this.isAbsolute() && path.startsWith('/') && !uri.startsWith('/'))
                        path = path.slice(1);
                    this.path(path);
                }
                let query = array[7];
                if (query)
                    this._params = URI.parseQueryString(query);
            }
            userinfo() {
                return this._user ? this._user + (this._pwd ? (':' + this._pwd) : '') : '';
            }
            fragment(str) {
                if (arguments.length == 0)
                    return this._frag;
                this._frag = str || '';
                return this;
            }
            queryString(str) {
                if (arguments.length == 0) {
                    if (!this._params)
                        return null;
                    let query = '';
                    util.Jsons.forEach(this._params, (v, k) => {
                        query += `${query ? '&' : ''}${k}=${v}`;
                    });
                    return query;
                }
                this._params = URI.parseQueryString(str);
                return this;
            }
            path(str) {
                if (arguments.length == 0)
                    return this._path;
                this._path = str || null;
                return this;
            }
            port(port) {
                if (arguments.length == 0)
                    return this._port;
                this._port = port;
                return this;
            }
            host(str) {
                if (arguments.length == 0)
                    return this._host;
                this._host = str || '';
                return this;
            }
            user(str) {
                if (arguments.length == 0)
                    return this._user;
                this._user = str || '';
                return this;
            }
            password(str) {
                if (arguments.length == 0)
                    return this._pwd;
                this._pwd = str || '';
                return this;
            }
            scheme(str) {
                if (arguments.length == 0)
                    return this._scheme;
                this._scheme = str || '';
                return this;
            }
            query(key, value, encode) {
                if (!this._params)
                    this._params = {};
                if (arguments.length > 1) {
                    value = value || '';
                    this._params[key] = encode ? encodeURIComponent(value) : value;
                    return this;
                }
                return decodeURIComponent(this._params[key]);
            }
            queryObject(params, encode) {
                if (arguments.length == 0)
                    return this._params;
                util.Jsons.forEach(params, (value, key) => {
                    this.query(key, value, encode);
                });
                return this;
            }
            isAbsolute() {
                return this._host ? true : false;
            }
            toAbsolute() {
                let userinfo = this.userinfo(), port = util.Types.isDefined(this._port) ? ':' + this._port : '', path = this.path() || '', query = this.queryString() || '', fragment = this._frag ? '#' + this._frag : '';
                path = path + (!query && !fragment ? '' : '?' + query + fragment);
                return (this._scheme || 'http') + '://' + (userinfo ? userinfo + '@' : '') + (this._host || '') + port + (!path || path.startsWith('/') ? path : ('/' + path));
            }
            toRelative() {
                let query = this.queryString() || '', fragment = this._frag ? '#' + this._frag : '';
                return (this._path || '') + (!query && !fragment ? '' : '?' + query + fragment);
            }
            toString() {
                return this.isAbsolute() ? this.toAbsolute() : this.toRelative();
            }
            static getAbsoluteDir() {
                if (_ADU)
                    return _ADU;
                var div = document.createElement('div');
                div.innerHTML = '<a href="./"></a>';
                _ADU = div.firstChild['href'];
                div = null;
                return _ADU;
            }
            static toAbsoluteURL(url) {
                if (url.startsWith('http://') || url.startsWith('https://'))
                    return url;
                let loc = self.location;
                if (url.startsWith('/'))
                    return loc.origin + url;
                let p = loc.pathname || '/';
                if (p)
                    p = p.slice(0, p.lastIndexOf('/') + 1);
                return this.getAbsoluteDir() + url;
            }
            static toQueryString(json, encode) {
                if (!json)
                    return '';
                let q = '';
                util.Jsons.forEach(json, (v, k) => {
                    q += `&${k}=${encode ? encodeURIComponent(v) : v}`;
                });
                return q;
            }
            static parseQueryString(query, decode) {
                if (util.Check.isEmpty(query))
                    return {};
                let q = query.startsWith('?') ? query.slice(1) : query, ps = {}, arr = q.split('&');
                arr.forEach(function (v) {
                    if (v) {
                        let kv = v.split('=');
                        ps[kv[0]] = decode ? decodeURIComponent(kv[1]) : kv[1];
                    }
                });
                return ps;
            }
        }
        util.URI = URI;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var URI = JS.util.URI;
var JS;
(function (JS) {
    let util;
    (function (util) {
        class Locales {
            static lang(locale) {
                if (!locale)
                    return null;
                let arr = locale.split('-');
                if (arr.length == 1)
                    return locale;
                return arr[0];
            }
            static country(locale) {
                if (!locale)
                    return null;
                let arr = locale.split('-');
                if (arr.length == 1)
                    return null;
                return arr[1];
            }
        }
        util.Locales = Locales;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Locales = JS.util.Locales;
var JS;
(function (JS) {
    let util;
    (function (util) {
        class Bundle {
            constructor(res, locale) {
                let lc = (locale == void 0 ? System.info().locale : locale);
                this._data = {};
                if (res) {
                    if (util.Types.isString(res)) {
                        let pos = res.lastIndexOf('.'), suffix = pos < 0 ? '' : res.slice(pos + 1), prefix = pos < 0 ? res : res.slice(0, pos);
                        if (!this._load(lc, prefix, suffix))
                            JSLogger.error('Bundle can\'t load resource file:' + res);
                    }
                    else {
                        if (res.hasOwnProperty(lc)) {
                            this._data = res[lc];
                        }
                        else {
                            let lang = util.Locales.lang(lc);
                            this._data = res.hasOwnProperty(lang) ? res[lang] : res;
                        }
                    }
                }
                this._locale = lc;
            }
            _load(lc, prefix, suffix) {
                let paths = [];
                if (lc) {
                    let lang = util.Locales.lang(lc), country = util.Locales.country(lc);
                    if (lang && country)
                        paths.push(`_${lang}_${country}`);
                    paths.push(`_${lang}`);
                }
                paths.push('');
                return paths.some(p => {
                    let path = `${prefix}${p}.${suffix}`;
                    if (!util.Check.isExistUrl(path))
                        return false;
                    let xhr = self.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
                    xhr.open('GET', path, false);
                    xhr.send();
                    if (xhr.status != 200)
                        return false;
                    this._data = util.Jsons.parse(xhr.response) || {};
                    return true;
                });
            }
            get(key) {
                if (arguments.length == 0)
                    return this._data;
                return key && this._data ? this._data[key] : undefined;
            }
            getKeys() {
                return Reflect.ownKeys(this._data);
            }
            hasKey(key) {
                return this._data && this._data.hasOwnProperty(key);
            }
            getLocale() {
                return this._locale;
            }
            set(data) {
                if (data)
                    this._data = data;
                return this;
            }
        }
        util.Bundle = Bundle;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Bundle = JS.util.Bundle;
var JS;
(function (JS) {
    let util;
    (function (util) {
        class Dates {
            static isValidDate(d) {
                if (d == null)
                    return false;
                return !isNaN(new Date(d).getTime());
            }
            static equals(date1, date2) { return this.compare(date1, date2) === 0; }
            static compare(date1, date2) {
                if (!util.Types.isDefined(date1) || !util.Types.isDefined(date1))
                    throw new Errors.ArgumentError();
                return (date1 < date2) ? -1 : (date1 > date2) ? 1 : 0;
            }
            static isSameDay(day1, day2) {
                return day1.getFullYear() == day2.getFullYear() && day1.getMonth() == day2.getMonth() && day1.getDate() == day2.getDate();
            }
            static isSameTime(day1, day2, equalsMS) {
                if (equalsMS && day1.getMilliseconds() != day2.getMilliseconds())
                    return false;
                return day1.getHours() == day2.getHours() && day1.getMinutes() == day2.getMinutes() && day1.getSeconds() == day2.getSeconds();
            }
            static today() { return new Date().setZeroTime(); }
            static isLeapYear(year) {
                return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
            }
            static getDaysInMonth(year, month) {
                return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
            }
            static format(date, format, locale) {
                return new Date(date).format(format, locale);
            }
        }
        Dates.I18N_RESOURCE = {
            AM: 'AM',
            PM: 'PM',
            WEEK_DAY_NAMES: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            WEEK_DAY_SHORT_NAMES: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            MONTH_NAMES: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            MONTH_SHORT_NAMES: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        };
        util.Dates = Dates;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Dates = JS.util.Dates;
(function () {
    var $D = Date, $P = $D.prototype, pad = function (s, l) {
        new Date();
        if (!l) {
            l = 2;
        }
        return ("000" + s).slice(l * -1);
    };
    $P.getWeek = function () {
        let date0 = new Date(this.getFullYear(), 0, 1), diff = Math.round((this.valueOf() - date0.valueOf()) / 86400000);
        return Math.ceil((diff + ((date0.getDay() + 1) - 1)) / 7);
    };
    $P.setWeek = function (week, dayOfWeek) {
        let dw = Types.isDefined(dayOfWeek) ? dayOfWeek : 1;
        return this.setTime(this.getDayOfWeek(dw).add(week - this.getWeek(), 'w').getTime());
    };
    $P.clone = function () { return new Date(this.getTime()); };
    $P.setZeroTime = function () {
        this.setHours(0);
        this.setMinutes(0);
        this.setSeconds(0);
        this.setMilliseconds(0);
        return this;
    };
    $P.setLastTime = function () {
        this.setHours(23);
        this.setMinutes(59);
        this.setSeconds(59);
        this.setMilliseconds(999);
        return this;
    };
    $P.setNowTime = function () {
        var n = new Date();
        this.setHours(n.getHours());
        this.setMinutes(n.getMinutes());
        this.setSeconds(n.getSeconds());
        this.setMilliseconds(n.getMilliseconds());
        return this;
    };
    $P.compareTo = function (date) { return Dates.compare(this, date); };
    $P.equals = function (date) { return Dates.equals(this, date || new Date()); };
    $P.between = function (start, end) { return this.getTime() >= start.getTime() && this.getTime() <= end.getTime(); };
    $P.isAfter = function (date) { return this.compareTo(date || new Date()) === 1; };
    $P.isBefore = function (date) { return (this.compareTo(date || new Date()) === -1); };
    $P.isSameDay = function (date) { return Dates.isSameDay(this, date); };
    $P.isSameTime = function (date, equalsMS) { return Dates.isSameTime(this, date, equalsMS); };
    $P.isToday = function () { return this.isSameDay(new Date()); };
    $P.add = function (v, type) {
        if (v == 0)
            return this;
        switch (type) {
            case 'ms': {
                this.setMilliseconds(this.getMilliseconds() + v);
                return this;
            }
            case 's': {
                return this.add(v * 1000, 'ms');
            }
            case 'm': {
                return this.add(v * 60000, 'ms');
            }
            case 'h': {
                return this.add(v * 3600000, 'ms');
            }
            case 'd': {
                this.setDate(this.getDate() + v);
                return this;
            }
            case 'w': {
                return this.add(v * 7, 'd');
            }
            case 'M': {
                var n = this.getDate();
                this.setDate(1);
                this.setMonth(this.getMonth() + v);
                this.setDate(Math.min(n, Dates.getDaysInMonth(this.getFullYear(), this.getMonth())));
                return this;
            }
            case 'y': {
                return this.add(v * 12, 'M');
            }
        }
        return this;
    };
    $P.setTimezoneOffset = function (offset) {
        var here = this.getTimezoneOffset(), there = Number(offset) * -6 / 10;
        return this.add(there - here, 'm');
    };
    $P.formatTimezoneOffset = function () {
        var n = this.getTimezoneOffset() * -10 / 6, r;
        if (n < 0) {
            r = (n - 10000).toString();
            return r.charAt(0) + r.substr(2);
        }
        else {
            r = (n + 10000).toString();
            return "+" + r.substr(1);
        }
    };
    let validate = function (n, min, max) {
        if (!Types.isDefined(n)) {
            return false;
        }
        else if (n < min || n > max) {
            throw new RangeError(n + ' is not a valid value');
        }
        return true;
    };
    $P.set = function (config) {
        if (validate(config.millisecond, 0, 999)) {
            this.add(config.millisecond - this.getMilliseconds(), 'ms');
        }
        if (validate(config.second, 0, 59)) {
            this.add(config.second - this.getSeconds(), 's');
        }
        if (validate(config.minute, 0, 59)) {
            this.add(config.minute - this.getMinutes(), 'm');
        }
        if (validate(config.hour, 0, 23)) {
            this.add(config.hour - this.getHours(), 'h');
        }
        if (validate(config.day, 1, Dates.getDaysInMonth(this.getFullYear(), this.getMonth()))) {
            this.add(config.day - this.getDate(), 'd');
        }
        if (validate(config.week, 0, 53)) {
            this.setWeek(config.week);
        }
        if (validate(config.month, 0, 11)) {
            this.add(config.month - this.getMonth(), 'M');
        }
        if (validate(config.year, 0, 9999)) {
            this.add(config.year - this.getFullYear(), 'y');
        }
        if (config.timezoneOffset) {
            this.setTimezoneOffset(config.timezoneOffset);
        }
        return this;
    };
    $P.getFirstDayOfMonth = function () { return this.clone().set({ day: 1 }); };
    $P.getLastDayOfMonth = function () { return this.clone().set({ day: Dates.getDaysInMonth(this.getFullYear(), this.getMonth()) }); };
    $P.getDayOfWeek = function (dayOfWeek) {
        let d2 = Types.isDefined(dayOfWeek) ? dayOfWeek : 1, d1 = this.getDay();
        if (d2 == 0)
            d2 = 7;
        if (d1 == 0)
            d1 = 7;
        return this.clone().add((d2 - d1) % 7, 'd');
    };
    $P.diff = function (date) {
        return (date || new Date()) - this;
    };
    $P.format = function (format, locale) {
        let x = this, fmt = format || 'YYYY-MM-DD HH:mm:ss', bundle = new Bundle(Dates.I18N_RESOURCE, locale);
        return fmt.replace(/YYYY|YY|MMMM|MMM|MM|M|DD|D|hh|h|HH|H|mm|m|ss|s|dddd|ddd|A/g, function (m) {
            switch (m) {
                case "YYYY":
                    return pad(x.getFullYear(), 4);
                case "YY":
                    return pad(x.getFullYear());
                case "MMMM":
                    return bundle.get('MONTH_NAMES')[x.getMonth()];
                case "MMM":
                    return bundle.get('MONTH_SHORT_NAMES')[x.getMonth()];
                case "MM":
                    return pad((x.getMonth() + 1));
                case "M":
                    return x.getMonth() + 1;
                case "DD":
                    return pad(x.getDate());
                case "D":
                    return x.getDate();
                case "hh":
                    {
                        let h = x.getHours();
                        return pad(h < 13 ? (h === 0 ? 12 : h) : (h - 12));
                    }
                case "h":
                    {
                        let h = x.getHours();
                        return h < 13 ? (h === 0 ? 12 : h) : (h - 12);
                    }
                case "HH":
                    return pad(x.getHours());
                case "H":
                    return x.getHours();
                case "mm":
                    return pad(x.getMinutes());
                case "m":
                    return x.getMinutes();
                case "ss":
                    return pad(x.getSeconds());
                case "s":
                    return x.getSeconds();
                case "dddd":
                    return bundle.get('WEEK_DAY_NAMES')[x.getDay()];
                case "ddd":
                    return bundle.get('WEEK_DAY_SHORT_NAMES')[x.getDay()];
                case "A":
                    return bundle.get(x.getHours() < 12 ? 'AM' : 'PM');
                default:
                    return m;
            }
        });
    };
}());
Class.register(Date);
(function () {
    var $N = Number.prototype;
    $N.stringfy = function () {
        if (this.isNaN())
            return null;
        if (this.isZero())
            return '0';
        let t = this.toString(), m = t.match(/^(\+|\-)?(\d+)\.?(\d*)[Ee](\+|\-)(\d+)$/);
        if (!m)
            return t;
        let zhe = m[2], xiao = m[3], zhi = Number(m[5]), fu = m[1] == '-' ? '-' : '', zfu = m[4], ws = (zfu == '-' ? -1 : 1) * zhi - xiao.length, n = zhe + xiao;
        if (ws == 0)
            return fu + n;
        if (ws > 0)
            return fu + n + Strings.padEnd('', ws, '0');
        let dws = n.length + ws;
        if (dws <= 0)
            return fu + '0.' + Strings.padEnd('', -1 * dws, '0') + n;
        return n.slice(0, dws - 1) + '.' + n.slice(dws);
    };
    $N.round = function (digit) {
        if (this.isNaN() || this.isInt() || !Number.isFinite(digit))
            return this;
        let d = digit || 0, pow = Math.pow(10, d);
        return Math.round(this * pow) / pow;
    };
    $N.toInt = function () {
        return this.round(0);
    };
    $N.format = function (dLen) {
        let d = dLen == void 0 || !Number.isFinite(dLen) ? this.fractionLength() : dLen, s = this.round(d).abs().stringfy(), sign = this.isNegative() ? '-' : '';
        let sn = Number(s);
        if (sn.isInt())
            return sign + sn.toLocaleString() + (d < 1 ? '' : '.' + Strings.padEnd('', d, '0'));
        let p = s.indexOf('.'), ints = s.slice(0, p), digs = s.slice(p + 1);
        return sign + Number(ints).toLocaleString() + '.' + Strings.padEnd(digs, d, '0');
    };
    $N.equals = function (n, dLen) {
        if (this.isNaN())
            throw new Errors.TypeError('This number is NaN!');
        let num = Number(n);
        if (num.isNaN())
            throw new Errors.TypeError('The compared number is NaN!');
        return this.round(dLen).valueOf() == num.round(dLen).valueOf();
    };
    $N.add = function (n) {
        const v = Number(n);
        if (this.valueOf() == 0)
            return v;
        if (v.valueOf() == 0)
            return this;
        if (this.isInt() && v.isInt())
            return this.valueOf() + v.valueOf();
        let m = Math.pow(10, Math.max(this.fractionLength(), v.fractionLength())), n1 = this.mul(m).valueOf(), n2 = v.mul(m).valueOf();
        return (n1 + n2) / m;
    };
    $N.sub = function (n) {
        const v = Number(n);
        if (v.valueOf() == 0)
            return this;
        if (this.isInt() && v.isInt())
            return this.valueOf() - v.valueOf();
        let m = Math.pow(10, Math.max(this.fractionLength(), v.fractionLength())), n1 = this.mul(m).valueOf(), n2 = v.mul(m).valueOf();
        return (n1 - n2) / m;
    };
    $N.mul = function (n) {
        if (this.valueOf() == 0)
            return 0;
        const v = Number(n);
        if (v.valueOf() == 0)
            return 0;
        if (this.isInt() && v.isInt())
            return v.valueOf() * this.valueOf();
        let s1 = this.stringfy(this), s2 = v.stringfy(), m1 = s1.indexOf('.') >= 0 ? s1.split(".")[1].length : 0, m2 = s2.indexOf('.') >= 0 ? s2.split(".")[1].length : 0, n1 = Number(s1.replace('.', '')), n2 = Number(s2.replace('.', ''));
        return n1 * n2 / Math.pow(10, m1 + m2);
    };
    $N.div = function (n) {
        if (this.valueOf() == 0)
            return 0;
        const v = Number(n);
        if (v.valueOf() == 0)
            throw new Errors.ArithmeticError('Can not divide an Zero.');
        let s1 = this.stringfy(), s2 = v.stringfy(), m1 = s1.indexOf('.') >= 0 ? s1.split(".")[1].length : 0, m2 = s2.indexOf('.') >= 0 ? s2.split(".")[1].length : 0, n1 = Number(s1.replace('.', '')), n2 = Number(s2.replace('.', ''));
        return (n1 / n2) * Math.pow(10, m2 - m1);
    };
    $N.isNaN = function () {
        return isNaN(this);
    };
    $N.isFinite = function () {
        return isFinite(this);
    };
    $N.isZero = function () {
        return this == 0;
    };
    $N.isFloat = function () {
        if (isNaN(this))
            return false;
        return !this.isInt();
    };
    $N.isInt = function () {
        return Math.floor(this) == this;
    };
    $N.isPositive = function () {
        if (isNaN(this))
            return false;
        return this > 0;
    };
    $N.isNegative = function () {
        if (isNaN(this))
            return false;
        return this < 0;
    };
    $N.isOdd = function () {
        if (!this.isInt())
            return false;
        return (this.valueOf() & 1) != 0;
    };
    $N.isEven = function () {
        if (!this.isInt())
            return false;
        return (this.valueOf() & 1) == 0;
    };
    $N.abs = function () {
        return Math.abs(this);
    };
    $N.fractionLength = function () {
        if (this.isInt() || this.isNaN())
            return 0;
        let s = this.stringfy();
        return s.slice(s.indexOf('.') + 1).length;
    };
    $N.integerLength = function () {
        if (this.isNaN())
            return 0;
        return this.abs().toFixed(0).length;
    };
}());
var JS;
(function (JS) {
    let util;
    (function (util) {
        let _opt = function (v1, opt, v2) {
            var rst = null, v = Number(v1);
            switch (opt) {
                case '+':
                    rst = v.add(v2);
                    break;
                case '-':
                    rst = v.sub(v2);
                    break;
                case '*':
                    rst = v.mul(v2);
                    break;
                case '/':
                    rst = v.div(v2);
                    break;
            }
            return rst;
        };
        class Numbers {
            static min(...numbers) {
                let m = 0;
                numbers.forEach((n, i) => {
                    if (i == 0 || n < m)
                        m = n;
                });
                return m;
            }
            static max(...numbers) {
                let m = 0;
                numbers.forEach((n, i) => {
                    if (i == 0 || n > m)
                        m = n;
                });
                return m;
            }
            static termwise(...args) {
                if (arguments.length <= 0)
                    return 0;
                if (arguments.length == 1)
                    return Number(args[0]).valueOf();
                var rst = null;
                for (var i = 1; i < args.length; i = i + 2) {
                    if (i == 1) {
                        rst = _opt(args[i - 1], args[i], args[i + 1]);
                    }
                    else {
                        rst = _opt(rst, args[i], args[i + 1]);
                    }
                }
                return rst;
            }
            static algebra(expression, values) {
                let exp = expression.replace(/\s+/g, '');
                if (values) {
                    util.Jsons.forEach(values, (n, k) => {
                        exp = exp.replace(new RegExp(k, 'g'), Number(n) + '');
                    });
                }
                exp = exp.replace(/\-{2}(\d+\.*\d*)/g, '+$1');
                exp = exp.replace(/(\(|^)\++(\d+\.*\d*)/g, '$1$2');
                exp = exp.replace(/(^|\(|\D^\))\-(\d+\.*\d*)/g, '$1(0-$2)');
                JSLogger.debug(exp);
                let opts = exp.split(/(\d+\.?\d*)/);
                opts.forEach((v, i, array) => {
                    if (v && v.length > 0) {
                        if (util.Types.isNumeric(v)) {
                            array[i] = `(Number(${v}))`;
                        }
                        else {
                            v = v.replace(/[\+\-\*\/]/g, (m) => {
                                if (m == '+') {
                                    return '.add';
                                }
                                else if (m == '-') {
                                    return '.sub';
                                }
                                else if (m == '*') {
                                    return '.mul';
                                }
                                else if (m == '/') {
                                    return '.div';
                                }
                                return m;
                            });
                            array[i] = v;
                        }
                    }
                });
                JSLogger.debug(opts.join(''));
                return eval(opts.join('')).valueOf();
            }
        }
        util.Numbers = Numbers;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Numbers = JS.util.Numbers;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var JS;
(function (JS) {
    let lang;
    (function (lang) {
        let AssertError = class AssertError extends lang.JSError {
        };
        AssertError = __decorate([
            klass('JS.lang.AssertError')
        ], AssertError);
        lang.AssertError = AssertError;
        class Assert {
            static fail(msg) {
                throw new AssertError(msg);
            }
            static failNotSameType(expected, actual, msg) {
                this.fail((msg ? msg + ' ' : '') + 'expected type:<' + expected + '> but was:<' + actual + '>');
            }
            static failNotEqual(expected, actual, msg) {
                this.fail((msg ? msg + ' ' : '') + 'expected:<' + expected + '> but was:<' + actual + '>');
            }
            static failEqual(expected, actual, msg) {
                this.fail((msg ? msg + ' ' : '') + '<' + expected + '> equals to <' + actual + '>');
            }
            static _equal(expected, actual) {
                if (expected === actual)
                    return true;
                if (Types.isArray(expected) && Types.isArray(actual) && Arrays.equal(expected, actual))
                    return true;
                if (Types.isJsonObject(expected) && Types.isJsonObject(actual) && Jsons.equal(expected, actual))
                    return true;
                return false;
            }
            static equal(expected, actual, msg) {
                if (this._equal(expected, actual))
                    return;
                this.failNotEqual(expected, actual, msg);
            }
            static notEqual(expected, actual, msg) {
                if (!this._equal(expected, actual))
                    return;
                this.failEqual(expected, actual, msg);
            }
            static sameType(expected, actual, msg) {
                let eType = Types.type(expected), aType = Types.type(actual);
                if (eType == aType)
                    return;
                this.failNotSameType(eType, aType, msg);
            }
            static notSameType(expected, actual, msg) {
                if (Types.type(expected) != Types.type(actual))
                    return;
                this.fail((msg ? msg + ' ' : '') + 'expected not same type');
            }
            static true(condition, msg) {
                if (!condition)
                    this.fail((msg ? msg + ' ' : '') + 'expected:<TRUE> but was:<FALSE>');
            }
            static false(condition, msg) {
                if (condition)
                    this.fail((msg ? msg + ' ' : '') + 'expected:<FALSE> but was:<TRUE>');
            }
            static defined(object, msg) {
                this.true(Types.isDefined(object), msg);
            }
            static notDefined(object, msg) {
                this.true(!Types.isDefined(object), msg);
            }
            static equalArray(expected, actual, msg) {
                if (expected.length == actual.length) {
                    if (expected.every((item, index) => {
                        return item === actual[index];
                    }))
                        return;
                }
                this.failNotEqual('[' + expected.toString() + ']', '[' + actual.toString() + ']', msg);
            }
            static equalDate(expected, actual, msg) {
                if (!expected && !actual)
                    return;
                if (expected.getTime() === actual.getTime())
                    return;
                this.failNotEqual(expected, actual, msg);
            }
            static error(cab, msg) {
                let has = false;
                try {
                    Functions.call(cab);
                }
                catch (e) {
                    has = true;
                }
                if (!has)
                    this.fail((msg ? msg + ' ' : '') + 'expected throw an error');
            }
            static equalError(error, cab, msg) {
                let has = false;
                try {
                    Functions.call(cab);
                }
                catch (e) {
                    if (Types.ofKlass(e, error))
                        has = true;
                }
                if (!has)
                    this.fail((msg ? msg + ' ' : '') + 'expected throw an error');
            }
        }
        lang.Assert = Assert;
    })(lang = JS.lang || (JS.lang = {}));
})(JS || (JS = {}));
var Assert = JS.lang.Assert;
var AssertError = JS.lang.AssertError;
var JS;
(function (JS) {
    let lang;
    (function (lang_1) {
        let OS;
        (function (OS) {
            OS["Windows"] = "Windows";
            OS["MacOS"] = "Mac OS";
            OS["Unix"] = "Unix";
            OS["Linux"] = "Linux";
            OS["CentOS"] = "CentOS";
            OS["Ubuntu"] = "Ubuntu";
            OS["iOS"] = "iOS";
            OS["Android"] = "Android";
            OS["WindowsPhone"] = "Windows Phone";
        })(OS = lang_1.OS || (lang_1.OS = {}));
        let DeviceType;
        (function (DeviceType) {
            DeviceType["desktop"] = "desktop";
            DeviceType["console"] = "console";
            DeviceType["mobile"] = "mobile";
            DeviceType["tablet"] = "tablet";
            DeviceType["smarttv"] = "smarttv";
            DeviceType["wearable"] = "wearable";
            DeviceType["embedded"] = "embedded";
        })(DeviceType = lang_1.DeviceType || (lang_1.DeviceType = {}));
        let Browser;
        (function (Browser) {
            Browser["Edge"] = "Edge";
            Browser["IE"] = "IE";
            Browser["Firefox"] = "Firefox";
            Browser["Chrome"] = "Chrome";
            Browser["Opera"] = "Opera";
            Browser["Safari"] = "Safari";
            Browser["iOS"] = "iOS";
            Browser["WeChat"] = "WeChat";
            Browser["QQ"] = "QQ";
            Browser["UC"] = "UC";
        })(Browser = lang_1.Browser || (lang_1.Browser = {}));
        class System {
            static info(isRefresh) {
                if (!isRefresh && System._info)
                    return System._info;
                var parser = window['UAParser'] && new UAParser(), dev = parser ? parser.getDevice() : {};
                if (!dev.type)
                    dev.type = DeviceType.desktop;
                let info = {
                    ua: navigator.userAgent,
                    browser: parser && parser.getBrowser(),
                    engine: parser && parser.getEngine(),
                    device: dev,
                    os: parser && parser.getOS(),
                    locale: navigator.language,
                    cookieEnabled: navigator.cookieEnabled,
                    online: navigator.onLine,
                    hardware: {
                        cpuName: parser && parser.getCPU().architecture,
                        cpuCores: navigator.hardwareConcurrency
                    },
                    window: null
                };
                if (self.window) {
                    let winscreen = window.screen, docbody = document.body;
                    info.window = {
                        screenX: window.screenLeft || window.screenX,
                        screenY: window.screenTop || window.screenY,
                        width: winscreen.width,
                        height: winscreen.height,
                        viewWidth: winscreen.availWidth,
                        viewHeight: winscreen.availHeight,
                        docX: docbody ? docbody.clientLeft : 0,
                        docY: docbody ? docbody.clientTop : 0,
                        docScrollX: docbody ? docbody.scrollLeft : 0,
                        docScrollY: docbody ? docbody.scrollTop : 0,
                        docWidth: docbody ? docbody.scrollWidth : 0,
                        docHeight: docbody ? docbody.scrollHeight : 0,
                        docViewWidth: docbody ? docbody.clientWidth : 0,
                        docViewHeight: docbody ? docbody.clientHeight : 0,
                        colorDepth: winscreen.colorDepth,
                        pixelDepth: winscreen.pixelDepth,
                        devicePixelRatio: window.devicePixelRatio
                    };
                }
                System._info = info;
                return info;
            }
            static isDevice(device) {
                return System.info().device.type == device;
            }
            static isBrowser(b) {
                return System.info().browser.name == b;
            }
            static isOS(os, version) {
                let sos = System.info().os, is = sos.name == os;
                if (!is)
                    return false;
                return version && sos.version ? sos.version.indexOf(version) == 0 : true;
            }
            static isLang(lang) {
                return Locales.lang(System.info().locale) == lang;
            }
            static isCountry(country) {
                return Locales.country(System.info().locale) == country;
            }
            static timezoneString(tz) {
                return (tz || 'GMT') + new Date().formatTimezoneOffset();
            }
            static performance() {
                return window.performance;
            }
            static highResTime() {
                return performance.now();
            }
        }
        lang_1.System = System;
    })(lang = JS.lang || (JS.lang = {}));
})(JS || (JS = {}));
var System = JS.lang.System;
var OS = JS.lang.OS;
var Browser = JS.lang.Browser;
var DeviceType = JS.lang.DeviceType;
var JS;
(function (JS) {
    let ui;
    (function (ui) {
        function widget(fullName, alias) {
            return Annotations.define({
                name: 'widget',
                handler: (anno, values, obj) => {
                    let ctor = obj, name = values[0];
                    Class.register(ctor, name, alias ? alias : (name.slice(name.lastIndexOf('.') + 1)).toLowerCase());
                },
                target: AnnotationTarget.CLASS
            }, [fullName]);
        }
        ui.widget = widget;
    })(ui = JS.ui || (JS.ui = {}));
})(JS || (JS = {}));
var widget = JS.ui.widget;
var JS;
(function (JS) {
    let util;
    (function (util) {
        let isReady = false;
        class Bom {
            static ready(fn) {
                if (isReady)
                    fn();
                let callback = function () {
                    isReady = true;
                    fn();
                    callback = null;
                };
                let wc = window['HTMLImports'] && window['HTMLImports'].whenReady;
                if (wc)
                    return wc(callback);
                if (document.readyState === "complete") {
                    setTimeout(callback, 1);
                }
                else if (document.addEventListener) {
                    document.addEventListener("DOMContentLoaded", callback, false);
                    window.addEventListener("load", callback, false);
                }
                else {
                    document['attachEvent']("onreadystatechange", callback);
                    window['attachEvent']("onload", callback);
                    var top = false;
                    try {
                        top = (window.frameElement == null && document.documentElement) ? true : false;
                    }
                    catch (e) { }
                    if (top && top['doScroll']) {
                        (function doScrollCheck() {
                            if (!isReady) {
                                try {
                                    top['doScroll']('left');
                                }
                                catch (e) {
                                    return setTimeout(doScrollCheck, 50);
                                }
                                callback();
                            }
                        })();
                    }
                }
            }
            static iframeWindow(el) {
                let e = util.Dom.$1(el);
                if (!e)
                    return null;
                return e['contentWindow'];
            }
            static iframeDocument(el) {
                let e = util.Dom.$1(el);
                if (!e)
                    return null;
                return e['contentDocument'] || e['contentWindow'].document;
            }
            static fullscreen() {
                let de = document.documentElement;
                let fnName = de['mozRequestFullScreen'] ? 'mozRequestFullScreen' : (de['webkitRequestFullScreen'] ? 'webkitRequestFullScreen' : 'requestFullscreen');
                if (de[fnName])
                    de[fnName]();
            }
            static normalscreen() {
                let fnName = document['mozCancelFullScreen'] ? 'mozCancelFullScreen' : (document['webkitCancelFullScreen'] ? 'webkitCancelFullScreen' : 'exitFullscreen');
                if (document[fnName])
                    document[fnName]();
            }
        }
        util.Bom = Bom;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Bom = JS.util.Bom;
var JS;
(function (JS) {
    let ui;
    (function (ui) {
        class View {
            constructor() {
                this._widgets = {};
                this._eventBus = new EventBus(this);
            }
            initialize() { }
            destroy() {
                if (this._widgets) {
                    Jsons.forEach(this._widgets, w => {
                        w.destroy();
                    });
                }
            }
            config() {
                return this._config;
            }
            _fire(e, args) {
                return this._eventBus.fire(e, args);
            }
            render() {
                Bom.ready(() => {
                    this._fire('rendering');
                    this._render();
                    this._fire('rendered');
                });
            }
            getModel() {
                return this._model;
            }
            getWidget(id) {
                return this._widgets[id];
            }
            getWidgets() {
                return this._widgets;
            }
            addWidget(wgt) {
                if (wgt)
                    this._widgets[wgt.id] = wgt;
                return this;
            }
            removeWidget(id) {
                delete this._widgets[id];
                return this;
            }
            destroyWidget(id) {
                let w = this._widgets[id];
                if (!w)
                    return this;
                w.destroy();
                delete this._widgets.id;
                return this;
            }
            on(type, handler) {
                this._eventBus.on(type, handler);
            }
            off(type) {
                this._eventBus.off(type);
            }
            eachWidget(fn) {
                Jsons.forEach(this._widgets, (w) => {
                    fn.apply(this, [w]);
                });
            }
            _newWidget(id, cfg, defaults) {
                if (!id) {
                    JSLogger.error('The widget\'s id was empty when be inited!');
                    return null;
                }
                let vconfig = cfg, newConfig = Jsons.union(defaults, vconfig, { id: id }), klass = newConfig.klass || $1('#' + id).attr('jsfx-alias');
                if (!klass) {
                    JSLogger.error(`The widget<${id}> was not configured for its klass type!`);
                    return null;
                }
                this._fire('widgetiniting', [klass, newConfig]);
                let wgt = Class.aliasInstance(klass, newConfig);
                this._fire('widgetinited', [wgt]);
                return wgt;
            }
        }
        ui.View = View;
    })(ui = JS.ui || (JS.ui = {}));
})(JS || (JS = {}));
var View = JS.ui.View;
var JS;
(function (JS) {
    let model;
    (function (model) {
        let Page = class Page {
            initialize() { }
            ;
            destroy() { }
            ;
            static fireEvent(e, args) {
                this._bus.fire(e, args);
            }
            static onEvent(e, handler) {
                this._bus.on(e, handler);
            }
            static offEvent(e) {
                this._bus.off(e);
            }
            static current(page) {
                if (arguments.length == 0)
                    return this._page;
                this._page = Components.get(page);
                this._bus.context(this._page);
                Bom.ready(() => {
                    this._page.render();
                });
            }
            static view(view) {
                return Components.get(view);
            }
            static uri() {
                return new URI(window.location.href);
            }
            static load(url) {
                let u = url ? url : location.href;
                this.fireEvent('loading', [u]);
                window.location.href = u;
                this.fireEvent('loaded', [u]);
            }
            static open(url, target = 'blank', specs) {
                let args = [url, target];
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
                if (onoff) {
                    this.fireEvent('fullscreening');
                    Bom.fullscreen();
                    this.fireEvent('fullscreened');
                }
                else {
                    this.fireEvent('normalscreening');
                    Bom.normalscreen();
                    this.fireEvent('normalscreened');
                }
            }
        };
        Page._bus = new EventBus();
        Page = __decorate([
            klass('JS.app.Page')
        ], Page);
        model.Page = Page;
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var Page = JS.model.Page;
window.on('load', () => {
    Page.fireEvent('loaded', [window.location.href]);
});
window.on('beforeunload', () => {
    Page.fireEvent('unloading', [window.location.href]);
});
var JS;
(function (JS) {
    let model;
    (function (model) {
        class AppEvent extends CustomEvent {
            constructor(type, initDict) {
                super(type, initDict);
            }
        }
        model.AppEvent = AppEvent;
        class App {
            static init(settings) {
                this._sets = settings;
                this._sets.properties = this._sets.properties || {};
                this._logger = new Log(this.namespace(), settings.logLevel || LogLevel.INFO);
            }
            static namespace() {
                return this._sets.name + '/' + this.version();
            }
            static appName() {
                return this._sets.name;
            }
            static version() {
                return this._sets.version;
            }
            static logger() {
                return this._logger;
            }
            static properties(properties) {
                if (arguments.length == 0)
                    return this._sets.properties;
                this._sets.properties = Jsons.union(this._sets.properties, properties);
                return this;
            }
            static property(key, val) {
                if (arguments.length == 1)
                    return this.properties()[key];
                return this.properties({ key: val });
            }
            static fireEvent(e, arg) {
                LocalStore.remove(e + '.' + App.namespace());
                LocalStore.set(e + '.' + App.namespace(), arg);
            }
            static onEvent(e, handler, once) {
                this._bus.on(e, handler, once);
            }
            static offEvent(e) {
                this._bus.off(e);
            }
        }
        App._bus = new EventBus(App);
        model.App = App;
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var App = JS.model.App;
var AppEvent = JS.model.AppEvent;
(function () {
    var oldSetItem = localStorage.setItem;
    localStorage.setItem = function (key, newValue) {
        var ev = document.createEvent('CustomEvent');
        ev.initCustomEvent('AppEvent', false, false, '');
        ev['key'] = key;
        ev['newValue'] = newValue;
        ev['url'] = Page.uri().toString();
        window.dispatchEvent(ev);
        oldSetItem.apply(this, arguments);
    };
    $(window).on('AppEvent storage', (evt) => {
        let e = evt.originalEvent, name = e.key;
        if (!name)
            return;
        let namespace = '.' + App.namespace();
        if (!name.endsWith(namespace))
            return;
        if (e.newValue == null)
            return;
        let ev = new AppEvent(name.slice(0, name.length - namespace.length));
        ev.url = e.url;
        App._bus.fire(ev, [StoreHelper.parse(e.newValue)]);
    });
})();
var JS;
(function (JS) {
    let model;
    (function (model) {
        class ResultSet {
            constructor() {
                this._data = null;
                this._page = 1;
                this._pageSize = Infinity;
            }
            rawObject(response) {
                if (arguments.length == 0)
                    return this._rawObject;
                this._rawObject = response;
                return this;
            }
            data(data) {
                if (arguments.length == 0)
                    return this._data;
                this._data = data;
                return this;
            }
            count() {
                return this._data == void 0 ? 0 : (this._data['length'] || 0);
            }
            total(total) {
                if (arguments.length == 0)
                    return this._total;
                this._total = total;
                return this;
            }
            page(page) {
                if (arguments.length == 0)
                    return this._page;
                this._page = page;
                return this;
            }
            pageSize(pageSize) {
                if (arguments.length == 0)
                    return this._pageSize;
                this._pageSize = pageSize;
                return this;
            }
            version(v) {
                if (arguments.length == 0)
                    return this._version;
                this._version = v;
                return this;
            }
            lang(lang) {
                if (arguments.length == 0)
                    return this._lang;
                this._lang = lang;
                return this;
            }
            message(msg) {
                if (arguments.length == 0)
                    return this._msg;
                this._msg = msg;
                return this;
            }
            success(success) {
                if (arguments.length == 0)
                    return this._success;
                this._success = success;
                return this;
            }
            static parseJSON(raw, format) {
                if (!raw)
                    return null;
                const fmt = format || this.DEFAULT_FORMAT, root = Jsons.getValueByPath(raw, fmt.rootProperty);
                let result = new ResultSet();
                result.lang(Jsons.getValueByPath(root, fmt.langProperty));
                result.message(Jsons.getValueByPath(root, fmt.messageProperty));
                result.version(Jsons.getValueByPath(root, fmt.versionProperty));
                result.success(fmt.isSuccess ? fmt.isSuccess(root) : (root[fmt.successProperty] === (fmt.successCode || true)));
                result.data(Jsons.getValueByPath(root, fmt.recordsProperty));
                result.rawObject(root);
                result.page(Jsons.getValueByPath(root, fmt.pageProperty));
                result.pageSize(Jsons.getValueByPath(root, fmt.pageSizeProperty));
                result.total(Jsons.getValueByPath(root, fmt.totalProperty));
                return result;
            }
        }
        ResultSet.DEFAULT_FORMAT = {
            rootProperty: undefined,
            recordsProperty: 'data',
            totalProperty: 'paging.total',
            pageProperty: 'paging.page',
            pageSizeProperty: 'paging.pageSize',
            messageProperty: 'msg',
            versionProperty: 'version',
            langProperty: 'lang',
            successProperty: 'code',
            successCode: 'success'
        };
        model.ResultSet = ResultSet;
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var ResultSet = JS.model.ResultSet;
var JS;
(function (JS) {
    let model;
    (function (model) {
        let AjaxProxy = class AjaxProxy {
        };
        AjaxProxy = __decorate([
            klass('JS.model.AjaxProxy')
        ], AjaxProxy);
        model.AjaxProxy = AjaxProxy;
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var AjaxProxy = JS.model.AjaxProxy;
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var JS;
(function (JS) {
    let model;
    (function (model) {
        let JsonProxy = class JsonProxy extends model.AjaxProxy {
            constructor() {
                super();
            }
            execute(query, data) {
                var req = Jsons.union({
                    method: 'GET'
                }, Ajax.toRequest(query, data), {
                    async: true,
                    type: 'json'
                });
                return new Promise(function (resolve, reject) {
                    Ajax.send(req).always((res) => {
                        let result = model.ResultSet.parseJSON(res.data);
                        result && result.success() ? resolve(result) : reject(res);
                    });
                });
            }
        };
        JsonProxy = __decorate([
            klass('JS.model.JsonProxy'),
            __metadata("design:paramtypes", [])
        ], JsonProxy);
        model.JsonProxy = JsonProxy;
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var JsonProxy = JS.model.JsonProxy;
var JS;
(function (JS) {
    let model;
    (function (model_1) {
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
                        let model = Class.newInstance(api.dataKlass || model_1.Model), rds = result.data();
                        Types.ofKlass(model, model_1.Model) ? model.setData(rds) : model = rds;
                        resolve(model);
                    }).catch((res) => {
                        reject(res);
                    });
                });
            }
        };
        Service.DEFAULT_PROXY = model_1.JsonProxy;
        Service = Service_1 = __decorate([
            klass('JS.app.Service')
        ], Service);
        model_1.Service = Service;
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var Service = JS.model.Service;
var JS;
(function (JS) {
    let data;
    (function (data) {
        class BiMap {
            constructor(kvs) {
                this._map = new Map();
                if (kvs)
                    kvs.forEach(kv => {
                        this._map.set(kv["0"], kv["1"]);
                    });
            }
            inverse() {
                let map = new BiMap();
                if (this.size() >= 0) {
                    this._map.forEach((v, k) => {
                        map.put(v, k);
                    });
                }
                return map;
            }
            delete(key) {
                return this._map.delete(key);
            }
            forEach(fn, thisArg) {
                this._map.forEach(fn);
            }
            clear() {
                this._map.clear();
            }
            size() {
                return this._map.size;
            }
            has(k) {
                return this._map.has(k);
            }
            get(k) {
                return this._map.get(k);
            }
            put(k, v) {
                this._map.set(k, v);
            }
            putAll(map) {
                if (map)
                    map.forEach((v, k) => {
                        this.put(k, v);
                    });
            }
        }
        data.BiMap = BiMap;
    })(data = JS.data || (JS.data = {}));
})(JS || (JS = {}));
var BiMap = JS.data.BiMap;
var JS;
(function (JS) {
    let data;
    (function (data_1) {
        class LinkedList {
            constructor() {
                this._size = 0;
                this._head = null;
                this._tail = null;
            }
            each(fn, thisArg) {
                if (this._size == 0)
                    return true;
                let rst = true, i = 0, node = this._head;
                while (node) {
                    if (!fn.call(thisArg || this, node.data, i, this)) {
                        rst = false;
                        break;
                    }
                    node = node.next;
                    ++i;
                }
                return rst;
            }
            size() {
                return this._size;
            }
            isEmpty() {
                return this._size == 0;
            }
            clear() {
                this._head = null;
                this._tail = null;
                this._size = 0;
            }
            clone() {
                let list = new LinkedList();
                if (this._size > 0) {
                    let node = this._head;
                    while (node) {
                        list.add(Jsons.clone(node.data));
                        node = node.next;
                    }
                }
                return list;
            }
            toArray() {
                let arr = [];
                this.each(d => {
                    arr[arr.length] = d;
                    return true;
                });
                return arr;
            }
            getFirst() {
                return this._head ? this._head.data : null;
            }
            getLast() {
                return this._tail ? this._tail.data : null;
            }
            _check(i) {
                if (i > this._size || i < 0)
                    throw new Errors.RangeError();
            }
            get(i) {
                this._check(i);
                if (i == 0)
                    return this._head ? this._head.data : null;
                if (i == this._size - 1)
                    return this._tail ? this._tail.data : null;
                let node = this._findAt(i);
                return node ? node.data : null;
            }
            _findAt(i) {
                return i < this._size / 2 ? this._fromFirst(i) : this._fromLast(i);
            }
            _fromFirst(i) {
                if (i <= 0)
                    return this._head;
                let node = this._head, count = 1;
                while (count <= i) {
                    node = node.next;
                    count++;
                }
                return node;
            }
            _fromLast(i) {
                if (i >= (this.size() - 1))
                    return this._tail;
                let node = this._tail, count = this._size - 1;
                while (count > i) {
                    node = node.prev;
                    count--;
                }
                return node;
            }
            indexOf(data) {
                if (this.isEmpty())
                    return -1;
                let rst = -1;
                this.each((item, i) => {
                    let is = (data === item);
                    if (is)
                        rst = i;
                    return !is;
                });
                return rst;
            }
            lastIndexOf(data) {
                if (this.isEmpty())
                    return -1;
                let rst = -1, node = this._tail, i = this._size - 1;
                while (node) {
                    if (data === node.data) {
                        rst = i;
                        break;
                    }
                    node = node.prev;
                    --i;
                }
                return rst;
            }
            contains(data) {
                return this.indexOf(data) > -1;
            }
            _addLast(d) {
                let node = { data: Jsons.clone(d), prev: null, next: null };
                if (this._tail) {
                    node.prev = this._tail;
                    this._tail.next = node;
                }
                this._tail = node;
                if (!this._head)
                    this._head = this._tail;
                this._size += 1;
            }
            _addFirst(d) {
                let node = { data: Jsons.clone(d), prev: null, next: null };
                if (this._head) {
                    node.next = this._head;
                    this._head.prev = node;
                }
                this._head = node;
                if (!this._tail)
                    this._tail = this._head;
                this._size += 1;
            }
            add(a) {
                if (Types.isArray(a)) {
                    a.forEach(el => {
                        this._addLast(el);
                    });
                }
                else {
                    this._addLast(a);
                }
            }
            addAll(list) {
                if (!list || list.isEmpty())
                    return;
                list.each(d => {
                    this._addLast(d);
                    return true;
                });
            }
            _addAt(i, a) {
                let nextNode = this._findAt(i);
                if (!nextNode)
                    return;
                let prevNode = nextNode.prev, newNode = { data: Jsons.clone(a), next: nextNode, prev: prevNode };
                prevNode.next = newNode;
                nextNode.prev = newNode;
                this._size += 1;
            }
            addAt(i, a) {
                if (i <= 0) {
                    this.addFirst(a);
                    return;
                }
                else if (i >= this.size()) {
                    this.addLast(a);
                    return;
                }
                if (!Types.isArray(a)) {
                    this._addAt(i, a);
                }
                else {
                    a.forEach((t, j) => {
                        this._addAt(i + j, t);
                    });
                }
            }
            addLast(a) {
                this.add(a);
            }
            addFirst(a) {
                if (Types.isArray(a)) {
                    for (let i = a.length - 1; i >= 0; i--) {
                        this._addFirst(a[i]);
                    }
                }
                else {
                    this._addFirst(a);
                }
            }
            removeFirst() {
                if (this._size == 0)
                    return null;
                let data = this._head.data;
                if (this._size > 1) {
                    this._head = this._head.next;
                    this._head.prev = null;
                }
                else {
                    this._head = null;
                    this._tail = null;
                }
                this._size--;
                return data;
            }
            removeLast() {
                if (this._size == 0)
                    return null;
                let data = this._tail.data;
                if (this._size > 1) {
                    this._tail = this._tail.prev;
                    this._tail.next = null;
                }
                else {
                    this._head = null;
                    this._tail = null;
                }
                this._size--;
                return data;
            }
            removeAt(i) {
                if (this.isEmpty())
                    return null;
                this._check(i);
                if (i == 0) {
                    this.removeFirst();
                    return;
                }
                else if (i == this.size() - 1) {
                    this.removeLast();
                    return;
                }
                let node = this._findAt(i);
                if (!node)
                    return null;
                let next = node.next, prev = node.prev;
                if (next)
                    next.prev = prev;
                if (prev)
                    prev.next = next;
                this._size--;
                return node.data;
            }
            peek() {
                return this._head ? this._head.data : null;
            }
            peekFirst() {
                return this.peek();
            }
            peekLast() {
                return this._tail ? this._tail.data : null;
            }
            toString() {
                return '[' + this.toArray().toString() + ']';
            }
        }
        data_1.LinkedList = LinkedList;
    })(data = JS.data || (JS.data = {}));
})(JS || (JS = {}));
var LinkedList = JS.data.LinkedList;
var JS;
(function (JS) {
    let data;
    (function (data_2) {
        class Queue {
            constructor(a) {
                this.list = new data_2.LinkedList();
                this.list.add(a);
            }
            each(fn, thisArg) {
                return this.list.each((item, i) => {
                    return fn.call(thisArg || this, item, i, this);
                }, thisArg);
            }
            size() {
                return this.list.size();
            }
            isEmpty() {
                return this.size() == 0;
            }
            clear() {
                this.list.clear();
            }
            clone() {
                let list = new Queue();
                list.list = this.list.clone();
                return list;
            }
            toArray() {
                return this.list.toArray();
            }
            get(i) {
                return this.list.get(i);
            }
            indexOf(data) {
                return this.list.indexOf(data);
            }
            lastIndexOf(data) {
                return this.list.lastIndexOf(data);
            }
            contains(data) {
                return this.indexOf(data) > -1;
            }
            push(a) {
                this.list.addLast(a);
            }
            pop() {
                return this.list.removeFirst();
            }
            peek() {
                return this.list.peekFirst();
            }
            toString() {
                return '[' + this.list.toArray().toString() + ']';
            }
        }
        data_2.Queue = Queue;
    })(data = JS.data || (JS.data = {}));
})(JS || (JS = {}));
var Queue = JS.data.Queue;
var JS;
(function (JS) {
    let data;
    (function (data) {
        class Stack {
            constructor(a) {
                this.list = new data.LinkedList();
                this.list.add(a);
            }
            each(fn, thisArg) {
                return this.list.each((item, i) => {
                    return fn.call(thisArg || this, item, i, this);
                }, thisArg);
            }
            size() {
                return this.list.size();
            }
            isEmpty() {
                return this.size() == 0;
            }
            clear() {
                this.list.clear();
            }
            clone() {
                let list = new Stack();
                list.list = this.list.clone();
                return list;
            }
            toArray() {
                return this.list.toArray();
            }
            peek() {
                return this.list.peekLast();
            }
            pop() {
                return this.list.removeLast();
            }
            push(item) {
                this.list.addLast(item);
            }
            toString() {
                return '[' + this.list.toArray().toString() + ']';
            }
        }
        data.Stack = Stack;
    })(data = JS.data || (JS.data = {}));
})(JS || (JS = {}));
var Stack = JS.data.Stack;
var JS;
(function (JS) {
    let model;
    (function (model) {
        let validator;
        (function (validator) {
            class ValidatorConfig {
            }
            validator.ValidatorConfig = ValidatorConfig;
            class Validator {
                constructor(cfg) {
                    this._cfg = cfg;
                }
                static create(type, cfg) {
                    return Class.newInstance({
                        'required': RequiredValidator,
                        'custom': CustomValidator,
                        'range': RangeValidator,
                        'format': FormatValidator,
                        'length': LengthValidator
                    }[type], cfg);
                }
            }
            validator.Validator = Validator;
            class ValidateResult {
                constructor() {
                    this._errors = [];
                }
                addError(field, msg) {
                    this._errors.push({ field: field, message: msg });
                }
                length() {
                    return this._errors.length;
                }
                hasError(field) {
                    if (!field)
                        return this.length() > 0;
                    return this.getErrors(field).length == 0;
                }
                clear() {
                    this._errors = [];
                }
                getErrors(field) {
                    let errs = this._errors;
                    if (errs.length < 1)
                        return [];
                    if (!field)
                        return errs;
                    let fields = [];
                    errs.forEach(e => {
                        if (e.field == field)
                            fields.push(e);
                    });
                    return fields;
                }
            }
            validator.ValidateResult = ValidateResult;
            class CustomValidatorConfig extends ValidatorConfig {
                constructor() {
                    super(...arguments);
                    this.allowEmpty = true;
                }
            }
            validator.CustomValidatorConfig = CustomValidatorConfig;
            class CustomValidator extends Validator {
                constructor(cfg) {
                    super(Jsons.union(new CustomValidatorConfig(), cfg));
                }
                validate(val) {
                    let cfg = this._cfg;
                    if ((Check.isEmpty(val) && !cfg.allowEmpty) || !cfg.validate(val))
                        return cfg.message || false;
                    return true;
                }
            }
            validator.CustomValidator = CustomValidator;
            class RequiredValidatorConfig extends ValidatorConfig {
            }
            validator.RequiredValidatorConfig = RequiredValidatorConfig;
            class RequiredValidator extends Validator {
                constructor(cfg) {
                    super(cfg);
                }
                validate(val) {
                    if (val == void 0 || Check.isEmpty(String(val).trim()))
                        return this._cfg.message || false;
                    return true;
                }
            }
            validator.RequiredValidator = RequiredValidator;
            class RangeValidatorConfig extends ValidatorConfig {
                constructor() {
                    super(...arguments);
                    this.allowEmpty = true;
                }
            }
            validator.RangeValidatorConfig = RangeValidatorConfig;
            class RangeValidator extends Validator {
                constructor(cfg) {
                    super(Jsons.union(new RangeValidatorConfig(), cfg));
                }
                validate(val) {
                    let cfg = this._cfg;
                    if ((Check.isEmpty(val) && !cfg.allowEmpty) || !Types.isNumeric(val))
                        return cfg.nanMessage;
                    let min = cfg.min, max = cfg.max;
                    val = Number(val == void 0 ? 0 : val);
                    if (min != void 0 && val < min)
                        return cfg.tooMinMessage;
                    if (max != void 0 && val > max)
                        return cfg.tooMaxMessage;
                    return true;
                }
            }
            validator.RangeValidator = RangeValidator;
            class LengthValidatorConfig extends ValidatorConfig {
                constructor() {
                    super(...arguments);
                    this.allowEmpty = true;
                }
            }
            validator.LengthValidatorConfig = LengthValidatorConfig;
            class LengthValidator extends Validator {
                constructor(cfg) {
                    super(Jsons.union(new LengthValidatorConfig(), cfg));
                }
                validate(val) {
                    let cfg = this._cfg;
                    if (Check.isEmpty(val)) {
                        return !cfg.allowEmpty ? (cfg.invalidTypeMessage || false) : true;
                    }
                    if (!Types.isString(val) && !Types.isArray(val))
                        return cfg.invalidTypeMessage || false;
                    let short = cfg.short, long = cfg.long, len = val ? val.length : 0;
                    if (short != void 0 && len < short)
                        return cfg.tooShortMessage || false;
                    if (long != void 0 && len > long)
                        return cfg.tooLongMessage || false;
                    return true;
                }
            }
            validator.LengthValidator = LengthValidator;
            class FormatValidatorConfig extends ValidatorConfig {
                constructor() {
                    super(...arguments);
                    this.allowEmpty = true;
                }
            }
            validator.FormatValidatorConfig = FormatValidatorConfig;
            class FormatValidator extends Validator {
                constructor(cfg) {
                    super(Jsons.union(new FormatValidatorConfig(), cfg));
                }
                validate(val) {
                    let cfg = this._cfg;
                    return (Check.isEmpty(val) && !cfg.allowEmpty) || !cfg.matcher.test(val) ? (cfg.message || false) : true;
                }
            }
            validator.FormatValidator = FormatValidator;
        })(validator = model.validator || (model.validator = {}));
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var ValidateResult = JS.model.validator.ValidateResult;
var Validator = JS.model.validator.Validator;
var CustomValidator = JS.model.validator.CustomValidator;
var RequiredValidator = JS.model.validator.RequiredValidator;
var RangeValidator = JS.model.validator.RangeValidator;
var LengthValidator = JS.model.validator.LengthValidator;
var FormatValidator = JS.model.validator.FormatValidator;
var JS;
(function (JS) {
    let model;
    (function (model) {
        class Field {
            constructor(config) {
                this._config = Jsons.union({
                    type: 'string',
                    isId: false,
                    nullable: true,
                    defaultValue: null
                }, config);
            }
            config() {
                return this._config;
            }
            name() {
                return this._config.name;
            }
            alias() {
                let nameMapping = this._config.nameMapping;
                if (!nameMapping)
                    return this.name();
                return Types.isString(nameMapping) ? nameMapping : nameMapping.call(this);
            }
            isId() {
                return this._config.isId;
            }
            defaultValue() {
                return this._config.defaultValue;
            }
            type() {
                return this._config.type;
            }
            nullable() {
                return this._config.nullable;
            }
            set(val) {
                if (!this.nullable() && val == void 0)
                    throw new Errors.TypeError(`This Field<${this.name()}> must be not null`);
                let fn = this._config.setter, v = fn ? fn.apply(this, [val]) : val;
                return v === undefined ? this._config.defaultValue : v;
            }
            compare(v1, v2) {
                let ret = 0;
                if (this._config.comparable) {
                    ret = this._config.comparable(v1, v2);
                }
                else {
                    ret = (v1 === v2) ? 0 : ((v1 < v2) ? -1 : 1);
                }
                return ret;
            }
            isEqual(v1, v2) {
                return this.compare(v1, v2) === 0;
            }
            validate(value, errors) {
                let cfg = this._config, vts = cfg.validators, rst, ret = '';
                if (!vts)
                    return true;
                for (let i = 0, len = vts.length; i < len; ++i) {
                    const vSpec = vts[i];
                    rst = Validator.create(vSpec.name, vSpec).validate(value);
                    if (rst !== true) {
                        if (errors)
                            errors.addError(cfg.name, rst === false ? '' : rst);
                        ret += ret ? ('|' + rst) : rst;
                    }
                }
                return ret || true;
            }
        }
        model.Field = Field;
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var ModelField = JS.model.Field;
var JS;
(function (JS) {
    let model;
    (function (model_2) {
        class ModelConfig {
            constructor() {
                this.idProperty = 'id';
                this.iniData = null;
            }
        }
        model_2.ModelConfig = ModelConfig;
        let Model = class Model {
            constructor(cfg) {
                this._fields = {};
                this._eventBus = new EventBus(this);
                this._data = {};
                this._isD = false;
                cfg = Jsons.union(new ModelConfig(), cfg);
                let defaultFields = this.getClass().getKlass().DEFAULT_FIELDS;
                this._config = Types.isDefined(defaultFields) ? Jsons.union(cfg, { fields: defaultFields }) : cfg;
                this._addFields(this._config.fields);
                let listeners = this._config.listeners;
                if (listeners)
                    Jsons.forEach(listeners, (v, key) => {
                        this.on(key, v);
                    });
            }
            _check() {
                if (this.isDestroyed())
                    throw new Errors.NotHandledError('The model was destroyed!');
            }
            _newField(cfg) {
                let tField = null;
                if (cfg.name in this._fields) {
                    tField = this._fields[cfg.name];
                    let c = tField.config();
                    c = Jsons.union(c, cfg);
                }
                else {
                    cfg.isId = cfg.isId || this._config.idProperty === cfg.name;
                    tField = new model_2.Field(cfg);
                    this._fields[tField.name()] = tField;
                }
                if (tField.isId())
                    this._config.idProperty = cfg.name;
            }
            _addFields(fields) {
                if (!fields)
                    return;
                for (let i = 0, len = fields.length; i < len; i++) {
                    const fieldCfg = fields[i];
                    this._newField(Types.isString(fieldCfg) ? { name: fieldCfg } : fieldCfg);
                }
            }
            addFields(fields) {
                this._check();
                this._addFields(fields);
                return this;
            }
            addField(field) {
                this.addFields([field]);
                return this;
            }
            isIdField(name) {
                return name == this._config.idProperty;
            }
            removeFields(names) {
                this._check();
                names.forEach((name) => {
                    this.removeField(name);
                });
                return this;
            }
            removeField(name) {
                this._check();
                if (this.isIdField(name))
                    throw new JSError('Can\'t remove the ID field!');
                if (this._fields.hasOwnProperty(name))
                    delete this._fields[name];
                return this;
            }
            updateField(field) {
                this._check();
                let name = Types.isString(field) ? field : field.name;
                if (this.isIdField(name))
                    throw new JSError('Can\'t update the ID field!');
                if (!this._fields.hasOwnProperty(name))
                    return;
                delete this._fields[name];
                this.addFields([field]);
                return this;
            }
            updateFields(fields) {
                fields.forEach(field => {
                    this.updateField(field);
                });
                return this;
            }
            clone() {
                let model = Class.newInstance(this.className, Jsons.clone(this._config));
                model.setData(this.getData());
                return model;
            }
            reload() {
                return this.load(this._config.dataQuery);
            }
            load(quy, silent) {
                this._check();
                let me = this, query = Jsons.union(Ajax.toRequest(this._config.dataQuery), Ajax.toRequest(quy));
                this._fire('loading', [query]);
                this._config.dataQuery = query;
                return new model_2.JsonProxy().execute(query).then(function (result) {
                    if (result) {
                        let records = result.data();
                        if (!records)
                            me._fire('loadfailure', [result]);
                        me.setData(Types.isArray(records) ? records[0].getData() : records, silent);
                        me._fire('loadsuccess', [result]);
                    }
                    return Promise.resolve(result);
                }).catch(function (err) {
                    if (Types.ofKlass(err, Error))
                        JSLogger.error('[' + err.name + ']' + err.message);
                    me._fire('loaderror', [err]);
                });
            }
            setData(data, silent) {
                this._check();
                let oldData = Jsons.clone(this._data), newData = data;
                if (!silent)
                    this._fire('dataupdating', [newData, oldData]);
                this._data = {};
                if (newData) {
                    if (Check.isEmpty(this._fields)) {
                        Jsons.forEach(newData, (v, k) => {
                            this._newField({ name: k });
                            this.set(k, v, true);
                        });
                    }
                    else {
                        Jsons.forEach(this._fields, (f, name) => {
                            this.set(name, newData[f.alias()], true);
                        });
                    }
                }
                if (!silent)
                    this._fire('dataupdated', [newData, oldData]);
                return this;
            }
            hasField(name) {
                return this._fields.hasOwnProperty(name);
            }
            get(fieldName) {
                let field = this.getField(fieldName);
                if (!field)
                    return undefined;
                let v = this._data[field.alias()];
                return v == void 0 ? null : v;
            }
            set(key, value, equal) {
                this._check();
                let field = this.getField(key);
                if (!field)
                    return;
                let alias = field.alias(), oldVal = this._data[alias], newVal = field.set(value);
                this._data[alias] = newVal;
                let eq = equal == void 0 ? false : (Types.isFunction(equal) ? (equal.apply(this, [newVal, oldVal])) : equal);
                if (!eq)
                    this._fire('fieldchanged', [newVal, oldVal, field.name()]);
                return this;
            }
            iniData(d) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.iniData;
                cfg.iniData = d;
                return this;
            }
            getData() {
                return this._data;
            }
            getId() {
                return this.get(this._config.idProperty);
            }
            setId(id) {
                this._check();
                this.set(this._config.idProperty, id);
                return this;
            }
            isEmpty() {
                return Check.isEmpty(this._data);
            }
            destroy() {
                if (this._isD)
                    return;
                this._eventBus.destroy();
                this._eventBus = null;
                this._data = null;
                this._isD = true;
            }
            isDestroyed() {
                return this._isD;
            }
            getField(name) {
                return this._fields[name];
            }
            getFields() {
                return this._fields;
            }
            getIdField() {
                if (!this._fields)
                    return null;
                let f = null;
                Jsons.some(this._fields, field => {
                    let is = field.isId();
                    if (is)
                        f = field;
                    return is;
                });
                return f;
            }
            reset() {
                return this.setData(this.iniData());
            }
            clear() {
                return this.setData(null);
            }
            validate(result) {
                let vdata = this._data;
                if (Check.isEmpty(vdata))
                    return true;
                let rst = result || new ValidateResult(), str = '';
                Jsons.forEach(vdata, (v, k) => {
                    let field = this.getField(k);
                    if (field) {
                        let ret = this.validateField(field.name(), v, rst);
                        if (ret !== true)
                            str += (str ? '|' : '') + ret;
                    }
                });
                this._fire('validated', [rst, vdata]);
                return str || true;
            }
            validateField(fieldName, value, result) {
                if (!result)
                    result = new ValidateResult();
                let field = this.getField(fieldName);
                if (!field)
                    return true;
                let rst = result || new ValidateResult(), val = arguments.length > 1 ? value : this.get(fieldName);
                let vdt = field.validate(val, rst);
                this._fire('fieldvalidated', [rst, val, fieldName]);
                return Types.isBoolean(vdt) ? vdt : `[${fieldName}]=` + vdt;
            }
            _fire(type, args) {
                this._eventBus.fire(type, args);
            }
            on(type, fn, once) {
                this._check();
                this._eventBus.on(type, fn, once);
                return this;
            }
            off(type) {
                this._check();
                this._eventBus.off(type);
                return this;
            }
        };
        Model.DEFAULT_FIELDS = [];
        Model = __decorate([
            klass('JS.model.Model'),
            __metadata("design:paramtypes", [ModelConfig])
        ], Model);
        model_2.Model = Model;
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var Model = JS.model.Model;
var ModelConfig = JS.model.ModelConfig;
var JS;
(function (JS) {
    let model;
    (function (model_3) {
        ;
        class ListModelConfig {
            constructor() {
                this.autoLoad = false;
            }
        }
        model_3.ListModelConfig = ListModelConfig;
        let ListModel = class ListModel {
            constructor(cfg) {
                this._data = [];
                this._eventBus = new EventBus(this);
                this._isD = false;
                this._modelKlass = null;
                this._config = this._initConfig(cfg);
                let listeners = this._config.listeners;
                if (listeners)
                    Jsons.forEach(listeners, (v, key) => {
                        this.on(key, v);
                    });
                if (this._config.iniData)
                    this.setData(this._config.iniData);
                if (this._config.autoLoad)
                    this.reload();
            }
            _initConfig(cfg) {
                return Jsons.union(new ListModelConfig(), cfg);
            }
            _check() {
                if (this.isDestroyed())
                    throw new Errors.NotHandledError('The model was destroyed!');
            }
            addSorter(field, dir) {
                this._check();
                let newSorter = {
                    field: field,
                    dir: dir ? dir : 'asc'
                }, has = false, sorters = this._config.sorters;
                if (!sorters)
                    sorters = [];
                sorters.some((sorter) => {
                    if (newSorter.field == sorter.field) {
                        has = true;
                        if (newSorter.sort)
                            sorter.sort = newSorter.sort;
                        sorter.dir = newSorter.dir;
                        return true;
                    }
                    return false;
                });
                if (!has)
                    sorters.push(newSorter);
                this._config.sorters = sorters;
            }
            removeSorter(field) {
                this._check();
                let sorters = this._config.sorters;
                if (!sorters)
                    return;
                sorters.remove(item => {
                    return item.field == field;
                });
            }
            clearSorters() {
                this._check();
                this._config.sorters = [];
            }
            sort(field, dir) {
                this._check();
                this.addSorter(field, dir);
                return this.reload();
            }
            getSorterBy(fieldName) {
                let sorters = this._config.sorters;
                if (!sorters)
                    return null;
                let sorter = null;
                sorters.some((srt) => {
                    let is = srt.field === fieldName;
                    if (is)
                        sorter = srt;
                    return is;
                });
                return sorter;
            }
            _sortParams() {
                let sorters = this._config.sorters;
                if (!sorters)
                    return null;
                let s = '';
                sorters.forEach((sorter) => {
                    s += `${sorter.field} ${sorter.dir ? sorter.dir : 'asc'},`;
                });
                s = s.slice(0, s.length - 1);
                return { sorters: s };
            }
            reload() {
                return this.load(this._config.dataQuery);
            }
            modelKlass(klass) {
                if (arguments.length == 0)
                    return this._modelKlass;
                this._modelKlass = klass;
                return this;
            }
            load(quy, silent) {
                this._check();
                let me = this, query = Jsons.union(Ajax.toRequest(this._config.dataQuery), Ajax.toRequest(quy));
                query.data = Jsons.union(query.data, this._sortParams());
                this._fire('loading', [query]);
                this._config.dataQuery = query;
                return new model_3.JsonProxy().execute(query).then(function (result) {
                    if (result.success()) {
                        me.setData(result.data(), silent);
                        me._fire('loadsuccess', [result]);
                    }
                    else {
                        me._fire('loadfailure', [result]);
                    }
                    return Promise.resolve(result);
                }).catch(function (err) {
                    if (Types.ofKlass(err, Error))
                        JSLogger.error('[' + err.name + ']' + err.message);
                    me._fire('loaderror', [err]);
                });
            }
            getData() {
                return this.isEmpty() ? null : this._data;
            }
            setData(data, silent) {
                this._check();
                let newData = data, oldData = Jsons.clone(this._data);
                if (!silent)
                    this._fire('dataupdating', [newData, oldData]);
                this._data = data || [];
                if (!silent)
                    this._fire('dataupdated', [newData, oldData]);
                return this;
            }
            iniData(d) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.iniData;
                cfg.iniData = d;
                return this;
            }
            reset() {
                return this.setData(this.iniData());
            }
            add(records, silent) {
                return this.insert(this._data.length, records, silent);
            }
            insert(index, records, silent) {
                if (!records)
                    return this;
                this._check();
                this._data = this._data || [];
                let models = Arrays.toArray(records);
                this._data.add(models, index);
                if (!silent)
                    this._fire('rowadded', [models, index]);
                return this;
            }
            getRowModel(index, klass) {
                if (index < 0 || index >= this.size())
                    return null;
                let d = this._data[index];
                if (!d)
                    return null;
                let k = klass || this._modelKlass;
                if (!k)
                    throw new Errors.NotFoundError('The model klass not found!');
                return Class.newInstance(k).setData(d, true);
            }
            getModels(klass) {
                if (this.size() == 0)
                    return null;
                let k = klass || this._modelKlass;
                if (!k)
                    throw new Errors.NotFoundError('The model klass not found!');
                let mds = [];
                this._data.forEach((d, i) => {
                    mds[i] = Class.newInstance(k).setData(d, true);
                });
                return mds;
            }
            getRowById(id) {
                return this.getRow(this.indexOfId(id));
            }
            getRow(index) {
                if (index < 0 || index >= this.size())
                    return null;
                return this._data[index] || null;
            }
            indexOfId(id) {
                if (!id || this.size() == 0)
                    return -1;
                let idName = 'id';
                if (this._modelKlass && Types.subKlass(this._modelKlass, model_3.Model)) {
                    let model = Class.newInstance(this._modelKlass), field = model.getIdField();
                    if (field)
                        idName = field.alias();
                }
                let index = -1;
                this._data.some((obj, i) => {
                    let ret = obj[idName] == id;
                    if (ret)
                        index = i;
                    return ret;
                });
                return index;
            }
            removeAt(index, silent) {
                this._check();
                if (this.size() == 0)
                    return this;
                const obj = this._data[index];
                if (obj) {
                    this._data.remove(index);
                    if (!silent)
                        this._fire('rowremoved', [obj, index]);
                }
                return this;
            }
            clear(silent) {
                return this.setData(null, silent);
            }
            validate() {
                if (this.size() == 0)
                    return true;
                let rst = new ValidateResult(), str = '';
                this._data.forEach(m => {
                    let ret = m.validate(rst);
                    if (ret !== true)
                        str += (str ? '|' : '') + ret;
                });
                this._fire('validated', [this._data, rst]);
                return str || true;
            }
            validateRow(index) {
                let row = this.getRow(index);
                if (!row)
                    return null;
                let rst = row.validate();
                this._fire('rowvalidated', [rst, row, index]);
                return rst;
            }
            size() {
                return !this._data ? 0 : this._data.length;
            }
            isEmpty() {
                return this.size() == 0;
            }
            clone() {
                let model = Class.newInstance(this.className, Jsons.clone(this._config));
                model.setData(this.getData());
                return model;
            }
            _fire(type, args) {
                this._eventBus.fire(type, args);
            }
            on(type, fn, once) {
                this._check();
                this._eventBus.on(type, fn, once);
                return this;
            }
            off(type) {
                this._check();
                this._eventBus.off(type);
                return this;
            }
            destroy() {
                if (this._isD)
                    return;
                this._eventBus.destroy();
                this._eventBus = null;
                this._data = null;
                this._isD = true;
            }
            isDestroyed() {
                return this._isD;
            }
        };
        ListModel = __decorate([
            klass('JS.model.ListModel'),
            __metadata("design:paramtypes", [ListModelConfig])
        ], ListModel);
        model_3.ListModel = ListModel;
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var ListModel = JS.model.ListModel;
var ListModelConfig = JS.model.ListModelConfig;
var JS;
(function (JS) {
    let ui;
    (function (ui) {
        let LengthUnit;
        (function (LengthUnit) {
            LengthUnit["PCT"] = "%";
            LengthUnit["PX"] = "px";
            LengthUnit["IN"] = "in";
            LengthUnit["CM"] = "cm";
            LengthUnit["MM"] = "mm";
            LengthUnit["EM"] = "em";
            LengthUnit["EX"] = "ex";
            LengthUnit["PT"] = "pt";
            LengthUnit["PC"] = "pc";
            LengthUnit["REM"] = "rem";
        })(LengthUnit = ui.LengthUnit || (ui.LengthUnit = {}));
        class Lengths {
            static toPxNumber(len) {
                if (len == void 0)
                    return 0;
                if (Types.isNumeric(len))
                    return len;
                let le = String(len);
                if (le.endsWith('%'))
                    return 0;
                return parseFloat(le.replace(/^.+[px]$/, ''));
            }
            static toCssString(len, defaultVal, unit) {
                if (len == void 0)
                    return defaultVal || 'auto';
                if (Types.isNumeric(len))
                    return Number(len) + '' + (unit || LengthUnit.PX);
                return String(len);
            }
        }
        ui.Lengths = Lengths;
    })(ui = JS.ui || (JS.ui = {}));
})(JS || (JS = {}));
var Lengths = JS.ui.Lengths;
var JS;
(function (JS) {
    let ui;
    (function (ui) {
        class Color {
            constructor(r, g, b, a) {
                if (Types.isString(r)) {
                    let hex = r;
                    this.r = parseInt('0x' + hex.slice(1, 3));
                    this.g = parseInt('0x' + hex.slice(3, 5));
                    this.b = parseInt('0x' + hex.slice(5, 7));
                    this.a = g || 0;
                }
                else {
                    this.r = r;
                    this.g = g;
                    this.b = b;
                    this.a = a;
                }
            }
            toHex() {
                let color = this.r << 16 | this.g << 8 | this.b;
                return "#" + color.toString(16);
            }
            toRGB() {
                return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
            }
            toRGBA() {
                return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
            }
        }
        ui.Color = Color;
    })(ui = JS.ui || (JS.ui = {}));
})(JS || (JS = {}));
var Color = JS.ui.Color;
var JS;
(function (JS) {
    let ui;
    (function (ui) {
        class KeyCode {
        }
        KeyCode.BACK = 8;
        KeyCode.Tab = 9;
        KeyCode.Clear = 12;
        KeyCode.Enter = 13;
        KeyCode.shift = 16;
        KeyCode.Control = 17;
        KeyCode.Alt = 18;
        KeyCode.Pause = 19;
        KeyCode.CapsLock = 20;
        KeyCode.Esc = 27;
        KeyCode.Space = 32;
        KeyCode.PageUp = 33;
        KeyCode.PageDown = 34;
        KeyCode.End = 35;
        KeyCode.Home = 36;
        KeyCode.Left = 37;
        KeyCode.Up = 38;
        KeyCode.Right = 39;
        KeyCode.Down = 40;
        KeyCode.Select = 41;
        KeyCode.Print = 42;
        KeyCode.Execute = 43;
        KeyCode.Insert = 45;
        KeyCode.Delete = 46;
        KeyCode.Help = 47;
        KeyCode[0] = 48;
        KeyCode[1] = 49;
        KeyCode[2] = 50;
        KeyCode[3] = 51;
        KeyCode[4] = 52;
        KeyCode[5] = 53;
        KeyCode[6] = 54;
        KeyCode[7] = 55;
        KeyCode[8] = 56;
        KeyCode[9] = 57;
        KeyCode.a = 65;
        KeyCode.b = 66;
        KeyCode.c = 67;
        KeyCode.d = 68;
        KeyCode.e = 69;
        KeyCode.f = 70;
        KeyCode.g = 71;
        KeyCode.h = 72;
        KeyCode.i = 73;
        KeyCode.j = 74;
        KeyCode.k = 75;
        KeyCode.l = 76;
        KeyCode.m = 77;
        KeyCode.n = 78;
        KeyCode.o = 79;
        KeyCode.p = 80;
        KeyCode.q = 81;
        KeyCode.r = 82;
        KeyCode.s = 83;
        KeyCode.t = 84;
        KeyCode.u = 85;
        KeyCode.v = 86;
        KeyCode.w = 87;
        KeyCode.x = 88;
        KeyCode.y = 89;
        KeyCode.z = 90;
        KeyCode.pad0 = 96;
        KeyCode.pad1 = 97;
        KeyCode.pad2 = 98;
        KeyCode.pad3 = 99;
        KeyCode.pad4 = 100;
        KeyCode.pad5 = 101;
        KeyCode.pad6 = 102;
        KeyCode.pad7 = 103;
        KeyCode.pad8 = 104;
        KeyCode.pad9 = 105;
        KeyCode['pad*'] = 106;
        KeyCode['pad+'] = 107;
        KeyCode['pad-'] = 109;
        KeyCode['pad.'] = 110;
        KeyCode['pad/'] = 111;
        KeyCode.F1 = 112;
        KeyCode.F2 = 113;
        KeyCode.F3 = 114;
        KeyCode.F4 = 115;
        KeyCode.F5 = 116;
        KeyCode.F6 = 117;
        KeyCode.F7 = 118;
        KeyCode.F8 = 119;
        KeyCode.F9 = 120;
        KeyCode.F10 = 121;
        KeyCode.F11 = 122;
        KeyCode.F12 = 123;
        KeyCode.NumLk = 144;
        KeyCode.ScrLk = 145;
        KeyCode[';'] = 186;
        KeyCode['='] = 187;
        KeyCode[','] = 188;
        KeyCode['-'] = 189;
        KeyCode['.'] = 190;
        KeyCode['/'] = 191;
        KeyCode['`'] = 192;
        KeyCode['['] = 219;
        KeyCode['\\'] = 220;
        KeyCode[']'] = 221;
        KeyCode["'"] = 222;
        ui.KeyCode = KeyCode;
    })(ui = JS.ui || (JS.ui = {}));
})(JS || (JS = {}));
var KeyCode = JS.ui.KeyCode;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let SizeMode;
        (function (SizeMode) {
            SizeMode["hg"] = "hg";
            SizeMode["lg"] = "lg";
            SizeMode["md"] = "md";
            SizeMode["sm"] = "sm";
            SizeMode["xs"] = "xs";
        })(SizeMode = fx.SizeMode || (fx.SizeMode = {}));
        let ColorMode;
        (function (ColorMode) {
            ColorMode["success"] = "success";
            ColorMode["danger"] = "danger";
            ColorMode["warning"] = "warning";
            ColorMode["info"] = "info";
            ColorMode["primary"] = "primary";
            ColorMode["secondary"] = "secondary";
            ColorMode["accent"] = "accent";
            ColorMode["metal"] = "metal";
            ColorMode["light"] = "light";
            ColorMode["dark"] = "dark";
        })(ColorMode = fx.ColorMode || (fx.ColorMode = {}));
        class WidgetConfig {
            constructor() {
                this.name = '';
                this.tip = '';
                this.style = '';
                this.cls = '';
                this.appendTo = 'body';
                this.renderTo = null;
                this.hidden = false;
                this.sizeMode = SizeMode.md;
                this.faceMode = null;
                this.locale = 'en';
                this.i18n = null;
            }
        }
        fx.WidgetConfig = WidgetConfig;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var SizeMode = JS.fx.SizeMode;
var ColorMode = JS.fx.ColorMode;
var WidgetConfig = JS.fx.WidgetConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let Widget = class Widget {
            constructor(cfg) {
                this._config = null;
                this._initialConfig = null;
                this._isD = false;
                this._i18nBundle = null;
                if (!cfg.id && cfg.renderTo) {
                    let wgt = $(cfg.renderTo);
                    if (wgt.length == 1) {
                        this.widgetEl = wgt;
                        let id = wgt.attr('id');
                        if (id) {
                            this.id = id;
                        }
                        else {
                            this.id = Random.uuid(4, 10).toString();
                            wgt.attr('id', this.id);
                        }
                    }
                }
                else {
                    this.id = cfg.id || Random.uuid(4, 10).toString();
                }
                this._initConfig(cfg);
                this._onBeforeInit();
                this._initDom();
                this._onAfterInit();
            }
            _onBeforeInit() { }
            _onAfterInit() { }
            _initDom() {
                let cfg = this._config;
                this.widgetEl = $('#' + this.id);
                if (this.widgetEl.length == 0) {
                    this.widgetEl = $('<div />', {
                        id: this.id,
                        width: cfg.width,
                        height: cfg.height,
                        title: cfg.tip,
                        style: cfg.style,
                        'klass-name': this.className
                    }).appendTo(cfg.appendTo || 'body');
                }
                else {
                    let attrs = {};
                    if (cfg.tip)
                        attrs['title'] = cfg.tip;
                    if (cfg.style)
                        attrs['style'] = (this.widgetEl.attr('style') || '') + cfg.style;
                    if (!Check.isEmpty(attrs))
                        this.widgetEl.attr(attrs);
                    if (cfg.width)
                        this.widgetEl.css('width', cfg.width);
                }
                this._eventBus = new EventBus(this);
                let listeners = cfg.listeners;
                if (listeners && listeners.rendering)
                    this.on('rendering', listeners.rendering);
                this.render();
            }
            _initConfig(cfg) {
                let defaultCfg = Class.newInstance(this.className + 'Config');
                cfg.name = cfg.name || this.id;
                this._config = Jsons.union(defaultCfg, cfg);
                this._initialConfig = Jsons.clone(this._config);
            }
            initialConfig(key) {
                return Jsons.clone(key ? this._initialConfig[key] : this._initialConfig);
            }
            _onBeforeRender() { }
            _onAfterRender() { }
            render() {
                this._onBeforeRender();
                this._fire('rendering');
                this.off();
                this.widgetEl.off().empty();
                let cfg = this._config;
                this.widgetEl.addClass(`jsfx-${this.getClass().shortName.toLowerCase()} ${cfg.colorMode ? 'color-' + cfg.colorMode : ''} size-${cfg.sizeMode} ${cfg.cls || ''}`);
                let is = this._render();
                let lts = cfg.listeners || {};
                Jsons.forEach(lts, function (handler, type) {
                    if (handler)
                        this.on(type, handler);
                }, this);
                this._onAfterRender();
                if (is !== false)
                    this._fire('rendered');
                return this;
            }
            name() {
                return this._config.name || '';
            }
            _hasFaceMode(key, cfg) {
                cfg = cfg || this._config;
                let t = cfg.faceMode;
                if (!t)
                    return false;
                return t == key || t[key] === true || $.inArray(key, t) != -1;
            }
            _eachMode(type, fn, cfg) {
                cfg = cfg || this._config;
                let mode = cfg[type];
                if (!mode)
                    return;
                let me = this;
                if (Types.isArray(mode)) {
                    mode.forEach(m => {
                        fn.apply(this, [m]);
                    });
                }
                else {
                    fn.apply(me, [mode]);
                }
            }
            destroy() {
                this._fire('destroying');
                this._destroy();
                this._fire('destroyed');
            }
            _destroy() {
                this.off();
                this.widgetEl.remove();
                this._eventBus.destroy();
                this._isD = true;
            }
            show() {
                this._fire('showing');
                this.widgetEl.css('display', '');
                this._fire('shown');
                return this;
            }
            hide() {
                this._fire('hiding');
                this.widgetEl.css('display', 'none');
                this._fire('hidden');
                return this;
            }
            isShown() {
                return this.widgetEl.css('display') != 'none';
            }
            on(types, fn, once) {
                this._eventBus.on(types, fn, once);
                return this;
            }
            off(types) {
                this._eventBus.off(types);
                return this;
            }
            _fire(e, args) {
                return this._eventBus.fire(e, args);
            }
            _createBundle() {
                let defaults = new Bundle(this.getClass().getKlass()['I18N'], this._config.locale);
                if (!this._config.i18n)
                    return defaults;
                let b = new Bundle(this._config.i18n, this._config.locale);
                return defaults ? defaults.set(Jsons.union(defaults.get(), b.get())) : b;
            }
            _i18n(key) {
                if (!this._i18nBundle)
                    this._i18nBundle = this._createBundle();
                return this._i18nBundle ? this._i18nBundle.get(key) : undefined;
            }
            locale(locale) {
                if (arguments.length == 0)
                    return this._config.locale;
                this._config.locale = locale;
                if (locale !== this._config.locale)
                    this._i18nBundle = this._createBundle();
                return this;
            }
        };
        Widget.I18N = null;
        Widget = __decorate([
            klass('JS.fx.Widget'),
            __metadata("design:paramtypes", [fx.WidgetConfig])
        ], Widget);
        fx.Widget = Widget;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Widget = JS.fx.Widget;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class FormWidgetConfig extends fx.WidgetConfig {
            constructor() {
                super(...arguments);
                this.disabled = false;
                this.dataModel = ListModel;
                this.valueModel = Model;
                this.validators = [];
                this.autoValidate = false;
                this.validateMode = 'tip';
                this.readonly = false;
                this.titlePlace = 'left';
                this.titleTextPlace = 'rm';
                this.data = null;
                this.iniValue = null;
            }
        }
        fx.FormWidgetConfig = FormWidgetConfig;
        class FormWidget extends fx.Widget {
            constructor(cfg) {
                super(cfg);
            }
            iniValue(v, render) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.iniValue;
                cfg.iniValue = v;
                if (render)
                    this.value(v, true);
                return this;
            }
            readonly(is) {
                if (arguments.length == 0)
                    return this._config.readonly;
                this._mainEl.prop('readonly', is);
                this._config.readonly = is;
                return this;
            }
            _onBeforeInit() {
                this._initDataModel();
                this._initValueModel();
            }
            _onAfterInit() {
                let cfg = this._config;
                if (cfg.dataQuery)
                    this.load(cfg.dataQuery, true);
                cfg.disabled ? this.disable() : this.enable();
            }
            disable() {
                this._mainEl.prop('disabled', true);
                this._config.disabled = true;
                return this;
            }
            enable() {
                this._mainEl.prop('disabled', false);
                this._config.disabled = false;
                return this;
            }
            isEnabled() {
                return !this._config.disabled;
            }
            title(text) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.title;
                this.widgetEl.find('div[jsfx-role="title"]>span').html(text);
                cfg.title = text;
                return this;
            }
            _hAlign() {
                let al = this._config.titleTextPlace || 'lm';
                return { 'l': 'left', 'r': 'right', 'c': 'center' }[al.substr(0, 1)];
            }
            _vAlign() {
                let al = this._config.titleTextPlace || 'lm';
                return { 't': 'top', 'b': 'bottom', 'm': 'middle' }[al.substr(1, 1)];
            }
            _render() {
                let cfg = this._config, titleAttrs = cfg.tip ? ` title=${cfg.tip}` : '';
                if (cfg.title) {
                    let tValign = this._vAlign(), tHalign = this._hAlign(), p0 = tHalign == 'right' && cfg.titlePlace == 'top' ? 'p-0' : '', cls = `${p0} font-${cfg.sizeMode || 'md'} items-${tValign} items-${tHalign} ${cfg.colorMode ? 'text-' + cfg.colorMode : ''} ${cfg.titleCls || ''}"`;
                    let style = Types.isDefined(cfg.titleWidth) ? `width:${Lengths.toCssString(cfg.titleWidth, '100%')};` : '';
                    if (cfg.titleStyle)
                        style += cfg.titleStyle;
                    titleAttrs += ` class="${cls}"`;
                    if (style)
                        titleAttrs += ` style="${style}"`;
                }
                let html = `<div jsfx-role="title"${titleAttrs}>${cfg.title ? '<span>' + cfg.title + '</span>' : ''}</div> 
                    <div jsfx-role="body" class="font-${cfg.sizeMode || 'md'} items-middle ${cfg.bodyCls || ''}" style="flex:1;${cfg.bodyStyle || ''}">
                        ${this._bodyFragment()}
                    </div>`;
                this.widgetEl.html(html);
                this._mainEl = this.widgetEl.find('[jsfx-role=main]');
            }
            _onBeforeRender() {
                let cfg = this._config, w = Lengths.toCssString(cfg.width, '100%'), d = cfg.titlePlace == 'left' ? 'flex' : 'grid', css = {
                    'display': (w == 'auto' ? 'inline-' : '') + d,
                    'width': w
                };
                this.widgetEl.css(css);
            }
            _iniValue() {
                let cfg = this._config;
                this.value(cfg.iniValue, true);
            }
            _onAfterRender() {
                this.on('validated', (e, rst, val, name) => {
                    window.setTimeout(() => {
                        rst.hasError() ? this._showError(rst.getErrors(name)[0].message) : this._hideError();
                    }, 100);
                });
                this._iniValue();
            }
            _showError(msg) {
                let cfg = this._config, mode = cfg.validateMode, fn = (mode == 'tip' || (mode && mode['mode'] == 'tip')) ? this._showTipError : mode['showError'];
                if (fn)
                    fn.apply(this, [msg]);
            }
            _hideError() {
                let cfg = this._config, mode = cfg.validateMode, fn = (mode == 'tip' || (mode && mode['mode'] == 'tip')) ? this._hideTipError : mode['hideError'];
                if (fn)
                    fn.call(this);
            }
            _getTipEl(place) {
                let cfg = this._config;
                return this.widgetEl.find(cfg.titlePlace == 'left' && place == 'left' ? '[jsfx-role=title]>span' : '[jsfx-role=body]');
            }
            _showTipError(msg) {
                if (!msg)
                    return;
                let div = this.widgetEl.find('.error .tooltip-inner');
                if (div.length == 1) {
                    div.html(msg);
                }
                else {
                    let cfg = this._config, mode = cfg.validateMode, place = mode && mode['place'] ? mode['place'] : 'right', el = this._getTipEl(place);
                    el.tooltip({
                        placement: place,
                        offset: '0, 2px',
                        fallbackPlacement: 'clockwise',
                        container: el[0],
                        trigger: 'manual',
                        html: false,
                        title: msg,
                        template: '<div class="tooltip error" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
                    }).tooltip('show');
                }
            }
            _hideTipError() {
                let cfg = this._config, mode = cfg.validateMode, place = mode && mode['place'] ? mode['place'] : 'right', el = this._getTipEl(place);
                if (el.tooltip)
                    el.tooltip('dispose');
            }
            _validate(name, val, rst) {
                let field = new ModelField({
                    name: name,
                    validators: this._config.validators
                });
                return field.validate(val, rst);
            }
            validate() {
                if (Check.isEmpty(this._config.validators))
                    return true;
                let name = this.name(), rst = new ValidateResult(), val = Jsons.clone(this.value());
                this._fire('validating', [rst, val, name]);
                let vdt = this._validate(name, val, rst);
                this._fire('validated', [rst, val, name]);
                return vdt;
            }
            dataModel() {
                return this._dataModel;
            }
            _initDataModel() {
                let me = this, cfg = this._config;
                this._dataModel = Class.newInstance(cfg.dataModel);
                ['loading', 'loadsuccess', 'loadfailure', 'loaderror', 'dataupdating', 'dataupdated'].forEach(e => {
                    this._dataModel.on(e, function () {
                        if (e == 'dataupdated')
                            me.data(this.getData(), true);
                        me._fire(e, Arrays.slice(arguments, 1));
                    });
                });
            }
            data(data, silent) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.data;
                let newData = Jsons.clone(data), oldData = Jsons.clone(cfg.data);
                if (!silent)
                    this._fire('dataupdating', [newData, oldData]);
                cfg.data = data;
                if (this._dataModel)
                    this._dataModel.setData(data, true);
                this._renderData();
                this._renderValue();
                if (!silent)
                    this._fire('dataupdated', [newData, oldData]);
                return this;
            }
            _renderData() { }
            clear(silent) {
                return this.value(null, silent);
            }
            load(quy, silent) {
                let cfg = this._config;
                cfg.dataQuery = Jsons.union(Ajax.toRequest(cfg.dataQuery), Ajax.toRequest(quy));
                return this._dataModel.load(cfg.dataQuery, silent);
            }
            reload() {
                if (this._dataModel)
                    this._dataModel.reload();
                return this;
            }
            _equalValues(newVal, oldVal) {
                return oldVal == newVal;
            }
            value(val, silent) {
                let cfg = this._config, oldVal = this._valueModel.get(this.name());
                if (arguments.length == 0)
                    return oldVal;
                this._setValue(val, silent || this._equalValues(val, oldVal));
                this._renderValue();
                return this;
            }
            _setValue(val, silent) {
                this._hideError();
                this._valueModel.set(this.name(), val, silent || this._equalValues(val, this.value()));
                if (this._config.autoValidate)
                    this.validate();
            }
            _renderValue() {
                let v = this.value() || '';
                if (this._mainEl.val() !== v)
                    this._mainEl.val(v);
            }
            reset() {
                return this.value(this._config.iniValue);
            }
            valueModel() {
                return this._valueModel;
            }
            _initValueModel() {
                let cfg = this._config, vModel = cfg.valueModel;
                if (!vModel) {
                    this._valueModel = new Model();
                }
                else if (Types.subKlass(vModel, Model)) {
                    this._valueModel = Class.newInstance(vModel);
                }
                else {
                    this._valueModel = vModel;
                }
                this._valueModel.addField({
                    name: this.name(),
                    validators: cfg.validators
                });
                let me = this;
                this._valueModel.on('dataupdated', function (e, newData) {
                    let fName = me.name();
                    if (newData && newData.hasOwnProperty(fName)) {
                        me.value(newData[fName]);
                    }
                });
                this._valueModel.on('fieldchanged', (e, newVal, oldVal) => {
                    this._fire('changed', [newVal, oldVal]);
                });
            }
        }
        fx.FormWidget = FormWidget;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var FormWidgetConfig = JS.fx.FormWidgetConfig;
var FormWidget = JS.fx.FormWidget;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let ButtonFaceMode;
        (function (ButtonFaceMode) {
            ButtonFaceMode["square"] = "square";
            ButtonFaceMode["round"] = "round";
            ButtonFaceMode["round_left"] = "round-left";
            ButtonFaceMode["round_right"] = "round-right";
            ButtonFaceMode["pill"] = "pill";
            ButtonFaceMode["pill_left"] = "pill-left";
            ButtonFaceMode["pill_right"] = "pill-right";
            ButtonFaceMode["shadow"] = "shadow";
        })(ButtonFaceMode = fx.ButtonFaceMode || (fx.ButtonFaceMode = {}));
        class ButtonConfig extends fx.WidgetConfig {
            constructor() {
                super(...arguments);
                this.faceMode = ButtonFaceMode.square;
                this.outline = false;
                this.dropMenu = null;
                this.disabled = false;
            }
        }
        fx.ButtonConfig = ButtonConfig;
        let Button = class Button extends fx.Widget {
            constructor(cfg) {
                super(cfg);
            }
            _render() {
                let cfg = this._config, text = cfg.text || '', cls = 'btn btn-block', bdgAttr = '';
                if (cfg.colorMode)
                    cls += ` btn-${cfg.colorMode}`;
                if (cfg.outline)
                    cls += ' btn-outline';
                if (cfg.sizeMode)
                    cls += ` btn-${cfg.sizeMode}`;
                if (cfg.badge) {
                    let isStr = Types.isString(cfg.badge), bdg = {
                        text: isStr ? cfg.badge : cfg.badge.text || '',
                        color: isStr ? fx.ColorMode.danger : cfg.badge.color || fx.ColorMode.danger
                    };
                    cls += ' jsfx-badge jsfx-badge-' + bdg.color;
                    bdgAttr = ` data-badge="${bdg.text}"`;
                }
                if (cfg.dropMenu)
                    cls += ` dropdown-toggle`;
                this._eachMode('faceMode', mode => {
                    cls += ' border-' + mode;
                });
                if (cfg.cls)
                    cls += ' ' + cfg.cls;
                let icon = '';
                if (cfg.iconCls)
                    icon = `<i class="${cfg.iconCls}"></i>`;
                let button = `<button type="button" ${cfg.style ? 'style="' + cfg.style + '"' : ''} ${cfg.disabled ? 'disabled' : ''} ${bdgAttr} title="${cfg.tip}" ${cfg.dropMenu ? 'data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"' : ''} class="${cls}" jsfx-role="main">
                ${icon}${text ? (icon ? ` ${text}` : text) : ''}</button>`;
                if (cfg.dropMenu)
                    button = this._dropDown(button);
                this.widgetEl.html(button);
                this._mainEl = this.widgetEl.find('[jsfx-role=main]');
            }
            _onAfterRender() {
                this._mainEl.on('click', () => {
                    return this._fire('click');
                });
            }
            _dropDown(buttonHtml) {
                let dropDown = this._config.dropMenu, html = `
                    <div class="btn-group ${'drop' + (dropDown.dir || 'down')}">
                        ${buttonHtml}
                        <div class="dropdown-menu">
                        ${this._dropDownItems(dropDown.items)}
                        </div>
                    </div>
                `;
                return html;
            }
            _dropDownItems(items) {
                if (!Types.isDefined(items))
                    return '';
                let html = '';
                items.forEach((item, i) => {
                    html += this._dropDownItem(item, i);
                });
                return html;
            }
            _dropDownItem(item, index) {
                let id = 'dropdown-item' + index + '-' + Random.uuid(3, 10), span = item.html || `${item.iconCls ? `<i class="${item.iconCls}"></i>` : ''}<span class="">${Strings.escapeHTML(item.text)}</span>`, html = '';
                if (item.caption)
                    html += `<h6 class='dropdown-header'>${Strings.escapeHTML(item.caption)}</h6>`;
                html += `<a class='dropdown-item ${this._config.colorMode} ${item.selected ? 'active' : ''}' id='${id}'  href='${item.href ? encodeURI(item.href) : 'javascript:void(0);'}'>${span}</a>`;
                if (item.hasDivider)
                    html += `<div class='dropdown-divider'></div>`;
                let me = this;
                if (item.onClick)
                    $(document).on('click', '#' + id, function (e) {
                        return item.onClick.apply(me, [e.originalEvent, item]);
                    });
                return html;
            }
            disable() {
                this._mainEl.prop('disabled', true);
                this._config.disabled = true;
                return this;
            }
            enable() {
                this._mainEl.prop('disabled', false);
                this._config.disabled = false;
                return this;
            }
            toggle() {
                let d = this._mainEl.find('.dropdown-toggle');
                if (d.length < 1)
                    return;
                d.dropdown('toggle');
                return this;
            }
            badge(option) {
                if (arguments.length == 0) {
                    return this._mainEl.attr('data-badge');
                }
                else if (Check.isEmpty(option)) {
                    this._mainEl.removeAttr('data-badge');
                }
                else {
                    let isStr = Types.isString(option), bdg = {
                        text: isStr ? option : option.text || '',
                        color: isStr ? fx.ColorMode.danger : option.color || fx.ColorMode.danger
                    };
                    this._mainEl.addClass('jsfx-badge jsfx-badge-' + bdg.color);
                    bdg.text ? this._mainEl.attr('data-badge', bdg.text) : this._mainEl.removeAttr('data-badge');
                }
                return this;
            }
        };
        Button = __decorate([
            widget('JS.fx.Button'),
            __metadata("design:paramtypes", [ButtonConfig])
        ], Button);
        fx.Button = Button;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Button = JS.fx.Button;
var ButtonConfig = JS.fx.ButtonConfig;
var ButtonFaceMode = JS.fx.ButtonFaceMode;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class CarouselConfig extends fx.WidgetConfig {
            constructor() {
                super(...arguments);
                this.interval = 5000;
                this.activeIndex = 0;
            }
        }
        fx.CarouselConfig = CarouselConfig;
        let Carousel = class Carousel extends fx.Widget {
            constructor(cfg) {
                super(cfg);
            }
            prev() {
                this.widgetEl.carousel('prev');
                return this;
            }
            next() {
                this.widgetEl.carousel('next');
                return this;
            }
            pause() {
                this.widgetEl.carousel('pause');
                return this;
            }
            cycle() {
                this.widgetEl.carousel('cycle');
                return this;
            }
            goto(num) {
                this.widgetEl.carousel(num);
                return this;
            }
            _destroy() {
                this.widgetEl.carousel('dispose');
                super._destroy();
            }
            length() {
                let items = this._config.items;
                return !items ? 0 : items.length;
            }
            add(item, from) {
                let size = this.length();
                if (!Types.isDefined(from) || from >= size)
                    from = size - 1;
                let cfg = this._config;
                cfg.items = cfg.items || [];
                cfg.items.add([item], from);
                this._renderItems(from);
                return this;
            }
            remove(num) {
                if (!Types.isDefined(num) || num < 0)
                    return this;
                let size = this.length();
                if (size == 0 || num >= size)
                    return this;
                let cfg = this._config;
                if (!cfg.items)
                    cfg.items = [];
                cfg.items.remove(num);
                this._renderItems(num >= 0 ? num : 0);
                return this;
            }
            clear() {
                this.widgetEl.find('.carousel-indicators').empty();
                this.widgetEl.find('.carousel-inner').empty();
                this._config.items = null;
            }
            _limitActive() {
                let cfg = this._config, size = this.length();
                cfg.activeIndex = cfg.activeIndex >= (size - 1) ? (size - 1) : (cfg.activeIndex <= 0 ? 0 : cfg.activeIndex);
            }
            _indHtml(i) {
                let is = this._config.activeIndex == i;
                return `<li data-target="#${this.id}" data-slide-to="${i}" class="${is ? 'active' : ''}"></li>`;
            }
            _itemHtml(item, i) {
                let is = this._config.activeIndex == i;
                let capHtml = '';
                if (item.caption || item.desc) {
                    capHtml =
                        `<div class="carousel-caption d-md-block">
                        <h5>${item.caption || ''}</h5>
                        <p>${item.desc || ''}</p>
                    </div>`;
                }
                return `
                <div class="carousel-item ${is ? 'active' : ''}" jsfx-index="${i}">
                    <img class="d-block w-100" src="${item.src}" style="height:${Lengths.toCssString(this._config.height, '100%')};" alt="${item.imgAlt || ''}">
                    ${capHtml}
                </div>
                `;
            }
            _renderItems(num) {
                this._limitActive();
                let cfg = this._config, indsHtml = '', itemsHtml = '';
                if (cfg.items)
                    cfg.items.forEach((item, i) => {
                        indsHtml += this._indHtml(i);
                        itemsHtml += this._itemHtml(item, i);
                    });
                this.pause();
                this.widgetEl.find('.carousel-indicators').html(indsHtml);
                this.widgetEl.find('.carousel-inner').html(itemsHtml);
                this.widgetEl.carousel({
                    interval: cfg.interval
                });
                this.goto(num);
            }
            _render() {
                this._limitActive();
                let cfg = this._config, indsHtml = '', itemsHtml = '';
                if (cfg.items)
                    cfg.items.forEach((item, i) => {
                        indsHtml += this._indHtml(i);
                        itemsHtml += this._itemHtml(item, i);
                    });
                let html = `
                <ol class="carousel-indicators">
                    ${indsHtml}
                </ol>
                <div class="carousel-inner" style="height:${Lengths.toCssString(cfg.height, '100%')}">
                    ${itemsHtml}
                </div>
                <a class="carousel-control-prev" href="#${this.id}" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                </a>
                <a class="carousel-control-next" href="#${this.id}" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                </a>
                `;
                this.widgetEl.attr('data-ride', 'carousel');
                this.widgetEl.addClass('carousel slide bg-light');
                this.widgetEl.css({ 'width': Lengths.toCssString(cfg.width, '100%') });
                this.widgetEl.html(html);
                this.widgetEl.on('slide.bs.carousel', (e) => {
                    let from = e.from, to = e.to;
                    if (from != -1 && to != -1)
                        this._fire('transiting', [from, to]);
                });
                this.widgetEl.on('slid.bs.carousel', (e) => {
                    let from = e.from, to = e.to;
                    this._fire('transited', [from, to]);
                });
                this.widgetEl.carousel({
                    interval: cfg.interval
                });
            }
        };
        Carousel = __decorate([
            widget('JS.fx.Carousel'),
            __metadata("design:paramtypes", [CarouselConfig])
        ], Carousel);
        fx.Carousel = Carousel;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Carousel = JS.fx.Carousel;
var CarouselConfig = JS.fx.CarouselConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class ChoiceConfig extends fx.FormWidgetConfig {
        }
        fx.ChoiceConfig = ChoiceConfig;
        class Choice extends fx.FormWidget {
            constructor(cfg) {
                super(cfg);
            }
            _bodyFragment() {
                let isList = this._hasFaceMode('list') ? true : false;
                return `<div class="jsfx-choice-${isList ? 'list' : 'inline'}"> </div>`;
            }
            _choicesHtml(type) {
                let cfg = this._config, data = cfg.data;
                if (!data)
                    return '';
                let val = Arrays.toArray(this.value()), html = '', textColor = cfg.textColorMode ? 'text-' + cfg.textColorMode : '', mode1 = this._hasFaceMode('round') ? 'round' : 'square', mode2 = this._hasFaceMode('ring') ? 'ring' : 'dot', disable = cfg.disabled ? 'disabled' : '';
                data.forEach((d, i) => {
                    html += `
                    <label class="font-${cfg.sizeMode || 'md'} ${mode1} ${mode2} ${cfg.colorMode || ''} ${textColor} ${disable}">
                        <input id="${this.id}_${i}" name="${this.name()}" ${disable} ${val.findIndex(it => { return it == d.id; }) >= 0 ? 'checked' : ''} type="${type}" value="${d.id}"/>
                        <span class="text">${d.text || ''}</span>
                        <span class="choice"></span>
                    </label>`;
                });
                return html;
            }
            isSelected() {
                return !Check.isEmpty(this.value());
            }
            _renderData(type) {
                this.widgetEl.find('[jsfx-role=body]>div').off().empty().html(this._choicesHtml(type));
                if (!this.readonly()) {
                    let el = this.widgetEl.find('input');
                    el.on('change', () => {
                        this._setValue(this._getDomValue());
                    }).on('click', () => {
                        this._setValue(this._getDomValue(), true);
                        this._fire('click');
                    });
                }
            }
            _renderValue() {
                let cVal = this.value(), v = Arrays.toArray(cVal), val = Arrays.toArray(this._getDomValue());
                if (!Arrays.same(val, v)) {
                    this._setDomValue(cVal);
                }
            }
            _onAfterRender() {
                this._renderData();
                super._onAfterRender();
            }
            disable() {
                this._config.disabled = true;
                this.widgetEl.find('input').prop('disabled', true);
                this.widgetEl.find('label').addClass('disabled');
                return this;
            }
            enable() {
                this._config.disabled = false;
                this.widgetEl.find('input').prop('disabled', false);
                this.widgetEl.find('label').removeClass('disabled');
                return this;
            }
            readonly(is) {
                if (arguments.length == 0)
                    return this._config.readonly;
                this.widgetEl.find('input').prop('readonly', is);
                this._config.readonly = is;
                return this;
            }
        }
        fx.Choice = Choice;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Choice = JS.fx.Choice;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class CheckboxConfig extends fx.ChoiceConfig {
            constructor() {
                super(...arguments);
                this.faceMode = CheckboxFaceMode.inline;
            }
        }
        fx.CheckboxConfig = CheckboxConfig;
        let CheckboxFaceMode;
        (function (CheckboxFaceMode) {
            CheckboxFaceMode["square"] = "square";
            CheckboxFaceMode["round"] = "round";
            CheckboxFaceMode["inline"] = "inline";
            CheckboxFaceMode["list"] = "list";
        })(CheckboxFaceMode = fx.CheckboxFaceMode || (fx.CheckboxFaceMode = {}));
        let Checkbox = class Checkbox extends fx.Choice {
            _getDomValue() {
                let v = [], els = this.widgetEl.find('input:checked');
                els.each((i, el) => {
                    v.push($(el).val());
                });
                return v;
            }
            _setDomValue(v) {
                this.widgetEl.find('input').each((i, el) => {
                    let n = $(el);
                    n.prop('checked', !Check.isEmpty(v) && v.findIndex(it => { return it == n.val(); }) > -1 ? true : false);
                });
            }
            constructor(cfg) {
                super(cfg);
            }
            _equalValues(newVal, oldVal) {
                return Arrays.same(newVal, oldVal);
            }
            _renderData() {
                super._renderData('checkbox');
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value();
                return super.value(val || [], silent);
            }
            select(val) {
                if (Check.isEmpty(val)) {
                    let v = [], els = this.widgetEl.find('input:checkbox');
                    els.each((i, el) => {
                        v.push($(el).val());
                    });
                    this._setDomValue(v);
                }
                else {
                    this.unselect();
                    let oldVal = this.value() || [], addVal = Arrays.toArray(val);
                    addVal.forEach(v => {
                        if (oldVal.findIndex(it => { return it == v; }) == -1)
                            oldVal.push(v);
                    });
                    this.value(oldVal);
                }
                return this;
            }
            unselect(val) {
                if (!val) {
                    this.value(null);
                }
                else {
                    let oldVal = this.value() || [], delVal = Arrays.toArray(val);
                    delVal.forEach(v => {
                        oldVal.remove(it => {
                            return it == v;
                        });
                    });
                    this.value(oldVal);
                }
                return this;
            }
        };
        Checkbox = __decorate([
            widget('JS.fx.Checkbox'),
            __metadata("design:paramtypes", [CheckboxConfig])
        ], Checkbox);
        fx.Checkbox = Checkbox;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var CheckboxConfig = JS.fx.CheckboxConfig;
var CheckboxFaceMode = JS.fx.CheckboxFaceMode;
var Checkbox = JS.fx.Checkbox;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        ;
        class InputConfig extends fx.FormWidgetConfig {
            constructor() {
                super(...arguments);
                this.inputCls = '';
                this.inputStyle = '';
                this.maxlength = Infinity;
                this.placeholder = '';
                this.autoclear = true;
                this.autofocus = false;
                this.outline = false;
            }
        }
        fx.InputConfig = InputConfig;
        class Input extends fx.FormWidget {
            constructor(cfg) {
                super(cfg);
            }
            maxlength(len) {
                if (arguments.length == 0)
                    return this._config.maxlength;
                this._mainEl.prop('maxlength', len);
                this._config.maxlength = len;
                return this;
            }
            placeholder(holder) {
                if (arguments.length == 0)
                    return this._config.placeholder;
                holder = holder || '';
                this._config.placeholder = holder;
                this._mainEl.attr('placeholder', holder);
                return this;
            }
        }
        fx.Input = Input;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var InputConfig = JS.fx.InputConfig;
var Input = JS.fx.Input;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let LineInputFaceMode;
        (function (LineInputFaceMode) {
            LineInputFaceMode["square"] = "square";
            LineInputFaceMode["round"] = "round";
            LineInputFaceMode["pill"] = "pill";
            LineInputFaceMode["shadow"] = "shadow";
        })(LineInputFaceMode = fx.LineInputFaceMode || (fx.LineInputFaceMode = {}));
        class LineInputConfig extends fx.InputConfig {
            constructor() {
                super(...arguments);
                this.inputCls = '';
                this.inputStyle = '';
                this.textAlign = 'left';
                this.faceMode = LineInputFaceMode.square;
            }
        }
        fx.LineInputConfig = LineInputConfig;
        class LineInput extends fx.Input {
            constructor(cfg) {
                super(cfg);
            }
            _inputAttrs(type = 'text') {
                let cfg = this._config, cls = '', shape = LineInputFaceMode.square;
                this._eachMode('faceMode', mode => {
                    cls += ' border-' + mode;
                    if (mode != LineInputFaceMode.shadow)
                        shape = mode;
                });
                if (cfg.leftAddon || cfg.rightAddon)
                    cls += ` border-${cfg.leftAddon ? 'square' : shape}-left border-${cfg.rightAddon ? 'square' : shape}-right`;
                let color = cfg.colorMode;
                if (color)
                    cls += ` ${cfg.outline ? 'border' : 'focus'}-${color}`;
                let style = `text-align:${cfg.textAlign};${cfg.inputStyle}`;
                return {
                    'jsfx-role': 'main',
                    type: type,
                    placeholder: Strings.escapeHTML(cfg.placeholder),
                    autofocus: cfg.autofocus ? 'autofocus' : undefined,
                    readonly: cfg.readonly ? 'readonly' : undefined,
                    disabled: cfg.disabled ? 'disabled' : undefined,
                    maxlength: Number.isFinite(cfg.maxlength) && cfg.maxlength > 0 ? cfg.maxlength + '' : '',
                    style: style,
                    'class': `form-control ${cls} ${cfg.inputCls}`,
                    'data-toggle': 'tooltip',
                    'data-trigger': 'hover focus'
                };
            }
            _inputHtml(type = 'text') {
                return Strings.nodeHTML('input', this._inputAttrs(type));
            }
            _iconHtml(icon, id, lr) {
                if (!icon)
                    return '';
                let me = this, cfg = this._config;
                if (icon.onClick)
                    $(document).on('click', '#' + id, function (e) {
                        if (me.isEnabled())
                            icon.onClick.apply(me, [e.originalEvent, this]);
                        return false;
                    });
                let display = id.endsWith('-clear') && (this.readonly() || !this.isEnabled() || Check.isEmpty(this.value())) ? 'style="display:none;"' : '';
                return `<span id="${id}" title="${icon.tip || ''}" ${display} class="jsfx-input-icon ${lr}-icon">
                <span><i class="${icon.cls} ${cfg.colorMode ? 'text-' + cfg.colorMode : ''}"></i></span></span>`;
            }
            _inputGroup(type) {
                let cfg = this._config, cls = 'jsfx-input-div', innerIcon = Types.isString(cfg.innerIcon) ? { cls: cfg.innerIcon } : cfg.innerIcon, clearIcon = cfg.autoclear ? {
                    cls: 'fas fa-times-circle',
                    tip: 'Clear',
                    onClick: function (e, el) {
                        this.clear();
                        $(el).hide();
                        return false;
                    }
                } : null, leftIcon = cfg.textAlign == 'right' ? clearIcon : innerIcon, rightIcon = cfg.textAlign == 'right' ? innerIcon : clearIcon;
                if (leftIcon)
                    cls += ' left-icon';
                if (rightIcon)
                    cls += ' right-icon';
                return `
                    <div class="${cls}">
                    ${this._inputHtml(type)}
                    ${this._iconHtml(leftIcon, this.id + '-icon' + (cfg.textAlign == 'right' ? '-clear' : ''), 'left')}
                    ${this._iconHtml(rightIcon, this.id + '-icon' + (cfg.textAlign == 'right' ? '' : '-clear'), 'right')}
                    </div>`;
            }
            _bodyFragment(type = 'text') {
                let cfg = this._config, cls = 'jsfx-input-group input-group font-' + (cfg.sizeMode || 'md');
                return `<div class="${cls}">
                            ${cfg.leftAddon ? '<div id="' + this.id + '-btn-left" class="input-group-prepend"/>' : ''}
                            ${this._inputGroup(type)}
                            ${cfg.rightAddon ? '<div id="' + this.id + '-btn-right" class="input-group-append"/>' : ''}
                        </div>`;
            }
            _render() {
                super._render();
                this._renderAddons();
            }
            _onAfterRender() {
                let cfg = this._config;
                if (cfg.autoclear)
                    this._mainEl.on('change input focus blur', () => {
                        if (cfg.disabled || cfg.readonly)
                            return;
                        let clear = $('#' + this.id + '-icon-clear');
                        Check.isEmpty(this._mainEl.val()) ? clear.hide() : clear.show();
                    });
                super._onAfterRender();
            }
            _renderAddon(cfg, id, isLeft) {
                cfg['sizeMode'] = this._config.sizeMode || 'md';
                let fm = [];
                if (this._hasFaceMode('shadow'))
                    fm.push('shadow');
                fm.push(fx.ButtonFaceMode.square);
                if (this._hasFaceMode('round', cfg)) {
                    fm.push(isLeft ? fx.ButtonFaceMode.round_left : fx.ButtonFaceMode.round_right);
                }
                else if (this._hasFaceMode('round')) {
                    fm.push(isLeft ? fx.ButtonFaceMode.round_left : fx.ButtonFaceMode.round_right);
                }
                else if (this._hasFaceMode('pill', cfg)) {
                    fm.push(isLeft ? fx.ButtonFaceMode.pill_left : fx.ButtonFaceMode.pill_right);
                }
                else if (this._hasFaceMode('pill')) {
                    fm.push(isLeft ? fx.ButtonFaceMode.pill_left : fx.ButtonFaceMode.pill_right);
                }
                cfg.faceMode = fm;
                if (!cfg.onClick && !cfg.dropMenu)
                    cfg['style'] = 'cursor:default;';
                cfg['id'] = id;
                cfg.colorMode = cfg.colorMode || this._config.colorMode || fx.ColorMode.primary;
                let btn = new fx.Button(cfg);
                if (cfg.onClick)
                    btn.on('click', () => {
                        cfg.onClick.apply(this);
                    });
            }
            _toAddon(addon) {
                return Types.isString(addon) ? { text: addon } : addon;
            }
            _renderAddons() {
                let cfg = this._config;
                if (cfg.leftAddon)
                    this._renderAddon(this._toAddon(cfg.leftAddon), this.id + '-btn-left', true);
                if (cfg.rightAddon)
                    this._renderAddon(this._toAddon(cfg.rightAddon), this.id + '-btn-right', false);
            }
            _showError(msg) {
                super._showError(msg);
                this._mainEl.addClass('jsfx-input-error');
                this.widgetEl.find('[jsfx-role=body]').find('.jsfx-input-icon i').addClass('text-danger');
            }
            _hideError() {
                super._hideError();
                this._mainEl.removeClass('jsfx-input-error');
                this.widgetEl.find('[jsfx-role=body]').find('.jsfx-input-icon i').removeClass('text-danger');
            }
        }
        fx.LineInput = LineInput;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var LineInputFaceMode = JS.fx.LineInputFaceMode;
var LineInputConfig = JS.fx.LineInputConfig;
var LineInput = JS.fx.LineInput;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class DatePickerConfig extends fx.LineInputConfig {
            constructor() {
                super(...arguments);
                this.title = '';
                this.format = 'YYYY-MM-DD';
                this.autoclose = false;
                this.todayBtn = false;
                this.todayHighlight = false;
                this.calendarWeeks = false;
                this.clearBtn = false;
                this.orientation = 'auto';
                this.embedded = false;
                this.multidateSeparator = ',';
            }
        }
        fx.DatePickerConfig = DatePickerConfig;
        let DatePicker = class DatePicker extends fx.LineInput {
            constructor(cfg) {
                super(cfg);
            }
            showPicker() {
                this._picker.datepicker('show');
                return this;
            }
            hidePicker() {
                this._picker.datepicker('hide');
                return this;
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value();
                return super.value(Types.isDate(val) ? val.format(this._config.format) : val, silent);
            }
            _renderValue() {
                let v = this.value() || '';
                if (this._mainEl.val() !== v)
                    this._picker.datepicker('update', v);
                return this;
            }
            _inputHtml() {
                let cfg = this._config;
                if (!cfg.embedded)
                    return super._inputHtml();
                return `<div id="${this.id}_picker"></div><input name="${this.name()}" type="hidden" jsfx-role="main">`;
            }
            _onBeforeRender() {
                if (this._picker)
                    this._picker.datepicker('destroy');
                if (!this._config.embedded)
                    super._onBeforeRender();
            }
            _onAfterRender() {
                let cfg = Jsons.clone(this._config), el = cfg.embedded ? $(`#${this.id}_picker`) : this._mainEl;
                cfg.orientation = { auto: 'auto', lt: 'left top', lb: 'left bottom', rt: 'right top', rb: 'right bottom' }[cfg.orientation];
                let c = cfg;
                c.immediateUpdates = true;
                c.language = cfg.locale;
                c.enableOnReadonly = false;
                c.todayBtn = cfg.todayBtn ? 'linked' : false;
                c.startDate = cfg.minDate;
                c.endDate = cfg.maxDate;
                c.weekStart = 1;
                c.updateViewDate = false;
                c.format = cfg.format.replace(/YYYY|YY|MMMM|MMM|MM|M|DD|D|dddd|ddd/g, function (m) {
                    switch (m) {
                        case "YYYY":
                            return 'yyyy';
                        case "YY":
                            return 'yy';
                        case "MMMM":
                            return 'MM';
                        case "MMM":
                            return 'M';
                        case "MM":
                            return 'mm';
                        case "M":
                            return 'm';
                        case "DD":
                            return 'dd';
                        case "D":
                            return 'd';
                        case "dddd":
                            return 'DD';
                        case "ddd":
                            return 'D';
                        default: return m;
                    }
                });
                this._picker = el.datepicker(c);
                this._picker.on('show', () => {
                    if ($('.datepicker').css('display') == 'block')
                        this._fire('pickershown');
                });
                this._picker.on('hide', () => {
                    this._fire('pickerhidden');
                });
                this._picker.on('changeDate', () => {
                    this._setValue(this._picker.datepicker('getFormattedDate'));
                });
                this._mainEl.on('input change blur', () => {
                    let newVal = this._mainEl.val();
                    if (this.value() != newVal)
                        this._setValue(newVal);
                });
                super._onAfterRender();
            }
            _destroy() {
                if (this._picker)
                    this._picker.datepicker('destroy');
                super._destroy();
            }
        };
        DatePicker = __decorate([
            widget('JS.fx.DatePicker'),
            __metadata("design:paramtypes", [DatePickerConfig])
        ], DatePicker);
        fx.DatePicker = DatePicker;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var DatePickerConfig = JS.fx.DatePickerConfig;
var DatePicker = JS.fx.DatePicker;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class DateRangePickerConfig extends fx.LineInputConfig {
            constructor() {
                super(...arguments);
                this.readonly = false;
                this.format = 'YYYY/MM/DD';
                this.dateSeparator = ' - ';
                this.popDir = 'center';
                this.autoclose = false;
                this.minutesPlus = false;
                this.secondsPlus = false;
                this.showCalendars = true;
            }
        }
        fx.DateRangePickerConfig = DateRangePickerConfig;
        let DateRangePicker = class DateRangePicker extends fx.LineInput {
            constructor(cfg) {
                super(cfg);
            }
            _autoFormat() {
                let cfg = this._config;
                if (cfg.secondsPlus)
                    return 'YYYY/MM/DD HH:mm:ss';
                if (cfg.minutesPlus)
                    return 'YYYY/MM/DD HH:mm';
                return 'YYYY/MM/DD';
            }
            _equalValues(newVal, oldVal) {
                if (!oldVal && !newVal)
                    return true;
                if (!oldVal || !newVal)
                    return false;
                return oldVal[0] == newVal[0] && oldVal[1] == newVal[1];
            }
            _errorType(val) {
                throw new Errors.TypeError('An invalid date format for DateRangePicker:' + val.toString());
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value();
                let cfg = this._config, arr = null;
                if (val) {
                    arr = [];
                    if (Types.isArray(val)) {
                        if (val.length < 2)
                            this._errorType(val);
                        arr = [this._formatDate(val[0]), this._formatDate(val[1])];
                    }
                    else if (val.indexOf(cfg.dateSeparator) < 0) {
                        this._errorType(val);
                    }
                    else {
                        arr = val.split(cfg.dateSeparator);
                    }
                }
                return super.value(arr, silent);
            }
            _formatDate(date) {
                let d = date ? date : new Date();
                return Types.isDate(d) ? d.format(this._config.format || this._autoFormat()) : (d || '');
            }
            _dateString(val) {
                let cfg = this._config;
                return Check.isEmpty(val) ? '' : `${this._formatDate(val[0])}${cfg.dateSeparator}${this._formatDate(val[1])}`;
            }
            _renderValue() {
                let val = this.value(), today = new Date(), text = this._dateString(val);
                if (text != this._mainEl.val()) {
                    this._mainEl.val(text);
                    if (this._picker) {
                        let d1 = val ? val[0] || today : today, d2 = val ? val[1] || today : today;
                        this._mainEl.data('daterangepicker').setStartDate(d1);
                        this._mainEl.data('daterangepicker').setEndDate(d2);
                    }
                }
                if (text && this.isEnabled() && !this.readonly())
                    $(`#${this.id}-icon-clear`).show();
                return this;
            }
            _onAfterRender() {
                let cfg = this._config, value = this.value(), val = [undefined, undefined];
                if (value) {
                    if (!value[0])
                        value[0] = undefined;
                    if (!value[1])
                        value[1] = undefined;
                    val = [value[0], value[1]];
                }
                let c = {
                    showDropdowns: true,
                    startDate: val[0],
                    endDate: val[1],
                    minDate: cfg.minDate,
                    maxDate: cfg.maxDate,
                    minYear: cfg.minYear,
                    maxYear: cfg.maxYear,
                    opens: cfg.popDir,
                    drops: cfg.dropPos,
                    locale: Jsons.union(this._i18n(), { format: this._autoFormat() }, { format: cfg.format, separator: cfg.dateSeparator }),
                    autoUpdateInput: false,
                    autoApply: cfg.autoclose,
                    timePicker: cfg.secondsPlus || cfg.minutesPlus,
                    timePickerSeconds: cfg.secondsPlus,
                    timePickerIncrement: cfg.minutesStep,
                    timePicker24Hour: true,
                    ranges: cfg.ranges,
                    linkedCalendars: false,
                    showCustomRangeLabel: false,
                    alwaysShowCalendars: cfg.showCalendars
                };
                cfg.format = c.locale['format'];
                cfg.dateSeparator = c.locale['separator'];
                if (cfg.maxlength && Number.isFinite(cfg.maxlength))
                    c.maxSpan = { days: 7 };
                this._picker = this._mainEl.daterangepicker(c);
                this._picker.on('show.daterangepicker', () => {
                    this._fire('pickershown');
                });
                this._picker.on('hide.daterangepicker', () => {
                    this._fire('pickerhidden');
                });
                this._picker.on('cancel.daterangepicker', () => {
                    this._fire('pickercanceled');
                });
                this._picker.on('apply.daterangepicker', (e, picker) => {
                    let format = picker.locale.format, d1 = picker.startDate.format(format), d2 = picker.endDate.format(format);
                    this._setValue([d1, d2]);
                    this._mainEl.val(this._dateString([d1, d2]));
                    this._autoclear();
                });
                this._iniValue();
                this._autoclear();
            }
            _autoclear() {
                let cfg = this._config;
                if (cfg.autoclear && !cfg.disabled && !cfg.readonly) {
                    let clear = $('#' + this.id + '-icon-clear');
                    Check.isEmpty(this.value()) ? clear.hide() : clear.show();
                }
            }
        };
        DateRangePicker = __decorate([
            widget('JS.fx.DateRangePicker'),
            __metadata("design:paramtypes", [DateRangePickerConfig])
        ], DateRangePicker);
        fx.DateRangePicker = DateRangePicker;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var DateRangePickerConfig = JS.fx.DateRangePickerConfig;
var DateRangePicker = JS.fx.DateRangePicker;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let DialogFaceMode;
        (function (DialogFaceMode) {
            DialogFaceMode["round"] = "round";
            DialogFaceMode["square"] = "square";
        })(DialogFaceMode = fx.DialogFaceMode || (fx.DialogFaceMode = {}));
        class DialogConfig extends fx.WidgetConfig {
            constructor() {
                super(...arguments);
                this.title = '';
                this.faceMode = DialogFaceMode.square;
                this.hidden = true;
                this.html = '';
                this.autoDestroy = true;
            }
        }
        fx.DialogConfig = DialogConfig;
        ;
        let Dialog = class Dialog extends fx.Widget {
            constructor(config) {
                super(config);
                this._loaded = false;
            }
            load(api, params, encode) {
                let cfg = this._config, remote = api || cfg.url;
                if (!remote)
                    return;
                let url = new URI(remote).queryObject(params, encode).toString();
                cfg.url = url;
                this._mainEl.find('div.modal-body').off().empty().html('<iframe frameborder="0" width="100%" height="100%" src="' + url + '"></iframe>');
            }
            show() {
                if (!this._loaded)
                    this.load();
                this._mainEl.modal('show');
                return this;
            }
            hide() {
                this._mainEl.modal('hide');
                return this;
            }
            toggle() {
                this._mainEl.modal('toggle');
                return this;
            }
            isShown() {
                let d = this._mainEl.data('bs.modal');
                return d ? d._isShown : false;
            }
            _render() {
                let cfg = this._config, cHtml = cfg.html ? (Types.isString(cfg.html) ? cfg.html : $(cfg.html).html()) : '';
                let btnHtml = '', buttons = cfg.buttons;
                if (buttons && buttons.length > 0) {
                    btnHtml = '<div class="modal-footer">';
                    buttons.forEach((opt, i) => {
                        btnHtml += `<button id="${this.id + '_button' + i}" type="button" class="btn btn-${opt.colorMode || fx.ColorMode.primary}" data-dismiss="modal">${opt.text}</button>`;
                    });
                    btnHtml += '</div>';
                }
                let titleHtml = '';
                if (cfg.title)
                    titleHtml = `
                <div class="modal-header">
                <div class="modal-title">${cfg.title}</div>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
                </div>
                `;
                let html = `
                <div class="modal fade" tabindex="-1" role="dialog" aria-hidden="false" jsfx-role="main">
                    <div class="modal-dialog modal-dialog-centered" role="document" style="min-width:${Lengths.toCssString(cfg.width, 'auto')}">
                    <div class="modal-content" style="border-radius:${this._hasFaceMode(DialogFaceMode.round) ? '0.3rem' : '0px'}">
                        ${titleHtml}
                        <div class="modal-body jsfx-dialog-body" style="height:${Lengths.toCssString(cfg.height, '100%')}">
                        ${cHtml}
                        </div>
                        ${btnHtml}
                    </div>
                    </div>
                </div>
                `;
                this.widgetEl.html(html);
                this._renderChildren();
                let btnCt = this.widgetEl.find('div.modal-footer');
                if (buttons && btnCt.length == 1) {
                    buttons.forEach((opt, i) => {
                        let me = this;
                        if (opt.onClick)
                            $('#' + this.id + '_button' + i).click(function (e) {
                                return opt.onClick.apply(me, [e.originalEvent, this, i]);
                            });
                    });
                }
                this._mainEl = this.widgetEl.find('[jsfx-role=main]');
                this._mainEl.off();
                this._mainEl.on('show.bs.modal', () => { this._fire('showing'); });
                this._mainEl.on('shown.bs.modal', () => { this._fire('shown'); });
                this._mainEl.on('hide.bs.modal', () => { this._fire('hiding'); });
                this._mainEl.on('hidden.bs.modal', () => {
                    this._fire('hidden');
                    if (this._config.autoDestroy)
                        this.destroy();
                });
                this._mainEl.modal({
                    backdrop: 'static',
                    show: !cfg.hidden
                });
            }
            _destroy() {
                super._destroy();
                this._mainEl.modal('dispose');
                $('div.modal-backdrop').remove();
                Jsons.forEach(this._children, wgt => {
                    wgt.destroy();
                });
            }
            buttons() {
                return this._mainEl.find('div.modal-footer button');
            }
            child(id) {
                return id ? this._children : this._children[id];
            }
            _renderChildren() {
                let els = this.widgetEl.find('div.modal-body div[jsfx-alias]');
                if (els.length < 1)
                    return;
                this._children = {};
                let wConfigs = this._config.childWidgets;
                els.each((i, e) => {
                    let el = $(e), name = el.attr('name'), id = el.attr('id'), alias = el.attr('jsfx-alias');
                    let cfg = Jsons.union(wConfigs && wConfigs[id], { id: id, name: name });
                    this._children[id] = Class.aliasInstance(alias, cfg);
                });
            }
            _onAfterInit() {
                if (!this._config.hidden)
                    this.show();
            }
        };
        Dialog = __decorate([
            widget('JS.fx.Dialog'),
            __metadata("design:paramtypes", [DialogConfig])
        ], Dialog);
        fx.Dialog = Dialog;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Dialog = JS.fx.Dialog;
var DialogConfig = JS.fx.DialogConfig;
var DialogFaceMode = JS.fx.DialogFaceMode;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class TextInputConfig extends fx.LineInputConfig {
        }
        fx.TextInputConfig = TextInputConfig;
        let TextInput = class TextInput extends fx.LineInput {
            constructor(cfg) {
                super(cfg);
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value();
                return super.value(val, silent);
            }
            _onAfterRender() {
                this._mainEl.off('input change paste').on('input change paste', () => {
                    this._setValue(this._mainEl.val());
                });
                super._onAfterRender();
            }
        };
        TextInput = __decorate([
            widget('JS.fx.TextInput'),
            __metadata("design:paramtypes", [TextInputConfig])
        ], TextInput);
        fx.TextInput = TextInput;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var TextInput = JS.fx.TextInput;
var TextInputConfig = JS.fx.TextInputConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class EmailInputConfig extends fx.TextInputConfig {
            constructor() {
                super(...arguments);
                this.multiple = false;
                this.innerIcon = 'fa fa-envelope-o';
            }
        }
        fx.EmailInputConfig = EmailInputConfig;
        let EmailInput = class EmailInput extends fx.TextInput {
            constructor(cfg) {
                super(cfg);
            }
            _bodyFragment() {
                return super._bodyFragment('email');
            }
            _onAfterRender() {
                super._onAfterRender();
                this._mainEl.prop('multiple', this._config.multiple);
            }
        };
        EmailInput = __decorate([
            widget('JS.fx.EmailInput'),
            __metadata("design:paramtypes", [EmailInputConfig])
        ], EmailInput);
        fx.EmailInput = EmailInput;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var EmailInput = JS.fx.EmailInput;
var EmailInputConfig = JS.fx.EmailInputConfig;
var JS;
(function (JS) {
    let model;
    (function (model) {
        ;
        class PageModelConfig extends model.ListModelConfig {
            constructor() {
                super(...arguments);
                this.dataQuery = {
                    url: '',
                    pageSize: Infinity,
                    page: 1
                };
                this.parametersMapping = {
                    totalField: 'total',
                    pageField: 'page',
                    pageSizeField: 'pageSize',
                    sortersField: 'sorters'
                };
            }
        }
        model.PageModelConfig = PageModelConfig;
        let PageModel = class PageModel extends model.ListModel {
            constructor(cfg) {
                super(cfg);
                this._cacheTotal = null;
            }
            _initConfig(cfg) {
                return Jsons.union(new PageModelConfig(), cfg);
            }
            _newParams(query) {
                let json = {}, cfg = this._config, mapping = cfg.parametersMapping;
                json[mapping.pageSizeField] = (!query.pageSize || query.pageSize == Infinity) ? '' : query.pageSize;
                json[mapping.pageField] = query.page || 1;
                json[mapping.totalField] = this._cacheTotal == null ? '' : this._cacheTotal;
                let sorters = this._config.sorters, s = '';
                if (sorters) {
                    sorters.forEach((sorter) => {
                        s += `${sorter.field} ${sorter.dir ? sorter.dir : 'asc'},`;
                    });
                    json[mapping.sortersField] = s.slice(0, s.length - 1);
                }
                return URI.toQueryString(json) + '&' + (Types.isString(query.data) ? query.data : URI.toQueryString(query.data));
            }
            load(quy, silent) {
                this._check();
                let me = this, query = Jsons.union(Ajax.toRequest(this._config.dataQuery), Ajax.toRequest(quy));
                this._fire('loading', [query]);
                me._config.dataQuery = query;
                return new model.JsonProxy().execute({
                    method: query.method,
                    url: query.url
                }, me._newParams(query)).then(function (result) {
                    if (result.success()) {
                        me.total(result.total());
                        me.setData(result.data(), silent);
                        me._fire('loadsuccess', [result]);
                        let oldPage = me.getCurrentPage(), newPage = query.page;
                        if (oldPage != newPage)
                            me._fire('pagechanged', [newPage, oldPage]);
                    }
                    else {
                        me._fire('loadfailure', [result]);
                    }
                    return Promise.resolve(result);
                }).catch(function (err) {
                    me._fire('loaderror', [err]);
                });
            }
            reload() {
                return this.load(null);
            }
            loadPage(page, isForce) {
                if (!isForce && this.getCurrentPage() == page)
                    return;
                return this.load({ page: page });
            }
            total(total) {
                if (arguments.length == 0)
                    return this._cacheTotal || this.size();
                this._cacheTotal = total == void 0 ? null : total;
                return this;
            }
            pageSize(size) {
                let cfg = this._config, query = cfg.dataQuery;
                if (arguments.length == 0)
                    return query.pageSize;
                query.pageSize = size == void 0 ? Infinity : size;
                return this;
            }
            getCurrentPage() {
                let cfg = this._config;
                return cfg.dataQuery.page;
            }
            getPrevPage() {
                let page = this.getCurrentPage();
                return page <= 1 ? 1 : page - 1;
            }
            getNextPage() {
                let currentPage = this.getCurrentPage(), totalPages = this.getLastPage();
                return (currentPage + 1 > totalPages) ? totalPages : (currentPage + 1);
            }
            getFirstPage() {
                return 1;
            }
            getLastPage() {
                let total = this.total(), pageSize = this.pageSize();
                if (total == 0 || !isFinite(pageSize))
                    return 1;
                let max = Math.ceil(total / pageSize);
                return max == 0 ? 1 : max;
            }
            loadPrevPage() {
                return this.loadPage(this.getPrevPage());
            }
            loadNextPage() {
                return this.loadPage(this.getNextPage());
            }
            loadFirstPage() {
                return this.loadPage(1);
            }
            loadLastPage() {
                return this.loadPage(this.getLastPage());
            }
        };
        PageModel = __decorate([
            klass('JS.model.PageModel'),
            __metadata("design:paramtypes", [PageModelConfig])
        ], PageModel);
        model.PageModel = PageModel;
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var PageModel = JS.model.PageModel;
var PageModelConfig = JS.model.PageModelConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let GridFaceMode;
        (function (GridFaceMode) {
            GridFaceMode["striped"] = "striped";
            GridFaceMode["outline"] = "outline";
            GridFaceMode["inline"] = "inline";
        })(GridFaceMode = fx.GridFaceMode || (fx.GridFaceMode = {}));
        class GridConfig extends fx.WidgetConfig {
            constructor() {
                super(...arguments);
                this.checkable = false;
                this.dataModel = PageModel;
                this.data = [];
                this.autoLoad = true;
                this.headStyle = {
                    textAlign: 'left'
                };
                this.bodyStyle = {
                    textAlign: 'left'
                };
                this.pageSizes = [10, 20, 30, 50];
                this.pagingBar = false;
                this.i18n = null;
            }
        }
        fx.GridConfig = GridConfig;
        let Grid = class Grid extends fx.Widget {
            constructor(cfg) {
                super(cfg);
                this._hChk = null;
                this._bChks = null;
            }
            getFieldName(col) {
                let cfg = this._config, cols = cfg.columns;
                if (col <= 0 || col >= cols.length)
                    return null;
                return cols[col + 1].field;
            }
            getCellNode(row, col) {
                return $(`#${this.id}_btable`).find(`td>div[jsfx-row=${row}][jsfx-col=${col}]`);
            }
            dataModel() {
                return this._dataModel;
            }
            _initDataModel() {
                let cfg = this._config;
                this._dataModel = Class.newInstance(cfg.dataModel, {
                    iniData: cfg.data,
                    pageSize: cfg.dataQuery.pageSize
                });
                ['loading', 'loadsuccess', 'loadfailure', 'loaderror', 'dataupdating', 'dataupdated'].forEach(e => {
                    let me = this;
                    this._dataModel.on(e, function () {
                        if (e == 'dataupdated')
                            me.data(this.getData(), true);
                        me._fire(e, Arrays.slice(arguments, 1));
                    });
                });
            }
            _onBeforeInit() {
                let cfg = this._config;
                cfg.dataQuery = Jsons.union({
                    page: 1,
                    pageSize: cfg.pageSizes ? cfg.pageSizes[0] : Infinity
                }, Ajax.toRequest(cfg.dataQuery));
                cfg.dataModel = PageModel;
                this._initDataModel();
            }
            _headChk() {
                if (this._hChk == null)
                    this._hChk = $(`#${this.id}_htable tr>th:first-child input:checkbox`);
                return this._hChk;
            }
            _bodyChks() {
                if (this._bChks == null)
                    this._bChks = $(`#${this.id}_btable tr>td:first-child input:checkbox`);
                return this._bChks;
            }
            _newCheckbox(el, id, i) {
                let me = this, cfg = me._config;
                new fx.Checkbox({
                    renderTo: el,
                    width: 'auto',
                    colorMode: cfg.colorMode,
                    sizeMode: cfg.sizeMode,
                    data: [{ id: id }]
                }).on('click', function () {
                    this.isSelected() ? me.select(i) : me.unselect(i);
                });
            }
            _bindHeadCheckbox() {
                if (!this._config.checkable)
                    return;
                this._hChk = null;
                let span = $(`#${this.id}_htable tr>th:first-child span[jsfx-alias=checkbox]`);
                this._newCheckbox(span, '-1');
            }
            _bindBodyCheckbox() {
                if (!this._config.checkable)
                    return;
                this._bChks = null;
                let me = this, spans = $(`#${this.id}_btable tr>td:first-child span[jsfx-alias=checkbox]`);
                spans.each(function (i) {
                    me._newCheckbox(this, $(this).attr('jsfx-id'), i + 1);
                });
            }
            isSelected(row) {
                let chks = this._bodyChks();
                if (chks.length == 0)
                    return false;
                return $(chks.get(row)).prop('checked');
            }
            select(i) {
                if (arguments.length == 0 || i == void 0) {
                    this._headChk().prop('checked', true);
                    this._bodyChks().prop('checked', true);
                    if (this.checkable())
                        $(`#${this.id}_btable`).find(`tr`).addClass('selected');
                    this._fire('allselected');
                    return;
                }
                $(this._bodyChks().get(i)).prop('checked', true);
                if (this.checkable())
                    $(`#${this.id}_btable`).find(`tr[jsfx-row=${i}]`).addClass('selected');
                this._fire('selected', [i]);
                if (this._bodyChks().not(':checked').length == 0) {
                    this._headChk().prop('checked', true);
                    if (this.checkable())
                        $(`#${this.id}_btable`).find(`tr`).addClass('selected');
                    this._fire('allselected');
                }
            }
            unselect(i) {
                if (arguments.length == 0 || i == void 0) {
                    this._headChk().prop('checked', false);
                    this._bodyChks().prop('checked', false);
                    if (this.checkable())
                        $(`#${this.id}_btable`).find(`tr`).removeClass('selected');
                    this._fire('allunselected');
                    return;
                }
                $(this._bodyChks().get(i)).prop('checked', false);
                if (this.checkable())
                    $(`#${this.id}_btable`).find(`tr[jsfx-row=${i}]`).removeClass('selected');
                this._fire('unselected', [i]);
                this._headChk().prop('checked', false);
                if (this._bodyChks().not(':not(:checked)').length == 0) {
                    if (this.checkable())
                        $(`#${this.id}_btable`).find(`tr`).removeClass('selected');
                    this._fire('allunselected');
                }
            }
            getSelectedIds() {
                let chks = this._bodyChks(), ids = [];
                chks.each((i, el) => {
                    let n = $(el);
                    if (n.prop('checked'))
                        ids[ids.length] = n.val();
                });
                return ids;
            }
            getSelectedData() {
                let chks = this._bodyChks(), data = [], cData = this.data();
                chks.each((i, el) => {
                    if ($(el).prop('checked')) {
                        data.push(cData[i]);
                    }
                });
                return data;
            }
            checkable() {
                return this._config.checkable;
            }
            hideCheckbox() {
                this.widgetEl.find('.table tr').find('th:eq(0),td:eq(0)').find('.jsfx-checkbox').hide();
            }
            showCheckbox() {
                this.widgetEl.find('.table tr').find('th:eq(0),td:eq(0)').find('.jsfx-checkbox').show();
            }
            _colIndexOf(field) {
                let name = field;
                let col = this._config.columns.findIndex((option) => {
                    return option.field == name;
                });
                if (col < 0)
                    throw new Errors.NotFoundError(`Not found the field:<${name}>`);
                return col;
            }
            hideColumn(v) {
                let i = Types.isNumeric(v) ? Number(v) - 1 : this._colIndexOf(v);
                this.widgetEl.find(`tr th:eq(${i}),tr td:eq(${i})`).hide();
            }
            showColumn(v) {
                let i = Types.isNumeric(v) ? Number(v) - 1 : this._colIndexOf(v);
                this.widgetEl.find(`tr th:eq(${i}),tr td:eq(${i})`).show();
            }
            _bindSortFields() {
                let cols = this._config.columns;
                cols.forEach((col) => {
                    if (col.sortable)
                        this._bindSortField(col.field, Types.isBoolean(col.sortable) ? 'desc' : col.sortable);
                });
            }
            _bindSortField(fieldName, defaultDir) {
                let me = this, el = this.widgetEl.find('#' + this.id + '_sort_' + fieldName);
                el.click(function () {
                    let jEl = $(this);
                    if (jEl.hasClass('la-arrow-up')) {
                        me._sortField(fieldName, 'desc', jEl);
                    }
                    else {
                        me._sortField(fieldName, 'asc', jEl);
                    }
                    me.reload();
                });
                this._sortField(fieldName, defaultDir, el);
            }
            _sortField(field, dir, el) {
                let model = this._dataModel;
                if ('desc' == dir) {
                    el.removeClass('la-arrow-up').addClass('la-arrow-down');
                    model.addSorter(field, 'desc');
                }
                else {
                    el.removeClass('la-arrow-down').addClass('la-arrow-up');
                    model.addSorter(field, 'asc');
                }
            }
            _thHtml(col, colNumber) {
                let cfg = this._config, html = col.text, title = col.tip ? col.tip : col.text, sortDir = col.sortable === true ? 'desc' : '' + col.sortable, sort = col.sortable ? `<i id="${this.id + '_sort_' + col.field}" style="cursor:pointer;vertical-align:middle;" class="la la-arrow-${sortDir == 'asc' ? 'up' : 'down'}"></i>` : '', hasCheckbox = colNumber == 1 && cfg.checkable, width = Lengths.toCssString(col.width, '100%'), cell = `<div class="cell items-${cfg.headStyle.textAlign} items-middle" jsfx-col="${colNumber}" title="${title}">
                    ${html}${sort ? sort : ''}</div>`;
                if (col.sortable)
                    this._dataModel.addSorter(col.field, sortDir);
                return `<th width="${width}" nowrap>
                ${hasCheckbox ? `<div class="items-left items-middle"><span jsfx-alias="checkbox"/>${cell}</div>` : cell}
                </th>`;
            }
            _tdHtml(opt, html, title, col, row) {
                let cfg = this._config, hasCheckbox = col == 0 && cfg.checkable, id = this.data()[row]['id'], width = Lengths.toCssString(opt.width, '100%'), cell = `<div class="cell items-${cfg.bodyStyle.textAlign} items-middle" jsfx-row="${row}" jsfx-col="${col}" title="${title}">
                    ${html}</div>`;
                return `<td width="${width}" nowrap>
                ${hasCheckbox ? `<div class="items-left items-middle" jsfx-row="${row}" jsfx-col="${col}"><span jsfx-alias="checkbox" jsfx-id="${id}"/>${cell}</div>` : cell}
                </td>`;
            }
            _headHtml(columns) {
                let html = '';
                columns.forEach((col, i) => {
                    html += this._thHtml(col, i + 1);
                }, this);
                return html;
            }
            _renderBody() {
                let cfg = this._config, columns = cfg.columns, data = this.data() || [];
                if (!columns)
                    return;
                let html = '';
                data.forEach((rowData, rowIndex) => {
                    if (rowData) {
                        let tr = '';
                        columns.forEach((col, colIndex) => {
                            if (col) {
                                let val = rowData[col.field], hVal = val == void 0 ? '' : Strings.escapeHTML(String(val));
                                tr += this._tdHtml(col, col.renderer ? col.renderer.call(this, val, colIndex, rowIndex) : hVal, hVal, colIndex, rowIndex);
                            }
                        });
                        tr = `<tr jsfx-row="${rowIndex}">${tr}</tr>`;
                        html += tr;
                    }
                });
                Check.isEmpty(data) ? $(`#${this.id}_nodata`).show() : $(`#${this.id}_nodata`).hide();
                $(`#${this.id}_btable>tbody`).off().empty().html(html)
                    .off('click', 'tr').on('click', 'tr', (e) => {
                    let row = $(e.currentTarget), rowNumber = parseInt(row.attr('jsfx-row'));
                    this._fire('rowclick', [rowNumber]);
                    if (this.checkable())
                        this.isSelected(rowNumber) ? this.unselect(rowNumber) : this.select(rowNumber);
                    return false;
                })
                    .off('click', 'td>div').on('click', 'td>div', (e) => {
                    let row = $(e.currentTarget), colNumber = parseInt(row.attr('jsfx-col')), rowNumber = parseInt(row.attr('jsfx-row'));
                    this._fire('cellclick', [rowNumber, colNumber]);
                    return true;
                });
                this._bindBodyCheckbox();
            }
            _pageHtml(page) {
                let model = this._dataModel;
                return `
                <li>
                    <a class="pager-link pager-link-number ${model.getCurrentPage() == page ? 'selected' : ''}" data-page="${page}" title="${page}">${page}</a>
                </li>
                `;
            }
            _pagesHtml() {
                let model = this._dataModel, page = model.getCurrentPage(), lastPage = model.getLastPage(), html = '';
                let begin = page < 6 ? 1 : ((lastPage - 4) <= page ? lastPage - 4 : page - 2), end = (begin + 4) > lastPage ? lastPage : (begin + 4), empty = '<li><a href="javascript:void(0);">...</a></li>';
                if (begin > 1)
                    html += empty;
                for (let i = begin; i <= end; i++) {
                    html += this._pageHtml(i);
                }
                if ((lastPage - end) > 0)
                    html += empty;
                return html;
            }
            _pagesizeHtml(pagesize) {
                let cfg = this._config, size = cfg.dataQuery.pageSize, selected = size == pagesize ? '<i class="fa fa-check"></i>' : '';
                return `<button class="dropdown-item ${cfg.sizeMode ? 'btn-' + cfg.sizeMode : ''} ${selected ? 'selected' : ''}" jsfx-pagesize="${pagesize}">${pagesize}${selected}</button>`;
            }
            _pagesizesHtml() {
                let pageSizes = this._config.pageSizes;
                if (!pageSizes)
                    return '';
                let html = '';
                pageSizes.forEach(size => {
                    html += this._pagesizeHtml(size);
                });
                return html;
            }
            _renderPagingbar() {
                if (!this._config.pagingBar)
                    return;
                let cfg = this._config, model = this._dataModel, el = $(`#${this.id}_pagingbar`), page = model.getCurrentPage(), prevPage = model.getPrevPage(), nextPage = model.getNextPage(), lastPage = model.getLastPage(), pageSize = cfg.dataQuery.pageSize, total = model.total(), beginRow = total == 0 ? 0 : pageSize * (page - 1) + 1, endRow = total == 0 ? 0 : (page == lastPage ? total : page * pageSize);
                let rowsInfo = Strings.merge(this._i18n('rowsInfo'), {
                    beginRow: beginRow,
                    endRow: endRow,
                    total: total
                }) || '', html = `<ul class="pager-nav">
                    <li>
                        <a title="${this._i18n('firstPage')}" class="pager-link pager-link-arrow" data-page="1">
                            <i class="la la-angle-double-left"></i>
                        </a>
                    </li>
                    <li>
                        <a title="${this._i18n('previousPage')}" class="pager-link pager-link-arrow" data-page="${prevPage}">
                            <i class="la la-angle-left"></i>
                        </a>
                    </li>
                    ${this._pagesHtml()}
                    <li>
                        <a title="${this._i18n('nextPage')}" class="pager-link pager-link-arrow" data-page="${nextPage}">
                            <i class="la la-angle-right"></i>
                        </a>
                    </li>
                    <li>
                        <a title="${this._i18n('lastPage')}" class="pager-link pager-link-arrow" data-page="${lastPage}">
                            <i class="la la-angle-double-right"></i>
                        </a>
                    </li>
                </ul>
                <div class="pager-info items-middle">
                    <div class="btn-group dropup">
                        <button id="${this.id}_pagesize" title="选择每页条数" class="btn dropdown-toggle ${cfg.sizeMode ? 'btn-' + cfg.sizeMode : ''}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        ${pageSize}
                        </button>
                        <div class="dropdown-menu">
                        ${this._pagesizesHtml()}
                        </div>
                    </div>
                    <span class="pager-detail">${rowsInfo}</span>
                </div>`;
                el.html(html);
                let me = this, pages = this.widgetEl.find('a.pager-link');
                pages.click(function () {
                    let pNumber = parseInt($(this).attr('data-page'));
                    if (pNumber)
                        me.loadPage(pNumber);
                });
                let buttons = this.widgetEl.find('div.pager-info div.dropdown-menu>button');
                buttons.click(function () {
                    me._changePageSize($(this));
                });
                this.unselect();
            }
            _changePageSize(el) {
                el.siblings().removeClass('selected').find('i').remove();
                el.remove('i').addClass('selected').append('<i class="fa fa-check"></i>');
                let pageSize = parseInt(el.attr('jsfx-pagesize'));
                $('#' + this.id + '_pagesize').text(pageSize);
                this.load({ pageSize: pageSize });
            }
            loadPage(page) {
                return this._dataModel.loadPage(page);
            }
            clear() {
                return this.data(null);
            }
            _render() {
                let cfg = this._config, heights = {
                    md: 34
                }, bodyCls = 'table';
                if (this._hasFaceMode(GridFaceMode.striped))
                    bodyCls += ' striped';
                let hStyle = cfg.headStyle, bStyle = cfg.bodyStyle, bHeight = Types.isNumeric(cfg.height) ? (Number(cfg.height) - heights[cfg.sizeMode]) + 'px' : '100%', html = `<!-- 表头容器 -->
                    <div class="head">
                        <table id="${this.id}_htable" class="table ${hStyle.cls || ''}">
                            <tr>
                            ${this._headHtml(cfg.columns)}
                            </tr>
                        </table>
                    </div>
                    <!-- 表体容器-->
                    <div class="body" style="height:${bHeight};min-height:${bHeight};max-height:${bHeight};">
                        <div id="${this.id}_nodata" class="items-center items-middle w-100 h-100">
                        ${this._i18n('empty')}
                        </div>
                        <table id="${this.id}_btable" class="${bodyCls}">
                            <tbody text-align="${bStyle.textAlign}">
                            </tbody>
                        </table>
                    </div>        
                    <!-- 分页容器-->
                    <div id="${this.id}_pagingbar" class="pager"></div>`;
                let cls = ` ${cfg.colorMode || ''} ${cfg.sizeMode} ${this._hasFaceMode(GridFaceMode.outline) ? 'outline' : ''} ${this._hasFaceMode(GridFaceMode.inline) ? 'inline' : ''}`;
                this.widgetEl.addClass(cls).css('max-width', cfg.width ? cfg.width : 'auto').html(html);
            }
            _onAfterRender() {
                let cfg = this._config;
                if (cfg.data)
                    this.data(cfg.data, true);
                let pageQuery = cfg.dataQuery;
                if (pageQuery.url && cfg.autoLoad)
                    this.load(pageQuery);
                this._bindHeadCheckbox();
                this._bindSortFields();
                let head = this.widgetEl.find('.head');
                let body = this.widgetEl.find('.body');
                body.scroll(() => {
                    head.scrollLeft(body.scrollLeft());
                });
                $(`${this.id}_htable`).resize(() => {
                    $(`${this.id}_htable`).css('width', $(`${this.id}_btable`).css('width'));
                });
            }
            _renderData() {
                this._renderBody();
                this._renderPagingbar();
            }
            data(data, silent) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return this._dataModel.getData();
                this._dataModel.setData(data, silent);
                this._renderData();
                return this;
            }
            load(quy, silent) {
                let cfg = this._config, oQuery = Ajax.toRequest(cfg.dataQuery), nQuery = Ajax.toRequest(quy);
                cfg.dataQuery = Jsons.union(oQuery, {
                    page: 1,
                    pageSize: Number($(`#${this.id}_pagesize`).text())
                }, nQuery);
                return this._dataModel.load(cfg.dataQuery, silent);
            }
            reload() {
                this._dataModel.reload();
                return this;
            }
        };
        Grid.I18N = {
            firstPage: 'First Page',
            lastPage: 'Last Page',
            previousPage: 'Previous Page',
            nextPage: 'Next Page',
            rowsInfo: '{beginRow} - {endRow} of {total} records',
            empty: 'No data found.',
            loadingMsg: 'Loading...'
        };
        Grid = __decorate([
            widget('JS.fx.Grid'),
            __metadata("design:paramtypes", [GridConfig])
        ], Grid);
        fx.Grid = Grid;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Grid = JS.fx.Grid;
var GridFaceMode = JS.fx.GridFaceMode;
var GridConfig = JS.fx.GridConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let LoadingFaceMode;
        (function (LoadingFaceMode) {
            LoadingFaceMode["flower"] = "flower";
            LoadingFaceMode["ring"] = "ring";
            LoadingFaceMode["bar"] = "bar";
        })(LoadingFaceMode = fx.LoadingFaceMode || (fx.LoadingFaceMode = {}));
        class LoadingConfig {
            constructor() {
                this.width = 200;
                this.transparent = true;
                this.faceMode = LoadingFaceMode.bar;
                this.sizeMode = fx.SizeMode.md;
                this.overlay = true;
                this.duration = 3000;
            }
        }
        fx.LoadingConfig = LoadingConfig;
        let Loading = class Loading {
            static show(cfg) {
                let c = Jsons.union(new LoadingConfig(), cfg);
                c.cls = `jsfx-loading ${c.sizeMode} ${c.colorMode || ''} ${c.transparent || !c.message ? 'transparent' : ''} ${c.cls || ''}`;
                let msg = '';
                if (c.faceMode == LoadingFaceMode.flower) {
                    let html = '';
                    for (let i = 1; i < 5; i++) {
                        html += `<div class="loading-flower circle${i}"></div>`;
                    }
                    msg = `<div class="items-center">
                            <div class="items-middle jsfx-loading-icon flower">
                                <div class="circle-group group1">${html}</div>
                                <div class="circle-group group2">${html}</div>
                                <div class="circle-group group3">${html}</div>
                            </div>
                            <span class="jsfx-loading-msg">${c.message || ''}<span>
                            </div>`;
                }
                else if (c.faceMode == LoadingFaceMode.ring) {
                    msg = `<div class="items-middle items-center">
                              <div class="jsfx-loading-icon ring"><div></div><div></div><div></div><div></div></div>
                              <span class="jsfx-loading-msg">${c.message || ''}<span>
                           </div>`;
                }
                else {
                    $('#jsfx-loading-css').remove();
                    if (c.duration) {
                        Dom.applyStyle(`.jsfx-loading-bar .jsfx-loading-progress:before{animation: load ${c.duration / 1000 * 1.25}s ease-out 1 !important;}`, 'jsfx-loading-css');
                    }
                    msg = `<div class="jsfx-loading-bar">
                                <div class="jsfx-loading-progress"></div>
                                <div class="jsfx-loading-msg">${c.message || ''}</div>
                           </div>`;
                }
                let ucfg = {
                    css: {
                        width: c.width + 'px',
                        left: `calc((100% - ${c.width}px) / 2)`
                    },
                    message: msg,
                    showOverlay: c.overlay,
                    blockMsgClass: c.cls,
                    timeout: c.duration
                }, ltns = c.listeners;
                if (ltns) {
                    if (ltns.showed)
                        ucfg.onBlock = () => {
                            ltns.showed.apply(null, [new CustomEvent('showed'), c]);
                        };
                    if (ltns.hidden)
                        ucfg.onUnblock = () => {
                            ltns.hidden.apply(null, [new CustomEvent('hidden'), c]);
                        };
                }
                cfg.renderTo ? $(cfg.renderTo).block(ucfg) : $.blockUI(ucfg);
            }
            static hide(el) {
                el ? $(el).unblock() : $.unblockUI();
            }
        };
        Loading = __decorate([
            widget('JS.fx.Loading')
        ], Loading);
        fx.Loading = Loading;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Loading = JS.fx.Loading;
var LoadingFaceMode = JS.fx.LoadingFaceMode;
var LoadingConfig = JS.fx.LoadingConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class MessageBoxConfig {
            constructor() {
                this.type = 'custom';
                this.confirmButtonClass = 'jsfx-btn-confirm';
                this.cancelButtonClass = 'jsfx-btn-cancel';
            }
        }
        fx.MessageBoxConfig = MessageBoxConfig;
        let MessageBox = class MessageBox {
            static show(config) {
                let c = new MessageBoxConfig();
                c = Jsons.union(c, config);
                let cfg = c, lts = c.listeners;
                if (lts) {
                    if (lts.confirming)
                        cfg.preConfirm = (inputVal) => {
                            lts.confirming.apply(null, [new CustomEvent('confirming'), inputVal]);
                        };
                    if (lts.opening)
                        cfg.onBeforeOpen = (el) => {
                            lts.opening.apply(null, [new CustomEvent('opening'), el]);
                        };
                    if (lts.opened)
                        cfg.onOpen = (el) => {
                            lts.opened.apply(null, [new CustomEvent('opened'), el]);
                        };
                    if (lts.closing)
                        cfg.onClose = (el) => {
                            lts.closing.apply(null, [new CustomEvent('closing'), el]);
                        };
                    if (lts.closed)
                        cfg.onAfterClose = () => {
                            lts.closed.apply(null, [new CustomEvent('closed')]);
                        };
                }
                let colorMode;
                if (c.type == 'custom') {
                    colorMode = 'btn-' + fx.ColorMode.info;
                }
                else if (c.type == 'question') {
                    colorMode = 'btn-' + fx.ColorMode.dark;
                }
                else if (c.type == 'error') {
                    colorMode = 'btn-' + fx.ColorMode.danger;
                }
                else {
                    colorMode = 'btn-' + cfg.type;
                }
                cfg.confirmButtonClass = colorMode + ' jsfx-messagebox-btn ' + (cfg.confirmButtonClass || '');
                cfg.cancelButtonClass = 'jsfx-messagebox-btn ' + (cfg.cancelButtonClass || '');
                cfg.buttonsStyling = false;
                if (cfg.type == 'custom')
                    delete cfg.type;
                return swal(cfg);
            }
            static clickConfirm() {
                swal.clickConfirm();
            }
            static clickCancel() {
                swal.clickCancel();
            }
            static disableConfirmButton() {
                swal.disableConfirmButton();
            }
            static enableConfirmButton() {
                swal.enableConfirmButton();
            }
            static disableButtons() {
                swal.disableButtons();
            }
            static getTitle() {
                return $(swal.getTitle()).html();
            }
            static getContent() {
                return $(swal.getContent()).html();
            }
            static close() {
                swal.close();
            }
            static isShown() {
                return swal.isVisible();
            }
        };
        MessageBox = __decorate([
            widget('JS.fx.MessageBox')
        ], MessageBox);
        fx.MessageBox = MessageBox;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var MessageBox = JS.fx.MessageBox;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class NumberInputConfig extends fx.LineInputConfig {
            constructor() {
                super(...arguments);
                this.min = -Infinity;
                this.max = Infinity;
                this.step = 1;
                this.iniValue = 0;
                this.fractionDigits = Infinity;
                this.textAlign = 'right';
            }
        }
        fx.NumberInputConfig = NumberInputConfig;
        let NumberInput = class NumberInput extends fx.LineInput {
            constructor(cfg) {
                super(cfg);
            }
            _onAfterRender() {
                let cfg = this._config;
                this.min(cfg.min);
                this.max(cfg.max);
                this.step(cfg.step);
                this._mainEl.off('input change paste').on('input change paste', () => {
                    this._setValue(this._mainEl.val());
                });
                super._onAfterRender();
            }
            _bodyFragment() {
                return super._bodyFragment('number');
            }
            min(min) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.min;
                if (!Number.isFinite(min))
                    return;
                if (min > this.max())
                    throw new Errors.RangeError('The min value greater than max value!');
                cfg.min = min;
                this._mainEl.prop('min', cfg.min);
                return cfg.min;
            }
            max(max) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.max;
                if (!Number.isFinite(max))
                    return;
                if (max < this.min())
                    throw new Errors.RangeError('The max value less than min value!');
                cfg.max = max;
                this._mainEl.prop('max', cfg.max);
                return cfg.max;
            }
            step(st) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.step;
                cfg.step = st;
                this._mainEl.prop('step', cfg.step);
                return cfg.step;
            }
            value(val, silent) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return super.value();
                let v = val == void 0 ? null : Math.min(Math.max(Number(val), cfg.min), cfg.max);
                return super.value(v == null ? null : v.round(cfg.fractionDigits), silent);
            }
            _renderValue() {
                let cfg = this._config, v = this.value();
                if (v == null) {
                    this._mainEl.val('');
                }
                else {
                    let s = v.format(cfg.fractionDigits);
                    if (this._mainEl.val() !== s)
                        this._mainEl.val(s);
                }
            }
        };
        NumberInput = __decorate([
            widget('JS.fx.NumberInput'),
            __metadata("design:paramtypes", [NumberInputConfig])
        ], NumberInput);
        fx.NumberInput = NumberInput;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var NumberInput = JS.fx.NumberInput;
var NumberInputConfig = JS.fx.NumberInputConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class PasswordConfig extends fx.TextInputConfig {
            constructor() {
                super(...arguments);
                this.visible = true;
            }
        }
        fx.PasswordConfig = PasswordConfig;
        let Password = class Password extends fx.TextInput {
            constructor(cfg) {
                super(cfg);
                this._visible = false;
            }
            _render() {
                let cfg = this._config;
                if (cfg.visible)
                    cfg.innerIcon = {
                        cls: this.visible() ? 'fa fa-eye' : 'fa fa-eye-slash',
                        onClick: () => {
                            this.toggleVisible();
                        }
                    };
                super._render();
            }
            _bodyFragment() {
                return super._bodyFragment('password');
            }
            visible(visible) {
                if (!this._config.visible || arguments.length == 0)
                    return this._visible;
                this._visible = visible;
                this._mainEl.prop('type', visible ? 'text' : 'password');
                let icon = $('#' + this.id + '-icon-left').find('i');
                if (visible) {
                    icon.removeClass('fa-eye-slash').addClass('fa-eye');
                }
                else {
                    icon.removeClass('fa-eye').addClass('fa-eye-slash');
                }
                return visible;
            }
            toggleVisible() {
                this.visible(!this.visible());
            }
        };
        Password = __decorate([
            widget('JS.fx.Password'),
            __metadata("design:paramtypes", [PasswordConfig])
        ], Password);
        fx.Password = Password;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Password = JS.fx.Password;
var PasswordConfig = JS.fx.PasswordConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        ;
        class PopupConfig extends fx.WidgetConfig {
            constructor() {
                super(...arguments);
                this.disabled = false;
                this.hidden = true;
                this.animation = true;
                this.place = 'auto';
                this.htmlable = true;
                this.trigger = 'manual';
            }
        }
        fx.PopupConfig = PopupConfig;
        let Popup = class Popup extends fx.Widget {
            constructor(cfg) {
                super(cfg);
            }
            toggle() {
                this._pop.popover('toggle');
                return this;
            }
            show() {
                this._pop.popover('show');
                return this;
            }
            isShown() {
                return !this._config.hidden;
            }
            hide() {
                this._pop.popover('hide');
                return this;
            }
            enable() {
                this._pop.popover('enable');
                this._config.disabled = false;
                return this;
            }
            disable() {
                this._pop.popover('disable');
                this._config.disabled = true;
            }
            isEnable() {
                return !this._config.disabled;
            }
            _destroy() {
                this._pop.popover('dispose');
                super._destroy();
            }
            _onAfterInit() {
                let cfg = this._config;
                if (!cfg.hidden)
                    this.show();
                cfg.disabled ? this.disable() : this.enable();
            }
            _render() {
                let cfg = this._config, json = {
                    animation: cfg.animation,
                    title: cfg.title,
                    content: cfg.content,
                    html: cfg.htmlable,
                    placement: cfg.place,
                    trigger: cfg.trigger
                };
                if (cfg.template)
                    json['template'] = cfg.template;
                this._pop = $(cfg.target).popover(json);
                this._pop.on('show.bs.popover', () => {
                    this._fire('showing');
                });
                this._pop.on('shown.bs.popover', () => {
                    this._fire('shown');
                    this._config.hidden = false;
                });
                this._pop.on('hide.bs.popover', () => {
                    this._fire('hiding');
                });
                this._pop.on('hidden.bs.popover', () => {
                    this._fire('hidden');
                    this._config.hidden = true;
                });
                this._pop.on('inserted.bs.popover', () => {
                    this._fire('rendered');
                });
                return false;
            }
        };
        Popup = __decorate([
            widget('JS.fx.Popup'),
            __metadata("design:paramtypes", [PopupConfig])
        ], Popup);
        fx.Popup = Popup;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Popup = JS.fx.Popup;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let ProgressFaceMode;
        (function (ProgressFaceMode) {
            ProgressFaceMode["square"] = "square";
            ProgressFaceMode["round"] = "round";
            ProgressFaceMode["striped"] = "striped";
            ProgressFaceMode["animated"] = "animated";
        })(ProgressFaceMode = fx.ProgressFaceMode || (fx.ProgressFaceMode = {}));
        class ProgressConfig extends fx.FormWidgetConfig {
            constructor() {
                super(...arguments);
                this.iniValue = 0;
            }
        }
        fx.ProgressConfig = ProgressConfig;
        let Progress = class Progress extends fx.FormWidget {
            constructor(config) {
                super(config);
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value();
                val = val || 0;
                if (val > 1 || val < 0)
                    throw new Errors.RangeError('Progress value must in [0,1]!');
                let newVal = val ? val.round(2) : 0;
                this._setValue(newVal, silent);
                this._mainEl.css('width', newVal * 100 + '%');
                this._mainEl.text(newVal ? newVal * 100 + '%' : '');
                return this;
            }
            height(val) {
                if (arguments.length == 0)
                    return this._mainEl.parent().css('height');
                this._mainEl.parent().css('height', val);
                this._config.height = val;
                return this;
            }
            _bodyFragment() {
                let cfg = this._config, cls = `progress ${cfg.sizeMode || ''}`, barCls = 'progress-bar', val = cfg.iniValue || 0;
                if (this._hasFaceMode(ProgressFaceMode.square))
                    cls += ' border-square';
                if (this._hasFaceMode(ProgressFaceMode.striped))
                    barCls += ' progress-bar-striped';
                if (this._hasFaceMode(ProgressFaceMode.animated))
                    barCls += ' progress-bar-striped progress-bar-animated';
                if (cfg.colorMode)
                    barCls += ` bg-${cfg.colorMode}`;
                return `
                <div class="${cls}" ${cfg.height ? 'style="height:' + cfg.height + 'px"' : ''}>
                    <div class="${barCls} ${cfg.disabled ? 'disabled' : ''}" style="width:${val * 100}%" jsfx-role="main" role="progressbar">${val ? (val * 100 + '%') : ''}</div>
                </div>
                `;
            }
            disable() {
                this._mainEl.addClass('disabled');
                this._config.disabled = true;
                return this;
            }
            enable() {
                this._mainEl.removeClass('disabled');
                this._config.disabled = false;
                return this;
            }
        };
        Progress = __decorate([
            widget('JS.fx.Progress'),
            __metadata("design:paramtypes", [ProgressConfig])
        ], Progress);
        fx.Progress = Progress;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Progress = JS.fx.Progress;
var ProgressFaceMode = JS.fx.ProgressFaceMode;
var ProgressConfig = JS.fx.ProgressConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class RadioConfig extends fx.ChoiceConfig {
            constructor() {
                super(...arguments);
                this.faceMode = RadioFaceMode.inline;
            }
        }
        fx.RadioConfig = RadioConfig;
        let RadioFaceMode;
        (function (RadioFaceMode) {
            RadioFaceMode["dot"] = "dot";
            RadioFaceMode["ring"] = "ring";
            RadioFaceMode["inline"] = "inline";
            RadioFaceMode["list"] = "list";
        })(RadioFaceMode = fx.RadioFaceMode || (fx.RadioFaceMode = {}));
        let Radio = class Radio extends fx.Choice {
            _getDomValue() {
                return this.widgetEl.find('input:checked').val();
            }
            _setDomValue(v) {
                v ? this.widgetEl.find(`input[value=${v}]`).prop('checked', true) : this.widgetEl.find('input').prop('checked', false);
            }
            constructor(cfg) {
                super(cfg);
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value();
                return super.value(val, silent);
            }
            _renderData() {
                super._renderData('radio');
            }
            select(val) {
                return this.value(val);
            }
            unselect() {
                return this.value(null);
            }
        };
        Radio = __decorate([
            widget('JS.fx.Radio'),
            __metadata("design:paramtypes", [RadioConfig])
        ], Radio);
        fx.Radio = Radio;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var RadioConfig = JS.fx.RadioConfig;
var RadioFaceMode = JS.fx.RadioFaceMode;
var Radio = JS.fx.Radio;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let RangeSliderFaceMode;
        (function (RangeSliderFaceMode) {
            RangeSliderFaceMode["flat"] = "flat";
            RangeSliderFaceMode["big"] = "big";
            RangeSliderFaceMode["modern"] = "modern";
            RangeSliderFaceMode["sharp"] = "sharp";
            RangeSliderFaceMode["round"] = "round";
            RangeSliderFaceMode["square"] = "square";
        })(RangeSliderFaceMode = fx.RangeSliderFaceMode || (fx.RangeSliderFaceMode = {}));
        class RangeSliderConfig extends fx.FormWidgetConfig {
            constructor() {
                super(...arguments);
                this.faceMode = RangeSliderFaceMode.round;
            }
        }
        fx.RangeSliderConfig = RangeSliderConfig;
        let RangeSlider = class RangeSlider extends fx.FormWidget {
            constructor(cfg) {
                super(cfg);
            }
            _getFromTo() {
                let arr = Arrays.toArray(this.value()), from = arr.length > 0 ? arr[0] : null, to = arr.length > 1 ? arr[1] : null;
                return [from, to];
            }
            _transfer() {
                let cfg = this._config, fromTo = this._getFromTo();
                return {
                    type: cfg.type,
                    min: cfg.data[0],
                    max: cfg.data[1],
                    from: fromTo[0],
                    to: fromTo[1],
                    step: cfg.step,
                    keyboard: false,
                    grid: cfg.scaled,
                    grid_margin: true,
                    grid_num: cfg.scales,
                    grid_snap: false,
                    drag_interval: true,
                    min_interval: cfg.minInterval,
                    max_interval: cfg.maxInterval,
                    from_fixed: cfg.fromFixed,
                    from_min: cfg.fromMin,
                    from_max: cfg.fromMax,
                    from_shadow: cfg.fromShadow,
                    to_fixed: cfg.toFixed,
                    to_min: cfg.toMin,
                    to_max: cfg.toMax,
                    to_shadow: cfg.toShadow,
                    skin: cfg.faceMode || 'round',
                    hide_min_max: cfg.hideMinMax,
                    hide_from_to: cfg.hideFromTo,
                    force_edges: true,
                    extra_classes: cfg.sliderCls,
                    block: cfg.readonly,
                    prettify_enabled: cfg.format ? true : false,
                    prettify_separator: Types.isString(cfg.format) ? cfg.format : ' ',
                    prettify: Types.isFunction(cfg.format) ? cfg.format : null,
                    prefix: cfg.dataPrefix,
                    postfix: cfg.dataPostfix,
                    max_postfix: cfg.maxValuePostfix,
                    decorate_both: cfg.closeValuesDecorate,
                    values_separator: cfg.closeValuesSeparator,
                    input_values_separator: cfg.valuesSeparator,
                    disable: cfg.disabled,
                    scope: this,
                    onFinish: (data) => {
                        let cfg = this._config, v = cfg.type == 'double' ? [data.from, data.to] : data.from;
                        this._setValue(v);
                    }
                };
            }
            _destroy() {
                this._slider.destroy();
                super._destroy();
            }
            _bodyFragment() {
                let cfg = this._config;
                if (!cfg.data)
                    cfg.data = [0, 100];
                return `<input name="${this.name()}" type="text" jsfx-role="main" data-min="${cfg.data[0]}" data-max="${cfg.data[1]}"/>`;
            }
            _onBeforeRender() {
                if (this._slider)
                    this._slider.destroy();
                super._onBeforeRender();
            }
            _onAfterRender() {
                if (this._config.colorMode)
                    this.widgetEl.find('[jsfx-role=body]').addClass(this._config.colorMode);
                this._mainEl.ionRangeSlider(this._transfer());
                this._slider = this._mainEl.data('ionRangeSlider');
                super._onAfterRender();
            }
            _iniValue() {
                let cfg = this._config, type = cfg.type, min = this.minValue(), max = this.maxValue();
                if (cfg.iniValue == null)
                    cfg.iniValue = type == 'double' ? [min, max] : min;
                super._iniValue();
            }
            data(data, silent) {
                if (arguments.length == 0)
                    return super.data();
                if (data == null)
                    data = [0, 100];
                return super.data(data, silent);
            }
            _renderData() {
                let data = this._config.data, min = this._mainEl.data('min'), max = this._mainEl.data('max');
                if (data && (min + '-' + max) != (data[0] + '-' + data[1])) {
                    this._slider.update({
                        min: data[0],
                        max: data[1]
                    });
                    this._mainEl.data({
                        min: data[0],
                        max: data[1]
                    });
                }
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value();
                let cfg = this._config;
                if (val != null) {
                    let min = this.minValue(), max = this.maxValue();
                    if (cfg.type == 'double') {
                        if (val[0] < min)
                            val[0] = min;
                        if (val[1] > max)
                            val[1] = max;
                    }
                    else {
                        if (val < min) {
                            val = min;
                        }
                        else if (val > max) {
                            val = max;
                        }
                    }
                }
                return super.value(val, silent);
            }
            _renderValue() {
                let cfg = this._config, fromTo = this._getFromTo(), sValue = cfg.type == 'double' ? (fromTo[0] || '' + cfg.valuesSeparator + fromTo[1] || '') : String(fromTo[0] || '');
                if (sValue != this._mainEl.prop('value'))
                    this._slider.update({
                        from: fromTo[0], to: fromTo[1]
                    });
            }
            maxValue() {
                return this._config.data[1];
            }
            minValue() {
                return this._config.data[0];
            }
        };
        RangeSlider = __decorate([
            widget('JS.fx.RangeSlider'),
            __metadata("design:paramtypes", [RangeSliderConfig])
        ], RangeSlider);
        fx.RangeSlider = RangeSlider;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var RangeSliderFaceMode = JS.fx.RangeSliderFaceMode;
var RangeSliderConfig = JS.fx.RangeSliderConfig;
var RangeSlider = JS.fx.RangeSlider;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let RowsInputFaceMode;
        (function (RowsInputFaceMode) {
            RowsInputFaceMode["square"] = "square";
            RowsInputFaceMode["round"] = "round";
            RowsInputFaceMode["shadow"] = "shadow";
        })(RowsInputFaceMode = fx.RowsInputFaceMode || (fx.RowsInputFaceMode = {}));
        class RowsInputConfig extends fx.InputConfig {
            constructor() {
                super(...arguments);
                this.counter = {
                    tpl: '{length}/{maxLength}',
                    place: 'right',
                    cls: ''
                };
                this.faceMode = RowsInputFaceMode.square;
            }
        }
        fx.RowsInputConfig = RowsInputConfig;
        class RowsInput extends fx.Input {
            constructor(cfg) {
                super(cfg);
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value();
                return super.value(val, silent);
            }
            _counterHtml() {
                let cfg = this._config;
                if (!cfg.counter || !cfg.counter.tpl)
                    return '';
                let max = cfg.maxlength;
                if (!max || !Number.isFinite(max))
                    return '';
                let v = this.value() || '', len = v.length;
                return Strings.merge(cfg.counter.tpl, {
                    length: len,
                    maxLength: max
                });
            }
            _updateCounter() {
                let cfg = this._config;
                if (!cfg.counter)
                    return;
                let counter = this.widgetEl.find('.counter');
                counter.off().empty().html(this._counterHtml());
                if (!cfg.autoValidate)
                    return;
                let v = this.value(), len = v ? v.length : 0, max = this.maxlength();
                len > max ? this._showError('') : this._hideError();
            }
            _setValue(val, silent) {
                super._setValue(val, silent);
                this._updateCounter();
            }
            _showError(msg) {
                super._showError(msg);
                this.widgetEl.find('.counter').addClass('error');
            }
            _hideError() {
                super._hideError();
                this.widgetEl.find('.counter').removeClass('error');
            }
        }
        fx.RowsInput = RowsInput;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var RowsInput = JS.fx.RowsInput;
var RowsInputConfig = JS.fx.RowsInputConfig;
var RowsInputFaceMode = JS.fx.RowsInputFaceMode;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let SelectFaceMode;
        (function (SelectFaceMode) {
            SelectFaceMode["square"] = "square";
            SelectFaceMode["round"] = "round";
            SelectFaceMode["pill"] = "pill";
            SelectFaceMode["shadow"] = "shadow";
        })(SelectFaceMode = fx.SelectFaceMode || (fx.SelectFaceMode = {}));
        class SelectOption {
            constructor() {
                this.selected = false;
                this.disabled = false;
            }
        }
        fx.SelectOption = SelectOption;
        class SelectConfig extends fx.FormWidgetConfig {
            constructor() {
                super(...arguments);
                this.rtl = false;
                this.outline = false;
                this.autoSelectFirst = false;
                this.crud = false;
                this.multiple = false;
                this.allowClear = false;
                this.maximumSelectionLength = Infinity;
                this.autoSearch = false;
                this.minimumInputLength = 0;
                this.inputable = false;
                this.autoEscape = true;
            }
        }
        fx.SelectConfig = SelectConfig;
        let Select = class Select extends fx.FormWidget {
            constructor(cfg) {
                super(cfg);
            }
            load(api) {
                if (this._config.autoSearch)
                    throw new Errors.NotHandledError('The method be not supported when autoSearch is true!');
                return super.load(api);
            }
            iniValue(v, render) {
                if (arguments.length == 0)
                    return super.iniValue();
                return super.iniValue(v, render);
            }
            _destroy() {
                this._mainEl.select2('destroy');
                super._destroy();
            }
            _bodyFragment() {
                let cfg = this._config, cls = '';
                if (cfg.colorMode) {
                    if (cfg.outline)
                        cls += ' outline';
                    cls += ` ${cfg.colorMode}`;
                }
                this._eachMode('faceMode', (mode) => {
                    cls += ' face-' + mode;
                });
                return `<div class="w-100 font-${cfg.sizeMode || 'md'} ${cls}">
                            <select name="${this.name()}" jsfx-role="main" class="form-control"></select>
                        </div>`;
            }
            _onAfterRender() {
                this._initSelect2();
                this._renderData();
                let me = this;
                this._mainEl.on('change', function (e, data) {
                    if (data == '_jsfx')
                        return;
                    let nv = $(this).val();
                    me._setValue(Check.isEmpty(nv) ? null : nv);
                });
                let evts = ['selected', 'unselected'];
                ['select2:select', 'select2:unselect'].forEach((type, i) => {
                    this._mainEl.on(type, e => {
                        me._fire(evts[i], [e.params.data]);
                    });
                });
                super._onAfterRender();
            }
            _optionHtml(data) {
                let html = '';
                data.forEach(op => {
                    if (op.children) {
                        let childrenHtml = this._optionHtml(op.children);
                        html += `<optgroup label="${op.text}">${childrenHtml}</optgroup>`;
                    }
                    else {
                        html += `<option value="${op.id}" ${op.disabled ? 'disabled' : ''} ${op.selected ? 'selected' : ''}>${op.text}</option>`;
                    }
                });
                return html;
            }
            _initSelect2() {
                let cfg = this._config, dataQuery = cfg.dataQuery, url = dataQuery ? (Types.isString(dataQuery) ? dataQuery : dataQuery.url) : null, jsonParams = dataQuery ? (Types.isString(dataQuery) ? null : dataQuery.data) : null, options = {
                    disabled: cfg.disabled,
                    allowClear: cfg.allowClear,
                    width: '100%',
                    minimumInputLength: cfg.minimumInputLength < 1 ? 1 : cfg.minimumInputLength,
                    language: cfg.locale,
                    placeholder: cfg.placeholder,
                    multiple: cfg.multiple,
                    tags: cfg.inputable,
                    tokenSeparators: [' ']
                };
                let cls = 'jsfx-select ' + ' ' + (cfg.colorMode || '') + ' font-' + (cfg.sizeMode || 'md') + (cfg.cls || '');
                this._eachMode('faceMode', (mode) => {
                    cls += ' border-' + mode;
                });
                options.dropdownCssClass = cls;
                if (cfg.rtl)
                    options.dir = 'rtl';
                if (!cfg.autoSearch) {
                    options.minimumResultsForSearch = Infinity;
                    options.minimumInputLength = 0;
                }
                if (!cfg.autoEscape) {
                    options.escapeMarkup = (c) => { return c; };
                }
                let me = this;
                if (cfg.optionRender)
                    options.templateResult = function (data, el) {
                        return cfg.optionRender.apply(me, [data, el]);
                    };
                if (cfg.selectionRender)
                    options.templateSelection = function (data, el) {
                        return cfg.selectionRender.apply(me, [data, el]);
                    };
                if (cfg.autoSearch && url)
                    options.ajax = {
                        url: function (pms) {
                            return url + (pms.term || '');
                        },
                        dataType: 'json',
                        delay: 500,
                        data: function () { return jsonParams ? jsonParams : {}; },
                        processResults: (res, params) => {
                            let data = Jsons.getValueByPath(res, ResultSet.DEFAULT_FORMAT.recordsProperty);
                            this.data(data);
                            return {
                                results: data
                            };
                        },
                        cache: true
                    };
                this._mainEl.select2(options);
            }
            addOption(opt) {
                return this.data([opt], false, 'append');
            }
            addOptions(data) {
                return this.data(data, false, 'append');
            }
            removeOption(id) {
                return this.data([id], false, 'remove');
            }
            removeOptions(ids) {
                return this.data(ids, false, 'remove');
            }
            select(i, silent) {
                let cfg = this._config;
                if (i < 0 || Check.isEmpty(cfg.data) || i >= cfg.data.length)
                    return;
                this.value('' + cfg.data[i].id, silent);
            }
            isCrud() {
                let cfg = this._config;
                return cfg.multiple && cfg.crud;
            }
            crudValue() {
                if (!this.isCrud())
                    return null;
                let val = Arrays.toArray(this.value()), iniVal = Arrays.toArray(this.iniValue()), arr = [];
                iniVal.forEach((v) => {
                    if (val.findIndex(it => {
                        return it == v;
                    }) < 0) {
                        arr[arr.length] = {
                            _crud: 'D',
                            id: v
                        };
                    }
                });
                val.forEach((v) => {
                    if (iniVal.findIndex(it => {
                        return it == v;
                    }) < 0) {
                        arr[arr.length] = {
                            _crud: 'C',
                            id: v
                        };
                    }
                });
                return arr;
            }
            data(data, silent, mode) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.data;
                let newData, newDataCopy, oldData = Jsons.clone(cfg.data);
                if (mode == 'append') {
                    let tmp = Jsons.clone(cfg.data) || [];
                    newData = tmp.add(data);
                    newDataCopy = Jsons.clone(newData);
                }
                else if (mode == 'remove') {
                    let tmp = Jsons.clone(cfg.data) || [];
                    data.forEach(id => {
                        tmp.remove(item => {
                            return item.id == id;
                        });
                    });
                    newData = tmp;
                    newDataCopy = Jsons.clone(newData);
                }
                else {
                    newData = data;
                    newDataCopy = Jsons.clone(newData);
                }
                if (!silent)
                    this._fire('dataupdating', [newDataCopy, oldData]);
                cfg.data = newData;
                if (this._dataModel)
                    this._dataModel.setData(newData, true);
                this._renderDataBy(mode ? data : newData, mode);
                this._renderValue();
                if (!silent)
                    this._fire('dataupdated', [newDataCopy, oldData]);
                return this;
            }
            _iniValue() {
                let cfg = this._config;
                if (cfg.autoSelectFirst && cfg.data && cfg.data.length > 0)
                    cfg.iniValue = '' + cfg.data[0].id;
                super._iniValue();
            }
            _renderData() {
                this._renderDataBy(this._config.data);
            }
            _renderDataBy(data, mode) {
                if (data) {
                    if (!mode)
                        this._mainEl.empty();
                    if (mode != 'remove') {
                        this._mainEl.append(this._optionHtml(data));
                    }
                    else {
                        data.forEach(id => {
                            this._mainEl.find(`option[value="${id}"]`).remove();
                        });
                    }
                }
                else {
                    if (mode != 'remove')
                        this._mainEl.empty();
                }
            }
            _renderValue() {
                let v = this.value();
                if (!this._equalValues(v, this._mainEl.val()))
                    this._mainEl.val(v).trigger('change', '_jsfx');
            }
            _equalValues(newVal, oldVal) {
                if (Check.isEmpty(oldVal) && Check.isEmpty(newVal))
                    return true;
                let cfg = this._config;
                return cfg.multiple ? Arrays.equalToString(oldVal, newVal) : oldVal == newVal;
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value();
                let cfg = this._config;
                if ((cfg.multiple && Types.isString(val)) || (!cfg.multiple && Types.isArray(val)))
                    throw new Errors.TypeError(`Wrong value type for select<${this.id}>!`);
                return super.value(val, silent);
            }
            _showError(msg) {
                super._showError(msg);
                this.widgetEl.find('.select2-selection').addClass('jsfx-input-error');
            }
            _hideError() {
                super._hideError();
                this.widgetEl.find('.select2-selection').removeClass('jsfx-input-error');
            }
        };
        Select = __decorate([
            widget('JS.fx.Select'),
            __metadata("design:paramtypes", [SelectConfig])
        ], Select);
        fx.Select = Select;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Select = JS.fx.Select;
var SelectFaceMode = JS.fx.SelectFaceMode;
var SelectOption = JS.fx.SelectOption;
var SelectConfig = JS.fx.SelectConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let SiderFaceMode;
        (function (SiderFaceMode) {
            SiderFaceMode["over"] = "over";
            SiderFaceMode["overlay"] = "overlay";
            SiderFaceMode["push"] = "push";
        })(SiderFaceMode = fx.SiderFaceMode || (fx.SiderFaceMode = {}));
        class SiderConfig extends fx.WidgetConfig {
            constructor() {
                super(...arguments);
                this.hidden = true;
                this.faceMode = SiderFaceMode.over;
            }
        }
        fx.SiderConfig = SiderConfig;
        let Sider = class Sider extends fx.Widget {
            constructor(cfg) {
                if (cfg.hidden === undefined)
                    cfg.hidden = true;
                cfg.appendTo = 'body';
                if (!cfg.faceMode)
                    cfg.faceMode = SiderFaceMode.over;
                super(cfg);
            }
            toggle() {
                this.widgetEl.slideReveal('toggle');
            }
            show() {
                this.widgetEl.slideReveal('show');
                return this;
            }
            hide() {
                this.widgetEl.slideReveal('hide');
                return this;
            }
            loadHtml(html) {
                let cfg = this._config;
                if (html)
                    cfg.html = html;
                if (!cfg.html)
                    return;
                let h = Types.isString(cfg.html) ? cfg.html : $(cfg.html).html();
                this._mainEl.off().empty().html(h);
                this._fire('loaded');
                return this;
            }
            loadUrl(url) {
                let cfg = this._config;
                if (url)
                    cfg.url = url;
                if (!cfg.url)
                    return;
                this._mainEl.off().empty();
                let iframe = document.createElement('iframe'), fn = () => {
                    let ifr = $(`#${this.id}_iframe`)[0], fWin = Bom.iframeWindow(ifr);
                    fWin.Page.onEvent('close', (e, ...args) => {
                        this._fire('closing', args);
                        this.widgetEl.slideReveal('hide', false);
                        this._fire('closed', args);
                    });
                    this._fire('loaded', [fWin]);
                };
                iframe.id = this.id + '_iframe';
                iframe.src = cfg.url;
                if (iframe['attachEvent']) {
                    iframe['attachEvent']('onload', fn);
                }
                else {
                    iframe.onload = fn;
                }
                this._mainEl.append(iframe);
                return this;
            }
            reload() {
                let cfg = this._config;
                cfg.html ? this.loadHtml(null) : this.loadUrl(null);
                return this;
            }
            getFrame() {
                return $(`#${this.id}_iframe`)[0];
            }
            _onAfterInit() {
                let cfg = this._config;
                this.reload();
                if (!cfg.hidden)
                    this.show();
            }
            _render() {
                let cfg = this._config, html = `
                    <div class="jsfx-sider-head ${cfg.titleCls || ''}" style="${cfg.titleStyle || ''}">
                        <div jsfx-role="title" class="text-truncate">${cfg.title || ''}</div>
                        <button type="button" class="close" aria-label="Close"><i class="la la-arrow-${cfg.place || 'left'}"></i></button>                            
                    </div>
                    <div class="jsfx-sider-body" jsfx-role="main"></div>
                    `;
                this.widgetEl.addClass(`jsfx-sider ${cfg.place || 'left'}`).html(html);
                let isPush = cfg.faceMode == SiderFaceMode.push;
                this.widgetEl = $('#' + this.id).slideReveal({
                    width: cfg.width || undefined,
                    trigger: cfg.trigger ? $(cfg.trigger) : undefined,
                    push: isPush,
                    overlay: !isPush,
                    overlayColor: 'rgba(0, 0, 0, 0.25)',
                    position: cfg.place,
                    speed: cfg.speed,
                    autoEscape: cfg.escKey == false ? false : true,
                    show: () => {
                        this.widgetEl.addClass((cfg.faceMode == SiderFaceMode.overlay ? 'overlay-' : '') + 'sider-shadow');
                        this._fire('opening');
                    },
                    shown: () => { this._fire('opened'); },
                    hide: () => {
                        this.widgetEl.removeClass((cfg.faceMode == SiderFaceMode.overlay ? 'overlay-' : '') + 'sider-shadow');
                        this._fire('closing');
                    },
                    hidden: () => { this._fire('closed'); }
                });
                let overs = $('.slide-reveal-overlay');
                if (overs.length > 0) {
                    this._overlay = $(overs[0]);
                    if (cfg.faceMode == SiderFaceMode.over)
                        this._overlay.remove();
                }
                this.widgetEl.find('button.close').click(() => {
                    this.hide();
                });
                this._mainEl = this.widgetEl.find('[jsfx-role=main]');
            }
            _destroy() {
                if (this._overlay)
                    this._overlay.remove();
                super._destroy();
            }
            title(text) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.title;
                this.widgetEl.find('div[jsfx-role="title"]').html(text);
                cfg.title = text;
                return this;
            }
        };
        Sider = __decorate([
            widget('JS.fx.Sider'),
            __metadata("design:paramtypes", [SiderConfig])
        ], Sider);
        fx.Sider = Sider;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var SiderFaceMode = JS.fx.SiderFaceMode;
var SiderConfig = JS.fx.SiderConfig;
var Sider = JS.fx.Sider;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let SwitchFaceMode;
        (function (SwitchFaceMode) {
            SwitchFaceMode["shadow"] = "shadow";
        })(SwitchFaceMode = fx.SwitchFaceMode || (fx.SwitchFaceMode = {}));
        class SwitchConfig extends fx.FormWidgetConfig {
            constructor() {
                super(...arguments);
                this.iniValue = 'off';
            }
        }
        fx.SwitchConfig = SwitchConfig;
        let Switch = class Switch extends fx.FormWidget {
            constructor(config) {
                super(config);
            }
            _onAfterRender() {
                let me = this;
                this._mainEl.on('change', function () {
                    let is = $(this).is(':checked');
                    me._setValue(is ? 'on' : 'off');
                    me._fire(is ? 'on' : 'off');
                });
                super._onAfterRender();
            }
            _bodyFragment() {
                let cls = '', cfg = this._config;
                if (this._hasFaceMode(SwitchFaceMode.shadow))
                    cls += ' border-shadow';
                return `<input name="${this.name()}" jsfx-role="main" type="checkbox" class="${cls}" ${cfg.readonly ? 'readonly' : ''}/>`;
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value() || 'off';
                return super.value(val, silent);
            }
            _renderValue() {
                this._mainEl.prop('checked', this.value() == 'on');
            }
            toggle() {
                let v = this.value();
                return this.value(v == 'on' ? 'off' : 'on');
            }
        };
        Switch = __decorate([
            widget('JS.fx.Switch'),
            __metadata("design:paramtypes", [SwitchConfig])
        ], Switch);
        fx.Switch = Switch;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Switch = JS.fx.Switch;
var SwitchFaceMode = JS.fx.SwitchFaceMode;
var SwitchConfig = JS.fx.SwitchConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let TabFaceMode;
        (function (TabFaceMode) {
            TabFaceMode["horizontal"] = "horizontal";
            TabFaceMode["vertical"] = "vertical";
            TabFaceMode["pill"] = "pill";
            TabFaceMode["outline"] = "outline";
            TabFaceMode["underline"] = "underline";
        })(TabFaceMode = fx.TabFaceMode || (fx.TabFaceMode = {}));
        class TabConfig extends fx.WidgetConfig {
            constructor() {
                super(...arguments);
                this.activeIndex = 0;
                this.faceMode = null;
                this.headLeftWidth = '15%';
            }
        }
        fx.TabConfig = TabConfig;
        let Tab = class Tab extends fx.Widget {
            constructor(cfg) {
                super(cfg);
            }
            disableTab(num) {
                let index = this._limitIndex(num);
                if (index < 0)
                    return this;
                let cfg = this._config;
                cfg.data[index].disabled = true;
                let tab = $(`#${this.id}_headers li:nth-child(${index + 1}) a`);
                tab.addClass('disabled');
                return this;
            }
            enableTab(num) {
                let index = this._limitIndex(num);
                if (index < 0)
                    return this;
                let cfg = this._config;
                cfg.data[index].disabled = false;
                let tab = $(`#${this.id}_headers li:nth-child(${index + 1}) a`);
                tab.removeClass('disabled');
                return this;
            }
            isEnabledTab(num) {
                let size = this.length();
                if (size == 0 || num < 1 || num > size)
                    return false;
                let cfg = this._config;
                return cfg.data && !cfg.data[num - 1].disabled;
            }
            activeTab(num) {
                let index = this._limitIndex(num);
                if (index < 0)
                    return this;
                let cfg = this._config;
                cfg.activeIndex = index;
                cfg.data[index].disabled = false;
                let tab = $(`#${this.id}_headers li:nth-child(${index + 1}) a`);
                tab.removeClass('disabled').css('display', '').tab('show');
                return this;
            }
            isActivedTab(num) {
                let tab = $(`#${this.id}_headers li:nth-child(${num}) a`);
                return tab.length == 1 && tab.hasClass('active');
            }
            _limitIndex(num) {
                let size = this.length();
                if (size == 0)
                    return -1;
                if (num >= size) {
                    return size - 1;
                }
                else if (num < 1)
                    return 0;
                return num - 1;
            }
            hideTab(num) {
                this.activeTab(num - 1);
                $(`#${this.id}_headers li:nth-child(${num}) a`).css('display', 'none');
                return this;
            }
            showTab(num) {
                $(`#${this.id}_headers li:nth-child(${num}) a`).css('display', '');
                return this;
            }
            isShownTab(num) {
                let tab = $(`#${this.id}_headers li:nth-child(${num}) a`);
                return tab.length == 1 && tab.css('display') != 'none';
            }
            getActiveIndex() {
                return this._config.activeIndex + 1;
            }
            clear() {
                return this.tabs(null);
            }
            tabs(items) {
                if (arguments.length == 0)
                    return this._config.data;
                this._config.data = items;
                this.render();
                return this;
            }
            addTab(tabs, from) {
                let size = this.length();
                if (!Types.isDefined(from) || from > size) {
                    from = size + 1;
                }
                else if (size == 0 || from < 1)
                    from = 1;
                let cfg = this._config;
                cfg.data = cfg.data || [];
                cfg.data.add(Arrays.toArray(tabs), from - 1);
                this.render();
                return this;
            }
            removeTab(num) {
                if (num > this.length() || num < 1)
                    return this;
                let cfg = this._config;
                cfg.data = cfg.data || [];
                cfg.data.remove(num - 1);
                this.render();
                return this;
            }
            removeTabHeading(heading) {
                let cfg = this._config;
                cfg.data = cfg.data || [];
                let i = cfg.data.findIndex((item) => {
                    return heading == item.heading;
                }, 0);
                if (i < 0)
                    return this;
                return this.removeTab(i + 1);
            }
            length() {
                let data = this._config.data;
                return data ? data.length : 0;
            }
            _head(item, i) {
                return `
                <li class="nav-item">
                    <a  id="${this.id}_${i}-tab" jsfx-index="${i}" class="nav-link ${item.disabled ? 'disabled' : ''}" 
                    data-toggle="tab" href="#${this.id}_${i}" role="tab" aria-controls="${this.id}_${i}" aria-selected="false">
                    ${item.heading}</a>
                </li>
                `;
            }
            _content(item, i) {
                let html = Types.isString(item.content) ? item.content : $(item.content).html();
                return `<div class="tab-pane fade" id="${this.id}_${i}" role="tabpanel" aria-labelledby="${this.id}_${i}-tab">${html || ''}</div>`;
            }
            _html() {
                let cfg = this._config, data = cfg.data, heads = '', contents = '';
                if (!data)
                    return '';
                data.forEach((item, i) => {
                    heads += this._head(item, i);
                    contents += this._content(item, i);
                });
                let cls = '';
                if (this._hasFaceMode(TabFaceMode.pill)) {
                    cls += ' nav-pills';
                }
                else if (this._hasFaceMode(TabFaceMode.underline)) {
                    cls += ' jsfx-tab-underline';
                }
                else {
                    cls += ' nav-tabs';
                }
                cls += ' ' + cfg.colorMode || '';
                let isVtl = this._hasFaceMode(TabFaceMode.vertical);
                if (isVtl)
                    cls += ' flex-column';
                let hHtml = `<ul id="${this.id}_headers" role="tablist" class="nav${cls} ${cfg.headCls || ''}" style="${cfg.headStyle || ''}">${heads}</ul>`, cHtml = `<div class="${isVtl ? 'vertical' : ''} tab-content" style="height:${Lengths.toCssString(cfg.height, '100%')};">${contents}</div>`, leftWidth = Lengths.toCssString(cfg.headLeftWidth, '100%');
                return isVtl ?
                    `
                <div class="w-100">
                <div style="float:left;width:${leftWidth};">${hHtml}</div>
                <div style="margin-left:${leftWidth};">${cHtml}</div>
                </div>
                ` : `${hHtml}${cHtml}`;
            }
            _render() {
                this.widgetEl.html(this._html());
                if (this.length() > 0) {
                    let tablist = this.widgetEl.find('ul[role=tablist]');
                    tablist.on('show.bs.tab', (e) => {
                        this._fire('activing', [e.target, e.relatedTarget]);
                    });
                    tablist.on('shown.bs.tab', (e) => {
                        this._fire('actived', [e.target, e.relatedTarget]);
                    });
                    this.activeTab(this.getActiveIndex());
                }
            }
            _destroy() {
                this.widgetEl.find('a[role=tab]').each(function () { $(this).tab('dispose'); });
                super._destroy();
            }
        };
        Tab = __decorate([
            widget('JS.fx.Tab'),
            __metadata("design:paramtypes", [TabConfig])
        ], Tab);
        fx.Tab = Tab;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Tab = JS.fx.Tab;
var TabFaceMode = JS.fx.TabFaceMode;
var TabConfig = JS.fx.TabConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class TelInputConfig extends fx.LineInputConfig {
            constructor() {
                super(...arguments);
                this.innerIcon = 'fa fa-mobile';
            }
        }
        fx.TelInputConfig = TelInputConfig;
        let TelInput = class TelInput extends fx.TextInput {
            constructor(cfg) {
                super(cfg);
            }
            _bodyFragment() {
                return super._bodyFragment('tel');
            }
        };
        TelInput = __decorate([
            widget('JS.fx.TelInput'),
            __metadata("design:paramtypes", [TelInputConfig])
        ], TelInput);
        fx.TelInput = TelInput;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var TelInput = JS.fx.TelInput;
var TelInputConfig = JS.fx.TelInputConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class TextAreaConfig extends fx.RowsInputConfig {
            constructor() {
                super(...arguments);
                this.resize = 'none';
                this.rows = 3;
            }
        }
        fx.TextAreaConfig = TextAreaConfig;
        let TextArea = class TextArea extends fx.RowsInput {
            constructor(cfg) {
                super(cfg);
            }
            _bodyFragment() {
                let cfg = this._config, cls = 'form-control font-' + cfg.sizeMode, readonly = cfg.readonly ? ' readonly' : '', autofocus = cfg.autofocus ? ' autofocus' : '', max = cfg.maxlength, maxLength = max && Number.isFinite(max) ? (' maxLength=' + max) : '';
                if (cfg.colorMode) {
                    cls += ` ${cfg.outline ? 'border' : 'focus'}-${cfg.colorMode}`;
                }
                this._eachMode('faceMode', mode => {
                    cls += ' border-' + mode;
                });
                let counter = Number.isFinite(cfg.maxlength) && cfg.counter ? `
                <div style="float:${cfg.counter.place}">
                <span class="counter ${cfg.counter.cls}"></span>
                </div>
                ` : '';
                return `
                    <textarea name="${this.name()}" jsfx-role="main" 
                    ${readonly}
                    ${autofocus}
                    ${maxLength}
                    style="resize:${cfg.resize}"
                    class="${cls}"
                    rows="${cfg.rows}"
                    placeholder="${cfg.placeholder}"></textarea>${counter}`;
            }
            _renderValue() {
                let v = this.value() || '';
                if (this._mainEl.val() == v)
                    return;
                this._mainEl.val(v);
            }
            _onAfterRender() {
                this._mainEl.on('input change paste', () => {
                    this._setValue(this._mainEl.val());
                    this._updateCounter();
                });
                super._onAfterRender();
            }
            _showError(msg) {
                super._showError(msg);
                this._mainEl.addClass('jsfx-input-error');
            }
            _hideError() {
                super._hideError();
                this._mainEl.removeClass('jsfx-input-error');
            }
        };
        TextArea = __decorate([
            widget('JS.fx.TextArea'),
            __metadata("design:paramtypes", [TextAreaConfig])
        ], TextArea);
        fx.TextArea = TextArea;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var TextArea = JS.fx.TextArea;
var TextAreaConfig = JS.fx.TextAreaConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class TextEditorConfig extends fx.RowsInputConfig {
            constructor() {
                super(...arguments);
                this.toolbar = [
                    ['style', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
                    ['font', ['fontsize']],
                    ['color', ['forecolor', 'backcolor']],
                    ['para', ['ul', 'ol', 'paragraph', 'height']],
                    ['insert', ['hr', 'table', 'picture', 'link']],
                    ['view', ['fullscreen', 'codeview', 'undo', 'redo', 'help']]
                ];
                this.maxlength = Infinity;
                this.disableDragAndDrop = false;
                this.fontNames = ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New'];
            }
        }
        fx.TextEditorConfig = TextEditorConfig;
        let TextEditor = class TextEditor extends fx.RowsInput {
            constructor(cfg) {
                super(cfg);
            }
            undo() {
                this._mainEl.summernote('undo');
                return this;
            }
            redo() {
                this._mainEl.summernote('redo');
                return this;
            }
            readonly(is) {
                if (arguments.length == 0)
                    return this._config.readonly;
                this._mainEl.summernote('disable');
                this._config.readonly = is;
                return this;
            }
            disable() {
                this._mainEl.summernote('disable');
                this._config.disabled = true;
                return this;
            }
            enable() {
                this._mainEl.summernote('enable');
                this._config.disabled = false;
                return this;
            }
            focus() {
                this._mainEl.summernote('focus');
                return this;
            }
            insertImage(url, filename) {
                this._mainEl.summernote('insertImage', url, Types.isString(filename) ? filename : (img) => {
                    filename.apply(this, [img]);
                });
                return this;
            }
            insertNode(node) {
                this._mainEl.summernote('insertNode', node);
                return this;
            }
            insertText(text) {
                this._mainEl.summernote('insertText', text);
                return this;
            }
            insertHtml(html) {
                this._mainEl.summernote('pasteHTML', html);
                return this;
            }
            insertLink(text, href, isNewWindow) {
                this._mainEl.summernote('createLink', {
                    url: href || '#',
                    text: text,
                    isNewWindow: isNewWindow == undefined ? true : isNewWindow
                });
                return this;
            }
            _bodyFragment(type) {
                let cfg = this._config, counter = Number.isFinite(cfg.maxlength) && cfg.counter ? `
                <div style="float:${cfg.counter.place}">
                <span class="counter ${cfg.counter.cls}"></span>
                </div>
                ` : '';
                return `<div jsfx-role="main" class="summernote"></div>${counter}`;
            }
            _destroy() {
                this._mainEl.summernote('destroy');
                super._destroy();
            }
            _onAfterRender() {
                let cfg = this._config, callbacks = {
                    onInit: () => {
                        this._fire('init');
                    },
                    onBlur: () => {
                        this._fire('blur');
                    },
                    onFocus: () => {
                        this._fire('focus');
                    },
                    onEnter: () => {
                        this._fire('enter');
                    },
                    onKeyup: (e) => {
                        this._fire('keyup', [e.keyCode]);
                    },
                    onKeydown: (e) => {
                        this._fire('keydown', [e.keyCode]);
                    },
                    onMousedown: (e) => {
                        this._fire('mousedown', [e.keyCode]);
                    },
                    onMouseup: (e) => {
                        this._fire('mouseup', [e.keyCode]);
                    },
                    onPaste: () => {
                        this._fire('paste');
                    },
                    onImageUpload: (files) => {
                        this._fire('imageupload', [files]);
                    },
                    onChange: (html) => {
                        if (html != this.value())
                            this._setValue(html);
                    }
                }, snCfg = {
                    airMode: false,
                    dialogsInBody: true,
                    dialogsFade: true,
                    disableDragAndDrop: cfg.disableDragAndDrop,
                    focus: cfg.autofocus,
                    fontNames: cfg.fontNames,
                    width: cfg.width,
                    height: cfg.height,
                    lang: cfg.locale,
                    placeholder: cfg.placeholder,
                    toolbar: cfg.toolbar,
                    callbacks: callbacks
                };
                if (cfg.buttons) {
                    let btnNames = [], btnJson = {};
                    cfg.buttons.forEach(btn => {
                        btnNames.push(btn.name);
                        btnJson[btn.name] = (ctx) => {
                            var ui = $.summernote.ui, button = ui.button({
                                contents: btn.html,
                                tooltip: btn.tip,
                                click: () => {
                                    btn.onClick.apply(this, [btn]);
                                }
                            });
                            return button.render();
                        };
                    });
                    snCfg.toolbar.push(['mybutton', btnNames]);
                    snCfg.buttons = btnJson;
                }
                this._mainEl.summernote(snCfg);
                if (!this.isEmpty())
                    this.widgetEl.find('.note-placeholder').css('display', 'none');
                let cls = '';
                this._eachMode('faceMode', mode => {
                    cls += ' border-' + mode;
                });
                this.widgetEl.find('div.note-editor').addClass(cls);
                super._onAfterRender();
            }
            _onAfterInit() {
                if (this.readonly())
                    this.readonly(true);
            }
            isEmpty() {
                return this._mainEl.summernote('isEmpty');
            }
            value(val) {
                let cfg = this._config, oldVal = this._valueModel.get(this.name()) || '';
                if (arguments.length == 0)
                    return oldVal;
                val = val || '';
                if (val != (this._getDomValue() || ''))
                    this._mainEl.summernote('code', val);
                return this;
            }
            _iniValue() {
                let cfg = this._config, v = cfg.iniValue || '';
                this._mainEl.summernote('code', v);
                this._setValue(v, true);
            }
            _getDomValue() {
                if (this.isEmpty())
                    return '';
                let v = this._mainEl.summernote('code');
                return v == void 0 ? '' : v;
            }
            _showError(msg) {
                super._showError(msg);
                this.widgetEl.find('.note-editor').addClass('jsfx-input-error');
            }
            _hideError() {
                super._hideError();
                this.widgetEl.find('.note-editor').removeClass('jsfx-input-error');
            }
        };
        TextEditor = __decorate([
            widget('JS.fx.TextEditor'),
            __metadata("design:paramtypes", [TextEditorConfig])
        ], TextEditor);
        fx.TextEditor = TextEditor;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var TextEditor = JS.fx.TextEditor;
var TextEditorConfig = JS.fx.TextEditorConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let toastrPosition = {
            lt: 'toast-top-left',
            rt: 'toast-top-right',
            ct: 'toast-top-center',
            lb: 'toast-bottom-left',
            rb: 'toast-bottom-right',
            cb: 'toast-bottom-center'
        };
        class ToastConfig {
            constructor() {
                this.htmlable = false;
                this.type = 'info';
                this.progressBar = false;
                this.place = 'ct';
            }
        }
        fx.ToastConfig = ToastConfig;
        let Toast = class Toast {
            static show(cfg) {
                if (!cfg.title && !cfg.message)
                    return;
                let c = Jsons.union(new ToastConfig(), cfg);
                if (cfg.timeout == 0)
                    c.extendedTimeOut = 0;
                c.toastClass = 'toast jsfx-toast ' + cfg.cls || '';
                c.escapeHtml = !c.htmlable;
                c.timeOut = c.timeout;
                delete c['cls'];
                delete c['htmlable'];
                delete c['timeout'];
                let lts = cfg.listeners;
                if (lts) {
                    if (lts.shown)
                        c.onShown = () => { lts.shown.apply(null, [new Event('shown')]); };
                    if (lts.hidden)
                        c.onHidden = () => { lts.shown.apply(null, [new Event('hidden')]); };
                    if (lts.closeclick)
                        c.onCloseClick = () => { lts.shown.apply(null, [new Event('closeclick')]); };
                    if (lts.click)
                        c.onclick = () => { lts.shown.apply(null, [new Event('click')]); };
                    delete c['listeners'];
                }
                c.positionClass = toastrPosition[cfg.place || 'ct'];
                delete c['place'];
                toastr.options = c;
                toastr[cfg.type](cfg.message, cfg.title);
            }
            static clearAll() {
                toastr.remove();
            }
        };
        Toast = __decorate([
            widget('JS.fx.Toast')
        ], Toast);
        fx.Toast = Toast;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Toast = JS.fx.Toast;
var ToastConfig = JS.fx.ToastConfig;
var JS;
(function (JS) {
    let util;
    (function (util) {
        class MimeFiles {
        }
        MimeFiles.SOURCE_FILES = {
            title: 'Source Files',
            extensions: 'c,h,cpp,ini,idl,hpp,hxx,hp,hh,cxx,cc,s,asm,log,bak,' +
                'as,ts,js,json,xml,html,htm,xhtml,xht,css,md,mkd,markdown,' +
                'java,properties,jsp,vm,ftl,' +
                'swift,m,mm,' +
                'cgi,sh,applescript,bat,sql,rb,py,php,php3,php4,' +
                'p,pp,pas,dpr,cls,frm,vb,bas,vbs,' +
                'cs,config,asp,aspx,' +
                'yaml,vhd,vhdl,cbl,cob,coffee,clj,lisp,lsp,cl,jl,el,erl,groovy,less,lua,go,ml,pl,pm,al,perl,r,scala,st,tcl,tk,itk,v,y,d,' +
                'xq,xql,xqm,xqy,xquery',
            mimeTypes: `text/plain`
        };
        MimeFiles.IMAGE_FILES = {
            title: 'Image Files',
            extensions: 'pic,jpg,jpeg,png,gif,bmp,webp,tif,tiff,svg,wbmp,tga,pcx,ico,psd,ai',
            mimeTypes: 'image/x-pict,image/jpeg,image/png,image/gif,image/bmp,image/webp,image/tiff,image/svg+xml,image/vnd.wap.wbmp,image/x-targa,image/x-pcx,image/x-icon,image/x-photoshop,application/illustrator'
        };
        MimeFiles.DOC_FILES = {
            title: 'Document Files',
            extensions: 'html,htm,xhtml,xht,md,markdown,mbox,msg,eml,txt,rtf,pdf,doc,docx,csv,xls,xlsx,ppt,pptx,xml,wps',
            mimeTypes: 'text/html,text/x-markdown,' +
                'application/mbox,application/vnd.ms-outlook,message/rfc822,text/plain,application/rtf,application/pdf,' +
                'application/msword,application/vnd.ms-excel,application/vnd.ms-powerpoint,' +
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document,' +
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,' +
                'application/vnd.openxmlformats-officedocument.presentationml.presentation,' +
                'text/xml,application/kswps'
        };
        MimeFiles.COMPRESSED_FILES = {
            title: 'Compressed Files',
            extensions: 'zip,7z,z,bz2,gz,tar,taz,tgz,rar,arj,lzh',
            mimeTypes: 'application/zip,application/x-7z-compressed,application/x-compress,application/x-bzip2,application/x-gzip,application/x-tar,application/x-rar-compressed,application/arj,application/x-lzh'
        };
        MimeFiles.VIDEO_FILES = {
            title: 'Video Files',
            extensions: 'mp4,rm,rmvb,mpg,mpeg,mpg4,avi,3gpp,asf,asx,wma,wmv,qt',
            mimeTypes: 'video/*,application/vnd.rn-realmedia,video/mpeg,video/x-msvideo,video/3gpp,video/x-ms-asf,audio/x-ms-wma,audio/x-ms-wmv,video/quicktime'
        };
        MimeFiles.AUDIO_FILES = {
            title: 'Audio Files',
            extensions: 'ogg,wav,mpga,mp2,mp3,au,snd,mid,midi,ra,ram,aif,aiff,webm',
            mimeTypes: 'audio/ogg,audio/x-wav,audio/mpeg,audio/x-mpeg,audio/basic,audio/midi,audio/x-midi,audio/x-pn-realaudio,audio/x-aiff,audio/webm'
        };
        MimeFiles.WEB_FILES = {
            title: 'Web Files',
            extensions: 'html,htm,xhtml,xht,css,js,json,swf',
            mimeTypes: 'text/html,text/css,application/json,text/javascript,application/x-shockwave-flash'
        };
        util.MimeFiles = MimeFiles;
        let FileSizeUnit;
        (function (FileSizeUnit) {
            FileSizeUnit["B"] = "B";
            FileSizeUnit["KB"] = "KB";
            FileSizeUnit["MB"] = "MB";
            FileSizeUnit["GB"] = "GB";
            FileSizeUnit["TB"] = "TB";
        })(FileSizeUnit = util.FileSizeUnit || (util.FileSizeUnit = {}));
        class Files {
            static _createReader(listener) {
                let reader = new FileReader();
                if (listener) {
                    util.Jsons.forEach(listener, (fn, key) => {
                        if (fn)
                            reader['on' + key] = fn;
                    });
                }
                return reader;
            }
            static readAsArrayBuffer(file, listener) {
                this._createReader(listener).readAsArrayBuffer(file);
            }
            static readAsBinaryString(file, listener) {
                this._createReader(listener).readAsBinaryString(file);
            }
            static readAsDataURL(file, listener) {
                this._createReader(listener).readAsDataURL(file);
            }
            static readAsText(file, listener) {
                this._createReader(listener).readAsText(file);
            }
            static getFileName(path) {
                let pos = path.lastIndexOf('/');
                if (pos < 0)
                    return path;
                return path.slice(pos + 1);
            }
            static getExt(path) {
                let pos = path.lastIndexOf('.');
                if (pos < 0)
                    return '';
                return path.slice(pos + 1);
            }
            static isFileExt(path, exts) {
                if (!path || !exts)
                    return false;
                let ext = this.getExt(path);
                return ext ? (exts.toLowerCase() + ',').indexOf(ext + ',') >= 0 : false;
            }
            static isSourceFile(path) {
                return this.isFileExt(path, MimeFiles.SOURCE_FILES.extensions);
            }
            static isImageFile(path) {
                return this.isFileExt(path, MimeFiles.IMAGE_FILES.extensions);
            }
            static isDocFile(path) {
                return this.isFileExt(path, MimeFiles.DOC_FILES.extensions);
            }
            static isAudioFile(path) {
                return this.isFileExt(path, MimeFiles.AUDIO_FILES.extensions);
            }
            static isVideoFile(path) {
                return this.isFileExt(path, MimeFiles.VIDEO_FILES.extensions);
            }
            static isCompressedFile(path) {
                return this.isFileExt(path, MimeFiles.COMPRESSED_FILES.extensions);
            }
            static isWebFile(path) {
                return this.isFileExt(path, MimeFiles.WEB_FILES.extensions);
            }
            static convertSize(size, orgUnit, tarUnit) {
                if (!size)
                    return 0;
                let s = Number(size);
                if (s <= 0)
                    return 0;
                let map = {
                    'B': 0, 'KB': 1, 'MB': 2, 'GB': 3, 'TB': 4
                }, r1 = map[orgUnit], r2 = map[tarUnit];
                return s * Math.pow(1024, r1 - r2);
            }
            static toSizeString(byte, sizeUnit) {
                let unit = sizeUnit || FileSizeUnit.B;
                if (!byte)
                    return '0' + unit;
                let kb = this.convertSize(byte, unit, FileSizeUnit.KB);
                if (kb == 0)
                    return '0' + unit;
                if (kb < 1)
                    return byte + 'B';
                let mb = this.convertSize(byte, unit, FileSizeUnit.MB);
                if (mb < 1)
                    return kb + 'KB';
                let gb = this.convertSize(byte, unit, FileSizeUnit.GB);
                if (gb < 1)
                    return mb + 'MB';
                let tb = this.convertSize(byte, unit, FileSizeUnit.TB);
                return tb < 1 ? (gb + 'GB') : (tb + 'TB');
            }
        }
        Files.ONE_KB = 1024;
        Files.ONE_MB = 1048576;
        Files.ONE_GB = 1073741824;
        Files.ONE_TB = 1099511627776;
        util.Files = Files;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var MimeFiles = JS.util.MimeFiles;
var FileSizeUnit = JS.util.FileSizeUnit;
var Files = JS.util.Files;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        var Uploader_1;
        let UploaderFaceMode;
        (function (UploaderFaceMode) {
            UploaderFaceMode["list"] = "list";
            UploaderFaceMode["image"] = "image";
            UploaderFaceMode["square"] = "square";
            UploaderFaceMode["round"] = "round";
            UploaderFaceMode["shadow"] = "shadow";
        })(UploaderFaceMode = fx.UploaderFaceMode || (fx.UploaderFaceMode = {}));
        class UploaderConfig extends fx.FormWidgetConfig {
            constructor() {
                super(...arguments);
                this.readonly = false;
                this.dnd = false;
                this.paste = false;
                this.thumb = { width: 1, height: 1 };
                this.duplicate = true;
                this.multiple = false;
                this.fieldName = 'file';
                this.faceMode = [UploaderFaceMode.square, UploaderFaceMode.list];
                this.iniValue = null;
                this.data = null;
            }
        }
        fx.UploaderConfig = UploaderConfig;
        let Uploader = Uploader_1 = class Uploader extends fx.FormWidget {
            constructor(cfg) {
                super(cfg);
            }
            _initUploader(cfg) {
                if (this._uploader)
                    return;
                let me = this;
                $('#' + this.id).find('.classic-pick').on('click', function () {
                    $('#' + me.id).find('.webuploader-element-invisible').click();
                });
                let url = JS.config('libs')['webuploader.swf'];
                url = url.startsWith('~') ? (JS.config('libRoot') || '') + url.slice(1) : url;
                let cf = {
                    pick: {
                        id: `#${this.id} .pick`,
                        multiple: cfg.multiple
                    },
                    paste: cfg.paste == true ? `#${this.id}` : (cfg.paste == 'body' ? document.body : undefined),
                    dnd: cfg.dnd ? `#${this.id}` : undefined,
                    swf: url,
                    auto: true,
                    accept: cfg.accept || null,
                    fileNumLimit: cfg.maxNumbers || undefined,
                    fileSizeLimit: cfg.maxTotalSize || undefined,
                    fileSingleSizeLimit: cfg.maxSingleSize || undefined,
                    disableGlobalDnd: false,
                    duplicate: cfg.duplicate,
                    fileVal: cfg.fieldName,
                    formData: cfg.uploadData || {},
                    thumb: {
                        width: cfg.thumb && cfg.thumb.width,
                        height: cfg.thumb && cfg.thumb.height,
                        allowMagnify: false,
                        crop: false,
                        type: ''
                    },
                    compress: cfg.compress && cfg.compress.width && cfg.compress.height ? {
                        width: cfg.compress.width,
                        height: cfg.compress.height,
                        quality: 90,
                        allowMagnify: false,
                        crop: false,
                        preserveHeaders: true,
                        noCompressIfLarger: true,
                        compressSize: 0
                    } : false
                };
                this._uploader = WebUploader.Uploader.create(cf);
                let eMap = Uploader_1._EVENTS_MAP;
                this._uploader.on(eMap.get('adding'), function (file) {
                    return me._fire('adding', [me._toMimeFile(file)]);
                });
                this._uploader.on(eMap.get('added'), function (files) {
                    files.forEach((file) => {
                        me._onFileQueued(file);
                    });
                    me._fire('added', [me._toMimeFiles(files)]);
                });
                this._uploader.on(eMap.get('removed'), function (file) {
                    me._onFileDequeued(file);
                    me._fire('removed', [me._toMimeFile(file)]);
                });
                this._uploader.on(eMap.get('uploading'), function (file, percentage) {
                    me._fire('uploading', [me._toMimeFile(file), percentage]);
                });
                this._uploader.on(eMap.get('uploaderror'), function (file, reason) {
                    me._onUploadFail(file);
                    me._fire('uploaderror', [me._toMimeFile(file), reason]);
                });
                this._uploader.on(eMap.get('uploadsuccess'), function (file, response) {
                    me._onUploadSuccess(file, response);
                    me._fire('uploadsuccess', [me._toMimeFile(file), response]);
                });
                this._uploader.on(eMap.get('uploaded'), function (file) {
                    me._fire('uploaded', [me._toMimeFile(file)]);
                });
                this._uploader.on(eMap.get('beginupload'), function () {
                    me._fire('beginupload');
                });
                this._uploader.on(eMap.get('endupload'), function () {
                    me._fire('endupload');
                });
                let errors = {
                    'F_EXCEED_SIZE': 'exceedMaxSize',
                    'F_DUPLICATE': 'wrongDuplicate',
                    'Q_TYPE_DENIED': 'wrongType',
                    'Q_EXCEED_NUM_LIMIT': 'exceedNumbers',
                    'Q_EXCEED_SIZE_LIMIT': 'exceedMaxTotalSize'
                };
                this._uploader.on('error', (type) => {
                    fx.Toast.show({ type: 'error', message: me._i18n(errors[type]), place: 'cb' });
                });
            }
            _showError(msg) {
                super._showError(msg);
                this.widgetEl.find('.body').addClass('jsfx-input-error');
            }
            _hideError() {
                super._hideError();
                this.widgetEl.find('.body').removeClass('jsfx-input-error');
            }
            _onAfterRender() {
                this._initUploader(this._config);
                super._onAfterRender();
            }
            _createShadow(id, ctor) {
                return $(`<div id="${id}"></div>`).css({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: "#808080",
                    opacity: 0.1,
                    zIndex: (Number(ctor.css('z-index')) || 0) + 1
                });
            }
            readonly(is) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.readonly;
                if (cfg.readonly == is)
                    return this;
                cfg.readonly = is;
                $(`#${this.id} .body`)[is ? 'addClass' : 'removeClass']('readonly');
                let p = $(`#${this.id} .pick`);
                is ? p.hide() : p.show();
                return this;
            }
            disable() {
                if (!this.isEnabled())
                    return this;
                this._config.disabled = true;
                let ctor = $(`#${this.id} .body`).addClass('disabled');
                this._createShadow(this.id + '_shadow', ctor).appendTo(ctor);
                return this;
            }
            enable() {
                if (this.isEnabled())
                    return this;
                this._config.disabled = false;
                $(`#${this.id} .body`).removeClass('disabled');
                $('#' + this.id + '_shadow').remove();
                return this;
            }
            _pickText(key) {
                let cfg = this._config, fileExts = (cfg.accept && cfg.accept.title) || '*', maxTotalSize = cfg.maxTotalSize ? Files.toSizeString(cfg.maxTotalSize) : '*', maxNumbers = cfg.maxNumbers || '*', maxSingleSize = cfg.maxSingleSize ? Files.toSizeString(cfg.maxSingleSize) : '*';
                return Strings.merge(this._i18n(key) || '', {
                    fileExts: fileExts,
                    maxTotalSize: maxTotalSize,
                    maxNumbers: maxNumbers,
                    maxSingleSize: maxSingleSize
                });
            }
            _bodyFragment() {
                let cfg = this._config, title = this._pickText('pickTitle'), tip = this._pickText('pickTip').replace(/\n/g, '&#10;'), fag = !this._hasFaceMode(UploaderFaceMode.image) ?
                    `<ul class="files-area list"></ul>` :
                    `<div class="files-area image"></div>`, cls = '';
                if (this._hasFaceMode(UploaderFaceMode.shadow))
                    cls += ' border-shadow';
                if (this._hasFaceMode(UploaderFaceMode.round))
                    cls += ' border-round';
                return `
                <div class="body font-${cfg.sizeMode || 'md'}${cls}">
                    <div class="pick" title="${tip}">
                        <i class="la la-cloud-upload"></i>
                        <span class="pick-title">${title}</span>
                    </div>
                    ${fag}
                </div>`;
            }
            isCrud() {
                return true;
            }
            crudValue() {
                let val = this.value() || [], iniVal = this.iniValue() || [], arr = [];
                iniVal.forEach(v => {
                    if (val.findIndex(it => {
                        return it.id == v.id;
                    }) < 0) {
                        arr[arr.length] = Jsons.union(v, { _crud: 'D' });
                    }
                });
                val.forEach(v => {
                    if (iniVal.findIndex(it => {
                        return it.id == v.id;
                    }) < 0) {
                        if (!v.id.startsWith('WU_FILE_') && v.id != v['_wuid'])
                            arr[arr.length] = Jsons.union(v, { _crud: 'C' });
                    }
                });
                return arr;
            }
            iniValue(v, render) {
                if (arguments.length == 0)
                    return super.iniValue();
                return super.iniValue(v, render);
            }
            value(file) {
                if (arguments.length == 0)
                    return super.value();
                if (Check.isEmpty(file)) {
                    this._uploader.reset();
                    $(`#${this.id} .files-area`).children().remove();
                    this._setValue(null);
                    return this;
                }
                return this.add(file);
            }
            _equalValues(newVal, oldVal) {
                return Arrays.equal(oldVal, newVal, (file1, file2) => {
                    return file1.id == file2.id;
                });
            }
            add(file) {
                if (Check.isEmpty(file))
                    return this;
                this._addFiles(Arrays.toArray(file));
                return this;
            }
            remove(id) {
                if (Check.isEmpty(id))
                    return this;
                let rms = Arrays.toArray(id);
                rms.forEach(i => {
                    let el = this.widgetEl.find(`[file-id="${i}"]`);
                    if (el.length == 1)
                        this._removeFile(el.attr('wu-id'));
                });
                return this;
            }
            data(data) {
                if (arguments.length == 0)
                    return this.value();
                return this.value(data);
            }
            _onUploadSuccess(wuFile, res) {
                let cfg = this._config, fmt = cfg.dataFormat, result = Types.isFunction(fmt) ? fmt.apply(this, res) : ResultSet.parseJSON(res, fmt);
                if (result.success()) {
                    let file = result.data(), val = this.value() || [], index = val.findIndex(item => {
                        return wuFile.id == item.id;
                    });
                    if (index >= 0) {
                        let oFile = val[index];
                        oFile.id = file.id;
                        oFile.uri = file.uri;
                    }
                }
                else {
                    this._onUploadFail(wuFile);
                }
            }
            _onUploadFail(file) {
                this.widgetEl.find(`[file-id="${file.id}"]`).addClass('fail');
            }
            _onFileDequeued(file) {
                this.widgetEl.find(`[wu-id="${file.id}"]`).remove();
                let newVal = Jsons.clone(this.value()).remove((mFile) => { return mFile['_wuid'] == file.id; });
                this._valueModel.set(this.name(), newVal);
            }
            _fileIcon(path) {
                let icon = 'alt';
                if (Files.isFileExt(path, 'pdf')) {
                    icon = 'pdf';
                }
                else if (Files.isFileExt(path, 'doc,docx')) {
                    icon = 'word';
                }
                else if (Files.isFileExt(path, 'xls,xlsx')) {
                    icon = 'excel';
                }
                else if (Files.isFileExt(path, 'ppt,pptx')) {
                    icon = 'powerpoint';
                }
                else if (Files.isAudioFile(path)) {
                    icon = 'audio';
                }
                else if (Files.isVideoFile(path)) {
                    icon = 'video';
                }
                else if (Files.isCompressedFile(path)) {
                    icon = 'archive';
                }
                else if (Files.isSourceFile(path)) {
                    icon = 'code';
                }
                else if (Files.isImageFile(path)) {
                    icon = 'image';
                }
                return '<span><i class="far fa-file-' + icon + '"></i></span>';
            }
            _onFileQueued(wuFile) {
                let file = this._toMimeFile(wuFile);
                this._renderFile(file);
                if (this._hasFaceMode(UploaderFaceMode.image)) {
                    let isImage = Files.isImageFile(file.name);
                    if (!file.uri && isImage) {
                        this._makeThumb(wuFile);
                    }
                    else if (!isImage)
                        this.widgetEl.find(`[file-id=${file.id}] img`).replaceWith(this._fileIcon('.' + file.ext));
                }
                if (file.uri)
                    this._uploader.skipFile(wuFile.id);
                file['_wuid'] = wuFile.id;
                this.widgetEl.find('[file-id]:last-child').attr('wu-id', wuFile.id);
                this._setValue((this.value() || []).concat(file));
            }
            _renderFile(file) {
                let url = file.uri || '', fId = file.id || '', fileLink = `<a id="${this.id}-${fId}" src="${url}" href="javascript:void(0);">${file.name}</a>`, retryTip = this._i18n('retryTip') || 'Retry', removeTip = this._i18n('removeTip') || 'Remove', html = !this._hasFaceMode(UploaderFaceMode.image) ?
                    $(`<li file-id="${fId}">
                    <div class="text-truncate file-name" title="${Strings.escapeHTML(file.name)}">
                        ${this._fileIcon('.' + file.ext)}
                        ${fileLink}
                    </div>
                    <div class="file-actions">
                        <span class="action remove text-center" title="${removeTip}"><i class="fa fa-times"></i></span>
                        <span class="action retry text-center" title="${retryTip}"><i class="fa fa-upload"></i></span>
                    </div>
                </li>`)
                    : $(`
                    <div file-id="${fId}">
                    <div class="file-image-area">
                        <div class="file-image items-center items-middle"><img id="${this.id}-${fId}" src="${url}"/></div>
                        <div class="file-actions">
                            <span class="action remove text-center" title="${removeTip}"><i class="fa fa-times"></i></span>
                            <span class="action retry text-center" title="${retryTip}"><i class="fa fa-upload"></i></span>
                        </div>
                    </div>
                    <div class="text-truncate file-name" title="${Strings.escapeHTML(file.name)}">
                    ${fileLink}
                    </div>
                    </div>
                `);
                this.widgetEl.find(`.files-area`).append(html);
                this._bindActions(fId);
            }
            _makeThumb(file) {
                this._uploader.makeThumb(file, (error, src) => {
                    let el = this.widgetEl.find(`[file-id=${file.id}]`);
                    if (error) {
                        el.find('img').replaceWith(this._fileIcon('.' + file.ext));
                        return;
                    }
                    el.find(`#${this.id}-${file.id}`).attr('src', src);
                });
            }
            _bindActions(fileId) {
                let fEl = this.widgetEl.find(`[file-id="${fileId}"]`);
                fEl.on('click', !this._hasFaceMode(UploaderFaceMode.image) ? 'a' : 'a,.file-image', (e) => {
                    let src = this.widgetEl.find(`#${this.id}-${fileId}`).attr('src');
                    if (src) {
                        (Files.isImageFile(src) || src.indexOf('data:image/') == 0) ? window.open().document.body.innerHTML = `<img src="${src}" >` : window.open(src);
                    }
                    else {
                        fx.Toast.show({
                            type: 'error',
                            message: this._i18n('viewDenied')
                        });
                    }
                    return false;
                });
                fEl.on('click', '.action.remove', (e) => {
                    this._removeFile(fEl.attr('wu-id'));
                    fEl.remove();
                    return false;
                });
                fEl.on('click', '.action.retry', (e) => {
                    this._retryFile(fEl.attr('wu-id'));
                    return false;
                });
            }
            _toMimeFiles(wfs) {
                if (Check.isEmpty(wfs))
                    return [];
                let fs = [];
                wfs.forEach(file => {
                    fs.push(this._toMimeFile(file));
                });
                return fs;
            }
            _toMimeFile(wf) {
                if (!wf)
                    return null;
                return {
                    id: wf.source.id || wf.id,
                    mime: wf.type,
                    name: wf.name,
                    ext: wf.ext,
                    size: wf.size,
                    uri: wf.source.uri
                };
            }
            _toWUFile(cf) {
                if (!cf)
                    return null;
                if (!cf.uri)
                    throw new Errors.URIError(`The file<${cf.name}> has not URI.`);
                let file = {
                    id: cf.id,
                    type: cf.mime,
                    name: cf.name,
                    ext: cf.ext || Files.getExt(cf.name),
                    size: cf.size || 1,
                    getRuid: () => { return ''; },
                    getSource: () => { return null; }
                };
                file['uri'] = cf.uri;
                return file;
            }
            _removeFile(wuFileId) {
                let f = this._uploader.getFile(wuFileId);
                if (f)
                    this._uploader.removeFile(f, true);
                return this;
            }
            _retryFile(wuFileId) {
                let f = this._uploader.getFile(wuFileId);
                if (f)
                    this._uploader.retry(f);
                return this;
            }
            _addFiles(files) {
                if (Check.isEmpty(files))
                    return this;
                let wuFiles = [], value = this.value() || [];
                files.forEach(f => {
                    if (value.findIndex((v) => { return v.id == f.id; }) < 0)
                        wuFiles.push(new WebUploader.File(this._toWUFile(f)));
                });
                if (wuFiles.length > 0)
                    this._uploader.addFiles(wuFiles);
                return this;
            }
            inProgress() {
                return this._uploader.isInProgress();
            }
        };
        Uploader._EVENTS_MAP = new BiMap([
            ['adding', 'beforeFileQueued'],
            ['added', 'filesQueued'],
            ['removed', 'fileDequeued'],
            ['uploading', 'uploadStart'],
            ['uploadprogress', 'uploadProgress'],
            ['uploadsuccess', 'uploadSuccess'],
            ['uploaderror', 'uploadError'],
            ['uploaded', 'uploadComplete'],
            ['beginupload', 'startUpload'],
            ['endupload', 'uploadFinished']
        ]);
        Uploader.I18N = {
            pickTitle: 'Select your local files please',
            pickTip: '<Accepts>\nFileExts={fileExts}\nMaxTotalSize={maxTotalSize}\nMaxNumbers={maxNumbers}\nMaxSingleSize={maxSingleSize}',
            retryTip: 'Retry',
            removeTip: 'Remove',
            viewDenied: 'The file can\'t be viewed in local mode',
            exceedMaxSize: 'Exceed the max size of single file',
            wrongDuplicate: 'Can\'t upload duplicate file',
            wrongType: 'Wrong file type',
            exceedNumbers: 'Exceed the max numbers of file',
            exceedMaxTotalSize: 'Exceed the max size of total files'
        };
        Uploader = Uploader_1 = __decorate([
            widget('JS.fx.Uploader'),
            __metadata("design:paramtypes", [UploaderConfig])
        ], Uploader);
        fx.Uploader = Uploader;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Uploader = JS.fx.Uploader;
var UploaderConfig = JS.fx.UploaderConfig;
var UploaderFaceMode = JS.fx.UploaderFaceMode;
var JS;
(function (JS) {
    let ioc;
    (function (ioc) {
        class Components {
            static get(cmpt) {
                let cmp;
                if (Types.isString(cmpt)) {
                    cmp = this._cmps[cmpt];
                }
                if (!cmp)
                    cmp = this.add(cmpt);
                return cmp;
            }
            static add(cmpt) {
                let cmp, clazz = Class.forName(cmpt);
                if (!clazz)
                    return undefined;
                if (this._cmps.hasOwnProperty(clazz.name)) {
                    return this._cmps[clazz.name];
                }
                else {
                    cmp = clazz.newInstance();
                    this._injectFields(clazz, cmp);
                    this._cmps[clazz.name] = cmp;
                    if (cmp.initialize)
                        cmp.initialize();
                }
                return cmp;
            }
            static remove(cmpt) {
                let clazz = Class.forName(cmpt);
                if (!clazz)
                    return;
                let cmp = this._cmps[clazz.name];
                if (cmp) {
                    if (cmp.destroy)
                        cmp.destroy();
                    delete this._cmps[clazz.name];
                }
            }
            static clear() {
                Jsons.forEach(this._cmps, cmp => {
                    if (cmp.destroy)
                        cmp.destroy();
                });
                this._cmps = {};
            }
            static _injectFields(clazz, cmp) {
                let fields = clazz.fieldsMap(cmp, ioc.inject);
                Jsons.forEach(fields, (v, k) => {
                    let f = Annotations.getPropertyType(cmp, k);
                    if (!f || !Types.equalKlass(f))
                        throw new Errors.TypeError('The type of Field[' + k + '] is invalid!');
                    let cls = f.class;
                    cmp[k] = this.get(cls.name);
                });
            }
        }
        Components._cmps = {};
        ioc.Components = Components;
    })(ioc = JS.ioc || (JS.ioc = {}));
})(JS || (JS = {}));
var Components = JS.ioc.Components;
var JS;
(function (JS) {
    let ioc;
    (function (ioc) {
        function component(className) {
            return Annotations.define({
                name: 'component',
                handler: (anno, values, obj) => {
                    let className = values[0];
                    Class.register(obj, className);
                    ioc.Components.get(Class.forName(className).name);
                }
            }, arguments);
        }
        ioc.component = component;
        function inject() {
            return Annotations.define({
                name: 'inject',
                target: AnnotationTarget.FIELD
            });
        }
        ioc.inject = inject;
    })(ioc = JS.ioc || (JS.ioc = {}));
})(JS || (JS = {}));
var component = JS.ioc.component;
var inject = JS.ioc.inject;
var JS;
(function (JS) {
    let lang;
    (function (lang) {
        var Thread_1;
        let ThreadState;
        (function (ThreadState) {
            ThreadState["NEW"] = "NEW";
            ThreadState["RUNNING"] = "RUNNING";
            ThreadState["TERMINATED"] = "TERMINATED";
            ThreadState["DESTROYED"] = "DESTROYED";
        })(ThreadState = lang.ThreadState || (lang.ThreadState = {}));
        let SYS_URL = null, _system = (srt) => {
            let src = srt.src.replace(/\?.*/, '');
            return src.endsWith('/system.js') || src.endsWith('/system.min.js') ? src : null;
        }, _docSystem = function (doc) {
            let scripts = doc.getElementsByTagName('script');
            if (scripts) {
                for (let i = 0, len = scripts.length; i < len; i++) {
                    let src = _system(scripts[i]);
                    if (src)
                        return src;
                }
            }
            let links = doc.querySelectorAll('link[rel=import]');
            if (links) {
                for (let i = 0, len = links.length; i < len; i++) {
                    let link = links[i];
                    if (link['import']) {
                        let src = _docSystem(link['import']);
                        if (src)
                            return src;
                    }
                }
            }
        }, _findSystem = function () {
            if (SYS_URL)
                return SYS_URL;
            let p = self.__jsdk_sys_path;
            if (p) {
                SYS_URL = p;
                return SYS_URL;
            }
            ;
            SYS_URL = _docSystem(document);
            return SYS_URL;
        };
        let Thread = Thread_1 = class Thread {
            constructor(target, preload) {
                this._bus = new EventBus(this);
                this._state = ThreadState.NEW;
                this._url = null;
                this._libs = [];
                if (target) {
                    let members = Reflect.ownKeys(target);
                    for (let i = 0, len = members.length; i < len; i++) {
                        const key = members[i].toString();
                        if (key.startsWith('__') || key == 'constructor')
                            continue;
                        const m = target[key];
                        if (Types.isFunction(m) || key == 'run')
                            this[key] = m;
                    }
                }
                this.id = Random.uuid(4, 10);
                if (preload) {
                    this._libs = this._libs.concat(typeof preload == 'string' ? [preload] : preload);
                }
            }
            getState() { return new String(this._state); }
            run() { }
            ;
            _define(fnName) {
                let fn = Thread_1._defines[fnName], fnBody = fn.toString().replace(/^function/, '');
                return `this.${fnName}=function${fnBody}`;
            }
            _predefine(id) {
                let sys = _findSystem();
                return `
                //@ sourceURL=thread-${id}.js
                this.id="${id}";
                this.__jsdk_sys_path="${sys}";
                importScripts("${sys}");
                ${this._define('imports')}
                ${this._define('onposted')}
                ${this._define('postMain')}
                ${this._define('callMain')}
                ${this._define('terminate')}
                ${this._libs.length > 0 ? `this.imports("${this._libs.join('","')}");` : ''}`;
            }
            _stringify(fn) {
                let script = this._predefine(this.id), fnText = fn.toString().trim(), fnBody = '';
                let rst = /[^{]+{((.|\n)*)}$/.exec(fnText);
                if (rst)
                    fnBody = rst[1];
                return `(()=>{${script}${fnBody}})()`;
            }
            isRunning() {
                return this._state == 'RUNNING';
            }
            start() {
                if (this.isDestroyed())
                    return this._warn('start');
                if (this.isRunning())
                    this.terminate();
                this._state = ThreadState.RUNNING;
                if (Types.isString(this.run)) {
                    this._url = this.run;
                }
                else {
                    let fnString = this._stringify(this.run);
                    this._url = self.URL.createObjectURL(new Blob([fnString], { type: 'text/javascript' }));
                }
                this._worker = new Worker(this._url);
                this._worker.onmessage = e => {
                    let d = e.data;
                    if (d.cmd == 'CLOSE') {
                        this.terminate();
                    }
                    else if (d.cmd.startsWith('#')) {
                        let fnName = d.cmd.slice(1);
                        this[fnName].apply(this, d.data);
                    }
                    else {
                        this._bus.fire('message', [d.data]);
                    }
                };
                this._worker.onerror = e => {
                    JSLogger.error(e, `Thread<${this.id}> run error!`);
                    this._bus.fire('error', [e.message]);
                    this.terminate();
                };
                return this;
            }
            terminate() {
                if (this.isDestroyed())
                    return this;
                if (this._worker)
                    this._worker.terminate();
                if (this._url)
                    window.URL.revokeObjectURL(this._url);
                this._state = ThreadState.TERMINATED;
                this._worker = null;
                this._url = null;
                return this;
            }
            destroy() {
                setTimeout(() => {
                    this.terminate();
                    this._state = ThreadState.DESTROYED;
                    this._bus.destroy();
                }, 100);
            }
            isDestroyed() {
                return this._state == 'DESTROYED';
            }
            on(e, fn) {
                this._bus.on(e, fn);
                return this;
            }
            off(e) {
                this._bus.off(e);
                return this;
            }
            _warn(act) {
                JSLogger.warn(`Cannot ${act} from Thread<id=${this.id};state=${this._state}>!`);
                return this;
            }
            postThread(data, transfer) {
                if (this._state != 'RUNNING')
                    return this._warn('post data');
                if (this._worker)
                    this._worker.postMessage.apply(this._worker, Check.isEmpty(transfer) ? [data] : [data].concat(transfer));
                return this;
            }
            static initContext() {
                if (self.imports)
                    return self;
                self.imports = this._defines['imports'];
                self.onposted = this._defines['onposted'];
                self.postMain = this._defines['postMain'];
                self.callMain = this._defines['callMain'];
                self.terminate = this._defines['terminate'];
                return self;
            }
        };
        Thread._defines = {
            imports: function (...urls) {
                urls.forEach(u => {
                    importScripts(self.URI.toAbsoluteURL(u));
                });
            },
            onposted: function (fn) {
                self.addEventListener('message', function (e) {
                    fn.call(self, e.data);
                }, false);
            },
            postMain: function (data) {
                self.postMessage({ cmd: 'DATA', data: data }, null);
            },
            callMain: function (fnName, ...args) {
                self.postMessage({ cmd: '#' + fnName, data: Array.prototype.slice.call(arguments, 1) }, null);
            },
            terminate: function () {
                self.postMessage({ cmd: 'CLOSE' }, null);
            }
        };
        Thread = Thread_1 = __decorate([
            klass('JS.lang.Thread'),
            __metadata("design:paramtypes", [Object, Object])
        ], Thread);
        lang.Thread = Thread;
    })(lang = JS.lang || (JS.lang = {}));
})(JS || (JS = {}));
var Thread = JS.lang.Thread;
var ThreadState = JS.lang.ThreadState;
var JS;
(function (JS) {
    let store;
    (function (store) {
        class StoreHelper {
            static toString(value) {
                if (Types.isUndefined(value))
                    return 'undefined';
                if (Types.isNull(value))
                    return 'null';
                if (Types.isString(value))
                    return JSON.stringify(['string', value]);
                if (Types.isArray(value))
                    return JSON.stringify(['array', JSON.stringify(value)]);
                if (Types.isBoolean(value))
                    return JSON.stringify(['boolean', value]);
                if (Types.isNumber(value))
                    return JSON.stringify(['number', value]);
                if (Types.isDate(value))
                    return JSON.stringify(['date', '' + value.valueOf()]);
                if (Types.isJsonObject(value))
                    return JSON.stringify(['json', JSON.stringify(value)]);
            }
            static parse(data) {
                if (Type.null == data)
                    return null;
                if (Type.undefined == data)
                    return undefined;
                let [type, val] = JSON.parse(data), v = val;
                switch (type) {
                    case Type.object:
                        v = JSON.parse(val);
                        break;
                    case Type.array:
                        v = JSON.parse(val);
                        break;
                    case Type.number:
                        v = Number(val);
                        break;
                    case Type.boolean:
                        v = Boolean(val);
                        break;
                    case Type.date:
                        v = new Date(val);
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
    let store;
    (function (store) {
        class CookieStore {
            static get(key) {
                let reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)", "gi"), data = reg.exec(document.cookie), str = data ? window['unescape'](data[2]) : null;
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
                document.cookie = key + '=' + window['escape']('' + store.StoreHelper.toString(value)) + '; path=' + p + '; expires=' + exp + domain;
            }
            ;
            static remove(key) {
                let date = new Date();
                date.setTime(date.getTime() - 10000);
                document.cookie = key + "=; expire=" + date.toUTCString();
            }
            ;
            static clear() {
                document.cookie = '';
            }
            ;
        }
        CookieStore.EXPIRES_DATETIME = 'Wed, 15 Apr 2099 00:00:00 GMT';
        CookieStore.PATH = '/';
        CookieStore.DOMAIN = self.document ? document.domain : null;
        store.CookieStore = CookieStore;
    })(store = JS.store || (JS.store = {}));
})(JS || (JS = {}));
var CookieStore = JS.store.CookieStore;
var JS;
(function (JS) {
    let store;
    (function (store) {
        class LocalStore {
            static get(key) {
                let str = localStorage.getItem(key);
                if (!str)
                    return undefined;
                return store.StoreHelper.parse(str);
            }
            ;
            static set(key, value) {
                localStorage.setItem(key, store.StoreHelper.toString(value));
            }
            ;
            static remove(key) {
                localStorage.removeItem(key);
            }
            ;
            static key(i) {
                return localStorage.key(i);
            }
            ;
            static size() {
                return localStorage.length;
            }
            ;
            static clear() {
                localStorage.clear();
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
        class SessionStore {
            static get(key) {
                let str = sessionStorage.getItem(key);
                if (!str)
                    return undefined;
                return store.StoreHelper.parse(str);
            }
            ;
            static set(key, value) {
                sessionStorage.setItem(key, store.StoreHelper.toString(value));
            }
            ;
            static remove(key) {
                sessionStorage.removeItem(key);
            }
            ;
            static key(i) {
                return sessionStorage.key(i);
            }
            ;
            static size() {
                return sessionStorage.length;
            }
            ;
            static clear() {
                sessionStorage.clear();
            }
            ;
        }
        store.SessionStore = SessionStore;
    })(store = JS.store || (JS.store = {}));
})(JS || (JS = {}));
var SessionStore = JS.store.SessionStore;
var JS;
(function (JS) {
    let ui;
    (function (ui) {
        class CustomElement extends HTMLElement {
            constructor(cfg) {
                super();
                this._config = cfg;
                cfg.onConstructor.apply(this, this._config);
            }
            connectedCallback() {
                this._config.onCreated.apply(this);
            }
            disconnectedCallback() {
                this._config.onDestroyed.apply(this);
            }
            adoptedCallback() {
                this._config.onAdopted.apply(this);
            }
            attributeChangedCallback(attrName, oldVal, newVal) {
                this._config.onAttributeChanged.apply(this, [attrName, oldVal, newVal]);
            }
            static define(config) {
                customElements.define(config.tagName, CustomElement, { extends: config.extendsTagName });
                return CustomElement.prototype;
            }
        }
        ui.CustomElement = CustomElement;
    })(ui = JS.ui || (JS.ui = {}));
})(JS || (JS = {}));
var CustomElement = JS.ui.CustomElement;
var JS;
(function (JS) {
    let ui;
    (function (ui) {
        class FormView extends ui.View {
            reset() {
                this.eachWidget((w) => {
                    if (w.reset)
                        w.reset();
                });
                return this;
            }
            clear() {
                this.eachWidget((w) => {
                    if (w.clear)
                        w.clear();
                });
                return this;
            }
            iniValues(values, render) {
                if (arguments.length == 0) {
                    let vals = {};
                    this.eachWidget((w) => {
                        if (w.iniValue)
                            vals[w.id] = w.iniValue();
                    });
                    return vals;
                }
                else {
                    if (values) {
                        Jsons.forEach(values, (val, id) => {
                            let w = this._widgets[id];
                            if (w && w.iniValue)
                                w.iniValue(val, render);
                        });
                    }
                    else {
                        this.eachWidget((w) => {
                            if (w.iniValue)
                                w.iniValue(null, render);
                        });
                    }
                }
                return this;
            }
            validate(id) {
                let wgts = this._widgets;
                if (Check.isEmpty(wgts))
                    return true;
                if (!id) {
                    let ok = true;
                    Jsons.forEach(wgts, (wgt) => {
                        if (this._validateWidget(wgt) !== true)
                            ok = false;
                    });
                    return ok;
                }
                return this._validateWidget(this._widgets[id]);
            }
            _validateWidget(wgt) {
                if (!wgt || !wgt.validate)
                    return true;
                return wgt.validate() === true;
            }
            getModel() {
                return this._model;
            }
            values(values) {
                if (arguments.length == 1) {
                    this._model.setData(values);
                    return this;
                }
                else {
                    let d = {};
                    this.eachWidget(w => {
                        if (w.value && w.isEnabled()) {
                            d[w.name()] =
                                w.isCrud && w.isCrud() ? w.crudValue() : w.value();
                        }
                    });
                    return d;
                }
            }
            _render() {
                if (this._config) {
                    let cfg = this._config;
                    Jsons.forEach(cfg.widgetConfigs, (config, id) => {
                        config['valueModel'] = this._model || this._config.valueModel;
                        let wgt = this._newWidget(id, config, cfg.defaultConfig);
                        if (wgt && wgt.valueModel && !this._model)
                            this._model = wgt.valueModel();
                        this.addWidget(wgt);
                    });
                    if (this._model) {
                        this._model.on('validated', (e, result, data) => {
                            this._fire('validated', [result, data]);
                        });
                        this._model.on('dataupdated', (e, newData, oldData) => {
                            this._fire('dataupdated', [newData, oldData]);
                        });
                    }
                }
            }
        }
        ui.FormView = FormView;
    })(ui = JS.ui || (JS.ui = {}));
})(JS || (JS = {}));
var FormView = JS.ui.FormView;
var JS;
(function (JS) {
    let ui;
    (function (ui) {
        class PageView extends ui.View {
            load(api) {
                return this.getWidget(this._config.id).load(api);
            }
            reload() {
                this.getWidget(this._config.id).reload();
                return this;
            }
            _render() {
                if (this._config) {
                    this._fire('widgetiniting', [this._config.klass, this._config]);
                    let wgt = Class.aliasInstance(this._config.klass, this._config);
                    this._fire('widgetinited', [wgt]);
                    this._model = wgt.dataModel();
                    this._model.on('dataupdated', (e, data) => {
                        this._fire('dataupdated', [data]);
                    });
                    this.addWidget(wgt);
                }
            }
        }
        ui.PageView = PageView;
    })(ui = JS.ui || (JS.ui = {}));
})(JS || (JS = {}));
var PageView = JS.ui.PageView;
var JS;
(function (JS) {
    let ui;
    (function (ui) {
        class SimpleView extends ui.View {
            _render() {
                if (this._config) {
                    let cfg = this._config;
                    Jsons.forEach(cfg.widgetConfigs, (config, id) => {
                        this.addWidget(this._newWidget(id, config, cfg.defaultConfig));
                    });
                }
            }
        }
        ui.SimpleView = SimpleView;
    })(ui = JS.ui || (JS.ui = {}));
})(JS || (JS = {}));
var SimpleView = JS.ui.SimpleView;
var JS;
(function (JS) {
    let util;
    (function (util) {
        class Templator {
            constructor() {
                this._hb = Handlebars.create();
            }
            compile(tpl, options) {
                return this._hb.compile(tpl, options);
            }
            registerHelper(name, fn) {
                this._hb.registerHelper(name, fn);
            }
            unregisterHelper(name) {
                this._hb.unregisterHelper(name);
            }
            static safeString(s) {
                return new Handlebars.SafeString(s);
            }
        }
        util.Templator = Templator;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Templator = JS.util.Templator;
var JS;
(function (JS) {
    let ui;
    (function (ui) {
        class TemplateView extends ui.View {
            constructor() {
                super(...arguments);
                this._model = new ListModel();
            }
            initialize() {
                this._engine = new Templator();
                let me = this;
                this._model.on('dataupdated', function (e, newData, oldData) {
                    me._config.data = this.getData();
                    me.render();
                    me._fire('dataupdated', [newData, oldData]);
                });
            }
            data(data) {
                this._model.setData(data);
            }
            load(api) {
                return this._model.load(api);
            }
            _render() {
                let cfg = this._config;
                if (cfg && cfg.data && cfg.container && cfg.tpl) {
                    let html = this._engine.compile(cfg.tpl)(cfg.data), ctr = $1(cfg.container);
                    ctr.off().html('').html(html);
                    let wConfigs = cfg.widgetConfigs;
                    if (!Check.isEmpty(wConfigs))
                        ctr.findAll('[jsfx-alias]').forEach((el) => {
                            let realId = $1(el).attr('id'), prefixId = realId.replace(/(\d)*/g, '');
                            this.addWidget(this._newWidget(realId, wConfigs[prefixId], cfg.defaultConfig));
                        });
                }
            }
        }
        ui.TemplateView = TemplateView;
    })(ui = JS.ui || (JS.ui = {}));
})(JS || (JS = {}));
var TemplateView = JS.ui.TemplateView;
var JS;
(function (JS) {
    let unit;
    (function (unit) {
        let TestCase = class TestCase {
            constructor(name) {
                this._count = 0;
                this._methods = {};
                this.name = name || this.className;
                this._addTestMethods();
            }
            getName() {
                return this.name;
            }
            setUp() {
            }
            tearDown() {
            }
            countTests() {
                return this._count;
            }
            _createResult() {
                return new unit.TestResult();
            }
            run(result) {
                let rst = result ? result : this._createResult();
                rst.run(this);
                return rst;
            }
            runMethod(name) {
                let ept = null;
                this.setUp();
                try {
                    this._methods[name].invoke(this);
                }
                catch (e) {
                    ept = e;
                }
                finally {
                    try {
                        this.tearDown();
                    }
                    catch (e2) {
                        if (ept == null)
                            ept = e2;
                    }
                }
                if (ept != null)
                    throw ept;
            }
            getTestMethods() {
                return this._methods;
            }
            _addTestMethods() {
                let methods = this.getClass().methods();
                methods.forEach(m => {
                    if (!m.isStatic && m.name.startsWith('test')) {
                        this.addTestMethod(m);
                    }
                });
            }
            addTestMethod(method) {
                this._methods[method.name] = method;
                this._count++;
            }
        };
        TestCase = __decorate([
            klass('JS.unit.TestCase'),
            __metadata("design:paramtypes", [String])
        ], TestCase);
        unit.TestCase = TestCase;
    })(unit = JS.unit || (JS.unit = {}));
})(JS || (JS = {}));
var TestCase = JS.unit.TestCase;
var JS;
(function (JS) {
    let unit;
    (function (unit) {
        class TestFailure {
            constructor(failed, error) {
                this._method = failed;
                this._error = error;
            }
            failedMethod() {
                return this._method;
            }
            thrownError() {
                return this._error;
            }
            isFailure() {
                return this.thrownError() instanceof AssertError;
            }
        }
        unit.TestFailure = TestFailure;
    })(unit = JS.unit || (JS.unit = {}));
})(JS || (JS = {}));
var TestFailure = JS.unit.TestFailure;
var JS;
(function (JS) {
    let unit;
    (function (unit) {
        class TestResult {
            constructor() {
                this._fails = {};
                this._errors = {};
                this._failCount = 0;
                this._errorCount = 0;
                this._listeners = [];
                this._isStoped = false;
                this._runCount = 0;
            }
            isSuccessTestMethod(methodName, caseName) {
                let name = `${caseName}.${methodName}`;
                return (this._errors[name] || this._fails[name]) ? false : true;
            }
            errors() {
                return this._errors;
            }
            failures() {
                return this._fails;
            }
            runCount() {
                return this._runCount;
            }
            shouldStop() {
                return this._isStoped;
            }
            addListener(listener) {
                this._listeners.push(listener);
            }
            removeListener(listener) {
                this._listeners.remove(it => {
                    return it == listener;
                });
            }
            addError(e, method, test) {
                this._errors[test.getName() + '.' + method.name] = new unit.TestFailure(method, e);
                this._errorCount++;
                this._listeners.forEach(li => {
                    li.addError(e, method, test);
                });
            }
            addFailure(e, method, test) {
                this._fails[test.getName() + '.' + method.name] = new unit.TestFailure(method, e);
                this._failCount++;
                this._listeners.forEach(li => {
                    li.addFailure(e, method, test);
                });
            }
            endTest(method, test) {
                this._listeners.forEach(li => {
                    li.endTest(method, test);
                });
            }
            startTest(method, test) {
                this._runCount++;
                this._listeners.forEach(li => {
                    li.startTest(method, test);
                });
            }
            stop() {
                this._isStoped = true;
            }
            failureCount() {
                return this._failCount;
            }
            errorCount() {
                return this._errorCount;
            }
            wasSuccessful() {
                return this.failureCount() == 0 && this.errorCount() == 0;
            }
            run(test) {
                let methods = test.getTestMethods();
                Jsons.forEach(methods, (m, name) => {
                    this.startTest(m, test);
                    try {
                        test.runMethod(name);
                    }
                    catch (e) {
                        if (e instanceof AssertError) {
                            this.addFailure(e, m, test);
                        }
                        else if (e instanceof Error) {
                            this.addError(e, m, test);
                        }
                    }
                    this.endTest(m, test);
                });
            }
        }
        unit.TestResult = TestResult;
    })(unit = JS.unit || (JS.unit = {}));
})(JS || (JS = {}));
var TestResult = JS.unit.TestResult;
var JS;
(function (JS) {
    let unit;
    (function (unit) {
        var TestSuite_1;
        let TestSuite = TestSuite_1 = class TestSuite {
            constructor(name) {
                this._cases = [];
                if (Types.isString(name)) {
                    this._name = name;
                }
                else {
                    this.addTest(name);
                }
                this._addTestMethods();
                this._name = this._name || this.className;
            }
            getTestCases() {
                return this._cases;
            }
            getName() {
                return this._name;
            }
            countTests() {
                let count = 0;
                this._cases.forEach(tc => {
                    count += tc.countTests();
                });
                return count;
            }
            run(result) {
                this._cases.some(t => {
                    if (result.shouldStop())
                        return true;
                    this.runTest(t, result);
                });
            }
            runTest(test, result) {
                test.run(result);
            }
            addTest(test) {
                if (!test)
                    return;
                if (Types.isArray(test)) {
                    test.forEach(clazz => {
                        this._addTest(clazz);
                    });
                }
                else {
                    this._addTest(test);
                }
            }
            _addTest(test) {
                if (!test)
                    return;
                if (Types.ofKlass(test, TestSuite_1)) {
                    this._cases = this._cases.concat(test.getTestCases());
                }
                else if (Types.ofKlass(test, unit.TestCase)) {
                    this._cases[this._cases.length] = test;
                }
                else if (Types.subClass(test, TestSuite_1.class)) {
                    this._cases = this._cases.concat(Class.newInstance(test.name).getTestCases());
                }
                else if (Types.subClass(test, unit.TestCase.class)) {
                    this._cases[this._cases.length] = Class.newInstance(test.name);
                }
            }
            _addTestMethods() {
                let methods = this.getClass().methods(), tc = null;
                methods.forEach(m => {
                    if (!m.isStatic && m.name.startsWith('test')) {
                        if (tc == null)
                            tc = new unit.TestCase(this.className);
                        tc.addTestMethod(m);
                    }
                });
                if (tc)
                    this._cases.push(tc);
            }
        };
        TestSuite = TestSuite_1 = __decorate([
            klass('JS.unit.TestSuite'),
            __metadata("design:paramtypes", [Object])
        ], TestSuite);
        unit.TestSuite = TestSuite;
    })(unit = JS.unit || (JS.unit = {}));
})(JS || (JS = {}));
var TestSuite = JS.unit.TestSuite;
var JS;
(function (JS) {
    let unit;
    (function (unit) {
        class TestUI {
            constructor(runner) {
                this._startTime = 0;
                this._COLORS = {
                    'red': 'firebrick', 'green': 'forestgreen', 'current': 'black'
                };
                this._FLAGS = {
                    'red': '✘ ', 'green': '✔ ', 'current': '▸ '
                };
                $1('#btnRun').off().on('click', () => {
                    runner.doRun();
                });
                $1('#btnStop').off().on('click', () => {
                    runner.doStop();
                });
            }
            addError() {
                $1('#errors').html(this._result.errorCount() + '');
            }
            addFailure() {
                $1('#failures').html(this._result.failureCount() + '');
            }
            endTest(method, test) {
                let p = this._result.runCount() / this._suite.countTests() * 100, pro = $1('#progress');
                pro.style.width = p + '%';
                pro.style.backgroundColor = this._result.isSuccessTestMethod(method.name, test.getName()) ? 'forestgreen' : 'firebrick';
                pro.attr('title', this._result.runCount() + '/' + this._suite.countTests());
                this._renderOption(`${test.getName()}.${method.name}`, this._result.isSuccessTestMethod(method.name, test.getName()) ? 'green' : 'red');
            }
            startTest(method, test) {
                $1('#runs').html(this._result.runCount() + '/' + this._suite.countTests());
                this._renderOption(`${test.getName()}.${method.name}`, 'current');
            }
            endSuite() {
                let time = Number((System.highResTime() - this._startTime) / 1000).round(6);
                $1('#info').html(`All tests was completed in ${time} seconds.`);
                $1('#progress').style.backgroundColor = this._result.wasSuccessful() ? 'forestgreen' : 'firebrick';
                $1('#btnRun').removeAttribute('disabled');
            }
            startSuite(suite, result) {
                this._suite = suite;
                this._result = result;
                this._init(suite);
                $1('#btnRun').attr('disabled', 'disabled');
                this._startTime = System.highResTime();
            }
            _renderOption(testName, type) {
                let option = $1('#tests').querySelector(`option[value="${testName}"]`);
                option.style.color = this._COLORS[type];
                option.textContent = this._FLAGS[type] + option.attr('rawText');
            }
            _addOption(optgroup, text, value) {
                let txt = Strings.escapeHTML(text);
                optgroup['append'](`<option rawText="${txt}" value="${value ? value : ''}">${txt}</option>`);
            }
            _printTrace(testName) {
                $1('#trace').off().html('');
                let failure = this._result.errors()[testName] || this._result.failures()[testName];
                if (!failure)
                    return;
                let error = failure.thrownError();
                this._addOption($1('#trace'), `${failure.isFailure() ? 'AssertError' : error.name}: ${error.message}`);
                let stack = error.stack;
                if (stack) {
                    stack.split('\n').forEach((line, index) => {
                        if (index > 0)
                            this._addOption($1('#trace'), line);
                    });
                }
            }
            _printTestCase(tc) {
                let tests = $1('#tests'), optgroup = document.createElement('optgroup'), methods = tc.getTestMethods();
                Jsons.forEach(methods, (m) => {
                    this._addOption(optgroup, m.name, `${tc.getName()}.${m.name}`);
                });
                tests['append'](optgroup.attr('label', '▷ ' + tc.getName()));
            }
            _init(suite) {
                let sys = System.info();
                $1('#env').html(`${sys.device.type} / ${sys.os.name} ${sys.os.version || ''} / ${sys.browser.name} ${sys.browser.version || ''}`);
                $1('#info').html('');
                let pro = $1('#progress'), sty = pro.style;
                sty.width = '0%';
                sty.backgroundColor = 'forestgreen';
                pro.attr('title', '');
                $1('#runs').html('0/0');
                $1('#errors').html('0');
                $1('#failures').html('0');
                $1('#trace').off().html('');
                let tests = $1('#tests'), cases = suite.getTestCases();
                tests.off().html('');
                cases.forEach(tc => {
                    this._printTestCase(tc);
                });
                let me = this;
                tests.on('change', function () {
                    let testName = this.find('option:checked').attr('value');
                    me._printTrace(testName);
                });
            }
        }
        unit.TestUI = TestUI;
    })(unit = JS.unit || (JS.unit = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let unit;
    (function (unit) {
        class TestRunner {
            constructor() {
                this._ui = new JS.unit.TestUI(this);
            }
            doRun(test) {
                this._suite = (!test || Types.isKlass(test, unit.TestSuite) ? test : new unit.TestSuite(test)) || this._suite;
                this._result = new unit.TestResult();
                this._result.addListener(this._ui);
                this._ui.startSuite(this._suite, this._result);
                this._suite.run(this._result);
                this._ui.endSuite();
                return this._result;
            }
            doStop() {
                this._result.stop();
            }
            static addTests(tests) {
                tests.forEach(test => {
                    this._test.addTest(test);
                });
            }
            static run(test) {
                let runner = new TestRunner();
                return runner.doRun(test || this._test);
            }
            static load(url, tests) {
                let urls = typeof url == 'string' ? [url] : url, tasks = [];
                urls.forEach(u => {
                    tasks.push(Promises.newPlan(Dom.loadJS, [u]));
                });
                Promises.order(tasks).then(() => {
                    if (tests)
                        this.addTests(tests);
                    this.run();
                });
            }
        }
        TestRunner._test = new unit.TestSuite();
        unit.TestRunner = TestRunner;
    })(unit = JS.unit || (JS.unit = {}));
})(JS || (JS = {}));
var TestRunner = JS.unit.TestRunner;
var JS;
(function (JS) {
    let util;
    (function (util) {
        class ClipBoard {
            static copyTarget(clicker, target) {
                this._do('copy', clicker, target);
            }
            static cutTarget(clicker, target) {
                this._do('cut', clicker, target);
            }
            static _do(action, clicker, target) {
                util.Bom.ready(() => {
                    let cli = util.Dom.$1(clicker), tar = util.Dom.$1(target);
                    if (!cli || !tar)
                        throw new Errors.NotFoundError('The clicker or target not found!');
                    cli.attr('data-clipboard-action', action);
                    cli.attr('data-clipboard-target', '#' + tar.attr('id'));
                    new ClipboardJS('#' + cli.attr('id'));
                });
            }
            static copyText(clicker, text) {
                util.Bom.ready(() => {
                    let cli = util.Dom.$1(clicker);
                    if (cli)
                        throw new Errors.NotFoundError('The clicker not found!');
                    cli.attr('data-clipboard-text', text);
                    new ClipboardJS('#' + cli.attr('id'));
                });
            }
        }
        util.ClipBoard = ClipBoard;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var ClipBoard = JS.util.ClipBoard;
var JS;
(function (JS) {
    let util;
    (function (util) {
        var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        class Random {
            static number(range, isInt) {
                let num = 0, min = 0, max = 1;
                if (util.Types.isNumber(range)) {
                    max = range;
                }
                else {
                    min = range.min || 0;
                    max = range.max;
                }
                num = Math.random() * (max - min) + min;
                return isInt ? Number(num).toInt() : num;
            }
            static string(len, chars) {
                return this._string(chars ? chars.split('') : CHARS, len);
            }
            static uuid(len, radix) {
                return this._string(CHARS, len, radix);
            }
            static _string(chars, len, radix) {
                var uuid = [], i;
                radix = radix || chars.length;
                if (len) {
                    for (i = 0; i < len; i++)
                        uuid[i] = chars[0 | Math.random() * radix];
                }
                else {
                    var r;
                    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                    uuid[14] = '4';
                    for (i = 0; i < 36; i++) {
                        if (!uuid[i]) {
                            r = 0 | Math.random() * 16;
                            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                        }
                    }
                }
                return uuid.join('');
            }
        }
        util.Random = Random;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Random = JS.util.Random;
var JS;
(function (JS) {
    let util;
    (function (util) {
        class Timer {
            constructor() {
                this._timerId = null;
                this._counter = 0;
                this._state = 'NEW';
                this._opts = {
                    cycle: false,
                    wait: 0,
                    interval: 0,
                };
            }
            restart() {
                this.stop();
                if (this._ticker)
                    this.start(this._ticker);
            }
            suspend() {
                if (this._state == 'WAITING' || this._state == 'RUNNING') {
                    this._state = 'BLOCKED';
                    return true;
                }
                return false;
            }
            stop() {
                this._state = 'TERMINATED';
                this._counter = 0;
                if (this._timerId)
                    window.clearTimeout(this._timerId);
                this._timerId = null;
            }
            getState() {
                return this._state;
            }
            _cycle(skip) {
                if (this._state != 'RUNNING')
                    return;
                this._counter++;
                let time = skip ? undefined : this._ticker.call(this, this._counter), max = this._opts.cycle;
                if (this._counter < max) {
                    this._timerId = setTimeout(() => { this._cycle(time < 0); }, util.Types.isNumber(time) ? (time < 0 ? 0 : time) : this._opts.interval);
                }
                else {
                    this.stop();
                }
            }
            start(ticker, opts) {
                if (ticker)
                    this._ticker = ticker;
                if (opts)
                    this._opts = util.Jsons.union(this._opts, opts);
                this._state = 'WAITING';
                if (this._opts.cycle === false) {
                    this._timerId = window.setTimeout(() => {
                        this._state = 'RUNNING';
                        this._ticker.call(this, ++this._counter);
                        this.stop();
                    }, this._opts.wait);
                }
                else {
                    this._timerId = window.setTimeout(() => {
                        this._state = 'RUNNING';
                        this._cycle();
                    }, this._opts.wait);
                }
            }
            startOne(ticker, wait) {
                this.start(ticker, { cycle: false, wait: wait });
            }
            startForever(ticker, opts) {
                this.start(ticker, util.Jsons.union({ cycle: Infinity }, opts));
            }
            startAtDate(ticker, date, opts) {
                let now = new Date(), diff = date.getTime() - now.getTime();
                if (diff < 0)
                    return;
                opts = opts || {};
                opts.wait = diff;
                this.start(ticker, opts);
            }
        }
        util.Timer = Timer;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Timer = JS.util.Timer;
