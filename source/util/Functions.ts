/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="Arrays.ts"/>
module JS {

    export namespace util {

        /**
         * Function Helper Class
         */
        export class Functions {

            /**
             * Call Fallback.<br>
             * 调用回调对象或函数
             */
            public static call(fb: Fallback<any>): any {
                let isFn = Types.isFunction(fb),
                fn = isFn?<Function>fb:(<Callback<any>>fb).fn,
                ctx = isFn?undefined:(<Callback<any>>fb).ctx,
                args = isFn?undefined:(<Callback<any>>fb).args;
                
                return fn.apply(ctx, args);
            }

            /**
             * Execute function code.<br>
             * 执行函数代码
             * <pre>
             * Fcuntions.execute('return a-b+this', 5, 'b,a', [1,2]);
             * Equals：
             * function(b,a){
             *     return a-b+this 
             * }.apply(5, [1,2])
             * </pre>
             * 
             * @param code 函数代码
             * @param ctx 函数上下文
             * @param argsExpression 函数的参数表达式
             * @param args 函数的参数数组
             */
            public static execute(code: string, ctx?: any, argsExpression?:string, args?: ArrayLike<any>) {
                let argsList = argsExpression || '';
                return Function.constructor.apply(null, argsList.split(',').concat([code])).apply(ctx, Arrays.newArray(args))
            }

        }
    }
}

import Functions = JS.util.Functions;
