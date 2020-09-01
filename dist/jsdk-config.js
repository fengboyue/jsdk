//JSDK 2.6.0
JS.config({
    closeImport: false,
    cachedImport: true,
    minImport: true,
    jsdkRoot: null,
    libRoot: '/jsdk/libs',        
    libs: {
        'jsds': [
            '!/jsds.js'
        ],
        'jsugar': [
            '!/jsugar.js'
        ],
        'jsmath': [
            '!/jsmath.js'
        ],
        'js2d': [
            '$jsmath',
            '!/js2d.js'
        ],
        'jsmedia': [
            '$jsds',
            '!/jsmedia.js'
        ],
        'jsui': [
            '$jsds',
            '!/jsui.js'
        ],
        'jsmvc': [
            '$jsugar',
            '$jsui',
            '!/jsmvc.js'
        ],
        'jsan': [
            '!/jsan.js'
        ],
        'jsvp': [
            '$jsmvc',
            '!/jsvp.js'
        ],
        'jsunit': [
            '$jsugar',
            '$ua-parser#async',
            '!/jsunit.js'
        ],
        //3rd libraries maybe required some modules
        'ua-parser':'~/ua-parser/0.7.20/ua-parser.js',
        'handlebars': '~/handlebars/4.1.2/handlebars.js',
        'handlebars-runtime': '~/handlebars/4.1.2/handlebars.runtime.js',
        'clipboard': '~/clipboard/2.0.0/clipboard.js#async',
        'polymer': '~/polymer/1.0.17/webcomponents-lite.js',
        //jsfx
        'jsfx.only': [
            '$jsmvc',
            '!/jsfx.css#async',
            '!/jsfx.js'
        ],
        'jsfx.depend': [
            '$font-awesome#async',
            '$line-awesome#async',
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
            '$select2#async',
            '$jsfx.only'
        ],
        'jsfx.datepicker': [
            '$jsfx.depend',
            '$bs-datepicker#async',
            '$jsfx.only'
        ],
        'jsfx.daterangepicker': [
            '$jsfx.depend',
            '$bs-daterangepicker#async',
            '$jsfx.only'
        ],
        'jsfx.rangeslider': [
            '$jsfx.depend',
            '$ion-rangeslider#async',
            '$jsfx.only'
        ],
        'jsfx.uploader': [
            '$jsfx.depend',
            '$toastr#async',
            '$webuploader#async',
            '$jsfx.only'
        ],
        'jsfx.texteditor': [
            '$jsfx.depend',
            '$summernote#async',
            '$jsfx.only'
        ],
        'jsfx.messagebox': [
            '$jsfx.depend',
            '$sweetalert2#async',
            '$jsfx.only'
        ],
        'jsfx.toast': [
            '$jsfx.depend',
            '$toastr#async',
            '$jsfx.only'
        ],
        'jsfx.sider': [
            '$jsfx.depend',
            '$slidereveal#async',
            '$jsfx.only'
        ],
        'jsfx.loading': [
            '$jsfx.depend',
            '$blockui#async',
            '$jsfx.only'
        ],
        //3rd libraries using by jsfx
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
            '$moment#async',
            '~/datepicker/1.9.0/css/bootstrap-datepicker.standalone.css',
            '~/datepicker/1.9.0/js/bootstrap-datepicker.js'
        ],
        'bs-daterangepicker': [
            '$moment#async',
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
        'webuploader.swf': '~/webuploader/0.1.5/webuploader.swf',//special store the url for initial webuploader
        'ion-rangeslider': [
            '~/ion-rangeslider/2.3.0/ion.rangeSlider.css',
            '~/ion-rangeslider/2.3.0/ion.rangeSlider.js'
        ]
    }
})
