/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.7.0
 * @author Frank.Feng
 */

module JS {
    export namespace util {

        export type ImageFrame = {
            src: string | HTMLImageElement,
            w: number,
            h: number,
            x: number,
            y: number
        }
        export type ImageFrameOffsets = {
            ox: number,
            oy: number,
            split?: number,
            axis: 'x' | '-x' | 'y' | '-y',
            total: number
        }
        export type ImageFrameOffset = [number, number];

        export type ImageFrameSet = {
            src: string | HTMLImageElement,
            w: number,
            h: number,
            items: Array<ImageFrameOffset> | ImageFrameOffsets
        }

        /**
         * Image Helper
         */
        export class Images {

            static parseFrames(frames: ImageFrameSet): ImageFrame[] {
                let frs: ImageFrame[] = [],
                    items = frames.items,
                    isA = Types.isArray(items),
                    len = isA ? (<Array<any>>items).length : (<ImageFrameOffsets>items).total;

                for (let i = 0; i < len; i++) {
                    let x: number, y: number;

                    if (isA) {
                        x = (<Array<any>>items)[0];
                        y = (<Array<any>>items)[1];
                    } else {
                        let offs = <ImageFrameOffsets>items, axis = offs.axis, sign = axis.startsWith('-') ? -1 : 1;
                        x = axis.endsWith('x') ? (offs.ox + sign * i * (frames.w + (offs.split || 0))) : offs.ox;
                        y = axis.endsWith('y') ? (offs.oy + sign * i * (frames.h + (offs.split || 0))) : offs.oy;
                    }

                    frs.push({
                        src: frames.src,
                        w: frames.w,
                        h: frames.h,
                        x: x,
                        y: y
                    })
                }
                return frs
            }

        }
    }
}
import ImageFrame = JS.util.ImageFrame;
import ImageFrameOffsets = JS.util.ImageFrameOffsets;
import ImageFrameOffset = JS.util.ImageFrameOffset;
import ImageFrameSet = JS.util.ImageFrameSet;
import Images = JS.util.Images;