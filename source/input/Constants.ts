/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.2.0
 * @author Frank.Feng
 */

module JS {

    export namespace ui {

        export type MouseEvents = 'click' | 'dblclick' 
         | 'mouseleave' | 'mouseenter' | 'mouseout' | 'mouseover' | 'mousedown' | 'mouseup' | 'mousemove' | 'mousewheel' 
         | 'drag' | 'drop' | 'dragend' | 'dragstart' | 'dragenter' | 'dragleave' | 'dragover';

        /**
         * Note: The "keypress" event is not recommended.
         */    
        export type KeyboardEvents = 'keyup' | 'keydown' | 'keypress';

        export type TouchEvents = 'touchstart' | 'touchend' | 'touchmove' | 'touchcancel';

        export enum MouseButton {
            LEFT = 0,
            MIDDLE = 1,
            RIGHT = 2
        }

    }
}
import MouseEvents = JS.ui.MouseEvents;
import KeyboardEvents = JS.ui.KeyboardEvents;
import TouchEvents = JS.ui.TouchEvents;
import MouseButton = JS.ui.MouseButton;