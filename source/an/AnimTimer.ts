/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.7.0
 * @update Update for tick mode
 * 
 * @version 2.1.0
 * @author Frank.Feng
 */
module JS {

    export namespace an {

        export type AnimTimerEvents = TimerEvents | 'updating' | 'updated';
        export type AnimTimerInit = {
            /**
             * Delays (ms) the start of this animation.
             */
            delay?: number;
            /**
             * Delays (ms) the end of every loop.
             */
            endDelay?: number;
            /**
             * Max duration time(ms) of this animation.
             */
            duration: number;
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
         * The class AnimTimer allows to create a timer for an animation. 
         */
        export class AnimTimer extends Timer {
            protected _cfg: AnimTimerInit;

            constructor(tick: TimerTask, cfg?: AnimTimerInit) {
                super(tick, cfg);
            }

            private _runTask(t) {
                let T = this, d = T._cfg.duration;
                T._bus.fire(<AnimTimerEvents>'updating', [t, d, T._count + 1]);
                T._task(t);
                T._bus.fire(<AnimTimerEvents>'updated', [t, d, T._count + 1]);
            }

            // private _loopStart = false;
            private _loopEnd = false;

            private _loopTick(t: number) {
                if (!this.isRunning()) return;

                var T = this, c = T._cfg, p = <number>c.loop;
                if (T._count < p) {
                    var d = c.duration,
                        delay = T._count==0?0:(c.delay || 0),
                        endDelay = c.endDelay || 0,
                        et = t - T._ts;

                    T._et = et;//记录耗时
                    if (et >= delay && et < (d + delay)) {
                        if (T._loopEnd) {
                            T._loopEnd = false;
                            T._bus.fire(<TimerEvents>'looping', [T._count + 1]);
                        }
                        T._runTask(et - delay)
                    } else if (et >= (d + delay)) {
                        if(!T._loopEnd) {
                            T._runTask(d);
                            T._loopEnd = true;
                        }
                        if (et >= (d + delay + endDelay)) {
                            ++T._count;
                            T._ts = t;  //记录循环结束时间
    
                            T._bus.fire(<TimerEvents>'looped', [T._count]);
                        }
                    } 
                } else {
                    T._finish()
                }
            }

            protected _cancelTimer() {
                if (this._timer) cancelAnimationFrame(this._timer);
                this._timer = null;
            }

            pause() {
                this._cancelTimer();
                super.pause();
                return this
            }

            tick(ts: number) {
                let T = this;
                if (this._et == 0) {
                    this._ts0 = ts;
                    this._ts = ts;
                    this._count = 0;
                    this._pt = 0;

                    T._bus.fire(<TimerEvents>'starting');
                    this._loopEnd = true;
                    T._state(TimerState.RUNNING);
                }

                if (T.getState() == TimerState.PAUSED) {
                    //补上从暂停到现在的时间差
                    let dt = ts - T._pt;
                    T._ts0 += dt;
                    T._ts += dt;
                    T._pt = 0;
                    T._state(TimerState.RUNNING);
                }
                if (this.isRunning()) this._loopTick(System.highResTime())
            }

            private _loop(t) {
                this.tick(t);
                if (this.isRunning()) this._timer = requestAnimationFrame(function (ts) {
                    this._loop(ts)
                }.bind(this));
            }

            start() {
                if (this.isRunning()) return;

                this._timer = requestAnimationFrame((t: number) => {
                    this._loop(t);
                })
            }
        }
    }
}

import AnimTimer = JS.an.AnimTimer;
import AnimTimerInit = JS.an.AnimTimerInit;