/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.ClassTest')
        export class ClassTest extends TestCase {
            private me: Object = this;

            test1() {
                Assert.equal(ClassTest.class, this.me.getClass());
                Assert.equal(TestCase.class, this.me.getClass().getSuperclass());
                Assert.equal('JS.test.ClassTest', this.me.className);
                Assert.equal(ClassTest, this.me.getClass().getKlass());

                Assert.equal(Object.class, TestCase.class.getSuperclass());
                Assert.equal(Object, TestCase.class.getSuperclass().getKlass());
            }
            test2() {
                Assert.equal(Class.forName('JS.test.ClassTest'), this.me.getClass());
                Assert.equal(Class.forName('Object'), Object.class);
                Assert.equal(Class.byName('JS.test.ClassTest'), ClassTest);
                Assert.equal(Class.byName('Object'), Object);
            }
            test3() {
                Assert.equal(Class.newInstance('JS.test.ClassTest').getClass(), ClassTest.class);
                Assert.equal((<JSError>Class.newInstance(JSError, 'sss', new TypeError('ttt'))).cause.message, 'ttt');
            }
            test4() {
                let test = new TestCase('test'), clazz = (<Object>test).getClass();
                Assert.equal(5, clazz.fields(test).length);
                Assert.equal(11, clazz.methods().length);
            }
            test5() {
                let pModel = PageModel.class.newInstance<PageModel>(),
                    lModel = ListModel.class.newInstance<ListModel>(),
                    clazz = (<Object>pModel).getClass(),
                    superClass = clazz.getSuperclass();

                let fields = clazz.fieldsMap(pModel),
                    methods = clazz.methodsMap(),
                    superFields = superClass.fieldsMap(lModel),
                    superMethods = superClass.methodsMap();

                Assert.equal(Jsons.keys(Jsons.minus(fields, Jsons.intersect(fields, superFields))), ['_cacheTotal']);
                Assert.equal(Jsons.keys(Jsons.minus(methods, superMethods)).length, 13);
            }
            test6() {
                let s = '1900-MM-dd';
                Class.reflect(Date);
                Date.class.aop('format',{
                    before: (format: string) => {
                        Assert.equal(s, format);
                    },
                    around: function (fn: Function, format: string) {
                        return (<string>fn.apply(this, [format])).replace('1900-', '2019-')
                    },
                    after: (returns: string) => {
                        Assert.true(returns.startsWith('2019-'));
                    }
                })
                new Date().format(s);
                Date.class.cancelAop('format');
            }
        }
    }
}
