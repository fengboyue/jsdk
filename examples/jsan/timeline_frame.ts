/// <reference path='../../dist/jsdk.d.ts' /> 
JS.imports(['$jsan', '$jsmath']).then(() => {
    let R = 50, CENTER = Point2.toPoint([150, 150]), EL = $1('.a5m'),
    setXY = (el: HTMLElement, p:Point2)=>{
        el.css({
            left: p.x + 'px',
            top: p.y + 'px'
        })
    },
    anim = new Timeline({
        targets: '.a5m'
    })
    .add({
        type: 'frame',
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
        on: {
            updated: function(e, t, d) {
                let rad = - t / d * Radians.ONE_CYCLE + Math.PI,
                    p = CENTER.clone().toward(R, rad);
                setXY(EL, p);
            }
        },
        loop: true,
        duration: 2000
    })
    .add({
        type: 'frame',
        targets: '.submarine',
        frames: {
            src: '../js2d/1945.gif',
            w: 32,
            h: 98,
            items: {
                ox: 532,
                oy: 103,
                split: 1,
                axis: '-x',
                total: 6
            }
        },
        duration: 3000,
        loop: true,
        direction: 'alternate'
    }, 0)

    $1('#demo').on('click', () => {
        anim.play()
    })
})
