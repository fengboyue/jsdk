/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.7.0
 * @author Frank.Feng
 */
module JS {

    export namespace an {

        let J = Jsons,
            first = (a: any[]) => {
                return a.length == 0 ? null : a[0]
            },
            last = (a: any[]) => {
                return a.length == 0 ? null : a[a.length - 1]
            };

        export interface TimedTweenAnimInit extends TweenAnimInit {
            type: 'tween'
        }
        export interface TimedFrameAnimInit extends FrameAnimInit {
            type: 'frame'
        }

        export class TimelineInit {
            targets?: AnimTargets;
            /**
             * The duration time (ms) of one loop of this Animation.<br>
             * The default value is 1s.
             */
            duration?: number = 1000;
            /**
             * Delays (ms) the start of one loop.
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

            on?: {
                /**
                 * The action to be executed at the starting of this Animation.
                 */
                starting?: EventHandler<Anim>,
                /**
                 * The action to be executed at the conclusion of this Animation.
                 */
                finished?: EventHandler<Anim>
            }
        }

        export class Timeline {
            protected _cfg: TimelineInit;
            protected _targets: Array<HTMLElement | object>;
            private _seqAnims: Anim[] = [];
            private _synAnims: Anim[] = [];
            protected _bus = new EventBus(this);

            constructor(cfg: TimelineInit) {
                this._cfg = <TimelineInit>J.union(new TimelineInit(), cfg);

                this._targets = [];
                let els = this._tars(this._cfg.targets);
                els.forEach(el => {
                    this._targets.add(el);
                })
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

            add(a: TimedTweenAnimInit | TimedFrameAnimInit, start?: number) {
                let c = this._cfg;
                a = <any>J.union(<AnimInit>{
                    targets: this._targets,
                    duration: c.duration,
                    endDelay: c.endDelay,
                    autoreset: c.autoreset
                }, a, {
                    delay: (start||0)+(a.delay||c.delay||0)
                });
                let anim = (a.type == 'tween' ? new TweenAnim(a) : new FrameAnim(a));

                if (this._synAnims.length == 0 || start != void 0) {
                    this._synAnims.add(anim);
                } else {
                    let anims = this._seqAnims, lastAnim: Anim;
                    if (anims.length < 1) {
                        lastAnim = first(this._synAnims);
                    } else {
                        lastAnim = anims[anims.length - 1]
                    }

                    lastAnim.on('finished', () => {
                        anim.play()
                    });
                    this._seqAnims.add(anim);
                }

                return this
            }

            private _isRunning = false;
            private _seqFinished = false;
            private _synFinished = false;

            private _resolve(ctx: PromiseContext<boolean>, f:boolean){
                if(f) this._isRunning = false;
                ctx.resolve(f)
            }
            play(): Promise<boolean> {
                let m = this;
                return Promises.create<boolean>(function () {
                    if (m._isRunning) m._resolve(this, false);

                    m._isRunning = true;
                    m._seqFinished = false;
                    m._synFinished = false;

                    m._bus.fire('starting');

                    if (m._synAnims.length == 0) {
                        m._bus.fire('finished');
                        m._resolve(this, false);
                    }

                    let lastAnim = last(m._seqAnims);
                    if (lastAnim) lastAnim.on('finished', () => {
                        m._seqFinished = true;
                        if (m._synFinished) {
                            m._bus.fire('finished');
                            m._resolve(this, true);
                        }
                    });

                    let plans: PromisePlan<void>[] = [];
                    m._synAnims.forEach(an => {
                        plans.push(Promises.createPlan(function () {
                            an.play().then(()=>{
                                this.resolve()
                            })
                        }))
                    })
                    Promises.all(plans).then(() => {
                        m._synFinished = true;
                        if (m._seqFinished) {
                            m._bus.fire('finished');
                            m._resolve(this, true);
                        }
                    })
                })
            }

        }
    }
}

import TimelineInit = JS.an.TimelineInit;
import Timeline = JS.an.Timeline;