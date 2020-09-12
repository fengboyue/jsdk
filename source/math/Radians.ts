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

        let PI = Math.PI;

        /**
         * Radian tool
         */
        export class Radians {

            // 顺时针十六个方向的弧度值
            static EAST = 0;
            static SOUTH = 0.5 * PI;
            static WEST = PI;
            static NORTH = 1.5 * PI;
            static ONE_CYCLE = 2 * PI;

            /**
             * Transfer a radian number to a degree number.<br>
             * 弧度转角度
             * @param limit {boolean} True that the return value be limit in [0,2*PI)
             */
            static rad2deg(rad: number, limit?: boolean) {
                let r = rad * 180 / PI;
                return limit ? this.positive(r) : r
            }
            /**
             * Transfer a degree number to a radian number.<br>
             * 角度转弧度
             */
            static deg2rad(deg: number) {
                return deg * PI / 180
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
                return rad1==rad2 || Floats.equal(this.positive(rad1) % PI, this.positive(rad2) % PI, 1e-12)
            }
            /**
             * Return a reverse direction.<br>
             */
            static reverse(rad: number) {
                return rad < PI ? rad + PI : rad - PI
            }
        }

    }
}

import Radians = JS.math.Radians;