JS.imports('$jsan').then(() => {
    let el = $1('.el-01'), anim = new TweenAnim({
        keys: {
            translateX: 250
        }
    }).targets([el, '.el-02', '.el-03']);
    $1('#demo').on('click', () => {
        anim.play();
    });
});
