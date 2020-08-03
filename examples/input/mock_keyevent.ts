/// <reference path='../../dist/jsdk.d.ts' /> 
JS.imports([
    '$jsinput'
]).then(()=>{
    let fn = function(type:string, e:KeyboardEvent){
        $1('#info').innerHTML+=`<div>Event: ${type}; KeyCode: ${e.keyCode}</div>`;
        Konsole.print(e)
    }
    window.on('keydown', (e:KeyboardEvent)=>{
        fn('keydown', e)
    })
    window.on('keyup', (e:KeyboardEvent)=>{
        fn('keyup', e)
    })

    let fire = function(type:string, el:HTMLElement){
        Keyboards.fireEvent(<any>type, VK[el.attr('data-key')])
    }
    $L('button').forEach(b=>{
        b.on('mousedown', ()=>{
            fire('keydown', b)
        })
        b.on('mouseup', ()=>{
            fire('keyup', b)
        })
    })
})
