/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path='../lang/JSError.ts'/>
/// <reference path='../lang/Type.ts'/>
/// <reference path='../util/Types.ts'/>
/// <reference path='../util/Jsons.ts'/>
/// <reference path='../util/Arrays.ts'/>

module JS {

    export namespace lang {

        @klass('JS.lang.AssertError')
        export class AssertError extends JSError { }

        let T = Types, F = Functions;
        export class Assert {

            /**
             * Fails a test with the given message.
             */
            public static fail(msg?: string) {
                throw new AssertError(msg)
            }

            public static failNotSameType(expected: any, actual: any, msg?: string) {
                this.fail((msg||'') + ' expected type:<' + expected + '> but was:<' + actual + '>')
            }

            public static failNotEqual(expected: any, actual: any, msg?: string) {
                this.fail((msg||'') + ' expected:<' + expected + '> but was:<' + actual + '>')
            }

            public static failEqual(expected: any, actual: any, msg?: string) {
                this.fail((msg||'') + ' <' + expected + '> equals to <' + actual + '>')
            }

            public static _equal(expected: any, actual: any): boolean {
                if (expected === actual) return true
                if(T.isArray(expected) && T.isArray(actual) && Arrays.equal(expected,actual)) return true
                if(T.isJsonObject(expected) && T.isJsonObject(actual) && Jsons.equal(expected,actual)) return true
                if(T.isDate(expected) && T.isDate(actual) && expected.getTime() === actual.getTime()) return true
                return false
            }

            /**
             * Asserts that two objects are equal.
             * @throw AssertError if they are not
             */
            public static equal(expected: Date, actual: Date, msg?: string); 
            public static equal(expected: any[], actual: any[], msg?: string);
            public static equal(expected: JsonObject, actual: JsonObject, msg?: string); 
            public static equal(expected: PrimitiveType, actual: PrimitiveType, msg?: string); 
            public static equal(expected: any, actual: any, msg?: string) {
                if (this._equal(expected,actual)) return
                this.failNotEqual(expected, actual, msg)
            }

            /**
             * Asserts that two objects are not equal. 
             * @throw AssertError if they are equal
             */
            public static notEqual(expected: Date, actual: Date, msg?: string); 
            public static notEqual(expected: any[], actual: any[], msg?: string);
            public static notEqual(expected: JsonObject, actual: JsonObject, msg?: string); 
            public static notEqual(expected: PrimitiveType, actual: PrimitiveType, msg?: string); 
            public static notEqual(expected: any, actual: any, msg?: string) {
                if (!this._equal(expected,actual)) return
                this.failEqual(expected, actual, msg)
            }

            /**
             * Asserts that two objects refer to the same type. 
             * @throw AssertError if they are not same type
             */
            public static sameType(expected: any, actual: any, msg?: string) {
                let et = T.type(expected), at = T.type(actual);
                if (et == at) return
                this.failNotSameType(et, at, msg)
            }
            /**
             * Asserts that two objects do not refer to the same type. 
             * @throw AssertError if they are same type
             */
            public static notSameType(expected: any, actual: any, msg?: string) {
                if (T.type(expected) != T.type(actual)) return
                this.fail((msg||'') + ' expected not same type')
            }

            /**
             * Asserts that a condition is true. 
             * @throw AssertError if condition is false
             */
            public static true(condition: boolean, msg?: string) {
                if (!condition) this.fail((msg||'') + ' expected:<TRUE> but was:<FALSE>')
            }
            /**
             * Asserts that a condition is false.
             * @throw AssertError if condition is true
             */
            public static false(condition: boolean, msg?: string) {
                if (condition) this.fail((msg||'') + ' expected:<FALSE> but was:<TRUE>')
            }

            /**
             * Asserts that an object isn't null or undefined. 
             * @throw AssertError if object is null or undefined
             */
            public static defined(obj: object, msg?: string) {
                this.true(obj != void 0, msg)
            }
            /**
             * Asserts that an object is null or undefined. 
             * @throw AssertError if object is not null or undefined
             */
            public static notDefined(obj: object, msg?: string) {
                this.true(obj == void 0, msg)
            }

            /**
             * Asserts that a function has error. 
             * @throw AssertError if no error
             */
            public static error(fn: Fallback<any>, msg?: string) {
                let has = false;
                try { F.call(fn) } catch (e) { has = true }

                if (!has) this.fail((msg||'') + ' expected throw an error')
            }
            /**
             * Asserts that a function has error. 
             * @throw AssertError if not equal
             */
            public static equalError(error: Klass<Error>, fn: Fallback<any>, msg?: string) {
                let has = false;
                try { F.call(fn) } catch (e) { if (T.ofKlass(e, error)) has = true }

                if (!has) this.fail((msg||'') + ' expected throw an error')
            }

        }

    }

}
import Assert = JS.lang.Assert;
import AssertError = JS.lang.AssertError; 