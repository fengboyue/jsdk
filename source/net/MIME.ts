/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */

module JS {

    export namespace net {

        /**
         * MIME Constant
         */
        export class MIME {

            //二进制文件
            static exe = 'application/octet-stream';
            static bin = 'application/octet-stream';
            static eps = 'application/postscript';
            static word = 'application/vnd.ms-word';
            static xls = 'application/vnd.ms-excel';
            static ppt = 'application/vnd.ms-powerpoint';
            static mdb = 'application/x-msaccess';
            static pdf = 'application/pdf';
            static odt = 'application/vnd.oasis.opendocument.text';
            static swf = 'application/x-shockwave-flash';
            static apk = 'application/vnd.android.package-archive';
            static jar = 'application/java-archive';
            static dll = 'application/x-msdownload';
            static class = 'application/octet-stream';

            //压缩文件
            static gz = 'application/x-gzip';
            static tgz = 'application/x-gzip';
            static bz = 'application/x-bzip2';
            static zip = 'application/zip';
            static rar = 'application/x-rar';
            static tar = 'application/x-tar';
            static z = 'application/x-compress';
            static z7 = 'application/x-7z-compressed';
            static arj = 'application/arj';
            static lzh = 'application/x-lzh';

            static ZIPS = MIME.gz + ',' + MIME.tgz + ',' + MIME.bz + ',' + MIME.zip
                + ',' + MIME.rar + ',' + MIME.tar + ',' + MIME.z + ',' + MIME.z7 + ',' + MIME.arj + ',' + MIME.lzh;

            //纯文本文件
            static text = 'text/plain';
            static md = 'text/x-markdown';
            static html = 'text/html';
            static xml = 'text/xml';
            static css = 'text/css';
            static json = 'application/json,text/json';
            static js = 'application/javascript,text/javascript,application/ecmascript,application/x-ecmascript';
            static rtf = 'text/rtf';
            static rtfd = 'text/rtfd';
            static sql = 'text/x-sql';
            static sh = 'application/x-sh';
            static csv = 'text/csv';

            //图片文件
            static svg = 'image/svg+xml';
            static jpg = 'image/jpeg';
            static gif = 'image/gif';
            static png = 'image/png';
            static webp = 'image/webp';

            static bmp = 'image/bmp,image/x-ms-bmp';
            static tif = 'image/tiff';
            static tga = 'image/x-targa';
            static pcx = 'image/x-pcx';
            static pic = 'image/x-pict';
            static ico = 'image/x-icon';
            static ai = 'application/illustrator';
            static psd = 'image/vnd.adobe.photoshop,image/x-photoshop';

            static WEB_IMAGES = MIME.svg + ',' + MIME.jpg + ',' + MIME.gif + ',' + MIME.png + ',' + MIME.webp;
            static IMAGES = MIME.WEB_IMAGES + ',' + MIME.bmp + ',' + MIME.tif + ',' + MIME.tga + ',' + MIME.pcx
                + ',' + MIME.pic + ',' + MIME.ico + ',' + MIME.ai + ',' + MIME.psd;

            //音频文件
            static wav = 'audio/wav,audio/x-wav';
            static ogg = 'audio/ogg';
            static mp4_a = 'audio/mp4';
            static webm_a = 'audio/webm';

            static wma = 'audio/x-ms-wma';
            static mp3 = 'audio/mpeg';
            static mid = 'audio/midi,audio/x-midi';
            static au = 'audio/basic';
            static aif = 'audio/x-aiff';

            static H5_AUDIOS = MIME.ogg + ',' + MIME.wav + ',' + MIME.mp4_a + ',' + MIME.webm_a;
            static AUDIOS = MIME.H5_AUDIOS + ',' + MIME.mp3 + ',' + MIME.mid + ',' + MIME.wma + ',' + MIME.au + ',' + MIME.aif;

            //视频文件类型的 
            static ogv = 'video/ogg';
            static mp4_v = 'video/mp4';
            static webm_v = 'video/webm';

            static avi = 'video/x-msvideo';
            static dv = 'video/x-dv';
            static mpeg = 'video/mpeg';
            static mov = 'video/quicktime';
            static wmv = 'video/x-ms-wmv';
            static asf = 'video/x-ms-asf';
            static flv = 'video/x-flv';
            static mkv = 'video/x-matroska';
            static gpp3 = 'video/3gpp';
            static rm = 'application/vnd.rn-realmedia';
            
            static H5_VIDEOS = MIME.ogv + ',' + MIME.mp4_v + ',' + MIME.webm_v;
            static VIDEOS = MIME.H5_VIDEOS + ',' + MIME.avi + ',' + MIME.dv + ',' + MIME.mpeg + ',' + MIME.mov
             + ',' + MIME.wmv + ',' + MIME.asf + ',' + MIME.flv + ',' + MIME.mkv + ',' + MIME.gpp3 + ',' + MIME.rm;

        }
    }
}

//预定义短类名
import MIME = JS.net.MIME;