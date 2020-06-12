/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/**
 * Add some helpful methods for Array.prototype
 */
interface Array<T> {
    /**
     * Add a new item or an array to this array.
     */
    add(a:T|T[], from?:number):this;
    /**
     * Remove a item from index.
     */
    remove(index:number):this;
    /**
     * Remove a item when the foreach function returns true.
     * @param equal 
     */
    remove(equal:(item: T, i: number, array: Array<T>)=>boolean):this;
}
(function () {
    var $A = <any>Array.prototype;

    $A.add = function (obj: any, from?:number) { 
        if(obj == void 0) return this;

        let arr = obj instanceof Array?<Array<any>>obj:[obj], 
        i = from == void 0?this.length:(from < 0 ? 0 : from);
        Array.prototype.splice.apply(this, [i, 0].concat(arr));
        return this
    };

    $A.remove = function (obj: any) { 
        let index = typeof obj === 'number'?obj:this.findIndex((<Function>obj))
        if(index>-1) this.splice(index,1)
        return this
    };
    
}())

module JS {

    export namespace util {

        /**
         * Array Helper<br>
         * 数组工具类
         */
        export class Arrays {
            /**
             * Convert an array-like object to a true array.
             */
            public static newArray(a: ArrayLike<any>, from?:number) {
                return a == void 0?[]:Array.prototype.slice.apply(a, [from==void 0?0:from]);
            }

            /**
             * Convert an item or an array to an array.
             * @param a 
             */
            public static toArray<T>(a: T|T[]): T[] {
                return a==void 0?[]:(Types.isArray(a)?<T[]>a:[<T>a]);
            }

            /**
             * a1==a2
             * 
             * <pre>
             * Arrays.equal(null, undefinded); //return true
             * Arrays.equal(null, []); //return true
             * Arrays.equal([], []); //return true
             * Arrays.equal([1,2,3], [1,2,3]); //return true
             * Arrays.equal([3,2,1], [1,2,3]); //return false
             * Arrays.equal([1,2,3], [4,5,6], (n1,n2)=>{return n1+3==n2}); //return true
             * </pre>
             * @param a1 
             * @param a2 
             * @param equal a judging function for each item 
             */
            public static equal<T, K>(a1: Array<T>, a2: Array<K>, equal?: (item1: T, item2: K, index: number) => boolean): boolean {
                if (<Array<any>>a1===a2) return true;

                let empty1 = Check.isEmpty(a1), empty2 = Check.isEmpty(a2);
                if (empty1 && empty2) return true;
                if (empty1 !== empty2) return false;
                
                if (a1.length != a2.length) return false;
                return a1.every((item1: any, i: number) => {
                    return equal ? equal(item1, a2[i], i) : item1 === a2[i]
                });
            }
            /**
             * a1.toString == a2.toString
             * 
             * <pre>
             * Arrays.equalToString(null, undefinded); //return true
             * Arrays.equalToString(null, []); //return false
             * </pre>
             */
            public static equalToString(a1: Array<any>, a2: Array<any>): boolean {
                if (a1===a2) return true;
                if (a1 == void 0 && a2 == void 0) return true;
                if (!a1 || !a2) return false;
                if (a1.length != a2.length) return false;

                return a1.toString()==a2.toString()
            }

            /**
             * If the same items in two arrays.
             * <pre>
             * Arrays.same([1,2,3], [2,1,3]); //return true
             * </pre>
             */
            public static same(a1: Array<any>, a2: Array<any>): boolean {
                if (a1===a2 || (Check.isEmpty(a1) && Check.isEmpty(a2))) return true;
                if (a1.length != a2.length) return false;

                let arr2 = this.newArray(a2);
                a1.forEach(item1 => {
                    arr2.remove((v)=>{
                        return v==item1
                    });
                });

                return arr2.length==0
            }

            /**
             * Slice an array-like object.
             */
            public static slice(args: ArrayLike<any>, fromIndex?: number, endIndex?:number): Array<any> {
                return <Array<any>>Array.prototype.slice.apply(args, [fromIndex || 0, endIndex||args.length])
            }
        }
    }
}

import Arrays = JS.util.Arrays;