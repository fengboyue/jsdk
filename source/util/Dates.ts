/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="Bundle.ts"/>

/**
 * Add some helpful methods for Date.prototype
 */
interface Date {
    /**
     * @return {number} 1~53
     */
    getWeek(): number;
    /**
     * Moves the date to the week set. Week one (1) is the week which contains the first day of the year.
     * 
     * @param {Number} week  A Number (1 to 53) that represents the week of the year.
     * @param {Number} dayOfWeek 0 is Sunday, Defaults is 1.
     * @return {Date}    this
     */
    setWeek(week: number, dayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6): Date;

    /**
     * Returns a new Date object that is an exact date and time copy of the original instance.
     * @return {Date}    A new Date instance
     */
    clone(): Date;
    /**
     * Resets the time of this Date object to 00:00:00:000, which is the start of the day.
     * @return {Date}    this
     */
    setZeroTime(): Date;
    /**
     * Resets the time of this Date object to 23:59:59:999, which is the end of the day.
     * @return {Date}    this
     */
    setLastTime(): Date;
    /**
     * Resets the time of this Date object to the current time ('now').
     * @return {Date}    this
     */
    setNowTime(): Date;
    /**
     * Compares this instance to a Date object and returns an number indication of their relative values.  
     * @param date     Date object to compare [Required]
     * @return {Number}  -1 = this is lessthan date. 0 = values are equal. 1 = this is greaterthan date.
     */
    compareTo(date: Date): number;
    /**
     * Compares this instance to another Date object and returns true if they are equal.  
     * @param date     Date object to compare. If no date to compare, new Date() [now] is used.
     * @return {Boolean} true if dates are equal. false if they are not equal.
     */
    equals(date: Date): boolean;
    /**
     * Determines if this instance is between a range of two dates or equal to either the start or end dates.
     * @param start     Start of range [Required]
     * @param end     End of range [Required]
     * @return {Boolean} true is this is between or equal to the start and end dates, else false
     */
    between(start: Date, end: Date): boolean;
    /**
     * Determines if this date occurs after the date to compare to.
     * @param date     Date object to compare. If no date to compare, new Date() ("now") is used.
     * @return {Boolean} true if this date instance is greater than the date to compare to (or "now"), otherwise false.
     */
    isAfter(date: Date): boolean;
    /**
     * Determines if this date occurs before the date to compare to.
     * @param date     Date object to compare. If no date to compare, new Date() ("now") is used.
     * @return {Boolean} true if this date instance is less than the date to compare to (or "now").
     */
    isBefore(date: Date): boolean;
    /**
     * Determines if be the same year & month & day of two dates.
     * @param date 
     */
    isSameDay(date: Date): boolean;
    /**
     * Determines if be the same hour & minute & second of two dates.
     * @param date
     * @param equalsMS Milliseconds needs equals
     */
    isSameTime(date: Date, equalsMS?: boolean): boolean;
    /**
     * if this date instance is 'today', otherwise false.
     * @param date 
     */
    isToday(date: Date): boolean;
    /**
     * Adds value to this date
     * by millisecond | second | minute | hour | day | week | month | year
     * @param v 
     * @param type 
     */
    add(v: number, type: 'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'M' | 'y'): Date;
    /**
     * Sets new timezone offset(Minutes) to this date.
     * @param offset 
     */
    setTimezoneOffset(offset: number): Date;
    /**
     * Get the timezone offset string of the date.
     * @returns {String} The 4-character offset string prefixed with + or - (e.g. "-0500")
     */
    formatTimezoneOffset(): string;
    /**
     * Sets new value to this date
     * on millisecond | second | minute | hour | day | week | month | year | timezoneOffset
     * @param config 
     */
    set(config: {
        millisecond?: number,
        second?: number,
        minute?: number,
        hour?: number,
        day?: number,
        week?: number,
        month?: number,
        year?: number,
        timezoneOffset?: number
    }): Date;

    /**
     * Gets the 1st day of the month based on the orient day.
     */
    getFirstDayOfMonth(): Date;
    /**
     * Gets the last day of the month based on the orient day.
     */
    getLastDayOfMonth(): Date;
    /**
     * Gets the dayOfWeek based on the orient day.
     * @param dayOfWeek  0 is Sunday; Defaults is 1.
     */
    getDayOfWeek(dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6): Date;
    /**
     * Returns the number of milliseconds between this date and date.
     * @param date Defaults to now
     * @returns {Number} The diff in milliseconds
     */
    diff(date?: Date): number;

    /**
     * Converts the value of the current Date object to its equivalent string representation.
     * 
     * Format Specifiers:
     * <pre>
     * https://www.w3.org/TR/NOTE-datetime
     * https://www.ietf.org/rfc/rfc3339.txt
     * </pre>
     * 
     * Formats:
     * <pre>
     * Format  Description                                              Example
     * ------  -------------------------------------------------------  ----------------
     * s      The seconds of the minute between 0-59.                   "0" to "59"
     * ss     The seconds of the minute with leading zero if required.  "00" to "59"
     * 
     * m      The minute of the hour between 0-59.                      "0"  or "59"
     * mm     The minute of the hour with leading zero if required.     "00" or "59"
     * 
     * h      The hour of the day between 1-12.                         "1"  to "12"
     * hh     The hour of the day with leading zero if required.        "01" to "12"
     * 
     * H      The hour of the day between 0-23.                         "0"  to "23"
     * HH     The hour of the day with leading zero if required.        "00" to "23"     
     * 
     * ddd    Abbreviated week day name.                                "Mon" to "Sun" 
     * dddd   The full week day name.                                   "Monday" to "Sunday"
     * 
     * D      The day of the month between 1 and 31.                    "1"  to "31"
     * DD     The day of the month with leading zero if required.       "01" to "31"
     * 
     * M      The month of the year between 1-12.                       "1" to "12"
     * MM     The month of the year with leading zero if required.      "01" to "12"
     * MMM    Abbreviated month name.                                   "Jan" to "Dec"
     * MMMM   The full month name.                                      "January" to "December"
     * 
     * YY     The year as a two-digit number.                           "99" or "08"
     * YYYY   The full four digit year.                                 "1999" or "2008"
     * 
     * A      AM or PM                                                  "AM" or "PM"
     * </pre>
     * 
     * @param format   A format string. The default value is: 'YYYY-MM-DD HH:mm:ss'.
     * @param locale   A local string like {language}-{country}.
     * @return {string}  A string representation of the current Date object.
     */
    format(format?: string, locale?: string): string;
}
module JS {

    export namespace util {

        /**
         * Date helper class<br>
         * 日期工具类
         */
        export class Dates {

            public static I18N_RESOURCE: Resource = {
                AM: 'AM',
                PM: 'PM',
                WEEK_DAY_NAMES: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                WEEK_DAY_SHORT_NAMES: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                MONTH_NAMES: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                MONTH_SHORT_NAMES: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            }

            public static isValidDate(d: Date | string | number): boolean {
                if (d == null) return false;
                return !isNaN(new Date(<any>d).getTime())
            }

            /**
             * Compares the first Date object to the second Date object and returns true if they are equal.  
             * @param date1     First Date object to compare [Required]
             * @param date2     Second Date object to compare to [Required]
             * @return {Boolean} true if dates are equal. false if they are not equal.
             */
            public static equals(date1: Date, date2: Date) { return this.compare(date1, date2) === 0 }

            /**
             * Compares the first date to the second date and returns an number indication of their relative values.  
             * @param date1     First Date object to compare [Required].
             * @param date2     Second Date object to compare to [Required].
             * @return {Number}  -1 = date1 is lessthan date2. 0 = values are equal. 1 = date1 is greaterthan date2.
             */
            public static compare(date1: Date, date2: Date): number {
                if (!Types.isDefined(date1) || !Types.isDefined(date1)) throw new Errors.ArgumentError()
                return (date1 < date2) ? -1 : (date1 > date2) ? 1 : 0
            }

            /**
             * Determines if be the same year & month & day of two dates.
             * @param day1 
             * @param day2 
             */
            public static isSameDay(day1: Date, day2: Date) {
                return day1.getFullYear() == day2.getFullYear() && day1.getMonth() == day2.getMonth() && day1.getDate() == day2.getDate();
            }

            /**
             * Determines if be the same hour & minute & second of two dates.
             * @param day1 
             * @param day2 
             * @param equalsMS Milliseconds needs equals
             */
            public static isSameTime(day1: Date, day2: Date, equalsMS?: boolean) {
                if (equalsMS && day1.getMilliseconds() != day2.getMilliseconds()) return false;
                return day1.getHours() == day2.getHours() && day1.getMinutes() == day2.getMinutes() && day1.getSeconds() == day2.getSeconds();
            }

            /**
             * Gets a date that is set to the current date. The time is set to the start of the day (00:00)
             */
            public static today() { return new Date().setZeroTime() }

            /**
             * Determines if the current date instance is within a LeapYear.
             * @param year   The year.
             * @return {Boolean} true if date is within a LeapYear, otherwise false.
             */
            public static isLeapYear(year: number) {
                return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
            }

            /**
             * Gets the number of days in the month, given a year and month value. Automatically corrects for LeapYear.
             * @param year   The year.
             * @param month   The month (0-11).
             * @return {Number}  The number of days in the month.
             */
            public static getDaysInMonth(year: number, month: number) {
                return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
            }

            /**
             * Format a date or date string.
             * @see {@link Date.format}
             * 
             * @param date 
             * @param format 
             * @param locale 
             */
            public static format(date: string | Date, format: string, locale?: string): string {
                return new Date(<any>date).format(format, locale);
            }

        }
    }
}
import Dates = JS.util.Dates;

(function () {
    var $D = Date, $P = <any>$D.prototype, pad = function (s: any, l?: number) {
        new Date()
        if (!l) { l = 2; }
        return ("000" + s).slice(l * -1);
    };

    $P.getWeek = function () {
        let date0 = new Date(this.getFullYear(), 0, 1),
            diff = Math.round((this.valueOf() - date0.valueOf()) / 86400000);
        return Math.ceil((diff + ((date0.getDay() + 1) - 1)) / 7);
    };

    $P.setWeek = function (week: number, dayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6) {
        let dw = Types.isDefined(dayOfWeek) ? dayOfWeek : 1;
        return this.setTime(this.getDayOfWeek(dw).add(week - this.getWeek(), 'w').getTime());
    };
    $P.clone = function () { return new Date(this.getTime()) };
    $P.setZeroTime = function () {
        this.setHours(0);
        this.setMinutes(0);
        this.setSeconds(0);
        this.setMilliseconds(0); return this
    };
    $P.setLastTime = function () {
        this.setHours(23);
        this.setMinutes(59);
        this.setSeconds(59);
        this.setMilliseconds(999); return this
    };
    $P.setNowTime = function () {
        var n = new Date();
        this.setHours(n.getHours());
        this.setMinutes(n.getMinutes());
        this.setSeconds(n.getSeconds());
        this.setMilliseconds(n.getMilliseconds());
        return this;
    };
    $P.compareTo = function (date: Date) { return Dates.compare(this, date) };
    $P.equals = function (date: Date) { return Dates.equals(this, date || new Date()) };
    $P.between = function (start: Date, end: Date) { return this.getTime() >= start.getTime() && this.getTime() <= end.getTime() };
    $P.isAfter = function (date: Date) { return this.compareTo(date || new Date()) === 1 };
    $P.isBefore = function (date: Date) { return (this.compareTo(date || new Date()) === -1) };
    $P.isSameDay = function (date: Date) { return Dates.isSameDay(this, date) };
    $P.isSameTime = function (date: Date, equalsMS?: boolean) { return Dates.isSameTime(this, date, equalsMS) };
    $P.isToday = function () { return this.isSameDay(new Date()); };
    $P.add = function (v: number, type: 'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'M' | 'y'): Date {
        if (v == 0) return this;
        switch (type) {
            case 'ms': {
                this.setMilliseconds(this.getMilliseconds() + v);
                return this;
            }
            case 's': {
                return this.add(v * 1000, 'ms');
            }
            case 'm': {
                return this.add(v * 60000, 'ms');
            }
            case 'h': {
                return this.add(v * 3600000, 'ms');
            }
            case 'd': {
                this.setDate(this.getDate() + v); return this;
            }
            case 'w': {
                return this.add(v * 7, 'd');
            }
            case 'M': {
                var n = this.getDate();
                this.setDate(1);
                this.setMonth(this.getMonth() + v);
                this.setDate(Math.min(n, Dates.getDaysInMonth(this.getFullYear(), this.getMonth())));
                return this;
            }
            case 'y': {
                return this.add(v * 12, 'M');
            }
        }
        return this;
    };
    $P.setTimezoneOffset = function (offset: number) {
        var here = this.getTimezoneOffset(), there = Number(offset) * -6 / 10; return this.add(there - here, 'm');
    };
    $P.formatTimezoneOffset = function () {
        var n = this.getTimezoneOffset() * -10 / 6, r;
        if (n < 0) {
            r = (n - 10000).toString();
            return r.charAt(0) + r.substr(2);
        } else {
            r = (n + 10000).toString();
            return "+" + r.substr(1);
        }
    };

    let validate = function (n: number, min, max) {
        if (!Types.isDefined(n)) { return false }
        else if (n < min || n > max) { throw new RangeError(n + ' is not a valid value'); }
        return true;
    };

    $P.set = function (
        config: {
            millisecond?: number,
            second?: number,
            minute: number,
            hour?: number,
            day?: number,
            week?: number,
            month?: number,
            year?: number,
            timezoneOffset?: number
        }) {
        if (validate(config.millisecond, 0, 999)) { this.add(config.millisecond - this.getMilliseconds(), 'ms'); }
        if (validate(config.second, 0, 59)) { this.add(config.second - this.getSeconds(), 's'); }
        if (validate(config.minute, 0, 59)) { this.add(config.minute - this.getMinutes(), 'm'); }
        if (validate(config.hour, 0, 23)) { this.add(config.hour - this.getHours(), 'h'); }
        if (validate(config.day, 1, Dates.getDaysInMonth(this.getFullYear(), this.getMonth()))) { this.add(config.day - this.getDate(), 'd'); }
        if (validate(config.week, 0, 53)) { this.setWeek(config.week); }
        if (validate(config.month, 0, 11)) { this.add(config.month - this.getMonth(), 'M'); }
        if (validate(config.year, 0, 9999)) { this.add(config.year - this.getFullYear(), 'y'); }
        if (config.timezoneOffset) { this.setTimezoneOffset(config.timezoneOffset); }
        return this;
    };
    $P.getFirstDayOfMonth = function () { return this.clone().set({ day: 1 }) };
    $P.getLastDayOfMonth = function () { return this.clone().set({ day: Dates.getDaysInMonth(this.getFullYear(), this.getMonth()) }) };

    $P.getDayOfWeek = function (dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6) {
        let d2: number = Types.isDefined(dayOfWeek) ? dayOfWeek : 1, d1: number = this.getDay();
        if (d2 == 0) d2 = 7; if (d1 == 0) d1 = 7;
        return this.clone().add((d2 - d1) % 7, 'd')
    };

    $P.diff = function (date?: Date): number {
        return (<any>date || new Date()) - this;
    };

    $P.format = function (format?: string, locale?: string) {
        let x = this, fmt = format || 'YYYY-MM-DD HH:mm:ss',
            bundle = new Bundle(Dates.I18N_RESOURCE, locale);
        return fmt.replace(/YYYY|YY|MMMM|MMM|MM|M|DD|D|hh|h|HH|H|mm|m|ss|s|dddd|ddd|A/g,
            function (m) {
                switch (m) {
                    case "YYYY":
                        return pad(x.getFullYear(), 4);
                    case "YY":
                        return pad(x.getFullYear());
                    case "MMMM":
                        return bundle.get('MONTH_NAMES')[x.getMonth()];
                    case "MMM":
                        return bundle.get('MONTH_SHORT_NAMES')[x.getMonth()];
                    case "MM":
                        return pad((x.getMonth() + 1));
                    case "M":
                        return x.getMonth() + 1;
                    case "DD":
                        return pad(x.getDate());
                    case "D":
                        return x.getDate();
                    case "hh":
                        {
                            let h = x.getHours();
                            return pad(h < 13 ? (h === 0 ? 12 : h) : (h - 12));
                        }
                    case "h":
                        {
                            let h = x.getHours();
                            return h < 13 ? (h === 0 ? 12 : h) : (h - 12);
                        }
                    case "HH":
                        return pad(x.getHours());
                    case "H":
                        return x.getHours();
                    case "mm":
                        return pad(x.getMinutes());
                    case "m":
                        return x.getMinutes();
                    case "ss":
                        return pad(x.getSeconds());
                    case "s":
                        return x.getSeconds();
                    case "dddd":
                        return bundle.get('WEEK_DAY_NAMES')[x.getDay()];
                    case "ddd":
                        return bundle.get('WEEK_DAY_SHORT_NAMES')[x.getDay()];
                    case "A":
                        return bundle.get(x.getHours() < 12 ? 'AM' : 'PM');
                    default:
                        return m;
                }
            }
        );
    }
}())
Class.register(Date);