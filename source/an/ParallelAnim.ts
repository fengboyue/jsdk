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

        export class ParallelAnimConfig extends AnimConfig {
            anims: Anim[];
            el?: HTMLElement|string
        }

        let E = Check.isEmpty;
        export class ParallelAnim extends Anim {
            protected _cfg: ParallelAnimConfig;
            private _plans: PromisePlans<void>;
            private _sta = AnimState.STOPPED;

            constructor(cfg: ParallelAnimConfig) {
                super(cfg)
            }

            public getState(): AnimState {
                return this._sta
            }

            public config(): ParallelAnimConfig
            public config(cfg: ParallelAnimConfig): this
            public config(cfg?: ParallelAnimConfig): any {
                let T = this;
                if (!cfg) return T._cfg;

                super.config(cfg);
                let c = T._cfg, as = c.anims;
                if (!E(as)) {
                    T._plans = [];
                    as.forEach(a => {
                        a.config(Jsons.union(c, a.config()));//based on ParallelAnim's config
                        T._plans.push(Promises.createPlan(function () {
                            a.config({
                                onFinished: () => { this.resolve() }
                            });
                            a.play()
                        }))
                    })
                }
                return T
            }

            public play(): this {
                let T = this, c = T._cfg;
                if (E(c.anims) || T.getState() == AnimState.RUNNING) return T;
                
                T._sta = AnimState.RUNNING;
                Promises.all(T._plans).always(() => {
                    if (c.onFinished) c.onFinished.call(T)
                })
                return T
            }

            /**
             * Pauses the animation.
             */
            public pause() {
                let T = this, c = T._cfg;
                if(T._sta != AnimState.RUNNING) return T;
                T._sta = AnimState.PAUSED;
                
                if (!E(c.anims)) {
                    c.anims.forEach(a=>{
                        a.pause()
                    })
                }
                return T
            }
            /**
             * Stops the animation and resets the play head to its initial position.
             */
            public stop() {
                let T = this, c = T._cfg;
                T._sta = AnimState.STOPPED;
                
                if (!E(c.anims)) {
                    c.anims.forEach(a=>{
                        a.stop()
                    })
                }
                return T
            }
        }
    }
}
import ParallelAnimConfig = JS.an.ParallelAnimConfig;
import ParallelAnim = JS.an.ParallelAnim;