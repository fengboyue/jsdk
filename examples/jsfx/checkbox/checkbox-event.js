JS.imports('$jsfx').then(() => {
    let fn = function (e, ...args) {
        Assert.true(Types.isKlass(this, Checkbox));
        Assert.true(Types.ofKlass(e, Event));
        JSLogger.info(this, e.type, args);
    };
    let chk1 = new Checkbox({
        id: 'chk1',
        listeners: {
            loading: fn,
            loadsuccess: fn,
            dataupdating: fn,
            dataupdated: fn
        }
    });
    new Button({
        id: 'btn1',
        text: 'Load Data',
        colorMode: ColorMode.primary,
        listeners: {
            click: function () {
                chk1.load('data.json');
            }
        }
    });
    var chk2 = new Checkbox({
        id: 'chk2',
        iniValue: ['0'],
        data: [{
                id: '0',
                text: 'large'
            }, {
                id: '1',
                text: 'medium'
            }, {
                id: '2',
                text: 'small'
            }],
        listeners: {
            changed: fn
        }
    });
    new Button({
        id: 'btn2-1',
        text: 'Set value="0"',
        colorMode: ColorMode.primary,
        listeners: {
            click: function () {
                chk2.value(['0']);
            }
        }
    });
    new Button({
        id: 'btn2-2',
        text: 'Set value="1"',
        colorMode: ColorMode.success,
        listeners: {
            click: function () {
                chk2.value(['1']);
            }
        }
    });
    new Button({
        id: 'btn2-3',
        text: 'Set value="2"',
        colorMode: ColorMode.info,
        listeners: {
            click: function () {
                chk2.value(['2']);
            }
        }
    });
});
