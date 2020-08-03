/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.4.0
 * @author Frank.Feng
 */
/// <reference path="Constants.ts"/>

module JS {

    export namespace input {
        // constants
        const D = document,
            DRAG_MOVE_PX = 5, // pixels to move before drag starts
            DRAG_IMAGE_OPACITY = 0.5, // drag image opacity
            DBL_TAP_INTERVAL = 300, // max ms between clicks in a double click
            LONG_TAP_INTERVAL = 750, // max ms of long hold tap

            CTXMENU = 900, // ms to hold before raising 'contextmenu' event
            // copy styles/attributes from drag source to drag image element
            RM_ATTS = ['id', 'class', 'style', 'draggable'],
            // synthesize and dispatch an event
            // returns true if the event has been handled (e.preventDefault == true)
            KB_PROPS = ['altKey', 'ctrlKey', 'metaKey', 'shiftKey'],
            PT_PROPS = ['pageX', 'pageY', 'clientX', 'clientY', 'screenX', 'screenY'];

        /**
        * Object used to hold the data that is being dragged during drag and drop operations.
        *
        * It may hold one or more data items of different types. For more information about
        * drag and drop operations and data transfer objects, see
        * <a href="https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer">HTML Drag and Drop API</a>.
        *
        * This object is created automatically by the @see:TouchDelegate singleton and is
        * accessible through the @see:dataTransfer property of all drag events.
        */
        var DataTransfer = (function () {
            function DataTransfer() {
                this._dropEffect = 'move';
                this._effectAllowed = 'all';
                this._data = {};
            }
            Object.defineProperty(DataTransfer.prototype, "dropEffect", {
                /**
                 * Gets or sets the type of drag-and-drop operation currently selected.
                 * The value must be 'none',  'copy',  'link', or 'move'.
                 */
                get: function () {
                    return this._dropEffect;
                },
                set: function (value) {
                    this._dropEffect = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataTransfer.prototype, "effectAllowed", {
                /**
                 * Gets or sets the types of operations that are possible.
                 * Must be one of 'none', 'copy', 'copyLink', 'copyMove', 'link',
                 * 'linkMove', 'move', 'all' or 'uninitialized'.
                 */
                get: function () {
                    return this._effectAllowed;
                },
                set: function (value) {
                    this._effectAllowed = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataTransfer.prototype, "types", {
                /**
                 * Gets an array of strings giving the formats that were set in the @see:dragstart event.
                 */
                get: function () {
                    return Object.keys(this._data);
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Removes the data associated with a given type.
             *
             * The type argument is optional. If the type is empty or not specified, the data
             * associated with all types is removed. If data for the specified type does not exist,
             * or the data transfer contains no data, this method will have no effect.
             *
             * @param type Type of data to remove.
             */
            DataTransfer.prototype.clearData = function (type) {
                if (type != null) {
                    delete this._data[type];
                }
                else {
                    this._data = null;
                }
            };
            /**
             * Retrieves the data for a given type, or an empty string if data for that type does
             * not exist or the data transfer contains no data.
             *
             * @param type Type of data to retrieve.
             */
            DataTransfer.prototype.getData = function (type) {
                return this._data[type] || '';
            };
            /**
             * Set the data for a given type.
             *
             * For a list of recommended drag types, please see
             * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Recommended_Drag_Types.
             *
             * @param type Type of data to add.
             * @param value Data to add.
             */
            DataTransfer.prototype.setData = function (type, value) {
                this._data[type] = value;
            };
            /**
             * Set the image to be used for dragging if a custom one is desired.
             *
             * @param img An image element to use as the drag feedback image.
             * @param offsetX The horizontal offset within the image.
             * @param offsetY The vertical offset within the image.
             */
            DataTransfer.prototype.setDragImage = function (img, offsetX, offsetY) {
                instance.setDragImage(img, offsetX, offsetY)
            };
            return DataTransfer;
        }());
        /**
        * The class supports for touch-based HTML5 drag/drop/tap/doubletap/longtap events.
        *
        * The purpose of this class is to enable using existing, standard HTML5
        * drag/drop code on mobile devices running IOS or Android. The class will
        * automatically start monitoring touch events and will raise the HTML5
        * drag drop events (dragstart, dragenter, dragleave, drop, dragend) which
        * should be handled by the application.
        *
        * For details and examples on HTML drag and drop, see
        * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_operations.
        */
        class TouchDelegate {
            private _tapStart = 0;
            private _tapTimer = null;
            private _lastTapEnd = 0;
            private _tapEvent: TouchEvent;

            private _dragSource;
            private _ptDown;
            private _lastDragEvent: TouchEvent;
            private _lastDragTarget: EventTarget;
            private _dataTransfer: DataTransfer;

            private _img;
            private _imgCustom;
            private _imgOffset: { x: number, y: number };

            constructor() {
                // detect passive event support
                // https://github.com/Modernizr/Modernizr/issues/1894
                var supportsPassive = false;
                D.addEventListener('test', null, {
                    get passive() {
                        supportsPassive = true;
                        return true;
                    }
                });
                // listen to touch events
                if ('ontouchstart' in D) {
                    let T = this, ts = T._touchstart.bind(T),
                        tm = T._touchmove.bind(T),
                        te = T._touchend.bind(T),
                        opt = supportsPassive ? { passive: false, capture: false } : false;
                    D.addEventListener('touchstart', ts, opt);
                    D.addEventListener('touchmove', tm, opt);
                    D.addEventListener('touchend', te);
                    D.addEventListener('touchcancel', te);
                }
            }


            public setDragImage(img, offsetX, offsetY) {
                this._imgCustom = img;
                this._imgOffset = { x: offsetX, y: offsetY };
            }

            private _touchstart(e) {
                var T = this;
                if (T._shouldHandle(e)) {
                    // clear all variables
                    T._reset();

                    T._tapStart = System.highResTime();
                    T._tapEvent = e;

                    T._fireEvent(e, <TapEvents>'tap', e.target);
                    if (!T._tapTimer) T._tapTimer = setTimeout(() => {
                        T._fireEvent(e, <TapEvents>'singletap', e.target);
                    }, DBL_TAP_INTERVAL);

                    if (T._tapStart - T._lastTapEnd < DBL_TAP_INTERVAL) {
                        if (T._tapTimer) clearTimeout(T._tapTimer);
                        T._fireEvent(e, <TapEvents>'doubletap', e.target);
                    }

                    // get nearest draggable element
                    var src = T._closestDraggable(e.target);
                    if (src) {
                        // get ready to start dragging
                        T._dragSource = src;
                        T._ptDown = T._getPoint(e);
                        T._lastDragEvent = e;
                        e.preventDefault();
                        // show context menu if the user hasn't started dragging after a while
                        setTimeout(function () {
                            if (T._dragSource == src && T._img == null) {
                                if (T._fireEvent(e, 'contextmenu', src)) {
                                    T._reset();
                                }
                            }
                        }, CTXMENU);
                    }
                }
            };
            private _touchmove(e) {
                let T = this;
                if (T._shouldHandle(e)) {
                    // see if target wants to handle move
                    var target = T._getTarget(e);
                    // start dragging
                    if (T._dragSource && !T._img) {
                        var delta = T._getDelta(e);
                        if (delta > DRAG_MOVE_PX) {
                            T._fireEvent(e, 'dragstart', T._dragSource);
                            T._createImage(e);
                            T._fireEvent(e, 'dragenter', target);
                        }
                    }
                    // continue dragging
                    if (T._img) {
                        T._lastDragEvent = e;
                        e.preventDefault(); // prevent scrolling
                        if (target != T._lastDragTarget) {
                            T._fireEvent(e, 'dragleave', T._lastDragTarget);
                            T._fireEvent(e, 'dragenter', target);
                            T._lastDragTarget = target;
                        }
                        T._moveImage(e);
                        T._fireEvent(e, 'dragover', target);
                    }
                }
            };
            private _touchend(e: Event) {
                let T = this;
                if (T._shouldHandle(e)) {
                    // user clicked the element but didn't drag, so clear the source and simulate a click
                    if (!T._img) {
                        T._dragSource = null;
                        if (e.type == 'touchend') {
                            T._lastTapEnd = System.highResTime();

                            let t = T._tapEvent.touches && T._tapEvent.touches[0];
                            if ((T._lastTapEnd - T._tapStart) >= LONG_TAP_INTERVAL) T._fireEvent(T._tapEvent, <TapEvents>'longtap', T._tapEvent.target);
                        }
                    }
                    // finish dragging
                    T._destroyImage();
                    if (T._dragSource) {
                        if (e.type == 'touchend') {
                            T._fireEvent(T._lastDragEvent, 'drop', T._lastDragTarget);
                        }
                        T._fireEvent(T._lastDragEvent, 'dragend', T._dragSource);
                        T._reset();
                    }
                    e.preventDefault();//stop click event
                }
            };
            // ignore events that have been handled or that involve more than one touch
            private _shouldHandle(e) {
                return e && e.touches && e.touches.length < 2;
            };
            // clear all
            private _reset() {
                let T = this;
                if (T._tapTimer) clearTimeout(T._tapTimer);
                T._tapTimer = null;

                T._destroyImage();
                T._tapStart = 0;
                T._tapEvent = null;
                T._dragSource = null;
                T._lastDragEvent = null;
                T._lastDragTarget = null;
                T._ptDown = null;
                T._dataTransfer = new DataTransfer();
            };
            // get point for a touch event
            private _getPoint(e, page?) {
                if (e && e.touches) {
                    e = e.touches[0];
                }
                return { x: page ? e.pageX : e.clientX, y: page ? e.pageY : e.clientY };
            };
            // get distance between the current touch event and the first one
            private _getDelta(e) {
                var p = this._getPoint(e);
                return Math.abs(p.x - this._ptDown.x) + Math.abs(p.y - this._ptDown.y);
            };
            // get the element at a given touch event
            private _getTarget(e) {
                var pt = this._getPoint(e), el = D.elementFromPoint(pt.x, pt.y);
                while (el && getComputedStyle(el).pointerEvents == 'none') {
                    el = el.parentElement;
                }
                return el;
            };
            // create drag image from source element
            private _createImage(e) {
                let T = this;
                if (T._img) {
                    T._destroyImage();
                }
                // create drag image from custom element or drag source
                var src = T._imgCustom || T._dragSource;
                T._img = src.cloneNode(true);
                T._copyStyle(src, T._img);
                T._img.style.top = T._img.style.left = '-9999px';
                // if creating from drag source, apply offset and opacity
                if (!T._imgCustom) {
                    var rc = src.getBoundingClientRect(), pt = T._getPoint(e);
                    T._imgOffset = { x: pt.x - rc.left, y: pt.y - rc.top };
                    T._img.style.opacity = DRAG_IMAGE_OPACITY.toString();
                }
                // add image to document
                T._moveImage(e);
                D.body.appendChild(T._img);
            };
            // dispose of drag image element
            private _destroyImage() {
                let T = this;
                if (T._img && T._img.parentElement) {
                    T._img.parentElement.removeChild(T._img);
                }
                T._img = null;
                T._imgCustom = null;
            };
            // move the drag image element
            private _moveImage(e) {
                var T = this;
                if (T._img) {
                    requestAnimationFrame(function () {
                        var pt = T._getPoint(e, true), s = T._img.style;
                        s.position = 'absolute';
                        s.pointerEvents = 'none';
                        s.zIndex = '999999';
                        s.left = Math.round(pt.x - T._imgOffset.x) + 'px';
                        s.top = Math.round(pt.y - T._imgOffset.y) + 'px';
                    });
                }
            };
            // copy properties from an object to another
            private _copyProps(dst, src, props) {
                for (var i = 0; i < props.length; i++) {
                    var p = props[i];
                    dst[p] = src[p];
                }
            };
            private _copyStyle(src, dst) {
                // remove potentially troublesome attributes
                RM_ATTS.forEach(function (att) {
                    dst.removeAttribute(att);
                });
                // copy canvas content
                if (src instanceof HTMLCanvasElement) {
                    var cSrc = src, cDst = dst;
                    cDst.width = cSrc.width;
                    cDst.height = cSrc.height;
                    cDst.getContext('2d').drawImage(cSrc, 0, 0);
                }
                // copy style
                var cs = getComputedStyle(src);
                for (var i = 0; i < cs.length; i++) {
                    var key = cs[i];
                    dst.style[key] = cs[key];
                }
                dst.style.pointerEvents = 'none';
                // and repeat for all children
                for (var i = 0; i < src.children.length; i++) {
                    this._copyStyle(src.children[i], dst.children[i]);
                }
            };
            private _fireEvent(e: TouchEvent, type: string, target: EventTarget) {
                if(e && target) {
                    let T = this, evt = D.createEvent('Event'), t = e.touches ? e.touches[0] : e;
                    evt.initEvent(type, true, true);
                    evt['button'] = 0;
                    evt['which'] = evt['buttons'] = 1;
                    T._copyProps(evt, e, KB_PROPS);
                    T._copyProps(evt, t, PT_PROPS);
                    if (T._dragSource) evt['dataTransfer'] = T._dataTransfer;
                    target.dispatchEvent(evt);
                    return evt.defaultPrevented
                }
                return false
            };
            // gets an element's closest draggable ancestor
            private _closestDraggable(e) {
                for (; e; e = e.parentElement) {
                    if (e.hasAttribute('draggable') && e.draggable) {
                        return e;
                    }
                }
                return null;
            };
        }

        let instance = new TouchDelegate();

        //fix for firefox's default behavior: new tabpage when drag text to document
        D.body.ondrop = function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();
        }
    }
}
