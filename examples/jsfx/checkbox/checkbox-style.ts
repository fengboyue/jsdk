/// <reference path="../../../dist/jsdk.d.ts" /> 
JS.imports('$jsfx').then(() => {
    new Checkbox({
        id: 'txt1',
        data: [{
            id: '0'
        }]
    })
    new Checkbox({
        id: 'txt2',
        data: [{
            id: '0'
        }, {
            id: '1'
        }, {
            id: '2'
        }]
    })


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

    new Checkbox({
        id: 'lay1',
        title: 'Left title + Inline Layout:',
        data: data
    })
    new Checkbox({
        id: 'lay2',
        title: 'Left title + List Layout:',
        data: data,
        faceMode: CheckboxFaceMode.list
    })
    new Checkbox({
        id: 'lay3',
        title: 'Top title + Inline Layout:',
        titlePlace: 'top',
        titleTextPlace: 'lb',
        data: data
    })
    new Checkbox({
        id: 'lay4',
        title: 'Top title + List Layout:',
        titlePlace: 'top',
        titleTextPlace: 'lb',
        data: data,
        faceMode: CheckboxFaceMode.list
    })

    new Checkbox({
        id: 'fac1',
        title: 'Square:',
        faceMode: CheckboxFaceMode.square,
        data: data
    })
    new Checkbox({
        id: 'fac2',
        title: 'Round:',
        faceMode: CheckboxFaceMode.round,
        data: data
    })

    new Checkbox({
        id: 'sta1',
        title: 'Readonly:',
        data: data,
        iniValue: ['0'],
        readonly: true
    })
    new Checkbox({
        id: 'sta2',
        title: 'Disabled:',
        data: data,
        iniValue: ['0'],
        disabled: true
    });

    ['hg', 'lg', 'md', 'sm', 'xs'].forEach((size, i) => {
        new Checkbox({
            id: 'size' + (i + 1),
            title: size + ':',
            data: data,
            sizeMode: <any>size
        })
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
        ColorMode.metal,
    ].forEach((color, i) => {
        new Checkbox({
            id: 'sty' + (i + 1),
            title: color + ':',
            data: data,
            colorMode: color,
            textColorMode: color
        })
    });

    new Checkbox({
        id: 'val1',
        title: 'Must choose medium',
        data: data,
        autoValidate: true,
        validateMode: {
            mode:'tip',
            place:'left'
        },
        validators: [{
            name: 'custom',
            message: 'Please choose \'medium\' !',
            validate: (val: string[])=>{
                return val && val.findIndex((v)=>{return v=='1'}) > -1;
            }
        }]
    })

    Dom.applyStyle(`
    .jsfx-checkbox.my-style{
        --title-color: var(--color-info);
        --text-color: blue;
        --border-color: orange;
        --checked-color: orange;
    }
    `);
    new Checkbox({
        id: 'cus1',
        title: 'MyColor:',
        data: data,
        cls: 'my-style'
    })

})    