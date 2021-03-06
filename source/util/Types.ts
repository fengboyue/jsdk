/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../lang/Type.ts"/>
module JS {

    export namespace util {

        let _of = function (a: any, s: string): boolean {
            return typeof a === s
        },
         _is = function (a: any, s: string) {
            return toString.call(a) === `[object ${s}]`
        },

        /** 是不是类的构造函数 */
         _isKlass = function (obj: any): boolean {
            if (typeof obj != 'function') return false;
            
            let proto = obj.prototype;
            if (proto === undefined || proto.constructor !== obj) return false;
            // has own prototype properties
            if (Object.getOwnPropertyNames(proto).length >= 2) return true;
            
            var str = obj.toString();
            // ES6 class
            if (str.slice(0, 5) == "class") return true;
            // anonymous function
            if (/^function\s+\(|^function\s+anonymous\(/.test(str)) return false;
            // has `this` in the body
            if (/\b\(this\b|\bthis[\.\[]\b/.test(str)) {
                // not strict or ES5 class generated by babel
                if (/classCallCheck\(this/.test(str)) return true;
                return /^function\sdefault_\d+\s*\(/.test(str);
            }

            return false;
        },
        _superklass = (klass: Klass<any>):Klass<any>=>{
            if (Object === klass) return null;
            let sup = Object.getPrototypeOf(klass);
            return <Klass<any>>Object.getPrototypeOf(Object) === sup ? Object : sup;
        };

        /**
         * A type-check class.<br>
         * 类型检查类
         */
        export class Types {

            /**
             * Is a symbol.<br>
             * 是否是Symbol
             */
            static isSymbol(o: any): boolean {
                return _of(o, 'symbol');
            }
            /**
             * Is a arguments object.<br>
             * 是否是Arguments对象
             */
            static isArguments(o: any): boolean {
                return _is(o, 'Arguments');
            }
            /**
             * Is not a number.<br>
             * 是否是非数字
             */
            static isNaN(n: any): boolean {
                return n != null && isNaN(<any>n);
            }
            /**
             * Is a number.<br>
             * 是否是数字
             */
            static isNumber(n: any): boolean {
                return _of(n, 'number');
            }
            /**
             * Is a numeric.<br>
             * 是否是数字类型
             */
            static isNumeric(n: any): boolean {
                return ( this.isNumber(n) || this.isString(n) ) && !isNaN( n - parseFloat( n ) );
            }
            /**
             * Is a float number.<br>
             * 是否是浮点数
             */
            static isFloat(n: number | string | Number): boolean {
                return Number(n).isFloat();
            }
            /**
             * Is an integer.<br>
             * 是否是整数
             */
            static isInt(n: number | string | Number): boolean {
                return Number(n).isInt();
            }
            /**
             * Is a boolean.<br>
             * 是不是布尔
             */
            static isBoolean(obj: any): boolean {
                return _of(obj, 'boolean');
            }
            /**
             * Is a string.<br>
             * 是不是字符串
             */
            static isString(obj: any): boolean {
                return _of(obj, 'string');
            }
            /**
             * Is a date.<br>
             * 是不是日期型
             */
            static isDate(obj: any): boolean {
                return _is(obj, 'Date');
            }
            /**
             * Is not undefined or not null.<br>
             * 是不是已赋值: 非undefined或非null
             */
            static isDefined(obj: any): boolean {
                return obj != void 0;
            }
            /**
             * Is null.<br>
             * 是不是Null
             */
            static isNull(obj: any): boolean {
                return obj === null;
            }
            /**
             * Is undefined.<br>
             * 是不是未赋值
             */
            static isUndefined(obj: any): boolean {
                return obj === void 0;
            }

            /**
             * Is object.<br>
             * 是不是对象
             */
            static isObject(obj: any): boolean {
                return _is(obj, 'Object')
            }
            /**
             * Is json object.<br>
             * 是不是JSON对象
             */
            static isJsonObject(obj: any): boolean {
                let OP = Object.prototype;
                //对象不是object
                if (!obj || OP.toString.call(obj) !== '[object Object]') return false;

                let proto = Object.getPrototypeOf(obj);
                if (!proto) return true;

                //判断构造函数
                let ctor = OP.hasOwnProperty.call(proto, 'constructor') && proto.constructor,
                    fnToString = Function.prototype.toString;
                return typeof ctor === 'function' && fnToString.call(ctor) === fnToString.call(Object);
            }
            /**
             * Is an array.<br>
             * 是不是数组
             */
            static isArray(obj: any): boolean {
                return Array.isArray(obj) || obj instanceof Array;
            }
            /**
             * Is an array like.<br>
             * 是不是类似数组
             */
            static isArrayLike(obj: any): boolean {
                if(this.isString(obj)) return false;
                let l = obj && obj['length'] || null;
                return typeof l == 'number' && l >= 0 && l <= Number.MAX_SAFE_INTEGER;
            }
            /**
             * Is an error object.<br>
             * 是不是Error对象
             */
            static isError(obj: any): boolean {
                return _of(obj, 'Error');
            }

            /**
             * Is a file object.<br>
             * 是不是文件对象
             */
            static isFile(obj: any) {
                return _is(obj, 'File')
            }
            /**
             * Is a formdata object.<br>
             * 是不是表单数据
             */
            static isFormData(obj) {
                return _is(obj, 'FormData')
            }
            /**
             * Is a blob object.<br>
             * 是不是二进制文件
             */
            static isBlob(obj) {
                return _is(obj, 'Blob')
            }
            /**
             * Is a function.<br>
             * 是不是函数
             * 
             * @param fn function object
             * @param pure check whether it is a pure function which is not a class constructor, otherwise only check whether it is a function object
             */
            static isFunction(fn: any, pure?: boolean): boolean {
                return _of(fn, 'function') && (!pure ? true : !this.equalKlass(fn));
            }
            /**
             * Is a RegExp object.<br>
             * 是不是正则表达式对象
             */
            static isRegExp(obj: any): boolean {
                return _is(obj, 'RegExp')
            }
            /**
             * Is an array buffer.<br>
             * 是不是数组缓冲
             */
            static isArrayBuffer(obj: any) {
                return _is(obj, 'ArrayBuffer')
            }
            
            /**
             * Is typed array.<br>
             * 是不是类型数组 
             */
            static isTypedArray(value) {
                return value && this.isNumber(value.length) && /^\[object (?:Uint8|Uint8Clamped|Uint16|Uint32|Int8|Int16|Int32|Float32|Float64)Array]$/.test(toString.call(value));
            }

            /**
             * Is an element.<br>
             * 是不是DOM元素
             */
            static isElement(el: any): boolean {
                return el && typeof el === 'object' && (el.nodeType === 1 || el.nodeType === 9)//or el instanceof HTMLElement;
            }
            /**
             * Is a window object.<br>
             * 是不是Window
             */
            static isWindow(el: any): boolean {
                return el != null && el === el.window
            }

            /**
             * Is an instance of the class.<br>
             * 是不是类的实例
             */
            static isKlass(obj: any, klass: Klass<any>): boolean {
                if (!this.ofKlass(obj, klass)) return false;
                return obj.constructor && obj.constructor === klass;
            }

            /**
             * Is an instance of the class or its subclass.<br>
             * 是不是类或是其子类的实例
             */
            static ofKlass(obj: any, klass: Klass<any>): boolean {
                return obj instanceof klass
            }

            /**
             * Equal a class or the class.<br>
             * 是不是类或某个类。
             * 
             * @param kls class object
             * @param klass the class object
             */
            static equalKlass(kls: any, klass?: Klass<any>): boolean {
                if (!_isKlass(kls)) return false;
                return klass ? (kls === klass) : true;
            }

            /**
             * Kls1 is class or subclass of Kls2.<br>
             * 是不是类及其子类
             */
            static subklassOf(kls1: Klass<any>, kls2: Klass<any>): boolean {
                if (kls2 === Object || kls1 === kls2) return true;

                let superXls = _superklass(kls1);
                while (superXls != null) {
                    if (superXls === kls2) return true;
                    superXls = _superklass(superXls);
                }

                return false;
            }

            /**
             * Returns type string of a object.<br>
             * 返回类型字符串
             */
            static type(obj: any): Type {
                if (obj === null) return Type.null;

                let type = typeof obj;
                if(type=='number'||type==<any>'bigint') return Type.number;
                if(type=='object') {
                    if (this.isJsonObject(obj)) return Type.json;
                    if (this.isArray(obj)) return Type.array;
                    if (this.isDate(obj)) return Type.date;;
                    return Type.object;
                }
                
                return _isKlass(obj)?Type.class:<Type>type;
            }

        }
    }
}
import Types = JS.util.Types;