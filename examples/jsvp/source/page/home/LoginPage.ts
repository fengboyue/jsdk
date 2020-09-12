
/// <reference path="../../../../../dist/jsdk.d.ts" /> 
/// <reference path="../../service/user/UserService.ts" /> 
/// <reference path="../../view/home/LoginView.ts" /> 
module AppDemo {

    export namespace page {

        export namespace home {

            @compo('AppDemo.page.home.LoginPage')
            export class LoginPage extends Page {

                @inject()
                loginView: LoginView = null;

                login() {
                    if (this.loginView.validate()) {
                        let phone = this.loginView.getWidget<Input>('phone').value(),
                            email = this.loginView.getWidget<Input>('email').value();
                        Page.redirect('user.html', {
                            phone: phone,
                            email: encodeURIComponent(email||'')
                        })
                    }
                }

                enter() {
                    this.loginView.render();
                }

                initialize() {
                    Page.onEvent('leaving', () => {
                        alert('Leaving LoginPage Now!')
                    })
                    App.logger().info('LoginPage was initialized!');
                }
                destroy() {
                    App.logger().info('LoginPage was destroyed!');
                }
            }
        }
    }
}
import LoginPage = AppDemo.page.home.LoginPage;
