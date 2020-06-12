/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../../libs/blockui/2.70.0/blockui.d.ts" />
module JS {

    export namespace fx {

        export enum LoadingFaceMode {
            flower = 'flower',
            ring = 'ring',
            bar = 'bar'
        }

        export class LoadingConfig {
            renderTo?: string|HTMLElement|JQuery;
            width?: number = 200;
            transparent?: boolean = true;
            faceMode?: LoadingFaceMode = LoadingFaceMode.bar;
            colorMode?: ColorMode;
            sizeMode?: SizeMode = SizeMode.md;

            /**
             * disable if you don't want to show the overlay
             */
            overlay?: boolean = true;

            /**
             * time in millis to wait before auto-hide; set to 0 to disable auto-hide
             * @default 3000
             */
            duration?: number = 3000;

            cls?: string;

            /** message displayed when blocking (use null for no message) */
            message?: string;

            listeners?: {
                showed?: (e: Event, cfg: LoadingConfig) => void;
                hidden?: (e: Event, cfg: LoadingConfig) => void;
            };
        }

        @widget('JS.fx.Loading')
        export class Loading {

            public static show(cfg?: LoadingConfig) {
                let c: LoadingConfig = Jsons.union(new LoadingConfig(), cfg);
                c.cls = `jsfx-loading ${c.sizeMode} ${c.colorMode||''} ${c.transparent || !c.message ? 'transparent' : ''} ${c.cls || ''}`;

                let msg = '';
                if (c.faceMode == LoadingFaceMode.flower) {
                    let html = '';
                    for (let i = 1; i < 5; i++) {
                        html += `<div class="loading-flower circle${i}"></div>`;
                    }
                    msg = `<div class="items-middle items-center">
                            <div class="items-middle jsfx-loading-icon flower">
                                <div class="circle-group group1">${html}</div>
                                <div class="circle-group group2">${html}</div>
                                <div class="circle-group group3">${html}</div>
                            </div>
                            <span class="jsfx-loading-msg">${c.message || ''}<span>
                            </div>`;
                } else if (c.faceMode == LoadingFaceMode.ring) {
                    msg = `<div class="items-middle items-center">
                              <div class="jsfx-loading-icon ring"><div></div><div></div><div></div><div></div></div>
                              <span class="jsfx-loading-msg">${c.message || ''}<span>
                           </div>`;
                } else {
                    $('#jsfx-loading-css').remove();
                    if (c.duration) {
                        Dom.applyStyle(
                            `.jsfx-loading-bar .jsfx-loading-progress:before{animation: load ${c.duration / 1000 * 1.25}s ease-out 1 !important;}`,
                            'jsfx-loading-css');
                    }
                    msg = `<div class="jsfx-loading-bar">
                                <div class="jsfx-loading-progress"></div>
                                <div class="jsfx-loading-msg">${c.message || ''}</div>
                           </div>`;
                }

                let ucfg = <JQBlockUIOptions>{
                    css: {
                        width: c.width+'px',
                        left: `calc((100% - ${c.width}px) / 2)`
                    },
                    message: msg,
                    showOverlay: c.overlay,
                    blockMsgClass: c.cls,
                    timeout: c.duration
                }, ltns = c.listeners;
                if (ltns) {
                    if (ltns.showed) ucfg.onBlock = () => {
                        ltns.showed.apply(null, [new CustomEvent('showed'), c]);
                    }
                    if (ltns.hidden) ucfg.onUnblock = () => {
                        ltns.hidden.apply(null, [new CustomEvent('hidden'), c]);
                    }
                }

                cfg.renderTo?$(cfg.renderTo).block(ucfg):$.blockUI(ucfg);
            }

            public static hide(el: string|HTMLElement|JQuery) {
                el?$(el).unblock():$.unblockUI();
            }
        }

    }

}
import Loading = JS.fx.Loading;
import LoadingFaceMode = JS.fx.LoadingFaceMode;
import LoadingConfig = JS.fx.LoadingConfig;