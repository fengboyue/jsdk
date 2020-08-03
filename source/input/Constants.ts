/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.2.0
 * @author Frank.Feng
 */

module JS {

    export namespace input {

        export type DragEvents = 'drag' | 'drop' | 'dragend' | 'dragstart' | 'dragenter' | 'dragleave' | 'dragover';
 
        /**
         * Note: The "keypress" event is not recommended.
         */    
        export type KeyboardEvents = 'keyup' | 'keydown' | 'keypress';


        export type MouseEvents = 'click' | 'dblclick' 
         | 'mouseleave' | 'mouseenter' | 'mouseout' | 'mouseover' | 'mousedown' | 'mouseup' | 'mousemove' | 'mousewheel';
        export enum MouseButton {
            LEFT = 0,
            MIDDLE = 1,
            RIGHT = 2
        }
        
        /**** Mobile Events ****/
        export type TouchEvents = 'touchstart' | 'touchend' | 'touchmove' | 'touchcancel';

        export type TapEvents = 'tap' | 'singletap' | 'doubletap' | 'longtap';

        export type SwipeEvents = 'swipe' | 'swipeleft' | 'swiperight' | 'swipeup' | 'swipedown';
        /**** Mobile Events ****/
    }
}
import DragEvents = JS.input.DragEvents;
import MouseEvents = JS.input.MouseEvents;
import MouseButton = JS.input.MouseButton;
import KeyboardEvents = JS.input.KeyboardEvents;
import TouchEvents = JS.input.TouchEvents;
import TapEvents = JS.input.TapEvents;
import SwipeEvents = JS.input.SwipeEvents;