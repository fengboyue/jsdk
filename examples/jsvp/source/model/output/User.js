var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AppDemo;
(function (AppDemo) {
    let model;
    (function (model) {
        let output;
        (function (output) {
            let User = class User extends Model {
            };
            User.DEFAULT_FIELDS = [
                { name: 'id', type: 'int', isId: true },
                { name: 'phone', persist: true },
                { name: 'email' }
            ];
            User = __decorate([
                klass('AppDemo.model.output.User')
            ], User);
            output.User = User;
        })(output = model.output || (model.output = {}));
    })(model = AppDemo.model || (AppDemo.model = {}));
})(AppDemo || (AppDemo = {}));
var User = AppDemo.model.output.User;
