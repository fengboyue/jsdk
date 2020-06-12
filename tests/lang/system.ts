/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.SystemTest')
        export class SystemTest extends TestCase {

            public test1() {
                Assert.true(System.isDevice(DeviceType.desktop));
                Assert.false(System.isDevice(DeviceType.mobile));
                Assert.false(System.isDevice(DeviceType.tablet));
            }
            public test2() {
                Assert.true(System.isBrowser(Browser.Chrome)); 
                Assert.true(System.isOS(OS.MacOS)); 
                Assert.true(System.isCountry('CN')); 
                Assert.true(System.isLang('zh')); 
            }
        }
    }
}