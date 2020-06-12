/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../lang/System.ts"/>

module JS {

    export namespace model {


        export interface ResultSetFormat {
            rootProperty?: string;
            recordsProperty?: string;
            totalProperty?: string;
            pageProperty?: string;
            pageSizeProperty?: string;
            messageProperty?: string;
            versionProperty?: string;
            langProperty?: string;
            successProperty?: string,
            successCode?: any,
            isSuccess?: (root: any) => boolean;
        }

        /**
         * A result for API response.
         */
        export class ResultSet<T=PrimitiveType|Array<any>|JsonObject|Model> {

            public static DEFAULT_FORMAT: ResultSetFormat = {
                rootProperty: undefined,
                recordsProperty: 'data',
                totalProperty: 'paging.total',
                pageProperty: 'paging.page',
                pageSizeProperty: 'paging.pageSize',
                messageProperty: 'msg',
                versionProperty: 'version',
                langProperty: 'lang',
                successProperty: 'code',
                successCode: 'success'
            }

            private _rawObject: any;
            private _data: T = null;
            private _page: number = 1;
            private _pageSize: number = Infinity;
            private _total: number;
            private _version: string;
            private _lang: string;
            private _msg: string;
            private _success: boolean;

            public rawObject(): any
            public rawObject(response: any): this
            public rawObject(response?: any): any {
                if (arguments.length == 0) return this._rawObject;
                this._rawObject = response;
                return this
            }
            public data(): T
            public data(data: T): this
            public data(data?: T): any {
                if (arguments.length == 0) return this._data;
                this._data = data;
                return this
            }
            public count(): number {
                return this._data == void 0 ? 0 : (this._data['length']||0);
            }
            public total(): number
            public total(total: number): this
            public total(total?: number): any {
                if (arguments.length == 0) return this._total;
                this._total = total;
                return this
            }
            public page(): number
            public page(page: number): this
            public page(page?: number): any {
                if (arguments.length == 0) return this._page;
                this._page = page;
                return this
            }
            public pageSize(): number
            public pageSize(pageSize: number): this
            public pageSize(pageSize?: number): any {
                if (arguments.length == 0) return this._pageSize;
                this._pageSize = pageSize;
                return this
            }
            public version(): string
            public version(v: string): this
            public version(v?: string): any {
                if (arguments.length == 0) return this._version;
                this._version = v;
                return this
            }
            public lang(): string
            public lang(lang: string): this
            public lang(lang?: string): any {
                if (arguments.length == 0) return this._lang;
                this._lang = lang;
                return this
            }
            public message(): string
            public message(msg: string): this
            public message(msg?: string): any {
                if (arguments.length == 0) return this._msg;
                this._msg = msg;
                return this
            }
            public success(): boolean
            public success(success: boolean): this
            public success(success?: boolean): any {
                if (arguments.length == 0) return this._success;
                this._success = success;
                return this
            }

            public static parseJSON<T>(raw: JsonObject, format?: ResultSetFormat): ResultSet<T> {
                if (!raw) return null;

                const fmt = format||this.DEFAULT_FORMAT, root = Jsons.getValueByPath(raw, fmt.rootProperty);
                let result = new ResultSet<T>();
                result.lang(Jsons.getValueByPath(root, fmt.langProperty));
                result.message(Jsons.getValueByPath(root, fmt.messageProperty));
                result.version(Jsons.getValueByPath(root, fmt.versionProperty));
                result.success(fmt.isSuccess ? fmt.isSuccess(root) : (root[fmt.successProperty] === (fmt.successCode || true)));

                result.data(Jsons.getValueByPath(root, fmt.recordsProperty));
                result.rawObject(root);
                result.page(Jsons.getValueByPath(root, fmt.pageProperty));
                result.pageSize(Jsons.getValueByPath(root, fmt.pageSizeProperty));
                result.total(Jsons.getValueByPath(root, fmt.totalProperty));

                return result;
            }

        }
    }

}

//预定义短类名
import ResultSet = JS.model.ResultSet;
import ResultSetFormat = JS.model.ResultSetFormat;