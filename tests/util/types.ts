/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.TypesTest')
        export class TypesTest extends TestCase {
            
            public test1() {
                Assert.true(Types.isKlass(new JSError(), JSError));
                Assert.false(Types.isKlass(new Error(), JSError));

                Assert.true(Types.isKlass(new TestCase(), TestCase));
                Assert.true(Types.ofKlass(new TypesTest(), TestCase));
                Assert.false(Types.ofKlass(new TestCase(), TypesTest));
                Assert.true(Types.ofKlass(this, TestCase));
            }
            public test2() {
                Assert.true(Types.equalKlass(JSError, JSError));
                Assert.false(Types.equalKlass(new JSError(), JSError));
                Assert.false(Types.equalKlass(JSError, Error));

                Assert.true(Types.subKlass(JSError, Error));
                Assert.true(Types.subKlass(TypesTest, TestCase));
                Assert.false(Types.subKlass(TestCase, TypesTest));
            }
            public test3() {
                Assert.true(Types.equalClass(new Class('JS.unit.TestCase', TestCase), TestCase.class));
                Assert.false(Types.equalClass(new Class('JS.unit.TestCase', TestCase), TypesTest.class));

                Assert.true(Types.subClass(new Class('JS.unit.TestCase', TestCase), Object.class));
                Assert.true(Types.subClass(new Class('JS.test.TypesTest', TypesTest), TestCase.class));
                Assert.false(Types.equalClass(new Class('JS.unit.TestCase', TestCase), TypesTest.class));

                Assert.true(Types.subClass(new Class('JS.unit.TestCase', TestCase), Object.class));
            }
            public test4(){
                Assert.equal(Types.type(null), Type.null);
                Assert.equal(Types.type(undefined), Type.undefined);
                Assert.equal(Types.type(''), Type.string);
                Assert.equal(Types.type(1), Type.number);
                Assert.equal(Types.type(new Date()), Type.date);
                Assert.equal(Types.type(true), Type.boolean);
                Assert.equal(Types.type(Object), Type.class);
                Assert.equal(Types.type(JSError), Type.class);
                Assert.equal(Types.type(new JSError()), Type.object);
                Assert.equal(Types.type({}), Type.object);
                Assert.equal(Types.type([]), Type.array);
                Assert.equal(Types.type(()=>{}), Type.function);
            }

        }
    }
}
