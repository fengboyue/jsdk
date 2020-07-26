/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../lang/System.ts"/>
/// <reference path="Model.ts"/>

module JS {

    export namespace model {

        let J = Jsons;

        export type ListModelEvents = 'dataupdating'|'dataupdated'|'rowadded'|'rowremoved'|'validated'|'rowvalidated'|'loading'|'loadsuccess'|'loadfailure'|'loaderror';

        export interface ListModelListeners<M> {
            /**
             * @event (e, newData, oldData)
             */
            dataupdating:  EventHandler2<M, JsonObject[], JsonObject[]>
            /**
             * @event (e, newData, oldData)
             */
            dataupdated: EventHandler2<M, JsonObject[], JsonObject[]>
            /**
             * @event (e, newRows, index)
             */
            rowadded:  EventHandler2<M, JsonObject[], number>
            /**
             * @event (e, removedRow, index)
             */
            rowremoved:  EventHandler2<M, JsonObject, number>
            /**
             * @event (e, result, data)
             */
            validated: EventHandler2<M, ValidateResult, JsonObject[]>
            /**
             * @event (e, result, row, index)
             */
            rowvalidated: EventHandler3<M, ValidateResult, JsonObject[], number>
            /**
             * @event (e, request)
             */
            loading:  EventHandler1<M, AjaxRequest>
            /**
             * @event (e, result)
             */
            loadsuccess:  EventHandler1<M, ResultSet<any>>
            /**
             * @event (e, result)
             */
            loadfailure:  EventHandler1<M, ResultSet<any>>
            /**
             * @event (e, response|error)
             */
            loaderror:  EventHandler1<M, AjaxResponse|Error>
        };

        export type Sorter = {
            field: string, //The property of field to sort by. Required unless fn is provided
            dir?: 'asc' | 'desc',
            sort?: (record1: any, record2: any) => number //used in local sort
        }

        export class ListModelConfig {
            autoLoad?: boolean = false;
            readonly listeners?: ListModelListeners<this>;
            sorters?: Array<Sorter>;
            dataQuery?: string | AjaxRequest;
            iniData?: JsonObject[];
        }

        /**
         * A model for list data.
         */
        @klass('JS.model.ListModel')
        export class ListModel {
            protected _config: ListModelConfig;
            protected _data: JsonObject[] = [];

            protected _eventBus = new EventBus(this);
            private _isD = false;

            constructor(cfg?: ListModelConfig) {
                this._config = this._initConfig(cfg);

                let listeners = this._config.listeners;
                if (listeners) J.forEach(<JsonObject>listeners, (v: EventHandler, key: ListModelEvents) => {
                    this.on(key, v);
                })

                if (this._config.iniData) this.setData(this._config.iniData);
                if (this._config.autoLoad) this.reload();
            }

            protected _initConfig(cfg?:ListModelConfig){
                return J.union(new ListModelConfig(), cfg)
            }

            protected _check() {
                if (this.isDestroyed()) throw new NotHandledError('The model was destroyed!');
            }

            public addSorter(field: string, dir?: 'asc' | 'desc') {
                this._check();

                let newSorter: Sorter = {
                    field: field,
                    dir: dir ? dir : 'asc'
                }, has = false, sorters = this._config.sorters;
                if (!sorters) sorters = [];

                sorters.some((sorter: Sorter) => {
                    if (newSorter.field == sorter.field) {
                        has = true;
                        if (newSorter.sort) sorter.sort = newSorter.sort;

                        sorter.dir = newSorter.dir;
                        return true;
                    }
                    return false;
                });
                if (!has) sorters.push(newSorter);
                this._config.sorters = sorters;
            }
            public removeSorter(field: string) {
                this._check();
                let sorters = this._config.sorters;
                if (!sorters) return;

                sorters.remove(item=> {
                    return item.field == field;
                })
            }
            public clearSorters() {
                this._check();
                this._config.sorters = [];
            }

            public sort(field: string, dir?: 'desc' | 'asc'): Promise<any> {
                this._check();
                this.addSorter(field, dir);
                return this.reload();
            }

            public getSorterBy(fieldName: string): Sorter {
                let sorters = this._config.sorters;
                if (!sorters) return null;

                let sorter: Sorter = null;
                sorters.some((srt: Sorter) => {
                    let is = srt.field === fieldName;
                    if (is) sorter = srt;
                    return is;
                });
                return sorter;
            }

            private _sortParams(): JsonObject {
                let sorters = this._config.sorters;
                if (!sorters) return null;

                let s = '';
                sorters.forEach((sorter: Sorter) => {
                    s += `${sorter.field} ${sorter.dir ? sorter.dir : 'asc'},`;
                });
                s = s.slice(0, s.length - 1);

                return { sorters: s }
            }

            public reload() {
                return this.load(this._config.dataQuery);
            }

            private _modelKlass:Klass<Model> = null;

            public modelKlass():Klass<Model>
            public modelKlass(klass:Klass<Model>):this
            public modelKlass(klass?:Klass<Model>){
                if(arguments.length==0) return this._modelKlass;
                this._modelKlass = klass
                return this
            }

            /**
             * load using its configured query.
             */
            public load<R=JsonObject[]>(quy: string | AjaxRequest, silent?:boolean): Promise<ResultSet<R>> {
                this._check();

                let me = this,
                query = <AjaxRequest>J.union(Ajax.toRequest(this._config.dataQuery),Ajax.toRequest(quy));
                query.data = J.union(<JsonObject>query.data,this._sortParams());
                
                this._fire('loading', [query]);
                this._config.dataQuery = query;
                return new JsonProxy().execute<R>(query).then(function (result: ResultSet<R>) {
                    if (result.success()) {
                        me.setData(<any>result.data(), silent);
                        me._fire('loadsuccess', [result]);
                    } else {
                        me._fire('loadfailure', [result]);
                    }
                    return Promise.resolve(<any>result);
                }).catch(function (err: AjaxResponse|Error) {
                    if(Types.ofKlass(err, Error)) JSLogger.error('['+(<Error>err).name+']'+(<Error>err).message);
                    me._fire('loaderror', [err]);
                });
            }

            public getData(): JsonObject[] {
                return this.isEmpty()?null:this._data;
            }
            /**
             * Read data into model.
             * @param data 
             * @param silent ignore events
             */
            public setData(data: JsonObject[], silent?: boolean) {
                this._check();
                let newData = data, oldData = J.clone(this._data);
                if (!silent) this._fire('dataupdating', [newData, oldData]);
                this._data = data||[];
                if (!silent) this._fire('dataupdated', [newData, oldData]);

                return this;
            }
            
            public iniData(): any
            public iniData(data: any): this
            public iniData(d?: any): any {
                let cfg = this._config;
                if (arguments.length == 0) return cfg.iniData;

                cfg.iniData = d;
                return this
            }
            public reset() {
                return this.setData(this.iniData());
            }

            /**
             * Add new data into the tail.
             * @param records 
             * @param silent ignore events
             */
            public add(records: JsonObject | JsonObject[], silent?: boolean) {
                return this.insert(this._data.length, records, silent);
            }
            /**
             * Insert new data into the index.
             * @param index 
             * @param records 
             * @param silent ignore events
             */
            public insert(index: number, records: JsonObject | JsonObject[], silent?: boolean) {
                if (!records) return this;
                this._check();
                
                this._data = this._data||[];
                let models = Arrays.toArray(records);
                this._data.add(models, index);

                if (!silent) this._fire('rowadded', [models, index]);
                return this;
            }

            public getRowModel<T extends Model>(index:number, klass?: Klass<T>): T{
                if (index < 0 || index >= this.size()) return null;
                let d = this._data[index];
                if(!d) return null;

                let k = klass||this._modelKlass;
                if(!k) throw new NotFoundError('The model klass not found!');
                return Class.newInstance<T>(k).setData(d,true)
            }

            public getModels<T extends Model>(klass?: Klass<T>): T[]{
                if(this.size()==0) return null;
                let k = klass||this._modelKlass;
                if(!k) throw new NotFoundError('The model klass not found!');
                
                let mds:T[] = [];
                this._data.forEach((d,i)=>{
                    mds[i] = Class.newInstance<T>(k).setData(d,true)
                })
                return mds
            }

            public getRowById(id: number | string): JsonObject {
                return this.getRow(this.indexOfId(id));
            }
            public getRow(index: number): JsonObject {
                if (index < 0 || index >= this.size()) return null;
                return this._data[index] || null;
            }

            public indexOfId(id: number | string): number {
                if (!id || this.size()==0) return -1;

                let idName = 'id';
                if(this._modelKlass && Types.subKlass(this._modelKlass, Model)) {//如果modelKlass是Model的子类，则获取其id名称
                    let model = Class.newInstance<Model>(this._modelKlass),
                    field = model.getIdField();
                    if(field) idName = field.alias();
                }

                let index = -1;
                this._data.some((obj, i) => {
                    let ret = obj[idName] == id;
                    if (ret) index = i;
                    return ret;
                })

                return index;
            }

            public removeAt(index: number, silent?: boolean) {
                this._check();
                if (this.size()==0) return this;

                const obj = this._data[index];
                if (obj) {
                    this._data.remove(index);
                    if (!silent) this._fire('rowremoved', [obj, index]);
                }
                return this;
            }
            public clear(silent?: boolean) {
                return this.setData(null, silent);
            }

            public validate(): string | boolean {
                if (this.size()==0) return true;

                let rst = new ValidateResult(), str = '';
                this._data.forEach(m => {
                    let ret = m.validate(rst);
                    if (ret !== true) str += (str ? '|' : '') + ret;
                });
                this._fire('validated', [this._data, rst]);

                return str || true;
            }
            public validateRow(index:number): string | boolean {
                let row = this.getRow(index);
                if(!row) return null;

                let rst = row.validate();
                this._fire('rowvalidated', [rst, row, index]);

                return rst
            }

            public size() {
                return !this._data?0:this._data.length
            }
            public isEmpty() {
                return this.size() == 0
            }

            public clone() {
                let model = Class.newInstance<this>(this.className, J.clone(this._config));
                model.setData(this.getData());
                return model
            }

            protected _fire(type: string, args?: any[]) {
                this._eventBus.fire(type, args);
            }

            public on<H=EventHandler<this>>(type: string, fn: H, once?:boolean) {
                this._check();
                this._eventBus.on(type, fn, once);
                return this
            }
            public off(type?: string) {
                this._check();
                this._eventBus.off(<any>type);
                return this
            }

            public destroy() {
                if (this._isD) return;

                this._eventBus.destroy();
                this._eventBus = null;

                this._data = null;
                this._isD = true;
            }
            public isDestroyed() {
                return this._isD
            }
        }

    }
}

//预定义短类名
import ListModel = JS.model.ListModel;
import ListModelConfig = JS.model.ListModelConfig;
import ListModelEvents = JS.model.ListModelEvents;
import ListModelListeners = JS.model.ListModelListeners;
