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

        let J = Jsons;

        export type GradientKeyFrame = {
            color?: HEX,
            backgroundColor?: HEX,
            borderColor?: HEX,
            borderTopColor?: HEX,
            borderRightColor?: HEX
            borderBottomColor?: HEX,
            borderLeftColor?: HEX
        };
        export type GradientKeyFrames = 
        {
            from?: GradientKeyFrame,
            to?: GradientKeyFrame,
            "0%"?: GradientKeyFrame,
            "100%"?: GradientKeyFrame,
            [key: string]: GradientKeyFrame
        }

        export class GradientAnimInit extends FrameAnimInit {
            frames: GradientKeyFrames
        }

        /**
         * Color Gradient Animation.<br>
         * Gradient a element's color from color1 to color2.
         */
        export class GradientAnim extends FrameAnim {
            private _cls:{
                color?: string,
                backgroundColor?: string,
                borderColor?: string,
                borderTopColor?: string,
                borderRightColor?: string
                borderBottomColor?: string,
                borderLeftColor?: string
            };

            constructor(cfg: GradientAnimInit) {
                super(cfg);
            }

            public config<T extends FrameAnimInit>(): T
            public config<T extends FrameAnimInit>(cfg: T): this
            public config(cfg?: FrameAnimInit): any {
                if (!cfg) return this._cfg;

                let m = super.config(cfg);
                if(this._el){
                    let s = this._el.computedStyle();
                    this._cls = {
                        color: s.color,
                        backgroundColor: s.backgroundColor,
                        borderColor: s.borderColor,
                        borderTopColor: s.borderTopColor,
                        borderRightColor: s.borderRightColor,
                        borderBottomColor: s.borderBottomColor,
                        borderLeftColor: s.borderLeftColor
                    }
                }
                
                return m
            }

            private _newColor(t, d, from: TRGBA, to: TRGBA, k: string, e, base: TRGBA): number {
                return this._newVal(t, d, from[k], to[k], e, base==null?null:base[k])
            }

            protected _convertFrame(f: GradientKeyFrame):JsonObject<TRGBA>{
                let json = {};
                J.forEach(f, (v,k)=>{
                    json[k] = Colors.hex2rgba(v)
                });
                return json
            }

            protected _newFrame(from:JsonObject<TRGBA>, to:JsonObject<TRGBA>, t:number, d:number, e:EasingFunction):JsonObject<TRGBA>{
                let json = <JsonObject<TRGBA>>{};
                J.forEach(from, (v, k) => {
                    json[k] = <any>{};
                    J.forEach(from[k], (vv,kk)=>{
                        json[k][kk] = this._newColor(t,d,from[k],to[k],kk,e,this._frame==void 0?null:this._frame[k])
                    })
                })
                return json
            }

            protected _onUpdate(j: JsonObject<TRGBA>) {
                let el = this._el;
                J.forEach(j,(v,k)=>{
                    el.css(k,Colors.rgba2css(v))
                })
            }

            protected _resetEl(){
                this._el.css(this._cls)
            }
        }
    }
}
import GradientKeyFrame = JS.an.GradientKeyFrame;
import GradientKeyFrames = JS.an.GradientKeyFrames;
import GradientAnimInit = JS.an.GradientAnimInit;
import GradientAnim = JS.an.GradientAnim;