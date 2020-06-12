JS.imports('$jsfx').then(() => {
    let fn = function (e, ...args) {
        Assert.true(Types.isKlass(this, TextInput));
        Assert.true(Types.ofKlass(e, Event));
        JSLogger.info(this.id, e.type, args, this);
    };
    new TextInput({
        id: 'txt1',
        placeholder: 'Changed event',
        iniValue: 'This is TextInput'
    }).on('changed', fn);
    new TextInput({
        id: 'txt2',
        placeholder: 'Validate event',
        autoValidate: true,
        validators: [{
                name: 'required',
                message: 'Must not be Empty!'
            }, {
                name: 'custom',
                message: 'Must is 123!',
                validate: (val) => {
                    return val == '123';
                }
            }]
    }).on('validated', fn);
    let txt3 = new TextInput({
        id: 'txt3',
        placeholder: 'Validate event',
        autoValidate: false,
        validators: [{
                name: 'required',
                message: 'Must not be Empty!'
            }, {
                name: 'custom',
                message: 'Must is 123!',
                validate: (val) => {
                    return val == '123';
                }
            }]
    }).on('validated', fn);
    $('#btn1').click(() => {
        txt3.validate();
    });
});
