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
        let user;
        (function (user) {
            let UserView = class UserView extends FormView {
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
                                    }
                                ],
                                bodyStyle: 'max-width:220px;'
                            },
                            'email': {
                                title: 'your email<code>(*)</code>',
                                placeholder: 'xxx@yyy.zzz',
                                colorMode: ColorMode.primary,
                                validators: [
                                    {
                                        name: 'custom',
                                        allowEmpty: false,
                                        validate: (val) => {
                                            return Check.isEmpty(val) || Check.isEmail(val);
                                        },
                                        message: 'Not valid email address'
                                    }
                                ],
                                bodyStyle: 'max-width:300px;'
                            },
                            'btnClear': {
                                text: 'Clear',
                                colorMode: ColorMode.primary,
                                listeners: {
                                    click: () => {
                                        this.clear();
                                    }
                                }
                            },
                            'btnChk': {
                                text: 'Validate',
                                colorMode: ColorMode.info,
                                listeners: {
                                    click: () => {
                                        this.validate();
                                    }
                                }
                            },
                            'btnSuccess': {
                                text: 'Load Another User',
                                colorMode: ColorMode.success,
                                listeners: {
                                    click: () => {
                                        Page.currentPage().readUserById(1);
                                    }
                                }
                            },
                            'btnFail': {
                                text: 'Load 404 Failed',
                                colorMode: ColorMode.danger,
                                listeners: {
                                    click: () => {
                                        Page.currentPage().read404();
                                    }
                                }
                            }
                        }
                    };
                    this.on('rendered', () => {
                        Page.currentPage().readCurrentUser();
                    });
                    super.initialize();
                }
            };
            UserView = __decorate([
                component('AppDemo.view.user.UserView')
            ], UserView);
            user.UserView = UserView;
        })(user = view.user || (view.user = {}));
    })(view = AppDemo.view || (AppDemo.view = {}));
})(AppDemo || (AppDemo = {}));
var UserView = AppDemo.view.user.UserView;
