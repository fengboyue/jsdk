/// <reference path="../../page/user/UserPage.ts" /> 

module AppDemo {

    export namespace view {
        export namespace user {

            @component('AppDemo.view.user.UserView')
            export class UserView extends FormView {
                
                initialize() {
                    this._config = {
                        valueModel: User,
                        defaultConfig: <InputConfig<any>>{
                            titleStyle:'width:200px;',
                            autoValidate: false
                        },
                        widgetConfigs: {
                            'phone': <TelInputConfig>{
                                title: 'your mobile phone<code>(*)</code>',
                                placeholder: 'At least 10 digits number',
                                colorMode: ColorMode.primary,
                                validators: [
                                {
                                    name: 'required',
                                    message: 'Not empty'
                                },    
                                {
                                    name: 'length',
                                    short: 10,
                                    tooShortMessage: 'Too short length'
                                }],
                                bodyStyle:'max-width:220px;'
                            },
                            'email': <EmailInputConfig>{
                                title: 'your email<code>(*)</code>',
                                placeholder: 'xxx@yyy.zzz',
                                colorMode: ColorMode.primary,
                                validators: [
                                {
                                    name: 'custom',
                                    allowEmpty: false,
                                    validate: (val)=>{
                                        return Check.isEmpty(val) || Check.isEmail(val)//allow be empty
                                    },
                                    message: 'Not valid email address'
                                }],
                                bodyStyle:'max-width:300px;'
                            },
                            'btnClear': <ButtonConfig>{
                                text: 'Clear',
                                colorMode: ColorMode.primary,
                                listeners: {
                                    click: () => {
                                        this.clear()
                                    }
                                }
                            },
                            'btnChk': <ButtonConfig>{
                                text: 'Validate',
                                colorMode: ColorMode.info,
                                listeners: {
                                    click: () => {
                                        this.validate();
                                    }
                                }
                            },
                            'btnSuccess': <ButtonConfig>{
                                text: 'Load Another User',
                                colorMode: ColorMode.success,
                                listeners: {
                                    click: () => {
                                        Page.currentPage<UserPage>().readUserById(1);
                                    }
                                }
                            },
                            'btnFail': <ButtonConfig>{
                                text: 'Load 404 Failed',
                                colorMode: ColorMode.danger,
                                listeners: {
                                    click: () => {
                                        Page.currentPage<UserPage>().read404();
                                    }
                                }
                            }
                        }
                    };
                    this.on('rendered', () => {
                        Page.currentPage<UserPage>().readCurrentUser();
                    });
                    super.initialize();
                }
            }
        }
    }

}
import UserView = AppDemo.view.user.UserView;