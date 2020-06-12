/**
 * Written by Frank.Feng: 2575149797@qq.com or https://github.com/fengboyue
 * See online docs for more info:
 * http://www.daterangepicker.com
 */

/**
 * Several events are triggered on the element you attach the picker to, which you can listen for.
 * show.daterangepicker: Triggered when the picker is shown
 * hide.daterangepicker: Triggered when the picker is hidden
 * showCalendar.daterangepicker: Triggered when the calendar(s) are shown
 * hideCalendar.daterangepicker: Triggered when the calendar(s) are hidden
 * apply.daterangepicker: Triggered when the apply button is clicked, or when a predefined range is clicked
 * cancel.daterangepicker: Triggered when the cancel button is clicked
 * 
 * Some applications need a "clear" instead of a "cancel" functionality, which can be achieved by changing the button label and watching for the cancel event:
 * While passing in a callback to the constructor is the easiest way to listen for changes in the selected date range, you can also do something every time the apply button is clicked even if the selection hasn't changed:
 */
type DRPEvents = "show.daterangepicker" | "hide.daterangepicker" | "showCalendar.daterangepicker" | "hideCalendar.daterangepicker" | "apply.daterangepicker" | "cancel.daterangepicker";

interface DRPOptions {
    /**
     * The beginning date of the initially selected date range. 
     * If you provide a string, it must match the date format string set in your locale setting.
     */
    startDate?: Date | string;
    /**
     * The end date of the initially selected date range.
     */
    endDate?: Date | string;
    /**
     * The earliest date a user may select.
     */
    minDate?: Date | string;
    /**
     * The latest date a user may select.
     */
    maxDate?: Date | string;
    /**
     * The maximum span between the selected start and end dates. Check off maxSpan in the configuration generator for an example of how to use this. You can provide any object the moment library would let you add to a date.
     */
    maxSpan?: object;
    /**
     * Show year and month select boxes above calendars to jump to a specific month and year.
     */
    showDropdowns?: boolean;
    /**
     * The minimum year shown in the dropdowns when showDropdowns is set to true.
     */
    minYear?: number;
    /**
     * The maximum year shown in the dropdowns when showDropdowns is set to true.
     */
    maxYear?: number;
    /**
     * Show localized week numbers at the start of each week on the calendars.
     */
    showWeekNumbers?: boolean;
    /**
     * Show ISO week numbers at the start of each week on the calendars.
     */
    showISOWeekNumbers?: boolean;
    /**
     * Adds select boxes to choose times in addition to dates.
     */
    timePicker?: boolean;
    /**
     * Increment of the minutes selection list for times (i.e. 30 to allow only selection of times ending in 0 or 30).
     */
    timePickerIncrement?: number;
    /**
     * Use 24-hour instead of 12-hour times, removing the AM/PM selection.
     */
    timePicker24Hour?: boolean;
    /**
     * Show seconds in the timePicker.
     */
    timePickerSeconds?: boolean;
    /**
     * Set predefined date ranges the user can select from. Each key is the label for the range, and its value an array with two dates representing the bounds of the range. Click ranges in the configuration generator for examples.
     */
    ranges?: object;
    /**
     * Displays "Custom Range" at the end of the list of predefined ranges, when the ranges option is used. This option will be highlighted whenever the current date range selection does not match one of the predefined ranges. Clicking it will display the calendars to select a new range.
     */
    showCustomRangeLabel?: boolean;
    /**
     * Normally, if you use the ranges option to specify pre-defined date ranges, calendars for choosing a custom date range are not shown until the user clicks "Custom Range". When this option is set to true, the calendars for choosing a custom date range are always shown instead.
     */
    alwaysShowCalendars?: boolean;
    /**
     * Whether the picker appears aligned to the left, to the right, or centered under the HTML element it's attached to.
     */
    opens?: 'left' | 'right' | 'center';
    /**
     * Whether the picker appears below (default) or above the HTML element it's attached to.
     */
    drops?: 'down' | 'up';
    /**
     * CSS class names that will be added to both the apply and cancel buttons.
     */
    buttonClasses?: string;
    /**
     * CSS class names that will be added only to the apply button.
     */
    applyButtonClasses?: string;
    /**
     * CSS class names that will be added only to the cancel button.
     */
    cancelButtonClasses?: string;
    /**
     * Allows you to provide localized strings for buttons and labels, customize the date format, and change the first day of week for the calendars. Check off locale in the configuration generator to see how to customize these options.
     */
    locale?: object;
    /**
     * Show only a single calendar to choose one date, instead of a range picker with two calendars. The start and end dates provided to your callback will be the same single date chosen.
     */
    singleDatePicker?: boolean;
    /**
     * Hide the apply and cancel buttons, and automatically apply a new date range as soon as two dates are clicked.
     */
    autoApply?: boolean;
    /**
     * When enabled, the two calendars displayed will always be for two sequential months (i.e. January and February), and both will be advanced when clicking the left or right arrows above the calendars. When disabled, the two calendars can be individually advanced and display any month/year.
     */
    linkedCalendars?: boolean;
    /**
     * A function that is passed each date in the two calendars before they are displayed, and may return true or false to indicate whether that date should be available for selection or not.
     */
    isInvalidDate?: (date1: Date, date2: Date) => boolean;
    /**
     * A function that is passed each date in the two calendars before they are displayed, and may return a string or array of CSS class names to apply to that date's calendar cell.
     */
    isCustomDate?: (date1: Date, date2: Date) => string | string[];
    /**
     * Indicates whether the date range picker should automatically update the value of the <input> element it's attached to at initialization and when the selected dates change.
     */
    autoUpdateInput?: boolean;
    /**
     * jQuery selector of the parent element that the date range picker will be added to, if not provided this will be 'body'
     */
    parentEl?: string;
}

interface JQuery {
    daterangepicker(): JQuery;
    daterangepicker(options: DRPOptions): JQuery;

    off(events: DRPEvents, selector?: string, handler?: (e: JQuery.Event) => any): JQuery;
    off(events: DRPEvents, handler: (e: JQuery.Event) => any): JQuery;

    on(events: DRPEvents, selector: string, data: any, handler?: (e: JQuery.Event) => any): JQuery;
    on(events: DRPEvents, selector: string, handler: (e: JQuery.Event) => any): JQuery;
    on(events: DRPEvents, handler: (e: JQuery.Event) => any): JQuery;
}