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

        export type CursorStyles = 'default'|'text'|'auto'|'pointer'|'move'|'not-allowed'|'no-drop'|'wait'|'help'|'crosshair'|'n-resize'|'s-resize'|'w-resize'|'e-resize'|'nw-resize'|'sw-resize'|'ne-resize'|'se-resize';

        /**
         * Cursor helper class.
         */
        export class Cursors {

            public static set(sty: CursorStyles, el:HTMLElement=document.body){
                el.style.cursor = sty
            }
            public static url(url: string, el:HTMLElement=document.body){
                el.style.cursor = `url("${url}")`
            }

        }

    }
}
import Cursors = JS.input.Cursors;