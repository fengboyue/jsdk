/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.ErrorsTest')
        export class ErrorsTest extends TestCase {

            public test1() {
                Assert.equalError(TypeError, ()=>{
                    throw new TypeError()
                });
            }
            public test2() {
                Assert.equalError(TypeError, ()=>{
                    throw new TypeError('xxx')
                });
            }
            public test3() {
                Assert.equalError(JSError, ()=>{
                    throw new JSError('xxx', new TypeError())
                });
            }
        }
    }
}
