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

    export namespace ds {

        /**
         * FIFO队列
         */
        export class Queue<T> implements Iterware<T>{

            protected _list: LinkedList<T> = new LinkedList<T>();
            private _ms = Infinity;//max size

            constructor(maxSize?: number) {
                this._ms = maxSize;
            }

            public each(fn: (item: T, index: number, iter: Queue<T>) => boolean, thisArg?: any): boolean {
                return this._list.each((item, i) => {
                    return fn.call(thisArg || this, item, i, this);
                }, thisArg)
            }

            public maxSize() {
                return this._ms
            }
            public size() {
                return this._list.size()
            }
            public isFull() {
                return this.size()==this._ms
            }
            public isEmpty() {
                return this.size() == 0
            }
            public clear() {
                this._list.clear();
            }
            public clone(): Queue<T> {
                let list = new Queue<T>();
                list._list = this._list.clone();
                return list;
            }
            public toArray(): Array<T> {
                return this._list.toArray();
            }

            public get(i: number): T {
                return this._list.get(i);
            }

            public indexOf(data: T, eq?:(data:T,item:T)=>boolean): number {
                return this._list.indexOf(data, eq)
            }
            public lastIndexOf(data: T, eq?:(data:T,item:T)=>boolean): number {
                return this._list.lastIndexOf(data, eq)
            }
            public contains(data: T, eq?:(data:T,item:T)=>boolean) {
                return this.indexOf(data,eq) > -1;
            }

            /**
             * Inserts the specified element into this queue if it is possible to do so immediately 
             * without violating capacity restrictions.
             * @param a 
             */
            public add(a: T): boolean {
                if(this.isFull()) return false;
                this._list.addLast(a);
                return true
            }

            /**
             * Retrieves and removes the head of this queue, or returns null if this queue is empty.
             */
            public remove(): T {
                return this._list.removeFirst()
            }

            /**
             * Retrieves, but does not remove, the head of this queue, or returns null if this queue is empty.
             */
            public peek(): T {
                return this._list.peekFirst()
            }

            public toString(){
                return '['+this._list.toArray().toString()+']'
            }

        }
    }
}

//预定义短类名
import Queue = JS.ds.Queue;
