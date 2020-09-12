/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.7.0 
 * @update Add STEPS function
 * 
 * @version 2.1.0
 * @author Frank.Feng
 */
module JS {

    export namespace an {

        /**
         * @param {number} t elapsed time
         * @param {number} b begin
         * @param {number} c increment = end - begin
         * @param {number} d duration time
         * @returns {number}
         */
        export type EasingFunction = (t: number, b: number, c: number, d: number, ...args) => number;

        const PI = Math.PI, pow = Math.pow, sqrt = Math.sqrt, abs = Math.abs, sin = Math.sin, cos = Math.cos, asin = Math.asin;
        let minMax = (n:number, min, max) =>{
            return Math.min(Math.max(n, min), max);
        }
        export class Easings {
            /**
             * Linear Function.
             * 线性缓动函数
             */
            static LINEAR:EasingFunction = function (t, b, c, d) { 
                return c * t / d + b
            }
            /**
             * Quadratic ease-in.<br>
             * 平方缓入
             */
            static QUAD_IN:EasingFunction = function (t, b, c, d) {
                return c * (t /= d) * t + b
            }
            /**
             * Quadratic ease-in.<br>
             * 平方缓出
             */
            static QUAD_OUT:EasingFunction = function (t, b, c, d) {
                return -c * (t /= d) * (t - 2) + b
            }
            /**
             * Quadratic ease-in.<br>
             * 平方缓入缓出
             */
            static QUAD_IN_OUT:EasingFunction = function (t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t + b;
                return -c / 2 * ((--t) * (t - 2) - 1) + b
            }

            /**
             * Qubic ease-in.<br>
             * 立方缓入
             */
            static CUBIC_IN:EasingFunction = function (t, b, c, d) {
                return c * (t /= d) * t * t + b
            }
            /**
             * Qubic ease-out.<br>
             * 立方缓出
             */
            static CUBIC_OUT:EasingFunction = function (t, b, c, d) {
                return c * ((t = t / d - 1) * t * t + 1) + b
            }
            /**
             * Qubic ease-in-out.<br>
             * 立方缓入缓出
             */
            static CUBIC_IN_OUT:EasingFunction = function (t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t + 2) + b
            }

            /**
             * Quartic ease-in.<br>
             * 四次方缓入
             */
            static QUART_IN:EasingFunction = function (t, b, c, d) {
                return c * (t /= d) * t * t * t + b
            }
            /**
             * Quartic ease-out.<br>
             * 四次方缓出
             */
            static QUART_OUT:EasingFunction = function (t, b, c, d) {
                return -c * ((t = t / d - 1) * t * t * t - 1) + b
            }
            /**
             * Quartic ease-in-out.<br>
             * 四次方缓入缓出
             */
            static QUART_IN_OUT:EasingFunction = function (t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
                return -c / 2 * ((t -= 2) * t * t * t - 2) + b
            }

            /**
             * Quintic ease-in.<br>
             * 五次方缓入
             */
            static QUINT_IN:EasingFunction = function (t, b, c, d) {
                return c * (t /= d) * t * t * t * t + b
            }
            /**
             * Quintic ease-out.<br>
             * 五次方缓出
             */
            static QUINT_OUT:EasingFunction = function (t, b, c, d) {
                return c * ((t = t / d - 1) * t * t * t * t + 1) + b
            }
            /**
             * Quintic ease-out.<br>
             * 五次方缓入缓出
             */
            static QUINT_IN_OUT:EasingFunction = function (t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t * t * t + 2) + b
            }

            /**
             * Sinusoidal ease-in.<br>
             * 正弦缓入
             */
            static SINE_IN:EasingFunction = function (t, b, c, d) {
                return -c * cos(t / d * (PI / 2)) + c + b
            }
            /**
             * Sinusoidal ease-out.<br>
             * 正弦缓出
             */
            static SINE_OUT:EasingFunction = function (t, b, c, d) {
                return c * sin(t / d * (PI / 2)) + b
            }
            /**
             * Sinusoidal ease-in-out.<br>
             * 正弦缓入缓出
             */
            static SINE_IN_OUT:EasingFunction = function (t, b, c, d) {
                return -c / 2 * (cos(PI * t / d) - 1) + b
            }

            /**
             * Exponential ease-in.<br>
             * 指数缓入
             */
            static EXPO_IN:EasingFunction = function (t, b, c, d) {
                return (t == 0) ? b : c * pow(2, 10 * (t / d - 1)) + b
            }
            /**
             * Exponential ease-out.<br>
             * 指数缓出
             */
            static EXPO_OUT:EasingFunction = function (t, b, c, d) {
                return (t == d) ? b + c : c * (-pow(2, -10 * t / d) + 1) + b
            }
            /**
             * Exponential ease-in-out.<br>
             * 指数缓入缓出
             */
            static EXPO_IN_OUT:EasingFunction = function (t, b, c, d) {
                if (t == 0) return b;
                if (t == d) return b + c;
                if ((t /= d / 2) < 1) return c / 2 * pow(2, 10 * (t - 1)) + b;
                return c / 2 * (-pow(2, -10 * --t) + 2) + b
            }

            /**
             * Circular ease-in.<br>
             * 圆缓入
             */
            static CIRC_IN:EasingFunction = function (t, b, c, d) {
                return -c * (sqrt(1 - (t /= d) * t) - 1) + b
            }
            /**
             * Circular ease-out.<br>
             * 圆缓出
             */
            static CIRC_OUT:EasingFunction = function (t, b, c, d) {
                return c * sqrt(1 - (t = t / d - 1) * t) + b
            }
            /**
             * Circular ease-in-out.<br>
             * 圆缓入缓出
             */
            static CIRC_IN_OUT:EasingFunction = function (t, b, c, d) {
                if ((t /= d / 2) < 1) return -c / 2 * (sqrt(1 - t * t) - 1) + b;
                return c / 2 * (sqrt(1 - (t -= 2) * t) + 1) + b
            }

            /**
             * Elastic ease-in.<br>
             * 伸缩缓入
             */
            static ELASTIC_IN:EasingFunction = function (t, b, c, d) {
                var s = 1.70158; var p = 0; var a = c;
                if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
                if (a < abs(c)) { a = c; var s = p / 4; }
                else var s = p / (2 * PI) * asin(c / a);
                return -(a * pow(2, 10 * (t -= 1)) * sin((t * d - s) * (2 * PI) / p)) + b
            }
            /**
             * Elastic ease-out.<br>
             * 伸缩缓出
             */
            static ELASTIC_OUT:EasingFunction = function (t, b, c, d) {
                var s = 1.70158; var p = 0; var a = c;
                if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
                if (a < abs(c)) { a = c; var s = p / 4; }
                else var s = p / (2 * PI) * asin(c / a);
                return a * pow(2, -10 * t) * sin((t * d - s) * (2 * PI) / p) + c + b
            }
            /**
             * Elastic ease-in-out.<br>
             * 伸缩缓入缓出
             */
            static ELASTIC_IN_OUT:EasingFunction = function (t, b, c, d) {
                var s = 1.70158; var p = 0; var a = c;
                if (t == 0) return b; if ((t /= d / 2) == 2) return b + c; if (!p) p = d * (.3 * 1.5);
                if (a < abs(c)) { a = c; var s = p / 4; }
                else var s = p / (2 * PI) * asin(c / a);
                if (t < 1) return -.5 * (a * pow(2, 10 * (t -= 1)) * sin((t * d - s) * (2 * PI) / p)) + b;
                return a * pow(2, -10 * (t -= 1)) * sin((t * d - s) * (2 * PI) / p) * .5 + c + b
            }

            /**
             * Back ease-in. <br>
             * 后退缓入
             * 
             * @param s 指定过冲量，此处数值越大，过冲越大。缺省为零.
             */
            static BACK_IN:EasingFunction = function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c * (t /= d) * t * ((s + 1) * t - s) + b
            }
            /**
             * Back ease-out. <br>
             * 后退缓出
             * 
             * @param s 指定过冲量，此处数值越大，过冲越大。缺省为零.
             */
            static BACK_OUT:EasingFunction = function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
            }
            /**
             * Back ease-in-out. <br>
             * 后退缓入缓出
             * 
             * @param s 指定过冲量，此处数值越大，过冲越大。缺省为零.
             */
            static BACK_IN_OUT:EasingFunction = function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b
            }

            /**
             * Bounce ease-in. <br>
             * 弹跳缓入
             */
            static BOUNCE_IN:EasingFunction = function (t, b, c, d) {
                return c - Easings.BOUNCE_OUT(d - t, 0, c, d) + b
            }
            /**
             * Bounce ease-out. <br>
             * 弹跳缓出
             */
            static BOUNCE_OUT:EasingFunction = function (t, b, c, d) {
                const n1 = 2.75, n2 = 7.5625;
                if ((t /= d) < (1 / n1)) {
                    return c * (n2 * t * t) + b;
                } else if (t < (2 / n1)) {
                    return c * (n2 * (t -= (1.5 / n1)) * t + .75) + b;
                } else if (t < (2.5 / 2.75)) {
                    return c * (n2 * (t -= (2.25 / n1)) * t + .9375) + b;
                } else {
                    return c * (n2 * (t -= (2.625 / n1)) * t + .984375) + b
                }
            }
            /**
             * Bounce ease-in-out. <br>
             * 弹跳缓入缓出
             */
            static BOUNCE_IN_OUT:EasingFunction = function (t, b, c, d) {
                if (t < d / 2) return Easings.BOUNCE_IN(t * 2, 0, c, d) * .5 + b;
                return Easings.BOUNCE_OUT(t * 2 - d, 0, c, d) * .5 + c * .5 + b
            }

            static STEPS: EasingFunction = function (t, b, c, d, steps) {
                steps = steps == void 0?10:(steps<1?1:steps);
                let m = Math.ceil((minMax(t/d, 0.000001, 1)) * steps) * (1 / steps);
                return b+c*m 
            };
        }
    }
}

import EasingFunction = JS.an.EasingFunction;
import Easings = JS.an.Easings;