/// <reference path="../../page/user/UserPage.ts" /> 
/// <reference path="../../page/home/LoginPage.ts" /> 

module AppDemo {

    export namespace view {
        export namespace home {

            @component('AppDemo.view.home.LoginView')
            export class LoginView extends FormView {
                
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
                                placeholder: 'Atleast 10-digit number',
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
                                title: 'your email',
                                placeholder: 'xxx@yyy.zzz',
                                validators: [
                                {
                                    name: 'custom',
                                    validate: (val)=>{
                                        return Check.isEmpty(val) || Check.isEmail(val)//allow be empty
                                    },
                                    message: 'Invalid email address'
                                }],
                                bodyStyle:'max-width:300px;'
                            },
                            'btnLogin': <ButtonConfig>{
                                text: 'Login',
                                colorMode: ColorMode.primary,
                                listeners: {
                                    click: () => {
                                        Page.current<LoginPage>().login()
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

}
import LoginView = AppDemo.view.home.LoginView;