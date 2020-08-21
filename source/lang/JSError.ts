/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
module JS {

    export namespace lang {

        export class JSError extends Error {
            public cause: Error = null;

            constructor(msg?: string, cause?: Error) {
                super(cause ? (cause.message || '') + ' -> ' + (msg || '') : msg || '');
                if (cause) this.cause = cause;
            }
        }

        export class RefusedError extends JSError { }
        export class NotFoundError extends JSError { }
        export class ArithmeticError extends JSError { }
        export class ArgumentError extends JSError { }
        export class StateError extends JSError { }
        export class ParseError extends JSError { }
        export class NetworkError extends JSError { }
        export class TimeoutError extends JSError { }
    }
}
import JSError = JS.lang.JSError;
import RefusedError = JS.lang.RefusedError;
import NotFoundError = JS.lang.NotFoundError;
import ArithmeticError = JS.lang.ArithmeticError;
import ArgumentError = JS.lang.ArgumentError;
import StateError = JS.lang.StateError;
import ParseError = JS.lang.ParseError;
import NetworkError = JS.lang.NetworkError;
import TimeoutError = JS.lang.TimeoutError;