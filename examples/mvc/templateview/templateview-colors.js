JS.imports([
    '$handlebars',
    '$jsmvc',
    'ColorsTemplateView.js'
]).then(() => {
    $1('#btn1').on('click', () => {
        let view = Components.get(ColorsTemplateView);
        view.data([{
                "name": "black",
                "color": "#000000"
            }, {
                "name": "darkgray",
                "color": "#898989"
            }, {
                "name": "gray",
                "color": "#cccccc"
            }]);
    });
    $1('#btn2').on('click', () => {
        let view = Components.get(ColorsTemplateView);
        view.load('data.json');
    });
});
