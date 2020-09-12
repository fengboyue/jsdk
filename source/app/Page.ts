/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../net/URI.ts"/>
/// <reference path="../util/Bom.ts"/>

module JS {

    export namespace app {

        export type PageEvents = 'fullscreening' | 'fullscreened' | 'normalscreening' | 'normalscreened' | 'leaving' | 'close';

        @klass('JS.app.Page')
        export abstract class Page implements ICompo{
            initialize() {}
            destroy() {}

            public abstract enter();

            private static _bus = new EventBus();

            public static fireEvent(e: PageEvents|string, args?: any[]) {
                this._bus.fire(e, args)
            }
            public static onEvent(e: PageEvents|string, handler: EventHandler<Page>, once?:boolean) {
                this._bus.on(e, handler, once);
            }
            public static offEvent(e: PageEvents|string) {
                this._bus.off(e)
            }

            private static _page: Page;

            public static init(page: Klass<Page>) {
                let T = this, p = Compos.get(page);
                T._page = p;
                T._bus.context(T._page);
                Bom.ready(() => {
                    T._page.enter();
                })
            }

            public static currentPage<T extends Page>(): T {
                return <T>this._page;
            }

            public static view<V extends View>(v: Klass<V>): V {
                return <V>Compos.get(v);
            }

            public static redirect(url:string, query?: string|JsonObject<string>) {
                let T = this, p=T._page;
                if (p) {
                    T.fireEvent(<PageEvents>'leaving', [p]);
                    Compos.remove((<Object>p).className)
                }
                let uri = new URI(url);
                if(query) Types.isString(query)?uri.queryString(<string>query):uri.queryObject(<JsonObject>query);
                
                location.href = uri.toString()
            }

            public static open(url, specs?: {
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
                let args = [url, 'blank'];
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
                let T = this;
                if (onoff) {
                    T.fireEvent('fullscreening');
                    Bom.fullscreen();
                    T.fireEvent('fullscreened');
                } else {
                    T.fireEvent('normalscreening');
                    Bom.normalscreen();
                    T.fireEvent('normalscreened');
                }
            }
        }
    }

}
import PageEvents = JS.app.PageEvents;
import Page = JS.app.Page;