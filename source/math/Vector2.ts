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
         * 2D Vector
         */
        export class Vector2 {
            x: number;
            y: number;

            static Zero = new Vector2(0, 0);
            static One = new Vector2(1, 1);
            static UnitX = new Vector2(1, 0);
            static UnitY = new Vector2(0, 1);

            static toVector(p1: ArrayPoint2, p2: ArrayPoint2): Vector2
            static toVector(p1: Point2, p2: Point2): Vector2
            static toVector(line: Segment): Vector2
            static toVector(p1: Point2 | ArrayPoint2 | Segment, p2?: Point2 | ArrayPoint2): Vector2 {
                let l = arguments.length;
                if (l == 1) {
                    let line = <Segment>p1;
                    return new Vector2().set(line.p1(), line.p2())
                } else {
                    return new Vector2().set(<any>p1, <any>p2)
                }
            }

            /**
            * The point p on which side of an vector(p1->p2).
            * 判断点在直线的哪一边
            * 
            * @return {Int} -1 is LEFT; 1 is RIGHT; 0 is COLLINEAR; 
            */
            static whichSide(p1: ArrayPoint2, p2: ArrayPoint2, p: ArrayPoint2): number {
                let
                    v1 = Vector2.toVector(p1, p),
                    v2 = Vector2.toVector(p2, p),
                    rst = Vector2.cross(v1, v2);

                if (Floats.equal(0, rst)) return 0;
                return rst > 0 ? 1 : -1
            }

            /**
             * Returns cross product value of vectors v1 and v2.
             */
            static cross(v1: Vector2, v2: Vector2): number {
                return v1.x * v2.y - v2.x * v1.y;
            }

            /**
             * Return an vector of linear interpolation. <br>
             * 返回新的线性插值向量。
             * amount: 一个介于 0 与 1 之间的值，指示 the "to" vector 的权重。
             * 
             * @throws {RangeError} when amount is not in [0,1]
             */
            static lerp(from: Vector2, to: Vector2, amount: number): Vector2 {
                if (amount < 0 || amount > 1) throw new RangeError();
                let x = from.x + amount * (to.x - from.x),
                    y = from.y + amount * (to.y - from.y);
                return new Vector2(x, y);
            }

            constructor()
            constructor(x: number, y: number)
            constructor(x?: number, y?: number) {
                this.x = x || 0;
                this.y = y || 0;
            }

            set(v: Vector2): this
            set(from: ArrayPoint2, to: ArrayPoint2): this
            set(from: Point2, to: Point2): this
            set(f: Vector2 | Point2 | ArrayPoint2, t?: Point2 | ArrayPoint2): this {
                let l = arguments.length, isA = Types.isArray(f);
                this.x = l == 1 ? (<Vector2>f).x : isA ? t[0] - f[0] : (<Point2>t).x - (<Point2>f).x;
                this.y = l == 1 ? (<Vector2>f).y : isA ? t[1] - f[1] : (<Point2>t).y - (<Point2>f).y;
                return this
            }

            equals(v: Vector2) {//长度相等且同向
                if (this.isZero() && v.isZero()) return true;
                if (this.isZero() || v.isZero()) return false;
                return Floats.equal(v.lengthSq(), this.lengthSq()) && Radians.equal(v.radian(), this.radian())
            }

            toString() {
                return "(" + this.x + "," + this.y + ")"
            }

            toArray(): [number, number] {
                return [this.x, this.y]
            }

            clone() {
                return new Vector2(this.x, this.y)
            }
            /**
             * Negates this vector.
             */
            negate() {
                this.x = -this.x;
                this.y = -this.y;
                return this
            }

            add(v: Vector2) {
                this.x += v.x;
                this.y += v.y;
                return this
            }
            sub(v: Vector2) {
                this.x -= v.x;
                this.y -= v.y;
                return this
            }
            mul(n: number) {
                this.x *= n;
                this.y *= n;
                return this
            }
            div(n: number) {
                this.x /= n;
                this.y /= n;
                return this
            }

            /**
             * Returns the squared length of this vector.
             */
            lengthSq() {
                return this.x * this.x + this.y * this.y
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
            dot(v: Vector2) {
                return this.x * v.x + this.y * v.y
            }

            /**
             * Sets the 1 length vector of this vector.<br>
             * 设置成长度为1的单位向量。
             */
            normalize(): this {
                return this.div(this.length());
            }

            /** 
             * Returns the radians of this vector.
             */
            radian(): number {
                return Point2.radian(this.x, this.y)
            }

            _angle(v: Vector2){
                let vv = Vector2.UnitX,
                vDot = v.dot(vv) / (v.length() * vv.length());
                if (vDot < -1.0) vDot = -1.0;
                if (vDot > 1.0) vDot = 1.0;
                return Math.acos(vDot);
            }
            /** 
             * Returns the angle in radians between this vector and an vector or X-axis.
             * The return value is constrained to the range [0,PI]. 
             * @throws {RangeError} when v is zero vector
             */
            angle(v?: Vector2): number {
                if (v && v.isZero() && this.isZero()) throw new RangeError('Can\'t with zero vector')
                return Math.abs(this._angle(this)-this._angle(v));
            }

            isZero() {
                return this.x == 0 && this.y == 0
            }

            /**
             * Judge this vector is perpendicular to vector v.<br>
             * 是否垂直于向量v。
             */
            verticalTo(v: Vector2): boolean {
                return Radians.equal(this.angle(v), Math.PI / 2)
            }

            /**
             * Judge this vector is parallel to vector v.<br>
             * 是否平行于向量v。
             */
            parallelTo(v: Vector2): boolean {
                let a = this.angle(v);
                return Radians.equal(a, 0) || Radians.equal(a, Math.PI)
            }

            /**
             * Returns left normal vector.
             * 返回的左法向量。
             */
            getNormL(): Vector2 {
                return new Vector2(this.y, -this.x)
            }
            /**
             * Returns right normal vector.
             * 返回的右法向量。
             */
            getNormR(): Vector2 {
                return new Vector2(-this.y, this.x)
            }
            /**
             * Returns a new vector which is V1 projection on V2.<br>
             * 返回当前向量在向量V上的投影向量。
             */
            getProject(v: Vector2): Vector2 {
                var dp = this.dot(v), vv = v.lengthSq();
                return new Vector2((dp / vv) * v.x, (dp / vv) * v.y);
            }

            /**
             * Returns the rebound vector when this vector move to vector v.
             * 返回碰撞V后的反弹向量。
             */
            private _rebound(v: Vector2, leftSide?: boolean) {
                if (this.parallelTo(v)) return this.clone();
                let n = leftSide ? v.getNormL() : v.getNormR(),
                    p = this.getProject(n);
                return p.sub(this).mul(2).add(this)
            }
            /**
             * Returns the rebound vector when this vector move to vector v from left side.
             * 返回从左边碰撞V后的反弹向量。
             */
            getReboundL(v: Vector2) {
                return this._rebound(v, true)
            }
            /**
             * Returns the rebound vector when this vector move to vector v from right side.
             * 返回从左边碰撞V后的反弹向量。
             */
            getReboundR(v: Vector2) {
                return this._rebound(v, false)
            }

            /**
             *  Sets each component of this tuple to its absolute value.
             */
            abs() {
                this.x = Math.abs(this.x);
                this.y = Math.abs(this.y)
                return this
            }
        }

    }
}

import Vector2 = JS.math.Vector2;