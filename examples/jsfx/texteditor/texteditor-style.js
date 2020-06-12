JS.imports([
    '$jsfx.texteditor'
]).then(() => {
    new TextEditor({
        id: 'txt1',
        placeholder: 'Width=600px,height=200px',
        width: 600,
        height: 200
    });
    new TextEditor({
        id: 'txt2',
        title: 'Square:',
        titlePlace: 'top'
    });
    new TextEditor({
        id: 'txt3',
        title: 'Round:',
        titlePlace: 'top',
        faceMode: RowsInputFaceMode.round
    });
    new TextEditor({
        id: 'txt4',
        title: 'Shadow:',
        titlePlace: 'top',
        faceMode: [RowsInputFaceMode.round, RowsInputFaceMode.shadow]
    });
    new TextEditor({
        id: 'txt5',
        title: 'Readonly:',
        titlePlace: 'top',
        readonly: true,
        iniValue: '123456'
    });
    new TextEditor({
        id: 'txt6',
        title: 'Disabled:',
        titlePlace: 'top',
        disabled: true,
        iniValue: '123456'
    });
    new TextEditor({
        id: 'txt7',
        title: 'Without counter:',
        titlePlace: 'top',
        maxlength: 100,
        height: 200,
        counter: false
    });
    new TextEditor({
        id: 'txt8',
        title: 'With counter:',
        titlePlace: 'top',
        maxlength: 100,
        height: 200,
        iniValue: '<p>1234567890</p><p>1234567890</p><p>1234567890</p><p>1234567890</p><p>1234567890</p><p>1234567890</p>'
    });
    let cfg = {
        title: 'Length limits in [5,10]',
        titlePlace: 'top',
        maxlength: 10,
        height: 200,
        autoValidate: true,
        validators: [
            {
                name: 'length',
                allowEmpty: false,
                short: 5,
                long: 10,
                tooShortMessage: 'Must >=5 chars!',
                tooLongMessage: 'Must <=10 chars!'
            }
        ]
    };
    cfg.validators[0].allowEmpty = false;
    new TextEditor(Jsons.union(cfg, {
        id: 'txt9'
    }));
    cfg.validators[0].allowEmpty = true;
    new TextEditor(Jsons.union(cfg, {
        id: 'txt10'
    }));
    cfg.autoValidate = false;
    cfg.validateMode = {
        showError: (msg) => {
            $('#error').html(msg);
        },
        hideError: () => {
            $('#error').html('');
        }
    };
    let txt11 = new TextEditor(Jsons.union(cfg, {
        id: 'txt11'
    }));
    $('#chk').click(() => {
        txt11.validate();
    });
});
