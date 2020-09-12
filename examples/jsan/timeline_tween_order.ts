/// <reference path='../../dist/jsdk.d.ts' /> 
JS.imports('$jsan').then(() => {
    let anim = new Timeline({
        targets: '.el'
    })
    .add({
        type: 'tween',
        keys: { top: '-=25' }
    })
    .add({
        type: 'tween',
        keys: { left: '+=250' }
    })
    .add({
        type: 'tween',
        keys: { top: '+=50' }
    })
    .add({
        type: 'tween',
        keys: { left: '-=250' }
    })
    .add({
        type: 'tween',
        keys: { top: '-=25' }
    })

    $1('#demo').on('click', () => {
        anim.play()
    })
})
