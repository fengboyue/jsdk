/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../lang/System.ts"/>
/// <reference path="../reflect/Class.ts"/>
/// <reference path="Annotation.ts"/>

module JS {

    export namespace ioc {

        export interface IComponent {
            initialize();
            destroy();
        }

        export class Components {

            private static _cmps: JsonObject = {};

            public static get<T>(klassName: string): T
            public static get<T>(klass: Klass<T>): T
            public static get<T>(cmpt: string | Klass<T>): T {
                let cmp:T;
                if (Types.isString(cmpt)) {
                    cmp = this._cmps[<string>cmpt];
                } 

                if (!cmp) cmp = this.add(<any>cmpt);
                return cmp
            }

            public static add<T>(klassName: string): T
            public static add<T>(klass: Klass<T>): T
            public static add<T>(cmpt: string | Klass<T>): T {
                let cmp, clazz = Class.forName(cmpt);
                    if(!clazz) return undefined;
                    if(this._cmps.hasOwnProperty(clazz.name)){
                        return this._cmps[clazz.name];
                    }else{
                        cmp = clazz.newInstance<T>();
                        //先注入字段
                        this._injectFields(clazz, cmp);
                        //再初始化
                        this._cmps[clazz.name] = cmp;
                        if ((<any>cmp).initialize) (<any>cmp).initialize();
                    }
                return cmp    
            }

            public static remove(klassName: string )
            public static remove(klassName: Klass<any>)
            public static remove(cmpt: string | Klass<any>) {
                let clazz = Class.forName(cmpt);
                if(!clazz) return;

                let cmp = this._cmps[clazz.name];
                if (cmp) {
                    if (cmp.destroy) cmp.destroy();
                    delete this._cmps[clazz.name];
                }
            }

            public static clear(){
                Jsons.forEach(this._cmps, cmp => {
                    if (cmp.destroy) cmp.destroy();
                })
                this._cmps = {};
            }

            private static _injectFields(clazz: Class<any>, cmp: any) {
                let fields = clazz.fieldsMap(cmp, inject);//inject all autowaired fields
                Jsons.forEach(fields, (v: Field, k: string) => {
                    let f = <Klass<any>>Annotations.getPropertyType(cmp, k);
                    if (!f || !Types.equalKlass(f)) throw new Errors.TypeError('The type of Field[' + k + '] is invalid!');

                    let cls:Class<any> = (<any>f).class;
                    cmp[k] = this.get(cls.name);
                });
            }
        }
    }
}

//预定义短类名
import IComponent = JS.ioc.IComponent
import Components = JS.ioc.Components

