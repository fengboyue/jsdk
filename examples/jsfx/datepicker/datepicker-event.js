JS.imports([
    '$jsfx.datepicker'
]).then(() => {
    let fn = function (e, ...args) {
        Assert.true(Types.isKlass(this, DatePicker));
        Assert.true(Types.ofKlass(e, Event));
        JSLogger.info(this, e.type, args);
    };
    new DatePicker({
        id: 'txt1',
        placeholder: 'Change event with Listeners',
        clearBtn: true,
        todayBtn: true,
        listeners: {
            changed: fn
        }
    });
    let dp = new DatePicker({
        id: 'txt2',
        placeholder: 'Change event with On method',
        clearBtn: true,
        todayBtn: true
    });
    dp.on('changed', fn);
    new DatePicker({
        id: 'txt3',
        placeholder: 'Picker shown/hidden event',
        clearBtn: true,
        todayBtn: true,
        listeners: {
            pickershown: fn,
            pickerhidden: fn
        }
    });
});
