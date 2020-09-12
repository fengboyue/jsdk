/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.5.0
 * @author Frank.Feng
 */
/// <reference path="../../math/Point2.ts" />

module JS {

    export namespace math {

        export namespace geom {

            export enum AngleType {
                ACUTE, //锐角
                RIGHT, //直角
                OBTUSE, //钝角
                UNKNOWN
            }
            export enum ArcType {
                /**
                 * The closure type for an open arc with no path segments
                 * connecting the two ends of the arc segment.
                 */
                OPEN, 
                /**
                 * The closure type for an arc closed by drawing straight line
                 * segments from the start and end of the arc segment to the center
                 * of the full ellipse.
                 */
                PIE
            }

            export interface Shape {
                /**
                 * Clone a new shape.
                 */
                clone(): this;
                /**
                 * Equals this shape.
                 */
                equals(s: this): boolean;
                /**
                 * The point on the border of this shape.
                 */
                onside(p: ArrayPoint2): boolean;
                /**
                 * Determine whether the point or shape is inside.
                 */
                inside(s: ArrayPoint2 | Shape): boolean;
                /**
                 * Determine whether this shape intersects with a specified shape.
                 */
                intersects(s: Shape): boolean;
                /**
                 * Gets a min bounding rectangle.
                 */
                bounds(): Rect;
                /**
                 * Returns the perimeter of this shape.
                 */
                perimeter(): number;
                /**
                 * Gets all vertexes of this shape.
                 */
                vertexes(): ArrayPoint2[];
                /**
                 * Sets all vertexes of this shape.
                 */
                vertexes(vs: ArrayPoint2[]): this;

                isEmpty(): boolean;

            }

            let P = Point2, V = Vector2;

            export class Shapes {

                static crossPoints(line: Segment | Line, sh: Shape, unClosed?: boolean) {
                    let isLine = !(line instanceof Segment),
                        vs = sh.vertexes(),
                        ps: ArrayPoint2[] = [],
                        size = vs.length,
                        isCollinear = vs.some((p1, i) => {
                            let b: Segment;
                            if (unClosed) {
                                if (i == size - 1) return false;
                                b = new Segment().set(p1, vs[i + 1])
                            } else {
                                b = new Segment().set(p1, vs[i < size - 1 ? i + 1 : 0])
                            }

                            //BUGFIX: 排除共线
                            if (Line.isCollinearLine(b, line)) return true;
                            let cp = isLine ? b.crossLine(line) : b.crossSegment(<Segment>line);
                            if (cp && ps.findIndex(p => {
                                return P.equal(p, cp)
                            }) < 0) ps.push(cp) //BUGFIX: 排除重复的交点
                            return false
                        })
                    return isCollinear ? [] : ps
                }

                static inShape(p: Point2 | ArrayPoint2, sh: Rect | Triangle, unClosed?: boolean) {
                    let vs = sh.vertexes(),
                        size = vs.length,
                        p0 = p instanceof P ? p.toArray() : p,
                        first = 0;

                    return vs.every((p1, i) => {
                        let p2: ArrayPoint2;
                        if (unClosed) {
                            if (i == size - 1) return true;
                            p2 = vs[i + 1];
                        } else {
                            p2 = vs[i < size - 1 ? i + 1 : 0];
                        }

                        let s = V.whichSide(p1, p2, p0);
                        if (s == 0) return false;
                        if (i == 0) first = s;

                        return s * first > 0
                    })
                }

                static onShape(p: Point2 | ArrayPoint2, sh: Shape, unClosed?: boolean) {
                    let vs = sh.vertexes(),
                        size = vs.length,
                        p0 = p instanceof P ? p.toArray() : p;

                    if (size == 2) {//特殊处理
                        let p1 = vs[0], p2 = vs[1];
                        return Segment.inSegment(p1, p2, p0)
                    }

                    return vs.some((p1, i) => {
                        let p2: ArrayPoint2;
                        if (unClosed) {
                            if (i == size - 1) return false;
                            p2 = vs[i + 1];
                        } else {
                            p2 = vs[i < size - 1 ? i + 1 : 0];
                        }
                        return Segment.inSegment(p1, p2, p0)
                    })
                }

                
            }


        }
    }
}

import Shape = JS.math.geom.Shape;
import Shapes = JS.math.geom.Shapes;
import AngleType = JS.math.geom.AngleType;
import ArcType = JS.math.geom.ArcType;