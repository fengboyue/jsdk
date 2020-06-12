JS.imports('$jsfx').then(() => {
    new Radio({
        id: 'txt1',
        data: [{
                id: '0'
            }]
    });
    new Radio({
        id: 'txt2',
        data: [{
                id: '0'
            }, {
                id: '1'
            }, {
                id: '2'
            }]
    });
    let data = [{
            id: '0',
            text: 'large'
        }, {
            id: '1',
            text: 'medium'
        }, {
            id: '2',
            text: 'small'
        }];
    new Radio({
        id: 'lay1',
        title: 'Left title + Inline Layout:',
        data: data
    });
    new Radio({
        id: 'lay2',
        title: 'Left title + List Layout:',
        data: data,
        faceMode: RadioFaceMode.list
    });
    new Radio({
        id: 'lay3',
        title: 'Top title + Inline Layout:',
        titlePlace: 'top',
        data: data
    });
    new Radio({
        id: 'lay4',
        title: 'Top title + List Layout:',
        titlePlace: 'top',
        data: data,
        faceMode: RadioFaceMode.list
    });
    new Radio({
        id: 'fac1',
        title: 'Dot Mode:',
        faceMode: RadioFaceMode.dot,
        data: data,
        iniValue: '0'
    });
    new Radio({
        id: 'fac2',
        title: 'Ring Mode:',
        faceMode: RadioFaceMode.ring,
        data: data,
        iniValue: '0'
    });
    let modes = ['dot', 'ring'];
    modes.forEach(mode => {
        new Radio({
            appendTo: `#${mode}-state`,
            id: mode + '-sta1',
            title: 'Readonly:',
            data: data,
            faceMode: mode,
            iniValue: '0',
            readonly: true
        });
        new Radio({
            appendTo: `#${mode}-state`,
            id: mode + '-sta2',
            title: 'Disabled:',
            data: data,
            faceMode: mode,
            iniValue: '0',
            disabled: true
        });
    });
    let sizes = ['hg', 'lg', 'md', 'sm', 'xs'];
    sizes.forEach((size, i) => {
        new Radio({
            appendTo: '#dot-size',
            id: 'dot-size' + (i + 1),
            title: size + ':',
            data: data,
            sizeMode: size
        });
        new Radio({
            appendTo: '#ring-size',
            id: 'ring-size' + (i + 1),
            title: size + ':',
            data: data,
            faceMode: RadioFaceMode.ring,
            sizeMode: size
        });
    });
    [
        ColorMode.primary,
        ColorMode.secondary,
        ColorMode.light,
        ColorMode.dark,
        ColorMode.success,
        ColorMode.danger,
        ColorMode.warning,
        ColorMode.info,
        ColorMode.accent,
        ColorMode.metal
    ].forEach((color, i) => {
        new Radio({
            appendTo: '#dot-color',
            id: 'dot-color' + (i + 1),
            title: color + ':',
            data: data,
            colorMode: color,
            textColorMode: color
        });
        new Radio({
            appendTo: '#ring-color',
            id: 'ring-color' + (i + 1),
            title: color + ':',
            data: data,
            faceMode: RadioFaceMode.ring,
            colorMode: color,
            textColorMode: color
        });
    });
    new Radio({
        id: 'val1',
        title: 'Must choose medium',
        data: data,
        autoValidate: true,
        validateMode: {
            mode: 'tip',
            place: 'left'
        },
        validators: [{
                name: 'custom',
                message: 'Please choose \'medium\' !',
                validate: (val) => {
                    return val === '1';
                }
            }]
    });
    Dom.applyStyle(`
    .jsfx-radio.my-style{
        --title-color: var(--color-info);
        --text-color: blue;
        --border-color: orange;
        --checked-color: orange;
    }
    `);
    new Radio({
        id: 'cus1',
        title: 'dot mode:',
        data: data,
        cls: 'my-style'
    });
    new Radio({
        id: 'cus2',
        title: 'ring mode:',
        data: data,
        cls: 'my-style',
        faceMode: RadioFaceMode.ring
    });
});
