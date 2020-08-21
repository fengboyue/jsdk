JS.imports([
    '$jsui'
]).then(() => {
    let fn = function (e) {
        $1('#info').innerHTML += e.type + ' on ' + e.target.id + '<br>';
    };
    $1('#btnTap').on('click tap', fn);
    $1('#btnSingleTap').on('singletap', fn);
    $1('#btnDoubleTap').on('doubletap', fn);
    $1('#btnLongTap').on('longtap', fn);
});
