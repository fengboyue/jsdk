/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="Ajax.ts"/>
/// <reference path="EventBus.ts"/>
/**
 * Add methods for Dom object
 */
interface HTMLElement {

    box(): { x: number, y: number, w: number, h: number };

    attr(key: string): string;
    attr(key: string, val: string): this;

    html(): string;
    html(html: string): this;

    addClass(cls: string): this;
    removeClass(cls: string): this;
    hasClass(cls: string): boolean;
    /**
     * 
     * @param cls 
     * @param isAdd the second parameter for determining whether the class should be added or removed. If this parameter's value is true, then the class is added; if false, the class is removed.
     */
    toggleClass(cls: string, isAdd?: boolean): this;

    on(type: string, fn: (this: HTMLElement, e: Event) => boolean | void, once?: boolean): this;
    off(type?: string, fn?: (this: HTMLElement, e: Event) => boolean | void): this;

    find(selector: string): HTMLElement;
    findAll(selector: string): NodeListOf<HTMLElement>;

    /**
     * Returns the computed style of this element.
     * @param pseudo 
     */
    computedStyle(pseudo?:string):CSSStyleDeclaration;
}
/**
 * Add methods for window object
 */
interface Window {
    on(type: string, fn: (this: Window, e: Event) => boolean | void, once?: boolean): this;
    off(type?: string, fn?: (this: Window, e: Event) => boolean | void): this;
}

if (self['HTMLElement']) //当前不在worker线程中
    (function () {
        const D = document, 
            HP = HTMLElement.prototype,
            oa = HP.append,
            op = HP.prepend,
            _ad = function (html: string) {
                if (!html) return;
                let div = D.createElement('div'),
                    nodes = null,
                    fg = D.createDocumentFragment();
                div.innerHTML = html;
                nodes = div.childNodes;
                for (let i = 0, len = nodes.length; i < len; i++) {
                    fg.appendChild(nodes[i].cloneNode(true));
                }
                this.appendChild(fg);
                nodes = null;
                fg = null;
            },
            _pd = function (html: string) {
                if (!html) return;
                let div = D.createElement('div'),
                    nodes = null,
                    fg = D.createDocumentFragment();
                div.innerHTML = html;
                nodes = div.childNodes;
                for (let i = 0, len = nodes.length; i < len; i++) {
                    fg.appendChild(nodes[i].cloneNode(true));
                }
                this.insertBefore(fg, this.firstChild);
                nodes = null;
                fg = null;
            };

        HP.append = function (...nodes: (Node | string)[]) {
            nodes.forEach(n => {
                typeof n == 'string' ? _ad.call(this, n) : oa.call(this, n.cloneNode(true))
            })
        }
        HP.prepend = function (...nodes: (Node | string)[]) {
            nodes.forEach(n => {
                typeof n == 'string' ? _pd.call(this, n) : op.call(this, n.cloneNode(true))
            })
        }

        HP.box = function () {
            let box = this.getBoundingClientRect();
            return {
                x: box.x + System.display().docScrollX,
                y: box.x + System.display().docScrollY,
                w: box.width,
                h: box.height
            }
        }

        HP.attr = function (key: string, val?: string) {
            if (arguments.length == 1) return this.getAttribute(key);
            this.setAttribute(key, val);
            return this
        }
        HP.html = function (html?: string) {
            if (arguments.length == 0) return this.innerHTML;
            this.innerHTML = html;
            return this
        }
        HP.addClass = function (cls: string) {
            if (!cls) return this;
            let cs = this.attr('class');
            return this.attr('class', cs + ' ' + cls)
        }
        HP.removeClass = function (cls: string) {
            if (!cls) return this;

            let cs: string = this.attr('class').trim();
            if (!cs) return this;

            let clss = cls.split(' '); cs += ' ';
            clss.forEach(c => {
                cs = cs.replace(new RegExp(c + ' ', 'g'), '')
            })
            return this.attr('class', cs)
        }
        HP.hasClass = function (cls: string) {
            if (!cls) return this;

            let cs: string = this.attr('class').trim();
            if (!cs) return this;
            return (cs + ' ').indexOf(cls + ' ') >= 0
        }
        HP.toggleClass = function (cls: string, isAdd?: boolean) {
            if (!cls) return this;
            if (isAdd === true) return this.addClass(cls);
            if (isAdd === false) return this.removeClass(cls);

            let clss = cls.split(' ');
            return this.hasClass(clss[0]) ? this.removeClass(cls) : this.addClass(cls)
        }

        //event functions
        let _on = function (this: HTMLElement, type: string, fn: Function, once: boolean) {
            if (!this['_bus']) this['_bus'] = new EventBus(this);

            let bus = <EventBus>this['_bus'], cb = (e) => {
                bus.fire(e)
            };
            bus.on(type, <any>fn, once);

            if (this.addEventListener) {                    //所有主流浏览器，除了 IE 8 及更早 IE版本
                this.addEventListener(type, cb);
            } else if (this['attachEvent']) {                  // IE 8 及更早 IE 版本
                this['attachEvent']('on' + type, cb);
            }
        }
        HP.on = function (type: string, fn: Function, once: boolean) {
            let types = type.split(' ');
            types.forEach(t => {
                _on.call(this, t, fn, once)
            })
            return this
        }
        let _rm = function (this: HTMLElement | Window, type, fn?: Function) {
                if (!fn) return;
                if (this.removeEventListener) {                    //所有主流浏览器，除了 IE 8 及更早 IE版本
                    this.removeEventListener(type, <any>fn);
                } else if (this['detachEvent']) {                  // IE 8 及更早 IE 版本
                    this['detachEvent']('on' + type, fn);
                }
            },
            _rms = function (this: HTMLElement | Window, type, fns: Function[]) {
                if (fns) fns.forEach(f => { _rm.call(this, type, f) })
            },
            _off = function (this: HTMLElement, type: string, fn) {
                let bus = <EventBus>this['_bus'];
                if (bus) {
                    let obj = fn ? bus.find(type, fn['euid']) : undefined;
                    bus.off(type, obj);
                    _rm.call(this, type, obj);
                } else {
                    _rm.call(this, type, fn);
                }
            }
        HP.off = function (type?: string, fn?: Function) {
            if (!type) {
                let bus = <EventBus>this['_bus'];
                if (bus) {
                    let types = bus.types();
                    for (let i = 0, len = types.length; i < len; i++) {
                        let ty = types[i];
                        _rms.call(this, ty, bus.find(ty));
                    }
                    bus.off();
                }
            } else {
                let types = type.split(' ');
                types.forEach(t => {
                    _off.call(this, t, fn)
                })
            }
            return this
        }

        HP.find = HP.querySelector;
        HP.findAll = HP.querySelectorAll;

        HP.computedStyle = function (p?: string) {
            return document.defaultView.getComputedStyle(this, p||null)
        }

        let WP = Window.prototype;
        WP.on = <any>HP.on;
        WP.off = <any>HP.off;
    })()

module JS {

    export namespace util {

        let D:Document,
            _head = () => { return D.querySelector('head') },
            _uncached = (url: string) => {
                return `${url}${url.indexOf('?') < 0 ? '?' : '&'}_=${new Date().getTime()}`
            }
        if (self['HTMLElement']) D = document;//当前不在worker线程中    

        /**
         * Dom Helper
         */
        export class Dom {

            /**
             * Returns the first element that is a descendant of node that matches selectors.
             */
            public static $1(selector: string | HTMLElement): HTMLElement {
                return typeof selector == 'string' ? D.querySelector(selector) : selector
            }

            /**
             * Returns all element descendants of node that match selectors.
             */
            public static $L(selector: string): NodeListOf<HTMLElement> {
                return D.querySelectorAll(selector)
            }

            /**
             * Replace old node in DOM tree with new tag name.
             */
            public static rename(node: Element, newTagName: string) {
                let newNode = D.createElement(newTagName), aNames: string[] = node['getAttributeNames']();
                if (aNames) aNames.forEach(name => {
                    newNode.setAttribute(name, node.getAttribute(name))
                });
                (<any>newNode).append.apply(newNode, node.childNodes);
                node.parentNode.replaceChild(newNode, node);
            }

            /**
             * Apply css style code in current page.
             */
            public static applyStyle(code: string, id?: string) {
                if (!code) return;
                (<any>this.$1('head')).append(`<style${id ? ' id="' + id + '"' : ''}>${code}</style>`);
            }

            /**
             * Insert and apply a new HTML fragment in current page.
             */
            public static applyHtml(html: string | Document, appendTo?: string | HTMLElement, ignore?: { script?: boolean, css?: boolean } | boolean): Promise<string> {
                if (!html) return Promise.reject(null);
                return Promises.create<string>(function () {
                    let doc = typeof html == 'string' ? new DOMParser().parseFromString(html, 'text/html') : <Document>html,
                        url = doc.URL,
                        el = Dom.$1(appendTo || D.body);

                    (<any>el).append.apply(el, doc.body.childNodes);
                    el = null;

                    let ignoreCss = ignore === true || (ignore && ignore.css) ? true : false;
                    if (!ignoreCss) {
                        //加载内嵌样式
                        let cssFiles = doc.querySelectorAll('link[rel=stylesheet]');
                        if (cssFiles) {
                            for (let i = 0, len = cssFiles.length; i < len; i++) {
                                let css = cssFiles[i], href = css.getAttribute('href');
                                if (href) Dom.loadCSS(href, true)
                            }
                        }
                        let styles = doc.querySelectorAll('style');
                        if (styles) {
                            for (let i = 0, len = styles.length; i < len; i++) {
                                Dom.applyStyle(styles[i].textContent)
                            }
                        }
                    }
                    let ignoreScript = ignore === true || (ignore && ignore.script) ? true : false;
                    if (!ignoreScript) {
                        //加载并执行内嵌JS
                        let scs = doc.getElementsByTagName('script'), syncs = [], back = () => {
                            syncs = null;
                            scs = null;
                            if (typeof html == 'string') doc = null;
                            this.resolve(url)
                        };
                        if (scs && scs.length > 0) {
                            for (let i = 0, len = scs.length; i < len; i++) {
                                let sc = scs[i];
                                sc.src ? (sc.async ? Dom.loadJS(sc.src, true) : syncs.push(Dom.loadJS(sc.src, false))) : eval(sc.text)
                            }
                            Promises.order(syncs).then(() => {
                                back()
                            }).catch((u) => {
                                JSLogger.error('Load inner script error in loading html!\nscript url=' + u + '\nhtml url=' + url);
                                back()
                            })
                        } else {
                            back()
                        }
                    } else {
                        if (typeof html == 'string') doc = null;
                        this.resolve(url)
                    }
                })
            }

            public static loadCSS(url: string, async: boolean = false, uncache?: boolean) {
                if (!url) return Promise.reject(null);
                return Promises.create<string>(function () {
                    let k = D.createElement('link'), back = () => {
                        k.onload = k.onerror = k['onreadystatechange'] = null;
                        k = null;
                        this.resolve(url);
                    };
                    k.type = 'text/css';
                    k.rel = 'stylesheet';
                    if (!async) {
                        k['onreadystatechange'] = () => {//兼容IE
                            if (k['readyState'] == 'loaded' || k['readyState'] == 'complete') back()
                        }
                        k.onload = k.onerror = back
                    }
                    k.href = uncache ? _uncached(url) : url;
                    _head().appendChild(k);
                    if (async) back();
                })
            }
            public static loadJS(url: string, async: boolean = false, uncache?: boolean) {
                if (!url) return Promise.reject(null);
                return Promises.create<string>(function () {
                    let s = D.createElement('script'), back = () => {
                        s.onload = s.onerror = s['onreadystatechange'] = null;
                        s = null;
                        this.resolve(url);
                    };
                    s.type = 'text/javascript';
                    s.async = async;
                    if (!async) {
                        s['onreadystatechange'] = () => {//兼容IE
                            if (s['readyState'] == 'loaded' || s['readyState'] == 'complete') back()
                        }
                        s.onload = s.onerror = back
                    }
                    s.src = uncache ? _uncached(url) : url;
                    _head().appendChild(s);
                    if (async) back();
                })
            }

            public static loadHTML(
                url: string, async?: boolean,
                appendTo?: string | HTMLElement,
                ignore?: { script?: boolean, css?: boolean } | boolean,
                preHandler?: (doc: Document) => Document): Promise<string> {
                if (!url) return Promise.reject(null);
                return Promises.create<string>(function () {
                    Ajax.get({
                        type: 'html',
                        url: url,
                        cache: false,
                        async: async
                    }).then((res) => {
                        Dom.applyHtml(preHandler ? preHandler(res.data) : res.data, appendTo, ignore).then(() => {
                            this.resolve(url)
                        })
                    })
                })
            }

        }
    }
}

import Dom = JS.util.Dom;
const $1 = Dom.$1;
const $L = Dom.$L;