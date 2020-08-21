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

        export type TranslateKeyFrame = { oX?: number, oY?: number, oZ?: number };
        export type TranslateKeyFrames = 
        {
            from?: TranslateKeyFrame,
            to?: TranslateKeyFrame,
            "0%"?: TranslateKeyFrame,
            "100%"?: TranslateKeyFrame,
            [key: string]: TranslateKeyFrame
        }

        export class TranslateAnimInit extends FrameAnimInit {
            frames: TranslateKeyFrames
        }

        /**
         * Translate Animation.<br>
         * Translate a element from current position to offset position.
         */
        export class TranslateAnim extends FrameAnim {

            constructor(cfg: TranslateAnimInit) {
                super(cfg)
            }

            protected _resetEl(){
                this._el.style.transform = `translateX(0px) translateY(0px) translateZ(0px)`
            }

            protected _onUpdate(f: TranslateKeyFrame) {
                this._el.style.transform = `translateX(${f.oX || 0}px) translateY(${f.oY || 0}px) translateZ(${f.oZ || 0}px)`
            }
        }
    }
}
import TranslateKeyFrame = JS.an.TranslateKeyFrame;
import TranslateKeyFrames = JS.an.TranslateKeyFrames;
import TranslateAnimInit = JS.an.TranslateAnimInit;
import TranslateAnim = JS.an.TranslateAnim;