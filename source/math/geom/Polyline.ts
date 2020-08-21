/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.5.0
 * @author Frank.Feng
 */
/// <reference path="Polygon.ts" />

module JS {

    export namespace math {

        export namespace geom {

            export class Polyline extends Polygon {

                clone() {
                    return <this>new Polyline(this._points)
                }

                inside(s: ArrayPoint2 | Segment | Rect): boolean {
                    return false
                }

                onside(p: ArrayPoint2): boolean {
                    return !this.isEmpty() && Shapes.onShape(p, this, true)
                }

                intersects(s: Segment | Line | Circle | Rect): boolean {
                    if (!s || this.isEmpty() || s.isEmpty()) return false;

                    let size = this.numberVertexes();
                    return this._points.some((p, i) => {
                        if (i >= size - 1) return false;
                        let x1 = p[0], y1 = p[1],
                            px: ArrayPoint2 = this._points[i + 1];
                        return s.intersects(new Segment(x1, y1, px[0], px[1]))
                    });
                }

                perimeter(): number {
                    if (this._len != void 0) return this._len;

                    this._len = 0;
                    let size = this.numberVertexes();
                    if (size < 2) return 0;
                    this._points.forEach((p, i) => {
                        if (i < size - 1) {
                            let x1 = p[0], y1 = p[1],
                                px: ArrayPoint2 = this._points[i + 1];
                            this._len += Point2.distance(x1, y1, px[0], px[1])
                        }
                    })
                    return this._len
                }

                equals(s: Polyline): boolean {
                    return super.equals(s)
                }

            }
        }

    }
}

import Polyline = JS.math.geom.Polyline;