/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../lang/System.ts"/>
/// <reference path="../model/JsonProxy.ts"/>

module JS {

    export namespace model {

        @klass('JS.app.Service')
        export abstract class Service implements IComponent {

            public initialize() { };

            public destroy() {
                this._proxy = null;
            }

            public static DEFAULT_PROXY: Klass<AjaxProxy> = JsonProxy;

            protected _proxy: AjaxProxy;

            /**
             * Sets the api proxy for data access.
             */
            public proxy(proxy: AjaxProxy): this;
            /**
             * Gets the api proxy for data access.
             */
            public proxy(): AjaxProxy;
            public proxy(proxy?: AjaxProxy): any {
                if (arguments.length == 0) return this._proxy;
                this._proxy = proxy;
                return this
            }

            /**
             * Call an api with parameters.
             * @param api 
             * @param params 
             */
            public call<T>(api: Api<T>, params?: JsonObject): Promise<T> {
                if (!this._proxy) this._proxy = <AjaxProxy>Class.newInstance(Service.DEFAULT_PROXY);
                return new Promise<T>((resolve, reject) => {
                    return this._proxy.execute(api, params).then((result: ResultSet<T>) => {
                        let model = Class.newInstance<T>(api.dataKlass || Model), rds = result.data();
                        Types.ofKlass(model, Model)?(<any>model).setData(<JsonObject>rds): model = <T>rds;
                        resolve(model);
                    }).catch((res: AjaxResponse) => {
                        reject(res)
                    })
                });
            }

        }

    }

}
import Service = JS.model.Service;
