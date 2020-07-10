/// <reference path='../../../dist/jsdk.d.ts' /> 

module JS {

    export namespace examples {

        @component('JS.examples.MyFormView')
        export class MyFormView extends FormView {

            initialize() {
                this._config = {
                    defaultConfig: <InputConfig<any>>{
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
                        'radio': <RadioConfig>{
                            title: 'Radio:',
                            data: [{ id: '1', text: '1' }, { id: '2', text: '2' }, { id: '3', text: '3' }],
                            iniValue: '1'
                        },
                        'checkbox': <CheckboxConfig>{
                            title: 'Checkbox:',
                            data: [{ id: '1', text: '1' }, { id: '2', text: '2' }, { id: '3', text: '3' }],
                            iniValue: ['1']
                        },
                        'switch': <SwitchConfig>{
                            title: 'Switch:',
                            iniValue: 'on',
                            validators: [{
                                name: 'custom',
                                message: 'Must be ON',
                                validate: (v) => { return v == 'on' }
                            }]
                        },
                        'select': <SelectConfig>{
                            title: 'Single Select:',
                            multiple: false,
                            data: [
                                { id: '1', text: '111' }, 
                                { id: '2', text: '222' }, 
                                { id: '3', text: '333' }],
                            iniValue: '1'
                        },
                        'multipleSelect': <SelectConfig>{
                            title: 'Multiple Select:',
                            multiple: true,
                            data: [
                                { id: '1', text: '111' }, 
                                { id: '2', text: '222' }, 
                                { id: '3', text: '333' }],
                            iniValue: ['1']
                        },
                        'crudSelect': <SelectConfig>{
                            title: 'CRUD Multiple Select:',
                            crud: true,
                            multiple: true,
                            data: [
                                { id: '1', text: '111' }, 
                                { id: '2', text: '222' }, 
                                { id: '3', text: '333' }],
                            iniValue: ['1']
                        },
                        'rangeslider': <RangeSliderConfig>{
                            title: 'RangeSlider:',
                            iniValue: 10,
                            validators: [{
                                name: 'custom',
                                message: 'Must be 50',
                                validate: (v) => { return v == 50 }
                            }]
                        },
                        'uploader': <UploaderConfig>{
                            title: 'Uploader:',
                            iniValue: [{
                                id: '01',
                                name: 'ini.png',
                                uri: 'https://www.w3.org/2008/site/images/logo-w3c-screen-lg.png'
                            }]
                        },
                        'textinput': <TextInputConfig>{
                            title: 'TextInput:',
                            iniValue: '00000'
                        },
                        'password': <PasswordConfig>{
                            title: 'Password:',
                            visible: true,
                            iniValue: '00000'
                        },
                        'telinput': <TelInputConfig>{
                            title: 'TelInput:',
                            iniValue: '00000'
                        },
                        'emailinput': <EmailInputConfig>{
                            title: 'EmailInput',
                            iniValue: '00000'
                        },
                        'numberinput': <NumberInputConfig>{
                            title: 'NumberInput:',
                            iniValue: 0.00
                        },
                        'datepicker': <DatePickerConfig>{
                            title: 'DatePicker:',
                            iniValue: Dates.getFirstDayOfMonth(new Date())
                        },
                        'daterangepicker': <DateRangePickerConfig>{
                            title: 'DateRangePicker:',
                            iniValue: [Dates.getFirstDayOfMonth(new Date()), Dates.getLastDayOfMonth(new Date())]
                        },
                        'textarea': <TextAreaConfig>{
                            title: 'TextArea:',
                            iniValue: '00000'
                        },
                        'texteditor': <TextEditorConfig>{
                            title: 'TextEditor:',
                            iniValue: '00000'
                        },
                        'btnSet': <ButtonConfig>{
                            text: 'Set Value',
                            colorMode: ColorMode.accent,
                            listeners: {
                                click: () => {
                                    this.getWidget<Radio>('radio').value('3');
                                    this.getWidget<Checkbox>('checkbox').value(['3']);
                                    this.getWidget<Switch>('switch').value('on');
                                    this.getWidget<Select>('select').value(['3']);
                                    this.getWidget<RangeSlider>('rangeslider').value(30);
                                    this.getWidget<Uploader>('uploader').value({
                                        id: 'xx',
                                        name: 'w3c-logo.png',
                                        uri: 'https://www.w3.org/2008/site/images/logo-w3c-screen-lg.png'
                                    });
                                    this.getWidget<TextInput>('textinput').value('1234567890');
                                    this.getWidget<Password>('password').value('1234567890');
                                    this.getWidget<TelInput>('telinput').value('1234567890');
                                    this.getWidget<EmailInput>('emailinput').value('1234567890@1.1');
                                    this.getWidget<NumberInput>('numberinput').value(10);
                                    this.getWidget<DatePicker>('datepicker').value(new Date());
                                    this.getWidget<DateRangePicker>('daterangepicker').value('2019/1/1 - 2019/2/2');
                                    this.getWidget<TextArea>('textarea').value('1234567890');
                                    this.getWidget<TextEditor>('texteditor').value('1234567890');
                                }
                            }
                        },
                        'btnValidate': <ButtonConfig>{
                            text: 'Validate',
                            colorMode: ColorMode.info,
                            listeners: {
                                click: () => {
                                    this.validate()
                                }
                            }
                        },
                        'btnClear': <ButtonConfig>{
                            text: 'Clear',
                            colorMode: ColorMode.success,
                            listeners: {
                                click: () => {
                                    this.clear()
                                }
                            }
                        },
                        'btnReset': <ButtonConfig>{
                            text: 'Reset',
                            colorMode: ColorMode.danger,
                            listeners: {
                                click: () => {
                                    this.reset();
                                }
                            }
                        },
                        'btnVal': <ButtonConfig>{
                            text: 'Values',
                            colorMode: ColorMode.warning,
                            listeners: {
                                click: () => {
                                    JSLogger.info(this.values())
                                }
                            }
                        }
                    }
                };
                super.initialize();
            }
        }
    }
}

import MyFormView = JS.examples.MyFormView;