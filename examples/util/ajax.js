let fn = (res) => {
    JSLogger.info(res);
};
$1('#text1').on('click', () => {
    Http.send({
        url: 'ajax.js',
        responseType: 'text'
    }).then(fn);
});
$1('#text2').on('click', () => {
    Http.send({
        url: 'ajax.js',
        responseType: 'text',
        async: false
    }).then(fn);
});
$1('#html1').on('click', () => {
    Http.send({
        url: 'ajax.html',
        responseType: 'html'
    }).then(fn);
});
$1('#html2').on('click', () => {
    Http.send({
        url: 'ajax.html',
        responseType: 'html',
        async: false
    }).then(fn);
});
$1('#json1').on('click', () => {
    Http.send({
        url: 'result-array.json',
        responseType: 'json'
    }).then(fn);
});
$1('#json2').on('click', () => {
    Http.send({
        url: 'result-array.json',
        responseType: 'json',
        async: false
    }).then(fn);
});
$1('#xml1').on('click', () => {
    Http.send({
        url: 'ajax.xml',
        responseType: 'xml'
    }).then(fn);
});
$1('#xml2').on('click', () => {
    Http.send({
        url: 'ajax.xml',
        responseType: 'xml',
        async: false
    }).then(fn);
});
