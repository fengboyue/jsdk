/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.7.0
 * @update Based on old Colors helper.
 * @author Frank.Feng
 */
module JS {

    export namespace util {

        /**
         * Hex color notations:<br>
         * #RRGGBBAA 
         * #RRGGBB
         * #RGBA 
         * #RGB
         * RRGGBBAA 
         * RRGGBB
         * RGBA 
         * RGB 
         * 
         * <pre>
         * Opacity %   255 Step        2 digit HEX prefix
         *  0%          0.00            00
         *  5%          12.75           0C
         *  10%         25.50           19
         *  15%         38.25           26
         *  20%         51.00           33
         *  25%         63.75           3F
         *  30%         76.50           4C
         *  35%         89.25           59
         *  40%         102.00          66
         *  45%         114.75          72
         *  50%         127.50          7F
         *  55%         140.25          8C
         *  60%         153.00          99
         *  65%         165.75          A5
         *  70%         178.50          B2
         *  75%         191.25          BF
         *  80%         204.00          CC
         *  85%         216.75          D8
         *  90%         229.50          E5
         *  95%         242.25          F2
         *  100%        255.00          FF
         * </pre>
         */
        export type HEX = string;

        export type RGBA = string;
        export type TRGBA = {
            /** red value: 0~255 */
            r: number; //红色值
            /** green value: 0~255 */
            g: number; //绿色值
            /** blue value: 0~255 */
            b: number; //蓝色值
            /** alpha value: 0~1 */
            a?: number; //Alpha透明度。取值0~1
        }

        export type HSLA = string;
        export type THSLA = {
            /** Hue(色调): 0~360 */
            h: number;
            /** Saturation(饱和度): 0~1 */
            s: number;
            /** Lightness(亮度): 0~1 */
            l: number;
            /** alpha value: 0~1 */
            a?: number;
        }

        export type CssColor = HEX | RGBA | HSLA;

        export type CssUnit = '%' | 'px' | 'pt' | 'em' | 'rem' | 'in' | 'cm' | 'mm' | 'ex' | 'ch' | 'pc' | 'vw' | 'vh' | 'vmin' | 'vmax' | 'deg' | 'rad' | 'turn';

        /**
         * The css value string is a normal value string or a string starting with += or -= or or *= to increment or decrement or multiple the current value. 
         * For example, if an element's padding-left was 10px, .css( "padding-left", "+=15" ) would result in a total padding-left of 25px.
         */
        export type CssValueString = string;

        let _num = (s: string) => {
            let n = parseFloat(s);
            return n.isNaN() ? 0 : n
        };

        /**
         * Css Helper. 
         */
        export class CssTool {

            static isHEX(a: string): boolean {
                return /^#[0-9A-F]{3,8}$/i.test(a)
            }
            static isRGB(a: string): boolean {
                return /^rgb/.test(a)
            }
            static isHSL(a: string): boolean {
                return /^hsl/.test(a)
            }
            static isColor(a: string): boolean {
                return this.isHEX(a) || this.isRGB(a) || this.isHSL(a)
            }

            /**
             * Converts RGBA to Hex color.
             * 
             * @param r red value: 0~255
             * @param g green value: 0~255
             * @param b blue value: 0~255
             * @param a alpha value: 0~1
             */
            static rgb2hex(r: number, g: number, b: number, a?: number): HEX {
                let s = [r, g, b];
                if (a != void 0) s.push(Number((a * 255).integralPart()));
                return '#' + s.map(x => {
                    let h = x.toString(16);
                    return h.length === 1 ? '0' + h : h
                }).join('')
            }

            /**
             * Converts Hex color string to RGBA.
             * 
             * @param hex 
             */
            static hex2rgb(hex: HEX): TRGBA {
                if (!this.isHEX(hex)) return null;

                let a = false,
                    h = hex.slice(hex.startsWith('#') ? 1 : 0),
                    l = h.length;
                if (l == 4 || l == 8) a = true;
                if (l == 3 || l == 4) h = [...h].map(x => x + x).join('');
                let n = parseInt(h, 16);

                return {
                    r: (n >>> (a ? 24 : 16)),
                    g: ((n & (a ? 0x00ff0000 : 0x00ff00)) >>> (a ? 16 : 8)),
                    b: ((n & (a ? 0x0000ff00 : 0x0000ff)) >>> (a ? 8 : 0)),
                    a: a ? Number((n & 0x000000ff) / 255).round(2) : 1
                }
            }


            /**
             * Converts RGBA to css string.
             */
            static rgbString(c: TRGBA): RGBA {
                if (!c) return '';

                let has = c.a != void 0;
                return `rgb${has ? 'a' : ''}(${c.r},${c.g},${c.b}${has ? `,${c.a}` : ''})`
            }

            static toTRGB(s: RGBA): TRGBA {
                if (s.startsWith('rgba(')) {
                    let r = /^rgba\((.+),(.+),(.+),(.+)\)$/.exec(s);
                    if (r) return {
                        r: Number(r[1]),
                        g: Number(r[2]),
                        b: Number(r[3]),
                        a: Number(r[4])
                    }
                } else if (s.startsWith('rgb(')) {
                    let r = /^rgb\((.+),(.+),(.+)\)$/.exec(s);
                    if (r) return {
                        r: Number(r[1]),
                        g: Number(r[2]),
                        b: Number(r[3])
                    }
                }
                return null
            }

            static convertToRGB(val: string): TRGBA {
                if (this.isHEX(val)) return this.hex2rgb(val);
                if (this.isHSL(val)) return this.hsl2rgb(val);
                return this.toTRGB(val)
            }

            /**
             * Converts HSLA to css string.
             */
            static hslString(c: THSLA): HSLA {
                if (!c) return '';

                let has = c.a != void 0;
                return `hsl(${c.h},${(c.s * 100).round(2)}%,${(c.l * 100).round(2)}%${has ? `,${c.a}` : ''})`
            }

            static toTHSL = (h: HSLA): THSLA => {
                var hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(h) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(h);

                return {
                    h: parseInt(hsl[1], 10) / 360,
                    s: parseInt(hsl[2], 10) / 100,
                    l: parseInt(hsl[3], 10) / 100,
                    a: parseFloat(hsl[4]) || 1
                }
            }

            /**
             * Converts HSLA to RGBA.
             */
            static hsl2rgb(hsl: HSLA): TRGBA {
                if (!this.isHSL(hsl)) return null;

                let hsla = this.toTHSL(hsl),
                    h = hsla.h, s = hsla.s, l = hsla.l,
                    r, g, b;

                if (s == 0) {
                    r = g = b = l; // achromatic
                } else {
                    var hue2rgb = (p, q, t) => {
                        if (t < 0) t += 1;
                        if (t > 1) t -= 1;
                        if (t < 1 / 6) return p + (q - p) * 6 * t;
                        if (t < 1 / 2) return q;
                        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                        return p;
                    }

                    var q = l < 0.5 ? l * (1 + s) : l + s - l * s,
                        p = 2 * l - q;
                    r = hue2rgb(p, q, h + 1 / 3);
                    g = hue2rgb(p, q, h);
                    b = hue2rgb(p, q, h - 1 / 3);
                }

                return {
                    r: Math.round(r * 255),
                    g: Math.round(g * 255),
                    b: Math.round(b * 255),
                    a: hsla.a
                }
            }

            /**
             * Converts RGBA to HSLA.
             */
            static rgb2hsl(rgb: TRGBA): THSLA {
                if (!rgb) return null;

                let r = rgb.r, g = rgb.g, b = rgb.b;
                r /= 255, g /= 255, b /= 255;
                var max = Math.max(r, g, b), min = Math.min(r, g, b),
                    h, s, l = (max + min) / 2;

                if (max == min) {
                    h = s = 0; // achromatic
                } else {
                    var d = max - min;
                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                    switch (max) {
                        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                        case g: h = (b - r) / d + 2; break;
                        case b: h = (r - g) / d + 4; break;
                    }
                    h /= 6;
                }

                return {
                    h: h,
                    s: s,
                    l: l,
                    a: rgb.a
                }
            }

            /**
             * Convert 'backgroundColor' to 'background-color'.
             * @param name 
             */
            static hyphenCase(name: string) {
                return name.replace(/([A-Z])/g, (a, b: string) => { return '-' + b.toLowerCase() })
            }

            static numberOf(val: string|number) {
                return Types.isNumber(val)?<number>val:_num(<string>val)
            }

            static unitOf(val: string|number) {
                if(val==void 0||Types.isNumber(val)) return '';
                let split = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(<string>val);
                return split ? split[1] : ''
            }

            static calcValue(v: CssValueString, baseVal: string|number): string {
                if(!v) return baseVal+'';
                if(v.indexOf(',')>0 || v.indexOf(' ')>0) return v;//不能含有逗号、空格
                
                let u = this.unitOf(v)||this.unitOf(baseVal)||'px';
                if (v.startsWith('+=') || v.startsWith('-=')) {
                    let ov = this.numberOf(baseVal), nv = _num(v.replace('=', ''));
                    return ov + nv + u
                } else if (v.startsWith('*=')) {
                    let ov = this.numberOf(baseVal), nv = _num(v.replace('*=', ''));
                    return ov * nv + u
                }
                return parseFloat(v).isNaN()?v:(_num(v) + u)
            }

            /**
             * Returns a normalized value string with default value or defaule unit.
             * @param v 
             * @param defaultVal 
             * @param defaultUnit If is undefined then default unit is px
             */
            static normValue(v: string | number, defaultVal: string, defaultUnit?: string): string
            static normValue(v: string | number, df: string, du?: string): string {
                if (v == void 0) return df;
                return Types.isNumber(v)?(v+(du===undefined?'px':(du||''))):<string>v
            }

        }

    }
}
import HEX = JS.util.HEX;
import RGBA = JS.util.RGBA;
import TRGBA = JS.util.TRGBA;
import HSLA = JS.util.HSLA;
import THSLA = JS.util.THSLA;
import CssUnit = JS.util.CssUnit;
import CssColor = JS.util.CssColor;
import CssValueString = JS.util.CssValueString;
import CssTool = JS.util.CssTool;