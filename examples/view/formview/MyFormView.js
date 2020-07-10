var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var JS;
(function (JS) {
    let examples;
    (function (examples) {
        let MyFormView = class MyFormView extends FormView {
            initialize() {
                this._config = {
                    defaultConfig: {
                        colorMode: ColorMode.accent,
                        sizeMode: SizeMode.sm,
                        placeholder: 'please input...',
                        titleWidth: 200,
                        validateMode: {
                            mode: 'tip',
                            place: 'left'
                        },
                        validators: [{
                                name: 'required',
                                message: 'Required'
                            }]
                    },
                    widgetConfigs: {
                        'radio': {
                            title: 'Radio:',
                            data: [{ id: '1', text: '1' }, { id: '2', text: '2' }, { id: '3', text: '3' }],
                            iniValue: '1'
                        },
                        'checkbox': {
                            title: 'Checkbox:',
                            data: [{ id: '1', text: '1' }, { id: '2', text: '2' }, { id: '3', text: '3' }],
                            iniValue: ['1']
                        },
                        'switch': {
                            title: 'Switch:',
                            iniValue: 'on',
                            validators: [{
                                    name: 'custom',
                                    message: 'Must be ON',
                                    validate: (v) => { return v == 'on'; }
                                }]
                        },
                        'select': {
                            title: 'Single Select:',
                            multiple: false,
                            data: [
                                { id: '1', text: '111' },
                                { id: '2', text: '222' },
                                { id: '3', text: '333' }
                            ],
                            iniValue: '1'
                        },
                        'multipleSelect': {
                            title: 'Multiple Select:',
                            multiple: true,
                            data: [
                                { id: '1', text: '111' },
                                { id: '2', text: '222' },
                                { id: '3', text: '333' }
                            ],
                            iniValue: ['1']
                        },
                        'crudSelect': {
                            title: 'CRUD Multiple Select:',
                            crud: true,
                            multiple: true,
                            data: [
                                { id: '1', text: '111' },
                                { id: '2', text: '222' },
                                { id: '3', text: '333' }
                            ],
                            iniValue: ['1']
                        },
                        'rangeslider': {
                            title: 'RangeSlider:',
                            iniValue: 10,
                            validators: [{
                                    name: 'custom',
                                    message: 'Must be 50',
                                    validate: (v) => { return v == 50; }
                                }]
                        },
                        'uploader': {
                            title: 'Uploader:',
                            iniValue: [{
                                    id: '01',
                                    name: 'ini.png',
                                    uri: 'https://www.w3.org/2008/site/images/logo-w3c-screen-lg.png'
                                }]
                        },
                        'textinput': {
                            title: 'TextInput:',
                            iniValue: '00000'
                        },
                        'password': {
                            title: 'Password:',
                            visible: true,
                            iniValue: '00000'
                        },
                        'telinput': {
                            title: 'TelInput:',
                            iniValue: '00000'
                        },
                        'emailinput': {
                            title: 'EmailInput',
                            iniValue: '00000'
                        },
                        'numberinput': {
                            title: 'NumberInput:',
                            iniValue: 0.00
                        },
                        'datepicker': {
                            title: 'DatePicker:',
                            iniValue: Dates.getFirstDayOfMonth(new Date())
                        },
                        'daterangepicker': {
                            title: 'DateRangePicker:',
                            iniValue: [Dates.getFirstDayOfMonth(new Date()), Dates.getLastDayOfMonth(new Date())]
                        },
                        'textarea': {
                            title: 'TextArea:',
                            iniValue: '00000'
                        },
                        'texteditor': {
                            title: 'TextEditor:',
                            iniValue: '00000'
                        },
                        'btnSet': {
                            text: 'Set Value',
                            colorMode: ColorMode.accent,
                            listeners: {
                                click: () => {
                                    this.getWidget('radio').value('3');
                                    this.getWidget('checkbox').value(['3']);
                                    this.getWidget('switch').value('on');
                                    this.getWidget('select').value(['3']);
                                    this.getWidget('rangeslider').value(30);
                                    this.getWidget('uploader').value({
                                        id: 'xx',
                                        name: 'w3c-logo.png',
                                        uri: 'https://www.w3.org/2008/site/images/logo-w3c-screen-lg.png'
                                    });
                                    this.getWidget('textinput').value('1234567890');
                                    this.getWidget('password').value('1234567890');
                                    this.getWidget('telinput').value('1234567890');
                                    this.getWidget('emailinput').value('1234567890@1.1');
                                    this.getWidget('numberinput').value(10);
                                    this.getWidget('datepicker').value(new Date());
                                    this.getWidget('daterangepicker').value('2019/1/1 - 2019/2/2');
                                    this.getWidget('textarea').value('1234567890');
                                    this.getWidget('texteditor').value('1234567890');
                                }
                            }
                        },
                        'btnValidate': {
                            text: 'Validate',
                            colorMode: ColorMode.info,
                            listeners: {
                                click: () => {
                                    this.validate();
                                }
                            }
                        },
                        'btnClear': {
                            text: 'Clear',
                            colorMode: ColorMode.success,
                            listeners: {
                                click: () => {
                                    this.clear();
                                }
                            }
                        },
                        'btnReset': {
                            text: 'Reset',
                            colorMode: ColorMode.danger,
                            listeners: {
                                click: () => {
                                    this.reset();
                                }
                            }
                        },
                        'btnVal': {
                            text: 'Values',
                            colorMode: ColorMode.warning,
                            listeners: {
                                click: () => {
                                    JSLogger.info(this.values());
                                }
                            }
                        }
                    }
                };
                super.initialize();
            }
        };
        MyFormView = __decorate([
            component('JS.examples.MyFormView')
        ], MyFormView);
        examples.MyFormView = MyFormView;
    })(examples = JS.examples || (JS.examples = {}));
})(JS || (JS = {}));
var MyFormView = JS.examples.MyFormView;
