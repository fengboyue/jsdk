/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../lang/System.ts"/>
/// <reference path="Field.ts"/>

module JS {

    export namespace model {

        export namespace validator {

            export type ValidatorType = 'required' | 'format' | 'range' | 'length' | 'custom';

            export class ValidatorConfig {
            }

            export abstract class Validator {
                protected _cfg: ValidatorConfig;
                constructor(cfg: ValidatorConfig) {
                    this._cfg = cfg
                }
                abstract validate(value: any): string | boolean;

                public static create(type: ValidatorType, cfg: ValidatorConfig): Validator {
                    return Class.newInstance({
                        'required': RequiredValidator,
                        'custom': CustomValidator,
                        'range': RangeValidator,
                        'format': FormatValidator,
                        'length': LengthValidator
                    }[type], cfg)
                }
            }

            export type InvalidField = {
                field: string
                message: string
            }

            export class ValidateResult {
                private _errors: InvalidField[] = [];

                public addError(field: string, msg?: string) {
                    this._errors.push({ field: field, message: msg });
                }
                public length(): number {
                    return this._errors.length;
                }
                public hasError(field?: string): boolean {
                    if (!field) return this.length() > 0;
                    return this.getErrors(field).length == 0;
                }
                public clear() {
                    this._errors = [];
                }
                public getErrors(field?: string): InvalidField[] {
                    let errs = this._errors;
                    if (errs.length < 1) return [];

                    if (!field) return errs;
                    let fields = [];
                    errs.forEach(e => {
                        if (e.field == field) fields.push(e);
                    })
                    return fields;
                }
            }

            export class CustomValidatorConfig extends ValidatorConfig {
                allowEmpty?:boolean = true;
                validate?: (value: any) => boolean
                message?: string
            }
            export class CustomValidator extends Validator {

                constructor(cfg: CustomValidatorConfig) {
                    super(Jsons.union(new CustomValidatorConfig(), cfg));
                }

                public validate(val: any): string | boolean {
                    let cfg = <CustomValidatorConfig>this._cfg;
                    if ((Check.isEmpty(val) && !cfg.allowEmpty) || !cfg.validate(val)) return cfg.message || false;
                    return true;
                }
            }

            export class RequiredValidatorConfig extends ValidatorConfig {
                message?: string
            }
            export class RequiredValidator extends Validator {
                constructor(cfg: RequiredValidatorConfig) {
                    super(cfg);
                }

                public validate(val: any): string | boolean {
                    if (val == void 0 || Check.isEmpty(String(val).trim())) return (<RequiredValidatorConfig>this._cfg).message || false;
                    return true;
                }
            }
            export class RangeValidatorConfig extends ValidatorConfig {
                allowEmpty?:boolean = true;
                min?: number
                max?: number
                nanMessage?: string
                tooMinMessage?: string
                tooMaxMessage?: string
            }
            export class RangeValidator extends Validator {
                constructor(cfg: RangeValidatorConfig) {
                    super(Jsons.union(new RangeValidatorConfig(), cfg));
                }

                public validate(val: string | number): string | boolean {
                    let cfg = <RangeValidatorConfig>this._cfg;
                    if ((Check.isEmpty(val) && !cfg.allowEmpty) || !Types.isNumeric(val)) return cfg.nanMessage;

                    let min = cfg.min, max = cfg.max;
                    val = Number(val == void 0 ? 0 : val);

                    if (min != void 0 && val < min) return cfg.tooMinMessage;
                    if (max != void 0 && val > max) return cfg.tooMaxMessage;
                    return true;
                }
            }
            export class LengthValidatorConfig extends ValidatorConfig {
                allowEmpty?:boolean = true;
                short?: number
                long?: number
                invalidTypeMessage?: string
                tooShortMessage?: string
                tooLongMessage?: string
            }
            export class LengthValidator extends Validator {
                constructor(cfg: LengthValidatorConfig) {
                    super(Jsons.union(new LengthValidatorConfig(), cfg));
                }

                public validate(val: string | string[]): string | boolean {
                    let cfg = <LengthValidatorConfig>this._cfg;
                    if (Check.isEmpty(val)) {
                        return !cfg.allowEmpty?(cfg.invalidTypeMessage || false):true;
                    }

                    if (!Types.isString(val) && !Types.isArray(val)) return cfg.invalidTypeMessage || false;

                    let short = cfg.short,
                        long = cfg.long, len: number = val ? val.length : 0;

                    if (short != void 0 && len < short) return cfg.tooShortMessage || false;
                    if (long != void 0 && len > long) return cfg.tooLongMessage || false;
                    return true;
                }
            }

            export class FormatValidatorConfig extends ValidatorConfig {
                allowEmpty?:boolean = true;
                matcher?: RegExp
                message?: string
            }
            export class FormatValidator extends Validator {
                constructor(cfg: FormatValidatorConfig) {
                    super(Jsons.union(new FormatValidatorConfig(), cfg));
                }

                public validate(val: any): string | boolean {
                    let cfg = <FormatValidatorConfig>this._cfg;
                    return (Check.isEmpty(val) && !cfg.allowEmpty) || !cfg.matcher.test(val) ? (cfg.message || false):true;
                }
            }
        }
    }
}
//预定义短类名
import InvalidField = JS.model.validator.InvalidField;
import ValidateResult = JS.model.validator.ValidateResult;
import Validator = JS.model.validator.Validator;
import ValidatorType = JS.model.validator.ValidatorType;
import CustomValidator = JS.model.validator.CustomValidator;
import RequiredValidator = JS.model.validator.RequiredValidator;
import RangeValidator = JS.model.validator.RangeValidator;
import LengthValidator = JS.model.validator.LengthValidator;
import FormatValidator = JS.model.validator.FormatValidator;