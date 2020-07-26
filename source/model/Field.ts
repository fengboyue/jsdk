/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../lang/System.ts"/>
/// <reference path="Validator.ts"/>

module JS {

    export namespace model {

        export interface RequiredValidatorSetting extends JS.model.validator.RequiredValidatorConfig {
            name: 'required';
        }
        export interface FormatValidatorSetting extends JS.model.validator.FormatValidatorConfig {
            name: 'format'
        }
        export interface RangeValidatorSetting extends JS.model.validator.RangeValidatorConfig {
            name: 'range'
        }
        export interface LengthValidatorSetting extends JS.model.validator.LengthValidatorConfig {
            name: 'length'
        }
        export interface CustomValidatorSetting extends JS.model.validator.CustomValidatorConfig {
            name: 'custom'
        }

        export type ValidatorSetting = RequiredValidatorSetting | FormatValidatorSetting | RangeValidatorSetting | LengthValidatorSetting | CustomValidatorSetting;

        export interface FieldConfig {
            readonly name: string;
            readonly type?: string | 'string' | 'int' | 'float' | 'boolean' | 'date' | 'object' | 'array';
            isId?: boolean;//This property is set to `true` if this is an id field.
            readonly nullable?: boolean;//an unique field cannot be nullable.
            readonly defaultValue?: any;
            readonly setter?: (this: Field, value: any) => any;
            readonly nameMapping?: string | ((this: Field) => string);
            readonly comparable?: (val1: any, val2: any) => number;
            readonly validators?: Array<ValidatorSetting>;
        }

        /**
         * Model field class.
         */
        export class Field {
            protected _cfg: FieldConfig;

            constructor(config: FieldConfig) {
                this._cfg = <FieldConfig>Jsons.union(<FieldConfig>{
                    type: 'string',
                    isId: false,
                    nullable: true,
                    defaultValue: null
                }, config);
            }

            public config(): FieldConfig
            public config(cfg: FieldConfig): this
            public config(cfg?: FieldConfig): any {
                let T = this;
                if(cfg==void 0) return T._cfg;

                T._cfg = <FieldConfig>Jsons.union(T._cfg, cfg);
                return T
            }

            public name(): string {
                return this._cfg.name
            }

            public alias(): string {
                let mp = this._cfg.nameMapping;
                if (!mp) return this.name();

                return Types.isString(mp) ? <string>mp : <string>(<Function>mp).call(this);
            }

            public isId(): boolean {
                return this._cfg.isId
            }

            public defaultValue() {
                return this._cfg.defaultValue
            }

            public type(): 'string' | 'int' | 'float' | 'boolean' | 'date' | 'object' | 'array' {
                return <any>this._cfg.type
            }

            public nullable(): boolean {
                return this._cfg.nullable
            }

            public set(val: any): any {
                let T = this;
                if (!T.nullable() && val == void 0) throw new TypeError(`This Field<${T.name()}> must be not null`)
                let fn = T._cfg.setter, v = fn ? fn.apply(T, [val]) : val;
                return v === undefined ? T._cfg.defaultValue : v
            }

            /**
             * When the 'comparable' config be empty, returns a positive number when vv1 > v2; Zero when v1==v2.
             */
            public compare(v1: any, v2: any): number {
                let ret = 0;

                if (this._cfg.comparable) {
                    ret = this._cfg.comparable(v1, v2);
                } else {
                    ret = (v1 === v2) ? 0 : ((v1 < v2) ? -1 : 1);
                }

                return ret
            }

            /**
             * When the 'comparable' config be empty, returns TRUE when v1==v2.
             */
            public isEqual(v1: any, v2: any): boolean {
                return this.compare(v1, v2) === 0;
            }

            /**
             * Validates the passed value for this field.
             *
             * @param {any} value The value to validate.
             * @param {ValidateResult} errors 
             * @return {Boolean/String} if the value is valid. A string may be returned if
             * the value is not valid, to indicate an error message. Any other non `true` value
             * indicates the value is not valid. This method is not implemented by default,
             * subclasses may override it to provide an implementation.
             */
            public validate(value: any, errors?: ValidateResult): boolean | string {
                let cfg = this._cfg,
                    vts = cfg.validators,
                    rst, ret = '';
                if (!vts) return true;

                for (let i = 0, len = vts.length; i < len; ++i) {
                    const vSpec = vts[i];
                    rst = Validator.create(<any>vSpec.name, vSpec).validate(value);
                    if (rst !== true) {
                        if (errors) errors.addError(cfg.name, rst === false ? '' : rst);
                        ret += ret ? ('|' + rst) : rst;
                    }
                }

                return ret || true;
            }
        }

    }
}

//预定义短类名
import ModelField = JS.model.Field;
import RequiredValidatorSetting = JS.model.RequiredValidatorSetting;
import FormatValidatorSetting = JS.model.FormatValidatorSetting;
import RangeValidatorSetting = JS.model.RangeValidatorSetting;
import LengthValidatorSetting = JS.model.LengthValidatorSetting;
import CustomValidatorSetting = JS.model.CustomValidatorSetting;
import ValidatorSetting = JS.model.ValidatorSetting;
import FieldConfig = JS.model.FieldConfig;