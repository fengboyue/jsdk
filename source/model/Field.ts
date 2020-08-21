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
                    isId: false,
                    nullable: true,
                    defaultValue: null
                }, config);
            }

            config(): FieldConfig
            config(cfg: FieldConfig): this
            config(cfg?: FieldConfig): any {
                let T = this;
                if(cfg==void 0) return T._cfg;

                T._cfg = <FieldConfig>Jsons.union(T._cfg, cfg);
                return T
            }

            name(): string {
                return this._cfg.name
            }

            alias(): string {
                let mp = this._cfg.nameMapping;
                if (!mp) return this.name();

                return Types.isString(mp) ? <string>mp : <string>(<Function>mp).call(this);
            }

            isId(): boolean {
                return this._cfg.isId
            }

            defaultValue() {
                return this._cfg.defaultValue
            }
            
            nullable(): boolean {
                return this._cfg.nullable
            }

            set(val: any): any {
                let T = this;
                if (!T.nullable() && val == void 0) throw new TypeError(`This Field<${T.name()}> must be not null`)
                let fn = T._cfg.setter, v = fn ? fn.apply(T, [val]) : val;
                return v === undefined ? T._cfg.defaultValue : v
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
            validate(value: any, errors?: ValidateResult): boolean | string {
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