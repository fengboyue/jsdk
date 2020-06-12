var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AppDemo;
(function (AppDemo) {
    let page;
    (function (page) {
        let home;
        (function (home) {
            let LoginPage = class LoginPage extends Page {
                constructor() {
                    super(...arguments);
                    this.loginView = null;
                }
                login() {
                    if (this.loginView.validate()) {
                        let phone = this.loginView.getWidget('phone').value(), email = this.loginView.getWidget('email').value();
                        Page.open(new URI('user.html').query('phone', phone).query('email', email, true).toString());
                    }
                }
                render() {
                    this.loginView.render();
                }
                initialize() {
                    App.logger().info('LoginPage was initialized!');
                }
                ;
            };
            __decorate([
                inject(),
                __metadata("design:type", LoginView)
            ], LoginPage.prototype, "loginView", void 0);
            LoginPage = __decorate([
                component('AppDemo.page.home.LoginPage')
            ], LoginPage);
            home.LoginPage = LoginPage;
        })(home = page.home || (page.home = {}));
    })(page = AppDemo.page || (AppDemo.page = {}));
})(AppDemo || (AppDemo = {}));
var LoginPage = AppDemo.page.home.LoginPage;
