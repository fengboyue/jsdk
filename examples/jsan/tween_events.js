JS.imports('$jsan').then(() => {
    let anim = new TweenAnim({
        keys: {
            translateX: 250
        },
        direction: 'alternate',
        loop: true,
        duration: 10000
    }).targets($L('.el')).on('updated', (e, t, d, i) => {
        $1('.label').innerHTML = `loop: ${i}, progress: ${Number(t / d * 100).round(0)}%`;
    }).on('paused', () => {
        $1('.label').innerHTML += ' PAUSING...';
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
});
