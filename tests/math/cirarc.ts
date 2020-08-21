/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.CirArcTest')
        export class CirArcTest extends TestCase {
            s0 = new CirArc(ArcType.PIE, 0, 0, 1, 0, -0.5 * Math.PI, 0);
            s1 = new CirArc(ArcType.OPEN, 0, 0, 1, 0, -0.5 * Math.PI, 0);

            test1() {
                Assert.true(new CirArc().equals(new CirArc()));
                Assert.true(this.s0.equals(this.s0.clone()));
                Assert.true(this.s0.bounds().equals(new Rect(0, -1, 1, 1)));
                Assert.true(this.s1.bounds().equals(new Rect(0, -1, 1, 1)));
                Assert.false(this.s1.bounds().equals(new Rect(-1, -1, 2, 2)));

                let s3 = new CirArc(ArcType.PIE, 0, 0, 1, 0, -0.75 * Math.PI, 0);
                Assert.true(s3.bounds().equals(new Rect(-0.707, -1, 1.707, 1)));
                let s4 = new CirArc(ArcType.OPEN, 0, 0, 1, 0, -0.75 * Math.PI, 1);
                Assert.true(s4.bounds().equals(new Rect(-1, -0.707, 2, 1.707)));

                let s5 = new CirArc(ArcType.PIE, 0, 0, 1, 0, -1.25 * Math.PI, 0);
                Assert.true(s5.bounds().equals(new Rect(-1, -1, 2, 1.707)));
                let s6 = new CirArc(ArcType.OPEN, 0, 0, 1, 0, -1.25 * Math.PI, 1);
                Assert.true(s6.bounds().equals(new Rect(-0.707, 0, 1.707, 1)));

                let s7 = new CirArc(ArcType.PIE, 0, 0, 1, 0, .25 * Math.PI, 1);
                Assert.true(s7.bounds().equals(new Rect(0, 0, 1, 0.707)));
                let s8 = new CirArc(ArcType.OPEN, 0, 0, 1, 0, .25 * Math.PI, 1);
                Assert.true(s8.bounds().equals(new Rect(0.707, 0, 0.293, 0.707)));
                let s9 = new CirArc(ArcType.PIE, 0, 0, 1, 0, .25 * Math.PI, 0);
                Assert.true(s9.bounds().equals(new Rect(-1, -1, 2, 2)));
                let s10 = new CirArc(ArcType.OPEN, 0, 0, 1, 0, .25 * Math.PI, 0);
                Assert.true(s10.bounds().equals(new Rect(-1, -1, 2, 2)));
            }

            test2() {
                Assert.equal(new Circle(this.s0.x, this.s0.y, this.s0.r).perimeter() / 4 + 2 * this.s0.r, this.s0.perimeter());
                Assert.equal(new Circle(this.s0.x, this.s0.y, this.s0.r).perimeter() / 4, this.s1.perimeter());
                Assert.equal(this.s0.arcLength(), this.s1.perimeter());

                Assert.equal(new Circle(this.s0.x, this.s0.y, this.s0.r).area() / 4, this.s0.area());
                Assert.equal(0, this.s1.area());
            }

        }
    }
}
