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
                if (!cfg) return this._cfg;

                super.config(cfg);
                let c = this._cfg, as = c.anims;
                if (!Check.isEmpty(as)) {
                    this._plans = [];
                    as.forEach((a, i) => {
                        a.config(Jsons.union(c, a.config()));//based on ParallelAnim's config
                        this._plans.push(Promises.createPlan(function () {
                            a.config({
                                onFinished: () => { this.resolve() }
                            });
                            a.play()
                        }))
                    })
                }
                return this
            }

            public play(): this {
                let m = this, c = m._cfg;
                if (Check.isEmpty(c.anims) || m.getState() == AnimState.RUNNING) return m;
                
                m._sta = AnimState.RUNNING;
                Promises.all(m._plans).always(() => {
                    if (c.onFinished) c.onFinished.call(this)
                })
                return m
            }

            /**
             * Pauses the animation.
             */
            public pause() {
                let m = this, c = m._cfg;
                if(m._sta != AnimState.RUNNING) return m;
                m._sta = AnimState.PAUSED;
                
                if (!Check.isEmpty(c.anims)) {
                    c.anims.forEach(a=>{
                        a.pause()
                    })
                }
                return m
            }
            /**
             * Stops the animation and resets the play head to its initial position.
             */
            public stop() {
                let m = this, c = m._cfg;
                m._sta = AnimState.STOPPED;
                
                if (!Check.isEmpty(c.anims)) {
                    c.anims.forEach(a=>{
                        a.stop()
                    })
                }
                return m
            }
        }
    }
}
import ParallelAnimConfig = JS.an.ParallelAnimConfig;
import ParallelAnim = JS.an.ParallelAnim;