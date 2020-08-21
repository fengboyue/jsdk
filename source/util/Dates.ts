/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.1.0
 * @author Frank.Feng
 * @update Adjust some methods of Dates and Date.prototype
 * @date 2020/7/7
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="I18N.ts"/>

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
     * Compares this instance to another Date object and returns true if they are equal.  
     * @param date     Date object to compare. If no date to compare, new Date() [now] is used.
     * @return {Boolean} true if dates are equal. false if they are not equal.
     */
    equals(date: Date, type?: 'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'M' | 'y'): boolean;
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
    format(format?: string, locale?: Locale): string;
}
module JS {

    export namespace util {

        /**
         * Date helper class<br>
         * 日期工具类
         */
        export class Dates {

            public static I18N_RESOURCE: I18NResource = {
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
             * Determines if the current date instance is within a LeapYear.
             * @param y The year.
             * @return {Boolean} True if date is within a LeapYear, otherwise false.
             */
            public static isLeapYear(y: number) {
                return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
            }

            /**
             * Gets the number of days in the month and the year. Automatically corrects for LeapYear.
             * @param m   The month (0-11)
             * @param y   The year or this year
             */
            public static getDaysOfMonth(m: number, y?: number) {
                y = y || new Date().getFullYear();
                return [31, (this.isLeapYear(y) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m]
            }

            /**
             * Gets the 1st day of the month based on the orient day.
             * @param d  The orient day
             */
            public static getFirstDayOfMonth(d: Date) { return d.clone().set({ day: 1 }) }

            /**
             * Gets the last day of the month based on the orient day.
             * @param d  The orient day
             */
            public static getLastDayOfMonth(d: Date) {
                return d.clone().set({ day: Dates.getDaysOfMonth(d.getMonth(), d.getFullYear()) })
            }

            /**
             * Gets the dayOfWeek based on the orient day.
             * @param d  The orient day
             * @param dayOfWeek  0 is Sunday; Defaults is 1.
             */
            public static getDayOfWeek(d: Date, dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6) {
                let d2: number = dayOfWeek != void 0 ? dayOfWeek : 1, d1: number = d.getDay();
                if (d2 == 0) d2 = 7; if (d1 == 0) d1 = 7;
                return d.clone().add((d2 - d1) % 7, 'd')
            }

        }
    }
}
import Dates = JS.util.Dates;

(function () {
    var D = Date, $P = D.prototype, pad = function (s: any, l?: number) {
        new D()
        if (!l) { l = 2; }
        return ("000" + s).slice(l * -1);
    };

    $P.getWeek = function () {
        let date0 = new D(this.getFullYear(), 0, 1),
            diff = Math.round((this.valueOf() - date0.valueOf()) / 86400000);
        return Math.ceil((diff + ((date0.getDay() + 1) - 1)) / 7)
    }

    $P.setWeek = function (week: number, dayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6) {
        let dw = Types.isDefined(dayOfWeek) ? dayOfWeek : 1;
        return this.setTime(Dates.getDayOfWeek(this, dw).add(week - this.getWeek(), 'w').getTime());
    }
    $P.clone = function () { return new D(this.getTime()) }
    $P.setZeroTime = function () {
        let T = this;
        T.setHours(0);
        T.setMinutes(0);
        T.setSeconds(0);
        T.setMilliseconds(0);
        return T
    }
    $P.setLastTime = function () {
        let T = this;
        T.setHours(23);
        T.setMinutes(59);
        T.setSeconds(59);
        T.setMilliseconds(999);
        return T
    }
    $P.setNowTime = function () {
        let T = this, n = new D();
        T.setHours(n.getHours());
        T.setMinutes(n.getMinutes());
        T.setSeconds(n.getSeconds());
        T.setMilliseconds(n.getMilliseconds());
        return T
    }
    $P.equals = function (d: Date, p = 'ms') {
        let T = <Date>this;

        if (p == 'ms') return T.diff(d) == 0;
        if (p == 's') return T.getSeconds() == d.getSeconds();
        if (p == 'm') return T.getMinutes() == d.getMinutes();
        if (p == 'h') return T.getHours() == d.getHours();

        if (p == 'y') return T.getFullYear() == d.getFullYear();
        if (p == 'M') return T.getMonth() == d.getMonth();
        if (p == 'd') return T.getFullYear() == d.getFullYear() && T.getMonth() == d.getMonth() && T.getDate() == d.getDate();
        if (p == 'w') return T.getWeek() == d.getWeek();

        return false
    }
    $P.between = function (start: Date, end: Date) { return this.diff(start) >= 0 && this.diff(end) <= 0 }
    $P.isAfter = function (this: Date, d: Date) { return this.diff(d) > 0 }
    $P.isBefore = function (this: Date, d: Date) { return this.diff(d) < 0 }
    $P.isToday = function (this: Date) { return this.equals(new D(), 'd') }
    $P.add = function (v: number, type: 'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'M' | 'y'): Date {
        let T = this;
        if (v == 0) return T;
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
                T.setDate(T.getDate() + v); return T;
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
    }
    $P.setTimezoneOffset = function (offset: number) {
        var here = this.getTimezoneOffset(), there = Number(offset) * -6 / 10; return this.add(there - here, 'm');
    }
    $P.formatTimezoneOffset = function () {
        var n = this.getTimezoneOffset() * -10 / 6, r;
        if (n < 0) {
            r = (n - 10000).toString();
            return r.charAt(0) + r.substr(2);
        } else {
            r = (n + 10000).toString();
            return "+" + r.substr(1);
        }
    }

    let vt = function (n: number, min, max) {
        if (!Types.isDefined(n)) { return false }
        else if (n < min || n > max) { throw new RangeError(n + ' is not a valid value'); }
        return true;
    }

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
        let T = this;
        if (vt(config.millisecond, 0, 999)) { T.add(config.millisecond - T.getMilliseconds(), 'ms') }
        if (vt(config.second, 0, 59)) { T.add(config.second - T.getSeconds(), 's') }
        if (vt(config.minute, 0, 59)) { T.add(config.minute - T.getMinutes(), 'm') }
        if (vt(config.hour, 0, 23)) { T.add(config.hour - T.getHours(), 'h') }
        if (vt(config.day, 1, Dates.getDaysOfMonth(T.getMonth(), T.getFullYear()))) { T.add(config.day - T.getDate(), 'd') }
        if (vt(config.week, 0, 53)) { T.setWeek(config.week) }
        if (vt(config.month, 0, 11)) { T.add(config.month - T.getMonth(), 'M') }
        if (vt(config.year, 0, 9999)) { T.add(config.year - T.getFullYear(), 'y') }
        if (config.timezoneOffset) { T.setTimezoneOffset(config.timezoneOffset) }
        return T;
    }

    $P.diff = function (date?: Date): number {
        return this - (<any>date || new D());
    }

    $P.format = function (format?: string, locale?: Locale) {
        let T = this, fmt = format || 'YYYY-MM-DD HH:mm:ss',
            i18n = new I18N(locale).set(Dates.I18N_RESOURCE);
        return fmt.replace(/YYYY|YY|MMMM|MMM|MM|M|DD|D|hh|h|HH|H|mm|m|ss|s|dddd|ddd|A/g,
            function (m) {
                switch (m) {
                    case "YYYY":
                        return pad(T.getFullYear(), 4);
                    case "YY":
                        return pad(T.getFullYear());
                    case "MMMM":
                        return i18n.get('MONTH_NAMES')[T.getMonth()];
                    case "MMM":
                        return i18n.get('MONTH_SHORT_NAMES')[T.getMonth()];
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
                        return i18n.get('WEEK_DAY_NAMES')[T.getDay()];
                    case "ddd":
                        return i18n.get('WEEK_DAY_SHORT_NAMES')[T.getDay()];
                    case "A":
                        return i18n.get(T.getHours() < 12 ? 'AM' : 'PM');
                    default:
                        return m;
                }
            }
        )
    }
}())