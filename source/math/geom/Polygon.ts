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

        export namespace geom {

            let M = Math, N = Number;

            /**
             * Polygon 类封装了坐标空间中封闭的二维区域的描述。此区域以任意条线段为边界，每条线段都是多边形的一条边。
             * 在内部，一个多边形包含一组 (x,y) 坐标对，其中每个坐标对应多边形的一个顶点，且两个连续的坐标对是多边形一条边的端点。
             * 第一个和最后一个 (x,y) 坐标对通过一条线段相连，形成一个封闭的多边形。
             * 此 Polygon 是按奇-偶性旋绕规则来定义的。
             */
            export class Polygon implements Shape {

                protected _points: Array<ArrayPoint2>;
                private _bounds: Rect;

                constructor()
                constructor(points: Array<ArrayPoint2>)
                constructor(points?: Array<ArrayPoint2>) {
                    this._points = points || []
                }

                isEmpty(): boolean {
                    return this._points.length == 0
                }

                numberVertexes() {
                    return this._points.length
                }

                clone() {
                    return <this>new Polygon(this._points.slice())
                }

                private _contains(x: number, y: number) {
                    let T = this,
                        len = T.numberVertexes();
                    if (len <= 2 || !T.bounds().inside([x, y])) return false;

                    let hits = 0,
                        lastx = T._points[len - 1][0],
                        lasty = T._points[len - 1][1],
                        curx, cury;

                    // Walk the edges of the polygon
                    for (let i = 0; i < len; lastx = curx, lasty = cury, i++) {
                        let pi = T._points[i], pj = T._points[i < len - 1 ? i + 1 : 0];
                        if (Segment.inSegment(pi, pj, [x, y])) return false;//BUGFIX: 判断点在边上

                        curx = pi[0];
                        cury = pi[1];

                        if (cury == lasty) {
                            continue;
                        }

                        let leftx;
                        if (curx < lastx) {
                            if (x >= lastx) {
                                continue;
                            }
                            leftx = curx;
                        } else {
                            if (x >= curx) {
                                continue;
                            }
                            leftx = lastx;
                        }

                        let test1, test2;
                        if (cury < lasty) {
                            if (y < cury || y >= lasty) {
                                continue;
                            }
                            if (x < leftx) {
                                hits++;
                                continue;
                            }
                            test1 = x - curx;
                            test2 = y - cury;
                        } else {
                            if (y < lasty || y >= cury) {
                                continue;
                            }
                            if (x < leftx) {
                                hits++;
                                continue;
                            }
                            test1 = x - lastx;
                            test2 = y - lasty;
                        }

                        if (test1 < (test2 / (lasty - cury) * (lastx - curx))) {
                            hits++;
                        }
                    }

                    return ((hits & 1) != 0);
                }

                inside(s: ArrayPoint2): boolean {
                    return s && !this.isEmpty() && this._contains(s[0], s[1])
                }
                onside(p: ArrayPoint2): boolean {
                    return !this.isEmpty() && Shapes.onShape(p, this)
                }

                intersects(s: Segment | Line | Circle | Rect): boolean {
                    if (!s || this.isEmpty() || s.isEmpty()) return false;

                    let size = this.numberVertexes();
                    return this._points.some((p, i) => {
                        let x1 = p[0], y1 = p[1],
                            px: ArrayPoint2 = this._points[i < size - 1 ? (i + 1) : 0];
                        return s.intersects(new Segment(x1, y1, px[0], px[1]))
                    });
                }
                bounds(): Rect {
                    if (this.numberVertexes() == 0) return new Rect();
                    if (this._bounds == null) this._calculateBounds();
                    return this._bounds.bounds();
                }

                /*
                * Calculates the bounding box of the points passed to the constructor.
                */
                private _calculateBounds() {
                    let minX = N.MAX_VALUE,
                        minY = N.MAX_VALUE,
                        maxX = N.MIN_VALUE,
                        maxY = N.MIN_VALUE;

                    this._points.forEach(p => {
                        minX = M.min(minX, p[0]);
                        maxX = M.max(maxX, p[0]);
                        minY = M.min(minY, p[1]);
                        maxY = M.max(maxY, p[1]);
                    })
                    this._bounds = new Rect(minX, minY,
                        maxX - minX,
                        maxY - minY);
                }
                /*
                * Resizes the bounding box to accommodate the specified coordinates.
                */
                private _updateBounds(x: number, y: number) {
                    let T = this;
                    if (x < T._bounds.x) {
                        T._bounds.w = T._bounds.w + (T._bounds.x - x);
                        T._bounds.x = x;
                    }
                    else {
                        T._bounds.w = M.max(T._bounds.w, x - T._bounds.x);
                    }

                    if (y < T._bounds.y) {
                        T._bounds.h = T._bounds.h + (T._bounds.y - y);
                        T._bounds.y = y;
                    }
                    else {
                        T._bounds.h = M.max(T._bounds.h, y - T._bounds.y);
                    }
                }

                /**
                 * Appends new point to this <code>Polygon</code>.
                 */
                addPoint(x: number, y: number) {
                    this._points.push([x, y])
                    if (this._bounds != null) this._updateBounds(x, y);
                    return this
                }

                vertexes(): Array<ArrayPoint2>
                vertexes(ps: Array<ArrayPoint2>): this
                vertexes(ps?: Array<ArrayPoint2>): any {
                    if (arguments.length == 0) return this._points;
                    this._points = ps;
                    return this
                }

                protected _len;
                perimeter(): number {
                    if (this._len != void 0) return this._len;

                    this._len = 0;
                    let size = this.numberVertexes();
                    if (size < 2) return 0;
                    this._points.forEach((p, i) => {
                        let x1 = p[0], y1 = p[1],
                            px: ArrayPoint2 = this._points[i < size - 1 ? (i + 1) : 0];
                        this._len += Point2.distance(x1, y1, px[0], px[1])
                    })
                    return this._len
                }

                equals(s: Polygon | Polyline): boolean {
                    let ps = s.vertexes();
                    if (ps.length != this.numberVertexes()) return false;

                    return this._points.every((p, i) => {
                        let pi = ps[i];
                        return Point2.equal(p[0], p[1], pi[0], pi[1])
                    })
                }
            }
        }

    }
}

import Polygon = JS.math.geom.Polygon;