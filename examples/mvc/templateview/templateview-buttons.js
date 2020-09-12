JS.imports([
    '$handlebars',
    '$jsfx',
    'ButtonsTemplateView.js'
]).then(() => {
    $1('#b1').on('click', () => {
        let view = Compos.get(ButtonsTemplateView);
        view.data([{
                "name": "danger"
            }, {
                "name": "warning"
            }, {
                "name": "success"
            }]);
    });
});
