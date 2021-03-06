//# sourceURL=../dist/jsui.js
//JSDK 2.7.0 MIT
var JS;
(function (JS) {
    let input;
    (function (input) {
        let MouseButton;
        (function (MouseButton) {
            MouseButton[MouseButton["LEFT"] = 0] = "LEFT";
            MouseButton[MouseButton["MIDDLE"] = 1] = "MIDDLE";
            MouseButton[MouseButton["RIGHT"] = 2] = "RIGHT";
        })(MouseButton = input.MouseButton || (input.MouseButton = {}));
    })(input = JS.input || (JS.input = {}));
})(JS || (JS = {}));
var MouseButton = JS.input.MouseButton;
var JS;
(function (JS) {
    let input;
    (function (input) {
        class Cursors {
            static set(sty, el = document.body) {
                el.style.cursor = sty;
            }
            static url(url, el = document.body) {
                el.style.cursor = `url("${url}")`;
            }
        }
        input.Cursors = Cursors;
    })(input = JS.input || (JS.input = {}));
})(JS || (JS = {}));
var Cursors = JS.input.Cursors;
var JS;
(function (JS) {
    let input;
    (function (input) {
        class Keyboards {
            static newEvent(type, args) {
                let a = Jsons.union({
                    bubbles: false,
                    cancelable: false,
                    view: null,
                    ctrlKey: false,
                    altKey: false,
                    shiftKey: false,
                    metaKey: false
                }, args), doc = a.target ? a.target.ownerDocument : document;
                a.view = a.view || doc.defaultView;
                let eo = new KeyboardEvent(type, a);
                Object.defineProperty(eo, 'keyCode', {
                    value: a.keyCode,
                    writable: true
                });
                if (a.target)
                    Object.defineProperty(eo, 'target', {
                        value: a.target,
                        writable: true
                    });
                return eo;
            }
            static fireEvent(type, args) {
                let n = (args && args.target) || window;
                n.dispatchEvent(this.newEvent(type, args));
            }
        }
        input.Keyboards = Keyboards;
    })(input = JS.input || (JS.input = {}));
})(JS || (JS = {}));
var Keyboards = JS.input.Keyboards;
var JS;
(function (JS) {
    let input;
    (function (input) {
        let J = Jsons;
        class Keys {
            constructor(el) {
                this._mapping = {};
                this._d = false;
                this._i = Infinity;
                this._ts = 0;
                let ele = el || window, T = this;
                T._m = {};
                T._q = new Queue(16);
                T._busDown = new EventBus(ele);
                T._busUp = new EventBus(ele);
                ele.on('keydown', (e) => {
                    let c = e.keyCode, sz = T._q.size(), lastC = T._q.get(sz - 1), repeat = sz > 0 && c === lastC;
                    if (T._q.isFull())
                        T._q.remove();
                    if (!repeat) {
                        if (lastC == null)
                            T._ts = e.timeStamp;
                        if (e.timeStamp - T._ts <= T._i)
                            T._q.add(c);
                    }
                    T._ts = e.timeStamp;
                    if (!J.hasKey(T._m, c) || !repeat)
                        T._m[c] = e.timeStamp;
                    if (!repeat && J.hasKey(T._m, c))
                        T._fireCheck(c, T._busDown);
                });
                ele.on('keyup', (e) => {
                    let c = e.keyCode;
                    if (J.hasKey(T._m, c)) {
                        T._fireCheck(c, T._busUp);
                        delete T._m[e.keyCode];
                    }
                });
            }
            _fireCheck(c, bus) {
                let T = this, types = bus.types();
                types.forEach(ty => {
                    if (T.isHotKeys(ty) && T._endsWithCode(c, ty, '+') && T._isHotKeysPressing(ty))
                        bus.fire(input.Keyboards.newEvent(ty, { keyCode: c }), [this]);
                    if (T.isSeqKeys(ty) && T._endsWithCode(c, ty, ',') && T._isSeqKeysPressing(ty))
                        bus.fire(input.Keyboards.newEvent(ty, { keyCode: c }), [this]);
                    if (input.VK[ty] == c && T.isPressingKey(c))
                        bus.fire(input.Keyboards.newEvent(ty, { keyCode: c }), [this]);
                });
            }
            _endsWithCode(c, ty, sn) {
                return (this._mapping[ty] + sn).endsWith(c + sn);
            }
            isSeqKeys(k) {
                return k && k.indexOf(',') > 0;
            }
            isHotKeys(k) {
                return k && k.indexOf('+') > 0;
            }
            _on(k, fn, bus) {
                let T = this, ty = T._keyChar(k);
                if (!J.hasKey(T._mapping, ty))
                    T._mapping[ty] = T._numeric(ty, T.isHotKeys(ty) ? '+' : (T.isSeqKeys(ty) ? ',' : ''));
                bus.on(ty, fn);
                return T;
            }
            onKeyDown(k, fn) {
                return this._on(k, fn, this._busDown);
            }
            onKeyUp(k, fn) {
                return this._on(k, fn, this._busUp);
            }
            _off(bus, k) {
                this._check();
                bus.off(k ? this._keyChar(k) : undefined);
                return this;
            }
            offKeyDown(k) {
                return this._off(this._busDown, k);
            }
            offKeyUp(k) {
                return this._off(this._busUp, k);
            }
            _equalsSeqkeys(keys, keyCodes) {
                let sa = '';
                keys.forEach((b, i) => {
                    if (i == 0) {
                        sa += input.VK[b];
                    }
                    else {
                        sa += `,${input.VK[b]}`;
                    }
                });
                return keyCodes.endsWith(sa + ']');
            }
            _isSeqKeysPressing(k) {
                let a = k.split('\,'), l = a.length;
                if (l == 1)
                    return false;
                let lk = a[l - 1], m = this, codes = this._q.toString();
                if (m.isHotKeys(lk)) {
                    if (!m._isHotKeysPressing(lk))
                        return false;
                    a.remove(l - 1);
                    a.add(lk.split('\+'));
                }
                else {
                    if (!m.isPressingKey(lk))
                        return false;
                }
                return this._equalsSeqkeys(a, codes);
            }
            _keyChar(s) {
                return s.replace(/\s*/g, '').toUpperCase();
            }
            _isHotKeysPressing(k) {
                let T = this, s = T._keyChar(k), a = s.split('\+');
                if (a.length == 1)
                    return false;
                return a.every((b, i) => {
                    if (i > 0 && !T.beforeKeyDown(a[i - 1], b))
                        return false;
                    return T.isPressingKey(b);
                });
            }
            _numeric(ty, sign) {
                if (!sign)
                    return input.VK[ty];
                let a = ty.split(sign), sk = '';
                a.forEach(k => {
                    sk += `${!sk ? '' : sign}${input.VK[k.toUpperCase()]}`;
                });
                return sk;
            }
            isPressingKeys(keys) {
                let T = this, k = T._keyChar(keys);
                if (!k)
                    return false;
                if (T.isSeqKeys(k)) {
                    return T._isSeqKeysPressing(k);
                }
                else if (T.isHotKeys(k)) {
                    return T._isHotKeysPressing(k);
                }
                return this.isPressingKey(input.VK[k]);
            }
            isPressingKey(c) {
                let T = this, n = c == void 0 ? null : (Types.isNumber(c) ? c : input.VK[T._keyChar(c)]);
                return J.hasKey(T._m, n);
            }
            getPressingQueue() {
                return this._q.clone();
            }
            seqInterval(t) {
                if (t == void 0)
                    return this._i;
                this._i = t;
                return this;
            }
            getKeyDownTime(c) {
                let T = this, n = c == void 0 ? null : (Types.isNumber(c) ? c : input.VK[T._keyChar(c)]);
                return !J.hasKey(T._m, n) ? 0 : T._m[n];
            }
            beforeKeyDown(k1, k2) {
                let d1 = this.getKeyDownTime(k1), d2 = this.getKeyDownTime(k2);
                return d1 > 0 && d2 > 0 && d1 < d2;
            }
            off() {
                let T = this;
                T._check();
                T._busDown.off();
                T._busUp.off();
                return T;
            }
            clear(c) {
                let T = this;
                if (c == void 0) {
                    T._mapping = {};
                    T._m = {};
                    T._q.clear();
                    T._ts = 0;
                    return;
                }
                let a = Types.isNumber(c) ? [c] : c;
                a.forEach(k => {
                    T._m[k] = null;
                });
                return T;
            }
            _check() {
                if (this._d)
                    throw new RefusedError();
            }
            destroy() {
                let T = this;
                T._d = true;
                T.clear();
                T._busDown.destroy();
                T._busUp.destroy();
            }
        }
        input.Keys = Keys;
    })(input = JS.input || (JS.input = {}));
})(JS || (JS = {}));
var Keys = JS.input.Keys;
var JS;
(function (JS) {
    let input;
    (function (input) {
        class MouseEventInits {
            constructor() {
                this.target = null;
                this.bubbles = false;
                this.cancelable = false;
                this.view = null;
                this.screenX = 0;
                this.screenY = 0;
                this.clientX = 0;
                this.clientY = 0;
                this.ctrlKey = false;
                this.altKey = false;
                this.shiftKey = false;
                this.metaKey = false;
                this.button = 0;
                this.buttons = 0;
                this.relatedTarget = null;
            }
        }
        input.MouseEventInits = MouseEventInits;
        class Mouses {
            static newEvent(type, args) {
                let m = Jsons.union(new MouseEventInits(), args), doc = m.target ? m.target.ownerDocument : document, et = doc.createEvent('MouseEvents');
                m.view = m.view || doc.defaultView;
                let detail = type == 'click' || type == 'mousedown' || type == 'mouseup' ? 1 : (type == 'dblclick' ? 2 : 0);
                et.initMouseEvent(type, m.bubbles, m.cancelable, m.view, detail, m.screenX, m.screenY, m.clientX, m.clientY, m.ctrlKey, m.altKey, m.shiftKey, m.metaKey, m.button, m.relatedTarget);
                return et;
            }
            static fireEvent(type, args) {
                let n = (args && args.target) || window;
                n.dispatchEvent(this.newEvent(type, args));
            }
        }
        input.Mouses = Mouses;
    })(input = JS.input || (JS.input = {}));
})(JS || (JS = {}));
var Mouses = JS.input.Mouses;
var MouseEventInits = JS.input.MouseEventInits;
var JS;
(function (JS) {
    let input;
    (function (input) {
        const D = document, DRAG_MOVE_PX = 5, DRAG_IMAGE_OPACITY = 0.5, DBL_TAP_INTERVAL = 300, LONG_TAP_INTERVAL = 750, CTXMENU = 900, RM_ATTS = ['id', 'class', 'style', 'draggable'], KB_PROPS = ['altKey', 'ctrlKey', 'metaKey', 'shiftKey'], PT_PROPS = ['pageX', 'pageY', 'clientX', 'clientY', 'screenX', 'screenY'];
        var DataTransfer = (function () {
            function DataTransfer() {
                this._dropEffect = 'move';
                this._effectAllowed = 'all';
                this._data = {};
            }
            Object.defineProperty(DataTransfer.prototype, "dropEffect", {
                get: function () {
                    return this._dropEffect;
                },
                set: function (value) {
                    this._dropEffect = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataTransfer.prototype, "effectAllowed", {
                get: function () {
                    return this._effectAllowed;
                },
                set: function (value) {
                    this._effectAllowed = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataTransfer.prototype, "types", {
                get: function () {
                    return Object.keys(this._data);
                },
                enumerable: true,
                configurable: true
            });
            DataTransfer.prototype.clearData = function (type) {
                if (type != null) {
                    delete this._data[type];
                }
                else {
                    this._data = null;
                }
            };
            DataTransfer.prototype.getData = function (type) {
                return this._data[type] || '';
            };
            DataTransfer.prototype.setData = function (type, value) {
                this._data[type] = value;
            };
            DataTransfer.prototype.setDragImage = function (img, offsetX, offsetY) {
                instance.setDragImage(img, offsetX, offsetY);
            };
            return DataTransfer;
        }());
        class TouchDelegate {
            constructor() {
                this._tapStart = 0;
                this._tapTimer = null;
                this._lastTapEnd = 0;
                var supportsPassive = false;
                D.addEventListener('test', null, {
                    get passive() {
                        supportsPassive = true;
                        return true;
                    }
                });
                if ('ontouchstart' in D) {
                    let T = this, ts = T._touchstart.bind(T), tm = T._touchmove.bind(T), te = T._touchend.bind(T), opt = supportsPassive ? { passive: false, capture: false } : false;
                    D.addEventListener('touchstart', ts, opt);
                    D.addEventListener('touchmove', tm, opt);
                    D.addEventListener('touchend', te);
                    D.addEventListener('touchcancel', te);
                }
            }
            setDragImage(img, offsetX, offsetY) {
                this._imgCustom = img;
                this._imgOffset = { x: offsetX, y: offsetY };
            }
            _touchstart(e) {
                var T = this;
                if (T._shouldHandle(e)) {
                    T._reset();
                    T._tapStart = System.highResTime();
                    T._tapEvent = e;
                    T._fireEvent(e, 'tap', e.target);
                    if (!T._tapTimer)
                        T._tapTimer = setTimeout(() => {
                            T._fireEvent(e, 'singletap', e.target);
                        }, DBL_TAP_INTERVAL);
                    if (T._tapStart - T._lastTapEnd < DBL_TAP_INTERVAL) {
                        if (T._tapTimer)
                            clearTimeout(T._tapTimer);
                        T._fireEvent(e, 'doubletap', e.target);
                    }
                    var src = T._closestDraggable(e.target);
                    if (src) {
                        T._dragSource = src;
                        T._ptDown = T._getPoint(e);
                        T._lastDragEvent = e;
                        e.preventDefault();
                        setTimeout(function () {
                            if (T._dragSource == src && T._img == null) {
                                if (T._fireEvent(e, 'contextmenu', src)) {
                                    T._reset();
                                }
                            }
                        }, CTXMENU);
                    }
                }
            }
            ;
            _touchmove(e) {
                let T = this;
                if (T._shouldHandle(e)) {
                    var target = T._getTarget(e);
                    if (T._dragSource && !T._img) {
                        var delta = T._getDelta(e);
                        if (delta > DRAG_MOVE_PX) {
                            T._fireEvent(e, 'dragstart', T._dragSource);
                            T._createImage(e);
                            T._fireEvent(e, 'dragenter', target);
                        }
                    }
                    if (T._img) {
                        T._lastDragEvent = e;
                        e.preventDefault();
                        if (target != T._lastDragTarget) {
                            T._fireEvent(e, 'dragleave', T._lastDragTarget);
                            T._fireEvent(e, 'dragenter', target);
                            T._lastDragTarget = target;
                        }
                        T._moveImage(e);
                        T._fireEvent(e, 'dragover', target);
                    }
                }
            }
            ;
            _touchend(e) {
                let T = this;
                if (T._shouldHandle(e)) {
                    if (!T._img) {
                        T._dragSource = null;
                        if (e.type == 'touchend') {
                            T._lastTapEnd = System.highResTime();
                            let t = T._tapEvent.touches && T._tapEvent.touches[0];
                            if ((T._lastTapEnd - T._tapStart) >= LONG_TAP_INTERVAL)
                                T._fireEvent(T._tapEvent, 'longtap', T._tapEvent.target);
                        }
                    }
                    T._destroyImage();
                    if (T._dragSource) {
                        if (e.type == 'touchend') {
                            T._fireEvent(T._lastDragEvent, 'drop', T._lastDragTarget);
                        }
                        T._fireEvent(T._lastDragEvent, 'dragend', T._dragSource);
                        T._reset();
                    }
                    e.preventDefault();
                }
            }
            ;
            _shouldHandle(e) {
                return e && e.touches && e.touches.length < 2;
            }
            ;
            _reset() {
                let T = this;
                if (T._tapTimer)
                    clearTimeout(T._tapTimer);
                T._tapTimer = null;
                T._destroyImage();
                T._tapStart = 0;
                T._tapEvent = null;
                T._dragSource = null;
                T._lastDragEvent = null;
                T._lastDragTarget = null;
                T._ptDown = null;
                T._dataTransfer = new DataTransfer();
            }
            ;
            _getPoint(e, page) {
                if (e && e.touches) {
                    e = e.touches[0];
                }
                return { x: page ? e.pageX : e.clientX, y: page ? e.pageY : e.clientY };
            }
            ;
            _getDelta(e) {
                var p = this._getPoint(e);
                return Math.abs(p.x - this._ptDown.x) + Math.abs(p.y - this._ptDown.y);
            }
            ;
            _getTarget(e) {
                var pt = this._getPoint(e), el = D.elementFromPoint(pt.x, pt.y);
                while (el && getComputedStyle(el).pointerEvents == 'none') {
                    el = el.parentElement;
                }
                return el;
            }
            ;
            _createImage(e) {
                let T = this;
                if (T._img) {
                    T._destroyImage();
                }
                var src = T._imgCustom || T._dragSource;
                T._img = src.cloneNode(true);
                T._copyStyle(src, T._img);
                T._img.style.top = T._img.style.left = '-9999px';
                if (!T._imgCustom) {
                    var rc = src.getBoundingClientRect(), pt = T._getPoint(e);
                    T._imgOffset = { x: pt.x - rc.left, y: pt.y - rc.top };
                    T._img.style.opacity = DRAG_IMAGE_OPACITY.toString();
                }
                T._moveImage(e);
                D.body.appendChild(T._img);
            }
            ;
            _destroyImage() {
                let T = this;
                if (T._img && T._img.parentElement) {
                    T._img.parentElement.removeChild(T._img);
                }
                T._img = null;
                T._imgCustom = null;
            }
            ;
            _moveImage(e) {
                var T = this;
                if (T._img) {
                    requestAnimationFrame(function () {
                        var pt = T._getPoint(e, true), s = T._img.style;
                        s.position = 'absolute';
                        s.pointerEvents = 'none';
                        s.zIndex = '999999';
                        s.left = Math.round(pt.x - T._imgOffset.x) + 'px';
                        s.top = Math.round(pt.y - T._imgOffset.y) + 'px';
                    });
                }
            }
            ;
            _copyProps(dst, src, props) {
                for (var i = 0; i < props.length; i++) {
                    var p = props[i];
                    dst[p] = src[p];
                }
            }
            ;
            _copyStyle(src, dst) {
                RM_ATTS.forEach(function (att) {
                    dst.removeAttribute(att);
                });
                if (src instanceof HTMLCanvasElement) {
                    var cSrc = src, cDst = dst;
                    cDst.width = cSrc.width;
                    cDst.height = cSrc.height;
                    cDst.getContext('2d').drawImage(cSrc, 0, 0);
                }
                var cs = getComputedStyle(src);
                for (var i = 0; i < cs.length; i++) {
                    var key = cs[i];
                    dst.style[key] = cs[key];
                }
                dst.style.pointerEvents = 'none';
                for (var i = 0; i < src.children.length; i++) {
                    this._copyStyle(src.children[i], dst.children[i]);
                }
            }
            ;
            _fireEvent(e, type, target) {
                if (e && target) {
                    let T = this, evt = D.createEvent('Event'), t = e.touches ? e.touches[0] : e;
                    evt.initEvent(type, true, true);
                    evt['button'] = 0;
                    evt['which'] = evt['buttons'] = 1;
                    T._copyProps(evt, e, KB_PROPS);
                    T._copyProps(evt, t, PT_PROPS);
                    if (T._dragSource)
                        evt['dataTransfer'] = T._dataTransfer;
                    target.dispatchEvent(evt);
                    return evt.defaultPrevented;
                }
                return false;
            }
            ;
            _closestDraggable(e) {
                for (; e; e = e.parentElement) {
                    if (e.hasAttribute('draggable') && e.draggable) {
                        return e;
                    }
                }
                return null;
            }
            ;
        }
        let instance = new TouchDelegate();
        D.body.ondrop = function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();
        };
    })(input = JS.input || (JS.input = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let input;
    (function (input) {
        input.VK = {
            BACK_SPACE: 8,
            TAB: 9,
            ENTER: 13,
            SHIFT: 16,
            CTRL: 17,
            ALT: 18,
            PAUSE: 19,
            CAPS_LOCK: 20,
            ESC: 27,
            SPACE: 32,
            PAGE_UP: 33,
            PAGE_DOWN: 34,
            END: 35,
            HOME: 36,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            PRINT_SCREEN: 44,
            INSERT: 45,
            DELETE: 46,
            KEY0: 48,
            KEY1: 49,
            KEY2: 50,
            KEY3: 51,
            KEY4: 52,
            KEY5: 53,
            KEY6: 54,
            KEY7: 55,
            KEY8: 56,
            KEY9: 57,
            A: 65,
            B: 66,
            C: 67,
            D: 68,
            E: 69,
            F: 70,
            G: 71,
            H: 72,
            I: 73,
            J: 74,
            K: 75,
            L: 76,
            M: 77,
            N: 78,
            O: 79,
            P: 80,
            Q: 81,
            R: 82,
            S: 83,
            T: 84,
            U: 85,
            V: 86,
            W: 87,
            X: 88,
            Y: 89,
            Z: 90,
            PAD0: 96,
            PAD1: 97,
            PAD2: 98,
            PAD3: 99,
            PAD4: 100,
            PAD5: 101,
            PAD6: 102,
            PAD7: 103,
            PAD8: 104,
            PAD9: 105,
            MULTIPLY: 106,
            PLUS: 107,
            SUBTRACT: 109,
            DECIMAL: 110,
            DIVIDE: 111,
            F1: 112,
            F2: 113,
            F3: 114,
            F4: 115,
            F5: 116,
            F6: 117,
            F7: 118,
            F8: 119,
            F9: 120,
            F10: 121,
            F11: 122,
            F12: 123,
            NUM_LOCK: 144,
            SCROLL_LOCK: 145,
            META_LEFT: 91,
            META_RIGHT: 93,
            SEMICOLON: 186,
            EQUAL_SIGN: 187,
            COMMA: 188,
            HYPHEN: 189,
            PERIOD: 190,
            SLASH: 191,
            APOSTROPHE: 192,
            LEFT_SQUARE_BRACKET: 219,
            BACK_SLASH: 220,
            RIGHT_SQUARE_BRACKET: 221,
            QUOTE: 222
        };
    })(input = JS.input || (JS.input = {}));
})(JS || (JS = {}));
var VK = JS.input.VK;
var JS;
(function (JS) {
    let ui;
    (function (ui) {
        class ClipBoard {
            static copyTarget(clicker, target) {
                this._do('copy', clicker, target);
            }
            static cutTarget(clicker, target) {
                this._do('cut', clicker, target);
            }
            static _do(action, clicker, target) {
                Bom.ready(() => {
                    let cli = Dom.$1(clicker), tar = Dom.$1(target);
                    if (!cli || !tar)
                        throw new NotFoundError('The clicker or target not found!');
                    cli.attr('data-clipboard-action', action);
                    cli.attr('data-clipboard-target', '#' + tar.attr('id'));
                    new ClipboardJS('#' + cli.attr('id'));
                });
            }
            static copyText(clicker, text) {
                Bom.ready(() => {
                    let cli = Dom.$1(clicker);
                    if (cli)
                        throw new NotFoundError('The clicker not found!');
                    cli.attr('data-clipboard-text', text);
                    new ClipboardJS('#' + cli.attr('id'));
                });
            }
        }
        ui.ClipBoard = ClipBoard;
    })(ui = JS.ui || (JS.ui = {}));
})(JS || (JS = {}));
var ClipBoard = JS.ui.ClipBoard;
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
        function widget(fullName, alias) {
            return Annotations.define({
                name: 'widget',
                handler: (anno, values, obj) => {
                    let ctor = obj, name = values[0];
                    Class.reflect(ctor, name, alias ? alias : (name.slice(name.lastIndexOf('.') + 1)).toLowerCase());
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
    let ui;
    (function (ui) {
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
        ui.Templator = Templator;
    })(ui = JS.ui || (JS.ui = {}));
})(JS || (JS = {}));
var Templator = JS.ui.Templator;
