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
         * The range is 0.0 ~ 1.0
         */
        export type FadeKeyFrame = number;
        export type FadeKeyFrames = {
            from?: FadeKeyFrame,
            to?: FadeKeyFrame,
            "0%"?: FadeKeyFrame,
            "100%"?: FadeKeyFrame,
            [key: string]: FadeKeyFrame
        }
        
        // JsonObject<FadeKeyFrame>;

        export class FadeAnimInit extends FrameAnimInit {
            frames: FadeKeyFrames
        }

        /**
         * Opacity fade Animation.<br>
         * Fade a element's opacity from number1 to number2.
         */
        export class FadeAnim extends FrameAnim {
            private _o:string;

            constructor(cfg: FadeAnimInit) {
                super(cfg)
            }

            public config<T extends FrameAnimInit>(): T
            public config<T extends FrameAnimInit>(cfg: T): this
            public config(cfg?: FrameAnimInit): any {
                if (!cfg) return this._cfg;

                let m = super.config(cfg);
                if(this._el) this._o = this._el.computedStyle().opacity||'1';
                
                return m
            }

            protected _onUpdate(f: FadeKeyFrame) {
                this._el.style.opacity = f+'';
            }

            protected _resetEl(){
                this._el.style.opacity = this._o;
            }
        }
    }
}
import FadeKeyFrame = JS.an.FadeKeyFrame;
import FadeKeyFrames = JS.an.FadeKeyFrames;
import FadeAnimInit = JS.an.FadeAnimInit;
import FadeAnim = JS.an.FadeAnim;