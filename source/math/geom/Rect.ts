/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.5.0
 * @author Frank.Feng
 */
/// <reference path="Segment.ts" />

module JS {

    export namespace math {

        export namespace geom {

            let M = Math, S = Segment, N = Number;
            /**
             * Rectangle 指定了坐标空间中的一个区域，通过 Rectangle 对象的左上顶点的坐标（x，y）、宽度和高度可以定义这个区域。 
             */
            export class Rect implements Shape {
                x: number;
                y: number;
                w: number;
                h: number;

                static toRect(p: ArrayPoint2, w: number, h: number) {
                    return new Rect(p[0], p[1], w, h)
                }

                /**
                 * Set Rectangle1's center to Rectangle2's center.
                 * 矩形1相对于矩形2居中
                 */
                static centerTo(rect1: Rect, rect2: Rect): void {
                    let w1 = rect1.w, h1 = rect1.h, w2 = rect2.w, h2 = rect2.h;
                    rect1.x = rect2.x + (w2 - w1) / 2;
                    rect1.y = rect2.y + (h2 - h1) / 2;
                }

                /**
                 * Limit Rectangle1 in Rectangle2.
                 * 矩形1限制在矩形2的范围内
                 * 
                 */
                static limitIn(rect1: Rect, rect2: Rect) {
                    if (rect1.x < rect2.x) {
                        rect1.x = rect2.x
                    }
                    else
                        if (rect1.x > (rect2.x + rect2.w - rect1.w)) {
                            rect1.x = rect2.x + rect2.w - rect1.w;
                        };
                    if (rect1.y < rect2.y) {
                        rect1.y = rect2.y
                    }
                    else
                        if (rect1.y > (rect2.y + rect2.h - rect1.h)) {
                            rect1.y = rect2.y + rect2.h - rect1.h;
                        }
                }

                constructor()
                constructor(x: number, y: number)
                constructor(x: number, y: number, w: number, h: number)
                constructor(x?: number, y?: number, w?: number, h?: number) {
                    this.set(x,y,w,h)
                }

                /**
                 * Returns the smallest X coordinate of the framing
                 * rectangle of the <code>Shape</code>.
                 */
                minX() {
                    return this.x;
                }

                /**
                 * Returns the smallest Y coordinate of the framing
                 * rectangle of the <code>Shape</code>.
                 */
                minY() {
                    return this.y
                }

                /**
                 * Returns the largest X coordinate of the framing
                 * rectangle of the <code>Shape</code>.
                 */
                maxX() {
                    return this.x + this.w
                }

                /**
                 * Returns the largest Y coordinate of the framing
                 * rectangle of the <code>Shape</code>.
                 */
                maxY() {
                    return this.y + this.h
                }

                /**
                 * Returns the X coordinate of the center of the framing
                 * rectangle of the <code>Shape</code>.
                 */
                centerX() {
                    return this.x + this.w / 2
                }

                /**
                 * Returns the Y coordinate of the center of the framing
                 * rectangle of the <code>Shape</code>.
                 */
                centerY() {
                    return this.y + this.h / 2
                }

                clone() {
                    return <this>new Rect(this.x, this.y, this.w, this.h)
                }

                equals(s: Rect): boolean {
                    let T = this;
                    if (T.w != s.w || T.h != s.h) return false;
                    return Floats.equal(T.x, s.x) && Floats.equal(T.y, s.y)
                }

                set(r: Rect): this
                set(x: number, y: number, w: number, h: number): this
                set(xx: number | Rect, yy?: number, ww?: number, hh?: number) {
                    let len = arguments.length,
                        x = len == 1 ? (<Rect>xx).x : <number>xx,
                        y = len == 1 ? (<Rect>xx).y : <number>yy,
                        w = len == 1 ? (<Rect>xx).w : <number>ww,
                        h = len == 1 ? (<Rect>xx).h : <number>hh;

                    this.x = Number(x || 0).round(3);
                    this.y = Number(y || 0).round(3);
                    this.w = Number(w || 0).round(3);
                    this.h = Number(h || 0).round(3);
                    return this
                }

                isEmpty() {
                    return this.w <= 0 || this.h <= 0
                }

                size(): { w: number, h: number }
                size(w: number, h: number): this
                size(w?: number, h?: number): any {
                    if (w == void 0) return { w: this.w, h: this.h };

                    this.w = w < 0 ? 0 : w;
                    this.h = h < 0 ? 0 : h;
                    return this
                }

                moveTo(x: number, y: number): this {
                    this.x = x;
                    this.y = y;
                    return this
                }

                area() {
                    return this.w * this.h;
                }

                perimeter() {
                    return 2 * (this.w + this.h);
                }

                vertexes(): ArrayPoint2[]
                vertexes(ps: ArrayPoint2[]): this
                vertexes(ps?: ArrayPoint2[]): any {
                    if (arguments.length == 0) {
                        let T = this,
                            a: ArrayPoint2 = [T.x, T.y],
                            b: ArrayPoint2 = [T.x + T.w, T.y],
                            c: ArrayPoint2 = [T.x + T.w, T.y + T.h],
                            d: ArrayPoint2 = [T.x, T.y + T.h];
                        return [a, b, c, d]
                    }

                    let p1 = ps[0], p2 = ps[1], p3 = ps[2];
                    this.x = p1[0];
                    this.y = p1[1];
                    this.w = p2[0] - p1[0];
                    this.h = p3[1] - p2[1];
                    return this
                }

                private _inside(x: number, y: number) {
                    let T = this;
                    return x > T.x && x < (T.x + T.w) && y > T.y && y < (T.y + T.h);
                }

                inside(s: ArrayPoint2 | Segment | Rect | Circle): boolean {
                    if (!s || this.isEmpty()) return false;

                    if (Types.isArray(s)) return this._inside(s[0], s[1]);
                    if ((<Shape>s).isEmpty()) return false;

                    if (s instanceof Segment) {
                        let vs = s.vertexes();
                        return vs.every(v => {
                            return this.inside(v)
                        })
                    }
                    if (s instanceof Rect) {
                        let rect1 = this, rect2 = s;
                        return (rect2.x >= rect1.x && rect2.y >= rect1.y &&
                            (rect2.x + rect2.w) <= (rect1.x + rect1.w) &&
                            (rect2.y + rect2.h) <= (rect1.y + rect1.h))
                    }
                    //处理圆
                    let c = <Circle>s;
                    //圆心必须在矩形内
                    if(!Shapes.inShape([c.x,c.y], this)) return false;
                    //计算圆心到边的距离
                    let rr = c.r*c.r;
                    return this.edges().every(b=>{
                        return Floats.greaterEqual(Line.distanceSqToPoint(b.p1(),b.p2(),[c.x,c.y]),rr)
                    })
                }
                onside(p: ArrayPoint2): boolean {
                    return !this.isEmpty() && Shapes.onShape(p, this)
                }

                intersects(s: Segment | Line | Rect): boolean {
                    let T = this;
                    if (!s || T.isEmpty() || s.isEmpty()) return false;

                    if (s instanceof Rect) {
                        let x = s.x, y = s.y, w = s.w, h = s.h, x0 = T.x, y0 = T.y;
                        return (x + w > x0 &&
                            y + h > y0 &&
                            x < x0 + T.w &&
                            y < y0 + T.h)
                    }
                    let ps = Shapes.crossPoints(s, T), len = ps.length;
                    if (len == 0) return false;

                    if (len == 1) {
                        //是直线则是相切不相交
                        if (!(s instanceof Segment)) return false;
                        //是线段且只有一个交点：判断是否有一个顶点在矩形内部
                        let p1 = s.p1(), p2 = s.p2();
                        return T._inside(p1[0], p1[1]) || T._inside(p2[0], p2[1])
                    }
                    //两个以上交点
                    return true;
                }

                /**
                 * Returns the intersection rectangle of Rectangle1 and Rectangle2.
                 * 矩形1与2的相交区域
                 * @return {Rect} If not intersects return null.
                 */
                intersection(rect: Rect) {
                    if (this.isEmpty() || rect.isEmpty()) return null;

                    let rect1 = this, rect2 = rect,
                        t = M.max(rect1.y, rect2.y),
                        r = M.min(rect1.x + rect1.w, rect2.x + rect2.w),
                        b = M.min(rect1.y + rect1.h, rect2.y + rect2.h),
                        l = M.max(rect1.x, rect2.x);

                    return (b > t && r > l) ? new Rect(l, t, r - l, b - t) : null
                }

                bounds(): Rect {
                    return this.clone()
                }

                /**
                 * Returns four borders of the Rectangle.
                 */
                edges() {
                    let p4 = this.vertexes();
                    return [
                        S.toSegment(p4[0], p4[1])
                        , S.toSegment(p4[1], p4[2])
                        , S.toSegment(p4[2], p4[3])
                        , S.toSegment(p4[3], p4[0])
                    ]
                }

                /**
                 * Computes the union of this <code>Rectangle</code> with the
                 * specified <code>Rectangle</code>. Returns a new
                 * <code>Rectangle</code> that
                 * represents the union of the two rectangles.
                 * @param r the specified <code>Rectangle</code>
                 * @return    the smallest <code>Rectangle</code> containing both
                 *            the specified <code>Rectangle</code> and this
                 *            <code>Rectangle</code>.
                 */
                union(r: Rect) {
                    let T = this,
                        tx2 = T.w,
                        ty2 = T.h;
                    if ((tx2 | ty2) < 0) {
                        return r.clone();
                    }
                    let rx2 = r.w,
                        ry2 = r.h;
                    if ((rx2 | ry2) < 0) {
                        return T.clone();
                    }
                    let tx1 = T.x,
                        ty1 = T.y;
                    tx2 += tx1;
                    ty2 += ty1;
                    let rx1 = r.x,
                        ry1 = r.y;
                    rx2 += rx1;
                    ry2 += ry1;
                    if (tx1 > rx1) tx1 = rx1;
                    if (ty1 > ry1) ty1 = ry1;
                    if (tx2 < rx2) tx2 = rx2;
                    if (ty2 < ry2) ty2 = ry2;
                    tx2 -= tx1;
                    ty2 -= ty1;

                    return new Rect(tx1, ty1, tx2, ty2)
                }
            }
        }

    }
}

import Rect = JS.math.geom.Rect;