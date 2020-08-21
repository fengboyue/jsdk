/// <reference path='../../../dist/jsdk.d.ts' /> 
/// <reference path='ButtonsTemplateView.ts' /> 
JS.imports([
    '$handlebars',
    '$jsfx',
    'ButtonsTemplateView.js'
]).then(()=>{

    $1('#b1').on('click', () => {
        let view = Components.get<ButtonsTemplateView>(ButtonsTemplateView);
        view.data([{
            "name":"danger"
        },{
            "name":"warning"
        },{
            "name":"success"
        }]);
    })
})