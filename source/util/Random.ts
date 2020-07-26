/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="Types.ts"/>

module JS {

    export namespace util {

        var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

        /**
         * Random util class<br>
         * 随机数工具类
         */
        export class Random {

            /**
            * Gets randomly generated number within given max number
            * @param maxNumber maxValue. The default value is 1.
            * @param isInt if true returns integer
            */
            public static number(max?: number, isInt?: boolean): number
            /**
            * Gets randomly generated number within given min and max range: [min, max]
            * @param range { min?: number, max: number }
            * @param isInt if true returns integer
            */
            public static number(range?: { min?: number, max: number }, isInt?: boolean): number
            public static number(range?: number | { min?: number, max: number }, isInt?: boolean): number {
                let num: number = 0, min = 0, max = 1;

                if (Types.isNumber(range)) {
                    max = <number>range;
                } else {
                    min = (<any>range).min || 0;
                    max = (<any>range).max;
                }
                num = Math.random() * (max - min) + min;
                return isInt ? Number(num).toInt() : num;
            }

            /**
             * Returns a random string by special chars.
             * @param len 
             * @param chars 
             */
            public static string(len?: number, chars?: string): string {
                return this._str(chars?chars.split(''):CHARS, len)
            }
            /**
             * Returns a new UUID string.<br>
             * 生成一个新的UUID
             * @param len maxlength 最大长度
             * @param radix 2|8|16|... 进制数，比如：二进制、八进制、十六进制...
             */
            public static uuid(len?: number, radix?: number): string {
                return this._str(CHARS, len, radix)
            }
            
            private static _str(chars: string[], len?: number, radix?: number): string {
                var uuid = [], i;
                radix = radix || chars.length;

                if (len) {
                    // Compact form  
                    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
                } else {
                    // rfc4122, version 4 form  
                    var r;

                    // rfc4122 requires these characters  
                    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                    uuid[14] = '4';

                    // Fill in random data.  At i==19 set the high bits of clock sequence as  
                    // per rfc4122, sec. 4.1.5  
                    for (i = 0; i < 36; i++) {
                        if (!uuid[i]) {
                            r = 0 | Math.random() * 16;
                            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                        }
                    }
                }

                return uuid.join('');
            }
        }
    }
}

import Random = JS.util.Random;



