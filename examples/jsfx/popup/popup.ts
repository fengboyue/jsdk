/// <reference path="../../../dist/jsdk.d.ts" /> 
JS.imports('$jsfx').then(() => {
    let fn = function (e: Event, ...args) {
        Assert.true(Types.isKlass(this, Popup));
        Assert.true(Types.ofKlass(e, Event));
        JSLogger.info(this.id, e.type, args);
    }

    let btn1 = new Button({
        id:'btn1',
        text:'Click Me'
    })
    let pop1 = new Popup({
        target: btn1.widgetEl.find('button'),
        trigger: 'click',
        title:'Popup click',
        content: $('#pop1').html()
    })

    let btn2 = new Button({
        id:'btn2',
        text:'Hover Me'
    })
    new Popup({
        target: btn2.widgetEl.find('button'),
        trigger: 'hover',
        title:'Popup hover',
        content: $('#pop1').html()
    })

    let ipt1 = new TextInput({
        id:'ipt1',
        placeholder:'Focus in'
    })
    new Popup({
        target: $('#'+ipt1.id+' input'),
        trigger: 'focus',
        title:'Popup focus',
        content: $('#pop1').html()
    })

    $('#b1').click(()=>{
        alert('Popup 1 '+(pop1.isShown()?'is':'is not')+' shown')
    })
})