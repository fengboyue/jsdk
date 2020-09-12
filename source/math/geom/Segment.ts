/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.5.0
 * @author Frank.Feng
 */
/// <reference path="Line.ts" />

module JS {

    export namespace math {

        export namespace geom {

            //判断p是否在p1p2为对角点的矩形内 
            let M = Math, P = Point2, L = Line, V = Vector2;
                
            /**
             * Returns an indicator of where the specified point
             * {@code (px,py)} lies with respect to the line segment from
             * {@code (x1,y1)} to {@code (x2,y2)}.
             * The return value can be either 1, -1, or 0 and indicates
             * in which direction the specified line must pivot around its
             * first end point, {@code (x1,y1)}, in order to point at the
             * specified point {@code (px,py)}.
             * <p>A return value of 1 indicates that the line segment must
             * turn in the direction that takes the positive X axis towards
             * the negative Y axis.  In the default coordinate system used by
             * Java 2D, this direction is counterclockwise.
             * <p>A return value of -1 indicates that the line segment must
             * turn in the direction that takes the positive X axis towards
             * the positive Y axis.  In the default coordinate system, this
             * direction is clockwise.
             * <p>A return value of 0 indicates that the point lies
             * exactly on the line segment.  Note that an indicator value
             * of 0 is rare and not useful for determining collinearity
             * because of floating point rounding issues.
             * <p>If the point is colinear with the line segment, but
             * not between the end points, then the value will be -1 if the point
             * lies "beyond {@code (x1,y1)}" or 1 if the point lies
             * "beyond {@code (x2,y2)}".
             *
             * @param x1 the X coordinate of the start point of the
             *           specified line segment
             * @param y1 the Y coordinate of the start point of the
             *           specified line segment
             * @param x2 the X coordinate of the end point of the
             *           specified line segment
             * @param y2 the Y coordinate of the end point of the
             *           specified line segment
             * @param px the X coordinate of the specified point to be
             *           compared with the specified line segment
             * @param py the Y coordinate of the specified point to be
             *           compared with the specified line segment
             * @return an integer that indicates the position of the third specified
             *                  coordinates with respect to the line segment formed
             *                  by the first two specified coordinates.
             */
            let relativeCCW = function (
                x1: number, y1: number,
                x2: number, y2: number,
                px: number, py: number) {
                x2 -= x1;
                y2 -= y1;
                px -= x1;
                py -= y1;
                let ccw = px * y2 - py * x2;
                if (ccw == 0.0) {
                    // The point is colinear, classify based on which side of
                    // the segment the point falls on.  We can calculate a
                    // relative value using the projection of px,py onto the
                    // segment - a negative value indicates the point projects
                    // outside of the segment in the direction of the particular
                    // endpoint used as the origin for the projection.
                    ccw = px * x2 + py * y2;
                    if (ccw > 0.0) {
                        // Reverse the projection to be relative to the original x2,y2
                        // x2 and y2 are simply negated.
                        // px and py need to have (x2 - x1) or (y2 - y1) subtracted
                        //    from them (based on the original values)
                        // Since we really want to get a positive answer when the
                        //    point is "beyond (x2,y2)", then we want to calculate
                        //    the inverse anyway - thus we leave x2 & y2 negated.
                        px -= x2;
                        py -= y2;
                        ccw = px * x2 + py * y2;
                        if (ccw < 0.0) {
                            ccw = 0.0;
                        }
                    }
                }
                return (ccw < 0.0) ? -1 : ((ccw > 0.0) ? 1 : 0);
            },

            inDiagonalRect = (p1: ArrayPoint2, p2: ArrayPoint2, p: ArrayPoint2) => {
                if (P.equal(p, p1) || P.equal(p, p2)) return true;
                return M.min(p1[0], p2[0]) <= p[0] && p[0] <= M.max(p1[0], p2[0])
                    && M.min(p1[1], p2[1]) <= p[1] && p[1] <= M.max(p1[1], p2[1]);
            };

            export class Segment extends Line {

                static toSegment(p1: ArrayPoint2, p2: ArrayPoint2): Segment {
                    return new Segment().set(p1, p2)
                }

                static inSegment(p1: ArrayPoint2, p2: ArrayPoint2, p:ArrayPoint2) {
                    return inDiagonalRect(p1, p2, p) && V.whichSide(p1, p2, p) == 0
                }

                /**
                 * Returns the square of the distance from a point to a line segment.
                 * The distance measured is the distance between the specified
                 * point and the closest point between the specified end points.
                 * If the specified point intersects the line segment in between the
                 * end points, this method returns 0.0.
                 *
                 * @return a value that is the square of the distance from the
                 *                  specified point to the specified line segment.
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
                        proj;
                    if (dot <= 0.0) {
                        // px,py is on the side of x1,y1 away from x2,y2
                        // distance to segment is length of px,py vector
                        // "length of its (clipped) projection" is now 0.0
                        proj = 0.0;
                    } else {
                        // switch to backwards vectors relative to x2,y2
                        // x2,y2 are already the negative of x1,y1=>x2,y2
                        // to get px,py to be the negative of px,py=>x2,y2
                        // the dot product of two negated vectors is the same
                        // as the dot product of the two normal vectors
                        px = x2 - px;
                        py = y2 - py;
                        dot = px * x2 + py * y2;
                        if (dot <= 0.0) {
                            // px,py is on the side of x2,y2 away from x1,y1
                            // distance to segment is length of (backwards) px,py vector
                            // "length of its (clipped) projection" is now 0.0
                            proj = 0.0;
                        } else {
                            // px,py is between x1,y1 and x2,y2
                            // dotprod is the length of the px,py vector
                            // projected on the x2,y2=>x1,y1 vector times the
                            // length of the x2,y2=>x1,y1 vector
                            proj = dot * dot / (x2 * x2 + y2 * y2);
                        }
                    }
                    // Distance to line is now the length of the relative point
                    // vector minus the length of its projection onto the line
                    // (which is zero if the projection falls outside the range
                    //  of the line segment).
                    let lenSq = px * px + py * py - proj;
                    if (lenSq < 0) lenSq = 0;
                    return lenSq;
                }

                /**
                 * Returns the distance from a point to a line segment.
                 * The distance measured is the distance between the specified
                 * point and the closest point between the specified end points.
                 * If the specified point intersects the line segment in between the
                 * end points, this method returns 0.0.
                 *
                 * @return a value that is the distance from the specified point
                 *                          to the specified line segment.
                 */
                static distanceToPoint(
                    p1: ArrayPoint2,
                    p2: ArrayPoint2,
                    p: ArrayPoint2) {
                    return M.sqrt(this.distanceSqToPoint(p1, p2, p));
                }

                /**
                 * Tests if the line segment from p1 to p2 intersects the line segment from p3 to p4.
                 *
                 * @return <code>true</code> if the first specified line segment
                 *                  and the second specified line segment intersect
                 *                  each other; <code>false</code> otherwise.
                 */
                static intersect(
                    p1: ArrayPoint2,
                    p2: ArrayPoint2,
                    p3: ArrayPoint2,
                    p4: ArrayPoint2
                ) {
                    let x1 = p1[0], y1 = p1[1],
                        x2 = p2[0], y2 = p2[1],
                        x3 = p3[0], y3 = p3[1],
                        x4 = p4[0], y4 = p4[1];

                    return ((relativeCCW(x1, y1, x2, y2, x3, y3) *
                        relativeCCW(x1, y1, x2, y2, x4, y4) <= 0)
                        && (relativeCCW(x3, y3, x4, y4, x1, y1) *
                            relativeCCW(x3, y3, x4, y4, x2, y2) <= 0));
                }

                toLine() {
                    return new Line(this.x1, this.y1, this.x2, this.y2)
                }

                equals(s: Segment, isStrict?: boolean): boolean {
                    let p1: ArrayPoint2 = [this.x1, this.y1],
                        p2: ArrayPoint2 = [this.x2, this.y2],
                        p3: ArrayPoint2 = [s.x1, s.y1],
                        p4: ArrayPoint2 = [s.x2, s.y2];

                    if (isStrict) return P.equal(p1, p3) && P.equal(p2, p4)
                    return (P.equal(p1, p3) && P.equal(p2, p4)) || (P.equal(p1, p4) && P.equal(p2, p3))
                }

                inside(s: ArrayPoint2 | Segment): boolean {
                    let T = this;
                    if(!s || T.isEmpty()) return false;

                    if (Types.isArray(s)) return Shapes.onShape(<ArrayPoint2>s, T);
                    if((<Shape>s).isEmpty()) return false;

                    if (s instanceof Segment) return T.inside([s.x1, s.y1]) && T.inside([s.x2, s.y2])
                }
                intersects(s: Segment | Line): boolean {
                    if(!s || this.isEmpty() || s.isEmpty()) return false;

                    let pos = L.position(this.p1(),this.p2(),s.p1(),s.p2());
                    if(pos<0) return false;
                    
                    if(s instanceof Segment) {
                        return s.crossSegment(this)!=null//TODO: 可以用Segment.intersects替换
                    }else{
                        return true
                    }
                }
                bounds(): Rect {
                    let T = this,
                        minX = M.min(T.x1, T.x2),
                        maxX = M.max(T.x1, T.x2),
                        minY = M.min(T.y1, T.y2),
                        maxY = M.max(T.y1, T.y2);
                    return new Rect(minX, minY, maxX - minX, maxY - minY)
                }
                perimeter(): number {
                    return P.distance(this.x1, this.y1, this.x2, this.y2)
                }

                /**
                 * Returns the ratio point of this segment.
                 * 定比分点公式
                 * 
                 * @param {Number} ratio Must not equals -1.
                 * @return {ArrayPoint2}
                 */
                ratioPoint(ratio: number): ArrayPoint2 {
                    let p1 = this.p1(), p2 = this.p2();
                    return [(p1[0] + ratio * p2[0]) / (1 + ratio),
                    (p1[1] + ratio * p2[1]) / (1 + ratio)];
                }

                /**
                 * Returns the middle point of Segment P1P2.
                 * 返回线段的中点
                 */
                midPoint() {
                    return this.ratioPoint(1);
                }

                /**
                 * Returns a cross point of Segment P1P2 and Segment P3P4.
                 * 线段(p1,p2)与线段(p3,p4)的交点。
                 * @return {ArrayPoint2} If the cross point is not exist, then return null.
                 */
                private _cpOfSS(s1: Segment, s2: Segment): ArrayPoint2 {
                    let p = s1.toLine().crossLine(s2.toLine());
                    if (!p) return null;

                    return s1.inside(p) && s2.inside(p) ? p : null
                }
                /**
                 * Returns a cross point of Segment P1P2 and Line P3P4.
                 * 直线(p1,p2)与线段(p3,p4)的交点。
                 * @return {ArrayPoint2} If the cross point is not exist, then return null.
                 */
                private _cpOfSL(s1:Segment, s2:Line): ArrayPoint2 {
                    let p = s1.toLine().crossLine(s2);
                    if (!p) return null;

                    return s1.inside(p) ? p : null
                }
                /**
                 * Returns a cross point of Segment P1P2 and Ray(p3, rad).
                 * 线段与射线的交点。
                 * @return {ArrayPoint2} If the cross point is not exist, then return null.
                 */
                private _cpOfSR(s1: Segment, p3: ArrayPoint2, rad: number): ArrayPoint2 {
                    let p4 = P.toPoint(p3).toward(10, rad).toArray(),
                        p = this._cpOfSL(s1, L.toLine(p3,p4));
                    if (!p) return null;

                    return V.toVector(p3, p4).parallelTo(V.toVector(p3, p)) ? p : null
                }

                /**
                 * Returns a cross point with a segment.
                 * 求与线段的交点。
                 */
                crossSegment(s: Segment) :ArrayPoint2 {
                    return this._cpOfSS(this,s)
                }
                /**
                 * Returns a cross point of Line L.
                 * 求与直线的交点。
                 * @return {ArrayPoint2} If this segment is parallel to Line L, then return null.
                 */
                crossLine(l: Line) :ArrayPoint2 {
                    return this._cpOfSL(this,l)
                }
                /**
                 * Returns a cross point of this segment and Ray(p, rad).
                 * 求与射线的交点。
                 * @return {ArrayPoint2} If the cross point is not exist, then return null.
                 */
                crossRay(p: ArrayPoint2, rad: number){
                    return this._cpOfSR(this, p, rad)
                }
                
            }
        }
    }
}

import Segment = JS.math.geom.Segment;