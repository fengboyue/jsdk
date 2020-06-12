/// <reference path="../../../dist/jsdk.d.ts" /> 
JS.imports('$jsfx').then(() => {

    new Checkbox({
        id: 'chk0'
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

    var chk1 = new Checkbox({
        id: 'chk1',
        data: data
    });
    new Button({
        id: 'btn1',
        text: 'See its value in console',
        colorMode: ColorMode.primary,
        listeners: {
            click: function () {
                JSLogger.info(chk1.value());
            }
        }
    })

    var chk2 = new Checkbox({
        id: 'chk2',
        data: data
    });
    new Button({
        id: 'btn2-1',
        text: 'Set value="0"',
        colorMode: ColorMode.primary,
        listeners: {
            click: function () {
                chk2.value(['0'])
            }
        }
    })
    new Button({
        id: 'btn2-2',
        text: 'Set value="1"',
        colorMode: ColorMode.success,
        listeners: {
            click: function () {
                chk2.value(['1'])
            }
        }
    })
    new Button({
        id: 'btn2-3',
        text: 'Set value="2"',
        colorMode: ColorMode.info,
        listeners: {
            click: function () {
                chk2.value(['2'])
            }
        }
    })

    var chk3 = new Checkbox({
        id: 'chk3',
        title: 'Selected value=0',
        data: data,
        iniValue: ['0']
    });
    new Button({
        id: 'btn3-1',
        text: 'Select value=1',
        colorMode: ColorMode.primary,
        listeners: {
            click: function () {
                chk3.select(['1'])
            }
        }
    })
    new Button({
        id: 'btn3-2',
        text: 'Select value=1&2',
        colorMode: ColorMode.success,
        listeners: {
            click: function () {
                chk3.select(['1', '2'])
            }
        }
    })
    new Button({
        id: 'btn3-3',
        text: 'Unselect value=0',
        colorMode: ColorMode.primary,
        listeners: {
            click: function () {
                chk3.unselect('0')
            }
        }
    })
    new Button({
        id: 'btn3-4',
        text: 'Unselect all',
        colorMode: ColorMode.success,
        listeners: {
            click: function () {
                chk3.unselect()
            }
        }
    })

    var chk4 = new Checkbox({
        id: 'chk4',
        data: data
    });
    new Button({
        id: 'btn4-1',
        text: 'Enable',
        colorMode: ColorMode.primary,
        listeners: {
            click: () => {
                chk4.enable()
            }
        }
    })
    new Button({
        id: 'btn4-2',
        text: 'Disable',
        colorMode: ColorMode.success,
        listeners: {
            click: () => {
                chk4.disable()
            }
        }
    })

    let chk5 = new Checkbox({
        id: 'chk5',
        data: data,
        validators: [{
            name: 'required',
            message: 'You must select one!'
        }, {
            name: 'custom',
            message: 'You must select <small>!',
            validate: (val:string[]) => {
                if(!val) return false;
                return val.findIndex((v)=>{return v=='2'})>-1
            }
        }],
        listeners: {
            validated: (e, rst: ValidateResult, val: string, field: string) => {
                if (rst.hasError()) JSLogger.info(rst.getErrors(field))
            }
        }
    });
    new Button({
        id: 'btn5-1',
        text: 'Validate',
        colorMode: ColorMode.primary,
        listeners: {
            click: () => {
                JSLogger.info(chk5.validate())
            }
        }
    })
})