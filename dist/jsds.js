//@ sourceURL=jsds.js
/**
* JSDK 2.2.0 
* https://github.com/fengboyue/jsdk/
* (c) 2007-2020 Frank.Feng<boyue.feng@foxmail.com>
* MIT license
*/
var JS;
(function (JS) {
    let ds;
    (function (ds) {
        class BiMap {
            constructor(m) {
                this._m = new Map();
                this.putAll(m);
            }
            inverse() {
                let m = new BiMap();
                if (this.size() >= 0)
                    this._m.forEach((v, k) => { m.put(v, k); });
                return m;
            }
            delete(k) {
                return this._m.delete(k);
            }
            forEach(fn, ctx) {
                this._m.forEach(fn, ctx);
            }
            clear() {
                this._m.clear();
            }
            size() {
                return this._m.size;
            }
            has(k) {
                return this._m.has(k);
            }
            get(k) {
                return this._m.get(k);
            }
            put(k, v) {
                this._m.set(k, v);
            }
            putAll(map) {
                if (map) {
                    map instanceof Array ? map.forEach(kv => { this.put(kv["0"], kv["1"]); }) : map.forEach((v, k) => { this.put(k, v); });
                }
            }
            static convert(json) {
                let m = new BiMap();
                Jsons.forEach(json, (v, k) => {
                    m.put(k, v);
                });
                return m;
            }
        }
        ds.BiMap = BiMap;
    })(ds = JS.ds || (JS.ds = {}));
})(JS || (JS = {}));
var BiMap = JS.ds.BiMap;
var JS;
(function (JS) {
    let ds;
    (function (ds) {
        class LinkedList {
            constructor() {
                this._s = 0;
                this._hd = null;
                this._tl = null;
            }
            each(fn, thisArg) {
                if (this._s == 0)
                    return true;
                let rst = true, i = 0, node = this._hd;
                while (node) {
                    if (!fn.call(thisArg || this, node.data, i, this)) {
                        rst = false;
                        break;
                    }
                    node = node.next;
                    ++i;
                }
                return rst;
            }
            size() {
                return this._s;
            }
            isEmpty() {
                return this._s == 0;
            }
            clear() {
                this._hd = null;
                this._tl = null;
                this._s = 0;
            }
            clone() {
                let list = new LinkedList();
                if (this._s > 0) {
                    let node = this._hd;
                    while (node) {
                        list.add(Jsons.clone(node.data));
                        node = node.next;
                    }
                }
                return list;
            }
            toArray() {
                let arr = [];
                this.each(d => {
                    arr[arr.length] = d;
                    return true;
                });
                return arr;
            }
            getFirst() {
                return this._hd ? this._hd.data : null;
            }
            getLast() {
                return this._tl ? this._tl.data : null;
            }
            _check(i) {
                if (i > this._s || i < 0)
                    throw new RangeError();
            }
            get(i) {
                this._check(i);
                if (i == 0)
                    return this._hd ? this._hd.data : null;
                if (i == this._s - 1)
                    return this._tl ? this._tl.data : null;
                let node = this._findAt(i);
                return node ? node.data : null;
            }
            _findAt(i) {
                return i < this._s / 2 ? this._fromFirst(i) : this._fromLast(i);
            }
            _fromFirst(i) {
                if (i <= 0)
                    return this._hd;
                let node = this._hd, count = 1;
                while (count <= i) {
                    node = node.next;
                    count++;
                }
                return node;
            }
            _fromLast(i) {
                if (i >= (this.size() - 1))
                    return this._tl;
                let node = this._tl, count = this._s - 1;
                while (count > i) {
                    node = node.prev;
                    count--;
                }
                return node;
            }
            indexOf(data, eq) {
                if (this.isEmpty())
                    return -1;
                let rst = -1;
                this.each((item, i) => {
                    let is = eq ? eq(data, item) : (data === item);
                    if (is)
                        rst = i;
                    return !is;
                });
                return rst;
            }
            lastIndexOf(data, eq) {
                if (this.isEmpty())
                    return -1;
                let j = -1, node = this._tl, i = this._s - 1;
                while (node) {
                    if (eq ? eq(data, node.data) : (data === node.data)) {
                        j = i;
                        break;
                    }
                    node = node.prev;
                    --i;
                }
                return j;
            }
            contains(data, eq) {
                return this.indexOf(data, eq) > -1;
            }
            _addLast(d) {
                let node = { data: Jsons.clone(d), prev: null, next: null };
                if (this._tl) {
                    node.prev = this._tl;
                    this._tl.next = node;
                }
                this._tl = node;
                if (!this._hd)
                    this._hd = this._tl;
                this._s += 1;
            }
            _addFirst(d) {
                let node = { data: Jsons.clone(d), prev: null, next: null };
                if (this._hd) {
                    node.next = this._hd;
                    this._hd.prev = node;
                }
                this._hd = node;
                if (!this._tl)
                    this._tl = this._hd;
                this._s += 1;
            }
            add(a) {
                if (Types.isArray(a)) {
                    a.forEach(el => {
                        this._addLast(el);
                    });
                }
                else {
                    this._addLast(a);
                }
            }
            addAll(list) {
                if (!list || list.isEmpty())
                    return;
                list.each(d => {
                    this._addLast(d);
                    return true;
                });
            }
            _addAt(i, a) {
                let nextNode = this._findAt(i);
                if (!nextNode)
                    return;
                let prevNode = nextNode.prev, newNode = { data: Jsons.clone(a), next: nextNode, prev: prevNode };
                prevNode.next = newNode;
                nextNode.prev = newNode;
                this._s += 1;
            }
            addAt(i, a) {
                if (i <= 0) {
                    this.addFirst(a);
                    return;
                }
                else if (i >= this.size()) {
                    this.addLast(a);
                    return;
                }
                if (!Types.isArray(a)) {
                    this._addAt(i, a);
                }
                else {
                    a.forEach((t, j) => {
                        this._addAt(i + j, t);
                    });
                }
            }
            addLast(a) {
                this.add(a);
            }
            addFirst(a) {
                if (Types.isArray(a)) {
                    for (let i = a.length - 1; i >= 0; i--) {
                        this._addFirst(a[i]);
                    }
                }
                else {
                    this._addFirst(a);
                }
            }
            removeFirst() {
                if (this._s == 0)
                    return null;
                let data = this._hd.data;
                if (this._s > 1) {
                    this._hd = this._hd.next;
                    this._hd.prev = null;
                }
                else {
                    this._hd = null;
                    this._tl = null;
                }
                this._s--;
                return data;
            }
            removeLast() {
                if (this._s == 0)
                    return null;
                let data = this._tl.data;
                if (this._s > 1) {
                    this._tl = this._tl.prev;
                    this._tl.next = null;
                }
                else {
                    this._hd = null;
                    this._tl = null;
                }
                this._s--;
                return data;
            }
            removeAt(i) {
                if (this.isEmpty())
                    return null;
                this._check(i);
                if (i == 0) {
                    this.removeFirst();
                    return;
                }
                else if (i == this.size() - 1) {
                    this.removeLast();
                    return;
                }
                let node = this._findAt(i);
                if (!node)
                    return null;
                let next = node.next, prev = node.prev;
                if (next)
                    next.prev = prev;
                if (prev)
                    prev.next = next;
                this._s--;
                return node.data;
            }
            peek() {
                return this._hd ? this._hd.data : null;
            }
            peekFirst() {
                return this.peek();
            }
            peekLast() {
                return this._tl ? this._tl.data : null;
            }
            toString() {
                return '[' + this.toArray().toString() + ']';
            }
        }
        ds.LinkedList = LinkedList;
    })(ds = JS.ds || (JS.ds = {}));
})(JS || (JS = {}));
var LinkedList = JS.ds.LinkedList;
var JS;
(function (JS) {
    let ds;
    (function (ds) {
        class Queue {
            constructor(maxSize) {
                this._list = new ds.LinkedList();
                this._maxSize = Infinity;
                this._maxSize = maxSize;
            }
            each(fn, thisArg) {
                return this._list.each((item, i) => {
                    return fn.call(thisArg || this, item, i, this);
                }, thisArg);
            }
            maxSize() {
                return this._maxSize;
            }
            size() {
                return this._list.size();
            }
            isFull() {
                return this.size() == this._maxSize;
            }
            isEmpty() {
                return this.size() == 0;
            }
            clear() {
                this._list.clear();
            }
            clone() {
                let list = new Queue();
                list._list = this._list.clone();
                return list;
            }
            toArray() {
                return this._list.toArray();
            }
            get(i) {
                return this._list.get(i);
            }
            indexOf(data, eq) {
                return this._list.indexOf(data, eq);
            }
            lastIndexOf(data, eq) {
                return this._list.lastIndexOf(data, eq);
            }
            contains(data, eq) {
                return this.indexOf(data, eq) > -1;
            }
            add(a) {
                if (this.isFull())
                    return false;
                this._list.addLast(a);
                return true;
            }
            remove() {
                return this._list.removeFirst();
            }
            peek() {
                return this._list.peekFirst();
            }
            toString() {
                return '[' + this._list.toArray().toString() + ']';
            }
        }
        ds.Queue = Queue;
    })(ds = JS.ds || (JS.ds = {}));
})(JS || (JS = {}));
var Queue = JS.ds.Queue;
var JS;
(function (JS) {
    let ds;
    (function (ds) {
        class Stack {
            constructor(a) {
                this.list = new ds.LinkedList();
                this.list.add(a);
            }
            each(fn, thisArg) {
                return this.list.each((item, i) => {
                    return fn.call(thisArg || this, item, i, this);
                }, thisArg);
            }
            size() {
                return this.list.size();
            }
            isEmpty() {
                return this.size() == 0;
            }
            clear() {
                this.list.clear();
            }
            clone() {
                let list = new Stack();
                list.list = this.list.clone();
                return list;
            }
            toArray() {
                return this.list.toArray();
            }
            peek() {
                return this.list.peekLast();
            }
            pop() {
                return this.list.removeLast();
            }
            push(item) {
                this.list.addLast(item);
            }
            toString() {
                return '[' + this.list.toArray().toString() + ']';
            }
        }
        ds.Stack = Stack;
    })(ds = JS.ds || (JS.ds = {}));
})(JS || (JS = {}));
var Stack = JS.ds.Stack;
