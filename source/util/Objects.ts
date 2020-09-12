/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.7.0
 * @author Frank.Feng
 */
/// <reference path="Check.ts"/>
/**
 * @class Strings
 */
module JS {

    export namespace util {

        /**
         * Obejct helper class<br>
         * 对象工具类
         */
        export class Objects {
            /**
             * Readable or writeable on an object's properties and listen changing and changed events when its value be changed.
             * @param obj 
             * @param props property names
             * @param listeners 
             */
            public static readwrite<T=object>(obj: T, props: string|string[], listeners?: {
                changing?:(this: T, propName:string, newVal:any, oldVal:any)=>void|any,
                changed?:(this: T, propName:string, newVal:any, oldVal:any)=>void
            }): void {
                let ps = typeof props == 'string'?[props]:props, fs = listeners;
                ps.forEach(p=>{
                    Object.defineProperty(obj, p, {
                        configurable: true,
                        enumerable: true,
                        writable: true,
                        get:()=>{
                            return obj[p]
                        },
                        set:(val)=>{
                            let oVal = obj[p];
                            if(fs&& fs.changing) fs.changing.call(obj, p, val, oVal);
                            obj[p] = val;
                            if(fs&& fs.changed) fs.changed.call(obj, p, val, oVal);
                        }
                    })
                })
            }
            /**
             * Read only on an object's properties.
             * @param obj 
             * @param props property names
             */
            public static readonly(obj: object, props: string|string[]): void {
                let ps = typeof props == 'string'?[props]:props;
                ps.forEach(p=>{
                    Object.defineProperty(obj, p, {
                        configurable: true,
                        enumerable: true,
                        writable: false
                    })
                })
            }
        }
    }
}

import Objects = JS.util.Objects;