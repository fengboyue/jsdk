/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../../libs/handlebars/4.1.2/handlebars.d.ts" /> 

module JS {

    export namespace util {

        export interface TemplateCompileOptions extends CompileOptions{}
        export interface CompiledTemplate extends HandlebarsTemplateDelegate{}
        export interface TemplateHelper extends Handlebars.HelperDelegate{}

        /**
         * Template class based on handlebars<br>
         * 模版工具类
         * 
         * <pre>
         * Example:
         * let te = new Templator(), array = [];
         * for (let i = 0; i < 100000; i++) {
         *     array[i] = { val: i + 1 };
            }
           let text = te.compile('{{#.}}Number: {{val}}\n{{/.}}')(array);
         * </pre>
         * 
         * <pre>
         * //Note: Need load the 'handlebars' library.
         * JS.imports('$handlebars').then();
         * 
         * //Note: Need load the 'handlebars' runtime before using compiled files.
         * JS.imports('$handlebars-runtime').then();
         * </pre>
         */
        export class Templator {

            private _hb;

            constructor(){
                this._hb = Handlebars.create();
            }

            public compile(tpl: string, options?: TemplateCompileOptions): CompiledTemplate {
                return this._hb.compile(tpl, options)
            }

            public registerHelper(name: string, fn: TemplateHelper): void {
                this._hb.registerHelper(name, fn)
            }
            public unregisterHelper(name: string): void {
                this._hb.unregisterHelper(name)
            }

            public static safeString(s: string): any{
                return new Handlebars.SafeString(s);
            }
        }
    }
}

import Templator = JS.util.Templator;