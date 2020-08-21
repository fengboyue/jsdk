/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.1.0
 * @author Frank.Feng
 */
/// <reference path="FrameAnim.ts" />

module JS {

    export namespace an {

        /**
         * The range is -360 ~ 360
         */
        export type SkewKeyFrame = {
            aX?: number,
            aY?: number
        };
        export type SkewKeyFrames = 
        {
            from?: SkewKeyFrame,
            to?: SkewKeyFrame,
            "0%"?: SkewKeyFrame,
            "100%"?: SkewKeyFrame,
            [key: string]: SkewKeyFrame
        }

        export class SkewAnimInit extends FrameAnimInit {
            frames: SkewKeyFrames;
            firstMode?:'both'|'x'|'y' = 'both'; 
        }

        /**
         * Skew Animation.<br>
         * Skew a element by angles of X and Y axes.
         */
        export class SkewAnim extends FrameAnim {

            constructor(cfg: SkewAnimInit) {
                super(cfg)
            }

            protected _init(){
                this.config(new SkewAnimInit());
            }

            protected _resetEl(){
                this._el.style.transform = `skew(0deg,0deg)`
            }

            protected _onUpdate(f: SkewKeyFrame) {
                let m = (<SkewAnimInit>this._cfg).firstMode, el = this._el;
                if(m=='both'){
                    el.style.transform = `skew(${f.aX||0}deg,${f.aY||0}deg)`
                }else{
                    let sx = `skewX(${f.aX||0}deg)`, sy = `skewY(${f.aY||0}deg)`;
                    el.style.transform = m=='x'?`${sx} ${sy}`:`${sy} ${sx}`
                }
            }
        }
    }
}
import SkewKeyFrame = JS.an.SkewKeyFrame;
import SkewKeyFrames = JS.an.SkewKeyFrames;
import SkewAnimInit = JS.an.SkewAnimInit;
import SkewAnim = JS.an.SkewAnim;