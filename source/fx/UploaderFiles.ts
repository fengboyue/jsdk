/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */

module JS {

    export namespace fx {

        /**
         * A file data with MIME info
         */
        export type MimeFile = {
            id: string;
            mime?: string;
            name: string;
            ext?: string;
            size?: number;
            uri: string;
        }

        export type FileAccepts = {
            title?:string,
            extensions?:string,
            mimeTypes?: string
        }
        
    }
}

//预定义短类名
import MimeFile = JS.fx.MimeFile;
import FileAccepts = JS.fx.FileAccepts;