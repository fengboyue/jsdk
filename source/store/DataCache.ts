/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.5.0
 * @author Frank.Feng
 */

module JS {

    export namespace store {

        type CachePrimitiveType = PrimitiveType | ArrayBuffer | Blob;
        type ArrayCachePrimitiveType = Array<CachePrimitiveType>;
        type JsonCachePrimitiveType = JsonObject<CachePrimitiveType>;
        export type CacheDataType = CachePrimitiveType | ArrayCachePrimitiveType | JsonCachePrimitiveType;

        export interface LocalCachedData<T = CacheDataType> {
            id: string,
            data: T
        }
        export interface RemoteCachedData {
            id: string,
            url: string,
            type: 'text' | 'arraybuffer' | 'blob'
        }

        export interface DataCacheInit {
            name: string,
            onLoadFail?: (this: DataCache, res: HttpResponse) => void
            onReadFail?: (this: DataCache, e: Event) => void
            onWriteFail?: (this: DataCache, e: Event) => void
        }

        export class DataCache {

            private _init: DataCacheInit;
            private _tName: string //table name

            constructor(init: DataCacheInit) {
                this._init = init;
                this._tName = init.name;
            }

            destroy(): Promise<void> {
                let me = this;
                return Promises.create(function () {
                    me._open().then(db => {
                        db.deleteObjectStore(me._tName);
                        this.resolve()
                    })
                })
            }

            private _open(): Promise<IDBDatabase> {
                let me = this;
                return Promises.create(function () {
                    let dbReq = window.indexedDB.open(me._tName, 1);//整数作版本号

                    dbReq.onupgradeneeded = (e) => {
                        let db = dbReq.result;
                        db.onerror = () => { this.reject(null) };
                        if (!db.objectStoreNames.contains(me._tName)) db.createObjectStore(me._tName, { keyPath: 'id', autoIncrement: false });
                    }
                    dbReq.onsuccess = (e) => {
                        let db = <IDBDatabase>e.target['result'];
                        this.resolve(db)
                    }
                })
            }

            //此方法可用但不推荐使用，因为将所有大数据读入内存
            // all(): Promise<LocalCachedData[]> {
            //     let me = this;
            //     return Promises.create(function () {
            //         me._open().then(db => {
            //             let tx = db.transaction(me._tName, 'readonly'),
            //                 table = tx.objectStore(me._tName),
            //                 list = [],
            //                 c = table.openCursor();

            //             c.onsuccess = (e) => {
            //                 let cur = <IDBCursorWithValue>e.target['result'];
            //                 if (cur) {
            //                     list.push(<LocalCachedData>{
            //                         id: cur.key,
            //                         data: cur.value
            //                     })
            //                     cur.continue();
            //                 } else {
            //                     db.close();
            //                     this.resolve(list)
            //                 }
            //             }
            //             c.onerror = () => { db.close() }
            //         })
            //     })
            // }

            keys(): Promise<string[]> {
                let me = this;
                return Promises.create(function () {
                    me._open().then(db => {
                        let tx = db.transaction(me._tName, 'readonly'),
                            table = tx.objectStore(me._tName),
                            req = table.getAllKeys();
                        req.onsuccess = (e) => {
                            let rst = e.target['result'];
                            db.close();
                            this.resolve(rst)
                        };
                        req.onerror = (e) => {
                            db.close();
                        };
                    })
                })
            }

            hasKey(id:string): Promise<boolean> {
                let me = this;
                return Promises.create(function () {
                    me._open().then(db => {
                        let tx = db.transaction(me._tName, 'readonly'),
                            table = tx.objectStore(me._tName),
                            req = table.getKey(id);
                        req.onsuccess = (e) => {
                            let rst = e.target['result'];
                            db.close();
                            this.resolve(rst!==undefined);
                        };
                        req.onerror = (e) => {
                            db.close();
                        };
                    })
                })
            }

            write<T>(d: LocalCachedData<T>): Promise<void> {
                let me = this;
                return Promises.create(function () {
                    me._open().then(db => {
                        let tx = db.transaction(me._tName, 'readwrite'),
                            table = tx.objectStore(me._tName),
                            req = table.put(d);

                        req.onsuccess = (e) => {
                            db.close();
                            this.resolve()
                        };
                        req.onerror = (e) => {
                            db.close();
                            if (me._init.onWriteFail) me._init.onWriteFail.call(me, e);
                        };
                    })
                })
            }

            delete(id: string): Promise<void> {
                let me = this;
                return Promises.create(function () {
                    me._open().then(db => {
                        let table = db.transaction(me._tName, 'readwrite').objectStore(me._tName),
                            req = table.delete(id);
                        req.onsuccess = (e) => {
                            db.close();
                            this.resolve()
                        };
                        req.onerror = (e) => {
                            db.close();
                            if (me._init.onWriteFail) me._init.onWriteFail.call(me, e);
                            this.reject()
                        };
                    }).catch(() => {
                        this.reject()
                    })
                })
            }

            clear(): Promise<void> {
                let me = this;
                return Promises.create(function () {
                    me._open().then(db => {
                        let table = db.transaction(me._tName, 'readwrite').objectStore(me._tName),
                            req = table.clear();

                        req.onsuccess = (e) => {
                            db.close();
                            this.resolve()
                        };
                        req.onerror = (e) => {
                            db.close();
                            if (me._init.onWriteFail) me._init.onWriteFail.call(me, e);
                        };
                    })
                })
            }

            read<T = CacheDataType>(id: string): Promise<T> {
                let me = this;
                return Promises.create(function () {
                    me._open().then(db => {
                        let table = db.transaction(me._tName, 'readonly').objectStore(me._tName),
                            req = table.get(id);

                        req.onsuccess = (e) => {
                            let file: LocalCachedData = e.target['result'];
                            db.close();
                            if (file) {
                                this.resolve(<any>file.data)
                            } else {
                                if (me._init.onReadFail) me._init.onReadFail.call(me, e);
                            }
                        };
                        req.onerror = (e) => {
                            db.close();
                            if (me._init.onReadFail) me._init.onReadFail.call(me, e);
                        };
                    })
                })
            }

            load(d: RemoteCachedData): Promise<this> {
                let me = this;
                return Promises.create(function () {
                    Http.get({
                        url: d.url,
                        responseType: d.type,
                        error: res => {
                            if (me._init.onLoadFail) me._init.onLoadFail.call(me, res);
                            this.reject(me)
                        },
                        success: res => {
                            me.write({
                                id: d.id,
                                data: res.raw
                            }).then(() => {
                                this.resolve(me)
                            }).catch(() => {
                                this.reject(me)
                            })
                        }
                    })
                })
            }
        }
    }
}

//预定义短类名
import DataCache = JS.store.DataCache;
import CacheDataType = JS.store.CacheDataType;
import LocalCachedData = JS.store.LocalCachedData;
import RemoteCachedData = JS.store.RemoteCachedData;