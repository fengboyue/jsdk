JS.imports([
    '$jsfx.daterangepicker'
]).then(() => {
    let fn = function (e, ...args) {
        Assert.true(Types.isKlass(this, DateRangePicker));
        Assert.true(Types.ofKlass(e, Event));
        JSLogger.info(this, e.type, args);
    };
    new DateRangePicker({
        id: 'txt1'
    }).on('changed', fn);
    new DateRangePicker({
        id: 'txt2'
    }).on('pickershown', fn);
    new DateRangePicker({
        id: 'txt3'
    }).on('pickerhidden', fn);
    new DateRangePicker({
        id: 'txt4'
    }).on('pickercanceled', fn);
});
