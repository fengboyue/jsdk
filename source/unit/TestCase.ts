/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../lang/System.ts"/>

module JS {

    export namespace unit {

        @klass('JS.unit.TestCase')
        export class TestCase {

            protected name: string;

            constructor(name?: string) {
                this.name = name || this.className;
                this._addTestMethods();
            }

            public getName() {
                return this.name;
            }

            /**
             * Sets up the fixture, for example, open a network connection.
             * This method is called before a test is executed.
             * @throws {Exception} Throwable if any exception is thrown
             */
            protected setUp(): void {
            }

            /**
             * Tears down the fixture, for example, close a network connection.
             * This method is called after a test is executed.
             * @throws {Exception} Throwable if any exception is thrown
             */
            protected tearDown(): void {
            }

            /**
             * Counts the number of test cases that will be run by this test.
             */
            public countTests(): number {
                return this._count;
            }

            /**
             * Creates a default TestResult object
             *
             * @see TestResult
             */
            private _createResult(): TestResult {
                return new TestResult();
            }

            /**
             * A convenience method to run this test, collecting the results with a TestResult object.
             *
             * @see TestResult
             */
            public run(result?: TestResult): TestResult {
                let rst = result ? result : this._createResult();
                rst.run(this);
                return rst;
            }

            /**
             * Runs its a method by name.
             *
             * @throws Throwable if any exception is thrown
             */
            public runMethod(name: string): void {
                let ept = null;
                this.setUp();
                try {
                    this._methods[name].invoke(this);
                } catch (e) {
                    ept = e;
                } finally {
                    try {
                        this.tearDown();
                    } catch (e2) {
                        if (ept == null) ept = e2;
                    }
                }
                if (ept != null) throw ept;
            }

            private _count = 0;
            private _methods = {};
            public getTestMethods() {
                return this._methods;
            }

            private _addTestMethods() {
                let methods = this.getClass().methods();
                methods.forEach(m => {
                    if (!m.isStatic && m.name.startsWith('test')) {
                        this.addTestMethod(m);
                    }
                });
            }

            public addTestMethod(method: Method) {
                this._methods[method.name] = method;
                this._count++;
            }

        }

    }

}
import TestCase = JS.unit.TestCase;