/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../lang/System.ts"/>
/// <reference path="StoreHelper.ts"/>

module JS {

    export namespace store {

        let D = document;
        /**
         * Cookie helper.
         */
        export class CookieStore{

            /**
             * 缺省的Cookie过期时间
             */
            public static EXPIRES_DATETIME = 'Wed, 15 Apr 2099 00:00:00 GMT';
            /**
             * 缺省的数值存取路径
             */
            public static PATH = '/';
            /**
             * 缺省的数值存取域名
             */
            public static DOMAIN = self.document?D.domain:null;//在线程中引用时没有window／document对象

            static get<T = StoreDataType>(key: string): T {
                let reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)", "gi"),
                    data = reg.exec(D.cookie),
                    str = data ? window['unescape'](data[2]) : null;
                
                return <T>StoreHelper.parse(str);
            };
            static set(key: string, value: StoreDataType, expireHours?: number, path?: string): void {
                if (!key) return;

                let exp: string = CookieStore.EXPIRES_DATETIME;
                if (Types.isDefined(expireHours) && expireHours > 0) {
                    var date = new Date();
                    date.setTime(date.getTime() + expireHours * 3600 * 1000);
                    exp = date.toUTCString();
                }
                let p = path ? path : CookieStore.PATH;
                let domain = CookieStore.DOMAIN;
                if (domain) domain = 'domain=' + domain;
                D.cookie = key + '=' + window['escape']('' + StoreHelper.toString(value)) + '; path=' + p + '; expires=' + exp + domain;
            };
            static remove(key: string): void {
                let date = new Date();
                date.setTime(date.getTime() - 10000);
                D.cookie = key + "=; expire=" + date.toUTCString();
            };
            static clear() {
                D.cookie = '';
            };

        }
    }

}
import CookieStore = JS.store.CookieStore;
