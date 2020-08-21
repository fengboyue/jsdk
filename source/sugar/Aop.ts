/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.5.0
 * @update Move to sugar package
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
module JS {

    export namespace sugar {

        let T = Types;

        /**
         * Advisor interface for AOP.
         * AOP切入通知接口
         */
        export interface AopAdvisor<T> {
            before?: (this: T, ...args: any[]) => void;
            around?: (this: T, fn: Function, ...args: any[]) => any;
            after?: (this: T, returns: any) => void;
            throws?: (this: T, e: Error) => void;
        }

        /**
         * The @deprecated annotation. 
         * 标记类或方法或字段为已废弃
         * @param info a plus warning text
         */
        export function deprecated(info?: string): any {
            return Annotations.define({
                name: 'deprecated',
                handler: (anno: string, values: Array<any>, obj: Klass<any> | object, propertyKey?: string) => {
                    let info = values ? (values[0] || '') : '', text = null;
                    if (T.equalKlass(obj)) {
                        text = `The [${(<Klass<any>>obj).name}] class`;
                    } else {
                        let klass = <Klass<any>>obj.constructor;
                        text = `The [${propertyKey}] ${T.isFunction(obj[propertyKey]) ? 'method' : 'field'} of ${klass.name}`;
                    }

                    JSLogger.warn(text + ' has been deprecated. ' + info);
                }
            }, arguments);
        }

        var _aop = function (args: ArrayLike<any>, fn: Function | AopAdvisor<any>, anno?: string) {
            return Annotations.define({
                name: anno,
                handler: (anno: string, values: Array<any>, obj: object, methodName?: string) => {
                    let adv = {};
                    if (T.isFunction(values[0])) {
                        adv[anno] = values[0];
                    } else {
                        adv = values[0];
                        if (!adv) return
                    }
                    Class.aop(obj.constructor, methodName, adv);
                },
                target: AnnotationTarget.METHOD
            }, args);
        }
        /**
         * The @before annotation.
         */
        export function before(fn: (...args: any[]) => void): any {
            return _aop(arguments, fn, 'before');
        }
        /**
         * The @after annotation.
         */
        export function after(fn: (returns: any) => void): any {
            return _aop(arguments, fn, 'after');
        }
        /**
         * The @around annotation.
         */
        export function around(fn: (fn: Function, ...args: any[]) => any): any {
            return _aop(arguments, fn, 'around');
        }
        /**
         * The @throws annotation.
         */
        export function throws(fn: (e: Error) => void): any {
            return _aop(arguments, fn, 'throws');
        }

    }

}

/**
 * Add aop and mixin methods for Function.prototype
 */
interface Function {
    /**
     * Returns a new function for AOP.
     * @param advisor 
     * @param that new 'this' context 
     */
    aop<T>(this: Function, advisor: AopAdvisor<T>, that?: T): (...args: any) => any;
    /**
     * Mixin other class methods in this class.
     */
    mixin(kls: Klass<any>, methodNames?: string[]): void;
}

(function () {

    let $F = Function.prototype;
    $F.aop = function (advisor: AopAdvisor<any>, that?: any) {
        let old = <Function>this,
            fn = function () {
                let args = Arrays.newArray(arguments),
                    ctx = that || this,
                    rst = undefined;

                if (advisor.before) advisor.before.apply(ctx, args);

                try {
                    rst = advisor.around ? advisor.around.apply(ctx, [old].concat(args)) : old.apply(ctx, args);
                } catch (e) {
                    if (advisor.throws) advisor.throws.apply(ctx, [e]);
                }

                if (advisor.after) advisor.after.apply(ctx, [rst]);

                return rst
            }
        return fn
    }
    $F.mixin = function (kls: Klass<any>, methodNames?: string[]): void {
        if (!kls) return
        let kp = kls.prototype, tp = this.prototype, ms = Reflect.ownKeys(kp);

        for (let i = 0, len = ms.length; i < len; i++) {
            let m = ms[i]
            if ('constructor' != m && !tp[m]) {
                if (methodNames) {
                    if (methodNames.findIndex(v => { return v == m }) > -1) tp[m] = kp[m]
                } else {
                    tp[m] = kp[m]
                }
            }
        }
    }
})()

//修复TS生成的注解函数：为@before|@after等切面注解
var __decorate = function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    if (key && r && typeof target[key] == 'function') delete r.value;//BUGFIX: target[key]方法可能被AOP修改为新方法，但r.value仍旧指向旧方法，导致执行Object.defineProperty后target[key]恢复为旧方法
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

//预定义短类名
import AopAdvisor = JS.sugar.AopAdvisor;

import deprecated = JS.sugar.deprecated;
import before = JS.sugar.before;
import after = JS.sugar.after;
import around = JS.sugar.around;
import throws = JS.sugar.throws;