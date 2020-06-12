/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
module JS {

    export namespace util {

        /**
         * Console helper class
         * 控制台类
         */
        export class Konsole {

            public static clear(){
                console.clear();
            }

            public static count(label?:string){
                console.count(label);
            }
            public static countReset(label?:string){
                (<any>console).countReset(label);
            }
            public static time(label?:string){
                console.time(label);
            }
            public static timeEnd(label?:string){
                (<any>console).timeEnd(label);
            }

            public static trace(data: any, css?: string) {
                if (!data) console.trace();
        
                let arr = [data]
                if(typeof data == 'string' && css) arr[arr.length] = css;
                console.trace.apply(null, arr);
            }
        
            public static text(data: string, css?: string) {
                typeof css?console.log('%c'+data, css):console.log(data);
            }

            private static _print(d: any) {
                typeof d == 'string'?console.log(d):console.dirxml(d);
            }

            public static print(...data: any[]) {
                data.forEach(d => {
                    this._print(d)
                });
            }
         }
    }
}
import Konsole = JS.util.Konsole;