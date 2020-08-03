/// <reference path='../../dist/jsdk.d.ts' /> 
JS.imports([
    '$jsinput'
]).then(()=>{
    $1('#btn').on('click', (e:MouseEvent)=>{
        let button = ['LEFT','MIDDLE','RIGHT'];
        $1('#info').innerHTML+=`<div>MouseButton: ${button[e.button]}</div>`;
        Konsole.print(e);
        return false
    })

    window.on('click', (e: MouseEvent)=>{
        alert('click window, mouse button:'+e.button)
    })

    $L('ul button').forEach(b=>{
        b.on('click', ()=>{
            Mouses.fireEvent('click', {
                target: $1('#btn'),
                button: Number(b.attr('data-button'))
            })
            return false
        })
    })
})
