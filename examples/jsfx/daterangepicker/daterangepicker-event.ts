/// <reference path="../../../dist/jsdk.d.ts" /> 
JS.imports([
    '$jsfx.daterangepicker'
]).then(() => {
    let fn = function (e: Event, ...args) {
        Assert.true(Types.isKlass(this, DateRangePicker));
        Assert.true(Types.ofKlass(e, Event));
        JSLogger.info(this, e.type, args);
    }

    new DateRangePicker({
        id:'txt1'
    }).on<DateRangePickerEvents>('changed', fn)

    new DateRangePicker({
        id:'txt2'
    }).on<DateRangePickerEvents>('pickershown', fn)

    new DateRangePicker({
        id:'txt3'
    }).on<DateRangePickerEvents>('pickerhidden', fn)

    new DateRangePicker({
        id:'txt4'
    }).on<DateRangePickerEvents>('pickercanceled', fn)
    
})    