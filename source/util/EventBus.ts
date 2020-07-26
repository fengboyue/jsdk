/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../util/Check.ts"/>
/// <reference path="../util/Arrays.ts"/>

module JS {

    export namespace util {

        //为每个事件监听函数生成uid，方便以后注销
        //这是一个全局计数器
        let EUID = 1, E = Check.isEmpty;

        export type EventHandler<T=any> = (this: T, e: Event, ...args:any[]) => boolean | void;
        export type EventHandler1<T, ARG1> = (this: T, e: Event, ARG1) => boolean | void;
        export type EventHandler2<T, ARG1, ARG2> = (this: T, e: Event, ARG1, ARG2) => boolean | void;
        export type EventHandler3<T, ARG1, ARG2, ARG3> = (this: T, e: Event, ARG1, ARG2, ARG3) => boolean | void;
        
        export class EventBus {
            private _ctx: any;
            private _isD = false;
            private _map = new Map<string, Function[]>();

            constructor(context?: any) {
                this._ctx = Jsons.clone(context);
            }

            public context(): any
            public context(ctx: any): void
            public context(ctx?: any): any {
                if (arguments.length == 0) return this._ctx;
                this._ctx = ctx;
            }
            /**
             * 销毁自身
             */
            public destroy() {
                this.off();
                this._ctx = null;
                this._isD = true;
            }
            /**
             * 是否已销毁
             */
            public isDestroyed() {
                return this._isD;
            }
            private _add(type: string, h: EventHandler) {
                let fns = this._map.get(type) || [];
                fns[fns.length] = h;
                this._map.set(type, fns);
            }
            private _remove(type: string, h?: EventHandler) {
                if (!h) {
                    this._map.set(type, []);
                } else {
                    let fns = this._map.get(type);
                    if (!E(fns)) {
                        fns.remove(fn => {
                            return fn['euid'] === h['euid']
                        })
                        this._map.set(type, fns);
                    }
                }
            }
            private _removeByEuid(type: string, euid: number) {
                let fns = this._map.get(type);
                if (!E(fns)) {
                    fns.remove(fn => {
                        return fn['euid'] === euid
                    })
                    this._map.set(type, fns);
                }
            }
            private _euid(h: EventHandler, one: boolean, type: string) {
                let me = this,
                    euid = h['euid'] || EUID++,
                    fn = function () {
                        if (one) me._removeByEuid(type, euid);
                        return h.apply(this, arguments);
                    };
                fn['euid'] = h['euid'] = euid;
                return fn
            }

            public on<H=EventHandler>(types: string, handler: H, once?:boolean): boolean {
                if (this.isDestroyed()) return false;

                types.split(' ').forEach((tp) => {
                    this._add(tp, this._euid(<any>handler, once, tp))
                })
                return true
            }
            public find(type:string):EventHandler[]
            public find(type:string, euid:number):EventHandler
            public find(type:string, euid?:number):any{
                let fns = this._map.get(type);
                if(arguments.length>=1){
                    if (!E(fns)) {
                        let i = fns.findIndex(fn => {
                            return fn['euid'] === euid
                        })
                        if(i>-1) return <any>fns[i]
                    }
                    return null
                }
                return fns||null
            }
            public types(){
                return Array.from(this._map.keys())
            }
            public off(types?: string, handler?: EventHandler): boolean {
                if (this.isDestroyed()) return false;

                if (types) {
                    types.split(' ').forEach((tp) => {
                        this._remove(tp, handler)
                    })
                } else {
                    this._map.clear()
                }
                return true
            }
            private _call(e: Event | CustomEvent, fn: Function, args?: Array<any>, that?: any) {
                let evt = e['originalEvent'] ? e['originalEvent'] : e,//for jQuery.Event
                    arr = [evt];
                if (args && args.length > 0) arr = arr.concat(args);
                let rst = fn.apply(that||this._ctx, arr);
                if(rst===false) {
                    evt.stopPropagation();
                    evt.preventDefault()
                }
            }
            public fire(e: string | Event, args?: Array<any>, that?: any) {
                let is = Types.isString(e),
                    fns = this._map.get(is ? <string>e : (<Event>e).type);
                if (!E(fns)) {
                    let evt = is ? new CustomEvent(<string>e) : (<Event>e);
                    fns.forEach(
                        fn => {this._call(evt, fn, args, that)}
                    )
                }
            }

        }

    }
}

//预定义短类名
import EventHandler = JS.util.EventHandler;
import EventHandler1 = JS.util.EventHandler1;
import EventHandler2 = JS.util.EventHandler2;
import EventHandler3 = JS.util.EventHandler3;
import EventBus = JS.util.EventBus;