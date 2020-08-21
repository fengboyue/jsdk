/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.PointTest')
        export class PointTest extends TestCase {

            test1() {
                let pp = Point2.xy2polar(1,1);
                Assert.true(Point2.equal([1,1], Point2.polar2xy(pp.d,pp.a)))
            }

            test2() {
                Assert.true(Point2.isOrigin(0.0001,-0.0001))
            }

            test3() {
                Assert.equal(0, Point2.radian(0.0001,-0.0001));
                Assert.true(Radians.equal(Radians.deg2rad(90+45), Point2.radian(-1,1)));
            }

            test4() {
                Assert.true(Floats.equal(1.4142, Point2.distance(0,0,1,1)));
                Assert.true(Floats.equal(2, Point2.distanceSq(0,0,1,1)));

                Assert.true(Floats.equal(2, Point2.distance(-1,1,1,1)));
                Assert.true(Floats.equal(4, Point2.distanceSq(-1,1,1,1)));

                Assert.true(Floats.equal(1.4142, Point2.distance(1,0,0,1)));
                Assert.true(Floats.equal(2, Point2.distanceSq(1,0,0,1)));
            }

            test5() {
                Assert.true(Point2.equal([3,0], new Point2(0,0).toward(3, Radians.EAST).toArray()));
                Assert.true(Point2.equal([0,0], new Point2(1,1).toward(1.4142, 1.25*Math.PI).toArray()));
                Assert.true(Point2.equal([-1,-1], new Point2(0,0).toward(1.4142, 1.25*Math.PI).toArray()));
                Assert.true(Point2.equal([-1,1], new Point2(1,-1).toward(2.8284, .75*Math.PI).toArray()));
            }
        
        }
    }
}
