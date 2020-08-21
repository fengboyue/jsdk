/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../lang/System.ts"/>
/// <reference path="AjaxProxy.ts"/>

module JS {

    export namespace model {

        /**
         * A JSON data proxy.
         */
        @klass('JS.model.JsonProxy')
        export class JsonProxy extends AjaxProxy {

            constructor() {
                super();
            }

            public execute<T>(query: string | HttpRequest): Promise<ResultSet<T>> {
                var req: HttpRequest = <HttpRequest>Jsons.union({
                    method: 'GET'
                },Http.toRequest(query),<HttpRequest>{
                    async:true,
                    responseType: 'json'
                });
                  
                return new Promise<ResultSet<T>>(function (resolve, reject) {
                    Http.send(req).always((res)=>{
                        let result = ResultSet.parseJSON<T>(res.data);
                        result && result.success()?resolve(result):reject(res);
                    })
                })
            }
        }
    }

}

import JsonProxy = JS.model.JsonProxy;
