/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.2.0
 * @author Frank.Feng
 */
/// <reference path="Constants.ts"/>

module JS {

    export namespace input {

        export type KeyEventInits = {
            target?: HTMLElement;
            keyCode: number;
            /** A Boolean indicating whether the event bubbles. The default is false. */
            bubbles?: boolean;
            /** A Boolean indicating whether the event can be cancelled. The default is false. */
            cancelable?: boolean;
            /** Optional and defaulting to document.defaultView, of type WindowProxy, that is the Window associated with the event. */
            view?: WindowProxy;
            /** Optional and defaulting to false, that indicates if the ctrl key was simultaneously pressed. */
            ctrlKey?: boolean;
            /** Optional and defaulting to false, that indicates if the alt key was simultaneously pressed. */
            altKey?: boolean;
            /** Optional and defaulting to false, that indicates if the shift key was simultaneously pressed. */
            shiftKey?: boolean;
            /** Optional and defaulting to false, that indicates if the meta key was simultaneously pressed. */
            metaKey?: boolean;
            /** Whatever data the event was initialized with. */
            detail?: any;
        }

        /**
         * Key events helper.
         */
        export class Keyboards {

            public static newEvent(type: KeyboardEvents | string, args: KeyEventInits): KeyboardEvent {
                let a: KeyEventInits = <KeyEventInits>Jsons.union({
                    bubbles: false,
                    cancelable: false,
                    view: null,
                    ctrlKey: false,
                    altKey: false,
                    shiftKey: false,
                    metaKey: false
                }, args),
                    doc = a.target ? (<HTMLElement>a.target).ownerDocument : document;
                a.view = a.view || doc.defaultView;

                let eo = new KeyboardEvent(type, a);
                Object.defineProperty(eo, 'keyCode', {
                    value: a.keyCode,
                    writable: true
                });
                if (a.target) Object.defineProperty(eo, 'target', {
                    value: a.target,
                    writable: true
                });
                return eo
            }
            /**
             * Fires a keyboard event.<br>
             * Note: not support keypress event because special keys has not this event.
             */
            public static fireEvent(type: KeyboardEvents, args?: KeyEventInits) {
                let n = (args && args.target) || window;
                n.dispatchEvent(this.newEvent(type, args))
            }
        }
    }
}
import Keyboards = JS.input.Keyboards;
import KeyEventInits = JS.input.KeyEventInits;