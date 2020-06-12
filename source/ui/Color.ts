/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
module JS {

    export namespace ui {

        /**
         * GradientColor 
         * 渐变颜色
         */
        export type GradientColor = {
            /**
             * @property {string} from 
             */
            from: string;
            /**
             * @property {string} to
             */
            to: string;
        }

        export class Color {
            private r: number; //红色值
            private g: number; //绿色值
            private b: number; //蓝色值
            private a: number; //Alpha透明度。取值0~1之间

            constructor(r: number | string, g?: number, b?: number, a?: number) {
                if (Types.isString(r)) {
                    let hex = <string>r;
                    this.r = parseInt('0x' + hex.slice(1, 3));
                    this.g = parseInt('0x' + hex.slice(3, 5));
                    this.b = parseInt('0x' + hex.slice(5, 7));
                    this.a = g || 0;
                } else {
                    this.r = <number>r;
                    this.g = g;
                    this.b = b;
                    this.a = a;
                }

            }
            /**
             * @method toHex 16进制颜色值
             * @return {string}
             */
            public toHex(): string {
                let color = this.r << 16 | this.g << 8 | this.b;
                return "#" + color.toString(16);
            }
            /**
             * @method toRGB rgb颜色值
             * @return {string}
             */
            public toRGB(): string {
                return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
            }
            /**
             * @method toRGBA rgba颜色值
             * @return {string}
             */
            public toRGBA(): string {
                return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
            }
        }

    }
}
import Color = JS.ui.Color;
import GradientColor = JS.ui.GradientColor; 
