/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.ErrorsTest')
        export class ErrorsTest extends TestCase {

            test1() {
                Assert.equalError(TypeError, ()=>{
                    throw new TypeError()
                });
            }
            test2() {
                Assert.equalError(TypeError, ()=>{
                    throw new TypeError('xxx')
                });
            }
            test3() {
                Assert.equalError(JSError, ()=>{
                    throw new JSError('xxx', new TypeError())
                });
            }
        }
    }
}
