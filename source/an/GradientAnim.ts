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
        export type GradientKeyFrames = JsonObject<GradientKeyFrame>;

        export class GradientAnimConfig extends ElementAnimConfig {
            frames: GradientKeyFrames
        }

        /**
         * Color Gradient Animation.<br>
         * Gradient a element's color from color1 to color2.
         */
        export class GradientAnim extends ElementAnim {
            private _cls:{
                color?: string,
                backgroundColor?: string,
                borderColor?: string,
                borderTopColor?: string,
                borderRightColor?: string
                borderBottomColor?: string,
                borderLeftColor?: string
            };

            constructor(cfg: GradientAnimConfig) {
                super(cfg);
            }

            public config<T extends ElementAnimConfig>(): T
            public config<T extends ElementAnimConfig>(cfg: T): this
            public config(cfg?: ElementAnimConfig): any {
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

            private _newColor(t, d, from: RGBA, to: RGBA, k: string, e, base: RGBA): number {
                return this._newVal(t, d, from[k], to[k], e, base==null?null:base[k])
            }

            protected _convertFrame(f: GradientKeyFrame):JsonObject<RGBA>{
                let json = {};
                J.forEach(f, (v,k)=>{
                    json[k] = Colors.hex2rgba(v)
                });
                return json
            }

            protected _newFrame(from:JsonObject<RGBA>, to:JsonObject<RGBA>, t:number, d:number, e:EasingFunction):JsonObject<RGBA>{
                let json = <JsonObject<RGBA>>{};
                J.forEach(from, (v, k) => {
                    json[k] = <any>{};
                    J.forEach(from[k], (vv,kk)=>{
                        json[k][kk] = this._newColor(t,d,from[k],to[k],kk,e,this._frame==void 0?null:this._frame[k])
                    })
                })
                return json
            }

            protected _onUpdate(j: JsonObject<RGBA>) {
                let el = this._el;
                J.forEach(j,(v,k)=>{
                    el.style[k] = Colors.rgba2css(v)
                })
            }

            protected _resetInitial(){
                let el = this._el, c = this._cls;
                J.forEach(c, (v,k)=>{
                    el.style[k] = v
                })
            }
        }
    }
}
import GradientKeyFrame = JS.an.GradientKeyFrame;
import GradientKeyFrames = JS.an.GradientKeyFrames;
import GradientAnimConfig = JS.an.GradientAnimConfig;
import GradientAnim = JS.an.GradientAnim;