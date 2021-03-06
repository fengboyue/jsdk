/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../lang/System.ts"/>
/// <reference path="JsonProxy.ts"/>
/// <reference path="Field.ts"/>

module JS {

    export namespace model {

        let E = Check.isEmpty, J = Jsons;
        
        export interface Modelable<T extends Model> {
            on(event: ModelEvents, fn: EventHandler<this>): this;
            off(event?: ModelEvents): this;
            clone(): this;
            reload(): Promise<ResultSet<T>>;
            load(req: string | HttpRequest, silent?: boolean): Promise<ResultSet<T>>;
            setData(data: any, silent?: boolean): this;
            getData(): any;
            iniData(): any;
            iniData(data: any): this;
            reset(): this;
            clear(): this;
            validate(result?: ValidateResult): string | boolean;
            destroy(): void;
            isDestroyed(): boolean;
        }


        export type ModelEvents = 'dataupdating' | 'dataupdated' | 'fieldchanged' | 'validated' | 'fieldvalidated' | 'loading' | 'loadsuccess' | 'loadfailure' | 'loaderror';

        export type ModelListeners<M> = {
            /**
             * @event (this:Model, e:CustomEvent, newData:JsonObject, oldData:JsonObject)
             */
            dataupdating: EventHandler2<M, JsonObject, JsonObject>
            /**
             * @event (this:Model, e:CustomEvent, newData:any, oldData:any)
             */
            dataupdated: EventHandler2<M, JsonObject, JsonObject>
            /**
             * @event (this:Model, e:CustomEvent, newVal:any, oldVal:any, fieldName:string)
             */
            fieldchanged: EventHandler3<M, any, any, string>
            /**
             * @event (this:Model, e:CustomEvent, result:ValidateResult, data:JsonObject)
             */
            validated: EventHandler2<M, ValidateResult, JsonObject>
            /**
             * @event (this:Model, e:CustomEvent, result:ValidateResult, val:any, fieldName:string)
             */
            fieldvalidated: EventHandler3<M, ValidateResult, any, string>
            /**
             * @event (this:Model, e:CustomEvent, request:HttpRequest)
             */
            loading: EventHandler1<M, HttpRequest>
            /**
             * @event (this:Model, e:CustomEvent, result:ResultSet<any>)
             */
            loadsuccess: EventHandler1<M, ResultSet<any>>
            /**
             * @event (this:Model, e:CustomEvent, result:ResultSet<any>)
             */
            loadfailure: EventHandler1<M, ResultSet<any>>
            /**
             * @event (this:Model, e:CustomEvent, res:HttpResponse|Error)
             */
            loaderror: EventHandler1<M, HttpResponse|Error>
        };
        export class ModelConfig {
            readonly listeners?: ModelListeners<this>;
            idProperty?: string = 'id';
            readonly fields?: Array<FieldConfig | string>;
            dataQuery?: string | HttpRequest;
            iniData?: JsonObject = null;
        }

        /**
         * A data model class.
         */
        @klass('JS.model.Model')
        export class Model {
            protected _config: ModelConfig;
            private readonly _fields: JsonObject<Field> = {};
            private _eventBus = new EventBus(this);

            protected _data: JsonObject = {};
            /**
             * 子类定义的缺省字段集
             */
            public static DEFAULT_FIELDS: Array<FieldConfig | string> = [];

            constructor(cfg?: ModelConfig) {
                cfg = J.union(new ModelConfig(), cfg);

                let defaultFields = (<any>(<Object>this).getClass().getKlass()).DEFAULT_FIELDS;
                this._config = Types.isDefined(defaultFields) ? J.union(cfg, { fields: defaultFields }) : cfg;
                this._addFields(this._config.fields);

                let listeners = this._config.listeners;
                if (listeners) J.forEach(listeners, (v: (this: Model, ...args) => void, key: string) => {
                    this.on(<any>key, v);
                })
            }

            private _check() {
                if (this.isDestroyed()) throw new RefusedError('The model was destroyed!');
            }

            private _newField(cfg: FieldConfig) {
                let tField: Field = null;
                if (cfg.name in this._fields) {
                    tField = this._fields[cfg.name];
                    tField.config(cfg);
                } else {
                    cfg.isId = cfg.isId || this._config.idProperty === cfg.name;
                    tField = new Field(cfg);
                }
                this._fields[tField.name()] = tField;
                if (tField.isId()) this._config.idProperty = cfg.name;
            }

            protected _addFields(fields: Array<FieldConfig | string>) {
                if (!fields) return
                for (let i = 0, len = fields.length; i < len; i++) {
                    const fieldCfg = fields[i];
                    this._newField(Types.isString(fieldCfg) ? { name: <string>fieldCfg } : <FieldConfig>fieldCfg);
                }
            }

            public addFields(fields: Array<FieldConfig | string>) {
                this._check();

                this._addFields(fields);
                return this
            }
            public addField(field: FieldConfig | string) {
                this.addFields([field]);
                return this
            }

            public isIdField(name: string) {
                return name == this._config.idProperty
            }

            public removeFields(names: Array<string>) {
                this._check();

                names.forEach((name: string) => {
                    this.removeField(name)
                });
                return this
            }
            public removeField(name: string) {
                this._check();
                if (this.isIdField(name)) throw new JSError('Can\'t remove the ID field!');

                if (this._fields.hasOwnProperty(name)) delete this._fields[name];
                return this
            }
            public updateField(field: FieldConfig | string) {
                this._check();

                let name = Types.isString(field) ? <string>field : (<FieldConfig>field).name;
                if (this.isIdField(name)) throw new JSError('Can\'t update the ID field!');

                if (!this._fields.hasOwnProperty(name)) return;

                delete this._fields[name];
                this.addFields([field]);
                return this
            }
            public updateFields(fields: Array<FieldConfig | string>) {
                fields.forEach(field => {
                    this.updateField(field);
                })
                return this
            }

            public clone(): this {
                let model = Class.newInstance<Model>(this.className, J.clone(this._config));
                model.setData(this.getData());
                return <this>model;
            }

            public reload() {
                return this.load(this._config.dataQuery);
            }

            public load<T>(quy: string | HttpRequest, silent?: boolean): Promise<ResultSet<T>> {
                this._check();

                let me = this,
                query = <HttpRequest>J.union(Http.toRequest(this._config.dataQuery),Http.toRequest(quy));

                this._fire('loading', [query]);
                this._config.dataQuery = query;
                return new JsonProxy().execute<T>(query).then(function (result: ResultSet<T>) {
                    if (result) {
                        let records = result.data();
                        if (!records) me._fire('loadfailure', [result]);

                        me.setData(Types.isArray(records) ? records[0].getData() : records, silent);
                        me._fire('loadsuccess', [result]);
                    } 
                    return Promise.resolve(<any>result)
                }).catch(function (err: HttpResponse | Error) {
                    if (Types.ofKlass(err, Error)) JSLogger.error('[' + (<Error>err).name + ']' + (<Error>err).message);
                    me._fire('loaderror', [err]);
                })
            }

            public setData(data: JsonObject, silent?: boolean) {
                this._check();

                let oldData = J.clone(this._data), newData = data;
                if (!silent) this._fire('dataupdating', [newData, oldData]);

                this._data = {};
                if (newData) {
                    if (E(this._fields)) {
                        J.forEach(newData, (v: any, k: string) => {
                            this._newField({ name: k });
                            this.set(k, v, true);
                        })
                    } else {
                        J.forEach(this._fields, (f: Field, name: string) => {
                            this.set(name, newData[f.alias()], true);
                        })
                    }
                }

                if (!silent) this._fire('dataupdated', [newData, oldData]);
                return this;
            }
            public hasField(name: string): boolean {
                return this._fields.hasOwnProperty(name);
            }
            public get(fieldName: string) {
                let field = this.getField(fieldName);
                if (!field) return undefined;

                let v = this._data[field.alias()];
                return v == void 0? null: v
            }
            public set(key: string, value: any, equal?: boolean|((this: this, newVal:any, oldVal:any)=>boolean)) {
                this._check();

                let field = this.getField(key);
                if (!field) return;

                let alias = field.alias(), oldVal = this._data[alias], newVal = field.set(value);
                this._data[alias] = newVal;

                let eq = equal == void 0?false:(Types.isFunction(equal)?((<Function>equal).apply(this, [newVal, oldVal])):<boolean>equal);
                if (!eq) this._fire('fieldchanged', [newVal, oldVal, field.name()]);
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

            public getData() {
                return this._data;
            }
            public getId() {
                return this.get(this._config.idProperty);
            }
            public setId(id: number | string) {
                this._check();
                this.set(this._config.idProperty, id);
                return this
            }
            public isEmpty(): boolean {
                return E(this._data);
            }

            protected _isD = false;
            public destroy() {
                if (this._isD) return;

                this._eventBus.destroy();
                this._eventBus = null;

                this._data = null;
                this._isD = true;
            }
            public isDestroyed() {
                return this._isD;
            }

            public getField(name: string): Field {
                return this._fields[name];
            }
            public getFields(): JsonObject<Field> {
                return this._fields;
            }
            public getIdField(): Field {
                if (!this._fields) return null;

                let f: Field = null;
                J.some(this._fields, field => {
                    let is = field.isId();
                    if (is) f = field;
                    return is
                })
                return f
            }
            public reset() {
                return this.setData(this.iniData())
            }
            public clear() {
                return this.setData(null)
            }
            public validate(result?: ValidateResult): string | boolean {
                let vdata = this._data;
                if (E(vdata)) return true;

                let rst = result || new ValidateResult(), str = '';
                J.forEach(vdata, (v: any, k: string) => {
                    let field = this.getField(k);
                    if (field) {
                        let ret = this.validateField(field.name(), v, rst)
                        if (ret !== true) str += (str ? '|' : '') + ret;
                    }
                });
                this._fire('validated', [rst, vdata]);

                return str || true;
            }
            public validateField(fieldName: string, value?: any, result?: ValidateResult): string | boolean {
                if (!result) result = new ValidateResult();
                let field = this.getField(fieldName);
                if (!field) return true;

                let rst = result || new ValidateResult(),
                    val = arguments.length > 1 ? value : this.get(fieldName);

                let vdt = field.validate(val, rst);
                this._fire('fieldvalidated', [rst, val, fieldName]);

                return Types.isBoolean(vdt) ? vdt : `[${fieldName}]=` + vdt;
            }

            protected _fire(type: ModelEvents, args?: any[]) {
                this._eventBus.fire(type, args);
            }

            public on(type: string, fn: EventHandler<this>, once?:boolean) {
                this._check();
                this._eventBus.on(type, fn, once);
                return this;
            }
            public off(type?: string) {
                this._check();
                this._eventBus.off(type);
                return this;
            }
        }
    }
}

//预定义短类名
import Model = JS.model.Model;
import ModelEvents = JS.model.ModelEvents;
import ModelConfig = JS.model.ModelConfig;
import Modelable = JS.model.Modelable;


