JS.imports('$jsfx').then(() => {
    new EmailInput({
        id: 'txt1',
        placeholder: 'your email account@domail'
    });
    new EmailInput({
        id: 'txt2',
        iniValue: 'your_email@dot.mail'
    });
    new EmailInput({
        id: 'txt3',
        placeholder: 'maxlength is 10',
        maxlength: 10
    });
    new EmailInput({
        id: 'txt4',
        placeholder: 'autofocus',
        autofocus: true
    });
    new EmailInput({
        id: 'sta1',
        placeholder: 'readonly',
        title: 'readonly',
        readonly: true,
        iniValue: 'a@b.c'
    });
    new EmailInput({
        id: 'sta2',
        placeholder: 'disabled',
        title: 'disabled',
        disabled: true
    });
    let cls = 'fa fa-envelope-o fa-fw';
    new EmailInput({
        id: 'sty1',
        faceMode: [LineInputFaceMode.square],
        colorMode: ColorMode.success,
        innerIcon: { cls: cls }
    });
    new EmailInput({
        id: 'sty2',
        faceMode: [LineInputFaceMode.round, LineInputFaceMode.shadow],
        colorMode: ColorMode.info,
        innerIcon: { cls: cls }
    });
    new EmailInput({
        id: 'sty3',
        faceMode: [LineInputFaceMode.pill, LineInputFaceMode.shadow],
        colorMode: ColorMode.primary,
        innerIcon: { cls: cls }
    });
    new EmailInput({
        id: 'sty4',
        faceMode: [LineInputFaceMode.pill, LineInputFaceMode.shadow],
        colorMode: ColorMode.dark,
        leftAddon: {
            text: 'Your Email'
        },
        rightAddon: {
            text: 'SUBMIT',
            colorMode: ColorMode.info
        },
        innerIcon: { cls: cls }
    });
    new EmailInput({
        id: 'sty5',
        faceMode: [LineInputFaceMode.square, LineInputFaceMode.shadow],
        colorMode: ColorMode.dark,
        title: 'Your Email',
        rightAddon: {
            text: 'SUBMIT',
            colorMode: ColorMode.info,
            faceMode: ButtonFaceMode.pill
        },
        innerIcon: { cls: cls }
    });
    new EmailInput({
        id: 'sty6',
        faceMode: [LineInputFaceMode.square, LineInputFaceMode.shadow],
        colorMode: ColorMode.dark,
        title: 'Your Email',
        titlePlace: 'top',
        rightAddon: {
            text: 'SUBMIT',
            colorMode: ColorMode.info,
            faceMode: ButtonFaceMode.pill
        },
        innerIcon: { cls: cls }
    });
});
