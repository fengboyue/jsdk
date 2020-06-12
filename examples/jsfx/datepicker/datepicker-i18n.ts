/// <reference path="../../../dist/jsdk.d.ts" /> 
JS.imports([
    '$jsfx.datepicker',
    '../../../libs/datepicker/1.9.0/locales/bootstrap-datepicker.zh-CN.min.js',
    '../../../libs/datepicker/1.9.0/locales/bootstrap-datepicker.it.min.js'
]).then(() => {
    new DatePicker({
        id:'txt1',
        placeholder: '中文日期选择器',
        locale: 'zh-CN'
    })

    new DatePicker({
        id:'txt2',
        locale: 'it',
        placeholder: 'Italian Date Picker'
    })
})    