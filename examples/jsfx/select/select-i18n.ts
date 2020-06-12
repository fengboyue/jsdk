/// <reference path="../../../dist/jsdk.d.ts" /> 
JS.imports([
    '$jsfx.select',
    '/libs/select2/4.0.11/js/i18n/zh-CN.js',
    '/libs/select2/4.0.11/js/i18n/it.js'
]).then(() => {
    new Select({
        id:'s1',
        locale: 'zh-CN',
        multiple: true
    })

    new Select({
        id:'s2',
        locale: 'it',
        multiple: true
    })

})    