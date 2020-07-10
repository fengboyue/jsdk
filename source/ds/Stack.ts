/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
module JS {

    export namespace ds {

        /**
         * 栈
         */
        export class Stack<T> implements Iterware<T>{

            protected list: LinkedList<T> = new LinkedList<T>();

            constructor(a?: T|T[]) {
                this.list.add(a);
            }

            public each(fn: (item: T, index: number, iter: Stack<T>) => boolean, thisArg?: any) {
                return this.list.each((item, i) => {
                    return fn.call(thisArg || this, item, i, this);
                }, thisArg)
            }

            public size() {
                return this.list.size()
            }
            public isEmpty() {
                return this.size() == 0
            }
            public clear() {
                this.list.clear();
            }
            public clone(): Stack<T> {
                let list = new Stack<T>();
                list.list = this.list.clone();
                return list;
            }
            public toArray(): Array<T> {
                return this.list.toArray();
            }

            /**
             * 查看堆栈顶部的对象，但不从堆栈中移除它。
             */
            public peek(): T{
                return this.list.peekLast();
            }

            /**
             * 移除堆栈顶部的对象，并作为此函数的值返回该对象。
             */
            public pop(): T{
                return this.list.removeLast();
            }

            /**
             * 把项压入堆栈顶部。
             * @param item 
             */
            public push(item:T){
                this.list.addLast(item);
            }

            public toString(){
                return '['+this.list.toArray().toString()+']'
            }
         }
    }
}
import Stack = JS.ds.Stack;