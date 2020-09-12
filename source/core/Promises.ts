/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/**
 * Add some helpful methods for Promise.prototype
 */
interface Promise<T>{
    /**
     * The function will always be executed in Promise case of success or failure.<br>
     * 输入的函数在Promise执行成功或失败后都会被执行。
     */
    always(fn:(this:this, v: any, success:boolean)=>any|Promise<any>):Promise<T>;
}
/**
 * The function will always be executed in Promise case of success or failure.<br>
 * 输入的函数在Promise执行成功或失败后都会被执行。
 */
Promise.prototype.always = function(fn:(v: any, success?:boolean)=>any|Promise<any>){
    return (<Promise<any>>this).then((t1)=>{
        return fn.call(this, t1, true)
    }).catch((t2)=>{
        return fn.call(this, t2, false)
    })
}

module JS {

    export namespace core {

        let AS = Array.prototype.slice, newArray = (a: ArrayLike<any>, from?: number): Array<any> => {
            return a == void 0 ? [] : AS.apply(a, [from == void 0 ? 0 : from]);
        }

        export type PromiseContext<T> = {
            resolve: (value: T)=>void;
            reject: (value: T)=>void;
        }

        /**
         * A promised task<br>
         * 一个Promise计划
         */
        export type PromisePlan<T> = (...args:any[])=>Promise<T>;
        /**
         * A queue of promised tasks<br>
         * 一组Promise计划
         */
        export type PromisePlans<T> = Array<PromisePlan<T>>;

        /**
         * Promise Helper
         */
        export class Promises {

            /**
             * Returns a new Promise built-in an execution function.<br>
             * 返回一个新Promise对象内置有执行函数
             * @param fn the execution function
             * @param args arguments of the execution function
             */
            static create<T>(fn:(this: PromiseContext<T>, ...args: any[])=>void, ...args: any[]): Promise<T> {
                return new Promise<T>((resolve, reject) => {
                    fn.apply(<PromiseContext<T>>{
                        resolve: resolve,
                        reject: reject
                    }, newArray(arguments,1))
                })
            }

            /**
             * Returns a PromisePlan.<br>
             * 返回一个Promise计划
             * @param fn 
             */
            static createPlan<T>(fn:(this: PromiseContext<T>, ...args: any[])=>void):PromisePlan<T> {
                return function() {
                    return Promises.create.apply(Promises, [fn].concat(Array.prototype.slice.apply(arguments)))
                }
            }

            /**
             * Returns a new PromisePlan based on an old PromisePlan.<br>
             * 基于旧Promise计划，返回一个新Promise计划
             * @param p an old PromisePlan
             * @param args arguments of the new PromisePlan
             * @param ctx context of the new PromisePlan
             */
            static newPlan<T>(p: PromisePlan<T>, args?:any[], ctx?:any): PromisePlan<T>{
                return ()=>{return p.apply(ctx||p, args)}
            }

            /**
             * Creates a new PromisePlan which returns a new resolved promise.<br>
             * 返回一个新Promise计划，它将返回一个新的resolved promise
             * @param v an argument need pass to the resolve function of promise
             */
            static resolvePlan<T>(v:any): PromisePlan<T>{
                return ()=>{return Promise.resolve(v)}
            }
            /**
             * Creates a new PromisePlan which returns a new rejected promise.<br>
             * 返回一个新Promise计划，它将返回一个新的rejected promise
             * @param v an argument need pass to the reject function of promise
             */
            static rejectPlan<T>(v:any): PromisePlan<T>{
                return ()=>{return Promise.reject(v)}
            }

            /**
             * Execute all plans in sequential order.<br>
             * 按顺序依次执行所有计划
             */
            static order<T>(ps: PromisePlans<T>) {
                var seq = Promise.resolve();
                ps.forEach(plan => {
                    seq = <any>seq.then(plan)
                })
                return seq
            }
            /**
             * Parallel execute and returns when all plans be executed.<br>
             * 并行执行所有计划
             */
            static all<T>(ps: PromisePlans<T>){
                var a = [];
                ps.forEach(task => {
                    a.push(task())
                })
                return Promise.all<T>(a)
            }
            /**
             * Parallel execute and returns when any plan be executed.<br>
             * 竞赛式执行计划
             */
            static race<T>(ps: PromisePlans<T>){
                var a = [];
                ps.forEach(task => {
                    a.push(task())
                })
                return Promise.race(a)
            }
        }
    }
}

import Promises = JS.core.Promises;
import PromiseContext = JS.core.PromiseContext;
import PromisePlan = JS.core.PromisePlan;
import PromisePlans = JS.core.PromisePlans;
