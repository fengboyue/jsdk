/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="Promises.ts" /> 

module JS {

    export namespace util {

        export interface AjaxRequest {
            /**
             * Send in a new webwork thread.
             */
            thread?:boolean|ThreadPreload;

            /**
             * An URL string for ajax request.
             */
            url: string;

            /**
             * By default, all requests are sent asynchronously (i.e. this is set to true by default). 
             */
            async?: boolean;
            /**
             * If set to false, it will force requested pages not to be cached by the browser. Note: Setting cache
             * to false will only work correctly with HEAD and GET requests. It works by appending "_={timestamp}"
             * to the GET parameters. The parameter is not needed for other types of requests, except in IE8 when a
             * POST is made to a URL that has already been requested by a GET.
             */
            cache?: boolean;
            /**
             * When sending data to the server, use this content type. Default is
             * "application/x-www-form-urlencoded; charset=UTF-8", which is fine for most cases. If you explicitly
             * pass in a content-type to $.ajax(), then it is always sent to the server (even if no data is sent).
             * You can pass false to tell Ajax to not set any content type header. Note: The W3C
             * XMLHttpRequest specification dictates that the charset is always UTF-8; specifying another charset
             * will not force the browser to change the encoding. Note: For cross-domain requests, setting the
             * content type to anything other than application/x-www-form-urlencoded, multipart/form-data, or
             * text/plain will trigger the browser to send a preflight OPTIONS request to the server.
             */
            contentType?: string | false;

            /**
             * An object containing type converters. Each parser's value is a function that
             * returns the filtered response data of the type, will be replaced a default inner-parser.
             */
            parsers?: {
                html?: (data: string) => Document,
                xml?: (data: string) => XMLDocument,
                json?: (data: string) => JsonObject,
                text?: (data: string) => string
            };

            /**
             * Data to be sent to the server. 
             */
            data?: JsonObject | string;
            
            /**
             * A function to be used to handle the raw response data. This is a pre-filtering
             * function to parse the response. You should return the sanitized data.
             */
            responseFilter?(data: string, type: 'xml' | 'html' | 'json' | 'text'): string;
            /**
             * "xml": Returns a XML document that can be processed.<br>
             * "html": Returns HTML as plain text; included script tags are evaluated when inserted in the DOM.<br>
             * "json": Evaluates the response as JSON and returns a JavaScript object.<br>
             * "text": A plain text string.
             */
            type?: 'xml' | 'html' | 'json' | 'text';

            /**
             * An object of additional header key/value pairs to send along with requests using the XMLHttpRequest
             * transport. The header X-Requested-With: XMLHttpRequest is always added, but its default
             * XMLHttpRequest value can be changed here. 
             */
            headers?: JsonObject<string | null | undefined>;
            /**
             * Allow the request to be successful only if the response has changed since the last request. This is
             * done by checking the Last-Modified header. Default value is false, ignoring the header. This technique 
             * also checks the 'etag' specified by the server to catch unmodified data.
             */
            ifModified?: boolean;

            /**
             * The HTTP method to use for the request.
             */
            method?: 'HEAD' | 'GET' | 'POST' | 'OPTIONS' | 'PUT' | 'DELETE';
            /**
             * A mime type to override the XHR mime type.
             */
            mimeType?: string;

            /**
             * A username to be used with XMLHttpRequest in response to an HTTP access authentication request.
             */
            username?: string;
            /**
             * A password to be used with XMLHttpRequest in response to an HTTP access authentication request.
             */
            password?: string;
            /**
             * Set a timeout (in milliseconds) for the request. A value of 0 means there will be no timeout.
             */
            timeout?: number;
            /**
             * True when credentials are to be included in a cross-origin request. False when they are to be excluded in a cross-origin request and when cookies are to be ignored in its response. Initially false.
             */
            crossCookie?: boolean;

            /**
             * Call back before this send.
             */
            onSending?: ((req: AjaxRequest) => boolean | void);
            /**
             * Call back after this send when it would be successful.
             */
            onCompleted?: ((res: AjaxResponse) => void);
            /**
             * Call back after this send when it would be failed.
             */
            onError?: ((res: AjaxResponse) => void);
        }

        export interface AjaxResponse {
            request: AjaxRequest,
            url: string,
            raw: any,
            type: 'xml' | 'html' | 'json' | 'text',
            data: any,
            status: number,
            statusText: 'cancel' | 'timeout' | 'abort' | 'parseerror' | 'nocontent' | 'notmodified' | string,
            headers: JsonObject<string>,
            xhr: XMLHttpRequest
        }

        let ACCEPTS = {
                '*': '*/*',
                text: 'text/plain',
                html: 'text/html',
                xml: 'application/xml, text/xml',
                json: 'application/json, text/javascript',
                script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
            },

            _judgeType = (cType: string): string => {
                if (!cType) return 'json';//缺省为json

                if (cType == ACCEPTS['text']) return 'text';
                if (cType == ACCEPTS['html']) return 'html';
                if (cType.indexOf('/xml') > 0) return 'xml';
                return 'json';
            },

            PARSERS = {
                html: (str): Document => {
                    if (!str) return null;
                    return new DOMParser().parseFromString(str, 'text/html')
                },
                xml: (str): XMLDocument => {
                    if (!str) return null;
                    let xml = new DOMParser().parseFromString(str, 'text/xml');
                    if (!xml || xml.getElementsByTagName("parsererror").length) throw new NotHandledError();
                    return xml
                },
                json: (str): JsonObject => {
                    return Jsons.parse(str)
                },
                text: (str): string => {
                    return str
                }
            },
            _headers = function (xhr: XMLHttpRequest) {
                let headers = {}, hString = xhr.getAllResponseHeaders(),
                    hRegexp = /([^\s]*?):[ \t]*([^\r\n]*)/mg,
                    match = null;
                while ((match = hRegexp.exec(hString))) {
                    headers[match[1]] = match[2];
                }
                return headers
            },
            _response = function (req: AjaxRequest, xhr: XMLHttpRequest, error?: 'cancel' | 'timeout' | 'abort' | 'error') {
                let type = req.type, headers = _headers(xhr);
                //根据服务器返回的contentType自动推断type
                if (!type && xhr.status > 0) type = <any>_judgeType(headers['Content-Type']);
                return <AjaxResponse>{
                    request: req,
                    url: xhr.responseURL,
                    raw: xhr.response,
                    type: req.type,
                    data: null,
                    status: xhr.status,
                    statusText: error || (xhr.status == 0 ? 'error' : xhr.statusText),
                    headers: headers,
                    xhr: xhr
                }
            },
            _parseResponse = function (this: PromiseContext<any>, res: AjaxResponse, req: AjaxRequest, xhr: XMLHttpRequest): any {
                try {
                    let raw = xhr.response, parser = req.parsers && req.parsers[res.type] || PARSERS[res.type];
                    if (req.responseFilter) raw = req.responseFilter(raw, res.type);
                    res.data = parser(raw)
                } catch (e) {
                    res.statusText = 'parseerror';
                    if (req.onError) req.onError(res);
                    if (Ajax._ON['error']) Ajax._ON['error'](res);
                    this.reject(res);
                }
            },
            _rejectError = function (this: PromiseContext<any>, req: AjaxRequest, xhr: XMLHttpRequest, error: 'cancel' | 'timeout' | 'abort' | 'error') {
                let res = _response(req, xhr, error);
                if (req.onError) req.onError(res);
                if (Ajax._ON['error']) Ajax._ON['error'](res);
                this.reject(res)
            },

            CACHE = {
                lastModified: {},
                etag: {}
            },
            _done = function (this: PromiseContext<AjaxResponse>, uncacheURL: string, req: AjaxRequest, xhr: XMLHttpRequest) {
                if (xhr['_isTimeout']) return;//已超时不处理

                let status = xhr.status, res: AjaxResponse = _response(req, xhr);
                if (req.onCompleted) req.onCompleted(res);
                if (Ajax._ON['completed']) Ajax._ON['completed'](res);

                if (status >= 200 && status < 300 || status === 304) {
                    //cache modified
                    let modified = null;
                    if (req.ifModified) {
                        modified = xhr.getResponseHeader('Last-Modified');
                        if (modified) CACHE.lastModified[uncacheURL] = modified;
                        modified = xhr.getResponseHeader('etag');
                        if (modified) CACHE.etag[uncacheURL] = modified;
                    }

                    // if no content
                    if (status === 204 || req.method === "HEAD") {
                        res.statusText = 'nocontent'
                        // if not modified
                    } else if (status === 304) {
                        res.statusText = 'notmodified'
                    }

                    _parseResponse.call(this, res, req, xhr);
                    this.resolve(res)
                } else {
                    this.reject(res)
                }
            },

            _queryString = function (data: string|JsonObject) {
                if (Types.isString(data)) return encodeURI(<string>data);

                let str = '';
                Jsons.forEach(<JsonObject>data, (v, k) => {
                    str += `&${k}=${encodeURIComponent(v)}`;
                })
                return str;
            },
            _queryURL = (req: AjaxRequest) => {
                let url = req.url.replace(/^\/\//, location.protocol + '//');
                if (!Check.isEmpty(req.data)) url = `${url}${url.indexOf('?') < 0 ? '?' : ''}${_queryString(req.data)}`;
                return url
            },
            _uncacheURL = (url: string, cache: boolean) => {
                //uncached url
                url = url.replace(/([?&])_=[^&]*/, '$1');
                if (!cache) url = `${url}${url.indexOf('?') < 0 ? '?' : '&'}_=${new Date().getTime()}`;
                return url
            },

            _sending = function (fn, req) {
                if (fn) {
                    if (fn(req) === false) return false//cancel send
                }
                return true
            },
            /**
             * 注意：从Gecko 30.0 (Firefox 30.0 / Thunderbird 30.0 / SeaMonkey 2.27)，Blink 39.0和Edge 13开始，
             * 主线程上的同步请求由于对用户体验的负面影响而被弃用。
             * 同步XHR通常会导致网络挂起。但开发人员通常不会注意到这个问题，因为在网络状况不佳或服务器响应速度慢的情况下，
             * 挂起只会显示同步XHR现在处于弃用状态。建议开发人员远离这个API。
             * 同步XHR不允许所有新的XHR功能（如timeout或abort）。这样做会调用InvalidAccessError。
             */
            _send = function (this: PromiseContext<AjaxResponse>, request: AjaxRequest | URLString) {
                let req: AjaxRequest = Types.isString(request) ? { url: <URLString>request } : <AjaxRequest>request;
                if (!req.url) JSLogger.error('Sent an ajax request without URL.')

                req = <AjaxRequest>Jsons.union(<AjaxRequest>{
                    method: 'GET',
                    crossCookie: false,
                    async: true,
                    type: 'text',
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    cache: true
                }, req);

                let xhr: XMLHttpRequest = (<any>self).XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'),
                    queryURL = _queryURL(req), url = _uncacheURL(queryURL, req.cache),
                    headers = req.headers || {};
                xhr.open(req.method, url, req.async, req.username, req.password);

                //Accept header
                xhr.setRequestHeader('Accept', req.type && ACCEPTS[req.type] ? ACCEPTS[req.type] + ',' + ACCEPTS['*'] + ';q=0.01' : ACCEPTS['*']);

                if (req.data && req.contentType) xhr.setRequestHeader('Content-Type', req.contentType);
                // For same-domain requests, won't change header if already provided.
                if (!headers['X-Requested-With']) headers['X-Requested-With'] = "XMLHttpRequest";

                // Override mime type returns by server
                if (req.mimeType && xhr.overrideMimeType) xhr.overrideMimeType(req.mimeType);

                // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
                if (req.ifModified) {
                    if (CACHE.lastModified[queryURL]) xhr.setRequestHeader('If-Modified-Since', CACHE.lastModified[queryURL]);
                    if (CACHE.etag[queryURL]) xhr.setRequestHeader('If-None-Match', CACHE.etag[queryURL]);
                }

                // Set headers
                for (let h in headers) xhr.setRequestHeader(h, headers[h]);

                xhr.onerror = (e) => {
                    _rejectError.call(this, req, xhr, 'error')
                };
                xhr.onabort = () => { _rejectError.call(this, req, xhr, xhr['_isTimeout'] ? 'timeout' : 'abort') };
                xhr.withCredentials = req.crossCookie;

                if (req.async) {
                    xhr.timeout = req.timeout || 0;
                    xhr.ontimeout = () => {
                        _rejectError.call(this, req, xhr, 'timeout')
                    };
                    xhr.onreadystatechange = () => {
                        //4 is DONE, used for compatible with IE
                        if (xhr.readyState == 4 && xhr.status > 0) _done.call(this, queryURL, req, xhr)
                    }
                }

                //sending
                let rst = _sending(Ajax._ON['sending'], req);
                if (rst === false) {
                    _rejectError.call(this, req, xhr, 'cancel');
                    return//cancel send
                }
                rst = _sending(req.onSending, req);
                if (rst === false) {
                    _rejectError.call(this, req, xhr, 'cancel');
                    return//cancel send
                }

                if (req.async) xhr.responseType = 'text';//The response type cannot be changed for synchronous requests made from a document.
                //如果请求方法是 GET 或者 HEAD，则应将请求主体设置为 null
                let data = req.method == 'HEAD' || req.method == 'GET' ? null : (Types.isString(req.data) ? <string>req.data : Jsons.stringify(req.data))
                try {
                    //早期浏览器的timeout是无效，自己实现超时取消
                    if (req.async && req.timeout > 0) {
                        var timer = self.setTimeout(function () {
                            xhr['_isTimeout'] = true;
                            xhr.abort();
                            self.clearTimeout(timer);
                        }, req.timeout);
                    }
                    xhr.send(data);
                } catch (e) {
                    _rejectError.call(this, req, xhr, 'error')
                }

                if (!req.async && xhr.status > 0) _done.call(this, queryURL, req, xhr);
            }
            
        /**
         * HTTP类
         */
        export class Ajax {

            private static _toQuery(q: JsonObject|QueryString): JsonObject{
                if(!q) return {};
                return Types.isString(q)?URI.parseQueryString(<QueryString>q):<JsonObject>q
            }
            public static toRequest(quy: string|AjaxRequest, data?: JsonObject|QueryString):AjaxRequest{
                let req = Types.isString(quy)?<AjaxRequest>{url:<string>quy}:<AjaxRequest>quy;
                if(quy && data) req.data = <JsonObject>Jsons.union(this._toQuery(req.data),this._toQuery(data));
                return req
            }

            /**
             * Send an ajax request.
             */
            public static send(req: AjaxRequest | URLString) {
                let q = this.toRequest(req);
                return q.thread?this._inThread(req):this._inMain(req)
            }

            /**
             * Send an ajax request in main thread.
             */
            private static _inMain(req: AjaxRequest | URLString) {
                return Promises.create<AjaxResponse>(function () {
                    _send.call(this, req)
                })
            }
            /**
             * Send a GET request in main thread.
             */
            public static get(req: AjaxRequest | URLString) {
                let r: AjaxRequest = Types.isString(req) ? { url: <URLString>req } : <AjaxRequest>req;
                r.method = 'GET'
                return this.send(r)
            }
            /**
             * Send a POST request in main thread.
             */
            public static post(req: AjaxRequest | URLString) {
                let r: AjaxRequest = Types.isString(req) ? { url: <URLString>req } : <AjaxRequest>req;
                r.method = 'POST'
                return this.send(r)
            }

            public static _ON = {};
            /**
             * Call back before every request sending.
             */
            public static on(ev: 'sending', fn: (req: AjaxRequest) => boolean | void)
            /**
             * Call back after every request sending when it would be successful.
             */
            public static on(ev: 'completed', fn: (res: AjaxResponse) => void)
            /**
             * Call back after this request sending when it would be failed.
             */
            public static on(ev: 'error', fn: (res: AjaxResponse) => void)
            public static on(ev: string, fn: Function) {
                this._ON[ev] = fn
            }

            /**
             * Allows data to be sent asynchronously to a server with navigator.sendBeacon, even after a page was closed. 
             * Useful for posting analytics data the moment a user was finished using the page.
             */
            public static sendBeacon(e: 'beforeunload' | 'unload', fn: (evt: Event) => void, scope?: any) {
                window.addEventListener('unload', scope ? fn : function (e) { fn.call(scope, e) }, false);
            }

            /**
             * Send an ajax request in a new webwork.
             */
            private static _inThread(req: AjaxRequest | URLString) {
                let r:AjaxRequest = this.toRequest(req);
                r.url = URI.toAbsoluteURL(r.url);
                return Promises.create<AjaxResponse>(function(){
                    let ctx = this;
                    new Thread({
                        run:function(){
                            this.onposted((request)=>{
                                (<any>self).Ajax._inMain(request).then((res)=>{
                                    delete res.xhr;
                                    this.postMain(res);
                                })
                            })
                        }
                    }, typeof r.thread === 'boolean'?null:r.thread).on('message',function(e, res: AjaxResponse){
                        ctx.resolve(res);
                        this.terminate();
                    }).start().postThread(r);
                })
            }

        }
    }

}
import Ajax = JS.util.Ajax;
import AjaxRequest = JS.util.AjaxRequest;
import AjaxResponse = JS.util.AjaxResponse;