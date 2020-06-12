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

            public execute<T>(query: string | AjaxRequest, data?: JsonObject|QueryString): Promise<ResultSet<T>> {
                var req: AjaxRequest = <AjaxRequest>Jsons.union({
                    method: 'GET'
                },Ajax.toRequest(query, data),{
                    async:true,
                    type: 'json'
                });
                  
                return new Promise<ResultSet<T>>(function (resolve, reject) {
                    Ajax.send(req).always((res)=>{
                        let result = ResultSet.parseJSON<T>(res.data);
                        result && result.success()?resolve(result):reject(res);
                    })
                })
            }
        }
    }

}

import JsonProxy = JS.model.JsonProxy;
