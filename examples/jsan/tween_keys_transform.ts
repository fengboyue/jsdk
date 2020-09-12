/// <reference path='../../dist/jsdk.d.ts' /> 
JS.imports('$jsan').then(() => {
    let anim = new TweenAnim({
        keys: {
            translateX: 250,
            scale: 2,
            rotate: '1turn'
        },
        easing: 'BACK_IN_OUT'
    }).targets('.el');
    $1('#demo').on('click', () => {
        anim.play()
    })
})
