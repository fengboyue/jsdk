JS.imports('$jsfx').then(() => {
    new NumberInput({
        id: 'txt1',
        title: 'No min or max',
        titlePlace: 'top',
        textAlign: 'right'
    });
    new NumberInput({
        id: 'txt2',
        title: 'Min is 1',
        titlePlace: 'top',
        min: 1
    });
    new NumberInput({
        id: 'txt3',
        title: 'Max is 20',
        titlePlace: 'top',
        max: 20
    });
    new NumberInput({
        id: 'txt4',
        title: 'Min is 1, Max is 20',
        titlePlace: 'top',
        min: 1,
        max: 20
    });
    new NumberInput({
        id: 'txt5',
        title: 'Min/Max/Step/FractionDigits is 1/20/0.2/2',
        titlePlace: 'top',
        placeholder: 'input your number',
        sizeMode: SizeMode.sm,
        colorMode: ColorMode.info,
        min: 1,
        max: 20,
        step: 0.2,
        fractionDigits: 2
    });
    new NumberInput({
        id: 'sta1',
        placeholder: 'readonly',
        title: 'readonly',
        readonly: true,
        fractionDigits: 2,
        iniValue: 0
    });
    new NumberInput({
        id: 'sta2',
        placeholder: 'disabled',
        title: 'disabled',
        disabled: true
    });
    new NumberInput({
        id: 'sty1',
        leftAddon: {
            text: 'Your Number',
            colorMode: ColorMode.primary
        },
        textAlign: 'right',
        sizeMode: SizeMode.sm,
        colorMode: ColorMode.info,
        faceMode: [LineInputFaceMode.shadow, LineInputFaceMode.pill]
    });
    new NumberInput({
        id: 'sty2',
        rightAddon: {
            text: 'Your Number',
            colorMode: ColorMode.primary
        },
        textAlign: 'right',
        sizeMode: SizeMode.sm,
        colorMode: ColorMode.info,
        faceMode: [LineInputFaceMode.shadow, LineInputFaceMode.pill]
    });
    new NumberInput({
        id: 'sty3',
        leftAddon: {
            text: 'Your Number1',
            colorMode: ColorMode.primary
        },
        rightAddon: {
            text: 'Your Number2',
            colorMode: ColorMode.primary
        },
        textAlign: 'right',
        sizeMode: SizeMode.sm
    });
    new NumberInput({
        id: 'sty4',
        rightAddon: {
            text: 'Your Number',
            colorMode: ColorMode.primary,
            dropMenu: {
                items: [{
                        text: 'Max Number is 100'
                    }, {
                        text: 'Min Number is -1'
                    }]
            }
        },
        textAlign: 'right',
        sizeMode: SizeMode.sm,
        colorMode: ColorMode.info,
        faceMode: [LineInputFaceMode.shadow, LineInputFaceMode.pill]
    });
});
