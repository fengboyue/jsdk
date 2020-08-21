/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.5.0
 * @author Frank.Feng
 */
/// <reference path="Types.ts"/>
/// <reference path="Check.ts"/>
/// <reference path="Jsons.ts"/>
/// <reference path="../net/URI.ts"/>
/// <reference path="Locales.ts"/>

module JS {

    export namespace util {

        export type I18NResource = JsonObject<PrimitiveType | Array<any> | RegExp | JsonObject>;

        /**
         * I18N Helper<br>
         * I18n工具类
         */
        export class I18N {
            private _lc: Locale;
            private _d: JsonObject = {};

            constructor(lc?: Locale) {
                this.locale(lc)
            }

            private _load(lc: Locale, prefix: string, suffix: string) {
                let lang = Locales.lang(lc), country = Locales.country(lc);

                if (country) {
                    let rst = this._loadJson(`${prefix}_${lang}_${country}.${suffix}`);
                    if (rst) return true
                }

                if (lang) {
                    let rst = this._loadJson(`${prefix}_${lang}.${suffix}`);
                    if (rst) return true
                }

                return this._loadJson(`${prefix}.${suffix}`);
            }

            private _loadJson(u: string) {
                // return Promises.create<JsonObject>(function () {
                //     Http.get({
                //         url: p,
                //         responseType: 'json',
                //         success: (res) => {
                //             this.resolve(res.data || null)
                //         }
                //     }).catch(()=>{
                //         this.reject(undefined)
                //     })
                // })
                let xhr: XMLHttpRequest = new XMLHttpRequest();
                xhr.open('GET', u, false);
                xhr.responseType = 'json';
                xhr.send();
                if (xhr.status != 200) return false;

                this.set(xhr.response);
                return true
            }

            load(url: URLString, locale?: Locale) {
                let T = this, lc = locale || T._lc,
                    pos = (<string>url).lastIndexOf('.'),
                    suffix = pos < 0 ? '' : (<string>url).slice(pos + 1),
                    prefix = pos < 0 ? (<string>url) : (<string>url).slice(0, pos);

                return T._load(lc, prefix, suffix)
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
                return this._d.hasOwnProperty(k)
            }

            public locale(): Locale
            public locale(lc: Locale): this
            public locale(lc?: Locale): any {
                if (arguments.length == 0) return this._lc;

                this._lc = lc || System.info().locale;
                return this
            }

            public set(d: I18NResource) {
                let T = this; d = d||{};
                if (d.hasOwnProperty(T._lc)) {
                    this._d = <JsonObject>d[T._lc]
                } else {
                    let lang = Locales.lang(T._lc);
                    this._d = d.hasOwnProperty(lang) ? <JsonObject>d[lang] : <JsonObject>d;
                }
                return this
            }
        }
    }
}

import I18NResource = JS.util.I18NResource;
import I18N = JS.util.I18N;   