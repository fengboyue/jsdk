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

        export enum AnimState {
            STOPPED,
            RUNNING,
            PAUSED
        }

        export class AnimInit {
            target?: HTMLElement|string;
            
            /**
             * Defines whether this Animation reverses direction on the ending of every loop.
             */
            autoReverse?: boolean = false;
            /**
             * Defines whether this Animation reset to the initial state on the finish of playing.
             */
            autoReset?: boolean = false;
            /**
             * The duration time (ms) of one cycle of this Animation.<br>
             * The default value is 3s.
             */
            duration?: number = 3000;
            /**
             * Defines repeat number of this Animation.<br>
             * The default value is 1.
             */
            loop?: boolean | number = 1;
            /**
             * Delays (ms) the start of an animation.
             */
            delay?: number = 0;
            /**
             * The "forward" diration means play from the "from" keyframe to the "to" keyframe.<br>
             * The "backward" diration means play from the "to" keyframe to the "from" keyframe.
             */
            direction?: 'forward' | 'backward' = 'forward';
            /**
             * The action to be executed at the starting of this Animation.
             */
            onStarting?: EventHandler<Anim>;
            /**
             * The action to be executed at the conclusion of this Animation.
             */
            onFinished?: EventHandler<Anim>;
        }

        export abstract class Anim {

            protected _cfg: AnimInit;
            protected _timer: AnimTimer = null;
            protected _dir: 'forward' | 'backward' = 'forward';
            protected _loop: number = 0;
              
            constructor(cfg: AnimInit) {
                this._init();
                this.config(cfg);
            }

            protected _init(){
                this.config(new AnimInit());
            }

            protected _convertFrame(f: KeyFrame):number|JsonObject<number>|JsonObject<JsonObject<number>>{
                return f
            }

            
            public config(): AnimInit
            public config(cfg: AnimInit): this
            public config(cfg?: AnimInit): any {
                if (!cfg) return this._cfg;

                this._cfg = <AnimInit>Jsons.union(this._cfg, cfg);
                this.direction(this._cfg.direction);
                return this
            }

            public direction(): 'forward' | 'backward'
            public direction(d: 'forward' | 'backward'): this
            public direction(d?: 'forward' | 'backward'): any {
                if (!d) return this._dir;
                this._dir = d;
                return this
            }

            public getState(): AnimState {
                return this._timer ? <any>this._timer.getState() : AnimState.STOPPED
            }

            public getLooped() {
                return this._loop
            }
            
            /**
             * Plays Animation from current position.
             */
            public abstract play(t?: number) : this;

            protected _resetEl() {};

            protected _reset(){
                let T = this;
                T._loop = 0;
                T._dir = T._cfg.direction;
                if (T._timer) T._timer.stop();
            }

            /**
             * Pauses the animation.
             */
            public pause() {
                if (this._timer) this._timer.pause();
                return this
            }
            /**
             * Stops the animation and resets the play head to its initial position.
             */
            public stop() {
                this._reset();
                return this
            }
            
        }
    }
}

import AnimState = JS.an.AnimState;
import AnimInit = JS.an.AnimInit;
import Anim = JS.an.Anim;