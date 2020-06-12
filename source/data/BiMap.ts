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

    export namespace data {

        export class BiMap<K, V>{

            private _map = new Map<K, V>();

            constructor(kvs?:Array<[K, V]>) {//TODO:
                if(kvs) kvs.forEach(kv => {
                    this._map.set(kv["0"], kv["1"]);
                });
            }

            public inverse(): BiMap<V, K> {
                let map = new BiMap<V, K>();
                if (this.size() >= 0) {
                    this._map.forEach((v, k) => {
                        map.put(v, k);
                    })
                }
                return map
            }
            public delete(key: K): boolean {
                return this._map.delete(key);
            }
            public forEach(fn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void{
                this._map.forEach(fn)
            }
            public clear() {
                this._map.clear()
            }
            public size(): number {
                return this._map.size
            }
            public has(k: K): boolean {
                return this._map.has(k)
            }
            public get(k: K): V {
                return this._map.get(k)
            }
            public put(k: K, v: V) {
                this._map.set(k, v)
            }
            public putAll(map:Map<K, V>|BiMap<K, V>){
                if(map) map.forEach((v:V,k:K)=>{
                    this.put(k,v)
                })
            }
        }
    }
}

//预定义短类名
import BiMap = JS.data.BiMap;
