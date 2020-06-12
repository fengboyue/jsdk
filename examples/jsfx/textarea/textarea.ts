/// <reference path="../../../dist/jsdk.d.ts" /> 
JS.imports('$jsfx').then(() => {
    ['hg','lg','md','sm','xs'].forEach((v, i)=>{
        new TextArea({
            id:'size'+i,
            appendTo: '#sizes',
            title:v,
            titlePlace:'top',
            sizeMode:<any>v
        })
    })

    new TextArea({
        id:'resize1',
        title:'Resize = both',
        titlePlace:'top',
        resize:'both'
    })

    new TextArea({
        id:'txt4',
        title:'Square:',
        titlePlace:'top'
    })
    new TextArea({
        id:'txt5',
        title:'Round:',
        titlePlace:'top',
        faceMode:RowsInputFaceMode.round
    })
    new TextArea({
        id:'txt6',
        title:'Shadow:',
        titlePlace:'top',
        faceMode:[RowsInputFaceMode.shadow,RowsInputFaceMode.round]
    })

    new TextArea({
        id:'txt7',
        title:'Readonly:',
        titlePlace:'top',
        iniValue:'123456',
        readonly:true
    })
    new TextArea({
        id:'txt8',
        title:'Disabled:',
        titlePlace:'top',
        iniValue:'123456',
        disabled:true
    })

    new TextArea({
        id:'txt9',
        title:'Focus/Success:',
        titlePlace:'top',
        colorMode:ColorMode.success
    })
    new TextArea({
        id:'txt10',
        title:'Outline/Success:',
        titlePlace:'top',
        colorMode:ColorMode.success,
        outline:true
    })

    new TextArea({
        id:'txt11',
        title:'Allow empty && Length limits in [5,10]',
        titlePlace:'top',
        maxlength:10,
        validateMode: {
            mode:'tip',
            place:'top'
        },
        autoValidate:true,
        validators:[
        {
            name: 'length',
            short:5,
            long:10,
            tooShortMessage:'Must >=5 chars!',
            tooLongMessage:'Must <=10 chars!'
        }]
    })


    new TextArea({
        id:'txt12',
        title:'Maxlength=20',
        titlePlace:'top',
        maxlength:20,
        iniValue: '012345678901234567890',
        counter:{
            tpl:'Input {length} chars/Max chars is {maxLength}'
        }
    })

    Dom.applyStyle(
        `.jsfx-textarea.red {
            --title-color: red;
            --color: blue;
            --bdcolor: black;
            --focus-bdcolor: red;
        }`);
    new TextArea({
        id:'cus1',
        title:'RED:',
        cls:'red'
    })
})    