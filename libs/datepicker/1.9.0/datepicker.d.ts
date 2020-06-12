// Type definitions for bootstrap-datepicker
// Project: https://github.com/eternicode/bootstrap-datepicker
// Definitions by: Boris Yankov <https://github.com/borisyankov>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3


type DatepickerEvents = "show"|"hide"|"clearDate"|"changeDate"|"changeMonth"|"changeYear"|"changeDecade"|"changeCentury";

type DatepickerViewModes = 0|"days"|1|"months"|2|"years"|3|"decades"|4|"centuries"|"millenium";

type DatepickerOrientations = "auto"|"left top"|"left bottom"|"right top"|"right bottom";

/**
 * All options that take a “Date” can handle a Date object; a String
 * formatted according to the given format; or a timedelta relative
 * to today, eg “-1d”, “+6m +1y”, etc, where valid units are “d” (day),
 * “w” (week), “m” (month), and “y” (year).
 *
 * See online docs for more info:
 *  https://bootstrap-datepicker.readthedocs.io/en/latest/options.html
 */
interface DatepickerOptions {
    /**
     * String. Default: “mm/dd/yyyy”
        The date format, combination of d, dd, D, DD, m, mm, M, MM, yy, yyyy.

        d, dd: Numeric date, no leading zero and leading zero, respectively. Eg, 5, 05.
        D, DD: Abbreviated and full weekday names, respectively. Eg, Mon, Monday.
        m, mm: Numeric month, no leading zero and leading zero, respectively. Eg, 7, 07.
        M, MM: Abbreviated and full month names, respectively. Eg, Jan, January
        yy, yyyy: 2- and 4-digit years, respectively. Eg, 12, 2012.
        Object.

        Custom formatting options

        toDisplay: function (date, format, language) to convert date object to string, that will be stored in input field
        toValue: function (date, format, language) to convert string object to date, that will be used in date selection
     */
    format?: string | DatepickerCustomFormatOptions;
    weekStart?: number;
    startDate?: Date|string;
    endDate?: Date|string;
    autoclose?: boolean;
    startView?: number;
    todayBtn?: boolean|"linked";
    todayHighlight?: boolean;
    keyboardNavigation?: boolean;
    language?: string;
    beforeShowDay?: (date: Date) => undefined|string|boolean|DatepickerBeforeShowDayResponse;
    beforeShowYear?: (date: Date) => undefined|string|boolean|DatepickerBeforeShowResponse;
    beforeShowDecade?: (date: Date) => undefined|string|boolean|DatepickerBeforeShowResponse;
    beforeShowCentury?: (date: Date) => undefined|string|boolean|DatepickerBeforeShowResponse;
    beforeShowMonth?: (date: Date) => undefined|string|boolean|DatepickerBeforeShowResponse;
    calendarWeeks?: boolean;
    clearBtn?: boolean;
    daysOfWeekDisabled?: string|number[];
    forceParse?: boolean;
    inputs?: any[];
    minViewMode?: DatepickerViewModes;
    maxViewMode?: DatepickerViewModes;
    multidate?: boolean|number;
    multidateSeparator?: string;
    orientation?: DatepickerOrientations;
    assumeNearbyYear?: boolean|number;
    templates?: any;
    zIndexOffset?: number;
    showOnFocus?: boolean;
    immediateUpdates?: boolean;
    title?: string;
    container?: string;
    datesDisabled?:string|string[];
    daysOfWeekHighlighted?:string|number[];
    defaultViewDate?:Date|string|DatepickerViewDate;
    updateViewDate?:boolean; //by Boyue on 2019
    enableOnReadonly?: boolean;
    /** Update by Boyue on 2019 */
    disableTouchKeyboard?: boolean;
    keepEmptyValues?: boolean;
    toggleActive?: boolean;
}

interface DatepickerViewDate {
    year:number;
    /** Month starting with 0 */
    month:number;
    /** Day of the month starting with 1 */
    day:number;
}

interface DatepickerBeforeShowResponse {
    enabled?:boolean;
    classes?: string;
    tooltip?: string;
}

interface DatepickerBeforeShowDayResponse extends DatepickerBeforeShowResponse {
    content?: string;
}

interface DatepickerCustomFormatOptions {
    toDisplay?(date: Date, format: any, language: any): string;
    toValue?(date: Date, format: any, language: any): Date;
}

interface DatepickerEventObject extends JQueryEventObject {
    date: Date;
    dates: Date[];
    format(ix?:number): string;
    format(format?: string): string;
    format(ix?:number, format?: string): string;
}

interface JQuery {
    datepicker(): JQuery;
    datepicker(methodName: string): any;
    datepicker(methodName: string, params: any): any;
    datepicker(options: DatepickerOptions): JQuery;

    off(events: DatepickerEvents, selector?: string, handler?: (eventObject: DatepickerEventObject) => any): JQuery;
    off(events: DatepickerEvents, handler: (eventObject: DatepickerEventObject) => any): JQuery;

    on(events: DatepickerEvents, selector: string, data: any, handler?: (eventObject: DatepickerEventObject) => any): JQuery;
    on(events: DatepickerEvents, selector: string, handler: (eventObject: DatepickerEventObject) => any): JQuery;
    on(events: DatepickerEvents, handler: (eventObject: DatepickerEventObject) => any): JQuery;
}
