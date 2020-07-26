/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="Components.ts"/>
module JS {

    export namespace ioc {

            /**
             * The @component annotation
             * @param className the component full name
             */
            export function component(className: string): any {
                return Annotations.define({
                    name: 'component', handler: (anno: string, values: Array<any>, obj: Klass<any> | object) => {
                        let className = values[0];
                        Class.register(<Klass<any>>obj, className);
                        Components.add(Class.forName(className).name);
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
import component = JS.ioc.component;
import inject = JS.ioc.inject;