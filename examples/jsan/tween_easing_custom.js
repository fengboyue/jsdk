JS.imports('$jsan').then(() => {
    function minMax(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }
    let anim = new TweenAnim({
        keys: {
            translateX: 250
        },
        loop: 3,
        duration: 2000,
        easing: (el, i, total) => {
            return (t, b, c, d) => {
                return ((i + 1) / total) * c * Math.sin(t / d * (Math.PI / 2)) + b;
            };
        }
    }).targets($L('.el'));
    $1('#demo').on('click', () => {
        anim.play();
    });
});
