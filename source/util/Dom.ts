/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../net/Http.ts"/>
/// <reference path="EventBus.ts"/>

/**
 * Add methods for Dom object
 */
interface HTMLElement {

    box(): { x: number, y: number, w: number, h: number };

    attr(key: string): string;
    attr(key: string, val: string): this;

    on(type: string, listener: (this: HTMLElement, e: Event) => boolean | void, useCapture?: boolean): this;
    on(type: string, listener: (this: HTMLElement, e: Event) => boolean | void, options?: {
        capture?: boolean,
        once?: boolean,
        passive?: boolean
    }): this;
    off(type?: string, listener?: (this: HTMLElement, e: Event) => boolean | void, capture?: boolean): this;

    find(selector: string): HTMLElement;
    findAll(selector: string): NodeListOf<HTMLElement>;

    /**
     * Returns the computed style of this element.
     * @param pseudo 
     */
    computedStyle(pseudo?: string): CSSStyleDeclaration;

    /**
     * Gets the selected or inputed values of form elements such as input, select and textarea. 
     * When called on a non-form element, it returns undefined.
     * When the value of this element is an empty string, it returns ''.
     * 
     * When this element is a select-multiple (i.e., a select element with the multiple attribute set), 
     * it returns an array containing the value of each selected option. 
     * If no options are selected, it returns an empty array.
     * 
     * When this element is a checkbox, it returns the selected values of all same-name elements.
     * When all checkboxes are not checked, it returns an empty array.
     * 
     * When this element is a radio, it returns the selected value of all same-name elements.
     * When all radio are not checked, it returns null.
     */
    val(): string | string[];
    /**
     * Sets the form element's value such as input, select and textarea. 
     * 
     * When this element is a checkbox, it will select some same-name elements.
     * 
     * When this element is a radio, it will select one same-name element.
     */
    val(v: string | string[]): this;

    /**
     * Gets the value of css name.
     * @param name 
     */
    css(name: string): string;
    /**
     * Sets the value of css name.
     * Note:
     * 1. The val accepts !important declarations. So, the statement $1( "p" ).css( "color", "red !important" ) can be set to its css name.
     * 2. The val accepts offset value. Offset value is a string starting with += or -= to increment or decrement the current value. For example, if an element's padding-left was 10px, .css( "padding-left", "+=15" ) would result in a total padding-left of 25px.
     * @param name
     * @param val 
     */
    css(name: string, val: CssValueString | number): this;
    /**
     * Sets a set of css name-value pairs
     * @param props 
     */
    css(props: JsonObject<string>): this;

    /**
     * Removes ll children nodes and unbinds all their events binding with the on method.
     * @param selector 
     */
    empty(): this;
    /**
     * Removes self or all children nodes of special selector and unbinds all their events binding with the on method.
     * @param selector 
     */
    remove(selector?: string): void;
}
/**
 * Add methods for document object
 */
interface Document {
    on(type: string, listener: (this: Document, e: Event) => boolean | void, useCapture?: boolean): this;
    on(type: string, listener: (this: Document, e: Event) => boolean | void, options?: {
        capture?: boolean,
        once?: boolean,
        passive?: boolean
    }): this;
    off(type?: string, listener?: (this: Document, e: Event) => boolean | void): this;
}
/**
 * Add methods for window object
 */
interface Window {
    on(type: string, listener: (this: Window, e: Event) => boolean | void, useCapture?: boolean): this;
    on(type: string, listener: (this: Window, e: Event) => boolean | void, options?: {
        capture?: boolean,
        once?: boolean,
        passive?: boolean
    }): this;
    off(type?: string, listener?: (this: Window, e: Event) => boolean | void): this;
}

if (self['HTMLElement']) //当前不在worker线程中
    (function () {
        const D = document,
            HP = HTMLElement.prototype,
            oa = HP.append,
            op = HP.prepend,
            or = HP.remove,
            _ad = function (this: HTMLElement, html: string) {
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
            _pd = function (this: HTMLElement, html: string) {
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

        /**
         * 原生方法只能添加text；改造后的方法能够添加html
         */
        HP.append = function (...nodes: (Node | string)[]) {
            nodes.forEach(n => {
                typeof n == 'string' ? _ad.call(this, n) : oa.call(this, n.cloneNode(true))
            })
        }
        HP.prepend = function (...nodes: (Node | string)[]) {
            nodes.forEach(n => {
                typeof n == 'string' ? _pd.call(this, n) : op.call(this, n)
            })
        }

        HP.box = function (this: HTMLElement) {
            let box = this.computedStyle();
            return {
                x: parseFloat(box.left) + System.display().docScrollX,
                y: parseFloat(box.top) + System.display().docScrollY,
                w: parseFloat(box.width),
                h: parseFloat(box.height)
            }
        }

        HP.attr = function (key: string, val?: string) {
            if (arguments.length == 1) return this.getAttribute(key);
            this.setAttribute(key, val);
            return this
        }

        //event functions
        let _on = function (this: EventTarget, type: string, fn: Function, opts?: boolean | {
            capture?: boolean,
            once?: boolean,
            passive?: boolean
        }) {
            if (!this['_bus']) this['_bus'] = new EventBus(this);

            let bus = <EventBus>this['_bus'], cb = e => {
                bus.fire(e)
            }, once = (opts && opts['once']) ? true : false;
            bus.on(type, <any>fn, once);

            //所有主流浏览器，除了IE8及更早IE版本
            if (this.addEventListener) this.addEventListener(type, cb, opts)
        }
        HP.on = function (type: string, fn: Function, opts?: boolean | {
            capture?: boolean,
            once?: boolean,
            passive?: boolean
        }) {
            let types = type.split(' ');
            types.forEach(t => {
                _on.call(this, t, fn, opts)
            })
            return this
        }
        let _rm = function (this: EventTarget, type, fn: Function, opts: boolean) {
            if (!fn) return;
            //所有主流浏览器，除了IE8及更早IE版本
            if (this.removeEventListener) this.removeEventListener(type, <any>fn, opts || false)
        },
            _rms = function (this: EventTarget, type, fns: Function[], opts: boolean) {
                if (fns) fns.forEach(f => { _rm.call(this, type, f, opts) })
            },
            _off = function (this: EventTarget, type: string, fn, opts: boolean) {
                let bus = <EventBus>this['_bus'];
                if (bus) {
                    let oFn = fn ? bus.original(type, fn['euid']) : undefined;
                    bus.off(type, oFn);
                    _rm.call(this, type, oFn, opts);
                } else {
                    _rm.call(this, type, fn, opts);
                }
            }
        HP.off = function (type?: string, fn?: Function, capture?: boolean) {
            if (!type) {
                let bus = <EventBus>this['_bus'];
                if (bus) {
                    let types = bus.types();
                    for (let i = 0, len = types.length; i < len; i++) {
                        let ty = types[i];
                        _rms.call(this, ty, bus.original(ty), capture);
                    }
                    bus.off();
                }
            } else {
                let types = type.split(' ');
                types.forEach(t => {
                    _off.call(this, t, fn, capture)
                })
            }
            return this
        }

        HP.find = HP.querySelector;
        HP.findAll = HP.querySelectorAll;

        HP.computedStyle = function (p?: string) {
            return document.defaultView.getComputedStyle(this, p || null)
        }

        let _getV = function (this: HTMLElement): string | string[] {
            if (this instanceof HTMLTextAreaElement) {
                return this.value || ''
            } else if (this instanceof HTMLInputElement) {
                if (this.type == 'checkbox') {
                    let chks = document.getElementsByName(this.name);
                    if (chks.length > 0) {
                        let a = [];
                        [].forEach.call(chks, function (chk: HTMLInputElement) {
                            if (chk.checked) a.push(chk.value)
                        });
                        return a
                    }
                    return this.checked ? [this.value] : []
                } if (this.type == 'radio') {
                    let rds = document.getElementsByName(this.name);
                    if (rds.length > 0) {
                        for (let i = 0, l = rds.length; i < l; i++) {
                            let rd = <HTMLInputElement>rds.item(i);
                            if (rd.checked) return rd.value
                        }
                        return null
                    }
                    return this.checked ? this.value : null
                }
                return this.value || ''
            } else if (this instanceof HTMLSelectElement) {
                let opts = this.findAll('option:checked');
                if (opts.length > 0) {
                    let a = [];
                    for (let i = 0, l = opts.length; i < l; i++) {
                        let opt = <HTMLOptionElement>opts.item(i);
                        if (this.multiple) {
                            if (opt.selected) a.push(opt.value)
                        } else {
                            if (opt.selected) return opt.value
                        }
                    }
                    return a
                }
                return []
            }

            return undefined
        }, _setV = function (this: HTMLElement, v: string | string[]) {
            if (this instanceof HTMLTextAreaElement) {
                this.value = <any>v || ''
            } else if (this instanceof HTMLInputElement) {
                if (this.type == 'checkbox') {
                    let chks = document.getElementsByName(this.name), vs = <string[]>v;
                    if (chks.length > 0) {
                        [].forEach.call(chks, function (chk: HTMLInputElement) {
                            chk.checked = vs.indexOf(chk.value) > -1
                        })
                    } else {
                        if (vs.indexOf(this.value) > -1) this.checked = true
                    }
                    return this
                } if (this.type == 'radio') {
                    let rds = document.getElementsByName(this.name);
                    if (rds.length > 0) {
                        for (let i = 0, l = rds.length; i < l; i++) {
                            let rd = <HTMLInputElement>rds.item(i);
                            if (v == rd.value) {
                                rd.checked = true;
                                return this
                            }
                        }
                    } else {
                        if (v == this.value) this.checked = true
                    }
                    return this
                }
                this.value = <string>v
            } else if (this instanceof HTMLSelectElement) {
                let opts = this.findAll('option'), vs = typeof v == 'string' ? [v] : <string[]>v;
                if (opts.length > 0) {
                    for (let i = 0, l = opts.length; i < l; i++) {
                        let opt = <HTMLOptionElement>opts.item(i);
                        opt.selected = vs.indexOf(opt.value) > -1
                    }
                }
            }

            return this
        }
        HP.val = function (v?: string | string[]) {
            return arguments.length == 0 ? _getV.call(this) : _setV.call(this, v);
        }

        let setCssValue = (el:HTMLElement, k: string, v: string|number) => {
            let st = el.style;
            if (v === undefined) {
                st.removeProperty(CssTool.hyphenCase(k))
            } else if (v != null) {
                let w = v+'';
                st.setProperty(CssTool.hyphenCase(k), CssTool.calcValue(w, el.css(k)), w.endsWith(' !important') ? 'important' : '')
            }
        };

        HP.css = function (this: HTMLElement, name: string | JsonObject<string>, val?: string | number): any {
            if (arguments.length == 1) {
                if (typeof name == 'string') {
                    let key = CssTool.hyphenCase(<string>name);
                    return this.style.getPropertyValue(key) || this.computedStyle().getPropertyValue(key)
                } else {
                    let s = '';
                    Jsons.forEach(name, (v, k) => {
                        if (v != void 0) s += `${CssTool.hyphenCase(k)}:${CssTool.calcValue(v, this.style.getPropertyValue(k))};`
                    })
                    this.style.cssText += s
                }
            } else {
                setCssValue(this, <string>name, val)
            }

            return this
        }

        HP.empty = function (this: HTMLElement, s?: string) {
            let chs = this.findAll(s || '*');
            if (chs.length > 0) [].forEach.call(chs, function (node: HTMLElement) {
                if (node.nodeType == 1) node.off().remove()
            });

            return this
        }
        HP.remove = function (this: HTMLElement, s?: string) {
            this.empty.call(this, s);
            if (!s) or.call(this.off())
        }

        let DP = Document.prototype;
        DP.on = <any>HP.addEventListener;
        DP.off = <any>HP.removeEventListener;

        let WP = Window.prototype;
        WP.on = <any>HP.addEventListener;
        WP.off = <any>HP.removeEventListener;
    })()

module JS {

    export namespace util {

        let D: Document;
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
            public static applyHtml(html: string | HTMLDocument, appendTo?: string | HTMLElement, ignore?: { script?: boolean, css?: boolean } | boolean): Promise<string> {
                if (!html) return Promise.reject(null);
                return Promises.create<string>(function () {
                    let doc: HTMLDocument = typeof html == 'string' ? new DOMParser().parseFromString(html, 'text/html') : html,
                        url = doc.URL,
                        el = Dom.$1(appendTo || D.body);
                    (<any>el).append.apply(el, doc.body.childNodes);

                    let ignoreCss = ignore === true || (ignore && ignore.css) ? true : false;
                    if (!ignoreCss) {
                        //加载内嵌样式
                        let cssFiles = doc.querySelectorAll('link[rel=stylesheet]');
                        if (cssFiles) {
                            for (let i = 0, len = cssFiles.length; i < len; i++) {
                                let css = cssFiles[i], href = css.getAttribute('href');
                                if (href) Loader.css(href, false)
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
                                sc.src ? (sc.async ? Loader.js(sc.src, true) : syncs.push(Loader.js(sc.src, false))) : eval(sc.text)
                            }
                            Promises.order(syncs).then(() => {
                                back()
                            }).catch((u) => {
                                JSLogger.error('Load inner script fail: ' + u + '\n; parent html:' + url);
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

            static loadHTML(
                url: string, async?: boolean,
                opts?: {
                    appendTo?: string | HTMLElement,
                    ignore?: { script?: boolean, css?: boolean } | boolean,
                    prehandle?: (doc: HTMLDocument) => HTMLDocument
                }
            ): Promise<string> {
                if (!url) return Promise.reject(null);
                return Promises.create<string>(function () {
                    Http.get({
                        responseType: 'html',
                        url: url,
                        cache: false,
                        async: async
                    }).then((res) => {
                        let fn = opts && opts.prehandle;
                        Dom.applyHtml(fn ? fn(res.data) : res.data, opts && opts.appendTo, opts && opts.ignore).then(() => { this.resolve(url) })
                    })
                })
            }
            
        }
    }
}

import Dom = JS.util.Dom;
const $1 = Dom.$1;
const $L = Dom.$L;