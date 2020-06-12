/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */

module JS {

    export namespace ui {

        export type MouseEvents = 'click' | 'dblclick' | 'mouseleave' | 'mouseenter' | 'mouseout' | 'mouseover' | 'mousedown' | 'mouseup' | 'mousemove' | 'mousewheel' |
            'drag' | 'drop' | 'dragend' | 'dragstart' | 'dragenter' | 'dragleave' | 'dragover';

        export type KeyboardEvents = 'keyup' | 'keydown' | 'keypress';

        export type TouchEvents = 'touchstart' | 'touchend' | 'touchmove' | 'touchcancel';

    }
}
import MouseEvents = JS.ui.MouseEvents;
import KeyboardEvents = JS.ui.KeyboardEvents;
import TouchEvents = JS.ui.TouchEvents;