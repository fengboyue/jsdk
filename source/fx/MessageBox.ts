/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../../libs/sweetalert2/7.26.9/sweetalert2.d.ts" />

module JS {

    export namespace fx {

        export interface MessageBoxResult {
            value?: undefined | true | any;
            dismiss?: 'cancel' | 'backdrop' | 'close' | 'esc' | 'timer';
        }

        export class MessageBoxConfig {
            /**
             * The title of the modal, as HTML.
             * It can either be added to the object under the key "title" or passed as the first parameter of the function.
             *
             * @default null
             */
            title?: string;

            /**
             * The title of the modal, as text. Useful to avoid HTML injection.
             *
             * @default null
             */
            titleText?: string;

            /**
             * A description for the modal.
             * It can either be added to the object under the key "text" or passed as the second parameter of the function.
             *
             * @default null
             */
            text?: string;

            /**
             * A HTML description for the modal.
             * If "text" and "html" parameters are provided in the same time, "text" will be used.
             *
             * @default null
             */
            html?: string | JQuery;

            /**
             * The footer of the modal, as HTML.
             *
             * @default null
             */
            footer?: string | JQuery;

            /**
             * The type of the modal.
             * 5 built-in types which will show a corresponding icon animation: 'warning', 'error',
             * 'success', 'info' and 'question'.
             *
             * @default null
             */
            type?: 'success' | 'error' | 'warning' | 'info' | 'question' | 'custom' = 'custom';

            /**
             * Whether or not SweetAlert2 should show a full screen click-to-dismiss backdrop.
             * Either a boolean value or a css background value (hex, rgb, rgba, url, etc.)
             *
             * @default true
             */
            backdrop?: boolean | string;

            /**
             * Whether or not an alert should be treated as a toast notification.
             * This option is normally coupled with the `position` parameter and a timer.
             * Toasts are NEVER autofocused.
             *
             * @default false
             */
            toast?: boolean;

            /**
             * The container element for adding modal into (query selector only).
             *
             * @default 'body'
             */
            target?: string;

            /**
             * Input field type, can be text, email, password, number, tel, range, textarea, select, radio, checkbox, file
             * and url.
             *
             * @default null
             */
            input?:
                'text' | 'email' | 'password' | 'number' | 'tel' | 'range' | 'textarea' | 'select' | 'radio' | 'checkbox' |
                'file' | 'url';

            /**
             * Modal window width, including paddings (box-sizing: border-box). Can be in px or %.
             *
             * @default null
             */
            width?: number | string;

            /**
             * Modal window background (CSS background property).
             *
             * @default '#fff'
             */
            background?: string;

            /**
             * Modal window position
             *
             * @default 'center'
             */
            position?:
                'top' | 'top-start' | 'top-end' | 'top-left' | 'top-right' |
                'center' | 'center-start' | 'center-end' | 'center-left' | 'center-right' |
                'bottom' | 'bottom-start' | 'bottom-end' | 'bottom-left' | 'bottom-right';

            /**
             * Modal window grow direction
             *
             * @default false
             */
            grow?: 'row' | 'column' | 'fullscreen' | false;

            /**
             * A custom CSS class for the modal.
             *
             * @default null
             */
            customClass?: string;

            /**
             * Auto close timer of the modal. Set in ms (milliseconds).
             *
             * @default null
             */
            timer?: number;

            /**
             * If set to false, modal CSS animation will be disabled.
             *
             * @default true
             */
            animation?: boolean;

            /**
             * By default, SweetAlert2 sets html's and body's CSS height to auto !important.
             * If this behavior isn't compatible with your project's layout, set heightAuto to false.
             *
             * @default true
             */
            heightAuto?: boolean;

            /**
             * If set to false, the user can't dismiss the modal by clicking outside it.
             * You can also pass a custom function returning a boolean value, e.g. if you want
             * to disable outside clicks for the loading state of a modal.
             *
             * @default true
             */
            allowOutsideClick?: boolean;

            /**
             * If set to false, the user can't dismiss the modal by pressing the Escape key.
             * You can also pass a custom function returning a boolean value, e.g. if you want
             * to disable the escape key for the loading state of a modal.
             *
             * @default true
             */
            allowEscapeKey?: boolean;

            /**
             * If set to false, the user can't confirm the modal by pressing the Enter or Space keys,
             * unless they manually focus the confirm button.
             * You can also pass a custom function returning a boolean value.
             *
             * @default true
             */
            allowEnterKey?: boolean;

            /**
             * If set to false, SweetAlert2 will allow keydown events propagation to the document.
             *
             * @default true
             */
            stopKeydownPropagation?: boolean;

            /**
             * Useful for those who are using SweetAlert2 along with Bootstrap modals.
             * By default keydownListenerCapture is false which means when a user hits Esc,
             * both SweetAlert2 and Bootstrap modals will be closed.
             * Set keydownListenerCapture to true to fix that behavior.
             *
             * @default false
             */
            keydownListenerCapture?: boolean;

            /**
             * If set to false, a "Confirm"-button will not be shown.
             * It can be useful when you're using custom HTML description.
             *
             * @default true
             */
            showConfirmButton?: boolean;

            /**
             * If set to true, a "Cancel"-button will be shown, which the user can click on to dismiss the modal.
             *
             * @default false
             */
            showCancelButton?: boolean;

            /**
             * Use this to change the text on the "Confirm"-button.
             *
             * @default 'OK'
             */
            confirmButtonText?: string;

            /**
             * Use this to change the text on the "Cancel"-button.
             *
             * @default 'Cancel'
             */
            cancelButtonText?: string;

            /**
             * Use this to change the background color of the "Confirm"-button (must be a HEX value).
             *
             * @default '#3085d6'
             */
            confirmButtonColor?: string;

            /**
             * Use this to change the background color of the "Cancel"-button (must be a HEX value).
             *
             * @default '#aaa'
             */
            cancelButtonColor?: string;

            /**
             * A custom CSS class for the "Confirm"-button.
             *
             * @default null
             */
            confirmButtonClass?: string = 'jsfx-btn-confirm';

            /**
             * A custom CSS class for the "Cancel"-button.
             *
             * @default null
             */
            cancelButtonClass?: string = 'jsfx-btn-cancel';

            /**
             * Set to true if you want to invert default buttons positions.
             *
             * @default false
             */
            reverseButtons?: boolean;

            /**
             * Set to false if you want to focus the first element in tab order instead of "Confirm"-button by default.
             *
             * @default true
             */
            focusConfirm?: boolean;

            /**
             * Set to true if you want to focus the "Cancel"-button by default.
             *
             * @default false
             */
            focusCancel?: boolean;

            /**
             * Set to true to show close button in top right corner of the modal.
             *
             * @default false
             */
            showCloseButton?: boolean;

            /**
             * Add a customized icon for the modal. Should contain a string with the path or URL to the image.
             *
             * @default null
             */
            imageUrl?: string;

            /**
             * If imageUrl is set, you can specify imageWidth to describes image width in px.
             *
             * @default null
             */
            imageWidth?: number;

            /**
             * If imageUrl is set, you can specify imageHeight to describes image height in px.
             *
             * @default null
             */
            imageHeight?: number;

            /**
             * An alternative text for the custom image icon.
             *
             * @default ''
             */
            imageAlt?: string;

            /**
             * A custom CSS class for the customized icon.
             *
             * @default null
             */
            imageClass?: string;

            /**
             * Input field placeholder.
             *
             * @default ''
             */
            inputPlaceholder?: string;

            /**
             * Input field initial value.
             *
             * @default ''
             */
            inputValue?: string;

            /**
             * If input parameter is set to "select" or "radio", you can provide options.
             * Object keys will represent options values, object values will represent options text values.
             */
            inputOptions?: JsonObject<string>;

            /**
             * Automatically remove whitespaces from both ends of a result string.
             * Set this parameter to false to disable auto-trimming.
             *
             * @default true
             */
            inputAutoTrim?: boolean;

            /**
             * HTML input attributes (e.g. min, max, step, accept...), that are added to the input field.
             * @default null
             */
            inputAttributes?: { [attribute: string]: string; };

            /**
             * Validator for input field, may be async (Promise-returning) or sync.
             * @default null
             */
            inputValidator?: (inputValue: string) => Promise<string | null>;

            /**
             * A custom CSS class for the input field.
             *
             * @default null
             */
            inputClass?: string;
            listeners?: {
                confirming?: (e: Event, inputValue: any) => Promise<any | void>;
                opening?: (e: Event, modal: HTMLElement) => void;
                opened?: (e: Event, modal: HTMLElement) => void;
                closing?: (e: Event, modal: HTMLElement) => void;
                closed?: (e: Event) => void;
            };
        }

        @widget('JS.fx.MessageBox')
        export class MessageBox {

            public static show(config: MessageBoxConfig): Promise<MessageBoxResult> {
                let c = new MessageBoxConfig();
                c = Jsons.union(c, config);
                let cfg = <swalOptions>c, lts = c.listeners;
                if (lts) {
                    if (lts.confirming) cfg.preConfirm = (inputVal: any) => {
                        lts.confirming.apply(null, [new CustomEvent('confirming'), inputVal])
                    }
                    if (lts.opening) cfg.onBeforeOpen = (el) => {
                        lts.opening.apply(null, [new CustomEvent('opening'), el])
                    }
                    if (lts.opened) cfg.onOpen = (el) => {
                        lts.opened.apply(null, [new CustomEvent('opened'), el])
                    }
                    if (lts.closing) cfg.onClose = (el) => {
                        lts.closing.apply(null, [new CustomEvent('closing'), el])
                    }
                    if (lts.closed) cfg.onAfterClose = () => {
                        lts.closed.apply(null, [new CustomEvent('closed')])
                    }
                }
                let colorMode;
                if (c.type == 'custom') {
                    colorMode = 'btn-' + ColorMode.info;
                } else if (c.type == 'question') {
                    colorMode = 'btn-' + ColorMode.dark;
                } else if (c.type == 'error') {
                    colorMode = 'btn-' + ColorMode.danger;
                } else {
                    colorMode = 'btn-' + cfg.type;
                }

                cfg.confirmButtonClass = colorMode + ' jsfx-messagebox-btn ' + (cfg.confirmButtonClass || '');
                cfg.cancelButtonClass = 'jsfx-messagebox-btn ' + (cfg.cancelButtonClass || '');

                cfg.buttonsStyling = false;
                if (<any>cfg.type == 'custom') delete cfg.type;

                return <any>swal(cfg);
            }
            public static clickConfirm() {
                swal.clickConfirm();
            }
            public static clickCancel() {
                swal.clickCancel();
            }
            public static disableConfirmButton() {
                swal.disableConfirmButton();
            }
            public static enableConfirmButton() {
                swal.enableConfirmButton();
            }
            public static disableButtons() {
                swal.disableButtons();
            }
            public static getTitle() {
                return $(swal.getTitle()).html();
            }
            public static getContent() {
                return $(swal.getContent()).html();
            }
            public static close() {
                swal.close();
            }
            public static isShown() {
                return swal.isVisible();
            }
        }

    }
}
import MessageBox = JS.fx.MessageBox;
import MessageBoxResult = JS.fx.MessageBoxResult;
