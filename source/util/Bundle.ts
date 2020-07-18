/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="Types.ts"/>
/// <reference path="Check.ts"/>
/// <reference path="Jsons.ts"/>
/// <reference path="../util/Ajax.ts"/>
/// <reference path="../util/URI.ts"/>
/// <reference path="Locales.ts"/>

module JS {

    export namespace util {

        export type JsonResource = JsonObject<PrimitiveType | Array<any> | RegExp | JsonObject>;
        export type Resource = URLString | JsonResource;

        /**
         * I18N Helper<br>
         * I18n工具类
         */
        export class Bundle {
            private _lc: Locale;
            private _d: JsonObject;

            private _load(lc: Locale, prefix: string, suffix: string): boolean {
                let paths = [];
                if (lc) {
                    let lang = Locales.lang(lc), country = Locales.country(lc);
                    if(lang && country) paths.push(`_${lang}_${country}`);
                    paths.push(`_${lang}`);
                }
                paths.push('');
                return paths.some(p => {
                    let path = `${prefix}${p}.${suffix}`;
                    // if (!Check.isExistUrl(path)) return false;

                    let xhr: XMLHttpRequest = (<any>self).XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
                    xhr.open('GET', path, false);
                    xhr.send();
                    if (xhr.status != 200) return false;

                    this._d = Jsons.parse(xhr.response) || {};
                    return true
                })
            }

            constructor(res: Resource, locale?: Locale) {
                let lc = <Locale>(locale == void 0 ? System.info().locale : locale);
                this._d = {};

                if (res) {
                    if (Types.isString(res)) {
                        let pos = (<string>res).lastIndexOf('.'),
                            suffix = pos < 0 ? '' : (<string>res).slice(pos + 1),
                            prefix = pos < 0 ? (<string>res) : (<string>res).slice(0, pos);

                        if (!this._load(lc, prefix, suffix)) JSLogger.error('Bundle can\'t load resource file:'+res)
                    } else {
                        if (res.hasOwnProperty(lc)) {
                            this._d = res[lc]
                        } else {
                            let lang = Locales.lang(lc);
                            this._d = res.hasOwnProperty(lang)?res[lang]:<JsonObject>res;
                        } 
                    }
                }

                this._lc = lc;
            }

            public get(): JsonObject
            public get(key: string): any
            public get(k?: string): any {
                if (arguments.length == 0) return this._d;
                return k && this._d ? this._d[k] : undefined
            }

            public getKeys() {
                return Reflect.ownKeys(this._d)
            }

            public hasKey(k: string) {
                return this._d && this._d.hasOwnProperty(k)
            }

            public getLocale(): Locale {
                return this._lc
            }

            public set(d: JsonObject) {
                if (d) this._d = d;
                return this
            }
        }
    }
}

import JsonResource = JS.util.JsonResource;
import Resource = JS.util.Resource;
import Bundle = JS.util.Bundle;        