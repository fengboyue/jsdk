/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.SegmentTest')
        export class SegmentTest extends TestCase {
            p1: ArrayPoint2 = [1, 1];
            p2: ArrayPoint2 = [-1, 1];
            p3: ArrayPoint2 = [-1, -1];
            p4: ArrayPoint2 = [1, -1];

            test1() {
                let sx = Line.X.toSegment(),
                    sy = Line.Y.toSegment();
                Assert.true(Point2.equal([0, 0], sx.crossSegment(sy)));

                let s0 = new Segment().set([-1, 0], [1, 0]);
                Assert.false(Point2.equal([0, 0], sx.crossSegment(s0)));

                let s1 = Segment.toSegment(this.p1, this.p3),
                    s2 = Segment.toSegment(this.p2, this.p4);
                Assert.true(Point2.equal([0, 0], s1.crossSegment(s2)));

                let s3 = Segment.toSegment([1, -1], [2, -2]);
                Assert.false(Point2.equal([0, 0], s1.crossSegment(s3)));
            }

            test2() {
                Assert.true(Point2.equal([0, 0], Segment.toSegment(this.p1, this.p3).crossLine(Line.toLine(this.p2, this.p4))));
                Assert.true(Point2.equal([0, 0], Segment.toSegment(this.p1, this.p3).crossLine(Line.toLine( this.p4, this.p2))));
                Assert.true(Point2.equal([0, 0], Segment.toSegment(this.p3, this.p1).crossLine(Line.toLine(this.p2, this.p4))));
                Assert.true(Point2.equal([0, 0], Segment.toSegment(this.p3, this.p1).crossLine(Line.toLine( this.p4, this.p2))));

                let s1 = Segment.toSegment([1, 0], [2, 0]),
                    s2 = Segment.toSegment([-1, 0], [2, 0]);
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
                let line = new Segment().set(this.p2, this.p4),
                    p = this.p1,
                    cp = line.crossPoint(p);
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
                let line1 = new Segment().set(this.p2, this.p4),
                line2 = new Segment().set([-1,0], [0,0]),
                line3 = new Segment().set([0,0], [1,0]);
                
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
                Assert.false(line1.intersects(new Segment().set([0.1,0],[1,0])));
                
                Assert.false(line1.intersects(new Line()));
                Assert.false(line1.intersects(new Segment()));
                
            }


        }
    }
}
