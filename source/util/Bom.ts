/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
module JS {

    export namespace util {

        let R = false, D = document, W = window; //isReady
        /**
         * Window Helper
         */
        export class Bom {

            /**
             * Execute a function after dom ready.<br>
             * DOM加载完成后执行
             */
            public static ready(fn: Function): void {
                if (R) {
                    fn();
                    return
                }

                let callback = function () {
                    R = true;
                    fn();
                    callback = null;
                }
                let wc = W['HTMLImports'] && W['HTMLImports'].whenReady;//判断是否已引入：webcomponents-lite.js
                if (wc) return wc(callback);

                if (D.readyState === "complete") {
                    // Handle it asynchronously to allow scripts the opportunity to delay ready
                    setTimeout(callback, 1);
                } else if (D.addEventListener) {
                    // Use the handy event callback
                    D.addEventListener("DOMContentLoaded", <any>callback, false);

                    // A fallback to window.onload, that will always work
                    W.addEventListener("load", <any>callback, false);
                } else {//For IE
                    // Ensure firing before onload, maybe late but safe also for iframes
                    D['attachEvent']("onreadystatechange", callback);

                    // A fallback to window.onload, that will always work
                    W['attachEvent']("onload", callback);

                    // If IE and not a frame
                    // continually check to see if the document is ready
                    var top = false;
                    try {
                        top = (W.frameElement == null && D.documentElement) ? true : false;
                    } catch (e) { }

                    //如果是IE并且不是iframe
                    if (top && top['doScroll']) {
                        (function doScrollCheck() {
                            if (!R) {

                                try {
                                    //一直调用doScroll滚动，因为DOM渲染结束前，DOM节点是没有doScroll方法的，所以一直会异常
                                    //直到DOM渲染结束了，这个时候doScroll方法不会抛出异常，然后就调用ready()
                                    top['doScroll']('left');
                                } catch (e) {
                                    return setTimeout(doScrollCheck, 50);
                                }
                                // and execute any waiting functions
                                callback();
                            }
                        })();
                    }
                }
            }

            /**
             * Returns the iframe window by selector or element.
             */
            public static iframeWindow(el: string | Element): Window {
                let e = Dom.$1(<string>el);
                if (!e) return null;
                return e['contentWindow']
            }

            /**
             * Returns the iframe document by selector or element.
             */
            public static iframeDocument(el: string | Element): Document {
                let e = Dom.$1(<string>el);
                if (!e) return null;
                return e['contentDocument'] || e['contentWindow'].document
            }

            /**
             * Full screen
             */
            public static fullscreen() {
                let de = D.documentElement;
                let fnName = de['mozRequestFullScreen'] ? 'mozRequestFullScreen' : (de['webkitRequestFullScreen'] ? 'webkitRequestFullScreen' : 'requestFullscreen');
                if (de[fnName]) de[fnName]();
            }

            /**
             * Normal screen
             */
            public static normalscreen() {
                let fnName = D['mozCancelFullScreen'] ? 'mozCancelFullScreen' : (D['webkitCancelFullScreen'] ? 'webkitCancelFullScreen' : 'exitFullscreen');
                if (D[fnName]) D[fnName]();
            }

        }
    }
}

import Bom = JS.util.Bom;
