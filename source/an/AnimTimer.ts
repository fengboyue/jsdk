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

        export type AnimTimerInit = {
            /**
             * Delays (ms) the start of this animation.
             */
            delay?: number;
            /**
             * Max duration time(ms) of this animation.
             */
            duration?: number;
            /**
             * Defines max repeat number of this animation.<br>
             * The default value is 1.<br>
             * <br>
             * True means is Infinity.<br>
             * False means is 0.<br>
             */
            loop?: boolean | number;
        }

        /**
         * The class AnimationTimer allows to create a timer, that is called in each frame while it is active. 
         */
        export class AnimTimer extends Timer {
            protected _cfg: AnimTimerInit;
            
            constructor(tick: TimerTask, cfg?: AnimTimerInit) {
                super(tick, cfg);

                let c = this._cfg;
                c.duration = c.duration || 1;
            }
            
            protected _loop(begin?:boolean) {
                if (this._sta != TimerState.RUNNING) return;

                let p = <number>this._cfg.loop;
                if (this._count < p) {
                    //update time
                    let d = this._cfg.duration, t0 = System.highResTime(), t = t0 - this._ts0;
                    this._et = t0 - this._ts;
                    let looping = this._count>1 && this._count<=(p-1);
                    if(begin && looping) this._bus.fire(<TimerEvents>'looping', [this._count+1]);
                        
                    let lp = false;
                    if (t > d) {
                        ++this._count;
                        if(looping) this._bus.fire(<TimerEvents>'looped', [this._count]);
                        //reset time
                        this._ts0 = t0;
                        lp = true;
                    } else {
                        this._tick.call(this, t);
                    }
                    this._ts = t0;

                    this._timer = requestAnimationFrame(() => {
                        this._loop(lp)
                    })
                } else {
                    this._finish()
                }
            }
            protected _cycle() {
                this._timer = requestAnimationFrame(() => {
                    this._loop(true)
                })
            }

            protected _cancelTimer() {
                if (this._timer) cancelAnimationFrame(this._timer);
                this._timer = null
            }
        }
    }
}

import AnimTimer = JS.an.AnimTimer;
import AnimTimerInit = JS.an.AnimTimerInit;
