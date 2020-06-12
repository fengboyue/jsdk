/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
//必须引用：webcomponents-lite.js
module JS {

    export namespace ui {

        export interface CustomElementConfig {
            tagName: string;
            extendsTagName?: string;

            //事件回调
            onConstructor?: (this: CustomElement, cfg: CustomElementConfig) => void;
            onCreated?: (this: CustomElement) => void; //创建时
            onDestroyed?: (this: CustomElement) => void; //销毁时
            onAdopted?: (this: CustomElement) => void; //父容器改变时
            onAttributeChanged?: (this: CustomElement, attrName: string, oldVal: any, newVal: any) => void; //属性改变时
        }

        /**
         * A custom element for v1 version.
         * 
         * Note: Need load 'webcomponents-lite' library.
         * <pre>
         * JS.imports('webcomponents-lite').then();
         * </pre>
         */
        export class CustomElement extends HTMLElement {//v1 define
            private _config: CustomElementConfig
            public constructor(cfg: CustomElementConfig) {
                super();
                this._config = cfg;
                cfg.onConstructor.apply(this, this._config);
            }
            connectedCallback() {
                this._config.onCreated.apply(this)
            }
            disconnectedCallback() {
                this._config.onDestroyed.apply(this)
            }
            adoptedCallback() {
                this._config.onAdopted.apply(this)
            }
            attributeChangedCallback(attrName: string, oldVal: any, newVal: any) {
                this._config.onAttributeChanged.apply(this, [attrName, oldVal, newVal]);
            }

            public static define(config: CustomElementConfig): HTMLElement {
                customElements.define(config.tagName, <any>CustomElement, { extends: config.extendsTagName });
                return CustomElement.prototype;
            }
        }

    }
}
import CustomElementConfig = JS.ui.CustomElementConfig;
import CustomElement = JS.ui.CustomElement; 
