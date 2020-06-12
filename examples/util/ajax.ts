/// <reference path='../../dist/jsdk.d.ts' /> 
let fn = (res:AjaxResponse)=>{
    JSLogger.info(res)
}

$1('#text1').on('click',()=>{
    Ajax.send({
        url:'ajax.js',
        type: 'text'
    }).then(fn)
})
$1('#text2').on('click',()=>{
    Ajax.send({
        url:'ajax.js',
        type: 'text',
        async: false
    }).then(fn)
})

$1('#html1').on('click',()=>{
    Ajax.send({
        url:'ajax.html',
        type: 'html'
    }).then(fn)
})
$1('#html2').on('click',()=>{
    Ajax.send({
        url:'ajax.html',
        type: 'html',
        async:false
    }).then(fn)
})

$1('#json1').on('click',()=>{
    Ajax.send({
        url:'result-array.json',
        type: 'json'
    }).then(fn)
})
$1('#json2').on('click',()=>{
    Ajax.send({
        url:'result-array.json',
        type: 'json',
        async:false
    }).then(fn)
})

$1('#xml1').on('click',()=>{
    Ajax.send({
        url:'ajax.xml',
        type: 'xml'
    }).then(fn)
})
$1('#xml2').on('click',()=>{
    Ajax.send({
        url:'ajax.xml',
        type: 'xml',
        async: false
    }).then(fn)
})