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

        export class TestFailure {
            private _method: Method;
            private _error: Error;

            constructor(failed: Method, error: Error) {
                this._method = failed;
                this._error = error;
            }

            /**
             * Gets the failed test.
             */
            public failedMethod(): Method {
                return this._method;
            }

            /**
             * Gets the thrown exception.
             */
            public thrownError(): Error {
                return this._error;
            }

            /**
             * Returns {@code true} if the error is considered a failure
             * (i.e. if it is an instance of {@code AssertionFailedError}),
             * {@code false} otherwise.
             */
            public isFailure(): boolean {
                return this.thrownError() instanceof AssertError;
            }

        }

    }

}
import TestFailure = JS.unit.TestFailure;