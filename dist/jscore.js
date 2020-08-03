//# sourceURL=jscore.js
/**
* JSDK 2.4.0 
* https://github.com/fengboyue/jsdk/
* (c) 2007-2020 Frank.Feng<boyue.feng@foxmail.com>
* MIT license
*/
var Reflect;
(function (Reflect) {
    var A = Array, U8A = Uint8Array, TE = TypeError, OP = Object.prototype, MP = Map.prototype, WMP = WeakMap.prototype, SP = Set.prototype, $o = "object", $f = "function", $u = "undefined", TO = function (v, s) { return typeof v === s; };
    (function (factory) {
        var TO = function (v, s) { return typeof v === s; }, root = typeof global === $o ? global :
            TO(self, $o) ? self :
                TO(this, $o) ? this :
                    Function("return this;")();
        var exporter = makeExporter(Reflect);
        if (TO(root.Reflect, $u)) {
            root.Reflect = Reflect;
        }
        else {
            exporter = makeExporter(root.Reflect, exporter);
        }
        factory(exporter);
        function makeExporter(target, previous) {
            return function (key, value) {
                if (!TO(target[key], $f)) {
                    Object.defineProperty(target, key, { configurable: true, writable: true, value: value });
                }
                if (previous)
                    previous(key, value);
            };
        }
    })(function (exporter) {
        var hasOwn = OP.hasOwnProperty, supportsSymbol = TO(Symbol, $f), toPrimitiveSymbol = supportsSymbol && !TO(Symbol.toPrimitive, $u) ? Symbol.toPrimitive : "@@toPrimitive", iteratorSymbol = supportsSymbol && !TO(Symbol.iterator, $u) ? Symbol.iterator : "@@iterator", supportsCreate = TO(Object.create, $f), supportsProto = { __proto__: [] } instanceof A, downLevel = !supportsCreate && !supportsProto, HashMap = {
            create: supportsCreate
                ? function () { return MakeDictionary(Object.create(null)); }
                : supportsProto
                    ? function () { return MakeDictionary({ __proto__: null }); }
                    : function () { return MakeDictionary({}); },
            has: downLevel
                ? function (m, k) { return hasOwn.call(m, k); }
                : function (m, k) { return k in m; },
            get: downLevel
                ? function (m, k) { return hasOwn.call(m, k) ? m[k] : undefined; }
                : function (m, k) { return m[k]; }
        }, FProto = Object.getPrototypeOf(Function), usePolyfill = typeof process === $o && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true", _Map = !usePolyfill && TO(Map, $f) && TO(MP.entries, $f) ? Map : CreateMapPolyfill(), _Set = !usePolyfill && TO(Set, $f) && TO(SP.entries, $f) ? Set : CreateSetPolyfill(), _WeakMap = !usePolyfill && TO(WeakMap, $f) ? WeakMap : CreateWeakMapPolyfill(), Metadata = new _WeakMap();
        function decorate(decorators, target, propertyKey, attributes) {
            if (!IsUndefined(propertyKey)) {
                if (!IsArray(decorators))
                    throw new TE();
                if (!IsObject(target))
                    throw new TE();
                if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                    throw new TE();
                if (IsNull(attributes))
                    attributes = undefined;
                propertyKey = ToPropertyKey(propertyKey);
                return DecorateProperty(decorators, target, propertyKey, attributes);
            }
            else {
                if (!IsArray(decorators))
                    throw new TE();
                if (!IsConstructor(target))
                    throw new TE();
                return DecorateConstructor(decorators, target);
            }
        }
        exporter("decorate", decorate);
        function metadata(metadataKey, metadataValue) {
            function decorator(target, propertyKey) {
                if (!IsObject(target))
                    throw new TE();
                if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                    throw new TE();
                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
            }
            return decorator;
        }
        exporter("metadata", metadata);
        function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
            if (!IsObject(target))
                throw new TE();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        exporter("defineMetadata", defineMetadata);
        function hasMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TE();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasMetadata", hasMetadata);
        function hasOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TE();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasOwnMetadata", hasOwnMetadata);
        function getMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TE();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetMetadata(metadataKey, target, propertyKey);
        }
        exporter("getMetadata", getMetadata);
        function getOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TE();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("getOwnMetadata", getOwnMetadata);
        function getMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TE();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryMetadataKeys(target, propertyKey);
        }
        exporter("getMetadataKeys", getMetadataKeys);
        function getOwnMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TE();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryOwnMetadataKeys(target, propertyKey);
        }
        exporter("getOwnMetadataKeys", getOwnMetadataKeys);
        function deleteMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TE();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            var metadataMap = GetOrCreateMetadataMap(target, propertyKey, false);
            if (IsUndefined(metadataMap))
                return false;
            if (!metadataMap.delete(metadataKey))
                return false;
            if (metadataMap.size > 0)
                return true;
            var targetMetadata = Metadata.get(target);
            targetMetadata.delete(propertyKey);
            if (targetMetadata.size > 0)
                return true;
            Metadata.delete(target);
            return true;
        }
        exporter("deleteMetadata", deleteMetadata);
        function DecorateConstructor(decorators, target) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i], decorated = decorator(target);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsConstructor(decorated))
                        throw new TE();
                    target = decorated;
                }
            }
            return target;
        }
        function DecorateProperty(decorators, target, propertyKey, descriptor) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target, propertyKey, descriptor);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsObject(decorated))
                        throw new TE();
                    descriptor = decorated;
                }
            }
            return descriptor;
        }
        function GetOrCreateMetadataMap(O, P, Create) {
            var targetMetadata = Metadata.get(O);
            if (IsUndefined(targetMetadata)) {
                if (!Create)
                    return undefined;
                targetMetadata = new _Map();
                Metadata.set(O, targetMetadata);
            }
            var metadataMap = targetMetadata.get(P);
            if (IsUndefined(metadataMap)) {
                if (!Create)
                    return undefined;
                metadataMap = new _Map();
                targetMetadata.set(P, metadataMap);
            }
            return metadataMap;
        }
        function OrdinaryHasMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return true;
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryHasMetadata(MetadataKey, parent, P);
            return false;
        }
        function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, false);
            if (IsUndefined(metadataMap))
                return false;
            return ToBoolean(metadataMap.has(MetadataKey));
        }
        function OrdinaryGetMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return OrdinaryGetOwnMetadata(MetadataKey, O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryGetMetadata(MetadataKey, parent, P);
            return undefined;
        }
        function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, false);
            if (IsUndefined(metadataMap))
                return undefined;
            return metadataMap.get(MetadataKey);
        }
        function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, true);
            metadataMap.set(MetadataKey, MetadataValue);
        }
        function OrdinaryMetadataKeys(O, P) {
            var ownKeys = OrdinaryOwnMetadataKeys(O, P), parent = OrdinaryGetPrototypeOf(O);
            if (parent === null)
                return ownKeys;
            var parentKeys = OrdinaryMetadataKeys(parent, P);
            if (parentKeys.length <= 0)
                return ownKeys;
            if (ownKeys.length <= 0)
                return parentKeys;
            var set = new _Set(), keys = [];
            for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
                var key = ownKeys_1[_i], hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
                var key = parentKeys_1[_a], hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            return keys;
        }
        function OrdinaryOwnMetadataKeys(O, P) {
            var keys = [], metadataMap = GetOrCreateMetadataMap(O, P, false);
            if (IsUndefined(metadataMap))
                return keys;
            var keysObj = metadataMap.keys(), iterator = GetIterator(keysObj), k = 0;
            while (true) {
                var next = IteratorStep(iterator);
                if (!next) {
                    keys.length = k;
                    return keys;
                }
                var nextValue = IteratorValue(next);
                try {
                    keys[k] = nextValue;
                }
                catch (e) {
                    try {
                        IteratorClose(iterator);
                    }
                    finally {
                        throw e;
                    }
                }
                k++;
            }
        }
        function Type(x) {
            if (x === null)
                return 1;
            switch (typeof x) {
                case $u: return 0;
                case "boolean": return 2;
                case "string": return 3;
                case "symbol": return 4;
                case "number": return 5;
                case $o: return x === null ? 1 : 6;
                default: return 6;
            }
        }
        function IsUndefined(x) {
            return x === undefined;
        }
        function IsNull(x) {
            return x === null;
        }
        function IsSymbol(x) {
            return TO(x, "symbol");
        }
        function IsObject(x) {
            return TO(x, $o) ? x !== null : TO(x, $f);
        }
        function ToPrimitive(input, PreferredType) {
            switch (Type(input)) {
                case 0: return input;
                case 1: return input;
                case 2: return input;
                case 3: return input;
                case 4: return input;
                case 5: return input;
            }
            var hint = PreferredType === 3 ? "string" : PreferredType === 5 ? "number" : "default", exoticToPrim = GetMethod(input, toPrimitiveSymbol);
            if (exoticToPrim !== undefined) {
                var result = exoticToPrim.call(input, hint);
                if (IsObject(result))
                    throw new TE();
                return result;
            }
            return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
        }
        function OrdinaryToPrimitive(O, hint) {
            if (hint === "string") {
                var toString_1 = Object.toString;
                if (IsCallable(toString_1)) {
                    var result = toString_1.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var valueOf = Object.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            else {
                var valueOf = Object.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var toString_2 = Object.toString;
                if (IsCallable(toString_2)) {
                    var result = toString_2.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            throw new TE();
        }
        function ToBoolean(argument) {
            return !!argument;
        }
        function ToString(argument) {
            return "" + argument;
        }
        function ToPropertyKey(argument) {
            var key = ToPrimitive(argument, 3);
            if (IsSymbol(key))
                return key;
            return ToString(key);
        }
        function IsArray(argument) {
            return A.isArray
                ? A.isArray(argument)
                : argument instanceof O
                    ? argument instanceof A
                    : OP.toString.call(argument) === "[object Array]";
        }
        function IsCallable(argument) {
            return TO(argument, $f);
        }
        function IsConstructor(argument) {
            return TO(argument, $f);
        }
        function IsPropertyKey(argument) {
            switch (Type(argument)) {
                case 3: return true;
                case 4: return true;
                default: return false;
            }
        }
        function GetMethod(V, P) {
            var func = V[P];
            if (func === undefined || func === null)
                return undefined;
            if (!IsCallable(func))
                throw new TE();
            return func;
        }
        function GetIterator(obj) {
            var method = GetMethod(obj, iteratorSymbol);
            if (!IsCallable(method))
                throw new TE();
            var iterator = method.call(obj);
            if (!IsObject(iterator))
                throw new TE();
            return iterator;
        }
        function IteratorValue(iterResult) {
            return iterResult.value;
        }
        function IteratorStep(iterator) {
            var result = iterator.next();
            return result.done ? false : result;
        }
        function IteratorClose(iterator) {
            var f = iterator["return"];
            if (f)
                f.call(iterator);
        }
        function OrdinaryGetPrototypeOf(O) {
            var proto = Object.getPrototypeOf(O);
            if (typeof Object !== $f || Object === FProto)
                return proto;
            if (proto !== FProto)
                return proto;
            var prototype = Object.prototype;
            var pProto = prototype && Object.getPrototypeOf(prototype);
            if (pProto == null || pProto === OP)
                return proto;
            var ctor = pProto.constructor;
            if (!TO(ctor, $f))
                return proto;
            if (ctor === O)
                return proto;
            return ctor;
        }
        function CreateMapPolyfill() {
            var cacheSentinel = {}, arraySentinel = [], MapIterator = (function () {
                function MapIterator(keys, values, selector) {
                    this._index = 0;
                    this._keys = keys;
                    this._values = values;
                    this._selector = selector;
                }
                var P = MapIterator.prototype;
                P["@@iterator"] = function () { return this; };
                P[iteratorSymbol] = function () { return this; };
                P.next = function () {
                    var T = this, index = T._index;
                    if (index >= 0 && index < T._keys.length) {
                        var result = T._selector(T._keys[index], T._values[index]);
                        if (index + 1 >= T._keys.length) {
                            T._index = -1;
                            T._keys = arraySentinel;
                            T._values = arraySentinel;
                        }
                        else {
                            T._index++;
                        }
                        return { value: result, done: false };
                    }
                    return { value: undefined, done: true };
                };
                P.throw = function (e) {
                    var T = this;
                    if (T._index >= 0) {
                        T._index = -1;
                        T._keys = arraySentinel;
                        T._values = arraySentinel;
                    }
                    throw e;
                };
                P.return = function (v) {
                    var T = this;
                    if (T._index >= 0) {
                        T._index = -1;
                        T._keys = arraySentinel;
                        T._values = arraySentinel;
                    }
                    return { value: v, done: true };
                };
                return MapIterator;
            }());
            return (function () {
                function Map() {
                    this._keys = [];
                    this._values = [];
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                }
                Object.defineProperty(MP, "size", {
                    get: function () { return this._keys.length; },
                    enumerable: true,
                    configurable: true
                });
                MP.has = function (k) { return this._find(k, false) >= 0; };
                MP.get = function (k) {
                    var index = this._find(k, false);
                    return index >= 0 ? this._values[index] : undefined;
                };
                MP.set = function (k, v) {
                    var index = this._find(k, true);
                    this._values[index] = v;
                    return this;
                };
                MP.delete = function (k) {
                    var T = this, index = T._find(k, false);
                    if (index >= 0) {
                        var size = T._keys.length;
                        for (var i = index + 1; i < size; i++) {
                            T._keys[i - 1] = T._keys[i];
                            T._values[i - 1] = T._values[i];
                        }
                        T._keys.length--;
                        T._values.length--;
                        if (k === T._cacheKey) {
                            T._cacheKey = cacheSentinel;
                            T._cacheIndex = -2;
                        }
                        return true;
                    }
                    return false;
                };
                MP.clear = function () {
                    var T = this;
                    T._keys.length = 0;
                    T._values.length = 0;
                    T._cacheKey = cacheSentinel;
                    T._cacheIndex = -2;
                };
                MP.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
                MP.values = function () { return new MapIterator(this._keys, this._values, getValue); };
                MP.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
                MP["@@iterator"] = function () { return this.entries(); };
                MP[iteratorSymbol] = function () { return this.entries(); };
                MP._find = function (k, insert) {
                    var T = this;
                    if (T._cacheKey !== k) {
                        T._cacheIndex = T._keys.indexOf(T._cacheKey = k);
                    }
                    if (T._cacheIndex < 0 && insert) {
                        T._cacheIndex = T._keys.length;
                        T._keys.push(k);
                        T._values.push(undefined);
                    }
                    return T._cacheIndex;
                };
                return Map;
            }());
            function getKey(k, _) {
                return k;
            }
            function getValue(_, v) {
                return v;
            }
            function getEntry(k, v) {
                return [k, v];
            }
        }
        function CreateSetPolyfill() {
            return (function () {
                function Set() {
                    this._map = new _Map();
                }
                Object.defineProperty(SP, "size", {
                    get: function () { return this._map.size; },
                    enumerable: true,
                    configurable: true
                });
                SP.has = function (v) { return this._map.has(v); };
                SP.add = function (v) { return this._map.set(v, v), this; };
                SP.delete = function (v) { return this._map.delete(v); };
                SP.clear = function () { this._map.clear(); };
                SP.keys = function () { return this._map.keys(); };
                SP.values = function () { return this._map.values(); };
                SP.entries = function () { return this._map.entries(); };
                SP["@@iterator"] = function () { return this.keys(); };
                SP[iteratorSymbol] = function () { return this.keys(); };
                return Set;
            }());
        }
        function CreateWeakMapPolyfill() {
            var UUID_SIZE = 16;
            var keys = HashMap.create();
            var rootKey = CreateUniqueKey();
            return (function () {
                function WeakMap() {
                    this._key = CreateUniqueKey();
                }
                WMP.has = function (t) {
                    var table = GetOrCreateWeakMapTable(t, false);
                    return table !== undefined ? HashMap.has(table, this._key) : false;
                };
                WMP.get = function (t) {
                    var table = GetOrCreateWeakMapTable(t, false);
                    return table !== undefined ? HashMap.get(table, this._key) : undefined;
                };
                WMP.set = function (t, v) {
                    var table = GetOrCreateWeakMapTable(t, true);
                    table[this._key] = v;
                    return this;
                };
                WMP.delete = function (t) {
                    var table = GetOrCreateWeakMapTable(t, false);
                    return table !== undefined ? delete table[this._key] : false;
                };
                WMP.clear = function () {
                    this._key = CreateUniqueKey();
                };
                return WeakMap;
            }());
            function CreateUniqueKey() {
                var key;
                do
                    key = "@@WeakMap@@" + CreateUUID();
                while (HashMap.has(keys, key));
                keys[key] = true;
                return key;
            }
            function GetOrCreateWeakMapTable(t, create) {
                if (!hasOwn.call(t, rootKey)) {
                    if (!create)
                        return undefined;
                    Object.defineProperty(t, rootKey, { value: HashMap.create() });
                }
                return t[rootKey];
            }
            function FillRandomBytes(b, size) {
                for (var i = 0; i < size; ++i)
                    b[i] = Math.random() * 0xff | 0;
                return b;
            }
            function GenRandomBytes(s) {
                if (typeof U8A === $f) {
                    if (typeof crypto !== $u)
                        return crypto.getRandomValues(new U8A(s));
                    if (typeof msCrypto !== $u)
                        return msCrypto.getRandomValues(new U8A(s));
                    return FillRandomBytes(new U8A(s), s);
                }
                return FillRandomBytes(new A(s), s);
            }
            function CreateUUID() {
                var d = GenRandomBytes(UUID_SIZE);
                d[6] = d[6] & 0x4f | 0x40;
                d[8] = d[8] & 0xbf | 0x80;
                var r = "";
                for (var f = 0; f < UUID_SIZE; ++f) {
                    var b = d[f];
                    if (f === 4 || f === 6 || f === 8)
                        r += "-";
                    if (b < 16)
                        r += "0";
                    r += b.toString(16).toLowerCase();
                }
                return r;
            }
        }
        function MakeDictionary(b) {
            b.__ = undefined;
            delete b.__;
            return b;
        }
    });
})(Reflect || (Reflect = {}));
var JS;
(function (JS) {
    let lang;
    (function (lang) {
        let Type;
        (function (Type) {
            Type["null"] = "null";
            Type["undefined"] = "undefined";
            Type["string"] = "string";
            Type["boolean"] = "boolean";
            Type["number"] = "number";
            Type["date"] = "date";
            Type["array"] = "array";
            Type["json"] = "json";
            Type["object"] = "object";
            Type["function"] = "function";
            Type["class"] = "class";
            Type["symbol"] = "symbol";
        })(Type = lang.Type || (lang.Type = {}));
    })(lang = JS.lang || (JS.lang = {}));
})(JS || (JS = {}));
var Type = JS.lang.Type;
var JS;
(function (JS) {
    let util;
    (function (util) {
        let _of = function (a, s) {
            return typeof a === s;
        };
        let _is = function (a, s) {
            return toString.call(a) === `[object ${s}]`;
        };
        let _isKlass = function (obj) {
            if (typeof obj != 'function')
                return false;
            let proto = obj.prototype;
            if (proto === undefined || proto.constructor !== obj)
                return false;
            if (Object.getOwnPropertyNames(proto).length >= 2)
                return true;
            var str = obj.toString();
            if (str.slice(0, 5) == "class")
                return true;
            if (/^function\s+\(|^function\s+anonymous\(/.test(str))
                return false;
            if (/\b\(this\b|\bthis[\.\[]\b/.test(str)) {
                if (/classCallCheck\(this/.test(str))
                    return true;
                return /^function\sdefault_\d+\s*\(/.test(str);
            }
            return false;
        };
        class Types {
            static isSymbol(o) {
                return _of(o, 'symbol');
            }
            static isArguments(o) {
                return _is(o, 'Arguments');
            }
            static isNaN(n) {
                return n != null && isNaN(n);
            }
            static isNumber(n) {
                return _of(n, 'number');
            }
            static isNumeric(n) {
                return (this.isNumber(n) || this.isString(n)) && !isNaN(n - parseFloat(n));
            }
            static isFloat(n) {
                return Number(n).isFloat();
            }
            static isInt(n) {
                return Number(n).isInt();
            }
            static isBoolean(obj) {
                return _of(obj, 'boolean');
            }
            static isString(obj) {
                return _of(obj, 'string');
            }
            static isDate(obj) {
                return _is(obj, 'Date');
            }
            static isDefined(obj) {
                return obj != void 0;
            }
            static isNull(obj) {
                return obj === null;
            }
            static isUndefined(obj) {
                return obj === void 0;
            }
            static isObject(obj) {
                return _is(obj, 'Object');
            }
            static isJsonObject(obj) {
                let OP = Object.prototype;
                if (!obj || OP.toString.call(obj) !== '[object Object]')
                    return false;
                let proto = Object.getPrototypeOf(obj);
                if (!proto)
                    return true;
                let ctor = OP.hasOwnProperty.call(proto, 'constructor') && proto.constructor, fnToString = Function.prototype.toString;
                return typeof ctor === 'function' && fnToString.call(ctor) === fnToString.call(Object);
            }
            static isArray(obj) {
                return Array.isArray(obj) || obj instanceof Array;
            }
            static isError(obj) {
                return _of(obj, 'Error');
            }
            static isFile(obj) {
                return _is(obj, 'File');
            }
            static isFormData(obj) {
                return _is(obj, 'FormData');
            }
            static isBlob(obj) {
                return _is(obj, 'Blob');
            }
            static isFunction(fn, pure) {
                return _of(fn, 'function') && (!pure ? true : !this.equalKlass(fn));
            }
            static isRegExp(obj) {
                return _is(obj, 'RegExp');
            }
            static isArrayBuffer(obj) {
                return _is(obj, 'ArrayBuffer');
            }
            static isTypedArray(value) {
                return value && this.isNumber(value.length) && /^\[object (?:Uint8|Uint8Clamped|Uint16|Uint32|Int8|Int16|Int32|Float32|Float64)Array]$/.test(toString.call(value));
            }
            static isElement(el) {
                return el && typeof el === 'object' && (el.nodeType === 1 || el.nodeType === 9);
            }
            static isWindow(el) {
                return el != null && el === el.window;
            }
            static isKlass(obj, klass) {
                return obj.constructor && obj.constructor === klass;
            }
            static ofKlass(obj, klass) {
                if (obj == void 0)
                    return false;
                if (this.isKlass(obj, klass))
                    return true;
                return obj instanceof klass;
            }
            static equalKlass(kls, klass) {
                if (!_isKlass(kls))
                    return false;
                return klass ? (kls === klass) : true;
            }
            static subKlass(kls1, kls2) {
                if (kls2 === Object || kls1 === kls2)
                    return true;
                let superXls = Class.getSuperklass(kls1);
                while (superXls != null) {
                    if (superXls === kls2)
                        return true;
                    superXls = Class.getSuperklass(superXls);
                }
                return false;
            }
            static equalClass(cls1, cls2) {
                return cls1.equals(cls2);
            }
            static subClass(cls1, cls2) {
                return cls1.subclassOf(cls2);
            }
            static type(obj) {
                if (obj === null)
                    return Type.null;
                let type = typeof obj;
                if (type == 'number' || type == 'bigint')
                    return Type.number;
                if (type == 'object') {
                    if (this.isJsonObject(obj))
                        return Type.json;
                    if (this.isArray(obj))
                        return Type.array;
                    if (this.isDate(obj))
                        return Type.date;
                    ;
                    return Type.object;
                }
                return _isKlass(obj) ? Type.class : type;
            }
        }
        util.Types = Types;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Types = JS.util.Types;
var JS;
(function (JS) {
    let util;
    (function (util) {
        let N = Number, _test = function (s, exp) {
            return s && exp.test(s.trim());
        }, EMAIL = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@([A-Za-z0-9]+(?:-[A-Za-z0-9]+)?\.)+[A-Za-z0-9]+(?:-[A-Za-z0-9]+)?$/, EMAIL_DOMAIN = /^@([A-Za-z0-9]+(?:-[A-Za-z0-9]+)?\.)+[A-Za-z0-9]+(?:-[A-Za-z0-9]+)?$/, YYYY_MM_DD = /^(\d{1,4})(-|\/)(\d{1,2})(-|\/)(\d{1,2})$/, HALFWIDTH_CHARS = /^[\u0000-\u00FF]+$/, FULLWIDTH_CHARS = /^[\u0391-\uFFE5]+$/, NUMBERS_ONLY = /^\d+$/, LETTERS_ONLY = /^[A-Za-z]+$/, LETTERS_OR_NUMBERS = /^[A-Za-z\d]+$/, ENGLISH_ONLY = /^[A-Za-z\d\s\`\~\!\@\#\$\%\^\&\*\(\)\_\-\+\=\[\]\{\}\|\:\;\"\'\<\>\,\.\?\\\/]+$/, CHINESE_ONLY = /^[\u4E00-\u9FA5]+$/, IP = /^(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5])$/;
        class Check {
            static isEmpty(v) {
                return v == void 0
                    || v === ''
                    || (v.hasOwnProperty('length') && v.length == 0)
                    || Check.isEmptyObject(v);
            }
            static isEmptyObject(v) {
                var name;
                for (name in v) {
                    return false;
                }
                return true;
            }
            static isBlank(s) {
                return s == void 0 || s.trim() === '';
            }
            static isFormatDate(s, format) {
                return _test(s, format || YYYY_MM_DD);
            }
            static isEmail(s, exp) {
                return _test(s, exp ? exp : EMAIL);
            }
            static isEmails(s, exp) {
                s = s || '';
                if (this.isBlank(s))
                    return false;
                return s.split(/;|\s+/).every(as => {
                    return as.length == 0 || this.isEmail(as, exp);
                });
            }
            static isEmailDomain(str) {
                return _test(str, EMAIL_DOMAIN);
            }
            static isOnlyNumber(str) {
                return _test(str, NUMBERS_ONLY);
            }
            static isPositive(n) {
                return N(n).isPositive();
            }
            static isNegative(n) {
                return N(n).isNegative();
            }
            static isHalfwidthChars(str) {
                return _test(str, HALFWIDTH_CHARS);
            }
            static isFullwidthChars(str) {
                return _test(str, FULLWIDTH_CHARS);
            }
            static isEnglishOnly(str) {
                return _test(str, ENGLISH_ONLY);
            }
            static isChineseOnly(str) {
                return _test(str, CHINESE_ONLY);
            }
            static isFormatNumber(n, iLength, fLength) {
                if (!util.Types.isNumeric(n))
                    return false;
                let num = N(n), iLen = num.integerLength(), dLen = num.fractionLength();
                if (iLen > iLength)
                    return false;
                if (util.Types.isDefined(fLength) && dLen > fLength)
                    return false;
                return true;
            }
            static greater(n1, n2) {
                return N(n1) > N(n2);
            }
            static greaterEqual(n1, n2) {
                return N(n1) >= N(n2);
            }
            static less(n1, n2) {
                return N(n1) < N(n2);
            }
            static lessEqual(n1, n2) {
                return N(n1) <= N(n2);
            }
            static isBetween(n, min, max) {
                let num = N(n);
                return num > N(min) && num < N(max);
            }
            static shorter(s, len) {
                return s && s.length < len;
            }
            static longer(s, len) {
                return s && s.length > len;
            }
            static equalLength(s, len) {
                return s && s.length == len;
            }
            static isLettersOnly(s) {
                return _test(s, LETTERS_ONLY);
            }
            static isLettersOrNumbers(s) {
                return _test(s, LETTERS_OR_NUMBERS);
            }
            static isIP(s) {
                return _test(s.trim(), IP);
            }
            static isExistUrl(url) {
                let xhr = new XMLHttpRequest();
                return new Promise(function (resolve, reject) {
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState == 4)
                            xhr.status == 200 ? resolve(true) : reject(false);
                    };
                    xhr.open('HEAD', url, true);
                    xhr.send();
                });
            }
            static isPattern(s, exp) {
                return _test(s, exp);
            }
            static byServer(req, judge) {
                return new Promise(function (resolve, reject) {
                    util.Ajax.send(req).then(res => {
                        judge.apply(null, [res]) ? resolve(true) : reject(false);
                    });
                });
            }
        }
        util.Check = Check;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Check = JS.util.Check;
var JS;
(function (JS) {
    let util;
    (function (util) {
        let A = Array, Y = util.Types, E = util.Check.isEmpty;
        class Jsons {
            static parse(text, reviver) {
                return text ? JSON.parse(text, reviver) : null;
            }
            static stringify(value, replacer, space) {
                return JSON.stringify(value, replacer, space);
            }
            static clone(obj) {
                if (obj == void 0 || 'object' != typeof obj)
                    return obj;
                let copy;
                if (obj instanceof Date) {
                    copy = new Date();
                    copy.setTime(obj.getTime());
                    return copy;
                }
                if (obj instanceof A) {
                    copy = [];
                    for (var i = 0, len = obj.length; i < len; ++i) {
                        copy[i] = this.clone(obj[i]);
                    }
                    return copy;
                }
                if (Y.isJsonObject(obj)) {
                    copy = {};
                    var keys = Reflect.ownKeys(obj);
                    keys.forEach(key => {
                        copy[key] = this.clone(obj[key]);
                    });
                    return copy;
                }
                return obj;
            }
            static forEach(json, fn, that) {
                if (!json)
                    return;
                let keys = Object.keys(json);
                keys.forEach((key, i) => {
                    fn.apply(that || json, [json[key], key]);
                });
            }
            static some(json, fn, that) {
                if (!json)
                    return;
                let keys = Object.keys(json);
                return keys.some((key, i) => {
                    return fn.apply(that || json, [json[key], key]);
                });
            }
            static hasKey(json, key) {
                return json && key != void 0 && json.hasOwnProperty(key);
            }
            static values(json) {
                if (!json)
                    return null;
                let arr = [];
                this.forEach(json, v => {
                    arr[arr.length] = v;
                });
                return arr;
            }
            static keys(json) {
                if (!json)
                    return null;
                let keys = [];
                this.forEach(json, (v, k) => {
                    keys[keys.length] = k;
                });
                return keys;
            }
            static equalKeys(json1, json2) {
                let empty1 = E(json1), empty2 = E(json2);
                if (empty1 && empty2)
                    return true;
                if (empty1 || empty2)
                    return false;
                let map2 = this.clone(json2);
                this.forEach(json1, (v, k) => {
                    delete map2[k];
                });
                return E(map2);
            }
            static equal(json1, json2) {
                let empty1 = E(json1), empty2 = E(json2);
                if (empty1 && empty2)
                    return true;
                if (empty1 || empty2)
                    return false;
                let map2 = this.clone(json2);
                this.forEach(json1, (v, k) => {
                    if ((k in map2) && map2[k] === v)
                        delete map2[k];
                });
                return E(map2);
            }
            static replaceKeys(json, keyMapping, needClone) {
                if (!keyMapping)
                    return json;
                let clone = needClone ? this.clone(json) : json;
                this.forEach(clone, function (val, oldKey) {
                    let newKey = Y.isFunction(keyMapping) ? keyMapping.apply(clone, [val, oldKey]) : keyMapping[oldKey];
                    if (newKey != oldKey && clone.hasOwnProperty(oldKey)) {
                        let temp = clone[oldKey];
                        delete clone[oldKey];
                        clone[newKey] = temp;
                    }
                });
                return clone;
            }
            static _union(...args) {
                var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
                if (typeof target === "boolean") {
                    deep = target;
                    target = arguments[i] || {};
                    i++;
                }
                if (typeof target !== "object" && !Y.isFunction(target)) {
                    target = {};
                }
                for (; i < length; i++) {
                    if ((options = arguments[i]) != null) {
                        for (name in options) {
                            src = target[name];
                            copy = options[name];
                            if (target === copy) {
                                continue;
                            }
                            if (deep && copy && (Y.isJsonObject(copy) ||
                                (copyIsArray = A.isArray(copy)))) {
                                if (copyIsArray) {
                                    copyIsArray = false;
                                    clone = src && A.isArray(src) ? src : [];
                                }
                                else {
                                    clone = src && Y.isJsonObject(src) ? src : {};
                                }
                                target[name] = this._union(deep, clone, copy);
                            }
                            else if (copy !== undefined) {
                                target[name] = copy;
                            }
                        }
                    }
                }
                return target;
            }
            ;
            static union(...jsons) {
                if (arguments.length <= 1)
                    return jsons[0];
                return this._union.apply(this, [true, {}].concat(jsons));
            }
            static minus(json1, json2) {
                if (E(json1) || E(json2))
                    return json1;
                let newJson = {};
                this.forEach(json1, (v, k) => {
                    if (!json2.hasOwnProperty(k))
                        newJson[k] = v;
                });
                return newJson;
            }
            static intersect(json1, json2) {
                if (E(json1) || E(json2))
                    return json1;
                let newJson = {};
                this.forEach(json1, (v, k) => {
                    if (json2.hasOwnProperty(k))
                        newJson[k] = v;
                });
                return newJson;
            }
            static filter(json, fn) {
                let newJson = {};
                this.forEach(json, (v, k) => {
                    if (fn.apply(json, [v, k]))
                        newJson[k] = v;
                });
                return newJson;
            }
            static find(data, path) {
                if (!path)
                    return data;
                const array = path.split('.');
                if (array.length == 1)
                    return data[path];
                let v = data;
                array.forEach((a) => {
                    if (v && a)
                        v = v[a];
                });
                return v;
            }
        }
        util.Jsons = Jsons;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Jsons = JS.util.Jsons;
(function () {
    var AP = Array.prototype;
    AP.add = function (obj, from) {
        let m = this;
        if (obj == void 0)
            return m;
        let a = obj instanceof Array ? obj : [obj], i = from == void 0 ? m.length : (from < 0 ? 0 : from);
        AP.splice.apply(m, [i, 0].concat(a));
        return m;
    };
    AP.remove = function (f) {
        let i = typeof f === 'number' ? f : this.findIndex(f);
        if (i < 0 || i >= this.length)
            return false;
        this.splice(i, 1);
        return true;
    };
}());
var JS;
(function (JS) {
    let util;
    (function (util) {
        let E = util.Check.isEmpty, AS = Array.prototype.slice;
        class Arrays {
            static newArray(a, from) {
                return a == void 0 ? [] : AS.apply(a, [from == void 0 ? 0 : from]);
            }
            static toArray(a) {
                return a == void 0 ? [] : (util.Types.isArray(a) ? a : [a]);
            }
            static equal(a1, a2, equal) {
                if (a1 === a2)
                    return true;
                let y1 = E(a1), y2 = E(a2);
                if (y1 && y2)
                    return true;
                if (y1 !== y2)
                    return false;
                if (a1.length != a2.length)
                    return false;
                return a1.every((item1, i) => {
                    return equal ? equal(item1, a2[i], i) : item1 === a2[i];
                });
            }
            static equalToString(a1, a2) {
                if (a1 === a2)
                    return true;
                if (a1 == void 0 && a2 == void 0)
                    return true;
                if (!a1 || !a2)
                    return false;
                if (a1.length != a2.length)
                    return false;
                return a1.toString() == a2.toString();
            }
            static same(a1, a2) {
                if (a1 === a2 || (E(a1) && E(a2)))
                    return true;
                if (a1.length != a2.length)
                    return false;
                let na = this.newArray(a2);
                a1.forEach(item1 => {
                    na.remove((v) => {
                        return v == item1;
                    });
                });
                return na.length == 0;
            }
            static slice(args, fromIndex, endIndex) {
                return AS.apply(args, [fromIndex || 0, endIndex || args.length]);
            }
        }
        util.Arrays = Arrays;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Arrays = JS.util.Arrays;
var JS;
(function (JS) {
    let util;
    (function (util) {
        class Functions {
            static call(fb) {
                let isFn = util.Types.isFunction(fb), fn = isFn ? fb : fb.fn, ctx = isFn ? undefined : fb.ctx, args = isFn ? undefined : fb.args;
                return fn.apply(ctx, args);
            }
            static execute(code, ctx, argsExpression, args) {
                let argsList = argsExpression || '';
                return Function.constructor.apply(null, argsList.split(',').concat([code])).apply(ctx, util.Arrays.newArray(args));
            }
        }
        util.Functions = Functions;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Functions = JS.util.Functions;
var JS;
(function (JS) {
    let util;
    (function (util) {
        class Strings {
            static padStart(text, maxLength, fill) {
                let s = text || '';
                if (s.length >= maxLength)
                    return s;
                let fs = fill ? fill : ' ';
                for (let i = 0; i < maxLength; i++) {
                    let tmp = fs + s, d = tmp.length - maxLength;
                    if (d < 0) {
                        s = tmp;
                    }
                    else {
                        s = fs.substr(0, fs.length - d) + s;
                        break;
                    }
                }
                return s;
            }
            static padEnd(text, maxLength, fill) {
                let s = text || '';
                if (s.length >= maxLength)
                    return s;
                let fs = fill ? fill : ' ';
                for (let i = 0; i < maxLength; i++) {
                    let tmp = s + fs, d = tmp.length - maxLength;
                    if (d < 0) {
                        s = tmp;
                    }
                    else {
                        s += fs.substr(0, fs.length - d);
                        break;
                    }
                }
                return s;
            }
            static nodeHTML(nodeType, attrs, text) {
                let a = '';
                if (attrs)
                    util.Jsons.forEach(attrs, (v, k) => {
                        if (v != void 0) {
                            if (util.Types.isBoolean(v)) {
                                if (v === true)
                                    a += ` ${k}`;
                            }
                            else {
                                a += ` ${k}="${v || ''}"`;
                            }
                        }
                    });
                return `<${nodeType}${a}>${text || ''}</${nodeType}>`;
            }
            static escapeHTML(html) {
                if (!html)
                    return '';
                let chars = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;',
                    '/': '&#x2F;',
                    '`': '&#x60;',
                    '=': '&#x3D;'
                };
                return html.replace(/[&<>"'`=\/]/g, function (s) {
                    return chars[s];
                });
            }
            static format(tpl, ...data) {
                if (!tpl)
                    return tpl;
                let i = 0;
                data = data || [];
                return tpl.replace(/\%(%|s|b|d|f|n)/gm, (s, ...args) => {
                    let v = i >= data.length ? '' : data[i++];
                    switch (args[0]) {
                        case 'b': {
                            v = Boolean(v).toString();
                            break;
                        }
                        case 'd': {
                            v = Number(v).toInt().toString();
                            break;
                        }
                        case 'f': {
                            v = Number(v).stringify();
                            break;
                        }
                        case 'n': {
                            v = '\n';
                            break;
                        }
                        case '%': {
                            v = '%';
                        }
                    }
                    return v;
                });
            }
            static merge(tpl, data) {
                if (!tpl || !data)
                    return tpl;
                return tpl.replace(/\{(\w+)\}/g, (str, ...args) => {
                    let m = args[0], s = data[m];
                    return s === undefined ? str : (util.Types.isFunction(s) ? s(data, str, m) : (s == null ? '' : String(s)));
                });
            }
        }
        util.Strings = Strings;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Strings = JS.util.Strings;
Promise.prototype.always = function (fn) {
    return this.then((t1) => {
        return fn.call(this, t1, true);
    }).catch((t2) => {
        return fn.call(this, t2, false);
    });
};
var JS;
(function (JS) {
    let util;
    (function (util) {
        class Promises {
            static create(fn, ...args) {
                return new Promise((resolve, reject) => {
                    fn.apply({
                        resolve: resolve,
                        reject: reject
                    }, util.Arrays.newArray(arguments, 1));
                });
            }
            static createPlan(fn) {
                return function () {
                    return Promises.create.apply(Promises, [fn].concat(Array.prototype.slice.apply(arguments)));
                };
            }
            static newPlan(p, args, ctx) {
                return () => { return p.apply(ctx || p, args); };
            }
            static resolvePlan(v) {
                return () => { return Promise.resolve(v); };
            }
            static rejectPlan(v) {
                return () => { return Promise.reject(v); };
            }
            static order(plans) {
                var seq = Promise.resolve();
                plans.forEach(plan => {
                    seq = seq.then(plan);
                });
                return seq;
            }
            static all(plans) {
                var rst = [];
                plans.forEach(task => {
                    rst.push(task());
                });
                return Promise.all(rst);
            }
            static race(plans) {
                var rst = [];
                plans.forEach(task => {
                    rst.push(task());
                });
                return Promise.race(rst);
            }
        }
        util.Promises = Promises;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Promises = JS.util.Promises;
var JS;
(function (JS) {
    let util;
    (function (util) {
        let Y = util.Types, J = util.Jsons, ACCEPTS = {
            '*': '*/*',
            text: 'text/plain',
            html: 'text/html',
            xml: 'application/xml, text/xml',
            json: 'application/json, text/javascript',
            script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
        }, _judgeType = (cType) => {
            if (!cType)
                return 'json';
            if (cType == ACCEPTS['text'])
                return 'text';
            if (cType == ACCEPTS['html'])
                return 'html';
            if (cType.indexOf('/xml') > 0)
                return 'xml';
            return 'json';
        }, PARSERS = {
            html: (str) => {
                if (!str)
                    return null;
                return new DOMParser().parseFromString(str, 'text/html');
            },
            xml: (str) => {
                if (!str)
                    return null;
                let xml = new DOMParser().parseFromString(str, 'text/xml');
                if (!xml || xml.getElementsByTagName("parsererror").length)
                    throw new NotHandledError();
                return xml;
            },
            text: (str) => {
                return str;
            }
        }, _headers = function (xhr) {
            let headers = {}, hString = xhr.getAllResponseHeaders(), hRegexp = /([^\s]*?):[ \t]*([^\r\n]*)/mg, match = null;
            while ((match = hRegexp.exec(hString))) {
                headers[match[1]] = match[2];
            }
            return headers;
        }, _response = function (req, xhr, error) {
            let type = req.type, headers = _headers(xhr);
            if (!type && xhr.status > 0)
                type = _judgeType(headers['Content-Type']);
            return {
                request: req,
                url: xhr.responseURL,
                raw: xhr.response,
                type: req.type,
                data: xhr.response,
                status: xhr.status,
                statusText: error || (xhr.status == 0 ? 'error' : xhr.statusText),
                headers: headers,
                xhr: xhr
            };
        }, _parseResponse = function (res, req, xhr) {
            try {
                let raw = xhr.response, parser = req.parsers && req.parsers[res.type] || PARSERS[res.type];
                if (req.responseFilter)
                    raw = req.responseFilter(raw, res.type);
                res.data = parser ? parser(raw) : raw;
            }
            catch (e) {
                res.statusText = 'parseerror';
                if (req.onError)
                    req.onError(res);
                if (Ajax._ON['error'])
                    Ajax._ON['error'](res);
                this.reject(res);
            }
        }, _rejectError = function (req, xhr, error) {
            let res = _response(req, xhr, error);
            if (req.onError)
                req.onError(res);
            if (Ajax._ON['error'])
                Ajax._ON['error'](res);
            this.reject(res);
        }, CACHE = {
            lastModified: {},
            etag: {}
        }, _done = function (uncacheURL, req, xhr) {
            if (xhr['_isTimeout'])
                return;
            let status = xhr.status, res = _response(req, xhr);
            if (req.onCompleted)
                req.onCompleted(res);
            if (Ajax._ON['completed'])
                Ajax._ON['completed'](res);
            if (status >= 200 && status < 300 || status === 304) {
                let modified = null;
                if (req.ifModified) {
                    modified = xhr.getResponseHeader('Last-Modified');
                    if (modified)
                        CACHE.lastModified[uncacheURL] = modified;
                    modified = xhr.getResponseHeader('etag');
                    if (modified)
                        CACHE.etag[uncacheURL] = modified;
                }
                if (status === 204 || req.method === "HEAD") {
                    res.statusText = 'nocontent';
                }
                else if (status === 304) {
                    res.statusText = 'notmodified';
                }
                _parseResponse.call(this, res, req, xhr);
                this.resolve(res);
            }
            else {
                this.reject(res);
            }
        }, _queryString = function (data) {
            if (Y.isString(data))
                return encodeURI(data);
            let str = '';
            J.forEach(data, (v, k) => {
                str += `&${k}=${encodeURIComponent(v)}`;
            });
            return str;
        }, _queryURL = (req) => {
            let url = req.url.replace(/^\/\//, location.protocol + '//');
            if (!util.Check.isEmpty(req.data))
                url = `${url}${url.indexOf('?') < 0 ? '?' : ''}${_queryString(req.data)}`;
            return url;
        }, _uncacheURL = (url, cache) => {
            url = url.replace(/([?&])_=[^&]*/, '$1');
            if (!cache)
                url = `${url}${url.indexOf('?') < 0 ? '?' : '&'}_=${Date.now()}`;
            return url;
        }, _sending = function (fn, req) {
            if (fn) {
                if (fn(req) === false)
                    return false;
            }
            return true;
        }, _send = function (req) {
            if (!req.url)
                JSLogger.error('Sent an ajax request without URL.');
            req = J.union({
                method: 'GET',
                crossCookie: false,
                async: true,
                type: 'text',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                cache: true
            }, req);
            let xhr = new XMLHttpRequest(), queryURL = _queryURL(req), url = _uncacheURL(queryURL, req.cache), headers = req.headers || {};
            xhr.open(req.method, url, req.async, req.username, req.password);
            xhr.setRequestHeader('Accept', req.type && ACCEPTS[req.type] ? ACCEPTS[req.type] + ',' + ACCEPTS['*'] + ';q=0.01' : ACCEPTS['*']);
            if (req.data && req.contentType)
                xhr.setRequestHeader('Content-Type', req.contentType);
            if (!headers['X-Requested-With'])
                headers['X-Requested-With'] = "XMLHttpRequest";
            if (req.mimeType && xhr.overrideMimeType)
                xhr.overrideMimeType(req.mimeType);
            if (req.ifModified) {
                if (CACHE.lastModified[queryURL])
                    xhr.setRequestHeader('If-Modified-Since', CACHE.lastModified[queryURL]);
                if (CACHE.etag[queryURL])
                    xhr.setRequestHeader('If-None-Match', CACHE.etag[queryURL]);
            }
            for (let h in headers)
                xhr.setRequestHeader(h, headers[h]);
            xhr.onerror = (e) => {
                _rejectError.call(this, req, xhr, 'error');
            };
            xhr.onabort = () => { _rejectError.call(this, req, xhr, xhr['_isTimeout'] ? 'timeout' : 'abort'); };
            xhr.withCredentials = req.crossCookie;
            if (req.async) {
                xhr.responseType = (req.type == 'html' || req.type == 'xml') ? 'document' : req.type;
                xhr.timeout = req.timeout || 0;
                xhr.ontimeout = () => {
                    _rejectError.call(this, req, xhr, 'timeout');
                };
                xhr.onreadystatechange = () => {
                    if (xhr.readyState == 4 && xhr.status > 0)
                        _done.call(this, queryURL, req, xhr);
                };
            }
            let rst = _sending(Ajax._ON['sending'], req);
            if (rst === false) {
                _rejectError.call(this, req, xhr, 'cancel');
                return;
            }
            rst = _sending(req.onSending, req);
            if (rst === false) {
                _rejectError.call(this, req, xhr, 'cancel');
                return;
            }
            let data = req.method == 'HEAD' || req.method == 'GET' ? null : (Y.isString(req.data) ? req.data : J.stringify(req.data));
            try {
                if (req.async && req.timeout > 0) {
                    var timer = self.setTimeout(function () {
                        xhr['_isTimeout'] = true;
                        xhr.abort();
                        self.clearTimeout(timer);
                    }, req.timeout);
                }
                xhr.send(data);
            }
            catch (e) {
                _rejectError.call(this, req, xhr, 'error');
            }
            if (!req.async && xhr.status > 0)
                _done.call(this, queryURL, req, xhr);
        };
        class Ajax {
            static _toQuery(q) {
                if (!q)
                    return {};
                return Y.isString(q) ? util.URI.parseQueryString(q) : q;
            }
            static toRequest(quy, data) {
                let req = Y.isString(quy) ? { url: quy } : quy;
                if (quy && data)
                    req.data = J.union(this._toQuery(req.data), this._toQuery(data));
                return req;
            }
            static send(req) {
                let q = this.toRequest(req);
                return q.thread ? this._inThread(req) : this._inMain(req);
            }
            static _inMain(req) {
                return util.Promises.create(function () {
                    _send.call(this, req);
                });
            }
            static get(req) {
                let r = Y.isString(req) ? { url: req } : req;
                r.method = 'GET';
                return this.send(r);
            }
            static post(req) {
                let r = Y.isString(req) ? { url: req } : req;
                r.method = 'POST';
                return this.send(r);
            }
            static on(ev, fn) {
                this._ON[ev] = fn;
            }
            static sendBeacon(e, fn, scope) {
                window.addEventListener('unload', scope ? fn : function (e) { fn.call(scope, e); }, false);
            }
            static _inThread(req) {
                let r = this.toRequest(req);
                r.url = util.URI.toAbsoluteURL(r.url);
                return util.Promises.create(function () {
                    let ctx = this;
                    new Thread({
                        run: function () {
                            this.onposted((request) => {
                                self.Ajax._inMain(request).then((res) => {
                                    delete res.xhr;
                                    this.postMain(res);
                                });
                            });
                        }
                    }, typeof r.thread === 'boolean' ? null : r.thread).on('message', function (e, res) {
                        ctx.resolve(res);
                        this.terminate();
                    }).start().postThread(r);
                });
            }
        }
        Ajax._ON = {};
        util.Ajax = Ajax;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Ajax = JS.util.Ajax;
var JS;
(function (JS) {
    let util;
    (function (util) {
        let EUID = 1, E = util.Check.isEmpty;
        class EventBus {
            constructor(context) {
                this._isD = false;
                this._map = new Map();
                this._ctx = util.Jsons.clone(context);
            }
            context(ctx) {
                if (arguments.length == 0)
                    return this._ctx;
                this._ctx = ctx;
            }
            destroy() {
                this.off();
                this._ctx = null;
                this._isD = true;
            }
            isDestroyed() {
                return this._isD;
            }
            _add(type, h) {
                let fns = this._map.get(type) || [];
                fns[fns.length] = h;
                this._map.set(type, fns);
            }
            _remove(type, h) {
                if (!h) {
                    this._map.set(type, []);
                }
                else {
                    let fns = this._map.get(type);
                    if (!E(fns)) {
                        fns.remove(fn => {
                            return fn['euid'] === h['euid'];
                        });
                        this._map.set(type, fns);
                    }
                }
            }
            _removeByEuid(type, euid) {
                let fns = this._map.get(type);
                if (!E(fns)) {
                    fns.remove(fn => {
                        return fn['euid'] === euid;
                    });
                    this._map.set(type, fns);
                }
            }
            _euid(h, one, type) {
                let me = this, euid = h['euid'] || EUID++, fn = function () {
                    if (one)
                        me._removeByEuid(type, euid);
                    return h.apply(this, arguments);
                };
                fn['euid'] = h['euid'] = euid;
                return fn;
            }
            on(types, handler, once) {
                if (this.isDestroyed())
                    return false;
                types.split(' ').forEach((tp) => {
                    this._add(tp, this._euid(handler, once, tp));
                });
                return true;
            }
            original(type, euid) {
                let fns = this._map.get(type);
                if (arguments.length >= 1) {
                    if (!E(fns)) {
                        let i = fns.findIndex(fn => {
                            return fn['euid'] === euid;
                        });
                        if (i > -1)
                            return fns[i];
                    }
                    return null;
                }
                return fns || null;
            }
            types() {
                return Array.from(this._map.keys());
            }
            off(types, handler) {
                if (this.isDestroyed())
                    return false;
                if (types) {
                    types.split(' ').forEach((tp) => {
                        this._remove(tp, handler);
                    });
                }
                else {
                    this._map.clear();
                }
                return true;
            }
            _call(e, fn, args, that) {
                let evt = e['originalEvent'] ? e['originalEvent'] : e, arr = [evt];
                if (args && args.length > 0)
                    arr = arr.concat(args);
                let rst = fn.apply(that || this._ctx, arr);
                if (rst === false) {
                    evt.stopPropagation();
                    evt.preventDefault();
                }
            }
            fire(e, args, that) {
                let is = util.Types.isString(e), fns = this._map.get(is ? e : e.type);
                if (!E(fns)) {
                    let evt = is ? new CustomEvent(e) : e;
                    fns.forEach(fn => { this._call(evt, fn, args, that); });
                }
            }
        }
        util.EventBus = EventBus;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var EventBus = JS.util.EventBus;
if (self['HTMLElement'])
    (function () {
        const D = document, HP = HTMLElement.prototype, oa = HP.append, op = HP.prepend, _ad = function (html) {
            if (!html)
                return;
            let div = D.createElement('div'), nodes = null, fg = D.createDocumentFragment();
            div.innerHTML = html;
            nodes = div.childNodes;
            for (let i = 0, len = nodes.length; i < len; i++) {
                fg.appendChild(nodes[i].cloneNode(true));
            }
            this.appendChild(fg);
            nodes = null;
            fg = null;
        }, _pd = function (html) {
            if (!html)
                return;
            let div = D.createElement('div'), nodes = null, fg = D.createDocumentFragment();
            div.innerHTML = html;
            nodes = div.childNodes;
            for (let i = 0, len = nodes.length; i < len; i++) {
                fg.appendChild(nodes[i].cloneNode(true));
            }
            this.insertBefore(fg, this.firstChild);
            nodes = null;
            fg = null;
        };
        HP.append = function (...nodes) {
            nodes.forEach(n => {
                typeof n == 'string' ? _ad.call(this, n) : oa.call(this, n.cloneNode(true));
            });
        };
        HP.prepend = function (...nodes) {
            nodes.forEach(n => {
                typeof n == 'string' ? _pd.call(this, n) : op.call(this, n.cloneNode(true));
            });
        };
        HP.box = function () {
            let box = this.getBoundingClientRect();
            return {
                x: box.x + System.display().docScrollX,
                y: box.x + System.display().docScrollY,
                w: box.width,
                h: box.height
            };
        };
        HP.attr = function (key, val) {
            if (arguments.length == 1)
                return this.getAttribute(key);
            this.setAttribute(key, val);
            return this;
        };
        let _on = function (type, fn, opts) {
            if (!this['_bus'])
                this['_bus'] = new EventBus(this);
            let bus = this['_bus'], cb = e => {
                bus.fire(e);
            }, once = (opts && opts['once']) ? true : false;
            bus.on(type, fn, once);
            if (this.addEventListener)
                this.addEventListener(type, cb, opts);
        };
        HP.on = function (type, fn, opts) {
            let types = type.split(' ');
            types.forEach(t => {
                _on.call(this, t, fn, opts);
            });
            return this;
        };
        let _rm = function (type, fn) {
            if (!fn)
                return;
            if (this.removeEventListener) {
                this.removeEventListener(type, fn, true);
                this.removeEventListener(type, fn, false);
            }
        }, _rms = function (type, fns) {
            if (fns)
                fns.forEach(f => { _rm.call(this, type, f); });
        }, _off = function (type, fn) {
            let bus = this['_bus'];
            if (bus) {
                let oFn = fn ? bus.original(type, fn['euid']) : undefined;
                bus.off(type, oFn);
                _rm.call(this, type, oFn);
            }
            else {
                _rm.call(this, type, fn);
            }
        };
        HP.off = function (type, fn) {
            if (!type) {
                let bus = this['_bus'];
                if (bus) {
                    let types = bus.types();
                    for (let i = 0, len = types.length; i < len; i++) {
                        let ty = types[i];
                        _rms.call(this, ty, bus.original(ty));
                    }
                    bus.off();
                }
            }
            else {
                let types = type.split(' ');
                types.forEach(t => {
                    _off.call(this, t, fn);
                });
            }
            return this;
        };
        HP.find = HP.querySelector;
        HP.findAll = HP.querySelectorAll;
        HP.computedStyle = function (p) {
            return document.defaultView.getComputedStyle(this, p || null);
        };
        let DP = Document.prototype;
        DP.on = HP.addEventListener;
        DP.off = HP.removeEventListener;
        let WP = Window.prototype;
        WP.on = HP.addEventListener;
        WP.off = HP.removeEventListener;
    })();
var JS;
(function (JS) {
    let util;
    (function (util) {
        let D, _head = () => { return D.querySelector('head'); }, _uncached = (url) => {
            return `${url}${url.indexOf('?') < 0 ? '?' : '&'}_=${new Date().getTime()}`;
        };
        if (self['HTMLElement'])
            D = document;
        class Dom {
            static $1(selector) {
                return typeof selector == 'string' ? D.querySelector(selector) : selector;
            }
            static $L(selector) {
                return D.querySelectorAll(selector);
            }
            static rename(node, newTagName) {
                let newNode = D.createElement(newTagName), aNames = node['getAttributeNames']();
                if (aNames)
                    aNames.forEach(name => {
                        newNode.setAttribute(name, node.getAttribute(name));
                    });
                newNode.append.apply(newNode, node.childNodes);
                node.parentNode.replaceChild(newNode, node);
            }
            static applyStyle(code, id) {
                if (!code)
                    return;
                this.$1('head').append(`<style${id ? ' id="' + id + '"' : ''}>${code}</style>`);
            }
            static applyHtml(html, appendTo, ignore) {
                if (!html)
                    return Promise.reject(null);
                return util.Promises.create(function () {
                    let doc = typeof html == 'string' ? new DOMParser().parseFromString(html, 'text/html') : html, url = doc.URL, el = Dom.$1(appendTo || D.body);
                    el.append.apply(el, doc.body.childNodes);
                    el = null;
                    let ignoreCss = ignore === true || (ignore && ignore.css) ? true : false;
                    if (!ignoreCss) {
                        let cssFiles = doc.querySelectorAll('link[rel=stylesheet]');
                        if (cssFiles) {
                            for (let i = 0, len = cssFiles.length; i < len; i++) {
                                let css = cssFiles[i], href = css.getAttribute('href');
                                if (href)
                                    Dom.loadCSS(href, true);
                            }
                        }
                        let styles = doc.querySelectorAll('style');
                        if (styles) {
                            for (let i = 0, len = styles.length; i < len; i++) {
                                Dom.applyStyle(styles[i].textContent);
                            }
                        }
                    }
                    let ignoreScript = ignore === true || (ignore && ignore.script) ? true : false;
                    if (!ignoreScript) {
                        let scs = doc.getElementsByTagName('script'), syncs = [], back = () => {
                            syncs = null;
                            scs = null;
                            if (typeof html == 'string')
                                doc = null;
                            this.resolve(url);
                        };
                        if (scs && scs.length > 0) {
                            for (let i = 0, len = scs.length; i < len; i++) {
                                let sc = scs[i];
                                sc.src ? (sc.async ? Dom.loadJS(sc.src, true) : syncs.push(Dom.loadJS(sc.src, false))) : eval(sc.text);
                            }
                            util.Promises.order(syncs).then(() => {
                                back();
                            }).catch((u) => {
                                JSLogger.error('Load inner script error in loading html!\nscript url=' + u + '\nhtml url=' + url);
                                back();
                            });
                        }
                        else {
                            back();
                        }
                    }
                    else {
                        if (typeof html == 'string')
                            doc = null;
                        this.resolve(url);
                    }
                });
            }
            static loadCSS(url, async = false, uncached) {
                if (!url)
                    return Promise.reject(null);
                return util.Promises.create(function () {
                    let k = D.createElement('link'), back = () => {
                        k.onload = k.onerror = k['onreadystatechange'] = null;
                        k = null;
                        this.resolve(url);
                    };
                    k.type = 'text/css';
                    k.rel = 'stylesheet';
                    if (!async) {
                        k['onreadystatechange'] = () => {
                            if (k['readyState'] == 'loaded' || k['readyState'] == 'complete')
                                back();
                        };
                        k.onload = k.onerror = back;
                    }
                    k.href = uncached ? _uncached(url) : url;
                    _head().appendChild(k);
                    if (async)
                        back();
                });
            }
            static loadJS(url, async = false, uncached) {
                if (!url)
                    return Promise.reject(null);
                return util.Promises.create(function () {
                    let s = D.createElement('script'), back = () => {
                        s.onload = s.onerror = s['onreadystatechange'] = null;
                        s = null;
                        this.resolve(url);
                    };
                    s.type = 'text/javascript';
                    s.async = async;
                    if (!async) {
                        s['onreadystatechange'] = () => {
                            if (s['readyState'] == 'loaded' || s['readyState'] == 'complete')
                                back();
                        };
                        s.onload = s.onerror = back;
                    }
                    s.src = uncached ? _uncached(url) : url;
                    _head().appendChild(s);
                    if (async)
                        back();
                });
            }
            static loadHTML(url, async, appendTo, ignore, preHandler) {
                if (!url)
                    return Promise.reject(null);
                return util.Promises.create(function () {
                    util.Ajax.get({
                        type: 'html',
                        url: url,
                        cache: false,
                        async: async
                    }).then((res) => {
                        Dom.applyHtml(preHandler ? preHandler(res.data) : res.data, appendTo, ignore).then(() => {
                            this.resolve(url);
                        });
                    });
                });
            }
        }
        util.Dom = Dom;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Dom = JS.util.Dom;
const $1 = Dom.$1;
const $L = Dom.$L;
var JS;
(function (JS) {
    JS.version = '2.4.0';
    function config(d, v) {
        let l = arguments.length;
        if (l == 0)
            return _cfg;
        if (!d)
            return;
        if (typeof d === 'string') {
            if (l == 1) {
                return _cfg[d];
            }
            else {
                _cfg[d] = v;
                return;
            }
        }
        else {
            for (let k in d) {
                if (d.hasOwnProperty(k))
                    _cfg[k] = d[k];
            }
        }
    }
    JS.config = config;
    let _cfg = {}, _ldd = {}, _ts = (uri) => {
        return JS.config('cachedImport') ? uri : (uri.indexOf('?') > 0 ? `${uri}&_=${Date.now()}` : `${uri}?_=${Date.now()}`);
    }, _min = (uri, type) => {
        if (JS.config('minImport')) {
            if (uri.endsWith('.min.' + type))
                return uri;
            if (uri.endsWith('.' + type))
                return uri.slice(0, uri.length - type.length - 1) + '.min.' + type;
        }
        else
            return uri;
    }, _impLib = (lib) => {
        let async = lib.endsWith('#async'), libName = async ? lib.slice(0, lib.length - 6) : lib, paths = JS.config('libs')[libName];
        if (paths) {
            let ps = typeof paths == 'string' ? [paths] : paths, tasks = [];
            ps.forEach(path => {
                if (path.startsWith('$')) {
                    tasks.push(_impLib(path.slice(1)));
                }
                else {
                    tasks.push(_impFile(path + (async ? '#async' : '')));
                }
            });
            return Promises.newPlan(Promises.order, [tasks]);
        }
        else {
            console.error('Not found the <' + libName + '> library in JSDK settings.');
            return Promises.resolvePlan(null);
        }
    }, _impFile = (url) => {
        let u = url;
        if (url.startsWith('!')) {
            let jr = JS.config('jsdkRoot');
            jr = jr ? jr : (JS.config('libRoot') + '/jsdk/' + JS.version);
            u = jr + url.slice(1);
        }
        else if (url.startsWith('~')) {
            u = JS.config('libRoot') + url.slice(1);
        }
        let us = u.split('#'), len = us.length, u0 = us[0], ayc = len > 1 && us[1] == 'async';
        if (_ldd[u0])
            return Promises.resolvePlan(null);
        _ldd[u0] = 1;
        if (u0.endsWith('.js')) {
            return Promises.newPlan(Dom.loadJS, [_ts(_min(u0, 'js')), ayc]);
        }
        else if (u0.endsWith('.css')) {
            return Promises.newPlan(Dom.loadCSS, [_ts(_min(u0, 'css')), ayc]);
        }
        else {
            return Promises.newPlan(Dom.loadHTML, [_ts(u0), ayc]);
        }
    };
    function imports(url) {
        if (JS.config('closeImport'))
            return Promise.resolve();
        let uris = typeof url === 'string' ? [url] : url, tasks = [];
        uris.forEach(uri => {
            tasks.push(uri.startsWith('$') ? _impLib(uri.slice(1)) : _impFile(uri));
        });
        return Promises.order(tasks);
    }
    JS.imports = imports;
})(JS || (JS = {}));
var JS;
(function (JS) {
    let util;
    (function (util) {
        class Konsole {
            static clear() {
                console.clear();
            }
            static count(label) {
                console.count(label);
            }
            static countReset(label) {
                console.countReset(label);
            }
            static time(label) {
                console.time(label);
            }
            static timeEnd(label) {
                console.timeEnd(label);
            }
            static trace(data, css) {
                if (!data)
                    console.trace();
                let arr = [data];
                if (typeof data == 'string' && css)
                    arr[arr.length] = css;
                console.trace.apply(null, arr);
            }
            static text(data, css) {
                typeof css ? console.log('%c' + data, css) : console.log(data);
            }
            static _print(d) {
                typeof d == 'string' ? console.log(d) : console.dirxml(d);
            }
            static print(...data) {
                data.forEach(d => {
                    this._print(d);
                });
            }
        }
        util.Konsole = Konsole;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Konsole = JS.util.Konsole;
var JS;
(function (JS) {
    let util;
    (function (util) {
        let LogLevel;
        (function (LogLevel) {
            LogLevel[LogLevel["ALL"] = 6] = "ALL";
            LogLevel[LogLevel["TRACE"] = 5] = "TRACE";
            LogLevel[LogLevel["DEBUG"] = 4] = "DEBUG";
            LogLevel[LogLevel["INFO"] = 3] = "INFO";
            LogLevel[LogLevel["WARN"] = 2] = "WARN";
            LogLevel[LogLevel["ERROR"] = 1] = "ERROR";
            LogLevel[LogLevel["OFF"] = 0] = "OFF";
        })(LogLevel = util.LogLevel || (util.LogLevel = {}));
        let LEVELS = ['OFF', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE', 'ALL'], STYLES = [
            '',
            'color:red;background-color:#fff0f0;',
            'color:orange;background-color:#fffbe6;',
            'color:black;background-color:white;',
            'color:white;background-color:gray;',
            'color:white;background-color:black;',
            ''
        ];
        class ConsoleAppender {
            constructor(name) {
                this.name = '';
                this.name = name;
            }
            log(level, ...data) {
                this._log(LEVELS[level], STYLES[level], data);
            }
            _log(cmd, css, data) {
                console.group(`%c${cmd} ${this.name ? '[' + this.name + '] ' : ''}${new Date().toISOString()}`, css);
                if (data)
                    data.forEach(a => {
                        cmd != 'INFO' && cmd != 'WARN' ? util.Konsole.trace(a) : util.Konsole.print(a);
                    });
                console.groupEnd();
            }
        }
        util.ConsoleAppender = ConsoleAppender;
        class Log {
            constructor(name, level, appender) {
                this._appender = !appender ? new ConsoleAppender(name) : Class.newInstance(appender, name);
                this.level = level || LogLevel.ALL;
                this._name = name;
            }
            name() {
                return this._name;
            }
            _log(level, data) {
                if (level <= this.level) {
                    this._appender.log.apply(this._appender, [level].concat(data));
                }
            }
            trace(...data) {
                this._log(LogLevel.TRACE, data);
            }
            debug(...data) {
                this._log(LogLevel.DEBUG, data);
            }
            info(...data) {
                this._log(LogLevel.INFO, data);
            }
            warn(...data) {
                this._log(LogLevel.WARN, data);
            }
            error(...data) {
                this._log(LogLevel.ERROR, data);
            }
            clear() {
                this._appender.clear();
            }
        }
        util.Log = Log;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var LogLevel = JS.util.LogLevel;
var Log = JS.util.Log;
let JSLogger = new Log(`JSDK ${JS.version}`, LogLevel.INFO);
Konsole.text(`Powered by JSDK ${JS.version}`, 'font-weight:bold;');
var JS;
(function (JS) {
    let lang;
    (function (lang) {
        let Y = Types, R = Reflect;
        let AnnotationTarget;
        (function (AnnotationTarget) {
            AnnotationTarget[AnnotationTarget["ANY"] = 1] = "ANY";
            AnnotationTarget[AnnotationTarget["CLASS"] = 2] = "CLASS";
            AnnotationTarget[AnnotationTarget["FIELD"] = 4] = "FIELD";
            AnnotationTarget[AnnotationTarget["METHOD"] = 8] = "METHOD";
            AnnotationTarget[AnnotationTarget["PARAMETER"] = 16] = "PARAMETER";
        })(AnnotationTarget = lang.AnnotationTarget || (lang.AnnotationTarget = {}));
        class Annotation extends Function {
        }
        lang.Annotation = Annotation;
        class Annotations {
            static getPropertyType(obj, propertyKey) {
                return R.getMetadata('design:type', obj, propertyKey);
            }
            static getValue(anno, obj, propertyKey) {
                return R.getMetadata(anno.name, obj, propertyKey);
            }
            static setValue(annoName, metaValue, obj, propertyKey) {
                R.defineMetadata(typeof annoName == 'string' ? annoName : annoName.name, metaValue, obj, propertyKey);
            }
            static hasAnnotation(anno, obj, propertyKey) {
                return R.hasMetadata(anno.name, obj, propertyKey);
            }
            static getAnnotations(obj) {
                return R.getMetadataKeys(obj);
            }
            static define(definition, params) {
                let args = Arrays.newArray(params), isStr = Y.isString(definition), annoName = isStr ? definition : definition.name, handler = isStr ? null : definition.handler, target = (isStr ? AnnotationTarget.ANY : definition.target) || AnnotationTarget.ANY, fn = function (anno, values, obj, key, d) {
                    if (0 == (target & AnnotationTarget.ANY)) {
                        if (Y.equalKlass(obj)) {
                            if (0 == (target & AnnotationTarget.CLASS))
                                return _wrongTarget(anno, obj.name);
                        }
                        else if (key) {
                            if (Y.isFunction(obj[key])) {
                                if (0 == (target & AnnotationTarget.METHOD))
                                    return _wrongTarget(anno, obj.constructor.name, key, 'method');
                            }
                            else {
                                if (0 == (target & AnnotationTarget.FIELD))
                                    return _wrongTarget(anno, obj.constructor.name, key, 'field');
                            }
                        }
                    }
                    Annotations.setValue(anno, values, obj, key);
                    if (handler)
                        handler.apply(null, [anno, values, obj, key, d]);
                };
                if (Y.equalKlass(args[0])) {
                    let obj = args[0];
                    let detor = function (tar) {
                        fn.call(null, annoName, undefined, tar);
                    };
                    return R.decorate([detor], obj);
                }
                else if (args.length == 3 && args[0]['constructor']) {
                    let obj = args[0], key = args[1], desc = args[2];
                    let detor = function (tar, k) {
                        fn.call(null, annoName, undefined, tar, k, desc);
                    };
                    return R.decorate([detor], obj, key);
                }
                let values = args;
                return function (tar, key, d) {
                    fn.call(null, annoName, values, tar, key, d);
                };
            }
        }
        lang.Annotations = Annotations;
        var _wrongTarget = function (anno, klass, key, type) {
            JSLogger.error(key ?
                `A [${anno}] annotation should not be marked on the '${key}' ${type} of ${klass}.`
                :
                    `A [${anno}] annotation should not be marked on the '${klass}' class.`);
        };
        var _getClassName = function (klass) {
            let clazz = klass.class;
            return clazz ? clazz.name : klass.name;
        };
        function deprecated(info) {
            return Annotations.define({
                name: 'deprecated',
                handler: (anno, values, obj, propertyKey) => {
                    let info = values ? (values[0] || '') : '', text = null;
                    if (Y.equalKlass(obj)) {
                        let name = _getClassName(obj);
                        text = `The [${name}] class`;
                    }
                    else {
                        let klass = obj.constructor, name = _getClassName(klass);
                        text = `The [${propertyKey}] ${Y.isFunction(obj[propertyKey]) ? 'method' : 'field'} of ${name}`;
                    }
                    JSLogger.warn(text + ' has been deprecated. ' + info);
                }
            }, arguments);
        }
        lang.deprecated = deprecated;
        var _aop = function (args, fn, anno) {
            return Annotations.define({
                name: anno,
                handler: (anno, values, obj, methodName) => {
                    let adv = {};
                    if (Y.isFunction(values[0])) {
                        adv[anno] = values[0];
                    }
                    else {
                        adv = values[0];
                        if (!adv)
                            return;
                    }
                    Class.aop(obj.constructor, methodName, adv);
                },
                target: AnnotationTarget.METHOD
            }, args);
        };
        function before(fn) {
            return _aop(arguments, fn, 'before');
        }
        lang.before = before;
        function after(fn) {
            return _aop(arguments, fn, 'after');
        }
        lang.after = after;
        function around(fn) {
            return _aop(arguments, fn, 'around');
        }
        lang.around = around;
        function throws(fn) {
            return _aop(arguments, fn, 'throws');
        }
        lang.throws = throws;
    })(lang = JS.lang || (JS.lang = {}));
})(JS || (JS = {}));
var AnnotationTarget = JS.lang.AnnotationTarget;
var Annotation = JS.lang.Annotation;
var Annotations = JS.lang.Annotations;
var deprecated = JS.lang.deprecated;
var before = JS.lang.before;
var after = JS.lang.after;
var around = JS.lang.around;
var throws = JS.lang.throws;
var JS;
(function (JS) {
    let reflect;
    (function (reflect) {
        let Y = Types, J = Jsons;
        function klass(fullName) {
            return Annotations.define({
                name: 'klass',
                handler: (anno, values, obj) => {
                    Class.register(obj, values[0]);
                },
                target: AnnotationTarget.CLASS
            }, [fullName]);
        }
        reflect.klass = klass;
        class Method {
            constructor(clazz, name, isStatic, fn, paramTypes, returnType) {
                this.isStatic = false;
                this.annotations = [];
                this.parameterAnnotations = [];
                this.ownerClass = clazz;
                this.name = name;
                this.paramTypes = paramTypes;
                this.returnType = returnType;
                this.fn = fn;
                this.isStatic = isStatic;
            }
            invoke(obj, ...args) {
                let fn = this.isStatic ? this.ownerClass.getKlass() : this.fn, context = this.isStatic ? this.ownerClass.getKlass() : obj;
                return Reflect.apply(fn, context, args);
            }
        }
        reflect.Method = Method;
        class Field {
            constructor(clazz, name, isStatic, type) {
                this.isStatic = false;
                this.annotations = [];
                this.ownerClass = clazz;
                this.name = name;
                this.type = type;
                this.isStatic = isStatic;
            }
            set(value, obj) {
                let target = this.isStatic ? this.ownerClass.getKlass() : obj;
                target[this.name] = value;
            }
            get(obj) {
                let target = this.isStatic ? this.ownerClass.getKlass() : obj;
                return target[this.name];
            }
        }
        reflect.Field = Field;
        class Class {
            constructor(name, klass) {
                this._methods = {};
                this._fields = {};
                this.name = name;
                klass.class = this;
                this._klass = klass;
                this.shortName = this._klass.name;
                this._superklass = Class.getSuperklass(this._klass);
                this._init();
            }
            static getSuperklass(klass) {
                if (Object === klass)
                    return null;
                let sup = Object.getPrototypeOf(klass);
                return Object.getPrototypeOf(Object) === sup ? Object : sup;
            }
            static _reflectable(obj, className) {
                obj.className = className;
                if (!obj.getClass) {
                    obj.getClass = function () {
                        return Class.forName(this.className);
                    };
                }
            }
            static byName(name) {
                if (!name)
                    return null;
                var p = name.split('.'), len = p.length, p0 = p[0], b = window[p0] || eval(p0);
                if (!b)
                    throw new TypeError('Can\'t found class:' + name);
                for (var i = 1; i < len; i++) {
                    var pi = p[i];
                    if (!pi)
                        break;
                    b[pi] = b[pi] || {};
                    b = b[pi];
                }
                return b;
            }
            static newInstance(ctor, ...args) {
                let tar = Y.isString(ctor) ? Class.byName(ctor) : ctor;
                if (!tar)
                    throw new NotFoundError(`The class<${ctor}> is not found!`);
                return Reflect.construct(tar, J.clone(args));
            }
            static aliasInstance(alias, ...args) {
                let cls = Class.forName(alias, true);
                if (!cls)
                    throw new NotFoundError(`The class<${alias}> is not found!`);
                return cls.newInstance.apply(cls, args);
            }
            static aop(klass, method, advisor) {
                let isStatic = klass.hasOwnProperty(method), m = isStatic ? klass[method] : klass.prototype[method];
                if (!Y.isFunction(m))
                    return;
                let obj = isStatic ? klass : klass.prototype;
                if (!obj.hasOwnProperty('__' + method))
                    obj['__' + method] = m;
                Object.defineProperty(obj, method, {
                    value: m.aop(advisor),
                    writable: true
                });
            }
            static cancelAop(klass, method) {
                let isStatic = klass.hasOwnProperty(method), m = isStatic ? klass[method] : klass.prototype[method];
                if (!Y.isFunction(m))
                    return;
                let obj = isStatic ? klass : klass.prototype;
                obj[method] = obj['__' + method];
            }
            aop(method, advisor) {
                let m = this.method(method);
                if (!m)
                    return;
                let pro = m.isStatic ? this._klass : this._klass.prototype;
                pro[method] = m.fn.aop(advisor);
            }
            _cancelAop(m) {
                let pro = m.isStatic ? this._klass : this._klass.prototype;
                pro[m.name] = m.fn;
            }
            cancelAop(method) {
                let ms = method ? [this.method(method)] : this.methods();
                ms.forEach(m => {
                    this._cancelAop(m);
                });
            }
            equals(cls) {
                return cls && this.getKlass() === cls.getKlass();
            }
            equalsKlass(cls) {
                return cls && this.getKlass() === cls;
            }
            subclassOf(cls) {
                let klass = (cls.constructor && cls.constructor === Class) ? cls.getKlass() : cls;
                return Y.subKlass(this.getKlass(), klass);
            }
            newInstance(...args) {
                let obj = Reflect.construct(this._klass, Arrays.newArray(arguments));
                Class._reflectable(obj, this.name);
                return obj;
            }
            getSuperclass() {
                if (this === Object.class)
                    return null;
                return this._superklass ? this._superklass.class : Object.class;
            }
            getKlass() {
                return this._klass.prototype.constructor;
            }
            _parseStaticMembers(ctor) {
                let mKeys = ctor === Object ? ['class'] : Reflect.ownKeys(ctor);
                for (let i = 0, len = mKeys.length; i < len; i++) {
                    const key = mKeys[i].toString();
                    if (!this._isValidStatic(key))
                        continue;
                    const obj = ctor[key];
                    if (Y.isFunction(obj)) {
                        this._methods[key] = new Method(this, key, true, obj, null, null);
                    }
                    else {
                        this._fields[key] = new Field(this, key, true, Y.type(obj));
                    }
                }
            }
            _parseInstanceMembers(proto) {
                let protoKeys = proto === Object.prototype ? ['toString'] : Reflect.ownKeys(proto);
                for (let i = 0, len = protoKeys.length; i < len; i++) {
                    const key = protoKeys[i].toString();
                    if (!this._isValidInstance(key))
                        continue;
                    const obj = this._forceProto(proto, key);
                    if (Y.isFunction(obj)) {
                        this._methods[key] = new Method(this, key, false, obj, null, null);
                    }
                    else {
                        this._fields[key] = new Field(this, key, false, Y.type(obj));
                    }
                }
            }
            _forceProto(proto, key) {
                let rst;
                try {
                    rst = proto[key];
                }
                catch (e) {
                    if (this._klass === File) {
                        if (key == 'lastModified')
                            return 0;
                        if (key == 'lastModifiedDate')
                            return new Date();
                    }
                    try {
                        let obj = this.newInstance();
                        return obj[key];
                    }
                    catch (e1) {
                        return '';
                    }
                }
                return rst;
            }
            _isValidStatic(mName) {
                return ['prototype', 'name', 'length'].findIndex(v => {
                    return v == mName;
                }) < 0;
            }
            _isValidInstance(mName) {
                return !mName.startsWith('__') && mName != 'constructor';
            }
            _init() {
                this._parseStaticMembers(this._klass);
                this._parseInstanceMembers(this._klass.prototype);
            }
            _toArray(json) {
                let arr = [];
                J.forEach(json, v => {
                    arr[arr.length] = v;
                });
                return arr;
            }
            method(name) {
                return this.methodsMap()[name];
            }
            methodsMap() {
                return this._methods;
            }
            methods() {
                return this._toArray(this.methodsMap());
            }
            field(name, instance) {
                return this.fieldsMap(instance)[name];
            }
            _instanceFields(instance) {
                let fs = {}, keys = Reflect.ownKeys(instance);
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i].toString();
                    if (this._isValidInstance(key)) {
                        const obj = instance[key];
                        if (!Y.isFunction(obj))
                            fs[key] = new Field(this, key, false, Y.type(obj));
                    }
                }
                this._fields = J.union(fs, this._fields);
            }
            fieldsMap(instance, anno) {
                if (instance)
                    this._instanceFields(instance);
                let fs = {};
                if (anno && instance) {
                    J.forEach(this._fields, (field, key) => {
                        if (Annotations.hasAnnotation(anno, instance, key))
                            fs[key] = field;
                    });
                }
                else {
                    fs = this._fields;
                }
                return fs;
            }
            fields(instance, anno) {
                return this._toArray(this.fieldsMap(instance, anno));
            }
            static forName(name, isAlias) {
                if (!name)
                    return null;
                let isStr = Y.isString(name);
                if (!isStr && name.class)
                    return name.class;
                let classname = isStr ? name : name.name;
                return isAlias ? this._ALIAS_MAP[classname] : this._MAP[classname];
            }
            static all() {
                return this._MAP;
            }
            static register(klass, className, alias) {
                let name = className || klass.name, cls = this.forName(name);
                if (cls)
                    return;
                if (klass !== Object) {
                    var $P = klass.prototype;
                    $P.className = name;
                    $P.getClass = function () { return Class.forName(name); };
                }
                let cs = new Class(name, klass);
                this._MAP[name] = cs;
                if (alias)
                    this._ALIAS_MAP[alias] = cs;
            }
            static classesOf(ns) {
                if (!ns)
                    return null;
                if (ns.endsWith('.*'))
                    ns = ns.slice(0, ns.length - 2);
                let a = [];
                J.forEach(this._MAP, (cls, name) => {
                    if (name.startsWith(ns))
                        a.push(cls);
                });
                return a;
            }
        }
        Class._MAP = {};
        Class._ALIAS_MAP = {};
        reflect.Class = Class;
    })(reflect = JS.reflect || (JS.reflect = {}));
})(JS || (JS = {}));
var Method = JS.reflect.Method;
var Field = JS.reflect.Field;
var Class = JS.reflect.Class;
var klass = JS.reflect.klass;
Class.register(Object);
Class.register(String);
Class.register(Boolean);
Class.register(Number);
Class.register(Array);
(function () {
    let $F = Function.prototype;
    $F.aop = function (advisor, that) {
        let old = this, fn = function () {
            let args = Arrays.newArray(arguments), ctx = that || this, rst = undefined;
            if (advisor.before)
                advisor.before.apply(ctx, args);
            try {
                rst = advisor.around ? advisor.around.apply(ctx, [old].concat(args)) : old.apply(ctx, args);
            }
            catch (e) {
                if (advisor.throws)
                    advisor.throws.apply(ctx, [e]);
            }
            if (advisor.after)
                advisor.after.apply(ctx, [rst]);
            return rst;
        };
        return fn;
    };
    $F.mixin = function (kls, methodNames) {
        if (!kls)
            return;
        let kp = kls.prototype, tp = this.prototype, ms = Reflect.ownKeys(kp);
        for (let i = 0, len = ms.length; i < len; i++) {
            let m = ms[i];
            if ('constructor' != m && !tp[m]) {
                if (methodNames) {
                    if (methodNames.findIndex(v => { return v == m; }) > -1)
                        tp[m] = kp[m];
                }
                else {
                    tp[m] = kp[m];
                }
            }
        }
    };
})();
var __decorate = function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    if (key && r && typeof target[key] == 'function')
        delete r.value;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var JS;
(function (JS) {
    let util;
    (function (util) {
        let R = false, D = document, W = window;
        class Bom {
            static ready(fn) {
                if (R) {
                    fn();
                    return;
                }
                let callback = function () {
                    R = true;
                    fn();
                    callback = null;
                };
                let wc = W['HTMLImports'] && W['HTMLImports'].whenReady;
                if (wc)
                    return wc(callback);
                if (D.readyState === "complete") {
                    setTimeout(callback, 1);
                }
                else if (D.addEventListener) {
                    D.addEventListener("DOMContentLoaded", callback, false);
                    W.addEventListener("load", callback, false);
                }
                else {
                    D['attachEvent']("onreadystatechange", callback);
                    W['attachEvent']("onload", callback);
                    var top = false;
                    try {
                        top = (W.frameElement == null && D.documentElement) ? true : false;
                    }
                    catch (e) { }
                    if (top && top['doScroll']) {
                        (function doScrollCheck() {
                            if (!R) {
                                try {
                                    top['doScroll']('left');
                                }
                                catch (e) {
                                    return setTimeout(doScrollCheck, 50);
                                }
                                callback();
                            }
                        })();
                    }
                }
            }
            static iframeWindow(el) {
                let e = util.Dom.$1(el);
                if (!e)
                    return null;
                return e['contentWindow'];
            }
            static iframeDocument(el) {
                let e = util.Dom.$1(el);
                if (!e)
                    return null;
                return e['contentDocument'] || e['contentWindow'].document;
            }
            static fullscreen() {
                let de = D.documentElement;
                let fnName = de['mozRequestFullScreen'] ? 'mozRequestFullScreen' : (de['webkitRequestFullScreen'] ? 'webkitRequestFullScreen' : 'requestFullscreen');
                if (de[fnName])
                    de[fnName]();
            }
            static normalscreen() {
                let fnName = D['mozCancelFullScreen'] ? 'mozCancelFullScreen' : (D['webkitCancelFullScreen'] ? 'webkitCancelFullScreen' : 'exitFullscreen');
                if (D[fnName])
                    D[fnName]();
            }
        }
        util.Bom = Bom;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Bom = JS.util.Bom;
var JS;
(function (JS) {
    let util;
    (function (util) {
        let Y = util.Types, J = util.Jsons, _URI_REG = /^(([^\:\/\?\#]+)\:)?(\/\/([^\/\?\#]*))?([^\?\#]*)(\\?([^\#]*))?(\#(.*))?/, _AUTH_REG = /^(([^\:@]*)(\:([^\:@]*))?@)?([^\:@]*)(\:(\d{1,3}))?/;
        let _ADU = null;
        class URI {
            constructor(cfg) {
                this._scheme = null;
                this._user = null;
                this._pwd = null;
                this._host = null;
                this._port = null;
                this._path = null;
                this._params = null;
                this._frag = null;
                this._parse(cfg);
            }
            _parse(cfg) {
                if (Y.isString(cfg)) {
                    this._parseStr(cfg);
                }
                else if (cfg && cfg.href) {
                    this._parseStr(cfg.href);
                }
                else if (cfg) {
                    let uri = cfg;
                    this.scheme(uri.scheme ? uri.scheme : 'http');
                    this.user(uri.user);
                    this.password(uri.password);
                    this.host(uri.host);
                    this.port(Y.isDefined(uri.port) ? uri.port : 80);
                    this.path(uri.path);
                    this._params = uri.params;
                    this.fragment(uri.fragment);
                }
            }
            _parseStr(uri) {
                let array = _URI_REG.exec(uri);
                if (!array)
                    throw new URIError('An invalid URI: ' + uri);
                this._scheme = array[2];
                this._frag = array[9];
                let auth = array[4];
                if (auth) {
                    let authArr = _AUTH_REG.exec(auth);
                    if (!authArr)
                        throw new URIError('An invalid auth part of URI: ' + uri);
                    if (authArr[2])
                        this._user = authArr[2];
                    if (authArr[4])
                        this._pwd = authArr[4];
                    if (authArr[5])
                        this._host = authArr[5];
                    if (Y.isDefined(authArr[7]))
                        this._port = parseInt(authArr[7]);
                }
                let path = array[5];
                if (path && path != '/') {
                    if (!this.isAbsolute() && path.startsWith('/') && !uri.startsWith('/'))
                        path = path.slice(1);
                    this.path(path);
                }
                let query = array[7];
                if (query)
                    this._params = URI.parseQueryString(query);
            }
            userinfo() {
                return this._user ? this._user + (this._pwd ? (':' + this._pwd) : '') : '';
            }
            fragment(str) {
                if (arguments.length == 0)
                    return this._frag;
                this._frag = str || '';
                return this;
            }
            queryString(str) {
                if (arguments.length == 0) {
                    if (!this._params)
                        return null;
                    let query = '';
                    J.forEach(this._params, (v, k) => {
                        query += `${query ? '&' : ''}${k}=${v}`;
                    });
                    return query;
                }
                this._params = URI.parseQueryString(str);
                return this;
            }
            path(str) {
                if (arguments.length == 0)
                    return this._path;
                this._path = str || null;
                return this;
            }
            port(port) {
                if (arguments.length == 0)
                    return this._port;
                this._port = port;
                return this;
            }
            host(str) {
                if (arguments.length == 0)
                    return this._host;
                this._host = str || '';
                return this;
            }
            user(str) {
                if (arguments.length == 0)
                    return this._user;
                this._user = str || '';
                return this;
            }
            password(str) {
                if (arguments.length == 0)
                    return this._pwd;
                this._pwd = str || '';
                return this;
            }
            scheme(str) {
                if (arguments.length == 0)
                    return this._scheme;
                this._scheme = str || '';
                return this;
            }
            query(key, value, encode) {
                if (!this._params)
                    this._params = {};
                if (arguments.length > 1) {
                    value = value || '';
                    this._params[key] = encode ? encodeURIComponent(value) : value;
                    return this;
                }
                return decodeURIComponent(this._params[key]);
            }
            queryObject(params, encode) {
                if (arguments.length == 0)
                    return this._params;
                J.forEach(params, (value, key) => {
                    this.query(key, value, encode);
                });
                return this;
            }
            isAbsolute() {
                return this._host ? true : false;
            }
            toAbsolute() {
                let userinfo = this.userinfo(), port = Y.isDefined(this._port) ? ':' + this._port : '', path = this.path() || '', query = this.queryString() || '', fragment = this._frag ? '#' + this._frag : '';
                path = path + (!query && !fragment ? '' : '?' + query + fragment);
                return (this._scheme || 'http') + '://' + (userinfo ? userinfo + '@' : '') + (this._host || '') + port + (!path || path.startsWith('/') ? path : ('/' + path));
            }
            toRelative() {
                let query = this.queryString() || '', fragment = this._frag ? '#' + this._frag : '';
                return (this._path || '') + (!query && !fragment ? '' : '?' + query + fragment);
            }
            toString() {
                return this.isAbsolute() ? this.toAbsolute() : this.toRelative();
            }
            static getAbsoluteDir() {
                if (_ADU)
                    return _ADU;
                var div = document.createElement('div');
                div.innerHTML = '<a href="./"></a>';
                _ADU = div.firstChild['href'];
                div = null;
                return _ADU;
            }
            static toAbsoluteURL(url) {
                if (url.startsWith('http://') || url.startsWith('https://'))
                    return url;
                let loc = self.location;
                if (url.startsWith('/'))
                    return loc.origin + url;
                let p = loc.pathname || '/';
                if (p)
                    p = p.slice(0, p.lastIndexOf('/') + 1);
                return this.getAbsoluteDir() + url;
            }
            static toQueryString(json, encode) {
                if (!json)
                    return '';
                let q = '';
                J.forEach(json, (v, k) => {
                    q += `&${k}=${encode ? encodeURIComponent(v) : v}`;
                });
                return q;
            }
            static parseQueryString(query, decode) {
                if (util.Check.isEmpty(query))
                    return {};
                let q = query.startsWith('?') ? query.slice(1) : query, ps = {}, arr = q.split('&');
                arr.forEach(function (v) {
                    if (v) {
                        let kv = v.split('=');
                        ps[kv[0]] = decode ? decodeURIComponent(kv[1]) : kv[1];
                    }
                });
                return ps;
            }
        }
        util.URI = URI;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var URI = JS.util.URI;
var JS;
(function (JS) {
    let util;
    (function (util) {
        class Locales {
            static lang(locale) {
                if (!locale)
                    return null;
                let arr = locale.split('-');
                if (arr.length == 1)
                    return locale;
                return arr[0];
            }
            static country(locale) {
                if (!locale)
                    return null;
                let arr = locale.split('-');
                if (arr.length == 1)
                    return null;
                return arr[1];
            }
        }
        util.Locales = Locales;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Locales = JS.util.Locales;
var JS;
(function (JS) {
    let util;
    (function (util) {
        class Bundle {
            constructor(res, locale) {
                let T = this, lc = (locale == void 0 ? System.info().locale : locale);
                T._d = {};
                if (res) {
                    if (util.Types.isString(res)) {
                        let pos = res.lastIndexOf('.'), suffix = pos < 0 ? '' : res.slice(pos + 1), prefix = pos < 0 ? res : res.slice(0, pos);
                        if (!T._load(lc, prefix, suffix))
                            JSLogger.error('Bundle can\'t load resource file:' + res);
                    }
                    else {
                        if (res.hasOwnProperty(lc)) {
                            T._d = res[lc];
                        }
                        else {
                            let lang = util.Locales.lang(lc);
                            T._d = res.hasOwnProperty(lang) ? res[lang] : res;
                        }
                    }
                }
                T._lc = lc;
            }
            _load(lc, prefix, suffix) {
                let paths = [];
                if (lc) {
                    let lang = util.Locales.lang(lc), country = util.Locales.country(lc);
                    if (lang && country)
                        paths.push(`_${lang}_${country}`);
                    paths.push(`_${lang}`);
                }
                paths.push('');
                return paths.some(p => {
                    let path = `${prefix}${p}.${suffix}`, xhr = new XMLHttpRequest();
                    xhr.open('GET', path, false);
                    xhr.send();
                    if (xhr.status != 200)
                        return false;
                    this._d = util.Jsons.parse(xhr.response) || {};
                    return true;
                });
            }
            get(k) {
                if (arguments.length == 0)
                    return this._d;
                return k && this._d ? this._d[k] : undefined;
            }
            getKeys() {
                return Reflect.ownKeys(this._d);
            }
            hasKey(k) {
                return this._d && this._d.hasOwnProperty(k);
            }
            getLocale() {
                return this._lc;
            }
            set(d) {
                if (d)
                    this._d = d;
                return this;
            }
        }
        util.Bundle = Bundle;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Bundle = JS.util.Bundle;
var JS;
(function (JS) {
    let util;
    (function (util) {
        class Dates {
            static isValidDate(d) {
                if (d == null)
                    return false;
                return !isNaN(new Date(d).getTime());
            }
            static isLeapYear(y) {
                return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
            }
            static getDaysOfMonth(m, y) {
                y = y || new Date().getFullYear();
                return [31, (this.isLeapYear(y) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m];
            }
            static getFirstDayOfMonth(d) { return d.clone().set({ day: 1 }); }
            static getLastDayOfMonth(d) {
                return d.clone().set({ day: Dates.getDaysOfMonth(d.getMonth(), d.getFullYear()) });
            }
            static getDayOfWeek(d, dayOfWeek) {
                let d2 = dayOfWeek != void 0 ? dayOfWeek : 1, d1 = d.getDay();
                if (d2 == 0)
                    d2 = 7;
                if (d1 == 0)
                    d1 = 7;
                return d.clone().add((d2 - d1) % 7, 'd');
            }
        }
        Dates.I18N_RESOURCE = {
            AM: 'AM',
            PM: 'PM',
            WEEK_DAY_NAMES: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            WEEK_DAY_SHORT_NAMES: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            MONTH_NAMES: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            MONTH_SHORT_NAMES: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        };
        util.Dates = Dates;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Dates = JS.util.Dates;
(function () {
    var D = Date, $P = D.prototype, pad = function (s, l) {
        new D();
        if (!l) {
            l = 2;
        }
        return ("000" + s).slice(l * -1);
    };
    $P.getWeek = function () {
        let date0 = new D(this.getFullYear(), 0, 1), diff = Math.round((this.valueOf() - date0.valueOf()) / 86400000);
        return Math.ceil((diff + ((date0.getDay() + 1) - 1)) / 7);
    };
    $P.setWeek = function (week, dayOfWeek) {
        let dw = Types.isDefined(dayOfWeek) ? dayOfWeek : 1;
        return this.setTime(Dates.getDayOfWeek(this, dw).add(week - this.getWeek(), 'w').getTime());
    };
    $P.clone = function () { return new D(this.getTime()); };
    $P.setZeroTime = function () {
        let T = this;
        T.setHours(0);
        T.setMinutes(0);
        T.setSeconds(0);
        T.setMilliseconds(0);
        return T;
    };
    $P.setLastTime = function () {
        let T = this;
        T.setHours(23);
        T.setMinutes(59);
        T.setSeconds(59);
        T.setMilliseconds(999);
        return T;
    };
    $P.setNowTime = function () {
        let T = this, n = new D();
        T.setHours(n.getHours());
        T.setMinutes(n.getMinutes());
        T.setSeconds(n.getSeconds());
        T.setMilliseconds(n.getMilliseconds());
        return T;
    };
    $P.equals = function (d, p = 'ms') {
        let T = this;
        if (p == 'ms')
            return T.diff(d) == 0;
        if (p == 's')
            return T.getSeconds() == d.getSeconds();
        if (p == 'm')
            return T.getMinutes() == d.getMinutes();
        if (p == 'h')
            return T.getHours() == d.getHours();
        if (p == 'y')
            return T.getFullYear() == d.getFullYear();
        if (p == 'M')
            return T.getMonth() == d.getMonth();
        if (p == 'd')
            return T.getFullYear() == d.getFullYear() && T.getMonth() == d.getMonth() && T.getDate() == d.getDate();
        if (p == 'w')
            return T.getWeek() == d.getWeek();
        return false;
    };
    $P.between = function (start, end) { return this.diff(start) >= 0 && this.diff(end) <= 0; };
    $P.isAfter = function (d) { return this.diff(d) > 0; };
    $P.isBefore = function (d) { return this.diff(d) < 0; };
    $P.isToday = function () { return this.equals(new D(), 'd'); };
    $P.add = function (v, type) {
        let T = this;
        if (v == 0)
            return T;
        switch (type) {
            case 'ms': {
                T.setMilliseconds(T.getMilliseconds() + v);
                return T;
            }
            case 's': {
                return T.add(v * 1000, 'ms');
            }
            case 'm': {
                return T.add(v * 60000, 'ms');
            }
            case 'h': {
                return T.add(v * 3600000, 'ms');
            }
            case 'd': {
                T.setDate(T.getDate() + v);
                return T;
            }
            case 'w': {
                return T.add(v * 7, 'd');
            }
            case 'M': {
                var n = T.getDate();
                T.setDate(1);
                T.setMonth(T.getMonth() + v);
                T.setDate(Math.min(n, Dates.getDaysOfMonth(T.getMonth(), T.getFullYear())));
                return T;
            }
            case 'y': {
                return T.add(v * 12, 'M');
            }
        }
        return T;
    };
    $P.setTimezoneOffset = function (offset) {
        var here = this.getTimezoneOffset(), there = Number(offset) * -6 / 10;
        return this.add(there - here, 'm');
    };
    $P.formatTimezoneOffset = function () {
        var n = this.getTimezoneOffset() * -10 / 6, r;
        if (n < 0) {
            r = (n - 10000).toString();
            return r.charAt(0) + r.substr(2);
        }
        else {
            r = (n + 10000).toString();
            return "+" + r.substr(1);
        }
    };
    let vt = function (n, min, max) {
        if (!Types.isDefined(n)) {
            return false;
        }
        else if (n < min || n > max) {
            throw new RangeError(n + ' is not a valid value');
        }
        return true;
    };
    $P.set = function (config) {
        let T = this;
        if (vt(config.millisecond, 0, 999)) {
            T.add(config.millisecond - T.getMilliseconds(), 'ms');
        }
        if (vt(config.second, 0, 59)) {
            T.add(config.second - T.getSeconds(), 's');
        }
        if (vt(config.minute, 0, 59)) {
            T.add(config.minute - T.getMinutes(), 'm');
        }
        if (vt(config.hour, 0, 23)) {
            T.add(config.hour - T.getHours(), 'h');
        }
        if (vt(config.day, 1, Dates.getDaysOfMonth(T.getMonth(), T.getFullYear()))) {
            T.add(config.day - T.getDate(), 'd');
        }
        if (vt(config.week, 0, 53)) {
            T.setWeek(config.week);
        }
        if (vt(config.month, 0, 11)) {
            T.add(config.month - T.getMonth(), 'M');
        }
        if (vt(config.year, 0, 9999)) {
            T.add(config.year - T.getFullYear(), 'y');
        }
        if (config.timezoneOffset) {
            T.setTimezoneOffset(config.timezoneOffset);
        }
        return T;
    };
    $P.diff = function (date) {
        return this - (date || new D());
    };
    $P.format = function (format, locale) {
        let T = this, fmt = format || 'YYYY-MM-DD HH:mm:ss', bundle = new Bundle(Dates.I18N_RESOURCE, locale);
        return fmt.replace(/YYYY|YY|MMMM|MMM|MM|M|DD|D|hh|h|HH|H|mm|m|ss|s|dddd|ddd|A/g, function (m) {
            switch (m) {
                case "YYYY":
                    return pad(T.getFullYear(), 4);
                case "YY":
                    return pad(T.getFullYear());
                case "MMMM":
                    return bundle.get('MONTH_NAMES')[T.getMonth()];
                case "MMM":
                    return bundle.get('MONTH_SHORT_NAMES')[T.getMonth()];
                case "MM":
                    return pad((T.getMonth() + 1));
                case "M":
                    return T.getMonth() + 1;
                case "DD":
                    return pad(T.getDate());
                case "D":
                    return T.getDate();
                case "hh":
                    {
                        let h = T.getHours();
                        return pad(h < 13 ? (h === 0 ? 12 : h) : (h - 12));
                    }
                case "h":
                    {
                        let h = T.getHours();
                        return h < 13 ? (h === 0 ? 12 : h) : (h - 12);
                    }
                case "HH":
                    return pad(T.getHours());
                case "H":
                    return T.getHours();
                case "mm":
                    return pad(T.getMinutes());
                case "m":
                    return T.getMinutes();
                case "ss":
                    return pad(T.getSeconds());
                case "s":
                    return T.getSeconds();
                case "dddd":
                    return bundle.get('WEEK_DAY_NAMES')[T.getDay()];
                case "ddd":
                    return bundle.get('WEEK_DAY_SHORT_NAMES')[T.getDay()];
                case "A":
                    return bundle.get(T.getHours() < 12 ? 'AM' : 'PM');
                default:
                    return m;
            }
        });
    };
}());
Class.register(Date);
var JS;
(function (JS) {
    let util;
    (function (util) {
        class MimeFiles {
        }
        MimeFiles.SOURCE_FILES = {
            title: 'Source Files',
            extensions: 'c,h,cpp,ini,idl,hpp,hxx,hp,hh,cxx,cc,s,asm,log,bak,' +
                'as,ts,js,json,xml,html,htm,xhtml,xht,css,md,mkd,markdown,' +
                'java,properties,jsp,vm,ftl,' +
                'swift,m,mm,' +
                'cgi,sh,applescript,bat,sql,rb,py,php,php3,php4,' +
                'p,pp,pas,dpr,cls,frm,vb,bas,vbs,' +
                'cs,config,asp,aspx,' +
                'yaml,vhd,vhdl,cbl,cob,coffee,clj,lisp,lsp,cl,jl,el,erl,groovy,less,lua,go,ml,pl,pm,al,perl,r,scala,st,tcl,tk,itk,v,y,d,' +
                'xq,xql,xqm,xqy,xquery',
            mimeTypes: `text/plain`
        };
        MimeFiles.IMAGE_FILES = {
            title: 'Image Files',
            extensions: 'pic,jpg,jpeg,png,gif,bmp,webp,tif,tiff,svg,wbmp,tga,pcx,ico,psd,ai',
            mimeTypes: 'image/x-pict,image/jpeg,image/png,image/gif,image/bmp,image/webp,image/tiff,image/svg+xml,image/vnd.wap.wbmp,image/x-targa,image/x-pcx,image/x-icon,image/x-photoshop,application/illustrator'
        };
        MimeFiles.DOC_FILES = {
            title: 'Document Files',
            extensions: 'html,htm,xhtml,xht,md,markdown,mbox,msg,eml,txt,rtf,pdf,doc,docx,csv,xls,xlsx,ppt,pptx,xml,wps',
            mimeTypes: 'text/html,text/x-markdown,' +
                'application/mbox,application/vnd.ms-outlook,message/rfc822,text/plain,application/rtf,application/pdf,' +
                'application/msword,application/vnd.ms-excel,application/vnd.ms-powerpoint,' +
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document,' +
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,' +
                'application/vnd.openxmlformats-officedocument.presentationml.presentation,' +
                'text/xml,application/kswps'
        };
        MimeFiles.COMPRESSED_FILES = {
            title: 'Compressed Files',
            extensions: 'zip,7z,z,bz2,gz,tar,taz,tgz,rar,arj,lzh',
            mimeTypes: 'application/zip,application/x-7z-compressed,application/x-compress,application/x-bzip2,application/x-gzip,application/x-tar,application/x-rar-compressed,application/arj,application/x-lzh'
        };
        MimeFiles.VIDEO_FILES = {
            title: 'Video Files',
            extensions: 'mp4,rm,rmvb,mpg,mpeg,mpg4,avi,3gpp,asf,asx,wma,wmv,qt',
            mimeTypes: 'video/*,application/vnd.rn-realmedia,video/mpeg,video/x-msvideo,video/3gpp,video/x-ms-asf,audio/x-ms-wma,audio/x-ms-wmv,video/quicktime'
        };
        MimeFiles.AUDIO_FILES = {
            title: 'Audio Files',
            extensions: 'ogg,wav,mpga,mp2,mp3,au,snd,mid,midi,ra,ram,aif,aiff,webm',
            mimeTypes: 'audio/ogg,audio/x-wav,audio/mpeg,audio/x-mpeg,audio/basic,audio/midi,audio/x-midi,audio/x-pn-realaudio,audio/x-aiff,audio/webm'
        };
        MimeFiles.WEB_FILES = {
            title: 'Web Files',
            extensions: 'html,htm,xhtml,xht,css,js,json,swf',
            mimeTypes: 'text/html,text/css,application/json,text/javascript,application/x-shockwave-flash'
        };
        util.MimeFiles = MimeFiles;
        let FileSizeUnit;
        (function (FileSizeUnit) {
            FileSizeUnit["B"] = "B";
            FileSizeUnit["KB"] = "KB";
            FileSizeUnit["MB"] = "MB";
            FileSizeUnit["GB"] = "GB";
            FileSizeUnit["TB"] = "TB";
        })(FileSizeUnit = util.FileSizeUnit || (util.FileSizeUnit = {}));
        class Files {
            static getFileName(path) {
                let pos = path.lastIndexOf('/');
                if (pos < 0)
                    return path;
                return path.slice(pos + 1);
            }
            static getExt(path) {
                let pos = path.lastIndexOf('.');
                if (pos < 0)
                    return '';
                return path.slice(pos + 1);
            }
            static isFileExt(path, exts) {
                if (!path || !exts)
                    return false;
                let ext = this.getExt(path);
                return ext ? (exts.toLowerCase() + ',').indexOf(ext + ',') >= 0 : false;
            }
            static isSourceFile(path) {
                return this.isFileExt(path, MimeFiles.SOURCE_FILES.extensions);
            }
            static isImageFile(path) {
                return this.isFileExt(path, MimeFiles.IMAGE_FILES.extensions);
            }
            static isDocFile(path) {
                return this.isFileExt(path, MimeFiles.DOC_FILES.extensions);
            }
            static isAudioFile(path) {
                return this.isFileExt(path, MimeFiles.AUDIO_FILES.extensions);
            }
            static isVideoFile(path) {
                return this.isFileExt(path, MimeFiles.VIDEO_FILES.extensions);
            }
            static isCompressedFile(path) {
                return this.isFileExt(path, MimeFiles.COMPRESSED_FILES.extensions);
            }
            static isWebFile(path) {
                return this.isFileExt(path, MimeFiles.WEB_FILES.extensions);
            }
            static convertSize(size, orgUnit, tarUnit) {
                if (!size)
                    return 0;
                let s = Number(size);
                if (s <= 0)
                    return 0;
                let map = {
                    'B': 0, 'KB': 1, 'MB': 2, 'GB': 3, 'TB': 4
                }, r1 = map[orgUnit], r2 = map[tarUnit];
                return s * Math.pow(1024, r1 - r2);
            }
            static toSizeString(byte, sizeUnit) {
                let unit = sizeUnit || FileSizeUnit.B, TC = this.convertSize;
                if (!byte)
                    return '0' + unit;
                let kb = TC(byte, unit, FileSizeUnit.KB);
                if (kb == 0)
                    return '0' + unit;
                if (kb < 1)
                    return byte + 'B';
                let mb = TC(byte, unit, FileSizeUnit.MB);
                if (mb < 1)
                    return kb + 'KB';
                let gb = TC(byte, unit, FileSizeUnit.GB);
                if (gb < 1)
                    return mb + 'MB';
                let tb = TC(byte, unit, FileSizeUnit.TB);
                return tb < 1 ? (gb + 'GB') : (tb + 'TB');
            }
        }
        Files.ONE_KB = 1024;
        Files.ONE_MB = 1048576;
        Files.ONE_GB = 1073741824;
        Files.ONE_TB = 1099511627776;
        util.Files = Files;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var MimeFiles = JS.util.MimeFiles;
var FileSizeUnit = JS.util.FileSizeUnit;
var Files = JS.util.Files;
(function () {
    var N = Number, $N = N.prototype;
    $N.stringify = function () {
        if (this.isNaN())
            return null;
        if (this.isZero())
            return '0';
        let t = this.toString(), m = t.match(/^(\+|\-)?(\d+)\.?(\d*)[Ee](\+|\-)(\d+)$/);
        if (!m)
            return t;
        let zhe = m[2], xiao = m[3], zhi = N(m[5]), fu = m[1] == '-' ? '-' : '', zfu = m[4], ws = (zfu == '-' ? -1 : 1) * zhi - xiao.length, n = zhe + xiao;
        if (ws == 0)
            return fu + n;
        if (ws > 0)
            return fu + n + Strings.padEnd('', ws, '0');
        let dws = n.length + ws;
        if (dws <= 0)
            return fu + '0.' + Strings.padEnd('', -1 * dws, '0') + n;
        return n.slice(0, dws - 1) + '.' + n.slice(dws);
    };
    $N.round = function (digit) {
        if (this.isNaN() || this.isInt() || !N.isFinite(digit))
            return N(this);
        let d = digit || 0, pow = Math.pow(10, d);
        return Math.round(this * pow) / pow;
    };
    $N.toInt = function () {
        return this.round(0);
    };
    var f3 = (s) => {
        return s.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    };
    $N.format = function (dLen) {
        let d = dLen == void 0 || !Number.isFinite(dLen) ? this.fractionLength() : dLen, s = this.round(d).abs().stringify(), sign = this.isNegative() ? '-' : '';
        let sn = N(s);
        if (sn.isInt())
            return sign + f3(sn.toString()) + (d < 1 ? '' : '.' + Strings.padEnd('', d, '0'));
        let p = s.indexOf('.'), ints = s.slice(0, p), digs = s.slice(p + 1);
        return sign + f3(ints) + '.' + Strings.padEnd(digs, d, '0');
    };
    $N.equals = function (n, dLen) {
        if (this.isNaN())
            throw new TypeError('This number is NaN!');
        let num = N(n);
        if (num.isNaN())
            throw new TypeError('The compared number is NaN!');
        return this.round(dLen).valueOf() == num.round(dLen).valueOf();
    };
    $N.add = function (n) {
        const v = N(n);
        if (this.valueOf() == 0)
            return v;
        if (v.valueOf() == 0)
            return this;
        if (this.isInt() && v.isInt())
            return this.valueOf() + v.valueOf();
        let m = Math.pow(10, Math.max(this.fractionLength(), v.fractionLength())), n1 = this.mul(m).valueOf(), n2 = v.mul(m).valueOf();
        return (n1 + n2) / m;
    };
    $N.sub = function (n) {
        const v = N(n);
        if (v.valueOf() == 0)
            return this;
        if (this.isInt() && v.isInt())
            return this.valueOf() - v.valueOf();
        let m = Math.pow(10, Math.max(this.fractionLength(), v.fractionLength())), n1 = this.mul(m).valueOf(), n2 = v.mul(m).valueOf();
        return (n1 - n2) / m;
    };
    $N.mul = function (n) {
        if (this.valueOf() == 0)
            return 0;
        const v = N(n);
        if (v.valueOf() == 0)
            return 0;
        if (this.isInt() && v.isInt())
            return v.valueOf() * this.valueOf();
        let s1 = this.stringify(this), s2 = v.stringify(), m1 = s1.indexOf('.') >= 0 ? s1.split(".")[1].length : 0, m2 = s2.indexOf('.') >= 0 ? s2.split(".")[1].length : 0, n1 = N(s1.replace('.', '')), n2 = N(s2.replace('.', ''));
        return n1 * n2 / Math.pow(10, m1 + m2);
    };
    $N.div = function (n) {
        if (this.valueOf() == 0)
            return 0;
        const v = N(n);
        if (v.valueOf() == 0)
            throw new ArithmeticError('Can not divide an Zero.');
        let s1 = this.stringify(), s2 = v.stringify(), m1 = s1.indexOf('.') >= 0 ? s1.split(".")[1].length : 0, m2 = s2.indexOf('.') >= 0 ? s2.split(".")[1].length : 0, n1 = N(s1.replace('.', '')), n2 = N(s2.replace('.', ''));
        return (n1 / n2) * Math.pow(10, m2 - m1);
    };
    $N.isNaN = function () {
        return isNaN(this);
    };
    $N.isFinite = function () {
        return isFinite(this);
    };
    $N.isZero = function () {
        return this == 0;
    };
    $N.isFloat = function () {
        if (isNaN(this))
            return false;
        return !this.isInt();
    };
    $N.isInt = function () {
        return Math.floor(this) == this;
    };
    $N.isPositive = function () {
        if (isNaN(this))
            return false;
        return this > 0;
    };
    $N.isNegative = function () {
        if (isNaN(this))
            return false;
        return this < 0;
    };
    $N.isOdd = function () {
        if (!this.isInt())
            return false;
        return (this.valueOf() & 1) != 0;
    };
    $N.isEven = function () {
        if (!this.isInt())
            return false;
        return (this.valueOf() & 1) == 0;
    };
    $N.abs = function () {
        return Math.abs(this);
    };
    $N.fractionLength = function () {
        if (this.isInt() || this.isNaN())
            return 0;
        let s = this.stringify();
        return s.slice(s.indexOf('.') + 1).length;
    };
    $N.integerLength = function () {
        if (this.isNaN())
            return 0;
        return this.abs().toFixed(0).length;
    };
    $N.fractionalPart = function () {
        if (this.isInt() || this.isNaN())
            return '';
        let s = this.stringify();
        return s.slice(s.indexOf('.') + 1);
    };
    $N.integralPart = function () {
        if (this.isNaN())
            return '';
        let s = this.stringify(), i = s.indexOf('.');
        if (i < 0)
            return s;
        return s.slice(0, i);
    };
}());
var JS;
(function (JS) {
    let util;
    (function (util) {
        let N = Number, _opt = function (v1, opt, v2) {
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
        };
        class Numbers {
            static min(...numbers) {
                let m = 0;
                numbers.forEach((n, i) => {
                    if (i == 0 || n < m)
                        m = n;
                });
                return m;
            }
            static max(...numbers) {
                let m = 0;
                numbers.forEach((n, i) => {
                    if (i == 0 || n > m)
                        m = n;
                });
                return m;
            }
            static termwise(...args) {
                if (arguments.length <= 0)
                    return 0;
                if (arguments.length == 1)
                    return N(args[0]).valueOf();
                var rst = null;
                for (var i = 1; i < args.length; i = i + 2) {
                    if (i == 1) {
                        rst = _opt(args[i - 1], args[i], args[i + 1]);
                    }
                    else {
                        rst = _opt(rst, args[i], args[i + 1]);
                    }
                }
                return rst;
            }
            static algebra(expression, values) {
                let exp = expression.replace(/\s+/g, '');
                if (values) {
                    util.Jsons.forEach(values, (n, k) => {
                        exp = exp.replace(new RegExp(k, 'g'), N(n) + '');
                    });
                }
                exp = exp.replace(/\-{2}(\d+\.*\d*)/g, '+$1');
                exp = exp.replace(/(\(|^)\++(\d+\.*\d*)/g, '$1$2');
                exp = exp.replace(/(^|\(|\D^\))\-(\d+\.*\d*)/g, '$1(0-$2)');
                JSLogger.debug(exp);
                let opts = exp.split(/(\d+\.?\d*)/);
                opts.forEach((v, i, array) => {
                    if (v && v.length > 0) {
                        if (util.Types.isNumeric(v)) {
                            array[i] = `(Number(${v}))`;
                        }
                        else {
                            v = v.replace(/[\+\-\*\/]/g, (m) => {
                                if (m == '+') {
                                    return '.add';
                                }
                                else if (m == '-') {
                                    return '.sub';
                                }
                                else if (m == '*') {
                                    return '.mul';
                                }
                                else if (m == '/') {
                                    return '.div';
                                }
                                return m;
                            });
                            array[i] = v;
                        }
                    }
                });
                JSLogger.debug(opts.join(''));
                return eval(opts.join('')).valueOf();
            }
        }
        util.Numbers = Numbers;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Numbers = JS.util.Numbers;
var JS;
(function (JS) {
    let util;
    (function (util) {
        var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        class Random {
            static number(range, isInt) {
                let num = 0, min = 0, max = 1;
                if (util.Types.isNumber(range)) {
                    max = range;
                }
                else {
                    min = range.min || 0;
                    max = range.max;
                }
                num = Math.random() * (max - min) + min;
                return isInt ? Number(num).toInt() : num;
            }
            static string(len, chars) {
                return this._str(chars ? chars.split('') : CHARS, len);
            }
            static uuid(len, radix) {
                return this._str(CHARS, len, radix);
            }
            static _str(chars, len, radix) {
                var uuid = [], i;
                radix = radix || chars.length;
                if (len) {
                    for (i = 0; i < len; i++)
                        uuid[i] = chars[0 | Math.random() * radix];
                }
                else {
                    var r;
                    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                    uuid[14] = '4';
                    for (i = 0; i < 36; i++) {
                        if (!uuid[i]) {
                            r = 0 | Math.random() * 16;
                            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                        }
                    }
                }
                return uuid.join('');
            }
        }
        util.Random = Random;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Random = JS.util.Random;
var JS;
(function (JS) {
    let util;
    (function (util) {
        let TimerState;
        (function (TimerState) {
            TimerState[TimerState["STOPPED"] = 0] = "STOPPED";
            TimerState[TimerState["RUNNING"] = 1] = "RUNNING";
            TimerState[TimerState["PAUSED"] = 2] = "PAUSED";
        })(TimerState = util.TimerState || (util.TimerState = {}));
        class Timer {
            constructor(tick, cfg) {
                this._bus = new util.EventBus(this);
                this._sta = TimerState.STOPPED;
                this._ts = 0;
                this._et = 0;
                this._pt = 0;
                this._count = 0;
                this._tick = tick;
                this.config(cfg);
            }
            on(type, fn) {
                this._bus.on(type, fn);
                return this;
            }
            off(type, fn) {
                this._bus.off(type, fn);
                return this;
            }
            count() {
                return this._count;
            }
            config(cfg) {
                if (!cfg)
                    return this._cfg;
                this._cfg = util.Jsons.union({
                    delay: 0,
                    loop: 1,
                    interval: 0,
                    intervalMode: 'OF'
                }, this._cfg, cfg);
                let c = this._cfg;
                if (c.interval != void 0 && c.interval < 0)
                    c.interval = 0;
                let l = c.loop;
                l = l == false || l < 0 ? 0 : (l === true ? Infinity : l);
                c.loop = l;
                return this;
            }
            pause() {
                let m = this;
                if (m._sta != TimerState.RUNNING)
                    return m;
                m._sta = TimerState.PAUSED;
                m._pt = System.highResTime();
                return m;
            }
            _cancelTimer() {
                if (this._timer)
                    window.clearTimeout(this._timer);
                this._timer = null;
            }
            _reset() {
                let m = this;
                m._cancelTimer();
                m._sta = TimerState.STOPPED;
                m._count = 0;
                m._ts0 = 0;
                m._ts = 0;
                m._et = 0;
                m._pt = 0;
            }
            stop() {
                this._reset();
                return this;
            }
            _finish() {
                this._reset();
                this._bus.fire('finished');
            }
            getState() {
                return this._sta;
            }
            fps() {
                return this._et == 0 ? 0 : 1000 / this._et;
            }
            maxFPS() {
                let t = this._cfg.interval;
                return t == 0 ? Infinity : 1000 / t;
            }
            _cycle(skip) {
                if (this._sta != TimerState.RUNNING)
                    return;
                if (this._count < this._cfg.loop) {
                    let t = 0, opts = this._cfg, t0 = System.highResTime();
                    this._et = t0 - this._ts;
                    if (!skip) {
                        this._count++;
                        this._tick.call(this, this._et);
                        let t1 = System.highResTime();
                        t = t1 - t0;
                    }
                    this._ts = t0;
                    let d = opts.interval - t, needSkip = opts.intervalMode == 'OF' && d < 0;
                    this._timer = setTimeout(() => { this._cycle(needSkip); }, opts.intervalMode == 'BF' ? opts.interval : (needSkip ? 0 : d));
                }
                else {
                    this._finish();
                }
            }
            start() {
                let T = this;
                if (T._sta == TimerState.RUNNING)
                    return;
                let first = false, wait = T._cfg.delay;
                if (T._sta == TimerState.PAUSED) {
                    wait = 0;
                    let t = System.highResTime() - T._pt;
                    T._pt = 0;
                    T._ts0 += t;
                    T._ts += t;
                }
                else {
                    first = true;
                    T._reset();
                }
                T._sta = TimerState.RUNNING;
                T._timer = setTimeout(() => {
                    if (first) {
                        T._ts0 = System.highResTime();
                        T._ts = T._ts0;
                        T._bus.fire('starting');
                    }
                    T._cycle();
                }, wait);
            }
        }
        util.Timer = Timer;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Timer = JS.util.Timer;
var TimerState = JS.util.TimerState;
var JS;
(function (JS) {
    let lang;
    (function (lang) {
        class JSError extends Error {
            constructor(msg, cause) {
                super(cause ? (cause.message || '') + ' -> ' + (msg || '') : msg || '');
                this.cause = null;
                this.name = this.className;
                if (cause)
                    this.cause = cause;
            }
        }
        lang.JSError = JSError;
        class NotHandledError extends JSError {
        }
        lang.NotHandledError = NotHandledError;
        class NotFoundError extends JSError {
        }
        lang.NotFoundError = NotFoundError;
        class ArithmeticError extends JSError {
        }
        lang.ArithmeticError = ArithmeticError;
        class ArgumentError extends JSError {
        }
        lang.ArgumentError = ArgumentError;
        class StateError extends JSError {
        }
        lang.StateError = StateError;
        class NetworkError extends JSError {
        }
        lang.NetworkError = NetworkError;
        class TimeoutError extends JSError {
        }
        lang.TimeoutError = TimeoutError;
    })(lang = JS.lang || (JS.lang = {}));
})(JS || (JS = {}));
var JSError = JS.lang.JSError;
var NotHandledError = JS.lang.NotHandledError;
var NotFoundError = JS.lang.NotFoundError;
var ArithmeticError = JS.lang.ArithmeticError;
var ArgumentError = JS.lang.ArgumentError;
var StateError = JS.lang.StateError;
var NetworkError = JS.lang.NetworkError;
var TimeoutError = JS.lang.TimeoutError;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var JS;
(function (JS) {
    let lang;
    (function (lang) {
        let AssertError = class AssertError extends lang.JSError {
        };
        AssertError = __decorate([
            klass('JS.lang.AssertError')
        ], AssertError);
        lang.AssertError = AssertError;
        let T = Types, F = Functions;
        class Assert {
            static fail(msg) {
                throw new AssertError(msg);
            }
            static failNotSameType(expected, actual, msg) {
                this.fail((msg || '') + ' expected type:<' + expected + '> but was:<' + actual + '>');
            }
            static failNotEqual(expected, actual, msg) {
                this.fail((msg || '') + ' expected:<' + expected + '> but was:<' + actual + '>');
            }
            static failEqual(expected, actual, msg) {
                this.fail((msg || '') + ' <' + expected + '> equals to <' + actual + '>');
            }
            static _equal(expected, actual) {
                if (expected === actual)
                    return true;
                if (T.isArray(expected) && T.isArray(actual) && Arrays.equal(expected, actual))
                    return true;
                if (T.isJsonObject(expected) && T.isJsonObject(actual) && Jsons.equal(expected, actual))
                    return true;
                if (T.isDate(expected) && T.isDate(actual) && expected.getTime() === actual.getTime())
                    return true;
                return false;
            }
            static equal(expected, actual, msg) {
                if (this._equal(expected, actual))
                    return;
                this.failNotEqual(expected, actual, msg);
            }
            static notEqual(expected, actual, msg) {
                if (!this._equal(expected, actual))
                    return;
                this.failEqual(expected, actual, msg);
            }
            static sameType(expected, actual, msg) {
                let et = T.type(expected), at = T.type(actual);
                if (et == at)
                    return;
                this.failNotSameType(et, at, msg);
            }
            static notSameType(expected, actual, msg) {
                if (T.type(expected) != T.type(actual))
                    return;
                this.fail((msg || '') + ' expected not same type');
            }
            static true(condition, msg) {
                if (!condition)
                    this.fail((msg || '') + ' expected:<TRUE> but was:<FALSE>');
            }
            static false(condition, msg) {
                if (condition)
                    this.fail((msg || '') + ' expected:<FALSE> but was:<TRUE>');
            }
            static defined(obj, msg) {
                this.true(obj != void 0, msg);
            }
            static notDefined(obj, msg) {
                this.true(obj == void 0, msg);
            }
            static error(fn, msg) {
                let has = false;
                try {
                    F.call(fn);
                }
                catch (e) {
                    has = true;
                }
                if (!has)
                    this.fail((msg || '') + ' expected throw an error');
            }
            static equalError(error, fn, msg) {
                let has = false;
                try {
                    F.call(fn);
                }
                catch (e) {
                    if (T.ofKlass(e, error))
                        has = true;
                }
                if (!has)
                    this.fail((msg || '') + ' expected throw an error');
            }
        }
        lang.Assert = Assert;
    })(lang = JS.lang || (JS.lang = {}));
})(JS || (JS = {}));
var Assert = JS.lang.Assert;
var AssertError = JS.lang.AssertError;
var JS;
(function (JS) {
    let lang;
    (function (lang_1) {
        let OS;
        (function (OS) {
            OS["Windows"] = "Windows";
            OS["MacOS"] = "Mac OS";
            OS["Unix"] = "Unix";
            OS["Linux"] = "Linux";
            OS["CentOS"] = "CentOS";
            OS["Ubuntu"] = "Ubuntu";
            OS["iOS"] = "iOS";
            OS["Android"] = "Android";
            OS["WindowsPhone"] = "Windows Phone";
        })(OS = lang_1.OS || (lang_1.OS = {}));
        let DeviceType;
        (function (DeviceType) {
            DeviceType["desktop"] = "desktop";
            DeviceType["console"] = "console";
            DeviceType["mobile"] = "mobile";
            DeviceType["tablet"] = "tablet";
            DeviceType["smarttv"] = "smarttv";
            DeviceType["wearable"] = "wearable";
            DeviceType["embedded"] = "embedded";
        })(DeviceType = lang_1.DeviceType || (lang_1.DeviceType = {}));
        let Browser;
        (function (Browser) {
            Browser["Edge"] = "Edge";
            Browser["IE"] = "IE";
            Browser["Firefox"] = "Firefox";
            Browser["Chrome"] = "Chrome";
            Browser["Opera"] = "Opera";
            Browser["Safari"] = "Safari";
            Browser["iOS"] = "iOS";
            Browser["WeChat"] = "WeChat";
            Browser["QQ"] = "QQ";
            Browser["UC"] = "UC";
        })(Browser = lang_1.Browser || (lang_1.Browser = {}));
        class System {
            static info(refresh) {
                if (!refresh && System._info)
                    return System._info;
                var parser = window['UAParser'] && new UAParser(), dev = parser ? parser.getDevice() : {};
                if (!dev.type)
                    dev.type = DeviceType.desktop;
                let info = {
                    ua: navigator.userAgent,
                    browser: parser && parser.getBrowser(),
                    engine: parser && parser.getEngine(),
                    device: dev,
                    os: parser && parser.getOS(),
                    locale: navigator.language,
                    cookieEnabled: navigator.cookieEnabled,
                    online: navigator.onLine,
                    hardware: {
                        cpuName: parser && parser.getCPU().architecture,
                        cpuCores: navigator.hardwareConcurrency
                    },
                    display: null
                };
                if (self.window) {
                    let winscreen = window.screen, doc = (a) => { return Math.max(document.documentElement[a], document.body[a]); };
                    info.display = {
                        screenWidth: winscreen.width,
                        screenHeight: winscreen.height,
                        screenViewWidth: winscreen.availWidth,
                        screenViewHeight: winscreen.availHeight,
                        windowX: window.screenLeft || window.screenX,
                        windowY: window.screenTop || window.screenY,
                        docX: doc('clientLeft') || 0,
                        docY: doc('clientTop') || 0,
                        docScrollX: doc('scrollLeft') || 0,
                        docScrollY: doc('scrollTop') || 0,
                        docWidth: doc('scrollWidth') || 0,
                        docHeight: doc('scrollHeight') || 0,
                        docViewWidth: doc('clientWidth') || 0,
                        docViewHeight: doc('clientHeight') || 0,
                        colorDepth: winscreen.colorDepth,
                        pixelDepth: winscreen.pixelDepth,
                        devicePixelRatio: window.devicePixelRatio
                    };
                }
                System._info = info;
                return info;
            }
            static display(refresh) {
                return this.info(refresh).display;
            }
            static isDevice(device) {
                return System.info().device.type == device;
            }
            static isBrowser(b) {
                return System.info().browser.name == b;
            }
            static isOS(os, version) {
                let sos = System.info().os, is = sos.name == os;
                if (!is)
                    return false;
                return version && sos.version ? sos.version.indexOf(version) == 0 : true;
            }
            static isLang(lang) {
                return Locales.lang(System.info().locale) == lang;
            }
            static isCountry(country) {
                return Locales.country(System.info().locale) == country;
            }
            static timezoneString(tz) {
                return (tz || 'GMT') + new Date().formatTimezoneOffset();
            }
            static performance() {
                return window.performance;
            }
            static highResTime() {
                return performance.now();
            }
        }
        lang_1.System = System;
    })(lang = JS.lang || (JS.lang = {}));
})(JS || (JS = {}));
var System = JS.lang.System;
var OS = JS.lang.OS;
var Browser = JS.lang.Browser;
var DeviceType = JS.lang.DeviceType;
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var JS;
(function (JS) {
    let lang;
    (function (lang) {
        var Thread_1;
        let ThreadState;
        (function (ThreadState) {
            ThreadState["NEW"] = "NEW";
            ThreadState["RUNNING"] = "RUNNING";
            ThreadState["TERMINATED"] = "TERMINATED";
            ThreadState["DESTROYED"] = "DESTROYED";
        })(ThreadState = lang.ThreadState || (lang.ThreadState = {}));
        let SYS_URL = null, _system = (srt) => {
            let src = srt.src.replace(/\?.*/, '');
            return src.endsWith('/jscore.js') || src.endsWith('/jscore.min.js') ? src : null;
        }, _docSystem = function (doc) {
            let scripts = doc.getElementsByTagName('script');
            if (scripts) {
                for (let i = 0, len = scripts.length; i < len; i++) {
                    let src = _system(scripts[i]);
                    if (src)
                        return src;
                }
            }
            let links = doc.querySelectorAll('link[rel=import]');
            if (links) {
                for (let i = 0, len = links.length; i < len; i++) {
                    let link = links[i];
                    if (link['import']) {
                        let src = _docSystem(link['import']);
                        if (src)
                            return src;
                    }
                }
            }
        }, _findSystem = function () {
            if (SYS_URL)
                return SYS_URL;
            let p = self.__jsdk_sys_path;
            if (p) {
                SYS_URL = p;
                return SYS_URL;
            }
            ;
            SYS_URL = _docSystem(document);
            return SYS_URL;
        };
        let Thread = Thread_1 = class Thread {
            constructor(target, preload) {
                this._bus = new EventBus(this);
                this._state = ThreadState.NEW;
                this._url = null;
                this._libs = [];
                if (target) {
                    let members = Reflect.ownKeys(target);
                    for (let i = 0, len = members.length; i < len; i++) {
                        const key = members[i].toString();
                        if (key.startsWith('__') || key == 'constructor')
                            continue;
                        const m = target[key];
                        if (Types.isFunction(m) || key == 'run')
                            this[key] = m;
                    }
                }
                this.id = Random.uuid(4, 10);
                if (preload) {
                    this._libs = this._libs.concat(typeof preload == 'string' ? [preload] : preload);
                }
            }
            getState() { return new String(this._state); }
            run() { }
            ;
            _define(fnName) {
                let fn = Thread_1._defines[fnName], fnBody = fn.toString().replace(/^function/, '');
                return `this.${fnName}=function${fnBody}`;
            }
            _predefine(id) {
                let sys = _findSystem();
                return `
                //@ sourceURL=thread-${id}.js
                this.id="${id}";
                this.__jsdk_sys_path="${sys}";
                importScripts("${sys}");
                ${this._define('imports')}
                ${this._define('onposted')}
                ${this._define('postMain')}
                ${this._define('callMain')}
                ${this._define('terminate')}
                ${this._libs.length > 0 ? `this.imports("${this._libs.join('","')}");` : ''}`;
            }
            _stringify(fn) {
                let script = this._predefine(this.id), fnText = fn.toString().trim(), fnBody = '';
                let rst = /[^{]+{((.|\n)*)}$/.exec(fnText);
                if (rst)
                    fnBody = rst[1];
                return `(()=>{${script}${fnBody}})()`;
            }
            isRunning() {
                return this._state == 'RUNNING';
            }
            start() {
                if (this.isDestroyed())
                    return this._warn('start');
                if (this.isRunning())
                    this.terminate();
                this._state = ThreadState.RUNNING;
                if (Types.isString(this.run)) {
                    this._url = this.run;
                }
                else {
                    let fnString = this._stringify(this.run);
                    this._url = self.URL.createObjectURL(new Blob([fnString], { type: 'text/javascript' }));
                }
                this._wk = new Worker(this._url);
                this._wk.onmessage = e => {
                    let d = e.data;
                    if (d.cmd == 'CLOSE') {
                        this.terminate();
                    }
                    else if (d.cmd.startsWith('#')) {
                        let fnName = d.cmd.slice(1);
                        this[fnName].apply(this, d.data);
                    }
                    else {
                        this._bus.fire('message', [d.data]);
                    }
                };
                this._wk.onerror = e => {
                    JSLogger.error(e, `Thread<${this.id}> run error!`);
                    this._bus.fire('error', [e.message]);
                    this.terminate();
                };
                return this;
            }
            terminate() {
                if (this.isDestroyed())
                    return this;
                if (this._wk)
                    this._wk.terminate();
                if (this._url)
                    window.URL.revokeObjectURL(this._url);
                this._state = ThreadState.TERMINATED;
                this._wk = null;
                this._url = null;
                return this;
            }
            destroy() {
                setTimeout(() => {
                    this.terminate();
                    this._state = ThreadState.DESTROYED;
                    this._bus.destroy();
                }, 100);
            }
            isDestroyed() {
                return this._state == 'DESTROYED';
            }
            on(e, fn) {
                this._bus.on(e, fn);
                return this;
            }
            off(e) {
                this._bus.off(e);
                return this;
            }
            _warn(act) {
                JSLogger.warn(`Cannot ${act} from Thread<id=${this.id};state=${this._state}>!`);
                return this;
            }
            postThread(data, transfer) {
                if (this._state != 'RUNNING')
                    return this._warn('post data');
                if (this._wk)
                    this._wk.postMessage.apply(this._wk, Check.isEmpty(transfer) ? [data] : [data].concat(transfer));
                return this;
            }
            static initContext() {
                if (self.imports)
                    return self;
                self.imports = this._defines['imports'];
                self.onposted = this._defines['onposted'];
                self.postMain = this._defines['postMain'];
                self.callMain = this._defines['callMain'];
                self.terminate = this._defines['terminate'];
                return self;
            }
        };
        Thread._defines = {
            imports: function (...urls) {
                urls.forEach(u => {
                    importScripts(self.URI.toAbsoluteURL(u));
                });
            },
            onposted: function (fn) {
                self.addEventListener('message', function (e) {
                    fn.call(self, e.data);
                }, false);
            },
            postMain: function (data) {
                self.postMessage({ cmd: 'DATA', data: data }, null);
            },
            callMain: function (fnName, ...args) {
                self.postMessage({ cmd: '#' + fnName, data: Array.prototype.slice.call(arguments, 1) }, null);
            },
            terminate: function () {
                self.postMessage({ cmd: 'CLOSE' }, null);
            }
        };
        Thread = Thread_1 = __decorate([
            klass('JS.lang.Thread'),
            __metadata("design:paramtypes", [Object, Object])
        ], Thread);
        lang.Thread = Thread;
    })(lang = JS.lang || (JS.lang = {}));
})(JS || (JS = {}));
var Thread = JS.lang.Thread;
var ThreadState = JS.lang.ThreadState;
