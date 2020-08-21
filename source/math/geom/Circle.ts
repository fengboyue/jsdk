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
            
            export class Circle implements Shape {
                /**
                 * Centre point's X.
                 */
                x: number;
                /**
                 * Centre point's Y.
                 */
                y: number;
                /**
                 * radius of the circle.
                 */
                r: number;

                static toCircle(c: ArrayPoint2, r: number) {
                    return new Circle(c[0], c[1], r)
                }

                constructor()
                constructor(x: number, y: number, r: number)
                constructor(x?: number, y?: number, r?: number) {
                    this.x = x || 0;
                    this.y = y || 0;
                    this.r = r || 0;
                }

                set(c: Circle):this
                set(p: Point2|ArrayPoint2, r: number):this
                set(c: Circle|Point2|ArrayPoint2, r?: number):this{
                    if(arguments.length==1){
                        this.x = (<Circle>c).x;
                        this.y = (<Circle>c).y;
                        this.r = (<Circle>c).r;
                    }else{
                        let p:ArrayPoint2 = P.toArray(<any>c);
                        this.x = p[0];
                        this.y = p[1];
                        this.r = r;
                    }

                    return this
                }
                

                isEmpty(): boolean {
                    return this.r <= 0
                }

                clone() {
                    return <this>new Circle(this.x, this.y, this.r)
                }

                equals(s: Circle): boolean {
                    return F.equal(this.x, s.x) && F.equal(this.y, s.y) && F.equal(this.r, s.r)
                }

                inside(s: ArrayPoint2 | Segment | Circle | Rect | Triangle): boolean {
                    if (!s || this.isEmpty()) return false;

                    if (Types.isArray(s)) return F.greater(this.r * this.r, P.distanceSq(this.x, this.y, s[0], s[1]));
                    if ((<Shape>s).isEmpty()) return false;

                    if (s instanceof Rect || s instanceof S || s instanceof Triangle) return s.vertexes().every(p => {
                        return this.inside(p)
                    })
                    let dd = P.distanceSq(this.x, this.y, (<Circle>s).x, (<Circle>s).y),
                        rr = this.r - (<Circle>s).r;
                    return F.less(dd, rr * rr)
                }
                onside(p: ArrayPoint2): boolean {
                    return !this.isEmpty() && F.equal(this.r * this.r, P.distanceSq(this.x, this.y, p[0], p[1]))
                }

                intersects(s: Segment | Line | Circle | Rect ): boolean {
                    if (!s || this.isEmpty() || s.isEmpty()) return false;

                    if (s instanceof L) {
                        let d = L.distanceSqToPoint(s.p1(),s.p2(), [this.x,this.y]),
                        rr = this.r*this.r;
                        if(F.greaterEqual(d,rr)) return false;
                        if(!(s instanceof S)) return true; //直线与圆相交

                        //判断线段
                        return F.equal(d, S.distanceSqToPoint(s.p1(),s.p2(),[this.x,this.y]))
                    }
                    if (s instanceof Circle) {
                        let dd = P.distanceSq(this.x, this.y, s.x, s.y),
                            rr = this.r + s.r;
                        return F.less(dd, rr * rr)
                    }

                    if(s.inside(this) || this.inside(s)) return true;

                    return s.edges().some(b => {
                        return this.intersects(b)
                    })
                }
                bounds(): Rect {
                    return new Rect(this.x - this.r, this.y - this.r, 2 * this.r, 2 * this.r)
                }

                moveTo(x: number, y: number) {
                    this.x = x;
                    this.y = y;
                    return this
                }

                perimeter(): number {
                    return 2 * this.r * Math.PI;
                }

                area() {
                    return this.r * this.r * Math.PI;
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

import Circle = JS.math.geom.Circle;