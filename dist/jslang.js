//# sourceURL=../dist/jslang.js
//JSDK 2.7.0 MIT
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
            Type["json"] = "json";
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
        }, _is = function (a, s) {
            return toString.call(a) === `[object ${s}]`;
        }, _isKlass = function (obj) {
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
        }, _superklass = (klass) => {
            if (Object === klass)
                return null;
            let sup = Object.getPrototypeOf(klass);
            return Object.getPrototypeOf(Object) === sup ? Object : sup;
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
            static isArrayLike(obj) {
                if (this.isString(obj))
                    return false;
                let l = obj && obj['length'] || null;
                return typeof l == 'number' && l >= 0 && l <= Number.MAX_SAFE_INTEGER;
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
            static isTypedArray(value) {
                return value && this.isNumber(value.length) && /^\[object (?:Uint8|Uint8Clamped|Uint16|Uint32|Int8|Int16|Int32|Float32|Float64)Array]$/.test(toString.call(value));
            }
            static isElement(el) {
                return el && typeof el === 'object' && (el.nodeType === 1 || el.nodeType === 9);
            }
            static isWindow(el) {
                return el != null && el === el.window;
            }
            static isKlass(obj, klass) {
                if (!this.ofKlass(obj, klass))
                    return false;
                return obj.constructor && obj.constructor === klass;
            }
            static ofKlass(obj, klass) {
                return obj instanceof klass;
            }
            static equalKlass(kls, klass) {
                if (!_isKlass(kls))
                    return false;
                return klass ? (kls === klass) : true;
            }
            static subklassOf(kls1, kls2) {
                if (kls2 === Object || kls1 === kls2)
                    return true;
                let superXls = _superklass(kls1);
                while (superXls != null) {
                    if (superXls === kls2)
                        return true;
                    superXls = _superklass(superXls);
                }
                return false;
            }
            static type(obj) {
                if (obj === null)
                    return Type.null;
                let type = typeof obj;
                if (type == 'number' || type == 'bigint')
                    return Type.number;
                if (type == 'object') {
                    if (this.isJsonObject(obj))
                        return Type.json;
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
        let N = Number, _test = function (s, exp) {
            return s && exp.test(s.trim());
        }, EMAIL = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@([A-Za-z0-9]+(?:-[A-Za-z0-9]+)?\.)+[A-Za-z0-9]+(?:-[A-Za-z0-9]+)?$/, EMAIL_DOMAIN = /^@([A-Za-z0-9]+(?:-[A-Za-z0-9]+)?\.)+[A-Za-z0-9]+(?:-[A-Za-z0-9]+)?$/, YYYY_MM_DD = /^(\d{1,4})(-|\/)(\d{1,2})(-|\/)(\d{1,2})$/, HALFWIDTH_CHARS = /^[\u0000-\u00FF]+$/, FULLWIDTH_CHARS = /^[\u0391-\uFFE5]+$/, NUMBERS_ONLY = /^\d+$/, LETTERS_ONLY = /^[A-Za-z]+$/, LETTERS_OR_NUMBERS = /^[A-Za-z\d]+$/, ENGLISH_ONLY = /^[A-Za-z\d\s\`\~\!\@\#\$\%\^\&\*\(\)\_\-\+\=\[\]\{\}\|\:\;\"\'\<\>\,\.\?\\\/]+$/, CHINESE_ONLY = /^[\u4E00-\u9FA5]+$/, IP = /^(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5])$/;
        class Check {
            static isEmpty(v) {
                return v == void 0
                    || v === ''
                    || (v.hasOwnProperty('length') && v.length == 0)
                    || Check.isEmptyObject(v);
            }
            static isEmptyObject(v) {
                var name;
                for (name in v) {
                    return false;
                }
                return true;
            }
            static isBlank(s) {
                return s == void 0 || s.trim() === '';
            }
            static isFormatDate(s, format) {
                return _test(s, format || YYYY_MM_DD);
            }
            static isEmail(s, exp) {
                return _test(s, exp ? exp : EMAIL);
            }
            static isEmails(s, exp) {
                s = s || '';
                if (this.isBlank(s))
                    return false;
                return s.split(/;|\s+/).every(as => {
                    return as.length == 0 || this.isEmail(as, exp);
                });
            }
            static isEmailDomain(str) {
                return _test(str, EMAIL_DOMAIN);
            }
            static isOnlyNumber(str) {
                return _test(str, NUMBERS_ONLY);
            }
            static isPositive(n) {
                return N(n).isPositive();
            }
            static isNegative(n) {
                return N(n).isNegative();
            }
            static isHalfwidthChars(str) {
                return _test(str, HALFWIDTH_CHARS);
            }
            static isFullwidthChars(str) {
                return _test(str, FULLWIDTH_CHARS);
            }
            static isEnglishOnly(str) {
                return _test(str, ENGLISH_ONLY);
            }
            static isChineseOnly(str) {
                return _test(str, CHINESE_ONLY);
            }
            static isFormatNumber(n, iLength, fLength) {
                if (!util.Types.isNumeric(n))
                    return false;
                let num = N(n), iLen = num.integerLength(), dLen = num.fractionLength();
                if (iLen > iLength)
                    return false;
                if (util.Types.isDefined(fLength) && dLen > fLength)
                    return false;
                return true;
            }
            static greater(n1, n2) {
                return N(n1) > N(n2);
            }
            static greaterEqual(n1, n2) {
                return N(n1) >= N(n2);
            }
            static less(n1, n2) {
                return N(n1) < N(n2);
            }
            static lessEqual(n1, n2) {
                return N(n1) <= N(n2);
            }
            static isBetween(n, min, max) {
                let num = N(n);
                return num > N(min) && num < N(max);
            }
            static shorter(s, len) {
                return s && s.length < len;
            }
            static longer(s, len) {
                return s && s.length > len;
            }
            static equalLength(s, len) {
                return s && s.length == len;
            }
            static isLettersOnly(s) {
                return _test(s, LETTERS_ONLY);
            }
            static isLettersOrNumbers(s) {
                return _test(s, LETTERS_OR_NUMBERS);
            }
            static isIP(s) {
                return _test(s.trim(), IP);
            }
            static isExistUrl(url) {
                let xhr = new XMLHttpRequest();
                return new Promise(function (resolve, reject) {
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState == 4)
                            xhr.status == 200 ? resolve(true) : reject(false);
                    };
                    xhr.open('HEAD', url, true);
                    xhr.send();
                });
            }
            static isPattern(s, exp) {
                return _test(s, exp);
            }
            static byServer(req, judge) {
                return new Promise(function (resolve, reject) {
                    Http.send(req).then(res => {
                        judge.apply(null, [res]) ? resolve(true) : reject(false);
                    });
                });
            }
        }
        util.Check = Check;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Check = JS.util.Check;
(function () {
    var AP = Array.prototype;
    AP.add = function (obj, from) {
        let m = this;
        if (obj == void 0)
            return m;
        let a = obj instanceof Array ? obj : [obj], i = from == void 0 ? m.length : (from < 0 ? 0 : from);
        AP.splice.apply(m, [i, 0].concat(a));
        return m;
    };
    AP.remove = function (f) {
        let i = typeof f === 'number' ? f : this.findIndex(f);
        if (i < 0 || i >= this.length)
            return false;
        this.splice(i, 1);
        return true;
    };
}());
var JS;
(function (JS) {
    let util;
    (function (util) {
        let E = util.Check.isEmpty, AS = Array.prototype.slice;
        class Arrays {
            static newArray(a, from) {
                return a == void 0 ? [] : AS.apply(a, [from == void 0 ? 0 : from]);
            }
            static toArray(a) {
                return a == void 0 ? [] : (util.Types.isArray(a) ? a : [a]);
            }
            static equal(a1, a2, eq) {
                if (a1 === a2)
                    return true;
                let y1 = E(a1), y2 = E(a2);
                if (y1 && y2)
                    return true;
                if (y1 !== y2)
                    return false;
                if (a1.length != a2.length)
                    return false;
                return a1.every((item1, i) => {
                    return eq ? eq(item1, a2[i], i) : item1 === a2[i];
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
            static same(a1, a2, eq) {
                if (a1 === a2 || (E(a1) && E(a2)))
                    return true;
                if (a1.length != a2.length)
                    return false;
                let na = a2.slice(), fail = a1.some(t1 => {
                    let r = na.remove(t2 => {
                        return eq ? eq(t1, t2) : t1 === t2;
                    });
                    return !r;
                });
                if (fail)
                    return false;
                return na.length == 0;
            }
            static slice(args, fromIndex, endIndex) {
                return AS.apply(args, [fromIndex || 0, endIndex || args.length]);
            }
        }
        util.Arrays = Arrays;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Arrays = JS.util.Arrays;
var JS;
(function (JS) {
    let util;
    (function (util) {
        let R = false, W = self;
        class Bom {
            static ready(fn) {
                if (R) {
                    fn();
                    return;
                }
                let D = document, callback = function () {
                    R = true;
                    fn();
                    callback = null;
                };
                let wc = W['HTMLImports'] && W['HTMLImports'].whenReady;
                if (wc)
                    return wc(callback);
                if (D.readyState === "complete") {
                    setTimeout(callback, 1);
                }
                else if (D.addEventListener) {
                    D.addEventListener("DOMContentLoaded", callback, false);
                    W.addEventListener("load", callback, false);
                }
                else {
                    D['attachEvent']("onreadystatechange", callback);
                    W['attachEvent']("onload", callback);
                    var top = false;
                    try {
                        top = (W.frameElement == null && D.documentElement) ? true : false;
                    }
                    catch (e) { }
                    if (top && top['doScroll']) {
                        (function doScrollCheck() {
                            if (!R) {
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
                let D = document, fnName = D['mozCancelFullScreen'] ? 'mozCancelFullScreen' : (D['webkitCancelFullScreen'] ? 'webkitCancelFullScreen' : 'exitFullscreen');
                if (D[fnName])
                    D[fnName]();
            }
        }
        util.Bom = Bom;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Bom = JS.util.Bom;
var JS;
(function (JS) {
    let util;
    (function (util) {
        let _num = (s) => {
            let n = parseFloat(s);
            return n.isNaN() ? 0 : n;
        };
        class CssTool {
            static isHEX(a) {
                return /^#[0-9A-F]{3,8}$/i.test(a);
            }
            static isRGB(a) {
                return /^rgb/.test(a);
            }
            static isHSL(a) {
                return /^hsl/.test(a);
            }
            static isColor(a) {
                return this.isHEX(a) || this.isRGB(a) || this.isHSL(a);
            }
            static rgb2hex(r, g, b, a) {
                let s = [r, g, b];
                if (a != void 0)
                    s.push(Number((a * 255).integralPart()));
                return '#' + s.map(x => {
                    let h = x.toString(16);
                    return h.length === 1 ? '0' + h : h;
                }).join('');
            }
            static hex2rgb(hex) {
                if (!this.isHEX(hex))
                    return null;
                let a = false, h = hex.slice(hex.startsWith('#') ? 1 : 0), l = h.length;
                if (l == 4 || l == 8)
                    a = true;
                if (l == 3 || l == 4)
                    h = [...h].map(x => x + x).join('');
                let n = parseInt(h, 16);
                return {
                    r: (n >>> (a ? 24 : 16)),
                    g: ((n & (a ? 0x00ff0000 : 0x00ff00)) >>> (a ? 16 : 8)),
                    b: ((n & (a ? 0x0000ff00 : 0x0000ff)) >>> (a ? 8 : 0)),
                    a: a ? Number((n & 0x000000ff) / 255).round(2) : 1
                };
            }
            static rgbString(c) {
                if (!c)
                    return '';
                let has = c.a != void 0;
                return `rgb${has ? 'a' : ''}(${c.r},${c.g},${c.b}${has ? `,${c.a}` : ''})`;
            }
            static toTRGB(s) {
                if (s.startsWith('rgba(')) {
                    let r = /^rgba\((.+),(.+),(.+),(.+)\)$/.exec(s);
                    if (r)
                        return {
                            r: Number(r[1]),
                            g: Number(r[2]),
                            b: Number(r[3]),
                            a: Number(r[4])
                        };
                }
                else if (s.startsWith('rgb(')) {
                    let r = /^rgb\((.+),(.+),(.+)\)$/.exec(s);
                    if (r)
                        return {
                            r: Number(r[1]),
                            g: Number(r[2]),
                            b: Number(r[3])
                        };
                }
                return null;
            }
            static convertToRGB(val) {
                if (this.isHEX(val))
                    return this.hex2rgb(val);
                if (this.isHSL(val))
                    return this.hsl2rgb(val);
                return this.toTRGB(val);
            }
            static hslString(c) {
                if (!c)
                    return '';
                let has = c.a != void 0;
                return `hsl(${c.h},${(c.s * 100).round(2)}%,${(c.l * 100).round(2)}%${has ? `,${c.a}` : ''})`;
            }
            static hsl2rgb(hsl) {
                if (!this.isHSL(hsl))
                    return null;
                let hsla = this.toTHSL(hsl), h = hsla.h, s = hsla.s, l = hsla.l, r, g, b;
                if (s == 0) {
                    r = g = b = l;
                }
                else {
                    var hue2rgb = (p, q, t) => {
                        if (t < 0)
                            t += 1;
                        if (t > 1)
                            t -= 1;
                        if (t < 1 / 6)
                            return p + (q - p) * 6 * t;
                        if (t < 1 / 2)
                            return q;
                        if (t < 2 / 3)
                            return p + (q - p) * (2 / 3 - t) * 6;
                        return p;
                    };
                    var q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
                    r = hue2rgb(p, q, h + 1 / 3);
                    g = hue2rgb(p, q, h);
                    b = hue2rgb(p, q, h - 1 / 3);
                }
                return {
                    r: Math.round(r * 255),
                    g: Math.round(g * 255),
                    b: Math.round(b * 255),
                    a: hsla.a
                };
            }
            static rgb2hsl(rgb) {
                if (!rgb)
                    return null;
                let r = rgb.r, g = rgb.g, b = rgb.b;
                r /= 255, g /= 255, b /= 255;
                var max = Math.max(r, g, b), min = Math.min(r, g, b), h, s, l = (max + min) / 2;
                if (max == min) {
                    h = s = 0;
                }
                else {
                    var d = max - min;
                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                    switch (max) {
                        case r:
                            h = (g - b) / d + (g < b ? 6 : 0);
                            break;
                        case g:
                            h = (b - r) / d + 2;
                            break;
                        case b:
                            h = (r - g) / d + 4;
                            break;
                    }
                    h /= 6;
                }
                return {
                    h: h,
                    s: s,
                    l: l,
                    a: rgb.a
                };
            }
            static hyphenCase(name) {
                return name.replace(/([A-Z])/g, (a, b) => { return '-' + b.toLowerCase(); });
            }
            static numberOf(val) {
                return util.Types.isNumber(val) ? val : _num(val);
            }
            static unitOf(val) {
                if (val == void 0 || util.Types.isNumber(val))
                    return '';
                let split = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(val);
                return split ? split[1] : '';
            }
            static calcValue(v, baseVal) {
                if (!v)
                    return baseVal + '';
                if (v.indexOf(',') > 0 || v.indexOf(' ') > 0)
                    return v;
                let u = this.unitOf(v) || this.unitOf(baseVal) || 'px';
                if (v.startsWith('+=') || v.startsWith('-=')) {
                    let ov = this.numberOf(baseVal), nv = _num(v.replace('=', ''));
                    return ov + nv + u;
                }
                else if (v.startsWith('*=')) {
                    let ov = this.numberOf(baseVal), nv = _num(v.replace('*=', ''));
                    return ov * nv + u;
                }
                return parseFloat(v).isNaN() ? v : (_num(v) + u);
            }
            static normValue(v, df, du) {
                if (v == void 0)
                    return df;
                return util.Types.isNumber(v) ? (v + (du === undefined ? 'px' : (du || ''))) : v;
            }
        }
        CssTool.toTHSL = (h) => {
            var hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(h) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(h);
            return {
                h: parseInt(hsl[1], 10) / 360,
                s: parseInt(hsl[2], 10) / 100,
                l: parseInt(hsl[3], 10) / 100,
                a: parseFloat(hsl[4]) || 1
            };
        };
        util.CssTool = CssTool;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var CssTool = JS.util.CssTool;
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
            static isLeapYear(y) {
                return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
            }
            static getDaysOfMonth(m, y) {
                y = y || new Date().getFullYear();
                return [31, (this.isLeapYear(y) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m];
            }
            static getFirstDayOfMonth(d) { return d.clone().set({ day: 1 }); }
            static getLastDayOfMonth(d) {
                return d.clone().set({ day: Dates.getDaysOfMonth(d.getMonth(), d.getFullYear()) });
            }
            static getDayOfWeek(d, dayOfWeek) {
                let d2 = dayOfWeek != void 0 ? dayOfWeek : 1, d1 = d.getDay();
                if (d2 == 0)
                    d2 = 7;
                if (d1 == 0)
                    d1 = 7;
                return d.clone().add((d2 - d1) % 7, 'd');
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
    var D = Date, $P = D.prototype, pad = function (s, l) {
        new D();
        if (!l) {
            l = 2;
        }
        return ("000" + s).slice(l * -1);
    };
    $P.getWeek = function () {
        let date0 = new D(this.getFullYear(), 0, 1), diff = Math.round((this.valueOf() - date0.valueOf()) / 86400000);
        return Math.ceil((diff + ((date0.getDay() + 1) - 1)) / 7);
    };
    $P.setWeek = function (week, dayOfWeek) {
        let dw = Types.isDefined(dayOfWeek) ? dayOfWeek : 1;
        return this.setTime(Dates.getDayOfWeek(this, dw).add(week - this.getWeek(), 'w').getTime());
    };
    $P.clone = function () { return new D(this.getTime()); };
    $P.setZeroTime = function () {
        let T = this;
        T.setHours(0);
        T.setMinutes(0);
        T.setSeconds(0);
        T.setMilliseconds(0);
        return T;
    };
    $P.setLastTime = function () {
        let T = this;
        T.setHours(23);
        T.setMinutes(59);
        T.setSeconds(59);
        T.setMilliseconds(999);
        return T;
    };
    $P.setNowTime = function () {
        let T = this, n = new D();
        T.setHours(n.getHours());
        T.setMinutes(n.getMinutes());
        T.setSeconds(n.getSeconds());
        T.setMilliseconds(n.getMilliseconds());
        return T;
    };
    $P.equals = function (d, p = 'ms') {
        let T = this;
        if (p == 'ms')
            return T.diff(d) == 0;
        if (p == 's')
            return T.getSeconds() == d.getSeconds();
        if (p == 'm')
            return T.getMinutes() == d.getMinutes();
        if (p == 'h')
            return T.getHours() == d.getHours();
        if (p == 'y')
            return T.getFullYear() == d.getFullYear();
        if (p == 'M')
            return T.getMonth() == d.getMonth();
        if (p == 'd')
            return T.getFullYear() == d.getFullYear() && T.getMonth() == d.getMonth() && T.getDate() == d.getDate();
        if (p == 'w')
            return T.getWeek() == d.getWeek();
        return false;
    };
    $P.between = function (start, end) { return this.diff(start) >= 0 && this.diff(end) <= 0; };
    $P.isAfter = function (d) { return this.diff(d) > 0; };
    $P.isBefore = function (d) { return this.diff(d) < 0; };
    $P.isToday = function () { return this.equals(new D(), 'd'); };
    $P.add = function (v, type) {
        let T = this;
        if (v == 0)
            return T;
        switch (type) {
            case 'ms': {
                T.setMilliseconds(T.getMilliseconds() + v);
                return T;
            }
            case 's': {
                return T.add(v * 1000, 'ms');
            }
            case 'm': {
                return T.add(v * 60000, 'ms');
            }
            case 'h': {
                return T.add(v * 3600000, 'ms');
            }
            case 'd': {
                T.setDate(T.getDate() + v);
                return T;
            }
            case 'w': {
                return T.add(v * 7, 'd');
            }
            case 'M': {
                var n = T.getDate();
                T.setDate(1);
                T.setMonth(T.getMonth() + v);
                T.setDate(Math.min(n, Dates.getDaysOfMonth(T.getMonth(), T.getFullYear())));
                return T;
            }
            case 'y': {
                return T.add(v * 12, 'M');
            }
        }
        return T;
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
    let vt = function (n, min, max) {
        if (!Types.isDefined(n)) {
            return false;
        }
        else if (n < min || n > max) {
            throw new RangeError(n + ' is not a valid value');
        }
        return true;
    };
    $P.set = function (config) {
        let T = this;
        if (vt(config.millisecond, 0, 999)) {
            T.add(config.millisecond - T.getMilliseconds(), 'ms');
        }
        if (vt(config.second, 0, 59)) {
            T.add(config.second - T.getSeconds(), 's');
        }
        if (vt(config.minute, 0, 59)) {
            T.add(config.minute - T.getMinutes(), 'm');
        }
        if (vt(config.hour, 0, 23)) {
            T.add(config.hour - T.getHours(), 'h');
        }
        if (vt(config.day, 1, Dates.getDaysOfMonth(T.getMonth(), T.getFullYear()))) {
            T.add(config.day - T.getDate(), 'd');
        }
        if (vt(config.week, 0, 53)) {
            T.setWeek(config.week);
        }
        if (vt(config.month, 0, 11)) {
            T.add(config.month - T.getMonth(), 'M');
        }
        if (vt(config.year, 0, 9999)) {
            T.add(config.year - T.getFullYear(), 'y');
        }
        if (config.timezoneOffset) {
            T.setTimezoneOffset(config.timezoneOffset);
        }
        return T;
    };
    $P.diff = function (date) {
        return this - (date || new D());
    };
    $P.format = function (format, locale) {
        let T = this, fmt = format || 'YYYY-MM-DD HH:mm:ss', i18n = new I18N(locale).set(Dates.I18N_RESOURCE);
        return fmt.replace(/YYYY|YY|MMMM|MMM|MM|M|DD|D|hh|h|HH|H|mm|m|ss|s|dddd|ddd|A/g, function (m) {
            switch (m) {
                case "YYYY":
                    return pad(T.getFullYear(), 4);
                case "YY":
                    return pad(T.getFullYear());
                case "MMMM":
                    return i18n.get('MONTH_NAMES')[T.getMonth()];
                case "MMM":
                    return i18n.get('MONTH_SHORT_NAMES')[T.getMonth()];
                case "MM":
                    return pad((T.getMonth() + 1));
                case "M":
                    return T.getMonth() + 1;
                case "DD":
                    return pad(T.getDate());
                case "D":
                    return T.getDate();
                case "hh":
                    {
                        let h = T.getHours();
                        return pad(h < 13 ? (h === 0 ? 12 : h) : (h - 12));
                    }
                case "h":
                    {
                        let h = T.getHours();
                        return h < 13 ? (h === 0 ? 12 : h) : (h - 12);
                    }
                case "HH":
                    return pad(T.getHours());
                case "H":
                    return T.getHours();
                case "mm":
                    return pad(T.getMinutes());
                case "m":
                    return T.getMinutes();
                case "ss":
                    return pad(T.getSeconds());
                case "s":
                    return T.getSeconds();
                case "dddd":
                    return i18n.get('WEEK_DAY_NAMES')[T.getDay()];
                case "ddd":
                    return i18n.get('WEEK_DAY_SHORT_NAMES')[T.getDay()];
                case "A":
                    return i18n.get(T.getHours() < 12 ? 'AM' : 'PM');
                default:
                    return m;
            }
        });
    };
}());
if (self['HTMLElement'])
    (function () {
        const D = document, HP = HTMLElement.prototype, oa = HP.append, op = HP.prepend, or = HP.remove, _ad = function (html) {
            if (!html)
                return;
            let div = D.createElement('div'), nodes = null, fg = D.createDocumentFragment();
            div.innerHTML = html;
            nodes = div.childNodes;
            for (let i = 0, len = nodes.length; i < len; i++) {
                fg.appendChild(nodes[i].cloneNode(true));
            }
            this.appendChild(fg);
            nodes = null;
            fg = null;
        }, _pd = function (html) {
            if (!html)
                return;
            let div = D.createElement('div'), nodes = null, fg = D.createDocumentFragment();
            div.innerHTML = html;
            nodes = div.childNodes;
            for (let i = 0, len = nodes.length; i < len; i++) {
                fg.appendChild(nodes[i].cloneNode(true));
            }
            this.insertBefore(fg, this.firstChild);
            nodes = null;
            fg = null;
        };
        HP.append = function (...nodes) {
            nodes.forEach(n => {
                typeof n == 'string' ? _ad.call(this, n) : oa.call(this, n.cloneNode(true));
            });
        };
        HP.prepend = function (...nodes) {
            nodes.forEach(n => {
                typeof n == 'string' ? _pd.call(this, n) : op.call(this, n);
            });
        };
        HP.box = function () {
            let box = this.computedStyle();
            return {
                x: parseFloat(box.left) + System.display().docScrollX,
                y: parseFloat(box.top) + System.display().docScrollY,
                w: parseFloat(box.width),
                h: parseFloat(box.height)
            };
        };
        HP.attr = function (key, val) {
            if (arguments.length == 1)
                return this.getAttribute(key);
            this.setAttribute(key, val);
            return this;
        };
        let _on = function (type, fn, opts) {
            if (!this['_bus'])
                this['_bus'] = new EventBus(this);
            let bus = this['_bus'], cb = e => {
                bus.fire(e);
            }, once = (opts && opts['once']) ? true : false;
            bus.on(type, fn, once);
            if (this.addEventListener)
                this.addEventListener(type, cb, opts);
        };
        HP.on = function (type, fn, opts) {
            let types = type.split(' ');
            types.forEach(t => {
                _on.call(this, t, fn, opts);
            });
            return this;
        };
        let _rm = function (type, fn, opts) {
            if (!fn)
                return;
            if (this.removeEventListener)
                this.removeEventListener(type, fn, opts || false);
        }, _rms = function (type, fns, opts) {
            if (fns)
                fns.forEach(f => { _rm.call(this, type, f, opts); });
        }, _off = function (type, fn, opts) {
            let bus = this['_bus'];
            if (bus) {
                let oFn = fn ? bus.original(type, fn['euid']) : undefined;
                bus.off(type, oFn);
                _rm.call(this, type, oFn, opts);
            }
            else {
                _rm.call(this, type, fn, opts);
            }
        };
        HP.off = function (type, fn, capture) {
            if (!type) {
                let bus = this['_bus'];
                if (bus) {
                    let types = bus.types();
                    for (let i = 0, len = types.length; i < len; i++) {
                        let ty = types[i];
                        _rms.call(this, ty, bus.original(ty), capture);
                    }
                    bus.off();
                }
            }
            else {
                let types = type.split(' ');
                types.forEach(t => {
                    _off.call(this, t, fn, capture);
                });
            }
            return this;
        };
        HP.find = HP.querySelector;
        HP.findAll = HP.querySelectorAll;
        HP.computedStyle = function (p) {
            return document.defaultView.getComputedStyle(this, p || null);
        };
        let _getV = function () {
            if (this instanceof HTMLTextAreaElement) {
                return this.value || '';
            }
            else if (this instanceof HTMLInputElement) {
                if (this.type == 'checkbox') {
                    let chks = document.getElementsByName(this.name);
                    if (chks.length > 0) {
                        let a = [];
                        [].forEach.call(chks, function (chk) {
                            if (chk.checked)
                                a.push(chk.value);
                        });
                        return a;
                    }
                    return this.checked ? [this.value] : [];
                }
                if (this.type == 'radio') {
                    let rds = document.getElementsByName(this.name);
                    if (rds.length > 0) {
                        for (let i = 0, l = rds.length; i < l; i++) {
                            let rd = rds.item(i);
                            if (rd.checked)
                                return rd.value;
                        }
                        return null;
                    }
                    return this.checked ? this.value : null;
                }
                return this.value || '';
            }
            else if (this instanceof HTMLSelectElement) {
                let opts = this.findAll('option:checked');
                if (opts.length > 0) {
                    let a = [];
                    for (let i = 0, l = opts.length; i < l; i++) {
                        let opt = opts.item(i);
                        if (this.multiple) {
                            if (opt.selected)
                                a.push(opt.value);
                        }
                        else {
                            if (opt.selected)
                                return opt.value;
                        }
                    }
                    return a;
                }
                return [];
            }
            return undefined;
        }, _setV = function (v) {
            if (this instanceof HTMLTextAreaElement) {
                this.value = v || '';
            }
            else if (this instanceof HTMLInputElement) {
                if (this.type == 'checkbox') {
                    let chks = document.getElementsByName(this.name), vs = v;
                    if (chks.length > 0) {
                        [].forEach.call(chks, function (chk) {
                            chk.checked = vs.indexOf(chk.value) > -1;
                        });
                    }
                    else {
                        if (vs.indexOf(this.value) > -1)
                            this.checked = true;
                    }
                    return this;
                }
                if (this.type == 'radio') {
                    let rds = document.getElementsByName(this.name);
                    if (rds.length > 0) {
                        for (let i = 0, l = rds.length; i < l; i++) {
                            let rd = rds.item(i);
                            if (v == rd.value) {
                                rd.checked = true;
                                return this;
                            }
                        }
                    }
                    else {
                        if (v == this.value)
                            this.checked = true;
                    }
                    return this;
                }
                this.value = v;
            }
            else if (this instanceof HTMLSelectElement) {
                let opts = this.findAll('option'), vs = typeof v == 'string' ? [v] : v;
                if (opts.length > 0) {
                    for (let i = 0, l = opts.length; i < l; i++) {
                        let opt = opts.item(i);
                        opt.selected = vs.indexOf(opt.value) > -1;
                    }
                }
            }
            return this;
        };
        HP.val = function (v) {
            return arguments.length == 0 ? _getV.call(this) : _setV.call(this, v);
        };
        let setCssValue = (el, k, v) => {
            let st = el.style;
            if (v === undefined) {
                st.removeProperty(CssTool.hyphenCase(k));
            }
            else if (v != null) {
                let w = v + '';
                st.setProperty(CssTool.hyphenCase(k), CssTool.calcValue(w, el.css(k)), w.endsWith(' !important') ? 'important' : '');
            }
        };
        HP.css = function (name, val) {
            if (arguments.length == 1) {
                if (typeof name == 'string') {
                    let key = CssTool.hyphenCase(name);
                    return this.style.getPropertyValue(key) || this.computedStyle().getPropertyValue(key);
                }
                else {
                    let s = '';
                    Jsons.forEach(name, (v, k) => {
                        if (v != void 0)
                            s += `${CssTool.hyphenCase(k)}:${CssTool.calcValue(v, this.style.getPropertyValue(k))};`;
                    });
                    this.style.cssText += s;
                }
            }
            else {
                setCssValue(this, name, val);
            }
            return this;
        };
        HP.empty = function (s) {
            let chs = this.findAll(s || '*');
            if (chs.length > 0)
                [].forEach.call(chs, function (node) {
                    if (node.nodeType == 1)
                        node.off().remove();
                });
            return this;
        };
        HP.remove = function (s) {
            this.empty.call(this, s);
            if (!s)
                or.call(this.off());
        };
        let DP = Document.prototype;
        DP.on = HP.addEventListener;
        DP.off = HP.removeEventListener;
        let WP = Window.prototype;
        WP.on = HP.addEventListener;
        WP.off = HP.removeEventListener;
    })();
var JS;
(function (JS) {
    let util;
    (function (util) {
        let D;
        if (self['HTMLElement'])
            D = document;
        class Dom {
            static $1(selector) {
                return typeof selector == 'string' ? D.querySelector(selector) : selector;
            }
            static $L(selector) {
                return D.querySelectorAll(selector);
            }
            static rename(node, newTagName) {
                let newNode = D.createElement(newTagName), aNames = node['getAttributeNames']();
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
                return Promises.create(function () {
                    let doc = typeof html == 'string' ? new DOMParser().parseFromString(html, 'text/html') : html, url = doc.URL, el = Dom.$1(appendTo || D.body);
                    el.append.apply(el, doc.body.childNodes);
                    let ignoreCss = ignore === true || (ignore && ignore.css) ? true : false;
                    if (!ignoreCss) {
                        let cssFiles = doc.querySelectorAll('link[rel=stylesheet]');
                        if (cssFiles) {
                            for (let i = 0, len = cssFiles.length; i < len; i++) {
                                let css = cssFiles[i], href = css.getAttribute('href');
                                if (href)
                                    Loader.css(href, false);
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
                                sc.src ? (sc.async ? Loader.js(sc.src, true) : syncs.push(Loader.js(sc.src, false))) : eval(sc.text);
                            }
                            Promises.order(syncs).then(() => {
                                back();
                            }).catch((u) => {
                                JSLogger.error('Load inner script fail: ' + u + '\n; parent html:' + url);
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
            static loadHTML(url, async, opts) {
                if (!url)
                    return Promise.reject(null);
                return Promises.create(function () {
                    Http.get({
                        responseType: 'html',
                        url: url,
                        cache: false,
                        async: async
                    }).then((res) => {
                        let fn = opts && opts.prehandle;
                        Dom.applyHtml(fn ? fn(res.data) : res.data, opts && opts.appendTo, opts && opts.ignore).then(() => { this.resolve(url); });
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
    let util;
    (function (util) {
        let EUID = 1, E = util.Check.isEmpty;
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
                    if (!E(fns)) {
                        fns.remove(fn => {
                            return fn['euid'] === h['euid'];
                        });
                        this._map.set(type, fns);
                    }
                }
            }
            _removeByEuid(type, euid) {
                let fns = this._map.get(type);
                if (!E(fns)) {
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
            original(type, euid) {
                let fns = this._map.get(type);
                if (arguments.length >= 1) {
                    if (!E(fns)) {
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
                return Array.from(this._map.keys());
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
            _call(e, fn, args, that) {
                let evt = e['originalEvent'] ? e['originalEvent'] : e, arr = [evt];
                if (args && args.length > 0)
                    arr = arr.concat(args);
                let rst = fn.apply(that || this._ctx, arr);
                if (rst === false) {
                    evt.stopPropagation();
                    evt.preventDefault();
                }
            }
            fire(e, args, that) {
                let is = util.Types.isString(e), fns = this._map.get(is ? e : e.type);
                if (!E(fns)) {
                    let evt = is ? new CustomEvent(e) : e;
                    fns.forEach(fn => { this._call(evt, fn, args, that); });
                }
            }
        }
        util.EventBus = EventBus;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var EventBus = JS.util.EventBus;
var JS;
(function (JS) {
    let util;
    (function (util) {
        class FileTypes {
        }
        FileTypes.CODES = 'c,h,cpp,ini,idl,hpp,hxx,hp,hh,cxx,cc,s,asm,log,bak,' +
            'as,ts,js,json,xml,html,htm,xhtml,xht,css,md,mkd,markdown,' +
            'java,properties,jsp,vm,ftl,' +
            'swift,m,mm,' +
            'cgi,sh,applescript,bat,sql,rb,py,php,php3,php4,' +
            'p,pp,pas,dpr,cls,frm,vb,bas,vbs,' +
            'cs,config,asp,aspx,' +
            'yaml,vhd,vhdl,cbl,cob,coffee,clj,lisp,lsp,cl,jl,el,erl,groovy,less,lua,go,ml,pl,pm,al,perl,r,scala,st,tcl,tk,itk,v,y,d,' +
            'xq,xql,xqm,xqy,xquery';
        FileTypes.IMAGES = 'pic,jpg,jpeg,png,gif,bmp,webp,tif,tiff,svg,wbmp,tga,pcx,ico,psd,ai';
        FileTypes.DOCS = 'md,markdown,msg,eml,txt,rtf,pdf,doc,docx,csv,xls,xlsx,ppt,pptx,wps';
        FileTypes.ZIPS = 'zip,7z,z,bz2,gz,tar,taz,tgz,rar,arj,lzh';
        FileTypes.VIDEOS = 'mp4,rm,rmvb,mpg,mpeg,mpg4,avi,dv,3gpp,asf,asx,wmv,qt,mov,ogv,flv,mkv,webm';
        FileTypes.AUDIOS = 'ogg,wav,mpga,mp2,mp3,au,snd,mid,midi,ra,ram,aif,aiff,webm';
        util.FileTypes = FileTypes;
        let FileSizeUnit;
        (function (FileSizeUnit) {
            FileSizeUnit["B"] = "B";
            FileSizeUnit["KB"] = "KB";
            FileSizeUnit["MB"] = "MB";
            FileSizeUnit["GB"] = "GB";
            FileSizeUnit["TB"] = "TB";
        })(FileSizeUnit = util.FileSizeUnit || (util.FileSizeUnit = {}));
        class Files {
            static getFileName(path) {
                let pos = path.lastIndexOf('/');
                if (pos < 0)
                    return path;
                return path.slice(pos + 1);
            }
            static getFileType(path) {
                let pos = path.lastIndexOf('.');
                if (pos < 0)
                    return '';
                return path.slice(pos + 1);
            }
            static isFileType(path, exts) {
                if (!path || !exts)
                    return false;
                let ext = this.getFileType(path);
                return ext ? (exts.toLowerCase() + ',').indexOf(ext + ',') >= 0 : false;
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
                let unit = sizeUnit || FileSizeUnit.B, TC = this.convertSize;
                if (!byte)
                    return '0' + unit;
                let kb = TC(byte, unit, FileSizeUnit.KB);
                if (kb == 0)
                    return '0' + unit;
                if (kb < 1)
                    return byte + 'B';
                let mb = TC(byte, unit, FileSizeUnit.MB);
                if (mb < 1)
                    return kb + 'KB';
                let gb = TC(byte, unit, FileSizeUnit.GB);
                if (gb < 1)
                    return mb + 'MB';
                let tb = TC(byte, unit, FileSizeUnit.TB);
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
var FileSizeUnit = JS.util.FileSizeUnit;
var Files = JS.util.Files;
var FileTypes = JS.util.FileTypes;
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
        class I18N {
            constructor(lc) {
                this._d = {};
                this.locale(lc);
            }
            _load(lc, prefix, suffix) {
                let lang = util.Locales.lang(lc), country = util.Locales.country(lc);
                if (country) {
                    let rst = this._loadJson(`${prefix}_${lang}_${country}.${suffix}`);
                    if (rst)
                        return true;
                }
                if (lang) {
                    let rst = this._loadJson(`${prefix}_${lang}.${suffix}`);
                    if (rst)
                        return true;
                }
                return this._loadJson(`${prefix}.${suffix}`);
            }
            _loadJson(u) {
                let xhr = new XMLHttpRequest();
                xhr.open('GET', u, false);
                xhr.responseType = 'json';
                xhr.send();
                if (xhr.status != 200)
                    return false;
                this.set(xhr.response);
                return true;
            }
            load(url, locale) {
                let T = this, lc = locale || T._lc, pos = url.lastIndexOf('.'), suffix = pos < 0 ? '' : url.slice(pos + 1), prefix = pos < 0 ? url : url.slice(0, pos);
                return T._load(lc, prefix, suffix);
            }
            get(k) {
                if (arguments.length == 0)
                    return this._d;
                return k && this._d ? this._d[k] : undefined;
            }
            getKeys() {
                return Reflect.ownKeys(this._d);
            }
            hasKey(k) {
                return this._d.hasOwnProperty(k);
            }
            locale(lc) {
                if (arguments.length == 0)
                    return this._lc;
                this._lc = lc || System.info().locale;
                return this;
            }
            set(d) {
                let T = this;
                d = d || {};
                if (d.hasOwnProperty(T._lc)) {
                    this._d = d[T._lc];
                }
                else {
                    let lang = util.Locales.lang(T._lc);
                    this._d = d.hasOwnProperty(lang) ? d[lang] : d;
                }
                return this;
            }
        }
        util.I18N = I18N;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var I18N = JS.util.I18N;
var JS;
(function (JS) {
    let util;
    (function (util) {
        class Images {
            static parseFrames(frames) {
                let frs = [], items = frames.items, isA = util.Types.isArray(items), len = isA ? items.length : items.total;
                for (let i = 0; i < len; i++) {
                    let x, y;
                    if (isA) {
                        x = items[0];
                        y = items[1];
                    }
                    else {
                        let offs = items, axis = offs.axis, sign = axis.startsWith('-') ? -1 : 1;
                        x = axis.endsWith('x') ? (offs.ox + sign * i * (frames.w + (offs.split || 0))) : offs.ox;
                        y = axis.endsWith('y') ? (offs.oy + sign * i * (frames.h + (offs.split || 0))) : offs.oy;
                    }
                    frs.push({
                        src: frames.src,
                        w: frames.w,
                        h: frames.h,
                        x: x,
                        y: y
                    });
                }
                return frs;
            }
        }
        util.Images = Images;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Images = JS.util.Images;
var JS;
(function (JS) {
    let util;
    (function (util) {
        let A = Array, Y = util.Types, E = util.Check.isEmpty;
        class Jsons {
            static parse(text, reviver) {
                return text ? JSON.parse(text, reviver) : null;
            }
            static stringify(value, replacer, space) {
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
                if (obj instanceof A) {
                    copy = [];
                    for (var i = 0, len = obj.length; i < len; ++i) {
                        copy[i] = this.clone(obj[i]);
                    }
                    return copy;
                }
                if (Y.isJsonObject(obj)) {
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
                return json && key != void 0 && json.hasOwnProperty(key);
            }
            static values(json) {
                if (!json)
                    return null;
                let arr = [];
                this.forEach(json, v => {
                    arr[arr.length] = v;
                });
                return arr;
            }
            static keys(json) {
                if (!json)
                    return null;
                let keys = [];
                this.forEach(json, (v, k) => {
                    keys[keys.length] = k;
                });
                return keys;
            }
            static equalKeys(json1, json2) {
                let empty1 = E(json1), empty2 = E(json2);
                if (empty1 && empty2)
                    return true;
                if (empty1 || empty2)
                    return false;
                let map2 = this.clone(json2);
                this.forEach(json1, (v, k) => {
                    delete map2[k];
                });
                return E(map2);
            }
            static equal(json1, json2) {
                let empty1 = E(json1), empty2 = E(json2);
                if (empty1 && empty2)
                    return true;
                if (empty1 || empty2)
                    return false;
                let map2 = this.clone(json2);
                this.forEach(json1, (v, k) => {
                    if ((k in map2) && map2[k] === v)
                        delete map2[k];
                });
                return E(map2);
            }
            static replaceKeys(json, keyMapping, needClone) {
                if (!keyMapping)
                    return json;
                let clone = needClone ? this.clone(json) : json;
                this.forEach(clone, function (val, oldKey) {
                    let newKey = Y.isFunction(keyMapping) ? keyMapping.apply(clone, [val, oldKey]) : keyMapping[oldKey];
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
                if (typeof target !== "object" && !Y.isFunction(target)) {
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
                            if (deep && copy && (Y.isJsonObject(copy) ||
                                (copyIsArray = A.isArray(copy)))) {
                                if (copyIsArray) {
                                    copyIsArray = false;
                                    clone = src && A.isArray(src) ? src : [];
                                }
                                else {
                                    clone = src && Y.isJsonObject(src) ? src : {};
                                }
                                target[name] = this._union(deep, clone, copy);
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
                if (E(json1) || E(json2))
                    return json1;
                let newJson = {};
                this.forEach(json1, (v, k) => {
                    if (!json2.hasOwnProperty(k))
                        newJson[k] = v;
                });
                return newJson;
            }
            static intersect(json1, json2) {
                if (E(json1) || E(json2))
                    return json1;
                let newJson = {};
                this.forEach(json1, (v, k) => {
                    if (json2.hasOwnProperty(k))
                        newJson[k] = v;
                });
                return newJson;
            }
            static filter(json, fn) {
                let newJson = {};
                this.forEach(json, (v, k) => {
                    if (fn.apply(json, [v, k]))
                        newJson[k] = v;
                });
                return newJson;
            }
            static find(data, path) {
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
        let LEVELS = ['OFF', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE', 'ALL'], STYLES = [
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
                this._log(LEVELS[level], STYLES[level], data);
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
                this._appender = !appender ? new ConsoleAppender(name) : Reflect.construct(appender, name);
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
Konsole.text(`Powered by JSDK ${JS.version}`, 'font-weight:bold;');
(function () {
    var N = Number, $N = N.prototype;
    $N.stringify = function () {
        if (this.isNaN())
            return null;
        if (this.isZero())
            return '0';
        let t = this.toString(), m = t.match(/^(\+|\-)?(\d+)\.?(\d*)[Ee](\+|\-)(\d+)$/);
        if (!m)
            return t;
        let zhe = m[2], xiao = m[3], zhi = N(m[5]), fu = m[1] == '-' ? '-' : '', zfu = m[4], ws = (zfu == '-' ? -1 : 1) * zhi - xiao.length, n = zhe + xiao;
        if (ws == 0)
            return fu + n;
        if (ws > 0)
            return fu + n + Strings.padEnd('', ws, '0');
        let dws = n.length + ws;
        if (dws <= 0)
            return fu + '0.' + Strings.padEnd('', -1 * dws, '0') + n;
        return n.slice(0, dws - 1) + '.' + n.slice(dws);
    };
    $N.round = function (d) {
        if (this.isNaN() || this.isInt() || !N.isFinite(d))
            return N(this);
        let n = (!d || d < 0) ? 0 : d, pow = Math.pow(10, n);
        return Math.round(this * pow) / pow;
    };
    $N.toInt = function () {
        return this.round(0);
    };
    var f3 = (s) => {
        return s.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    };
    $N.format = function (dLen) {
        let d = dLen == void 0 || !Number.isFinite(dLen) ? this.fractionLength() : dLen, s = this.round(d).abs().stringify(), sign = this.isNegative() ? '-' : '';
        let sn = N(s);
        if (sn.isInt())
            return sign + f3(sn.toString()) + (d < 1 ? '' : '.' + Strings.padEnd('', d, '0'));
        let p = s.indexOf('.'), ints = s.slice(0, p), digs = s.slice(p + 1);
        return sign + f3(ints) + '.' + Strings.padEnd(digs, d, '0');
    };
    $N.equals = function (n, dLen) {
        if (this.isNaN())
            throw new TypeError('This number is NaN!');
        let num = N(n);
        if (num.isNaN())
            throw new TypeError('The compared number is NaN!');
        return this.round(dLen).valueOf() == num.round(dLen).valueOf();
    };
    $N.add = function (n) {
        const v = N(n);
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
        const v = N(n);
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
        const v = N(n);
        if (v.valueOf() == 0)
            return 0;
        if (this.isInt() && v.isInt())
            return v.valueOf() * this.valueOf();
        let s1 = this.stringify(this), s2 = v.stringify(), m1 = s1.indexOf('.') >= 0 ? s1.split(".")[1].length : 0, m2 = s2.indexOf('.') >= 0 ? s2.split(".")[1].length : 0, n1 = N(s1.replace('.', '')), n2 = N(s2.replace('.', ''));
        return n1 * n2 / Math.pow(10, m1 + m2);
    };
    $N.div = function (n) {
        if (this.valueOf() == 0)
            return 0;
        const v = N(n);
        if (v.valueOf() == 0)
            throw new ArithmeticError('Can not divide an Zero.');
        let s1 = this.stringify(), s2 = v.stringify(), m1 = s1.indexOf('.') >= 0 ? s1.split(".")[1].length : 0, m2 = s2.indexOf('.') >= 0 ? s2.split(".")[1].length : 0, n1 = N(s1.replace('.', '')), n2 = N(s2.replace('.', ''));
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
        let s = this.stringify();
        return s.slice(s.indexOf('.') + 1).length;
    };
    $N.integerLength = function () {
        if (this.isNaN())
            return 0;
        return this.abs().toFixed(0).length;
    };
    $N.fractionalPart = function () {
        if (this.isInt() || this.isNaN())
            return '';
        let s = this.stringify();
        return s.slice(s.indexOf('.') + 1);
    };
    $N.integralPart = function () {
        if (this.isNaN())
            return '';
        let s = this.stringify(), i = s.indexOf('.');
        if (i < 0)
            return s;
        return s.slice(0, i);
    };
}());
var JS;
(function (JS) {
    let util;
    (function (util) {
        let N = Number, _opt = function (v1, opt, v2) {
            var rst = null, v = N(v1);
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
                    return N(args[0]).valueOf();
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
                        exp = exp.replace(new RegExp(k, 'g'), N(n) + '');
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
var JS;
(function (JS) {
    let util;
    (function (util) {
        class Objects {
            static readwrite(obj, props, listeners) {
                let ps = typeof props == 'string' ? [props] : props, fs = listeners;
                ps.forEach(p => {
                    Object.defineProperty(obj, p, {
                        configurable: true,
                        enumerable: true,
                        writable: true,
                        get: () => {
                            return obj[p];
                        },
                        set: (val) => {
                            let oVal = obj[p];
                            if (fs && fs.changing)
                                fs.changing.call(obj, p, val, oVal);
                            obj[p] = val;
                            if (fs && fs.changed)
                                fs.changed.call(obj, p, val, oVal);
                        }
                    });
                });
            }
            static readonly(obj, props) {
                let ps = typeof props == 'string' ? [props] : props;
                ps.forEach(p => {
                    Object.defineProperty(obj, p, {
                        configurable: true,
                        enumerable: true,
                        writable: false
                    });
                });
            }
        }
        util.Objects = Objects;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Objects = JS.util.Objects;
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
                return this._str(chars ? chars.split('') : CHARS, len);
            }
            static uuid(len, radix) {
                return this._str(CHARS, len, radix);
            }
            static _str(chars, len, radix) {
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
                        if (v != void 0) {
                            if (util.Types.isBoolean(v)) {
                                if (v === true)
                                    a += ` ${k}`;
                            }
                            else {
                                a += ` ${k}="${v || ''}"`;
                            }
                        }
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
                            v = Number(v).stringify();
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
        let TimerState;
        (function (TimerState) {
            TimerState[TimerState["STOPPED"] = 0] = "STOPPED";
            TimerState[TimerState["RUNNING"] = 1] = "RUNNING";
            TimerState[TimerState["PAUSED"] = 2] = "PAUSED";
        })(TimerState = util.TimerState || (util.TimerState = {}));
        class Timer {
            constructor(task, cfg) {
                this._bus = new util.EventBus(this);
                this._sta = TimerState.STOPPED;
                this._ts = 0;
                this._et = 0;
                this._pt = 0;
                this._count = 0;
                this._task = task;
                this._config(cfg);
            }
            on(type, fn) {
                this._bus.on(type, fn);
                return this;
            }
            off(type, fn) {
                this._bus.off(type, fn);
                return this;
            }
            count() {
                return this._count;
            }
            _config(cfg) {
                this._cfg = util.Jsons.union({
                    delay: 0,
                    loop: 1,
                    interval: 0,
                    intervalMode: 'BF'
                }, this._cfg, cfg);
                let c = this._cfg;
                if (c.interval != void 0 && c.interval < 0)
                    c.interval = 0;
                let l = c.loop;
                l = l == false || l < 0 ? 0 : (l === true ? Infinity : l);
                c.loop = l;
                return this;
            }
            pause() {
                let m = this;
                if (!m.isRunning())
                    return m;
                m._bus.fire('pausing', [m._count + 1]);
                m._state(TimerState.PAUSED);
                m._pt = System.highResTime();
                m._bus.fire('paused', [m._count + 1]);
                return m;
            }
            _cancelTimer() {
                if (this._timer)
                    window.clearTimeout(this._timer);
                this._timer = null;
            }
            _reset() {
                let m = this;
                m._cancelTimer();
                m._state(TimerState.STOPPED);
                m._count = 0;
                m._ts0 = 0;
                m._ts = 0;
                m._et = 0;
                m._pt = 0;
            }
            stop() {
                this._finish();
                return this;
            }
            _finish() {
                this._reset();
                this._bus.fire('finished');
            }
            getState() {
                return this._sta;
            }
            isRunning() {
                return this.getState() == TimerState.RUNNING;
            }
            _state(s) {
                this._sta = s;
            }
            fps() {
                return this._et == 0 ? 0 : 1000 / this._et;
            }
            maxFPS() {
                let t = this._cfg.interval;
                return t == 0 ? Infinity : 1000 / t;
            }
            looped() {
                return this._count + 1;
            }
            _loopTask(skip) {
                if (!this.isRunning())
                    return;
                let T = this, p = T._cfg.loop;
                if (T._count < p) {
                    let t = 0, opts = T._cfg, t0 = System.highResTime();
                    T._et = t0 - T._ts;
                    if (!skip) {
                        T._bus.fire('looping', [T._count + 1]);
                        T._task.call(T, T._et);
                        T._bus.fire('looped', [T._count + 1]);
                        let t1 = System.highResTime();
                        t = t1 - t0;
                        ++T._count;
                    }
                    T._ts = t0;
                    let d = opts.interval - t, needSkip = opts.intervalMode == 'OF' && d < 0;
                    if (needSkip) {
                        T._loopTask(needSkip);
                    }
                    else {
                        T._timer = setTimeout(() => { T._loopTask(needSkip); }, opts.intervalMode == 'BF' ? opts.interval : d);
                    }
                }
                else {
                    T._finish();
                }
            }
            _start(begin) {
                this._loopTask(!begin);
            }
            start() {
                let T = this;
                if (this.isRunning())
                    return;
                let first = false, wait = T._cfg.delay;
                if (T.getState() == TimerState.PAUSED) {
                    wait = 0;
                    let dt = System.highResTime() - T._pt;
                    T._ts0 += dt;
                    T._ts += dt;
                    T._pt = 0;
                }
                else {
                    first = true;
                    T._reset();
                }
                T._state(TimerState.RUNNING);
                T._timer = setTimeout(() => {
                    if (first) {
                        this._ts0 = System.highResTime();
                        this._ts = this._ts0;
                        T._bus.fire('starting');
                    }
                    T._start(first);
                }, wait);
            }
        }
        util.Timer = Timer;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Timer = JS.util.Timer;
var TimerState = JS.util.TimerState;
var JS;
(function (JS) {
    let net;
    (function (net) {
        let Y = Types, J = Jsons, _judgeType = (t, dt) => {
            if (net.MIME.text == t)
                return 'text';
            if (net.MIME.html = t)
                return 'html';
            if (net.MIME.xml == t)
                return 'xml';
            if (net.MIME.json.indexOf(t) > -1)
                return 'json';
            return dt;
        }, _headers = (xhr) => {
            let headers = {}, hString = xhr.getAllResponseHeaders(), hRegexp = /([^\s]*?):[ \t]*([^\r\n]*)/mg, match = null;
            while ((match = hRegexp.exec(hString))) {
                headers[match[1]] = match[2];
            }
            return headers;
        }, _response = (req, xhr, error) => {
            let type = req.responseType, headers = _headers(xhr);
            if (!type && xhr.status > 0)
                type = _judgeType(headers['Content-Type'], type);
            return {
                request: req,
                url: xhr.responseURL,
                raw: xhr.response,
                type: type,
                data: xhr.response,
                status: xhr.status,
                statusText: error || (xhr.status == 0 ? 'error' : xhr.statusText),
                headers: headers,
                xhr: xhr
            };
        }, _parseResponse = function (res, req, xhr) {
            try {
                let raw = req.responseType == 'xml' ? xhr.responseXML : xhr.response, cvt = req.converts && req.converts[res.type];
                if (req.responseFilter)
                    raw = req.responseFilter(raw, res.type);
                res.data = cvt ? cvt(raw, res) : raw;
            }
            catch (e) {
                res.statusText = 'parseerror';
                if (req.error)
                    req.error(res);
                if (Http._ON['error'])
                    Http._ON['error'](res);
                this.reject(res);
            }
        }, _error = function (req, xhr, error) {
            let res = _response(req, xhr, error);
            if (req.error)
                req.error(res);
            if (Http._ON['error'])
                Http._ON['error'](res);
            this.reject(res);
        }, CACHE = {
            lastModified: {},
            etag: {}
        }, _done = function (oURL, req, xhr) {
            if (xhr['_isTimeout'])
                return;
            let status = xhr.status, isSucc = status >= 200 && status < 300 || status === 304, res = _response(req, xhr);
            if (isSucc) {
                let modified = null;
                if (req.ifModified) {
                    modified = xhr.getResponseHeader('Last-Modified');
                    if (modified)
                        CACHE.lastModified[oURL] = modified;
                    modified = xhr.getResponseHeader('etag');
                    if (modified)
                        CACHE.etag[oURL] = modified;
                }
                if (status === 204 || req.method === "HEAD") {
                    res.statusText = 'nocontent';
                }
                else if (status === 304) {
                    res.statusText = 'notmodified';
                }
                _parseResponse.call(this, res, req, xhr);
            }
            if (req.complete)
                req.complete(res);
            if (Http._ON['complete'])
                Http._ON['complete'](res);
            if (isSucc) {
                if (req.success)
                    req.success(res);
                if (Http._ON['success'])
                    Http._ON['success'](res);
                this.resolve(res);
            }
            else
                this.reject(res);
        }, _queryString = function (data) {
            if (Y.isString(data)) {
                return encodeURI(data);
            }
            else if (Y.isJsonObject(data)) {
                let str = '';
                J.forEach(data, (v, k) => {
                    str += `&${k}=${encodeURIComponent(v)}`;
                });
                return str;
            }
            return '';
        }, _queryURL = (req) => {
            let url = req.url.replace(/^\/\//, location.protocol + '//');
            if (!Check.isEmpty(req.data))
                url = `${url}${url.indexOf('?') < 0 ? '?' : ''}${_queryString(req.data)}`;
            return url;
        }, _finalURL = (url, cache) => {
            url = url.replace(/([?&])_=[^&]*/, '$1');
            if (!cache)
                url = `${url}${url.indexOf('?') < 0 ? '?' : '&'}_=${Date.now()}`;
            return url;
        }, _send = function (req) {
            if (!req.url)
                JSLogger.error('Sent an ajax request without URL.');
            req = J.union({
                method: 'GET',
                crossCookie: false,
                async: true,
                responseType: 'text',
                cache: true
            }, req);
            let xhr = new XMLHttpRequest(), oURL = _queryURL(req), url = _finalURL(oURL, req.cache), reqType = req.requestMime, resType = req.responseType, headers = req.headers || {};
            if (!reqType && (Y.isString(req.data) || Y.isJsonObject(req.data)))
                reqType = 'application/x-www-form-urlencoded;charset=UTF-8';
            xhr.open(req.method, url, req.async, req.username, req.password);
            xhr.setRequestHeader('Accept', resType && net.MIME[resType] ? net.MIME[resType] + ',*/*;q=0.01' : '*/*');
            if (reqType)
                xhr.setRequestHeader('Content-Type', reqType);
            if (!headers['X-Requested-With'])
                headers['X-Requested-With'] = "XMLHttpRequest";
            if (req.overrideResponseMime && xhr.overrideMimeType)
                xhr.overrideMimeType(req.overrideResponseMime);
            if (req.ifModified) {
                if (CACHE.lastModified[oURL])
                    xhr.setRequestHeader('If-Modified-Since', CACHE.lastModified[oURL]);
                if (CACHE.etag[oURL])
                    xhr.setRequestHeader('If-None-Match', CACHE.etag[oURL]);
            }
            for (let h in headers)
                xhr.setRequestHeader(h, headers[h]);
            if (req.progress)
                xhr.onprogress = function (e) { req.progress(e, xhr); };
            xhr.onerror = (e) => {
                _error.call(this, req, xhr, 'error');
            };
            xhr.withCredentials = req.crossCookie;
            let oAbort = xhr.abort;
            xhr.abort = function () {
                _error.call(this, req, xhr, xhr['_isTimeout'] ? 'timeout' : 'abort');
                oAbort.call(this);
            };
            if (req.async) {
                xhr.responseType = (resType == 'html' || resType == 'xml') ? 'document' : resType;
                xhr.timeout = req.timeout || 0;
                xhr.ontimeout = () => {
                    _error.call(this, req, xhr, 'timeout');
                };
                xhr.onreadystatechange = () => {
                    if (xhr.readyState == 4 && xhr.status > 0)
                        _done.call(this, oURL, req, xhr);
                };
            }
            let data = null;
            if (req.method != 'HEAD' && req.method != 'GET') {
                data = Y.isJsonObject(req.data) ? J.stringify(req.data) : req.data;
            }
            try {
                if (req.async && req.timeout > 0) {
                    var timer = self.setTimeout(function () {
                        xhr['_isTimeout'] = true;
                        xhr.abort();
                        self.clearTimeout(timer);
                    }, req.timeout);
                }
                xhr['timestamp'] = new Date().getTime();
                xhr.send(data);
            }
            catch (e) {
                _error.call(this, req, xhr, 'error');
            }
            if (!req.async && xhr.status > 0)
                _done.call(this, oURL, req, xhr);
        };
        class Http {
            static toRequest(quy) {
                return Y.isString(quy) ? { url: quy } : quy;
            }
            static send(req) {
                let q = this.toRequest(req);
                return q.thread ? this._inThread(req) : this._inMain(req);
            }
            static _inMain(req) {
                return Promises.create(function () {
                    _send.call(this, req);
                });
            }
            static get(req) {
                let r = this.toRequest(req);
                r.method = 'GET';
                return this.send(r);
            }
            static post(req) {
                let r = this.toRequest(req);
                r.method = 'POST';
                return this.send(r);
            }
            static upload(file, url) {
                let fm;
                if (file instanceof FormData) {
                    fm = file;
                }
                else {
                    fm = new FormData();
                    fm.append(file.postName || 'file', file.data, file.fileName);
                }
                return this.send({
                    url: url,
                    method: 'POST',
                    data: fm,
                    requestMime: 'multipart/form-data'
                });
            }
            static on(ev, fn) {
                this._ON[ev] = fn;
            }
            static sendBeacon(e, fn, scope) {
                window.addEventListener('unload', scope ? fn : function (e) { fn.call(scope, e); }, false);
            }
            static _inThread(req) {
                let r = this.toRequest(req);
                r.url = net.URI.toAbsoluteURL(r.url);
                return Promises.create(function () {
                    let ctx = this;
                    new Thread({
                        run: function () {
                            this.onposted((request) => {
                                self.Http._inMain(request).then((res) => {
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
        Http._ON = {};
        net.Http = Http;
    })(net = JS.net || (JS.net = {}));
})(JS || (JS = {}));
var Http = JS.net.Http;
var JS;
(function (JS) {
    let net;
    (function (net) {
        class MIME {
        }
        MIME.exe = 'application/octet-stream';
        MIME.bin = 'application/octet-stream';
        MIME.eps = 'application/postscript';
        MIME.word = 'application/vnd.ms-word';
        MIME.xls = 'application/vnd.ms-excel';
        MIME.ppt = 'application/vnd.ms-powerpoint';
        MIME.mdb = 'application/x-msaccess';
        MIME.pdf = 'application/pdf';
        MIME.odt = 'application/vnd.oasis.opendocument.text';
        MIME.swf = 'application/x-shockwave-flash';
        MIME.apk = 'application/vnd.android.package-archive';
        MIME.jar = 'application/java-archive';
        MIME.dll = 'application/x-msdownload';
        MIME.class = 'application/octet-stream';
        MIME.gz = 'application/x-gzip';
        MIME.tgz = 'application/x-gzip';
        MIME.bz = 'application/x-bzip2';
        MIME.zip = 'application/zip';
        MIME.rar = 'application/x-rar';
        MIME.tar = 'application/x-tar';
        MIME.z = 'application/x-compress';
        MIME.z7 = 'application/x-7z-compressed';
        MIME.arj = 'application/arj';
        MIME.lzh = 'application/x-lzh';
        MIME.ZIPS = MIME.gz + ',' + MIME.tgz + ',' + MIME.bz + ',' + MIME.zip
            + ',' + MIME.rar + ',' + MIME.tar + ',' + MIME.z + ',' + MIME.z7 + ',' + MIME.arj + ',' + MIME.lzh;
        MIME.text = 'text/plain';
        MIME.md = 'text/x-markdown';
        MIME.html = 'text/html';
        MIME.xml = 'text/xml';
        MIME.css = 'text/css';
        MIME.json = 'application/json,text/json';
        MIME.js = 'application/javascript,text/javascript,application/ecmascript,application/x-ecmascript';
        MIME.rtf = 'text/rtf';
        MIME.rtfd = 'text/rtfd';
        MIME.sql = 'text/x-sql';
        MIME.sh = 'application/x-sh';
        MIME.csv = 'text/csv';
        MIME.svg = 'image/svg+xml';
        MIME.jpg = 'image/jpeg';
        MIME.gif = 'image/gif';
        MIME.png = 'image/png';
        MIME.webp = 'image/webp';
        MIME.bmp = 'image/bmp,image/x-ms-bmp';
        MIME.tif = 'image/tiff';
        MIME.tga = 'image/x-targa';
        MIME.pcx = 'image/x-pcx';
        MIME.pic = 'image/x-pict';
        MIME.ico = 'image/x-icon';
        MIME.ai = 'application/illustrator';
        MIME.psd = 'image/vnd.adobe.photoshop,image/x-photoshop';
        MIME.WEB_IMAGES = MIME.svg + ',' + MIME.jpg + ',' + MIME.gif + ',' + MIME.png + ',' + MIME.webp;
        MIME.IMAGES = MIME.WEB_IMAGES + ',' + MIME.bmp + ',' + MIME.tif + ',' + MIME.tga + ',' + MIME.pcx
            + ',' + MIME.pic + ',' + MIME.ico + ',' + MIME.ai + ',' + MIME.psd;
        MIME.wav = 'audio/wav,audio/x-wav';
        MIME.ogg = 'audio/ogg';
        MIME.mp4_a = 'audio/mp4';
        MIME.webm_a = 'audio/webm';
        MIME.wma = 'audio/x-ms-wma';
        MIME.mp3 = 'audio/mpeg';
        MIME.mid = 'audio/midi,audio/x-midi';
        MIME.au = 'audio/basic';
        MIME.aif = 'audio/x-aiff';
        MIME.H5_AUDIOS = MIME.ogg + ',' + MIME.wav + ',' + MIME.mp4_a + ',' + MIME.webm_a;
        MIME.AUDIOS = MIME.H5_AUDIOS + ',' + MIME.mp3 + ',' + MIME.mid + ',' + MIME.wma + ',' + MIME.au + ',' + MIME.aif;
        MIME.ogv = 'video/ogg';
        MIME.mp4_v = 'video/mp4';
        MIME.webm_v = 'video/webm';
        MIME.avi = 'video/x-msvideo';
        MIME.dv = 'video/x-dv';
        MIME.mpeg = 'video/mpeg';
        MIME.mov = 'video/quicktime';
        MIME.wmv = 'video/x-ms-wmv';
        MIME.asf = 'video/x-ms-asf';
        MIME.flv = 'video/x-flv';
        MIME.mkv = 'video/x-matroska';
        MIME.gpp3 = 'video/3gpp';
        MIME.rm = 'application/vnd.rn-realmedia';
        MIME.H5_VIDEOS = MIME.ogv + ',' + MIME.mp4_v + ',' + MIME.webm_v;
        MIME.VIDEOS = MIME.H5_VIDEOS + ',' + MIME.avi + ',' + MIME.dv + ',' + MIME.mpeg + ',' + MIME.mov
            + ',' + MIME.wmv + ',' + MIME.asf + ',' + MIME.flv + ',' + MIME.mkv + ',' + MIME.gpp3 + ',' + MIME.rm;
        net.MIME = MIME;
    })(net = JS.net || (JS.net = {}));
})(JS || (JS = {}));
var MIME = JS.net.MIME;
var JS;
(function (JS) {
    let net;
    (function (net) {
        let Y = Types, J = Jsons, _URI_REG = /^(([^\:\/\?\#]+)\:)?(\/\/([^\/\?\#]*))?([^\?\#]*)(\\?([^\#]*))?(\#(.*))?/, _AUTH_REG = /^(([^\:@]*)(\:([^\:@]*))?@)?([^\:@]*)(\:(\d{1,3}))?/;
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
                if (Y.isString(cfg)) {
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
                    this.port(Y.isDefined(uri.port) ? uri.port : 80);
                    this.path(uri.path);
                    this._params = uri.params;
                    this.fragment(uri.fragment);
                }
            }
            _parseStr(uri) {
                let array = _URI_REG.exec(uri);
                if (!array)
                    throw new URIError('An invalid URI: ' + uri);
                this._scheme = array[2];
                this._frag = array[9];
                let auth = array[4];
                if (auth) {
                    let authArr = _AUTH_REG.exec(auth);
                    if (!authArr)
                        throw new URIError('An invalid auth part of URI: ' + uri);
                    if (authArr[2])
                        this._user = authArr[2];
                    if (authArr[4])
                        this._pwd = authArr[4];
                    if (authArr[5])
                        this._host = authArr[5];
                    if (Y.isDefined(authArr[7]))
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
                    J.forEach(this._params, (v, k) => {
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
                J.forEach(params, (value, key) => {
                    this.query(key, value, encode);
                });
                return this;
            }
            isAbsolute() {
                return this._host ? true : false;
            }
            toAbsolute() {
                let userinfo = this.userinfo(), port = Y.isDefined(this._port) ? ':' + this._port : '', path = this.path() || '', query = this.queryString() || '', fragment = this._frag ? '#' + this._frag : '';
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
                J.forEach(json, (v, k) => {
                    q += `&${k}=${encode ? encodeURIComponent(v) : v}`;
                });
                return q;
            }
            static parseQueryString(query, decode) {
                if (Check.isEmpty(query))
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
        net.URI = URI;
    })(net = JS.net || (JS.net = {}));
})(JS || (JS = {}));
var URI = JS.net.URI;
var JS;
(function (JS) {
    let lang;
    (function (lang) {
        class JSError extends Error {
            constructor(msg, cause) {
                super(cause ? (cause.message || '') + ' -> ' + (msg || '') : msg || '');
                this.cause = null;
                if (cause)
                    this.cause = cause;
            }
        }
        lang.JSError = JSError;
        class RefusedError extends JSError {
        }
        lang.RefusedError = RefusedError;
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
        class ParseError extends JSError {
        }
        lang.ParseError = ParseError;
        class NetworkError extends JSError {
        }
        lang.NetworkError = NetworkError;
        class TimeoutError extends JSError {
        }
        lang.TimeoutError = TimeoutError;
    })(lang = JS.lang || (JS.lang = {}));
})(JS || (JS = {}));
var JSError = JS.lang.JSError;
var RefusedError = JS.lang.RefusedError;
var NotFoundError = JS.lang.NotFoundError;
var ArithmeticError = JS.lang.ArithmeticError;
var ArgumentError = JS.lang.ArgumentError;
var StateError = JS.lang.StateError;
var ParseError = JS.lang.ParseError;
var NetworkError = JS.lang.NetworkError;
var TimeoutError = JS.lang.TimeoutError;
var JS;
(function (JS) {
    let lang;
    (function (lang) {
        class AssertError extends lang.JSError {
        }
        lang.AssertError = AssertError;
        let T = Types, F = Functions;
        class Assert {
            static fail(msg) {
                throw new AssertError(msg);
            }
            static failNotSameType(expected, actual, msg) {
                this.fail((msg || '') + ' expected type:<' + expected + '> but was:<' + actual + '>');
            }
            static failNotEqual(expected, actual, msg) {
                this.fail((msg || '') + ' expected:<' + expected + '> but was:<' + actual + '>');
            }
            static failEqual(expected, actual, msg) {
                this.fail((msg || '') + ' <' + expected + '> equals to <' + actual + '>');
            }
            static _equal(expected, actual) {
                if (expected === actual)
                    return true;
                if (T.isArray(expected) && T.isArray(actual) && Arrays.equal(expected, actual))
                    return true;
                if (T.isJsonObject(expected) && T.isJsonObject(actual) && Jsons.equal(expected, actual))
                    return true;
                if (T.isDate(expected) && T.isDate(actual) && expected.getTime() === actual.getTime())
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
                let et = T.type(expected), at = T.type(actual);
                if (et == at)
                    return;
                this.failNotSameType(et, at, msg);
            }
            static notSameType(expected, actual, msg) {
                if (T.type(expected) != T.type(actual))
                    return;
                this.fail((msg || '') + ' expected not same type');
            }
            static true(condition, msg) {
                if (!condition)
                    this.fail((msg || '') + ' expected:<TRUE> but was:<FALSE>');
            }
            static false(condition, msg) {
                if (condition)
                    this.fail((msg || '') + ' expected:<FALSE> but was:<TRUE>');
            }
            static defined(obj, msg) {
                this.true(obj != void 0, msg);
            }
            static notDefined(obj, msg) {
                this.true(obj == void 0, msg);
            }
            static error(fn, msg) {
                let has = false;
                try {
                    F.call(fn);
                }
                catch (e) {
                    has = true;
                }
                if (!has)
                    this.fail((msg || '') + ' expected throw an error');
            }
            static equalError(error, fn, msg) {
                let has = false;
                try {
                    F.call(fn);
                }
                catch (e) {
                    if (T.ofKlass(e, error))
                        has = true;
                }
                if (!has)
                    this.fail((msg || '') + ' expected throw an error');
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
            static info(refresh) {
                if (!refresh && System._info)
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
                    display: null
                };
                if (self.window) {
                    let winscreen = window.screen, doc = (a) => { return Math.max(document.documentElement[a], document.body[a]); };
                    info.display = {
                        screenWidth: winscreen.width,
                        screenHeight: winscreen.height,
                        screenViewWidth: winscreen.availWidth,
                        screenViewHeight: winscreen.availHeight,
                        windowX: window.screenLeft || window.screenX,
                        windowY: window.screenTop || window.screenY,
                        docX: doc('clientLeft') || 0,
                        docY: doc('clientTop') || 0,
                        docScrollX: doc('scrollLeft') || 0,
                        docScrollY: doc('scrollTop') || 0,
                        docWidth: doc('scrollWidth') || 0,
                        docHeight: doc('scrollHeight') || 0,
                        docViewWidth: doc('clientWidth') || 0,
                        docViewHeight: doc('clientHeight') || 0,
                        colorDepth: winscreen.colorDepth,
                        pixelDepth: winscreen.pixelDepth,
                        devicePixelRatio: window.devicePixelRatio
                    };
                }
                System._info = info;
                return info;
            }
            static display(refresh) {
                return this.info(refresh).display;
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
    let lang;
    (function (lang) {
        let ThreadState;
        (function (ThreadState) {
            ThreadState["NEW"] = "NEW";
            ThreadState["RUNNING"] = "RUNNING";
            ThreadState["TERMINATED"] = "TERMINATED";
            ThreadState["DESTROYED"] = "DESTROYED";
        })(ThreadState = lang.ThreadState || (lang.ThreadState = {}));
        let SYS_URL = null, _system = (srt) => {
            let src = srt.src.replace(/\?.*/, '');
            return src.endsWith('/jscore.js') || src.endsWith('/jscore.min.js') ? src : null;
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
            let p = self.__jscore;
            if (p) {
                SYS_URL = p;
                return SYS_URL;
            }
            ;
            SYS_URL = _docSystem(document);
            return SYS_URL;
        };
        class Thread {
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
                let fn = Thread._defines[fnName], fnBody = fn.toString().replace(/^function/, '');
                return `this.${fnName}=function${fnBody}`;
            }
            _predefine(id) {
                let sys = _findSystem();
                return `
                //@ sourceURL=thread-${id}.js
                this.id="${id}";
                this.__jscore="${sys}";
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
                this._wk = new Worker(this._url);
                this._wk.onmessage = e => {
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
                this._wk.onerror = e => {
                    JSLogger.error(e, `Thread<${this.id}> run error!`);
                    this._bus.fire('error', [e.message]);
                    this.terminate();
                };
                return this;
            }
            terminate() {
                if (this.isDestroyed())
                    return this;
                if (this._wk)
                    this._wk.terminate();
                if (this._url)
                    window.URL.revokeObjectURL(this._url);
                this._state = ThreadState.TERMINATED;
                this._wk = null;
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
                if (this._wk)
                    this._wk.postMessage.apply(this._wk, Check.isEmpty(transfer) ? [data] : [data].concat(transfer));
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
        }
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
        lang.Thread = Thread;
    })(lang = JS.lang || (JS.lang = {}));
})(JS || (JS = {}));
var Thread = JS.lang.Thread;
var ThreadState = JS.lang.ThreadState;
