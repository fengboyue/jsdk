/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.FloatsTest')
        export class FloatsTest extends TestCase {

            test1() {
                Assert.true(Floats.equal(Number(0.0001), Number(0.0002)));
                Assert.true(Floats.equal(Number(0.0001), Number(0.00012)));
                Assert.false(Floats.equal(Number(0.0001), Number(0.0003)));
                Assert.false(Floats.equal(Number(0.001), Number(0.002)));
            }

            test2() {
                Floats.EQUAL_PRECISION = 0.01;
                Assert.true(Floats.equal(Number(0.0001), Number(0.0002)));
                Assert.false(Floats.equal(Number(0.1), Number(0.2)));

                Floats.EQUAL_PRECISION = 0.00001;
                Assert.false(Floats.equal(Number(0.0001), Number(0.0002)));
                Assert.false(Floats.equal(Number(0.1), Number(0.2)));
            }

            test3() {
                Assert.true(Floats.equal(Number(0.0001), Number(0.0002), 0.01));
                Assert.false(Floats.equal(Number(0.1), Number(0.2), 0.01));

                Assert.false(Floats.equal(Number(0.0001), Number(0.0002), 0.00001));
                Assert.false(Floats.equal(Number(0.1), Number(0.2), 0.00001));
            }

            test4() {
                Floats.EQUAL_PRECISION = 0.0001;
                Assert.true(Floats.greaterEqual(Number(0.0001), Number(0.0002)));
                Assert.false(Floats.greater(Number(0.0001), Number(0.0002)));
                Assert.true(Floats.greater(Number(0.0003), Number(0.0001)));
            }

            test5() {
                Assert.true(Floats.lessEqual(Number(0.0001), Number(0.0002)));
                Assert.false(Floats.less(Number(0.0001), Number(0.0002)));
                Assert.true(Floats.less(Number(0.0001), Number(0.0003)));
            }

        }
    }
}
