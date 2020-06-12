/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="Type.ts"/>
module JS {

    export namespace lang {

        /**
         * Advisor interface for AOP.
         * AOP切入通知接口
         */
        export interface AopAdvisor {
            before?: (this: any, ...args: any[]) => void;
            around?: (this: any, fn: Function, ...args: any[]) => any;
            after?: (this: any, returns: any) => void;
            throws?: (this: any, e: Error) => void;
        }

        export enum AnnotationTarget {
            ANY = 1 << 0,//1
            CLASS = 1 << 1,//2
            FIELD = 1 << 2,//4
            METHOD = 1 << 3,//8
            PARAMETER = 1 << 4//16
        }

        type AnnotationDefinition = {
            name: string,
            handler?: (annoName: string, values: Array<any>, target: Klass<any> | object, key?: string, d?: PropertyDescriptor) => void,
            target?: number
        }

        export class Annotation extends Function { }

        /**
         * Annotation helper
         * 注解工具类
         */
        export class Annotations {

            /**
             * Returns the type of an object property.
             * 返回实例的字段的类型
             * @param obj 
             * @param propertyKey 
             */
            public static getPropertyType(obj: object, propertyKey: string): any {
                return Reflect.getMetadata('design:type', obj, propertyKey);
            }

            /**
             * Returns the value of an annotation on a class. 
             * 返回类的注解的值
             */
            public static getValue(anno: Annotation, klass: Klass<any>)
            /**
             * Gets the value of an annotation on a class's property. 
             * 返回实例属性的注解的值
             */
            public static getValue(anno: Annotation, obj: object, propertyKey: string)
            public static getValue(anno: Annotation, obj: object | Klass<any>, propertyKey?: string) {
                return Reflect.getMetadata(anno.name, obj, propertyKey);
            }
            /**
             * Sets the value of an annotation on a class. 
             * 给类的注解赋值
             */
            public static setValue(annoName: string | Annotation, metaValue: any, obj: Klass<any>): void;
            /**
             * Sets the value of an annotation on a class's property. 
             * 给实例的属性注解赋值
             */
            public static setValue(annoName: string | Annotation, metaValue: any, obj: object, propertyKey: string): void;
            public static setValue(annoName: string | Annotation, metaValue: any, obj: object | Klass<any>, propertyKey?: string) {
                Reflect.defineMetadata(typeof annoName == 'string' ? annoName : annoName.name, metaValue, obj, propertyKey);
            }

            /**
             * True when the class or its property has the annotation.
             * 某个类或实例是否有指定的注解
             * @param tag 
             * @param obj a class instance
             * @param propertyKey 
             */
            public static hasAnnotation(anno: Annotation, obj: object | Klass<any>, propertyKey?: string): boolean {
                return Reflect.hasMetadata(anno.name, obj, propertyKey);
            }

            /**
             * Returns all annotations of a class or its instance.
             * 返回类或实例的所有注解名
             */
            public static getAnnotations(obj: object | Klass<any>): string[] {
                return Reflect.getMetadataKeys(obj);
            }

            /**
             * Define a annotation
             * 定义注解标记
             */
            public static define(definition: string | AnnotationDefinition, params?: ArrayLike<any>) {
                let args = Arrays.newArray(params),
                    isStr = Types.isString(definition),
                    annoName = isStr ? <string>definition : (<AnnotationDefinition>definition).name,
                    handler = isStr ? null : (<AnnotationDefinition>definition).handler,
                    target = (isStr ? AnnotationTarget.ANY : (<AnnotationDefinition>definition).target) || AnnotationTarget.ANY,

                    fn = function (anno, values, obj, key, d) {
                        if (0 == (target & AnnotationTarget.ANY)) {
                            if (Types.equalKlass(obj)) {
                                if (0 == (target & AnnotationTarget.CLASS)) return _wrongTarget(anno, (<Klass<any>>obj).name)
                            } else if (key) {
                                if (Types.isFunction(obj[key])) {
                                    if (0 == (target & AnnotationTarget.METHOD)) return _wrongTarget(anno, (<object>obj).constructor.name, key, 'method')
                                } else {
                                    if (0 == (target & AnnotationTarget.FIELD)) return _wrongTarget(anno, (<object>obj).constructor.name, key, 'field')
                                }
                            }
                        }
                        Annotations.setValue(anno, values, obj, key);
                        if (handler) handler.apply(null, [anno, values, obj, key, d]);
                    }

                if (Types.equalKlass(args[0])) {//无参数的类注解：特殊处理
                    let obj = args[0];
                    let detor: ClassDecorator = function (tar: Klass<any>) {
                        fn.call(null, annoName, undefined, tar);
                    }
                    return Reflect.decorate([detor], obj);
                } else if (args.length == 3 && args[0]['constructor']) {//无参数的属性注解：特殊处理
                    let obj = args[0], key = args[1], desc = args[2];
                    let detor: PropertyDecorator = function (tar: object, k: string) {
                        fn.call(null, annoName, undefined, tar, k, desc);
                    }
                    return Reflect.decorate([detor], obj, key);
                }
                //带参数的注解 
                let values = args;
                return function (tar: Klass<any> | object, key?: string, d?: PropertyDescriptor) {
                    fn.call(null, annoName, values, tar, key, d);
                }
            }
        }

        var _wrongTarget = function (anno: string, klass: string, key?: string, type?: string) {
            JSLogger.error(key ?
                `A [${anno}] annotation should not be marked on the '${key}' ${type} of ${klass}.`
                :
                `A [${anno}] annotation should not be marked on the '${klass}' class.`
            )
        }

        var _getClassName = function (klass: Klass<any>) {
            let clazz = klass.class;
            return clazz ? clazz.name : klass.name;
        }

        /**
         * The @deprecated annotation. 
         * 标记类或方法或字段为已废弃
         * @param info a plus warning text
         */
        export function deprecated(info?: string): any {
            return Annotations.define({
                name: 'deprecated',
                handler: (anno: string, values: Array<any>, obj: Klass<any> | object, propertyKey?: string) => {
                    let info = values ? (values[0] || '') : '', text = null;
                    if (Types.equalKlass(obj)) {
                        let name = _getClassName(<Klass<any>>obj);
                        text = `The [${name}] class`;
                    } else {
                        let klass = <Klass<any>>obj.constructor, name = _getClassName(klass);
                        text = `The [${propertyKey}] ${Types.isFunction(obj[propertyKey]) ? 'method' : 'field'} of ${name}`;
                    }

                    JSLogger.warn(text + ' has been deprecated. ' + info);
                }
            }, arguments);
        }

        var _aop = function (args: ArrayLike<any>, fn: Function | AopAdvisor, anno?: string) {
            return Annotations.define({
                name: anno,
                handler: (anno: string, values: Array<any>, obj: object, methodName?: string) => {
                    let adv = {};
                    if (Types.isFunction(values[0])) {
                        adv[anno] = values[0];
                    } else {
                        adv = values[0];
                        if (!adv) return
                    }
                    Class.aop(obj.constructor, methodName, adv);
                },
                target: AnnotationTarget.METHOD
            }, args);
        }
        /**
         * The @before annotation.
         */
        export function before(fn: (this: any, ...args: any[]) => void): any {
            return _aop(arguments, fn, 'before');
        }
        /**
         * The @after annotation.
         */
        export function after(fn: (this: any, returns: any) => void): any {
            return _aop(arguments, fn, 'after');
        }
        /**
         * The @around annotation.
         */
        export function around(fn: (this: any, fn: Function, ...args: any[]) => any): any {
            return _aop(arguments, fn, 'around');
        }
        /**
         * The @throws annotation.
         */
        export function throws(fn: (this: any, e: Error) => void): any {
            return _aop(arguments, fn, 'throws');
        }
        /**
         * The @aop annotation.
         */
        export function aop(advisor: AopAdvisor): any {
            return _aop(arguments, advisor);
        }

    }


}
//预定义短类名
import AnnotationTarget = JS.lang.AnnotationTarget;
import Annotation = JS.lang.Annotation;
import Annotations = JS.lang.Annotations;
import AopAdvisor = JS.lang.AopAdvisor;

import deprecated = JS.lang.deprecated;
import before = JS.lang.before;
import after = JS.lang.after;
import around = JS.lang.around;
import throws = JS.lang.throws;
import aop = JS.lang.aop;