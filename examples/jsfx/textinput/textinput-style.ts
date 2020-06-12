/// <reference path='../../../dist/jsdk.d.ts' /> 
JS.imports('$jsfx').then(() => {
    new TextInput({
        id: 'txt1',
        placeholder: 'Text right align',
        textAlign: 'right'
    })
    new TextInput({
        id: 'txt2',
        placeholder: 'Maxlength is 6',
        maxlength: 6
    })
    new TextInput({
        id: 'txt3',
        placeholder: 'Dont show clear icon when not empty',
        autoclear: false
    })

    new TextInput({
        id: 'cap1',
        placeholder: 'No title'
    })
    new TextInput({
        id: 'cap2',
        placeholder: 'title at left align',
        title: 'Top title:',
        titlePlace: 'top',
        titleTextPlace: 'lm'
    })
    new TextInput({
        id: 'cap3',
        placeholder: 'title at right align',
        title: 'Top title:',
        titlePlace: 'top',
        titleTextPlace: 'rm'
    })
    new TextInput({
        id: 'cap4',
        placeholder: 'title at right align/middle valign',
        title: 'Fixed title Width:',
        titleTextPlace: 'rm',
        titleStyle: 'width:150px;'
    })
    new TextInput({
        id: 'cap5',
        placeholder: 'title at center align/top valign',
        title: 'Fixed title Width:',
        titleTextPlace: 'ct',
        titleStyle: 'width:150px;'
    })
    new TextInput({
        id: 'cap6',
        placeholder: 'Fixed input width',
        title: 'Top title:',
        titlePlace: 'top',
        titleTextPlace: 'lm',
        width: 200
    })
    new TextInput({
        id: 'cap7',
        placeholder: 'Fixed input width',
        title: 'Left title:',
        titlePlace: 'left',
        titleTextPlace: 'rm',
        width: 200
    })
    new TextInput({
        id: 'cap8',
        placeholder: 'Custom title Style',
        title: 'Custom title:',
        titlePlace: 'top',
        titleStyle: 'color: red;'
    })
    

    let colors = [
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
    ];

    colors.forEach((color, i) => {
        new TextInput({
            id: 'col' + i,
            appendTo: '#colors',
            title: color,
            colorMode: color
        });
    });
    colors.forEach((color, i) => {
        new TextInput({
            id: 'bor' + i,
            appendTo: '#borders',
            title: color,
            colorMode: color,
            outline: true
        });
    });

    new TextInput({
        id: 'sta1',
        iniValue: 'Disabled',
        title: 'Disabled',
        disabled: true
    })
    new TextInput({
        id: 'sta2',
        iniValue: 'Readonly',
        title: 'Readonly',
        readonly: true
    })

    new TextInput({
        id: 'face1',
        placeholder: 'Square'
    })
    new TextInput({
        id: 'face2',
        placeholder: 'Round',
        faceMode: LineInputFaceMode.round
    })
    new TextInput({
        id: 'face3',
        placeholder: 'Pill',
        faceMode: LineInputFaceMode.pill
    })
    new TextInput({
        id: 'face4',
        placeholder: 'Shadow',
        faceMode: LineInputFaceMode.shadow
    })

    let sizes = ['hg','lg','md','sm','xs'];
    sizes.forEach((v,i)=>{
        new TextInput({
            id: 'size'+i,
            appendTo :'#sizes',
            iniValue: v,
            title: v,
            titlePlace: 'top',
            sizeMode: <any>v,
            innerIcon: 'la la-tag'
        })

        new TextInput({
            id: 'size_addon'+i,
            appendTo :'#sizes',
            iniValue: v,
            title: v,
            titlePlace: 'top',
            sizeMode: <any>v,
            innerIcon: 'la la-tag',
            leftAddon: 'left',
            rightAddon: 'right'
        })
    })

    new TextInput({
        id: 't1',
        placeholder: 'Text Right Align',
        innerIcon: 'la la-tag',
        textAlign: 'right'
    })
    new TextInput({
        id: 't2',
        faceMode: [LineInputFaceMode.square],
        leftAddon: {
            colorMode: ColorMode.info,
            text: 'Left Addon'
        },
        rightAddon: {
            colorMode: ColorMode.accent,
            text: 'Right Addon'
        }
    })
    new TextInput({
        id: 't3',
        autoclear: true,
        faceMode: [LineInputFaceMode.shadow],
        leftAddon: 'Left Addon',
        rightAddon: 'Right Addon',
        innerIcon: 'la la-tag'
    })
    new TextInput({
        id: 't4',
        autoclear: true,
        colorMode: ColorMode.info,
        outline: true,
        faceMode: [LineInputFaceMode.shadow, LineInputFaceMode.pill],
        leftAddon: {
            colorMode: ColorMode.info,
            outline: true,
            text: 'Left Addon(Click Me)',
            onClick: () => { alert('LEFT') }
        },
        rightAddon: {
            colorMode: ColorMode.accent,
            outline: true,
            text: 'Right Addon(Click Me)',
            onClick: () => { alert('RIGHT') }
        },
        innerIcon: {
            cls: 'la la-tag',
            tip: 'this is Icon',
            onClick: () => { alert('I\'m an icon of INPUT') }
        }
    })

    new TextInput({
        id: 't5',
        autoclear: true,
        colorMode: ColorMode.info,
        faceMode: [LineInputFaceMode.shadow, LineInputFaceMode.pill],
        leftAddon: 'Left Addon',
        rightAddon: {
            colorMode: ColorMode.accent,
            text: 'JSDK Dropdown',
            dropMenu: {
                dir: 'right',
                items: [{
                    caption: 'Utils',
                    text: 'JS.util.Arrays'
                }, {
                    text: 'JS.util.Jsons'
                }, {
                    hasDivider: true,
                    text: 'JS.util.Dates'
                }, {
                    caption: 'JSFX',
                    text: 'JS.fx.Button'
                }, {
                    text: 'JS.fx.TextInput'
                }, {
                    text: 'JS.fx.Label'
                }]
            }
        }
    })

    new TextInput({
        id: 't6',
        autoclear: true,
        colorMode: ColorMode.info,
        faceMode: [LineInputFaceMode.shadow, LineInputFaceMode.round],
        leftAddon: {
            colorMode: ColorMode.success,
            text: 'JSDK Dropdown',
            dropMenu: {
                dir: 'left',
                items: [{
                    caption: 'Utils',
                    text: 'JS.util.Arrays'
                }, {
                    text: 'JS.util.Jsons'
                }, {
                    hasDivider: true,
                    text: 'JS.util.Dates'
                }, {
                    caption: 'JSFX',
                    text: 'JS.fx.Button'
                }, {
                    text: 'JS.fx.TextInput'
                }, {
                    text: 'JS.fx.Label'
                }]
            }
        },
        rightAddon: {
            colorMode: ColorMode.accent,
            text: 'Right Addon'
        }
    })

    new TextInput({
        id: 'v1',
        autoValidate: true,
        validators: [{
            name: 'required',
            message: 'Must not be Empty!'
        },{
            name: 'custom',
            message: 'Must is 123!',
            validate: (val)=>{
                return val=='123'
            }
        }],
        validateMode: {
            showError: (msg)=>{
                $('#error').html(msg)
            },
            hideError: ()=>{
                $('#error').html('')
            }
        }
    })

    new TextInput({
        id: 'txt4',
        placeholder: 'custom style',
        inputStyle: 'background-color: var(--color-success);color: white;',
        inputCls: 'placeholder'
    })
    new TextInput({
        id: 'txt5',
        placeholder: 'custom class',
        inputCls: 'custom-cls placeholder-focus'
    })

    Dom.applyStyle(
        `.jsfx-textinput.red {
            --title-color: red;
            --color: blue;
            --bdcolor: black;
            --focus-bdcolor: red;
        }`);
    new TextInput({
        id:'cus1',
        title:'RED:',
        cls:'red'
    })

})    