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

        export class FileTypes {
            static CODES ='c,h,cpp,ini,idl,hpp,hxx,hp,hh,cxx,cc,s,asm,log,bak,' +
                    'as,ts,js,json,xml,html,htm,xhtml,xht,css,md,mkd,markdown,' +
                    'java,properties,jsp,vm,ftl,' +
                    'swift,m,mm,' +
                    'cgi,sh,applescript,bat,sql,rb,py,php,php3,php4,' +
                    'p,pp,pas,dpr,cls,frm,vb,bas,vbs,' +
                    'cs,config,asp,aspx,' +
                    'yaml,vhd,vhdl,cbl,cob,coffee,clj,lisp,lsp,cl,jl,el,erl,groovy,less,lua,go,ml,pl,pm,al,perl,r,scala,st,tcl,tk,itk,v,y,d,' +
                    'xq,xql,xqm,xqy,xquery';
            static IMAGES = 'pic,jpg,jpeg,png,gif,bmp,webp,tif,tiff,svg,wbmp,tga,pcx,ico,psd,ai';
            static DOCS = 'md,markdown,msg,eml,txt,rtf,pdf,doc,docx,csv,xls,xlsx,ppt,pptx,wps';
            static ZIPS = 'zip,7z,z,bz2,gz,tar,taz,tgz,rar,arj,lzh';
            static VIDEOS = 'mp4,rm,rmvb,mpg,mpeg,mpg4,avi,dv,3gpp,asf,asx,wmv,qt,mov,ogv,flv,mkv,webm';
            static AUDIOS = 'ogg,wav,mpga,mp2,mp3,au,snd,mid,midi,ra,ram,aif,aiff,webm';
        }

        export enum FileSizeUnit {
            B = 'B',
            KB = 'KB',
            MB = 'MB',
            GB = 'GB',
            TB = 'TB'
        }
        /**
         * File Helper
         */
        export class Files {
            public static ONE_KB = 1024;
            public static ONE_MB = 1048576;
            public static ONE_GB = 1073741824;
            public static ONE_TB = 1099511627776;

            public static getFileName(path: string): string {
                let pos = path.lastIndexOf('/');
                if (pos < 0) return path;
                return path.slice(pos + 1);
            }

            public static getFileType(path: string): string {
                let pos = path.lastIndexOf('.');
                if (pos < 0) return '';
                return path.slice(pos + 1);
            }

            public static isFileType(path: string, exts: string): boolean {
                if (!path || !exts) return false;

                let ext = this.getFileType(path);
                return ext ? (exts.toLowerCase() + ',').indexOf(ext + ',') >= 0 : false;
            }

            public static convertSize(size: string | number, orgUnit: FileSizeUnit, tarUnit: FileSizeUnit): number {
                if (!size) return 0;
                let s = Number(size);
                if (s <= 0) return 0;
                
                let map = {
                    'B': 0, 'KB': 1, 'MB': 2, 'GB': 3, 'TB': 4
                }, r1 = map[orgUnit], r2 = map[tarUnit];

                return s * Math.pow(1024, r1 - r2);
            }

            public static toSizeString(byte: string | number, sizeUnit?: FileSizeUnit): string {
                let unit = sizeUnit || FileSizeUnit.B, TC = this.convertSize;
                if (!byte) return '0' + unit;

                let kb = TC(byte, unit, FileSizeUnit.KB);
                if (kb == 0) return '0' + unit;
                if (kb < 1) return byte + 'B';

                let mb = TC(byte, unit, FileSizeUnit.MB);
                if (mb < 1) return kb + 'KB';

                let gb = TC(byte, unit, FileSizeUnit.GB);
                if (gb < 1) return mb + 'MB';

                let tb = TC(byte, unit, FileSizeUnit.TB);
                return tb < 1?(gb + 'GB'):(tb + 'TB')
            }

        }
    }
}

//预定义短类名
import FileSizeUnit = JS.util.FileSizeUnit;
import Files = JS.util.Files;
import FileTypes = JS.util.FileTypes;