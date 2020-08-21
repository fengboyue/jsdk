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

            let P = Point2, V = Vector2, N = Numbers, S = Segment;
            
            export class Triangle implements Shape {
                x1: number;
                y1: number;
                x2: number;
                y2: number;
                x3: number;
                y3: number;

                static toTri(p1: ArrayPoint2, p2: ArrayPoint2, p3: ArrayPoint2) {
                    return new Triangle().set(p1, p2, p3)
                }

                constructor()
                constructor(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number)
                constructor(x1?: number, y1?: number, x2?: number, y2?: number, x3?: number, y3?: number) {
                    this.x1 = x1 || 0;
                    this.y1 = y1 || 0;
                    this.x2 = x2 || 0;
                    this.y2 = y2 || 0;
                    this.x3 = x3 || 0;
                    this.y3 = y3 || 0;
                }

                isEmpty(): boolean {
                    return Line.isCollinear(this.p1(), this.p2(), this.p3());
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
                p3(): ArrayPoint2
                p3(x: number, y: number): this
                p3(x?: number, y?: number): any {
                    if (x == void 0) return [this.x3, this.y3];
                    this.x3 = x;
                    this.y3 = y;
                    return this
                }

                set(t: Triangle): this
                set(p1: ArrayPoint2, p2: ArrayPoint2, p3: ArrayPoint2): this
                set(p1: ArrayPoint2 | Triangle, p2?: ArrayPoint2, p3?: ArrayPoint2) {
                    if (arguments.length == 1) return this.vertexes((<Triangle>p1).vertexes());
                    return this.vertexes([<ArrayPoint2>p1, p2, p3])
                }

                vertexes(): ArrayPoint2[]
                vertexes(ps: ArrayPoint2[]): this
                vertexes(ps?: ArrayPoint2[]): any {
                    let T = this;
                    if (arguments.length == 0) return [[T.x1, T.y1], [T.x2, T.y2], [T.x3, T.y3]]

                    let p1 = ps[0], p2 = ps[1], p3 = ps[2];
                    this.x1 = p1[0];
                    this.y1 = p1[1];
                    this.x2 = p2[0];
                    this.y2 = p2[1];
                    this.x3 = p3[0];
                    this.y3 = p3[1];
                    return this
                }

                clone() {
                    let T = this;
                    return <this>new Triangle(T.x1, T.y1, T.x2, T.y2, T.x3, T.y3)
                }

                equals(s: Triangle): boolean {
                    if (this.isEmpty() && s.isEmpty()) return true;
                    return Arrays.same(this.vertexes(), s.vertexes(), (p1, p2) => { return P.equal(p1, p2) })
                }

                inside(s: ArrayPoint2 | Segment | Rect | Circle): boolean {
                    let T = this;
                    if (!s || T.isEmpty()) return false;

                    if (Types.isArray(s)) return Shapes.inShape(<ArrayPoint2>s, this);
                    if ((<Shape>s).isEmpty()) return false;

                    if(s instanceof Circle) {
                        //处理圆
                        let c = <Circle>s;
                        //圆心必须在三角形内
                        if(!Shapes.inShape([c.x,c.y], this)) return false;
                        //计算圆心到边的距离
                        let rr = c.r*c.r;
                        return this.edges().every(b=>{
                            return Floats.greaterEqual(Line.distanceSqToPoint(b.p1(),b.p2(),[c.x,c.y]),rr)
                        })
                    }

                    return (<Shape>s).vertexes().every(p => {
                        return T.inside(p) || T.onside(p)
                    })
                }

                onside(p: ArrayPoint2): boolean {
                    return !this.isEmpty() && Shapes.onShape(p, this)
                }

                private _addPoint(a: ArrayPoint2[], p: ArrayPoint2) {
                    if (p && a.findIndex(b => { return P.equal(b, p) }) < 0) a.push(p)
                }

                intersects(s: Segment | Line | Rect): boolean {
                    let T = this;
                    if (!s || T.isEmpty() || s.isEmpty()) return false;

                    if (s instanceof Rect) {
                        //如果矩形在内部则必定相交
                        if (T.inside(s)) return true;
                        //求所有矩形边与三角型边的有效交点
                        let ps: ArrayPoint2[] = [];
                        T.edges().forEach(b => {
                            let cps = Shapes.crossPoints(b, s);
                            cps.forEach(it => {
                                T._addPoint(ps, it)
                            })
                        })
                        return ps.length >= 2
                    }

                    let ps = Shapes.crossPoints(s, T), len = ps.length;
                    if (len == 0) return false;
                    if (len >= 2) return true;
                    if (!(s instanceof S)) return false;

                    //是线段且只有一个交点：判断是否有一个顶点在三角形内部
                    let p1 = s.p1(), p2 = s.p2();
                    return T.inside(p1) || T.inside(p2)
                }
                bounds(): Rect {
                    let T = this,
                        minX = N.min(T.x1, T.x2, T.x3),
                        minY = N.min(T.y1, T.y2, T.y3),
                        maxX = N.max(T.x1, T.x2, T.x3),
                        maxY = N.max(T.y1, T.y2, T.y3),
                        w = maxX - minX, h = maxY - minY,
                        x = minX, y = minY;

                    return new Rect(x, y, w, h)
                }

                edges() {
                    let ps = this.vertexes(),
                        p1 = ps[0], p2 = ps[1], p3 = ps[2],
                        a = new S(p1[0], p1[1], p2[0], p2[1]),
                        b = new S(p2[0], p2[1], p3[0], p3[1]),
                        c = new S(p3[0], p3[1], p1[0], p1[1]);
                    return [a, b, c]
                }

                private _sides() {
                    let ps = this.vertexes(),
                        p1 = ps[0], p2 = ps[1], p3 = ps[2],
                        a = P.distance(p1[0], p1[1], p2[0], p2[1]),
                        b = P.distance(p2[0], p2[1], p3[0], p3[1]),
                        c = P.distance(p3[0], p3[1], p1[0], p1[1]);
                    return [a, b, c]
                }

                perimeter(): number {
                    if (this.isEmpty()) return 0;

                    let s = this._sides();
                    return s[0] + s[1] + s[2]
                }

                /**
                 * Returns three degree angles.
                 */
                angles(): number[] {
                    let T = this;
                    if (T.isEmpty()) return [];

                    let a1 = new V().set(T.p1(), T.p2()).angle(new V().set(T.p1(), T.p3())),
                        a2 = new V().set(T.p2(), T.p1()).angle(new V().set(T.p2(), T.p3())),
                        d1 = Radians.rad2deg(a1),
                        d2 = Radians.rad2deg(a2),
                        d3 = 180 - d1 - d2;
                    return [d1, d2, d3]
                }

                angleType(): AngleType {
                    if (this.isEmpty()) return AngleType.UNKNOWN;

                    let as = this.angles(),
                        d1 = as[0] - 90, d2 = as[1] - 90, d3 = as[2] - 90;

                    if (d1 == 0 || d2 == 0 || d3 == 0) return AngleType.RIGHT;
                    if (d1 < 0 || d2 < 0 || d3 < 0) return AngleType.ACUTE;
                    return AngleType.OBTUSE
                }

                area() {
                    if (this.isEmpty()) return 0;
                    let s = this._sides(),
                        a = s[0],
                        b = s[1],
                        c = s[2],
                        p = (a + b + c) / 2;
                    return Math.sqrt(p * (p - a) * (p - b) * (p - c));
                }

                /**
                 * Returns the center of gravity.
                 * 求三角形的重心
                 */
                gravityPoint(): ArrayPoint2 {
                    let T = this;
                    if (T.isEmpty()) return null;

                    let p1 = T.p1(), p2 = T.p2(), p3 = T.p3();
                    return [(p1[0] + p2[0] + p3[0]) / 3, (p1[1] + p2[1] + p3[1]) / 3]
                }

            }
        }
    }
}

import Triangle = JS.math.geom.Triangle;