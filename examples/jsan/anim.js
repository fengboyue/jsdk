JS.imports('$jsan').then(() => {
    let cfg = {
        autoReverse: true,
        autoReset: true,
        easing: Easings.BACK_IN_OUT,
        duration: 5000,
        loop: 4
    };
    let anim0 = new MoveAnim(Jsons.union(cfg, {
        el: '#div0',
        frames: {
            from: { x: 0 },
            to: { x: 200 }
        }
    }));
    let anim1 = new TranslateAnim(Jsons.union(cfg, {
        el: '#div1',
        frames: {
            from: { oX: 0 },
            to: { oX: 200 }
        }
    }));
    let anim2 = new FadeAnim(Jsons.union(cfg, {
        el: '#div2',
        frames: {
            from: 1,
            to: 0
        }
    }));
    let anim3 = new GradientAnim(Jsons.union(cfg, {
        el: '#div3',
        frames: {
            from: {
                borderColor: '#fff',
                backgroundColor: '#00FF00'
            },
            to: {
                borderColor: '000',
                backgroundColor: '#1E90FF'
            }
        }
    }));
    let anim4 = new RotateAnim(Jsons.union(cfg, {
        el: '#div4',
        frames: {
            from: 45,
            to: 180
        }
    }));
    let anim5 = new RotateAnim(Jsons.union(cfg, {
        el: '#div5',
        frames: {
            from: {
                aX: 45, aY: 120, aZ: 180
            },
            to: {
                aX: 180, aY: 180, aZ: 120
            }
        }
    }));
    let anim6 = new ScaleAnim(Jsons.union(cfg, {
        el: '#div6',
        frames: {
            from: {
                sX: 1, sY: 1
            },
            to: {
                sX: 10, sY: 1.5
            }
        }
    }));
    let anim7 = new SkewAnim(Jsons.union(cfg, {
        el: '#div7',
        frames: {
            from: {
                aX: -45
            },
            to: {
                aX: 100
            }
        }
    }));
    let anim;
    $1('#btnSeq').on('click', () => {
        if (anim)
            anim.stop();
        anim = new SequentialAnim({
            anims: [anim0, anim1, anim2, anim3, anim4, anim5, anim6, anim7],
            onFinished: () => { alert('All animations finished!'); }
        });
        anim.play();
    });
    $1('#btnPar').on('click', () => {
        if (anim)
            anim.stop();
        anim = new ParallelAnim({
            anims: [anim0, anim1, anim2, anim3, anim4, anim5, anim6, anim7],
            onFinished: () => { alert('All animations finished!'); }
        });
        anim.play();
    });
    $1('#btnPause').on('click', () => {
        if (anim)
            anim.pause();
    });
    $1('#btnStop').on('click', () => {
        if (anim)
            anim.stop();
    });
});
