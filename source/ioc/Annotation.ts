/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="Compos.ts"/>
module JS {

    export namespace ioc {

            /**
             * The @compo annotation
             * @param className the component full name
             */
            export function compo(className: string): any {
                return Annotations.define({
                    name: 'compo', handler: (anno: string, values: Array<any>, obj: Klass<any> | object) => {
                        let className = values[0];
                        Class.reflect(<Klass<any>>obj, className);
                        Compos.add(Class.forName(className).name);
                    }
                }, arguments);
            }

            /**
             * The @inject annotation
             */
            export function inject(): any {
                return Annotations.define({
                    name:'inject',
                    target: AnnotationTarget.FIELD
                });
            }

    }
}

//预定义短类名
import compo = JS.ioc.compo;
import inject = JS.ioc.inject;