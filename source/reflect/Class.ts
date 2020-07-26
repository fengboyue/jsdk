/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../util/Check.ts"/>
/// <reference path="../util/Jsons.ts"/>
/// <reference path="../util/Arrays.ts"/>
/// <reference path="../util/Functions.ts"/>
/// <reference path="../util/Strings.ts"/>
/// <reference path="../util/Log.ts"/>
/// <reference path="../lang/Annotation.ts"/>

module JS {

    export namespace reflect {

        let Y = Types, J = Jsons;

        /**
         * The @klass annotation.
         */
        export function klass(fullName: string): any {
            return Annotations.define({
                name: 'klass',
                handler: (anno: string, values: Array<any>, obj: Function | object) => {
                    Class.register(<Function>obj, values[0]);
                },
                target: AnnotationTarget.CLASS
            }, [fullName]);
        }

        /**
         * The reflected class of a method.
         * @final
         */
        export class Method {
            public readonly ownerClass: Class<any>;
            public readonly name: string;
            public readonly paramTypes: Array<Type>;
            public readonly returnType: Type;
            public readonly fn: Function;
            public readonly isStatic: boolean = false;
            public readonly annotations: string[] = [];
            public readonly parameterAnnotations: string[] = [];

            constructor(clazz: Class<any>, name: string, isStatic: boolean, fn: Function, paramTypes: Array<Type>, returnType: Type) {
                this.ownerClass = clazz;
                this.name = name;
                this.paramTypes = paramTypes;
                this.returnType = returnType;
                this.fn = fn;
                this.isStatic = isStatic;
            }
            public invoke(obj: object, ...args: Array<any>): any {
                let fn = this.isStatic ? this.ownerClass.getKlass() : this.fn,
                    context = this.isStatic ? this.ownerClass.getKlass() : obj;
                return Reflect.apply(fn, context, args);
            }
        }
        /**
         * The reflected class of a field.
         * @final
         */
        export class Field {
            public readonly ownerClass: Class<any>;
            public readonly name: string;
            public readonly type: Type;
            public readonly isStatic: boolean = false;
            public readonly annotations: string[] = [];

            constructor(clazz: Class<any>, name: string, isStatic: boolean, type: Type) {
                this.ownerClass = clazz;
                this.name = name;
                this.type = type;
                this.isStatic = isStatic;
            }

            public set(value: any, obj?: object): void {
                let target: any = this.isStatic ? this.ownerClass.getKlass() : obj;
                target[this.name] = value;
            }
            public get(obj?: object): any {
                let target: any = this.isStatic ? this.ownerClass.getKlass() : obj;
                return target[this.name];
            }
        }
        /**
         * The reflected class for a class.
         * @final
         */
        export class Class<T> {
            /**
             * Full name
             */
            public readonly name: string;
            public readonly shortName: string;
            private _klass: T;
            private _superklass: T;

            private _methods: JsonObject<Method> = {};
            private _fields: JsonObject<Field> = {};

            /**
             * @constructor
             * @param name full name
             * @param klass class constructor
             */
            constructor(name: string, klass: T) {
                this.name = name;
                (<any>klass).class = this;
                this._klass = klass;
                this.shortName = (<any>this._klass).name;
                this._superklass = <any>Class.getSuperklass(<any>this._klass);
                this._init();
            }

            public static getSuperklass(klass: Klass<any>): Klass<any> {
                if (Object === klass) return null;
                let sup = Object.getPrototypeOf(klass);
                return <Klass<any>>Object.getPrototypeOf(Object) === sup ? Object : sup;
            }

            private static _reflectable(obj: Object, className: string): void {
                obj.className = className;

                if (!obj.getClass) {//如果没注解过，则动态创建此函数
                    obj.getClass = function (): Class<any> {
                        return Class.forName(this.className);
                    }
                }
            }

            /**
             * Converts class full name to class constructor
             */
            public static byName(name: string): Klass<any> {
                if (!name) return null;

                var p = name.split('.'), len = p.length, p0 = p[0], b = window[p0] || eval(p0);
                if (!b) throw new TypeError('Can\'t found class:' + name);

                for (var i = 1; i < len; i++) {
                    var pi = p[i]; if (!pi) break;
                    b[pi] = b[pi] || {};
                    b = b[pi];
                }
                return b;
            }

            /**
             * Returns a new instance of a class constructor or its fullname.
             */
            public static newInstance<T>(ctor: string | Klass<T>, ...args): T {
                let tar = Y.isString(ctor) ? Class.byName(<string>ctor) : <Function>ctor;
                if (!tar) throw new NotFoundError(`The class<${ctor}> is not found!`);

                return <T>Reflect.construct(tar, J.clone(args))
            }

            /**
             * Returns a new instance of a class constructor or its alias.
             */
            public static aliasInstance<T>(alias: string | Klass<T>, ...args): T {
                let cls = Class.forName(alias, true);
                if (!cls) throw new NotFoundError(`The class<${alias}> is not found!`);

                return cls.newInstance.apply(cls, args)
            }

            /**
             * Aspect a method of a class.
             * @param klass class constructor
             * @param method method name 
             * @param advisor 
             */
            public static aop<T>(klass: Klass<any>, method: string, advisor: AopAdvisor<T>) {
                let isStatic = klass.hasOwnProperty(method),
                    m: Function = isStatic ? klass[method] : klass.prototype[method];
                if (!Y.isFunction(m)) return;

                let obj = isStatic ? klass : klass.prototype;
                if (!obj.hasOwnProperty('__' + method)) obj['__' + method] = m;
                Object.defineProperty(obj, method, {
                    value: m.aop(advisor),
                    writable: true
                })
            }
            /**
             * Cancel all advisors of a class method.
             * @param klass class constructor
             * @param method method name 
             */
            public static cancelAop(klass: Klass<any>, method: string) {
                let isStatic = klass.hasOwnProperty(method),
                    m: Function = isStatic ? klass[method] : klass.prototype[method];
                if (!Y.isFunction(m)) return;

                let obj = isStatic ? klass : klass.prototype;
                obj[method] = obj['__' + method];
            }

            /**
             * Aspect a method of this class.
             * @param method method name 
             * @param advisor 
             */
            public aop<T>(method: string, advisor: AopAdvisor<T>) {
                let m = this.method(method);
                if (!m) return;
                let pro = m.isStatic ? this._klass : (<any>this._klass).prototype;
                pro[method] = m.fn.aop(advisor);
            }
            private _cancelAop(m: Method) {
                let pro = m.isStatic ? this._klass : (<any>this._klass).prototype;
                pro[m.name] = m.fn;
            }
            /**
             * Cancel all advisors of this class method.
             * @param method method name 
             */
            public cancelAop(method?: string) {
                let ms = method ? [this.method(method)] : this.methods();
                ms.forEach(m => {
                    this._cancelAop(m);
                })
            }
            /**
             * Equals a reflected Class. 
             */
            public equals(cls: Class<any>): boolean {
                return cls && this.getKlass() === cls.getKlass();
            }
            public equalsKlass(cls: Klass<any>): boolean {
                return cls && this.getKlass() === cls;
            }

            /**
             * Is subclass of a class.
             */
            public subclassOf(cls: Class<any> | Klass<any>): boolean {
                let klass: Klass<any> = (cls.constructor && cls.constructor === <any>Class) ? (<Class<any>>cls).getKlass() : <any>cls;
                return Y.subKlass(this.getKlass(), klass);
            }

            /**
             * Returns a new instance of this class.
             */
            public newInstance<T>(...args): T {
                let obj = Reflect.construct(<any>this._klass, Arrays.newArray(arguments));
                Class._reflectable(obj, this.name);
                return <T>obj;
            }

            /**
             * Returns the super class.
             */
            public getSuperclass(): Class<T> {
                if (this === Object.class) return null;
                return this._superklass ? (<any>this._superklass).class : Object.class;
            }

            /**
             * Returns the constructor of this class.
             */
            public getKlass<T>(): Klass<T> {
                return (<Function><any>this._klass).prototype.constructor;
            }

            private _parseStaticMembers(ctor: Function) {
                let mKeys = ctor === Object ? ['class'] : Reflect.ownKeys(ctor);
                for (let i = 0, len = mKeys.length; i < len; i++) {
                    const key = mKeys[i].toString();
                    if (!this._isValidStatic(key)) continue;
                    const obj = ctor[key];
                    if (Y.isFunction(obj)) {
                        this._methods[key] = new Method(this, key, true, <Function>obj, null, null);
                    } else {
                        this._fields[key] = new Field(this, key, true, Y.type(obj));
                    }
                }
            }
            private _parseInstanceMembers(proto: Function) {
                let protoKeys = proto === Object.prototype ? ['toString'] : Reflect.ownKeys(proto);
                for (let i = 0, len = protoKeys.length; i < len; i++) {
                    const key = protoKeys[i].toString();
                    if (!this._isValidInstance(key)) continue;
                    const obj = this._forceProto(proto, key);
                    if (Y.isFunction(obj)) {
                        this._methods[key] = new Method(this, key, false, <Function>obj, null, null);
                    } else {
                        this._fields[key] = new Field(this, key, false, Y.type(obj));
                    }
                }
            }

            //BUGFIX: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Called_on_incompatible_type
            private _forceProto(proto: any, key: string) {
                let rst: object;
                try {
                    rst = proto[key];
                } catch (e) {
                    if (<any>this._klass === File) {
                        if (key == 'lastModified') return 0;
                        if (key == 'lastModifiedDate') return new Date();
                    }
                    try {
                        let obj = this.newInstance();
                        return obj[key];
                    } catch (e1) {
                        return '';
                    }
                }
                return rst
            }

            private _isValidStatic(mName) {
                return ['prototype', 'name', 'length'].findIndex(v=>{
                    return v==mName
                }) < 0;
            }
            private _isValidInstance(mName) {
                return !mName.startsWith('__') && mName != 'constructor';
            }

            private _init() {//只能得到静态字段、静态方法、实例方法，无法得到实例字段
                this._parseStaticMembers(<any>this._klass);
                this._parseInstanceMembers((<any>this._klass).prototype);
            }

            private _toArray(json: JsonObject): any[] {
                let arr = [];
                J.forEach(json, v => {
                    arr[arr.length] = v;
                });
                return arr;
            }
            /**
             * Returns a reflected Method.
             */
            public method(name: string): Method {
                return this.methodsMap()[name];
            }

            /**
             * Returns a json-map of all reflected Methods.
             */
            public methodsMap(): JsonObject<Method> {
                return this._methods;
            }
            /**
             * Returns an array of all reflected Methods.
             */
            public methods(): Method[] {
                return this._toArray(this.methodsMap());
            }

            /**
             * Returns a reflected Field.
             * @param name field name
             * @param instance Need a class instance when the field is an instance-field
             */
            public field(name: string, instance?: object): Field {
                return this.fieldsMap(instance)[name];
            }

            private _instanceFields(instance: object) {
                let fs = {}, keys = Reflect.ownKeys(instance);
                //获取所有实例属性
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i].toString();
                    if (this._isValidInstance(key)) {
                        const obj = instance[key];
                        if (!Y.isFunction(obj)) fs[key] = new Field(this, key, false, Y.type(obj));
                    }
                }
                this._fields = J.union(fs, this._fields);
            }    

            /**
             * Returns a json-map of all static-fields and instance-fields.
             * @param instance Need a class instance when the field is an instance-field
             * @param anno An annotation on the instance field
             */
            public fieldsMap(instance?: object, anno?: Annotation): JsonObject<Field> {
                if (instance) this._instanceFields(instance);

                let fs = {};
                if (anno && instance) {
                    J.forEach(this._fields, (field: Field, key: string) => {
                        if (Annotations.hasAnnotation(anno, instance, key)) fs[key] = field;
                    })
                } else {
                    fs = this._fields;
                }

                return fs;
            }
            /**
             * Returns an array of all static-fields and instance-fields.
             * @param instance Need a class instance when the field is an instance-field
             * @param anno An annotation on the instance field
             */
            public fields(instance?: object, anno?: Annotation): Field[] {
                return this._toArray(this.fieldsMap(instance, anno));
            }

            //所有反射类的全名注册表
            private static _MAP: JsonObject<Class<any>> = {};
            //所有反射类的别名注册表
            private static _ALIAS_MAP: JsonObject<Class<any>> = {};

            /**
             * Returns a reflect Class for name. 
             * @param name full name or alias name
             * @param isAlias 
             */
            public static forName<T>(name: string | Klass<T>, isAlias?: boolean): Class<T> {
                if (!name) return null;

                let isStr = Y.isString(name)
                if (!isStr && (<Klass<T>>name).class) return (<Klass<T>>name).class;

                let classname: string = isStr ? <string>name : (<Klass<T>>name).name;
                return isAlias ? this._ALIAS_MAP[classname] : this._MAP[classname];
            }

            /**
             * Returns all reflected Classes by full class-name.
             */
            public static all(): JsonObject<Class<any>> {
                return this._MAP;
            }

            /**
             * Registers a reflected class.
             * @param klass class constructor
             * @param className class full name
             * @param alias class alias
             */
            public static register<T>(klass: Klass<T>, className?: string, alias?: string) {
                let name = className || klass.name, cls = this.forName(name);
                if (cls) return;

                //BUGFIX: 不可以修改Object的原型，否则引发：1、Object静态成员同步增加；2、jquery选择器异常
                if (klass !== Object) {
                    var $P = (<any>klass).prototype;
                    $P.className = name;
                    $P.getClass = function () { return Class.forName(name); };
                }
                let cs = new Class(name, klass);
                this._MAP[name] = cs;
                if (alias) this._ALIAS_MAP[alias] = cs;
            }

            /**
             * Find all classes of a namespace string.
             * @param ns 
             */
            public static classesOf(ns:string): Class<any>[]{
                if(!ns) return null;

                if(ns.endsWith('.*')) ns = ns.slice(0, ns.length-2);

                let a = [];
                J.forEach(this._MAP, (cls, name)=>{
                    if(name.startsWith(ns)) a.push(cls)
                })

                return a;
            }

        }

    }
}

//预定义短类名
import Method = JS.reflect.Method;
import Field = JS.reflect.Field;
import Class = JS.reflect.Class;
import klass = JS.reflect.klass;

//反射化重要且基础的对象
Class.register(Object);
Class.register(String);
Class.register(Boolean);
Class.register(Number);
Class.register(Array);
