/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
module JS {

    export namespace util {

        /**
         * The interval execution strategy of TimerTicker is as follows: <br>
         * If the function returns void, it indicate that the interval time will not be changed.<br>
         * If the function returns positive number, it indicate that the interval time will be replaced with a new value temporarily before next execution.<br>
         * If the function returns negative number, it indicate that the next execution will be ignored, but the subsequent execution continues normally. <br>
         * 
         * TimerTicker的间隔执行策略如下：<br>
         * 函数返回值为void，表示下次执行间隔时间保持不变。<br>
         * 函数返回值为正数，表示下次执行间隔临时性的改为新值（以后仍不变）。<br>
         * 函数返回值为负数，标志下次忽略不执行但以后仍正常执行。
         */
        export type TimerTicker = (this:Timer, counter:number)=>number|void;

        export type CycleOptions = {
            cycle?: false | number,
            wait?: number,
            interval?: number
        }

        export type TimerState = 'NEW'|'WAITING'|'RUNNING'|'BLOCKED'|'TERMINATED'

        
        export class Timer {
            private _opts:CycleOptions;
            private _ticker: TimerTicker;
            private _timerId = null;
            private _counter = 0;
            private _state: TimerState='NEW';

            constructor(){
                this._opts = {
                    cycle: false,
                    wait: 0,
                    interval: 0,
                }
            }

            public restart(){
                this.stop();
                if(this._ticker) this.start(this._ticker)
            }
            /**
             * Return false if the timer has not be started or be stopped.
             */
            public suspend(){
                if(this._state == 'WAITING' || this._state=='RUNNING') {
                    this._state = 'BLOCKED';
                    return true
                }
                return false
            }
            public stop(){
                this._state = 'TERMINATED';
                this._counter = 0;
                if(this._timerId) window.clearTimeout(this._timerId);
                this._timerId = null;
            }
            /**
             * Returns state of the timer
             */
            public getState(): TimerState{
                return this._state
            }

            private _cycle(skip?:boolean){
                if(this._state!='RUNNING') return;

                this._counter++;
                let time = skip?undefined:this._ticker.call(this, this._counter), max = <number>this._opts.cycle;
                if(this._counter < max) {
                    this._timerId = setTimeout(()=>{this._cycle(time<0)}, Types.isNumber(time)?(time<0?0:time):this._opts.interval);
                }else{
                    this.stop()
                }
            } 

            /**
             * Execute a ticker periodly.
             * 周期性执行任务
             */
            public start(ticker?: TimerTicker, opts?: CycleOptions) {
                if(ticker) this._ticker = ticker;
                if(opts) this._opts = Jsons.union(this._opts, opts);

                this._state = 'WAITING';
                if(this._opts.cycle===false) {
                    this._timerId = window.setTimeout(()=>{
                        this._state = 'RUNNING';
                        this._ticker.call(this, ++this._counter);
                        this.stop();
                    }, this._opts.wait);
                }else{
                    this._timerId = window.setTimeout(()=>{
                        this._state = 'RUNNING';
                        this._cycle()
                    }, this._opts.wait);
                }
            }

            /**
             * Execute a ticker one times.<br>
             * 执行一次任务
             */
            public startOne(ticker: TimerTicker, wait?: number){
                this.start(ticker, {cycle: false, wait: wait})
            }

            /**
             * Execute a cycle ticker forever.<br>
             * 执行永久循环任务
             */
            public startForever(ticker: TimerTicker, opts?: {
                wait?: number,
                interval?: number
            }){
                this.start(ticker, Jsons.union({cycle: Infinity}, opts))
            }
            /**
             * Execute a cycle ticker at datetime.<br>
             * 定时执行循环任务
             */
            public startAtDate(ticker: TimerTicker, date:Date, opts?: {
                cycle?: number,
                interval?: number
            }){
                let now = new Date(), diff = date.getTime()-now.getTime();
                if(diff<0) return
                opts = opts||{};
                (<CycleOptions>opts).wait = diff;
                this.start(ticker, opts)
            }
            
        }
    }
}

import Timer = JS.util.Timer;
import TimerTicker = JS.util.TimerTicker;
import TimerTickerOptions = JS.util.CycleOptions;