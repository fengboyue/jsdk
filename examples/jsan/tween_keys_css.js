JS.imports('$jsan').then(() => {
    let anim = new TweenAnim({
        keys: {
            left: 250,
            borderRadius: ['0%', '50%'],
            backgroundColor: '#FFF'
        }
    }).targets('.el');
    $1('#demo').on('click', () => {
        anim.play();
    });
});
