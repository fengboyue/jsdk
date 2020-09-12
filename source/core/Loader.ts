/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.7.0
 * @update Independence from Dom class
 * 
 * @author Frank.Feng
 */
module JS {

    export namespace core {

        let D: Document,
            _head = () => { return D.querySelector('head') },
            _uncached = (u: string) => {
                return `${u}${u.indexOf('?') < 0 ? '?' : '&'}_=${new Date().getTime()}`
            },
            _loading = (k: any, a: boolean, b: Function) => {
                if (!a) {
                    k['onreadystatechange'] = () => {//兼容IE
                        if (k['readyState'] == 'loaded' || k['readyState'] == 'complete') b()
                    }
                    k.onload = k.onerror = b
                }
            }
        if (self['HTMLElement']) D = document;//当前不在worker线程中    

        export class Loader {

            static css(url: string, async: boolean = false, uncached?: boolean) {
                if (!url) return Promise.reject(null);
                return Promises.create<string>(function () {
                    let k = D.createElement('link'), back = () => {
                        k.onload = k.onerror = k['onreadystatechange'] = null;
                        k = null;
                        this.resolve(url);
                    };
                    k.type = 'text/css';
                    k.rel = 'stylesheet';
                    k.charset = 'utf-8';
                    _loading(k, async, back);

                    // if (!async) {
                    //     k['onreadystatechange'] = () => {//兼容IE
                    //         if (k['readyState'] == 'loaded' || k['readyState'] == 'complete') back()
                    //     }
                    //     k.onload = k.onerror = back
                    // }
                    k.href = uncached ? _uncached(url) : url;
                    _head().appendChild(k);
                    if (async) back();
                })
            }
            static js(url: string, async: boolean = false, uncached?: boolean) {
                if (!url) return Promise.reject(null);
                return Promises.create<string>(function () {
                    let s = D.createElement('script'), back = () => {
                        s.onload = s.onerror = s['onreadystatechange'] = null;
                        s = null;
                        this.resolve(url);
                    };
                    s.type = 'text/javascript';
                    s.async = async;
                    _loading(s, async, back);
                    // if (!async) {
                    //     s['onreadystatechange'] = () => {//兼容IE
                    //         if (s['readyState'] == 'loaded' || s['readyState'] == 'complete') back()
                    //     }
                    //     s.onload = s.onerror = back
                    // }
                    s.src = uncached ? _uncached(url) : url;
                    _head().appendChild(s);
                    if (async) back();
                })
            }
        }
    }
}

import Loader = JS.core.Loader;
