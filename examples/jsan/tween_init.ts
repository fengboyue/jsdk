/// <reference path='../../dist/jsdk.d.ts' /> 
JS.imports('$jsan').then(() => {
    let anim = new TweenAnim({
        keys: {
            translateX: 250
        },
        duration: 1000,
        delay: 500,
        endDelay: 500,
        direction: 'alternate',
        loop: true,
        autoreset: true,
        easing: 'BACK_IN_OUT'
    }).targets($L('.el'));
    $1('#demo').on('click',()=>{
        anim.play()
    })
})
