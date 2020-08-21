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

        let M = Math;
        /**
         * 3D Point
         */
        export class Point3 {
            x: number;
            y: number;
            z: number;

            constructor()
            constructor(x: number, y: number, z: number)
            constructor(x?: number, y?: number, z?: number) {
                this.x = x || 0;
                this.y = y || 0;
                this.z = z || 0
            }

            static toPoint(p: ArrayPoint3): Point3 {
                return new Point3().set(p)
            }

            static equal(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) {
                return Floats.equal(x1, x2) && Floats.equal(y1, y2) && Floats.equal(z1, z2)
            }
            static isOrigin(x: number, y: number, z: number): boolean {
                return this.equal(x, y, z, 0, 0, 0)
            }

            static polar2xyz(d: number, az: number, ax: number): ArrayPoint3 {
                let tmp = d*M.sin(az);
                return [tmp*M.cos(ax), tmp*M.sin(ax), d*M.cos(az)]
            }

            static xyz2polar(x: number, y: number, z:number): PolarPoint3 {
                let d = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)+ Math.pow(z, 2));
                return {
                    d: d,
                    az: M.acos(z/d),
                    ax: M.atan(y/x)
                }
            }

            /**
             * Computes the square of the distance between p1 and p2.
             */
            static distanceSq(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) {
                let dx = x1 - x2,
                    dy = y1 - y2,
                    dz = z1 - z2;
                return dx * dx + dy * dy + dz * dz
            }

            /**
             * Computes the distance between p1 and p2.
             */
            static distance(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) {
                return Math.sqrt(this.distanceSq(x1, y1, z1, x2, y2, z2))
            }

            set(p: Point3 | ArrayPoint3) {
                if (Types.isArray(p)) {
                    this.x = p[0];
                    this.y = p[1];
                    this.z = p[2]
                } else {
                    p = <Point3>p;
                    this.x = p.x;
                    this.y = p.y;
                    this.z = p.z;
                }
                return this
            }

            /**
             * Returns true if the L-infinite distance between this point and point p is less than or equal to the epsilon parameter, otherwise returns false.
             * The L-infinite distance is equal to MAX[abs(x1-x2), abs(y1-y2), . . . ].
             * @param p 
             */
            equals(p: Point3) {
                return Floats.equal(this.x, p.x) && Floats.equal(this.y, p.y) && Floats.equal(this.z, p.z)
            }

            clone() {
                return new Point3(this.x, this.y, this.z)
            }

            /**
             * Computes the square of the distance between this point and 
             * point p.
             */
            distanceSq(p: Point3) {
                let dx = this.x - p.x,
                    dy = this.y - p.y,
                    dz = this.z - p.z;
                return dx * dx + dy * dy + dz * dz
            }

            /**
             * Computes the distance between this point and point p.
             */
            distance(p: Point3) {
                return Math.sqrt(this.distanceSq(p))
            }

            /**
             * Computes the L-1 (Manhattan) distance between this point and
             * point p.  The L-1 distance is equal to:
             *  abs(x1-x2) + abs(y1-y2) + abs(z1-z2).
             */
            distanceL1(p: Point3) {
                return Math.abs(this.x - p.x) + Math.abs(this.y - p.y) + Math.abs(this.z - p.z)
            }

            /**
             * Computes the L-infinite distance between this point and
             * point p1.  The L-infinite distance is equal to 
             * MAX[abs(x1-x2), abs(y1-y2), abs(z1-z2)]. 
             */
            distanceLinf(p: Point3) {
                let tmp = Math.max(Math.abs(this.x - p.x), Math.abs(this.y - p.y));
                return Math.max(tmp, Math.abs(this.z - p.z))
            }

            toArray(): ArrayPoint3 {
                return [this.x, this.y, this.z]
            }

            moveTo(x: number, y: number, z: number) {
                this.x = x;
                this.y = y;
                this.z = z;
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

                if (T.z > max) {
                    T.z = max;
                } else if (T.z < min) {
                    T.z = min;
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
                if (T.z < min) T.z = min;
                return T
            }


            /**
            *  Clamps the maximum value of this point to the max parameter.
            */
            clampMax(max: number) {
                let T = this;
                if (T.x > max) T.x = max;
                if (T.y > max) T.y = max;
                if (T.z > max) T.z = max;
                return T
            }

        }

    }
}

import Point3 = JS.math.Point3;