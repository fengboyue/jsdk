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

        export type TimerTask = (this: Timer, elapsedTime:number) => void;

        export type TimerConfig = {
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
             * <br>
             * The default is OF.
             */
            intervalMode?: 'OF'|'BF'
        }


        export type TimerEvents = 'starting' | 'finished'

        export enum TimerState {STOPPED, RUNNING, PAUSED}

        export class Timer {
            protected _bus = new EventBus(this);
            protected _cfg: TimerConfig;
            protected _tick: TimerTask;
            protected _timer;
            protected _sta: TimerState = TimerState.STOPPED;

            protected _ts0;  //save timestamp at starting
            protected _ts: number = 0; //timestamp of prev task
            protected _et: number = 0; //elapsed time of prev task
            protected _pt: number = 0; //pause time 
            protected _count = 0;
            
            constructor(tick: TimerTask, cfg?: TimerConfig) {
                this._tick = tick;  
                this.config(cfg);            
            }

            public on(type: string, fn:EventHandler<this>){
                this._bus.on(type, fn);
                return this
            }
            public off(type: string, fn?:EventHandler<this>){
                this._bus.off(type, fn);
                return this
            }

            public count() {
                return this._count
            }

            public config(): TimerConfig
            public config(cfg?: TimerConfig): this
            public config(cfg?: TimerConfig): any{
                if(!cfg) return this._cfg;
                
                this._cfg = Jsons.union({
                    delay: 0,
                    loop: 1,
                    interval: 0,
                    intervalMode: 'OF'
                }, this._cfg, cfg);
                
                let c = this._cfg;
                if (c.interval!=void 0 && c.interval < 0) c.interval = 0;
                let l = c.loop;
                l = l == false || l < 0?0:(l===true?Infinity:l);
                c.loop = l;
                return this
            }

            public pause() {
                let m =this;
                if (m._sta != TimerState.RUNNING) return m;
                m._sta = TimerState.PAUSED;

                m._pt = System.highResTime();//record pause time
                return m
            }

            protected _cancelTimer(){
                if (this._timer) window.clearTimeout(this._timer);
                this._timer = null;
            }

            protected _reset() {
                let m =this;
                m._cancelTimer();
                m._sta = TimerState.STOPPED;
                m._count = 0;
                m._ts0 = 0;
                m._ts = 0; 
                m._et = 0; 
                m._pt = 0;
            }
            public stop() {
                this._reset();
                return this
            }
            protected _finish() {
                this._reset();
                this._bus.fire(<TimerEvents>'finished');
            }
            /**
             * Returns state of the timer
             */
            public getState(): TimerState {
                return this._sta
            }

            /**
             * Returns current frame rate.
             */
            public fps() {
                return this._et == 0 ? 0 : 1000 / this._et
            }
            public maxFPS() {
                let t = this._cfg.interval;
                return t == 0 ? Infinity : 1000 / t
            }

            protected _cycle(skip?: boolean) {
                if (this._sta != TimerState.RUNNING) return;//暂停时停止执行此函数

                if (this._count < this._cfg.loop) {
                    let t = 0, opts = this._cfg, t0 = System.highResTime();
                    this._et = t0 - this._ts;//update frame time
                    
                    if (!skip) {
                        this._count++;
                        this._tick.call(this, this._et);
                        let t1 = System.highResTime();
                        t = t1 - t0;
                    } 
                    //update timestamp
                    this._ts = t0;
                    
                    let d = opts.interval - t,
                        needSkip = opts.intervalMode=='OF' && d < 0;
                    this._timer = setTimeout(
                        () => { this._cycle(needSkip) },
                        opts.intervalMode=='BF' ? opts.interval : (needSkip ? 0 : d)
                    );
                } else {
                    this._finish()
                }
            }

            /**
             * Execute a ticker periodly.
             * 周期性执行任务
             */
            public start() {
                let T = this;
                if (T._sta == TimerState.RUNNING) return;

                let first = false, wait = T._cfg.delay;
                if (T._sta == TimerState.PAUSED) {
                    wait = 0;
                    //补上从暂停到现在的时间差
                    let t = System.highResTime()-T._pt;
                    T._pt = 0;
                    T._ts0+= t;
                    T._ts += t;
                } else {
                    first = true;
                    T._reset();
                }
                T._sta = TimerState.RUNNING;

                T._timer = setTimeout(() => {
                    if (first) {
                        T._ts0 = System.highResTime();
                        T._ts = T._ts0;
                        T._bus.fire(<TimerEvents>'starting');
                    }
                    T._cycle();
                }, wait);
            }

        }
    }
}

import Timer = JS.util.Timer;
import TimerState = JS.util.TimerState;
import TimerEvents = JS.util.TimerEvents;
import TimerTask = JS.util.TimerTask;
import TimerOptions = JS.util.TimerConfig;