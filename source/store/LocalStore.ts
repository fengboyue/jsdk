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

        /**
         * Local store helper.
         */
        export class LocalStore {

            static get<T extends StoreDataType>(key: string): T {
                let str = localStorage.getItem(key);
                if(!str) return undefined;

                return <T>StoreHelper.parse(str);
            };
            static set(key: string, value: StoreDataType): void {
                localStorage.setItem(key, StoreHelper.toString(value));
            };
            static remove(key: string): void {
                localStorage.removeItem(key);
            };
            static key(i: number): string {
                return localStorage.key(i);
            };
            static size(): number {
                return localStorage.length;
            };
            static clear() {
                localStorage.clear();
            };

        }

    }

}
import LocalStore = JS.store.LocalStore;
