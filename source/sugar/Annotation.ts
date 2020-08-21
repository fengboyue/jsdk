/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.5.0
 * @update Move to sugar package
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
module JS {

    export namespace sugar {

        let T = Types, R = Reflect;

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
                return R.getMetadata('design:type', obj, propertyKey);
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
                return R.getMetadata(anno.name, obj, propertyKey);
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
                R.defineMetadata(typeof annoName == 'string' ? annoName : annoName.name, metaValue, obj, propertyKey);
            }

            /**
             * True when the class or its property has the annotation.
             * 某个类或实例是否有指定的注解
             * @param tag 
             * @param obj a class instance
             * @param propertyKey 
             */
            public static hasAnnotation(anno: Annotation, obj: object | Klass<any>, propertyKey?: string): boolean {
                return R.hasMetadata(anno.name, obj, propertyKey);
            }

            /**
             * Returns all annotations of a class or its instance.
             * 返回类或实例的所有注解名
             */
            public static getAnnotations(obj: object | Klass<any>): string[] {
                return R.getMetadataKeys(obj);
            }

            /**
             * Define a annotation
             * 定义注解标记
             */
            public static define(definition: string | AnnotationDefinition, params?: ArrayLike<any>) {
                let args = Arrays.newArray(params),
                    isStr = T.isString(definition),
                    annoName = isStr ? <string>definition : (<AnnotationDefinition>definition).name,
                    handler = isStr ? null : (<AnnotationDefinition>definition).handler,
                    target = (isStr ? AnnotationTarget.ANY : (<AnnotationDefinition>definition).target) || AnnotationTarget.ANY,

                    fn = function (anno, values, obj, key, d) {
                        if (0 == (target & AnnotationTarget.ANY)) {
                            if (T.equalKlass(obj)) {
                                if (0 == (target & AnnotationTarget.CLASS)) return _wrongTarget(anno, (<Klass<any>>obj).name)
                            } else if (key) {
                                if (T.isFunction(obj[key])) {
                                    if (0 == (target & AnnotationTarget.METHOD)) return _wrongTarget(anno, (<object>obj).constructor.name, key, 'method')
                                } else {
                                    if (0 == (target & AnnotationTarget.FIELD)) return _wrongTarget(anno, (<object>obj).constructor.name, key, 'field')
                                }
                            }
                        }
                        Annotations.setValue(anno, values, obj, key);
                        if (handler) handler.apply(null, [anno, values, obj, key, d]);
                    }

                if (T.equalKlass(args[0])) {//无参数的类注解：特殊处理
                    let obj = args[0];
                    let detor: ClassDecorator = function (tar: Klass<any>) {
                        fn.call(null, annoName, undefined, tar);
                    }
                    return R.decorate([detor], obj);
                } else if (args.length == 3 && args[0]['constructor']) {//无参数的属性注解：特殊处理
                    let obj = args[0], key = args[1], desc = args[2];
                    let detor: PropertyDecorator = function (tar: object, k: string) {
                        fn.call(null, annoName, undefined, tar, k, desc);
                    }
                    return R.decorate([detor], obj, key);
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

    }


}
//预定义短类名
import AnnotationTarget = JS.sugar.AnnotationTarget;
import Annotation = JS.sugar.Annotation;
import Annotations = JS.sugar.Annotations;