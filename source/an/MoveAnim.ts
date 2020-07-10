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

        export type MoveKeyFrame = { x?: number, y?: number };
        export type MoveKeyFrames = JsonObject<MoveKeyFrame>;

        export class MoveAnimConfig extends ElementAnimConfig {
            frames: MoveKeyFrames
        }

        /**
         * Move Animation.<br>
         * Move a element from Point(x1, y1) to Point(x2, y2).
         */
        export class MoveAnim extends ElementAnim {
            private _xy:{x:number,y:number};

            constructor(cfg: MoveAnimConfig) {
                super(cfg)
            }

            public config<T extends ElementAnimConfig>(): T
            public config<T extends ElementAnimConfig>(cfg: T): this
            public config(cfg?: ElementAnimConfig): any {
                if (!cfg) return this._cfg;

                let m = super.config(cfg);
                if(this._el){
                    let s = this._el.computedStyle();
                    this._xy = {
                        x: Lengths.toNumber(s.left),
                        y: Lengths.toNumber(s.top)
                    }
                }
                
                return m
            }

            protected _onUpdate(f: MoveKeyFrame) {
                let el = this._el;
                if (f.x != void 0) el.style.left = f.x + 'px';
                if (f.y != void 0) el.style.top = f.y + 'px';
            }

            protected _resetInitial(){
                let el = this._el, xy = this._xy;
                el.style.left = xy.x + 'px';
                el.style.top = xy.y + 'px';
            }
        }
    }
}
import MoveKeyFrame = JS.an.MoveKeyFrame;
import MoveKeyFrames = JS.an.MoveKeyFrames;
import MoveAnimConfig = JS.an.MoveAnimConfig;
import MoveAnim = JS.an.MoveAnim;