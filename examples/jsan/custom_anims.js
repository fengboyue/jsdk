JS.imports('$jsan').then(() => {
    let cfg = {
        autoReverse: true,
        autoReset: true,
        duration: 5000,
        loop: 4
    };
    let anim1 = new CustomAnim(Jsons.union(cfg, {
        target: '#div1',
        cycle: function (el, t) {
        }
    }));
    $1('#btn1').on('click', () => {
    });
    $1('#btn2').on('click', () => {
    });
});
