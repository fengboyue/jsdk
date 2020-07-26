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
        let user;
        (function (user_1) {
            let UserPage = class UserPage extends Page {
                constructor() {
                    super(...arguments);
                    this.userView = null;
                    this.userService = null;
                }
                readCurrentUser() {
                    let uri = new URI(location.href);
                    this.userView.values({
                        phone: uri.query('phone'),
                        email: uri.query('email')
                    });
                }
                readUserById(id) {
                    this.userService.readUserById(id).then((user) => {
                        this.userView.values(user.getData());
                    });
                }
                read404() {
                    this.userService.read404().catch((res) => {
                        App.fireEvent('404', res.statusText);
                    });
                }
                enter() {
                    this.userView.render();
                }
                initialize() {
                    App.onEvent('access', (e, phone) => {
                        Konsole.print(`access phone: ${phone}`, e);
                    });
                    App.onEvent('404', (e, errorMsg) => {
                        App.logger().info(`Page<${Page.currentPage().className}> received AppEvent<404>: ${errorMsg}!`, `From page: ${e.fromPage}`);
                    });
                    App.logger().info('UserPage was initialized!');
                }
            };
            __decorate([
                inject(),
                __metadata("design:type", UserView)
            ], UserPage.prototype, "userView", void 0);
            __decorate([
                inject(),
                __metadata("design:type", UserService)
            ], UserPage.prototype, "userService", void 0);
            UserPage = __decorate([
                component('AppDemo.page.user.UserPage')
            ], UserPage);
            user_1.UserPage = UserPage;
        })(user = page.user || (page.user = {}));
    })(page = AppDemo.page || (AppDemo.page = {}));
})(AppDemo || (AppDemo = {}));
var UserPage = AppDemo.page.user.UserPage;
