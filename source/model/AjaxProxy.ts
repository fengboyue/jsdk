/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../lang/System.ts"/>
/// <reference path="ResultSet.ts"/>
module JS {

    export namespace model {

        /**
         * Remote data access proxy.
         */
        @klass('JS.model.AjaxProxy')
        export abstract class AjaxProxy {

            public abstract execute<T>(req: string | AjaxRequest, data?: JsonObject|QueryString): Promise<ResultSet<T>>;s

        }

    }

}

//预定义短类名
import AjaxProxy = JS.model.AjaxProxy;