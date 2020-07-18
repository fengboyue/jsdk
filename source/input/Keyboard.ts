/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.2.0
 * @author Frank.Feng
 */
/// <reference path="../ds/Queue.ts"/>
/// <reference path="VK.ts"/>
/// <reference path="UIMocker.ts"/>

module JS {

    export namespace input {

        /** 
         * keychar1 , keychar2 , ... , keycharN-1, keycharN|Hotkeys <br>
         * <br>
         * Examples:
         * <pre>
         * A,B,C,D
         * A,B,C+D
         * </pre>
         */
        export type Seqkeys = string;
        /** 
         * keychar1 + keychar2 + ... + keycharN <br>
         * <br>
         * Examples:
         * <pre>
         * A+B+C+D
         * </pre>
         */
        export type Hotkeys = string;

        export class Keyboard {
            private _m: JsonObject<number>;//用于记录所有当前正在按住的键的按下时间戳；
            private _q: Queue<number>;//Queue<keyCode> 用于记录16个最近按下的键
            private _mapping: JsonObject<string> = {}; //<keyChars, keyCodes>

            private _busDown: EventBus;
            private _busUp: EventBus;
            private _d: boolean = false;

            constructor(el?: HTMLElement) {
                let ele = el || window, m = this;
                m._m = {};
                m._q = new Queue(16);
                m._busDown = new EventBus(ele);
                m._busUp = new EventBus(ele);

                ele.on('keydown', (e: KeyboardEvent) => {
                    let c = e.keyCode, sz = m._q.size(), repeat = sz>0 && c == m._q.get(sz - 1);

                    if (m._q.isFull()) m._q.remove();
                    //不记录重复按键
                    if(!repeat) m._q.add(c);

                    //没记录或与上一次按键不同的键，则更新的时间戳
                    if (!Jsons.hasKey(m._m, c)|| !repeat) m._m[c] = e.timeStamp;

                    if (!repeat && Jsons.hasKey(m._m, c)) {
                        let types = m._busDown.types();
                        types.forEach(ty => {
                            if (m.isHotKeys(ty) && m._endsWithCode(c, ty, '+') && m._isHotKeysPressing(ty)) 
                                m._fireKeys(ty, c, m._busDown);
                            if (m.isSeqKeys(ty) && m._endsWithCode(c, ty, ',') && m._isSeqKeysPressing(ty)) 
                                m._fireKeys(ty, c, m._busDown);
                            if (VK[ty] == c && m.isPressingKey(c)) 
                                m._fireKeys(ty, c, m._busDown);
                        })
                    }
                });
                ele.on('keyup', (e: KeyboardEvent) => {
                    let c = e.keyCode;
                    if (Jsons.hasKey(m._m, c)) {
                        let types = m._busUp.types();
                        types.forEach(ty => {
                            if (m.isHotKeys(ty) && m._endsWithCode(c, ty, '+') && m._isHotKeysPressing(ty)) 
                                m._fireKeys(ty, c, m._busUp);
                            if (m.isSeqKeys(ty) && m._endsWithCode(c, ty, ',') && m._isSeqKeysPressing(ty)) 
                                m._fireKeys(ty, c, m._busUp);
                            if (VK[ty] == c && m.isPressingKey(c)) 
                                m._fireKeys(ty, c, m._busUp);
                        })
                        delete m._m[e.keyCode];
                    }
                })
            }

            private _fireKeys(ty: string, c:number, bus:EventBus) {
                bus.fire(UIMocker.newKeyEvent(ty, c), [this])
            }

            private _endsWithCode(c: number, ty: string, sn: string) {
                return (this._mapping[ty] + sn).endsWith(c + sn)
            }

            public isSeqKeys(k: string) {
                return k && k.indexOf(',') > 0
            }
            public isHotKeys(k: string) {
                return k && k.indexOf('+') > 0
            }

            private _on(k: string, fn:Function, bus:EventBus){
                let m = this, ty = m._keyChar(k);
                //keyChar表达式转换为keyCode表达式并缓存
                if (!Jsons.hasKey(m._mapping, ty)) m._mapping[ty] = m._numeric(ty, m.isHotKeys(ty) ? '+' : (m.isSeqKeys(ty) ? ',' : '')); 
                bus.on(ty, fn)
            }
            public onKeyDown(k: Hotkeys | Seqkeys, fn: (this: Window | HTMLElement, e: KeyboardEvent, kb: Keyboard) => void) {
                this._on(k,fn,this._busDown)
            }
            public onKeyUp(k: Hotkeys | Seqkeys, fn: (this: Window | HTMLElement, e: KeyboardEvent, kb: Keyboard) => void) {
                this._on(k,fn,this._busUp)
            }
            
            private _off(bus:EventBus, k?:Hotkeys | Seqkeys){
                this._check();
                bus.off(k?this._keyChar(k):undefined)
            }
            
            public offKeyDown(k?: Hotkeys | Seqkeys) {
                this._off(this._busDown, k)
            }
            public offKeyUp(k?: Hotkeys | Seqkeys) {
                this._off(this._busUp, k)
            }

            private _equalsSeqkeys(keys:Array<string>, keyCodes:string){
                let sa = '';
                keys.forEach((b, i) => {
                    if (i == 0) {
                        sa += VK[b]
                    } else {
                        sa += `,${VK[b]}`
                    }
                })
                return keyCodes.endsWith(sa+']')
            }

            private _isSeqKeysPressing(k: Seqkeys) {
                let a = k.split('\,'), l = a.length;
                if (l == 1) return false;

                let lk = a[l - 1], m = this, codes = this._q.toString();//取最后一位keyChar
                if (m.isHotKeys(lk)) {//可能是hotkeys
                    if (!m._isHotKeysPressing(lk)) return false;
                    a.remove(l-1);
                    a.add(lk.split('\+'))
                } else {
                    if (!m.isPressingKey(lk)) return false;
                }
                return this._equalsSeqkeys(a, codes)
            }

            private _keyChar(s: string) {
                return s.replace(/\s*/g, '').toUpperCase()
            }

            private _isHotKeysPressing(k: Hotkeys) {
                let m = this, s = m._keyChar(k), a = s.split('\+');
                if (a.length == 1) return false;
                return a.every((b, i) => {
                    if (i > 0 && !m.beforeKeyDown(a[i - 1], b)) return false
                    return m.isPressingKey(b)
                })
            }

            private _numeric(ty: string, sign: string) {
                if (!sign) return VK[ty];
                let a = ty.split(sign), sk = '';
                a.forEach(k => {
                    sk += `${!sk ? '' : sign}${VK[k.toUpperCase()]}`
                })
                return sk
            }

            /**
             * Whether a hotkeys or a seqkeys or a keyChar is pressing.
             * @param keys 
             */
            public isPressingKeys(keys: Hotkeys | Seqkeys | string) {
                let m = this, k = m._keyChar(keys);
                if (!k) return false;

                if (m.isSeqKeys(k)) {
                    return m._isSeqKeysPressing(k)
                } else if (m.isHotKeys(k)) {
                    return m._isHotKeysPressing(k)
                }
                return this.isPressingKey(VK[k])
            }
            /**
             * True if the key code is pressing.
             * 
             * @param c keyCode or keyChar
             */
            public isPressingKey(c: number | string) {
                let m = this, n = c == void 0 ? null : (Types.isNumber(c) ? c : VK[m._keyChar(<string>c)]);
                return Jsons.hasKey(m._m, n)
            }

            /**
             * Returns the clone queue<keyCode> of current pressing keys.<br>
             * Note: Max size of queue is 16.
             */
            public getPressingQueue() {
                return this._q.clone()
            }

            /**
             * Returns the timeStamp(ms) of a key when it was keydown recently.<br>
             * Note: If no record of the key then returns 0.
             * 
             * @param c keyCode or keyChar
             */
            public getKeyDownTime(c: number | string): number {
                let m = this, n = c == void 0 ? null : (Types.isNumber(c) ? c : VK[m._keyChar(<string>c)]);
                return !Jsons.hasKey(m._m, n) ? 0 : m._m[n]
            }
            /**
             * Returns true if keyCode1's keydown time is before than keyCode2's recently.<br>
             * Note: If no records of keyCode1 or keyCode2 then returns false.
             * @param k1 keyCode1
             * @param k2 KeyCode2
             */
            public beforeKeyDown(k1: number | string, k2: number | string): boolean {
                let d1 = this.getKeyDownTime(k1), d2 = this.getKeyDownTime(k2);
                return d1 > 0 && d2 > 0 && d1 < d2
            }

            public off() {
                this._check();
                this._busDown.off();
                this._busUp.off();
            }
            /**
             * Clear all records or one keyCode's record.
             * @param c keyCode
             */
            public clear(c?: number | Array<number>) {
                let m = this;
                if (c == void 0) {
                    m._mapping = {};
                    m._m = {};
                    m._q.clear();
                    return
                }
                let a = Types.isNumber(c) ? [c] : <Number[]>c;
                a.forEach(k => {
                    m._m[k] = null;
                })
            }

            private _check() {
                if (this._d) throw new NotHandledError()
            }
            public destroy() {
                let m = this;
                m._d = true;
                m.clear();
                m._busDown.destroy();
                m._busUp.destroy()
            }
        }

    }
}
import Keyboard = JS.input.Keyboard;