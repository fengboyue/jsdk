/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="TestRunner.ts"/>
/// <reference path="TestListener.ts"/>

module JS {

    export namespace unit {

        export class TestUI implements TestListener {
            private _suite: TestSuite;
            private _result: TestResult;
            private _startTime = 0;

            constructor(runner: TestRunner) {
                $1('#btnRun').off().on('click',() => {
                    runner.doRun();
                })
                $1('#btnStop').off().on('click',() => {
                    runner.doStop();
                })
            }

            /**
             * An error occurred.
             */
            addError() {
                $1('#errors').html(this._result.errorCount() + '');
            }

            /**
             * A failure occurred.
             */
            addFailure() {
                $1('#failures').html(this._result.failureCount() + '');
            }

            /**
             * A test ended.
             */
            endTest(method: Method, test: TestCase) {
                let p = this._result.runCount() / this._suite.countTests() * 100,
                pro = $1('#progress');
                pro.style.width = p + '%';
                pro.style.backgroundColor = this._result.isSuccessTestMethod(method.name, test.getName()) ? 'forestgreen' : 'firebrick';
                pro.attr('title', this._result.runCount() + '/' + this._suite.countTests());

                this._renderOption(`${test.getName()}.${method.name}`, this._result.isSuccessTestMethod(method.name, test.getName()) ? 'green' : 'red');
            }

            /**
             * A test started.
             */
            startTest(method: Method, test: TestCase) {
                $1('#runs').html(this._result.runCount() + '/' + this._suite.countTests());
                this._renderOption(`${test.getName()}.${method.name}`, 'current');
            }

            /**
             * A run ended.
             */
            endSuite() {
                let time = Number((System.highResTime() - this._startTime) / 1000).round(6);
                $1('#info').html(`All tests was completed in ${time} seconds.`);
                $1('#progress').style.backgroundColor = this._result.wasSuccessful() ? 'forestgreen' : 'firebrick';
                $1('#btnRun').removeAttribute('disabled');
            }

            /**
             * A run started.
             */
            startSuite(suite: TestSuite, result: TestResult) {
                this._suite = suite;
                this._result = result;

                this._init(suite);
                $1('#btnRun').attr('disabled', 'disabled');

                this._startTime = System.highResTime();
            }

            private _COLORS = {
                'red': 'firebrick', 'green': 'forestgreen', 'current': 'black'
            };
            private _FLAGS = {
                'red': '✘ ', 'green': '✔ ', 'current': '▸ '
            }
            private _renderOption(testName: string, type: 'red' | 'green' | 'current') {
                let option:HTMLElement = $1('#tests').querySelector(`option[value="${testName}"]`);
                option.style.color = this._COLORS[type];
                option.textContent = this._FLAGS[type] + option.attr('rawText');
            }

            private _addOption(optgroup: HTMLElement, text: string, value?: string) {
                let txt = Strings.escapeHTML(text);
                optgroup['append'](`<option rawText="${txt}" value="${value ? value : ''}">${txt}</option>`);
            }
            private _printTrace(testName: string) {
                $1('#trace').off().html('');

                let failure: TestFailure = this._result.errors()[testName] || this._result.failures()[testName];
                if (!failure) return;

                let error = failure.thrownError();
                this._addOption($1('#trace'), `${failure.isFailure() ? 'AssertError' : error.name}: ${error.message}`);

                let stack = error.stack;
                if(stack){
                    stack.split('\n').forEach((line: string, index: number) => {
                        if (index > 0) this._addOption($1('#trace'), line);
                    })
                }
            }
            private _printTestCase(tc: TestCase) {
                let tests = $1('#tests'), optgroup = document.createElement('optgroup'), methods = tc.getTestMethods();
                Jsons.forEach(methods, (m: Method) => {
                    this._addOption(optgroup, m.name, `${tc.getName()}.${m.name}`)
                });
                tests['append'](optgroup.attr('label', '▷ ' + tc.getName()));
            }
            private _init(suite: TestSuite) {
                let sys = System.info();
                $1('#env').html(`${sys.browser.name} ${sys.browser.version||''} / ${sys.os.name} ${sys.os.version||''} / ${sys.device.type}`);
                //init info
                $1('#info').html('');
                //init progress
                let pro =$1('#progress'),sty = pro.style;
                sty.width = '0%';
                sty.backgroundColor = 'forestgreen';
                pro.attr('title', '');
                //init numbers
                $1('#runs').html('0/0');
                $1('#errors').html('0');
                $1('#failures').html('0');

                //init trace
                $1('#trace').off().html('');
                //init tests
                let tests = $1('#tests'), cases = suite.getTestCases();
                tests.off().html('');

                cases.forEach(tc => {
                    this._printTestCase(tc);
                });

                let me = this;
                tests.on('change', function () {
                    let testName = this.find('option:checked').attr('value');
                    me._printTrace(testName);
                })
            }
        }
    }
}        