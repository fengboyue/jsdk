
/// <reference path="../../model/output/User.ts" /> 
/// <reference path="../../api/user/UserApi.ts" /> 
module AppDemo {

    export namespace service {
        export namespace user {

            @compo('AppDemo.service.user.UserService')
            export class UserService extends Service {

                public readUserById(id: number): Promise<User> {
                    return this.call<User>(UserApi.readUserById, { id: id });
                }

                public read404(): Promise<User> {
                    return this.call<User>(UserApi.read404);
                }
            }
        }
    }

}
import UserService = AppDemo.service.user.UserService;