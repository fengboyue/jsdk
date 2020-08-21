/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.RandomTest')
        export class RandomTest extends TestCase {

            test1() {
                Assert.true(Check.isBetween(Random.number(100), 0, 100));
                Assert.true(Check.isBetween(Random.number({min:1,max:2}), 1, 2));

                let n = Random.number({min:1,max:2}, true);
                Assert.true(n===1 || n===2);
            }
            test2() {
                Assert.true(Random.uuid(10).length==10);
                Assert.true(Random.uuid().length==36);
            }
        }
    }
}
