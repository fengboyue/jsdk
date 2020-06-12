/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../util/URI.ts"/>
/// <reference path="../util/Bom.ts"/>

module JS {

    export namespace model {

        export type PageEvents = 'fullscreening' | 'fullscreened' | 'normalscreening' | 'normalscreened' |
        'loading' | 'loaded' | 'unloading' | 'close';

        @klass('JS.app.Page')
        export abstract class Page implements IComponent {

            /**
             * @abstract
             */
            public initialize() { };
            /**
             * @abstract
             */
            public destroy() { };

            /**
             * @abstract
             */
            public abstract render();

            private static _bus = new EventBus();

            public static fireEvent(e: PageEvents, args?: any[]) {
                this._bus.fire(e, args)
            }
            public static onEvent<H=EventHandler<Page>>(e: string, handler: H) {
                this._bus.on(e, handler);
            }
            public static offEvent(e: PageEvents) {
                this._bus.off(e)
            }

            private static _page: Page;

            public static current(page: Klass<Page>): void;
            public static current<P extends Page>(): P;
            public static current(page?: Klass<Page>): any {
                if (arguments.length == 0) return this._page;

                this._page = Components.get(page);
                this._bus.context(this._page);
                Bom.ready(() => {
                    this._page.render();
                })
            }

            public static view<V extends View>(view: Klass<V>): V {
                return <V>Components.get(view);
            }

            public static uri() {
                return new URI(window.location.href)
            }

            public static load(url?: string) {
                let u = url ? url : location.href
                this.fireEvent('loading', [u]);
                window.location.href = u;
                this.fireEvent('loaded', [u]);
            }

            public static open(url, target: 'blank' | 'parent' | 'self' = 'blank', specs?: {
                width?: number,
                height?: number,
                top?: number,	//窗口距离屏幕上方的象素值
                left?: number,	//窗口距离屏幕左侧的象素值
                location?: boolean,//是否显示地址栏.默认值是yes
                menubar?: boolean,//是否显示菜单栏.默认值是yes
                resizable?: boolean,	//是否可调整窗口大小.默认值是yes
                scrollbars?: boolean,	//是否显示滚动条.默认值是yes
                status?: boolean,//	是否显示状态栏.默认值是yes
                titlebar?: boolean,	//是否显示标题栏.默认值是yes
                toolbar?: boolean	//是否显示浏览器工具栏.默认值是yes
            }) {
                let args = [url, target];
                if (specs) {
                    let spe = '';
                    Jsons.forEach(specs, (v, k) => {
                        spe += `${k}=${Types.isNumber(v) ? v : (v ? 'yes' : 'no')},`
                    })
                    if (spe) args.push(spe);
                }

                return window.open.apply(window, args)
            }

            public static fullscreen(onoff: boolean) {
                if (onoff) {
                    this.fireEvent('fullscreening');
                    Bom.fullscreen();
                    this.fireEvent('fullscreened');
                } else {
                    this.fireEvent('normalscreening');
                    Bom.normalscreen();
                    this.fireEvent('normalscreened');
                }
            }
        }
    }

}
import PageEvents = JS.model.PageEvents;
import Page = JS.model.Page;

window.on('load', () => {
    Page.fireEvent('loaded', [window.location.href]);
})
window.on('beforeunload', () => {
    Page.fireEvent('unloading', [window.location.href]);
})