/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @author Frank.Feng
 * @email boyue.feng@foxmail.com
 * 
 * @version 2.5.0
 * @date 2020/8/20
 * @update Milestone for new jsmath and jsugar
 *
 * @version 2.4.0
 * @date 2020/7/27
 * @update Support drag and tap events for mobile browser
 *
 * @version 2.3.1
 * @date 2020/7/25
 * 
 * @version 2.3.0
 * @date 2020/7/19
 * @update New media module for audio and video
 *
 * @version 2.2.0
 * @date 2020/7/12
 * @update New input module for keyboard, mouse and touch events 
 * 
 * @version 2.1.1
 * @date 2020/7/11
 * @update Bugfix for Number.foramt method on WeChat mobile browser
 * 
 * @version 2.1.0
 * @date 2020/7/1
 * @update New animation module
 * 
 * @version 2.0.0
 * @date 2018/1/8 - 2020/6/12
 * @update All-new Milestone Version in TS language
 * 
 * ***************************************** OLD VERSION *********************************************
 * @version 1.0.0
 * @date 2012/12/19
 * @update New independent kernel and stronger loader for loading multiple-version libs in the meantime but not released finally
 * 
 * @version 0.6.2
 * @date 2012/5/2
 * @update Enhance and bugfix
 * 
 * @version 0.6.1
 * @date 2012/4/18
 * @update Enhance and bugfix
 * 
 * @version 0.6.0
 * @date 2011/2-2012/4/14
 * @update Milestone version for new game framework: JSGF
 * 
 * @version 0.1
 * @date 2007/8/30
 * @update Trial version for micro-kernel and utils
 * ***************************************** OLD VERSION *********************************************
 */
/// <reference path="../../libs/reflect/2.0.1/Reflect.d.ts" />
/// <reference path="../util/Promises.ts" />
/// <reference path="../util/Dom.ts" />

module JS {

    export let version = '2.5.0';

    export type JSDKConfig = {
        closeImport?: boolean;
        cachedImport?: boolean | string;
        minImport?: boolean;
        jsdkRoot?: string;
        libRoot?: string;
        libs?: JsonObject<string | Array<string>>;
    }

    /**
     * Gets JSDK's global configuration.
     */
    export function config(): JSDKConfig
    /**
     * Sets JSDK's global configuration.
     */
    export function config(opts: JSDKConfig): void
    /**
     * Gets the value of a key in global configuration.
     * @param key 
     */
    export function config<T>(key: keyof JSDKConfig): T
    /**
     * Sets the value of a key in global configuration.
     * @param key 
     * @param val 
     */
    export function config(key: keyof JSDKConfig, val: any): void
    export function config(d?: JSDKConfig | keyof JSDKConfig, v?: any): JSDKConfig | void {
        let l = arguments.length;
        if (l == 0) return _cfg;
        if (!d) return;

        if (typeof d === 'string') {
            if (l == 1) {
                return _cfg[<string>d];
            } else {
                _cfg[<string>d] = v;
                return
            }
        } else {
            for (let k in d) {
                if (d.hasOwnProperty(k)) _cfg[k] = d[k]
            }
        }
    }

    let P = Promises,
        _cfg: JSDKConfig = {},
        _ldd = {},//loaded URLs

        //cached url
        _ts = (uri: string) => {
            let c = <any>JS.config('cachedImport');
            if (c === true) return uri;
            let s: string = '_=' + (c ? <string>c : '' + Date.now());
            return uri.lastIndexOf('?') > 0 ? `${uri}&${s}` : `${uri}?${s}`
        },
        _min = (uri: string, type: 'js' | 'css') => {
            if (JS.config<boolean>('minImport')) {
                if (uri.endsWith('.min.' + type)) return uri;
                if (uri.endsWith('.' + type)) return uri.slice(0, uri.length - type.length - 1) + '.min.' + type;
            } else return uri
        },
        _impLib = (lib: string): (() => Promise<any>) => {
            let async = lib.endsWith('#async'),
                libName = async ? lib.slice(0, lib.length - 6) : lib,
                paths: string | string[] = JS.config('libs')[libName];
            if (paths) {
                let ps: string[] = typeof paths == 'string' ? [paths] : paths, tasks: Array<() => Promise<any>> = [];
                ps.forEach(path => {
                    if (path.startsWith('$')) {
                        tasks.push(_impLib(path.slice(1)))
                    } else {
                        tasks.push(_impFile(path + (async ? '#async' : '')))
                    }
                })
                return P.newPlan(P.order, [tasks])
            } else {
                console.error('Not found the <' + libName + '> library in JSDK settings.');
                return P.resolvePlan(null)
            }
        },
        _impFile = (url: string): (() => Promise<any>) => {
            let u = url;
            if (url.startsWith('!')) {
                let jr = JS.config('jsdkRoot');
                jr = jr ? jr : (JS.config('libRoot') + '/jsdk/' + JS.version);
                u = jr + url.slice(1);
            } else if (url.startsWith('~')) {
                u = JS.config('libRoot') + url.slice(1)
            }

            let us = u.split('#'),
                len = us.length,
                u0 = us[0],
                ayc = len > 1 && us[1] == 'async';
            if (_ldd[u0]) return P.resolvePlan(null);
            _ldd[u0] = 1;

            if (u0.endsWith('.js')) {
                return P.newPlan(Dom.loadJS, [_ts(_min(u0, 'js')), ayc])
            } else if (u0.endsWith('.css')) {
                return P.newPlan(Dom.loadCSS, [_ts(_min(u0, 'css')), ayc])
            } else {
                return P.newPlan(Dom.loadHTML, [_ts(u0), ayc])
            }
        }

    /**
     * Import JLU(JSDK Library Uri).
     * <pre>
     * JLU Format 1:
     * http(s)://domain/path/xxx.[js|css|html](#async)
     * JLU Format 2:
     * $moduleName
     * JLU Format 3:
     * ~/libName/x.y.z/xxx.[js|css|html](#async)
     * </pre>
     * Example Urls:
     * <pre>
     * https://mycdn.net/jsdk/2.0.0/jscore.js
     * http://mycom.net/myapp/1.0.0/home.js
     * http://mycom.net/myapp/1.0.0/home.css
     * http://mycom.net/myapp/1.0.0/model.js#async
     * http://mycom.net/myapp/1.0.0/template.html
     * </pre>
     */
    export function imports(url: string | string[]): Promise<any> {
        if (JS.config('closeImport')) return Promise.resolve();

        let uris: any[] = typeof url === 'string' ? [<string>url] : <string[]>url, tasks: PromisePlans<any> = [];
        uris.forEach(uri => {
            tasks.push(uri.startsWith('$') ? _impLib(uri.slice(1)) : _impFile(uri))
        })
        return P.order(tasks)
    }

}
