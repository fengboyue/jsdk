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

        let N = Number, _test = function (s: string, exp: RegExp) {
            return s && exp.test(s.trim());
        },
        EMAIL = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@([A-Za-z0-9]+(?:-[A-Za-z0-9]+)?\.)+[A-Za-z0-9]+(?:-[A-Za-z0-9]+)?$/,//符合RFC规范
        EMAIL_DOMAIN = /^@([A-Za-z0-9]+(?:-[A-Za-z0-9]+)?\.)+[A-Za-z0-9]+(?:-[A-Za-z0-9]+)?$/,//符合RFC规范
        YYYY_MM_DD = /^(\d{1,4})(-|\/)(\d{1,2})(-|\/)(\d{1,2})$/,
        HALFWIDTH_CHARS = /^[\u0000-\u00FF]+$/,
        FULLWIDTH_CHARS = /^[\u0391-\uFFE5]+$/,
        NUMBERS_ONLY = /^\d+$/,
        LETTERS_ONLY = /^[A-Za-z]+$/,
        LETTERS_OR_NUMBERS = /^[A-Za-z\d]+$/,
        ENGLISH_ONLY = /^[A-Za-z\d\s\`\~\!\@\#\$\%\^\&\*\(\)\_\-\+\=\[\]\{\}\|\:\;\"\'\<\>\,\.\?\\\/]+$/,
        CHINESE_ONLY = /^[\u4E00-\u9FA5]+$/,
        IP = /^(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5])$/;

        /**
         * Check helper<br>
         * 类型检查类
         */
        export class Check {

            /**
             * Is null or undefined or an empty string|array|JSON|object.<br>
             * 是不是null、undefinded、空字符串、数组、JSON或对象
             */
            public static isEmpty(v: any): boolean {
                return v == void 0
                    || v === ''
                    || (v.hasOwnProperty('length') && v.length == 0)
                    || Check.isEmptyObject(v)
            }
            /**
             * Is an empty object without any property.<br>
             * 是不是无属性的空对象
             */
            public static isEmptyObject(v: any):boolean {
                var name;
                for ( name in v ) {return false}
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
            public static isFormatDate(s: string, format?: RegExp): boolean {
                return _test(s, format||YYYY_MM_DD);
            }
            /**
             * Is a valid email address with pattern format.<br>
             * 是否为合法的电子邮箱地址
             */
            public static isEmail(s: string, exp?:RegExp): boolean {
                return _test(s, exp?exp:EMAIL);
            }
            /**
             * Is a valid email addresses splited with space or comma.<br>
             * 是否为合法的多个由空格或分号分隔的电子邮箱地址
             */
            public static isEmails(s: string, exp?:RegExp): boolean {
                s = s || '';
                if (this.isBlank(s)) return false;

                return s.split(/;|\s+/).every(as=>{
                    return as.length == 0 || this.isEmail(as, exp)
                })
            }
            /**
             * Is a valid email domain.<br>
             * 是否为合法电子邮箱后缀：英文字母或数字组成
             */
            public static isEmailDomain(str: string): boolean {
                return _test(str, EMAIL_DOMAIN);
            }
            /**
             * Is only number 0~9.<br>
             * 是否仅数字0-9
             */
            public static isOnlyNumber(str: string): boolean {
                return _test(str, NUMBERS_ONLY);
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
                return _test(str, HALFWIDTH_CHARS);
            }
            /**
             * Each character is a full-width character.<br>
             * 全部是全角字符
             */
            public static isFullwidthChars(str): boolean {
                return _test(str, FULLWIDTH_CHARS);
            }
            /**
             * Only English letters and its characters.<br> 
             * 仅仅英文字母及其字符
             */
            public static isEnglishOnly(str: string): boolean {
                return _test(str, ENGLISH_ONLY);
            }
            /**
             * Only Chinese letters and its characters.<br> 
             * 仅仅是中文字
             */
            public static isChineseOnly(str: string): boolean {
                return _test(str, CHINESE_ONLY);
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
            public static shorter(s: string, len: number): boolean {
                return s && s.length < len;
            }
            /**
             * True if a string's length >= len.<br>
             * 比指定长度长
             */
            public static longer(s: string, len: number): boolean {
                return s && s.length > len;
            }
            /**
             * True if a string's length == len.<br>
             * 字符串长度是否等于指定长度
             */
            public static equalLength(s: string, len: number): boolean {
                return s && s.length == len;
            }
            /**
             * Is only english letters.<br>
             * 是否仅字母组成
             */
            public static isLettersOnly(s: string): boolean {
                return _test(s, LETTERS_ONLY);
            }
            /**
             * Is only english letters or chars.<br>
             * 是否字母或数字
             */
            public static isLettersOrNumbers(s: string): boolean {
                return _test(s, LETTERS_OR_NUMBERS);
            }
            /**
             * Is a valid format IP.<br>
             * 是否合法的IP地址
             */
            public static isIP(s: string): boolean {
                return _test(s.trim(), IP);
            }
            /**
             * Is a valid URL.<br>
             * @param url 
             */
            public static isExistUrl(url: string): Promise<boolean> {
                let xhr: XMLHttpRequest = new XMLHttpRequest();
                return new Promise(function(resolve, reject){
                    xhr.onreadystatechange=()=>{
                        //4 is DONE, compatible with IE
                        if (xhr.readyState == 4) xhr.status == 200? resolve(true):reject(false)
                    };
                    xhr.open('HEAD', url, true);
                    xhr.send();
                })
            }
            /**
             * Check a string with the pattern.<br>
             * 按正则表达式检查
             */
            public static isPattern(s: string, exp: RegExp): boolean {
                return _test(s, exp);
            }
            /**
             * Check by server.<br>
             * 服务器端校验
             */
            public static byServer(req: string | HttpRequest, judge: (res: HttpResponse) => boolean): Promise<boolean> {
                return new Promise(function(resolve, reject){
                    Http.send(req).then(res => {
                        judge.apply(null, [res])?resolve(true):reject(false)
                    })
                })
            }

        }
    }
}

import Check = JS.util.Check;