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

        type StorePrimitiveType = PrimitiveType | Date | JsonObject<PrimitiveType> | Array<PrimitiveType>;
        export type StoreDataType = StorePrimitiveType | JsonObject<StorePrimitiveType> | Array<StorePrimitiveType>;

        let T = Types, J = Jsons, TP = Type, S = J.stringify;
        export class StoreHelper{

            public static toString(value:StoreDataType): string{
                if(T.isUndefined(value)) return 'undefined';
                if(T.isNull(value)) return 'null';
                
                if(T.isString(value)) return S(['string', value]);
                if(T.isBoolean(value)) return S(['boolean', value]);
                if(T.isNumber(value)) return S(['number', value]);
                if(T.isDate(value)) return S(['date',''+(<Date>value).valueOf()]);
                if(T.isArray(value) || T.isJsonObject(value)) return S(['object', S(value)]);
            }

            public static parse<T = StoreDataType>(data:string): T{
                if(TP.null==data) return null;
                if(TP.undefined==data) return undefined;

                let [type, val] = J.parse(data), v:any = val;
                switch(type){
                    case TP.boolean: v = Boolean(val); break;
                    case TP.number: v = Number(val); break;
                    case TP.date: v = new Date(val); break;
                    case TP.array: v = J.parse(val); break;
                    case TP.json: v = J.parse(val); break;
                }
                return v;
            }
        }

    }

}
import StoreDataType = JS.store.StoreDataType;
import StoreHelper = JS.store.StoreHelper;