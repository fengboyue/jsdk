/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
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

        export type Color = HEX|RGBA|HSLA;
        
        /**
         * Length Helper. 
         */
        export class Colors {

            /**
             * Converts Hex color string to RGBA.
             * 
             * @param hex 
             */
            public static hex2rgba(hex: HEX): TRGBA {
                if(!hex) return null;

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
             * Converts RGBA to Hex color.
             * 
             * @param r red value: 0~255
             * @param g green value: 0~255
             * @param b blue value: 0~255
             * @param a alpha value: 0~1
             */
            public static rgba2hex(r: number, g: number, b: number, a?: number): HEX {
                let s = [r, g, b];
                if (a != void 0) s.push(Number((a * 255).integralPart()));
                return '#' + s.map(x => {
                    let h = x.toString(16);
                    return h.length === 1 ? '0' + h : h
                }).join('')
            }
            /**
             * Converts RGBA to css string.
             */
            public static rgba2css(c: TRGBA): RGBA {
                if(!c) return ''; 

                let has = c.a != void 0;
                return `rgb${has ? 'a' : ''}(${c.r},${c.g},${c.b}${has ? `,${c.a}` : ''})`
            }

            /**
             * Converts HSLA to css string.
             */
            public static hsla2string(c: THSLA): HSLA {
                if(!c) return ''; 

                let has = c.a != void 0;
                return `hsl(${c.h},${(c.s * 100).round(2)}%,${(c.l * 100).round(2)}%${has ? `,${c.a}` : ''})`
            }

            /**
             * Converts HSLA to RGBA.
             */
            public static hsl2rgb(hsl: THSLA): TRGBA {
                if(!hsl) return null; 

                let h = hsl.h, s = hsl.s, l = hsl.l,
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
                    a: hsl.a
                }
            }

            /**
             * Converts RGBA to HSLA.
             */
            public static rgb2hsl(rgb: TRGBA): THSLA {
                if(!rgb) return null; 

                let r = rgb.r, g = rgb.g, b = rgb.b;
                r /= 255, g /= 255, b /= 255;
                var max = Math.max(r, g, b), min = Math.min(r, g, b),
                    h, s, l = (max + min) / 2;
            
                if (max == min){ 
                    h = s = 0; // achromatic
                } else {
                    var d = max - min;
                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                    switch(max) {
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

            public static css2rgba(css: string): TRGBA{
                if(!css) return null; 

                css = css.trim().toLowerCase();
                if(css.startsWith('#')) return this.hex2rgba(css);
                if(css.startsWith('rgba(')) {
                    let r = /^rgba\((.+),(.+),(.+),(.+)\)$/.exec(css);
                    if(r) return {
                        r:Number(r[1]),
                        g:Number(r[2]),
                        b:Number(r[3]),
                        a:Number(r[4]) 
                    }
                }
                if(css.startsWith('rgb(')) {
                    let r = /^rgb\((.+),(.+),(.+)\)$/.exec(css);
                    if(r) return {
                        r:Number(r[1]),
                        g:Number(r[2]),
                        b:Number(r[3])
                    }
                }
                return null
            }

            
        }

    }
}
import HEX = JS.util.HEX;
import RGBA = JS.util.RGBA;
import TRGBA = JS.util.TRGBA;
import HSLA = JS.util.HSLA;
import THSLA = JS.util.THSLA;
import Color = JS.util.Color;
import Colors = JS.util.Colors;