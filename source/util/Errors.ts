/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../lang/JSError.ts"/>
module JS {

    export namespace lang {

        export let Errors = {
            Error:Error,
            JSError:JSError,
            URIError:URIError,
            ReferenceError:ReferenceError,
            TypeError:TypeError,
            RangeError:RangeError,
            SyntaxError:SyntaxError,
            EvalError:EvalError,
            NotHandledError:NotHandledError,
            NotFoundError:NotFoundError,
            ArithmeticError:ArithmeticError,
            ArgumentError:ArgumentError,
            StateError:StateError,
            NetworkError:NetworkError,
            TimeoutError:TimeoutError
        }
    }
}
import Errors = JS.lang.Errors;

