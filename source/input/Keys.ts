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
/// <reference path="Keyboards.ts"/>

module JS {

    export namespace input {

        let J = Jsons;

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

        export class Keys {
            private _m: JsonObject<number>;//用于记录所有当前正在按住的键的按下时间戳；
            private _q: Queue<number>;//Queue<keyCode> 用于记录16个最近按下的键
            private _mapping: JsonObject<string> = {}; //<keyChars, keyCodes>

            private _busDown: EventBus;
            private _busUp: EventBus;
            private _d: boolean = false;
            private _i: number = Infinity; //unit is ms, max interval time of Seqkeys
            private _ts: number = 0; //上一次的按键时刻for seqKeys

            constructor(el?: HTMLElement) {
                let ele = <any>el || window, T = this;
                T._m = {};
                T._q = new Queue(16);
                T._busDown = new EventBus(ele);
                T._busUp = new EventBus(ele);

                ele.on('keydown', (e: KeyboardEvent) => {
                    let c = e.keyCode,
                        sz = T._q.size(),
                        lastC = T._q.get(sz - 1),
                        repeat = sz > 0 && c === lastC;

                    if (T._q.isFull()) T._q.remove();
                    //不记录重复按键
                    if (!repeat) {
                        //第一次则认为上次按键即现在
                        if(lastC == null) T._ts = e.timeStamp;
                        //小于最大间隔时间才被记录
                        if (e.timeStamp - T._ts <= T._i) 
                        T._q.add(c)
                    }
                    //记录按键时间
                    T._ts = e.timeStamp;

                    //没记录或与上一次按键不同的键，则更新的时间戳
                    if (!J.hasKey(T._m, c) || !repeat) T._m[c] = e.timeStamp;

                    //不重复且有记录时，作事件触发检查
                    if (!repeat && J.hasKey(T._m, c)) T._fireCheck(c, T._busDown)
                });
                ele.on('keyup', (e: KeyboardEvent) => {
                    let c = e.keyCode;
                    if (J.hasKey(T._m, c)) {
                        T._fireCheck(c, T._busUp);
                        //按键释放后删除记录
                        delete T._m[e.keyCode];
                    }
                })
            }

            private _fireCheck(c: number, bus: EventBus){
                let T = this, types = bus.types();
                types.forEach(ty => {
                    if (T.isHotKeys(ty) && T._endsWithCode(c, ty, '+') && T._isHotKeysPressing(ty))
                        bus.fire(Keyboards.newEvent(ty, {keyCode: c}), [this]);
                    if (T.isSeqKeys(ty) && T._endsWithCode(c, ty, ',') && T._isSeqKeysPressing(ty))
                        bus.fire(Keyboards.newEvent(ty, {keyCode: c}), [this]);
                    if (VK[ty] == c && T.isPressingKey(c))
                        bus.fire(Keyboards.newEvent(ty, {keyCode: c}), [this]);
                })
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

            private _on(k: string, fn: Function, bus: EventBus) {
                let T = this, ty = T._keyChar(k);
                //keyChar表达式转换为keyCode表达式并缓存
                if (!J.hasKey(T._mapping, ty)) T._mapping[ty] = T._numeric(ty, T.isHotKeys(ty) ? '+' : (T.isSeqKeys(ty) ? ',' : ''));
                bus.on(ty, fn);
                return T
            }
            public onKeyDown(k: Hotkeys | Seqkeys, fn: (this: Window | HTMLElement, e: KeyboardEvent, kb: Keys) => void) {
                return this._on(k, fn, this._busDown)
            }
            public onKeyUp(k: Hotkeys | Seqkeys, fn: (this: Window | HTMLElement, e: KeyboardEvent, kb: Keys) => void) {
                return this._on(k, fn, this._busUp)
            }

            private _off(bus: EventBus, k?: Hotkeys | Seqkeys) {
                this._check();
                bus.off(k ? this._keyChar(k) : undefined)
                return this
            }

            public offKeyDown(k?: Hotkeys | Seqkeys) {
                return this._off(this._busDown, k)
            }
            public offKeyUp(k?: Hotkeys | Seqkeys) {
                return this._off(this._busUp, k)
            }

            private _equalsSeqkeys(keys: Array<string>, keyCodes: string) {
                let sa = '';
                keys.forEach((b, i) => {
                    if (i == 0) {
                        sa += VK[b]
                    } else {
                        sa += `,${VK[b]}`
                    }
                })
                return keyCodes.endsWith(sa + ']')
            }

            private _isSeqKeysPressing(k: Seqkeys) {
                let a = k.split('\,'), l = a.length;
                if (l == 1) return false;

                let lk = a[l - 1], m = this, codes = this._q.toString();//取最后一位keyChar
                if (m.isHotKeys(lk)) {//可能是hotkeys
                    if (!m._isHotKeysPressing(lk)) return false;
                    a.remove(l - 1);
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
                let T = this, s = T._keyChar(k), a = s.split('\+');
                if (a.length == 1) return false;
                return a.every((b, i) => {
                    if (i > 0 && !T.beforeKeyDown(a[i - 1], b)) return false
                    return T.isPressingKey(b)
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
                let T = this, k = T._keyChar(keys);
                if (!k) return false;

                if (T.isSeqKeys(k)) {
                    return T._isSeqKeysPressing(k)
                } else if (T.isHotKeys(k)) {
                    return T._isHotKeysPressing(k)
                }
                return this.isPressingKey(VK[k])
            }
            /**
             * True if the key code is pressing.
             * 
             * @param c keyCode or keyChar
             */
            public isPressingKey(c: number | string) {
                let T = this, n = c == void 0 ? null : (Types.isNumber(c) ? c : VK[T._keyChar(<string>c)]);
                return J.hasKey(T._m, n)
            }

            /**
             * Returns the clone queue<keyCode> of current pressing keys.<br>
             * Note: Max size of queue is 16.
             */
            public getPressingQueue() {
                return this._q.clone()
            }

            /**
             * Gets/Sets the max interval time of Seqkeys.
             */
            public seqInterval(): number
            public seqInterval(t: number): this
            public seqInterval(t?: number): any {
                if (t == void 0) return this._i;
                this._i = t;
                return this
            }

            /**
             * Returns the timeStamp(ms) of a key when it was keydown recently.<br>
             * Note: If no record of the key then returns 0.
             * 
             * @param c keyCode or keyChar
             */
            public getKeyDownTime(c: number | string): number {
                let T = this, n = c == void 0 ? null : (Types.isNumber(c) ? c : VK[T._keyChar(<string>c)]);
                return !J.hasKey(T._m, n) ? 0 : T._m[n]
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
                let T = this;
                T._check();
                T._busDown.off();
                T._busUp.off();
                return T
            }
            /**
             * Clear all records or one keyCode's record.
             * @param c keyCode
             */
            public clear(c?: number | Array<number>) {
                let T = this;
                if (c == void 0) {
                    T._mapping = {};
                    T._m = {};
                    T._q.clear();
                    T._ts = 0;
                    return
                }
                let a = Types.isNumber(c) ? [c] : <Number[]>c;
                a.forEach(k => {
                    T._m[k] = null;
                })
                return T
            }

            private _check() {
                if (this._d) throw new NotHandledError()
            }
            public destroy() {
                let T = this;
                T._d = true;
                T.clear();
                T._busDown.destroy();
                T._busUp.destroy()
            }
        }

    }
}
import Keys = JS.input.Keys;