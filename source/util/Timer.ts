/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.1.0
 * @date 2020/7/1
 * @author Frank.Feng
 * @update Realized constant interval time for constant FPS, which be named as "OF" mode. 
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
module JS {

    export namespace util {

        export type TimerTask = (this: Timer, elapsedTime: number) => void;

        export type TimerInit = {
            /**
             * Delays (ms) the start of Timer.
             */
            delay?: number;
            /**
             * Defines max loop of task.<br>
             * True means is Infinity.<br>
             * False means is 0.<br>
             * <br>
             * The default value is 1.
             */
            loop?: boolean | number,
            /**
             * millisecond.
             */
            interval?: number,
            /**
             * BF means the interval time which is between every task.<br>
             * OF means the interval time which is occupied by every task. <br>
             * If you want to keep in a constant task rate, you should select OF.<br>
             * Note: The timer may skip some executions of the task in OF mode when the execution time exceeded the interval time.
             * <br>
             * The default mode is BF that is safe.
             */
            intervalMode?: 'OF' | 'BF'
        }

        export type TimerEvents = 'starting' | 'finished' | 'looping' | 'looped' | 'pausing' | 'paused';

        export enum TimerState { STOPPED, RUNNING, PAUSED }

        export class Timer {
            protected _bus = new EventBus(this);
            protected _cfg: TimerInit;
            protected _task: TimerTask;
            protected _timer;
            protected _sta: TimerState = TimerState.STOPPED;

            protected _ts0;  //save timestamp at starting
            protected _ts: number = 0; //timestamp of prev task
            protected _et: number = 0; //elapsed time of prev task
            protected _pt: number = 0; //pause time 
            protected _count = 0;

            constructor(task: TimerTask, cfg?: TimerInit) {
                this._task = task;
                this._config(cfg);
            }

            on(type: TimerEvents, fn: EventHandler<this>) {
                this._bus.on(type, fn);
                return this
            }
            off(type: TimerEvents, fn?: EventHandler<this>) {
                this._bus.off(type, fn);
                return this
            }

            count() {
                return this._count
            }

            private _config(cfg: TimerInit): any {
                this._cfg = Jsons.union(<TimerInit>{
                    delay: 0,
                    loop: 1,
                    interval: 0,
                    intervalMode: 'BF'
                }, this._cfg, cfg);

                let c = this._cfg;
                if (c.interval != void 0 && c.interval < 0) c.interval = 0;
                let l = c.loop;
                l = l == false || l < 0 ? 0 : (l === true ? Infinity : l);
                c.loop = l;
                return this
            }

            pause() {
                let m = this;
                if (!m.isRunning()) return m;

                m._bus.fire(<TimerEvents>'pausing', [m._count + 1]);
                m._state(TimerState.PAUSED);
                m._pt = System.highResTime();//record pause time
                m._bus.fire(<TimerEvents>'paused', [m._count + 1]);

                return m
            }

            protected _cancelTimer() {
                if (this._timer) window.clearTimeout(this._timer);
                this._timer = null;
            }

            protected _reset() {
                let m = this;
                m._cancelTimer();
                m._state(TimerState.STOPPED);
                m._count = 0;
                m._ts0 = 0;
                m._ts = 0;
                m._et = 0;
                m._pt = 0;
            }
            stop() {
                this._finish();
                return this
            }
            protected _finish() {
                this._reset();
                this._bus.fire(<TimerEvents>'finished');
            }
            /**
             * Returns state of the timer
             */
            getState(): TimerState {
                return this._sta
            }
            isRunning(): boolean {
                return this.getState() == TimerState.RUNNING
            }
            protected _state(s: TimerState) {
                this._sta = s
            }

            /**
             * Returns current frame rate.
             */
            fps() {
                return this._et == 0 ? 0 : 1000 / this._et
            }
            maxFPS() {
                let t = this._cfg.interval;
                return t == 0 ? Infinity : 1000 / t
            }
            looped() {
                return this._count+1
            }

            private _loopTask(skip?: boolean) {
                if (!this.isRunning()) return;//暂停时停止执行此函数

                let T = this, p = <number>T._cfg.loop;
                if (T._count < p) {
                    let t = 0, opts = T._cfg, t0 = System.highResTime();
                    T._et = t0 - T._ts;//update frame time

                    if (!skip) {
                        T._bus.fire(<TimerEvents>'looping', [T._count + 1]);
                        T._task.call(T, T._et);
                        T._bus.fire(<TimerEvents>'looped', [T._count + 1]);

                        let t1 = System.highResTime();
                        t = t1 - t0;
                        ++T._count;
                    }
                    //update timestamp
                    T._ts = t0;

                    let d = opts.interval - t,
                        needSkip = opts.intervalMode == 'OF' && d < 0;
                    
                    if(needSkip) {
                        T._loopTask(needSkip)
                    } else {
                        T._timer = setTimeout(
                            () => { T._loopTask(needSkip) },
                            opts.intervalMode == 'BF' ? opts.interval : d
                        )
                    } 
                } else {
                    T._finish()
                }
            }

            protected _start(begin:boolean){
                this._loopTask(!begin)
            }

            /**
             * Execute a ticker periodly.
             * 周期性执行任务
             */
            start() {
                let T = this;
                if (this.isRunning()) return;

                let first = false, wait = T._cfg.delay;
                if (T.getState() == TimerState.PAUSED) {
                    wait = 0;
                    //补上从暂停到现在的时间差
                    let dt = System.highResTime() - T._pt;
                    T._ts0 += dt;
                    T._ts += dt;
                    T._pt = 0;
                } else {
                    first = true;
                    T._reset();
                }
                T._state(TimerState.RUNNING);

                T._timer = setTimeout(() => {
                    if (first) {
                        this._ts0 = System.highResTime();
                        this._ts = this._ts0;
                        T._bus.fire(<TimerEvents>'starting');
                    }
                    T._start(first);
                }, wait);
            }

        }
    }
}

import Timer = JS.util.Timer;
import TimerState = JS.util.TimerState;
import TimerEvents = JS.util.TimerEvents;
import TimerTask = JS.util.TimerTask;
import TimerInit = JS.util.TimerInit;