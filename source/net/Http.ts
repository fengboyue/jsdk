/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../core/Promises.ts" /> 
/// <reference path="../util/Types.ts" /> 
/// <reference path="../util/Jsons.ts" /> 
/// <reference path="MIME.ts" /> 

module JS {

    export namespace net {

        export type HttpResponseType = 'xml' | 'html' | 'json' | 'text' | 'arraybuffer' | 'blob';

        export interface HttpRequest {
            /**
             * Send in a new webwork thread.
             */
            thread?: boolean | ThreadPreload;

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
             * You can pass false to tell Http to not set any content type header. Note: The W3C
             * XMLHttpRequest specification dictates that the charset is always UTF-8; specifying another charset
             * will not force the browser to change the encoding. Note: For cross-domain requests, setting the
             * content type to anything other than application/x-www-form-urlencoded, multipart/form-data, or
             * text/plain will trigger the browser to send a preflight OPTIONS request to the server.
             */
            requestMime?: string | false;

            /**
             * An object containing type converters. Each parser's value is a function that
             * returns the filtered response data of the type, will be replaced a default inner-parser.
             */
            converts?: {
                html?: <T>(data: HTMLDocument) => T,
                xml?: <T>(data: XMLDocument) => T,
                text?: <T>(data: string) => T
                json?: <T>(data: JsonObject) => T
                arraybuffer?: <T>(data: ArrayBuffer) => T
                blob?: <T>(data: Blob) => T
            };

            /**
             * Data to be sent to the server. 
             */
            data?: string | JsonObject | FormData | ArrayBuffer | Blob;

            /**
             * A function to be used to pre-handle the raw response data beforing parse the response.
             */
            responseFilter?(raw: any, type: HttpResponseType): any;
            /**
             * "xml": Returns a XML document that can be processed.<br>
             * "html": Returns HTML as plain text; included script tags are evaluated when inserted in the DOM.<br>
             * "json": Evaluates the response as JSON and returns a JavaScript object.<br>
             * "text": A plain text string.
             */
            responseType?: HttpResponseType;

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
             * The XMLHttpRequest method overrideMimeType() specifies a MIME type other than the one provided by the server to be used instead when interpreting the data being transferred in a request. This may be used, for example, to force a stream to be treated and parsed as "text/xml", even if the server does not report it as such.
             */
            overrideResponseMime?: string;

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
             * A function to be called when this request finishes (after success and error callbacks are executed).
             */
            complete?: ((res: HttpResponse) => void);
            /**
             * A function to be called if this request succeeds. 
             */
            success?: ((res: HttpResponse) => void);
            /**
             * A function to be called if this request fails.
             */
            error?: ((res: HttpResponse) => void);
            /**
             * A function to be called if this request progress.
             */
            progress?: ((e: ProgressEvent, xhr: XMLHttpRequest) => void);
        }

        export interface HttpResponse {
            request: HttpRequest,
            type: HttpResponseType,
            raw: any,
            data: any,
            status: number,
            statusText: 'timeout' | 'abort' | 'parseerror' | 'nocontent' | 'notmodified' | string,
            headers: JsonObject<string>,
            xhr: XMLHttpRequest
        }

        export type HttpResponseConvert<INPUT, OUTPUT> = (data: INPUT, res: HttpResponse) => OUTPUT

        let Y = Types, J = Jsons,
            _judgeType = (t: string, dt: HttpResponseType): HttpResponseType => {
                if (MIME.text == t) return 'text';
                if (MIME.html = t) return 'html';
                if (MIME.xml == t) return 'xml';
                if (MIME.json.indexOf(t) > -1) return 'json';
                return dt;
            },
            _headers = (xhr: XMLHttpRequest) => {
                let headers = {}, hString = xhr.getAllResponseHeaders(),
                    hRegexp = /([^\s]*?):[ \t]*([^\r\n]*)/mg,
                    match = null;
                while ((match = hRegexp.exec(hString))) {
                    headers[match[1]] = match[2];
                }
                return headers
            },
            _response = (req: HttpRequest, xhr: XMLHttpRequest, error?: 'timeout' | 'abort' | 'error') => {
                let type = req.responseType, headers = _headers(xhr);
                //根据服务器返回的contentType自动推断type
                if (!type && xhr.status > 0) type = _judgeType(headers['Content-Type'], type);
                return <HttpResponse>{
                    request: req,
                    url: xhr.responseURL,
                    raw: xhr.response,
                    type: type,
                    data: xhr.response,
                    status: xhr.status,
                    statusText: error || (xhr.status == 0 ? 'error' : xhr.statusText),
                    headers: headers,
                    xhr: xhr
                }
            },
           
            _parseResponse = function (this: PromiseContext<any>, res: HttpResponse, req: HttpRequest, xhr: XMLHttpRequest): any {
                try {
                    let raw = req.responseType == 'xml' ? xhr.responseXML : xhr.response, cvt: Function = req.converts && req.converts[res.type];
                    if (req.responseFilter) raw = req.responseFilter(raw, res.type);
                    res.data = cvt ? cvt(raw, res) : raw;
                } catch (e) {
                    res.statusText = 'parseerror';
                    if (req.error) req.error(res);
                    if (Http._ON['error']) Http._ON['error'](res);
                    this.reject(res);
                }
            },
            _error = function (this: PromiseContext<any>, req: HttpRequest, xhr: XMLHttpRequest, error: 'timeout' | 'abort' | 'error') {
                let res = _response(req, xhr, error);
                if (req.error) req.error(res);
                if (Http._ON['error']) Http._ON['error'](res);
                this.reject(res)
            },

            CACHE = {
                lastModified: {},
                etag: {}
            },
            _done = function (this: PromiseContext<HttpResponse>, oURL: string, req: HttpRequest, xhr: XMLHttpRequest) {
                if (xhr['_isTimeout']) return;//已超时不处理

                let status = xhr.status, isSucc = status >= 200 && status < 300 || status === 304,
                    res: HttpResponse = _response(req, xhr);

                if (isSucc) {
                    //cache modified
                    let modified = null;
                    if (req.ifModified) {
                        modified = xhr.getResponseHeader('Last-Modified');
                        if (modified) CACHE.lastModified[oURL] = modified;
                        modified = xhr.getResponseHeader('etag');
                        if (modified) CACHE.etag[oURL] = modified;
                    }

                    // if no content
                    if (status === 204 || req.method === "HEAD") {
                        res.statusText = 'nocontent'
                        // if not modified
                    } else if (status === 304) {
                        res.statusText = 'notmodified'
                    }

                    //成功才解析返回数据
                    _parseResponse.call(this, res, req, xhr);
                }

                if (req.complete) req.complete(res);
                if (Http._ON['complete']) Http._ON['complete'](res);

                if (isSucc) {
                    if (req.success) req.success(res);
                    if (Http._ON['success']) Http._ON['success'](res);
                    this.resolve(res)
                } else this.reject(res)
            },

            _queryString = function (data: string | JsonObject | ArrayBuffer | Blob) {
                if (Y.isString(data)) {
                    return encodeURI(<string>data)
                } else if (Y.isJsonObject(data)) {
                    let str = '';
                    J.forEach(<JsonObject>data, (v, k) => {
                        str += `&${k}=${encodeURIComponent(v)}`;
                    })
                    return str;
                }
                return ''
            },
            _queryURL = (req: HttpRequest) => {
                let url = req.url.replace(/^\/\//, location.protocol + '//');
                if (!Check.isEmpty(req.data)) url = `${url}${url.indexOf('?') < 0 ? '?' : ''}${_queryString(req.data)}`;
                return url
            },
            _finalURL = (url: string, cache: boolean) => {
                //uncached url
                url = url.replace(/([?&])_=[^&]*/, '$1');
                if (!cache) url = `${url}${url.indexOf('?') < 0 ? '?' : '&'}_=${Date.now()}`;
                return url
            },
            /**
             * 注意：从Gecko 30.0 (Firefox 30.0 / Thunderbird 30.0 / SeaMonkey 2.27)，Blink 39.0和Edge 13开始，
             * 主线程上的同步请求由于对用户体验的负面影响而被弃用。
             * 同步XHR通常会导致网络挂起。但开发人员通常不会注意到这个问题，因为在网络状况不佳或服务器响应速度慢的情况下，
             * 挂起只会显示同步XHR现在处于弃用状态。建议开发人员远离这个API。
             * 同步XHR不允许所有新的XHR功能（如timeout或abort）。这样做会调用InvalidAccessError。
             */
            _send = function (this: PromiseContext<HttpResponse>, req: HttpRequest) {
                if (!req.url) JSLogger.error('Sent an ajax request without URL.')

                req = <HttpRequest>J.union(<HttpRequest>{
                    method: 'GET',
                    crossCookie: false,
                    async: true,
                    responseType: 'text',
                    cache: true
                }, req);

                let xhr: XMLHttpRequest = new XMLHttpRequest(),
                    oURL = _queryURL(req), url = _finalURL(oURL, req.cache),
                    reqType = req.requestMime, resType = req.responseType,
                    headers = req.headers || {};
                if (!reqType && (Y.isString(req.data) || Y.isJsonObject(req.data))) reqType = 'application/x-www-form-urlencoded;charset=UTF-8';

                xhr.open(req.method, url, req.async, req.username, req.password);

                //Accept header
                xhr.setRequestHeader('Accept', resType && MIME[resType] ? MIME[resType] + ',*/*;q=0.01' : '*/*');
                //Request mime type 
                if (reqType) xhr.setRequestHeader('Content-Type', reqType);
                // For same-domain requests, won't change header if already provided.
                if (!headers['X-Requested-With']) headers['X-Requested-With'] = "XMLHttpRequest";

                // The XMLHttpRequest method overrideMimeType() specifies a MIME type other than the one provided by the server to be used instead when interpreting the data being transferred in a request.
                if (req.overrideResponseMime && xhr.overrideMimeType) xhr.overrideMimeType(req.overrideResponseMime);

                // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
                if (req.ifModified) {
                    if (CACHE.lastModified[oURL]) xhr.setRequestHeader('If-Modified-Since', CACHE.lastModified[oURL]);
                    if (CACHE.etag[oURL]) xhr.setRequestHeader('If-None-Match', CACHE.etag[oURL]);
                }

                // Set headers
                for (let h in headers) xhr.setRequestHeader(h, headers[h]);

                if (req.progress) xhr.onprogress = function (e) { req.progress(e, xhr) };
                xhr.onerror = (e) => {
                    _error.call(this, req, xhr, 'error')
                };
                xhr.withCredentials = req.crossCookie;

                //改造abort函数
                let oAbort = xhr.abort;
                xhr.abort = function () {
                    _error.call(this, req, xhr, xhr['_isTimeout'] ? 'timeout' : 'abort');
                    oAbort.call(this)
                }

                if (req.async) {
                    //同步下不可以设置responseType,否则浏览器抛出异常    
                    xhr.responseType = (resType == 'html' || resType == 'xml') ? 'document' : resType;

                    xhr.timeout = req.timeout || 0;
                    xhr.ontimeout = () => {
                        _error.call(this, req, xhr, 'timeout')
                    };
                    xhr.onreadystatechange = () => {
                        //4 is DONE, compatible with IE
                        if (xhr.readyState == 4 && xhr.status > 0) _done.call(this, oURL, req, xhr)
                    }
                }

                //如果请求方法是 GET 或者 HEAD，则应将请求主体设置为 null
                let data = null;
                if (req.method != 'HEAD' && req.method != 'GET') {
                    data = Y.isJsonObject(req.data) ? J.stringify(req.data) : req.data;
                }

                try {
                    //早期浏览器的timeout是无效，自己实现超时取消
                    if (req.async && req.timeout > 0) {
                        var timer = self.setTimeout(function () {
                            xhr['_isTimeout'] = true;
                            xhr.abort();
                            self.clearTimeout(timer);
                        }, req.timeout);
                    }
                    xhr['timestamp'] = new Date().getTime();//记录发送的时间戳，可能在进度回调时调用
                    xhr.send(data);
                } catch (e) {
                    _error.call(this, req, xhr, 'error')
                }

                if (!req.async && xhr.status > 0) _done.call(this, oURL, req, xhr);
            }

        /**
         * HTTP类
         */
        export class Http {

            public static toRequest(quy: string | HttpRequest): HttpRequest {
                return Y.isString(quy) ? <HttpRequest>{ url: <string>quy } : <HttpRequest>quy;
            }

            /**
             * Send an ajax request.
             */
            static send(req: HttpRequest | URLString) {
                let q = this.toRequest(req);
                return q.thread ? this._inThread(req) : this._inMain(req)
            }

            /**
             * Send an ajax request in main thread.
             */
            private static _inMain(req: HttpRequest | URLString) {
                return Promises.create<HttpResponse>(function () {
                    _send.call(this, req)
                })
            }
            /**
             * Send a GET request.
             */
            static get(req: HttpRequest | URLString) {
                let r: HttpRequest = this.toRequest(req);
                r.method = 'GET';
                return this.send(r)
            }
            /**
             * Send a POST request.
             */
            static post(req: HttpRequest | URLString) {
                let r: HttpRequest = this.toRequest(req);
                r.method = 'POST';
                return this.send(r)
            }

            /**
             * Upload a file blob.
             */
            static upload(file: { data: Blob, postName?: string, fileName?: string } | FormData, url: URLString) {
                let fm: FormData;

                if (file instanceof FormData) {
                    fm = file;
                } else {
                    fm = new FormData();
                    fm.append(file.postName || 'file', file.data, file.fileName);
                }

                return this.send({
                    url: url,
                    method: 'POST',
                    data: fm,
                    requestMime: 'multipart/form-data'
                })
            }

            static _ON: JsonObject<(res: HttpResponse) => void> = {};

            /**
             * A function to be called when any request finishes (after success and error callbacks are executed).
             */
            static on(ev: 'complete', fn: (res: HttpResponse) => void)
            /**
             * A function to be called if any request succeeds. 
             */
            static on(ev: 'success', fn: (res: HttpResponse) => void)
            /**
             * A function to be called if any request fails.
             */
            static on(ev: 'error', fn: (res: HttpResponse) => void)
            static on(ev: string, fn: (res: HttpResponse) => void) {
                this._ON[ev] = fn
            }

            /**
             * Allows data to be sent asynchronously to a server with navigator.sendBeacon, even after a page was closed. 
             * Useful for posting analytics data the moment a user was finished using the page.
             */
            static sendBeacon(e: 'beforeunload' | 'unload', fn: (evt: Event) => void, scope?: any) {
                window.addEventListener('unload', scope ? fn : function (e) { fn.call(scope, e) }, false);
            }

            /**
             * Send an ajax request in a new webwork.
             */
            private static _inThread(req: HttpRequest | URLString) {
                let r: HttpRequest = this.toRequest(req);
                r.url = URI.toAbsoluteURL(r.url);
                return Promises.create<HttpResponse>(function () {
                    let ctx = this;
                    new Thread({
                        run: function () {
                            this.onposted((request) => {
                                (<any>self).Http._inMain(request).then((res) => {
                                    delete res.xhr;
                                    this.postMain(res);
                                })
                            })
                        }
                    }, typeof r.thread === 'boolean' ? null : r.thread).on('message', function (e, res: HttpResponse) {
                        ctx.resolve(res);
                        this.terminate();
                    }).start().postThread(r);
                })
            }

        }
    }

}
import Http = JS.net.Http;
import HttpRequest = JS.net.HttpRequest;
import HttpResponse = JS.net.HttpResponse;