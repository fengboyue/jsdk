/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.5.0
 * @author Frank.Feng
 */
/// <reference path="Shape.ts" />

module JS {

    export namespace math {

        let P = Point2, V = Vector2;
        
        export namespace geom {

            export class Line implements Shape {
                x1: number;
                y1: number;
                x2: number;
                y2: number;

                static X = new Line(0, 0, 1, 0);
                static Y = new Line(0, 0, 0, 1);

                static toLine(p1: ArrayPoint2, p2: ArrayPoint2): Line {
                    return new Line().set(p1, p2)
                }

                /**
                 * Caculate the slope of Segment P1P2.
                 * 计算线段(p1,p2)的斜率。当线段与X轴垂直时，斜率不存在
                 * @return {number} when P1P2 is vertical to the X, then return null.
                 */
                static slope(
                    p1: ArrayPoint2,
                    p2: ArrayPoint2
                ): number {
                    let a = p2[0] - p1[0], b = p2[1] - p1[1];
                    return a == 0 ? null : b / a;
                }

                /**
                 * Returns the relation position of Line1(p1,p2) and Line2(p3,p4).
                 * 直线1与直线2的位置关系。
                 * 
                 * @return {Int} -1 is Parallel and Non-Collinear; 0 is Collinear; 1 is Cross and Non-Vertical; 2 is Cross and Vertical.
                 */
                static position(
                    p1: ArrayPoint2, p2: ArrayPoint2,
                    p3: ArrayPoint2, p4: ArrayPoint2
                ): number {
                    let T = this, same1 = P.equal(p1, p2), same2 = P.equal(p3, p4);
                    if (same1 && same2) return 0;
                    if (same1 && !same2) return T.isCollinear(p1, p3, p4) ? 0 : -1;
                    if (!same1 && same2) return T.isCollinear(p1, p2, p3) ? 0 : -1;

                    let k1 = T.slope(p1, p2), k2 = T.slope(p3, p4);
                    if ((k1 == null && k2 === 0) || (k2 == null && k1 === 0)) return 2;

                    if ((k1 == null && k2 == null) || Floats.equal(k1, k2)) {//平行
                        return V.whichSide(p1, p2, p3) == 0 ? 0 : -1
                    } else {//相交
                        return Floats.equal(k1 * k2, -1) ? 2 : 1
                    }
                }

                /**
                 * P1,P2,P3 is collinear.
                 * 三点是否共线
                 */
                static isCollinear(p1: ArrayPoint2, p2: ArrayPoint2, p3: ArrayPoint2) {
                    return V.whichSide(p1, p2, p3) == 0;
                }

                /**
                 * Line is collinear with Line2.
                 * 两直线或线段是否共线
                 */
                static isCollinearLine(l1: Line | Segment, l2: Line | Segment) {
                    let p1 = l1.p1(), p2 = l1.p2(), p3 = l2.p1(), p4 = l2.p2();
                    return this.isCollinear(p1, p2, p3) && this.isCollinear(p1, p2, p4);
                }

                /**
                 * Returns the square of the distance from a point to a line.
                 * The distance measured is the distance between the specified
                 * point and the closest point on the infinitely-extended line
                 * defined by the specified coordinates.  If the specified point
                 * intersects the line, this method returns 0.0.
                 * 
                 * @return a value that is the square of the distance from the
                 *                  specified point to the specified line.
                 */
                static distanceSqToPoint(
                    p1: ArrayPoint2,
                    p2: ArrayPoint2,
                    p: ArrayPoint2) {
                    let x1 = p1[0], y1 = p1[1],
                        x2 = p2[0], y2 = p2[1],
                        px = p[0], py = p[1];
                    // Adjust vectors relative to x1,y1
                    // x2,y2 becomes relative vector from x1,y1 to end of segment
                    x2 -= x1;
                    y2 -= y1;
                    // px,py becomes relative vector from x1,y1 to test point
                    px -= x1;
                    py -= y1;
                    let dot = px * x2 + py * y2,
                        // dotprod is the length of the px,py vector
                        // projected on the x1,y1=>x2,y2 vector times the
                        // length of the x1,y1=>x2,y2 vector
                        proj = dot * dot / (x2 * x2 + y2 * y2),
                        // Distance to line is now the length of the relative point
                        // vector minus the length of its projection onto the line
                        lenSq = px * px + py * py - proj;
                    if (lenSq < 0) lenSq = 0;
                    return lenSq;
                }
                /**
                 * Returns the distance from a point to a line.
                 * The distance measured is the distance between the specified
                 * point and the closest point on the infinitely-extended line
                 * defined by the specified coordinates.  If the specified point
                 * intersects the line, this method returns 0.0.
                 *
                 * @return a value that is the distance from the specified
                 *                   point to the specified line.
                 */
                static distanceToPoint(
                    p1: ArrayPoint2,
                    p2: ArrayPoint2,
                    p: ArrayPoint2) {
                    return Math.sqrt(this.distanceSqToPoint(p1, p2, p));
                }

                constructor()
                constructor(x1: number, y1: number, x2: number, y2: number)
                constructor(x1?: number, y1?: number, x2?: number, y2?: number) {
                    this.x1 = x1 || 0;
                    this.y1 = y1 || 0;
                    this.x2 = x2 || 0;
                    this.y2 = y2 || 0;
                }

                toSegment() {
                    return new Segment(this.x1, this.y1, this.x2, this.y2)
                }

                toVector(): Vector2 {
                    return new V(this.x2-this.x1,this.y2-this.y1)
                }

                p1(): ArrayPoint2
                p1(x: number, y: number): this
                p1(x?: number, y?: number): any {
                    if (x == void 0) return [this.x1, this.y1];
                    this.x1 = x;
                    this.y1 = y;
                    return this
                }
                p2(): ArrayPoint2
                p2(x: number, y: number): this
                p2(x?: number, y?: number): any {
                    if (x == void 0) return [this.x2, this.y2];
                    this.x2 = x;
                    this.y2 = y;
                    return this
                }

                vertexes(): ArrayPoint2[]
                vertexes(ps: ArrayPoint2[]): this
                vertexes(ps?: ArrayPoint2[]): any {
                    if (arguments.length == 0) {
                        return [this.p1(), this.p2()]
                    }

                    let p1 = ps[0], p2 = ps[1];
                    this.p1(p1[0], p1[1]);
                    return this.p2(p2[0], p2[1])
                }

                set(l: Line | Segment): this
                set(p1: ArrayPoint2, p2: ArrayPoint2): this
                set(pt1: ArrayPoint2 | Line, pt2?: ArrayPoint2) {
                    let len = arguments.length,
                        p1 = len == 1 ? (<Line>pt1).p1() : <ArrayPoint2>pt1,
                        p2 = len == 1 ? (<Line>pt1).p2() : <ArrayPoint2>pt2;

                    this.x1 = p1[0];
                    this.y1 = p1[1];
                    this.x2 = p2[0];
                    this.y2 = p2[1];
                    return this
                }

                clone() {
                    return <this>new Line(this.x1, this.y1, this.x2, this.y2)
                }
                equals(s: Line): boolean {
                    return Line.position(s.p1(), s.p2(), this.p1(), this.p2()) == 0
                }
                isEmpty() {
                    return this.x1 == 0 && this.y1 == 0 && this.x2 == 0 && this.y2 == 0
                }

                inside(s: ArrayPoint2 | Segment): boolean {
                    let T = this;
                    if (!s || T.isEmpty()) return false;

                    if (Types.isArray(s)) return Line.isCollinear(T.p1(), T.p2(), <ArrayPoint2>s)

                    if ((<Segment>s).isEmpty()) return false;
                    return (<Segment>s).vertexes().every(p => {
                        return T.inside(p)
                    })
                }
                onside(p: ArrayPoint2): boolean {
                    return this.inside(p)
                }

                intersects(s: Segment | Line): boolean {
                    if (!s || this.isEmpty() || s.isEmpty()) return false;

                    let pos = Line.position(this.p1(), this.p2(), s.p1(), s.p2());
                    if (pos < 0) return false;

                    if (s instanceof Segment) {
                        return s.crossLine(this) != null
                    } else {
                        return true
                    }
                }
                bounds(): Rect {
                    return null
                }

                /**
                 * 斜率
                 */
                slope() {
                    return (this.y2 - this.y1) / (this.x2 - this.x1)
                }

                perimeter(): number {
                    return Infinity
                }

                private _cpOfLinePoint(p1: ArrayPoint2, p2: ArrayPoint2, p3: ArrayPoint2): ArrayPoint2 {
                    let p1p2 = V.toVector(p1, p2),
                        p1p3 = V.toVector(p1, p3),
                        p = p1p3.getProject(p1p2),
                        d = p.length(),
                        pp = P.polar2xy(d, p.radian());
                    return [pp[0] + p1[0], pp[1] + p1[1]]
                }

                private _cpOfLineLine(p1: ArrayPoint2, p2: ArrayPoint2, p3: ArrayPoint2, p4: ArrayPoint2): ArrayPoint2 {
                    let x1 = p1[0], y1 = p1[1],
                        x2 = p2[0], y2 = p2[1],
                        x3 = p3[0], y3 = p3[1],
                        x4 = p4[0], y4 = p4[1];
                    if (Line.position(p1, p2, p3, p4) < 1) return null;

                    let x = ((x1 - x2) * (x3 * y4 - x4 * y3) - (x3 - x4) * (x1 * y2 - x2 * y1)) / ((x3 - x4) * (y1 - y2) - (x1 - x2) * (y3 - y4)),
                        y = ((y1 - y2) * (x3 * y4 - x4 * y3) - (x1 * y2 - x2 * y1) * (y3 - y4)) / ((y1 - y2) * (x3 - x4) - (x1 - x2) * (y3 - y4));
                    return [x, y]
                }

                private _cpOfLineRay(p1: ArrayPoint2, p2: ArrayPoint2, p3: ArrayPoint2, rad: number): ArrayPoint2 {
                    let p4 = P.toPoint(p3).toward(10, rad).toArray(),
                        p = this._cpOfLineLine(p1, p2, p3, p4);
                    if (!p) return null;

                    return V.toVector(p3, p4).angle(V.toVector(p3, p)) == 0 ? p : null
                }

                /**
                 * Returns a vertical cross point with P.
                 * 求点P到直线的垂直交点。
                 */
                crossPoint(p: ArrayPoint2): ArrayPoint2 {
                    return this._cpOfLinePoint(this.p1(), this.p2(), p)
                }
                /**
                 * Returns a cross point of Line L.
                 * 求与直线的交点。
                 * @return {ArrayPoint2} If this line is parallel to Line L, then return null.
                 */
                crossLine(l: Line): ArrayPoint2 {
                    return this._cpOfLineLine(this.p1(), this.p2(), l.p1(), l.p2());
                }
                /**
                 * Returns a cross point of this line and Ray(p, rad).
                 * 直线与射线的交点。
                 * @return {ArrayPoint2} If the cross point is not exist, then return null.
                 */
                crossRay(p: ArrayPoint2, rad: number) {
                    return this._cpOfLineRay(this.p1(), this.p2(), p, rad)
                }
            }
        }
    }
}

import Line = JS.math.geom.Line;