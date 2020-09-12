/// <reference path="../../page/user/UserPage.ts" /> 
/// <reference path="../../page/home/LoginPage.ts" /> 

module AppDemo {

    export namespace view {
        export namespace home {

            @compo('AppDemo.view.home.LoginView')
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
                                        Page.currentPage<LoginPage>().login()
                                    }
                                }
                            },
                            'btnEvent': <ButtonConfig>{
                                text: 'Fire App Event',
                                colorMode: ColorMode.info,
                                listeners: {
                                    click: () => {
                                        App.fireEvent('access', this.getWidget<TelInput>('phone').value())
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