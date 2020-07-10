/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="Widget.ts"/>

module JS {

    export namespace fx {

        export enum TabFaceMode {
            horizontal = 'horizontal',
            vertical = 'vertical',
            pill = 'pill',
            outline = 'outline',
            underline = 'underline'
        }

        export type TabEvents = WidgetEvents | 'activing' | 'actived';
        export interface TabListeners extends WidgetListeners<Tab> {
            activing?: (this: Tab, e: Event, toEl: JQuery, fromEl: JQuery) => void;
            actived?: (this: Tab, e: Event, toEl: JQuery, fromEl: JQuery) => void;
        }

        export type TabItem = {
            heading: string;
            content?: string | Element | JQuery;
            disabled?: boolean;
        }

        export class TabConfig extends WidgetConfig<Tab> {

            activeIndex?: number = 0;

            faceMode?: TabFaceMode | Array<TabFaceMode> = null; //外观模式

            data?: TabItem[];

            headCls?: string;
            headLeftWidth?: string | number = '15%';
            headStyle?: string;

            listeners?: TabListeners;
        }


        @widget('JS.fx.Tab')
        export class Tab extends Widget {

            /**
             * @constructor
             * @param {TabConfig} cfg 
             */
            constructor(cfg: TabConfig) {
                super(cfg);
            }

            public disableTab(num: number) {
                let index = this._limitIndex(num);
                if(index<0) return this; 

                let cfg = <TabConfig>this._config;
                cfg.data[index].disabled = true;

                let tab = $(`#${this.id}_headers li:nth-child(${index + 1}) a`);
                tab.addClass('disabled');
                return this
            }
            public enableTab(num: number) {
                let index = this._limitIndex(num);
                if(index<0) return this; 

                let cfg = <TabConfig>this._config;
                cfg.data[index].disabled = false;

                let tab = $(`#${this.id}_headers li:nth-child(${index + 1}) a`);
                tab.removeClass('disabled');
                return this
            }
            public isEnabledTab(num: number): boolean {
                let size = this.length();
                if ( size==0 || num < 1 || num > size) return false;

                let cfg = <TabConfig>this._config;
                return cfg.data && !cfg.data[num-1].disabled;
            }

            public activeTab(num: number) {
                let index = this._limitIndex(num);
                if(index<0) return this; 

                let cfg = <TabConfig>this._config;
                cfg.activeIndex = index;
                cfg.data[index].disabled = false;
                let tab = $(`#${this.id}_headers li:nth-child(${index + 1}) a`);
                tab.removeClass('disabled').css('display', '').tab('show');
                return this;
            }
            public isActivedTab(num: number): boolean {
                let tab = $(`#${this.id}_headers li:nth-child(${num}) a`);
                return tab.length == 1 && tab.hasClass('active')
            }

            private _limitIndex(num: number) {
                let size = this.length();
                if(size==0) return -1;
                if (num >= size) {
                    return size - 1
                } else if (num < 1) return 0;
                return num-1
            }

            public hideTab(num: number) {
                this.activeTab(num-1);
                $(`#${this.id}_headers li:nth-child(${num}) a`).css('display', 'none');
                return this
            }
            public showTab(num: number) {
                $(`#${this.id}_headers li:nth-child(${num}) a`).css('display', '');
                return this
            }
            public isShownTab(num: number): boolean {
                let tab = $(`#${this.id}_headers li:nth-child(${num}) a`);
                return tab.length == 1 && tab.css('display') != 'none'
            }

            public getActiveIndex(): number {
                return (<TabConfig>this._config).activeIndex+1;
            }

            public clear() {
                return this.tabs(null)
            }

            public tabs(): TabItem[]
            public tabs(items: TabItem[]): this
            public tabs(items?: TabItem[]): any {
                if (arguments.length == 0) return (<TabConfig>this._config).data;

                (<TabConfig>this._config).data = items;
                this.render();
                return this
            }

            public addTab(tabs: TabItem | TabItem[], from?: number) {
                let size = this.length();
                if (!Types.isDefined(from) || from > size) {
                    from = size+1
                } else if (size==0||from < 1) from = 1;

                let cfg = <TabConfig>this._config;
                cfg.data = cfg.data || [];
                cfg.data.add(Arrays.toArray(tabs), from-1);
                this.render();
                return this
            }
            public removeTab(num: number) {
                if (num > this.length() || num < 1) return this;

                let cfg = <TabConfig>this._config;
                cfg.data = cfg.data || [];
                cfg.data.remove(num-1);
                this.render();
                return this
            }
            public removeTabHeading(heading: string) {
                let cfg = <TabConfig>this._config;
                cfg.data = cfg.data || [];

                let i = cfg.data.findIndex((item: TabItem) => {
                    return heading == item.heading
                }, 0)
                if (i < 0) return this;
                return this.removeTab(i+1)
            }

            public length(): number {
                let data = (<TabConfig>this._config).data;
                return data ? data.length : 0;
            }

            private _head(item: TabItem, i: number) {
                return `
                <li class="nav-item">
                    <a  id="${this.id}_${i}-tab" jsfx-index="${i}" class="nav-link ${item.disabled ? 'disabled' : ''}" 
                    data-toggle="tab" href="#${this.id}_${i}" role="tab" aria-controls="${this.id}_${i}" aria-selected="false">
                    ${item.heading}</a>
                </li>
                `
            }
            private _content(item: TabItem, i: number) {
                let html = Types.isString(item.content) ? <string>item.content : $(item.content).html();
                return `<div class="tab-pane fade" id="${this.id}_${i}" role="tabpanel" aria-labelledby="${this.id}_${i}-tab">${html || ''}</div>`
            }

            private _html() {
                let cfg = <TabConfig>this._config,
                    data: TabItem[] = cfg.data,
                    heads = '',
                    contents = '';
                if (!data) return '';

                data.forEach((item, i) => {
                    heads += this._head(item, i);
                    contents += this._content(item, i);
                })

                let cls = '';
                if (this._hasFaceMode(TabFaceMode.pill)) {
                    cls += ' nav-pills'
                } else if (this._hasFaceMode(TabFaceMode.underline)) {
                    cls += ' jsfx-tab-underline'
                } else {
                    cls += ' nav-tabs'
                }
                cls += ' ' + cfg.colorMode || '';

                let isVtl = this._hasFaceMode(TabFaceMode.vertical);
                if (isVtl) cls += ' flex-column';

                let hHtml = `<ul id="${this.id}_headers" role="tablist" class="nav${cls} ${cfg.headCls || ''}" style="${cfg.headStyle || ''}">${heads}</ul>`,
                    cHtml = `<div class="${isVtl ? 'vertical' : ''} tab-content" style="height:${Lengths.toCSS(cfg.height, '100%')};">${contents}</div>`,
                    leftWidth = Lengths.toCSS(cfg.headLeftWidth, '100%');

                return isVtl ?
                    `
                <div class="w-100">
                <div style="float:left;width:${leftWidth};">${hHtml}</div>
                <div style="margin-left:${leftWidth};">${cHtml}</div>
                </div>
                ` : `${hHtml}${cHtml}`
            }

            protected _render() {
                this.widgetEl.html(this._html());

                if (this.length() > 0) {
                    let tablist = this.widgetEl.find('ul[role=tablist]');
                    tablist.on('show.bs.tab', (e: JQuery.Event) => {
                        this._fire('activing', [e.target, e.relatedTarget])
                    });
                    tablist.on('shown.bs.tab', (e: JQuery.Event) => {
                        this._fire('actived', [e.target, e.relatedTarget])
                    });

                    this.activeTab(this.getActiveIndex());
                }
            }
            protected _destroy() {
                this.widgetEl.find('a[role=tab]').each(function () { $(this).tab('dispose') });
                super._destroy();
            }
        }

    }

}
import Tab = JS.fx.Tab;
import TabFaceMode = JS.fx.TabFaceMode;
import TabEvents = JS.fx.TabEvents;
import TabListeners = JS.fx.TabListeners;
import TabItem = JS.fx.TabItem;
import TabConfig = JS.fx.TabConfig;