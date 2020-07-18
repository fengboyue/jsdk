/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../reflect/Class.ts"/>
/**
 * Add some helpful methods for Number.prototype
 */
interface Number {

    /**
     * Returns a number string.<br>
     * 返回数字字符串
     * @return {string} 
     */
    stringify(): string;

    /**
     * Returns a new round number.<br>
     * 四舍五入，保留N位小数位数
     */
    round(digit?: number): number;

    /**
     * Returns a new integer.<br>
     * 转换为整数。 注意：采取四舍五入。
     */
    toInt(): number;

    /**
     * Returns a format number string<br>
     * 每三位整数逗号分割
     * 
     * <pre>
     * Number(1).format(2); //return "1.00"
     * Number(-12345.6789).format(3);  //return "-12,345.679"
     * </pre>
     * @param digit 
     */
    format(digit?: number): string;

    /**
     * Returns true if it equals an other number.<br>
     * 是否相等
     * @param n 
     * @param dLen 
     */
    equals(n: number | string | Number, dLen?: number): boolean;

    /**
     * Returns a new added number. The old number will not be changed.<br>
     * 返回新增后数字，原数字不会被改变。
     * @param n input number
     */
    add(n: number | string | Number): number;
    /**
     * Returns a new substracted number. The old number will not be changed.<br>
     * 返回新增后数字，原数字不会被改变。
     * @param n input number
     */
    sub(n: number | string | Number): number;
    /**
     * Returns a new multiplied number. The old number will not be changed.<br>
     * 返回新增后数字，原数字不会被改变。
     * @param n input number
     */
    mul(n: number | string | Number): number;
    /**
     * Returns a new divided number. The old number will not be changed.<br>
     * 返回新增后数字，原数字不会被改变。
     * @param n input number
     */
    div(n: number | string | Number): number;

    /**
     * Is NaN? <br>
     * 是否数字
     */
    isNaN(): boolean;
    /**
     * Is a finite number?<br>
     * 是否有效数字
     */
    isFinite(): boolean;

    /**
     * Is zero?<br>
     * 是否是零
     */
    isZero(): boolean;
    /**
     * Is a float number?<br>
     * 是否浮点数
     */
    isFloat(): boolean;

    /**
     * Is an integer number?<br>
     * 是否整数
     */
    isInt(): boolean;

    /**
     * Is a positive number?<br>
     * 是否正数
     */
    isPositive(): boolean;

    /**
     * Is a negative number?<br>
     * 是否负数
     */
    isNegative(): boolean;

    /**
     * Is an odd number?<br>
     * 是否是奇数
     */
    isOdd(): boolean;

    /**
     * Is an even number?<br>
     * 是否是偶数
     */
    isEven(): boolean;

    /**
     * Returns a new abs number.<br>
     * 返回绝对值
     */
    abs(): number

    /**
     * Returns the length of fractional part.<br>
     * 返回小数位长度<br>
     * 
     * <pre>
     * Number(123).fractionLength(); //return 0
     * Number(123.4567).fractionLength(); //return 4
     * </pre>
     */
    fractionLength(): number;
    /**
     * Returns the length of intergral part.<br>
     * 返回整数位长度<br>
     * 
     * <pre>
     * Number(0.1234).integerLength(); //return 0
     * Number(123.4567).fractionLength(); //return 3
     * </pre>
     */
    integerLength(): number;

    /**
     * Returns the fractional part.
     */
    fractionalPart(): string;
    /**
     * Returns the integral part.
     */
    integralPart(): string;
}

(function () {
    var N = Number, $N = <any>N.prototype;

    $N.stringify = function (): string {
        if (this.isNaN()) return null;
        if (this.isZero()) return '0';

        let t = this.toString(), m = t.match(/^(\+|\-)?(\d+)\.?(\d*)[Ee](\+|\-)(\d+)$/);
        if (!m) return t;

        let zhe = m[2], xiao = m[3], zhi = N(m[5]), fu = m[1] == '-' ? '-' : '', zfu = m[4],
            ws = (zfu == '-' ? -1 : 1) * zhi - xiao.length, n = zhe + xiao;

        if (ws == 0) return fu + n;
        if (ws > 0) return fu + n + Strings.padEnd('', ws, '0')

        let dws = n.length + ws;
        if (dws <= 0) return fu + '0.' + Strings.padEnd('', -1 * dws, '0') + n;

        return n.slice(0, dws - 1) + '.' + n.slice(dws)
    }

    $N.round = function (digit?: number): number {
        if (this.isNaN() || this.isInt() || !N.isFinite(digit)) return N(this);

        let d = digit || 0, pow = Math.pow(10, d);
        return Math.round(this * pow) / pow;
    }

    /**
     * 转换为整数。 注意：采取四舍五入。
     */
    $N.toInt = function (): number {
        return this.round(0);
    }

    var f3 = (s:string)=>{//3位逗号分割
        return s.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }
    /**
     * 每三位整数逗号分割
     * @param digit 
     */
    $N.format = function (dLen?: number): string {
        let d:number = dLen == void 0 || !Number.isFinite(dLen) ? this.fractionLength() : dLen,
            s:string = this.round(d).abs().stringify(),
            sign = this.isNegative() ? '-' : '';

        //BUGFIX: 微信浏览器下Number.toLocalString方法会返回空，改用自己的f3函数实现逗号分割
        let sn = N(s);
        if (sn.isInt()) return sign + f3(sn.toString()) + (d < 1 ? '' : '.' + Strings.padEnd('', d, '0'));

        let p = s.indexOf('.'),
            ints = s.slice(0, p),
            digs = s.slice(p + 1);
        return  sign + f3(ints) + '.' + Strings.padEnd(digs, d, '0');
    }

    $N.equals = function (n: number | string | Number, dLen?: number): boolean {
        if (this.isNaN()) throw new TypeError('This number is NaN!');
        let num = N(n);
        if (num.isNaN()) throw new TypeError('The compared number is NaN!');

        return this.round(dLen).valueOf() == num.round(dLen).valueOf();
    }

    $N.add = function (n: number | string | Number): number {
        const v = N(n);
        if (this.valueOf() == 0) return v;
        if (v.valueOf() == 0) return this;
        if (this.isInt() && v.isInt()) return this.valueOf() + v.valueOf();

        let m = Math.pow(10, Math.max(this.fractionLength(), v.fractionLength())),
            n1 = this.mul(m).valueOf(),
            n2 = v.mul(m).valueOf();

        return (n1 + n2) / m;
    }

    $N.sub = function (n: number | string | Number): number {
        const v = N(n);
        if (v.valueOf() == 0) return this;
        if (this.isInt() && v.isInt()) return this.valueOf() - v.valueOf();

        let m = Math.pow(10, Math.max(this.fractionLength(), v.fractionLength())),
            n1 = this.mul(m).valueOf(),
            n2 = v.mul(m).valueOf();

        return (n1 - n2) / m;
    }

    $N.mul = function (n: number | string | Number): number {
        if (this.valueOf() == 0) return 0;
        const v = N(n);
        if (v.valueOf() == 0) return 0;
        if (this.isInt() && v.isInt()) return v.valueOf() * this.valueOf();

        let s1 = this.stringify(this),
            s2 = v.stringify(),
            m1 = s1.indexOf('.') >= 0 ? s1.split(".")[1].length : 0,
            m2 = s2.indexOf('.') >= 0 ? s2.split(".")[1].length : 0,
            n1 = N(s1.replace('.', '')), n2 = N(s2.replace('.', ''));
        return n1 * n2 / Math.pow(10, m1 + m2); //WARN:原生的大整数（大于16位的整数）乘法还是有轻微精度问题
    }

    $N.div = function (n: number | string | Number): number {
        if (this.valueOf() == 0) return 0;

        const v = N(n);
        if (v.valueOf() == 0) throw new ArithmeticError('Can not divide an Zero.');

        let s1 = this.stringify(),
            s2 = v.stringify(),
            m1 = s1.indexOf('.') >= 0 ? s1.split(".")[1].length : 0,
            m2 = s2.indexOf('.') >= 0 ? s2.split(".")[1].length : 0,
            n1 = N(s1.replace('.', '')),
            n2 = N(s2.replace('.', ''));
        return (n1 / n2) * Math.pow(10, m2 - m1);
    }

    $N.isNaN = function (): boolean {
        return isNaN(this);
    }
    $N.isFinite = function (): boolean {
        return isFinite(this);
    }
    $N.isZero = function (): boolean {
        return this == 0;
    }
    $N.isFloat = function (): boolean {
        if (isNaN(this)) return false;
        return !this.isInt();
    }
    $N.isInt = function (): boolean {
        return Math.floor(this) == this;
    }
    $N.isPositive = function (): boolean {
        if (isNaN(this)) return false;
        return this > 0;
    }
    $N.isNegative = function (): boolean {
        if (isNaN(this)) return false;
        return this < 0;
    }
    $N.isOdd = function () {
        if (!this.isInt()) return false;
        return (this.valueOf() & 1) != 0;
    }
    $N.isEven = function () {
        if (!this.isInt()) return false;
        return (this.valueOf() & 1) == 0;
    }
    $N.abs = function (): number {
        return Math.abs(this);
    }
    $N.fractionLength = function (): number {
        if (this.isInt() || this.isNaN()) return 0;

        let s = this.stringify();
        return s.slice(s.indexOf('.') + 1).length;
    }
    $N.integerLength = function (): number {
        if (this.isNaN()) return 0;

        return this.abs().toFixed(0).length;
    }
    $N.fractionalPart = function(): string{
        if (this.isInt() || this.isNaN()) return '';

        let s = this.stringify();
        return s.slice(s.indexOf('.') + 1);
    }
    $N.integralPart = function (): string {
        if (this.isNaN()) return '';

        let s:string = this.stringify(), i = s.indexOf('.');
        if(i<0) return s;
        return s.slice(0,i);
    }
}())

module JS {

    export namespace util {
        /**
         * 使用"+-*\"操作符，作两数运算
         * @param v1 
         * @param opt 
         * @param v2 
         */
        let N = Number, _opt = function (v1: number | string | Number, opt: '+' | '-' | '*' | '/', v2: number | string | Number): Number {
            var rst = null, v = N(v1);
            switch (opt) {
                case '+':
                    rst = v.add(v2);
                    break;
                case '-':
                    rst = v.sub(v2);
                    break;
                case '*':
                    rst = v.mul(v2);
                    break;
                case '/':
                    rst = v.div(v2);
                    break;
            }
            return rst;
        }

        /**
         * 数字工具类
         */
        export class Numbers {

            /**
             * Returns the min number of all numbers.<br>
             * 返回最小数
             */
            public static min(...numbers: Array<number>): number {
                let m = 0;
                numbers.forEach((n: number, i: number) => {
                    if (i == 0 || n < m) m = n;
                })
                return m;
            }
            /**
             * Returns the max number of all numbers.<br>
             * 返回最大数
             */
            public static max(...numbers: Array<number>): number {
                let m = 0;
                numbers.forEach((n: number, i: number) => {
                    if (i == 0 || n > m) m = n;
                })
                return m;
            }

            /**
             * Termwise calc numbers according to arguments order.<br>
             * 按照输入顺序，简单作+*-/运算.
             * 
             * <pre>
             * Numbers.termwise(1, '+', 2, '-', 3, '*', 4); //equals: ((1+2)-3)*4 = 0
             * </pre>
             */
            public static termwise(...args: Array<number | '+' | '-' | '*' | '/'>): number {
                if (arguments.length <= 0) return 0;
                if (arguments.length == 1) return N(args[0]).valueOf();

                var rst = null;
                for (var i = 1; i < args.length; i = i + 2) {
                    if (i == 1) {
                        rst = _opt(args[i - 1], <any>args[i],
                            args[i + 1]);
                    } else {
                        rst = _opt(rst, <any>args[i], args[i + 1]);
                    }
                }

                return rst;
            }

            /**
             * Calculate the algebra expression.<br>
             * 计算代数表达式
             * 
             * <pre>
             * Numbers.algebra('((a+b)-c)*d', {a:1,b:2,c:-3,d:4}); //return 24
             * </pre>
             */
            public static algebra(expression: string, values?: JsonObject<number | string | Number>): number {
                let exp = expression.replace(/\s+/g, '');//去掉多余空格
                if (values) {
                    Jsons.forEach(values, (n: number, k: string) => {
                        exp = exp.replace(new RegExp(k, 'g'), N(n) + '');
                    })
                }

                //连续两个减号变为一个加号
                exp = exp.replace(/\-{2}(\d+\.*\d*)/g, '+$1');
                //去掉多余的＋
                exp = exp.replace(/(\(|^)\++(\d+\.*\d*)/g, '$1$2');
                //负数N替换成(0-N)
                exp = exp.replace(/(^|\(|\D^\))\-(\d+\.*\d*)/g, '$1(0-$2)');
                JSLogger.debug(exp);

                let opts: any[] = exp.split(/(\d+\.?\d*)/);
                opts.forEach((v: string, i: number, array: any[]) => {
                    if (v && v.length > 0) {
                        if (Types.isNumeric(v)) {
                            array[i] = `(Number(${v}))`
                        } else {
                            v = v.replace(/[\+\-\*\/]/g, (m: string) => {
                                if (m == '+') {
                                    return '.add';
                                } else if (m == '-') {
                                    return '.sub';
                                } else if (m == '*') {
                                    return '.mul';
                                } else if (m == '/') {
                                    return '.div';
                                }
                                return m;
                            });
                            array[i] = v;
                        }
                    }
                });

                JSLogger.debug(opts.join(''))
                return (<Number>eval(opts.join(''))).valueOf();
            }
        }
    }
}

import Numbers = JS.util.Numbers;