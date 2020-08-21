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

            let P = Point2, F = Floats, L = Line, S = Segment;

            export class Ellipse implements Shape {
                /**
                 * Centre point's X.
                 */
                x: number;
                /**
                 * Centre point's Y.
                 */
                y: number;
                /**
                 * x radius.
                 */
                rx: number;
                /**
                 * y radius.
                 */
                ry: number;

                static toEllipse(c: ArrayPoint2, rx: number, ry: number) {
                    return new Ellipse(c[0], c[1], rx, ry)
                }

                constructor()
                constructor(x: number, y: number, rx: number, ry: number)
                constructor(x?: number, y?: number, rx?: number, ry?: number) {
                    this.x = x || 0;
                    this.y = y || 0;
                    this.rx = rx || 0;
                    this.ry = ry || 0;
                }

                set(c: Ellipse): this
                set(p: Point2 | ArrayPoint2, rx: number, ry: number): this
                set(c: Ellipse | Point2 | ArrayPoint2, rx?: number, ry?: number): this {
                    if (arguments.length == 1) {
                        this.x = (<Ellipse>c).x;
                        this.y = (<Ellipse>c).y;
                        this.rx = (<Ellipse>c).rx;
                        this.ry = (<Ellipse>c).ry;
                    } else {
                        let p: ArrayPoint2 = P.toArray(<any>c);
                        this.x = p[0];
                        this.y = p[1];
                        this.rx = rx;
                        this.ry = ry;
                    }

                    return this
                }


                isEmpty(): boolean {
                    return this.rx <= 0 || this.ry <= 0
                }

                clone() {
                    return <this>new Ellipse(this.x, this.y, this.rx, this.ry)
                }

                equals(s: Ellipse): boolean {
                    return F.equal(this.x, s.x) && F.equal(this.y, s.y) && F.equal(this.rx, s.rx) && F.equal(this.ry, s.ry)
                }

                inside(s: ArrayPoint2 | Segment | Rect | Triangle): boolean {
                    if (!s || this.isEmpty()) return false;

                    if (Types.isArray(s)) {
                        let dx = s[0]-this.x,
                        dy = s[1]-this.y,
                        rxx = this.rx*this.rx,
                        ryy = this.ry*this.ry;
                        return !this.isEmpty() && F.greater(1, (dx*dx)/rxx+(dy*dy)/ryy)
                    }
                    if ((<Shape>s).isEmpty()) return false;

                    return (<Shape>s).vertexes().every(p => {
                        return this.inside(p)
                    })
                }
                onside(p: ArrayPoint2): boolean {
                    if(this.isEmpty()) return false;

                    let dx = p[0]-this.x,
                    dy = p[1]-this.y,
                    rxx = this.rx*this.rx,
                    ryy = this.ry*this.ry;
                    return !this.isEmpty() && F.equal(1, (dx*dx)/rxx+(dy*dy)/ryy)
                }

                intersects(s: Segment | Line ): boolean {
                    throw new Error("Method not implemented.")
                }
                bounds(): Rect {
                    return new Rect(this.x - this.rx, this.y - this.ry, 2 * this.rx, 2 * this.ry)
                }

                moveTo(x: number, y: number) {
                    this.x = x;
                    this.y = y;
                    return this
                }

                perimeter(): number {
                    //较好精度椭圆周长公式
                    let a = this.rx,b = this.ry;
                    return Math.PI*(3/2*(a+b)-Math.sqrt(a*b))
                }

                area() {
                    return this.rx*this.ry*Math.PI;
                }

                vertexes(): ArrayPoint2[]
                vertexes(ps: ArrayPoint2[]): this
                vertexes(ps?: ArrayPoint2[]): any {
                    throw new Error("Method not implemented.");
                }

            }

        }
    }
}

import Ellipse = JS.math.geom.Ellipse;