/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
module JS {

    export namespace model {
        export interface Api<T> extends AjaxRequest{
            dataKlass?: Klass<T>;
        }
    }
}

import Api = JS.model.Api;