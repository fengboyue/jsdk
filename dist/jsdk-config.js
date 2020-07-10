/**
* JSDK 2.0.0 
* https://github.com/fengboyue/jsdk/
* (c) 2007-2020 Frank.Feng<boyue.feng@foxmail.com>
* MIT license
*/
JS.config({
    importMode: 'js',
    minimize: true,
    jsdkRoot: null,
    libRoot: '/jsdk/libs',        
    libs: {
        'jsds': [
            '!/jsds.js'
        ],
        'jsui': [
            '!/jsui.js'
        ],
        'jsmv': [
            '$jsui',
            '!/jsmv.js'
        ],
        'jsan': [
            '$jsui',
            '!/jsan.js'
        ],
        'jsvp': [
            '$jsmv',
            '!/jsvp.js'
        ],
        'jsunit': [
            '$ua-parser',
            '!/jsunit.js'
        ],
        //3rd library maybe required by the system
        'ua-parser':'~/ua-parser/0.7.20/ua-parser.js',
        'handlebars': '~/handlebars/4.1.2/handlebars.js',
        'handlebars-runtime': '~/handlebars/4.1.2/handlebars.runtime.js',
        'clipboard': '~/clipboard/2.0.0/clipboard.js#async',
        'polymer': '~/polymer/1.0.17/webcomponents-lite.js',
        //jsfx
        'jsfx.only': [
            '$jsmv',
            '!/jsfx.css',
            '!/jsfx.js'
        ],
        'jsfx.depend': [
            '$font-awesome',
            '$line-awesome',
            '$jquery',
            '$bootstrap'
        ],
        'jsfx': [
            '$jsfx.depend',
            '$jsfx.only'
        ],
        //jsfx.widget
        'jsfx.select': [
            '$jsfx.depend',
            '$select2',
            '$jsfx.only'
        ],
        'jsfx.datepicker': [
            '$jsfx.depend',
            '$bs-datepicker',
            '$jsfx.only'
        ],
        'jsfx.daterangepicker': [
            '$jsfx.depend',
            '$bs-daterangepicker',
            '$jsfx.only'
        ],
        'jsfx.rangeslider': [
            '$jsfx.depend',
            '$ion-rangeslider',
            '$jsfx.only'
        ],
        'jsfx.uploader': [
            '$jsfx.depend',
            '$toastr',
            '$webuploader',
            '$jsfx.only'
        ],
        'jsfx.texteditor': [
            '$jsfx.depend',
            '$summernote',
            '$jsfx.only'
        ],
        'jsfx.messagebox': [
            '$jsfx.depend',
            '$sweetalert2',
            '$jsfx.only'
        ],
        'jsfx.toast': [
            '$jsfx.depend',
            '$toastr',
            '$jsfx.only'
        ],
        'jsfx.sider': [
            '$jsfx.depend',
            '$slidereveal',
            '$jsfx.only'
        ],
        'jsfx.loading': [
            '$jsfx.depend',
            '$blockui',
            '$jsfx.only'
        ],
        //3rd of jsfx
        'font-awesome': [
            '~/font-awesome/5.9.0/css/all.css',
            '~/font-awesome/5.9.0/css/v4-shims.css'
        ],
        'line-awesome': '~/line-awesome/1.1.0/css/line-awesome.css',
        'jquery': '~/jquery/3.2.1/jquery.js',
        'bootstrap': [
            '~/bootstrap/4.0.0/bootstrap.css',
            '~/bootstrap/4.0.0/bootstrap.bundle.js'
        ],
        'moment': '~/moment/2.22.2/moment.js',
        'select2': [
            '~/select2/4.0.11/css/select2.css',
            '~/select2/4.0.11/js/select2.full.js'
        ],
        'bs-datepicker': [
            '$moment',
            '~/datepicker/1.9.0/css/bootstrap-datepicker.standalone.css',
            '~/datepicker/1.9.0/js/bootstrap-datepicker.js'
        ],
        'bs-daterangepicker': [
            '$moment',
            '~/daterangepicker/3.0.5/daterangepicker.css',
            '~/daterangepicker/3.0.5/daterangepicker.js'
        ],
        'summernote': [
            '~/summernote/0.8.12/summernote-bs4.css',
            '~/summernote/0.8.12/summernote-bs4.js'
        ],
        'sweetalert2': [
            '~/sweetalert2/7.26.9/sweetalert2.css',
            '~/sweetalert2/7.26.9/sweetalert2.js'
        ],
        'toastr': [
            '~/toastr/2.1.4/toastr.css',
            '~/toastr/2.1.4/toastr.js'
        ],
        'blockui': '~/blockui/2.70.0/jquery.blockUI.js',
        'slidereveal': '~/slidereveal/1.1.2/jquery.slidereveal.js',
        'webuploader': [
            '~/webuploader/0.1.5/webuploader.css',
            '~/webuploader/0.1.5/webuploader.js',
        ],
        'webuploader.swf': '~/webuploader/0.1.5/webuploader.swf',
        'ion-rangeslider': [
            '~/ion-rangeslider/2.3.0/ion.rangeSlider.css',
            '~/ion-rangeslider/2.3.0/ion.rangeSlider.js'
        ]
    }
})