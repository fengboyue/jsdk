/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../lang/System.ts"/>
/// <reference path="../util/Bom.ts"/>
/// <reference path="../../libs/clipboard/2.0.0/clipboard.d.ts" />

module JS {

    export namespace ui {

        /**
         * ClipBoard Helper<br>
         * 剪贴板类
         * 
         * <pre>
         * Need import clipboard library before using:
         * JS.imports('$clipboard').then();
         * </pre>
         */
        export class ClipBoard {

            /**
             * Copy text of target element.
             * 拷贝目标对象内的文本
             * @param clicker 点击对象
             * @param target 目标对象
             */
            public static copyTarget(clicker: string|HTMLElement, target: string|HTMLElement) {
                this._do('copy', clicker, target)
            }
            /**
             * Cut text of target element.
             * 剪贴目标对象内的文本
             * @param clicker 点击对象
             * @param target 目标对象
             */
            public static cutTarget(clicker: string|HTMLElement, target: string|HTMLElement) {
                this._do('cut', clicker, target)
            }
            private static _do(action:'copy'|'cut', clicker: string|HTMLElement, target: string|HTMLElement){
                Bom.ready(()=>{
                    let cli = Dom.$1(clicker), tar = Dom.$1(target);
                    if (!cli || !tar) throw new NotFoundError('The clicker or target not found!');
    
                    cli.attr('data-clipboard-action', action);
                    cli.attr('data-clipboard-target', '#'+tar.attr('id'));
                    new ClipboardJS('#'+cli.attr('id'));
                })
            }
            /**
             * Copy text directly.
             * 直接拷贝文本
             * @param clicker 点击对象
             * @param text 文本
             */
            public static copyText(clicker: string|HTMLElement, text: string) {
                Bom.ready(()=>{
                    let cli = Dom.$1(clicker);
                    if (cli) throw new NotFoundError('The clicker not found!');
    
                    cli.attr('data-clipboard-text', text);
                    new ClipboardJS('#'+cli.attr('id'));
                })
            }

        }

    }

}

import ClipBoard = JS.ui.ClipBoard;