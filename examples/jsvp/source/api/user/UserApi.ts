/// <reference path="../../../../../dist/jsdk.d.ts" /> 

module AppDemo {

    export namespace api {

        export namespace user {

            export class UserApi {
                static readUserById:Api<User> = {
                    method: 'GET',
                    url: '../data/one-user.json',
                    dataKlass: User
                }

                static read404:Api<Model> = {
                    url: 'none.json'
                }
            }
        }
    }

}
import UserApi = AppDemo.api.user.UserApi;
