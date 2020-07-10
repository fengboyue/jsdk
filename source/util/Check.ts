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

        let N = Number, _test = function (str: string, pattern: RegExp) {
            return str && pattern.test(str.trim());
        }

        /**
         * Check helper<br>
         * 类型检查类
         */
        export class Check {

            public static EMAIL = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@([A-Za-z0-9]+(?:-[A-Za-z0-9]+)?\.)+[A-Za-z0-9]+(?:-[A-Za-z0-9]+)?$/;//符合RFC规范
            public static EMAIL_DOMAIN = /^@([A-Za-z0-9]+(?:-[A-Za-z0-9]+)?\.)+[A-Za-z0-9]+(?:-[A-Za-z0-9]+)?$/;//符合RFC规范
            public static YYYY_MM_DD = /^(\d{1,4})(-|\/)(\d{1,2})(-|\/)(\d{1,2})$/;
            public static HALFWIDTH_CHARS = /^[\u0000-\u00FF]+$/;
            public static FULLWIDTH_CHARS = /^[\u0391-\uFFE5]+$/;
            public static NUMBERS_ONLY = /^\d+$/;
            public static LETTERS_ONLY = /^[A-Za-z]+$/;
            public static LETTERS_OR_NUMBERS = /^[A-Za-z\d]+$/;
            public static ENGLISH_ONLY = /^[A-Za-z\d\s\`\~\!\@\#\$\%\^\&\*\(\)\_\-\+\=\[\]\{\}\|\:\;\"\'\<\>\,\.\?\\\/]+$/;
            public static CHINESE_ONLY = /^[\u4E00-\u9FA5]+$/;
            public static IP = /^(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5])$/;

            /**
             * Is null or undefined or an empty string|array|JSON|object.<br>
             * 是不是null、undefinded、空字符串、数组、JSON或对象
             */
            public static isEmpty(obj: any): boolean {
                return obj == void 0
                    || obj === ''
                    || (obj.hasOwnProperty('length') && obj.length == 0)
                    || this.isEmptyObject(obj)
            }
            /**
             * Is an empty object without any property.<br>
             * 是不是无属性的空对象
             */
            public static isEmptyObject(obj: any):boolean {
                var name;
                for ( name in obj ) {
                    return false;
                }
                return true;
            }

            /**
             * Is a blank string.<br>
             * 是不是空白字符串
             */
            public static isBlank(s: string): boolean {
                return s == void 0 || s.trim() === '';
            }

            /**
             * Is a date string. The default format is YYYY-MM-DD or YYYY/MM/DD.<br>
             * 是否为日期格式
             */
            public static isFormatDate(str: string, format?: RegExp): boolean {
                return _test(str, format||this.YYYY_MM_DD);
            }
            /**
             * Is a valid email address with pattern format.<br>
             * 是否为合法的电子邮箱地址
             */
            public static isEmail(str: string, pattern?:RegExp): boolean {
                return _test(str, pattern?pattern:this.EMAIL);
            }
            /**
             * Is a valid email addresses splited with space or comma.<br>
             * 是否为合法的多个由空格或分号分隔的电子邮箱地址
             */
            public static isEmails(str: string, pattern?:RegExp): boolean {
                str = str || '';
                if (this.isBlank(str)) return false;

                var arr = str.split(/;|\s+/);
                for (var i = 0; i < arr.length; i++) {
                    var str = arr[i];
                    if (str.length > 0 && !this.isEmail(str, pattern)) return false;
                }
                return true;
            }
            /**
             * Is a valid email domain.<br>
             * 是否为合法电子邮箱后缀：英文字母或数字组成
             */
            public static isEmailDomain(str: string): boolean {
                return _test(str, this.EMAIL_DOMAIN);
            }
            /**
             * Is only number 0~9.<br>
             * 是否仅数字0-9
             */
            public static isOnlyNumber(str: string): boolean {
                return _test(str, this.NUMBERS_ONLY);
            }
            /**
             * Is a positive number.<br>
             * 是否是正数。例如，'＋4.15','＋1,977'都是正数。
             */
            public static isPositive(n: number | string): boolean {
                return N(n).isPositive();
            }
            /**
             * Is a negative number.<br>
             * 是否是负数。例如，'-4.15','-1,977'都是负数。
             */
            public static isNegative(n: number | string): boolean {
                return N(n).isNegative();
            }
            /**
             * Each character is a half-width character.<br>
             * 全部是半角字符
             */
            public static isHalfwidthChars(str: string): boolean {
                return _test(str, this.HALFWIDTH_CHARS);
            }
            /**
             * Each character is a full-width character.<br>
             * 全部是全角字符
             */
            public static isFullwidthChars(str): boolean {
                return _test(str, this.FULLWIDTH_CHARS);
            }
            /**
             * Only English letters and its characters.<br> 
             * 仅仅英文字母及其字符
             */
            public static isEnglishOnly(str: string): boolean {
                return _test(str, this.ENGLISH_ONLY);
            }
            /**
             * Only Chinese letters and its characters.<br> 
             * 仅仅是中文字
             */
            public static isChineseOnly(str: string): boolean {
                return _test(str, this.CHINESE_ONLY);
            }
            /**
             * Is a valid number with valid lengths.<br>
             * 检查数字及格式："{整数位长度}.{小数位长度}"
             * @param n 
             * @param iLength integral part's length
             * @param fLength fractional part's length
             */
            public static isFormatNumber(n: number | string, iLength: number, fLength?: number): boolean {
                if (!Types.isNumeric(n)) return false;

                let num = N(n),
                    iLen = num.integerLength(),
                    dLen = num.fractionLength();
                //检查整数位
                if (iLen > iLength) return false;
                //检查小数位
                if (Types.isDefined(fLength) && dLen > fLength) return false;
                return true;
            }
            /**
             * True if n1 > n2.<br>
             * 大于某值
             */
            public static greater(n1: number | string, n2: number | string): boolean {
                return N(n1) > N(n2);
            }
            /**
             * True if n1 >= n2.<br>
             * 大于等于某值
             */
            public static greaterEqual(n1: number | string, n2: number | string): boolean {
                return N(n1) >= N(n2);
            }
            /**
             * True if n1 < n2.<br>
             * 小于某值
             */
            public static less(n1: number | string, n2: number | string): boolean {
                return N(n1) < N(n2);
            }
            /**
             * True if n1 <= n2.<br>
             * 小于等于某值
             */
            public static lessEqual(n1: number | string, n2: number | string): boolean {
                return N(n1) <= N(n2);
            }
            /**
             * True if n > min and n < max.<br>
             * 是否在两数字之间
             */
            public static isBetween(n: number | string, min: number | string, max: number | string): boolean {
                let num = N(n);
                return num > N(min) && num < N(max);
            }
            /**
             * True if a string's length < len.<br>
             * 比指定长度短
             */
            public static shorter(str: string, len: number): boolean {
                return str && str.length < len;
            }
            /**
             * True if a string's length >= len.<br>
             * 比指定长度长
             */
            public static longer(str: string, len: number): boolean {
                return str && str.length > len;
            }
            /**
             * True if a string's length == len.<br>
             * 字符串长度是否等于指定长度
             */
            public static equalLength(str: string, len: number): boolean {
                return str && str.length == len;
            }
            /**
             * Is only english letters.<br>
             * 是否仅字母组成
             */
            public static isLettersOnly(str: string): boolean {
                return _test(str, this.LETTERS_ONLY);
            }
            /**
             * Is only english letters or chars.<br>
             * 是否字母或数字
             */
            public static isLettersOrNumbers(str: string): boolean {
                return _test(str, this.LETTERS_OR_NUMBERS);
            }
            /**
             * Is a valid format IP.<br>
             * 是否合法的IP地址
             */
            public static isIP(str: string): boolean {
                return _test(str.trim(), this.IP);
            }
            /**
             * Is a valid URL.<br>
             * @param url 
             */
            public static isExistUrl(url: string): boolean {
                let xhr: XMLHttpRequest = (<any>self).XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
                xhr.open('HEAD', url, false);
                xhr.send();
                return xhr.status == 200
            }
            /**
             * Check a string with the pattern.<br>
             * 按正则表达式检查
             */
            public static isPattern(str: string, exp: RegExp): boolean {
                return _test(str, exp);
            }
            /**
             * Check by server.<br>
             * 服务器端校验
             */
            public static byServer(settings: string | AjaxRequest, judge: (res: AjaxResponse) => boolean): Promise<boolean> {
                return new Promise(function(resolve, reject){
                    Ajax.send(settings).then(res => {
                        judge.apply(null, [res])?resolve(true):reject(false)
                    })
                })
            }

        }
    }
}

import Check = JS.util.Check;