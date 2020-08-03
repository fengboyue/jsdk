/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */

/// <reference path="../util/EventBus.ts"/>
/// <reference path="../util/URI.ts"/>

module JS {

    export namespace lang {

        /**
         * Thread runtime config
         */
        export type ThreadRunner = {
            /** thread's id */
            id: string;
            /**
             * library loading function
             */
            imports: (...urls: string[]) => void;
            /**
             * Triggered when main ui thread post data to the current thread.
             */
            onposted: (data: any) => void;
            /**
             * Post data to main ui thread in the current thread running. 
             */
            postMain: (data: any) => void;
            /**
             * Call method of thread class or function of ThreadRunner object in the current thread runing. 
             */
            callMain: (fnName: string, ...args: any[]) => void;
            /**
             * Call when the current thread be terminated.
             */
            terminate: () => void;
        }
        export interface Runnable {
            run: ((this: ThreadRunner) => void) | URLString;
        }
        export enum ThreadState {
            NEW = 'NEW',
            RUNNING = 'RUNNING',
            TERMINATED = 'TERMINATED',
            DESTROYED = 'DESTROYED'
        }

        /**
         * Preload libraries before thread running.
         */
        export type ThreadPreload = string|string[];

        let SYS_URL = null,
            _system = (srt: HTMLScriptElement)=>{
                let src = srt.src.replace(/\?.*/, '');
                return src.endsWith('/jscore.js')||src.endsWith('/jscore.min.js')?src:null
            }, _docSystem = function(doc: Document){
                let scripts = doc.getElementsByTagName('script');
                if(scripts) {
                    for(let i=0, len=scripts.length;i<len;i++){
                        let src = _system(scripts[i]);
                        if(src) return src;
                    }
                }
                let links = doc.querySelectorAll('link[rel=import]');
                if(links) {
                    for(let i=0, len=links.length;i<len;i++){
                        let link = <HTMLLinkElement>links[i];
                        if(link['import']) {
                            let src = _docSystem(link['import']);
                            if(src) return src;
                        }
                    }
                }
            }, 
            _findSystem=function(){
                if(SYS_URL) return SYS_URL;

                ////如在线程中启动线程，查找document则代码会异常；更好的方式是将system库路径同时缓存于当前线程代码中
                let p = (<any>self).__jsdk_sys_path;
                if(p) {SYS_URL = p; return SYS_URL};

                SYS_URL = _docSystem(document);
                return SYS_URL
            }

        @klass('JS.lang.Thread')
        export class Thread implements Runnable {
            public readonly id: string;
            private _wk: Worker;
            private _bus = new EventBus(this);
            private _state: ThreadState = ThreadState.NEW;
            private _url = null;
            private _libs: string[] = [];

            constructor(
                target?: Runnable | { run: (this: ThreadRunner) => void, [key: string]: any }, 
                preload?: ThreadPreload) {
                if (target) {
                    let members = Reflect.ownKeys(target);
                    for (let i = 0, len = members.length; i < len; i++) {
                        const key = members[i].toString();
                        if (key.startsWith('__') || key == 'constructor') continue;
                        const m = target[key];
                        if (Types.isFunction(m) || key == 'run') this[key] = m;
                    }
                }
                this.id = Random.uuid(4, 10);

                if(preload){
                    this._libs = this._libs.concat(typeof preload=='string'?[preload]:<string[]>preload);
                }
            }

            public getState() { return new String(this._state) }

            public run() { };

            private _define(fnName: string) {
                let fn = <Function>Thread._defines[fnName],
                    fnBody = fn.toString().replace(/^function/, '');
                return `this.${fnName}=function${fnBody}`
            }

            private _predefine(id: string) {
                let sys = _findSystem();
                return `
                //@ sourceURL=thread-${id}.js
                this.id="${id}";
                this.__jsdk_sys_path="${sys}";
                importScripts("${sys}");
                ${this._define('imports')}
                ${this._define('onposted')}
                ${this._define('postMain')}
                ${this._define('callMain')}
                ${this._define('terminate')}
                ${this._libs.length>0?`this.imports("${this._libs.join('","')}");`:''}`
            }

            private _stringify(fn: Function) {
                let script = this._predefine(this.id),
                    fnText = fn.toString().trim(),
                    fnBody = '';

                let rst = /[^{]+{((.|\n)*)}$/.exec(fnText);//取函数体代码
                if (rst) fnBody = rst[1];
                return `(()=>{${script}${fnBody}})()`
            }

            public isRunning() {
                return this._state == 'RUNNING'
            }
            public start() {
                if (this.isDestroyed()) return this._warn('start');
                if (this.isRunning()) this.terminate();

                this._state = ThreadState.RUNNING;

                if (Types.isString(this.run)) {
                    this._url = this.run;
                } else {
                    let fnString = this._stringify(this.run);
                    this._url = self.URL.createObjectURL(new Blob([fnString], {type : 'text/javascript'}));
                }
                this._wk = new Worker(this._url);
                this._wk.onmessage = e => {
                    let d = e.data;
                    if (d.cmd == 'CLOSE') {
                        this.terminate()
                    } else if ((<string>d.cmd).startsWith('#')) {
                        let fnName = (<string>d.cmd).slice(1);
                        this[fnName].apply(this, d.data);
                    } else {
                        this._bus.fire('message', [d.data])
                    }
                }
                this._wk.onerror = e => {
                    JSLogger.error(e, `Thread<${this.id}> run error!`)
                    this._bus.fire('error', [e.message]);
                    this.terminate();
                }

                return this
            }
            public terminate() {
                if (this.isDestroyed()) return this;
                if (this._wk) this._wk.terminate();
                if (this._url) window.URL.revokeObjectURL(this._url);//通知浏览器释放此临时URL对象所占用的内存
                this._state = ThreadState.TERMINATED;
                this._wk = null;
                this._url = null;
                return this
            }
            public destroy() {
                setTimeout(() => {
                    this.terminate();
                    this._state = ThreadState.DESTROYED;
                    this._bus.destroy();
                }, 100)//可能正在通信，延迟100毫秒关闭
            }
            public isDestroyed() {
                return this._state == 'DESTROYED'
            }

            public on(e: 'message', fn: EventHandler<this>):this
            public on(e: 'error', fn: EventHandler<this>):this
            public on(e: 'message' | 'error', fn: EventHandler<this>) {
                this._bus.on(e, fn);
                return this
            }
            public off(e: 'message' | 'error'):this {
                this._bus.off(e);
                return this
            }

            private _warn(act: string) {
                JSLogger.warn(`Cannot ${act} from Thread<id=${this.id};state=${this._state}>!`)
                return this
            }

            public postThread(data: any, transfer?: Array<ArrayBuffer | MessagePort | ImageBitmap>) {
                if (this._state != 'RUNNING') return this._warn('post data');
                if (this._wk) this._wk.postMessage.apply(this._wk, Check.isEmpty(transfer) ? [data] : [data].concat(transfer));
                return this
            }

            /**
             * Init context is in a independent running thread file.
             */
            public static initContext(): ThreadRunner {
                if ((<any>self).imports) return <any>self;
                (<any>self).imports = this._defines['imports'];
                (<any>self).onposted = this._defines['onposted'];
                (<any>self).postMain = this._defines['postMain'];
                (<any>self).callMain = this._defines['callMain'];
                (<any>self).terminate = this._defines['terminate'];
                return <any>self
            }

            private static _defines = {
                imports: function (...urls: string[]) {
                    urls.forEach(u => {
                        importScripts((<any>self).URI.toAbsoluteURL(u))
                    })
                },
                onposted: function (fn) {
                    self.addEventListener('message', function (e) {
                        fn.call(self, e.data);
                    }, false);
                },
                postMain: function (data) {
                    self.postMessage({ cmd: 'DATA', data: data }, null);
                },
                callMain: function (fnName, ...args) {
                    self.postMessage({ cmd: '#' + fnName, data: Array.prototype.slice.call(arguments, 1) }, null);
                },
                terminate: function () {
                    self.postMessage({ cmd: 'CLOSE' }, null);
                }
            }

        }
    }
}
import Runnable = JS.lang.Runnable;
import Thread = JS.lang.Thread;
import ThreadRunner = JS.lang.ThreadRunner;
import ThreadState = JS.lang.ThreadState;
import ThreadPreload = JS.lang.ThreadPreload;