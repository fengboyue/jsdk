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
         * The range is 0 ~ 360
         */
        export type RotateKeyFrame = number | {
            aX?: number,
            aY?: number,
            aZ?: number
        };
        export type RotateKeyFrames = 
        {
            from?: RotateKeyFrame,
            to?: RotateKeyFrame,
            "0%"?: RotateKeyFrame,
            "100%"?: RotateKeyFrame,
            [key: string]: RotateKeyFrame
        }

        export class RotateAnimInit extends FrameAnimInit {
            frames: RotateKeyFrames
        }

        /**
         * Rotate Animation.<br>
         * Rotate a element by 2D or 3D angles.
         */
        export class RotateAnim extends FrameAnim {

            constructor(cfg: RotateAnimInit) {
                super(cfg);
            }

            protected _newVal(t: number, d:number, from: number, to: number, e:EasingFunction, base: number):number {
                let v = super._newVal(t,d,from,to,e,base);
                return v < 0 ? 0 : (v > 360 ? 360 : v)
            }
            protected _onUpdate(v: RotateKeyFrame) {
                let el = this._el;
                if (!Types.isNumber(v)) {
                    let x = (<JsonObject>v).x,
                        y = (<JsonObject>v).y,
                        z = (<JsonObject>v).z;
                    if(x!=void 0) el.style.transform = ` rotateX(${x}deg)`;
                    if(y!=void 0) el.style.transform += ` rotateY(${y}deg)`;
                    if(z!=void 0) el.style.transform += ` rotateZ(${z}deg)`;
                } else {
                    el.style.transform = `rotate(${v}deg)`
                }
            }

            protected _resetEl(){
                this._el.style.transform = `rotate(0deg)`
            }
        }
    }
}
import RotateKeyFrame = JS.an.RotateKeyFrame;
import RotateKeyFrames = JS.an.RotateKeyFrames;
import RotateAnimInit = JS.an.RotateAnimInit;
import RotateAnim = JS.an.RotateAnim;