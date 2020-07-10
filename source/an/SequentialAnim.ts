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

        export class SequentialAnimConfig extends AnimConfig {
            anims: Anim[];
            el?: HTMLElement|string
        }

        export class SequentialAnim extends Anim {
            protected _cfg: SequentialAnimConfig;
            private _i: number = 0;
            private _sta = AnimState.STOPPED;

            constructor(cfg: SequentialAnimConfig) {
                super(cfg)
            }

            public config(): SequentialAnimConfig
            public config(cfg: SequentialAnimConfig): this
            public config(cfg?: SequentialAnimConfig): any {
                if (!cfg) return this._cfg;

                super.config(cfg);
                let c = this._cfg, as = c.anims;
                if(!Check.isEmpty(as)) {
                    as.forEach((a, i)=>{
                        a.config(Jsons.union(c, a.config()));//based on SequentialAnim's config
                        if(i<as.length-1){
                            a.config({
                                onFinished:()=>{
                                    as[i+1].play()
                                }
                            })
                        }else{
                            a.config({
                                onFinished:()=>{
                                    if(c.onFinished) c.onFinished.call(this)
                                }
                            })
                        }
                        a.config({
                            onStarting:()=>{this._i = i}
                        })
                    })
                }
                return this
            }

            public play(): this {
                let m = this, c = m._cfg;
                if(Check.isEmpty(c.anims) || m.getState()==AnimState.RUNNING) return m; 
                c.anims[m._i].play();
                return m
            }

            /**
             * Pauses the animation.
             */
            public pause() {
                let m = this, c = m._cfg;
                if(m._sta != AnimState.RUNNING) return m;
                m._sta = AnimState.PAUSED;
                
                if (!Check.isEmpty(c.anims)) c.anims[m._i].pause();
                return m
            }
            /**
             * Stops the animation and resets the play head to its initial position.
             */
            public stop() {
                let m = this, c = m._cfg;
                m._sta = AnimState.STOPPED;
                
                if (!Check.isEmpty(c.anims)) c.anims[m._i].stop();
                m._i = 0;
                return m
            }
        }
    }
}
import SequentialAnimConfig = JS.an.SequentialAnimConfig;
import SequentialAnim = JS.an.SequentialAnim;