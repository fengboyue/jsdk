/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../../libs/daterangepicker/3.0.5/daterangepicker.d.ts" />
/// <reference path="LineInput.ts"/>

module JS {

    export namespace fx {

        export type DateRangePickerEvents = InputEvents | 'pickershown' | 'pickerhidden' | 'pickercanceled';
        export interface DateRangePickerListeners extends InputListeners<DateRangePicker> {
            pickershown?: EventHandler<DateRangePicker>;
            pickerhidden?: EventHandler<DateRangePicker>;
            pickercanceled?: EventHandler<DateRangePicker>;
        }

        export class DateRangePickerConfig extends LineInputConfig<DateRangePicker> {
            readonly?: boolean = false;
            iniValue?: Array<string|Date>;
            /**
             * @default 'YYYY/MM/DD'
             */
            format?: string = 'YYYY/MM/DD';
            dateSeparator?: string = ' - ';
            /**
             * The earliest date a user may select.
             */
            minDate?: Date | string;
            /**
             * The latest date a user may select.
             */
            maxDate?: Date | string;
            /**
             * The minimum year shown in the dropdowns when showDropdowns is set to true.
             */
            minYear?: number;
            /**
             * The maximum year shown in the dropdowns when showDropdowns is set to true.
             */
            maxYear?: number;
            /**
             * Whether the picker appears aligned to the left, to the right, or centered under the HTML element it's attached to.
             */
            popDir?: 'left' | 'right' | 'center' = 'center';
            /**
             * Whether the picker appears below (default) or above the HTML element it's attached to.
             */
            dropPos?: 'down' | 'up';

            /**
             * Hide the apply and cancel buttons, and automatically apply a new date range as soon as two dates are clicked.
             */
            autoclose?: boolean = false;

            /**
             * Adds select boxes to choose times in addition to dates.
             */
            minutesPlus?: boolean = false;
            /**
             * Show seconds in the timePicker.
             */
            secondsPlus?: boolean = false;
            /**
             * Increment of the minutes selection list for times (i.e. 30 to allow only selection of times ending in 0 or 30).
             */
            minutesStep?: number;
            /**
             * Set predefined date ranges the user can select from. Each key is the label for the range, and its value an array with two dates representing the bounds of the range. Click ranges in the configuration generator for examples.
             */
            ranges?: JsonObject<Array<Date>>;

            showCalendars?: boolean = true;

            listeners?: DateRangePickerListeners;
        }

        @widget('JS.fx.DateRangePicker')
        export class DateRangePicker extends LineInput {

            private _picker: JQuery;

            constructor(cfg: DateRangePickerConfig) {
                super(cfg)
            }

            private _autoFormat() {
                let cfg = <DateRangePickerConfig>this._config;
                if (cfg.secondsPlus) return 'YYYY/MM/DD HH:mm:ss';
                if (cfg.minutesPlus) return 'YYYY/MM/DD HH:mm';
                return 'YYYY/MM/DD'
            }
            protected _equalValues(newVal: string[], oldVal: string[]): boolean {
                if (!oldVal && !newVal) return true;
                if (!oldVal || !newVal) return false;

                return oldVal[0] == newVal[0] && oldVal[1] == newVal[1]
            }

            private _errorType(val) {
                throw new Errors.TypeError('An invalid date format for DateRangePicker:' + val.toString())
            }
            
            public value(): string[]
            public value(val: string | string[] | Date[], silent?: boolean): this
            public value(val?: string | string[] | Date[], silent?: boolean): any {
                if (arguments.length == 0) return super.value();

                let cfg = <DateRangePickerConfig>this._config, arr = null;
                if (val) {
                    arr = [];
                    if (Types.isArray(val)) {
                        if (val.length < 2) this._errorType(val);
                        arr = [this._formatDate(val[0]), this._formatDate(val[1])]
                    }else if ((<string>val).indexOf(cfg.dateSeparator) < 0) {
                        this._errorType(val);
                    } else {
                        arr = (<string>val).split(cfg.dateSeparator)
                    }
                }

                return super.value(arr, silent)
            }

            private _formatDate(date: string | Date): string {
                let d = date?date: new Date();
                return Types.isDate(d) ? (<Date>d).format((<DateRangePickerConfig>this._config).format || this._autoFormat()) : (<string>d || '')
            }

            private _dateString(val: Array<any>){
                let cfg = <DateRangePickerConfig>this._config;
                return Check.isEmpty(val) ? '' : `${this._formatDate(val[0])}${cfg.dateSeparator}${this._formatDate(val[1])}`;    
            }
            protected _renderValue(): Widget {
                let val: string[] = this.value(), today = new Date(),
                    text = this._dateString(val);
                    
                if (text != this._mainEl.val()) {
                    this._mainEl.val(text); //not trigger change event
                    if (this._picker) {
                        let d1 = val?val[0]||today:today, d2 = val?val[1]||today:today;
                        this._mainEl.data('daterangepicker').setStartDate(d1);
                        this._mainEl.data('daterangepicker').setEndDate(d2);
                    }
                }
                if (text && this.isEnabled() && !this.readonly()) $(`#${this.id}-icon-clear`).show();

                return this
            }

            protected _onAfterRender() {
                let cfg = <DateRangePickerConfig>this._config,
                    value = this.value(),
                    val = [undefined, undefined]; //BUGFIX: if be empty or null, the picker shows many of NaN
                if (value) {
                    if (!value[0]) value[0] = undefined;
                    if (!value[1]) value[1] = undefined;
                    val = [value[0], value[1]]
                }

                let c = <DRPOptions>{
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
                if (cfg.maxlength && Number.isFinite(cfg.maxlength)) c.maxSpan = { days: 7 };

                this._picker = this._mainEl.daterangepicker(c);
                this._picker.on('show.daterangepicker', () => {
                    this._fire('pickershown')
                });
                this._picker.on('hide.daterangepicker', () => {
                    this._fire('pickerhidden')
                });
                this._picker.on('cancel.daterangepicker', () => {
                    this._fire('pickercanceled')
                });
                this._picker.on('apply.daterangepicker', (e, picker) => {
                    let format = picker.locale.format, 
                    d1 = picker.startDate.format(format),
                    d2 = picker.endDate.format(format);
                    
                    this._setValue([d1, d2]);
                    this._mainEl.val(this._dateString([d1, d2])); 

                    this._autoclear();
                });

                this._iniValue();
                this._autoclear();
            }

            _autoclear(){
                let cfg = <DateRangePickerConfig>this._config;
                if (cfg.autoclear && !cfg.disabled && !cfg.readonly) {
                    let clear = $('#' + this.id + '-icon-clear');
                    Check.isEmpty(this.value()) ? clear.hide() : clear.show();
                }
            }
        }
    }
}

import DateRangePickerEvents = JS.fx.DateRangePickerEvents;
import DateRangePickerListeners = JS.fx.DateRangePickerListeners;
import DateRangePickerConfig = JS.fx.DateRangePickerConfig;
import DateRangePicker = JS.fx.DateRangePicker;