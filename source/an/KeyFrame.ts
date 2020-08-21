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

        export type KeyFrame = number|JsonObject<number>|JsonObject<JsonObject<number>>|any;
        export type KeyFrames = {
            from?: KeyFrame,
            to?: KeyFrame,
            "0%"?: KeyFrame,
            "100%"?: KeyFrame,
            [key: string]: KeyFrame
        }
    }
}
import KeyFrame = JS.an.KeyFrame;
import KeyFrames = JS.an.KeyFrames;