/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../lang/System.ts"/>
/// <reference path="TestFailure.ts"/>
/// <reference path="TestListener.ts"/>

module JS {

    export namespace unit {

        export class TestResult {
            private _fails: JsonObject<TestFailure> = {};
            private _errors: JsonObject<TestFailure> = {};
            private _failCount = 0;
            private _errorCount = 0;
            private _listeners: TestListener[] = [];
            private _isStoped = false;
            private _runCount = 0;

            constructor() {}

            public isSuccessTestMethod(methodName:string, caseName: string): boolean {
                let name = `${caseName}.${methodName}`;
                return (this._errors[name] || this._fails[name]) ? false : true;
            }

            public errors() {
                return this._errors;
            }
            public failures() {
                return this._fails;
            }
            /**
             * Gets the number of run tests.
             */
            public runCount() {
                return this._runCount;
            }
            /**
             * Checks whether the test run should stop
             */
            public shouldStop(): boolean {
                return this._isStoped;
            }

            /**
             * Registers a TestListener
             */
            public addListener(listener: TestListener) {
                this._listeners.push(listener);
            }

            /**
             * Unregisters a TestListener
             */
            public removeListener(listener: TestListener) {
                this._listeners.remove(it=>{
                    return it==listener
                })
            }
            /**
             * Adds an error to the list of errors. The passed in exception
             * caused the error.
             */
            public addError(e: Error, method: Method, test: TestCase) {
                this._errors[test.getName() + '.' + method.name] = new TestFailure(method, e);
                this._errorCount++;
                this._listeners.forEach(li => {
                    li.addError(e, method, test)
                });
            }

            /**
             * Adds a failure to the list of failures. The passed in exception
             * caused the failure.
             */
            public addFailure(e: AssertError, method: Method, test: TestCase) {
                this._fails[test.getName() + '.' + method.name] = new TestFailure(method, e);
                this._failCount++;
                this._listeners.forEach(li=>{
                    li.addFailure(e, method, test);
                });
            }

            /**
             * Informs the result that a test was completed.
             */
            public endTest(method: Method, test: TestCase) {
                this._listeners.forEach(li => {
                    li.endTest(method, test);
                });
            }

            /**
             * Informs the result that a test will be started.
             */
            public startTest(method: Method, test: TestCase) {
                this._runCount ++;
                this._listeners.forEach(li => {
                    li.startTest(method, test);
                });
            }

            /**
             * Marks that the test run should stop.
             */
            public stop() {
                this._isStoped = true;
            }

            /**
             * Gets the number of detected failures.
             */
            public failureCount() {
                return this._failCount;
            }
            /**
             * Gets the number of detected errors.
             */
            public errorCount() {
                return this._errorCount;
            }
            /**
             * Returns whether the entire test was successful or not.
             */
            public wasSuccessful(): boolean {
                return this.failureCount() == 0 && this.errorCount() == 0;
            }

            /**
             * Runs a TestCase.
             */
            public run(test: TestCase): void {
                let methods = test.getTestMethods();
                Jsons.forEach(methods, (m: Method, name: string) => {
                    this.startTest(m, test);
                    try {
                        test.runMethod(name);
                    } catch (e) {
                        if (e instanceof AssertError) {
                            this.addFailure(e, m, test);
                        } else if (e instanceof Error) {
                            this.addError(e, m, test);
                        }
                    }
                    this.endTest(m, test);
                })
            }


        }

    }

}
import TestResult = JS.unit.TestResult;