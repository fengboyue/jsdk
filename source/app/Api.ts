/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
module JS {

    export namespace app {

        export interface Api<T> extends HttpRequest{
            dataKlass?: Klass<T>;
        }
    }
}

import Api = JS.app.Api;