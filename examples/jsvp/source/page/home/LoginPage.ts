
/// <reference path="../../../../../dist/jsdk.d.ts" /> 
/// <reference path="../../service/user/UserService.ts" /> 
/// <reference path="../../view/home/LoginView.ts" /> 
module AppDemo {

    export namespace page {

        export namespace home {

            @component('AppDemo.page.home.LoginPage')
            export class LoginPage extends Page {

                @inject()
                loginView: LoginView = null;


                public login() {
                    if(this.loginView.validate()) {
                        let phone = this.loginView.getWidget<Input>('phone').value(),
                        email = this.loginView.getWidget<Input>('email').value();
                        Page.open(new URI('user.html').query('phone',phone).query('email',email,true).toString())
                    }
                }

                render() {
                    this.loginView.render();
                }
                
                initialize() {
                    App.logger().info('LoginPage was initialized!');
                };
            }
        }
    }
}
import LoginPage = AppDemo.page.home.LoginPage;
