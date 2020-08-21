/**
 * @project JSDK 
 * @license MIT
 * @website https = //github.com/fengboyue/jsdk
 * 
 * @version 2.5.0
 * @author Frank.Feng
 */

module JS {

    export namespace math {

        /**
         * Radian tool
         */
        export class Radians {

            // 顺时针十六个方向的弧度值
            static EAST = 0;
            static SOUTH = 0.5 * Math.PI;
            static WEST = Math.PI;
            static NORTH = 1.5 * Math.PI;
            static ONE_CYCLE = 2 * Math.PI;

            /**
             * Transfer a radian number to a degree number.<br>
             * 弧度转角度
             * @param limit {boolean} True that the return value be limit in [0,2*PI)
             */
            static rad2deg(rad: number, limit?: boolean) {
                let r = rad * 180 / Math.PI;
                return limit?this.positive(r):r
            }
            /**
             * Transfer a degree number to a radian number.<br>
             * 角度转弧度
             */
            static deg2rad(deg: number) {
                return deg * Math.PI / 180
            }

            /**
             * Transfer a positive radian withe same angle.<br>
             * 转换成正弧度
             */
            static positive(rad: number) {
                return rad < 0 ? this.ONE_CYCLE + rad : rad
            }
            /**
             * The value of rad1 equals the value of rad1.<br>
             */
            static equal(rad1: number, rad2: number) {
                return Floats.equal(rad1, rad2, 1e-14)
            }
            static equalAngle(rad1: number, rad2: number) {
                return this.equal(this.positive(rad1%this.ONE_CYCLE),this.positive(rad2%this.ONE_CYCLE))
            }
            /**
             * Return a reverse direction.<br>
             */
            static reverse(rad: number) {
                return rad < Math.PI ? rad + Math.PI : rad - Math.PI
            }
        }

    }
}

import Radians = JS.math.Radians;