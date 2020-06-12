/// <reference path="../../../dist/jsdk.d.ts" /> 
JS.imports([
    '$jsvp',
    '$jsfx'
]).then(() => {
    new TextInput({
        id:'txt1'
    })
    new Button({
        id: 'btn1',
        text:'Close Me'
    }).on('click', ()=>{
        Page.fireEvent<PageEvents>('close', ['data from inner.html'])
    })  
})