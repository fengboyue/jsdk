//# sourceURL=../dist/jsds.js
//JSDK 2.7.0 MIT
var JS;
(function (JS) {
    let store;
    (function (store) {
        let D = document;
        class CookieStore {
            static get(key) {
                let reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)", "gi"), data = reg.exec(D.cookie), str = data ? window['unescape'](data[2]) : null;
                return store.StoreHelper.parse(str);
            }
            ;
            static set(key, value, expireHours, path) {
                if (!key)
                    return;
                let exp = CookieStore.EXPIRES_DATETIME;
                if (Types.isDefined(expireHours) && expireHours > 0) {
                    var date = new Date();
                    date.setTime(date.getTime() + expireHours * 3600 * 1000);
                    exp = date.toUTCString();
                }
                let p = path ? path : CookieStore.PATH;
                let domain = CookieStore.DOMAIN;
                if (domain)
                    domain = 'domain=' + domain;
                D.cookie = key + '=' + window['escape']('' + store.StoreHelper.toString(value)) + '; path=' + p + '; expires=' + exp + domain;
            }
            ;
            static remove(key) {
                let date = new Date();
                date.setTime(date.getTime() - 10000);
                D.cookie = key + "=; expire=" + date.toUTCString();
            }
            ;
            static clear() {
                D.cookie = '';
            }
            ;
        }
        CookieStore.EXPIRES_DATETIME = 'Wed, 15 Apr 2099 00:00:00 GMT';
        CookieStore.PATH = '/';
        CookieStore.DOMAIN = self.document ? D.domain : null;
        store.CookieStore = CookieStore;
    })(store = JS.store || (JS.store = {}));
})(JS || (JS = {}));
var CookieStore = JS.store.CookieStore;
var JS;
(function (JS) {
    let store;
    (function (store) {
        class DataCache {
            constructor(init) {
                this._init = init;
                this._tName = init.name;
            }
            destroy() {
                let me = this;
                return Promises.create(function () {
                    me._open().then(db => {
                        db.deleteObjectStore(me._tName);
                        this.resolve();
                    });
                });
            }
            _open() {
                let me = this;
                return Promises.create(function () {
                    let dbReq = window.indexedDB.open(me._tName, 1);
                    dbReq.onupgradeneeded = (e) => {
                        let db = dbReq.result;
                        db.onerror = () => { this.reject(null); };
                        if (!db.objectStoreNames.contains(me._tName))
                            db.createObjectStore(me._tName, { keyPath: 'id', autoIncrement: false });
                    };
                    dbReq.onsuccess = (e) => {
                        let db = e.target['result'];
                        this.resolve(db);
                    };
                });
            }
            keys() {
                let me = this;
                return Promises.create(function () {
                    me._open().then(db => {
                        let tx = db.transaction(me._tName, 'readonly'), table = tx.objectStore(me._tName), req = table.getAllKeys();
                        req.onsuccess = (e) => {
                            let rst = e.target['result'];
                            db.close();
                            this.resolve(rst);
                        };
                        req.onerror = (e) => {
                            db.close();
                        };
                    });
                });
            }
            hasKey(id) {
                let me = this;
                return Promises.create(function () {
                    me._open().then(db => {
                        let tx = db.transaction(me._tName, 'readonly'), table = tx.objectStore(me._tName), req = table.getKey(id);
                        req.onsuccess = (e) => {
                            let rst = e.target['result'];
                            db.close();
                            this.resolve(rst !== undefined);
                        };
                        req.onerror = (e) => {
                            db.close();
                        };
                    });
                });
            }
            write(d) {
                let me = this;
                return Promises.create(function () {
                    me._open().then(db => {
                        let tx = db.transaction(me._tName, 'readwrite'), table = tx.objectStore(me._tName), req = table.put(d);
                        req.onsuccess = (e) => {
                            db.close();
                            this.resolve();
                        };
                        req.onerror = (e) => {
                            db.close();
                            if (me._init.onWriteFail)
                                me._init.onWriteFail.call(me, e);
                        };
                    });
                });
            }
            delete(id) {
                let me = this;
                return Promises.create(function () {
                    me._open().then(db => {
                        let table = db.transaction(me._tName, 'readwrite').objectStore(me._tName), req = table.delete(id);
                        req.onsuccess = (e) => {
                            db.close();
                            this.resolve();
                        };
                        req.onerror = (e) => {
                            db.close();
                            if (me._init.onWriteFail)
                                me._init.onWriteFail.call(me, e);
                            this.reject();
                        };
                    }).catch(() => {
                        this.reject();
                    });
                });
            }
            clear() {
                let me = this;
                return Promises.create(function () {
                    me._open().then(db => {
                        let table = db.transaction(me._tName, 'readwrite').objectStore(me._tName), req = table.clear();
                        req.onsuccess = (e) => {
                            db.close();
                            this.resolve();
                        };
                        req.onerror = (e) => {
                            db.close();
                            if (me._init.onWriteFail)
                                me._init.onWriteFail.call(me, e);
                        };
                    });
                });
            }
            read(id) {
                let me = this;
                return Promises.create(function () {
                    me._open().then(db => {
                        let table = db.transaction(me._tName, 'readonly').objectStore(me._tName), req = table.get(id);
                        req.onsuccess = (e) => {
                            let file = e.target['result'];
                            db.close();
                            if (file) {
                                this.resolve(file.data);
                            }
                            else {
                                if (me._init.onReadFail)
                                    me._init.onReadFail.call(me, e);
                            }
                        };
                        req.onerror = (e) => {
                            db.close();
                            if (me._init.onReadFail)
                                me._init.onReadFail.call(me, e);
                        };
                    });
                });
            }
            load(d) {
                let me = this;
                return Promises.create(function () {
                    Http.get({
                        url: d.url,
                        responseType: d.type,
                        error: res => {
                            if (me._init.onLoadFail)
                                me._init.onLoadFail.call(me, res);
                            this.reject(me);
                        },
                        success: res => {
                            me.write({
                                id: d.id,
                                data: res.raw
                            }).then(() => {
                                this.resolve(me);
                            }).catch(() => {
                                this.reject(me);
                            });
                        }
                    });
                });
            }
        }
        store.DataCache = DataCache;
    })(store = JS.store || (JS.store = {}));
})(JS || (JS = {}));
var DataCache = JS.store.DataCache;
var JS;
(function (JS) {
    let store;
    (function (store) {
        class ImageCache {
            constructor() {
                this._map = {};
            }
            _load(id, url, uncached) {
                let m = this;
                return Promises.create(function () {
                    let img = new Image();
                    img.onload = () => {
                        if (!uncached)
                            m.set(id, img);
                        this.resolve();
                    };
                    img.src = url;
                });
            }
            load(imgs) {
                let ms = Types.isArray(imgs) ? imgs : [imgs], plans = [];
                ms.forEach(img => {
                    plans.push(Promises.newPlan(this._load, [img.id, img.url], this));
                });
                return Promises.all(plans);
            }
            set(id, img) {
                this._map[id] = img;
            }
            get(id) {
                return this._map[id];
            }
            has(id) {
                return this._map.hasOwnProperty(id);
            }
            clear() {
                this._map = {};
            }
        }
        store.ImageCache = ImageCache;
    })(store = JS.store || (JS.store = {}));
})(JS || (JS = {}));
var ImageCache = JS.store.ImageCache;
var JS;
(function (JS) {
    let store;
    (function (store) {
        let L = localStorage;
        class LocalStore {
            static get(key) {
                let str = L.getItem(key);
                if (!str)
                    return undefined;
                return store.StoreHelper.parse(str);
            }
            ;
            static set(key, value) {
                L.setItem(key, store.StoreHelper.toString(value));
            }
            ;
            static remove(key) {
                L.removeItem(key);
            }
            ;
            static key(i) {
                return L.key(i);
            }
            ;
            static size() {
                return L.length;
            }
            ;
            static clear() {
                L.clear();
            }
            ;
        }
        store.LocalStore = LocalStore;
    })(store = JS.store || (JS.store = {}));
})(JS || (JS = {}));
var LocalStore = JS.store.LocalStore;
var JS;
(function (JS) {
    let store;
    (function (store) {
        let S = sessionStorage;
        class SessionStore {
            static get(key) {
                let str = S.getItem(key);
                if (!str)
                    return undefined;
                return store.StoreHelper.parse(str);
            }
            ;
            static set(key, value) {
                S.setItem(key, store.StoreHelper.toString(value));
            }
            ;
            static remove(key) {
                S.removeItem(key);
            }
            ;
            static key(i) {
                return S.key(i);
            }
            ;
            static size() {
                return S.length;
            }
            ;
            static clear() {
                S.clear();
            }
            ;
        }
        store.SessionStore = SessionStore;
    })(store = JS.store || (JS.store = {}));
})(JS || (JS = {}));
var SessionStore = JS.store.SessionStore;
var JS;
(function (JS) {
    let store;
    (function (store) {
        let T = Types, J = Jsons, TP = Type, S = J.stringify;
        class StoreHelper {
            static toString(value) {
                if (T.isUndefined(value))
                    return 'undefined';
                if (T.isNull(value))
                    return 'null';
                if (T.isString(value))
                    return S(['string', value]);
                if (T.isBoolean(value))
                    return S(['boolean', value]);
                if (T.isNumber(value))
                    return S(['number', value]);
                if (T.isDate(value))
                    return S(['date', '' + value.valueOf()]);
                if (T.isArray(value) || T.isJsonObject(value))
                    return S(['object', S(value)]);
            }
            static parse(data) {
                if (TP.null == data)
                    return null;
                if (TP.undefined == data)
                    return undefined;
                let [type, val] = J.parse(data), v = val;
                switch (type) {
                    case TP.boolean:
                        v = Boolean(val);
                        break;
                    case TP.number:
                        v = Number(val);
                        break;
                    case TP.date:
                        v = new Date(val);
                        break;
                    case TP.array:
                        v = J.parse(val);
                        break;
                    case TP.json:
                        v = J.parse(val);
                        break;
                }
                return v;
            }
        }
        store.StoreHelper = StoreHelper;
    })(store = JS.store || (JS.store = {}));
})(JS || (JS = {}));
var StoreHelper = JS.store.StoreHelper;
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
        let J = Jsons;
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
                        list.add(J.clone(node.data));
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
            get(i) {
                if (i > this._s || i < 0)
                    return null;
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
                let node = { data: J.clone(d), prev: null, next: null };
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
                let node = { data: J.clone(d), prev: null, next: null };
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
                let prevNode = nextNode.prev, newNode = { data: J.clone(a), next: nextNode, prev: prevNode };
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
                if (this.isEmpty() || i > this._s || i < 0)
                    return null;
                if (i == 0) {
                    return this.removeFirst();
                }
                else if (i == this.size() - 1) {
                    return this.removeLast();
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
                this._ms = Infinity;
                this._ms = maxSize;
            }
            each(fn, thisArg) {
                return this._list.each((item, i) => {
                    return fn.call(thisArg || this, item, i, this);
                }, thisArg);
            }
            maxSize() {
                return this._ms;
            }
            size() {
                return this._list.size();
            }
            isFull() {
                return this.size() == this._ms;
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
