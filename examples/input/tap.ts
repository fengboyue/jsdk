/// <reference path='../../dist/jsdk.d.ts' /> 
JS.imports([
    '$jsinput'
]).then(() => {
    let fn = function (e: Event) {
        $1('#info').innerHTML += e.type + ' on ' + (<HTMLElement>e.target).id + '<br>'
    }

    $1('#btnTap').on('click tap', fn);
    $1('#btnSingleTap').on('singletap', fn);
    $1('#btnDoubleTap').on('doubletap', fn);
    $1('#btnLongTap').on('longtap', fn);

})
