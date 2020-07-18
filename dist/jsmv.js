//@ sourceURL=jsmv.js
/**
* JSDK 2.2.0 
* https://github.com/fengboyue/jsdk/
* (c) 2007-2020 Frank.Feng<boyue.feng@foxmail.com>
* MIT license
*/
var JS;
(function (JS) {
    let ioc;
    (function (ioc) {
        function component(className) {
            return Annotations.define({
                name: 'component',
                handler: (anno, values, obj) => {
                    let className = values[0];
                    Class.register(obj, className);
                    ioc.Components.get(Class.forName(className).name);
                }
            }, arguments);
        }
        ioc.component = component;
        function inject() {
            return Annotations.define({
                name: 'inject',
                target: AnnotationTarget.FIELD
            });
        }
        ioc.inject = inject;
    })(ioc = JS.ioc || (JS.ioc = {}));
})(JS || (JS = {}));
var component = JS.ioc.component;
var inject = JS.ioc.inject;
var JS;
(function (JS) {
    let ioc;
    (function (ioc) {
        class Components {
            static get(cmpt) {
                let cmp;
                if (Types.isString(cmpt)) {
                    cmp = this._cmps[cmpt];
                }
                if (!cmp)
                    cmp = this.add(cmpt);
                return cmp;
            }
            static add(cmpt) {
                let cmp, clazz = Class.forName(cmpt);
                if (!clazz)
                    return undefined;
                if (this._cmps.hasOwnProperty(clazz.name)) {
                    return this._cmps[clazz.name];
                }
                else {
                    cmp = clazz.newInstance();
                    this._injectFields(clazz, cmp);
                    this._cmps[clazz.name] = cmp;
                    if (cmp.initialize)
                        cmp.initialize();
                }
                return cmp;
            }
            static remove(cmpt) {
                let clazz = Class.forName(cmpt);
                if (!clazz)
                    return;
                let cmp = this._cmps[clazz.name];
                if (cmp) {
                    if (cmp.destroy)
                        cmp.destroy();
                    delete this._cmps[clazz.name];
                }
            }
            static clear() {
                Jsons.forEach(this._cmps, cmp => {
                    if (cmp.destroy)
                        cmp.destroy();
                });
                this._cmps = {};
            }
            static _injectFields(clazz, cmp) {
                let fields = clazz.fieldsMap(cmp, ioc.inject);
                Jsons.forEach(fields, (v, k) => {
                    let f = Annotations.getPropertyType(cmp, k);
                    if (!f || !Types.equalKlass(f))
                        throw new TypeError('The type of Field[' + k + '] is invalid!');
                    let cls = f.class;
                    cmp[k] = this.get(cls.name);
                });
            }
        }
        Components._cmps = {};
        ioc.Components = Components;
    })(ioc = JS.ioc || (JS.ioc = {}));
})(JS || (JS = {}));
var Components = JS.ioc.Components;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var JS;
(function (JS) {
    let model;
    (function (model) {
        let AjaxProxy = class AjaxProxy {
        };
        AjaxProxy = __decorate([
            klass('JS.model.AjaxProxy')
        ], AjaxProxy);
        model.AjaxProxy = AjaxProxy;
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var AjaxProxy = JS.model.AjaxProxy;
var JS;
(function (JS) {
    let model;
    (function (model) {
        class Field {
            constructor(config) {
                this._config = Jsons.union({
                    type: 'string',
                    isId: false,
                    nullable: true,
                    defaultValue: null
                }, config);
            }
            config() {
                return this._config;
            }
            name() {
                return this._config.name;
            }
            alias() {
                let nameMapping = this._config.nameMapping;
                if (!nameMapping)
                    return this.name();
                return Types.isString(nameMapping) ? nameMapping : nameMapping.call(this);
            }
            isId() {
                return this._config.isId;
            }
            defaultValue() {
                return this._config.defaultValue;
            }
            type() {
                return this._config.type;
            }
            nullable() {
                return this._config.nullable;
            }
            set(val) {
                if (!this.nullable() && val == void 0)
                    throw new TypeError(`This Field<${this.name()}> must be not null`);
                let fn = this._config.setter, v = fn ? fn.apply(this, [val]) : val;
                return v === undefined ? this._config.defaultValue : v;
            }
            compare(v1, v2) {
                let ret = 0;
                if (this._config.comparable) {
                    ret = this._config.comparable(v1, v2);
                }
                else {
                    ret = (v1 === v2) ? 0 : ((v1 < v2) ? -1 : 1);
                }
                return ret;
            }
            isEqual(v1, v2) {
                return this.compare(v1, v2) === 0;
            }
            validate(value, errors) {
                let cfg = this._config, vts = cfg.validators, rst, ret = '';
                if (!vts)
                    return true;
                for (let i = 0, len = vts.length; i < len; ++i) {
                    const vSpec = vts[i];
                    rst = Validator.create(vSpec.name, vSpec).validate(value);
                    if (rst !== true) {
                        if (errors)
                            errors.addError(cfg.name, rst === false ? '' : rst);
                        ret += ret ? ('|' + rst) : rst;
                    }
                }
                return ret || true;
            }
        }
        model.Field = Field;
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var ModelField = JS.model.Field;
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var JS;
(function (JS) {
    let model;
    (function (model) {
        let JsonProxy = class JsonProxy extends model.AjaxProxy {
            constructor() {
                super();
            }
            execute(query, data) {
                var req = Jsons.union({
                    method: 'GET'
                }, Ajax.toRequest(query, data), {
                    async: true,
                    type: 'json'
                });
                return new Promise(function (resolve, reject) {
                    Ajax.send(req).always((res) => {
                        let result = model.ResultSet.parseJSON(res.data);
                        result && result.success() ? resolve(result) : reject(res);
                    });
                });
            }
        };
        JsonProxy = __decorate([
            klass('JS.model.JsonProxy'),
            __metadata("design:paramtypes", [])
        ], JsonProxy);
        model.JsonProxy = JsonProxy;
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var JsonProxy = JS.model.JsonProxy;
var JS;
(function (JS) {
    let model;
    (function (model_1) {
        ;
        class ListModelConfig {
            constructor() {
                this.autoLoad = false;
            }
        }
        model_1.ListModelConfig = ListModelConfig;
        let ListModel = class ListModel {
            constructor(cfg) {
                this._data = [];
                this._eventBus = new EventBus(this);
                this._isD = false;
                this._modelKlass = null;
                this._config = this._initConfig(cfg);
                let listeners = this._config.listeners;
                if (listeners)
                    Jsons.forEach(listeners, (v, key) => {
                        this.on(key, v);
                    });
                if (this._config.iniData)
                    this.setData(this._config.iniData);
                if (this._config.autoLoad)
                    this.reload();
            }
            _initConfig(cfg) {
                return Jsons.union(new ListModelConfig(), cfg);
            }
            _check() {
                if (this.isDestroyed())
                    throw new NotHandledError('The model was destroyed!');
            }
            addSorter(field, dir) {
                this._check();
                let newSorter = {
                    field: field,
                    dir: dir ? dir : 'asc'
                }, has = false, sorters = this._config.sorters;
                if (!sorters)
                    sorters = [];
                sorters.some((sorter) => {
                    if (newSorter.field == sorter.field) {
                        has = true;
                        if (newSorter.sort)
                            sorter.sort = newSorter.sort;
                        sorter.dir = newSorter.dir;
                        return true;
                    }
                    return false;
                });
                if (!has)
                    sorters.push(newSorter);
                this._config.sorters = sorters;
            }
            removeSorter(field) {
                this._check();
                let sorters = this._config.sorters;
                if (!sorters)
                    return;
                sorters.remove(item => {
                    return item.field == field;
                });
            }
            clearSorters() {
                this._check();
                this._config.sorters = [];
            }
            sort(field, dir) {
                this._check();
                this.addSorter(field, dir);
                return this.reload();
            }
            getSorterBy(fieldName) {
                let sorters = this._config.sorters;
                if (!sorters)
                    return null;
                let sorter = null;
                sorters.some((srt) => {
                    let is = srt.field === fieldName;
                    if (is)
                        sorter = srt;
                    return is;
                });
                return sorter;
            }
            _sortParams() {
                let sorters = this._config.sorters;
                if (!sorters)
                    return null;
                let s = '';
                sorters.forEach((sorter) => {
                    s += `${sorter.field} ${sorter.dir ? sorter.dir : 'asc'},`;
                });
                s = s.slice(0, s.length - 1);
                return { sorters: s };
            }
            reload() {
                return this.load(this._config.dataQuery);
            }
            modelKlass(klass) {
                if (arguments.length == 0)
                    return this._modelKlass;
                this._modelKlass = klass;
                return this;
            }
            load(quy, silent) {
                this._check();
                let me = this, query = Jsons.union(Ajax.toRequest(this._config.dataQuery), Ajax.toRequest(quy));
                query.data = Jsons.union(query.data, this._sortParams());
                this._fire('loading', [query]);
                this._config.dataQuery = query;
                return new model_1.JsonProxy().execute(query).then(function (result) {
                    if (result.success()) {
                        me.setData(result.data(), silent);
                        me._fire('loadsuccess', [result]);
                    }
                    else {
                        me._fire('loadfailure', [result]);
                    }
                    return Promise.resolve(result);
                }).catch(function (err) {
                    if (Types.ofKlass(err, Error))
                        JSLogger.error('[' + err.name + ']' + err.message);
                    me._fire('loaderror', [err]);
                });
            }
            getData() {
                return this.isEmpty() ? null : this._data;
            }
            setData(data, silent) {
                this._check();
                let newData = data, oldData = Jsons.clone(this._data);
                if (!silent)
                    this._fire('dataupdating', [newData, oldData]);
                this._data = data || [];
                if (!silent)
                    this._fire('dataupdated', [newData, oldData]);
                return this;
            }
            iniData(d) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.iniData;
                cfg.iniData = d;
                return this;
            }
            reset() {
                return this.setData(this.iniData());
            }
            add(records, silent) {
                return this.insert(this._data.length, records, silent);
            }
            insert(index, records, silent) {
                if (!records)
                    return this;
                this._check();
                this._data = this._data || [];
                let models = Arrays.toArray(records);
                this._data.add(models, index);
                if (!silent)
                    this._fire('rowadded', [models, index]);
                return this;
            }
            getRowModel(index, klass) {
                if (index < 0 || index >= this.size())
                    return null;
                let d = this._data[index];
                if (!d)
                    return null;
                let k = klass || this._modelKlass;
                if (!k)
                    throw new NotFoundError('The model klass not found!');
                return Class.newInstance(k).setData(d, true);
            }
            getModels(klass) {
                if (this.size() == 0)
                    return null;
                let k = klass || this._modelKlass;
                if (!k)
                    throw new NotFoundError('The model klass not found!');
                let mds = [];
                this._data.forEach((d, i) => {
                    mds[i] = Class.newInstance(k).setData(d, true);
                });
                return mds;
            }
            getRowById(id) {
                return this.getRow(this.indexOfId(id));
            }
            getRow(index) {
                if (index < 0 || index >= this.size())
                    return null;
                return this._data[index] || null;
            }
            indexOfId(id) {
                if (!id || this.size() == 0)
                    return -1;
                let idName = 'id';
                if (this._modelKlass && Types.subKlass(this._modelKlass, model_1.Model)) {
                    let model = Class.newInstance(this._modelKlass), field = model.getIdField();
                    if (field)
                        idName = field.alias();
                }
                let index = -1;
                this._data.some((obj, i) => {
                    let ret = obj[idName] == id;
                    if (ret)
                        index = i;
                    return ret;
                });
                return index;
            }
            removeAt(index, silent) {
                this._check();
                if (this.size() == 0)
                    return this;
                const obj = this._data[index];
                if (obj) {
                    this._data.remove(index);
                    if (!silent)
                        this._fire('rowremoved', [obj, index]);
                }
                return this;
            }
            clear(silent) {
                return this.setData(null, silent);
            }
            validate() {
                if (this.size() == 0)
                    return true;
                let rst = new ValidateResult(), str = '';
                this._data.forEach(m => {
                    let ret = m.validate(rst);
                    if (ret !== true)
                        str += (str ? '|' : '') + ret;
                });
                this._fire('validated', [this._data, rst]);
                return str || true;
            }
            validateRow(index) {
                let row = this.getRow(index);
                if (!row)
                    return null;
                let rst = row.validate();
                this._fire('rowvalidated', [rst, row, index]);
                return rst;
            }
            size() {
                return !this._data ? 0 : this._data.length;
            }
            isEmpty() {
                return this.size() == 0;
            }
            clone() {
                let model = Class.newInstance(this.className, Jsons.clone(this._config));
                model.setData(this.getData());
                return model;
            }
            _fire(type, args) {
                this._eventBus.fire(type, args);
            }
            on(type, fn, once) {
                this._check();
                this._eventBus.on(type, fn, once);
                return this;
            }
            off(type) {
                this._check();
                this._eventBus.off(type);
                return this;
            }
            destroy() {
                if (this._isD)
                    return;
                this._eventBus.destroy();
                this._eventBus = null;
                this._data = null;
                this._isD = true;
            }
            isDestroyed() {
                return this._isD;
            }
        };
        ListModel = __decorate([
            klass('JS.model.ListModel'),
            __metadata("design:paramtypes", [ListModelConfig])
        ], ListModel);
        model_1.ListModel = ListModel;
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var ListModel = JS.model.ListModel;
var ListModelConfig = JS.model.ListModelConfig;
var JS;
(function (JS) {
    let model;
    (function (model_2) {
        class ModelConfig {
            constructor() {
                this.idProperty = 'id';
                this.iniData = null;
            }
        }
        model_2.ModelConfig = ModelConfig;
        let Model = class Model {
            constructor(cfg) {
                this._fields = {};
                this._eventBus = new EventBus(this);
                this._data = {};
                this._isD = false;
                cfg = Jsons.union(new ModelConfig(), cfg);
                let defaultFields = this.getClass().getKlass().DEFAULT_FIELDS;
                this._config = Types.isDefined(defaultFields) ? Jsons.union(cfg, { fields: defaultFields }) : cfg;
                this._addFields(this._config.fields);
                let listeners = this._config.listeners;
                if (listeners)
                    Jsons.forEach(listeners, (v, key) => {
                        this.on(key, v);
                    });
            }
            _check() {
                if (this.isDestroyed())
                    throw new NotHandledError('The model was destroyed!');
            }
            _newField(cfg) {
                let tField = null;
                if (cfg.name in this._fields) {
                    tField = this._fields[cfg.name];
                    let c = tField.config();
                    c = Jsons.union(c, cfg);
                }
                else {
                    cfg.isId = cfg.isId || this._config.idProperty === cfg.name;
                    tField = new model_2.Field(cfg);
                    this._fields[tField.name()] = tField;
                }
                if (tField.isId())
                    this._config.idProperty = cfg.name;
            }
            _addFields(fields) {
                if (!fields)
                    return;
                for (let i = 0, len = fields.length; i < len; i++) {
                    const fieldCfg = fields[i];
                    this._newField(Types.isString(fieldCfg) ? { name: fieldCfg } : fieldCfg);
                }
            }
            addFields(fields) {
                this._check();
                this._addFields(fields);
                return this;
            }
            addField(field) {
                this.addFields([field]);
                return this;
            }
            isIdField(name) {
                return name == this._config.idProperty;
            }
            removeFields(names) {
                this._check();
                names.forEach((name) => {
                    this.removeField(name);
                });
                return this;
            }
            removeField(name) {
                this._check();
                if (this.isIdField(name))
                    throw new JSError('Can\'t remove the ID field!');
                if (this._fields.hasOwnProperty(name))
                    delete this._fields[name];
                return this;
            }
            updateField(field) {
                this._check();
                let name = Types.isString(field) ? field : field.name;
                if (this.isIdField(name))
                    throw new JSError('Can\'t update the ID field!');
                if (!this._fields.hasOwnProperty(name))
                    return;
                delete this._fields[name];
                this.addFields([field]);
                return this;
            }
            updateFields(fields) {
                fields.forEach(field => {
                    this.updateField(field);
                });
                return this;
            }
            clone() {
                let model = Class.newInstance(this.className, Jsons.clone(this._config));
                model.setData(this.getData());
                return model;
            }
            reload() {
                return this.load(this._config.dataQuery);
            }
            load(quy, silent) {
                this._check();
                let me = this, query = Jsons.union(Ajax.toRequest(this._config.dataQuery), Ajax.toRequest(quy));
                this._fire('loading', [query]);
                this._config.dataQuery = query;
                return new model_2.JsonProxy().execute(query).then(function (result) {
                    if (result) {
                        let records = result.data();
                        if (!records)
                            me._fire('loadfailure', [result]);
                        me.setData(Types.isArray(records) ? records[0].getData() : records, silent);
                        me._fire('loadsuccess', [result]);
                    }
                    return Promise.resolve(result);
                }).catch(function (err) {
                    if (Types.ofKlass(err, Error))
                        JSLogger.error('[' + err.name + ']' + err.message);
                    me._fire('loaderror', [err]);
                });
            }
            setData(data, silent) {
                this._check();
                let oldData = Jsons.clone(this._data), newData = data;
                if (!silent)
                    this._fire('dataupdating', [newData, oldData]);
                this._data = {};
                if (newData) {
                    if (Check.isEmpty(this._fields)) {
                        Jsons.forEach(newData, (v, k) => {
                            this._newField({ name: k });
                            this.set(k, v, true);
                        });
                    }
                    else {
                        Jsons.forEach(this._fields, (f, name) => {
                            this.set(name, newData[f.alias()], true);
                        });
                    }
                }
                if (!silent)
                    this._fire('dataupdated', [newData, oldData]);
                return this;
            }
            hasField(name) {
                return this._fields.hasOwnProperty(name);
            }
            get(fieldName) {
                let field = this.getField(fieldName);
                if (!field)
                    return undefined;
                let v = this._data[field.alias()];
                return v == void 0 ? null : v;
            }
            set(key, value, equal) {
                this._check();
                let field = this.getField(key);
                if (!field)
                    return;
                let alias = field.alias(), oldVal = this._data[alias], newVal = field.set(value);
                this._data[alias] = newVal;
                let eq = equal == void 0 ? false : (Types.isFunction(equal) ? (equal.apply(this, [newVal, oldVal])) : equal);
                if (!eq)
                    this._fire('fieldchanged', [newVal, oldVal, field.name()]);
                return this;
            }
            iniData(d) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.iniData;
                cfg.iniData = d;
                return this;
            }
            getData() {
                return this._data;
            }
            getId() {
                return this.get(this._config.idProperty);
            }
            setId(id) {
                this._check();
                this.set(this._config.idProperty, id);
                return this;
            }
            isEmpty() {
                return Check.isEmpty(this._data);
            }
            destroy() {
                if (this._isD)
                    return;
                this._eventBus.destroy();
                this._eventBus = null;
                this._data = null;
                this._isD = true;
            }
            isDestroyed() {
                return this._isD;
            }
            getField(name) {
                return this._fields[name];
            }
            getFields() {
                return this._fields;
            }
            getIdField() {
                if (!this._fields)
                    return null;
                let f = null;
                Jsons.some(this._fields, field => {
                    let is = field.isId();
                    if (is)
                        f = field;
                    return is;
                });
                return f;
            }
            reset() {
                return this.setData(this.iniData());
            }
            clear() {
                return this.setData(null);
            }
            validate(result) {
                let vdata = this._data;
                if (Check.isEmpty(vdata))
                    return true;
                let rst = result || new ValidateResult(), str = '';
                Jsons.forEach(vdata, (v, k) => {
                    let field = this.getField(k);
                    if (field) {
                        let ret = this.validateField(field.name(), v, rst);
                        if (ret !== true)
                            str += (str ? '|' : '') + ret;
                    }
                });
                this._fire('validated', [rst, vdata]);
                return str || true;
            }
            validateField(fieldName, value, result) {
                if (!result)
                    result = new ValidateResult();
                let field = this.getField(fieldName);
                if (!field)
                    return true;
                let rst = result || new ValidateResult(), val = arguments.length > 1 ? value : this.get(fieldName);
                let vdt = field.validate(val, rst);
                this._fire('fieldvalidated', [rst, val, fieldName]);
                return Types.isBoolean(vdt) ? vdt : `[${fieldName}]=` + vdt;
            }
            _fire(type, args) {
                this._eventBus.fire(type, args);
            }
            on(type, fn, once) {
                this._check();
                this._eventBus.on(type, fn, once);
                return this;
            }
            off(type) {
                this._check();
                this._eventBus.off(type);
                return this;
            }
        };
        Model.DEFAULT_FIELDS = [];
        Model = __decorate([
            klass('JS.model.Model'),
            __metadata("design:paramtypes", [ModelConfig])
        ], Model);
        model_2.Model = Model;
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var Model = JS.model.Model;
var ModelConfig = JS.model.ModelConfig;
var JS;
(function (JS) {
    let model;
    (function (model) {
        ;
        class PageModelConfig extends model.ListModelConfig {
            constructor() {
                super(...arguments);
                this.dataQuery = {
                    url: '',
                    pageSize: Infinity,
                    page: 1
                };
                this.parametersMapping = {
                    totalField: 'total',
                    pageField: 'page',
                    pageSizeField: 'pageSize',
                    sortersField: 'sorters'
                };
            }
        }
        model.PageModelConfig = PageModelConfig;
        let PageModel = class PageModel extends model.ListModel {
            constructor(cfg) {
                super(cfg);
                this._cacheTotal = null;
            }
            _initConfig(cfg) {
                return Jsons.union(new PageModelConfig(), cfg);
            }
            _newParams(query) {
                let json = {}, cfg = this._config, mapping = cfg.parametersMapping;
                json[mapping.pageSizeField] = (!query.pageSize || query.pageSize == Infinity) ? '' : query.pageSize;
                json[mapping.pageField] = query.page || 1;
                json[mapping.totalField] = this._cacheTotal == null ? '' : this._cacheTotal;
                let sorters = this._config.sorters, s = '';
                if (sorters) {
                    sorters.forEach((sorter) => {
                        s += `${sorter.field} ${sorter.dir ? sorter.dir : 'asc'},`;
                    });
                    json[mapping.sortersField] = s.slice(0, s.length - 1);
                }
                return URI.toQueryString(json) + '&' + (Types.isString(query.data) ? query.data : URI.toQueryString(query.data));
            }
            load(quy, silent) {
                this._check();
                let me = this, query = Jsons.union(Ajax.toRequest(this._config.dataQuery), Ajax.toRequest(quy));
                this._fire('loading', [query]);
                me._config.dataQuery = query;
                return new model.JsonProxy().execute({
                    method: query.method,
                    url: query.url
                }, me._newParams(query)).then(function (result) {
                    if (result.success()) {
                        me.total(result.total());
                        me.setData(result.data(), silent);
                        me._fire('loadsuccess', [result]);
                        let oldPage = me.getCurrentPage(), newPage = query.page;
                        if (oldPage != newPage)
                            me._fire('pagechanged', [newPage, oldPage]);
                    }
                    else {
                        me._fire('loadfailure', [result]);
                    }
                    return Promise.resolve(result);
                }).catch(function (err) {
                    me._fire('loaderror', [err]);
                });
            }
            reload() {
                return this.load(null);
            }
            loadPage(page, isForce) {
                if (!isForce && this.getCurrentPage() == page)
                    return;
                return this.load({ page: page });
            }
            total(total) {
                if (arguments.length == 0)
                    return this._cacheTotal || this.size();
                this._cacheTotal = total == void 0 ? null : total;
                return this;
            }
            pageSize(size) {
                let cfg = this._config, query = cfg.dataQuery;
                if (arguments.length == 0)
                    return query.pageSize;
                query.pageSize = size == void 0 ? Infinity : size;
                return this;
            }
            getCurrentPage() {
                let cfg = this._config;
                return cfg.dataQuery.page;
            }
            getPrevPage() {
                let page = this.getCurrentPage();
                return page <= 1 ? 1 : page - 1;
            }
            getNextPage() {
                let currentPage = this.getCurrentPage(), totalPages = this.getLastPage();
                return (currentPage + 1 > totalPages) ? totalPages : (currentPage + 1);
            }
            getFirstPage() {
                return 1;
            }
            getLastPage() {
                let total = this.total(), pageSize = this.pageSize();
                if (total == 0 || !isFinite(pageSize))
                    return 1;
                let max = Math.ceil(total / pageSize);
                return max == 0 ? 1 : max;
            }
            loadPrevPage() {
                return this.loadPage(this.getPrevPage());
            }
            loadNextPage() {
                return this.loadPage(this.getNextPage());
            }
            loadFirstPage() {
                return this.loadPage(1);
            }
            loadLastPage() {
                return this.loadPage(this.getLastPage());
            }
        };
        PageModel = __decorate([
            klass('JS.model.PageModel'),
            __metadata("design:paramtypes", [PageModelConfig])
        ], PageModel);
        model.PageModel = PageModel;
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var PageModel = JS.model.PageModel;
var PageModelConfig = JS.model.PageModelConfig;
var JS;
(function (JS) {
    let model;
    (function (model) {
        class ResultSet {
            constructor() {
                this._data = null;
                this._page = 1;
                this._pageSize = Infinity;
            }
            rawObject(response) {
                if (arguments.length == 0)
                    return this._rawObject;
                this._rawObject = response;
                return this;
            }
            data(data) {
                if (arguments.length == 0)
                    return this._data;
                this._data = data;
                return this;
            }
            count() {
                return this._data == void 0 ? 0 : (this._data['length'] || 0);
            }
            total(total) {
                if (arguments.length == 0)
                    return this._total;
                this._total = total;
                return this;
            }
            page(page) {
                if (arguments.length == 0)
                    return this._page;
                this._page = page;
                return this;
            }
            pageSize(pageSize) {
                if (arguments.length == 0)
                    return this._pageSize;
                this._pageSize = pageSize;
                return this;
            }
            version(v) {
                if (arguments.length == 0)
                    return this._version;
                this._version = v;
                return this;
            }
            lang(lang) {
                if (arguments.length == 0)
                    return this._lang;
                this._lang = lang;
                return this;
            }
            message(msg) {
                if (arguments.length == 0)
                    return this._msg;
                this._msg = msg;
                return this;
            }
            success(success) {
                if (arguments.length == 0)
                    return this._success;
                this._success = success;
                return this;
            }
            static parseJSON(raw, format) {
                if (!raw)
                    return null;
                const fmt = format || this.DEFAULT_FORMAT, root = Jsons.find(raw, fmt.rootProperty);
                let result = new ResultSet();
                result.lang(Jsons.find(root, fmt.langProperty));
                result.message(Jsons.find(root, fmt.messageProperty));
                result.version(Jsons.find(root, fmt.versionProperty));
                result.success(fmt.isSuccess ? fmt.isSuccess(root) : (root[fmt.successProperty] === (fmt.successCode || true)));
                result.data(Jsons.find(root, fmt.recordsProperty));
                result.rawObject(root);
                result.page(Jsons.find(root, fmt.pageProperty));
                result.pageSize(Jsons.find(root, fmt.pageSizeProperty));
                result.total(Jsons.find(root, fmt.totalProperty));
                return result;
            }
        }
        ResultSet.DEFAULT_FORMAT = {
            rootProperty: undefined,
            recordsProperty: 'data',
            totalProperty: 'paging.total',
            pageProperty: 'paging.page',
            pageSizeProperty: 'paging.pageSize',
            messageProperty: 'msg',
            versionProperty: 'version',
            langProperty: 'lang',
            successProperty: 'code',
            successCode: 'success'
        };
        model.ResultSet = ResultSet;
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var ResultSet = JS.model.ResultSet;
var JS;
(function (JS) {
    let model;
    (function (model) {
        let validator;
        (function (validator) {
            class ValidatorConfig {
            }
            validator.ValidatorConfig = ValidatorConfig;
            class Validator {
                constructor(cfg) {
                    this._cfg = cfg;
                }
                static create(type, cfg) {
                    return Class.newInstance({
                        'required': RequiredValidator,
                        'custom': CustomValidator,
                        'range': RangeValidator,
                        'format': FormatValidator,
                        'length': LengthValidator
                    }[type], cfg);
                }
            }
            validator.Validator = Validator;
            class ValidateResult {
                constructor() {
                    this._errors = [];
                }
                addError(field, msg) {
                    this._errors.push({ field: field, message: msg });
                }
                length() {
                    return this._errors.length;
                }
                hasError(field) {
                    if (!field)
                        return this.length() > 0;
                    return this.getErrors(field).length == 0;
                }
                clear() {
                    this._errors = [];
                }
                getErrors(field) {
                    let errs = this._errors;
                    if (errs.length < 1)
                        return [];
                    if (!field)
                        return errs;
                    let fields = [];
                    errs.forEach(e => {
                        if (e.field == field)
                            fields.push(e);
                    });
                    return fields;
                }
            }
            validator.ValidateResult = ValidateResult;
            class CustomValidatorConfig extends ValidatorConfig {
                constructor() {
                    super(...arguments);
                    this.allowEmpty = true;
                }
            }
            validator.CustomValidatorConfig = CustomValidatorConfig;
            class CustomValidator extends Validator {
                constructor(cfg) {
                    super(Jsons.union(new CustomValidatorConfig(), cfg));
                }
                validate(val) {
                    let cfg = this._cfg;
                    if ((Check.isEmpty(val) && !cfg.allowEmpty) || !cfg.validate(val))
                        return cfg.message || false;
                    return true;
                }
            }
            validator.CustomValidator = CustomValidator;
            class RequiredValidatorConfig extends ValidatorConfig {
            }
            validator.RequiredValidatorConfig = RequiredValidatorConfig;
            class RequiredValidator extends Validator {
                constructor(cfg) {
                    super(cfg);
                }
                validate(val) {
                    if (val == void 0 || Check.isEmpty(String(val).trim()))
                        return this._cfg.message || false;
                    return true;
                }
            }
            validator.RequiredValidator = RequiredValidator;
            class RangeValidatorConfig extends ValidatorConfig {
                constructor() {
                    super(...arguments);
                    this.allowEmpty = true;
                }
            }
            validator.RangeValidatorConfig = RangeValidatorConfig;
            class RangeValidator extends Validator {
                constructor(cfg) {
                    super(Jsons.union(new RangeValidatorConfig(), cfg));
                }
                validate(val) {
                    let cfg = this._cfg;
                    if ((Check.isEmpty(val) && !cfg.allowEmpty) || !Types.isNumeric(val))
                        return cfg.nanMessage;
                    let min = cfg.min, max = cfg.max;
                    val = Number(val == void 0 ? 0 : val);
                    if (min != void 0 && val < min)
                        return cfg.tooMinMessage;
                    if (max != void 0 && val > max)
                        return cfg.tooMaxMessage;
                    return true;
                }
            }
            validator.RangeValidator = RangeValidator;
            class LengthValidatorConfig extends ValidatorConfig {
                constructor() {
                    super(...arguments);
                    this.allowEmpty = true;
                }
            }
            validator.LengthValidatorConfig = LengthValidatorConfig;
            class LengthValidator extends Validator {
                constructor(cfg) {
                    super(Jsons.union(new LengthValidatorConfig(), cfg));
                }
                validate(val) {
                    let cfg = this._cfg;
                    if (Check.isEmpty(val)) {
                        return !cfg.allowEmpty ? (cfg.invalidTypeMessage || false) : true;
                    }
                    if (!Types.isString(val) && !Types.isArray(val))
                        return cfg.invalidTypeMessage || false;
                    let short = cfg.short, long = cfg.long, len = val ? val.length : 0;
                    if (short != void 0 && len < short)
                        return cfg.tooShortMessage || false;
                    if (long != void 0 && len > long)
                        return cfg.tooLongMessage || false;
                    return true;
                }
            }
            validator.LengthValidator = LengthValidator;
            class FormatValidatorConfig extends ValidatorConfig {
                constructor() {
                    super(...arguments);
                    this.allowEmpty = true;
                }
            }
            validator.FormatValidatorConfig = FormatValidatorConfig;
            class FormatValidator extends Validator {
                constructor(cfg) {
                    super(Jsons.union(new FormatValidatorConfig(), cfg));
                }
                validate(val) {
                    let cfg = this._cfg;
                    return (Check.isEmpty(val) && !cfg.allowEmpty) || !cfg.matcher.test(val) ? (cfg.message || false) : true;
                }
            }
            validator.FormatValidator = FormatValidator;
        })(validator = model.validator || (model.validator = {}));
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var ValidateResult = JS.model.validator.ValidateResult;
var Validator = JS.model.validator.Validator;
var CustomValidator = JS.model.validator.CustomValidator;
var RequiredValidator = JS.model.validator.RequiredValidator;
var RangeValidator = JS.model.validator.RangeValidator;
var LengthValidator = JS.model.validator.LengthValidator;
var FormatValidator = JS.model.validator.FormatValidator;
var JS;
(function (JS) {
    let view;
    (function (view) {
        class View {
            constructor() {
                this._widgets = {};
                this._eventBus = new EventBus(this);
            }
            initialize() { }
            destroy() {
                if (this._widgets) {
                    Jsons.forEach(this._widgets, w => {
                        w.destroy();
                    });
                }
            }
            config() {
                return this._config;
            }
            _fire(e, args) {
                return this._eventBus.fire(e, args);
            }
            render() {
                Bom.ready(() => {
                    this._fire('rendering');
                    this._render();
                    this._fire('rendered');
                });
            }
            getModel() {
                return this._model;
            }
            getWidget(id) {
                return this._widgets[id];
            }
            getWidgets() {
                return this._widgets;
            }
            addWidget(wgt) {
                if (wgt)
                    this._widgets[wgt.id] = wgt;
                return this;
            }
            removeWidget(id) {
                delete this._widgets[id];
                return this;
            }
            destroyWidget(id) {
                let w = this._widgets[id];
                if (!w)
                    return this;
                w.destroy();
                delete this._widgets.id;
                return this;
            }
            on(type, handler) {
                this._eventBus.on(type, handler);
            }
            off(type) {
                this._eventBus.off(type);
            }
            eachWidget(fn) {
                Jsons.forEach(this._widgets, (w) => {
                    fn.apply(this, [w]);
                });
            }
            _newWidget(id, cfg, defaults) {
                if (!id) {
                    JSLogger.error('The widget\'s id was empty when be inited!');
                    return null;
                }
                let vconfig = cfg, newConfig = Jsons.union(defaults, vconfig, { id: id }), klass = newConfig.klass || $1('#' + id).attr('jsfx-alias');
                if (!klass) {
                    JSLogger.error(`The widget<${id}> was not configured for its klass type!`);
                    return null;
                }
                this._fire('widgetiniting', [klass, newConfig]);
                let wgt = Class.aliasInstance(klass, newConfig);
                this._fire('widgetinited', [wgt]);
                return wgt;
            }
        }
        view.View = View;
    })(view = JS.view || (JS.view = {}));
})(JS || (JS = {}));
var View = JS.view.View;
var JS;
(function (JS) {
    let view;
    (function (view) {
        class FormView extends view.View {
            reset() {
                this.eachWidget((w) => {
                    if (w.reset)
                        w.reset();
                });
                return this;
            }
            clear() {
                this.eachWidget((w) => {
                    if (w.clear)
                        w.clear();
                });
                return this;
            }
            iniValues(values, render) {
                if (arguments.length == 0) {
                    let vals = {};
                    this.eachWidget((w) => {
                        if (w.iniValue)
                            vals[w.id] = w.iniValue();
                    });
                    return vals;
                }
                else {
                    if (values) {
                        Jsons.forEach(values, (val, id) => {
                            let w = this._widgets[id];
                            if (w && w.iniValue)
                                w.iniValue(val, render);
                        });
                    }
                    else {
                        this.eachWidget((w) => {
                            if (w.iniValue)
                                w.iniValue(null, render);
                        });
                    }
                }
                return this;
            }
            validate(id) {
                let wgts = this._widgets;
                if (Check.isEmpty(wgts))
                    return true;
                if (!id) {
                    let ok = true;
                    Jsons.forEach(wgts, (wgt) => {
                        if (this._validateWidget(wgt) !== true)
                            ok = false;
                    });
                    return ok;
                }
                return this._validateWidget(this._widgets[id]);
            }
            _validateWidget(wgt) {
                if (!wgt || !wgt.validate)
                    return true;
                return wgt.validate() === true;
            }
            getModel() {
                return this._model;
            }
            values(values) {
                if (arguments.length == 1) {
                    this._model.setData(values);
                    return this;
                }
                else {
                    let d = {};
                    this.eachWidget(w => {
                        if (w.value && w.isEnabled()) {
                            d[w.name()] =
                                w.isCrud && w.isCrud() ? w.crudValue() : w.value();
                        }
                    });
                    return d;
                }
            }
            _render() {
                if (this._config) {
                    let cfg = this._config;
                    Jsons.forEach(cfg.widgetConfigs, (config, id) => {
                        config['valueModel'] = this._model || this._config.valueModel;
                        let wgt = this._newWidget(id, config, cfg.defaultConfig);
                        if (wgt && wgt.valueModel && !this._model)
                            this._model = wgt.valueModel();
                        this.addWidget(wgt);
                    });
                    if (this._model) {
                        this._model.on('validated', (e, result, data) => {
                            this._fire('validated', [result, data]);
                        });
                        this._model.on('dataupdated', (e, newData, oldData) => {
                            this._fire('dataupdated', [newData, oldData]);
                        });
                    }
                }
            }
        }
        view.FormView = FormView;
    })(view = JS.view || (JS.view = {}));
})(JS || (JS = {}));
var FormView = JS.view.FormView;
var JS;
(function (JS) {
    let view;
    (function (view) {
        class PageView extends view.View {
            load(api) {
                return this.getWidget(this._config.id).load(api);
            }
            reload() {
                this.getWidget(this._config.id).reload();
                return this;
            }
            _render() {
                if (this._config) {
                    this._fire('widgetiniting', [this._config.klass, this._config]);
                    let wgt = Class.aliasInstance(this._config.klass, this._config);
                    this._fire('widgetinited', [wgt]);
                    this._model = wgt.dataModel();
                    this._model.on('dataupdated', (e, data) => {
                        this._fire('dataupdated', [data]);
                    });
                    this.addWidget(wgt);
                }
            }
        }
        view.PageView = PageView;
    })(view = JS.view || (JS.view = {}));
})(JS || (JS = {}));
var PageView = JS.view.PageView;
var JS;
(function (JS) {
    let view;
    (function (view) {
        class SimpleView extends view.View {
            _render() {
                if (this._config) {
                    let cfg = this._config;
                    Jsons.forEach(cfg.widgetConfigs, (config, id) => {
                        this.addWidget(this._newWidget(id, config, cfg.defaultConfig));
                    });
                }
            }
        }
        view.SimpleView = SimpleView;
    })(view = JS.view || (JS.view = {}));
})(JS || (JS = {}));
var SimpleView = JS.view.SimpleView;
var JS;
(function (JS) {
    let view;
    (function (view) {
        class TemplateView extends view.View {
            constructor() {
                super(...arguments);
                this._model = new ListModel();
            }
            initialize() {
                this._engine = new Templator();
                let me = this;
                this._model.on('dataupdated', function (e, newData, oldData) {
                    me._config.data = this.getData();
                    me.render();
                    me._fire('dataupdated', [newData, oldData]);
                });
            }
            data(data) {
                this._model.setData(data);
            }
            load(api) {
                return this._model.load(api);
            }
            _render() {
                let cfg = this._config;
                if (cfg && cfg.data && cfg.container && cfg.tpl) {
                    let html = this._engine.compile(cfg.tpl)(cfg.data), ctr = $1(cfg.container);
                    ctr.off().html('').html(html);
                    let wConfigs = cfg.widgetConfigs;
                    if (!Check.isEmpty(wConfigs))
                        ctr.findAll('[jsfx-alias]').forEach((el) => {
                            let realId = $1(el).attr('id'), prefixId = realId.replace(/(\d)*/g, '');
                            this.addWidget(this._newWidget(realId, wConfigs[prefixId], cfg.defaultConfig));
                        });
                }
            }
        }
        view.TemplateView = TemplateView;
    })(view = JS.view || (JS.view = {}));
})(JS || (JS = {}));
var TemplateView = JS.view.TemplateView;
