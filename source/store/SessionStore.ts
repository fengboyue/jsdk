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

        let S = sessionStorage;

        /**
         * Session store helper.
         */
        export class SessionStore {

            static get<T extends StoreDataType>(key: string): T {
                let str = S.getItem(key);
                if(!str) return undefined;

                return <T>StoreHelper.parse(str);
            };
            static set(key: string, value: StoreDataType): void {
                S.setItem(key, StoreHelper.toString(value));
            };
            static remove(key: string): void {
                S.removeItem(key);
            };
            static key(i: number): string {
                return S.key(i);
            };
            static size(): number {
                return S.length;
            };
            static clear() {
                S.clear();
            };

        }

    }

}
import SessionStore = JS.store.SessionStore;
