/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../lang/System.ts"/>
/// <reference path="TestCase.ts"/>

module JS {

    export namespace unit {

        export type TestClass = TestCase | TestSuite | Class<TestCase | TestSuite>;

        @klass('JS.unit.TestSuite')
        export class TestSuite {

            private _name: string;
            private _cases: TestCase[] = [];

            constructor(name?: string | TestClass | Class<TestCase | TestSuite>[]) {
                if (Types.isString(name)) {
                    this._name = <string>name;
                } else {
                    this.addTest(<any>name);
                }
                this._addTestMethods();
                this._name = this._name || this.className;
            }

            public getTestCases(): TestCase[] {
                return this._cases;
            }

            public getName() {
                return this._name;
            }

            /**
             * Counts the number of test cases that will be run by this test.
             */
            public countTests(): number {
                let count = 0;
                this._cases.forEach(tc => {
                    count += tc.countTests();
                });
                return count;
            }

            /**
             * Runs a test and collects its result in a TestResult instance.
             */
            public run(result: TestResult) {
                this._cases.some(t => {
                    if (result.shouldStop()) return true;
                    this.runTest(t, result);
                });
            }

            public runTest(test: TestCase, result: TestResult) {
                test.run(result);
            }

            public addTest(test: TestClass | Class<TestCase | TestSuite>[]) {
                if (!test) return;
                if (Types.isArray(test)) {
                    (<Array<Class<any>>>test).forEach(clazz => {
                        this._addTest(<any>clazz);
                    })
                } else {
                    this._addTest(<any>test);
                }
            }

            /**
             * Adds a test to the suite.
             */
            private _addTest(test: TestClass) {
                if (!test) return;

                if (Types.ofKlass(test, TestSuite)) {
                    this._cases = this._cases.concat((<TestSuite>test).getTestCases());
                } else if (Types.ofKlass(test, TestCase)) {
                    this._cases[this._cases.length] = <TestCase>test;
                } else if (Types.subClass(<Class<any>>test, TestSuite.class)) {
                    this._cases = this._cases.concat((<TestSuite>Class.newInstance((<Class<any>>test).name)).getTestCases());
                } else if (Types.subClass(<Class<any>>test, TestCase.class)) {
                    this._cases[this._cases.length] = <TestCase>Class.newInstance((<Class<any>>test).name);
                }
            }

            private _addTestMethods() {
                let methods = this.getClass().methods(), tc: TestCase = null;
                methods.forEach(m => {
                    if (!m.isStatic && m.name.startsWith('test')) {
                        if (tc == null) tc = new TestCase(this.className);
                        tc.addTestMethod(m);
                    }
                });
                if (tc) this._cases.push(tc);
            }

        }

    }

}
import TestSuite = JS.unit.TestSuite;
import TestClass = JS.unit.TestClass;