var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AppDemo;
(function (AppDemo) {
    let view;
    (function (view) {
        let home;
        (function (home) {
            let LoginView = class LoginView extends FormView {
                initialize() {
                    this._config = {
                        valueModel: User,
                        defaultConfig: {
                            titleStyle: 'width:200px;',
                            autoValidate: false
                        },
                        widgetConfigs: {
                            'phone': {
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
                                    }
                                ],
                                bodyStyle: 'max-width:220px;'
                            },
                            'email': {
                                title: 'your email',
                                placeholder: 'xxx@yyy.zzz',
                                validators: [
                                    {
                                        name: 'custom',
                                        validate: (val) => {
                                            return Check.isEmpty(val) || Check.isEmail(val);
                                        },
                                        message: 'Invalid email address'
                                    }
                                ],
                                bodyStyle: 'max-width:300px;'
                            },
                            'btnLogin': {
                                text: 'Login',
                                colorMode: ColorMode.primary,
                                listeners: {
                                    click: () => {
                                        Page.currentPage().login();
                                    }
                                }
                            },
                            'btnEvent': {
                                text: 'Fire App Event',
                                colorMode: ColorMode.info,
                                listeners: {
                                    click: () => {
                                        App.fireEvent('access', this.getWidget('phone').value());
                                    }
                                }
                            }
                        }
                    };
                    super.initialize();
                }
            };
            LoginView = __decorate([
                compo('AppDemo.view.home.LoginView')
            ], LoginView);
            home.LoginView = LoginView;
        })(home = view.home || (view.home = {}));
    })(view = AppDemo.view || (AppDemo.view = {}));
})(AppDemo || (AppDemo = {}));
var LoginView = AppDemo.view.home.LoginView;
