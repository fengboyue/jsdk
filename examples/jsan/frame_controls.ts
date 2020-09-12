/// <reference path='../../dist/jsdk.d.ts' /> 
JS.imports('$jsan').then(() => {
    let anim = new FrameAnim({
        frames: {
            src: '../js2d/1945.gif',
            w: 32,
            h: 32,
            items: {
                ox: 4,
                oy: 4,
                split: 1,
                axis: 'x',
                total: 8
            }
        },
        duration: 2000,
        loop: true,
        autoreset: true
    }).targets('.a5m');
    
    $1('#demo').on('click', () => {
        anim.play()
    })
    $1('.play').on('click', () => {
        anim.play();
        return false
    })
    $1('.pause').on('click', () => {
        anim.pause();
        return false
    })
    $1('.stop').on('click', () => {
        anim.stop();
        return false
    })
    $1('.replay').on('click', () => {
        anim.replay();
        return false
    })
})
