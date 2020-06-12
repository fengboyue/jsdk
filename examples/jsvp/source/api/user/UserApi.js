var AppDemo;
(function (AppDemo) {
    let api;
    (function (api) {
        let user;
        (function (user) {
            class UserApi {
            }
            UserApi.readUserById = {
                method: 'GET',
                url: '../data/one-user.json',
                dataKlass: User
            };
            UserApi.read404 = {
                url: 'none.json'
            };
            user.UserApi = UserApi;
        })(user = api.user || (api.user = {}));
    })(api = AppDemo.api || (AppDemo.api = {}));
})(AppDemo || (AppDemo = {}));
var UserApi = AppDemo.api.user.UserApi;
