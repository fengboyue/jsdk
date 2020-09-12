/// <reference path='../../dist/jsdk.d.ts' /> 
JS.imports('$jsan').then(() => {
    let anim = new TweenAnim({
        keys: {
            left: '+=250',
            backgroundColor: ['#FFF', '#D2691E'],
            scale: function (el, i, l) {
                return (l - i) / l * 1.25
            },
            translateY: function (el, i) {
                return 50 * i
            },
            rotate: function(el, i) { return 360 * ++i }
        },
        direction: 'alternate',
        loop: true,
        duration: 1500,
        easing: 'EXPO_IN_OUT'
    }).targets($L('.el'));
    $1('#demo').on('click', () => {
        anim.play()
    })
})
