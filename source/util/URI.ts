/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../util/Jsons.ts" /> 
module JS {

    export namespace util {

        let Y = Types, J = Jsons,
            _URI_REG = /^(([^\:\/\?\#]+)\:)?(\/\/([^\/\?\#]*))?([^\?\#]*)(\\?([^\#]*))?(\#(.*))?/,
            _AUTH_REG = /^(([^\:@]*)(\:([^\:@]*))?@)?([^\:@]*)(\:(\d{1,3}))?/;

        /**
         * A string of URL<br>
         * URL字符串
         */
        export type URLString = string;

        /**
         * A string of Query<br>
         * URL字符串
         */
        export type QueryString = string;

        /**
         * All parts of an URI<br>
         * URI数据结构
         */
        export type URIData = {
            scheme?: string;
            user?: string;
            password?: string;
            host: string;
            port?: number;
            path?: string;
            params?: JsonObject<string>;
            fragment?: string;
        }

        let _ADU = null;//当前URI的绝对目录
        /**
         * URI Class<br>
         * URI specs: scheme://username:password@host:port/path?query#fragment <br>
         * Example:   http://jsdk:1234@github.com:8080/classes/URI?k1=v1#frag1 <br>
         */
        export class URI {
            private _scheme: string = null;
            private _user: string = null;
            private _pwd: string = null;
            private _host: string = null;
            private _port: number = null;
            private _path: string = null;
            private _params: JsonObject<string> = null;
            private _frag: string = null;

            constructor(cfg?: string | URL | URIData) {
                this._parse(cfg);
            }

            /**
             * 解析
             */
            private _parse(cfg: string | URL | URIData) {
                if (Y.isString(cfg)) {
                    this._parseStr(<string>cfg);
                } else if (cfg && (<URL>cfg).href) {
                    this._parseStr((<URL>cfg).href);
                } else if (cfg) {
                    let uri = <URIData>cfg;
                    this.scheme(uri.scheme ? uri.scheme : 'http');
                    this.user(uri.user);
                    this.password(uri.password);
                    this.host(uri.host);
                    this.port(Y.isDefined(uri.port) ? uri.port : 80);
                    this.path(uri.path);
                    this._params = uri.params;
                    this.fragment(uri.fragment);
                }
            }

            private _parseStr(uri: string) {
                let array = _URI_REG.exec(uri);
                if (!array) throw new URIError('An invalid URI: ' + uri);

                this._scheme = array[2];
                this._frag = array[9];

                let auth = array[4];
                if (auth) {
                    let authArr = _AUTH_REG.exec(auth);
                    if (!authArr) throw new URIError('An invalid auth part of URI: ' + uri);

                    if (authArr[2]) this._user = authArr[2];
                    if (authArr[4]) this._pwd = authArr[4];
                    if (authArr[5]) this._host = authArr[5];
                    if (Y.isDefined(authArr[7])) this._port = parseInt(authArr[7]);
                }

                let path = array[5];
                if (path && path != '/') {
                    if (!this.isAbsolute() && path.startsWith('/') && !uri.startsWith('/')) path = path.slice(1);
                    this.path(path);
                }

                let query = array[7];
                if (query) this._params = URI.parseQueryString(query);
            }

            /**
             * Returns username+password of the URI.<br>
             * The format is: {username:password}.<br>
             * 返回用户信息，格式如下：{username:password}。
             */
            public userinfo(): string {
                return this._user ? this._user + (this._pwd ? (':' + this._pwd) : '') : '';
            }

            /**
             * Returns fragment of the URI.<br>
             * 返回URI的标签部分。
             */
            public fragment(): string
            /**
             * Sets fragment of the URI.<br>
             * 设置URI的标签部分。
             */
            public fragment(str: string): this
            public fragment(str?: string): any {
                if (arguments.length == 0) return this._frag;
                this._frag = str || '';
                return this;
            }

            /**
             * Returns query string of the URI.<br>
             * 返回URI的查询字符串。
             */
            public queryString(): string
            /**
             * Sets query string of the URI.<br>
             * 设置URI的查询字符串。
             */
            public queryString(str: string): this
            public queryString(str?: string): any {
                if (arguments.length == 0) {
                    if (!this._params) return null;

                    let query = '';
                    J.forEach(this._params, (v, k) => {
                        query += `${query ? '&' : ''}${k}=${v}`;
                    })
                    return query;
                }
                this._params = URI.parseQueryString(str);
                return this;
            }

            /**
             * Returns path of the URI.<br>
             * 返回URI的路径字符串。
             */
            public path(): string
            /**
             * Sets path of the URI.<br>
             * 设置URI的路径部分。
             */
            public path(str: string): this
            public path(str?: string): any {
                if (arguments.length == 0) return this._path;
                this._path = str || null;
                return this;
            }

            /**
             * Returns port of the URI.<br>
             * 返回URI的端口。
             */
            public port(): number
            /**
             * Sets port of the URI.<br>
             * 设置URI的端口。
             */
            public port(port: number): this
            public port(port?: number): any {
                if (arguments.length == 0) return this._port;
                this._port = port;
                return this;
            }

            /**
             * Returns host of the URI.<br>
             * 返回URI的主机。
             */
            public host(): string
            /**
             * Sets host of the URI.<br>
             * 设置URI的主机部分。
             */
            public host(str: string): this
            public host(str?: string): any {
                if (arguments.length == 0) return this._host;
                this._host = str || '';
                return this;
            }

            /**
             * Returns user name of the URI.<br>
             * 返回URI的用户名。
             */
            public user(): string
            /**
             * Sets user name of the URI.<br>
             * 设置URI的用户名。
             */
            public user(str: string): this
            public user(str?: string): any {
                if (arguments.length == 0) return this._user;
                this._user = str || '';
                return this;
            }

            /**
             * Returns password of the URI.<br>
             * 返回URI的密码。
             */
            public password(): string
            /**
             * Sets password of the URI.<br>
             * 设置URI的密码。
             */
            public password(str: string): this
            public password(str?: string): any {
                if (arguments.length == 0) return this._pwd;
                this._pwd = str || '';
                return this;
            }

            /**
             * Returns scheme of the URI.<br>
             * 返回URI的协议。
             */
            public scheme(): string
            /**
             * Sets scheme of the URI.<br>
             * 设置URI的协议。
             */
            public scheme(str: string): this
            public scheme(str?: string): any {
                if (arguments.length == 0) return this._scheme;
                this._scheme = str || '';
                return this;
            }

            /**
             * Returns value of a query key.<br>
             * 返回某个键的值。
             */
            public query(key: string): string
            /**
             * Sets value of a query key.<br>
             * 设置某个键的值。
             */
            public query(key: string, value: string, encode?: boolean): this
            public query(key: string, value?: string, encode?: boolean): any {
                if (!this._params) this._params = {};

                if (arguments.length > 1) {
                    value = value || '';
                    this._params[key] = encode ? encodeURIComponent(value) : value;
                    return this;
                }
                return decodeURIComponent(this._params[key]);
            }

            /**
             * Returns json data of all query keys.<br>
             * 返回所有的键值JSON。
             */
            public queryObject(): JsonObject<string>
            /**
             * Sets values of input query keys.<br>
             * 设置输入的键值。
             */
            public queryObject(params: JsonObject<string>, encode?: boolean): this
            public queryObject(params?: JsonObject<string>, encode?: boolean): any {
                if (arguments.length == 0) return this._params;

                J.forEach(params, (value: string, key: string) => {
                    this.query(key, value, encode);
                })
                return this;
            }

            /**
             * Returns true if the URL has host.<br>
             * 如果有主机地址则是绝对地址，否则是相对地址。
             */
            public isAbsolute(): boolean {
                return this._host ? true : false;
            }
            /**
             * Returns an absolute URI string.<br>
             * 返回绝对地址。
             */
            public toAbsolute(): string {
                let userinfo = this.userinfo(),
                    port = Y.isDefined(this._port) ? ':' + this._port : '',
                    path = this.path() || '',
                    query = this.queryString() || '',
                    fragment = this._frag ? '#' + this._frag : '';

                path = path + (!query && !fragment ? '' : '?' + query + fragment);
                return (this._scheme || 'http') + '://' + (userinfo ? userinfo + '@' : '') + (this._host || '') + port + (!path || path.startsWith('/') ? path: ('/' + path));
            }
            /**
             * Returns a relative URI string.<br>
             * 返回相对地址。
             */
            public toRelative(): string {
                let query = this.queryString() || '', fragment = this._frag ? '#' + this._frag : '';
                return (this._path || '') + (!query && !fragment ? '' : '?' + query + fragment);
            }

            /**
             * Returns absolute of relative string of the URI according to whether it has host.<br>
             * 依据其是否有主机地址，返回绝对或相对地址
             */
            public toString() {
                return this.isAbsolute() ? this.toAbsolute() : this.toRelative();
            }

            /**
             * Returns the absolute dir of current URL.<br>
             * 返回当前URL的绝对目录。
             */
            public static getAbsoluteDir(){//不用解析location.href，更安全可靠
                if(_ADU) return _ADU;
                var div = document.createElement('div');
                div.innerHTML = '<a href="./"></a>';
                _ADU = div.firstChild['href'];
                div = null;
                return _ADU
            }
            /**
             * Convert an URL to absolute URL according to the current page address.<br>
             * 无论是相对地址还是绝对地址，都按照当前页面地址转换为绝对地址。
             */
            public static toAbsoluteURL(url:string){
                if(url.startsWith('http://') || url.startsWith('https://')) return url;

                let loc = self.location;
                if(url.startsWith('/')) return loc.origin + url;

                let p = loc.pathname||'/';
                if(p) p = p.slice(0,p.lastIndexOf('/')+1);
                return this.getAbsoluteDir()+url
            }

            public static toQueryString(json: JsonObject<string>, encode?:boolean): QueryString {
                if(!json) return '';

                let q = '';
                J.forEach(<JsonObject>json, (v, k) => {
                    q += `&${k}=${encode?encodeURIComponent(v):v}`;
                })
                return q
            }
            public static parseQueryString(query: QueryString, decode?:boolean): JsonObject<string> {
                if (Check.isEmpty(query)) return {};

                let q = (<string>query).startsWith('?') ? (<string>query).slice(1) : <string>query,
                ps: JsonObject<string> = {},
                arr = q.split('&');
                arr.forEach(function (v: string) {
                    if (v) {
                        let kv = v.split('=');
                        ps[kv[0]] = decode?decodeURIComponent(kv[1]):kv[1];
                    }
                })
                return ps;
            }

        }

    }

}
import URI = JS.util.URI;
import URLString = JS.util.URLString;
import QueryString = JS.util.QueryString;