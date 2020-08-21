/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.Vector2Test')
        export class Vector2Test extends TestCase {

            test1() {
                let v1 = Vector2.toVector([1,1],[0,0]),
                v2 = Vector2.toVector([2,2],[1,1]);
                Assert.true(v1.equals(v2))
            }

            test2() {
                let v1 = Vector2.toVector([1,1],[2,2]),
                v2 = Vector2.toVector([2,2],[1,1]);
                Assert.true(v1.equals(v2.negate()))
            }

            test3() {
                let v1 = Vector2.toVector([1,0],[2.5,0]);
                Assert.true(v1.normalize().equals(Vector2.UnitX));

                let v2 = Vector2.toVector([0,0.25],[0,0.375]);
                Assert.true(v2.normalize().equals(Vector2.UnitY))
            }

            test4() {
                let v1 = Vector2.toVector([0,0],[1,1]);
                Assert.true(Radians.equal(0.25*Math.PI, v1.radian()));
                Assert.true(Radians.equal(0.25*Math.PI, v1.angle(Vector2.UnitY)));

                let v2 = Vector2.toVector([0,0],[-1,1]);
                Assert.true(Radians.equal(0.75*Math.PI, v2.radian()));
                Assert.true(Radians.equal(0.25*Math.PI, v2.angle(Vector2.UnitY)));
            }

            test5() {
                Assert.true(Vector2.UnitY.verticalTo(Vector2.UnitX));
                Assert.true(Vector2.UnitX.verticalTo(Vector2.UnitY));

                let v1 = Vector2.toVector([1.2,1.34],[1.2,2.75]);
                Assert.true(v1.verticalTo(Vector2.UnitX));
                Assert.true(v1.parallelTo(Vector2.UnitY));
                Assert.true(v1.negate().parallelTo(Vector2.UnitY));
            }

            test6() {
                Assert.true(Vector2.UnitY.clone().getNormL().normalize().equals(Vector2.UnitX));
                Assert.true(Vector2.UnitX.clone().getNormR().normalize().equals(Vector2.UnitY));

                let v1 = Vector2.toVector([0,0],[1,1]),
                v2 = Vector2.toVector([0,0],[-1,1]),
                v3 = Vector2.toVector([0,0],[1,-1]);
                Assert.true(v1.getNormR().normalize().equals(v2.normalize()));
                Assert.true(v1.getNormL().normalize().equals(v3.normalize()));
            }

            test7() {
                let v1 = Vector2.toVector([0,0],[1,1]),
                v2 = Vector2.toVector([0,0],[-1,1]),
                v3 = Vector2.toVector([0,0],[1,-1]);
                Assert.true(v1.getProject(Vector2.UnitY).equals(Vector2.UnitY));
                Assert.true(v2.getProject(v3).equals(v2));
                Assert.true(v2.getProject(Vector2.Zero).equals(Vector2.Zero));
                Assert.true(v2.getProject(Vector2.UnitX).equals(Vector2.UnitX.clone().negate()));
            }

            test8() {
                let v1 = Vector2.toVector([1,1],[0,0]),
                v2 = Vector2.toVector([0,0],[-1,1]),
                v3 = Vector2.toVector([0,0],[1,-1]);
                Assert.true(v1.getReboundR(Vector2.UnitY.clone().negate()).equals(v2));
                Assert.true(v1.getReboundL(Vector2.UnitX.clone()).equals(v3));
                Assert.true(v2.clone().negate().getReboundL(Vector2.UnitY).equals(v1.clone().negate()));
                Assert.true(v3.clone().negate().getReboundR(Vector2.UnitX).equals(v1.clone().negate()));
            }

            test9() {
                let p1:ArrayPoint2 = [1,1], p2:ArrayPoint2 = [-1,-1];
                Assert.equal(1, Vector2.whichSide(Line.X.p1(), Line.X.p2(), p1));
                Assert.equal(-1, Vector2.whichSide(Line.X.p1(), Line.X.p2(), p2));

                Assert.equal(-1, Vector2.whichSide(p1, p2, [-1,1]));
                Assert.equal(1, Vector2.whichSide(p1, p2, [1,-1]));
                Assert.equal(0, Vector2.whichSide(p1, p2, [0,0]));
            }
        
        }
    }
}
