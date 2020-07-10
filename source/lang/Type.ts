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

        /**
         * The primitive type of JS language.
         */
        export type PrimitiveType = null|undefined|string|number|boolean|String|Number|Boolean;
        /**
         * The JsonObject type is a JSON object containing zero or more key-value pairs.
         */
        export type JsonObject<T = any> = {
            [key: string]: T;
        }

        /**
         * A callback type in json format.
         */
        export type Callback<T = Function> = {
            fn: T;             //回调函数
            ctx?: any;         //回调函数的this上下文
            args?: Array<any>; //回调函数的输入参数
        }
        /**
         * A callback function or callback type in json format.
         */
        export type Fallback<T = Function> = T | Callback<T>

        /**
         * class constructor
         */
        export interface Klass<T> extends Function {
        }

        export interface Iterware<T> {
            /**
             * Performs the specified action for each element in an Iterware.
             * @param fn  A function be called for each item in Iterware until the function returns false, or until the end of the Iterware.
             * @param thisArg  An object passed to the function. If thisArg is omitted, Iterware object is used as the this value.
             * @returns {boolean} if the function return false, return false.
             */
            each(fn: (item: T, index: number, iter: Iterware<T>) => boolean, thisArg?: any): boolean;
        }

        export enum Type {
            null = 'null',
            undefined = 'undefined',
            string = 'string',
            boolean = 'boolean',
            number = 'number',
            date = 'date',
            array = 'array',
            /**
             * json object
             */
            json = 'json',    
            /**
             * class instance object
             */
            object = 'object', 
            function = 'function',
            class = 'class',
            symbol = 'symbol'
        }  
    }
}
import JsonObject = JS.lang.JsonObject;
import Callback = JS.lang.Callback;
import Fallback = JS.lang.Fallback;
import Klass = JS.lang.Klass;
import Iterware = JS.lang.Iterware;
import Type = JS.lang.Type;
import PrimitiveType = JS.lang.PrimitiveType;