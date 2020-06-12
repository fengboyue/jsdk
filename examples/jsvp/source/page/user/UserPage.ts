
/// <reference path="../../../../../dist/jsdk.d.ts" /> 
/// <reference path="../../service/user/UserService.ts" /> 
/// <reference path="../../view/user/UserView.ts" /> 
module AppDemo {

    export namespace page {

        export namespace user {

            @component('AppDemo.page.user.UserPage')
            export class UserPage extends Page {

                @inject()
                userView: UserView = null;

                @inject()
                userService: UserService = null;

                public readCurrentUser() {
                    let uri = Page.uri();
                    this.userView.values({
                        phone: uri.query('phone'),
                        email: uri.query('email')
                    })
                }
                public readUserById(id: number) {
                    this.userService.readUserById(id).then((user: User) => {
                        this.userView.values(user.getData());
                    });
                }
                public read404() {
                    this.userService.read404().catch((res: AjaxResponse)=>{
                        App.fireEvent('404', res.statusText)
                    })
                }

                render() {
                    this.userView.render();
                }
                
                initialize() {
                    App.logger().info('UserPage was initialized!');
                };
            }
        }
    }
}
import UserPage = AppDemo.page.user.UserPage;