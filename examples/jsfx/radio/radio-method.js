JS.imports('$jsfx').then(() => {
    new Radio({
        id: 'rad0'
    }).load('data.json');
    let data = [{
            id: '0',
            text: 'large'
        }, {
            id: '1',
            text: 'medium'
        }, {
            id: '2',
            text: 'small'
        }];
    var rad1 = new Radio({
        id: 'rad1',
        data: data
    });
    new Button({
        id: 'btn1',
        text: 'See its value in console',
        colorMode: ColorMode.primary,
        listeners: {
            click: function () {
                JSLogger.info(rad1.value());
            }
        }
    });
    var rad2 = new Radio({
        id: 'rad2',
        data: data
    });
    new Button({
        id: 'btn2-1',
        text: 'Set value="0"',
        colorMode: ColorMode.primary,
        listeners: {
            click: function () {
                rad2.value('0');
            }
        }
    });
    new Button({
        id: 'btn2-2',
        text: 'Set value="1"',
        colorMode: ColorMode.success,
        listeners: {
            click: function () {
                rad2.value('1');
            }
        }
    });
    new Button({
        id: 'btn2-3',
        text: 'Set value="2"',
        colorMode: ColorMode.info,
        listeners: {
            click: function () {
                rad2.value('2');
            }
        }
    });
    var rad3 = new Radio({
        id: 'rad3',
        data: data
    });
    new Button({
        id: 'btn3-1',
        text: 'Select value="1"',
        colorMode: ColorMode.primary,
        listeners: {
            click: function () {
                rad3.select('1');
            }
        }
    });
    new Button({
        id: 'btn3-2',
        text: 'Unselect',
        colorMode: ColorMode.success,
        listeners: {
            click: function () {
                rad3.unselect();
            }
        }
    });
    var rad4 = new Radio({
        id: 'rad4',
        data: data
    });
    new Button({
        id: 'btn4-1',
        text: 'Enable',
        colorMode: ColorMode.primary,
        listeners: {
            click: () => {
                rad4.enable();
            }
        }
    });
    new Button({
        id: 'btn4-2',
        text: 'Disable',
        colorMode: ColorMode.success,
        listeners: {
            click: () => {
                rad4.disable();
            }
        }
    });
    let rad5 = new Radio({
        id: 'rad5',
        data: data,
        validators: [{
                name: 'required',
                message: 'You must select one!'
            }, {
                name: 'custom',
                message: 'You must select <small>!',
                validate: (val) => {
                    return val == '2';
                }
            }],
        listeners: {
            validated: (e, rst, val, field) => {
                if (rst.hasError())
                    JSLogger.info(rst.getErrors(field));
            }
        }
    });
    new Button({
        id: 'btn5-1',
        text: 'Validate',
        colorMode: ColorMode.primary,
        listeners: {
            click: () => {
                JSLogger.info(rad5.validate());
            }
        }
    });
});
