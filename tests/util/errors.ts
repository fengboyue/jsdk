/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.ErrorsTest')
        export class ErrorsTest extends TestCase {

            public test1() {
                Assert.equalError(TypeError, ()=>{
                    throw new Errors.TypeError()
                });
            }
            public test2() {
                Assert.equalError(TypeError, ()=>{
                    throw new Errors.TypeError('xxx')
                });
            }
            public test3() {
                Assert.equalError(JSError, ()=>{
                    throw new Errors.JSError('xxx', new TypeError())
                });
            }
        }
    }
}
