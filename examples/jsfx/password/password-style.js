JS.imports('$jsfx').then(() => {
    new Password({
        id: 'txt1',
        placeholder: 'visible'
    });
    new Password({
        id: 'txt2',
        placeholder: 'unvisible',
        visible: false
    });
    new Password({
        id: 'sta1',
        placeholder: 'readonly',
        title: 'readonly',
        readonly: true,
        iniValue: 123456
    });
    new Password({
        id: 'sta2',
        placeholder: 'disabled',
        title: 'disabled',
        disabled: true
    });
    new Password({
        id: 'pwd1',
        placeholder: 'input password please',
        title: 'Your Password: ',
        textAlign: 'right',
        sizeMode: SizeMode.sm,
        colorMode: ColorMode.info
    });
    new Password({
        id: 'pwd2',
        placeholder: 'input password please',
        leftAddon: {
            text: 'Your Password',
            colorMode: ColorMode.primary
        },
        textAlign: 'right',
        sizeMode: SizeMode.sm,
        colorMode: ColorMode.info,
        faceMode: [LineInputFaceMode.shadow, LineInputFaceMode.pill]
    });
    new Password({
        id: 'pwd3',
        placeholder: 'input password please',
        rightAddon: {
            text: 'Your Password',
            colorMode: ColorMode.primary
        },
        textAlign: 'right',
        sizeMode: SizeMode.sm,
        colorMode: ColorMode.info,
        faceMode: [LineInputFaceMode.shadow, LineInputFaceMode.pill]
    });
    new Password({
        id: 'pwd4',
        placeholder: 'input password please',
        leftAddon: {
            text: 'Your Password',
            colorMode: ColorMode.primary
        },
        rightAddon: {
            text: 'Your Password',
            colorMode: ColorMode.primary
        },
        textAlign: 'right',
        sizeMode: SizeMode.sm,
        colorMode: ColorMode.info,
        faceMode: [LineInputFaceMode.shadow, LineInputFaceMode.pill]
    });
    new Password({
        id: 'pwd5',
        placeholder: 'input password please',
        rightAddon: {
            text: 'Your Password',
            colorMode: ColorMode.primary,
            dropMenu: {
                items: [{
                        text: 'Public Key'
                    }, {
                        text: 'Private Key'
                    }]
            }
        },
        textAlign: 'right',
        sizeMode: SizeMode.sm,
        colorMode: ColorMode.info,
        faceMode: [LineInputFaceMode.shadow, LineInputFaceMode.pill]
    });
});
