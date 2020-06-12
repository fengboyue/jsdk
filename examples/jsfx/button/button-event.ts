/// <reference path="../../../dist/jsdk.d.ts" /> 
JS.imports('$jsfx').then(() => {
    let fn = function (e: Event, ...args) {
        Assert.true(Types.isKlass(this, Button));
        Assert.true(Types.ofKlass(e, Event));
        JSLogger.info(this, e.type, args);
    }
    new Button({
        id: 'btn1',
        text: 'Unlimited times click',
        colorMode: ColorMode.primary,
        listeners: {
            'click': fn
        }
    });

    new Button({
        id: 'btn2',
        text: 'One times click',
        colorMode: ColorMode.accent,
        listeners: {
            'click': function (e) {
                this.off('click');
                return fn.apply(this, [e])
            }
        }
    });

    new Button({
        id: 'btn3',
        text: 'No response',
        colorMode: ColorMode.primary,
        disabled: true,
        listeners: {
            'click': fn
        }
    });

    new Button({
        id: 'btn4',
        text: 'Dropdown Button',
        colorMode: ColorMode.info,
        dropMenu: {
            dir: 'right',
            items: [{
                text: 'Goto JSDK',
                href: 'https://github.com/fengboyue/jsdk',
                onClick: function (e, item: DropDownItem) {
                    JSLogger.info(item.text);
                }
            }, {
                text: 'Stop to JSDK',
                href: 'https://github.com/fengboyue/jsdk',
                onClick: function (e, item: DropDownItem) {
                    JSLogger.info(item.text);
                    e.preventDefault();
                }
            }]
        }
    })
})


