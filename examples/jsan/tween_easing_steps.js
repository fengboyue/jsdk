JS.imports('$jsan').then(() => {
    function minMax(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }
    let anim = new TweenAnim({
        keys: {
            translateX: 250
        },
        loop: 3,
        duration: 5000,
        easing: 'STEPS(5)'
    }).targets($L('.el'));
    $1('#demo').on('click', () => {
        anim.play();
    });
});
