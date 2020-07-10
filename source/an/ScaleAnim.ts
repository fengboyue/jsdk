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

        export type ScaleKeyFrame = number | {
            sX?: number,
            sY?: number,
            sZ?: number
        };
        export type ScaleKeyFrames = JsonObject<ScaleKeyFrame>;

        export class ScaleAnimConfig extends ElementAnimConfig {
            frames: ScaleKeyFrames
        }

        /**
         * Scale Animation.<br>
         * Scale a element by times of X and Y and Z axes.
         */
        export class ScaleAnim extends ElementAnim {

            constructor(cfg: ScaleAnimConfig) {
                super(cfg);
            }

            protected _resetInitial(){
                this._el.style.transform = `scaleX(1) scaleY(1) scaleZ(1)`
            }

            protected _onUpdate(v: ScaleKeyFrame) {
                let x: number, y: number, z: number;
                if (!Types.isNumber(v)) {
                    x = (<JsonObject>v).x;
                    y = (<JsonObject>v).y;
                    z = (<JsonObject>v).z;
                } else {
                    x = <number>v;
                    y = <number>y
                }

                this._el.style.transform = `scaleX(${x==void 0?1:x}) scaleY(${y==void 0?1:y}) scaleZ(${z==void 0?1:z})`
            }
        }
    }
}
import ScaleKeyFrame = JS.an.ScaleKeyFrame;
import ScaleKeyFrames = JS.an.ScaleKeyFrames;
import ScaleAnimConfig = JS.an.ScaleAnimConfig;
import ScaleAnim = JS.an.ScaleAnim;