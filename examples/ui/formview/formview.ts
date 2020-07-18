/// <reference path='../../../dist/jsdk.d.ts' /> 
/// <reference path='MyFormView.ts' /> 
JS.imports([
    '$jsui',
    '$jsfx.select',
    '$jsfx.datepicker',
    '$jsfx.daterangepicker',
    '$jsfx.rangeslider',
    '$jsfx.uploader',
    '$jsfx.texteditor',
    'MyFormView.js'
]).then(() => {
    [
        'radio',
        'checkbox',
        'switch',
        'select',
        { id: 'multipleSelect', alias: 'select' },
        { id: 'crudSelect', alias: 'select' },
        'rangeslider',
        'uploader',
        'textinput',
        'password',
        'telinput',
        'emailinput',
        'numberinput',
        'datepicker',
        'daterangepicker',
        'textarea',
        'texteditor',
        { id: 'btnSet', alias: 'button' },
        { id: 'btnValidate', alias: 'button' },
        { id: 'btnClear', alias: 'button' },
        { id: 'btnReset', alias: 'button' },
        { id: 'btnVal', alias: 'button' }
    ].forEach(item => {
        let isJson = Types.isJsonObject(item),
            id = isJson ? (<JsonObject>item).id : item,
            alias = isJson ? (<JsonObject>item).alias : item;
        $('#fv1').append(`
        <div class="row">
            <div class="col-sm">
                <div id="${id}" jsfx-alias="${alias}"></div>
            </div>
        </div>
        `)
    })
    let fv = new MyFormView();
    fv.initialize();
    fv.render();
    //or: Components.get<MyFormView>(MyFormView);

})