/// <reference path="../../../dist/jsdk.d.ts" /> 
JS.imports('$jsfx').then(() => {

    let fn = function (e: Event, ...args) {
        Assert.true(Types.isKlass(this, Radio));
        Assert.true(Types.ofKlass(e, Event));
        JSLogger.info(this, e.type, args);
    }
    let rad1 = new Radio({
        id: 'rad1',
        iniValue: '0',
        listeners:{
            loading: fn,
            loadsuccess: fn,
            dataupdating: fn,
            dataupdated: fn
        }
    })
    new Button({
        id: 'btn1',
        text: 'Load Data',
        colorMode: ColorMode.primary,
        listeners: {
            click: function () {
                rad1.load('data.json')
            }
        }
    })

    var rad2 = new Radio({
        id: 'rad2',
        iniValue: '0',
        data: [{
            id: '0',
            text: 'large'
        },{
            id: '1',
            text: 'medium'
        },{
            id: '2',
            text: 'small'
        }],
        listeners:{
            changed: fn
        }
    });
    new Button({
        id: 'btn2-1',
        text: 'Set value="0"',
        colorMode: ColorMode.primary,
        listeners: {
            click: function () {
                rad2.value('0')
            }
        }
    })
    new Button({
        id: 'btn2-2',
        text: 'Set value="1"',
        colorMode: ColorMode.success,
        listeners: {
            click: function () {
                rad2.value('1')
            }
        }
    })
    new Button({
        id: 'btn2-3',
        text: 'Set value="2"',
        colorMode: ColorMode.info,
        listeners: {
            click: function () {
                rad2.value('2')
            }
        }
    })
})