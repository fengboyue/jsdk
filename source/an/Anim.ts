/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.7.0
 * @update New designed API
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

        export type AnimDirection = 'forward' | 'backward' | 'alternate';
        export type AnimEvents = 'starting' | 'finished' | 'pausing' | 'paused' | 'looping' | 'looped' | 'updating' | 'updated';

        export class AnimInit {
            targets?: AnimTargets;
            /**
             * The duration time (ms) of one loop of this Animation.<br>
             * The default value is 1s.
             */
            duration?: number = 1000;
            /**
             * Delays (ms) the start of playing.
             */
            delay?: number = 0;
            /**
             * Delays (ms) the end of one loop.
             */
            endDelay?: number = 0;

            /**
             * Auto reset the targets properties at the starting of this animation.
             */
            autoreset?: boolean = false;

            /**
             * 'forward': Animation progress goes from 0 to 100%<br>
             * 'backword': Animation progress goes from 100% to 0%<br>
             * 'alternate':	Animation progress goes from 0% to 100% then goes back to 0%<br>
             */
            direction?: AnimDirection = 'forward';
            /**
             * Defines repeat number of this Animation.<br>
             * The default value is 1.
             */
            loop?: boolean | number = 1;

            on?: {
                /**
                 * The action to be executed at the starting of this Animation.
                 */
                starting?: EventHandler<Anim>,
                /**
                 * The action to be executed at the conclusion of this Animation.
                 */
                finished?: EventHandler<Anim>,
                /**
                 * The action to be executed at the pausing of this Animation.
                 */
                pausing?: EventHandler<Anim>,
                /**
                 * The action to be executed at the paused of this Animation.
                 */
                paused?: EventHandler<Anim>,
                /**
                 * The looping is fired when an loop of this animation begins. 
                 * @event (this: Anim, e: CustomEvent, loop: number)
                 */
                looping?: EventHandler1<Anim, number>,
                /**
                 * The looped event is fired when an loop of this animation ends. 
                 * @event (this: Anim, e: CustomEvent, loop: number)
                 */
                looped?: EventHandler1<Anim, number>,
                /**
                 * @event (this: Anim, e: CustomEvent, elapsedTime: number, duration: number, loop: number)
                 */
                updating?: EventHandler3<Anim, number, number, number>,
                /**
                 * @event (this: Anim, e: CustomEvent, elapsedTime: number, duration: number, loop: number)
                 */
                updated?: EventHandler3<Anim, number, number, number>
            }
        }

        export type AnimTargets = object | string | HTMLElement | Array<object | string | HTMLElement> | NodeListOf<HTMLElement>;

        export abstract class Anim {

            protected _cfg: AnimInit;
            protected _timer: Timer = null;
            protected _dir: 'forward' | 'backward';
            protected _loop: number = 0;
            protected _targets: Array<HTMLElement | object> = [];
            protected _bus = new EventBus(this);

            constructor(cfg: AnimInit) {
                this._cfg = <AnimInit>Jsons.union(this._cfg, cfg);
                this.targets(this._cfg.targets);
                this.direction(this._cfg.direction == 'backward' ? 'backward' : 'forward');
                if (this._cfg.on) Jsons.forEach(this._cfg.on, (v, k) => {
                    this.on(k, v)
                })
            }

            config<T extends AnimInit>(): T {
                return <T>Jsons.clone(this._cfg)
            }

            on(ev: string, fn: EventHandler<this>) {
                this._bus.on(ev, fn);
                return this
            }
            off(ev?: string) {
                this._bus.off(ev);
                return this
            }

            private _tars(t: AnimTargets): Array<HTMLElement | object> {
                if (Types.isArrayLike(t)) {
                    if (t instanceof NodeList) return Arrays.newArray(t);

                    let as = [];
                    (<[]>t).forEach((a: object | string | HTMLElement) => {
                        typeof a == 'string' ? as.add(Arrays.newArray($L(a))) : as.add(a)
                    })
                    return as
                } else if (typeof t == 'string') {
                    return Arrays.newArray($L(t))
                } else if (t instanceof HTMLElement) {
                    return [t]
                }
                return t instanceof Object ? [t] : []
            }

            targets(t: AnimTargets) {
                let els = this._tars(t);
                els.forEach(el => {
                    this._targets.add(el);
                })
                return this
            }

            direction(): 'forward' | 'backward'
            direction(d: 'forward' | 'backward'): this
            direction(d?: 'forward' | 'backward'): any {
                if (!d) return this._dir;
                this._dir = d;
                return this
            }

            getState(): AnimState {
                return this._timer ? <any>this._timer.getState() : AnimState.STOPPED
            }

            isRunning(): boolean {
                return this.getState() == AnimState.RUNNING
            }

            getLooped() {
                return this._loop
            }

            /**
             * Plays Animation from current position.
             * @returns {Promise<boolean>} False indicates this animation is currently playing
             */
            abstract play(): Promise<boolean>;

            // abstract tick(t: number): void;

            protected _reset() {
                let T = this;
                T._loop = 0;
                T._dir = T._cfg.direction == 'backward' ? 'backward' : 'forward';
            }

            protected _resetTargets(){}

            protected _setupTimer(){
                let T = this, r = T._timer, c = T._cfg;
                r.on(<TimerEvents>'starting', () => {
                    T._reset();
                    T._bus.fire('starting')
                });
                r.on(<TimerEvents>'pausing', () => {
                    T._bus.fire('pausing')
                });
                r.on(<TimerEvents>'paused', () => {
                    T._bus.fire('paused')
                });
                r.on(<TimerEvents>'updating', (e, t, d, l) => {
                    T._bus.fire('updating', [t, d, l])
                });
                r.on(<TimerEvents>'updated', (e, t, d, l) => {
                    T._bus.fire('updated', [t, d, l])
                });
                r.on(<TimerEvents>'finished', () => {
                    T._bus.fire('finished'); 
                    if(c.autoreset) T._resetTargets()
                });
            }

            /**
             * Pauses the animation.
             */
            pause() {
                if (this._timer) this._timer.pause();
                return this
            }
            /**
             * Stops the animation and resets the play head to its initial position.
             */
            stop() {
                let T = this;
                if (T._timer) T._timer.stop();
                T._reset();
                return T
            }
            replay() {
                this.stop();
                this.play()
            }

        }
    }
}

import AnimState = JS.an.AnimState;
import AnimInit = JS.an.AnimInit;
import Anim = JS.an.Anim;
import AnimTargets = JS.an.AnimTargets;