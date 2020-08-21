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

            let M = Math, F = Floats, P = Point2, V = Vector2, R = Radians, S = Segment;

            export class CirArc implements Shape {
                type: ArcType;
                /**
                 * sAngle is the starting radian of the sector in coordinate system with (x,y) as the origin.
                 */
                sAngle: number;
                /**
                 * eAngle is the ending radian of the sector in coordinate system with (x,y) as the origin.
                 */
                eAngle: number;
                /**
                 * 0 is counterclockwise; 1 is clockwise.
                 */
                dir: 1 | 0;
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


                static toArc(type: ArcType, c: ArrayPoint2, r: number, sAngle: number, eAngle: number, dir: 1 | 0 = 1) {
                    return new CirArc(type, c[0], c[1], r, sAngle, eAngle, dir)
                }

                constructor()
                constructor(type: ArcType, x: number, y: number, r: number, sAngle: number, eAngle: number, dir?: 1 | 0)
                constructor(type?: ArcType, x?: number, y?: number, r?: number, sAngle?: number, eAngle?: number, dir: 1 | 0 = 1) {
                    this.type = type || ArcType.OPEN;
                    this.x = x || 0;
                    this.y = y || 0;
                    this.r = r || 0;
                    this.sAngle = sAngle || 0;
                    this.eAngle = eAngle || 0;
                    this.dir = dir == void 0 ? 1 : dir;
                }

                isEmpty(): boolean {
                    return this.r <= 0 || this.sAngle === this.eAngle
                }

                center(): ArrayPoint2
                center(x: number, y: number): this
                center(x?: number, y?: number): any {
                    if (x == void 0) return [this.x, this.y];
                    this.x = x;
                    this.y = y;
                    return this
                }

                set(s: CirArc) {
                    this.type = s.type;
                    this.x = s.x;
                    this.y = s.y;
                    this.r = s.r;
                    this.sAngle = s.sAngle;
                    this.eAngle = s.eAngle;
                    this.dir = s.dir;
                    return this
                }

                clone() {
                    return <this>new CirArc(this.type, this.x, this.y, this.r, this.sAngle, this.eAngle, this.dir)
                }

                equals(s: CirArc): boolean {
                    return s.type == this.type && P.equal(s.x, s.y, this.x, this.y) && F.equal(this.r, s.r) && F.equal(this.sAngle, s.sAngle) && F.equal(this.eAngle, s.eAngle) && this.dir === s.dir
                }

                _inAngle(p: ArrayPoint2, ps: ArrayPoint2[], cache?: {
                    va: Vector2,
                    vb: Vector2,
                    realRad: number,
                    minRad: number
                }) {
                    let pc = ps[0], pa = ps[1], pb = ps[2];
                    if (S.inSegment(pc, pa, p) || S.inSegment(pc, pb, p)) return false;

                    let va = !cache ? V.toVector(pc, pa) : cache.va,
                        vb = !cache ? V.toVector(pc, pb) : cache.vb,
                        vp = V.toVector(pc, p),
                        realAngle = !cache ? R.deg2rad(this.angle()) : cache.realRad,
                        minAngle = !cache ? va.angle(vb) : cache.minRad,
                        is = R.equal(minAngle, vp.angle(va) + vp.angle(vb));
                    return F.equal(realAngle, minAngle) ? is : !is;
                }

                inside(s: ArrayPoint2 | Segment | Rect | Triangle): boolean {
                    if (!s || this.isEmpty()) return false;

                    if (Types.isArray(s)) {
                        if (this.type == ArcType.OPEN) {
                            //在弧上且在夹角内
                            return (F.equal(this.r * this.r, P.distanceSq(s[0], s[1], this.x, this.y))) && this._inAngle(<ArrayPoint2>s, this.vertexes())
                        } else {
                            //在圆内且在夹角内
                            return new Circle(this.x, this.y, this.r).inside(s) && this._inAngle(<ArrayPoint2>s, this.vertexes())
                        }
                    }
                    if ((<Shape>s).isEmpty()) return false;

                    return (<Shape>s).vertexes().every(p => {
                        return this.inside(p)
                    })
                }
                onside(p: ArrayPoint2): boolean {
                    if (this.isEmpty()) return false;

                    if (!F.equal(this.r * this.r, P.distanceSq(p[0], p[1], this.x, this.y))) return false;

                    let isIn = this._inAngle(p, this.vertexes());
                    if (!isIn) return false;
                    if (this.type == ArcType.OPEN) return true;

                    //是否在两边
                    let ps = this.vertexes(),
                        pc = ps[0], pa = ps[1], pb = ps[2];
                    return S.inSegment(pc, pa, p) || S.inSegment(pc, pb, p)
                }

                intersects(s: Segment | Line): boolean {
                    throw new Error("Method not implemented.")
                }

                _crossByRay(rad: number) {
                    return P.toPoint(this.center()).toward(this.r, rad).toArray();
                }
                private _bounds(ps: ArrayPoint2[]) {
                    let minX: number, minY: number, maxX: number, maxY: number, aX: number[] = [], aY: number[] = [];

                    ps.forEach(p => {
                        aX.push(p[0]);
                        aY.push(p[1]);
                    })
                    minX = M.min.apply(M, aX);
                    maxX = M.max.apply(M, aX);
                    minY = M.min.apply(M, aY);
                    maxY = M.max.apply(M, aY);
                    return new Rect(minX, minY, maxX - minX, maxY - minY)
                }
                bounds(): Rect {
                    if (this.isEmpty()) return null;

                    let ps = this.vertexes(),
                        pc = ps[0], a = [ps[1], ps[2]], p: ArrayPoint2,
                        va = V.toVector(pc, ps[1]),
                        vb = V.toVector(pc, ps[2]),
                        realAngle = R.deg2rad(this.angle()),
                        minAngle = va.angle(vb),
                        cache = {
                            va: va,
                            vb: vb,
                            realRad: realAngle,
                            minRad: minAngle
                        }
                    if (this.type == ArcType.PIE) a.push(pc);

                    //判断圆的矩形的每条边的最短向量夹角是否在弧线角度内：是则加入边界点数据
                    p = this._crossByRay(R.EAST);
                    if (this._inAngle(p, ps, cache)) a.push(p)
                    p = this._crossByRay(R.SOUTH);
                    if (this._inAngle(p, ps, cache)) a.push(p)
                    p = this._crossByRay(R.WEST);
                    if (this._inAngle(p, ps, cache)) a.push(p)
                    p = this._crossByRay(R.NORTH);
                    if (this._inAngle(p, ps, cache)) a.push(p)

                    return this._bounds(a)
                }

                arcLength() {
                    return this.r * M.abs(this.eAngle - this.sAngle)
                }

                /**
                 * Returns a simple approximation value that is within about 5% of the true value (so long as a is not more than 3 times longer than b) .
                 */
                perimeter(): number {
                    return this.type == ArcType.OPEN ? this.arcLength() : 2 * this.r + this.arcLength()
                }

                area() {
                    return this.type == ArcType.OPEN ? 0 : M.abs(this.eAngle - this.sAngle) * this.r * this.r * 0.5
                }

                vertexes(): ArrayPoint2[]
                vertexes(ps: ArrayPoint2[]): this
                vertexes(ps?: ArrayPoint2[]): any {
                    if (arguments.length == 0) {
                        let pc: ArrayPoint2 = [this.x, this.y],
                            pa = P.toPoint(P.polar2xy(this.r, this.sAngle)).translate(this.x, this.y),
                            pb = P.toPoint(P.polar2xy(this.r, this.eAngle)).translate(this.x, this.y);
                        return [pc, [pa.x, pa.y], [pb.x, pb.y]]
                    }

                    let p1 = ps[0], pa = ps[1], pb = ps[2];
                    this.x = p1[0];
                    this.y = p1[1];
                    this.r = P.distance(pa[0], pa[1], this.x, this.y);
                    this.sAngle = V.toVector([this.x, this.y], pa).radian();
                    this.eAngle = V.toVector([this.x, this.y], pb).radian();
                    return this
                }
                /**
                 * Returns the angle[0,360) in degree.
                 */
                angle() {
                    let dif = Radians.positive(this.eAngle) - Radians.positive(this.sAngle),
                        d = R.rad2deg(dif) % 360;
                    return this.dir == 1 ? d : 360 - d
                }

                moveTo(x: number, y: number) {
                    this.x = x;
                    this.y = y;
                    return this
                }

            }
        }

    }
}

import CirArc = JS.math.geom.CirArc;