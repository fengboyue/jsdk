/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.LineTest')
        export class LineTest extends TestCase {
            p1: ArrayPoint2 = [1, 1];
            p2: ArrayPoint2 = [-1, 1];
            p3: ArrayPoint2 = [-1, -1];
            p4: ArrayPoint2 = [1, -1];

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

                //special cases
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
                let line = new Line().set(this.p2, this.p4),
                p = this.p1,
                cp = line.crossPoint(p);
                Assert.true(Floats.equal(Point2.distanceSq(cp[0], cp[1], p[0], p[1]), Line.distanceSqToPoint(line.p1(),line.p2(), p)));
                
                line = new Line().set([-2,0], [0,2]);
                p = [0,0];
                cp = line.crossPoint(p);
                Assert.true(Floats.equal(Point2.distanceSq(cp[0], cp[1], p[0], p[1]), Line.distanceSqToPoint(line.p1(),line.p2(), p)));

                line = new Line().set([3.14,1.78], [-5.82,-6.71]);
                p = [1,1];
                cp = line.crossPoint(p);
                Assert.true(Floats.equal(Point2.distanceSq(cp[0], cp[1], p[0], p[1]), Line.distanceSqToPoint(line.p1(),line.p2(), p)));
            }

            test6() {
                let line = new Line().set(this.p2, this.p4);
                Assert.true(line.inside(this.p2));
                Assert.true(line.inside(this.p4));
                Assert.true(line.inside([0,0]));
                Assert.true(line.inside([-1.5678,1.5678]));
                Assert.true(line.inside(new Segment().set([-4.5678,4.5678],[6.5678,-6.5678])));

                Assert.false(line.inside(new Segment()));
            }

            test7() {
                let line1 = new Line().set(this.p2, this.p4),
                line2 = new Line().set([-1,0], [0,0]),
                line3 = new Line().set([0,0], [1,0]);
                
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
                Assert.false(line1.intersects(new Segment().set([0,1], [1,0])));
                Assert.false(new Segment().intersects(new Segment().set([0,1], [1,0])));
                
                Assert.true(line1.intersects(line2.toSegment()));
                Assert.true(line1.intersects(line3.toSegment()));
                Assert.true(line1.intersects(new Segment().set([-1,0],[1,0])));
                
                Assert.false(line1.intersects(new Line()));
                Assert.false(line1.intersects(new Segment()));
                
            }

        }
    }
}
