/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @author Frank.Feng
 * @email boyue.feng@foxmail.com
 * 
 * @version 2.1.0
 * @date 2020/7/1
 * @update create a new module "jsan" for anmimation
 * 
 * @version 2.0.0
 * @date 2018/01/08 - 2020/06/12
 * 
 * @version 1.0.0
 * @date 2012/12/19
 * 
 * @version 0.6.0
 * @date 2009
 * 
 * @version 0.1
 * @date 2007/08/30
 */
/// <reference path="../../libs/reflect/2.0.0/reflect.d.ts" />
/// <reference path="../util/Dom.ts" />

module JS {

    export let version = '2.1.0';

    export type GlobalConfig = {
        importMode?: 'js' | 'html';
        minimize?: boolean;
        jsdkRoot?: string;
        libRoot?: string;
        libs?: JsonObject<string | Array<string>>;
    }

    /**
     * Gets JSDK's global configuration.
     */
    export function config(): GlobalConfig
    /**
     * Sets JSDK's global configuration.
     */
    export function config(opts: GlobalConfig): void
    /**
     * Gets the value of a key in global configuration.
     * @param key 
     */
    export function config<T>(key: keyof GlobalConfig): T
    /**
     * Sets the value of a key in global configuration.
     * @param key 
     * @param val 
     */
    export function config(key: keyof GlobalConfig, val: any): void
    export function config(d?: GlobalConfig | keyof GlobalConfig, v?: any): GlobalConfig | void {
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

    let _cfg: GlobalConfig = {},
        _ldd = {},//loaded URLs

        _min = (uri: string, type: 'js' | 'css') => {
            if (JS.config<boolean>('minimize')) {
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
                return Promises.newPlan(Promises.order, [tasks])
            } else {
                console.error('Not found the <' + libName + '> library in JSDK settings.');
                return Promises.resolvePlan(null)
            }
        },
        _impFile = (url: string): (() => Promise<any>) => {
            let u = url;
            if (url.startsWith('!')) {
                let jr = JS.config('jsdkRoot');
                jr = jr?jr:(JS.config('libRoot')+'/jsdk/'+JS.version);
                u =  jr + url.slice(1);
            } else if (url.startsWith('~')) {
                u = JS.config('libRoot') + url.slice(1)
            }

            let us = u.split('#'),
                len = us.length,
                u0 = us[0],
                ayc = len > 1 && us[1] == 'async';
            if (_ldd[u0]) return Promises.resolvePlan(null);
            _ldd[u0] = 1;

            if (u0.endsWith('.js')) {
                return Promises.newPlan(Dom.loadJS, [_min(u0, 'js'), ayc])
            } else if (u0.endsWith('.css')) {
                return Promises.newPlan(Dom.loadCSS, [_min(u0, 'css'), ayc])
            } else {
                return Promises.newPlan(Dom.loadHTML, [u0, ayc])
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
     * https://mycdn.net/jsdk/1.0.0/system.js
     * http://mycom.net/myapp/1.0.0/home.js
     * http://mycom.net/myapp/1.0.0/home.css
     * http://mycom.net/myapp/1.0.0/model.js#async
     * http://mycom.net/myapp/1.0.0/template.html
     * </pre>
     */    
    export function imports(url: string | string[]): Promise<any> {
        if (JS.config('importMode') == 'html') return Promise.resolve();

        let uris: any[] = typeof url === 'string' ? [<string>url] : <string[]>url, tasks: PromisePlans<any> = [];
        uris.forEach(uri => {
            tasks.push(uri.startsWith('$') ? _impLib(uri.slice(1)) : _impFile(uri))
        })
        return Promises.order(tasks)
    }

}
