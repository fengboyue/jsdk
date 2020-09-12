JS.imports('$jsan').then(() => {
    let anim = new TweenAnim({
        keys: {
            value: [0, 1000]
        },
        round: 0
    }).targets('.el');
    $1('#demo').on('click', () => {
        anim.play();
    });
});
