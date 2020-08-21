/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.CircleTest')
        export class CircleTest extends TestCase {
            c0 = new Circle(0,0,1);
            p1: ArrayPoint2 = [1, 0];
            p2: ArrayPoint2 = [0, 1];
            p3: ArrayPoint2 = [-1, 0];
            p4: ArrayPoint2 = [0, -1];

            test1() {
                Assert.false(this.c0.equals(new Circle()));
                Assert.true(this.c0.clone().set([0,0],0).equals(new Circle()));
                Assert.true(this.c0.equals(this.c0.clone()));
            }

            test2() {
                Assert.true(this.c0.onside(this.p1));
                Assert.true(this.c0.onside(this.p2));
                Assert.true(this.c0.onside(this.p3));
                Assert.true(this.c0.onside(this.p4));
                Assert.false(this.c0.onside([0,0]));
                Assert.false(this.c0.onside([1,1]));
            }

            test3() {
                Assert.true(this.c0.inside([0,0]));
                Assert.false(this.c0.inside([1,1]));
                Assert.false(this.c0.inside(this.p1));
            }

            test4() {
                Assert.true(this.c0.intersects(Line.toLine(this.p1,this.p3)));
                Assert.true(this.c0.intersects(Line.toLine([1,0],[0,-1])));
                Assert.false(this.c0.intersects(Line.toLine([1,1],[1,0])));
                Assert.false(this.c0.intersects(Line.toLine([2,0],[0,-2])));
                
                Assert.true(this.c0.intersects(Segment.toSegment(this.p1,this.p3)));
                Assert.true(this.c0.intersects(Segment.toSegment([1,0],[0,-1])));
                Assert.false(this.c0.intersects(Segment.toSegment(this.p1,[2,0])));
                Assert.false(this.c0.intersects(Segment.toSegment([1,1],[1,0])));
                Assert.false(this.c0.intersects(Segment.toSegment([1,1],[2,2])));

                Assert.true(this.c0.intersects(Circle.toCircle([1,0],1)));
                Assert.false(this.c0.intersects(Circle.toCircle([2,0],1)));
                Assert.true(this.c0.intersects(Circle.toCircle([1,1],1)));
                Assert.true(this.c0.intersects(Circle.toCircle([0.5,0],0.5)));
                
                Assert.true(this.c0.intersects(this.c0.bounds()));
                Assert.true(this.c0.intersects(Rect.toRect([0,0],1,1)));
                Assert.true(this.c0.intersects(Rect.toRect([-.5,-.5],.5,.5)));
                Assert.true(this.c0.intersects(Rect.toRect([-2,-2],4,4)));
                Assert.false(this.c0.intersects(Rect.toRect([1,-1],2,2)));
            }

        }
    }
}
