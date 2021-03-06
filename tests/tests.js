//# sourceURL=../tests/tests.js
//JSDK 2.7.0 MIT
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var JS;
(function (JS) {
    let test;
    (function (test) {
        let BiMapTest = class BiMapTest extends TestCase {
            constructor() {
                super(...arguments);
                this.a = new BiMap();
            }
            setUp() {
                this.a.clear();
            }
            test1() {
                this.a.put('k1', 1);
                this.a.put('k2', 2);
                this.a.put('k3', 3);
                let b = this.a.inverse();
                Assert.equal('k1', b.get(1));
                Assert.equal(3, b.size());
                Assert.equal(1, this.a.get('k1'));
                Assert.equal(2, this.a.get('k2'));
                Assert.equal(3, this.a.size());
            }
            test2() {
                this.a = new BiMap([
                    ['k1', 1], ['k2', 2], ['k3', 3]
                ]);
                Assert.equal(3, this.a.size());
                Assert.equal(1, this.a.get('k1'));
                Assert.true(this.a.has('k1'));
                this.a.delete('k1');
                Assert.equal(2, this.a.size());
                Assert.equal(undefined, this.a.get('k1'));
                Assert.false(this.a.has('k1'));
            }
            test3() {
                this.a = new BiMap([
                    ['k1', 1], ['k2', 2], ['k3', 3]
                ]);
                Assert.false(this.a.has('k4'));
                Assert.true(this.a.has('k1'));
            }
        };
        BiMapTest = __decorate([
            klass('JS.test.BiMapTest')
        ], BiMapTest);
        test.BiMapTest = BiMapTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let LinkedListTest = class LinkedListTest extends TestCase {
            constructor() {
                super(...arguments);
                this.a = new LinkedList();
            }
            setUp() {
                this.a.clear();
            }
            test1() {
                this.a.add(3);
                this.a.add([2, 1]);
                Assert.equal(3, this.a.get(0));
                Assert.equal(1, this.a.get(2));
                this.a.addAt(1, 0.5);
                Assert.equal(0.5, this.a.get(1));
                Assert.equal(4, this.a.size());
                let b = new LinkedList();
                b.addLast(22);
                Assert.equal([22], b.toArray());
                b.addFirst(11);
                Assert.equal([11, 22], b.toArray());
                b.addAt(0, 33);
                Assert.equal([33, 11, 22], b.toArray());
                b.addAt(2, 44);
                Assert.equal([33, 11, 44, 22], b.toArray());
                Assert.equal(4, b.size());
                Assert.equal(33, b.get(0));
                Assert.equal(11, b.get(1));
                Assert.equal(44, b.get(2));
                Assert.equal(22, b.get(3));
                Assert.equal(33, b.getFirst());
                Assert.equal(22, b.getLast());
                this.a.addAll(b);
                Assert.equal(8, this.a.size());
                Assert.equal(22, this.a.get(7));
                Assert.equal([3, 0.5, 2, 1, 33, 11, 44, 22], this.a.toArray());
            }
            test2() {
                this.a.removeFirst();
                Assert.equal(0, this.a.size());
                this.a.removeLast();
                Assert.equal(0, this.a.size());
                this.a.add([3, 2, 1]);
                this.a.removeFirst();
                Assert.equal([2, 1], this.a.toArray());
                this.a.removeLast();
                Assert.equal([2], this.a.toArray());
                this.a.removeFirst();
                Assert.equal([], this.a.toArray());
            }
            test3() {
                Assert.equal(null, this.a.peek());
                this.a.add([3, 2, 1]);
                Assert.equal(3, this.a.peek());
                Assert.equal(3, this.a.size());
                Assert.equal(1, this.a.peekLast());
                Assert.equal(3, this.a.size());
                Assert.equal(3, this.a.peekFirst());
                Assert.equal(3, this.a.size());
            }
            test4() {
                this.a.add([3, 2, 1, 1]);
                Assert.equal(0, this.a.indexOf(3));
                Assert.equal(2, this.a.indexOf(1));
                Assert.equal(3, this.a.lastIndexOf(1));
                Assert.equal(1, this.a.lastIndexOf(2));
                Assert.true(this.a.contains(2));
                Assert.false(this.a.contains(-1));
                Assert.false(this.a.contains(null));
                Assert.false(this.a.contains(undefined));
            }
            test5() {
                this.a.add([3, 2, 1, 1]);
                Assert.equal(3, this.a.get(0));
                Assert.equal(3, this.a.getFirst());
                Assert.equal(1, this.a.getLast());
                Assert.equal(1, this.a.get(3));
            }
            test6() {
                this.a.add([3, 2, 1, 1]);
                let b = this.a.clone();
                Assert.equal(this.a.toArray(), b.toArray());
            }
            test7() {
                this.a.add([3, 2, 1]);
                Assert.true(this.a.each(item => {
                    return item > 0;
                }));
            }
        };
        LinkedListTest = __decorate([
            klass('JS.test.LinkedListTest')
        ], LinkedListTest);
        test.LinkedListTest = LinkedListTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let CirArcTest = class CirArcTest extends TestCase {
            constructor() {
                super(...arguments);
                this.s0 = new CirArc(ArcType.PIE, 0, 0, 1, 0, -0.5 * Math.PI, 0);
                this.s1 = new CirArc(ArcType.OPEN, 0, 0, 1, 0, -0.5 * Math.PI, 0);
            }
            test1() {
                Assert.true(new CirArc().equals(new CirArc()));
                Assert.true(this.s0.equals(this.s0.clone()));
                Assert.true(this.s0.bounds().equals(new Rect(0, -1, 1, 1)));
                Assert.true(this.s1.bounds().equals(new Rect(0, -1, 1, 1)));
                let s3 = new CirArc(ArcType.PIE, 0, 0, 1, 0, -0.75 * Math.PI, 0);
                Assert.true(s3.bounds().equals(new Rect(-0.707, -0.707, 1.707, 0.707)));
                let s4 = new CirArc(ArcType.OPEN, 0, 0, 1, 0, -0.75 * Math.PI, 1);
                Assert.true(s4.bounds().equals(new Rect(-0.707, -0.707, 1.707, 0.707)));
                let s5 = new CirArc(ArcType.PIE, 0, 0, 1, 0, -1.25 * Math.PI, 0);
                Assert.true(s5.bounds().equals(new Rect(-0.707, 0, 1.707, 0.707)));
                let s6 = new CirArc(ArcType.OPEN, 0, 0, 1, 0, -1.25 * Math.PI, 1);
                Assert.true(s6.bounds().equals(new Rect(-0.707, 0, 1.707, 0.707)));
                let s7 = new CirArc(ArcType.PIE, 0, 0, 1, 0, .25 * Math.PI, 1);
                Assert.true(s7.bounds().equals(new Rect(0, 0, 1, 0.707)));
                let s8 = new CirArc(ArcType.OPEN, 0, 0, 1, 0, .25 * Math.PI, 1);
                Assert.true(s8.bounds().equals(new Rect(0, 0, 1, 0.707)));
                let s9 = new CirArc(ArcType.PIE, 0, 0, 1, 0, .25 * Math.PI, 0);
                Assert.true(s9.bounds().equals(new Rect(0, 0, 1, 0.707)));
                let s10 = new CirArc(ArcType.OPEN, 0, 0, 1, 0, .25 * Math.PI, 0);
                Assert.true(s10.bounds().equals(new Rect(0, 0, 1, 0.707)));
            }
            test2() {
                Assert.equal(new Circle(this.s0.x, this.s0.y, this.s0.r).perimeter() / 4 + 2 * this.s0.r, this.s0.perimeter());
                Assert.equal(new Circle(this.s0.x, this.s0.y, this.s0.r).perimeter() / 4, this.s1.perimeter());
                Assert.equal(this.s0.arcLength(), this.s1.perimeter());
                Assert.equal(new Circle(this.s0.x, this.s0.y, this.s0.r).area() / 4, this.s0.area());
                Assert.equal(0, this.s1.area());
            }
        };
        CirArcTest = __decorate([
            klass('JS.test.CirArcTest')
        ], CirArcTest);
        test.CirArcTest = CirArcTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let CircleTest = class CircleTest extends TestCase {
            constructor() {
                super(...arguments);
                this.c0 = new Circle(0, 0, 1);
                this.p1 = [1, 0];
                this.p2 = [0, 1];
                this.p3 = [-1, 0];
                this.p4 = [0, -1];
            }
            test1() {
                Assert.false(this.c0.equals(new Circle()));
                Assert.true(this.c0.clone().set([0, 0], 0).equals(new Circle()));
                Assert.true(this.c0.equals(this.c0.clone()));
            }
            test2() {
                Assert.true(this.c0.onside(this.p1));
                Assert.true(this.c0.onside(this.p2));
                Assert.true(this.c0.onside(this.p3));
                Assert.true(this.c0.onside(this.p4));
                Assert.false(this.c0.onside([0, 0]));
                Assert.false(this.c0.onside([1, 1]));
            }
            test3() {
                Assert.true(this.c0.inside([0, 0]));
                Assert.false(this.c0.inside([1, 1]));
                Assert.false(this.c0.inside(this.p1));
            }
            test4() {
                Assert.true(this.c0.intersects(Line.toLine(this.p1, this.p3)));
                Assert.true(this.c0.intersects(Line.toLine([1, 0], [0, -1])));
                Assert.false(this.c0.intersects(Line.toLine([1, 1], [1, 0])));
                Assert.false(this.c0.intersects(Line.toLine([2, 0], [0, -2])));
                Assert.true(this.c0.intersects(Segment.toSegment(this.p1, this.p3)));
                Assert.true(this.c0.intersects(Segment.toSegment([1, 0], [0, -1])));
                Assert.false(this.c0.intersects(Segment.toSegment(this.p1, [2, 0])));
                Assert.false(this.c0.intersects(Segment.toSegment([1, 1], [1, 0])));
                Assert.false(this.c0.intersects(Segment.toSegment([1, 1], [2, 2])));
                Assert.true(this.c0.intersects(Circle.toCircle([1, 0], 1)));
                Assert.false(this.c0.intersects(Circle.toCircle([2, 0], 1)));
                Assert.true(this.c0.intersects(Circle.toCircle([1, 1], 1)));
                Assert.true(this.c0.intersects(Circle.toCircle([0.5, 0], 0.5)));
                Assert.true(this.c0.intersects(this.c0.bounds()));
                Assert.true(this.c0.intersects(Rect.toRect([0, 0], 1, 1)));
                Assert.true(this.c0.intersects(Rect.toRect([-.5, -.5], .5, .5)));
                Assert.true(this.c0.intersects(Rect.toRect([-2, -2], 4, 4)));
                Assert.false(this.c0.intersects(Rect.toRect([1, -1], 2, 2)));
            }
        };
        CircleTest = __decorate([
            klass('JS.test.CircleTest')
        ], CircleTest);
        test.CircleTest = CircleTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let FloatsTest = class FloatsTest extends TestCase {
            test1() {
                Assert.true(Floats.equal(Number(0.0001), Number(0.0002)));
                Assert.true(Floats.equal(Number(0.0001), Number(0.00012)));
                Assert.false(Floats.equal(Number(0.0001), Number(0.0003)));
                Assert.false(Floats.equal(Number(0.001), Number(0.002)));
            }
            test2() {
                Floats.EQUAL_PRECISION = 0.01;
                Assert.true(Floats.equal(Number(0.0001), Number(0.0002)));
                Assert.false(Floats.equal(Number(0.1), Number(0.2)));
                Floats.EQUAL_PRECISION = 0.00001;
                Assert.false(Floats.equal(Number(0.0001), Number(0.0002)));
                Assert.false(Floats.equal(Number(0.1), Number(0.2)));
            }
            test3() {
                Assert.true(Floats.equal(Number(0.0001), Number(0.0002), 0.01));
                Assert.false(Floats.equal(Number(0.1), Number(0.2), 0.01));
                Assert.false(Floats.equal(Number(0.0001), Number(0.0002), 0.00001));
                Assert.false(Floats.equal(Number(0.1), Number(0.2), 0.00001));
            }
            test4() {
                Floats.EQUAL_PRECISION = 0.0001;
                Assert.true(Floats.greaterEqual(Number(0.0001), Number(0.0002)));
                Assert.false(Floats.greater(Number(0.0001), Number(0.0002)));
                Assert.true(Floats.greater(Number(0.0003), Number(0.0001)));
            }
            test5() {
                Assert.true(Floats.lessEqual(Number(0.0001), Number(0.0002)));
                Assert.false(Floats.less(Number(0.0001), Number(0.0002)));
                Assert.true(Floats.less(Number(0.0001), Number(0.0003)));
            }
        };
        FloatsTest = __decorate([
            klass('JS.test.FloatsTest')
        ], FloatsTest);
        test.FloatsTest = FloatsTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let LineTest = class LineTest extends TestCase {
            constructor() {
                super(...arguments);
                this.p1 = [1, 1];
                this.p2 = [-1, 1];
                this.p3 = [-1, -1];
                this.p4 = [1, -1];
            }
            test1() {
                Assert.equal(-1, Line.position(this.p1, this.p2, [0, 0], [1, 0]));
                Assert.equal(-1, Line.position(this.p1, this.p4, [0, 0], [0, 1]));
                Assert.equal(-1, Line.position(this.p2, this.p4, [1, 0], [0, 1]));
                Assert.equal(0, Line.position(this.p1, this.p2, this.p2, [0, 1]));
                Assert.equal(0, Line.position(this.p1, this.p4, this.p1, [1, 0]));
                Assert.equal(0, Line.position(this.p2, this.p4, [0, 0], this.p2));
                Assert.equal(1, Line.position(this.p1, this.p3, Line.Y.p1(), Line.Y.p2()));
                Assert.equal(1, Line.position(this.p2, this.p4, Line.X.p1(), Line.X.p2()));
                Assert.equal(2, Line.position(Line.X.p1(), Line.X.p2(), Line.Y.p1(), Line.Y.p2()));
                Assert.equal(2, Line.position(Line.Y.p1(), Line.Y.p2(), Line.X.p1(), Line.X.p2()));
                Assert.equal(2, Line.position(this.p1, this.p3, this.p2, this.p4));
            }
            test2() {
                Assert.true(Point2.equal([1, 0], Line.X.crossPoint(this.p1)));
                Assert.true(Point2.equal([1, 0], Line.X.crossPoint(this.p4)));
                Assert.true(Point2.equal([0, 1], Line.Y.crossPoint(this.p1)));
                Assert.true(Point2.equal([0, 1], Line.Y.crossPoint(this.p2)));
                Assert.true(Point2.equal([0, 0], Line.toLine(this.p2, this.p4).crossPoint(this.p1)));
                Assert.true(Point2.equal([1, 1], Line.toLine([2, 0], [0, 2]).crossPoint([0, 0])));
                Assert.true(Point2.equal([-1, 0], Line.X.crossPoint([-1, 0])));
                Assert.true(Point2.equal([0, 0], Line.X.crossPoint([0, 0])));
            }
            test3() {
                Assert.true(Point2.equal([0, 0], Line.toLine(this.p1, this.p3).crossLine(Line.toLine(this.p2, this.p4))));
                Assert.true(Point2.equal([0, 0], Line.toLine(this.p1, this.p3).crossLine(Line.toLine(this.p4, this.p2))));
                Assert.true(Point2.equal([0, 0], Line.toLine(this.p3, this.p1).crossLine(Line.toLine(this.p2, this.p4))));
                Assert.true(Point2.equal([0, 0], Line.toLine(this.p3, this.p1).crossLine(Line.toLine(this.p4, this.p2))));
                Assert.true(Point2.equal([0, 0], Line.X.crossLine(Line.Y)));
                Assert.true(Point2.equal([1, 0], Line.X.crossLine(Line.toLine(this.p1, this.p4))));
                Assert.true(Point2.equal([0, 1], Line.Y.crossLine(Line.toLine(this.p1, this.p2))));
            }
            test4() {
                Assert.true(Point2.equal([0, 0], Line.toLine(this.p1, this.p3).crossRay(this.p4, 0.75 * Math.PI)));
                Assert.true(Point2.equal([0, 0], Line.toLine(this.p1, this.p3).crossRay(this.p2, 1.75 * Math.PI)));
                Assert.true(Point2.equal(null, Line.toLine(this.p1, this.p3).crossRay(this.p4, 1.75 * Math.PI)));
                Assert.true(Point2.equal(null, Line.toLine(this.p1, this.p3).crossRay(this.p2, 0.75 * Math.PI)));
                Assert.true(Point2.equal([0, 0], Line.toLine(this.p1, this.p3).crossRay([0, 1], 1.5 * Math.PI)));
            }
            test5() {
                let line = new Line().set(this.p2, this.p4), p = this.p1, cp = line.crossPoint(p);
                Assert.true(Floats.equal(Point2.distanceSq(cp[0], cp[1], p[0], p[1]), Line.distanceSqToPoint(line.p1(), line.p2(), p)));
                line = new Line().set([-2, 0], [0, 2]);
                p = [0, 0];
                cp = line.crossPoint(p);
                Assert.true(Floats.equal(Point2.distanceSq(cp[0], cp[1], p[0], p[1]), Line.distanceSqToPoint(line.p1(), line.p2(), p)));
                line = new Line().set([3.14, 1.78], [-5.82, -6.71]);
                p = [1, 1];
                cp = line.crossPoint(p);
                Assert.true(Floats.equal(Point2.distanceSq(cp[0], cp[1], p[0], p[1]), Line.distanceSqToPoint(line.p1(), line.p2(), p)));
            }
            test6() {
                let line = new Line().set(this.p2, this.p4);
                Assert.true(line.inside(this.p2));
                Assert.true(line.inside(this.p4));
                Assert.true(line.inside([0, 0]));
                Assert.true(line.inside([-1.5678, 1.5678]));
                Assert.true(line.inside(new Segment().set([-4.5678, 4.5678], [6.5678, -6.5678])));
                Assert.false(line.inside(new Segment()));
            }
            test7() {
                let line1 = new Line().set(this.p2, this.p4), line2 = new Line().set([-1, 0], [0, 0]), line3 = new Line().set([0, 0], [1, 0]);
                Assert.true(line1.intersects(Line.X));
                Assert.true(line1.intersects(Line.Y));
                Assert.true(line1.intersects(line2));
                Assert.true(line1.intersects(line3));
                Assert.true(line1.intersects(new Line().set(this.p1, this.p3)));
                Assert.true(line2.intersects(Line.X));
                Assert.false(line2.intersects(new Line().set(this.p2, this.p1)));
                Assert.false(Line.X.intersects(new Line().set(this.p2, this.p1)));
                Assert.false(line2.intersects(new Segment().set(this.p2, this.p1)));
                Assert.false(Line.X.intersects(new Segment().set(this.p2, this.p1)));
                Assert.false(line1.intersects(new Segment().set([0, 1], [1, 0])));
                Assert.false(new Segment().intersects(new Segment().set([0, 1], [1, 0])));
                Assert.true(line1.intersects(line2.toSegment()));
                Assert.true(line1.intersects(line3.toSegment()));
                Assert.true(line1.intersects(new Segment().set([-1, 0], [1, 0])));
                Assert.false(line1.intersects(new Line()));
                Assert.false(line1.intersects(new Segment()));
            }
        };
        LineTest = __decorate([
            klass('JS.test.LineTest')
        ], LineTest);
        test.LineTest = LineTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let PointTest = class PointTest extends TestCase {
            test1() {
                let pp = Point2.xy2polar(1, 1);
                Assert.true(Point2.equal([1, 1], Point2.polar2xy(pp.d, pp.a)));
            }
            test2() {
                Assert.true(Point2.isOrigin(0.0001, -0.0001));
            }
            test3() {
                Assert.equal(0, Point2.radian(0.0001, -0.0001));
                Assert.true(Radians.equal(Radians.deg2rad(90 + 45), Point2.radian(-1, 1)));
            }
            test4() {
                Assert.true(Floats.equal(1.4142, Point2.distance(0, 0, 1, 1)));
                Assert.true(Floats.equal(2, Point2.distanceSq(0, 0, 1, 1)));
                Assert.true(Floats.equal(2, Point2.distance(-1, 1, 1, 1)));
                Assert.true(Floats.equal(4, Point2.distanceSq(-1, 1, 1, 1)));
                Assert.true(Floats.equal(1.4142, Point2.distance(1, 0, 0, 1)));
                Assert.true(Floats.equal(2, Point2.distanceSq(1, 0, 0, 1)));
            }
            test5() {
                Assert.true(Point2.equal([3, 0], new Point2(0, 0).toward(3, Radians.EAST).toArray()));
                Assert.true(Point2.equal([0, 0], new Point2(1, 1).toward(1.4142, 1.25 * Math.PI).toArray()));
                Assert.true(Point2.equal([-1, -1], new Point2(0, 0).toward(1.4142, 1.25 * Math.PI).toArray()));
                Assert.true(Point2.equal([-1, 1], new Point2(1, -1).toward(2.8284, .75 * Math.PI).toArray()));
            }
        };
        PointTest = __decorate([
            klass('JS.test.PointTest')
        ], PointTest);
        test.PointTest = PointTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let PolygonTest = class PolygonTest extends TestCase {
            constructor() {
                super(...arguments);
                this.p0 = new Polygon().addPoint(-1, 1).addPoint(-1, 0).addPoint(1, 0).addPoint(1, -1).addPoint(0, -1).addPoint(0, 1);
            }
            test1() {
                Assert.false(this.p0.equals(new Polygon));
                Assert.true(this.p0.equals(this.p0.clone()));
                Assert.true(this.p0.bounds().equals(new Rect(-1, -1, 2, 2)));
                Assert.equal(8, this.p0.perimeter());
            }
            test2() {
                let p1 = new Polygon();
                Assert.true(p1.bounds().equals(new Rect()));
                p1.addPoint(-1, 1).addPoint(-1, 0).addPoint(1, 0);
                Assert.true(p1.bounds().equals(new Rect(-1, 0, 2, 1)));
                Assert.true(p1.addPoint(1, -1).bounds().equals(new Rect(-1, -1, 2, 2)));
                Assert.true(p1.addPoint(0, -1).bounds().equals(new Rect(-1, -1, 2, 2)));
                Assert.true(p1.addPoint(0, 1).bounds().equals(new Rect(-1, -1, 2, 2)));
                Assert.true(p1.addPoint(1, 2).bounds().equals(new Rect(-1, -1, 2, 3)));
            }
            test3() {
                Assert.true(this.p0.onside([0, 0]));
                Assert.true(this.p0.onside([0.5, 0]));
                Assert.true(this.p0.onside([-0.5, 1]));
                Assert.false(this.p0.onside([-1, -1]));
                Assert.false(this.p0.onside([-0.5, 0.5]));
                Assert.false(this.p0.onside([1, 1]));
            }
            test4() {
                Assert.false(this.p0.inside([0, 0]));
                Assert.false(this.p0.inside([-1, 1]));
                Assert.false(this.p0.inside([1, 1]));
                Assert.true(this.p0.inside([-.5, .5]));
                Assert.true(this.p0.inside([.5, -.5]));
                let p = this.p0.clone().addPoint(1, 2).addPoint(1, 1);
                Assert.true(p.onside([.5, 1.5]));
                Assert.false(p.inside([.5, 1.5]));
                Assert.true(p.inside([.5, 1.49]));
                Assert.true(p.inside([.5, 1.25]));
            }
        };
        PolygonTest = __decorate([
            klass('JS.test.PolygonTest')
        ], PolygonTest);
        test.PolygonTest = PolygonTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let RadiansTest = class RadiansTest extends TestCase {
            test1() {
                Assert.true(Radians.equal((3.5 * Math.PI) % (2 * Math.PI), Radians.NORTH));
                Assert.true(Radians.equal(Radians.deg2rad(45), 0.25 * Math.PI));
                Assert.true(Radians.equal(Radians.deg2rad(360 + 45), 0.25 * Math.PI + 2 * Math.PI));
                Assert.true(Radians.equal(Radians.rad2deg(Radians.SOUTH), 90));
                Assert.true(Radians.equal(Radians.reverse(Radians.EAST), Radians.WEST));
                Assert.true(Radians.equal(Radians.reverse(Radians.SOUTH), Radians.NORTH));
                let rad = Radians.deg2rad(75);
                Assert.equal(Radians.reverse(rad) - rad, Math.PI);
            }
        };
        RadiansTest = __decorate([
            klass('JS.test.RadiansTest')
        ], RadiansTest);
        test.RadiansTest = RadiansTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let RectTest = class RectTest extends TestCase {
            constructor() {
                super(...arguments);
                this.rect1 = new Rect(-1, -1, 2, 2);
                this.rect2 = new Rect(-1, -1, 1, 1);
                this.rect3 = new Rect(0, 0, 1, 1);
            }
            test1() {
                Assert.true(this.rect1.equals(this.rect1.clone()));
                Assert.true(this.rect1.equals(new Rect().set(-1, -1, 2, 2)));
                Assert.false(this.rect1.equals(new Rect().set(-1, -1, 1, 2)));
            }
            test2() {
                Assert.true(this.rect1.equals(this.rect2.union(this.rect3)));
            }
            test3() {
                Assert.true(this.rect1.inside([0, 0]));
                Assert.false(this.rect1.inside([-1, -1]));
                Assert.false(this.rect1.inside([1, 1]));
                Assert.false(this.rect1.inside([1.1, 1.0]));
                Assert.true(this.rect1.onside([-1, -1]));
                Assert.true(this.rect1.onside([1, 1]));
                Assert.true(this.rect1.inside(this.rect2));
                Assert.true(this.rect1.inside(this.rect3));
                Assert.false(this.rect1.inside(new Rect()));
                Assert.false(this.rect2.inside(this.rect1));
                Assert.false(this.rect2.inside(this.rect3));
                Assert.true(this.rect2.inside(this.rect2));
                Assert.false(this.rect3.inside(this.rect1));
                Assert.false(this.rect3.inside(this.rect2));
                Assert.true(this.rect3.inside(this.rect3));
                Assert.true(this.rect2.onside([0, 0]));
                Assert.true(this.rect3.onside([0, 0]));
            }
            test4() {
                Assert.false(this.rect2.intersects(this.rect3));
                Assert.equal(null, this.rect2.intersection(this.rect3));
                Assert.true(this.rect1.intersection(this.rect2).equals(this.rect2));
                Assert.true(this.rect1.intersection(this.rect3).equals(this.rect3));
                Assert.false(Rect.toRect([0, -1], 1, 1).intersects(new Segment(1, 0, 0, 1)));
                Assert.false(Rect.toRect([0, -1], 1, 1).intersects(new Segment(0, 0, 1, 0)));
            }
        };
        RectTest = __decorate([
            klass('JS.test.RectTest')
        ], RectTest);
        test.RectTest = RectTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let SegmentTest = class SegmentTest extends TestCase {
            constructor() {
                super(...arguments);
                this.p1 = [1, 1];
                this.p2 = [-1, 1];
                this.p3 = [-1, -1];
                this.p4 = [1, -1];
            }
            test1() {
                let sx = Line.X.toSegment(), sy = Line.Y.toSegment();
                Assert.true(Point2.equal([0, 0], sx.crossSegment(sy)));
                let s0 = new Segment().set([-1, 0], [1, 0]);
                Assert.false(Point2.equal([0, 0], sx.crossSegment(s0)));
                let s1 = Segment.toSegment(this.p1, this.p3), s2 = Segment.toSegment(this.p2, this.p4);
                Assert.true(Point2.equal([0, 0], s1.crossSegment(s2)));
                let s3 = Segment.toSegment([1, -1], [2, -2]);
                Assert.false(Point2.equal([0, 0], s1.crossSegment(s3)));
            }
            test2() {
                Assert.true(Point2.equal([0, 0], Segment.toSegment(this.p1, this.p3).crossLine(Line.toLine(this.p2, this.p4))));
                Assert.true(Point2.equal([0, 0], Segment.toSegment(this.p1, this.p3).crossLine(Line.toLine(this.p4, this.p2))));
                Assert.true(Point2.equal([0, 0], Segment.toSegment(this.p3, this.p1).crossLine(Line.toLine(this.p2, this.p4))));
                Assert.true(Point2.equal([0, 0], Segment.toSegment(this.p3, this.p1).crossLine(Line.toLine(this.p4, this.p2))));
                let s1 = Segment.toSegment([1, 0], [2, 0]), s2 = Segment.toSegment([-1, 0], [2, 0]);
                Assert.false(Point2.equal([0, 0], s1.crossLine(Line.Y)));
                Assert.true(Point2.equal([1, 0], s2.crossLine(Line.toLine(this.p1, this.p4))));
            }
            test3() {
                Assert.true(Point2.equal([0, 0], Segment.toSegment(this.p1, this.p3).crossRay(this.p4, 0.75 * Math.PI)));
                Assert.true(Point2.equal([0, 0], Segment.toSegment(this.p1, this.p3).crossRay(this.p2, 1.75 * Math.PI)));
                Assert.true(Point2.equal(null, Segment.toSegment(this.p1, this.p3).crossRay(this.p4, 1.75 * Math.PI)));
                Assert.true(Point2.equal(null, Segment.toSegment(this.p1, this.p3).crossRay(this.p2, 0.75 * Math.PI)));
                Assert.true(Point2.equal([0, 0], Segment.toSegment(this.p1, this.p3).crossRay([0, 1], 1.5 * Math.PI)));
                Assert.true(Point2.equal(null, Segment.toSegment(this.p1, [0.1, 0.1]).crossRay(this.p4, 0.75 * Math.PI)));
            }
            test4() {
                let line = new Segment().set(this.p2, this.p4), p = this.p1, cp = line.crossPoint(p);
                Assert.true(Floats.equal(Point2.distanceSq(cp[0], cp[1], p[0], p[1]), Segment.distanceSqToPoint(line.p1(), line.p2(), p)));
                line = new Segment().set([-2, 0], [0, 2]);
                p = [0, 0];
                cp = line.crossPoint(p);
                Assert.true(Floats.equal(Point2.distanceSq(cp[0], cp[1], p[0], p[1]), Segment.distanceSqToPoint(line.p1(), line.p2(), p)));
                line = new Segment().set([3.14, 1.78], [-5.82, -6.71]);
                p = [1, 1];
                cp = line.crossPoint(p);
                Assert.true(Floats.equal(Point2.distanceSq(cp[0], cp[1], p[0], p[1]), Segment.distanceSqToPoint(line.p1(), line.p2(), p)));
            }
            test5() {
                let line = new Segment().set(this.p2, this.p4);
                Assert.true(line.inside(this.p2));
                Assert.true(line.inside(this.p4));
                Assert.true(line.inside([0, 0]));
                Assert.false(line.inside([-1.5678, 1.5678]));
                Assert.false(line.inside(new Segment().set([-4.5678, 4.5678], [-2.5678, 2.5678])));
                Assert.false(line.inside(new Segment().set([-4.5678, 4.5678], [-0.5678, 0.5678])));
                Assert.true(line.inside(new Segment().set([-0.9, 0.9], [-0.5678, 0.5678])));
                Assert.false(line.inside(new Segment()));
            }
            test6() {
                let line1 = new Segment().set(this.p2, this.p4), line2 = new Segment().set([-1, 0], [0, 0]), line3 = new Segment().set([0, 0], [1, 0]);
                Assert.true(line1.intersects(Line.X));
                Assert.true(line1.intersects(Line.Y));
                Assert.true(line1.intersects(line2));
                Assert.true(line1.intersects(line3));
                Assert.true(line1.intersects(new Line().set(this.p1, this.p3)));
                Assert.true(line2.intersects(Line.X));
                Assert.false(line2.intersects(new Line().set(this.p2, this.p1)));
                Assert.false(Line.X.intersects(new Line().set(this.p2, this.p1)));
                Assert.false(line2.intersects(new Segment().set(this.p2, this.p1)));
                Assert.false(Line.X.intersects(new Segment().set(this.p2, this.p1)));
                Assert.false(line1.intersects(new Segment().set([0, 1], [1, 0])));
                Assert.false(new Segment().intersects(new Segment().set([0, 1], [1, 0])));
                Assert.true(line1.intersects(line2.toSegment()));
                Assert.true(line1.intersects(line3.toSegment()));
                Assert.false(line1.intersects(new Segment().set([0.1, 0], [1, 0])));
                Assert.false(line1.intersects(new Line()));
                Assert.false(line1.intersects(new Segment()));
            }
        };
        SegmentTest = __decorate([
            klass('JS.test.SegmentTest')
        ], SegmentTest);
        test.SegmentTest = SegmentTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let TriangleTest = class TriangleTest extends TestCase {
            constructor() {
                super(...arguments);
                this.p1 = [1, 0];
                this.p2 = [0, 1];
                this.p3 = [-1, 0];
                this.p4 = [0, -1];
            }
            test1() {
                Assert.true(new Triangle().equals(new Triangle()));
                Assert.true(Triangle.toTri(this.p1, this.p2, this.p3).equals(new Triangle().set(this.p3, this.p2, this.p1)));
                Assert.true(Triangle.toTri(this.p1, this.p2, this.p3).equals(new Triangle().set(this.p1, this.p3, this.p2)));
            }
            test2() {
                Assert.true(Triangle.toTri(this.p1, this.p2, [0, 0]).bounds().equals(Rect.toRect([0, 0], 1, 1)));
                Assert.true(Triangle.toTri(this.p1, this.p2, this.p3).bounds().equals(Rect.toRect([-1, 0], 2, 1)));
            }
            test3() {
                Assert.true(Triangle.toTri(this.p1, this.p2, [0, 0]).onside([0, 0]));
                Assert.true(Triangle.toTri(this.p1, this.p2, [0, 0]).onside([0.5, 0.5]));
                Assert.true(Triangle.toTri(this.p1, this.p2, [0, 0]).inside([0.49, 0.49]));
                Assert.false(Triangle.toTri(this.p1, this.p2, [0, 0]).onside([0.49, 0.49]));
                Assert.true(Triangle.toTri(this.p1, this.p2, this.p3).onside([0, 0]));
                Assert.true(Triangle.toTri(this.p1, this.p2, this.p3).onside([-0.5, 0]));
                Assert.true(Triangle.toTri(this.p1, this.p2, this.p3).inside([-0.4, 0.2]));
                Assert.false(Triangle.toTri(this.p1, this.p2, this.p3).onside([-0.4, 0.2]));
            }
            test4() {
                let tri = Triangle.toTri(this.p1, this.p2, [0, 0]);
                Assert.false(tri.intersects(Rect.toRect([0, -1], 1, 1)));
                Assert.false(tri.intersects(Rect.toRect([1, 0], 1, 1)));
                Assert.true(tri.intersects(Rect.toRect([0.5, 0], 1, 1)));
                Assert.true(tri.intersects(tri.bounds()));
                Assert.true(tri.intersects(Rect.toRect([0, 0], 0.5, 0.5)));
                Assert.false(tri.intersects(Line.toLine([1, 0], [0, 1])));
                Assert.false(tri.intersects(Line.X));
                Assert.false(tri.intersects(Line.Y));
                Assert.false(tri.intersects(Line.toLine([1, 0], [2, 0])));
                Assert.true(tri.intersects(Line.toLine([0.5, 0], [0, 1])));
                Assert.true(tri.intersects(Line.toLine([0.5, 0], [0.5, 1])));
                Assert.false(tri.intersects(Segment.toSegment([1, 0], [0, 1])));
                Assert.false(tri.intersects(Segment.toSegment([1, 0], [0, 0])));
                Assert.false(tri.intersects(Segment.toSegment([0, 1], [0, 0])));
                Assert.false(tri.intersects(Segment.toSegment([1, 0], [2, 0])));
                Assert.true(tri.intersects(Segment.toSegment([0.5, 0], [0, 1])));
                Assert.true(tri.intersects(Segment.toSegment([0.5, 0], [0.5, 1])));
                Assert.false(tri.intersects(Segment.toSegment([1, -1], [-1, 1])));
            }
        };
        TriangleTest = __decorate([
            klass('JS.test.TriangleTest')
        ], TriangleTest);
        test.TriangleTest = TriangleTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let Vector2Test = class Vector2Test extends TestCase {
            test1() {
                let v1 = Vector2.toVector([1, 1], [0, 0]), v2 = Vector2.toVector([2, 2], [1, 1]);
                Assert.true(v1.equals(v2));
            }
            test2() {
                let v1 = Vector2.toVector([1, 1], [2, 2]), v2 = Vector2.toVector([2, 2], [1, 1]);
                Assert.true(v1.equals(v2.negate()));
            }
            test3() {
                let v1 = Vector2.toVector([1, 0], [2.5, 0]);
                Assert.true(v1.normalize().equals(Vector2.UnitX));
                let v2 = Vector2.toVector([0, 0.25], [0, 0.375]);
                Assert.true(v2.normalize().equals(Vector2.UnitY));
            }
            test4() {
                let v1 = Vector2.toVector([0, 0], [1, 1]);
                Assert.true(Radians.equal(0.25 * Math.PI, v1.radian()));
                Assert.true(Radians.equal(0.25 * Math.PI, v1.angle(Vector2.UnitY)));
                let v2 = Vector2.toVector([0, 0], [-1, 1]);
                Assert.true(Radians.equal(0.75 * Math.PI, v2.radian()));
                Assert.true(Radians.equal(0.25 * Math.PI, v2.angle(Vector2.UnitY)));
            }
            test5() {
                Assert.true(Vector2.UnitY.verticalTo(Vector2.UnitX));
                Assert.true(Vector2.UnitX.verticalTo(Vector2.UnitY));
                let v1 = Vector2.toVector([1.2, 1.34], [1.2, 2.75]);
                Assert.true(v1.verticalTo(Vector2.UnitX));
                Assert.true(v1.parallelTo(Vector2.UnitY));
                Assert.true(v1.negate().parallelTo(Vector2.UnitY));
            }
            test6() {
                Assert.true(Vector2.UnitY.clone().getNormL().normalize().equals(Vector2.UnitX));
                Assert.true(Vector2.UnitX.clone().getNormR().normalize().equals(Vector2.UnitY));
                let v1 = Vector2.toVector([0, 0], [1, 1]), v2 = Vector2.toVector([0, 0], [-1, 1]), v3 = Vector2.toVector([0, 0], [1, -1]);
                Assert.true(v1.getNormR().normalize().equals(v2.normalize()));
                Assert.true(v1.getNormL().normalize().equals(v3.normalize()));
            }
            test7() {
                let v1 = Vector2.toVector([0, 0], [1, 1]), v2 = Vector2.toVector([0, 0], [-1, 1]), v3 = Vector2.toVector([0, 0], [1, -1]);
                Assert.true(v1.getProject(Vector2.UnitY).equals(Vector2.UnitY));
                Assert.true(v2.getProject(v3).equals(v2));
                Assert.true(v2.getProject(Vector2.Zero).equals(Vector2.Zero));
                Assert.true(v2.getProject(Vector2.UnitX).equals(Vector2.UnitX.clone().negate()));
            }
            test8() {
                let v1 = Vector2.toVector([1, 1], [0, 0]), v2 = Vector2.toVector([0, 0], [-1, 1]), v3 = Vector2.toVector([0, 0], [1, -1]);
                Assert.true(v1.getReboundR(Vector2.UnitY.clone().negate()).equals(v2));
                Assert.true(v1.getReboundL(Vector2.UnitX.clone()).equals(v3));
                Assert.true(v2.clone().negate().getReboundL(Vector2.UnitY).equals(v1.clone().negate()));
                Assert.true(v3.clone().negate().getReboundR(Vector2.UnitX).equals(v1.clone().negate()));
            }
            test9() {
                let p1 = [1, 1], p2 = [-1, -1];
                Assert.equal(1, Vector2.whichSide(Line.X.p1(), Line.X.p2(), p1));
                Assert.equal(-1, Vector2.whichSide(Line.X.p1(), Line.X.p2(), p2));
                Assert.equal(-1, Vector2.whichSide(p1, p2, [-1, 1]));
                Assert.equal(1, Vector2.whichSide(p1, p2, [1, -1]));
                Assert.equal(0, Vector2.whichSide(p1, p2, [0, 0]));
            }
        };
        Vector2Test = __decorate([
            klass('JS.test.Vector2Test')
        ], Vector2Test);
        test.Vector2Test = Vector2Test;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
let Person = class Person extends Model {
};
Person.DEFAULT_FIELDS = [
    { name: 'code', isId: true },
    { name: 'name' },
    { name: 'age' },
    { name: 'birthday' },
    { name: 'data' }
];
Person = __decorate([
    klass('Person')
], Person);
var JS;
(function (JS) {
    let test;
    (function (test) {
        let ModelTest = class ModelTest extends TestCase {
            setUp() {
                this.person = new Person();
            }
            test1() {
                Assert.true(this.person.isEmpty());
                this.person.set('code', 1001);
                this.person.set('name', 'Bill');
                this.person.set('data', { a: 1 });
                Assert.false(this.person.isEmpty());
                Assert.equal(1001, this.person.get('code'));
                Assert.equal('Bill', this.person.get('name'));
                Assert.equal(1, this.person.get('data')['a']);
                Assert.equal(1001, this.person.getId());
                Assert.equal(5, Jsons.values(this.person.getFields()).length);
                Assert.equal(null, this.person.get('age'));
                Assert.true(this.person.hasField('age'));
                Assert.false(this.person.hasField('time'));
                this.person.clear();
                Assert.true(this.person.isEmpty());
            }
            test2() {
                Assert.equal(5, Jsons.values(this.person.getFields()).length);
                this.person.removeField('age');
                Assert.equal(4, Jsons.values(this.person.getFields()).length);
                Assert.false(this.person.hasField('age'));
                Assert.equal(undefined, this.person.get('age'));
                this.person.addField('age');
                Assert.equal(5, Jsons.values(this.person.getFields()).length);
                Assert.true(this.person.hasField('age'));
                Assert.equal(null, this.person.get('age'));
            }
            test3() {
                this.person.set('code', 1001);
                this.person.set('name', 'Bill');
                this.person.set('data', { a: 1 });
                Assert.false(this.person.isEmpty());
                let cln = this.person.clone();
                Assert.false(cln.isEmpty());
                Assert.equal('Bill', cln.get('name'));
            }
            test4() {
                this.person.set('code', 1001);
                Assert.equal(1001, this.person.getData()['code']);
                Assert.true(Check.isEmpty(this.person.iniData()));
                this.person.iniData({
                    'code': 2001
                });
                Assert.equal(1001, this.person.getData()['code']);
                Assert.equal(2001, this.person.iniData()['code']);
                this.person.reset();
                Assert.equal(2001, this.person.getData()['code']);
                this.person.clear();
                Assert.true(this.person.isEmpty());
                Assert.false(Check.isEmpty(this.person.iniData()));
            }
            test5() {
                Assert.true(this.person.isEmpty());
                this.person.destroy();
                Assert.equalError(JSError, () => {
                    this.person.set('code', 1002);
                });
            }
            test6() {
                this.person.updateField({
                    name: 'birthday',
                    setter: function (val) {
                        return new Date(val).setZeroTime().add(1, 'd').format();
                    }
                });
                this.person.set('birthday', new Date().format());
                Assert.equal(new Date().setZeroTime().add(1, 'd').format(), this.person.get('birthday'));
            }
            test7() {
                this.person.updateField({
                    name: 'data',
                    nameMapping: '_data'
                });
                this.person.setData({
                    _data: [1, 2, 3]
                });
                Assert.equal([1, 2, 3], this.person.get('data'));
            }
        };
        ModelTest = __decorate([
            klass('JS.test.ModelTest')
        ], ModelTest);
        test.ModelTest = ModelTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
let ListPerson = class ListPerson extends Model {
};
ListPerson.DEFAULT_FIELDS = [
    { name: 'id', type: 'int' },
    { name: 'name', nameMapping: 'field1', type: 'string' },
    { name: 'age', nameMapping: 'field2', type: 'float', defaultValue: 99.99 }
];
ListPerson = __decorate([
    klass('ListPerson')
], ListPerson);
var JS;
(function (JS) {
    let test;
    (function (test) {
        let ListModelTest = class ListModelTest extends TestCase {
            setUp() {
                this.persons = new ListModel().modelKlass(Person);
            }
            test1() {
                this.persons.add({ code: 1001, name: 'Arthur' });
                this.persons.add(new Person().setData({ code: 2001, name: 'Bill' }));
                Assert.equal(2, this.persons.size());
                this.persons.add([
                    { code: 3001, name: 'Smith' },
                    { code: 4001, name: 'David' }
                ]);
                Assert.equal(4, this.persons.size());
                Assert.equal('David', this.persons.getRowModel(3).get('name'));
            }
            test2() {
                this.persons.insert(0, { code: 1001, name: 'Arthur' });
                Assert.equal(1, this.persons.size());
                this.persons.insert(0, [
                    { code: 3001, name: 'Smith' },
                    { code: 4001, name: 'David' }
                ]);
                Assert.equal(3, this.persons.size());
                Assert.equal('Smith', this.persons.getRow(0)['name']);
                Assert.equal('David', this.persons.getRowModel(1).get('name'));
            }
            test3() {
                this.persons.insert(1, [
                    { code: 3001, name: 'Smith' },
                    { code: 4001, name: 'David' },
                    { code: 5001, name: 'Xman' },
                    { code: 6001, name: 'Zoro' }
                ]);
                Assert.equal(2, this.persons.indexOfId(5001));
                this.persons.clear();
                Assert.equal(0, this.persons.size());
                Assert.true(this.persons.isEmpty());
            }
            test4() {
                this.persons.insert(0, [
                    { code: 3001, name: 'Smith' },
                    { code: 4001, name: 'David' },
                    { code: 5001, name: 'Xman' },
                    { code: 6001, name: 'Zoro' }
                ]);
                this.persons.removeAt(0);
                Assert.equal(3, this.persons.size());
                Assert.equal('David', this.persons.getRowModel(0).get('name'));
                this.persons.removeAt(1);
                Assert.equal(2, this.persons.size());
                Assert.equal('David', this.persons.getRowModel(0).get('name'));
                this.persons.insert(0, [
                    { code: 3001, name: 'Smith' }
                ]);
                Assert.equal(3, this.persons.size());
                Assert.equal('Smith', this.persons.getRowModel(0).get('name'));
                Assert.equal('David', this.persons.getRowModel(1).get('name'));
                Assert.equal('Zoro', this.persons.getRowModel(2).get('name'));
            }
            test5() {
                this.persons.iniData([
                    { code: 3001, name: 'Smith' },
                    { code: 4001, name: 'David' },
                    { code: 5001, name: 'Xman' },
                    { code: 6001, name: 'Zoro' }
                ]);
                Assert.equal(4, this.persons.iniData().length);
                Assert.equal(0, this.persons.size());
                this.persons.setData([
                    { code: 3001, name: 'Smith' },
                    { code: 4001, name: 'David' }
                ]);
                Assert.equal(2, this.persons.getData().length);
                Assert.equal(2, this.persons.size());
                this.persons.reset();
                Assert.equal(4, this.persons.getData().length);
                Assert.equal(4, this.persons.size());
                this.persons.clear();
                Assert.equal(null, this.persons.getData());
                Assert.equal(4, this.persons.iniData().length);
            }
            test6() {
                let persons = new ListModel().modelKlass(ListPerson);
                persons.load('test-data/persons-list.json').then((result) => {
                    Assert.equal(3, result.count());
                    Assert.equal('Smith', persons.getRowModel(2).get('name'));
                });
            }
            test7() {
                let persons = new ListModel({
                    sorters: [{
                            field: 'gmtCreated'
                        }, {
                            field: 'name',
                            dir: 'asc'
                        }]
                }).modelKlass(ListPerson);
                persons.addSorter('name', 'desc');
                persons.load('test-data/persons-list.json').then((result) => {
                    Assert.equal(3, result.count());
                    Assert.equal('Smith', persons.getRowModel(2).get('name'));
                });
            }
        };
        ListModelTest = __decorate([
            klass('JS.test.ListModelTest')
        ], ListModelTest);
        test.ListModelTest = ListModelTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let PageModelTest = class PageModelTest extends TestCase {
            setUp() {
                this.persons = new PageModel({
                    dataQuery: {
                        url: 'test-data/persons-page.json'
                    }
                });
            }
            test1() {
                this.persons.on('loadsuccess', function () {
                    let me = this;
                    Assert.equal(10, me.getCurrentPage());
                    Assert.equal(3, me.getData().length);
                    Assert.equal('Smith', me.getRowModel(2, Person).get('name'));
                });
                this.persons.pageSize(100);
                this.persons.loadPage(10);
            }
        };
        PageModelTest = __decorate([
            klass('JS.test.PageModelTest')
        ], PageModelTest);
        test.PageModelTest = PageModelTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var JS;
(function (JS) {
    let test;
    (function (test) {
        let DataCacheTest = class DataCacheTest extends TestCase {
            constructor() {
                super(...arguments);
                this.cache = new DataCache({
                    name: 'test'
                });
            }
            test1() {
                return __awaiter(this, void 0, void 0, function* () {
                    yield this.cache.clear();
                    yield this.cache.write({
                        id: '1',
                        data: undefined
                    });
                    let data = yield this.cache.read('1');
                    Assert.equal(undefined, data);
                    yield this.cache.write({
                        id: '2',
                        data: null
                    });
                    data = yield this.cache.read('2');
                    Assert.equal(null, data);
                    yield this.cache.write({
                        id: '3',
                        data: 3.14
                    });
                    data = yield this.cache.read('3');
                    Assert.equal(3.14, data);
                    yield this.cache.write({
                        id: '4',
                        data: '3.14'
                    });
                    data = yield this.cache.read('4');
                    Assert.equal('3.14', data);
                    yield this.cache.write({
                        id: '5',
                        data: false
                    });
                    data = yield this.cache.read('5');
                    Assert.equal(false, data);
                    let json = {
                        n1: '1',
                        n2: null,
                        n3: 1.01,
                        n4: true
                    };
                    yield this.cache.write({
                        id: '6',
                        data: json
                    });
                    data = yield this.cache.read('6');
                    Assert.equal(Jsons.clone(json), data);
                    yield this.cache.delete('6');
                    let keys = yield this.cache.keys();
                    Assert.equal(5, keys.length);
                });
            }
            test2() {
                return __awaiter(this, void 0, void 0, function* () {
                    yield this.cache.clear();
                    yield this.cache.load({
                        id: '1',
                        url: 'test-data/blueyellow.wav',
                        type: 'arraybuffer'
                    });
                    let data = yield this.cache.read('1');
                    Assert.true(Types.isArrayBuffer(data));
                    yield this.cache.load({
                        id: '2',
                        url: 'test-data/bundle1.json',
                        type: 'text'
                    });
                    data = yield this.cache.read('2');
                    Assert.true(Types.isString(data));
                });
            }
        };
        DataCacheTest = __decorate([
            klass('JS.test.DataCacheTest')
        ], DataCacheTest);
        test.DataCacheTest = DataCacheTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test_1) {
        var ClassTest_1;
        let ClassTest = ClassTest_1 = class ClassTest extends TestCase {
            constructor() {
                super(...arguments);
                this.me = this;
            }
            test1() {
                Assert.equal(ClassTest_1.class, this.me.getClass());
                Assert.equal(TestCase.class, this.me.getClass().getSuperclass());
                Assert.equal('JS.test.ClassTest', this.me.className);
                Assert.equal(ClassTest_1, this.me.getClass().getKlass());
                Assert.equal(Object.class, TestCase.class.getSuperclass());
                Assert.equal(Object, TestCase.class.getSuperclass().getKlass());
            }
            test2() {
                Assert.equal(Class.forName('JS.test.ClassTest'), this.me.getClass());
                Assert.equal(Class.forName('Object'), Object.class);
                Assert.equal(Class.byName('JS.test.ClassTest'), ClassTest_1);
                Assert.equal(Class.byName('Object'), Object);
            }
            test3() {
                Assert.equal(Class.newInstance('JS.test.ClassTest').getClass(), ClassTest_1.class);
                Assert.equal(Class.newInstance(JSError, 'sss', new TypeError('ttt')).cause.message, 'ttt');
            }
            test4() {
                let test = new TestCase('test'), clazz = test.getClass();
                Assert.equal(5, clazz.fields(test).length);
                Assert.equal(11, clazz.methods().length);
            }
            test5() {
                let pModel = PageModel.class.newInstance(), lModel = ListModel.class.newInstance(), clazz = pModel.getClass(), superClass = clazz.getSuperclass();
                let fields = clazz.fieldsMap(pModel), methods = clazz.methodsMap(), superFields = superClass.fieldsMap(lModel), superMethods = superClass.methodsMap();
                Assert.equal(Jsons.keys(Jsons.minus(fields, Jsons.intersect(fields, superFields))), ['_cacheTotal']);
                Assert.equal(Jsons.keys(Jsons.minus(methods, superMethods)).length, 13);
            }
            test6() {
                let s = '1900-MM-dd';
                Class.reflect(Date);
                Date.class.aop('format', {
                    before: (format) => {
                        Assert.equal(s, format);
                    },
                    around: function (fn, format) {
                        return fn.apply(this, [format]).replace('1900-', '2019-');
                    },
                    after: (returns) => {
                        Assert.true(returns.startsWith('2019-'));
                    }
                });
                new Date().format(s);
                Date.class.cancelAop('format');
            }
        };
        ClassTest = ClassTest_1 = __decorate([
            klass('JS.test.ClassTest')
        ], ClassTest);
        test_1.ClassTest = ClassTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let ArraysTest = class ArraysTest extends TestCase {
            setUp() {
                this.a = [1, '-1', undefined, null, { name: 'jsdk' }];
            }
            test1() {
                Assert.equal(Arrays.newArray(null), []);
                Assert.equal(Arrays.newArray(undefined), []);
            }
            test2() {
                Assert.equal(this.a.findIndex(it => { return it == 1; }), 0);
                Assert.equal(this.a.findIndex(it => { return it === undefined; }), 2);
                Assert.equal(this.a.findIndex(it => { return it === null; }), 3);
                Assert.equal(this.a.findIndex(it => { return it == 0; }), -1);
                Assert.equal(this.a.findIndex(item => {
                    return 'jsdk' === (item && item.name);
                }), 4);
            }
            test3() {
                let rst = this.a.remove(item => {
                    return 'jsdk' === (item && item.name);
                });
                Assert.true(rst);
                Assert.equal(this.a.length, 4);
                Assert.equal(null, this.a[this.a.length - 1]);
            }
            test4() {
                this.a.remove(it => { return it == 1; });
                Assert.equal(undefined, this.a[1]);
            }
            test5() {
                let oldLen = this.a.length;
                this.a.add([new Date(), 'insertAt'], 0);
                Assert.true(this.a.length == oldLen + 2);
                Assert.true(new Date().equals(this.a[0], 'd'));
                Assert.true('insertAt' == this.a[1]);
                let b = [1, 2, 3];
                b.add([4, 5]);
                Assert.true(b.length == 5);
                Assert.true(b.toString() == '1,2,3,4,5');
            }
            test6() {
                Assert.false(Arrays.equal([1, 2], [2, 3]));
                Assert.true(Arrays.equal([1, 2], [1, 2]));
                Assert.true(Arrays.equal([[1], [2]], [[1], [2]], (item1, item2) => {
                    return item1[0] === item2[0];
                }));
            }
            test7() {
                let a1 = [1, 2, 3], a2 = [3, 2, 1], a3 = [1, 3, 2];
                Assert.true(Arrays.same(a1, a2));
                Assert.true(Arrays.same(a1, a3));
                Assert.true(Arrays.same(a2, a3));
            }
        };
        ArraysTest = __decorate([
            klass('JS.test.ArraysTest')
        ], ArraysTest);
        test.ArraysTest = ArraysTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let CheckTest = class CheckTest extends TestCase {
            test1() {
                Assert.false(Check.isIP('JSDK.255.255.255'));
                Assert.true(Check.isIP('0.0.0.0'));
                Assert.false(Check.isIP('255.255.255.256'));
                Assert.false(Check.isIP('0.0.0'));
                Assert.false(Check.isIP('0.0.0.0.0'));
                Assert.false(Check.isIP('+10.0.0.0'));
            }
            test2() {
                Assert.true(Check.isPattern('JSDK.org', /^JSDK\..*/));
                Assert.false(Check.isPattern('$JSDK.org', /^JSDK\..*/));
            }
            test3() {
                Assert.true(Check.isFormatDate('2019-01-01'));
                Assert.true(Check.isFormatDate('2019-1-1'));
                Assert.true(Check.isFormatDate('2019/01/01'));
                Assert.true(Check.isFormatDate('2019-12-1'));
                Assert.true(Check.isFormatDate('2019/12/1'));
                Assert.false(Check.isFormatDate('2019-'));
                Assert.false(Check.isFormatDate('2019-01'));
                Assert.false(Check.isFormatDate('01/01'));
                Assert.false(Check.isFormatDate('2019-001-1'));
                Assert.false(Check.isFormatDate('2019-01-001'));
            }
            test4() {
                Assert.true(Check.isEmail('jsunit@jsdk.org'));
                Assert.false(Check.isEmail('@jsdk.org'));
                Assert.false(Check.isEmail('jsdk.org'));
                Assert.false(Check.isEmail('邮箱@jsdk.org'));
                Assert.false(Check.isEmail('jsunit@jsdk.邮箱'));
            }
            test5() {
                Assert.true(Check.isEmails('jsunit@jsdk.org jsui@jsdk.org;jsgf@jsdk.org'));
                Assert.true(Check.isEmails('jsui@jsdk.org;  '));
                Assert.false(Check.isEmails('jsui@jsdk.org;jsdk.org'));
                Assert.false(Check.isEmails('邮箱@jsdk.org jsui@jsdk.org'));
                Assert.false(Check.isEmails('jsunit@jsdk.邮箱;jsui@jsdk.org;'));
            }
            test6() {
                Assert.false(Check.isEmailDomain('@jsdk'));
                Assert.true(Check.isEmailDomain('@jsdk.org'));
                Assert.true(Check.isEmailDomain('@jsdk.org.cn'));
                Assert.false(Check.isEmailDomain('jsdk.org'));
                Assert.false(Check.isEmailDomain('@邮箱.org'));
            }
            test7() {
                Assert.true(Check.isOnlyNumber('2007'));
                Assert.false(Check.isOnlyNumber('2019.0'));
                Assert.false(Check.isOnlyNumber('+2017'));
            }
            test8() {
                Assert.true(Check.isHalfwidthChars('JSDK 2007~2019'));
                Assert.false(Check.isHalfwidthChars('JSDK 2007年～2019年'));
            }
            test9() {
                Assert.true(Check.isFullwidthChars('从二零零七年到二零一九年'));
                Assert.false(Check.isFullwidthChars('JSDK 2007年～2019年'));
            }
            test10() {
                Assert.true(Check.isEnglishOnly('JSDK:2007~2019'));
                Assert.false(Check.isEnglishOnly('JSDK：2007～2019'));
            }
            test11() {
                Assert.true(Check.isChineseOnly('从二零零七年到二零一九年'));
                Assert.false(Check.isChineseOnly('JSDK:2007～2019'));
            }
            test12() {
                Assert.true(Check.isFormatNumber('-02019.23', 4));
                Assert.true(Check.isFormatNumber('-2019.2300', 4, 3));
                Assert.false(Check.isFormatNumber('-02019.2309', 4, 3));
            }
            test13() {
                Assert.true(Check.greater('02019.230', 2019.22222229));
                Assert.false(Check.greater('-02019.23', -2019.23));
                Assert.true(Check.greaterEqual('02019.230', 2019.23));
            }
            test14() {
                Assert.true(Check.less('02019.22', 2019.220001));
                Assert.false(Check.less('-02019.23', -2019.23));
                Assert.true(Check.lessEqual('02019.230', 2019.23));
            }
            test15() {
                Assert.true(Check.shorter('JSDK', 5));
                Assert.false(Check.shorter('JSDK', 3));
                Assert.false(Check.shorter(null, 4));
                Assert.true(Check.longer('JSDK', 3));
                Assert.false(Check.longer('JSDK', 4));
                Assert.false(Check.longer(null, 4));
                Assert.false(Check.equalLength(null, 4));
                Assert.true(Check.equalLength('null', 4));
            }
            test16() {
                Assert.true(Check.isLettersOnly('JSDK'));
                Assert.false(Check.isLettersOnly('J S D K'));
                Assert.false(Check.isLettersOnly('JSDK2019'));
            }
            test17() {
                Assert.true(Check.isLettersOrNumbers('JSDK'));
                Assert.false(Check.isLettersOrNumbers('J S D K'));
                Assert.true(Check.isLettersOrNumbers('JSDK2019'));
            }
            test18() {
                Assert.true(Check.isEmpty(undefined));
                Assert.true(Check.isEmpty(null));
                Assert.true(Check.isEmpty(''));
                Assert.false(Check.isEmpty(' '));
                Assert.true(Check.isEmpty({}));
                Assert.false(Check.isEmpty({ a: undefined }));
                Assert.true(Check.isEmpty([]));
                Assert.false(Check.isEmpty([undefined]));
            }
            test19() {
                Assert.true(Check.isBlank(undefined));
                Assert.true(Check.isBlank(null));
                Assert.true(Check.isBlank(''));
                Assert.true(Check.isBlank(' '));
            }
            test20() {
                Check.byServer({
                    url: 'test-data/persons-list.json',
                    responseType: 'json'
                }, (res) => {
                    return res.data.code == 'success';
                }).then((ok) => {
                    Assert.true(ok);
                });
            }
        };
        CheckTest = __decorate([
            klass('JS.test.CheckTest')
        ], CheckTest);
        test.CheckTest = CheckTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let CssToolTest = class CssToolTest extends TestCase {
            test1() {
                Assert.equal(null, CssTool.hex2rgb('27ae60'));
                Assert.equal({ r: 39, g: 174, b: 96, a: 1 }, CssTool.hex2rgb('#27ae60'));
                Assert.equal({ r: 39, g: 174, b: 96, a: 1 }, CssTool.hex2rgb('#27ae60ff'));
                Assert.equal(null, CssTool.hex2rgb('fff'));
                Assert.equal({ r: 255, g: 255, b: 255, a: 1 }, CssTool.hex2rgb('#fff'));
                Assert.equal(null, CssTool.hex2rgb('000'));
                Assert.equal({ r: 0, g: 0, b: 0, a: 1 }, CssTool.hex2rgb('#000'));
                Assert.equal({ r: 0, g: 0, b: 0, a: 0 }, CssTool.hex2rgb('#0000'));
                Assert.equal(null, CssTool.hex2rgb('000f'));
            }
            test2() {
                Assert.equal('#000000', CssTool.rgb2hex(0, 0, 0));
                Assert.equal('#ffffff', CssTool.rgb2hex(255, 255, 255));
                Assert.equal('#000000ff', CssTool.rgb2hex(0, 0, 0, 1));
                Assert.equal('#ffffff00', CssTool.rgb2hex(255, 255, 255, 0));
                Assert.equal('#27ae60', CssTool.rgb2hex(39, 174, 96));
                Assert.equal('#27ae6000', CssTool.rgb2hex(39, 174, 96, 0));
                Assert.equal('#27ae60ff', CssTool.rgb2hex(39, 174, 96, 1));
            }
            test3() {
                Assert.equal('#0000000c', CssTool.rgb2hex(0, 0, 0, 0.05));
                Assert.equal('#00000019', CssTool.rgb2hex(0, 0, 0, 0.10));
                Assert.equal('#00000026', CssTool.rgb2hex(0, 0, 0, 0.15));
                Assert.equal('#00000033', CssTool.rgb2hex(0, 0, 0, 0.20));
                Assert.equal('#0000003f', CssTool.rgb2hex(0, 0, 0, 0.25));
                Assert.equal('#0000004c', CssTool.rgb2hex(0, 0, 0, 0.30));
                Assert.equal('#00000059', CssTool.rgb2hex(0, 0, 0, 0.35));
                Assert.equal('#00000066', CssTool.rgb2hex(0, 0, 0, 0.40));
                Assert.equal('#00000072', CssTool.rgb2hex(0, 0, 0, 0.45));
                Assert.equal('#0000007f', CssTool.rgb2hex(0, 0, 0, 0.50));
                Assert.equal('#0000008c', CssTool.rgb2hex(0, 0, 0, 0.55));
                Assert.equal('#00000099', CssTool.rgb2hex(0, 0, 0, 0.60));
                Assert.equal('#000000a5', CssTool.rgb2hex(0, 0, 0, 0.65));
                Assert.equal('#000000b2', CssTool.rgb2hex(0, 0, 0, 0.70));
                Assert.equal('#000000bf', CssTool.rgb2hex(0, 0, 0, 0.75));
                Assert.equal('#000000cc', CssTool.rgb2hex(0, 0, 0, 0.80));
                Assert.equal('#000000d8', CssTool.rgb2hex(0, 0, 0, 0.85));
                Assert.equal('#000000e5', CssTool.rgb2hex(0, 0, 0, 0.90));
                Assert.equal('#000000f2', CssTool.rgb2hex(0, 0, 0, 0.95));
            }
            test4() {
                Assert.equal(0.05, CssTool.hex2rgb('#0000000c').a);
                Assert.equal(0.10, CssTool.hex2rgb('#00000019').a);
                Assert.equal(0.15, CssTool.hex2rgb('#00000026').a);
                Assert.equal(0.20, CssTool.hex2rgb('#00000033').a);
                Assert.equal(0.25, CssTool.hex2rgb('#0000003f').a);
                Assert.equal(0.30, CssTool.hex2rgb('#0000004c').a);
                Assert.equal(0.35, CssTool.hex2rgb('#00000059').a);
                Assert.equal(0.40, CssTool.hex2rgb('#00000066').a);
                Assert.equal(0.45, CssTool.hex2rgb('#00000072').a);
                Assert.equal(0.50, CssTool.hex2rgb('#0000007f').a);
                Assert.equal(0.55, CssTool.hex2rgb('#0000008c').a);
                Assert.equal(0.60, CssTool.hex2rgb('#00000099').a);
                Assert.equal(0.65, CssTool.hex2rgb('#000000a5').a);
                Assert.equal(0.70, CssTool.hex2rgb('#000000b2').a);
                Assert.equal(0.75, CssTool.hex2rgb('#000000bf').a);
                Assert.equal(0.80, CssTool.hex2rgb('#000000cc').a);
                Assert.equal(0.85, CssTool.hex2rgb('#000000d8').a);
                Assert.equal(0.90, CssTool.hex2rgb('#000000e5').a);
                Assert.equal(0.95, CssTool.hex2rgb('#000000f2').a);
            }
        };
        CssToolTest = __decorate([
            klass('JS.test.CssToolTest')
        ], CssToolTest);
        test.CssToolTest = CssToolTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let DatesTest = class DatesTest extends TestCase {
            test1() {
                Assert.true(Dates.isLeapYear(2004));
                Assert.false(Dates.isLeapYear(1999));
            }
            test2() {
                Assert.true(Dates.getDaysOfMonth(1, 2019) == 28);
                Assert.true(Dates.getDaysOfMonth(2, 2019) == 31);
            }
            test3() {
                Assert.true(new Date(2019, 0, 1, 1, 1, 1).equals(new Date('2019-1-1'), 'd'));
            }
            test4() {
                let d = new Date(2019, 0, 1);
                Assert.true(d.setLastTime().diff(new Date('2019-1-1').setLastTime()) == 0);
                Assert.true(d.isBefore(new Date('2019-1-2')));
                Assert.true(d.isAfter(new Date('2018-12-31')));
            }
            test5() {
                Assert.true(new Date('2018-12-30').getWeek() == 52);
                Assert.true(new Date('2018-12-31').getWeek() == 53);
                Assert.true(new Date('2019-1-1').getWeek() == 1);
            }
            test6() {
                let d = new Date('2018-12-30');
                d.setWeek(52);
                Assert.true(d.getWeek() == 52);
                Assert.true(d.equals(new Date('2018-12-24'), 'd'));
                d.setWeek(53);
                Assert.true(d.getWeek() == 53);
                Assert.true(d.equals(new Date('2018-12-31'), 'd'));
            }
            test8() {
                Assert.true(new Date(2019, 0, 1, 12, 0, 1, 123).equals(new Date(2019, 0, 1, 12, 0, 1, 123)));
                Assert.false(new Date(2019, 0, 1, 12, 0, 1, 123).equals(new Date(2019, 0, 1, 12, 0, 1, 124)));
            }
            test9() {
                let d = new Date('2019-1-2'), d1 = new Date('2019-1-1'), d2 = new Date('2019-1-3');
                Assert.true(d.between(d1, d2));
                Assert.false(d.between(d2, d1));
                Assert.true(d.between(d, d2));
            }
            test10() {
                let d = new Date('2019-1-2'), d1 = new Date('2019-1-1'), d2 = new Date('2019-1-3');
                Assert.true(d.isAfter(d1));
                Assert.false(d.isAfter(d2));
                Assert.false(d.isAfter(d));
            }
            test11() {
                let d = new Date('2019-1-2'), d1 = new Date('2019-1-1'), d2 = new Date('2019-1-3');
                Assert.true(d.isBefore(d2));
                Assert.false(d.isBefore(d1));
                Assert.false(d.isBefore(d));
            }
            test12() {
                Assert.true(new Date().isToday(new Date()));
            }
            test13() {
                let d = new Date('2019-1-1').setZeroTime(), h = d.getHours(), m = d.getMinutes(), s = d.getSeconds(), ms = d.getMilliseconds();
                Assert.true(d.clone().add(1, 'y').equals(new Date('2020-1-1'), 'd'));
                Assert.true(d.clone().add(-1, 'y').equals(new Date('2018-1-1'), 'd'));
                Assert.true(d.clone().add(1, 'M').equals(new Date('2019-2-1'), 'd'));
                Assert.true(d.clone().add(-1, 'M').equals(new Date('2018-12-1'), 'd'));
                Assert.true(d.clone().add(1, 'd').equals(new Date('2019-1-2'), 'd'));
                Assert.true(d.clone().add(-1, 'd').equals(new Date('2018-12-31'), 'd'));
                Assert.true(d.clone().add(1, 'w').equals(new Date('2019-1-8'), 'd'));
                Assert.true(d.clone().add(-1, 'w').equals(new Date('2018-12-25'), 'd'));
                Assert.true(d.clone().add(1, 'h').getHours() == h + 1);
                Assert.true(d.clone().add(-1, 'h').getHours() == 23);
                Assert.true(d.clone().add(1, 'm').getMinutes() == m + 1);
                Assert.true(d.clone().add(-1, 'm').getMinutes() == 59);
                Assert.true(d.clone().add(1, 's').getSeconds() == s + 1);
                Assert.true(d.clone().add(-1, 's').getSeconds() == 59);
                Assert.true(d.clone().add(1, 'ms').getMilliseconds() == ms + 1);
                Assert.true(d.clone().add(-1, 'ms').getMilliseconds() == 999);
            }
            test14() {
                let d = new Date('2019-1-1').setZeroTime(), offset = d.formatTimezoneOffset();
                d.setTimezoneOffset(Number(offset) / 100);
                Assert.true(d.formatTimezoneOffset() === offset);
            }
            test15() {
                let d = new Date('2019-1-1').setZeroTime();
                Assert.true(d.clone().set({ year: 2018 }).getFullYear() == 2018);
                Assert.true(d.clone().set({ month: 11 }).getMonth() == 11);
                Assert.true(d.clone().set({ day: 30 }).getDate() == 30);
                Assert.true(d.clone().set({ week: 52 }).getWeek() == 52);
                Assert.true(d.clone().set({ hour: 12 }).getHours() == 12);
                Assert.true(d.clone().set({ minute: 10 }).getMinutes() == 10);
                Assert.true(d.clone().set({ second: 59 }).getSeconds() == 59);
                Assert.true(d.clone().set({ millisecond: 999 }).getMilliseconds() == 999);
                Assert.true(d.clone().set({ timezoneOffset: -480 }).getTimezoneOffset() == -480);
            }
            test16() {
                Dates.I18N_RESOURCE = {
                    en: {
                        AM: 'AM',
                        PM: 'PM',
                        WEEK_DAY_NAMES: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                        WEEK_DAY_SHORT_NAMES: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                        MONTH_NAMES: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                        MONTH_SHORT_NAMES: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                    },
                    zh: {
                        AM: '上午',
                        PM: '下午',
                        WEEK_DAY_NAMES: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
                        WEEK_DAY_SHORT_NAMES: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
                        MONTH_NAMES: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                        MONTH_SHORT_NAMES: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
                    }
                };
                let d = new Date('2019-1-1 13:02:03');
                Assert.equal('2019-01-01', d.format('YYYY-MM-DD'));
                Assert.equal('2019-1-1', d.format('YYYY-M-D'));
                Assert.equal('19年1月1日', d.format('YY年M月D日'));
                Assert.equal('2019/Jan/01', d.format('YYYY/MMM/DD', 'en'));
                Assert.equal('2019/一月/01', d.format('YYYY/MMM/DD', 'zh'));
                Assert.equal('2019/January/01', d.format('YYYY/MMMM/DD', 'en'));
                Assert.equal('2019/一月/01', d.format('YYYY/MMMM/DD', 'zh'));
                Assert.equal('2019/01 Tue', d.format('YYYY/MM ddd', 'en'));
                Assert.equal('2019/01 周二', d.format('YYYY/MM ddd', 'zh'));
                Assert.equal('2019/01 Tuesday', d.format('YYYY/MM dddd', 'en'));
                Assert.equal('2019/01 星期二', d.format('YYYY/MM dddd', 'zh'));
                Assert.equal('19/1/1 13:02:03', d.format('YY/M/D HH:mm:ss'));
                Assert.equal('19/1/1 1:2:3', d.format('YY/M/D h:m:s'));
                Assert.equal('19/1/1 PM 1:02', d.format('YY/M/D A h:mm', 'en'));
                Assert.equal('19/1/1 下午 1:02', d.format('YY/M/D A h:mm', 'zh'));
            }
        };
        DatesTest = __decorate([
            klass('JS.test.DatesTest')
        ], DatesTest);
        test.DatesTest = DatesTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let ErrorsTest = class ErrorsTest extends TestCase {
            test1() {
                Assert.equalError(TypeError, () => {
                    throw new TypeError();
                });
            }
            test2() {
                Assert.equalError(TypeError, () => {
                    throw new TypeError('xxx');
                });
            }
            test3() {
                Assert.equalError(JSError, () => {
                    throw new JSError('xxx', new TypeError());
                });
            }
        };
        ErrorsTest = __decorate([
            klass('JS.test.ErrorsTest')
        ], ErrorsTest);
        test.ErrorsTest = ErrorsTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let FilesTest = class FilesTest extends TestCase {
            test1() {
                Assert.true(Files.isFileType('/a.log', '.log'));
                Assert.false(Files.isFileType('/a.lg', '.log'));
                Assert.false(Files.isFileType('/a.log.', '.log'));
            }
            test2() {
                Assert.true(Files.isFileType('/a.zip', FileTypes.ZIPS));
                Assert.true(Files.isFileType('http://.com/a.rar', FileTypes.ZIPS));
                Assert.true(Files.isFileType('http://a.com/b.png', FileTypes.IMAGES));
            }
            test3() {
                Assert.equal(0, Files.convertSize(null, FileSizeUnit.B, FileSizeUnit.GB));
                Assert.equal(0, Files.convertSize(undefined, FileSizeUnit.KB, FileSizeUnit.TB));
                Assert.equal(0, Files.convertSize('', FileSizeUnit.TB, FileSizeUnit.B));
                Assert.equal(0, Files.convertSize(0, FileSizeUnit.MB, FileSizeUnit.KB));
                Assert.equal(1, Files.convertSize(1024, FileSizeUnit.B, FileSizeUnit.KB));
                Assert.equal(1, Files.convertSize(1024, FileSizeUnit.KB, FileSizeUnit.MB));
                Assert.equal(1, Files.convertSize(1024, FileSizeUnit.MB, FileSizeUnit.GB));
                Assert.equal(1, Files.convertSize(1024, FileSizeUnit.GB, FileSizeUnit.TB));
                Assert.equal(0.5, Files.convertSize(512, FileSizeUnit.B, FileSizeUnit.KB));
                Assert.equal(0.5, Files.convertSize(512, FileSizeUnit.KB, FileSizeUnit.MB));
                Assert.equal(0.5, Files.convertSize(512, FileSizeUnit.MB, FileSizeUnit.GB));
                Assert.equal(0.5, Files.convertSize(512, FileSizeUnit.GB, FileSizeUnit.TB));
                Assert.equal(0.00048828125, Files.convertSize(512, FileSizeUnit.B, FileSizeUnit.MB));
                Assert.equal(536870912, Files.convertSize(512, FileSizeUnit.MB, FileSizeUnit.B));
            }
            test4() {
                Assert.equal('0B', Files.toSizeString(null));
                Assert.equal('0B', Files.toSizeString(undefined));
                Assert.equal('0B', Files.toSizeString(''));
                Assert.equal('0B', Files.toSizeString(0));
                Assert.equal('0KB', Files.toSizeString('0', FileSizeUnit.KB));
                Assert.equal('0MB', Files.toSizeString('0', FileSizeUnit.MB));
                Assert.equal('0GB', Files.toSizeString('0', FileSizeUnit.GB));
                Assert.equal('0TB', Files.toSizeString('0', FileSizeUnit.TB));
                Assert.equal('1B', Files.toSizeString(1));
                Assert.equal('1KB', Files.toSizeString(Files.ONE_KB));
                Assert.equal('1MB', Files.toSizeString(Files.ONE_MB));
                Assert.equal('1GB', Files.toSizeString(Files.ONE_GB));
                Assert.equal('1TB', Files.toSizeString(Files.ONE_TB));
                Assert.equal('1KB', Files.toSizeString(1, FileSizeUnit.KB));
                Assert.equal('1MB', Files.toSizeString(1, FileSizeUnit.MB));
                Assert.equal('1GB', Files.toSizeString(1, FileSizeUnit.GB));
                Assert.equal('1TB', Files.toSizeString(1, FileSizeUnit.TB));
            }
        };
        FilesTest = __decorate([
            klass('JS.test.FilesTest')
        ], FilesTest);
        test.FilesTest = FilesTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let FunctionsTest = class FunctionsTest extends TestCase {
            setUp() {
                this._fn = function (a) {
                    return this + a;
                };
            }
            test1() {
                class Pig {
                }
                ;
                class Fly {
                    fly() {
                        return 'I can fly';
                    }
                    eat() {
                        return 'I can eat';
                    }
                }
                ;
                let pig = new Pig();
                Assert.equal(undefined, pig.fly);
                Assert.equal(undefined, pig.eat);
                Pig.mixin(Fly, ['fly']);
                pig = new Pig();
                Assert.equal('I can fly', pig.fly());
                Assert.equal(undefined, pig.eat);
                Pig.mixin(Fly);
                pig = new Pig();
                Assert.equal('I can fly', pig.fly());
                Assert.equal('I can eat', pig.eat());
            }
            test2() {
                Assert.equal(1, Functions.execute('return this(a)-this(b);', Number, 'b,a', [1, 2]));
            }
            test3() {
                let newFn = this._fn.aop({
                    before: function (a) {
                        Assert.equal(7, a);
                    },
                    after: function (rtn) {
                        Assert.equal(116, rtn);
                    },
                    around: function (fn, a) {
                        return fn.call(this, a) + 10;
                    }
                }, 99);
                Assert.equal(116, newFn(7));
            }
        };
        FunctionsTest = __decorate([
            klass('JS.test.FunctionsTest')
        ], FunctionsTest);
        test.FunctionsTest = FunctionsTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let I18NTest = class I18NTest extends TestCase {
            constructor() {
                super(...arguments);
                this._data1 = {
                    'zh': {
                        k1: '中文',
                        k2: 'xxx'
                    },
                    'zh-CN': {
                        k1: '中文，中国'
                    },
                    'CN': {
                        k1: '中国'
                    }
                };
                this._data2 = {
                    k1: '中文，中国'
                };
            }
            test1() {
                let i18n = new I18N('zh');
                i18n.set(this._data1);
                Assert.equal(i18n.get('k1'), '中文');
                Assert.equal(i18n.get('k2'), 'xxx');
            }
            test2() {
                let i18n = new I18N('zh-CN');
                i18n.set(this._data1);
                Assert.equal(i18n.get('k1'), '中文，中国');
            }
            test3() {
                let i18n = new I18N('CN');
                i18n.set(this._data1);
                Assert.equal(i18n.get('k1'), '中国');
            }
            test4() {
                let i18n = new I18N();
                i18n.set(this._data2);
                Assert.equal(undefined, i18n.get('k2'));
                Assert.equal('中文，中国', i18n.get('k1'));
                Assert.equal(i18n.locale().toString(), System.info().locale.toString());
            }
        };
        I18NTest = __decorate([
            klass('JS.test.I18NTest')
        ], I18NTest);
        test.I18NTest = I18NTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let JsonsTest = class JsonsTest extends TestCase {
            setUp() {
                this._json1 = {
                    a: null,
                    b: undefined,
                    c: 0,
                    d: '123',
                    e: false,
                    f: new Date(),
                    g: [undefined, null, function () { }, { a: 1, b: true, c: '123' }],
                    h: { a: 1, b: true, c: '123' },
                    i: function () { }
                };
                this._json2 = {
                    a: undefined,
                    b: null,
                    c: '123',
                    d: 1,
                    g: [null, undefined, function () { }, { a: 2, b: false, c: '456', d: {} }],
                    h: { a: 2, d: [] },
                    k: {}
                };
            }
            test1() {
                let json = Jsons.union(this._json1, this._json2);
                Assert.equal(json.a, null);
                Assert.equal(json.b, null);
                Assert.equal(json.c, '123');
                Assert.equal(json.d, 1);
                Assert.equal(json.e, false);
                Assert.equal(new Date().equals(json.f, 'd'), true);
                Assert.equal(json.g.length, 4);
                Assert.equal(json.g[0], null);
                Assert.equal(json.g[1], null);
                Assert.equal(Types.isFunction(json.g[2]), true);
                Assert.equal(json.g[3].c, '456');
                Assert.equal(Types.isJsonObject(json.g[3].d), true);
                Assert.equal(json.h.a, 2);
                Assert.equal(json.h.b, true);
                Assert.equal(Types.isArray(json.h.d), true);
                Assert.equal(Types.isJsonObject(json.k), true);
                Assert.equal(Types.isFunction(json.i), true);
            }
        };
        JsonsTest = __decorate([
            klass('JS.test.JsonsTest')
        ], JsonsTest);
        test.JsonsTest = JsonsTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let NumbersTest = class NumbersTest extends TestCase {
            test1() {
                Assert.equal(Number(-1e-7).stringify(), '-0.0000001');
                Assert.equal(Number(2 / 3).stringify(), '0.6666666666666666');
            }
            test2() {
                Assert.equal(Number(-1e-7).format(), '-0.0000001');
                Assert.equal(Number(-1e-7).format(10), '-0.0000001000');
                Assert.equal(Number(123456).format(3), '123,456.000');
                Assert.equal(Number(-123456.785).format(2), '-123,456.78');
                Assert.equal(Number(123456.785).format(2), '123,456.79');
            }
            test3() {
                let n1 = Number(0.5), n2 = Number(78.1112223335), n3 = Number(535);
                Assert.equal(n1.round(0).stringify(), '1');
                Assert.equal(n2.round(9).stringify(), '78.111222334');
                Assert.equal(n3.round(2).stringify(), '535');
            }
            test4() {
                let n1 = Number(0.5), n2 = Number(78.5112223335), n3 = Number(-535);
                Assert.equal(n1.toInt().stringify(), '1');
                Assert.equal(n2.toInt().stringify(), '79');
                Assert.equal(n3.toInt().stringify(), '-535');
            }
            test5() {
                Assert.true(Number(78.567).equals(78.567));
                Assert.true(Number(78.5675).equals(78.568, 3));
            }
            test6() {
                Assert.equal(Number(0.1).add(0.2).stringify(), '0.3');
                Assert.equal(Number(0.15).sub(0.1).stringify(), '0.05');
                Assert.equal(Number(0.1).mul(0.2).stringify(), '0.02');
                Assert.equal(Number(0.15).div(0.2).stringify(), '0.75');
            }
            test7() {
                Assert.true(Number(undefined).isNaN());
                Assert.false(Number(78.123).isNaN());
                Assert.false(Number(undefined).isFinite());
                Assert.false(Number(1 / 0).isFinite());
                Assert.true(Number(null).isZero());
                Assert.false(Number(undefined).isZero());
                Assert.false(Number(78.000000001).isZero());
                Assert.true(Number(null).isInt());
                Assert.true(Number(78.00).isInt());
                Assert.false(Number(78.000000001).isInt());
                Assert.false(Number(0).isFloat());
                Assert.false(Number(78.00).isFloat());
                Assert.true(Number(78.000000001).isFloat());
                Assert.false(Number(undefined).isPositive());
                Assert.false(Number(0).isPositive());
                Assert.true(Number(0.0001).isPositive());
                Assert.false(Number(undefined).isNegative());
                Assert.false(Number(0).isNegative());
                Assert.true(Number(-0.0001).isNegative());
                Assert.false(Number(undefined).isOdd());
                Assert.false(Number(0).isOdd());
                Assert.false(Number(0.1).isOdd());
                Assert.true(Number(1.0).isOdd());
                Assert.false(Number(undefined).isEven());
                Assert.true(Number(0).isEven());
                Assert.false(Number(0.2).isEven());
                Assert.true(Number(2.0).isEven());
            }
            test8() {
                Assert.equal(Number(123456.00000789).integerLength(), 6);
                Assert.equal(Number(123456.00000789).fractionLength(), 8);
                Assert.equal(Number(-0.00000789).integerLength(), 1);
                Assert.equal(Number(-123456.0000).fractionLength(), 0);
                Assert.equal(Number(0).integerLength(), 1);
                Assert.equal(Number(0).fractionLength(), 0);
            }
            test9() {
                Assert.true(Numbers.min(1.01, Number(1), -1) === -1);
                Assert.true(Numbers.max(1.01, Number(1), -1) === 1.01);
            }
            test10() {
                Assert.equal(Numbers.termwise(1.01, '+', Number(1)), 2.01);
                Assert.equal(Numbers.termwise(0.15, '/', 0.2, '+', Number(0.3)), 1.05);
            }
            test11() {
                Assert.equal(Numbers.algebra(' - 2.01*(0.3894567-1.5908+7.9999)/(+3.1-9.9)'), 2.0095733775);
                Assert.equal(Numbers.algebra(' a*(0.3894567-1.5908+d)/(+b-c)', {
                    a: -2.01,
                    b: 3.1,
                    c: 9.9,
                    d: 7.9999
                }), 2.0095733775);
            }
        };
        NumbersTest = __decorate([
            klass('JS.test.NumbersTest')
        ], NumbersTest);
        test.NumbersTest = NumbersTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let RandomTest = class RandomTest extends TestCase {
            test1() {
                Assert.true(Check.isBetween(Random.number(100), 0, 100));
                Assert.true(Check.isBetween(Random.number({ min: 1, max: 2 }), 1, 2));
                let n = Random.number({ min: 1, max: 2 }, true);
                Assert.true(n === 1 || n === 2);
            }
            test2() {
                Assert.true(Random.uuid(10).length == 10);
                Assert.true(Random.uuid().length == 36);
            }
        };
        RandomTest = __decorate([
            klass('JS.test.RandomTest')
        ], RandomTest);
        test.RandomTest = RandomTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let StringsTest = class StringsTest extends TestCase {
            test1() {
                Assert.equal('<div id="1">xxx</div>', Strings.nodeHTML('div', { id: '1' }, 'xxx'));
            }
            test2() {
                Assert.equal(undefined, Strings.format(undefined, 2019));
                Assert.equal(null, Strings.format(null, 2019));
                Assert.equal('2019-1-1', Strings.format('%s-%f-%d', '2019', 1, 1));
                Assert.equal('\n', Strings.format('%n'));
                Assert.equal('%s', Strings.format('%%s'), '2019');
                Assert.equal('false', Strings.format('%b', ''));
            }
            test3() {
                let s = Strings.merge('a1={a1},b1={b1},{c}', {
                    a1: 'aaa',
                    b1: 'bbb'
                });
                Assert.equal('a1=aaa,b1=bbb,{c}', s);
                s = Strings.merge('a1={a1},b1={b1},{c}', {
                    a1: 'aaa',
                    b1: 'bbb',
                    c: (data) => {
                        return data['d'];
                    },
                    d: 'ddd'
                });
                Assert.equal('a1=aaa,b1=bbb,ddd', s);
                s = Strings.merge('a1={}', {
                    a1: 'aaa'
                });
                Assert.equal('a1={}', s);
            }
        };
        StringsTest = __decorate([
            klass('JS.test.StringsTest')
        ], StringsTest);
        test.StringsTest = StringsTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        var TypesTest_1;
        let TypesTest = TypesTest_1 = class TypesTest extends TestCase {
            test1() {
                Assert.true(Types.isKlass(new JSError(), JSError));
                Assert.false(Types.isKlass(new Error(), JSError));
                Assert.true(Types.isKlass(new TestCase(), TestCase));
                Assert.true(Types.ofKlass(new TypesTest_1(), TestCase));
                Assert.false(Types.ofKlass(new TestCase(), TypesTest_1));
                Assert.true(Types.ofKlass(this, TestCase));
            }
            test2() {
                Assert.true(Types.equalKlass(JSError, JSError));
                Assert.false(Types.equalKlass(new JSError(), JSError));
                Assert.false(Types.equalKlass(JSError, Error));
                Assert.true(Types.subklassOf(JSError, Error));
                Assert.true(Types.subklassOf(TypesTest_1, TestCase));
                Assert.false(Types.subklassOf(TestCase, TypesTest_1));
            }
            test3() {
                Assert.equal(Types.type(null), Type.null);
                Assert.equal(Types.type(undefined), Type.undefined);
                Assert.equal(Types.type(''), Type.string);
                Assert.equal(Types.type(1), Type.number);
                Assert.equal(Types.type(new Date()), Type.date);
                Assert.equal(Types.type(true), Type.boolean);
                Assert.equal(Types.type(Object), Type.class);
                Assert.equal(Types.type(JSError), Type.class);
                Assert.equal(Types.type(new JSError()), Type.object);
                Assert.equal(Types.type({}), Type.json);
                Assert.equal(Types.type([]), Type.array);
                Assert.equal(Types.type(() => { }), Type.function);
            }
        };
        TypesTest = TypesTest_1 = __decorate([
            klass('JS.test.TypesTest')
        ], TypesTest);
        test.TypesTest = TypesTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let URITest = class URITest extends TestCase {
            test1() {
                let uri = new URI();
                Assert.equal('http://', uri.toAbsolute());
                Assert.equal('', uri.toRelative());
                Assert.equal('', uri.toString());
            }
            test2() {
                let uri = new URI('http://www.w3c.org');
                Assert.equal('http://www.w3c.org', uri.toAbsolute());
                Assert.equal('', uri.toRelative());
                Assert.equal('http://www.w3c.org', uri.toString());
            }
            test3() {
                let uri = new URI('/');
                Assert.equal('http://', uri.toAbsolute());
                Assert.equal('', uri.toRelative());
                Assert.equal('', uri.toString());
            }
            test4() {
                let uri = new URI('https://username:password@example.com:123/path/data?key=%20value#frag');
                Assert.equal('https', uri.scheme());
                Assert.equal('username', uri.user());
                Assert.equal('password', uri.password());
                Assert.equal('username:password', uri.userinfo());
                Assert.equal('example.com', uri.host());
                Assert.equal(123, uri.port());
                Assert.equal('/path/data', uri.path());
                Assert.equal('key=%20value', uri.queryString());
                Assert.equal({ key: '%20value' }, uri.queryObject());
                Assert.equal(' value', uri.query('key'));
                Assert.equal('frag', uri.fragment());
            }
            test5() {
                let uri = new URI();
                uri.scheme('https');
                uri.user('username');
                uri.password('password');
                uri.host('example.com');
                uri.port(123);
                uri.path('/path/data');
                uri.queryString('key=%20value');
                uri.fragment('frag');
                Assert.equal('https://username:password@example.com:123/path/data?key=%20value#frag', uri.toString());
                Assert.equal('https://username:password@example.com:123/path/data?key=%20value#frag', uri.toAbsolute());
                Assert.equal('/path/data?key=%20value#frag', uri.toRelative());
            }
        };
        URITest = __decorate([
            klass('JS.test.URITest')
        ], URITest);
        test.URITest = URITest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
