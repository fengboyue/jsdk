/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.PolygonTest')
        export class PolygonTest extends TestCase {
            p0 = new Polygon().addPoint(-1,1).addPoint(-1,0).addPoint(1,0).addPoint(1,-1).addPoint(0,-1).addPoint(0,1);

            test1() {
                Assert.false(this.p0.equals(new Polygon));
                Assert.true(this.p0.equals(this.p0.clone()));
                Assert.true(this.p0.bounds().equals(new Rect(-1,-1,2,2)));
                Assert.equal(8, this.p0.perimeter());
            }

            test2() {
                let p1 = new Polygon();

                Assert.true(p1.bounds().equals(new Rect()));

                p1.addPoint(-1,1).addPoint(-1,0).addPoint(1,0);
                Assert.true(p1.bounds().equals(new Rect(-1,0,2,1)));
                
                Assert.true(p1.addPoint(1,-1).bounds().equals(new Rect(-1,-1,2,2)));
                Assert.true(p1.addPoint(0,-1).bounds().equals(new Rect(-1,-1,2,2)));
                Assert.true(p1.addPoint(0,1).bounds().equals(new Rect(-1,-1,2,2)));
                Assert.true(p1.addPoint(1,2).bounds().equals(new Rect(-1,-1,2,3)));
            }

            test3() {
                Assert.true(this.p0.onside([0,0]));
                Assert.true(this.p0.onside([0.5,0]));
                Assert.true(this.p0.onside([-0.5,1]));
                
                Assert.false(this.p0.onside([-1,-1]));
                Assert.false(this.p0.onside([-0.5,0.5]));
                Assert.false(this.p0.onside([1,1]));
            }

            test4() {
                Assert.false(this.p0.inside([0,0]));
                Assert.false(this.p0.inside([-1,1]));
                Assert.false(this.p0.inside([1,1]));
                
                Assert.true(this.p0.inside([-.5,.5]));
                Assert.true(this.p0.inside([.5,-.5]));

                let p = this.p0.clone().addPoint(1,2).addPoint(1,1);
                Assert.true(p.onside([.5,1.5]));
                Assert.false(p.inside([.5,1.5]));
                Assert.true(p.inside([.5,1.49]));
                Assert.true(p.inside([.5,1.25]));
            }
        }
    }
}
