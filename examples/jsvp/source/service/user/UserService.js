var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AppDemo;
(function (AppDemo) {
    let service;
    (function (service) {
        let user;
        (function (user) {
            let UserService = class UserService extends Service {
                readUserById(id) {
                    return this.call(UserApi.readUserById, { id: id });
                }
                read404() {
                    return this.call(UserApi.read404);
                }
            };
            UserService = __decorate([
                component('AppDemo.service.user.UserService')
            ], UserService);
            user.UserService = UserService;
        })(user = service.user || (service.user = {}));
    })(service = AppDemo.service || (AppDemo.service = {}));
})(AppDemo || (AppDemo = {}));
var UserService = AppDemo.service.user.UserService;
