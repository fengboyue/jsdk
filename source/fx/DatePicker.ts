/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../../libs/datepicker/1.9.0/datepicker.d.ts" />
/// <reference path="LineInput.ts"/>

module JS {

    export namespace fx {

        export type DatePickerEvents = InputEvents | 'pickershown' | 'pickerhidden';
        export interface DatePickerListeners extends InputListeners<DatePicker> {
            pickershown?: EventHandler<DatePicker>;
            pickerhidden?: EventHandler<DatePicker>;
        }

        export class DatePickerConfig extends LineInputConfig<DatePicker> {

            iniValue?: string | Date;
            /**
             * Date to view when initially opening the calendar. 
             * The internal value of the date remains today as default, but when the datepicker is first opened the calendar will open to defaultViewDate rather than today. 
             * If this option is not used, “today” remains the default view date.
             */
            defaultViewDate?: string | Date;
            /**
             * The string that will appear on top of the datepicker. If empty the title will be hidden.
             */
            title?: string = '';
            /**
             * @see {@link Date.format}
             * @default 'YYYY-MM-DD'
             */
            format?: string = 'YYYY-MM-DD';
            /**
             * 最小日期
             * The earliest date that may be selected; all earlier dates will be disabled.
             * Date should be in local timezone. String must be parsable with format.
             */
            minDate?: Date | string;
            /**
             * 最大日期
             * The latest date that may be selected; all later dates will be disabled.
             * Date should be in local timezone. String must be parsable with format.
             */
            maxDate?: Date | string;
            /**
             * 选中日期后自动关闭
             * Whether or not to close the datepicker immediately when a date is selected.
             */
            autoclose?: boolean = false;
            /**
             * 开始视图
             * The view that the datepicker should show when it is opened. Accepts: 0 or “days” or “month”, 1 or “months” or “year”, 2 or “years” or “decade”, 3 or “decades” or “century”, and 4 or “centuries” or “millenium”. Useful for date-of-birth datepickers.
             * @default 0
             * @description 接受值:0,1,2,3,4分别对应days,months,years,decades,centuries
             */
            startView?: 0 | 1 | 2 | 3 | 4;
            /**
             * 今日按钮
             * If true, displays a “Today” button at the bottom of the datepicker to select the current date.
             */
            todayBtn?: boolean = false;
            /**
             * 今日高亮
             * If true, highlights the current date.
             */
            todayHighlight?: boolean = false;
            /**
             * 是否在最左边显示这是当年第几周
             * Whether or not to show week numbers to the left of week rows.
             */
            calendarWeeks?: boolean = false;
            /**
             * 清除按钮
             * If true, displays a “Clear” button at the bottom of the datepicker to clear the input value. If “autoclose” is also set to true, this button will also close the datepicker.
             */
            clearBtn?: boolean = false;
            /**
             * 方位
             * A space-separated string consisting of one or two of “left” or “right”, “top” or “bottom”, and “auto” (may be omitted); for example, “top left”, “bottom” (horizontal orientation will default to “auto”), “right” (vertical orientation will default to “auto”), “auto top”. Allows for fixed placement of the picker popup.
             * “orientation” refers to the location of the picker popup’s “anchor”; you can also think of it as the location of the trigger element (input, component, etc) relative to the picker.
             * “auto” triggers “smart orientation” of the picker. Horizontal orientation will default to “left” and left offset will be tweaked to keep the picker inside the browser viewport; vertical orientation will simply choose “top” or “bottom”, whichever will show more of the picker in the viewport.
             */
            orientation?: 'auto' | 'lt' | 'lb' | 'rt' | 'rb' = 'auto';
            /**
             * 禁用日期
             * Array of date strings or a single date string formatted in the given date format.
             * @default []
             */
            datesDisabled?: string | string[];
            /**
             * Days of the week that should be disabled. Values are 0 (Sunday) to 6 (Saturday). Multiple values should be comma-separated. Example: disable weekends: '06' or '0,6' or [0,6].
             */
            daysOfWeekDisabled?: string | number[];
            /**
             * Days of the week that should be highlighted. Values are 0 (Sunday) to 6 (Saturday). Multiple values should be comma-separated. Example: highlight weekends: '06' or '0,6' or [0,6].
             */
            daysOfWeekHighlighted?: string | number[];

            /**
             * stantiating the datepicker on a simple div will give an embedded picker that is always visible.
             */
            embedded?: boolean = false;
            /**
             * Enable multidate picking. The input’s value (if present) is set to a string generated by joining the dates, formatted, with multidateSeparator.
             */
            multidate?: boolean | number;
            /**
             * The string that will appear between dates when generating the input’s value. 
             * @default ','
             */
            multidateSeparator?: string = ',';

            listeners?: DatePickerListeners;
        }

        @widget('JS.fx.DatePicker')
        export class DatePicker extends LineInput {

            private _picker: JQuery;

            constructor(cfg: DatePickerConfig) {
                super(cfg);
            }

            public showPicker(): DatePicker {
                this._picker.datepicker('show');
                return this;
            }

            public hidePicker(): DatePicker {
                this._picker.datepicker('hide');
                return this;
            }

            public value(): string
            public value(val: string | Date, silent?: boolean): this
            public value(val?: string | Date, silent?: boolean): any {
                if (arguments.length == 0) return super.value();
                return super.value(Types.isDate(val) ? (<Date>val).format((<DatePickerConfig>this._config).format) : val, silent)
            }


            protected _renderValue() {
                let v = this.value() || '';
                if (this._mainEl.val() !== v) this._picker.datepicker('update', v);
                return this
            }

            protected _inputHtml() {
                let cfg = <DatePickerConfig>this._config;
                if (!cfg.embedded) return super._inputHtml();

                return `<div id="${this.id}_picker"></div><input name="${this.name()}" type="hidden" jsfx-role="main">`
            }

            protected _onBeforeRender() {
                if (this._picker) this._picker.datepicker('destroy');
                if (!(<DatePickerConfig>this._config).embedded) super._onBeforeRender();
            }

            protected _onAfterRender() {
                let cfg = <DatePickerConfig>Jsons.clone(this._config),
                    el = cfg.embedded ? $(`#${this.id}_picker`) : this._mainEl;

                cfg.orientation = <any>{ auto: 'auto', lt: 'left top', lb: 'left bottom', rt: 'right top', rb: 'right bottom' }[cfg.orientation];
                let c = <DatepickerOptions>cfg;
                c.immediateUpdates = true;
                c.language = cfg.locale;
                c.enableOnReadonly = false;
                c.todayBtn = cfg.todayBtn ? 'linked' : false;
                c.startDate = cfg.minDate;
                c.endDate = cfg.maxDate;
                c.weekStart = 1;
                c.updateViewDate = false;//BUGFIX: if true, change date event be executed twice because picker will change to today at first time. 
                c.format = cfg.format.replace(/YYYY|YY|MMMM|MMM|MM|M|DD|D|dddd|ddd/g,
                    function (m) {
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

                            default: return m
                        }
                    }
                );

                this._picker = el.datepicker(c);
                this._picker.on('show', () => {
                    //BUGFIX: picker被点击是也会触发此事件
                    if($('.datepicker').css('display')=='block') this._fire('pickershown')
                });
                this._picker.on('hide', () => {
                    this._fire('pickerhidden')
                });
                this._picker.on('changeDate', () => {//通过picker带来的改变
                    this._setValue(this._picker.datepicker('getFormattedDate'));
                });

                this._mainEl.on('input change blur', () => {//通过input直接输入带来的改变
                    let newVal = this._mainEl.val();
                    if(this.value()!=newVal) this._setValue(newVal);
                });

                super._onAfterRender()
            }

            protected _destroy(): void {
                if (this._picker) this._picker.datepicker('destroy');
                super._destroy()
            }

        }

    }
}
import DatePickerConfig = JS.fx.DatePickerConfig;
import DatePicker = JS.fx.DatePicker;
import DatePickerEvents = JS.fx.DatePickerEvents;
import DatePickerListeners = JS.fx.DatePickerListeners;