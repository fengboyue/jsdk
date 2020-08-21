/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.RectTest')
        export class RectTest extends TestCase {
            rect1 = new Rect(-1, -1, 2, 2);
            rect2 = new Rect(-1, -1, 1, 1);
            rect3 = new Rect(0, 0, 1, 1);

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

                Assert.true(this.rect2.onside([0,0]));
                Assert.true(this.rect3.onside([0,0]));
            }

            test4() {
                Assert.false(this.rect2.intersects(this.rect3));
                Assert.equal(null, this.rect2.intersection(this.rect3));
                Assert.true(this.rect1.intersection(this.rect2).equals(this.rect2));
                Assert.true(this.rect1.intersection(this.rect3).equals(this.rect3));

                Assert.false(Rect.toRect([0,-1],1,1).intersects(new Segment(1,0,0,1)));
                Assert.false(Rect.toRect([0,-1],1,1).intersects(new Segment(0,0,1,0)));
            }

        }
    }
}
