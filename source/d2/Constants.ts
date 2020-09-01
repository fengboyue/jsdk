/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.6.0
 * @author Frank.Feng
 */
/// <reference path="../math/Constants.ts" />

module JS {

    export namespace d2 {

        /** [p1, p2] */
        export type D2Line = [ArrayPoint2, ArrayPoint2];
        /** [x, y, width, height] */
        export type D2Rect = [number, number, number, number];
        /** [p1, p2, p3] */
        export type D2Triangle = [ArrayPoint2, ArrayPoint2, ArrayPoint2];
        /** [center, r, startRadian, endRadian, counterclockwise] */
        export type D2CirArc = [ArrayPoint2, number, number, number, boolean];
        /** [center, r] */
        export type D2Circle = [ArrayPoint2, number];
        export type D2Path = ArrayPoint2[];

        /** [text, point, maxWidth] */
        export type D2Text = [string, ArrayPoint2] | [string, ArrayPoint2, number];
        export type D2CssColor = string | 'transparent';

        export type D2FillPattern = {
            image: HTMLImageElement | SVGImageElement | HTMLVideoElement
            repeat?: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'
        }
        export type D2CssLinearGradient = {
            /**
             * direction string.
             */
            dir: 'left' | 'right' | 'top' | 'bottom'
            /**
             * {
             * stop: 介于 0.0 与 1.0 之间的值，表示渐变中开始与结束之间的位置
             * color: 在结束位置显示的 CSS 颜色值
             * }
             */
            colors: Array<{ stop?: number, color: string }>
        }
        export interface D2ElementAttributes {
            x?: number | JS.util.CssOffsetValue
            y?: number | JS.util.CssOffsetValue
            opacity?: number | JS.util.CssOffsetValue
            zIndex?: number
            style?: string
            draggable?: boolean
        }
        export interface D2NewElementAttributes extends D2ElementAttributes {
            id?: string
        }

    }
}
import D2Line = JS.d2.D2Line;
import D2Rect = JS.d2.D2Rect;
import D2Triangle = JS.d2.D2Triangle;
import D2CirArc = JS.d2.D2CirArc;
import D2Circle = JS.d2.D2Circle;
import D2Path = JS.d2.D2Path;
import D2Text = JS.d2.D2Text;