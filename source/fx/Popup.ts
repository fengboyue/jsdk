/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../../libs/bootstrap/4.0.0/bootstrap.d.ts" />
/// <reference path="Widget.ts"/>

module JS {

    export namespace fx {

        export type PopupEvents = WidgetEvents;
        export interface PopupListeners extends WidgetListeners<Popup> {};

        export class PopupConfig extends WidgetConfig<Popup> {
            disabled?: boolean = false;
            hidden?:boolean = true;
            target: string | HTMLElement | JQuery;
            animation?: boolean = true;
            place?: LRTB | 'auto' = 'auto';
            title?: string;
            content: string|HTMLElement;
            htmlable?:boolean = true;
            template?: string;
            trigger?: Bootstrap.Trigger = 'manual';
            listeners?: PopupListeners;
        }

        @widget('JS.fx.Popup')
        export class Popup extends Widget {

            private _pop: JQuery;

            constructor(cfg: PopupConfig) {
                super(cfg);
            }

            /**
             * Toggles an element’s Popup. This is considered a “manual” triggering of the popover.
             */
            public toggle() {
                this._pop.popover('toggle');
                return this
            }

            public show() {
                this._pop.popover('show');
                return this
            }
            public isShown(): boolean {
                return !this._config.hidden
            }
            public hide() {
                this._pop.popover('hide');
                return this
            }
            public enable() {
                this._pop.popover('enable');
                (<PopupConfig>this._config).disabled = false;
                return this
            }
            public disable() {
                this._pop.popover('disable');
                (<PopupConfig>this._config).disabled = true;
            }

            public isEnable(): boolean {
                return !(<PopupConfig>this._config).disabled
            }

            protected _destroy() {
                this._pop.popover('dispose');
                super._destroy();
            }
            protected _onAfterInit() {
                let cfg = <PopupConfig>this._config;
                if (!cfg.hidden) this.show();
                cfg.disabled? this.disable():this.enable();
            }

            protected _render(): false {
                let cfg = <PopupConfig>this._config,
                    json = {
                        animation: cfg.animation,
                        title: cfg.title,
                        content: cfg.content,
                        html: cfg.htmlable,
                        placement: cfg.place,
                        trigger: cfg.trigger
                    };
                if (cfg.template) json['template'] = cfg.template;
                this._pop = $(cfg.target).popover(json);

                this._pop.on('show.bs.popover', () => {
                    this._fire('showing')
                })
                this._pop.on('shown.bs.popover', () => {
                    this._fire('shown')
                    this._config.hidden = false;
                })
                this._pop.on('hide.bs.popover', () => {
                    this._fire('hiding')
                })
                this._pop.on('hidden.bs.popover', () => {
                    this._fire('hidden');
                    this._config.hidden = true;
                })
                this._pop.on('inserted.bs.popover', () => {
                    this._fire('rendered')
                })

                return false
            }
        }

    }

}
import Popup = JS.fx.Popup;
import PopupEvents = JS.fx.PopupEvents;
import PopupListeners = JS.fx.PopupListeners;

