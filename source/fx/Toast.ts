/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../../libs/toastr/2.1.4/toastr.d.ts" />
/// <reference path="Widget.ts"/>

module JS {

    export namespace fx {

        let toastrPosition = {
            lt: 'toast-top-left',
            rt: 'toast-top-right',
            ct: 'toast-top-center',
            lb: 'toast-bottom-left',
            rb: 'toast-bottom-right',
            cb: 'toast-bottom-center'
        }

        type ToastType = 'success' | 'info' | 'warning' | 'error';

        export interface ToastListeners {
            shown?: (e: Event, type: ToastType) => void;
            hidden?: (e: Event, type: ToastType) => void;
            click?: (e: Event, type: ToastType) => void;
            closeclick?: (e: Event, type: ToastType) => void;
        }

        export class ToastConfig {
            /**
             * CSS class the toast element will be given.
             */
            cls?:string;
            /**
             * Should the title and message text be escaped?
             * @default false
             */
            htmlable?: boolean = false;
            /**
             * Flip the toastr to be displayed properly for right-to-left languages.
             * @default false
             */
            rtl?: boolean;
            title?: string;
            message?: string;
            type?: ToastType = 'info';

            /**
             * Should a close button be shown?
             * @default false
             */
            closeButton?: boolean;

            /**
             * Visually indicates how long before a toast expires.
             * @default false
             */
            progressBar?: boolean = false;

            /**
             * Set newest toast to appear on top.
             * @default true
             */
            newestOnTop?: boolean;
            /**
             * Where toast should be displayed.
             * @default 'ct'
             */
            place?: 'lt' | 'lb' | 'ct' | 'cb' | 'rt' | 'rb' = 'ct';

            /**
             * Time in milliseconds that the toast should be displayed.
             * Set timeOut to 0 to make it will persist until selected.
             * 
             * @default 5000
             */
            timeout?: number;
            listeners?: ToastListeners
        }

        @widget('JS.fx.Toast')
        export class Toast {

            public static show(cfg: ToastConfig) {
                if(!cfg.title && !cfg.message) return;

                let c = <ToastrOptions>Jsons.union(new ToastConfig(), cfg); 
                if (cfg.timeout == 0) c.extendedTimeOut = 0;
                c.toastClass = 'toast jsfx-toast ' + cfg.cls||'';
                c.escapeHtml = !(<any>c).htmlable;
                c.timeOut = (<any>c).timeout;
                delete c['cls'];
                delete c['htmlable'];
                delete c['timeout'];

                let lts = cfg.listeners;
                if (lts) {
                    if (lts.shown) c.onShown = () => { lts.shown.apply(null, [new Event('shown')]) };
                    if (lts.hidden) c.onHidden = () => { lts.shown.apply(null, [new Event('hidden')]) }
                    if (lts.closeclick) c.onCloseClick = () => { lts.shown.apply(null, [new Event('closeclick')]) }
                    if (lts.click) c.onclick = () => { lts.shown.apply(null, [new Event('click')]) }
                    delete c['listeners'];
                }
                c.positionClass = toastrPosition[cfg.place || 'ct'];
                delete c['place'];

                toastr.options = c;
                toastr[cfg.type](cfg.message, cfg.title);
            }

            /**
             * Clear all toasts.
             */
            public static clearAll() {
                toastr.remove()
            }
        }

    }
}
import Toast = JS.fx.Toast;
import ToastConfig = JS.fx.ToastConfig;
import ToastListeners = JS.fx.ToastListeners;