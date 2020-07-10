/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="Types.ts"/>
/// <reference path="Check.ts"/>

module JS {

    export namespace util {

        /**
         * Json helper class<br>
         * JSON工具类
         */
        export class Jsons {

            /**
             * Converts a JSON string into a JSON object.
             * @param text A valid JSON string.
             * @param reviver A function that transforms the results. This function is called for each member of the object.
             * If a member contains nested objects, the nested objects are transformed before the parent object is.
             * @return {any}
             */
            public static parse(text: string, reviver?: (key: any, value: any) => any): any {
                return text ? JSON.parse(text, reviver) : null;
            }
            /**
             * Converts a JavaScript value to a JSON string.
             * @param value A JavaScript value, usually an object or array, to be converted.
             * @param replacer A function that transforms the results.
             * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
             * @return {string}
             */
            public static stringfy(value: any, replacer?: (key: string, value: any) => any | (number | string)[] | null, space?: string | number): string {
                return JSON.stringify(value, replacer, space);
            }

            /**
             * Clone json object or array or date.
             */
            public static clone<T>(obj: T): T {
                if (obj == void 0 || 'object' != typeof obj) return obj;

                let copy: any;
                // Handle Date
                if (obj instanceof Date) {
                    copy = new Date();
                    copy.setTime(obj.getTime());
                    return copy;
                }

                // Handle Array
                if (obj instanceof Array) {
                    copy = [];
                    for (var i = 0, len = obj.length; i < len; ++i) {
                        copy[i] = this.clone(obj[i]);
                    }
                    return copy;
                }

                // Handle Json Object
                if (Types.isJsonObject(obj)) {
                    copy = {};
                    var keys = Reflect.ownKeys(<any>obj);
                    keys.forEach(key => {
                        copy[key] = this.clone(obj[<any>key]);
                    })
                    return copy;
                }
                return obj;
            }

            public static forEach<T>(json: JsonObject<T>, fn: (value: T, key: string) => any, that?: any): void {
                if (!json) return;
                let keys = Object.keys(json);
                keys.forEach((key, i) => {
                    fn.apply(that || json, [json[key], key]);
                })
            }
            public static some<T>(json: JsonObject<T>, fn: (value: T, key: string) => boolean, that?: any): boolean {
                if (!json) return;
                let keys = Object.keys(json);
                return keys.some((key, i) => {
                    return fn.apply(that || json, [json[key], key]);
                })
            }
            public static hasKey(json: JsonObject, key: string) {
                return json && key && json.hasOwnProperty(key);
            }
            public static values<T>(json: JsonObject<T>): T[] {
                if (!json) return null;
                let arr: T[] = [];
                Jsons.forEach(json, v => {
                    arr[arr.length] = v;
                })
                return arr;
            }
            public static keys(json: JsonObject): string[] {
                if (!json) return null;
                let keys = [];
                Jsons.forEach(json, (v, k) => {
                    keys[keys.length] = k;
                })
                return keys;
            }

            /**
             * Json1's keys == Json2's keys
             */
            public static equalKeys(json1: JsonObject, json2: JsonObject) {
                let empty1 = Check.isEmpty(json1), empty2 = Check.isEmpty(json2);
                if (empty1 && empty2) return true;
                if (empty1 || empty2) return false;

                let map2 = Jsons.clone(json2);
                Jsons.forEach(json1, (v, k) => {
                    delete map2[k];
                })
                return Check.isEmpty(map2);
            }
            /**
             * Compares two simple JSON objects.
             */
            public static equal(json1: JsonObject<PrimitiveType>, json2: JsonObject<PrimitiveType>) {
                let empty1 = Check.isEmpty(json1), empty2 = Check.isEmpty(json2);
                if (empty1 && empty2) return true;
                if (empty1 || empty2) return false;

                let map2 = Jsons.clone(json2);
                Jsons.forEach(json1, (v, k) => {
                    if ((k in map2) && map2[k] === v) delete map2[k];
                })
                return Check.isEmpty(map2);
            }

            /**
             * Returns a new json object with new key-names.<br>
             * 将JSON对象中指定属性名称替换成新属性名并返回
             */
            public static replaceKeys(json: JsonObject, keyMapping: JsonObject<string> | ((this: JsonObject, val: any, key: string) => string), needClone?: boolean): JsonObject {
                if (!keyMapping) return json;

                let clone = needClone ? Jsons.clone(json) : json;
                this.forEach(clone, function (val: any, oldKey: string) {
                    let newKey = Types.isFunction(keyMapping) ? (<Function>keyMapping).apply(clone, [val, oldKey]) : keyMapping[oldKey];
                    if (newKey != oldKey && clone.hasOwnProperty(oldKey)) {
                        let temp = clone[oldKey];
                        delete clone[oldKey];
                        clone[newKey] = temp;
                    }
                })
                return clone;
            }

            private static _union(...args) {
                var options, name, src, copy, copyIsArray, clone,
                    target = arguments[0] || {},
                    i = 1,
                    length = arguments.length,
                    deep = false;

                // Handle a deep copy situation
                if (typeof target === "boolean") {
                    deep = target;

                    // Skip the boolean and the target
                    target = arguments[i] || {};
                    i++;
                }

                // Handle case when target is a string or something (possible in deep copy)
                if (typeof target !== "object" && !Types.isFunction(target)) {
                    target = {};
                }

                for (; i < length; i++) {

                    // Only deal with non-null/undefined values
                    if ((options = arguments[i]) != null) {

                        // Extend the base object
                        for (name in options) {
                            src = target[name];
                            copy = options[name];

                            // Prevent never-ending loop
                            if (target === copy) {
                                continue;
                            }

                            // Recurse if we're merging plain objects or arrays
                            if (deep && copy && (Types.isJsonObject(copy) ||
                                (copyIsArray = Array.isArray(copy)))) {

                                if (copyIsArray) {
                                    copyIsArray = false;
                                    clone = src && Array.isArray(src) ? src : [];

                                } else {
                                    clone = src && Types.isJsonObject(src) ? src : {};
                                }

                                // Never move original objects, clone them
                                target[name] = Jsons._union(deep, clone, copy);

                            } else if (copy !== undefined) {//undefined不符合JSON规范，且name不存在时值也可能是undefined
                                target[name] = copy;
                            }
                        }
                    }
                }

                // Return the modified object
                return target;
            };

            /**
             * Returns a newly merged JSON object and the following JSON object will deeply overwrites the previous JSON object.<br>
             * Note: the key whose value is undefined in json2 will be ignored.<br>
             * 返回合并后的Json对象: 后面的JSON对象深度覆盖前面的JSON对象<br>
             * 注意：Json2中值为undefined的key会被忽略。
             */
            public static union(...jsons: JsonObject[]): JsonObject {
                if (arguments.length <= 1) return jsons[0];
                return this._union.apply(this, [true, {}].concat(jsons));
            }

            /**
             * Returns {json1 - json2}
             */
            public static minus(json1: JsonObject, json2: JsonObject) {
                if (Check.isEmpty(json1) || Check.isEmpty(json2)) return json1;

                let newJson = {};
                Jsons.forEach(json1, (v, k) => {
                    if (!(<Object>json2).hasOwnProperty(k)) newJson[k] = v;
                })
                return newJson;
            }
            /**
             * Returns {json1 ^ json2} 
             */
            public static intersect(json1: JsonObject, json2: JsonObject) {
                if (Check.isEmpty(json1) || Check.isEmpty(json2)) return json1;

                let newJson = {};
                Jsons.forEach(json1, (v, k) => {
                    if ((<Object>json2).hasOwnProperty(k)) newJson[k] = v;
                })
                return newJson;
            }

            /**
             * Returns a filtered JSON.
             * @param json 
             * @param fn If the function returns TRUE then save the key, otherwise remove the key.<br>
             * 过滤函数。返回true表示保留该键值，false则不保留。
             */
            public static filter(json: JsonObject, fn: (this: JsonObject, value: object, key: string) => boolean): JsonObject {
                let newJson = {};
                Jsons.forEach(json, (v, k) => {
                    if (fn.apply(json, [v, k])) newJson[k] = v;
                })
                return newJson;
            }

            /**
             * Gets value by the property path from JSON data.<br>
             * 
             * Example:
             * <pre>
             * let json = {a:{b:{c:1}}};
             * Jsons.find(json, 'a.b.c'); //print 1
             * </pre>
             * @param data json data
             * @param path the path string of property 
             */
            public static find(data: JsonObject, path: string) {
                if (!path) return data;

                const array = path.split('.');
                if (array.length == 1) return data[path];

                let v = data;
                array.forEach((a: string) => {
                    if (v && a) v = v[a];
                });
                return v;
            }
        }
    }
}

import Jsons = JS.util.Jsons;