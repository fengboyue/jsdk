/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../lang/System.ts"/>

module JS {

    export namespace store {

        export type StoreDataType = PrimitiveType | Date | JsonObject<any> | Array<any>;

        export class StoreHelper{

            public static toString(value:StoreDataType): string{
                if(Types.isUndefined(value)) return 'undefined';
                if(Types.isNull(value)) return 'null';
                
                if(Types.isString(value)) return JSON.stringify(['string', value]);
                if(Types.isArray(value)) return JSON.stringify(['array', JSON.stringify(value)]);
                if(Types.isBoolean(value)) return JSON.stringify(['boolean', value]);
                if(Types.isNumber(value)) return JSON.stringify(['number', value]);
                if(Types.isDate(value)) return JSON.stringify(['date',''+(<Date>value).valueOf()]);
                if(Types.isJsonObject(value)) return JSON.stringify(['json', JSON.stringify(value)]);
            }

            public static parse<T = StoreDataType>(data:string): T{
                if(Type.null==data) return null;
                if(Type.undefined==data) return undefined;

                let [type, val] = JSON.parse(data), v:any = val;
                switch(type){
                    case Type.object: v = JSON.parse(val); break;
                    case Type.array: v = JSON.parse(val); break;
                    case Type.number: v = Number(val); break;
                    case Type.boolean: v = Boolean(val); break;
                    case Type.date: v = new Date(val); break;
                }
                return v;
            }
        }

    }

}
import StoreDataType = JS.store.StoreDataType;
import StoreHelper = JS.store.StoreHelper;