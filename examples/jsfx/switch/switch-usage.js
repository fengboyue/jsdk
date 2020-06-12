JS.imports('$jsfx').then(() => {
    new Switch({
        id: 'val1',
        title: 'Must choose ON',
        iniValue: 'off',
        autoValidate: true,
        validateMode: {
            mode: 'tip',
            place: 'left'
        },
        validators: [{
                name: 'custom',
                message: 'Please choose ON !',
                validate: (val) => {
                    return val == 'on';
                }
            }]
    });
    let sw1 = new Switch({
        id: 'sw1'
    });
    $('#btn1').click(() => {
        sw1.value('on');
    });
    $('#btn2').click(() => {
        sw1.value('off');
    });
    $('#btn3').click(() => {
        Konsole.print(sw1.value());
    });
    let sw2 = new Switch({
        id: 'sw2'
    });
    $('#btn4').click(() => {
        sw2.toggle();
    });
    let fn = function (e, ...args) {
        Assert.true(Types.isKlass(this, Switch));
        Assert.true(Types.ofKlass(e, Event));
        JSLogger.info(this, e.type, args);
    };
    new Switch({
        id: 'sw3',
        listeners: {
            changed: fn,
            on: fn,
            off: fn
        }
    });
});
