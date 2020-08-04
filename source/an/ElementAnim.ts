/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.1.0
 * @author Frank.Feng
 */
module JS {

    export namespace an {

        let J = Jsons;
        export class ElementAnimConfig extends AnimConfig {
            el: HTMLElement|string;
            frames: KeyFrames;
        }

        export abstract class ElementAnim extends Anim {
            protected _cfg: ElementAnimConfig;
            protected _el: HTMLElement;
            protected _frame: KeyFrame;//前一个指定帧
            private _from: KeyFrame;
            private _to: KeyFrame;

            private _frames: KeyFrames; //frames副本

            constructor(cfg: ElementAnimConfig) {
                super(cfg);
            }

            protected abstract _onUpdate(newFrame: KeyFrame) :void;
            
            private _parseFrames(frames) {
                let T = this;
                J.some(frames, (v, k) => {
                    if (k == 'from' || k == '0%') {
                        T._from = this._convertFrame(v)
                    } else if (k == 'to' || k == '100%') {
                        T._to = this._convertFrame(v)
                    }
                    return T._from!=void 0 && T._to!=void 0
                })
            }

            public config<T extends ElementAnimConfig>(): T
            public config<T extends ElementAnimConfig>(cfg: T): this
            public config(cfg?: ElementAnimConfig): any {
                if (!cfg) return this._cfg;

                if(cfg.el) this._el = $1(cfg.el);
                if (cfg.frames) this._parseFrames(cfg.frames);
                
                return super.config(cfg)
            }
            
            private _num(k:string){
                return k?Number(k.substr(0, k.length - 1)):0
            }

            protected _newFrame(from:KeyFrame, to:KeyFrame, t:number, d:number, e:EasingFunction):number|JsonObject<number>|JsonObject<JsonObject<number>>{
                if(Types.isNumber(from)){
                    return this._newVal(t, d, from, to, e, this._frame);
                }else{
                    let json = {};
                    J.forEach(<JsonObject>from, (v, k) => {
                        json[k] = this._newVal(t, d, from[k], to[k], e, this._frame==void 0?null:this._frame[k])
                    })
                    return json
                }
            }
            protected _newVal(t: number, d:number, from: number, to: number, e:EasingFunction, base: number):number {
                let n = e.call(null, t, from, to - from, d);
                if(base==void 0) return n;
                let tx = from>=to?'min':'max';
                return Math[tx](n, base)
            }
            private _calc(d: number, t: number, e: EasingFunction): KeyFrame {
                let T = this,
                    fwd = T._dir == 'forward';

                if(!Check.isEmpty(T._frames)) {
                    let n = Number(t * 100 / d).round(2), key, delKeys=[];
                    J.forEach(T._frames, (v, k) => {
                        let nk = T._num(k);
                        if (!nk.isNaN() && nk.round(2) <= n) {
                            delKeys.push(k);
                            if(nk > T._num(key)) key = k
                        }
                    })
                    if (key) {
                        T._frame = T._convertFrame(T._frames[key]);
                        delKeys.forEach((v)=>{delete T._frames[v]});
                        return T._frame
                    }
                }

                let from = fwd ? T._from : T._to, to = fwd ? T._to : T._from;
                return T._newFrame(from, to, t, d, e)
            }

            private _reset4loop(){
                let T = this;
                T._frame = null;
                T._frames = J.clone(T._cfg.frames);
                delete T._frames.from;
                delete T._frames.to;
                delete T._frames['0%'];
                delete T._frames['100%'];
            }
            protected _reset(){
                let T = this;
                T._frame = null;
                T._frames = null;
                super._reset()
            }

            private _resetFrame(){
                this._onUpdate(this._dir == 'forward'?this._from:this._to);
            }
            protected _resetInitial(){}

            public play() {
                let T = this, r = T._timer, c = T._cfg;
                if (!r) {
                    T._reset();
                
                    r = new AnimTimer((et) => {
                        T._onUpdate.call(T, T._calc(c.duration, et, c.easing));
                    }, {
                        delay: c.delay,
                        duration: c.duration,
                        loop: c.loop
                    });
                    if (c.onStarting) r.on(<AnimTimerEvents>'starting', () => {
                        c.onStarting.call(T);
                        T._resetFrame()
                    });
                    r.on(<AnimTimerEvents>'looping', (e, ct: number) => {
                        T._loop = ct;
                        T._reset4loop();
                        if (ct>1 && c.autoReverse) T.direction(T._dir == 'backward' ? 'forward' : 'backward');
                        if(!c.autoReverse) T._resetFrame()
                    });
                    r.on(<AnimTimerEvents>'finished', () => {
                        if(c.autoReset) T._resetInitial()
                        if (c.onFinished) c.onFinished.call(T);
                        T._reset();
                    });

                    T._timer = r;
                }
                if(T.getState()==AnimState.RUNNING) return T; 

                if(T._from==void 0||T._to==void 0) throw new NotFoundError('Not found "from" or "to"!');
                r.start();
                return T
            }

            public stop() {
                super.stop()
                let T = this, c = T._cfg;
                if(c.autoReset) T._resetInitial()
                return T
            }

        }
    }
}

import ElementAnimConfig = JS.an.ElementAnimConfig;
import ElementAnim = JS.an.ElementAnim;