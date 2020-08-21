/**
 * @project JSDK 
 * @license MIT
 * @website https = //github.com/fengboyue/jsdk
 * 
 * @version 2.5.0
 * @author Frank.Feng
 */
/// <reference path="Constants.ts" />

module JS {

    export namespace math {

        /**
         * 2D Coords Tool
         */
        export class Coords2 {

            static rotate(p: ArrayPoint2, rad: number): ArrayPoint2 {
                let pt = this.rotateX(p, rad);
                return this.rotateY(pt, rad)
            }
            static rotateX(p: ArrayPoint2, rad: number): ArrayPoint2 {
                let x = p[0], y = p[1];
                return [x * Math.cos(rad) - y * Math.sin(rad), y]
            }
            static rotateY(p: ArrayPoint2, rad: number): ArrayPoint2 {
                let x = p[0], y = p[1];
                return [x, x * Math.sin(rad) + y * Math.cos(rad)]
            }
            static translate(p: ArrayPoint2, dx: number, dy: number) {
                let pt = this.translateX(p, dx);
                return this.translateY(pt, dy)
            }
            static translateX(p: ArrayPoint2, delta: number): ArrayPoint2 {
                let x = p[0], y = p[1];
                return [x + delta, y]
            }
            static translateY(p: ArrayPoint2, delta: number): ArrayPoint2 {
                let x = p[0], y = p[1];
                return [x, y + delta]
            }
        }

    }
}

import Coords2 = JS.math.Coords2;