/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.RadiansTest')
        export class RadiansTest extends TestCase {

            test1() {
                Assert.true(Radians.equal((3.5*Math.PI)%(2*Math.PI), Radians.NORTH));
                Assert.true(Radians.equal(Radians.deg2rad(45), 0.25*Math.PI));
                Assert.true(Radians.equal(Radians.deg2rad(360+45), 0.25*Math.PI+2*Math.PI));
                Assert.true(Radians.equal(Radians.rad2deg(Radians.SOUTH), 90));
                
                Assert.true(Radians.equal(Radians.reverse(Radians.EAST), Radians.WEST));
                Assert.true(Radians.equal(Radians.reverse(Radians.SOUTH), Radians.NORTH));

                let rad = Radians.deg2rad(75);
                Assert.equal(Radians.reverse(rad)-rad, Math.PI);
            }

        }
    }
}
