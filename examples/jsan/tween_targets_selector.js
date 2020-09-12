JS.imports('$jsan').then(() => {
    let anim = new TweenAnim({
        keys: {
            translateX: 250
        }
    }).targets('.el');
    $1('#demo').on('click', () => {
        anim.play();
    });
});
