JS.imports([
    '$jsfx.datepicker'
]).then(() => {
    new DatePicker({
        id: 'txt1',
        placeholder: 'select a date between [2007-08-30, 2019-08-01]',
        defaultViewDate: '2019-01-01',
        minDate: '2007-08-30',
        maxDate: '2019-08-01'
    });
    new DatePicker({
        id: 'txt2',
        placeholder: 'autofocus',
        autofocus: true
    });
    new DatePicker({
        id: 'txt3',
        placeholder: 'autoclear',
        autoclear: true
    });
    new DatePicker({
        id: 'txt4',
        placeholder: 'autoclose',
        autoclose: true
    });
    new DatePicker({
        id: 'txt5',
        placeholder: 'picker title + today button + clear button',
        title: 'Select A Date',
        todayBtn: true,
        clearBtn: true
    });
    new DatePicker({
        id: 'fmt1',
        placeholder: 'YY MM DD',
        format: 'YY MM DD'
    });
    new DatePicker({
        id: 'fmt2',
        placeholder: 'M/D/YYYY',
        format: 'M/D/YYYY',
        iniValue: '7/1/2019'
    });
    new DatePicker({
        id: 'sta1',
        placeholder: 'readonly',
        title: 'readonly',
        readonly: true,
        format: 'MM/DD/YYYY',
        iniValue: '01/31/2019'
    });
    new DatePicker({
        id: 'sta2',
        placeholder: 'disabled',
        title: 'disabled',
        disabled: true
    });
    let cls = 'fa fa-calendar';
    new DatePicker({
        id: 'sty1',
        faceMode: [LineInputFaceMode.square],
        colorMode: ColorMode.success,
        innerIcon: cls
    });
    new DatePicker({
        id: 'sty2',
        faceMode: [LineInputFaceMode.round, LineInputFaceMode.shadow],
        colorMode: ColorMode.info,
        innerIcon: cls
    });
    new DatePicker({
        id: 'sty3',
        faceMode: [LineInputFaceMode.pill, LineInputFaceMode.shadow],
        colorMode: ColorMode.primary,
        innerIcon: cls
    });
    new DatePicker({
        id: 'sty4',
        faceMode: [LineInputFaceMode.pill, LineInputFaceMode.shadow],
        colorMode: ColorMode.dark,
        leftAddon: 'Your Birthday',
        rightAddon: {
            text: 'SUBMIT',
            colorMode: ColorMode.info
        },
        innerIcon: { cls: cls }
    });
    new DatePicker({
        id: 'sty5',
        faceMode: [LineInputFaceMode.square, LineInputFaceMode.shadow],
        colorMode: ColorMode.dark,
        title: 'Your Birthday',
        rightAddon: {
            text: 'SUBMIT',
            colorMode: ColorMode.info,
            faceMode: ButtonFaceMode.pill
        },
        innerIcon: cls
    });
    new DatePicker({
        id: 'sty6',
        faceMode: [LineInputFaceMode.square, LineInputFaceMode.shadow],
        colorMode: ColorMode.dark,
        title: 'Your Birthday',
        titlePlace: 'top',
        rightAddon: {
            text: 'SUBMIT',
            colorMode: ColorMode.info,
            faceMode: ButtonFaceMode.pill
        },
        innerIcon: cls
    });
    new DatePicker({
        id: 'val1',
        title: 'Require(*)',
        autoclose: true,
        autoValidate: true,
        validators: [{
                name: 'required',
                message: 'Must not be Empty!'
            }]
    });
    new DatePicker({
        id: 'mul1',
        multidate: 3,
    });
    new DatePicker({
        id: 'emb1',
        embedded: true,
        todayHighlight: true
    });
});
