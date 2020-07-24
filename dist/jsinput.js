//@ sourceURL=jsinput.js
/**
* JSDK 2.3.0 
* https://github.com/fengboyue/jsdk/
* (c) 2007-2020 Frank.Feng<boyue.feng@foxmail.com>
* MIT license
*/
var JS;
(function (JS) {
    let ui;
    (function (ui) {
        let MouseButton;
        (function (MouseButton) {
            MouseButton[MouseButton["LEFT"] = 0] = "LEFT";
            MouseButton[MouseButton["MIDDLE"] = 1] = "MIDDLE";
            MouseButton[MouseButton["RIGHT"] = 2] = "RIGHT";
        })(MouseButton = ui.MouseButton || (ui.MouseButton = {}));
    })(ui = JS.ui || (JS.ui = {}));
})(JS || (JS = {}));
var MouseButton = JS.ui.MouseButton;
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
        class Keyboard {
            constructor(el) {
                this._mapping = {};
                this._d = false;
                this._i = 300;
                this._ts = 0;
                let ele = el || window, m = this;
                m._m = {};
                m._q = new Queue(16);
                m._busDown = new EventBus(ele);
                m._busUp = new EventBus(ele);
                ele.on('keydown', (e) => {
                    let c = e.keyCode, sz = m._q.size(), repeat = sz > 0 && c == m._q.get(sz - 1);
                    if (m._q.isFull())
                        m._q.remove();
                    if (!repeat) {
                        let p = sz > 0 ? m._q.get(sz - 1) : null;
                        if (m._ts === 0)
                            m._ts = e.timeStamp;
                        if (p == void 0 || (p != void 0 && e.timeStamp - m._ts <= m._i)) {
                            m._ts = e.timeStamp;
                            m._q.add(c);
                        }
                    }
                    if (!Jsons.hasKey(m._m, c) || !repeat)
                        m._m[c] = e.timeStamp;
                    if (!repeat && Jsons.hasKey(m._m, c)) {
                        let types = m._busDown.types();
                        types.forEach(ty => {
                            if (m.isHotKeys(ty) && m._endsWithCode(c, ty, '+') && m._isHotKeysPressing(ty))
                                m._fireKeys(ty, c, m._busDown);
                            if (m.isSeqKeys(ty) && m._endsWithCode(c, ty, ',') && m._isSeqKeysPressing(ty))
                                m._fireKeys(ty, c, m._busDown);
                            if (input.VK[ty] == c && m.isPressingKey(c))
                                m._fireKeys(ty, c, m._busDown);
                        });
                    }
                });
                ele.on('keyup', (e) => {
                    let c = e.keyCode;
                    if (Jsons.hasKey(m._m, c)) {
                        let types = m._busUp.types();
                        types.forEach(ty => {
                            if (m.isHotKeys(ty) && m._endsWithCode(c, ty, '+') && m._isHotKeysPressing(ty))
                                m._fireKeys(ty, c, m._busUp);
                            if (m.isSeqKeys(ty) && m._endsWithCode(c, ty, ',') && m._isSeqKeysPressing(ty))
                                m._fireKeys(ty, c, m._busUp);
                            if (input.VK[ty] == c && m.isPressingKey(c))
                                m._fireKeys(ty, c, m._busUp);
                        });
                        delete m._m[e.keyCode];
                    }
                });
            }
            _fireKeys(ty, c, bus) {
                bus.fire(input.UIMocker.newKeyEvent(ty, c), [this]);
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
                let m = this, ty = m._keyChar(k);
                if (!Jsons.hasKey(m._mapping, ty))
                    m._mapping[ty] = m._numeric(ty, m.isHotKeys(ty) ? '+' : (m.isSeqKeys(ty) ? ',' : ''));
                bus.on(ty, fn);
                return m;
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
                let m = this, s = m._keyChar(k), a = s.split('\+');
                if (a.length == 1)
                    return false;
                return a.every((b, i) => {
                    if (i > 0 && !m.beforeKeyDown(a[i - 1], b))
                        return false;
                    return m.isPressingKey(b);
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
                let m = this, k = m._keyChar(keys);
                if (!k)
                    return false;
                if (m.isSeqKeys(k)) {
                    return m._isSeqKeysPressing(k);
                }
                else if (m.isHotKeys(k)) {
                    return m._isHotKeysPressing(k);
                }
                return this.isPressingKey(input.VK[k]);
            }
            isPressingKey(c) {
                let m = this, n = c == void 0 ? null : (Types.isNumber(c) ? c : input.VK[m._keyChar(c)]);
                return Jsons.hasKey(m._m, n);
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
                let m = this, n = c == void 0 ? null : (Types.isNumber(c) ? c : input.VK[m._keyChar(c)]);
                return !Jsons.hasKey(m._m, n) ? 0 : m._m[n];
            }
            beforeKeyDown(k1, k2) {
                let d1 = this.getKeyDownTime(k1), d2 = this.getKeyDownTime(k2);
                return d1 > 0 && d2 > 0 && d1 < d2;
            }
            off() {
                let m = this;
                m._check();
                m._busDown.off();
                m._busUp.off();
                return m;
            }
            clear(c) {
                let m = this;
                if (c == void 0) {
                    m._mapping = {};
                    m._m = {};
                    m._q.clear();
                    m._ts = 0;
                    return;
                }
                let a = Types.isNumber(c) ? [c] : c;
                a.forEach(k => {
                    m._m[k] = null;
                });
                return m;
            }
            _check() {
                if (this._d)
                    throw new NotHandledError();
            }
            destroy() {
                let m = this;
                m._d = true;
                m.clear();
                m._busDown.destroy();
                m._busUp.destroy();
            }
        }
        input.Keyboard = Keyboard;
    })(input = JS.input || (JS.input = {}));
})(JS || (JS = {}));
var Keyboard = JS.input.Keyboard;
var JS;
(function (JS) {
    let input;
    (function (input) {
        let D = document;
        class KeyEventInit {
            constructor() {
                this.target = null;
                this.bubbles = false;
                this.cancelable = false;
                this.view = null;
                this.ctrlKey = false;
                this.altKey = false;
                this.shiftKey = false;
                this.metaKey = false;
            }
        }
        input.KeyEventInit = KeyEventInit;
        class MouseEventInit {
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
        input.MouseEventInit = MouseEventInit;
        class UIMocker {
            static newKeyEvent(type, keyCode, args) {
                let a = Jsons.union(new KeyEventInit(), args), doc = a.target ? a.target.ownerDocument : document;
                a.view = a.view || doc.defaultView;
                let eo = new KeyboardEvent(type, a);
                Object.defineProperty(eo, 'keyCode', {
                    value: keyCode,
                    writable: true
                });
                if (a.target)
                    Object.defineProperty(eo, 'target', {
                        value: a.target,
                        writable: true
                    });
                return eo;
            }
            static fireKeyEvent(type, keyCode, args) {
                let n = (args && args.target) || window;
                n.dispatchEvent(this.newKeyEvent(type, keyCode, args));
            }
            static newMouseEvent(type, args) {
                let m = Jsons.union(new MouseEventInit(), args), doc = m.target ? m.target.ownerDocument : document, et = doc.createEvent('MouseEvents');
                m.view = m.view || doc.defaultView;
                let detail = type == 'click' || type == 'mousedown' || type == 'mouseup' ? 1 : (type == 'dblclick' ? 2 : 0);
                et.initMouseEvent(type, m.bubbles, m.cancelable, m.view, detail, m.screenX, m.screenY, m.clientX, m.clientY, m.ctrlKey, m.altKey, m.shiftKey, m.metaKey, m.button, m.relatedTarget);
                return et;
            }
            static fireMouseEvent(type, args) {
                let n = (args && args.target) || window;
                n.dispatchEvent(this.newMouseEvent(type, args));
            }
        }
        input.UIMocker = UIMocker;
    })(input = JS.input || (JS.input = {}));
})(JS || (JS = {}));
var UIMocker = JS.input.UIMocker;
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
