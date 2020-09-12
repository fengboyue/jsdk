/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../util/Numbers.ts"/>
/// <reference path="TestSuite.ts"/>
/// <reference path="TestUI.ts"/>

module JS {

    export namespace unit {

        export class TestRunner {
            private _ui: TestUI;
            private _result: TestResult;
            private _suite: TestSuite;

            constructor() {
                this._ui = new JS.unit.TestUI(this);
            }

            public doRun(test?: TestClass): TestResult {
                this._suite = (!test || Types.isKlass(test, TestSuite)?<TestSuite>test:new TestSuite(<TestCase>test)) || this._suite;
                this._result = new TestResult();
                this._result.addListener(this._ui);
                this._ui.startSuite(this._suite, this._result);
                this._suite.run(this._result);
                this._ui.endSuite();

                return this._result;
            }
            public doStop() {
                this._result.stop();
            }

            private static _test = new TestSuite();

            public static addTests(tests: Array<TestClass>){
                tests.forEach(test=>{
                    this._test.addTest(test);
                }) 
            }

            public static run(test?: TestClass): TestResult {
                let runner = new TestRunner();
                return runner.doRun(test || this._test);
            }

            public static load(url: string|string[], tests?: Array<TestClass>){
                let urls = typeof url=='string'?[url]:<string[]>url, tasks:PromisePlans<any> = [];

                urls.forEach(u=>{
                    tasks.push(Promises.newPlan(Loader.js, [u]))
                })
                Promises.order(tasks).then(()=>{
                    if(tests) this.addTests(tests);
                    this.run();
                })
            }
        }

    }

}
import TestRunner = JS.unit.TestRunner;