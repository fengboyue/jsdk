JS.imports('$jsan').then(() => {
    let anim = new TweenAnim({
        keys: {
            translateX: function (el, i) {
                return 100 * (i + 1);
            }
        },
        direction: 'alternate',
        loop: true,
        duration: 3000
    }).targets($L('.el')).on('updating', (e, t, d, i) => {
        Konsole.print(t / d, i);
    }).on('pausing', () => {
        Konsole.print('PAUSING...');
    });
    $1('#demo').on('click', () => {
        anim.play();
    });
    $1('.play').on('click', () => {
        anim.play();
        return false;
    });
    $1('.pause').on('click', () => {
        anim.pause();
        return false;
    });
    $1('.stop').on('click', () => {
        anim.stop();
        return false;
    });
    $1('.replay').on('click', () => {
        anim.replay();
        return false;
    });
});
