/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @author Frank.Feng
 * @email boyue.feng@foxmail.com
 * 
 * @version 2.7.0
 * @date 2020/9/12
 * @update Update "jscore" for micro kernel
 * @update Update "jsan" for new tween and frame animations
 * 
 * @version 2.6.0
 * @date 2020/9/5
 * @update New js2d module
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
/// <reference path="Promises.ts" />
/// <reference path="Loader.ts" />

module JS {

    export let version = '2.7.0';

    export type JSDKConfig = {
        closeImport?: boolean;
        cachedImport?: boolean | string;
        minImport?: boolean;
        jsdkRoot?: string;
        libRoot?: string;
        libs?: {[key:string]: string | Array<string>};
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
        _ts = (u: string) => {
            let c = <any>JS.config('cachedImport');
            if (c === true) return u;
            let s: string = '_=' + (c ? <string>c : '' + Date.now());
            return u.lastIndexOf('?') > 0 ? `${u}&${s}` : `${u}?${s}`
        },
        _min = (u: string, t: 'js' | 'css') => {
            if (JS.config<boolean>('minImport')) {
                if (u.endsWith('.min.' + t)) return u;
                if (u.endsWith('.' + t)) return u.slice(0, u.length - t.length - 1) + '.min.' + t;
            } else return u
        },
        _impLib = (v: string): (() => Promise<any>) => {
            let a = v.endsWith('#async'),
                n = a ? v.slice(0, v.length - 6) : v, //lib name
                c: string | string[] = JS.config('libs')[n];
            if (c) {
                let ps: string[] = typeof c == 'string' ? [c] : c, tasks: Array<() => Promise<any>> = [];
                ps.forEach(path => {
                    if (path.startsWith('$')) {
                        tasks.push(_impLib(path.slice(1)))
                    } else {
                        tasks.push(_impFile(path + (a ? '#async' : '')))
                    }
                })
                return P.newPlan(P.order, [tasks])
            } else {
                console.error('Not found the <' + n + '> library in JSDK settings.');
                return P.resolvePlan(null)
            }
        },
        _impFile = (s: string): (() => Promise<any>) => {
            let u = s;
            if (s.startsWith('!')) {
                let jr = JS.config('jsdkRoot');
                jr = jr ? jr : (JS.config('libRoot') + '/jsdk/' + JS.version);
                u = jr + s.slice(1);
            } else if (s.startsWith('~')) {
                u = JS.config('libRoot') + s.slice(1)
            }

            let us = u.split('#'),
                len = us.length,
                u0 = us[0],
                ayc = len > 1 && us[1] == 'async';
            if (_ldd[u0]) return P.resolvePlan(null);
            _ldd[u0] = 1;

            if (u0.endsWith('.js')) {
                return P.newPlan(Loader.js, [_ts(_min(u0, 'js')), ayc])
            } else if (u0.endsWith('.css')) {
                return P.newPlan(Loader.css, [_ts(_min(u0, 'css')), ayc])
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
     * Sample JLUs:
     * <pre>
     * $jsvp
     * ~/coolbutton/1.0.0/cool-button.css
     * ~/coolbutton/1.0.0/cool-button.js
     * http://mycom.net/myapp/1.0.0/home.js
     * http://mycom.net/myapp/1.0.0/home.css
     * http://mycom.net/myapp/1.0.0/model.js#async
     * http://mycom.net/myapp/1.0.0/template.html
     * </pre>
     */
    export function imports(url: string | string[]): Promise<any> {
        if (JS.config('closeImport')) return Promise.resolve();

        let us: any[] = typeof url === 'string' ? [<string>url] : <string[]>url, tasks: PromisePlans<any> = [];
        us.forEach(uri => {
            tasks.push(uri.startsWith('$') ? _impLib(uri.slice(1)) : _impFile(uri))
        })
        return P.order(tasks)
    }

}
