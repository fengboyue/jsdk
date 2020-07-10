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
                let m = this;
                Jsons.some(frames, (v, k) => {
                    if (k == 'from' || k == '0%') {
                        m._from = this._convertFrame(v)
                    } else if (k == 'to' || k == '100%') {
                        m._to = this._convertFrame(v)
                    }
                    return m._from!=void 0 && m._to!=void 0
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
                    Jsons.forEach(<JsonObject>from, (v, k) => {
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
                let m = this,
                    fwd = m._dir == 'forward';

                if(!Check.isEmpty(this._frames)) {
                    let n = Number(t * 100 / d).round(2), key, delKeys=[];
                    Jsons.forEach(this._frames, (v, k) => {
                        let nk = this._num(k);
                        if (!nk.isNaN() && nk.round(2) <= n) {
                            delKeys.push(k);
                            if(nk > this._num(key)) key = k
                        }
                    })
                    if (key) {
                        m._frame = this._convertFrame(this._frames[key]);
                        delKeys.forEach((v)=>{delete this._frames[v]});
                        return m._frame
                    }
                }

                let from = fwd ? m._from : m._to, to = fwd ? m._to : m._from;
                return this._newFrame(from, to, t, d, e)
            }

            private _reset4loop(){
                let m = this;
                m._frame = null;
                m._frames = Jsons.clone(m._cfg.frames);
                delete m._frames.from;
                delete m._frames.to;
                delete m._frames['0%'];
                delete m._frames['100%'];
            }
            protected _reset(){
                let m = this;
                m._frame = null;
                m._frames = null;
                super._reset()
            }

            private _resetFrame(){
                this._onUpdate(this._dir == 'forward'?this._from:this._to);
            }
            protected _resetInitial(){}

            public play() {
                let m = this, r = m._timer, c = m._cfg;
                if (!r) {
                    m._reset();
                
                    r = new AnimTimer((et) => {
                        m._onUpdate.call(m, m._calc(c.duration, et, c.easing));
                    }, {
                        delay: c.delay,
                        duration: c.duration,
                        loop: c.loop
                    });
                    if (c.onStarting) r.on(<AnimTimerEvents>'starting', () => {
                        c.onStarting.call(m);
                        m._resetFrame()
                    });
                    r.on(<AnimTimerEvents>'looping', (e, ct: number) => {
                        m._loop = ct;
                        m._reset4loop();
                        if (ct>1 && c.autoReverse) m.direction(m._dir == 'backward' ? 'forward' : 'backward');
                        if(!c.autoReverse) m._resetFrame()
                    });
                    r.on(<AnimTimerEvents>'finished', () => {
                        if(c.autoReset) m._resetInitial()
                        if (c.onFinished) c.onFinished.call(m);
                        m._reset();
                    });

                    m._timer = r;
                }
                if(m.getState()==AnimState.RUNNING) return m; 

                if(m._from==void 0||m._to==void 0) throw new NotFoundError('Not found "from" or "to"!');
                r.start();
                return m
            }

            public stop() {
                super.stop()
                let m = this, c = m._cfg;
                if(c.autoReset) m._resetInitial()
                return m
            }

        }
    }
}

import ElementAnimConfig = JS.an.ElementAnimConfig;
import ElementAnim = JS.an.ElementAnim;