/// <reference path="../../../dist/jsdk.d.ts" /> 
JS.imports([
    '$jsfx.select'
]).then(() => {
    let data = [{
        id: '1',
        text: 'large'
    },{
        id: '2',
        text: 'medium'
    },{
        id: '3',
        text: 'small'
    }];

    let v1 = new Select({
        id: 'v1',
        data: data
    }) 
    $('#v1-btn1').click(()=>{
        Konsole.print(v1.value())
    })
    $('#v1-btn2').click(()=>{
        v1.value('1')
    })
    $('#v1-btn3').click(()=>{
        v1.value(null)
    })

    let v2 = new Select({
        id: 'v2',
        data: data,
        multiple:true
    }) 
    $('#v2-btn1').click(()=>{
        Konsole.print(v2.value())
    })
    $('#v2-btn2').click(()=>{
        v2.value(['2','3'])
    })
    $('#v2-btn3').click(()=>{
        v2.value(null)
    })

    let d1 = new Select({
        id: 'd1'
    }) 
    $('#d1-btn1').click(()=>{
        Konsole.print(d1.data())
    })
    $('#d1-btn2').click(()=>{
        d1.data(data)
    })
    $('#d1-btn3').click(()=>{
        d1.load('data.json')
    })

    let d2 = new Select({
        id: 'd2',
        multiple: true
    }) 
    $('#d2-btn1').click(()=>{
        Konsole.print(d2.data())
    })
    $('#d2-btn2').click(()=>{
        d2.data(data)
    })
    $('#d2-btn3').click(()=>{
        d2.load('data.json')
    })


    let crud1 = new Select({
        id: 'crud1',
        multiple: true,
        data: data, 
        iniValue: ['1','3']
    }) 
    $('#crud1-btn1').click(()=>{
        Konsole.print(crud1.value())
    })
    $('#crud1-btn2').click(()=>{
        Konsole.print(crud1.crudValue())
    })

    new Select({
        id: 'val1',
        title: 'Must choose medium',
        data: data,
        autoSelectFirst: true,
        autoValidate: true,
        validateMode: {
            mode: 'tip',
            place: 'right'
        },
        validators: [{
            name: 'custom',
            message: 'Please choose \'medium\' !',
            validate: (val: string) => {
                return val === '2';
            }
        }]
    })

})