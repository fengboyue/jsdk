/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="Check.ts"/>
/**
 * @class Strings
 */
module JS {

    export namespace util {

        /**
         * String util class<br>
         * 字符串工具类
         */
        export class Strings {
            /**
             * <pre>
             * Strings.padStart('123',2);     //return '123'
             * Strings.padStart('123',5);     //return '  123'
             * Strings.padStart('123',5,'0'); //return '00123'
             * Strings.padStart('123',6,'ab'); //return 'aab123'
             * </pre>
             */
            public static padStart(text: string, maxLength: number, fill?: string): string {
                let s = text || '';
                if (s.length >= maxLength) return s;

                let fs = fill ? fill : ' ';
                for (let i = 0; i < maxLength; i++) {
                    let tmp = fs + s, d = tmp.length - maxLength;
                    if (d < 0) {
                        s = tmp;
                    } else {
                        s = fs.substr(0, fs.length - d) + s;
                        break
                    }
                }
                return s;
            }
            /**
             * <pre>
             * Strings.padEnd('123',2);     //return '123'
             * Strings.padEnd('123',5);     //return '123  '
             * Strings.padEnd('123',5,'0'); //return '12300'
             * Strings.padEnd('123',6,'ab'); //return '123aba'
             * </pre>
             */
            public static padEnd(text: string, maxLength: number, fill?: string): string {
                let s = text || '';
                if (s.length >= maxLength) return s;

                let fs = fill ? fill : ' ';
                for (let i = 0; i < maxLength; i++) {
                    let tmp = s + fs, d = tmp.length - maxLength;
                    if (d < 0) {
                        s = tmp;
                    } else {
                        s += fs.substr(0, fs.length - d);
                        break
                    }
                }
                return s;
            }

            /**
             * Returns html string of a node type with its attributes.<br>
             * 返回指定节点的HTML
             */
            public static nodeHTML(nodeType: string, attrs?: JsonObject<string|boolean|number>, text?: string): string {
                let a = '';
                if (attrs) Jsons.forEach(attrs, (v, k) => {
                    if (v != void 0) {
                        if(Types.isBoolean(v)) {
                            if(v===true) a += ` ${k}`
                        }else{
                            a += ` ${k}="${v || ''}"`
                        }
                    }
                });
                return `<${nodeType}${a}>${text || ''}</${nodeType}>`
            }

            /**
             * Escape html include following special characters: <pre>& < > " ' / ` =</pre>
             * 转义HTML
             */
            public static escapeHTML(html: string): string {
                if (!html) return '';

                let chars = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;',
                    '/': '&#x2F;',
                    '`': '&#x60;',
                    '=': '&#x3D;'
                };
                return html.replace(/[&<>"'`=\/]/g, function (s) {
                    return chars[s];
                });
            }
            /**
             * Merge array data into string template.<br>
             * <code>
             * Example: 
             * <pre>
             * Strings.format('%s like %s %f!', 'I', 'JSDK', 2.1); //Return 'I like JSDK 2.1!'
             * </pre>
             * </code>
             * List type symbols in template:
             * <pre>
             * %% return %
             * %s return string
             * %b return true or false
             * %d return integer
             * %f return float number
             * %n return \n 
             * </pre>
             */
            public static format(tpl: string, ...data: any[]) {
                if (!tpl) return tpl;

                let i = 0;
                data = data||[];
                return tpl.replace(/\%(%|s|b|d|f|n)/gm, (s, ...args: any[]) => {
                    let v = i>=data.length?'':data[i++];
                    switch(args[0]){
                        case 'b': {
                            v = Boolean(v).toString();
                            break;
                        }
                        case 'd': {
                            v = Number(v).toInt().toString();
                            break;
                        }
                        case 'f': {
                            v = Number(v).stringify();
                            break;
                        }
                        case 'n': {
                            v = '\n';
                            break;
                        }
                        case '%': {
                            v = '%';
                        }
                    }
                    return v
                })
            }

            /**
             * Merge json data into string template.<br>
             * 将JSON数据合并至模版中返回
             * 
             * <code>
             * Example:
             * <pre>
             * Strings.merge('{a} like {b}!', {a:'I', b:'JSDK'}); //Return 'I like JSDK!'
             * </pre>
             * </code>
             * @param tpl 
             * @param data JsonObject<PrimitiveType | (data:JsonObject, match:string, key:string)=>string>
             */
            public static merge(tpl:string, data: JsonObject<PrimitiveType|((data:JsonObject, match:string, key:string)=>string)>){
                if (!tpl || !data) return tpl;

                return tpl.replace(/\{(\w+)\}/g, (str, ...args:any[]) => {
                    let m =args[0], s = data[m];
                    return s===undefined? str:(Types.isFunction(s)?(<Function>s)(data, str, m):(s==null?'':String(s)))
                });
            }
        }
    }
}

import Strings = JS.util.Strings;