//@ sourceURL=jsfx.js
/**
* JSDK 2.0.0 
* https://github.com/fengboyue/jsdk/
* (c) 2007-2020 Frank.Feng<boyue.feng@foxmail.com>
* MIT license
*/
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let SizeMode;
        (function (SizeMode) {
            SizeMode["hg"] = "hg";
            SizeMode["lg"] = "lg";
            SizeMode["md"] = "md";
            SizeMode["sm"] = "sm";
            SizeMode["xs"] = "xs";
        })(SizeMode = fx.SizeMode || (fx.SizeMode = {}));
        let ColorMode;
        (function (ColorMode) {
            ColorMode["success"] = "success";
            ColorMode["danger"] = "danger";
            ColorMode["warning"] = "warning";
            ColorMode["info"] = "info";
            ColorMode["primary"] = "primary";
            ColorMode["secondary"] = "secondary";
            ColorMode["accent"] = "accent";
            ColorMode["metal"] = "metal";
            ColorMode["light"] = "light";
            ColorMode["dark"] = "dark";
        })(ColorMode = fx.ColorMode || (fx.ColorMode = {}));
        class WidgetConfig {
            constructor() {
                this.name = '';
                this.tip = '';
                this.style = '';
                this.cls = '';
                this.appendTo = 'body';
                this.renderTo = null;
                this.hidden = false;
                this.sizeMode = SizeMode.md;
                this.faceMode = null;
                this.locale = 'en';
                this.i18n = null;
            }
        }
        fx.WidgetConfig = WidgetConfig;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var SizeMode = JS.fx.SizeMode;
var ColorMode = JS.fx.ColorMode;
var WidgetConfig = JS.fx.WidgetConfig;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let Widget = class Widget {
            constructor(cfg) {
                this._config = null;
                this._initialConfig = null;
                this._isD = false;
                this._i18nBundle = null;
                if (!cfg.id && cfg.renderTo) {
                    let wgt = $(cfg.renderTo);
                    if (wgt.length == 1) {
                        this.widgetEl = wgt;
                        let id = wgt.attr('id');
                        if (id) {
                            this.id = id;
                        }
                        else {
                            this.id = Random.uuid(4, 10).toString();
                            wgt.attr('id', this.id);
                        }
                    }
                }
                else {
                    this.id = cfg.id || Random.uuid(4, 10).toString();
                }
                this._initConfig(cfg);
                this._onBeforeInit();
                this._initDom();
                this._onAfterInit();
            }
            _onBeforeInit() { }
            _onAfterInit() { }
            _initDom() {
                let cfg = this._config;
                this.widgetEl = $('#' + this.id);
                if (this.widgetEl.length == 0) {
                    this.widgetEl = $('<div />', {
                        id: this.id,
                        width: cfg.width,
                        height: cfg.height,
                        title: cfg.tip,
                        style: cfg.style,
                        'klass-name': this.className
                    }).appendTo(cfg.appendTo || 'body');
                }
                else {
                    let attrs = {};
                    if (cfg.tip)
                        attrs['title'] = cfg.tip;
                    if (cfg.style)
                        attrs['style'] = (this.widgetEl.attr('style') || '') + cfg.style;
                    if (!Check.isEmpty(attrs))
                        this.widgetEl.attr(attrs);
                    if (cfg.width)
                        this.widgetEl.css('width', cfg.width);
                }
                this._eventBus = new EventBus(this);
                let listeners = cfg.listeners;
                if (listeners && listeners.rendering)
                    this.on('rendering', listeners.rendering);
                this.render();
            }
            _initConfig(cfg) {
                let defaultCfg = Class.newInstance(this.className + 'Config');
                cfg.name = cfg.name || this.id;
                this._config = Jsons.union(defaultCfg, cfg);
                this._initialConfig = Jsons.clone(this._config);
            }
            initialConfig(key) {
                return Jsons.clone(key ? this._initialConfig[key] : this._initialConfig);
            }
            _onBeforeRender() { }
            _onAfterRender() { }
            render() {
                this._onBeforeRender();
                this._fire('rendering');
                this.off();
                this.widgetEl.off().empty();
                let cfg = this._config;
                this.widgetEl.addClass(`jsfx-${this.getClass().shortName.toLowerCase()} ${cfg.colorMode ? 'color-' + cfg.colorMode : ''} size-${cfg.sizeMode} ${cfg.cls || ''}`);
                let is = this._render();
                let lts = cfg.listeners || {};
                Jsons.forEach(lts, function (handler, type) {
                    if (handler)
                        this.on(type, handler);
                }, this);
                this._onAfterRender();
                if (is !== false)
                    this._fire('rendered');
                return this;
            }
            name() {
                return this._config.name || '';
            }
            _hasFaceMode(key, cfg) {
                cfg = cfg || this._config;
                let t = cfg.faceMode;
                if (!t)
                    return false;
                return t == key || t[key] === true || $.inArray(key, t) != -1;
            }
            _eachMode(type, fn, cfg) {
                cfg = cfg || this._config;
                let mode = cfg[type];
                if (!mode)
                    return;
                let me = this;
                if (Types.isArray(mode)) {
                    mode.forEach(m => {
                        fn.apply(this, [m]);
                    });
                }
                else {
                    fn.apply(me, [mode]);
                }
            }
            destroy() {
                this._fire('destroying');
                this._destroy();
                this._fire('destroyed');
            }
            _destroy() {
                this.off();
                this.widgetEl.remove();
                this._eventBus.destroy();
                this._isD = true;
            }
            show() {
                this._fire('showing');
                this.widgetEl.css('display', '');
                this._fire('shown');
                return this;
            }
            hide() {
                this._fire('hiding');
                this.widgetEl.css('display', 'none');
                this._fire('hidden');
                return this;
            }
            isShown() {
                return this.widgetEl.css('display') != 'none';
            }
            on(types, fn, once) {
                this._eventBus.on(types, fn, once);
                return this;
            }
            off(types) {
                this._eventBus.off(types);
                return this;
            }
            _fire(e, args) {
                return this._eventBus.fire(e, args);
            }
            _createBundle() {
                let defaults = new Bundle(this.getClass().getKlass()['I18N'], this._config.locale);
                if (!this._config.i18n)
                    return defaults;
                let b = new Bundle(this._config.i18n, this._config.locale);
                return defaults ? defaults.set(Jsons.union(defaults.get(), b.get())) : b;
            }
            _i18n(key) {
                if (!this._i18nBundle)
                    this._i18nBundle = this._createBundle();
                return this._i18nBundle ? this._i18nBundle.get(key) : undefined;
            }
            locale(locale) {
                if (arguments.length == 0)
                    return this._config.locale;
                this._config.locale = locale;
                if (locale !== this._config.locale)
                    this._i18nBundle = this._createBundle();
                return this;
            }
        };
        Widget.I18N = null;
        Widget = __decorate([
            klass('JS.fx.Widget'),
            __metadata("design:paramtypes", [fx.WidgetConfig])
        ], Widget);
        fx.Widget = Widget;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Widget = JS.fx.Widget;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class FormWidgetConfig extends fx.WidgetConfig {
            constructor() {
                super(...arguments);
                this.disabled = false;
                this.dataModel = ListModel;
                this.valueModel = Model;
                this.validators = [];
                this.autoValidate = false;
                this.validateMode = 'tip';
                this.readonly = false;
                this.titlePlace = 'left';
                this.titleTextPlace = 'rm';
                this.data = null;
                this.iniValue = null;
            }
        }
        fx.FormWidgetConfig = FormWidgetConfig;
        class FormWidget extends fx.Widget {
            constructor(cfg) {
                super(cfg);
            }
            iniValue(v, render) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.iniValue;
                cfg.iniValue = v;
                if (render)
                    this.value(v, true);
                return this;
            }
            readonly(is) {
                if (arguments.length == 0)
                    return this._config.readonly;
                this._mainEl.prop('readonly', is);
                this._config.readonly = is;
                return this;
            }
            _onBeforeInit() {
                this._initDataModel();
                this._initValueModel();
            }
            _onAfterInit() {
                let cfg = this._config;
                if (cfg.dataQuery)
                    this.load(cfg.dataQuery, true);
                cfg.disabled ? this.disable() : this.enable();
            }
            disable() {
                this._mainEl.prop('disabled', true);
                this._config.disabled = true;
                return this;
            }
            enable() {
                this._mainEl.prop('disabled', false);
                this._config.disabled = false;
                return this;
            }
            isEnabled() {
                return !this._config.disabled;
            }
            title(text) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.title;
                this.widgetEl.find('div[jsfx-role="title"]>span').html(text);
                cfg.title = text;
                return this;
            }
            _hAlign() {
                let al = this._config.titleTextPlace || 'lm';
                return { 'l': 'left', 'r': 'right', 'c': 'center' }[al.substr(0, 1)];
            }
            _vAlign() {
                let al = this._config.titleTextPlace || 'lm';
                return { 't': 'top', 'b': 'bottom', 'm': 'middle' }[al.substr(1, 1)];
            }
            _render() {
                let cfg = this._config, titleAttrs = cfg.tip ? ` title=${cfg.tip}` : '';
                if (cfg.title) {
                    let tValign = this._vAlign(), tHalign = this._hAlign(), p0 = tHalign == 'right' && cfg.titlePlace == 'top' ? 'p-0' : '', cls = `${p0} font-${cfg.sizeMode || 'md'} items-${tValign} items-${tHalign} ${cfg.colorMode ? 'text-' + cfg.colorMode : ''} ${cfg.titleCls || ''}"`;
                    let style = Types.isDefined(cfg.titleWidth) ? `width:${Lengths.toCssString(cfg.titleWidth, '100%')};` : '';
                    if (cfg.titleStyle)
                        style += cfg.titleStyle;
                    titleAttrs += ` class="${cls}"`;
                    if (style)
                        titleAttrs += ` style="${style}"`;
                }
                let html = `<div jsfx-role="title"${titleAttrs}>${cfg.title ? '<span>' + cfg.title + '</span>' : ''}</div> 
                    <div jsfx-role="body" class="font-${cfg.sizeMode || 'md'} items-middle ${cfg.bodyCls || ''}" style="flex:1;${cfg.bodyStyle || ''}">
                        ${this._bodyFragment()}
                    </div>`;
                this.widgetEl.html(html);
                this._mainEl = this.widgetEl.find('[jsfx-role=main]');
            }
            _onBeforeRender() {
                let cfg = this._config, w = Lengths.toCssString(cfg.width, '100%'), d = cfg.titlePlace == 'left' ? 'flex' : 'grid', css = {
                    'display': (w == 'auto' ? 'inline-' : '') + d,
                    'width': w
                };
                this.widgetEl.css(css);
            }
            _iniValue() {
                let cfg = this._config;
                this.value(cfg.iniValue, true);
            }
            _onAfterRender() {
                this.on('validated', (e, rst, val, name) => {
                    window.setTimeout(() => {
                        rst.hasError() ? this._showError(rst.getErrors(name)[0].message) : this._hideError();
                    }, 100);
                });
                this._iniValue();
            }
            _showError(msg) {
                let cfg = this._config, mode = cfg.validateMode, fn = (mode == 'tip' || (mode && mode['mode'] == 'tip')) ? this._showTipError : mode['showError'];
                if (fn)
                    fn.apply(this, [msg]);
            }
            _hideError() {
                let cfg = this._config, mode = cfg.validateMode, fn = (mode == 'tip' || (mode && mode['mode'] == 'tip')) ? this._hideTipError : mode['hideError'];
                if (fn)
                    fn.call(this);
            }
            _getTipEl(place) {
                let cfg = this._config;
                return this.widgetEl.find(cfg.titlePlace == 'left' && place == 'left' ? '[jsfx-role=title]>span' : '[jsfx-role=body]');
            }
            _showTipError(msg) {
                if (!msg)
                    return;
                let div = this.widgetEl.find('.error .tooltip-inner');
                if (div.length == 1) {
                    div.html(msg);
                }
                else {
                    let cfg = this._config, mode = cfg.validateMode, place = mode && mode['place'] ? mode['place'] : 'right', el = this._getTipEl(place);
                    el.tooltip({
                        placement: place,
                        offset: '0, 2px',
                        fallbackPlacement: 'clockwise',
                        container: el[0],
                        trigger: 'manual',
                        html: false,
                        title: msg,
                        template: '<div class="tooltip error" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
                    }).tooltip('show');
                }
            }
            _hideTipError() {
                let cfg = this._config, mode = cfg.validateMode, place = mode && mode['place'] ? mode['place'] : 'right', el = this._getTipEl(place);
                if (el.tooltip)
                    el.tooltip('dispose');
            }
            _validate(name, val, rst) {
                let field = new ModelField({
                    name: name,
                    validators: this._config.validators
                });
                return field.validate(val, rst);
            }
            validate() {
                if (Check.isEmpty(this._config.validators))
                    return true;
                let name = this.name(), rst = new ValidateResult(), val = Jsons.clone(this.value());
                this._fire('validating', [rst, val, name]);
                let vdt = this._validate(name, val, rst);
                this._fire('validated', [rst, val, name]);
                return vdt;
            }
            dataModel() {
                return this._dataModel;
            }
            _initDataModel() {
                let me = this, cfg = this._config;
                this._dataModel = Class.newInstance(cfg.dataModel);
                ['loading', 'loadsuccess', 'loadfailure', 'loaderror', 'dataupdating', 'dataupdated'].forEach(e => {
                    this._dataModel.on(e, function () {
                        if (e == 'dataupdated')
                            me.data(this.getData(), true);
                        me._fire(e, Arrays.slice(arguments, 1));
                    });
                });
            }
            data(data, silent) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.data;
                let newData = Jsons.clone(data), oldData = Jsons.clone(cfg.data);
                if (!silent)
                    this._fire('dataupdating', [newData, oldData]);
                cfg.data = data;
                if (this._dataModel)
                    this._dataModel.setData(data, true);
                this._renderData();
                this._renderValue();
                if (!silent)
                    this._fire('dataupdated', [newData, oldData]);
                return this;
            }
            _renderData() { }
            clear(silent) {
                return this.value(null, silent);
            }
            load(quy, silent) {
                let cfg = this._config;
                cfg.dataQuery = Jsons.union(Ajax.toRequest(cfg.dataQuery), Ajax.toRequest(quy));
                return this._dataModel.load(cfg.dataQuery, silent);
            }
            reload() {
                if (this._dataModel)
                    this._dataModel.reload();
                return this;
            }
            _equalValues(newVal, oldVal) {
                return oldVal == newVal;
            }
            value(val, silent) {
                let cfg = this._config, oldVal = this._valueModel.get(this.name());
                if (arguments.length == 0)
                    return oldVal;
                this._setValue(val, silent || this._equalValues(val, oldVal));
                this._renderValue();
                return this;
            }
            _setValue(val, silent) {
                this._hideError();
                this._valueModel.set(this.name(), val, silent || this._equalValues(val, this.value()));
                if (this._config.autoValidate)
                    this.validate();
            }
            _renderValue() {
                let v = this.value() || '';
                if (this._mainEl.val() !== v)
                    this._mainEl.val(v);
            }
            reset() {
                return this.value(this._config.iniValue);
            }
            valueModel() {
                return this._valueModel;
            }
            _initValueModel() {
                let cfg = this._config, vModel = cfg.valueModel;
                if (!vModel) {
                    this._valueModel = new Model();
                }
                else if (Types.subKlass(vModel, Model)) {
                    this._valueModel = Class.newInstance(vModel);
                }
                else {
                    this._valueModel = vModel;
                }
                this._valueModel.addField({
                    name: this.name(),
                    validators: cfg.validators
                });
                let me = this;
                this._valueModel.on('dataupdated', function (e, newData) {
                    let fName = me.name();
                    if (newData && newData.hasOwnProperty(fName)) {
                        me.value(newData[fName]);
                    }
                });
                this._valueModel.on('fieldchanged', (e, newVal, oldVal) => {
                    this._fire('changed', [newVal, oldVal]);
                });
            }
        }
        fx.FormWidget = FormWidget;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var FormWidgetConfig = JS.fx.FormWidgetConfig;
var FormWidget = JS.fx.FormWidget;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let ButtonFaceMode;
        (function (ButtonFaceMode) {
            ButtonFaceMode["square"] = "square";
            ButtonFaceMode["round"] = "round";
            ButtonFaceMode["round_left"] = "round-left";
            ButtonFaceMode["round_right"] = "round-right";
            ButtonFaceMode["pill"] = "pill";
            ButtonFaceMode["pill_left"] = "pill-left";
            ButtonFaceMode["pill_right"] = "pill-right";
            ButtonFaceMode["shadow"] = "shadow";
        })(ButtonFaceMode = fx.ButtonFaceMode || (fx.ButtonFaceMode = {}));
        class ButtonConfig extends fx.WidgetConfig {
            constructor() {
                super(...arguments);
                this.faceMode = ButtonFaceMode.square;
                this.outline = false;
                this.dropMenu = null;
                this.disabled = false;
            }
        }
        fx.ButtonConfig = ButtonConfig;
        let Button = class Button extends fx.Widget {
            constructor(cfg) {
                super(cfg);
            }
            _render() {
                let cfg = this._config, text = cfg.text || '', cls = 'btn btn-block', bdgAttr = '';
                if (cfg.colorMode)
                    cls += ` btn-${cfg.colorMode}`;
                if (cfg.outline)
                    cls += ' btn-outline';
                if (cfg.sizeMode)
                    cls += ` btn-${cfg.sizeMode}`;
                if (cfg.badge) {
                    let isStr = Types.isString(cfg.badge), bdg = {
                        text: isStr ? cfg.badge : cfg.badge.text || '',
                        color: isStr ? fx.ColorMode.danger : cfg.badge.color || fx.ColorMode.danger
                    };
                    cls += ' jsfx-badge jsfx-badge-' + bdg.color;
                    bdgAttr = ` data-badge="${bdg.text}"`;
                }
                if (cfg.dropMenu)
                    cls += ` dropdown-toggle`;
                this._eachMode('faceMode', mode => {
                    cls += ' border-' + mode;
                });
                if (cfg.cls)
                    cls += ' ' + cfg.cls;
                let icon = '';
                if (cfg.iconCls)
                    icon = `<i class="${cfg.iconCls}"></i>`;
                let button = `<button type="button" ${cfg.style ? 'style="' + cfg.style + '"' : ''} ${cfg.disabled ? 'disabled' : ''} ${bdgAttr} title="${cfg.tip}" ${cfg.dropMenu ? 'data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"' : ''} class="${cls}" jsfx-role="main">
                ${icon}${text ? (icon ? ` ${text}` : text) : ''}</button>`;
                if (cfg.dropMenu)
                    button = this._dropDown(button);
                this.widgetEl.html(button);
                this._mainEl = this.widgetEl.find('[jsfx-role=main]');
            }
            _onAfterRender() {
                this._mainEl.on('click', () => {
                    return this._fire('click');
                });
            }
            _dropDown(buttonHtml) {
                let dropDown = this._config.dropMenu, html = `
                    <div class="btn-group ${'drop' + (dropDown.dir || 'down')}">
                        ${buttonHtml}
                        <div class="dropdown-menu">
                        ${this._dropDownItems(dropDown.items)}
                        </div>
                    </div>
                `;
                return html;
            }
            _dropDownItems(items) {
                if (!Types.isDefined(items))
                    return '';
                let html = '';
                items.forEach((item, i) => {
                    html += this._dropDownItem(item, i);
                });
                return html;
            }
            _dropDownItem(item, index) {
                let id = 'dropdown-item' + index + '-' + Random.uuid(3, 10), span = item.html || `${item.iconCls ? `<i class="${item.iconCls}"></i>` : ''}<span class="">${Strings.escapeHTML(item.text)}</span>`, html = '';
                if (item.caption)
                    html += `<h6 class='dropdown-header'>${Strings.escapeHTML(item.caption)}</h6>`;
                html += `<a class='dropdown-item ${this._config.colorMode} ${item.selected ? 'active' : ''}' id='${id}'  href='${item.href ? encodeURI(item.href) : 'javascript:void(0);'}'>${span}</a>`;
                if (item.hasDivider)
                    html += `<div class='dropdown-divider'></div>`;
                let me = this;
                if (item.onClick)
                    $(document).on('click', '#' + id, function (e) {
                        return item.onClick.apply(me, [e.originalEvent, item]);
                    });
                return html;
            }
            disable() {
                this._mainEl.prop('disabled', true);
                this._config.disabled = true;
                return this;
            }
            enable() {
                this._mainEl.prop('disabled', false);
                this._config.disabled = false;
                return this;
            }
            toggle() {
                let d = this._mainEl.find('.dropdown-toggle');
                if (d.length < 1)
                    return;
                d.dropdown('toggle');
                return this;
            }
            badge(option) {
                if (arguments.length == 0) {
                    return this._mainEl.attr('data-badge');
                }
                else if (Check.isEmpty(option)) {
                    this._mainEl.removeAttr('data-badge');
                }
                else {
                    let isStr = Types.isString(option), bdg = {
                        text: isStr ? option : option.text || '',
                        color: isStr ? fx.ColorMode.danger : option.color || fx.ColorMode.danger
                    };
                    this._mainEl.addClass('jsfx-badge jsfx-badge-' + bdg.color);
                    bdg.text ? this._mainEl.attr('data-badge', bdg.text) : this._mainEl.removeAttr('data-badge');
                }
                return this;
            }
        };
        Button = __decorate([
            widget('JS.fx.Button'),
            __metadata("design:paramtypes", [ButtonConfig])
        ], Button);
        fx.Button = Button;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Button = JS.fx.Button;
var ButtonConfig = JS.fx.ButtonConfig;
var ButtonFaceMode = JS.fx.ButtonFaceMode;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let SelectFaceMode;
        (function (SelectFaceMode) {
            SelectFaceMode["square"] = "square";
            SelectFaceMode["round"] = "round";
            SelectFaceMode["pill"] = "pill";
            SelectFaceMode["shadow"] = "shadow";
        })(SelectFaceMode = fx.SelectFaceMode || (fx.SelectFaceMode = {}));
        class SelectOption {
            constructor() {
                this.selected = false;
                this.disabled = false;
            }
        }
        fx.SelectOption = SelectOption;
        class SelectConfig extends fx.FormWidgetConfig {
            constructor() {
                super(...arguments);
                this.rtl = false;
                this.outline = false;
                this.autoSelectFirst = false;
                this.crud = false;
                this.multiple = false;
                this.allowClear = false;
                this.maximumSelectionLength = Infinity;
                this.autoSearch = false;
                this.minimumInputLength = 0;
                this.inputable = false;
                this.autoEscape = true;
            }
        }
        fx.SelectConfig = SelectConfig;
        let Select = class Select extends fx.FormWidget {
            constructor(cfg) {
                super(cfg);
            }
            load(api) {
                if (this._config.autoSearch)
                    throw new Errors.NotHandledError('The method be not supported when autoSearch is true!');
                return super.load(api);
            }
            iniValue(v, render) {
                if (arguments.length == 0)
                    return super.iniValue();
                return super.iniValue(v, render);
            }
            _destroy() {
                this._mainEl.select2('destroy');
                super._destroy();
            }
            _bodyFragment() {
                let cfg = this._config, cls = '';
                if (cfg.colorMode) {
                    if (cfg.outline)
                        cls += ' outline';
                    cls += ` ${cfg.colorMode}`;
                }
                this._eachMode('faceMode', (mode) => {
                    cls += ' face-' + mode;
                });
                return `<div class="w-100 font-${cfg.sizeMode || 'md'} ${cls}">
                            <select name="${this.name()}" jsfx-role="main" class="form-control"></select>
                        </div>`;
            }
            _onAfterRender() {
                this._initSelect2();
                this._renderData();
                let me = this;
                this._mainEl.on('change', function (e, data) {
                    if (data == '_jsfx')
                        return;
                    let nv = $(this).val();
                    me._setValue(Check.isEmpty(nv) ? null : nv);
                });
                let evts = ['selected', 'unselected'];
                ['select2:select', 'select2:unselect'].forEach((type, i) => {
                    this._mainEl.on(type, e => {
                        me._fire(evts[i], [e.params.data]);
                    });
                });
                super._onAfterRender();
            }
            _optionHtml(data) {
                let html = '';
                data.forEach(op => {
                    if (op.children) {
                        let childrenHtml = this._optionHtml(op.children);
                        html += `<optgroup label="${op.text}">${childrenHtml}</optgroup>`;
                    }
                    else {
                        html += `<option value="${op.id}" ${op.disabled ? 'disabled' : ''} ${op.selected ? 'selected' : ''}>${op.text}</option>`;
                    }
                });
                return html;
            }
            _initSelect2() {
                let cfg = this._config, dataQuery = cfg.dataQuery, url = dataQuery ? (Types.isString(dataQuery) ? dataQuery : dataQuery.url) : null, jsonParams = dataQuery ? (Types.isString(dataQuery) ? null : dataQuery.data) : null, options = {
                    disabled: cfg.disabled,
                    allowClear: cfg.allowClear,
                    width: '100%',
                    minimumInputLength: cfg.minimumInputLength < 1 ? 1 : cfg.minimumInputLength,
                    language: cfg.locale,
                    placeholder: cfg.placeholder,
                    multiple: cfg.multiple,
                    tags: cfg.inputable,
                    tokenSeparators: [' ']
                };
                let cls = 'jsfx-select ' + ' ' + (cfg.colorMode || '') + ' font-' + (cfg.sizeMode || 'md') + (cfg.cls || '');
                this._eachMode('faceMode', (mode) => {
                    cls += ' border-' + mode;
                });
                options.dropdownCssClass = cls;
                if (cfg.rtl)
                    options.dir = 'rtl';
                if (!cfg.autoSearch) {
                    options.minimumResultsForSearch = Infinity;
                    options.minimumInputLength = 0;
                }
                if (!cfg.autoEscape) {
                    options.escapeMarkup = (c) => { return c; };
                }
                let me = this;
                if (cfg.optionRender)
                    options.templateResult = function (data, el) {
                        return cfg.optionRender.apply(me, [data, el]);
                    };
                if (cfg.selectionRender)
                    options.templateSelection = function (data, el) {
                        return cfg.selectionRender.apply(me, [data, el]);
                    };
                if (cfg.autoSearch && url)
                    options.ajax = {
                        url: function (pms) {
                            return url + (pms.term || '');
                        },
                        dataType: 'json',
                        delay: 500,
                        data: function () { return jsonParams ? jsonParams : {}; },
                        processResults: (res, params) => {
                            let data = Jsons.getValueByPath(res, ResultSet.DEFAULT_FORMAT.recordsProperty);
                            this.data(data);
                            return {
                                results: data
                            };
                        },
                        cache: true
                    };
                this._mainEl.select2(options);
            }
            addOption(opt) {
                return this.data([opt], false, 'append');
            }
            addOptions(data) {
                return this.data(data, false, 'append');
            }
            removeOption(id) {
                return this.data([id], false, 'remove');
            }
            removeOptions(ids) {
                return this.data(ids, false, 'remove');
            }
            select(i, silent) {
                let cfg = this._config;
                if (i < 0 || Check.isEmpty(cfg.data) || i >= cfg.data.length)
                    return;
                this.value('' + cfg.data[i].id, silent);
            }
            isCrud() {
                let cfg = this._config;
                return cfg.multiple && cfg.crud;
            }
            crudValue() {
                if (!this.isCrud())
                    return null;
                let val = Arrays.toArray(this.value()), iniVal = Arrays.toArray(this.iniValue()), arr = [];
                iniVal.forEach((v) => {
                    if (val.findIndex(it => {
                        return it == v;
                    }) < 0) {
                        arr[arr.length] = {
                            _crud: 'D',
                            id: v
                        };
                    }
                });
                val.forEach((v) => {
                    if (iniVal.findIndex(it => {
                        return it == v;
                    }) < 0) {
                        arr[arr.length] = {
                            _crud: 'C',
                            id: v
                        };
                    }
                });
                return arr;
            }
            data(data, silent, mode) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.data;
                let newData, newDataCopy, oldData = Jsons.clone(cfg.data);
                if (mode == 'append') {
                    let tmp = Jsons.clone(cfg.data) || [];
                    newData = tmp.add(data);
                    newDataCopy = Jsons.clone(newData);
                }
                else if (mode == 'remove') {
                    let tmp = Jsons.clone(cfg.data) || [];
                    data.forEach(id => {
                        tmp.remove(item => {
                            return item.id == id;
                        });
                    });
                    newData = tmp;
                    newDataCopy = Jsons.clone(newData);
                }
                else {
                    newData = data;
                    newDataCopy = Jsons.clone(newData);
                }
                if (!silent)
                    this._fire('dataupdating', [newDataCopy, oldData]);
                cfg.data = newData;
                if (this._dataModel)
                    this._dataModel.setData(newData, true);
                this._renderDataBy(mode ? data : newData, mode);
                this._renderValue();
                if (!silent)
                    this._fire('dataupdated', [newDataCopy, oldData]);
                return this;
            }
            _iniValue() {
                let cfg = this._config;
                if (cfg.autoSelectFirst && cfg.data && cfg.data.length > 0)
                    cfg.iniValue = '' + cfg.data[0].id;
                super._iniValue();
            }
            _renderData() {
                this._renderDataBy(this._config.data);
            }
            _renderDataBy(data, mode) {
                if (data) {
                    if (!mode)
                        this._mainEl.empty();
                    if (mode != 'remove') {
                        this._mainEl.append(this._optionHtml(data));
                    }
                    else {
                        data.forEach(id => {
                            this._mainEl.find(`option[value="${id}"]`).remove();
                        });
                    }
                }
                else {
                    if (mode != 'remove')
                        this._mainEl.empty();
                }
            }
            _renderValue() {
                let v = this.value();
                if (!this._equalValues(v, this._mainEl.val()))
                    this._mainEl.val(v).trigger('change', '_jsfx');
            }
            _equalValues(newVal, oldVal) {
                if (Check.isEmpty(oldVal) && Check.isEmpty(newVal))
                    return true;
                let cfg = this._config;
                return cfg.multiple ? Arrays.equalToString(oldVal, newVal) : oldVal == newVal;
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value();
                let cfg = this._config;
                if ((cfg.multiple && Types.isString(val)) || (!cfg.multiple && Types.isArray(val)))
                    throw new Errors.TypeError(`Wrong value type for select<${this.id}>!`);
                return super.value(val, silent);
            }
            _showError(msg) {
                super._showError(msg);
                this.widgetEl.find('.select2-selection').addClass('jsfx-input-error');
            }
            _hideError() {
                super._hideError();
                this.widgetEl.find('.select2-selection').removeClass('jsfx-input-error');
            }
        };
        Select = __decorate([
            widget('JS.fx.Select'),
            __metadata("design:paramtypes", [SelectConfig])
        ], Select);
        fx.Select = Select;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Select = JS.fx.Select;
var SelectFaceMode = JS.fx.SelectFaceMode;
var SelectOption = JS.fx.SelectOption;
var SelectConfig = JS.fx.SelectConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let SwitchFaceMode;
        (function (SwitchFaceMode) {
            SwitchFaceMode["shadow"] = "shadow";
        })(SwitchFaceMode = fx.SwitchFaceMode || (fx.SwitchFaceMode = {}));
        class SwitchConfig extends fx.FormWidgetConfig {
            constructor() {
                super(...arguments);
                this.iniValue = 'off';
            }
        }
        fx.SwitchConfig = SwitchConfig;
        let Switch = class Switch extends fx.FormWidget {
            constructor(config) {
                super(config);
            }
            _onAfterRender() {
                let me = this;
                this._mainEl.on('change', function () {
                    let is = $(this).is(':checked');
                    me._setValue(is ? 'on' : 'off');
                    me._fire(is ? 'on' : 'off');
                });
                super._onAfterRender();
            }
            _bodyFragment() {
                let cls = '', cfg = this._config;
                if (this._hasFaceMode(SwitchFaceMode.shadow))
                    cls += ' border-shadow';
                return `<input name="${this.name()}" jsfx-role="main" type="checkbox" class="${cls}" ${cfg.readonly ? 'readonly' : ''}/>`;
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value() || 'off';
                return super.value(val, silent);
            }
            _renderValue() {
                this._mainEl.prop('checked', this.value() == 'on');
            }
            toggle() {
                let v = this.value();
                return this.value(v == 'on' ? 'off' : 'on');
            }
        };
        Switch = __decorate([
            widget('JS.fx.Switch'),
            __metadata("design:paramtypes", [SwitchConfig])
        ], Switch);
        fx.Switch = Switch;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Switch = JS.fx.Switch;
var SwitchFaceMode = JS.fx.SwitchFaceMode;
var SwitchConfig = JS.fx.SwitchConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        var Uploader_1;
        let UploaderFaceMode;
        (function (UploaderFaceMode) {
            UploaderFaceMode["list"] = "list";
            UploaderFaceMode["image"] = "image";
            UploaderFaceMode["square"] = "square";
            UploaderFaceMode["round"] = "round";
            UploaderFaceMode["shadow"] = "shadow";
        })(UploaderFaceMode = fx.UploaderFaceMode || (fx.UploaderFaceMode = {}));
        class UploaderConfig extends fx.FormWidgetConfig {
            constructor() {
                super(...arguments);
                this.readonly = false;
                this.dnd = false;
                this.paste = false;
                this.thumb = { width: 1, height: 1 };
                this.duplicate = true;
                this.multiple = false;
                this.fieldName = 'file';
                this.faceMode = [UploaderFaceMode.square, UploaderFaceMode.list];
                this.iniValue = null;
                this.data = null;
            }
        }
        fx.UploaderConfig = UploaderConfig;
        let Uploader = Uploader_1 = class Uploader extends fx.FormWidget {
            constructor(cfg) {
                super(cfg);
            }
            _initUploader(cfg) {
                if (this._uploader)
                    return;
                let me = this;
                $('#' + this.id).find('.classic-pick').on('click', function () {
                    $('#' + me.id).find('.webuploader-element-invisible').click();
                });
                let url = JS.config('libs')['webuploader.swf'];
                url = url.startsWith('~') ? (JS.config('libRoot') || '') + url.slice(1) : url;
                let cf = {
                    pick: {
                        id: `#${this.id} .pick`,
                        multiple: cfg.multiple
                    },
                    paste: cfg.paste == true ? `#${this.id}` : (cfg.paste == 'body' ? document.body : undefined),
                    dnd: cfg.dnd ? `#${this.id}` : undefined,
                    swf: url,
                    auto: true,
                    accept: cfg.accept || null,
                    fileNumLimit: cfg.maxNumbers || undefined,
                    fileSizeLimit: cfg.maxTotalSize || undefined,
                    fileSingleSizeLimit: cfg.maxSingleSize || undefined,
                    disableGlobalDnd: false,
                    duplicate: cfg.duplicate,
                    fileVal: cfg.fieldName,
                    formData: cfg.uploadData || {},
                    thumb: {
                        width: cfg.thumb && cfg.thumb.width,
                        height: cfg.thumb && cfg.thumb.height,
                        allowMagnify: false,
                        crop: false,
                        type: ''
                    },
                    compress: cfg.compress && cfg.compress.width && cfg.compress.height ? {
                        width: cfg.compress.width,
                        height: cfg.compress.height,
                        quality: 90,
                        allowMagnify: false,
                        crop: false,
                        preserveHeaders: true,
                        noCompressIfLarger: true,
                        compressSize: 0
                    } : false
                };
                this._uploader = WebUploader.Uploader.create(cf);
                let eMap = Uploader_1._EVENTS_MAP;
                this._uploader.on(eMap.get('adding'), function (file) {
                    return me._fire('adding', [me._toMimeFile(file)]);
                });
                this._uploader.on(eMap.get('added'), function (files) {
                    files.forEach((file) => {
                        me._onFileQueued(file);
                    });
                    me._fire('added', [me._toMimeFiles(files)]);
                });
                this._uploader.on(eMap.get('removed'), function (file) {
                    me._onFileDequeued(file);
                    me._fire('removed', [me._toMimeFile(file)]);
                });
                this._uploader.on(eMap.get('uploading'), function (file, percentage) {
                    me._fire('uploading', [me._toMimeFile(file), percentage]);
                });
                this._uploader.on(eMap.get('uploaderror'), function (file, reason) {
                    me._onUploadFail(file);
                    me._fire('uploaderror', [me._toMimeFile(file), reason]);
                });
                this._uploader.on(eMap.get('uploadsuccess'), function (file, response) {
                    me._onUploadSuccess(file, response);
                    me._fire('uploadsuccess', [me._toMimeFile(file), response]);
                });
                this._uploader.on(eMap.get('uploaded'), function (file) {
                    me._fire('uploaded', [me._toMimeFile(file)]);
                });
                this._uploader.on(eMap.get('beginupload'), function () {
                    me._fire('beginupload');
                });
                this._uploader.on(eMap.get('endupload'), function () {
                    me._fire('endupload');
                });
                let errors = {
                    'F_EXCEED_SIZE': 'exceedMaxSize',
                    'F_DUPLICATE': 'wrongDuplicate',
                    'Q_TYPE_DENIED': 'wrongType',
                    'Q_EXCEED_NUM_LIMIT': 'exceedNumbers',
                    'Q_EXCEED_SIZE_LIMIT': 'exceedMaxTotalSize'
                };
                this._uploader.on('error', (type) => {
                    fx.Toast.show({ type: 'error', message: me._i18n(errors[type]), place: 'cb' });
                });
            }
            _showError(msg) {
                super._showError(msg);
                this.widgetEl.find('.body').addClass('jsfx-input-error');
            }
            _hideError() {
                super._hideError();
                this.widgetEl.find('.body').removeClass('jsfx-input-error');
            }
            _onAfterRender() {
                this._initUploader(this._config);
                super._onAfterRender();
            }
            _createShadow(id, ctor) {
                return $(`<div id="${id}"></div>`).css({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: "#808080",
                    opacity: 0.1,
                    zIndex: (Number(ctor.css('z-index')) || 0) + 1
                });
            }
            readonly(is) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.readonly;
                if (cfg.readonly == is)
                    return this;
                cfg.readonly = is;
                $(`#${this.id} .body`)[is ? 'addClass' : 'removeClass']('readonly');
                let p = $(`#${this.id} .pick`);
                is ? p.hide() : p.show();
                return this;
            }
            disable() {
                if (!this.isEnabled())
                    return this;
                this._config.disabled = true;
                let ctor = $(`#${this.id} .body`).addClass('disabled');
                this._createShadow(this.id + '_shadow', ctor).appendTo(ctor);
                return this;
            }
            enable() {
                if (this.isEnabled())
                    return this;
                this._config.disabled = false;
                $(`#${this.id} .body`).removeClass('disabled');
                $('#' + this.id + '_shadow').remove();
                return this;
            }
            _pickText(key) {
                let cfg = this._config, fileExts = (cfg.accept && cfg.accept.title) || '*', maxTotalSize = cfg.maxTotalSize ? Files.toSizeString(cfg.maxTotalSize) : '*', maxNumbers = cfg.maxNumbers || '*', maxSingleSize = cfg.maxSingleSize ? Files.toSizeString(cfg.maxSingleSize) : '*';
                return Strings.merge(this._i18n(key) || '', {
                    fileExts: fileExts,
                    maxTotalSize: maxTotalSize,
                    maxNumbers: maxNumbers,
                    maxSingleSize: maxSingleSize
                });
            }
            _bodyFragment() {
                let cfg = this._config, title = this._pickText('pickTitle'), tip = this._pickText('pickTip').replace(/\n/g, '&#10;'), fag = !this._hasFaceMode(UploaderFaceMode.image) ?
                    `<ul class="files-area list"></ul>` :
                    `<div class="files-area image"></div>`, cls = '';
                if (this._hasFaceMode(UploaderFaceMode.shadow))
                    cls += ' border-shadow';
                if (this._hasFaceMode(UploaderFaceMode.round))
                    cls += ' border-round';
                return `
                <div class="body font-${cfg.sizeMode || 'md'}${cls}">
                    <div class="pick" title="${tip}">
                        <i class="la la-cloud-upload"></i>
                        <span class="pick-title">${title}</span>
                    </div>
                    ${fag}
                </div>`;
            }
            isCrud() {
                return true;
            }
            crudValue() {
                let val = this.value() || [], iniVal = this.iniValue() || [], arr = [];
                iniVal.forEach(v => {
                    if (val.findIndex(it => {
                        return it.id == v.id;
                    }) < 0) {
                        arr[arr.length] = Jsons.union(v, { _crud: 'D' });
                    }
                });
                val.forEach(v => {
                    if (iniVal.findIndex(it => {
                        return it.id == v.id;
                    }) < 0) {
                        if (!v.id.startsWith('WU_FILE_') && v.id != v['_wuid'])
                            arr[arr.length] = Jsons.union(v, { _crud: 'C' });
                    }
                });
                return arr;
            }
            iniValue(v, render) {
                if (arguments.length == 0)
                    return super.iniValue();
                return super.iniValue(v, render);
            }
            value(file) {
                if (arguments.length == 0)
                    return super.value();
                if (Check.isEmpty(file)) {
                    this._uploader.reset();
                    $(`#${this.id} .files-area`).children().remove();
                    this._setValue(null);
                    return this;
                }
                return this.add(file);
            }
            _equalValues(newVal, oldVal) {
                return Arrays.equal(oldVal, newVal, (file1, file2) => {
                    return file1.id == file2.id;
                });
            }
            add(file) {
                if (Check.isEmpty(file))
                    return this;
                this._addFiles(Arrays.toArray(file));
                return this;
            }
            remove(id) {
                if (Check.isEmpty(id))
                    return this;
                let rms = Arrays.toArray(id);
                rms.forEach(i => {
                    let el = this.widgetEl.find(`[file-id="${i}"]`);
                    if (el.length == 1)
                        this._removeFile(el.attr('wu-id'));
                });
                return this;
            }
            data(data) {
                if (arguments.length == 0)
                    return this.value();
                return this.value(data);
            }
            _onUploadSuccess(wuFile, res) {
                let cfg = this._config, fmt = cfg.dataFormat, result = Types.isFunction(fmt) ? fmt.apply(this, res) : ResultSet.parseJSON(res, fmt);
                if (result.success()) {
                    let file = result.data(), val = this.value() || [], index = val.findIndex(item => {
                        return wuFile.id == item.id;
                    });
                    if (index >= 0) {
                        let oFile = val[index];
                        oFile.id = file.id;
                        oFile.uri = file.uri;
                    }
                }
                else {
                    this._onUploadFail(wuFile);
                }
            }
            _onUploadFail(file) {
                this.widgetEl.find(`[file-id="${file.id}"]`).addClass('fail');
            }
            _onFileDequeued(file) {
                this.widgetEl.find(`[wu-id="${file.id}"]`).remove();
                let newVal = Jsons.clone(this.value()).remove((mFile) => { return mFile['_wuid'] == file.id; });
                this._valueModel.set(this.name(), newVal);
            }
            _fileIcon(path) {
                let icon = 'alt';
                if (Files.isFileExt(path, 'pdf')) {
                    icon = 'pdf';
                }
                else if (Files.isFileExt(path, 'doc,docx')) {
                    icon = 'word';
                }
                else if (Files.isFileExt(path, 'xls,xlsx')) {
                    icon = 'excel';
                }
                else if (Files.isFileExt(path, 'ppt,pptx')) {
                    icon = 'powerpoint';
                }
                else if (Files.isAudioFile(path)) {
                    icon = 'audio';
                }
                else if (Files.isVideoFile(path)) {
                    icon = 'video';
                }
                else if (Files.isCompressedFile(path)) {
                    icon = 'archive';
                }
                else if (Files.isSourceFile(path)) {
                    icon = 'code';
                }
                else if (Files.isImageFile(path)) {
                    icon = 'image';
                }
                return '<span><i class="far fa-file-' + icon + '"></i></span>';
            }
            _onFileQueued(wuFile) {
                let file = this._toMimeFile(wuFile);
                this._renderFile(file);
                if (this._hasFaceMode(UploaderFaceMode.image)) {
                    let isImage = Files.isImageFile(file.name);
                    if (!file.uri && isImage) {
                        this._makeThumb(wuFile);
                    }
                    else if (!isImage)
                        this.widgetEl.find(`[file-id=${file.id}] img`).replaceWith(this._fileIcon('.' + file.ext));
                }
                if (file.uri)
                    this._uploader.skipFile(wuFile.id);
                file['_wuid'] = wuFile.id;
                this.widgetEl.find('[file-id]:last-child').attr('wu-id', wuFile.id);
                this._setValue((this.value() || []).concat(file));
            }
            _renderFile(file) {
                let url = file.uri || '', fId = file.id || '', fileLink = `<a id="${this.id}-${fId}" src="${url}" href="javascript:void(0);">${file.name}</a>`, retryTip = this._i18n('retryTip') || 'Retry', removeTip = this._i18n('removeTip') || 'Remove', html = !this._hasFaceMode(UploaderFaceMode.image) ?
                    $(`<li file-id="${fId}">
                    <div class="text-truncate file-name" title="${Strings.escapeHTML(file.name)}">
                        ${this._fileIcon('.' + file.ext)}
                        ${fileLink}
                    </div>
                    <div class="file-actions">
                        <span class="action remove text-center" title="${removeTip}"><i class="fa fa-times"></i></span>
                        <span class="action retry text-center" title="${retryTip}"><i class="fa fa-upload"></i></span>
                    </div>
                </li>`)
                    : $(`
                    <div file-id="${fId}">
                    <div class="file-image-area">
                        <div class="file-image items-center items-middle"><img id="${this.id}-${fId}" src="${url}"/></div>
                        <div class="file-actions">
                            <span class="action remove text-center" title="${removeTip}"><i class="fa fa-times"></i></span>
                            <span class="action retry text-center" title="${retryTip}"><i class="fa fa-upload"></i></span>
                        </div>
                    </div>
                    <div class="text-truncate file-name" title="${Strings.escapeHTML(file.name)}">
                    ${fileLink}
                    </div>
                    </div>
                `);
                this.widgetEl.find(`.files-area`).append(html);
                this._bindActions(fId);
            }
            _makeThumb(file) {
                this._uploader.makeThumb(file, (error, src) => {
                    let el = this.widgetEl.find(`[file-id=${file.id}]`);
                    if (error) {
                        el.find('img').replaceWith(this._fileIcon('.' + file.ext));
                        return;
                    }
                    el.find(`#${this.id}-${file.id}`).attr('src', src);
                });
            }
            _bindActions(fileId) {
                let fEl = this.widgetEl.find(`[file-id="${fileId}"]`);
                fEl.on('click', !this._hasFaceMode(UploaderFaceMode.image) ? 'a' : 'a,.file-image', (e) => {
                    let src = this.widgetEl.find(`#${this.id}-${fileId}`).attr('src');
                    if (src) {
                        (Files.isImageFile(src) || src.indexOf('data:image/') == 0) ? window.open().document.body.innerHTML = `<img src="${src}" >` : window.open(src);
                    }
                    else {
                        fx.Toast.show({
                            type: 'error',
                            message: this._i18n('viewDenied')
                        });
                    }
                    return false;
                });
                fEl.on('click', '.action.remove', (e) => {
                    this._removeFile(fEl.attr('wu-id'));
                    fEl.remove();
                    return false;
                });
                fEl.on('click', '.action.retry', (e) => {
                    this._retryFile(fEl.attr('wu-id'));
                    return false;
                });
            }
            _toMimeFiles(wfs) {
                if (Check.isEmpty(wfs))
                    return [];
                let fs = [];
                wfs.forEach(file => {
                    fs.push(this._toMimeFile(file));
                });
                return fs;
            }
            _toMimeFile(wf) {
                if (!wf)
                    return null;
                return {
                    id: wf.source.id || wf.id,
                    mime: wf.type,
                    name: wf.name,
                    ext: wf.ext,
                    size: wf.size,
                    uri: wf.source.uri
                };
            }
            _toWUFile(cf) {
                if (!cf)
                    return null;
                if (!cf.uri)
                    throw new Errors.URIError(`The file<${cf.name}> has not URI.`);
                let file = {
                    id: cf.id,
                    type: cf.mime,
                    name: cf.name,
                    ext: cf.ext || Files.getExt(cf.name),
                    size: cf.size || 1,
                    getRuid: () => { return ''; },
                    getSource: () => { return null; }
                };
                file['uri'] = cf.uri;
                return file;
            }
            _removeFile(wuFileId) {
                let f = this._uploader.getFile(wuFileId);
                if (f)
                    this._uploader.removeFile(f, true);
                return this;
            }
            _retryFile(wuFileId) {
                let f = this._uploader.getFile(wuFileId);
                if (f)
                    this._uploader.retry(f);
                return this;
            }
            _addFiles(files) {
                if (Check.isEmpty(files))
                    return this;
                let wuFiles = [], value = this.value() || [];
                files.forEach(f => {
                    if (value.findIndex((v) => { return v.id == f.id; }) < 0)
                        wuFiles.push(new WebUploader.File(this._toWUFile(f)));
                });
                if (wuFiles.length > 0)
                    this._uploader.addFiles(wuFiles);
                return this;
            }
            inProgress() {
                return this._uploader.isInProgress();
            }
        };
        Uploader._EVENTS_MAP = new BiMap([
            ['adding', 'beforeFileQueued'],
            ['added', 'filesQueued'],
            ['removed', 'fileDequeued'],
            ['uploading', 'uploadStart'],
            ['uploadprogress', 'uploadProgress'],
            ['uploadsuccess', 'uploadSuccess'],
            ['uploaderror', 'uploadError'],
            ['uploaded', 'uploadComplete'],
            ['beginupload', 'startUpload'],
            ['endupload', 'uploadFinished']
        ]);
        Uploader.I18N = {
            pickTitle: 'Select your local files please',
            pickTip: '<Accepts>\nFileExts={fileExts}\nMaxTotalSize={maxTotalSize}\nMaxNumbers={maxNumbers}\nMaxSingleSize={maxSingleSize}',
            retryTip: 'Retry',
            removeTip: 'Remove',
            viewDenied: 'The file can\'t be viewed in local mode',
            exceedMaxSize: 'Exceed the max size of single file',
            wrongDuplicate: 'Can\'t upload duplicate file',
            wrongType: 'Wrong file type',
            exceedNumbers: 'Exceed the max numbers of file',
            exceedMaxTotalSize: 'Exceed the max size of total files'
        };
        Uploader = Uploader_1 = __decorate([
            widget('JS.fx.Uploader'),
            __metadata("design:paramtypes", [UploaderConfig])
        ], Uploader);
        fx.Uploader = Uploader;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Uploader = JS.fx.Uploader;
var UploaderConfig = JS.fx.UploaderConfig;
var UploaderFaceMode = JS.fx.UploaderFaceMode;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let ProgressFaceMode;
        (function (ProgressFaceMode) {
            ProgressFaceMode["square"] = "square";
            ProgressFaceMode["round"] = "round";
            ProgressFaceMode["striped"] = "striped";
            ProgressFaceMode["animated"] = "animated";
        })(ProgressFaceMode = fx.ProgressFaceMode || (fx.ProgressFaceMode = {}));
        class ProgressConfig extends fx.FormWidgetConfig {
            constructor() {
                super(...arguments);
                this.iniValue = 0;
            }
        }
        fx.ProgressConfig = ProgressConfig;
        let Progress = class Progress extends fx.FormWidget {
            constructor(config) {
                super(config);
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value();
                val = val || 0;
                if (val > 1 || val < 0)
                    throw new Errors.RangeError('Progress value must in [0,1]!');
                let newVal = val ? val.round(2) : 0;
                this._setValue(newVal, silent);
                this._mainEl.css('width', newVal * 100 + '%');
                this._mainEl.text(newVal ? newVal * 100 + '%' : '');
                return this;
            }
            height(val) {
                if (arguments.length == 0)
                    return this._mainEl.parent().css('height');
                this._mainEl.parent().css('height', val);
                this._config.height = val;
                return this;
            }
            _bodyFragment() {
                let cfg = this._config, cls = `progress ${cfg.sizeMode || ''}`, barCls = 'progress-bar', val = cfg.iniValue || 0;
                if (this._hasFaceMode(ProgressFaceMode.square))
                    cls += ' border-square';
                if (this._hasFaceMode(ProgressFaceMode.striped))
                    barCls += ' progress-bar-striped';
                if (this._hasFaceMode(ProgressFaceMode.animated))
                    barCls += ' progress-bar-striped progress-bar-animated';
                if (cfg.colorMode)
                    barCls += ` bg-${cfg.colorMode}`;
                return `
                <div class="${cls}" ${cfg.height ? 'style="height:' + cfg.height + 'px"' : ''}>
                    <div class="${barCls} ${cfg.disabled ? 'disabled' : ''}" style="width:${val * 100}%" jsfx-role="main" role="progressbar">${val ? (val * 100 + '%') : ''}</div>
                </div>
                `;
            }
            disable() {
                this._mainEl.addClass('disabled');
                this._config.disabled = true;
                return this;
            }
            enable() {
                this._mainEl.removeClass('disabled');
                this._config.disabled = false;
                return this;
            }
        };
        Progress = __decorate([
            widget('JS.fx.Progress'),
            __metadata("design:paramtypes", [ProgressConfig])
        ], Progress);
        fx.Progress = Progress;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Progress = JS.fx.Progress;
var ProgressFaceMode = JS.fx.ProgressFaceMode;
var ProgressConfig = JS.fx.ProgressConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let RangeSliderFaceMode;
        (function (RangeSliderFaceMode) {
            RangeSliderFaceMode["flat"] = "flat";
            RangeSliderFaceMode["big"] = "big";
            RangeSliderFaceMode["modern"] = "modern";
            RangeSliderFaceMode["sharp"] = "sharp";
            RangeSliderFaceMode["round"] = "round";
            RangeSliderFaceMode["square"] = "square";
        })(RangeSliderFaceMode = fx.RangeSliderFaceMode || (fx.RangeSliderFaceMode = {}));
        class RangeSliderConfig extends fx.FormWidgetConfig {
            constructor() {
                super(...arguments);
                this.faceMode = RangeSliderFaceMode.round;
            }
        }
        fx.RangeSliderConfig = RangeSliderConfig;
        let RangeSlider = class RangeSlider extends fx.FormWidget {
            constructor(cfg) {
                super(cfg);
            }
            _getFromTo() {
                let arr = Arrays.toArray(this.value()), from = arr.length > 0 ? arr[0] : null, to = arr.length > 1 ? arr[1] : null;
                return [from, to];
            }
            _transfer() {
                let cfg = this._config, fromTo = this._getFromTo();
                return {
                    type: cfg.type,
                    min: cfg.data[0],
                    max: cfg.data[1],
                    from: fromTo[0],
                    to: fromTo[1],
                    step: cfg.step,
                    keyboard: false,
                    grid: cfg.scaled,
                    grid_margin: true,
                    grid_num: cfg.scales,
                    grid_snap: false,
                    drag_interval: true,
                    min_interval: cfg.minInterval,
                    max_interval: cfg.maxInterval,
                    from_fixed: cfg.fromFixed,
                    from_min: cfg.fromMin,
                    from_max: cfg.fromMax,
                    from_shadow: cfg.fromShadow,
                    to_fixed: cfg.toFixed,
                    to_min: cfg.toMin,
                    to_max: cfg.toMax,
                    to_shadow: cfg.toShadow,
                    skin: cfg.faceMode || 'round',
                    hide_min_max: cfg.hideMinMax,
                    hide_from_to: cfg.hideFromTo,
                    force_edges: true,
                    extra_classes: cfg.sliderCls,
                    block: cfg.readonly,
                    prettify_enabled: cfg.format ? true : false,
                    prettify_separator: Types.isString(cfg.format) ? cfg.format : ' ',
                    prettify: Types.isFunction(cfg.format) ? cfg.format : null,
                    prefix: cfg.dataPrefix,
                    postfix: cfg.dataPostfix,
                    max_postfix: cfg.maxValuePostfix,
                    decorate_both: cfg.closeValuesDecorate,
                    values_separator: cfg.closeValuesSeparator,
                    input_values_separator: cfg.valuesSeparator,
                    disable: cfg.disabled,
                    scope: this,
                    onFinish: (data) => {
                        let cfg = this._config, v = cfg.type == 'double' ? [data.from, data.to] : data.from;
                        this._setValue(v);
                    }
                };
            }
            _destroy() {
                this._slider.destroy();
                super._destroy();
            }
            _bodyFragment() {
                let cfg = this._config;
                if (!cfg.data)
                    cfg.data = [0, 100];
                return `<input name="${this.name()}" type="text" jsfx-role="main" data-min="${cfg.data[0]}" data-max="${cfg.data[1]}"/>`;
            }
            _onBeforeRender() {
                if (this._slider)
                    this._slider.destroy();
                super._onBeforeRender();
            }
            _onAfterRender() {
                if (this._config.colorMode)
                    this.widgetEl.find('[jsfx-role=body]').addClass(this._config.colorMode);
                this._mainEl.ionRangeSlider(this._transfer());
                this._slider = this._mainEl.data('ionRangeSlider');
                super._onAfterRender();
            }
            _iniValue() {
                let cfg = this._config, type = cfg.type, min = this.minValue(), max = this.maxValue();
                if (cfg.iniValue == null)
                    cfg.iniValue = type == 'double' ? [min, max] : min;
                super._iniValue();
            }
            data(data, silent) {
                if (arguments.length == 0)
                    return super.data();
                if (data == null)
                    data = [0, 100];
                return super.data(data, silent);
            }
            _renderData() {
                let data = this._config.data, min = this._mainEl.data('min'), max = this._mainEl.data('max');
                if (data && (min + '-' + max) != (data[0] + '-' + data[1])) {
                    this._slider.update({
                        min: data[0],
                        max: data[1]
                    });
                    this._mainEl.data({
                        min: data[0],
                        max: data[1]
                    });
                }
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value();
                let cfg = this._config;
                if (val != null) {
                    let min = this.minValue(), max = this.maxValue();
                    if (cfg.type == 'double') {
                        if (val[0] < min)
                            val[0] = min;
                        if (val[1] > max)
                            val[1] = max;
                    }
                    else {
                        if (val < min) {
                            val = min;
                        }
                        else if (val > max) {
                            val = max;
                        }
                    }
                }
                return super.value(val, silent);
            }
            _renderValue() {
                let cfg = this._config, fromTo = this._getFromTo(), sValue = cfg.type == 'double' ? (fromTo[0] || '' + cfg.valuesSeparator + fromTo[1] || '') : String(fromTo[0] || '');
                if (sValue != this._mainEl.prop('value'))
                    this._slider.update({
                        from: fromTo[0], to: fromTo[1]
                    });
            }
            maxValue() {
                return this._config.data[1];
            }
            minValue() {
                return this._config.data[0];
            }
        };
        RangeSlider = __decorate([
            widget('JS.fx.RangeSlider'),
            __metadata("design:paramtypes", [RangeSliderConfig])
        ], RangeSlider);
        fx.RangeSlider = RangeSlider;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var RangeSliderFaceMode = JS.fx.RangeSliderFaceMode;
var RangeSliderConfig = JS.fx.RangeSliderConfig;
var RangeSlider = JS.fx.RangeSlider;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class ChoiceConfig extends fx.FormWidgetConfig {
        }
        fx.ChoiceConfig = ChoiceConfig;
        class Choice extends fx.FormWidget {
            constructor(cfg) {
                super(cfg);
            }
            _bodyFragment() {
                let isList = this._hasFaceMode('list') ? true : false;
                return `<div class="jsfx-choice-${isList ? 'list' : 'inline'}"> </div>`;
            }
            _choicesHtml(type) {
                let cfg = this._config, data = cfg.data;
                if (!data)
                    return '';
                let val = Arrays.toArray(this.value()), html = '', textColor = cfg.textColorMode ? 'text-' + cfg.textColorMode : '', mode1 = this._hasFaceMode('round') ? 'round' : 'square', mode2 = this._hasFaceMode('ring') ? 'ring' : 'dot', disable = cfg.disabled ? 'disabled' : '';
                data.forEach((d, i) => {
                    html += `
                    <label class="font-${cfg.sizeMode || 'md'} ${mode1} ${mode2} ${cfg.colorMode || ''} ${textColor} ${disable}">
                        <input id="${this.id}_${i}" name="${this.name()}" ${disable} ${val.findIndex(it => { return it == d.id; }) >= 0 ? 'checked' : ''} type="${type}" value="${d.id}"/>
                        <span class="text">${d.text || ''}</span>
                        <span class="choice"></span>
                    </label>`;
                });
                return html;
            }
            isSelected() {
                return !Check.isEmpty(this.value());
            }
            _renderData(type) {
                this.widgetEl.find('[jsfx-role=body]>div').off().empty().html(this._choicesHtml(type));
                if (!this.readonly()) {
                    let el = this.widgetEl.find('input');
                    el.on('change', () => {
                        this._setValue(this._getDomValue());
                    }).on('click', () => {
                        this._setValue(this._getDomValue(), true);
                        this._fire('click');
                    });
                }
            }
            _renderValue() {
                let cVal = this.value(), v = Arrays.toArray(cVal), val = Arrays.toArray(this._getDomValue());
                if (!Arrays.same(val, v)) {
                    this._setDomValue(cVal);
                }
            }
            _onAfterRender() {
                this._renderData();
                super._onAfterRender();
            }
            disable() {
                this._config.disabled = true;
                this.widgetEl.find('input').prop('disabled', true);
                this.widgetEl.find('label').addClass('disabled');
                return this;
            }
            enable() {
                this._config.disabled = false;
                this.widgetEl.find('input').prop('disabled', false);
                this.widgetEl.find('label').removeClass('disabled');
                return this;
            }
            readonly(is) {
                if (arguments.length == 0)
                    return this._config.readonly;
                this.widgetEl.find('input').prop('readonly', is);
                this._config.readonly = is;
                return this;
            }
        }
        fx.Choice = Choice;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Choice = JS.fx.Choice;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class CheckboxConfig extends fx.ChoiceConfig {
            constructor() {
                super(...arguments);
                this.faceMode = CheckboxFaceMode.inline;
            }
        }
        fx.CheckboxConfig = CheckboxConfig;
        let CheckboxFaceMode;
        (function (CheckboxFaceMode) {
            CheckboxFaceMode["square"] = "square";
            CheckboxFaceMode["round"] = "round";
            CheckboxFaceMode["inline"] = "inline";
            CheckboxFaceMode["list"] = "list";
        })(CheckboxFaceMode = fx.CheckboxFaceMode || (fx.CheckboxFaceMode = {}));
        let Checkbox = class Checkbox extends fx.Choice {
            _getDomValue() {
                let v = [], els = this.widgetEl.find('input:checked');
                els.each((i, el) => {
                    v.push($(el).val());
                });
                return v;
            }
            _setDomValue(v) {
                this.widgetEl.find('input').each((i, el) => {
                    let n = $(el);
                    n.prop('checked', !Check.isEmpty(v) && v.findIndex(it => { return it == n.val(); }) > -1 ? true : false);
                });
            }
            constructor(cfg) {
                super(cfg);
            }
            _equalValues(newVal, oldVal) {
                return Arrays.same(newVal, oldVal);
            }
            _renderData() {
                super._renderData('checkbox');
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value();
                return super.value(val || [], silent);
            }
            select(val) {
                if (Check.isEmpty(val)) {
                    let v = [], els = this.widgetEl.find('input:checkbox');
                    els.each((i, el) => {
                        v.push($(el).val());
                    });
                    this._setDomValue(v);
                }
                else {
                    this.unselect();
                    let oldVal = this.value() || [], addVal = Arrays.toArray(val);
                    addVal.forEach(v => {
                        if (oldVal.findIndex(it => { return it == v; }) == -1)
                            oldVal.push(v);
                    });
                    this.value(oldVal);
                }
                return this;
            }
            unselect(val) {
                if (!val) {
                    this.value(null);
                }
                else {
                    let oldVal = this.value() || [], delVal = Arrays.toArray(val);
                    delVal.forEach(v => {
                        oldVal.remove(it => {
                            return it == v;
                        });
                    });
                    this.value(oldVal);
                }
                return this;
            }
        };
        Checkbox = __decorate([
            widget('JS.fx.Checkbox'),
            __metadata("design:paramtypes", [CheckboxConfig])
        ], Checkbox);
        fx.Checkbox = Checkbox;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var CheckboxConfig = JS.fx.CheckboxConfig;
var CheckboxFaceMode = JS.fx.CheckboxFaceMode;
var Checkbox = JS.fx.Checkbox;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class RadioConfig extends fx.ChoiceConfig {
            constructor() {
                super(...arguments);
                this.faceMode = RadioFaceMode.inline;
            }
        }
        fx.RadioConfig = RadioConfig;
        let RadioFaceMode;
        (function (RadioFaceMode) {
            RadioFaceMode["dot"] = "dot";
            RadioFaceMode["ring"] = "ring";
            RadioFaceMode["inline"] = "inline";
            RadioFaceMode["list"] = "list";
        })(RadioFaceMode = fx.RadioFaceMode || (fx.RadioFaceMode = {}));
        let Radio = class Radio extends fx.Choice {
            _getDomValue() {
                return this.widgetEl.find('input:checked').val();
            }
            _setDomValue(v) {
                v ? this.widgetEl.find(`input[value=${v}]`).prop('checked', true) : this.widgetEl.find('input').prop('checked', false);
            }
            constructor(cfg) {
                super(cfg);
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value();
                return super.value(val, silent);
            }
            _renderData() {
                super._renderData('radio');
            }
            select(val) {
                return this.value(val);
            }
            unselect() {
                return this.value(null);
            }
        };
        Radio = __decorate([
            widget('JS.fx.Radio'),
            __metadata("design:paramtypes", [RadioConfig])
        ], Radio);
        fx.Radio = Radio;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var RadioConfig = JS.fx.RadioConfig;
var RadioFaceMode = JS.fx.RadioFaceMode;
var Radio = JS.fx.Radio;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        ;
        class InputConfig extends fx.FormWidgetConfig {
            constructor() {
                super(...arguments);
                this.inputCls = '';
                this.inputStyle = '';
                this.maxlength = Infinity;
                this.placeholder = '';
                this.autoclear = true;
                this.autofocus = false;
                this.outline = false;
            }
        }
        fx.InputConfig = InputConfig;
        class Input extends fx.FormWidget {
            constructor(cfg) {
                super(cfg);
            }
            maxlength(len) {
                if (arguments.length == 0)
                    return this._config.maxlength;
                this._mainEl.prop('maxlength', len);
                this._config.maxlength = len;
                return this;
            }
            placeholder(holder) {
                if (arguments.length == 0)
                    return this._config.placeholder;
                holder = holder || '';
                this._config.placeholder = holder;
                this._mainEl.attr('placeholder', holder);
                return this;
            }
        }
        fx.Input = Input;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var InputConfig = JS.fx.InputConfig;
var Input = JS.fx.Input;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let LineInputFaceMode;
        (function (LineInputFaceMode) {
            LineInputFaceMode["square"] = "square";
            LineInputFaceMode["round"] = "round";
            LineInputFaceMode["pill"] = "pill";
            LineInputFaceMode["shadow"] = "shadow";
        })(LineInputFaceMode = fx.LineInputFaceMode || (fx.LineInputFaceMode = {}));
        class LineInputConfig extends fx.InputConfig {
            constructor() {
                super(...arguments);
                this.inputCls = '';
                this.inputStyle = '';
                this.textAlign = 'left';
                this.faceMode = LineInputFaceMode.square;
            }
        }
        fx.LineInputConfig = LineInputConfig;
        class LineInput extends fx.Input {
            constructor(cfg) {
                super(cfg);
            }
            _inputAttrs(type = 'text') {
                let cfg = this._config, cls = '', shape = LineInputFaceMode.square;
                this._eachMode('faceMode', mode => {
                    cls += ' border-' + mode;
                    if (mode != LineInputFaceMode.shadow)
                        shape = mode;
                });
                if (cfg.leftAddon || cfg.rightAddon)
                    cls += ` border-${cfg.leftAddon ? 'square' : shape}-left border-${cfg.rightAddon ? 'square' : shape}-right`;
                let color = cfg.colorMode;
                if (color)
                    cls += ` ${cfg.outline ? 'border' : 'focus'}-${color}`;
                let style = `text-align:${cfg.textAlign};${cfg.inputStyle}`;
                return {
                    'jsfx-role': 'main',
                    type: type,
                    placeholder: Strings.escapeHTML(cfg.placeholder),
                    autofocus: cfg.autofocus ? 'autofocus' : undefined,
                    readonly: cfg.readonly ? 'readonly' : undefined,
                    disabled: cfg.disabled ? 'disabled' : undefined,
                    maxlength: Number.isFinite(cfg.maxlength) && cfg.maxlength > 0 ? cfg.maxlength + '' : '',
                    style: style,
                    'class': `form-control ${cls} ${cfg.inputCls}`,
                    'data-toggle': 'tooltip',
                    'data-trigger': 'hover focus'
                };
            }
            _inputHtml(type = 'text') {
                return Strings.nodeHTML('input', this._inputAttrs(type));
            }
            _iconHtml(icon, id, lr) {
                if (!icon)
                    return '';
                let me = this, cfg = this._config;
                if (icon.onClick)
                    $(document).on('click', '#' + id, function (e) {
                        if (me.isEnabled())
                            icon.onClick.apply(me, [e.originalEvent, this]);
                        return false;
                    });
                let display = id.endsWith('-clear') && (this.readonly() || !this.isEnabled() || Check.isEmpty(this.value())) ? 'style="display:none;"' : '';
                return `<span id="${id}" title="${icon.tip || ''}" ${display} class="jsfx-input-icon ${lr}-icon">
                <span><i class="${icon.cls} ${cfg.colorMode ? 'text-' + cfg.colorMode : ''}"></i></span></span>`;
            }
            _inputGroup(type) {
                let cfg = this._config, cls = 'jsfx-input-div', innerIcon = Types.isString(cfg.innerIcon) ? { cls: cfg.innerIcon } : cfg.innerIcon, clearIcon = cfg.autoclear ? {
                    cls: 'fas fa-times-circle',
                    tip: 'Clear',
                    onClick: function (e, el) {
                        this.clear();
                        $(el).hide();
                        return false;
                    }
                } : null, leftIcon = cfg.textAlign == 'right' ? clearIcon : innerIcon, rightIcon = cfg.textAlign == 'right' ? innerIcon : clearIcon;
                if (leftIcon)
                    cls += ' left-icon';
                if (rightIcon)
                    cls += ' right-icon';
                return `
                    <div class="${cls}">
                    ${this._inputHtml(type)}
                    ${this._iconHtml(leftIcon, this.id + '-icon' + (cfg.textAlign == 'right' ? '-clear' : ''), 'left')}
                    ${this._iconHtml(rightIcon, this.id + '-icon' + (cfg.textAlign == 'right' ? '' : '-clear'), 'right')}
                    </div>`;
            }
            _bodyFragment(type = 'text') {
                let cfg = this._config, cls = 'jsfx-input-group input-group font-' + (cfg.sizeMode || 'md');
                return `<div class="${cls}">
                            ${cfg.leftAddon ? '<div id="' + this.id + '-btn-left" class="input-group-prepend"/>' : ''}
                            ${this._inputGroup(type)}
                            ${cfg.rightAddon ? '<div id="' + this.id + '-btn-right" class="input-group-append"/>' : ''}
                        </div>`;
            }
            _render() {
                super._render();
                this._renderAddons();
            }
            _onAfterRender() {
                let cfg = this._config;
                if (cfg.autoclear)
                    this._mainEl.on('change input focus blur', () => {
                        if (cfg.disabled || cfg.readonly)
                            return;
                        let clear = $('#' + this.id + '-icon-clear');
                        Check.isEmpty(this._mainEl.val()) ? clear.hide() : clear.show();
                    });
                super._onAfterRender();
            }
            _renderAddon(cfg, id, isLeft) {
                cfg['sizeMode'] = this._config.sizeMode || 'md';
                let fm = [];
                if (this._hasFaceMode('shadow'))
                    fm.push('shadow');
                fm.push(fx.ButtonFaceMode.square);
                if (this._hasFaceMode('round', cfg)) {
                    fm.push(isLeft ? fx.ButtonFaceMode.round_left : fx.ButtonFaceMode.round_right);
                }
                else if (this._hasFaceMode('round')) {
                    fm.push(isLeft ? fx.ButtonFaceMode.round_left : fx.ButtonFaceMode.round_right);
                }
                else if (this._hasFaceMode('pill', cfg)) {
                    fm.push(isLeft ? fx.ButtonFaceMode.pill_left : fx.ButtonFaceMode.pill_right);
                }
                else if (this._hasFaceMode('pill')) {
                    fm.push(isLeft ? fx.ButtonFaceMode.pill_left : fx.ButtonFaceMode.pill_right);
                }
                cfg.faceMode = fm;
                if (!cfg.onClick && !cfg.dropMenu)
                    cfg['style'] = 'cursor:default;';
                cfg['id'] = id;
                cfg.colorMode = cfg.colorMode || this._config.colorMode || fx.ColorMode.primary;
                let btn = new fx.Button(cfg);
                if (cfg.onClick)
                    btn.on('click', () => {
                        cfg.onClick.apply(this);
                    });
            }
            _toAddon(addon) {
                return Types.isString(addon) ? { text: addon } : addon;
            }
            _renderAddons() {
                let cfg = this._config;
                if (cfg.leftAddon)
                    this._renderAddon(this._toAddon(cfg.leftAddon), this.id + '-btn-left', true);
                if (cfg.rightAddon)
                    this._renderAddon(this._toAddon(cfg.rightAddon), this.id + '-btn-right', false);
            }
            _showError(msg) {
                super._showError(msg);
                this._mainEl.addClass('jsfx-input-error');
                this.widgetEl.find('[jsfx-role=body]').find('.jsfx-input-icon i').addClass('text-danger');
            }
            _hideError() {
                super._hideError();
                this._mainEl.removeClass('jsfx-input-error');
                this.widgetEl.find('[jsfx-role=body]').find('.jsfx-input-icon i').removeClass('text-danger');
            }
        }
        fx.LineInput = LineInput;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var LineInputFaceMode = JS.fx.LineInputFaceMode;
var LineInputConfig = JS.fx.LineInputConfig;
var LineInput = JS.fx.LineInput;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class TextInputConfig extends fx.LineInputConfig {
        }
        fx.TextInputConfig = TextInputConfig;
        let TextInput = class TextInput extends fx.LineInput {
            constructor(cfg) {
                super(cfg);
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value();
                return super.value(val, silent);
            }
            _onAfterRender() {
                this._mainEl.off('input change paste').on('input change paste', () => {
                    this._setValue(this._mainEl.val());
                });
                super._onAfterRender();
            }
        };
        TextInput = __decorate([
            widget('JS.fx.TextInput'),
            __metadata("design:paramtypes", [TextInputConfig])
        ], TextInput);
        fx.TextInput = TextInput;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var TextInput = JS.fx.TextInput;
var TextInputConfig = JS.fx.TextInputConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class EmailInputConfig extends fx.TextInputConfig {
            constructor() {
                super(...arguments);
                this.multiple = false;
                this.innerIcon = 'fa fa-envelope-o';
            }
        }
        fx.EmailInputConfig = EmailInputConfig;
        let EmailInput = class EmailInput extends fx.TextInput {
            constructor(cfg) {
                super(cfg);
            }
            _bodyFragment() {
                return super._bodyFragment('email');
            }
            _onAfterRender() {
                super._onAfterRender();
                this._mainEl.prop('multiple', this._config.multiple);
            }
        };
        EmailInput = __decorate([
            widget('JS.fx.EmailInput'),
            __metadata("design:paramtypes", [EmailInputConfig])
        ], EmailInput);
        fx.EmailInput = EmailInput;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var EmailInput = JS.fx.EmailInput;
var EmailInputConfig = JS.fx.EmailInputConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class TelInputConfig extends fx.LineInputConfig {
            constructor() {
                super(...arguments);
                this.innerIcon = 'fa fa-mobile';
            }
        }
        fx.TelInputConfig = TelInputConfig;
        let TelInput = class TelInput extends fx.TextInput {
            constructor(cfg) {
                super(cfg);
            }
            _bodyFragment() {
                return super._bodyFragment('tel');
            }
        };
        TelInput = __decorate([
            widget('JS.fx.TelInput'),
            __metadata("design:paramtypes", [TelInputConfig])
        ], TelInput);
        fx.TelInput = TelInput;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var TelInput = JS.fx.TelInput;
var TelInputConfig = JS.fx.TelInputConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class NumberInputConfig extends fx.LineInputConfig {
            constructor() {
                super(...arguments);
                this.min = -Infinity;
                this.max = Infinity;
                this.step = 1;
                this.iniValue = 0;
                this.fractionDigits = Infinity;
                this.textAlign = 'right';
            }
        }
        fx.NumberInputConfig = NumberInputConfig;
        let NumberInput = class NumberInput extends fx.LineInput {
            constructor(cfg) {
                super(cfg);
            }
            _onAfterRender() {
                let cfg = this._config;
                this.min(cfg.min);
                this.max(cfg.max);
                this.step(cfg.step);
                this._mainEl.off('input change paste').on('input change paste', () => {
                    this._setValue(this._mainEl.val());
                });
                super._onAfterRender();
            }
            _bodyFragment() {
                return super._bodyFragment('number');
            }
            min(min) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.min;
                if (!Number.isFinite(min))
                    return;
                if (min > this.max())
                    throw new Errors.RangeError('The min value greater than max value!');
                cfg.min = min;
                this._mainEl.prop('min', cfg.min);
                return cfg.min;
            }
            max(max) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.max;
                if (!Number.isFinite(max))
                    return;
                if (max < this.min())
                    throw new Errors.RangeError('The max value less than min value!');
                cfg.max = max;
                this._mainEl.prop('max', cfg.max);
                return cfg.max;
            }
            step(st) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.step;
                cfg.step = st;
                this._mainEl.prop('step', cfg.step);
                return cfg.step;
            }
            value(val, silent) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return super.value();
                let v = val == void 0 ? null : Math.min(Math.max(Number(val), cfg.min), cfg.max);
                return super.value(v == null ? null : v.round(cfg.fractionDigits), silent);
            }
            _renderValue() {
                let cfg = this._config, v = this.value();
                if (v == null) {
                    this._mainEl.val('');
                }
                else {
                    let s = v.format(cfg.fractionDigits);
                    if (this._mainEl.val() !== s)
                        this._mainEl.val(s);
                }
            }
        };
        NumberInput = __decorate([
            widget('JS.fx.NumberInput'),
            __metadata("design:paramtypes", [NumberInputConfig])
        ], NumberInput);
        fx.NumberInput = NumberInput;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var NumberInput = JS.fx.NumberInput;
var NumberInputConfig = JS.fx.NumberInputConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class PasswordConfig extends fx.TextInputConfig {
            constructor() {
                super(...arguments);
                this.visible = true;
            }
        }
        fx.PasswordConfig = PasswordConfig;
        let Password = class Password extends fx.TextInput {
            constructor(cfg) {
                super(cfg);
                this._visible = false;
            }
            _render() {
                let cfg = this._config;
                if (cfg.visible)
                    cfg.innerIcon = {
                        cls: this.visible() ? 'fa fa-eye' : 'fa fa-eye-slash',
                        onClick: () => {
                            this.toggleVisible();
                        }
                    };
                super._render();
            }
            _bodyFragment() {
                return super._bodyFragment('password');
            }
            visible(visible) {
                if (!this._config.visible || arguments.length == 0)
                    return this._visible;
                this._visible = visible;
                this._mainEl.prop('type', visible ? 'text' : 'password');
                let icon = $('#' + this.id + '-icon-left').find('i');
                if (visible) {
                    icon.removeClass('fa-eye-slash').addClass('fa-eye');
                }
                else {
                    icon.removeClass('fa-eye').addClass('fa-eye-slash');
                }
                return visible;
            }
            toggleVisible() {
                this.visible(!this.visible());
            }
        };
        Password = __decorate([
            widget('JS.fx.Password'),
            __metadata("design:paramtypes", [PasswordConfig])
        ], Password);
        fx.Password = Password;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Password = JS.fx.Password;
var PasswordConfig = JS.fx.PasswordConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class DatePickerConfig extends fx.LineInputConfig {
            constructor() {
                super(...arguments);
                this.title = '';
                this.format = 'YYYY-MM-DD';
                this.autoclose = false;
                this.todayBtn = false;
                this.todayHighlight = false;
                this.calendarWeeks = false;
                this.clearBtn = false;
                this.orientation = 'auto';
                this.embedded = false;
                this.multidateSeparator = ',';
            }
        }
        fx.DatePickerConfig = DatePickerConfig;
        let DatePicker = class DatePicker extends fx.LineInput {
            constructor(cfg) {
                super(cfg);
            }
            showPicker() {
                this._picker.datepicker('show');
                return this;
            }
            hidePicker() {
                this._picker.datepicker('hide');
                return this;
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value();
                return super.value(Types.isDate(val) ? val.format(this._config.format) : val, silent);
            }
            _renderValue() {
                let v = this.value() || '';
                if (this._mainEl.val() !== v)
                    this._picker.datepicker('update', v);
                return this;
            }
            _inputHtml() {
                let cfg = this._config;
                if (!cfg.embedded)
                    return super._inputHtml();
                return `<div id="${this.id}_picker"></div><input name="${this.name()}" type="hidden" jsfx-role="main">`;
            }
            _onBeforeRender() {
                if (this._picker)
                    this._picker.datepicker('destroy');
                if (!this._config.embedded)
                    super._onBeforeRender();
            }
            _onAfterRender() {
                let cfg = Jsons.clone(this._config), el = cfg.embedded ? $(`#${this.id}_picker`) : this._mainEl;
                cfg.orientation = { auto: 'auto', lt: 'left top', lb: 'left bottom', rt: 'right top', rb: 'right bottom' }[cfg.orientation];
                let c = cfg;
                c.immediateUpdates = true;
                c.language = cfg.locale;
                c.enableOnReadonly = false;
                c.todayBtn = cfg.todayBtn ? 'linked' : false;
                c.startDate = cfg.minDate;
                c.endDate = cfg.maxDate;
                c.weekStart = 1;
                c.updateViewDate = false;
                c.format = cfg.format.replace(/YYYY|YY|MMMM|MMM|MM|M|DD|D|dddd|ddd/g, function (m) {
                    switch (m) {
                        case "YYYY":
                            return 'yyyy';
                        case "YY":
                            return 'yy';
                        case "MMMM":
                            return 'MM';
                        case "MMM":
                            return 'M';
                        case "MM":
                            return 'mm';
                        case "M":
                            return 'm';
                        case "DD":
                            return 'dd';
                        case "D":
                            return 'd';
                        case "dddd":
                            return 'DD';
                        case "ddd":
                            return 'D';
                        default: return m;
                    }
                });
                this._picker = el.datepicker(c);
                this._picker.on('show', () => {
                    if ($('.datepicker').css('display') == 'block')
                        this._fire('pickershown');
                });
                this._picker.on('hide', () => {
                    this._fire('pickerhidden');
                });
                this._picker.on('changeDate', () => {
                    this._setValue(this._picker.datepicker('getFormattedDate'));
                });
                this._mainEl.on('input change blur', () => {
                    let newVal = this._mainEl.val();
                    if (this.value() != newVal)
                        this._setValue(newVal);
                });
                super._onAfterRender();
            }
            _destroy() {
                if (this._picker)
                    this._picker.datepicker('destroy');
                super._destroy();
            }
        };
        DatePicker = __decorate([
            widget('JS.fx.DatePicker'),
            __metadata("design:paramtypes", [DatePickerConfig])
        ], DatePicker);
        fx.DatePicker = DatePicker;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var DatePickerConfig = JS.fx.DatePickerConfig;
var DatePicker = JS.fx.DatePicker;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class DateRangePickerConfig extends fx.LineInputConfig {
            constructor() {
                super(...arguments);
                this.readonly = false;
                this.format = 'YYYY/MM/DD';
                this.dateSeparator = ' - ';
                this.popDir = 'center';
                this.autoclose = false;
                this.minutesPlus = false;
                this.secondsPlus = false;
                this.showCalendars = true;
            }
        }
        fx.DateRangePickerConfig = DateRangePickerConfig;
        let DateRangePicker = class DateRangePicker extends fx.LineInput {
            constructor(cfg) {
                super(cfg);
            }
            _autoFormat() {
                let cfg = this._config;
                if (cfg.secondsPlus)
                    return 'YYYY/MM/DD HH:mm:ss';
                if (cfg.minutesPlus)
                    return 'YYYY/MM/DD HH:mm';
                return 'YYYY/MM/DD';
            }
            _equalValues(newVal, oldVal) {
                if (!oldVal && !newVal)
                    return true;
                if (!oldVal || !newVal)
                    return false;
                return oldVal[0] == newVal[0] && oldVal[1] == newVal[1];
            }
            _errorType(val) {
                throw new Errors.TypeError('An invalid date format for DateRangePicker:' + val.toString());
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value();
                let cfg = this._config, arr = null;
                if (val) {
                    arr = [];
                    if (Types.isArray(val)) {
                        if (val.length < 2)
                            this._errorType(val);
                        arr = [this._formatDate(val[0]), this._formatDate(val[1])];
                    }
                    else if (val.indexOf(cfg.dateSeparator) < 0) {
                        this._errorType(val);
                    }
                    else {
                        arr = val.split(cfg.dateSeparator);
                    }
                }
                return super.value(arr, silent);
            }
            _formatDate(date) {
                let d = date ? date : new Date();
                return Types.isDate(d) ? d.format(this._config.format || this._autoFormat()) : (d || '');
            }
            _dateString(val) {
                let cfg = this._config;
                return Check.isEmpty(val) ? '' : `${this._formatDate(val[0])}${cfg.dateSeparator}${this._formatDate(val[1])}`;
            }
            _renderValue() {
                let val = this.value(), today = new Date(), text = this._dateString(val);
                if (text != this._mainEl.val()) {
                    this._mainEl.val(text);
                    if (this._picker) {
                        let d1 = val ? val[0] || today : today, d2 = val ? val[1] || today : today;
                        this._mainEl.data('daterangepicker').setStartDate(d1);
                        this._mainEl.data('daterangepicker').setEndDate(d2);
                    }
                }
                if (text && this.isEnabled() && !this.readonly())
                    $(`#${this.id}-icon-clear`).show();
                return this;
            }
            _onAfterRender() {
                let cfg = this._config, value = this.value(), val = [undefined, undefined];
                if (value) {
                    if (!value[0])
                        value[0] = undefined;
                    if (!value[1])
                        value[1] = undefined;
                    val = [value[0], value[1]];
                }
                let c = {
                    showDropdowns: true,
                    startDate: val[0],
                    endDate: val[1],
                    minDate: cfg.minDate,
                    maxDate: cfg.maxDate,
                    minYear: cfg.minYear,
                    maxYear: cfg.maxYear,
                    opens: cfg.popDir,
                    drops: cfg.dropPos,
                    locale: Jsons.union(this._i18n(), { format: this._autoFormat() }, { format: cfg.format, separator: cfg.dateSeparator }),
                    autoUpdateInput: false,
                    autoApply: cfg.autoclose,
                    timePicker: cfg.secondsPlus || cfg.minutesPlus,
                    timePickerSeconds: cfg.secondsPlus,
                    timePickerIncrement: cfg.minutesStep,
                    timePicker24Hour: true,
                    ranges: cfg.ranges,
                    linkedCalendars: false,
                    showCustomRangeLabel: false,
                    alwaysShowCalendars: cfg.showCalendars
                };
                cfg.format = c.locale['format'];
                cfg.dateSeparator = c.locale['separator'];
                if (cfg.maxlength && Number.isFinite(cfg.maxlength))
                    c.maxSpan = { days: 7 };
                this._picker = this._mainEl.daterangepicker(c);
                this._picker.on('show.daterangepicker', () => {
                    this._fire('pickershown');
                });
                this._picker.on('hide.daterangepicker', () => {
                    this._fire('pickerhidden');
                });
                this._picker.on('cancel.daterangepicker', () => {
                    this._fire('pickercanceled');
                });
                this._picker.on('apply.daterangepicker', (e, picker) => {
                    let format = picker.locale.format, d1 = picker.startDate.format(format), d2 = picker.endDate.format(format);
                    this._setValue([d1, d2]);
                    this._mainEl.val(this._dateString([d1, d2]));
                    this._autoclear();
                });
                this._iniValue();
                this._autoclear();
            }
            _autoclear() {
                let cfg = this._config;
                if (cfg.autoclear && !cfg.disabled && !cfg.readonly) {
                    let clear = $('#' + this.id + '-icon-clear');
                    Check.isEmpty(this.value()) ? clear.hide() : clear.show();
                }
            }
        };
        DateRangePicker = __decorate([
            widget('JS.fx.DateRangePicker'),
            __metadata("design:paramtypes", [DateRangePickerConfig])
        ], DateRangePicker);
        fx.DateRangePicker = DateRangePicker;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var DateRangePickerConfig = JS.fx.DateRangePickerConfig;
var DateRangePicker = JS.fx.DateRangePicker;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let RowsInputFaceMode;
        (function (RowsInputFaceMode) {
            RowsInputFaceMode["square"] = "square";
            RowsInputFaceMode["round"] = "round";
            RowsInputFaceMode["shadow"] = "shadow";
        })(RowsInputFaceMode = fx.RowsInputFaceMode || (fx.RowsInputFaceMode = {}));
        class RowsInputConfig extends fx.InputConfig {
            constructor() {
                super(...arguments);
                this.counter = {
                    tpl: '{length}/{maxLength}',
                    place: 'right',
                    cls: ''
                };
                this.faceMode = RowsInputFaceMode.square;
            }
        }
        fx.RowsInputConfig = RowsInputConfig;
        class RowsInput extends fx.Input {
            constructor(cfg) {
                super(cfg);
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value();
                return super.value(val, silent);
            }
            _counterHtml() {
                let cfg = this._config;
                if (!cfg.counter || !cfg.counter.tpl)
                    return '';
                let max = cfg.maxlength;
                if (!max || !Number.isFinite(max))
                    return '';
                let v = this.value() || '', len = v.length;
                return Strings.merge(cfg.counter.tpl, {
                    length: len,
                    maxLength: max
                });
            }
            _updateCounter() {
                let cfg = this._config;
                if (!cfg.counter)
                    return;
                let counter = this.widgetEl.find('.counter');
                counter.off().empty().html(this._counterHtml());
                if (!cfg.autoValidate)
                    return;
                let v = this.value(), len = v ? v.length : 0, max = this.maxlength();
                len > max ? this._showError('') : this._hideError();
            }
            _setValue(val, silent) {
                super._setValue(val, silent);
                this._updateCounter();
            }
            _showError(msg) {
                super._showError(msg);
                this.widgetEl.find('.counter').addClass('error');
            }
            _hideError() {
                super._hideError();
                this.widgetEl.find('.counter').removeClass('error');
            }
        }
        fx.RowsInput = RowsInput;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var RowsInput = JS.fx.RowsInput;
var RowsInputConfig = JS.fx.RowsInputConfig;
var RowsInputFaceMode = JS.fx.RowsInputFaceMode;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class TextAreaConfig extends fx.RowsInputConfig {
            constructor() {
                super(...arguments);
                this.resize = 'none';
                this.rows = 3;
            }
        }
        fx.TextAreaConfig = TextAreaConfig;
        let TextArea = class TextArea extends fx.RowsInput {
            constructor(cfg) {
                super(cfg);
            }
            _bodyFragment() {
                let cfg = this._config, cls = 'form-control font-' + cfg.sizeMode, readonly = cfg.readonly ? ' readonly' : '', autofocus = cfg.autofocus ? ' autofocus' : '', max = cfg.maxlength, maxLength = max && Number.isFinite(max) ? (' maxLength=' + max) : '';
                if (cfg.colorMode) {
                    cls += ` ${cfg.outline ? 'border' : 'focus'}-${cfg.colorMode}`;
                }
                this._eachMode('faceMode', mode => {
                    cls += ' border-' + mode;
                });
                let counter = Number.isFinite(cfg.maxlength) && cfg.counter ? `
                <div style="float:${cfg.counter.place}">
                <span class="counter ${cfg.counter.cls}"></span>
                </div>
                ` : '';
                return `
                    <textarea name="${this.name()}" jsfx-role="main" 
                    ${readonly}
                    ${autofocus}
                    ${maxLength}
                    style="resize:${cfg.resize}"
                    class="${cls}"
                    rows="${cfg.rows}"
                    placeholder="${cfg.placeholder}"></textarea>${counter}`;
            }
            _renderValue() {
                let v = this.value() || '';
                if (this._mainEl.val() == v)
                    return;
                this._mainEl.val(v);
            }
            _onAfterRender() {
                this._mainEl.on('input change paste', () => {
                    this._setValue(this._mainEl.val());
                    this._updateCounter();
                });
                super._onAfterRender();
            }
            _showError(msg) {
                super._showError(msg);
                this._mainEl.addClass('jsfx-input-error');
            }
            _hideError() {
                super._hideError();
                this._mainEl.removeClass('jsfx-input-error');
            }
        };
        TextArea = __decorate([
            widget('JS.fx.TextArea'),
            __metadata("design:paramtypes", [TextAreaConfig])
        ], TextArea);
        fx.TextArea = TextArea;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var TextArea = JS.fx.TextArea;
var TextAreaConfig = JS.fx.TextAreaConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class TextEditorConfig extends fx.RowsInputConfig {
            constructor() {
                super(...arguments);
                this.toolbar = [
                    ['style', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
                    ['font', ['fontsize']],
                    ['color', ['forecolor', 'backcolor']],
                    ['para', ['ul', 'ol', 'paragraph', 'height']],
                    ['insert', ['hr', 'table', 'picture', 'link']],
                    ['view', ['fullscreen', 'codeview', 'undo', 'redo', 'help']]
                ];
                this.maxlength = Infinity;
                this.disableDragAndDrop = false;
                this.fontNames = ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New'];
            }
        }
        fx.TextEditorConfig = TextEditorConfig;
        let TextEditor = class TextEditor extends fx.RowsInput {
            constructor(cfg) {
                super(cfg);
            }
            undo() {
                this._mainEl.summernote('undo');
                return this;
            }
            redo() {
                this._mainEl.summernote('redo');
                return this;
            }
            readonly(is) {
                if (arguments.length == 0)
                    return this._config.readonly;
                this._mainEl.summernote('disable');
                this._config.readonly = is;
                return this;
            }
            disable() {
                this._mainEl.summernote('disable');
                this._config.disabled = true;
                return this;
            }
            enable() {
                this._mainEl.summernote('enable');
                this._config.disabled = false;
                return this;
            }
            focus() {
                this._mainEl.summernote('focus');
                return this;
            }
            insertImage(url, filename) {
                this._mainEl.summernote('insertImage', url, Types.isString(filename) ? filename : (img) => {
                    filename.apply(this, [img]);
                });
                return this;
            }
            insertNode(node) {
                this._mainEl.summernote('insertNode', node);
                return this;
            }
            insertText(text) {
                this._mainEl.summernote('insertText', text);
                return this;
            }
            insertHtml(html) {
                this._mainEl.summernote('pasteHTML', html);
                return this;
            }
            insertLink(text, href, isNewWindow) {
                this._mainEl.summernote('createLink', {
                    url: href || '#',
                    text: text,
                    isNewWindow: isNewWindow == undefined ? true : isNewWindow
                });
                return this;
            }
            _bodyFragment(type) {
                let cfg = this._config, counter = Number.isFinite(cfg.maxlength) && cfg.counter ? `
                <div style="float:${cfg.counter.place}">
                <span class="counter ${cfg.counter.cls}"></span>
                </div>
                ` : '';
                return `<div jsfx-role="main" class="summernote"></div>${counter}`;
            }
            _destroy() {
                this._mainEl.summernote('destroy');
                super._destroy();
            }
            _onAfterRender() {
                let cfg = this._config, callbacks = {
                    onInit: () => {
                        this._fire('init');
                    },
                    onBlur: () => {
                        this._fire('blur');
                    },
                    onFocus: () => {
                        this._fire('focus');
                    },
                    onEnter: () => {
                        this._fire('enter');
                    },
                    onKeyup: (e) => {
                        this._fire('keyup', [e.keyCode]);
                    },
                    onKeydown: (e) => {
                        this._fire('keydown', [e.keyCode]);
                    },
                    onMousedown: (e) => {
                        this._fire('mousedown', [e.keyCode]);
                    },
                    onMouseup: (e) => {
                        this._fire('mouseup', [e.keyCode]);
                    },
                    onPaste: () => {
                        this._fire('paste');
                    },
                    onImageUpload: (files) => {
                        this._fire('imageupload', [files]);
                    },
                    onChange: (html) => {
                        if (html != this.value())
                            this._setValue(html);
                    }
                }, snCfg = {
                    airMode: false,
                    dialogsInBody: true,
                    dialogsFade: true,
                    disableDragAndDrop: cfg.disableDragAndDrop,
                    focus: cfg.autofocus,
                    fontNames: cfg.fontNames,
                    width: cfg.width,
                    height: cfg.height,
                    lang: cfg.locale,
                    placeholder: cfg.placeholder,
                    toolbar: cfg.toolbar,
                    callbacks: callbacks
                };
                if (cfg.buttons) {
                    let btnNames = [], btnJson = {};
                    cfg.buttons.forEach(btn => {
                        btnNames.push(btn.name);
                        btnJson[btn.name] = (ctx) => {
                            var ui = $.summernote.ui, button = ui.button({
                                contents: btn.html,
                                tooltip: btn.tip,
                                click: () => {
                                    btn.onClick.apply(this, [btn]);
                                }
                            });
                            return button.render();
                        };
                    });
                    snCfg.toolbar.push(['mybutton', btnNames]);
                    snCfg.buttons = btnJson;
                }
                this._mainEl.summernote(snCfg);
                if (!this.isEmpty())
                    this.widgetEl.find('.note-placeholder').css('display', 'none');
                let cls = '';
                this._eachMode('faceMode', mode => {
                    cls += ' border-' + mode;
                });
                this.widgetEl.find('div.note-editor').addClass(cls);
                super._onAfterRender();
            }
            _onAfterInit() {
                if (this.readonly())
                    this.readonly(true);
            }
            isEmpty() {
                return this._mainEl.summernote('isEmpty');
            }
            value(val) {
                let cfg = this._config, oldVal = this._valueModel.get(this.name()) || '';
                if (arguments.length == 0)
                    return oldVal;
                val = val || '';
                if (val != (this._getDomValue() || ''))
                    this._mainEl.summernote('code', val);
                return this;
            }
            _iniValue() {
                let cfg = this._config, v = cfg.iniValue || '';
                this._mainEl.summernote('code', v);
                this._setValue(v, true);
            }
            _getDomValue() {
                if (this.isEmpty())
                    return '';
                let v = this._mainEl.summernote('code');
                return v == void 0 ? '' : v;
            }
            _showError(msg) {
                super._showError(msg);
                this.widgetEl.find('.note-editor').addClass('jsfx-input-error');
            }
            _hideError() {
                super._hideError();
                this.widgetEl.find('.note-editor').removeClass('jsfx-input-error');
            }
        };
        TextEditor = __decorate([
            widget('JS.fx.TextEditor'),
            __metadata("design:paramtypes", [TextEditorConfig])
        ], TextEditor);
        fx.TextEditor = TextEditor;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var TextEditor = JS.fx.TextEditor;
var TextEditorConfig = JS.fx.TextEditorConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class MessageBoxConfig {
            constructor() {
                this.type = 'custom';
                this.confirmButtonClass = 'jsfx-btn-confirm';
                this.cancelButtonClass = 'jsfx-btn-cancel';
            }
        }
        fx.MessageBoxConfig = MessageBoxConfig;
        let MessageBox = class MessageBox {
            static show(config) {
                let c = new MessageBoxConfig();
                c = Jsons.union(c, config);
                let cfg = c, lts = c.listeners;
                if (lts) {
                    if (lts.confirming)
                        cfg.preConfirm = (inputVal) => {
                            lts.confirming.apply(null, [new CustomEvent('confirming'), inputVal]);
                        };
                    if (lts.opening)
                        cfg.onBeforeOpen = (el) => {
                            lts.opening.apply(null, [new CustomEvent('opening'), el]);
                        };
                    if (lts.opened)
                        cfg.onOpen = (el) => {
                            lts.opened.apply(null, [new CustomEvent('opened'), el]);
                        };
                    if (lts.closing)
                        cfg.onClose = (el) => {
                            lts.closing.apply(null, [new CustomEvent('closing'), el]);
                        };
                    if (lts.closed)
                        cfg.onAfterClose = () => {
                            lts.closed.apply(null, [new CustomEvent('closed')]);
                        };
                }
                let colorMode;
                if (c.type == 'custom') {
                    colorMode = 'btn-' + fx.ColorMode.info;
                }
                else if (c.type == 'question') {
                    colorMode = 'btn-' + fx.ColorMode.dark;
                }
                else if (c.type == 'error') {
                    colorMode = 'btn-' + fx.ColorMode.danger;
                }
                else {
                    colorMode = 'btn-' + cfg.type;
                }
                cfg.confirmButtonClass = colorMode + ' jsfx-messagebox-btn ' + (cfg.confirmButtonClass || '');
                cfg.cancelButtonClass = 'jsfx-messagebox-btn ' + (cfg.cancelButtonClass || '');
                cfg.buttonsStyling = false;
                if (cfg.type == 'custom')
                    delete cfg.type;
                return swal(cfg);
            }
            static clickConfirm() {
                swal.clickConfirm();
            }
            static clickCancel() {
                swal.clickCancel();
            }
            static disableConfirmButton() {
                swal.disableConfirmButton();
            }
            static enableConfirmButton() {
                swal.enableConfirmButton();
            }
            static disableButtons() {
                swal.disableButtons();
            }
            static getTitle() {
                return $(swal.getTitle()).html();
            }
            static getContent() {
                return $(swal.getContent()).html();
            }
            static close() {
                swal.close();
            }
            static isShown() {
                return swal.isVisible();
            }
        };
        MessageBox = __decorate([
            widget('JS.fx.MessageBox')
        ], MessageBox);
        fx.MessageBox = MessageBox;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var MessageBox = JS.fx.MessageBox;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        ;
        class PopupConfig extends fx.WidgetConfig {
            constructor() {
                super(...arguments);
                this.disabled = false;
                this.hidden = true;
                this.animation = true;
                this.place = 'auto';
                this.htmlable = true;
                this.trigger = 'manual';
            }
        }
        fx.PopupConfig = PopupConfig;
        let Popup = class Popup extends fx.Widget {
            constructor(cfg) {
                super(cfg);
            }
            toggle() {
                this._pop.popover('toggle');
                return this;
            }
            show() {
                this._pop.popover('show');
                return this;
            }
            isShown() {
                return !this._config.hidden;
            }
            hide() {
                this._pop.popover('hide');
                return this;
            }
            enable() {
                this._pop.popover('enable');
                this._config.disabled = false;
                return this;
            }
            disable() {
                this._pop.popover('disable');
                this._config.disabled = true;
            }
            isEnable() {
                return !this._config.disabled;
            }
            _destroy() {
                this._pop.popover('dispose');
                super._destroy();
            }
            _onAfterInit() {
                let cfg = this._config;
                if (!cfg.hidden)
                    this.show();
                cfg.disabled ? this.disable() : this.enable();
            }
            _render() {
                let cfg = this._config, json = {
                    animation: cfg.animation,
                    title: cfg.title,
                    content: cfg.content,
                    html: cfg.htmlable,
                    placement: cfg.place,
                    trigger: cfg.trigger
                };
                if (cfg.template)
                    json['template'] = cfg.template;
                this._pop = $(cfg.target).popover(json);
                this._pop.on('show.bs.popover', () => {
                    this._fire('showing');
                });
                this._pop.on('shown.bs.popover', () => {
                    this._fire('shown');
                    this._config.hidden = false;
                });
                this._pop.on('hide.bs.popover', () => {
                    this._fire('hiding');
                });
                this._pop.on('hidden.bs.popover', () => {
                    this._fire('hidden');
                    this._config.hidden = true;
                });
                this._pop.on('inserted.bs.popover', () => {
                    this._fire('rendered');
                });
                return false;
            }
        };
        Popup = __decorate([
            widget('JS.fx.Popup'),
            __metadata("design:paramtypes", [PopupConfig])
        ], Popup);
        fx.Popup = Popup;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Popup = JS.fx.Popup;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let toastrPosition = {
            lt: 'toast-top-left',
            rt: 'toast-top-right',
            ct: 'toast-top-center',
            lb: 'toast-bottom-left',
            rb: 'toast-bottom-right',
            cb: 'toast-bottom-center'
        };
        class ToastConfig {
            constructor() {
                this.htmlable = false;
                this.type = 'info';
                this.progressBar = false;
                this.place = 'ct';
            }
        }
        fx.ToastConfig = ToastConfig;
        let Toast = class Toast {
            static show(cfg) {
                if (!cfg.title && !cfg.message)
                    return;
                let c = Jsons.union(new ToastConfig(), cfg);
                if (cfg.timeout == 0)
                    c.extendedTimeOut = 0;
                c.toastClass = 'toast jsfx-toast ' + cfg.cls || '';
                c.escapeHtml = !c.htmlable;
                c.timeOut = c.timeout;
                delete c['cls'];
                delete c['htmlable'];
                delete c['timeout'];
                let lts = cfg.listeners;
                if (lts) {
                    if (lts.shown)
                        c.onShown = () => { lts.shown.apply(null, [new Event('shown')]); };
                    if (lts.hidden)
                        c.onHidden = () => { lts.shown.apply(null, [new Event('hidden')]); };
                    if (lts.closeclick)
                        c.onCloseClick = () => { lts.shown.apply(null, [new Event('closeclick')]); };
                    if (lts.click)
                        c.onclick = () => { lts.shown.apply(null, [new Event('click')]); };
                    delete c['listeners'];
                }
                c.positionClass = toastrPosition[cfg.place || 'ct'];
                delete c['place'];
                toastr.options = c;
                toastr[cfg.type](cfg.message, cfg.title);
            }
            static clearAll() {
                toastr.remove();
            }
        };
        Toast = __decorate([
            widget('JS.fx.Toast')
        ], Toast);
        fx.Toast = Toast;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Toast = JS.fx.Toast;
var ToastConfig = JS.fx.ToastConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let LoadingFaceMode;
        (function (LoadingFaceMode) {
            LoadingFaceMode["flower"] = "flower";
            LoadingFaceMode["ring"] = "ring";
            LoadingFaceMode["bar"] = "bar";
        })(LoadingFaceMode = fx.LoadingFaceMode || (fx.LoadingFaceMode = {}));
        class LoadingConfig {
            constructor() {
                this.width = 200;
                this.transparent = true;
                this.faceMode = LoadingFaceMode.bar;
                this.sizeMode = fx.SizeMode.md;
                this.overlay = true;
                this.duration = 3000;
            }
        }
        fx.LoadingConfig = LoadingConfig;
        let Loading = class Loading {
            static show(cfg) {
                let c = Jsons.union(new LoadingConfig(), cfg);
                c.cls = `jsfx-loading ${c.sizeMode} ${c.colorMode || ''} ${c.transparent || !c.message ? 'transparent' : ''} ${c.cls || ''}`;
                let msg = '';
                if (c.faceMode == LoadingFaceMode.flower) {
                    let html = '';
                    for (let i = 1; i < 5; i++) {
                        html += `<div class="loading-flower circle${i}"></div>`;
                    }
                    msg = `<div class="items-middle items-center">
                            <div class="items-middle jsfx-loading-icon flower">
                                <div class="circle-group group1">${html}</div>
                                <div class="circle-group group2">${html}</div>
                                <div class="circle-group group3">${html}</div>
                            </div>
                            <span class="jsfx-loading-msg">${c.message || ''}<span>
                            </div>`;
                }
                else if (c.faceMode == LoadingFaceMode.ring) {
                    msg = `<div class="items-middle items-center">
                              <div class="jsfx-loading-icon ring"><div></div><div></div><div></div><div></div></div>
                              <span class="jsfx-loading-msg">${c.message || ''}<span>
                           </div>`;
                }
                else {
                    $('#jsfx-loading-css').remove();
                    if (c.duration) {
                        Dom.applyStyle(`.jsfx-loading-bar .jsfx-loading-progress:before{animation: load ${c.duration / 1000 * 1.25}s ease-out 1 !important;}`, 'jsfx-loading-css');
                    }
                    msg = `<div class="jsfx-loading-bar">
                                <div class="jsfx-loading-progress"></div>
                                <div class="jsfx-loading-msg">${c.message || ''}</div>
                           </div>`;
                }
                let ucfg = {
                    css: {
                        width: c.width + 'px',
                        left: `calc((100% - ${c.width}px) / 2)`
                    },
                    message: msg,
                    showOverlay: c.overlay,
                    blockMsgClass: c.cls,
                    timeout: c.duration
                }, ltns = c.listeners;
                if (ltns) {
                    if (ltns.showed)
                        ucfg.onBlock = () => {
                            ltns.showed.apply(null, [new CustomEvent('showed'), c]);
                        };
                    if (ltns.hidden)
                        ucfg.onUnblock = () => {
                            ltns.hidden.apply(null, [new CustomEvent('hidden'), c]);
                        };
                }
                cfg.renderTo ? $(cfg.renderTo).block(ucfg) : $.blockUI(ucfg);
            }
            static hide(el) {
                el ? $(el).unblock() : $.unblockUI();
            }
        };
        Loading = __decorate([
            widget('JS.fx.Loading')
        ], Loading);
        fx.Loading = Loading;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Loading = JS.fx.Loading;
var LoadingFaceMode = JS.fx.LoadingFaceMode;
var LoadingConfig = JS.fx.LoadingConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class CarouselConfig extends fx.WidgetConfig {
            constructor() {
                super(...arguments);
                this.interval = 5000;
                this.activeIndex = 0;
            }
        }
        fx.CarouselConfig = CarouselConfig;
        let Carousel = class Carousel extends fx.Widget {
            constructor(cfg) {
                super(cfg);
            }
            prev() {
                this.widgetEl.carousel('prev');
                return this;
            }
            next() {
                this.widgetEl.carousel('next');
                return this;
            }
            pause() {
                this.widgetEl.carousel('pause');
                return this;
            }
            cycle() {
                this.widgetEl.carousel('cycle');
                return this;
            }
            goto(num) {
                this.widgetEl.carousel(num);
                return this;
            }
            _destroy() {
                this.widgetEl.carousel('dispose');
                super._destroy();
            }
            length() {
                let items = this._config.items;
                return !items ? 0 : items.length;
            }
            add(item, from) {
                let size = this.length();
                if (!Types.isDefined(from) || from >= size)
                    from = size - 1;
                let cfg = this._config;
                cfg.items = cfg.items || [];
                cfg.items.add([item], from);
                this._renderItems(from);
                return this;
            }
            remove(num) {
                if (!Types.isDefined(num) || num < 0)
                    return this;
                let size = this.length();
                if (size == 0 || num >= size)
                    return this;
                let cfg = this._config;
                if (!cfg.items)
                    cfg.items = [];
                cfg.items.remove(num);
                this._renderItems(num >= 0 ? num : 0);
                return this;
            }
            clear() {
                this.widgetEl.find('.carousel-indicators').empty();
                this.widgetEl.find('.carousel-inner').empty();
                this._config.items = null;
            }
            _limitActive() {
                let cfg = this._config, size = this.length();
                cfg.activeIndex = cfg.activeIndex >= (size - 1) ? (size - 1) : (cfg.activeIndex <= 0 ? 0 : cfg.activeIndex);
            }
            _indHtml(i) {
                let is = this._config.activeIndex == i;
                return `<li data-target="#${this.id}" data-slide-to="${i}" class="${is ? 'active' : ''}"></li>`;
            }
            _itemHtml(item, i) {
                let is = this._config.activeIndex == i;
                let capHtml = '';
                if (item.caption || item.desc) {
                    capHtml =
                        `<div class="carousel-caption d-md-block">
                        <h5>${item.caption || ''}</h5>
                        <p>${item.desc || ''}</p>
                    </div>`;
                }
                return `
                <div class="carousel-item ${is ? 'active' : ''}" jsfx-index="${i}">
                    <img class="d-block w-100" src="${item.src}" style="height:${Lengths.toCssString(this._config.height, '100%')};" alt="${item.imgAlt || ''}">
                    ${capHtml}
                </div>
                `;
            }
            _renderItems(num) {
                this._limitActive();
                let cfg = this._config, indsHtml = '', itemsHtml = '';
                if (cfg.items)
                    cfg.items.forEach((item, i) => {
                        indsHtml += this._indHtml(i);
                        itemsHtml += this._itemHtml(item, i);
                    });
                this.pause();
                this.widgetEl.find('.carousel-indicators').html(indsHtml);
                this.widgetEl.find('.carousel-inner').html(itemsHtml);
                this.widgetEl.carousel({
                    interval: cfg.interval
                });
                this.goto(num);
            }
            _render() {
                this._limitActive();
                let cfg = this._config, indsHtml = '', itemsHtml = '';
                if (cfg.items)
                    cfg.items.forEach((item, i) => {
                        indsHtml += this._indHtml(i);
                        itemsHtml += this._itemHtml(item, i);
                    });
                let html = `
                <ol class="carousel-indicators">
                    ${indsHtml}
                </ol>
                <div class="carousel-inner" style="height:${Lengths.toCssString(cfg.height, '100%')}">
                    ${itemsHtml}
                </div>
                <a class="carousel-control-prev" href="#${this.id}" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                </a>
                <a class="carousel-control-next" href="#${this.id}" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                </a>
                `;
                this.widgetEl.attr('data-ride', 'carousel');
                this.widgetEl.addClass('carousel slide bg-light');
                this.widgetEl.css({ 'width': Lengths.toCssString(cfg.width, '100%') });
                this.widgetEl.html(html);
                this.widgetEl.on('slide.bs.carousel', (e) => {
                    let from = e.from, to = e.to;
                    if (from != -1 && to != -1)
                        this._fire('transiting', [from, to]);
                });
                this.widgetEl.on('slid.bs.carousel', (e) => {
                    let from = e.from, to = e.to;
                    this._fire('transited', [from, to]);
                });
                this.widgetEl.carousel({
                    interval: cfg.interval
                });
            }
        };
        Carousel = __decorate([
            widget('JS.fx.Carousel'),
            __metadata("design:paramtypes", [CarouselConfig])
        ], Carousel);
        fx.Carousel = Carousel;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Carousel = JS.fx.Carousel;
var CarouselConfig = JS.fx.CarouselConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let TabFaceMode;
        (function (TabFaceMode) {
            TabFaceMode["horizontal"] = "horizontal";
            TabFaceMode["vertical"] = "vertical";
            TabFaceMode["pill"] = "pill";
            TabFaceMode["outline"] = "outline";
            TabFaceMode["underline"] = "underline";
        })(TabFaceMode = fx.TabFaceMode || (fx.TabFaceMode = {}));
        class TabConfig extends fx.WidgetConfig {
            constructor() {
                super(...arguments);
                this.activeIndex = 0;
                this.faceMode = null;
                this.headLeftWidth = '15%';
            }
        }
        fx.TabConfig = TabConfig;
        let Tab = class Tab extends fx.Widget {
            constructor(cfg) {
                super(cfg);
            }
            disableTab(num) {
                let index = this._limitIndex(num);
                if (index < 0)
                    return this;
                let cfg = this._config;
                cfg.data[index].disabled = true;
                let tab = $(`#${this.id}_headers li:nth-child(${index + 1}) a`);
                tab.addClass('disabled');
                return this;
            }
            enableTab(num) {
                let index = this._limitIndex(num);
                if (index < 0)
                    return this;
                let cfg = this._config;
                cfg.data[index].disabled = false;
                let tab = $(`#${this.id}_headers li:nth-child(${index + 1}) a`);
                tab.removeClass('disabled');
                return this;
            }
            isEnabledTab(num) {
                let size = this.length();
                if (size == 0 || num < 1 || num > size)
                    return false;
                let cfg = this._config;
                return cfg.data && !cfg.data[num - 1].disabled;
            }
            activeTab(num) {
                let index = this._limitIndex(num);
                if (index < 0)
                    return this;
                let cfg = this._config;
                cfg.activeIndex = index;
                cfg.data[index].disabled = false;
                let tab = $(`#${this.id}_headers li:nth-child(${index + 1}) a`);
                tab.removeClass('disabled').css('display', '').tab('show');
                return this;
            }
            isActivedTab(num) {
                let tab = $(`#${this.id}_headers li:nth-child(${num}) a`);
                return tab.length == 1 && tab.hasClass('active');
            }
            _limitIndex(num) {
                let size = this.length();
                if (size == 0)
                    return -1;
                if (num >= size) {
                    return size - 1;
                }
                else if (num < 1)
                    return 0;
                return num - 1;
            }
            hideTab(num) {
                this.activeTab(num - 1);
                $(`#${this.id}_headers li:nth-child(${num}) a`).css('display', 'none');
                return this;
            }
            showTab(num) {
                $(`#${this.id}_headers li:nth-child(${num}) a`).css('display', '');
                return this;
            }
            isShownTab(num) {
                let tab = $(`#${this.id}_headers li:nth-child(${num}) a`);
                return tab.length == 1 && tab.css('display') != 'none';
            }
            getActiveIndex() {
                return this._config.activeIndex + 1;
            }
            clear() {
                return this.tabs(null);
            }
            tabs(items) {
                if (arguments.length == 0)
                    return this._config.data;
                this._config.data = items;
                this.render();
                return this;
            }
            addTab(tabs, from) {
                let size = this.length();
                if (!Types.isDefined(from) || from > size) {
                    from = size + 1;
                }
                else if (size == 0 || from < 1)
                    from = 1;
                let cfg = this._config;
                cfg.data = cfg.data || [];
                cfg.data.add(Arrays.toArray(tabs), from - 1);
                this.render();
                return this;
            }
            removeTab(num) {
                if (num > this.length() || num < 1)
                    return this;
                let cfg = this._config;
                cfg.data = cfg.data || [];
                cfg.data.remove(num - 1);
                this.render();
                return this;
            }
            removeTabHeading(heading) {
                let cfg = this._config;
                cfg.data = cfg.data || [];
                let i = cfg.data.findIndex((item) => {
                    return heading == item.heading;
                }, 0);
                if (i < 0)
                    return this;
                return this.removeTab(i + 1);
            }
            length() {
                let data = this._config.data;
                return data ? data.length : 0;
            }
            _head(item, i) {
                return `
                <li class="nav-item">
                    <a  id="${this.id}_${i}-tab" jsfx-index="${i}" class="nav-link ${item.disabled ? 'disabled' : ''}" 
                    data-toggle="tab" href="#${this.id}_${i}" role="tab" aria-controls="${this.id}_${i}" aria-selected="false">
                    ${item.heading}</a>
                </li>
                `;
            }
            _content(item, i) {
                let html = Types.isString(item.content) ? item.content : $(item.content).html();
                return `<div class="tab-pane fade" id="${this.id}_${i}" role="tabpanel" aria-labelledby="${this.id}_${i}-tab">${html || ''}</div>`;
            }
            _html() {
                let cfg = this._config, data = cfg.data, heads = '', contents = '';
                if (!data)
                    return '';
                data.forEach((item, i) => {
                    heads += this._head(item, i);
                    contents += this._content(item, i);
                });
                let cls = '';
                if (this._hasFaceMode(TabFaceMode.pill)) {
                    cls += ' nav-pills';
                }
                else if (this._hasFaceMode(TabFaceMode.underline)) {
                    cls += ' jsfx-tab-underline';
                }
                else {
                    cls += ' nav-tabs';
                }
                cls += ' ' + cfg.colorMode || '';
                let isVtl = this._hasFaceMode(TabFaceMode.vertical);
                if (isVtl)
                    cls += ' flex-column';
                let hHtml = `<ul id="${this.id}_headers" role="tablist" class="nav${cls} ${cfg.headCls || ''}" style="${cfg.headStyle || ''}">${heads}</ul>`, cHtml = `<div class="${isVtl ? 'vertical' : ''} tab-content" style="height:${Lengths.toCssString(cfg.height, '100%')};">${contents}</div>`, leftWidth = Lengths.toCssString(cfg.headLeftWidth, '100%');
                return isVtl ?
                    `
                <div class="w-100">
                <div style="float:left;width:${leftWidth};">${hHtml}</div>
                <div style="margin-left:${leftWidth};">${cHtml}</div>
                </div>
                ` : `${hHtml}${cHtml}`;
            }
            _render() {
                this.widgetEl.html(this._html());
                if (this.length() > 0) {
                    let tablist = this.widgetEl.find('ul[role=tablist]');
                    tablist.on('show.bs.tab', (e) => {
                        this._fire('activing', [e.target, e.relatedTarget]);
                    });
                    tablist.on('shown.bs.tab', (e) => {
                        this._fire('actived', [e.target, e.relatedTarget]);
                    });
                    this.activeTab(this.getActiveIndex());
                }
            }
            _destroy() {
                this.widgetEl.find('a[role=tab]').each(function () { $(this).tab('dispose'); });
                super._destroy();
            }
        };
        Tab = __decorate([
            widget('JS.fx.Tab'),
            __metadata("design:paramtypes", [TabConfig])
        ], Tab);
        fx.Tab = Tab;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Tab = JS.fx.Tab;
var TabFaceMode = JS.fx.TabFaceMode;
var TabConfig = JS.fx.TabConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let DialogFaceMode;
        (function (DialogFaceMode) {
            DialogFaceMode["round"] = "round";
            DialogFaceMode["square"] = "square";
        })(DialogFaceMode = fx.DialogFaceMode || (fx.DialogFaceMode = {}));
        class DialogConfig extends fx.WidgetConfig {
            constructor() {
                super(...arguments);
                this.title = '';
                this.faceMode = DialogFaceMode.square;
                this.hidden = true;
                this.html = '';
                this.autoDestroy = true;
            }
        }
        fx.DialogConfig = DialogConfig;
        ;
        let Dialog = class Dialog extends fx.Widget {
            constructor(config) {
                super(config);
                this._loaded = false;
            }
            load(api, params, encode) {
                let cfg = this._config, remote = api || cfg.url;
                if (!remote)
                    return;
                let url = new URI(remote).queryObject(params, encode).toString();
                cfg.url = url;
                this._mainEl.find('div.modal-body').off().empty().html('<iframe frameborder="0" width="100%" height="100%" src="' + url + '"></iframe>');
            }
            show() {
                if (!this._loaded)
                    this.load();
                this._mainEl.modal('show');
                return this;
            }
            hide() {
                this._mainEl.modal('hide');
                return this;
            }
            toggle() {
                this._mainEl.modal('toggle');
                return this;
            }
            isShown() {
                let d = this._mainEl.data('bs.modal');
                return d ? d._isShown : false;
            }
            _render() {
                let cfg = this._config, cHtml = cfg.html ? (Types.isString(cfg.html) ? cfg.html : $(cfg.html).html()) : '';
                let btnHtml = '', buttons = cfg.buttons;
                if (buttons && buttons.length > 0) {
                    btnHtml = '<div class="modal-footer">';
                    buttons.forEach((opt, i) => {
                        btnHtml += `<button id="${this.id + '_button' + i}" type="button" class="btn btn-${opt.colorMode || fx.ColorMode.primary}" data-dismiss="modal">${opt.text}</button>`;
                    });
                    btnHtml += '</div>';
                }
                let titleHtml = '';
                if (cfg.title)
                    titleHtml = `
                <div class="modal-header">
                <div class="modal-title">${cfg.title}</div>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
                </div>
                `;
                let html = `
                <div class="modal fade" tabindex="-1" role="dialog" aria-hidden="false" jsfx-role="main">
                    <div class="modal-dialog modal-dialog-centered" role="document" style="min-width:${Lengths.toCssString(cfg.width, 'auto')}">
                    <div class="modal-content" style="border-radius:${this._hasFaceMode(DialogFaceMode.round) ? '0.3rem' : '0px'}">
                        ${titleHtml}
                        <div class="modal-body jsfx-dialog-body" style="height:${Lengths.toCssString(cfg.height, '100%')}">
                        ${cHtml}
                        </div>
                        ${btnHtml}
                    </div>
                    </div>
                </div>
                `;
                this.widgetEl.html(html);
                this._renderChildren();
                let btnCt = this.widgetEl.find('div.modal-footer');
                if (buttons && btnCt.length == 1) {
                    buttons.forEach((opt, i) => {
                        let me = this;
                        if (opt.onClick)
                            $('#' + this.id + '_button' + i).click(function (e) {
                                return opt.onClick.apply(me, [e.originalEvent, this, i]);
                            });
                    });
                }
                this._mainEl = this.widgetEl.find('[jsfx-role=main]');
                this._mainEl.off();
                this._mainEl.on('show.bs.modal', () => { this._fire('showing'); });
                this._mainEl.on('shown.bs.modal', () => { this._fire('shown'); });
                this._mainEl.on('hide.bs.modal', () => { this._fire('hiding'); });
                this._mainEl.on('hidden.bs.modal', () => {
                    this._fire('hidden');
                    if (this._config.autoDestroy)
                        this.destroy();
                });
                this._mainEl.modal({
                    backdrop: 'static',
                    show: !cfg.hidden
                });
            }
            _destroy() {
                super._destroy();
                this._mainEl.modal('dispose');
                $('div.modal-backdrop').remove();
                Jsons.forEach(this._children, wgt => {
                    wgt.destroy();
                });
            }
            buttons() {
                return this._mainEl.find('div.modal-footer button');
            }
            child(id) {
                return id ? this._children : this._children[id];
            }
            _renderChildren() {
                let els = this.widgetEl.find('div.modal-body div[jsfx-alias]');
                if (els.length < 1)
                    return;
                this._children = {};
                let wConfigs = this._config.childWidgets;
                els.each((i, e) => {
                    let el = $(e), name = el.attr('name'), id = el.attr('id'), alias = el.attr('jsfx-alias');
                    let cfg = Jsons.union(wConfigs && wConfigs[id], { id: id, name: name });
                    this._children[id] = Class.aliasInstance(alias, cfg);
                });
            }
            _onAfterInit() {
                if (!this._config.hidden)
                    this.show();
            }
        };
        Dialog = __decorate([
            widget('JS.fx.Dialog'),
            __metadata("design:paramtypes", [DialogConfig])
        ], Dialog);
        fx.Dialog = Dialog;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Dialog = JS.fx.Dialog;
var DialogConfig = JS.fx.DialogConfig;
var DialogFaceMode = JS.fx.DialogFaceMode;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let SiderFaceMode;
        (function (SiderFaceMode) {
            SiderFaceMode["over"] = "over";
            SiderFaceMode["overlay"] = "overlay";
            SiderFaceMode["push"] = "push";
        })(SiderFaceMode = fx.SiderFaceMode || (fx.SiderFaceMode = {}));
        class SiderConfig extends fx.WidgetConfig {
            constructor() {
                super(...arguments);
                this.hidden = true;
                this.faceMode = SiderFaceMode.over;
            }
        }
        fx.SiderConfig = SiderConfig;
        let Sider = class Sider extends fx.Widget {
            constructor(cfg) {
                if (cfg.hidden === undefined)
                    cfg.hidden = true;
                cfg.appendTo = 'body';
                if (!cfg.faceMode)
                    cfg.faceMode = SiderFaceMode.over;
                super(cfg);
            }
            toggle() {
                this.widgetEl.slideReveal('toggle');
            }
            show() {
                this.widgetEl.slideReveal('show');
                return this;
            }
            hide() {
                this.widgetEl.slideReveal('hide');
                return this;
            }
            loadHtml(html) {
                let cfg = this._config;
                if (html)
                    cfg.html = html;
                if (!cfg.html)
                    return;
                let h = Types.isString(cfg.html) ? cfg.html : $(cfg.html).html();
                this._mainEl.off().empty().html(h);
                this._fire('loaded');
                return this;
            }
            loadUrl(url) {
                let cfg = this._config;
                if (url)
                    cfg.url = url;
                if (!cfg.url)
                    return;
                this._mainEl.off().empty();
                let iframe = document.createElement('iframe'), fn = () => {
                    let ifr = $(`#${this.id}_iframe`)[0], fWin = Bom.iframeWindow(ifr);
                    fWin.Page.onEvent('close', (e, ...args) => {
                        this._fire('closing', args);
                        this.widgetEl.slideReveal('hide', false);
                        this._fire('closed', args);
                    });
                    this._fire('loaded', [fWin]);
                };
                iframe.id = this.id + '_iframe';
                iframe.src = cfg.url;
                if (iframe['attachEvent']) {
                    iframe['attachEvent']('onload', fn);
                }
                else {
                    iframe.onload = fn;
                }
                this._mainEl.append(iframe);
                return this;
            }
            reload() {
                let cfg = this._config;
                cfg.html ? this.loadHtml(null) : this.loadUrl(null);
                return this;
            }
            getFrame() {
                return $(`#${this.id}_iframe`)[0];
            }
            _onAfterInit() {
                let cfg = this._config;
                this.reload();
                if (!cfg.hidden)
                    this.show();
            }
            _render() {
                let cfg = this._config, html = `
                    <div class="jsfx-sider-head ${cfg.titleCls || ''}" style="${cfg.titleStyle || ''}">
                        <div jsfx-role="title" class="text-truncate">${cfg.title || ''}</div>
                        <button type="button" class="close" aria-label="Close"><i class="la la-arrow-${cfg.place || 'left'}"></i></button>                            
                    </div>
                    <div class="jsfx-sider-body" jsfx-role="main"></div>
                    `;
                this.widgetEl.addClass(`jsfx-sider ${cfg.place || 'left'}`).html(html);
                let isPush = cfg.faceMode == SiderFaceMode.push;
                this.widgetEl = $('#' + this.id).slideReveal({
                    width: cfg.width || undefined,
                    trigger: cfg.trigger ? $(cfg.trigger) : undefined,
                    push: isPush,
                    overlay: !isPush,
                    overlayColor: 'rgba(0, 0, 0, 0.25)',
                    position: cfg.place,
                    speed: cfg.speed,
                    autoEscape: cfg.escKey == false ? false : true,
                    show: () => {
                        this.widgetEl.addClass((cfg.faceMode == SiderFaceMode.overlay ? 'overlay-' : '') + 'sider-shadow');
                        this._fire('opening');
                    },
                    shown: () => { this._fire('opened'); },
                    hide: () => {
                        this.widgetEl.removeClass((cfg.faceMode == SiderFaceMode.overlay ? 'overlay-' : '') + 'sider-shadow');
                        this._fire('closing');
                    },
                    hidden: () => { this._fire('closed'); }
                });
                let overs = $('.slide-reveal-overlay');
                if (overs.length > 0) {
                    this._overlay = $(overs[0]);
                    if (cfg.faceMode == SiderFaceMode.over)
                        this._overlay.remove();
                }
                this.widgetEl.find('button.close').click(() => {
                    this.hide();
                });
                this._mainEl = this.widgetEl.find('[jsfx-role=main]');
            }
            _destroy() {
                if (this._overlay)
                    this._overlay.remove();
                super._destroy();
            }
            title(text) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.title;
                this.widgetEl.find('div[jsfx-role="title"]').html(text);
                cfg.title = text;
                return this;
            }
        };
        Sider = __decorate([
            widget('JS.fx.Sider'),
            __metadata("design:paramtypes", [SiderConfig])
        ], Sider);
        fx.Sider = Sider;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var SiderFaceMode = JS.fx.SiderFaceMode;
var SiderConfig = JS.fx.SiderConfig;
var Sider = JS.fx.Sider;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let GridFaceMode;
        (function (GridFaceMode) {
            GridFaceMode["striped"] = "striped";
            GridFaceMode["outline"] = "outline";
            GridFaceMode["inline"] = "inline";
        })(GridFaceMode = fx.GridFaceMode || (fx.GridFaceMode = {}));
        class GridConfig extends fx.WidgetConfig {
            constructor() {
                super(...arguments);
                this.checkable = false;
                this.dataModel = PageModel;
                this.data = [];
                this.autoLoad = true;
                this.headStyle = {
                    textAlign: 'left'
                };
                this.bodyStyle = {
                    textAlign: 'left'
                };
                this.pageSizes = [10, 20, 30, 50];
                this.pagingBar = false;
                this.i18n = null;
            }
        }
        fx.GridConfig = GridConfig;
        let Grid = class Grid extends fx.Widget {
            constructor(cfg) {
                super(cfg);
                this._hChk = null;
                this._bChks = null;
            }
            getFieldName(col) {
                let cfg = this._config, cols = cfg.columns;
                if (col <= 0 || col >= cols.length)
                    return null;
                return cols[col + 1].field;
            }
            getCellNode(row, col) {
                return $(`#${this.id}_btable`).find(`td>div[jsfx-row=${row}][jsfx-col=${col}]`);
            }
            dataModel() {
                return this._dataModel;
            }
            _initDataModel() {
                let cfg = this._config;
                this._dataModel = Class.newInstance(cfg.dataModel, {
                    iniData: cfg.data,
                    pageSize: cfg.dataQuery.pageSize
                });
                ['loading', 'loadsuccess', 'loadfailure', 'loaderror', 'dataupdating', 'dataupdated'].forEach(e => {
                    let me = this;
                    this._dataModel.on(e, function () {
                        if (e == 'dataupdated')
                            me.data(this.getData(), true);
                        me._fire(e, Arrays.slice(arguments, 1));
                    });
                });
            }
            _onBeforeInit() {
                let cfg = this._config;
                cfg.dataQuery = Jsons.union({
                    page: 1,
                    pageSize: cfg.pageSizes ? cfg.pageSizes[0] : Infinity
                }, Ajax.toRequest(cfg.dataQuery));
                cfg.dataModel = PageModel;
                this._initDataModel();
            }
            _headChk() {
                if (this._hChk == null)
                    this._hChk = $(`#${this.id}_htable tr>th:first-child input:checkbox`);
                return this._hChk;
            }
            _bodyChks() {
                if (this._bChks == null)
                    this._bChks = $(`#${this.id}_btable tr>td:first-child input:checkbox`);
                return this._bChks;
            }
            _newCheckbox(el, id, i) {
                let me = this, cfg = me._config;
                new fx.Checkbox({
                    renderTo: el,
                    width: 'auto',
                    colorMode: cfg.colorMode,
                    sizeMode: cfg.sizeMode,
                    data: [{ id: id }]
                }).on('click', function () {
                    this.isSelected() ? me.select(i) : me.unselect(i);
                });
            }
            _bindHeadCheckbox() {
                if (!this._config.checkable)
                    return;
                this._hChk = null;
                let span = $(`#${this.id}_htable tr>th:first-child span[jsfx-alias=checkbox]`);
                this._newCheckbox(span, '-1');
            }
            _bindBodyCheckbox() {
                if (!this._config.checkable)
                    return;
                this._bChks = null;
                let me = this, spans = $(`#${this.id}_btable tr>td:first-child span[jsfx-alias=checkbox]`);
                spans.each(function (i) {
                    me._newCheckbox(this, $(this).attr('jsfx-id'), i + 1);
                });
            }
            isSelected(row) {
                let chks = this._bodyChks();
                if (chks.length == 0)
                    return false;
                return $(chks.get(row)).prop('checked');
            }
            select(i) {
                if (arguments.length == 0 || i == void 0) {
                    this._headChk().prop('checked', true);
                    this._bodyChks().prop('checked', true);
                    if (this.checkable())
                        $(`#${this.id}_btable`).find(`tr`).addClass('selected');
                    this._fire('allselected');
                    return;
                }
                $(this._bodyChks().get(i)).prop('checked', true);
                if (this.checkable())
                    $(`#${this.id}_btable`).find(`tr[jsfx-row=${i}]`).addClass('selected');
                this._fire('selected', [i]);
                if (this._bodyChks().not(':checked').length == 0) {
                    this._headChk().prop('checked', true);
                    if (this.checkable())
                        $(`#${this.id}_btable`).find(`tr`).addClass('selected');
                    this._fire('allselected');
                }
            }
            unselect(i) {
                if (arguments.length == 0 || i == void 0) {
                    this._headChk().prop('checked', false);
                    this._bodyChks().prop('checked', false);
                    if (this.checkable())
                        $(`#${this.id}_btable`).find(`tr`).removeClass('selected');
                    this._fire('allunselected');
                    return;
                }
                $(this._bodyChks().get(i)).prop('checked', false);
                if (this.checkable())
                    $(`#${this.id}_btable`).find(`tr[jsfx-row=${i}]`).removeClass('selected');
                this._fire('unselected', [i]);
                this._headChk().prop('checked', false);
                if (this._bodyChks().not(':not(:checked)').length == 0) {
                    if (this.checkable())
                        $(`#${this.id}_btable`).find(`tr`).removeClass('selected');
                    this._fire('allunselected');
                }
            }
            getSelectedIds() {
                let chks = this._bodyChks(), ids = [];
                chks.each((i, el) => {
                    let n = $(el);
                    if (n.prop('checked'))
                        ids[ids.length] = n.val();
                });
                return ids;
            }
            getSelectedData() {
                let chks = this._bodyChks(), data = [], cData = this.data();
                chks.each((i, el) => {
                    if ($(el).prop('checked')) {
                        data.push(cData[i]);
                    }
                });
                return data;
            }
            checkable() {
                return this._config.checkable;
            }
            hideCheckbox() {
                this.widgetEl.find('.table tr').find('th:eq(0),td:eq(0)').find('.jsfx-checkbox').hide();
            }
            showCheckbox() {
                this.widgetEl.find('.table tr').find('th:eq(0),td:eq(0)').find('.jsfx-checkbox').show();
            }
            _colIndexOf(field) {
                let name = field;
                let col = this._config.columns.findIndex((option) => {
                    return option.field == name;
                });
                if (col < 0)
                    throw new Errors.NotFoundError(`Not found the field:<${name}>`);
                return col;
            }
            hideColumn(v) {
                let i = Types.isNumeric(v) ? Number(v) - 1 : this._colIndexOf(v);
                this.widgetEl.find(`tr th:eq(${i}),tr td:eq(${i})`).hide();
            }
            showColumn(v) {
                let i = Types.isNumeric(v) ? Number(v) - 1 : this._colIndexOf(v);
                this.widgetEl.find(`tr th:eq(${i}),tr td:eq(${i})`).show();
            }
            _bindSortFields() {
                let cols = this._config.columns;
                cols.forEach((col) => {
                    if (col.sortable)
                        this._bindSortField(col.field, Types.isBoolean(col.sortable) ? 'desc' : col.sortable);
                });
            }
            _bindSortField(fieldName, defaultDir) {
                let me = this, el = this.widgetEl.find('#' + this.id + '_sort_' + fieldName);
                el.click(function () {
                    let jEl = $(this);
                    if (jEl.hasClass('la-arrow-up')) {
                        me._sortField(fieldName, 'desc', jEl);
                    }
                    else {
                        me._sortField(fieldName, 'asc', jEl);
                    }
                    me.reload();
                });
                this._sortField(fieldName, defaultDir, el);
            }
            _sortField(field, dir, el) {
                let model = this._dataModel;
                if ('desc' == dir) {
                    el.removeClass('la-arrow-up').addClass('la-arrow-down');
                    model.addSorter(field, 'desc');
                }
                else {
                    el.removeClass('la-arrow-down').addClass('la-arrow-up');
                    model.addSorter(field, 'asc');
                }
            }
            _thHtml(col, colNumber) {
                let cfg = this._config, html = col.text, title = col.tip ? col.tip : col.text, sortDir = col.sortable === true ? 'desc' : '' + col.sortable, sort = col.sortable ? `<i id="${this.id + '_sort_' + col.field}" style="cursor:pointer;vertical-align:middle;" class="la la-arrow-${sortDir == 'asc' ? 'up' : 'down'}"></i>` : '', hasCheckbox = colNumber == 1 && cfg.checkable, width = Lengths.toCssString(col.width, '100%'), cell = `<div class="cell items-${cfg.headStyle.textAlign} items-middle" jsfx-col="${colNumber}" title="${title}">
                    ${html}${sort ? sort : ''}</div>`;
                if (col.sortable)
                    this._dataModel.addSorter(col.field, sortDir);
                return `<th width="${width}" nowrap>
                ${hasCheckbox ? `<div class="items-left items-middle"><span jsfx-alias="checkbox"/>${cell}</div>` : cell}
                </th>`;
            }
            _tdHtml(opt, html, title, col, row) {
                let cfg = this._config, hasCheckbox = col == 0 && cfg.checkable, id = this.data()[row]['id'], width = Lengths.toCssString(opt.width, '100%'), cell = `<div class="cell items-${cfg.bodyStyle.textAlign} items-middle" jsfx-row="${row}" jsfx-col="${col}" title="${title}">
                    ${html}</div>`;
                return `<td width="${width}" nowrap>
                ${hasCheckbox ? `<div class="items-left items-middle" jsfx-row="${row}" jsfx-col="${col}"><span jsfx-alias="checkbox" jsfx-id="${id}"/>${cell}</div>` : cell}
                </td>`;
            }
            _headHtml(columns) {
                let html = '';
                columns.forEach((col, i) => {
                    html += this._thHtml(col, i + 1);
                }, this);
                return html;
            }
            _renderBody() {
                let cfg = this._config, columns = cfg.columns, data = this.data() || [];
                if (!columns)
                    return;
                let html = '';
                data.forEach((rowData, rowIndex) => {
                    if (rowData) {
                        let tr = '';
                        columns.forEach((col, colIndex) => {
                            if (col) {
                                let val = rowData[col.field], hVal = val == void 0 ? '' : Strings.escapeHTML(String(val));
                                tr += this._tdHtml(col, col.renderer ? col.renderer.call(this, val, colIndex, rowIndex) : hVal, hVal, colIndex, rowIndex);
                            }
                        });
                        tr = `<tr jsfx-row="${rowIndex}">${tr}</tr>`;
                        html += tr;
                    }
                });
                Check.isEmpty(data) ? $(`#${this.id}_nodata`).show() : $(`#${this.id}_nodata`).hide();
                $(`#${this.id}_btable>tbody`).off().empty().html(html)
                    .off('click', 'tr').on('click', 'tr', (e) => {
                    let row = $(e.currentTarget), rowNumber = parseInt(row.attr('jsfx-row'));
                    this._fire('rowclick', [rowNumber]);
                    if (this.checkable())
                        this.isSelected(rowNumber) ? this.unselect(rowNumber) : this.select(rowNumber);
                    return false;
                })
                    .off('click', 'td>div').on('click', 'td>div', (e) => {
                    let row = $(e.currentTarget), colNumber = parseInt(row.attr('jsfx-col')), rowNumber = parseInt(row.attr('jsfx-row'));
                    this._fire('cellclick', [rowNumber, colNumber]);
                    return true;
                });
                this._bindBodyCheckbox();
            }
            _pageHtml(page) {
                let model = this._dataModel;
                return `
                <li>
                    <a class="pager-link pager-link-number ${model.getCurrentPage() == page ? 'selected' : ''}" data-page="${page}" title="${page}">${page}</a>
                </li>
                `;
            }
            _pagesHtml() {
                let model = this._dataModel, page = model.getCurrentPage(), lastPage = model.getLastPage(), html = '';
                let begin = page < 6 ? 1 : ((lastPage - 4) <= page ? lastPage - 4 : page - 2), end = (begin + 4) > lastPage ? lastPage : (begin + 4), empty = '<li><a href="javascript:void(0);">...</a></li>';
                if (begin > 1)
                    html += empty;
                for (let i = begin; i <= end; i++) {
                    html += this._pageHtml(i);
                }
                if ((lastPage - end) > 0)
                    html += empty;
                return html;
            }
            _pagesizeHtml(pagesize) {
                let cfg = this._config, size = cfg.dataQuery.pageSize, selected = size == pagesize ? '<i class="fa fa-check"></i>' : '';
                return `<button class="dropdown-item ${cfg.sizeMode ? 'btn-' + cfg.sizeMode : ''} ${selected ? 'selected' : ''}" jsfx-pagesize="${pagesize}">${pagesize}${selected}</button>`;
            }
            _pagesizesHtml() {
                let pageSizes = this._config.pageSizes;
                if (!pageSizes)
                    return '';
                let html = '';
                pageSizes.forEach(size => {
                    html += this._pagesizeHtml(size);
                });
                return html;
            }
            _renderPagingbar() {
                if (!this._config.pagingBar)
                    return;
                let cfg = this._config, model = this._dataModel, el = $(`#${this.id}_pagingbar`), page = model.getCurrentPage(), prevPage = model.getPrevPage(), nextPage = model.getNextPage(), lastPage = model.getLastPage(), pageSize = cfg.dataQuery.pageSize, total = model.total(), beginRow = total == 0 ? 0 : pageSize * (page - 1) + 1, endRow = total == 0 ? 0 : (page == lastPage ? total : page * pageSize);
                let rowsInfo = Strings.merge(this._i18n('rowsInfo'), {
                    beginRow: beginRow,
                    endRow: endRow,
                    total: total
                }) || '', html = `<ul class="pager-nav">
                    <li>
                        <a title="${this._i18n('firstPage')}" class="pager-link pager-link-arrow" data-page="1">
                            <i class="la la-angle-double-left"></i>
                        </a>
                    </li>
                    <li>
                        <a title="${this._i18n('previousPage')}" class="pager-link pager-link-arrow" data-page="${prevPage}">
                            <i class="la la-angle-left"></i>
                        </a>
                    </li>
                    ${this._pagesHtml()}
                    <li>
                        <a title="${this._i18n('nextPage')}" class="pager-link pager-link-arrow" data-page="${nextPage}">
                            <i class="la la-angle-right"></i>
                        </a>
                    </li>
                    <li>
                        <a title="${this._i18n('lastPage')}" class="pager-link pager-link-arrow" data-page="${lastPage}">
                            <i class="la la-angle-double-right"></i>
                        </a>
                    </li>
                </ul>
                <div class="pager-info items-middle">
                    <div class="btn-group dropup">
                        <button id="${this.id}_pagesize" title="选择每页条数" class="btn dropdown-toggle ${cfg.sizeMode ? 'btn-' + cfg.sizeMode : ''}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        ${pageSize}
                        </button>
                        <div class="dropdown-menu">
                        ${this._pagesizesHtml()}
                        </div>
                    </div>
                    <span class="pager-detail">${rowsInfo}</span>
                </div>`;
                el.html(html);
                let me = this, pages = this.widgetEl.find('a.pager-link');
                pages.click(function () {
                    let pNumber = parseInt($(this).attr('data-page'));
                    if (pNumber)
                        me.loadPage(pNumber);
                });
                let buttons = this.widgetEl.find('div.pager-info div.dropdown-menu>button');
                buttons.click(function () {
                    me._changePageSize($(this));
                });
                this.unselect();
            }
            _changePageSize(el) {
                el.siblings().removeClass('selected').find('i').remove();
                el.remove('i').addClass('selected').append('<i class="fa fa-check"></i>');
                let pageSize = parseInt(el.attr('jsfx-pagesize'));
                $('#' + this.id + '_pagesize').text(pageSize);
                this.load({ pageSize: pageSize });
            }
            loadPage(page) {
                return this._dataModel.loadPage(page);
            }
            clear() {
                return this.data(null);
            }
            _render() {
                let cfg = this._config, heights = {
                    md: 34
                }, bodyCls = 'table';
                if (this._hasFaceMode(GridFaceMode.striped))
                    bodyCls += ' striped';
                let hStyle = cfg.headStyle, bStyle = cfg.bodyStyle, bHeight = Types.isNumeric(cfg.height) ? (Number(cfg.height) - heights[cfg.sizeMode]) + 'px' : '100%', html = `<!-- 表头容器 -->
                    <div class="head">
                        <table id="${this.id}_htable" class="table ${hStyle.cls || ''}">
                            <tr>
                            ${this._headHtml(cfg.columns)}
                            </tr>
                        </table>
                    </div>
                    <!-- 表体容器-->
                    <div class="body" style="height:${bHeight};min-height:${bHeight};max-height:${bHeight};">
                        <div id="${this.id}_nodata" class="items-center items-middle w-100 h-100">
                        ${this._i18n('empty')}
                        </div>
                        <table id="${this.id}_btable" class="${bodyCls}">
                            <tbody text-align="${bStyle.textAlign}">
                            </tbody>
                        </table>
                    </div>        
                    <!-- 分页容器-->
                    <div id="${this.id}_pagingbar" class="pager"></div>`;
                let cls = ` ${cfg.colorMode || ''} ${cfg.sizeMode} ${this._hasFaceMode(GridFaceMode.outline) ? 'outline' : ''} ${this._hasFaceMode(GridFaceMode.inline) ? 'inline' : ''}`;
                this.widgetEl.addClass(cls).css('max-width', cfg.width ? cfg.width : 'auto').html(html);
            }
            _onAfterRender() {
                let cfg = this._config;
                if (cfg.data)
                    this.data(cfg.data, true);
                let pageQuery = cfg.dataQuery;
                if (pageQuery.url && cfg.autoLoad)
                    this.load(pageQuery);
                this._bindHeadCheckbox();
                this._bindSortFields();
                let head = this.widgetEl.find('.head');
                let body = this.widgetEl.find('.body');
                body.scroll(() => {
                    head.scrollLeft(body.scrollLeft());
                });
                $(`${this.id}_htable`).resize(() => {
                    $(`${this.id}_htable`).css('width', $(`${this.id}_btable`).css('width'));
                });
            }
            _renderData() {
                this._renderBody();
                this._renderPagingbar();
            }
            data(data, silent) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return this._dataModel.getData();
                this._dataModel.setData(data, silent);
                this._renderData();
                return this;
            }
            load(quy, silent) {
                let cfg = this._config, oQuery = Ajax.toRequest(cfg.dataQuery), nQuery = Ajax.toRequest(quy);
                cfg.dataQuery = Jsons.union(oQuery, {
                    page: 1,
                    pageSize: Number($(`#${this.id}_pagesize`).text())
                }, nQuery);
                return this._dataModel.load(cfg.dataQuery, silent);
            }
            reload() {
                this._dataModel.reload();
                return this;
            }
        };
        Grid.I18N = {
            firstPage: 'First Page',
            lastPage: 'Last Page',
            previousPage: 'Previous Page',
            nextPage: 'Next Page',
            rowsInfo: '{beginRow} - {endRow} of {total} records',
            empty: 'No data found.',
            loadingMsg: 'Loading...'
        };
        Grid = __decorate([
            widget('JS.fx.Grid'),
            __metadata("design:paramtypes", [GridConfig])
        ], Grid);
        fx.Grid = Grid;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Grid = JS.fx.Grid;
var GridFaceMode = JS.fx.GridFaceMode;
var GridConfig = JS.fx.GridConfig;
