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

        export type FileExts = {
            title?:string,
            extensions?:string,
            mimeTypes?: string
        }
        /**
         * MIME Helper
         */
        export class MimeFiles {
            public static SOURCE_FILES :FileExts = {
                title: 'Source Files',
                extensions:
                    'c,h,cpp,ini,idl,hpp,hxx,hp,hh,cxx,cc,s,asm,log,bak,' +
                    'as,ts,js,json,xml,html,htm,xhtml,xht,css,md,mkd,markdown,' +
                    'java,properties,jsp,vm,ftl,' +
                    'swift,m,mm,' +
                    'cgi,sh,applescript,bat,sql,rb,py,php,php3,php4,' +
                    'p,pp,pas,dpr,cls,frm,vb,bas,vbs,' +
                    'cs,config,asp,aspx,' +
                    'yaml,vhd,vhdl,cbl,cob,coffee,clj,lisp,lsp,cl,jl,el,erl,groovy,less,lua,go,ml,pl,pm,al,perl,r,scala,st,tcl,tk,itk,v,y,d,' +
                    'xq,xql,xqm,xqy,xquery',
                mimeTypes: `text/plain`
            }
            public static IMAGE_FILES :FileExts = {
                title: 'Image Files',
                extensions: 'pic,jpg,jpeg,png,gif,bmp,webp,tif,tiff,svg,wbmp,tga,pcx,ico,psd,ai',
                mimeTypes: 'image/x-pict,image/jpeg,image/png,image/gif,image/bmp,image/webp,image/tiff,image/svg+xml,image/vnd.wap.wbmp,image/x-targa,image/x-pcx,image/x-icon,image/x-photoshop,application/illustrator'
            }
            public static DOC_FILES :FileExts= {
                title: 'Document Files',
                extensions: 'html,htm,xhtml,xht,md,markdown,mbox,msg,eml,txt,rtf,pdf,doc,docx,csv,xls,xlsx,ppt,pptx,xml,wps',
                mimeTypes:
                    'text/html,text/x-markdown,' +
                    'application/mbox,application/vnd.ms-outlook,message/rfc822,text/plain,application/rtf,application/pdf,' +
                    'application/msword,application/vnd.ms-excel,application/vnd.ms-powerpoint,' +
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document,' +
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,' +
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation,' +
                    'text/xml,application/kswps'
            }
            public static COMPRESSED_FILES:FileExts = {
                title: 'Compressed Files',
                extensions: 'zip,7z,z,bz2,gz,tar,taz,tgz,rar,arj,lzh',
                mimeTypes: 'application/zip,application/x-7z-compressed,application/x-compress,application/x-bzip2,application/x-gzip,application/x-tar,application/x-rar-compressed,application/arj,application/x-lzh'
            }
            public static VIDEO_FILES :FileExts= {
                title: 'Video Files',
                extensions: 'mp4,rm,rmvb,mpg,mpeg,mpg4,avi,3gpp,asf,asx,wma,wmv,qt',
                mimeTypes: 'video/*,application/vnd.rn-realmedia,video/mpeg,video/x-msvideo,video/3gpp,video/x-ms-asf,audio/x-ms-wma,audio/x-ms-wmv,video/quicktime'
            }
            public static AUDIO_FILES:FileExts = {
                title: 'Audio Files',
                extensions: 'ogg,wav,mpga,mp2,mp3,au,snd,mid,midi,ra,ram,aif,aiff,webm',
                mimeTypes: 'audio/ogg,audio/x-wav,audio/mpeg,audio/x-mpeg,audio/basic,audio/midi,audio/x-midi,audio/x-pn-realaudio,audio/x-aiff,audio/webm'
            }
            public static WEB_FILES:FileExts = {
                title: 'Web Files',
                extensions: 'html,htm,xhtml,xht,css,js,json,swf',
                mimeTypes: 'text/html,text/css,application/json,text/javascript,application/x-shockwave-flash'
            }
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

            public static getExt(path: string): string {
                let pos = path.lastIndexOf('.');
                if (pos < 0) return '';
                return path.slice(pos + 1);
            }

            public static isFileExt(path: string, exts: string): boolean {
                if (!path || !exts) return false;

                let ext = this.getExt(path);
                return ext ? (exts.toLowerCase() + ',').indexOf(ext + ',') >= 0 : false;
            }
            public static isSourceFile(path: string): boolean {
                return this.isFileExt(path, MimeFiles.SOURCE_FILES.extensions);
            }
            public static isImageFile(path: string): boolean {
                return this.isFileExt(path, MimeFiles.IMAGE_FILES.extensions);
            }
            public static isDocFile(path: string): boolean {
                return this.isFileExt(path, MimeFiles.DOC_FILES.extensions);
            }
            public static isAudioFile(path: string): boolean {
                return this.isFileExt(path, MimeFiles.AUDIO_FILES.extensions);
            }
            public static isVideoFile(path: string): boolean {
                return this.isFileExt(path, MimeFiles.VIDEO_FILES.extensions);
            }
            public static isCompressedFile(path: string): boolean {
                return this.isFileExt(path, MimeFiles.COMPRESSED_FILES.extensions);
            }
            public static isWebFile(path: string): boolean {
                return this.isFileExt(path, MimeFiles.WEB_FILES.extensions);
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
                let unit = sizeUnit || FileSizeUnit.B;
                if (!byte) return '0' + unit;

                let kb = this.convertSize(byte, unit, FileSizeUnit.KB);
                if (kb == 0) return '0' + unit;
                if (kb < 1) return byte + 'B';

                let mb = this.convertSize(byte, unit, FileSizeUnit.MB);
                if (mb < 1) return kb + 'KB';

                let gb = this.convertSize(byte, unit, FileSizeUnit.GB);
                if (gb < 1) return mb + 'MB';

                let tb = this.convertSize(byte, unit, FileSizeUnit.TB);
                return tb < 1?(gb + 'GB'):(tb + 'TB')
            }

        }
    }
}

//预定义短类名
import MimeFile = JS.util.MimeFile;
import FileExts = JS.util.FileExts;
import MimeFiles = JS.util.MimeFiles;
import FileSizeUnit = JS.util.FileSizeUnit;
import Files = JS.util.Files;