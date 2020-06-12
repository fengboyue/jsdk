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

        type LinkedNode<T> = {
            data: T,
            next: LinkedNode<T>,
            prev: LinkedNode<T>
        }

        /**
         * 双向链表
         * 适合大数据量的高频插入／删除操作
         */
        export class LinkedList<T> implements Iterware<T>{

            private _size = 0;
            private _head: LinkedNode<T> = null;
            private _tail: LinkedNode<T> = null;

            constructor() {
            }

            public each(fn: (item: T, index: number, iter: LinkedList<T>) => boolean, thisArg?: any) {
                if (this._size == 0) return true;

                let rst = true, i = 0, node = this._head;
                while (node) {
                    if (!fn.call(thisArg || this, node.data, i, this)) {rst = false;break;}
                    node = node.next;
                    ++i;
                }
                return rst;
            }

            public size() {
                return this._size
            }
            public isEmpty() {
                return this._size == 0
            }
            public clear() {
                this._head = null;
                this._tail = null;
                this._size = 0;
            }
            public clone(): LinkedList<T> {
                let list = new LinkedList<T>();

                if (this._size > 0) {
                    let node = this._head;
                    while (node) {
                        list.add(Jsons.clone(node.data));
                        node = node.next;
                    }
                }

                return list;
            }

            public toArray(): Array<T> {
                let arr = [];

                this.each(d => {
                    arr[arr.length] = d;
                    return true
                })
                return arr;
            }

            public getFirst(): T {
                return this._head ? this._head.data : null
            }
            public getLast(): T {
                return this._tail ? this._tail.data : null
            }

            private _check(i: number) {
                if (i > this._size || i < 0) throw new Errors.RangeError();
            }

            public get(i: number): T {
                this._check(i);
                if (i == 0) return this._head ? this._head.data : null;
                if (i == this._size - 1) return this._tail ? this._tail.data : null;

                let node = this._findAt(i);
                return node ? node.data : null;
            }

            private _findAt(i: number): LinkedNode<T> {
                return i < this._size / 2 ? this._fromFirst(i) : this._fromLast(i);
            }

            private _fromFirst(i: number): LinkedNode<T> {
                if (i<=0) return this._head;
                let node = this._head, count = 1;
                while (count <= i) {
                    node = node.next;
                    count++;
                }
                return node;
            }
            private _fromLast(i: number): LinkedNode<T> {
                if (i>=(this.size()-1)) return this._tail;
                let node = this._tail, count = this._size - 1;
                while (count > i) {
                    node = node.prev;
                    count--;
                }
                return node;
            }

            public indexOf(data: T): number {
                if (this.isEmpty()) return -1;
                let rst = -1;

                this.each((item, i) => {
                    let is = (data === item);
                    if (is) rst = i;
                    return !is;
                })
                return rst;
            }
            public lastIndexOf(data: T): number {
                if (this.isEmpty()) return -1;

                let rst = -1, node = this._tail, i = this._size - 1;
                while (node) {
                    if (data === node.data) {
                        rst = i;
                        break;
                    }
                    node = node.prev;
                    --i;
                }

                return rst;
            }
            public contains(data: T) {
                return this.indexOf(data) > -1;
            }

            private _addLast(d: T) {
                let node: LinkedNode<T> = { data: Jsons.clone(d), prev: null, next: null };
                if (this._tail) {
                    node.prev = this._tail;
                    this._tail.next = node;
                }
                this._tail = node;
                if (!this._head) this._head = this._tail;
                this._size += 1;
            }
            private _addFirst(d: T) {
                let node: LinkedNode<T> = { data: Jsons.clone(d), prev: null, next: null };
                if (this._head) {
                    node.next = this._head;
                    this._head.prev = node;
                }
                this._head = node;
                if (!this._tail) this._tail = this._head;
                this._size += 1;
            }

            public add(a: T | T[]) {
                if (Types.isArray(a)) {
                    (<Array<T>>a).forEach(el => {
                        this._addLast(el);
                    });
                } else {
                    this._addLast(<T>a);
                }
            }
            public addAll(list: LinkedList<T>) {
                if (!list || list.isEmpty()) return;
                list.each(d => {
                    this._addLast(d);
                    return true
                })
            }

            private _addAt(i: number, a: T) {
                let nextNode = this._findAt(i);
                if (!nextNode) return;

                let prevNode = nextNode.prev, newNode = { data: Jsons.clone(a), next: nextNode, prev: prevNode };
                prevNode.next = newNode;
                nextNode.prev = newNode;
                this._size += 1;
            }

            public addAt(i: number, a: T | T[]) {
                if (i <= 0) {
                    this.addFirst(a);
                    return
                } else if (i >= this.size()) {
                    this.addLast(a);
                    return
                }

                if (!Types.isArray(a)) {
                    this._addAt(i, <T>a);
                } else {
                    (<T[]>a).forEach((t, j) => {
                        this._addAt(i + j, t);
                    })
                }
            }

            public addLast(a: T | T[]) {
                this.add(a);
            }

            public addFirst(a: T | T[]) {
                if (Types.isArray(a)) {
                    for (let i = (<Array<T>>a).length - 1; i >= 0; i--) {
                        this._addFirst(a[i]);
                    }
                } else {
                    this._addFirst(<T>a);
                }
            }

            public removeFirst(): T {
                if (this._size == 0) return null;

                let data = this._head.data;
                if (this._size > 1) {
                    this._head = this._head.next;
                    this._head.prev = null;
                } else {
                    this._head = null;
                    this._tail = null;
                }

                this._size--;
                return data
            }

            public removeLast(): T {
                if (this._size == 0) return null;

                let data = this._tail.data;
                if (this._size > 1) {
                    this._tail = this._tail.prev;
                    this._tail.next = null;
                } else {
                    this._head = null;
                    this._tail = null;
                }

                this._size--;
                return data
            }

            public removeAt(i: number) {
                if (this.isEmpty()) return null;
                this._check(i);

                if (i == 0) {
                    this.removeFirst();
                    return
                } else if (i == this.size() - 1) {
                    this.removeLast();
                    return
                }

                let node = this._findAt(i);
                if (!node) return null;

                let next = node.next, prev = node.prev;
                if (next) next.prev = prev;
                if (prev) prev.next = next;
                this._size--;
                return node.data
            }

            /**
             * Retrieves, but does not remove, the first element of this list.
             */
            public peek(): T {
                return this._head ? this._head.data : null;
            }
            /**
             * Retrieves, but does not remove, the first element of this list, or returns null if this list is empty.
             */
            public peekFirst(): T {
                return this.peek();
            }
            /**
             * Retrieves, but does not remove, the last element of this list, or returns null if this list is empty.
             */
            public peekLast(): T {
                return this._tail ? this._tail.data : null;
            }

            public toString() {
                return '[' + this.toArray().toString() + ']'
            }

        }
    }
}

//预定义短类名
import LinkedList = JS.data.LinkedList;
