/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.BundleTest')
        export class BundleTest extends TestCase {

            public test1() {
                let bundle = new Bundle('test-data/bundle1.json', 'zh-CN');
                Assert.equal(bundle.get('k1'), '中文，中国');
            }
            public test2() {
                let bundle = new Bundle('test-data/bundle1.json', 'zh');
                Assert.equal(bundle.get('k1'), '中文');
            }
            public test3() {
                let bundle = new Bundle('test-data/bundle1.json');
                Assert.notEqual(bundle.get('k1'), '无时区');
            }
            public test4() {
                let bundle = new Bundle('test-data/bundle1.json', 'en');
                Assert.equal(bundle.get('k1'), 'English');
            }
            private _data1 = {
                'zh': {
                    k1: '中文',
                    k2: 'xxx'
                },
                'zh-CN': {
                    k1: '中文，中国'
                }
                ,
                'CN': {
                    k1: '中国'
                }
            }
            public test5() {
                let bundle = new Bundle(this._data1, 'zh');
                Assert.equal(bundle.get('k1'), '中文');
            }
            public test6() {
                let bundle = new Bundle(this._data1, 'zh-CN');
                Assert.equal(bundle.get('k1'), '中文，中国');
            }
            public test7() {
                let bundle = new Bundle(this._data1, 'CN');
                Assert.equal(bundle.get('k1'), '中国');
            }
            private _data2 = {
                k1: '中文，中国'
            }
            public test8() {
                let bundle = new Bundle(this._data2);
                Assert.equal(bundle.get('k1'), '中文，中国');
            }
            public test9() {
                let bundle = new Bundle(this._data2);
                Assert.equal(undefined, bundle.get('k2'));
                Assert.equal(bundle.getLocale().toString(), System.info().locale.toString());
            }
            
        }
    }
}
