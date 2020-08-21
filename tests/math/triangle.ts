/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.TriangleTest')
        export class TriangleTest extends TestCase {
            p1: ArrayPoint2 = [1, 0];
            p2: ArrayPoint2 = [0, 1];
            p3: ArrayPoint2 = [-1, 0];
            p4: ArrayPoint2 = [0, -1];

            test1() {
                Assert.true(new Triangle().equals(new Triangle()));
                Assert.true(Triangle.toTri(this.p1, this.p2, this.p3).equals(new Triangle().set(this.p3, this.p2, this.p1)));
                Assert.true(Triangle.toTri(this.p1, this.p2, this.p3).equals(new Triangle().set(this.p1, this.p3, this.p2)));
            }

            test2(){
                Assert.true(Triangle.toTri(this.p1,this.p2,[0,0]).bounds().equals(Rect.toRect([0,0],1,1)));
                Assert.true(Triangle.toTri(this.p1,this.p2,this.p3).bounds().equals(Rect.toRect([-1,0],2,1)));
            }

            test3(){
               Assert.true(Triangle.toTri(this.p1,this.p2,[0,0]).onside([0,0]));
               Assert.true(Triangle.toTri(this.p1,this.p2,[0,0]).onside([0.5,0.5]));
               
               Assert.true(Triangle.toTri(this.p1,this.p2,[0,0]).inside([0.49,0.49]));
               Assert.false(Triangle.toTri(this.p1,this.p2,[0,0]).onside([0.49,0.49]));
               
               Assert.true(Triangle.toTri(this.p1,this.p2,this.p3).onside([0,0]));
               Assert.true(Triangle.toTri(this.p1,this.p2,this.p3).onside([-0.5,0]));
               
               Assert.true(Triangle.toTri(this.p1,this.p2,this.p3).inside([-0.4,0.2]));
               Assert.false(Triangle.toTri(this.p1,this.p2,this.p3).onside([-0.4,0.2]));
            }

            test4() {
                let tri = Triangle.toTri(this.p1,this.p2,[0,0]);
                Assert.false(tri.intersects(Rect.toRect([0,-1],1,1)));
                Assert.false(tri.intersects(Rect.toRect([1,0],1,1)));
                Assert.true(tri.intersects(Rect.toRect([0.5,0],1,1)));
                Assert.true(tri.intersects(tri.bounds()));
                Assert.true(tri.intersects(Rect.toRect([0,0],0.5,0.5)));
                
                Assert.false(tri.intersects(Line.toLine([1,0],[0,1])));
                Assert.false(tri.intersects(Line.X));
                Assert.false(tri.intersects(Line.Y));
                Assert.false(tri.intersects(Line.toLine([1,0],[2,0])));
                Assert.true(tri.intersects(Line.toLine([0.5,0],[0,1])));
                Assert.true(tri.intersects(Line.toLine([0.5,0],[0.5,1])));
               
                Assert.false(tri.intersects(Segment.toSegment([1,0],[0,1])));
                Assert.false(tri.intersects(Segment.toSegment([1,0],[0,0])));
                Assert.false(tri.intersects(Segment.toSegment([0,1],[0,0])));
                Assert.false(tri.intersects(Segment.toSegment([1,0],[2,0])));
                Assert.true(tri.intersects(Segment.toSegment([0.5,0],[0,1])));
                Assert.true(tri.intersects(Segment.toSegment([0.5,0],[0.5,1])));
                Assert.false(tri.intersects(Segment.toSegment([1,-1],[-1,1])));
               
            }

        }
    }
}
