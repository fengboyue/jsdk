//@ sourceURL=jsui.js
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
        class Colors {
            static hex2rgba(hex) {
                if (!hex)
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
            static rgba2hex(r, g, b, a) {
                let s = [r, g, b];
                if (a != void 0)
                    s.push(Number((a * 255).integralPart()));
                return '#' + s.map(x => {
                    let h = x.toString(16);
                    return h.length === 1 ? '0' + h : h;
                }).join('');
            }
            static rgba2css(c) {
                if (!c)
                    return '';
                let has = c.a != void 0;
                return `rgb${has ? 'a' : ''}(${c.r},${c.g},${c.b}${has ? `,${c.a}` : ''})`;
            }
            static hsla2string(c) {
                if (!c)
                    return '';
                let has = c.a != void 0;
                return `hsl(${c.h},${(c.s * 100).round(2)}%,${(c.l * 100).round(2)}%${has ? `,${c.a}` : ''})`;
            }
            static hsl2rgb(hsl) {
                if (!hsl)
                    return null;
                let h = hsl.h, s = hsl.s, l = hsl.l, r, g, b;
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
                    a: hsl.a
                };
            }
            static rgbTohsl(rgb) {
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
            static css2rgba(css) {
                if (!css)
                    return null;
                css = css.trim().toLowerCase();
                if (css.startsWith('#'))
                    return this.hex2rgba(css);
                if (css.startsWith('rgba(')) {
                    let r = /^rgba\((.+),(.+),(.+),(.+)\)$/.exec(css);
                    if (r)
                        return {
                            r: Number(r[1]),
                            g: Number(r[2]),
                            b: Number(r[3]),
                            a: Number(r[4])
                        };
                }
                if (css.startsWith('rgb(')) {
                    let r = /^rgb\((.+),(.+),(.+)\)$/.exec(css);
                    if (r)
                        return {
                            r: Number(r[1]),
                            g: Number(r[2]),
                            b: Number(r[3])
                        };
                }
                return null;
            }
        }
        ui.Colors = Colors;
    })(ui = JS.ui || (JS.ui = {}));
})(JS || (JS = {}));
var Colors = JS.ui.Colors;
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
            static toNumber(len, unit = LengthUnit.PX) {
                if (len == void 0)
                    return 0;
                if (Types.isNumeric(len))
                    return Number(len);
                let le = String(len);
                if (le.endsWith('%'))
                    return 0;
                return Number(le.replace(new RegExp(`${unit}$`), ''));
            }
            static toCSS(len, defaultVal, unit) {
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
