/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.5.0
 * @author Frank.Feng
 */
/// <reference path="Constants.ts" />

module JS {

    export namespace math {

        /**
         * 2D Point in Cartesian coordinate.
         */
        export class Point2 {
            x: number;
            y: number;

            constructor()
            constructor(x: number, y: number)
            constructor(x?: number, y?: number) {
                this.x = x || 0;
                this.y = y || 0
            }

            static ORIGIN = new Point2(0, 0);

            static toPoint(p: ArrayPoint2): Point2 {
                return new Point2().set(p)
            }

            static toArray(p: ArrayPoint2|Point2): ArrayPoint2 {
                return p instanceof Point2?p.toArray():p
            }

            static polar2xy(d: number, rad: number): ArrayPoint2 {
                let x: number, y: number;
                switch (rad / Math.PI) {
                    case 0: x = d; y = 0; break;
                    case 0.5: x = 0; y = d; break;
                    case 1: x = -d; y = 0; break;
                    case 1.5: x = 0; y = -d; break;
                    case 2: x = d; y = 0; break;
                    default: x = d * Math.cos(rad); y = d * Math.sin(rad)
                }
                return [x.round(12), y.round(12)] //避免运算后的rad带来的精度误差
            }

            static xy2polar(x: number, y: number): PolarPoint2 {
                return {
                    d: Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)),
                    a: Point2.radian(x, y)
                }
            }

            static equal(p1: ArrayPoint2, p2: ArrayPoint2): boolean
            static equal(x1: number, y1: number, x2: number, y2: number): boolean
            static equal(x1: number | ArrayPoint2, y1: number | ArrayPoint2, x2?: number, y2?: number): boolean {
                if (arguments.length > 3) return Floats.equal(<any>x1, x2) && Floats.equal(<any>y1, y2);

                if(x1==void 0 && x1===y1) return true;
                if(x1==void 0 || y1==void 0) return false;
                let px1 = x1[0], py1 = x1[1], px2 = y1[0], py2 = y1[1];
                return Floats.equal(px1, px2) && Floats.equal(py1, py2);
            }
            static isOrigin(x: number, y: number): boolean {
                return this.equal(x, y, 0, 0)
            }

            /**
             * Computes the square of the distance between p1 and p2.
             */
            static distanceSq(x1: number, y1: number, x2: number, y2: number) {
                let dx = x1 - x2,
                    dy = y1 - y2;
                return dx * dx + dy * dy
            }

            /**
             * Computes the distance between p1 and p2.
             */
            static distance(x1: number, y1: number, x2: number, y2: number) {
                return Math.sqrt(this.distanceSq(x1, y1, x2, y2))
            }

            /**
             * The radian between the line(p1, origin) or the line(p1, p2) and X-axis. <br>
             * 计算点到原点的连线与X轴的夹角的弧度。
             */
            static radian(x1: number, y1: number, x2?:number, y2?:number): number {
                let xx = x2||0, yy = y2||0;
                if (this.isOrigin(x1, y1) && Point2.isOrigin(xx, yy)) return 0;
                return Math.atan2(y1 - yy, x1 - xx)
            }

            set(p: ArrayPoint2 | Point2 | PolarPoint2) {
                if (Types.isArray(p)) {
                    this.x = p[0];
                    this.y = p[1]
                } else if ('x' in p) {
                    this.x = p.x;
                    this.y = p.y
                } else {
                    let pp = Point2.polar2xy((<PolarPoint2>p).d, (<PolarPoint2>p).a);
                    this.x = pp[0];
                    this.y = pp[1]
                }
                return this
            }

            toPolar(): PolarPoint2 {
                return Point2.xy2polar(this.x, this.y)
            }

            toArray(): ArrayPoint2 {
                return [this.x, this.y]
            }

            clone() {
                return new Point2(this.x, this.y)
            }

            /**
             * Returns true if the L-infinite distance between this point and point p is less than or equal to the epsilon parameter, otherwise returns false.
             * The L-infinite distance is equal to MAX[abs(x1-x2), abs(y1-y2), . . . ].
             * @param p 
             */
            equals(p: Point2) {
                return Floats.equal(this.x, p.x) && Floats.equal(this.y, p.y)
            }

            /**
             * The radian between this point and X axis. <br>
             * 计算点与X轴的夹角。
             */
            radian(): number {
                return Point2.radian(this.x, this.y)
            }

            /**
             * Computes the square of the distance between this point and 
             * point p.
             */
            distanceSq(x: number, y: number) {
                return Point2.distanceSq(this.x, this.y, x, y)
            }

            /**
             * Computes the distance between this point and point p.
             */
            distance(x: number, y: number) {
                return Math.sqrt(this.distanceSq(x, y))
            }

            /**
             * Computes the L-1 (Manhattan) distance between this point and
             * point p.  The L-1 distance is equal to:
             *  abs(x1-x2) + abs(y1-y2).
             */
            distanceL1(x: number, y: number) {
                return Math.abs(this.x - x) + Math.abs(this.y - y)
            }

            /**
             * Computes the L-infinite distance between this point and
             * point p1.  The L-infinite distance is equal to 
             * MAX[abs(x1-x2), abs(y1-y2)]. 
             */
            distanceLinf(x: number, y: number) {
                return Math.max(Math.abs(this.x - x), Math.abs(this.y - y))
            }

            translate(x: number, y: number) {
                this.x += x;
                this.y += y;
                return this
            }
            moveTo(x: number, y: number) {
                this.x = x;
                this.y = y;
                return this
            }

            /**
             *  Clamps this point to the range [min, max].
             */
            clamp(min: number, max: number) {
                let T = this;
                if (T.x > max) {
                    T.x = max;
                } else if (T.x < min) {
                    T.x = min;
                }

                if (T.y > max) {
                    T.y = max;
                } else if (T.y < min) {
                    T.y = min;
                }
                return T
            }
            /**
            *  Clamps the minimum value of this point to the min parameter.
            */
            clampMin(min: number) {
                let T = this;
                if (T.x < min) T.x = min;
                if (T.y < min) T.y = min;
                return T
            }

            /**
            *  Clamps the maximum value of this point to the max parameter.
            */
            clampMax(max: number) {
                let T = this;
                if (T.x > max) T.x = max;
                if (T.y > max) T.y = max;
                return T
            }

            /**
             * Move point toward along the radian.
             */
            toward(step: number, rad: number) {
                let p = Point2.polar2xy(step, rad);
                return this.translate(p[0], p[1])
            }

        }

    }
}

import Point2 = JS.math.Point2;