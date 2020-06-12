/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
module JS {

    export namespace unit {

        export interface TestListener {

            /**
             * An error occurred.
             */
            addError(e: Error, method: Method, tc: TestCase): void;

            /**
             * A failure occurred.
             */
            addFailure(e: AssertError, method: Method, tc: TestCase): void;

            /**
             * A test ended.
             */
            endTest(method: Method, tc: TestCase): void;

            /**
             * A test started.
             */
            startTest(method: Method, tc: TestCase): void;

            /**
             * A run ended.
             */
            endSuite(suite: TestSuite, result:TestResult): void;

            /**
             * A run started.
             */
            startSuite(suite: TestSuite, result:TestResult): void;

        }

    }

}
import TestListener = JS.unit.TestListener;