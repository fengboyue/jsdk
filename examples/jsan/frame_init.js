JS.imports('$jsan').then(() => {
    let anim1 = new FrameAnim({
        frames: {
            src: '../js2d/1945.gif',
            w: 65,
            h: 65,
            items: {
                ox: 4,
                oy: 400,
                split: 1,
                axis: 'x',
                total: 3
            }
        },
        duration: 200,
        loop: true
    }).targets('.p38'), anim2 = new FrameAnim({
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
        autoreset: true,
        direction: 'backward'
    }).targets('.a5m');
    $1('#demo').on('click', () => {
        anim1.play();
        anim2.play();
    });
});
