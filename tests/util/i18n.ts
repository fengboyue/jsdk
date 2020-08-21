/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.I18NTest')
        export class I18NTest extends TestCase {
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
            test1() {
                let i18n = new I18N('zh');
                i18n.set(this._data1);
                Assert.equal(i18n.get('k1'), '中文');
                Assert.equal(i18n.get('k2'), 'xxx');
            }
            test2() {
                let i18n = new I18N('zh-CN');
                i18n.set(this._data1);
                Assert.equal(i18n.get('k1'), '中文，中国');
            }
            test3() {
                let i18n = new I18N('CN');
                i18n.set(this._data1);
                Assert.equal(i18n.get('k1'), '中国');
            }
            private _data2 = {
                k1: '中文，中国'
            }
            test4() {
                let i18n = new I18N();
                i18n.set(this._data2);

                Assert.equal(undefined, i18n.get('k2'));
                Assert.equal('中文，中国', i18n.get('k1'));
                Assert.equal(i18n.locale().toString(), System.info().locale.toString());
            }
        }
    }
}
