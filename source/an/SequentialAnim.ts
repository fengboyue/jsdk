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

        let E = Check.isEmpty;
        
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
                if(!E(as)) {
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
                let T = this, c = T._cfg;
                if(E(c.anims) || T.getState()==AnimState.RUNNING) return T; 
                c.anims[T._i].play();
                return T
            }

            /**
             * Pauses the animation.
             */
            public pause() {
                let T = this, c = T._cfg;
                if(T._sta != AnimState.RUNNING) return T;
                T._sta = AnimState.PAUSED;
                
                if (!E(c.anims)) c.anims[T._i].pause();
                return T
            }
            /**
             * Stops the animation and resets the play head to its initial position.
             */
            public stop() {
                let T = this, c = T._cfg;
                T._sta = AnimState.STOPPED;
                
                if (!E(c.anims)) c.anims[T._i].stop();
                T._i = 0;
                return T
            }
        }
    }
}
import SequentialAnimConfig = JS.an.SequentialAnimConfig;
import SequentialAnim = JS.an.SequentialAnim;