//@ sourceURL=jsunit.js
/**
* JSDK 2.3.0 
* https://github.com/fengboyue/jsdk/
* (c) 2007-2020 Frank.Feng<boyue.feng@foxmail.com>
* MIT license
*/
var JS;
(function (JS) {
    let unit;
    (function (unit) {
        class TestFailure {
            constructor(failed, error) {
                this._method = failed;
                this._error = error;
            }
            failedMethod() {
                return this._method;
            }
            thrownError() {
                return this._error;
            }
            isFailure() {
                return this.thrownError() instanceof AssertError;
            }
        }
        unit.TestFailure = TestFailure;
    })(unit = JS.unit || (JS.unit = {}));
})(JS || (JS = {}));
var TestFailure = JS.unit.TestFailure;
var JS;
(function (JS) {
    let unit;
    (function (unit) {
        class TestResult {
            constructor() {
                this._fails = {};
                this._errors = {};
                this._failCount = 0;
                this._errorCount = 0;
                this._listeners = [];
                this._isStoped = false;
                this._runCount = 0;
            }
            isSuccessTestMethod(methodName, caseName) {
                let name = `${caseName}.${methodName}`;
                return (this._errors[name] || this._fails[name]) ? false : true;
            }
            errors() {
                return this._errors;
            }
            failures() {
                return this._fails;
            }
            runCount() {
                return this._runCount;
            }
            shouldStop() {
                return this._isStoped;
            }
            addListener(listener) {
                this._listeners.push(listener);
            }
            removeListener(listener) {
                this._listeners.remove(it => {
                    return it == listener;
                });
            }
            addError(e, method, test) {
                this._errors[test.getName() + '.' + method.name] = new unit.TestFailure(method, e);
                this._errorCount++;
                this._listeners.forEach(li => {
                    li.addError(e, method, test);
                });
            }
            addFailure(e, method, test) {
                this._fails[test.getName() + '.' + method.name] = new unit.TestFailure(method, e);
                this._failCount++;
                this._listeners.forEach(li => {
                    li.addFailure(e, method, test);
                });
            }
            endTest(method, test) {
                this._listeners.forEach(li => {
                    li.endTest(method, test);
                });
            }
            startTest(method, test) {
                this._runCount++;
                this._listeners.forEach(li => {
                    li.startTest(method, test);
                });
            }
            stop() {
                this._isStoped = true;
            }
            failureCount() {
                return this._failCount;
            }
            errorCount() {
                return this._errorCount;
            }
            wasSuccessful() {
                return this.failureCount() == 0 && this.errorCount() == 0;
            }
            run(test) {
                let methods = test.getTestMethods();
                Jsons.forEach(methods, (m, name) => {
                    this.startTest(m, test);
                    try {
                        test.runMethod(name);
                    }
                    catch (e) {
                        if (e instanceof AssertError) {
                            this.addFailure(e, m, test);
                        }
                        else if (e instanceof Error) {
                            this.addError(e, m, test);
                        }
                    }
                    this.endTest(m, test);
                });
            }
        }
        unit.TestResult = TestResult;
    })(unit = JS.unit || (JS.unit = {}));
})(JS || (JS = {}));
var TestResult = JS.unit.TestResult;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var JS;
(function (JS) {
    let unit;
    (function (unit) {
        let TestCase = class TestCase {
            constructor(name) {
                this._count = 0;
                this._methods = {};
                this.name = name || this.className;
                this._addTestMethods();
            }
            getName() {
                return this.name;
            }
            setUp() {
            }
            tearDown() {
            }
            countTests() {
                return this._count;
            }
            _createResult() {
                return new unit.TestResult();
            }
            run(result) {
                let rst = result ? result : this._createResult();
                rst.run(this);
                return rst;
            }
            runMethod(name) {
                let ept = null;
                this.setUp();
                try {
                    this._methods[name].invoke(this);
                }
                catch (e) {
                    ept = e;
                }
                finally {
                    try {
                        this.tearDown();
                    }
                    catch (e2) {
                        if (ept == null)
                            ept = e2;
                    }
                }
                if (ept != null)
                    throw ept;
            }
            getTestMethods() {
                return this._methods;
            }
            _addTestMethods() {
                let methods = this.getClass().methods();
                methods.forEach(m => {
                    if (!m.isStatic && m.name.startsWith('test')) {
                        this.addTestMethod(m);
                    }
                });
            }
            addTestMethod(method) {
                this._methods[method.name] = method;
                this._count++;
            }
        };
        TestCase = __decorate([
            klass('JS.unit.TestCase'),
            __metadata("design:paramtypes", [String])
        ], TestCase);
        unit.TestCase = TestCase;
    })(unit = JS.unit || (JS.unit = {}));
})(JS || (JS = {}));
var TestCase = JS.unit.TestCase;
var JS;
(function (JS) {
    let unit;
    (function (unit) {
        var TestSuite_1;
        let TestSuite = TestSuite_1 = class TestSuite {
            constructor(name) {
                this._cases = [];
                if (Types.isString(name)) {
                    this._name = name;
                }
                else {
                    this.addTest(name);
                }
                this._addTestMethods();
                this._name = this._name || this.className;
            }
            getTestCases() {
                return this._cases;
            }
            getName() {
                return this._name;
            }
            countTests() {
                let count = 0;
                this._cases.forEach(tc => {
                    count += tc.countTests();
                });
                return count;
            }
            run(result) {
                this._cases.some(t => {
                    if (result.shouldStop())
                        return true;
                    this.runTest(t, result);
                });
            }
            runTest(test, result) {
                test.run(result);
            }
            addTest(test) {
                if (!test)
                    return;
                if (Types.isArray(test)) {
                    test.forEach(clazz => {
                        this._addTest(clazz);
                    });
                }
                else {
                    this._addTest(test);
                }
            }
            _addTest(test) {
                if (!test)
                    return;
                if (Types.ofKlass(test, TestSuite_1)) {
                    this._cases = this._cases.concat(test.getTestCases());
                }
                else if (Types.ofKlass(test, unit.TestCase)) {
                    this._cases[this._cases.length] = test;
                }
                else if (Types.subClass(test, TestSuite_1.class)) {
                    this._cases = this._cases.concat(Class.newInstance(test.name).getTestCases());
                }
                else if (Types.subClass(test, unit.TestCase.class)) {
                    this._cases[this._cases.length] = Class.newInstance(test.name);
                }
            }
            _addTestMethods() {
                let methods = this.getClass().methods(), tc = null;
                methods.forEach(m => {
                    if (!m.isStatic && m.name.startsWith('test')) {
                        if (tc == null)
                            tc = new unit.TestCase(this.className);
                        tc.addTestMethod(m);
                    }
                });
                if (tc)
                    this._cases.push(tc);
            }
        };
        TestSuite = TestSuite_1 = __decorate([
            klass('JS.unit.TestSuite'),
            __metadata("design:paramtypes", [Object])
        ], TestSuite);
        unit.TestSuite = TestSuite;
    })(unit = JS.unit || (JS.unit = {}));
})(JS || (JS = {}));
var TestSuite = JS.unit.TestSuite;
var JS;
(function (JS) {
    let unit;
    (function (unit) {
        class TestRunner {
            constructor() {
                this._ui = new JS.unit.TestUI(this);
            }
            doRun(test) {
                this._suite = (!test || Types.isKlass(test, unit.TestSuite) ? test : new unit.TestSuite(test)) || this._suite;
                this._result = new unit.TestResult();
                this._result.addListener(this._ui);
                this._ui.startSuite(this._suite, this._result);
                this._suite.run(this._result);
                this._ui.endSuite();
                return this._result;
            }
            doStop() {
                this._result.stop();
            }
            static addTests(tests) {
                tests.forEach(test => {
                    this._test.addTest(test);
                });
            }
            static run(test) {
                let runner = new TestRunner();
                return runner.doRun(test || this._test);
            }
            static load(url, tests) {
                let urls = typeof url == 'string' ? [url] : url, tasks = [];
                urls.forEach(u => {
                    tasks.push(Promises.newPlan(Dom.loadJS, [u]));
                });
                Promises.order(tasks).then(() => {
                    if (tests)
                        this.addTests(tests);
                    this.run();
                });
            }
        }
        TestRunner._test = new unit.TestSuite();
        unit.TestRunner = TestRunner;
    })(unit = JS.unit || (JS.unit = {}));
})(JS || (JS = {}));
var TestRunner = JS.unit.TestRunner;
var JS;
(function (JS) {
    let unit;
    (function (unit) {
        class TestUI {
            constructor(runner) {
                this._startTime = 0;
                this._COLORS = {
                    'red': 'firebrick', 'green': 'forestgreen', 'current': 'black'
                };
                this._FLAGS = {
                    'red': '✘ ', 'green': '✔ ', 'current': '▸ '
                };
                $1('#btnRun').off().on('click', () => {
                    runner.doRun();
                });
                $1('#btnStop').off().on('click', () => {
                    runner.doStop();
                });
            }
            addError() {
                $1('#errors').html(this._result.errorCount() + '');
            }
            addFailure() {
                $1('#failures').html(this._result.failureCount() + '');
            }
            endTest(method, test) {
                let p = this._result.runCount() / this._suite.countTests() * 100, pro = $1('#progress');
                pro.style.width = p + '%';
                pro.style.backgroundColor = this._result.isSuccessTestMethod(method.name, test.getName()) ? 'forestgreen' : 'firebrick';
                pro.attr('title', this._result.runCount() + '/' + this._suite.countTests());
                this._renderOption(`${test.getName()}.${method.name}`, this._result.isSuccessTestMethod(method.name, test.getName()) ? 'green' : 'red');
            }
            startTest(method, test) {
                $1('#runs').html(this._result.runCount() + '/' + this._suite.countTests());
                this._renderOption(`${test.getName()}.${method.name}`, 'current');
            }
            endSuite() {
                let time = Number((System.highResTime() - this._startTime) / 1000).round(6);
                $1('#info').html(`All tests was completed in ${time} seconds.`);
                $1('#progress').style.backgroundColor = this._result.wasSuccessful() ? 'forestgreen' : 'firebrick';
                $1('#btnRun').removeAttribute('disabled');
            }
            startSuite(suite, result) {
                this._suite = suite;
                this._result = result;
                this._init(suite);
                $1('#btnRun').attr('disabled', 'disabled');
                this._startTime = System.highResTime();
            }
            _renderOption(testName, type) {
                let option = $1('#tests').querySelector(`option[value="${testName}"]`);
                option.style.color = this._COLORS[type];
                option.textContent = this._FLAGS[type] + option.attr('rawText');
            }
            _addOption(optgroup, text, value) {
                let txt = Strings.escapeHTML(text);
                optgroup['append'](`<option rawText="${txt}" value="${value ? value : ''}">${txt}</option>`);
            }
            _printTrace(testName) {
                $1('#trace').off().html('');
                let failure = this._result.errors()[testName] || this._result.failures()[testName];
                if (!failure)
                    return;
                let error = failure.thrownError();
                this._addOption($1('#trace'), `${failure.isFailure() ? 'AssertError' : error.name}: ${error.message}`);
                let stack = error.stack;
                if (stack) {
                    stack.split('\n').forEach((line, index) => {
                        if (index > 0)
                            this._addOption($1('#trace'), line);
                    });
                }
            }
            _printTestCase(tc) {
                let tests = $1('#tests'), optgroup = document.createElement('optgroup'), methods = tc.getTestMethods();
                Jsons.forEach(methods, (m) => {
                    this._addOption(optgroup, m.name, `${tc.getName()}.${m.name}`);
                });
                tests['append'](optgroup.attr('label', '▷ ' + tc.getName()));
            }
            _init(suite) {
                let sys = System.info();
                $1('#env').html(`${sys.browser.name} ${sys.browser.version || ''} / ${sys.os.name} ${sys.os.version || ''} / ${sys.device.type}`);
                $1('#info').html('');
                let pro = $1('#progress'), sty = pro.style;
                sty.width = '0%';
                sty.backgroundColor = 'forestgreen';
                pro.attr('title', '');
                $1('#runs').html('0/0');
                $1('#errors').html('0');
                $1('#failures').html('0');
                $1('#trace').off().html('');
                let tests = $1('#tests'), cases = suite.getTestCases();
                tests.off().html('');
                cases.forEach(tc => {
                    this._printTestCase(tc);
                });
                let me = this;
                tests.on('change', function () {
                    let testName = this.find('option:checked').attr('value');
                    me._printTrace(testName);
                });
            }
        }
        unit.TestUI = TestUI;
    })(unit = JS.unit || (JS.unit = {}));
})(JS || (JS = {}));
