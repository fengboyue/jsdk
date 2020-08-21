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
         * 3D Vector
         */
        export class Vector3 {
            x: number;
            y: number;
            z: number;

            static Zero = new Vector3(0, 0, 0);
            static One = new Vector3(1, 1, 1);
            static UnitX = new Vector3(1, 0, 0);
            static UnitY = new Vector3(0, 1, 0);
            static UnitZ = new Vector3(0, 0, 1);

            static toVector(p1: Point3 | ArrayPoint3, p2: Point3 | ArrayPoint3): Vector3 {
                return new Vector3().set(p1, p2)
            }

            /**
             * Returns new cross product vector of vectors v1 and v2.
             */
            static cross(v1: Vector3, v2: Vector3): Vector3 {
                let x = v1.y * v2.z - v1.z * v2.y,
                    y = v2.x * v1.z - v2.z * v1.x,
                    z = v1.x * v2.y - v1.y * v2.x;
                return new Vector3(x, y, z)
            }
            /**
             * Return an vector of linear interpolation. <br>
             * 返回新的线性插值向量。
             * amount: 一个介于 0 与 1 之间的值，指示 the "to" vector 的权重。
             * 
             * @throws {RangeError} when amount is not in [0,1]
             */
            static lerp(from: Vector3, to: Vector3, amount: number): Vector3 {
                if (amount < 0 || amount > 1) throw new RangeError();
                let x = from.x + amount * (to.x - from.x),
                    y = from.y + amount * (to.y - from.y),
                    z = from.z + amount * (to.z - from.z);
                return new Vector3(x, y, z);
            }

            constructor()
            constructor(x: number, y: number, z: number)
            constructor(x?: number, y?: number, z?: number) {
                this.x = x || 0;
                this.y = y || 0;
                this.z = z || 0
            }

            set(v: Vector3): this
            set(from: Point3 | ArrayPoint3, to: Point3 | ArrayPoint3): this
            set(f: Vector3 | Point3 | ArrayPoint3, t?: Point3 | ArrayPoint3): this {
                if (t == void 0) {
                    this.x = (<Vector3>f).x;
                    this.y = (<Vector3>f).y;
                    this.z = (<Vector3>f).z
                } else {
                    let is = Types.isArray(f),
                        ff = is ? Point3.toPoint(<ArrayPoint3>f) : <Point3>f,
                        tt = is ? Point3.toPoint(<ArrayPoint3>t) : <Point3>t;
                    this.x = tt.x - ff.x;
                    this.y = tt.y - ff.y;
                    this.z = tt.z - ff.z
                }
                return this
            }

            equals(v: Vector3) {
                return Floats.equal(v.lengthSq(), this.lengthSq()) && this.x / v.x == this.y / v.y && this.y / v.y == this.z / v.z
            }

            toString() {
                return "(" + this.x + "," + this.y + "," + this.z + ")"
            }

            toArray(): [number, number, number] {
                return [this.x, this.y, this.z]
            }

            clone() {
                return new Vector3(this.x, this.y, this.z)
            }
            /**
             * Negates this vector.
             */
            negate() {
                this.x = -this.x;
                this.y = -this.y;
                this.z = -this.z;
                return this
            }

            add(v: Vector3) {
                this.x += v.x;
                this.y += v.y;
                this.z += v.z;
                return this
            }
            sub(v: Vector3) {
                this.x -= v.x;
                this.y -= v.y;
                this.z -= v.z;
                return this
            }
            mul(n: number) {
                this.x *= n;
                this.y *= n;
                this.z *= n;
                return this
            }
            div(n: number) {
                this.x /= n;
                this.y /= n;
                this.z /= n;
                return this
            }

            /**
             * Returns the squared length of this vector.
             */
            lengthSq() {
                return (this.x * this.x + this.y * this.y + this.z * this.z)
            }

            /**
             * Returns the length of this vector.
             */
            length() {
                return Math.sqrt(this.lengthSq())
            }

            /**
             * Computes the dot product of this vector and vector v.
             */
            dot(v: Vector3) {
                return this.x * v.x + this.y * v.y + this.z * v.z
            }

            /**
             * Sets the 1 length vector of this vector.<br>
             * 设置成长度为1的单位向量。
             */
            normalize(): this {
                return this.div(this.length());
            }

            /**
             *  Sets each component of this tuple to its absolute value.
             */
            abs() {
                this.x = Math.abs(this.x);
                this.y = Math.abs(this.y);
                this.z = Math.abs(this.z);
                return this
            }
        }

    }
}

import Vector3 = JS.math.Vector3;
