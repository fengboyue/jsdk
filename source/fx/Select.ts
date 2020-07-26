/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../../libs/select2/4.0.11/select2.d.ts" />
/// <reference path="FormWidget.ts"/>

module JS {

    export namespace fx {

        let J = Jsons, Y = Types, E = Check.isEmpty;

        export enum SelectFaceMode {
            square = 'square',
            round = 'round',
            pill = 'pill',
            shadow = 'shadow'
        }

        export type SelectEvents = FormWidgetEvents | 'selected' | 'unselected';

        export interface SelectListeners extends FormWidgetListeners<Select> {
            selected?: EventHandler1<Select, SelectOption[]> 
            unselected?: EventHandler1<Select, SelectOption[]> 
        }

        export class SelectOption {
            id: string | number;
            text: string;
            selected?: boolean = false;
            title?: string;
            disabled?: boolean = false;
            children?: Array<SelectOption>;
        }
        export class SelectConfig extends FormWidgetConfig<Select> {

            rtl?: boolean = false;

            outline?: boolean = false;

            faceMode?: SelectFaceMode | SelectFaceMode[];

            placeholder?: string;

            /**
             * Auto select first row when user have not select any row.
             */
            autoSelectFirst?: boolean = false;

            iniValue?: string | string[];
            data?: Array<SelectOption>;

            /**
             * CRUD mode for multiple
             */
            crud?: boolean = false;
            multiple?: boolean = false;
            allowClear?: boolean = false;
            maximumSelectionLength?: number = Infinity;
            /**
             * Function used to render the current selection.
             */
            formatSelection?: (object: any, container: JQuery, escapeMarkup: (markup: string) => string) => string;
            /**
             * Function used to render a result that the user can select.
             */
            formatResult?: (object: any, container: JQuery, query: any, escapeMarkup: (markup: string) => string) => string;

            width?: string | number;

            /**
             * 是否自动搜索数据
             */
            autoSearch?: boolean = false;
            /**
             * 最小需要输入多少个字符才进行查询。缺省为零，配合参数maximumSelectionLength，不出现搜索框。
             */
            minimumInputLength?: number = 0;
            /**
             * 可输入选项
             */
            inputable?: boolean = false;
            /**
             * 渲染时是否自动转义
             */
            autoEscape?: boolean = true;

            optionRender?: (this: Select, option: SelectOption, optionEl: JQuery) => string;
            selectionRender?: (this: Select, option: SelectOption, optionEl: JQuery) => string;

            listeners?: SelectListeners;
        }

        /**
         * Supports 3 modes:
         * 1.single 
         * 2.multiple & non-crud
         * 3.multiple & crud
         * 
         * A crud multiple select will returns all diffrents between current values and iniValues by the "crudValue" method.
         * 
         * @bug select2 doesn't support readonly
         */
        @widget('JS.fx.Select')
        export class Select extends FormWidget implements ICRUDWidget<JsonObject[]>{

            /**
             * @constructor
             * @param {SelectConfig} config 
             */
            constructor(cfg: SelectConfig) {
                super(cfg);
            }

            public load(api: string | AjaxRequest) {
                if ((<SelectConfig>this._config).autoSearch) throw new NotHandledError('The method be not supported when autoSearch is true!');
                return super.load(api);
            }

            public iniValue(): string | string[]
            public iniValue(v: string | string[], render?:boolean): this
            public iniValue(v?: string | string[], render?:boolean): any {
                if (arguments.length == 0) return super.iniValue();
                return super.iniValue(v, render)
            }

            protected _destroy(): void {
                this._mainEl.select2('destroy');
                super._destroy();
            }

            protected _bodyFragment() {
                let cfg = <SelectConfig>this._config,
                    cls = '';
                if (cfg.colorMode) {
                    if (cfg.outline) cls += ' outline';
                    cls += ` ${cfg.colorMode}`;
                }
                this._eachMode('faceMode', (mode: string) => {
                    cls += ' face-' + mode;
                });
                return `<div class="w-100 font-${cfg.sizeMode || 'md'} ${cls}">
                            <select name="${this.name()}" jsfx-role="main" class="form-control"></select>
                        </div>`
            }

            protected _onAfterRender() {
                this._initSelect2();
                this._renderData();

                let me = this;
                this._mainEl.on('change', function (e, data: string) {
                    if (data == '_jsfx') return;
                    let nv = <string[]>$(this).val();
                    me._setValue(E(nv) ? null : nv);
                })

                let evts = ['selected', 'unselected'];
                ['select2:select', 'select2:unselect'].forEach((type, i) => {
                    this._mainEl.on(type, e => {
                        me._fire<SelectEvents>(<any>evts[i], [e.params.data])
                    })
                })

                super._onAfterRender();
            }

            private _optionHtml(data: Array<SelectOption>): string {
                let html = '';
                data.forEach(op => {
                    if (op.children) {
                        let childrenHtml = this._optionHtml(op.children);
                        html += `<optgroup label="${op.text}">${childrenHtml}</optgroup>`
                    } else {
                        html += `<option value="${op.id}" ${op.disabled ? 'disabled' : ''} ${op.selected ? 'selected' : ''}>${op.text}</option>`;
                    }
                });
                return html
            }

            private _initSelect2(): void {
                let cfg = <SelectConfig>this._config,
                    dataQuery = cfg.dataQuery,
                    url = dataQuery ? (Y.isString(dataQuery) ? <string>dataQuery : (<AjaxRequest>dataQuery).url) : null,
                    jsonParams = dataQuery ? (Y.isString(dataQuery) ? null : (<AjaxRequest>dataQuery).data) : null,
                    options: Select2Options = {
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
                this._eachMode('faceMode', (mode: string) => {
                    cls += ' border-' + mode;
                });
                options.dropdownCssClass = cls;

                if (cfg.rtl) options.dir = 'rtl';

                if (!cfg.autoSearch) {
                    //最小搜索结果数。缺省为无限大，即不可搜索。
                    options.minimumResultsForSearch = Infinity;
                    options.minimumInputLength = 0;
                }
                if (!cfg.autoEscape) {
                    options.escapeMarkup = (c) => { return c };
                }

                let me = this;
                if (cfg.optionRender) options.templateResult = function (data: Select2SelectionObject, el?: JQuery) {
                    return cfg.optionRender.apply(me, [data, el]);
                }
                if (cfg.selectionRender) options.templateSelection = function (data: Select2SelectionObject, el?: JQuery) {
                    return cfg.selectionRender.apply(me, [data, el]);
                }

                if (cfg.autoSearch && url) options.ajax = {
                    url: function (pms) {
                        return url + (pms.term || '');
                    },
                    dataType: 'json',
                    delay: 500,// 延迟请求500毫秒
                    data: function () { return jsonParams ? jsonParams : {} },
                    processResults: (res: any, params) => {
                        let data = <Array<any>>J.find(res, ResultSet.DEFAULT_FORMAT.recordsProperty);
                        this.data(data);
                        return {
                            results: data// 后台返回的数据集
                            // pagination: {
                            //     more: (params.page * params.pageSize) < data.total
                            // }
                        };
                    },
                    cache: true
                }
                this._mainEl.select2(options);
            }


            public addOption(opt: SelectOption): Select {
                return this.data([opt], false, 'append')
            }
            public addOptions(data: Array<SelectOption>): Select {
                return this.data(data, false, 'append')
            }
            public removeOption(id: string | number): Select {
                return this.data(<any>[id], false, 'remove');
            }
            public removeOptions(ids: Array<string | number>): Select {
                return this.data(<any>ids, false, 'remove');
            }

            public select(i: number, silent?: boolean) {
                let cfg = <SelectConfig>this._config;
                if (i < 0 || E(cfg.data) || i >= cfg.data.length) return;

                this.value('' + cfg.data[i].id, silent);
            }

            isCrud(): boolean {
                let cfg = <SelectConfig>this._config;
                return cfg.multiple && cfg.crud
            }

            public crudValue(): JsonObject[] {//和初值进行比较得到差值
                if (!this.isCrud()) return null;

                let val = Arrays.toArray<string>(this.value()),
                    iniVal = Arrays.toArray<string>(this.iniValue()),
                    arr = [];

                iniVal.forEach((v: string) => {
                    if (val.findIndex(it => {
                        return it == v
                    }) < 0) {
                        arr[arr.length] = { 
                            _crud: 'D',
                            id: v
                        }
                    }
                });
                val.forEach((v: string) => {
                    if (iniVal.findIndex(it => {
                        return it == v
                    }) < 0) {
                        arr[arr.length] = { 
                            _crud: 'C',
                            id: v
                        }
                    }
                });

                return arr;
            }

            public data(): SelectOption[]
            public data(data: SelectOption[], silent?: boolean, mode?: 'append'): this
            public data(data: Array<string | number>, silent?: boolean, mode?: 'remove'): this
            public data(data?: SelectOption[] | Array<string | number>, silent?: boolean, mode?: 'append' | 'remove'): any {
                let cfg = <FormWidgetConfig<any>>this._config;
                if (arguments.length == 0) return cfg.data;

                let newData, newDataCopy, oldData = J.clone(cfg.data);
                if (mode == 'append') {
                    let tmp = <SelectOption[]>J.clone(cfg.data) || [];
                    newData = tmp.add(<SelectOption[]>data);
                    newDataCopy = J.clone(newData);
                } else if (mode == 'remove') {
                    let tmp = <SelectOption[]>J.clone(cfg.data) || [];
                    (<Array<string | number>>data).forEach(id => {
                        tmp.remove(item => {
                            return item.id == id
                        })
                    })
                    newData = tmp;
                    newDataCopy = J.clone(newData);
                } else {
                    newData = data;
                    newDataCopy = J.clone(newData);
                }

                if (!silent) this._fire('dataupdating', [newDataCopy, oldData]);
                cfg.data = newData;
                if (this._dataModel) this._dataModel.setData(newData, true);

                this._renderDataBy(mode ? data : newData, mode);
                this._renderValue();
                if (!silent) this._fire('dataupdated', [newDataCopy, oldData]);
                return this;
            }

            protected _iniValue() {
                let cfg = <SelectConfig>this._config;
                if (cfg.autoSelectFirst && cfg.data && cfg.data.length > 0) cfg.iniValue = '' + cfg.data[0].id;
                super._iniValue();
            }

            protected _renderData() {
                this._renderDataBy((<SelectConfig>this._config).data)
            }
            private _renderDataBy(data?: SelectOption[] | Array<string | number>, mode?: 'append' | 'remove') {
                if (data) {
                    if (!mode) this._mainEl.empty();

                    if (mode != 'remove') {
                        this._mainEl.append(this._optionHtml(<SelectOption[]>data));
                    } else {
                        (<Array<string | number>>data).forEach(id => {
                            this._mainEl.find(`option[value="${id}"]`).remove();
                        })
                    }
                } else {
                    if (mode != 'remove') this._mainEl.empty();
                }
            }

            protected _renderValue() {
                let v = this.value();
                if (!this._equalValues(v, <any>this._mainEl.val())) this._mainEl.val(v).trigger('change', '_jsfx');
            }
            protected _equalValues(newVal: string | string[], oldVal: string | string[]): boolean {
                if (E(oldVal) && E(newVal)) return true;

                let cfg = <SelectConfig>this._config;
                return cfg.multiple ? Arrays.equalToString(<string[]>oldVal, <string[]>newVal) : oldVal == newVal;
            }

            /**
             * 读写Value
             * @param val 值
             * @param force 是否强制改变
             * @param silent 是否事件静默 
             */
            public value(): string | string[]
            public value(val: string | string[], silent?: boolean): this
            public value(val?: string | string[], silent?: boolean): any {
                if (arguments.length == 0) return super.value();

                let cfg = <SelectConfig>this._config;
                if((cfg.multiple && Y.isString(val))||(!cfg.multiple && Y.isArray(val))) throw new TypeError(`Wrong value type for select<${this.id}>!`);
                return super.value(val, silent)
            }

            protected _showError(msg:string) {
                super._showError(msg);
                this.widgetEl.find('.select2-selection').addClass('jsfx-input-error');
            }
            protected _hideError() {
                super._hideError();
                this.widgetEl.find('.select2-selection').removeClass('jsfx-input-error');
            }
        }

    }
}
import Select = JS.fx.Select;
import SelectFaceMode = JS.fx.SelectFaceMode;
import SelectEvents = JS.fx.SelectEvents;
import SelectOption = JS.fx.SelectOption;
import SelectConfig = JS.fx.SelectConfig;
