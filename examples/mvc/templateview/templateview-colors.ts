/// <reference path='../../../dist/jsdk.d.ts' /> 
/// <reference path='ColorsTemplateView.ts' /> 
JS.imports([
    '$handlebars',
    '$jsmvc',
    'ColorsTemplateView.js'
]).then(()=>{

    $1('#btn1').on('click', () => {
        let view = Compos.get<ColorsTemplateView>(ColorsTemplateView);
        view.data([{
            "name":"black",
            "color":"#000000"
        },{
            "name":"darkgray",
            "color":"#898989"
        },{
            "name":"gray",
            "color":"#cccccc"
        }]);
    })

    $1('#btn2').on('click', () => {
        let view = Compos.get<ColorsTemplateView>(ColorsTemplateView);
        view.load('data.json');
    })
})