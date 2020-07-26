/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="Widget.ts"/>
/// <reference path="../model/AjaxProxy.ts"/>

module JS {

    export namespace fx {

        let J = Jsons;

        export type FormWidgetEvents = WidgetEvents |
            'changed' | 'validating' | 'validated' | 'loading' | 'loadsuccess' | 'loadfailure' | 'loaderror' | 'dataupdating' | 'dataupdated';
        /**
         * [newVal, oldVal]
         */    
        export type FormWidgetEventHanler_Changed<T> = EventHandler2<T, any, any>;
        /**
         * [rst, val, fieldName]
         */    
        export type FormWidgetEventHanler_Validating<T> = EventHandler3<T, ValidateResult, any, string>;
        /**
         * [rst, val, fieldName]
         */    
        export type FormWidgetEventHanler_Validated<T> = EventHandler3<T, ValidateResult, any, string>;
        /**
         * [req]
         */    
        export type FormWidgetEventHanler_Loading<T> = EventHandler1<T, AjaxRequest>;
        /**
         * [rst] 
         */    
        export type FormWidgetEventHanler_Loadsuccess<T> = EventHandler1<T, ResultSet<any>>;
        /**
         * [rst]
         */    
        export type FormWidgetEventHanler_Loadfailure<T> = EventHandler1<T, ResultSet<any>>;
        /**
         * [error]
         */    
        export type FormWidgetEventHanler_Loaderror<T> = EventHandler1<T, AjaxResponse | Error>;
        /**
         * [newData, oldData] 
         */    
        export type FormWidgetEventHanler_Dataupdating<T> = EventHandler2<T, any, any>;
        /**
         * [newData, oldData] 
         */    
        export type FormWidgetEventHanler_Dataupdated<T> = EventHandler2<T, any, any>;
        

        export interface FormWidgetListeners<T> extends WidgetListeners<T> {
            changed?: FormWidgetEventHanler_Changed<T>
            validating?: FormWidgetEventHanler_Validating<T>
            validated?: FormWidgetEventHanler_Validated<T>
            loading?: FormWidgetEventHanler_Loading<T>
            loadsuccess?: FormWidgetEventHanler_Loadsuccess<T>
            loadfailure?: FormWidgetEventHanler_Loadfailure<T>
            loaderror?: FormWidgetEventHanler_Loaderror<T>
            dataupdating?: FormWidgetEventHanler_Dataupdating<T>
            dataupdated?: FormWidgetEventHanler_Dataupdated<T>
        }

        export class FormWidgetConfig<T extends FormWidget> extends WidgetConfig<T> {
            disabled?: boolean = false;

            dataModel?: Klass<ListModel> = ListModel;
            valueModel?: Klass<Model> | Model = Model;

            validators?: Array<ValidatorSetting> = [];
            autoValidate?: boolean = false;
            validateMode?: 'tip' | { mode: 'tip', place?: LRTB } | { showError: (this: T, errorMsg: string) => void, hideError: (this: T) => void } | any = 'tip';

            readonly?: boolean = false;
            title?: string;
            titlePlace?: 'left' | 'top' = 'left';
            titleTextPlace?: LOC9 = 'rm';
            titleCls?: string;
            titleStyle?: string;
            titleWidth?: string | number;
            bodyCls?: string;
            bodyStyle?: string;

            data?: any = null;
            dataQuery?: string | AjaxRequest;

            iniValue?: any = null;
            listeners?: FormWidgetListeners<T>;
        }

        export abstract class FormWidget extends Widget implements IValueWidget, IDataWidget {

            constructor(cfg: FormWidgetConfig<any>) {
                super(cfg);
            }

            public iniValue(): any
            public iniValue(v: any, render?: boolean): this
            public iniValue(v?: any, render?: boolean): any {
                let cfg = <FormWidgetConfig<any>>this._config;
                if (arguments.length == 0) return cfg.iniValue;

                cfg.iniValue = v;
                if(render) this.value(v, true);
                return this
            }

            public readonly(): boolean
            public readonly(is: boolean): this
            public readonly(is?: boolean): any {
                if (arguments.length == 0) return (<FormWidgetConfig<any>>this._config).readonly;
                this._mainEl.prop('readonly', is);
                (<FormWidgetConfig<any>>this._config).readonly = is;
                return this;
            }

            protected _onBeforeInit() {
                this._initDataModel();
                this._initValueModel();
            }


            protected _onAfterInit() {
                let cfg = <FormWidgetConfig<any>>this._config;
                if (cfg.dataQuery) this.load(cfg.dataQuery, true);
                cfg.disabled ? this.disable() : this.enable();
            }

            public disable() {
                this._mainEl.prop('disabled', true);
                (<FormWidgetConfig<any>>this._config).disabled = true;
                return this
            }
            public enable() {
                this._mainEl.prop('disabled', false);
                (<FormWidgetConfig<any>>this._config).disabled = false;
                return this
            }
            public isEnabled(): boolean {
                return !(<FormWidgetConfig<any>>this._config).disabled
            }

            public title(text: string): this;
            public title(): string;
            public title(text?: string): any {
                let cfg = <FormWidgetConfig<any>>this._config;
                if (arguments.length == 0) return cfg.title;
                this.widgetEl.find('div[jsfx-role="title"]>span').html(text);
                cfg.title = text;
                return this
            }

            protected abstract _bodyFragment(): string;

            protected _hAlign(): string {
                let al = (<FormWidgetConfig<any>>this._config).titleTextPlace || 'lm';
                return { 'l': 'left', 'r': 'right', 'c': 'center' }[al.substr(0, 1)]
            }
            protected _vAlign(): string {
                let al = (<FormWidgetConfig<any>>this._config).titleTextPlace || 'lm';
                return { 't': 'top', 'b': 'bottom', 'm': 'middle' }[al.substr(1, 1)]
            }

            protected _mainEl: JQuery<HTMLElement>;/** 组件内部主DOM对象 */

            protected _render() {
                let cfg = (<FormWidgetConfig<any>>this._config), titleAttrs = cfg.tip ? ` title=${cfg.tip}` : '';

                if (cfg.title) {
                    let tValign = this._vAlign(), tHalign = this._hAlign(), p0 = tHalign == 'right' && cfg.titlePlace == 'top' ? 'p-0' : '',
                        cls = `${p0} font-${cfg.sizeMode || 'md'} items-${tValign} items-${tHalign} ${cfg.colorMode ? 'text-' + cfg.colorMode : ''} ${cfg.titleCls || ''}"`;
                    let style = Types.isDefined(cfg.titleWidth) ? `width:${Lengths.toCSS(cfg.titleWidth, '100%')};` : '';
                    if (cfg.titleStyle) style += cfg.titleStyle;

                    titleAttrs += ` class="${cls}"`;
                    if (style) titleAttrs += ` style="${style}"`;
                }
                let html =
                    `<div jsfx-role="title"${titleAttrs}>${cfg.title ? '<span>' + cfg.title + '</span>' : ''}</div> 
                    <div jsfx-role="body" class="font-${cfg.sizeMode || 'md'} items-middle ${cfg.bodyCls || ''}" style="flex:1;${cfg.bodyStyle || ''}">
                        ${this._bodyFragment()}
                    </div>`;

                this.widgetEl.html(html);
                this._mainEl = this.widgetEl.find('[jsfx-role=main]');
            }

            protected _onBeforeRender() {
                let cfg = (<FormWidgetConfig<any>>this._config),
                    w = Lengths.toCSS(cfg.width, '100%'),
                    d = cfg.titlePlace == 'left' ? 'flex' : 'grid',
                    css = {
                        'display': (w == 'auto' ? 'inline-' : '') + d,
                        'width': w
                    }
                this.widgetEl.css(css);
            }

            protected _iniValue() {
                let cfg = <FormWidgetConfig<any>>this._config;
                this.value(cfg.iniValue, true);
            }
            protected _onAfterRender() {
                this.on('validated', (e: Event, rst: ValidateResult, val: any, name: string) => {
                    window.setTimeout(() => {//第一次时需要延时执行，等待DOM的样式先生效
                        rst.hasError() ? this._showError(rst.getErrors(name)[0].message) : this._hideError()
                    }, 100)
                })
                this._iniValue();
            }

            protected _showError(msg: string) {
                let cfg = <FormWidgetConfig<any>>this._config,
                    mode = cfg.validateMode,
                    fn = (mode == 'tip' || (mode && mode['mode'] == 'tip')) ? this._showTipError : mode['showError'];
                if (fn) fn.apply(this, [msg])
            }
            protected _hideError() {
                let cfg = <FormWidgetConfig<any>>this._config,
                    mode = cfg.validateMode,
                    fn = (mode == 'tip' || (mode && mode['mode'] == 'tip')) ? this._hideTipError : mode['hideError'];
                if (fn) fn.call(this)
            }

            private _getTipEl(place: LRTB) {//大多数情况下取body
                let cfg = <FormWidgetConfig<any>>this._config;
                return this.widgetEl.find(cfg.titlePlace == 'left' && place == 'left' ? '[jsfx-role=title]>span': '[jsfx-role=body]')
            }
            protected _showTipError(msg: string) {
                if (!msg) return;

                let div = this.widgetEl.find('.error .tooltip-inner');
                if (div.length == 1) {//tooltip存在则直接赋值
                    div.html(msg)
                } else {
                    let cfg = <FormWidgetConfig<any>>this._config,
                        mode = cfg.validateMode,
                        place = mode && mode['place'] ? mode['place'] : 'right',
                        el = this._getTipEl(place);
                    el.tooltip({
                        placement: place,
                        offset: '0, 2px',
                        fallbackPlacement: <any>'clockwise',
                        container: el[0],
                        trigger: 'manual',
                        html: false,
                        title: msg,
                        template: '<div class="tooltip error" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
                    }).tooltip('show')
                }
            }
            protected _hideTipError() {
                let cfg = <FormWidgetConfig<any>>this._config,
                    mode = cfg.validateMode,
                    place = mode && mode['place'] ? mode['place'] : 'right',
                    el = this._getTipEl(place);
                if(el.tooltip) el.tooltip('dispose')
            }

            protected _validate(name: string, val: any, rst: ValidateResult): string | boolean {
                let field = new ModelField({
                    name: name,
                    validators: (<FormWidgetConfig<any>>this._config).validators
                });
                return field.validate(val, rst)
            }

            public validate(): string | boolean {
                if (Check.isEmpty((<FormWidgetConfig<any>>this._config).validators)) return true;

                let name = this.name(),
                    rst = new ValidateResult(),
                    val = J.clone(this.value());
                this._fire('validating', [rst, val, name]);
                let vdt = this._validate(name, val, rst);
                this._fire('validated', [rst, val, name]);

                return vdt;
            }

            //////////////////////////////////////////////////////////////////////////////
            protected _dataModel: ListModel;
            
            public dataModel<M>(): M {
                return <any>this._dataModel
            }

            protected _initDataModel() {
                let me = this, cfg = <FormWidgetConfig<any>>this._config;
                this._dataModel = Class.newInstance(cfg.dataModel);

                (<FormWidgetEvents[]>['loading', 'loadsuccess', 'loadfailure', 'loaderror', 'dataupdating', 'dataupdated']).forEach(e => {
                    this._dataModel.on(e, function () {
                        if (e == 'dataupdated') me.data(this.getData(), true);
                        me._fire<FormWidgetEvents>(e, Arrays.slice(arguments, 1));
                    })
                })
            }

            /**
             * Read/Write data.
             * @param data 数据
             * @param silent 是否事件静默
             */
            public data(): any
            public data(data: any, silent?: boolean): this
            public data(data?: any, silent?: boolean): any {
                let cfg = <FormWidgetConfig<any>>this._config;
                if (arguments.length == 0) return cfg.data;

                let newData = J.clone(data),
                    oldData = J.clone(cfg.data);

                if (!silent) this._fire('dataupdating', [newData, oldData]);
                cfg.data = data;
                if (this._dataModel) this._dataModel.setData(data, true);

                this._renderData();
                this._renderValue();
                if (!silent) this._fire('dataupdated', [newData, oldData]);
                return this;
            }
            protected _renderData() { }

            /**
             * Clear value.
             */
            public clear(silent?: boolean) {
                return this.value(null, silent)
            }

            /**
             * Load data from server. 
             */
            public load(quy: string | AjaxRequest, silent?: boolean): Promise<ResultSet<any>> {
                let cfg = <FormWidgetConfig<any>>this._config;
                cfg.dataQuery = <AjaxRequest>J.union(Ajax.toRequest(cfg.dataQuery), Ajax.toRequest(quy));
                return this._dataModel.load(cfg.dataQuery, silent);
            }

            public reload() {
                if (this._dataModel) this._dataModel.reload();
                return this
            }

            protected _equalValues(newVal: any, oldVal: any): boolean {
                return oldVal == newVal
            }

            public value(): any
            public value(val: any, silent?: boolean): this
            public value(val?: any, silent?: boolean): any {
                let cfg = <FormWidgetConfig<any>>this._config, oldVal = this._valueModel.get(this.name());
                if (arguments.length == 0) return oldVal;

                this._setValue(val, silent);
                this._renderValue();
                return this
            }

            protected _setValue(val, silent?: boolean) {
                this._hideError();
                this._valueModel.set(this.name(), val, silent || this._equalValues(val, this.value()));
                if ((<FormWidgetConfig<any>>this._config).autoValidate) this.validate();
            }
            protected _renderValue(): void {
                let v: string = this.value() || '';
                if (this._mainEl.val() !== v) this._mainEl.val(v);
            }

            /**
             * Restore to ini value.
             */
            public reset() {
                return this.value((<FormWidgetConfig<any>>this._config).iniValue)
            }

            protected _valueModel: Model;
            public valueModel(): Model {
                return this._valueModel
            }
            protected _initValueModel() {
                let cfg = <FormWidgetConfig<any>>this._config, vModel = cfg.valueModel;

                if (!vModel) {
                    this._valueModel = new Model();
                } else if (Types.subKlass(<any>vModel, Model)) {
                    this._valueModel = Class.newInstance(<Klass<Model>>vModel);
                } else {
                    this._valueModel = <Model>vModel;
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
                    this._fire<FormWidgetEvents>('changed', [newVal, oldVal])
                });
            }

            //////////////////////////////////////////////////////////////////////////////

        }
    }

}
import FormWidgetConfig = JS.fx.FormWidgetConfig;
import FormWidget = JS.fx.FormWidget;
import FormWidgetEvents = JS.fx.FormWidgetEvents
