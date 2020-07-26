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

        let J = Jsons;

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

            //size
            private _s = 0;
            //head
            private _hd: LinkedNode<T> = null;
            //tail
            private _tl: LinkedNode<T> = null;

            constructor() {
            }

            public each(fn: (item: T, index: number, iter: LinkedList<T>) => boolean, thisArg?: any) {
                if (this._s == 0) return true;

                let rst = true, i = 0, node = this._hd;
                while (node) {
                    if (!fn.call(thisArg || this, node.data, i, this)) {rst = false;break;}
                    node = node.next;
                    ++i;
                }
                return rst;
            }

            public size() {
                return this._s
            }
            public isEmpty() {
                return this._s == 0
            }
            public clear() {
                this._hd = null;
                this._tl = null;
                this._s = 0;
            }
            public clone(): LinkedList<T> {
                let list = new LinkedList<T>();

                if (this._s > 0) {
                    let node = this._hd;
                    while (node) {
                        list.add(J.clone(node.data));
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
                return this._hd ? this._hd.data : null
            }
            public getLast(): T {
                return this._tl ? this._tl.data : null
            }

            private _check(i: number) {
                if (i > this._s || i < 0) throw new RangeError();
            }

            public get(i: number): T {
                this._check(i);
                if (i == 0) return this._hd ? this._hd.data : null;
                if (i == this._s - 1) return this._tl ? this._tl.data : null;

                let node = this._findAt(i);
                return node ? node.data : null;
            }

            private _findAt(i: number): LinkedNode<T> {
                return i < this._s / 2 ? this._fromFirst(i) : this._fromLast(i);
            }

            private _fromFirst(i: number): LinkedNode<T> {
                if (i<=0) return this._hd;
                let node = this._hd, count = 1;
                while (count <= i) {
                    node = node.next;
                    count++;
                }
                return node;
            }
            private _fromLast(i: number): LinkedNode<T> {
                if (i>=(this.size()-1)) return this._tl;
                let node = this._tl, count = this._s - 1;
                while (count > i) {
                    node = node.prev;
                    count--;
                }
                return node;
            }

            public indexOf(data: T, eq?:(data:T,item:T)=>boolean): number {
                if (this.isEmpty()) return -1;
                let rst = -1;

                this.each((item, i) => {
                    let is = eq?eq(data,item):(data === item);
                    if (is) rst = i;
                    return !is;
                })
                return rst;
            }
            public lastIndexOf(data: T, eq?:(data:T,item:T)=>boolean): number {
                if (this.isEmpty()) return -1;

                let j = -1, node = this._tl, i = this._s - 1;
                while (node) {
                    if (eq?eq(data,node.data):(data === node.data)) {
                        j = i;
                        break;
                    }
                    node = node.prev;
                    --i;
                }

                return j;
            }
            public contains(data: T, eq?:(data:T,item:T)=>boolean) {
                return this.indexOf(data, eq) > -1;
            }

            private _addLast(d: T) {
                let node: LinkedNode<T> = { data: J.clone(d), prev: null, next: null };
                if (this._tl) {
                    node.prev = this._tl;
                    this._tl.next = node;
                }
                this._tl = node;
                if (!this._hd) this._hd = this._tl;
                this._s += 1;
            }
            private _addFirst(d: T) {
                let node: LinkedNode<T> = { data: J.clone(d), prev: null, next: null };
                if (this._hd) {
                    node.next = this._hd;
                    this._hd.prev = node;
                }
                this._hd = node;
                if (!this._tl) this._tl = this._hd;
                this._s += 1;
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

                let prevNode = nextNode.prev, newNode = { data: J.clone(a), next: nextNode, prev: prevNode };
                prevNode.next = newNode;
                nextNode.prev = newNode;
                this._s += 1;
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
                if (this._s == 0) return null;

                let data = this._hd.data;
                if (this._s > 1) {
                    this._hd = this._hd.next;
                    this._hd.prev = null;
                } else {
                    this._hd = null;
                    this._tl = null;
                }

                this._s--;
                return data
            }

            public removeLast(): T {
                if (this._s == 0) return null;

                let data = this._tl.data;
                if (this._s > 1) {
                    this._tl = this._tl.prev;
                    this._tl.next = null;
                } else {
                    this._hd = null;
                    this._tl = null;
                }

                this._s--;
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
                this._s--;
                return node.data
            }

            /**
             * Retrieves, but does not remove, the first element of this list.
             */
            public peek(): T {
                return this._hd ? this._hd.data : null;
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
                return this._tl ? this._tl.data : null;
            }

            public toString() {
                return '[' + this.toArray().toString() + ']'
            }

        }
    }
}

//预定义短类名
import LinkedList = JS.ds.LinkedList;
