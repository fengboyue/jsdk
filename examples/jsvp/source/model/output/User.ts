
/// <reference path="../../../../../dist/jsdk.d.ts" /> 

module AppDemo {

    export namespace model {

        export namespace output {

            @klass('AppDemo.model.output.User')
            export class User extends Model {

                public static DEFAULT_FIELDS = [
                    { name: 'id', type: 'int', isId: true },
                    { name: 'phone', persist: true },
                    { name: 'email' }
                ]

            }
        }
    }

}
import User = AppDemo.model.output.User;