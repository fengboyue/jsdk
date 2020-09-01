//# sourceURL=../dist/jsmath.js
/**
* JSDK 2.6.0 
* https://github.com/fengboyue/jsdk/
* (c) 2007-2020 Frank.Feng<boyue.feng@foxmail.com>
* MIT license
*/
var JS;
(function (JS) {
    let math;
    (function (math) {
        class Coords2 {
            static rotate(p, rad) {
                let pt = this.rotateX(p, rad);
                return this.rotateY(pt, rad);
            }
            static rotateX(p, rad) {
                let x = p[0], y = p[1];
                return [x * Math.cos(rad) - y * Math.sin(rad), y];
            }
            static rotateY(p, rad) {
                let x = p[0], y = p[1];
                return [x, x * Math.sin(rad) + y * Math.cos(rad)];
            }
            static translate(p, dx, dy) {
                let pt = this.translateX(p, dx);
                return this.translateY(pt, dy);
            }
            static translateX(p, delta) {
                let x = p[0], y = p[1];
                return [x + delta, y];
            }
            static translateY(p, delta) {
                let x = p[0], y = p[1];
                return [x, y + delta];
            }
        }
        math.Coords2 = Coords2;
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Coords2 = JS.math.Coords2;
var JS;
(function (JS) {
    let math;
    (function (math) {
        class Floats {
            static equal(n1, n2, eps = this.EQUAL_PRECISION) {
                let d = n1 - n2, n = d < 0 ? -d : d;
                return n <= eps;
            }
            static greater(n1, n2, eps = this.EQUAL_PRECISION) {
                if (this.equal(n1, n2, eps))
                    return false;
                return n1 > n2;
            }
            static greaterEqual(n1, n2, eps = this.EQUAL_PRECISION) {
                if (this.equal(n1, n2, eps))
                    return true;
                return n1 > n2;
            }
            static less(n1, n2, eps = this.EQUAL_PRECISION) {
                if (this.equal(n1, n2, eps))
                    return false;
                return n1 < n2;
            }
            static lessEqual(n1, n2, eps = this.EQUAL_PRECISION) {
                if (this.equal(n1, n2, eps))
                    return true;
                return n1 < n2;
            }
        }
        Floats.EQUAL_PRECISION = 0.0001;
        math.Floats = Floats;
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Floats = JS.math.Floats;
var JS;
(function (JS) {
    let math;
    (function (math) {
        class Point2 {
            constructor(x, y) {
                this.x = x || 0;
                this.y = y || 0;
            }
            static toPoint(p) {
                return new Point2().set(p);
            }
            static toArray(p) {
                return p instanceof Point2 ? p.toArray() : p;
            }
            static polar2xy(d, rad) {
                let x, y;
                switch (rad / Math.PI) {
                    case 0:
                        x = d;
                        y = 0;
                        break;
                    case 0.5:
                        x = 0;
                        y = d;
                        break;
                    case 1:
                        x = -d;
                        y = 0;
                        break;
                    case 1.5:
                        x = 0;
                        y = -d;
                        break;
                    case 2:
                        x = d;
                        y = 0;
                        break;
                    default:
                        x = d * Math.cos(rad);
                        y = d * Math.sin(rad);
                }
                return [x, y];
            }
            static xy2polar(x, y) {
                return {
                    d: Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)),
                    a: Point2.radian(x, y)
                };
            }
            static equal(x1, y1, x2, y2) {
                if (arguments.length > 3)
                    return math.Floats.equal(x1, x2) && math.Floats.equal(y1, y2);
                if (x1 == void 0 && x1 === y1)
                    return true;
                if (x1 == void 0 || y1 == void 0)
                    return false;
                let px1 = x1[0], py1 = x1[1], px2 = y1[0], py2 = y1[1];
                return math.Floats.equal(px1, px2) && math.Floats.equal(py1, py2);
            }
            static isOrigin(x, y) {
                return this.equal(x, y, 0, 0);
            }
            static distanceSq(x1, y1, x2, y2) {
                let dx = x1 - x2, dy = y1 - y2;
                return dx * dx + dy * dy;
            }
            static distance(x1, y1, x2, y2) {
                return Math.sqrt(this.distanceSq(x1, y1, x2, y2));
            }
            static radian(x1, y1, x2, y2) {
                let xx = x2 || 0, yy = y2 || 0;
                if (Point2.isOrigin(x1, y1) && Point2.isOrigin(xx, yy))
                    return 0;
                let rad = Math.atan2(y1 - yy, x1 - xx);
                return rad < 0 ? 2 * Math.PI + rad : rad;
            }
            set(p) {
                if (Types.isArray(p)) {
                    this.x = p[0];
                    this.y = p[1];
                }
                else if ('x' in p) {
                    this.x = p.x;
                    this.y = p.y;
                }
                else {
                    let pp = Point2.polar2xy(p.d, p.a);
                    this.x = pp[0];
                    this.y = pp[1];
                }
                return this;
            }
            toPolar() {
                return Point2.xy2polar(this.x, this.y);
            }
            toArray() {
                return [this.x, this.y];
            }
            clone() {
                return new Point2(this.x, this.y);
            }
            equals(p) {
                return math.Floats.equal(this.x, p.x) && math.Floats.equal(this.y, p.y);
            }
            radian() {
                return Point2.radian(this.x, this.y);
            }
            distanceSq(x, y) {
                return Point2.distanceSq(this.x, this.y, x, y);
            }
            distance(x, y) {
                return Math.sqrt(this.distanceSq(x, y));
            }
            distanceL1(x, y) {
                return Math.abs(this.x - x) + Math.abs(this.y - y);
            }
            distanceLinf(x, y) {
                return Math.max(Math.abs(this.x - x), Math.abs(this.y - y));
            }
            translate(x, y) {
                this.x += x;
                this.y += y;
                return this;
            }
            moveTo(x, y) {
                this.x = x;
                this.y = y;
                return this;
            }
            clamp(min, max) {
                let T = this;
                if (T.x > max) {
                    T.x = max;
                }
                else if (T.x < min) {
                    T.x = min;
                }
                if (T.y > max) {
                    T.y = max;
                }
                else if (T.y < min) {
                    T.y = min;
                }
                return T;
            }
            clampMin(min) {
                let T = this;
                if (T.x < min)
                    T.x = min;
                if (T.y < min)
                    T.y = min;
                return T;
            }
            clampMax(max) {
                let T = this;
                if (T.x > max)
                    T.x = max;
                if (T.y > max)
                    T.y = max;
                return T;
            }
            toward(step, rad) {
                let p = Point2.polar2xy(step, rad);
                return this.translate(p[0], p[1]);
            }
        }
        Point2.ORIGIN = new Point2(0, 0);
        math.Point2 = Point2;
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Point2 = JS.math.Point2;
var JS;
(function (JS) {
    let math;
    (function (math) {
        let M = Math;
        class Point3 {
            constructor(x, y, z) {
                this.x = x || 0;
                this.y = y || 0;
                this.z = z || 0;
            }
            static toPoint(p) {
                return new Point3().set(p);
            }
            static equal(x1, y1, z1, x2, y2, z2) {
                return math.Floats.equal(x1, x2) && math.Floats.equal(y1, y2) && math.Floats.equal(z1, z2);
            }
            static isOrigin(x, y, z) {
                return this.equal(x, y, z, 0, 0, 0);
            }
            static polar2xyz(d, az, ax) {
                let tmp = d * M.sin(az);
                return [tmp * M.cos(ax), tmp * M.sin(ax), d * M.cos(az)];
            }
            static xyz2polar(x, y, z) {
                let d = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
                return {
                    d: d,
                    az: M.acos(z / d),
                    ax: M.atan(y / x)
                };
            }
            static distanceSq(x1, y1, z1, x2, y2, z2) {
                let dx = x1 - x2, dy = y1 - y2, dz = z1 - z2;
                return dx * dx + dy * dy + dz * dz;
            }
            static distance(x1, y1, z1, x2, y2, z2) {
                return Math.sqrt(this.distanceSq(x1, y1, z1, x2, y2, z2));
            }
            set(p) {
                if (Types.isArray(p)) {
                    this.x = p[0];
                    this.y = p[1];
                    this.z = p[2];
                }
                else {
                    p = p;
                    this.x = p.x;
                    this.y = p.y;
                    this.z = p.z;
                }
                return this;
            }
            equals(p) {
                return math.Floats.equal(this.x, p.x) && math.Floats.equal(this.y, p.y) && math.Floats.equal(this.z, p.z);
            }
            clone() {
                return new Point3(this.x, this.y, this.z);
            }
            distanceSq(p) {
                let dx = this.x - p.x, dy = this.y - p.y, dz = this.z - p.z;
                return dx * dx + dy * dy + dz * dz;
            }
            distance(p) {
                return Math.sqrt(this.distanceSq(p));
            }
            distanceL1(p) {
                return Math.abs(this.x - p.x) + Math.abs(this.y - p.y) + Math.abs(this.z - p.z);
            }
            distanceLinf(p) {
                let tmp = Math.max(Math.abs(this.x - p.x), Math.abs(this.y - p.y));
                return Math.max(tmp, Math.abs(this.z - p.z));
            }
            toArray() {
                return [this.x, this.y, this.z];
            }
            moveTo(x, y, z) {
                this.x = x;
                this.y = y;
                this.z = z;
                return this;
            }
            clamp(min, max) {
                let T = this;
                if (T.x > max) {
                    T.x = max;
                }
                else if (T.x < min) {
                    T.x = min;
                }
                if (T.y > max) {
                    T.y = max;
                }
                else if (T.y < min) {
                    T.y = min;
                }
                if (T.z > max) {
                    T.z = max;
                }
                else if (T.z < min) {
                    T.z = min;
                }
                return T;
            }
            clampMin(min) {
                let T = this;
                if (T.x < min)
                    T.x = min;
                if (T.y < min)
                    T.y = min;
                if (T.z < min)
                    T.z = min;
                return T;
            }
            clampMax(max) {
                let T = this;
                if (T.x > max)
                    T.x = max;
                if (T.y > max)
                    T.y = max;
                if (T.z > max)
                    T.z = max;
                return T;
            }
        }
        math.Point3 = Point3;
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Point3 = JS.math.Point3;
var JS;
(function (JS) {
    let math;
    (function (math) {
        class Radians {
            static rad2deg(rad, limit) {
                let r = rad * 180 / Math.PI;
                return limit ? this.positive(r) : r;
            }
            static deg2rad(deg) {
                return deg * Math.PI / 180;
            }
            static positive(rad) {
                return rad < 0 ? this.ONE_CYCLE + rad : rad;
            }
            static equal(rad1, rad2) {
                return math.Floats.equal(rad1, rad2, 1e-14);
            }
            static equalAngle(rad1, rad2) {
                return this.equal(this.positive(rad1 % this.ONE_CYCLE), this.positive(rad2 % this.ONE_CYCLE));
            }
            static reverse(rad) {
                return rad < Math.PI ? rad + Math.PI : rad - Math.PI;
            }
        }
        Radians.EAST = 0;
        Radians.SOUTH = 0.5 * Math.PI;
        Radians.WEST = Math.PI;
        Radians.NORTH = 1.5 * Math.PI;
        Radians.ONE_CYCLE = 2 * Math.PI;
        math.Radians = Radians;
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Radians = JS.math.Radians;
var JS;
(function (JS) {
    let math;
    (function (math) {
        class Vector2 {
            constructor(x, y) {
                this.x = x || 0;
                this.y = y || 0;
            }
            static toVector(p1, p2) {
                let l = arguments.length;
                if (l == 1) {
                    let line = p1;
                    return new Vector2().set(line.p1(), line.p2());
                }
                else {
                    return new Vector2().set(p1, p2);
                }
            }
            static whichSide(p1, p2, p) {
                let v1 = Vector2.toVector(p1, p), v2 = Vector2.toVector(p2, p), rst = Vector2.cross(v1, v2);
                if (math.Floats.equal(0, rst))
                    return 0;
                return rst > 0 ? 1 : -1;
            }
            static cross(v1, v2) {
                return v1.x * v2.y - v2.x * v1.y;
            }
            static lerp(from, to, amount) {
                if (amount < 0 || amount > 1)
                    throw new RangeError();
                let x = from.x + amount * (to.x - from.x), y = from.y + amount * (to.y - from.y);
                return new Vector2(x, y);
            }
            set(f, t) {
                let l = arguments.length, isA = Types.isArray(f);
                this.x = l == 1 ? f.x : isA ? t[0] - f[0] : t.x - f.x;
                this.y = l == 1 ? f.y : isA ? t[1] - f[1] : t.y - f.y;
                return this;
            }
            equals(v) {
                if (this.isZero() && v.isZero())
                    return true;
                if (this.isZero() || v.isZero())
                    return false;
                return math.Floats.equal(v.lengthSq(), this.lengthSq()) && math.Radians.equal(v.radian(), this.radian());
            }
            toString() {
                return "(" + this.x + "," + this.y + ")";
            }
            toArray() {
                return [this.x, this.y];
            }
            clone() {
                return new Vector2(this.x, this.y);
            }
            negate() {
                this.x = -this.x;
                this.y = -this.y;
                return this;
            }
            add(v) {
                this.x += v.x;
                this.y += v.y;
                return this;
            }
            sub(v) {
                this.x -= v.x;
                this.y -= v.y;
                return this;
            }
            mul(n) {
                this.x *= n;
                this.y *= n;
                return this;
            }
            div(n) {
                this.x /= n;
                this.y /= n;
                return this;
            }
            lengthSq() {
                return this.x * this.x + this.y * this.y;
            }
            length() {
                return Math.sqrt(this.lengthSq());
            }
            dot(v) {
                return this.x * v.x + this.y * v.y;
            }
            normalize() {
                return this.div(this.length());
            }
            radian() {
                return math.Point2.radian(this.x, this.y);
            }
            angle(v) {
                if (v && v.isZero())
                    throw new RangeError('Use zero vector');
                let vv = v || Vector2.UnitX, vDot = this.dot(vv) / (this.length() * vv.length());
                if (vDot < -1.0)
                    vDot = -1.0;
                if (vDot > 1.0)
                    vDot = 1.0;
                return Math.acos(vDot);
            }
            isZero() {
                return this.x == 0 && this.y == 0;
            }
            verticalTo(v) {
                return this.angle(v) == Math.PI / 2;
            }
            parallelTo(v) {
                let a = this.angle(v);
                return a == 0 || a == Math.PI;
            }
            getNormL() {
                return new Vector2(this.y, -this.x);
            }
            getNormR() {
                return new Vector2(-this.y, this.x);
            }
            getProject(v) {
                var dp = this.dot(v), vv = v.lengthSq();
                return new Vector2((dp / vv) * v.x, (dp / vv) * v.y);
            }
            _rebound(v, leftSide) {
                if (this.parallelTo(v))
                    return this.clone();
                let n = leftSide ? v.getNormL() : v.getNormR(), p = this.getProject(n);
                return p.sub(this).mul(2).add(this);
            }
            getReboundL(v) {
                return this._rebound(v, true);
            }
            getReboundR(v) {
                return this._rebound(v, false);
            }
            abs() {
                this.x = Math.abs(this.x);
                this.y = Math.abs(this.y);
                return this;
            }
        }
        Vector2.Zero = new Vector2(0, 0);
        Vector2.One = new Vector2(1, 1);
        Vector2.UnitX = new Vector2(1, 0);
        Vector2.UnitY = new Vector2(0, 1);
        math.Vector2 = Vector2;
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Vector2 = JS.math.Vector2;
var JS;
(function (JS) {
    let math;
    (function (math) {
        class Vector3 {
            constructor(x, y, z) {
                this.x = x || 0;
                this.y = y || 0;
                this.z = z || 0;
            }
            static toVector(p1, p2) {
                return new Vector3().set(p1, p2);
            }
            static cross(v1, v2) {
                let x = v1.y * v2.z - v1.z * v2.y, y = v2.x * v1.z - v2.z * v1.x, z = v1.x * v2.y - v1.y * v2.x;
                return new Vector3(x, y, z);
            }
            static lerp(from, to, amount) {
                if (amount < 0 || amount > 1)
                    throw new RangeError();
                let x = from.x + amount * (to.x - from.x), y = from.y + amount * (to.y - from.y), z = from.z + amount * (to.z - from.z);
                return new Vector3(x, y, z);
            }
            set(f, t) {
                if (t == void 0) {
                    this.x = f.x;
                    this.y = f.y;
                    this.z = f.z;
                }
                else {
                    let is = Types.isArray(f), ff = is ? math.Point3.toPoint(f) : f, tt = is ? math.Point3.toPoint(t) : t;
                    this.x = tt.x - ff.x;
                    this.y = tt.y - ff.y;
                    this.z = tt.z - ff.z;
                }
                return this;
            }
            equals(v) {
                return math.Floats.equal(v.lengthSq(), this.lengthSq()) && this.x / v.x == this.y / v.y && this.y / v.y == this.z / v.z;
            }
            toString() {
                return "(" + this.x + "," + this.y + "," + this.z + ")";
            }
            toArray() {
                return [this.x, this.y, this.z];
            }
            clone() {
                return new Vector3(this.x, this.y, this.z);
            }
            negate() {
                this.x = -this.x;
                this.y = -this.y;
                this.z = -this.z;
                return this;
            }
            add(v) {
                this.x += v.x;
                this.y += v.y;
                this.z += v.z;
                return this;
            }
            sub(v) {
                this.x -= v.x;
                this.y -= v.y;
                this.z -= v.z;
                return this;
            }
            mul(n) {
                this.x *= n;
                this.y *= n;
                this.z *= n;
                return this;
            }
            div(n) {
                this.x /= n;
                this.y /= n;
                this.z /= n;
                return this;
            }
            lengthSq() {
                return (this.x * this.x + this.y * this.y + this.z * this.z);
            }
            length() {
                return Math.sqrt(this.lengthSq());
            }
            dot(v) {
                return this.x * v.x + this.y * v.y + this.z * v.z;
            }
            normalize() {
                return this.div(this.length());
            }
            abs() {
                this.x = Math.abs(this.x);
                this.y = Math.abs(this.y);
                this.z = Math.abs(this.z);
                return this;
            }
        }
        Vector3.Zero = new Vector3(0, 0, 0);
        Vector3.One = new Vector3(1, 1, 1);
        Vector3.UnitX = new Vector3(1, 0, 0);
        Vector3.UnitY = new Vector3(0, 1, 0);
        Vector3.UnitZ = new Vector3(0, 0, 1);
        math.Vector3 = Vector3;
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Vector3 = JS.math.Vector3;
var JS;
(function (JS) {
    let math;
    (function (math) {
        let geom;
        (function (geom) {
            let AngleType;
            (function (AngleType) {
                AngleType[AngleType["ACUTE"] = 0] = "ACUTE";
                AngleType[AngleType["RIGHT"] = 1] = "RIGHT";
                AngleType[AngleType["OBTUSE"] = 2] = "OBTUSE";
                AngleType[AngleType["UNKNOWN"] = 3] = "UNKNOWN";
            })(AngleType = geom.AngleType || (geom.AngleType = {}));
            let ArcType;
            (function (ArcType) {
                ArcType[ArcType["OPEN"] = 0] = "OPEN";
                ArcType[ArcType["PIE"] = 1] = "PIE";
            })(ArcType = geom.ArcType || (geom.ArcType = {}));
            let M = Math, P = math.Point2, V = math.Vector2;
            class Shapes {
                static crossPoints(line, sh, unClosed) {
                    let isLine = !(line instanceof geom.Segment), vs = sh.vertexes(), ps = [], size = vs.length, isCollinear = vs.some((p1, i) => {
                        let b;
                        if (unClosed) {
                            if (i == size - 1)
                                return false;
                            b = new geom.Segment().set(p1, vs[i + 1]);
                        }
                        else {
                            b = new geom.Segment().set(p1, vs[i < size - 1 ? i + 1 : 0]);
                        }
                        if (geom.Line.isCollinearLine(b, line))
                            return true;
                        let cp = isLine ? b.crossLine(line) : b.crossSegment(line);
                        if (cp && ps.findIndex(p => {
                            return P.equal(p, cp);
                        }) < 0)
                            ps.push(cp);
                        return false;
                    });
                    return isCollinear ? [] : ps;
                }
                static inShape(p, sh, unClosed) {
                    let vs = sh.vertexes(), size = vs.length, p0 = p instanceof P ? p.toArray() : p, first = 0;
                    return vs.every((p1, i) => {
                        let p2;
                        if (unClosed) {
                            if (i == size - 1)
                                return true;
                            p2 = vs[i + 1];
                        }
                        else {
                            p2 = vs[i < size - 1 ? i + 1 : 0];
                        }
                        let s = V.whichSide(p1, p2, p0);
                        if (s == 0)
                            return false;
                        if (i == 0)
                            first = s;
                        return s * first > 0;
                    });
                }
                static onShape(p, sh, unClosed) {
                    let vs = sh.vertexes(), size = vs.length, p0 = p instanceof P ? p.toArray() : p;
                    if (size == 2) {
                        let p1 = vs[0], p2 = vs[1];
                        return geom.Segment.inSegment(p1, p2, p0);
                    }
                    return vs.some((p1, i) => {
                        let p2;
                        if (unClosed) {
                            if (i == size - 1)
                                return false;
                            p2 = vs[i + 1];
                        }
                        else {
                            p2 = vs[i < size - 1 ? i + 1 : 0];
                        }
                        return geom.Segment.inSegment(p1, p2, p0);
                    });
                }
            }
            geom.Shapes = Shapes;
        })(geom = math.geom || (math.geom = {}));
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Shapes = JS.math.geom.Shapes;
var AngleType = JS.math.geom.AngleType;
var ArcType = JS.math.geom.ArcType;
var JS;
(function (JS) {
    let math;
    (function (math) {
        let P = math.Point2, V = math.Vector2;
        let geom;
        (function (geom) {
            class Line {
                constructor(x1, y1, x2, y2) {
                    this.x1 = x1 || 0;
                    this.y1 = y1 || 0;
                    this.x2 = x2 || 0;
                    this.y2 = y2 || 0;
                }
                static toLine(p1, p2) {
                    return new Line().set(p1, p2);
                }
                static slope(p1, p2) {
                    let a = p2[0] - p1[0], b = p2[1] - p1[1];
                    return a == 0 ? null : b / a;
                }
                static position(p1, p2, p3, p4) {
                    let T = this, same1 = P.equal(p1, p2), same2 = P.equal(p3, p4);
                    if (same1 && same2)
                        return 0;
                    if (same1 && !same2)
                        return T.isCollinear(p1, p3, p4) ? 0 : -1;
                    if (!same1 && same2)
                        return T.isCollinear(p1, p2, p3) ? 0 : -1;
                    let k1 = T.slope(p1, p2), k2 = T.slope(p3, p4);
                    if ((k1 == null && k2 === 0) || (k2 == null && k1 === 0))
                        return 2;
                    if ((k1 == null && k2 == null) || math.Floats.equal(k1, k2)) {
                        return V.whichSide(p1, p2, p3) == 0 ? 0 : -1;
                    }
                    else {
                        return math.Floats.equal(k1 * k2, -1) ? 2 : 1;
                    }
                }
                static isCollinear(p1, p2, p3) {
                    return V.whichSide(p1, p2, p3) == 0;
                }
                static isCollinearLine(l1, l2) {
                    let p1 = l1.p1(), p2 = l1.p2(), p3 = l2.p1(), p4 = l2.p2();
                    return this.isCollinear(p1, p2, p3) && this.isCollinear(p1, p2, p4);
                }
                static distanceSqToPoint(p1, p2, p) {
                    let x1 = p1[0], y1 = p1[1], x2 = p2[0], y2 = p2[1], px = p[0], py = p[1];
                    x2 -= x1;
                    y2 -= y1;
                    px -= x1;
                    py -= y1;
                    let dot = px * x2 + py * y2, proj = dot * dot / (x2 * x2 + y2 * y2), lenSq = px * px + py * py - proj;
                    if (lenSq < 0)
                        lenSq = 0;
                    return lenSq;
                }
                static distanceToPoint(p1, p2, p) {
                    return Math.sqrt(this.distanceSqToPoint(p1, p2, p));
                }
                toSegment() {
                    return new geom.Segment(this.x1, this.y1, this.x2, this.y2);
                }
                toVector() {
                    return new V(this.x2 - this.x1, this.y2 - this.y1);
                }
                p1(x, y) {
                    if (x == void 0)
                        return [this.x1, this.y1];
                    this.x1 = x;
                    this.y1 = y;
                    return this;
                }
                p2(x, y) {
                    if (x == void 0)
                        return [this.x2, this.y2];
                    this.x2 = x;
                    this.y2 = y;
                    return this;
                }
                vertexes(ps) {
                    if (arguments.length == 0) {
                        return [this.p1(), this.p2()];
                    }
                    let p1 = ps[0], p2 = ps[1];
                    this.p1(p1[0], p1[1]);
                    return this.p2(p2[0], p2[1]);
                }
                set(pt1, pt2) {
                    let len = arguments.length, p1 = len == 1 ? pt1.p1() : pt1, p2 = len == 1 ? pt1.p2() : pt2;
                    this.x1 = p1[0];
                    this.y1 = p1[1];
                    this.x2 = p2[0];
                    this.y2 = p2[1];
                    return this;
                }
                clone() {
                    return new Line(this.x1, this.y1, this.x2, this.y2);
                }
                equals(s) {
                    return Line.position(s.p1(), s.p2(), this.p1(), this.p2()) == 0;
                }
                isEmpty() {
                    return this.x1 == 0 && this.y1 == 0 && this.x2 == 0 && this.y2 == 0;
                }
                inside(s) {
                    let T = this;
                    if (!s || T.isEmpty())
                        return false;
                    if (Types.isArray(s))
                        return Line.isCollinear(T.p1(), T.p2(), s);
                    if (s.isEmpty())
                        return false;
                    return s.vertexes().every(p => {
                        return T.inside(p);
                    });
                }
                onside(p) {
                    return this.inside(p);
                }
                intersects(s) {
                    if (!s || this.isEmpty() || s.isEmpty())
                        return false;
                    let pos = Line.position(this.p1(), this.p2(), s.p1(), s.p2());
                    if (pos < 0)
                        return false;
                    if (s instanceof geom.Segment) {
                        return s.crossLine(this) != null;
                    }
                    else {
                        return true;
                    }
                }
                bounds() {
                    return null;
                }
                slope() {
                    return (this.y2 - this.y1) / (this.x2 - this.x1);
                }
                perimeter() {
                    return Infinity;
                }
                _cpOfLinePoint(p1, p2, p3) {
                    let p1p2 = V.toVector(p1, p2), p1p3 = V.toVector(p1, p3), p = p1p3.getProject(p1p2), d = p.length(), pp = P.polar2xy(d, p.radian());
                    return [pp[0] + p1[0], pp[1] + p1[1]];
                }
                _cpOfLineLine(p1, p2, p3, p4) {
                    let x1 = p1[0], y1 = p1[1], x2 = p2[0], y2 = p2[1], x3 = p3[0], y3 = p3[1], x4 = p4[0], y4 = p4[1];
                    if (Line.position(p1, p2, p3, p4) < 1)
                        return null;
                    let x = ((x1 - x2) * (x3 * y4 - x4 * y3) - (x3 - x4) * (x1 * y2 - x2 * y1)) / ((x3 - x4) * (y1 - y2) - (x1 - x2) * (y3 - y4)), y = ((y1 - y2) * (x3 * y4 - x4 * y3) - (x1 * y2 - x2 * y1) * (y3 - y4)) / ((y1 - y2) * (x3 - x4) - (x1 - x2) * (y3 - y4));
                    return [x, y];
                }
                _cpOfLineRay(p1, p2, p3, rad) {
                    let p4 = P.toPoint(p3).toward(10, rad).toArray(), p = this._cpOfLineLine(p1, p2, p3, p4);
                    if (!p)
                        return null;
                    return V.toVector(p3, p4).angle(V.toVector(p3, p)) == 0 ? p : null;
                }
                crossPoint(p) {
                    return this._cpOfLinePoint(this.p1(), this.p2(), p);
                }
                crossLine(l) {
                    return this._cpOfLineLine(this.p1(), this.p2(), l.p1(), l.p2());
                }
                crossRay(p, rad) {
                    return this._cpOfLineRay(this.p1(), this.p2(), p, rad);
                }
            }
            Line.X = new Line(0, 0, 1, 0);
            Line.Y = new Line(0, 0, 0, 1);
            geom.Line = Line;
        })(geom = math.geom || (math.geom = {}));
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Line = JS.math.geom.Line;
var JS;
(function (JS) {
    let math;
    (function (math) {
        let geom;
        (function (geom) {
            let M = Math, P = math.Point2, L = geom.Line, V = math.Vector2;
            let relativeCCW = function (x1, y1, x2, y2, px, py) {
                x2 -= x1;
                y2 -= y1;
                px -= x1;
                py -= y1;
                let ccw = px * y2 - py * x2;
                if (ccw == 0.0) {
                    ccw = px * x2 + py * y2;
                    if (ccw > 0.0) {
                        px -= x2;
                        py -= y2;
                        ccw = px * x2 + py * y2;
                        if (ccw < 0.0) {
                            ccw = 0.0;
                        }
                    }
                }
                return (ccw < 0.0) ? -1 : ((ccw > 0.0) ? 1 : 0);
            }, inDiagonalRect = (p1, p2, p) => {
                if (P.equal(p, p1) || P.equal(p, p2))
                    return true;
                return M.min(p1[0], p2[0]) <= p[0] && p[0] <= M.max(p1[0], p2[0])
                    && M.min(p1[1], p2[1]) <= p[1] && p[1] <= M.max(p1[1], p2[1]);
            };
            class Segment extends geom.Line {
                static toSegment(p1, p2) {
                    return new Segment().set(p1, p2);
                }
                static inSegment(p1, p2, p) {
                    return inDiagonalRect(p1, p2, p) && V.whichSide(p1, p2, p) == 0;
                }
                static distanceSqToPoint(p1, p2, p) {
                    let x1 = p1[0], y1 = p1[1], x2 = p2[0], y2 = p2[1], px = p[0], py = p[1];
                    x2 -= x1;
                    y2 -= y1;
                    px -= x1;
                    py -= y1;
                    let dot = px * x2 + py * y2, proj;
                    if (dot <= 0.0) {
                        proj = 0.0;
                    }
                    else {
                        px = x2 - px;
                        py = y2 - py;
                        dot = px * x2 + py * y2;
                        if (dot <= 0.0) {
                            proj = 0.0;
                        }
                        else {
                            proj = dot * dot / (x2 * x2 + y2 * y2);
                        }
                    }
                    let lenSq = px * px + py * py - proj;
                    if (lenSq < 0)
                        lenSq = 0;
                    return lenSq;
                }
                static distanceToPoint(p1, p2, p) {
                    return M.sqrt(this.distanceSqToPoint(p1, p2, p));
                }
                static intersect(p1, p2, p3, p4) {
                    let x1 = p1[0], y1 = p1[1], x2 = p2[0], y2 = p2[1], x3 = p3[0], y3 = p3[1], x4 = p4[0], y4 = p4[1];
                    return ((relativeCCW(x1, y1, x2, y2, x3, y3) *
                        relativeCCW(x1, y1, x2, y2, x4, y4) <= 0)
                        && (relativeCCW(x3, y3, x4, y4, x1, y1) *
                            relativeCCW(x3, y3, x4, y4, x2, y2) <= 0));
                }
                toLine() {
                    return new geom.Line(this.x1, this.y1, this.x2, this.y2);
                }
                equals(s, isStrict) {
                    let p1 = [this.x1, this.y1], p2 = [this.x2, this.y2], p3 = [s.x1, s.y1], p4 = [s.x2, s.y2];
                    if (isStrict)
                        return P.equal(p1, p3) && P.equal(p2, p4);
                    return (P.equal(p1, p3) && P.equal(p2, p4)) || (P.equal(p1, p4) && P.equal(p2, p3));
                }
                inside(s) {
                    let T = this;
                    if (!s || T.isEmpty())
                        return false;
                    if (Types.isArray(s))
                        return geom.Shapes.onShape(s, T);
                    if (s.isEmpty())
                        return false;
                    if (s instanceof Segment)
                        return T.inside([s.x1, s.y1]) && T.inside([s.x2, s.y2]);
                }
                intersects(s) {
                    if (!s || this.isEmpty() || s.isEmpty())
                        return false;
                    let pos = L.position(this.p1(), this.p2(), s.p1(), s.p2());
                    if (pos < 0)
                        return false;
                    if (s instanceof Segment) {
                        return s.crossSegment(this) != null;
                    }
                    else {
                        return true;
                    }
                }
                bounds() {
                    let T = this, minX = M.min(T.x1, T.x2), maxX = M.max(T.x1, T.x2), minY = M.min(T.y1, T.y2), maxY = M.max(T.y1, T.y2);
                    return new geom.Rect(minX, minY, maxX - minX, maxY - minY);
                }
                perimeter() {
                    return P.distance(this.x1, this.y1, this.x2, this.y2);
                }
                ratioPoint(ratio) {
                    let p1 = this.p1(), p2 = this.p2();
                    return [(p1[0] + ratio * p2[0]) / (1 + ratio),
                        (p1[1] + ratio * p2[1]) / (1 + ratio)];
                }
                midPoint() {
                    return this.ratioPoint(1);
                }
                _cpOfSS(s1, s2) {
                    let p = s1.toLine().crossLine(s2.toLine());
                    if (!p)
                        return null;
                    return s1.inside(p) && s2.inside(p) ? p : null;
                }
                _cpOfSL(s1, s2) {
                    let p = s1.toLine().crossLine(s2);
                    if (!p)
                        return null;
                    return s1.inside(p) ? p : null;
                }
                _cpOfSR(s1, p3, rad) {
                    let p4 = P.toPoint(p3).toward(10, rad).toArray(), p = this._cpOfSL(s1, L.toLine(p3, p4));
                    if (!p)
                        return null;
                    return V.toVector(p3, p4).angle(V.toVector(p3, p)) == 0 ? p : null;
                }
                crossSegment(s) {
                    return this._cpOfSS(this, s);
                }
                crossLine(l) {
                    return this._cpOfSL(this, l);
                }
                crossRay(p, rad) {
                    return this._cpOfSR(this, p, rad);
                }
            }
            geom.Segment = Segment;
        })(geom = math.geom || (math.geom = {}));
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Segment = JS.math.geom.Segment;
var JS;
(function (JS) {
    let math;
    (function (math) {
        let geom;
        (function (geom) {
            let M = Math, N = Number;
            class Polygon {
                constructor(points) {
                    this._points = points || [];
                }
                isEmpty() {
                    return this._points.length == 0;
                }
                numberVertexes() {
                    return this._points.length;
                }
                clone() {
                    return new Polygon(this._points.slice());
                }
                _contains(x, y) {
                    let T = this, len = T.numberVertexes();
                    if (len <= 2 || !T.bounds().inside([x, y]))
                        return false;
                    let hits = 0, lastx = T._points[len - 1][0], lasty = T._points[len - 1][1], curx, cury;
                    for (let i = 0; i < len; lastx = curx, lasty = cury, i++) {
                        let pi = T._points[i], pj = T._points[i < len - 1 ? i + 1 : 0];
                        if (geom.Segment.inSegment(pi, pj, [x, y]))
                            return false;
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
                        }
                        else {
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
                        }
                        else {
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
                inside(s) {
                    return s && !this.isEmpty() && this._contains(s[0], s[1]);
                }
                onside(p) {
                    return !this.isEmpty() && geom.Shapes.onShape(p, this);
                }
                intersects(s) {
                    if (!s || this.isEmpty() || s.isEmpty())
                        return false;
                    let size = this.numberVertexes();
                    return this._points.some((p, i) => {
                        let x1 = p[0], y1 = p[1], px = this._points[i < size - 1 ? (i + 1) : 0];
                        return s.intersects(new geom.Segment(x1, y1, px[0], px[1]));
                    });
                }
                bounds() {
                    if (this.numberVertexes() == 0)
                        return new geom.Rect();
                    if (this._bounds == null)
                        this._calculateBounds();
                    return this._bounds.bounds();
                }
                _calculateBounds() {
                    let minX = N.MAX_VALUE, minY = N.MAX_VALUE, maxX = N.MIN_VALUE, maxY = N.MIN_VALUE;
                    this._points.forEach(p => {
                        minX = M.min(minX, p[0]);
                        maxX = M.max(maxX, p[0]);
                        minY = M.min(minY, p[1]);
                        maxY = M.max(maxY, p[1]);
                    });
                    this._bounds = new geom.Rect(minX, minY, maxX - minX, maxY - minY);
                }
                _updateBounds(x, y) {
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
                addPoint(x, y) {
                    this._points.push([x, y]);
                    if (this._bounds != null)
                        this._updateBounds(x, y);
                    return this;
                }
                vertexes(ps) {
                    if (arguments.length == 0)
                        return this._points;
                    this._points = ps;
                    return this;
                }
                perimeter() {
                    if (this._len != void 0)
                        return this._len;
                    this._len = 0;
                    let size = this.numberVertexes();
                    if (size < 2)
                        return 0;
                    this._points.forEach((p, i) => {
                        let x1 = p[0], y1 = p[1], px = this._points[i < size - 1 ? (i + 1) : 0];
                        this._len += math.Point2.distance(x1, y1, px[0], px[1]);
                    });
                    return this._len;
                }
                equals(s) {
                    let ps = s.vertexes();
                    if (ps.length != this.numberVertexes())
                        return false;
                    return this._points.every((p, i) => {
                        let pi = ps[i];
                        return math.Point2.equal(p[0], p[1], pi[0], pi[1]);
                    });
                }
            }
            geom.Polygon = Polygon;
        })(geom = math.geom || (math.geom = {}));
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Polygon = JS.math.geom.Polygon;
var JS;
(function (JS) {
    let math;
    (function (math) {
        let geom;
        (function (geom) {
            let M = Math, F = math.Floats, P = math.Point2, V = math.Vector2, R = math.Radians, S = geom.Segment;
            class CirArc {
                constructor(type, x, y, r, sAngle, eAngle, dir = 1) {
                    this.type = type || geom.ArcType.OPEN;
                    this.x = x || 0;
                    this.y = y || 0;
                    this.r = r || 0;
                    this.sAngle = sAngle || 0;
                    this.eAngle = eAngle || 0;
                    this.dir = dir == void 0 ? 1 : dir;
                }
                static toArc(type, c, r, sAngle, eAngle, dir = 1) {
                    return new CirArc(type, c[0], c[1], r, sAngle, eAngle, dir);
                }
                isEmpty() {
                    return this.r <= 0 || this.sAngle === this.eAngle;
                }
                center(x, y) {
                    if (x == void 0)
                        return [this.x, this.y];
                    this.x = x;
                    this.y = y;
                    return this;
                }
                set(s) {
                    this.type = s.type;
                    this.x = s.x;
                    this.y = s.y;
                    this.r = s.r;
                    this.sAngle = s.sAngle;
                    this.eAngle = s.eAngle;
                    this.dir = s.dir;
                    return this;
                }
                clone() {
                    return new CirArc(this.type, this.x, this.y, this.r, this.sAngle, this.eAngle, this.dir);
                }
                equals(s) {
                    return s.type == this.type && P.equal(s.x, s.y, this.x, this.y) && F.equal(this.r, s.r) && F.equal(this.sAngle, s.sAngle) && F.equal(this.eAngle, s.eAngle) && this.dir === s.dir;
                }
                _inAngle(p, ps, cache) {
                    let pc = ps[0], pa = ps[1], pb = ps[2];
                    if (S.inSegment(pc, pa, p) || S.inSegment(pc, pb, p))
                        return false;
                    let va = !cache ? V.toVector(pc, pa) : cache.va, vb = !cache ? V.toVector(pc, pb) : cache.vb, vp = V.toVector(pc, p), realAngle = !cache ? R.deg2rad(this.angle()) : cache.realRad, minAngle = !cache ? va.angle(vb) : cache.minRad, is = R.equal(minAngle, vp.angle(va) + vp.angle(vb));
                    return F.equal(realAngle, minAngle) ? is : !is;
                }
                inside(s) {
                    if (!s || this.isEmpty())
                        return false;
                    if (Types.isArray(s)) {
                        if (this.type == geom.ArcType.OPEN) {
                            return (F.equal(this.r * this.r, P.distanceSq(s[0], s[1], this.x, this.y))) && this._inAngle(s, this.vertexes());
                        }
                        else {
                            return new geom.Circle(this.x, this.y, this.r).inside(s) && this._inAngle(s, this.vertexes());
                        }
                    }
                    if (s.isEmpty())
                        return false;
                    return s.vertexes().every(p => {
                        return this.inside(p);
                    });
                }
                onside(p) {
                    if (this.isEmpty())
                        return false;
                    if (!F.equal(this.r * this.r, P.distanceSq(p[0], p[1], this.x, this.y)))
                        return false;
                    let isIn = this._inAngle(p, this.vertexes());
                    if (!isIn)
                        return false;
                    if (this.type == geom.ArcType.OPEN)
                        return true;
                    let ps = this.vertexes(), pc = ps[0], pa = ps[1], pb = ps[2];
                    return S.inSegment(pc, pa, p) || S.inSegment(pc, pb, p);
                }
                intersects(s) {
                    throw new Error("Method not implemented.");
                }
                _crossByRay(rad) {
                    return P.toPoint(this.center()).toward(this.r, rad).toArray();
                }
                _bounds(ps) {
                    let minX, minY, maxX, maxY, aX = [], aY = [];
                    ps.forEach(p => {
                        aX.push(p[0]);
                        aY.push(p[1]);
                    });
                    minX = M.min.apply(M, aX);
                    maxX = M.max.apply(M, aX);
                    minY = M.min.apply(M, aY);
                    maxY = M.max.apply(M, aY);
                    return new geom.Rect(minX, minY, maxX - minX, maxY - minY);
                }
                bounds() {
                    if (this.isEmpty())
                        return null;
                    let ps = this.vertexes(), pc = ps[0], a = [ps[1], ps[2]], p, va = V.toVector(pc, ps[1]), vb = V.toVector(pc, ps[2]), realAngle = R.deg2rad(this.angle()), minAngle = va.angle(vb), cache = {
                        va: va,
                        vb: vb,
                        realRad: realAngle,
                        minRad: minAngle
                    };
                    if (this.type == geom.ArcType.PIE)
                        a.push(pc);
                    p = this._crossByRay(R.EAST);
                    if (this._inAngle(p, ps, cache))
                        a.push(p);
                    p = this._crossByRay(R.SOUTH);
                    if (this._inAngle(p, ps, cache))
                        a.push(p);
                    p = this._crossByRay(R.WEST);
                    if (this._inAngle(p, ps, cache))
                        a.push(p);
                    p = this._crossByRay(R.NORTH);
                    if (this._inAngle(p, ps, cache))
                        a.push(p);
                    return this._bounds(a);
                }
                arcLength() {
                    return this.r * M.abs(this.eAngle - this.sAngle);
                }
                perimeter() {
                    return this.type == geom.ArcType.OPEN ? this.arcLength() : 2 * this.r + this.arcLength();
                }
                area() {
                    return this.type == geom.ArcType.OPEN ? 0 : M.abs(this.eAngle - this.sAngle) * this.r * this.r * 0.5;
                }
                vertexes(ps) {
                    if (arguments.length == 0) {
                        let pc = [this.x, this.y], pa = P.toPoint(P.polar2xy(this.r, this.sAngle)).translate(this.x, this.y), pb = P.toPoint(P.polar2xy(this.r, this.eAngle)).translate(this.x, this.y);
                        return [pc, [pa.x, pa.y], [pb.x, pb.y]];
                    }
                    let p1 = ps[0], pa = ps[1], pb = ps[2];
                    this.x = p1[0];
                    this.y = p1[1];
                    this.r = P.distance(pa[0], pa[1], this.x, this.y);
                    this.sAngle = V.toVector([this.x, this.y], pa).radian();
                    this.eAngle = V.toVector([this.x, this.y], pb).radian();
                    return this;
                }
                angle() {
                    let dif = math.Radians.positive(this.eAngle) - math.Radians.positive(this.sAngle), d = R.rad2deg(dif) % 360;
                    return this.dir == 1 ? d : 360 - d;
                }
                moveTo(x, y) {
                    this.x = x;
                    this.y = y;
                    return this;
                }
            }
            geom.CirArc = CirArc;
        })(geom = math.geom || (math.geom = {}));
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var CirArc = JS.math.geom.CirArc;
var JS;
(function (JS) {
    let math;
    (function (math) {
        let geom;
        (function (geom) {
            let P = math.Point2, F = math.Floats, L = geom.Line, S = geom.Segment;
            class Circle {
                constructor(x, y, r) {
                    this.x = x || 0;
                    this.y = y || 0;
                    this.r = r || 0;
                }
                static toCircle(c, r) {
                    return new Circle(c[0], c[1], r);
                }
                set(c, r) {
                    if (arguments.length == 1) {
                        this.x = c.x;
                        this.y = c.y;
                        this.r = c.r;
                    }
                    else {
                        let p = P.toArray(c);
                        this.x = p[0];
                        this.y = p[1];
                        this.r = r;
                    }
                    return this;
                }
                isEmpty() {
                    return this.r <= 0;
                }
                clone() {
                    return new Circle(this.x, this.y, this.r);
                }
                equals(s) {
                    return F.equal(this.x, s.x) && F.equal(this.y, s.y) && F.equal(this.r, s.r);
                }
                inside(s) {
                    if (!s || this.isEmpty())
                        return false;
                    if (Types.isArray(s))
                        return F.greater(this.r * this.r, P.distanceSq(this.x, this.y, s[0], s[1]));
                    if (s.isEmpty())
                        return false;
                    if (s instanceof geom.Rect || s instanceof S || s instanceof geom.Triangle)
                        return s.vertexes().every(p => {
                            return this.inside(p);
                        });
                    let dd = P.distanceSq(this.x, this.y, s.x, s.y), rr = this.r - s.r;
                    return F.less(dd, rr * rr);
                }
                onside(p) {
                    return !this.isEmpty() && F.equal(this.r * this.r, P.distanceSq(this.x, this.y, p[0], p[1]));
                }
                intersects(s) {
                    if (!s || this.isEmpty() || s.isEmpty())
                        return false;
                    if (s instanceof L) {
                        let d = L.distanceSqToPoint(s.p1(), s.p2(), [this.x, this.y]), rr = this.r * this.r;
                        if (F.greaterEqual(d, rr))
                            return false;
                        if (!(s instanceof S))
                            return true;
                        return F.equal(d, S.distanceSqToPoint(s.p1(), s.p2(), [this.x, this.y]));
                    }
                    if (s instanceof Circle) {
                        let dd = P.distanceSq(this.x, this.y, s.x, s.y), rr = this.r + s.r;
                        return F.less(dd, rr * rr);
                    }
                    if (s.inside(this) || this.inside(s))
                        return true;
                    return s.edges().some(b => {
                        return this.intersects(b);
                    });
                }
                bounds() {
                    return new geom.Rect(this.x - this.r, this.y - this.r, 2 * this.r, 2 * this.r);
                }
                moveTo(x, y) {
                    this.x = x;
                    this.y = y;
                    return this;
                }
                perimeter() {
                    return 2 * this.r * Math.PI;
                }
                area() {
                    return this.r * this.r * Math.PI;
                }
                vertexes(ps) {
                    throw new Error("Method not implemented.");
                }
            }
            geom.Circle = Circle;
        })(geom = math.geom || (math.geom = {}));
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Circle = JS.math.geom.Circle;
var JS;
(function (JS) {
    let math;
    (function (math) {
        let geom;
        (function (geom) {
            let P = math.Point2, F = math.Floats, L = geom.Line, S = geom.Segment;
            class Ellipse {
                constructor(x, y, rx, ry) {
                    this.x = x || 0;
                    this.y = y || 0;
                    this.rx = rx || 0;
                    this.ry = ry || 0;
                }
                static toEllipse(c, rx, ry) {
                    return new Ellipse(c[0], c[1], rx, ry);
                }
                set(c, rx, ry) {
                    if (arguments.length == 1) {
                        this.x = c.x;
                        this.y = c.y;
                        this.rx = c.rx;
                        this.ry = c.ry;
                    }
                    else {
                        let p = P.toArray(c);
                        this.x = p[0];
                        this.y = p[1];
                        this.rx = rx;
                        this.ry = ry;
                    }
                    return this;
                }
                isEmpty() {
                    return this.rx <= 0 || this.ry <= 0;
                }
                clone() {
                    return new Ellipse(this.x, this.y, this.rx, this.ry);
                }
                equals(s) {
                    return F.equal(this.x, s.x) && F.equal(this.y, s.y) && F.equal(this.rx, s.rx) && F.equal(this.ry, s.ry);
                }
                inside(s) {
                    if (!s || this.isEmpty())
                        return false;
                    if (Types.isArray(s)) {
                        let dx = s[0] - this.x, dy = s[1] - this.y, rxx = this.rx * this.rx, ryy = this.ry * this.ry;
                        return !this.isEmpty() && F.greater(1, (dx * dx) / rxx + (dy * dy) / ryy);
                    }
                    if (s.isEmpty())
                        return false;
                    return s.vertexes().every(p => {
                        return this.inside(p);
                    });
                }
                onside(p) {
                    if (this.isEmpty())
                        return false;
                    let dx = p[0] - this.x, dy = p[1] - this.y, rxx = this.rx * this.rx, ryy = this.ry * this.ry;
                    return !this.isEmpty() && F.equal(1, (dx * dx) / rxx + (dy * dy) / ryy);
                }
                intersects(s) {
                    throw new Error("Method not implemented.");
                }
                bounds() {
                    return new geom.Rect(this.x - this.rx, this.y - this.ry, 2 * this.rx, 2 * this.ry);
                }
                moveTo(x, y) {
                    this.x = x;
                    this.y = y;
                    return this;
                }
                perimeter() {
                    let a = this.rx, b = this.ry;
                    return Math.PI * (3 / 2 * (a + b) - Math.sqrt(a * b));
                }
                area() {
                    return this.rx * this.ry * Math.PI;
                }
                vertexes(ps) {
                    throw new Error("Method not implemented.");
                }
            }
            geom.Ellipse = Ellipse;
        })(geom = math.geom || (math.geom = {}));
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Ellipse = JS.math.geom.Ellipse;
var JS;
(function (JS) {
    let math;
    (function (math) {
        let geom;
        (function (geom) {
            class Polyline extends geom.Polygon {
                clone() {
                    return new Polyline(this._points);
                }
                inside(s) {
                    return false;
                }
                onside(p) {
                    return !this.isEmpty() && geom.Shapes.onShape(p, this, true);
                }
                intersects(s) {
                    if (!s || this.isEmpty() || s.isEmpty())
                        return false;
                    let size = this.numberVertexes();
                    return this._points.some((p, i) => {
                        if (i >= size - 1)
                            return false;
                        let x1 = p[0], y1 = p[1], px = this._points[i + 1];
                        return s.intersects(new geom.Segment(x1, y1, px[0], px[1]));
                    });
                }
                perimeter() {
                    if (this._len != void 0)
                        return this._len;
                    this._len = 0;
                    let size = this.numberVertexes();
                    if (size < 2)
                        return 0;
                    this._points.forEach((p, i) => {
                        if (i < size - 1) {
                            let x1 = p[0], y1 = p[1], px = this._points[i + 1];
                            this._len += math.Point2.distance(x1, y1, px[0], px[1]);
                        }
                    });
                    return this._len;
                }
                equals(s) {
                    return super.equals(s);
                }
            }
            geom.Polyline = Polyline;
        })(geom = math.geom || (math.geom = {}));
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Polyline = JS.math.geom.Polyline;
var JS;
(function (JS) {
    let math;
    (function (math) {
        let geom;
        (function (geom) {
            let M = Math, S = geom.Segment, N = Number;
            class Rect {
                constructor(x, y, w, h) {
                    this.set(x, y, w, h);
                }
                static toRect(p, w, h) {
                    return new Rect(p[0], p[1], w, h);
                }
                static centerTo(rect1, rect2) {
                    let w1 = rect1.w, h1 = rect1.h, w2 = rect2.w, h2 = rect2.h;
                    rect1.x = rect2.x + (w2 - w1) / 2;
                    rect1.y = rect2.y + (h2 - h1) / 2;
                }
                static limitIn(rect1, rect2) {
                    if (rect1.x < rect2.x) {
                        rect1.x = rect2.x;
                    }
                    else if (rect1.x > (rect2.x + rect2.w - rect1.w)) {
                        rect1.x = rect2.x + rect2.w - rect1.w;
                    }
                    ;
                    if (rect1.y < rect2.y) {
                        rect1.y = rect2.y;
                    }
                    else if (rect1.y > (rect2.y + rect2.h - rect1.h)) {
                        rect1.y = rect2.y + rect2.h - rect1.h;
                    }
                }
                minX() {
                    return this.x;
                }
                minY() {
                    return this.y;
                }
                maxX() {
                    return this.x + this.w;
                }
                maxY() {
                    return this.y + this.h;
                }
                centerX() {
                    return this.x + this.w / 2;
                }
                centerY() {
                    return this.y + this.h / 2;
                }
                clone() {
                    return new Rect(this.x, this.y, this.w, this.h);
                }
                equals(s) {
                    let T = this;
                    if (T.w != s.w || T.h != s.h)
                        return false;
                    return math.Floats.equal(T.x, s.x) && math.Floats.equal(T.y, s.y);
                }
                set(xx, yy, ww, hh) {
                    let len = arguments.length, x = len == 1 ? xx.x : xx, y = len == 1 ? xx.y : yy, w = len == 1 ? xx.w : ww, h = len == 1 ? xx.h : hh;
                    this.x = Number(x || 0).round(3);
                    this.y = Number(y || 0).round(3);
                    this.w = Number(w || 0).round(3);
                    this.h = Number(h || 0).round(3);
                    return this;
                }
                isEmpty() {
                    return this.w <= 0 || this.h <= 0;
                }
                size(w, h) {
                    if (w == void 0)
                        return { w: this.w, h: this.h };
                    this.w = w < 0 ? 0 : w;
                    this.h = h < 0 ? 0 : h;
                    return this;
                }
                moveTo(x, y) {
                    this.x = x;
                    this.y = y;
                    return this;
                }
                area() {
                    return this.w * this.h;
                }
                perimeter() {
                    return 2 * (this.w + this.h);
                }
                vertexes(ps) {
                    if (arguments.length == 0) {
                        let T = this, a = [T.x, T.y], b = [T.x + T.w, T.y], c = [T.x + T.w, T.y + T.h], d = [T.x, T.y + T.h];
                        return [a, b, c, d];
                    }
                    let p1 = ps[0], p2 = ps[1], p3 = ps[2];
                    this.x = p1[0];
                    this.y = p1[1];
                    this.w = p2[0] - p1[0];
                    this.h = p3[1] - p2[1];
                    return this;
                }
                _inside(x, y) {
                    let T = this;
                    return x > T.x && x < (T.x + T.w) && y > T.y && y < (T.y + T.h);
                }
                inside(s) {
                    if (!s || this.isEmpty())
                        return false;
                    if (Types.isArray(s))
                        return this._inside(s[0], s[1]);
                    if (s.isEmpty())
                        return false;
                    if (s instanceof geom.Segment) {
                        let vs = s.vertexes();
                        return vs.every(v => {
                            return this.inside(v);
                        });
                    }
                    if (s instanceof Rect) {
                        let rect1 = this, rect2 = s;
                        return (rect2.x >= rect1.x && rect2.y >= rect1.y &&
                            (rect2.x + rect2.w) <= (rect1.x + rect1.w) &&
                            (rect2.y + rect2.h) <= (rect1.y + rect1.h));
                    }
                    let c = s;
                    if (!geom.Shapes.inShape([c.x, c.y], this))
                        return false;
                    let rr = c.r * c.r;
                    return this.edges().every(b => {
                        return math.Floats.greaterEqual(geom.Line.distanceSqToPoint(b.p1(), b.p2(), [c.x, c.y]), rr);
                    });
                }
                onside(p) {
                    return !this.isEmpty() && geom.Shapes.onShape(p, this);
                }
                intersects(s) {
                    let T = this;
                    if (!s || T.isEmpty() || s.isEmpty())
                        return false;
                    if (s instanceof Rect) {
                        let x = s.x, y = s.y, w = s.w, h = s.h, x0 = T.x, y0 = T.y;
                        return (x + w > x0 &&
                            y + h > y0 &&
                            x < x0 + T.w &&
                            y < y0 + T.h);
                    }
                    let ps = geom.Shapes.crossPoints(s, T), len = ps.length;
                    if (len == 0)
                        return false;
                    if (len == 1) {
                        if (!(s instanceof geom.Segment))
                            return false;
                        let p1 = s.p1(), p2 = s.p2();
                        return T._inside(p1[0], p1[1]) || T._inside(p2[0], p2[1]);
                    }
                    return true;
                }
                intersection(rect) {
                    if (this.isEmpty() || rect.isEmpty())
                        return null;
                    let rect1 = this, rect2 = rect, t = M.max(rect1.y, rect2.y), r = M.min(rect1.x + rect1.w, rect2.x + rect2.w), b = M.min(rect1.y + rect1.h, rect2.y + rect2.h), l = M.max(rect1.x, rect2.x);
                    return (b > t && r > l) ? new Rect(l, t, r - l, b - t) : null;
                }
                bounds() {
                    return this.clone();
                }
                edges() {
                    let p4 = this.vertexes();
                    return [
                        S.toSegment(p4[0], p4[1]),
                        S.toSegment(p4[1], p4[2]),
                        S.toSegment(p4[2], p4[3]),
                        S.toSegment(p4[3], p4[0])
                    ];
                }
                union(r) {
                    let T = this, tx2 = T.w, ty2 = T.h;
                    if ((tx2 | ty2) < 0) {
                        return r.clone();
                    }
                    let rx2 = r.w, ry2 = r.h;
                    if ((rx2 | ry2) < 0) {
                        return T.clone();
                    }
                    let tx1 = T.x, ty1 = T.y;
                    tx2 += tx1;
                    ty2 += ty1;
                    let rx1 = r.x, ry1 = r.y;
                    rx2 += rx1;
                    ry2 += ry1;
                    if (tx1 > rx1)
                        tx1 = rx1;
                    if (ty1 > ry1)
                        ty1 = ry1;
                    if (tx2 < rx2)
                        tx2 = rx2;
                    if (ty2 < ry2)
                        ty2 = ry2;
                    tx2 -= tx1;
                    ty2 -= ty1;
                    return new Rect(tx1, ty1, tx2, ty2);
                }
            }
            geom.Rect = Rect;
        })(geom = math.geom || (math.geom = {}));
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Rect = JS.math.geom.Rect;
var JS;
(function (JS) {
    let math;
    (function (math) {
        let geom;
        (function (geom) {
            let P = math.Point2, V = math.Vector2, N = Numbers, S = geom.Segment;
            class Triangle {
                constructor(x1, y1, x2, y2, x3, y3) {
                    this.x1 = x1 || 0;
                    this.y1 = y1 || 0;
                    this.x2 = x2 || 0;
                    this.y2 = y2 || 0;
                    this.x3 = x3 || 0;
                    this.y3 = y3 || 0;
                }
                static toTri(p1, p2, p3) {
                    return new Triangle().set(p1, p2, p3);
                }
                isEmpty() {
                    return geom.Line.isCollinear(this.p1(), this.p2(), this.p3());
                }
                p1(x, y) {
                    if (x == void 0)
                        return [this.x1, this.y1];
                    this.x1 = x;
                    this.y1 = y;
                    return this;
                }
                p2(x, y) {
                    if (x == void 0)
                        return [this.x2, this.y2];
                    this.x2 = x;
                    this.y2 = y;
                    return this;
                }
                p3(x, y) {
                    if (x == void 0)
                        return [this.x3, this.y3];
                    this.x3 = x;
                    this.y3 = y;
                    return this;
                }
                set(p1, p2, p3) {
                    if (arguments.length == 1)
                        return this.vertexes(p1.vertexes());
                    return this.vertexes([p1, p2, p3]);
                }
                vertexes(ps) {
                    let T = this;
                    if (arguments.length == 0)
                        return [[T.x1, T.y1], [T.x2, T.y2], [T.x3, T.y3]];
                    let p1 = ps[0], p2 = ps[1], p3 = ps[2];
                    this.x1 = p1[0];
                    this.y1 = p1[1];
                    this.x2 = p2[0];
                    this.y2 = p2[1];
                    this.x3 = p3[0];
                    this.y3 = p3[1];
                    return this;
                }
                clone() {
                    let T = this;
                    return new Triangle(T.x1, T.y1, T.x2, T.y2, T.x3, T.y3);
                }
                equals(s) {
                    if (this.isEmpty() && s.isEmpty())
                        return true;
                    return Arrays.same(this.vertexes(), s.vertexes(), (p1, p2) => { return P.equal(p1, p2); });
                }
                inside(s) {
                    let T = this;
                    if (!s || T.isEmpty())
                        return false;
                    if (Types.isArray(s))
                        return geom.Shapes.inShape(s, this);
                    if (s.isEmpty())
                        return false;
                    if (s instanceof geom.Circle) {
                        let c = s;
                        if (!geom.Shapes.inShape([c.x, c.y], this))
                            return false;
                        let rr = c.r * c.r;
                        return this.edges().every(b => {
                            return math.Floats.greaterEqual(geom.Line.distanceSqToPoint(b.p1(), b.p2(), [c.x, c.y]), rr);
                        });
                    }
                    return s.vertexes().every(p => {
                        return T.inside(p) || T.onside(p);
                    });
                }
                onside(p) {
                    return !this.isEmpty() && geom.Shapes.onShape(p, this);
                }
                _addPoint(a, p) {
                    if (p && a.findIndex(b => { return P.equal(b, p); }) < 0)
                        a.push(p);
                }
                intersects(s) {
                    let T = this;
                    if (!s || T.isEmpty() || s.isEmpty())
                        return false;
                    if (s instanceof geom.Rect) {
                        if (T.inside(s))
                            return true;
                        let ps = [];
                        T.edges().forEach(b => {
                            let cps = geom.Shapes.crossPoints(b, s);
                            cps.forEach(it => {
                                T._addPoint(ps, it);
                            });
                        });
                        return ps.length >= 2;
                    }
                    let ps = geom.Shapes.crossPoints(s, T), len = ps.length;
                    if (len == 0)
                        return false;
                    if (len >= 2)
                        return true;
                    if (!(s instanceof S))
                        return false;
                    let p1 = s.p1(), p2 = s.p2();
                    return T.inside(p1) || T.inside(p2);
                }
                bounds() {
                    let T = this, minX = N.min(T.x1, T.x2, T.x3), minY = N.min(T.y1, T.y2, T.y3), maxX = N.max(T.x1, T.x2, T.x3), maxY = N.max(T.y1, T.y2, T.y3), w = maxX - minX, h = maxY - minY, x = minX, y = minY;
                    return new geom.Rect(x, y, w, h);
                }
                edges() {
                    let ps = this.vertexes(), p1 = ps[0], p2 = ps[1], p3 = ps[2], a = new S(p1[0], p1[1], p2[0], p2[1]), b = new S(p2[0], p2[1], p3[0], p3[1]), c = new S(p3[0], p3[1], p1[0], p1[1]);
                    return [a, b, c];
                }
                _sides() {
                    let ps = this.vertexes(), p1 = ps[0], p2 = ps[1], p3 = ps[2], a = P.distance(p1[0], p1[1], p2[0], p2[1]), b = P.distance(p2[0], p2[1], p3[0], p3[1]), c = P.distance(p3[0], p3[1], p1[0], p1[1]);
                    return [a, b, c];
                }
                perimeter() {
                    if (this.isEmpty())
                        return 0;
                    let s = this._sides();
                    return s[0] + s[1] + s[2];
                }
                angles() {
                    let T = this;
                    if (T.isEmpty())
                        return [];
                    let a1 = new V().set(T.p1(), T.p2()).angle(new V().set(T.p1(), T.p3())), a2 = new V().set(T.p2(), T.p1()).angle(new V().set(T.p2(), T.p3())), d1 = math.Radians.rad2deg(a1), d2 = math.Radians.rad2deg(a2), d3 = 180 - d1 - d2;
                    return [d1, d2, d3];
                }
                angleType() {
                    if (this.isEmpty())
                        return geom.AngleType.UNKNOWN;
                    let as = this.angles(), d1 = as[0] - 90, d2 = as[1] - 90, d3 = as[2] - 90;
                    if (d1 == 0 || d2 == 0 || d3 == 0)
                        return geom.AngleType.RIGHT;
                    if (d1 < 0 || d2 < 0 || d3 < 0)
                        return geom.AngleType.ACUTE;
                    return geom.AngleType.OBTUSE;
                }
                area() {
                    if (this.isEmpty())
                        return 0;
                    let s = this._sides(), a = s[0], b = s[1], c = s[2], p = (a + b + c) / 2;
                    return Math.sqrt(p * (p - a) * (p - b) * (p - c));
                }
                gravityPoint() {
                    let T = this;
                    if (T.isEmpty())
                        return null;
                    let p1 = T.p1(), p2 = T.p2(), p3 = T.p3();
                    return [(p1[0] + p2[0] + p3[0]) / 3, (p1[1] + p2[1] + p3[1]) / 3];
                }
            }
            geom.Triangle = Triangle;
        })(geom = math.geom || (math.geom = {}));
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Triangle = JS.math.geom.Triangle;
