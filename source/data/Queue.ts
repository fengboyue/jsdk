/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path='../lang/Type.ts'/>

module JS {

    export namespace data {

        /**
         * FIFO队列
         */
        export class Queue<T> implements Iterware<T>{

            protected list: LinkedList<T> = new LinkedList<T>();

            constructor(a?: T|T[]) {
                this.list.add(a);
            }

            public each(fn: (item: T, index: number, iter: Queue<T>) => boolean, thisArg?: any): boolean {
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
            public clone(): Queue<T> {
                let list = new Queue<T>();
                list.list = this.list.clone();
                return list;
            }
            public toArray(): Array<T> {
                return this.list.toArray();
            }

            public get(i: number): T {
                return this.list.get(i);
            }

            public indexOf(data: T): number {
                return this.list.indexOf(data)
            }
            public lastIndexOf(data: T): number {
                return this.list.lastIndexOf(data)
            }
            public contains(data: T) {
                return this.indexOf(data) > -1;
            }

            public push(a: T) {
                this.list.addLast(a)
            }

            public pop(): T {
                return this.list.removeFirst()
            }

            /**
             * Retrieves, but does not remove, the first element of this list.
             */
            public peek(): T {
                return this.list.peekFirst()
            }

            public toString(){
                return '['+this.list.toArray().toString()+']'
            }

        }
    }
}

//预定义短类名
import Queue = JS.data.Queue;
