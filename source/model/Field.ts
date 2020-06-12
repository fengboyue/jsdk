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
            protected _config: FieldConfig;

            constructor(config: FieldConfig) {
                this._config = <FieldConfig>Jsons.union(<FieldConfig>{
                    type: 'string',
                    isId: false,
                    nullable: true,
                    defaultValue: null
                }, config);
            }

            public config(){
                return this._config;
            }

            public name(): string {
                return this._config.name
            }

            public alias(): string {
                let nameMapping = this._config.nameMapping;
                if (!nameMapping) return this.name();

                return Types.isString(nameMapping) ? <string>nameMapping : <string>(<Function>nameMapping).call(this);
            }

            public isId(): boolean {
                return this._config.isId
            }

            public defaultValue(){
                return this._config.defaultValue
            }

            public type(): 'string' | 'int' | 'float' | 'boolean' | 'date' | 'object' | 'array' {
                return <any>this._config.type
            }

            public nullable(): boolean {
                return this._config.nullable
            }

            public set(val: any): any {
                if(!this.nullable() && val == void 0) throw new Errors.TypeError(`This Field<${this.name()}> must be not null`)
                let fn = this._config.setter, v = fn?fn.apply(this, [val]): val;
                return v===undefined?this._config.defaultValue:v
            }

            /**
             * When the 'comparable' config be empty, returns a positive number when vv1 > v2; Zero when v1==v2.
             */
            public compare(v1: any, v2: any): number {
                let ret = 0;

                if (this._config.comparable) {
                    ret = this._config.comparable(v1, v2);
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
                let cfg = this._config,
                    vts = cfg.validators,
                    rst, ret = '';
                if (!vts) return true;

                for (let i = 0, len = vts.length; i < len; ++i) {
                    const vSpec = vts[i];
                    rst = Validator.create(<any>vSpec.name, vSpec).validate(value);
                    if (rst !== true) {
                        if (errors) errors.addError(cfg.name, rst===false?'':rst);
                        ret += ret?('|'+rst):rst;
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