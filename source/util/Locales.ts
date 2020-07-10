/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */

module JS {
    export namespace util {
        /**
         * Locale string such as "zh-CN", "zh", "en-US", "en"
         */
        export type Locale = string;

        /**
         * Locale Helper
         */
        export class Locales {
            /**
             * Parses and returns the language of locale string.
             * 解析并返回时区字符串中的语言信息
             */
            public static lang(locale: Locale) {
                if (!locale) return null;

                let arr = locale.split('-');
                if (arr.length == 1) return locale;
                return arr[0]
            }
            /**
             * Parses and returns the country of locale string.
             * 解析并返回时区字符串中的国别信息
             */
            public static country(locale: Locale) {
                if (!locale) return null;

                let arr = locale.split('-');
                if (arr.length == 1) return null;
                return arr[1]
            }
        }
    }
}
import Locale = JS.util.Locale;
import Locales = JS.util.Locales;