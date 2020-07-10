/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path='../util/Check.ts'/>

module JS {

    export namespace ds {

        export class BiMap<K, V>{

            private _m = new Map<K, V>();

            constructor(k?:Array<[K, V]>) {//TODO:
                if(k) k.forEach(kv => {
                    this._m.set(kv["0"], kv["1"]);
                });
            }

            public inverse(): BiMap<V, K> {
                let m = new BiMap<V, K>();
                if (this.size() >= 0) this._m.forEach((v, k) => {m.put(v, k)})
                return m
            }
            public delete(k: K): boolean {
                return this._m.delete(k);
            }
            public forEach(fn: (value: V, key: K, map: Map<K, V>) => void, ctx?: any): void{
                this._m.forEach(fn, ctx)
            }
            public clear() {
                this._m.clear()
            }
            public size(): number {
                return this._m.size
            }
            public has(k: K): boolean {
                return this._m.has(k)
            }
            public get(k: K): V {
                return this._m.get(k)
            }
            public put(k: K, v: V) {
                this._m.set(k, v)
            }
            public putAll(map:Map<K, V>|BiMap<K, V>){
                if(map) map.forEach((v:V,k:K)=>{this.put(k,v)})
            }
        }
    }
}

//预定义短类名
import BiMap = JS.ds.BiMap;
