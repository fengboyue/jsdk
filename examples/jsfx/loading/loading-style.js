JS.imports('$jsfx.loading').then(() => {
    let rad1 = new Radio({
        id: 'rad1',
        iniValue: 'div1',
        data: [{
                id: 'div1',
                text: 'Div1'
            }, {
                id: 'body',
                text: 'Body'
            }]
    }), newCfg = function (cfg) {
        return Jsons.union({
            renderTo: rad1.value() == 'div1' ? '#div1' : null,
            message: 'Just a moment...',
            duration: 0
        }, cfg);
    };
    $('#face1').click(() => {
        Loading.show(newCfg({
            faceMode: LoadingFaceMode.flower
        }));
    });
    $('#face2').click(() => {
        Loading.show(newCfg({
            faceMode: LoadingFaceMode.ring
        }));
    });
    $('#face3').click(() => {
        Loading.show(newCfg({
            faceMode: LoadingFaceMode.bar
        }));
    });
    $('#col1').click(() => {
        Loading.show(newCfg({
            faceMode: LoadingFaceMode.flower,
            colorMode: ColorMode.danger
        }));
    });
    $('#col2').click(() => {
        Loading.show(newCfg({
            faceMode: LoadingFaceMode.ring,
            colorMode: ColorMode.danger
        }));
    });
    $('#col3').click(() => {
        Loading.show(newCfg({
            faceMode: LoadingFaceMode.bar,
            colorMode: ColorMode.danger
        }));
    });
    ['hg', 'lg', 'md', 'sm', 'xs'].forEach(size => {
        $('#sizes').append('<div>' + size + '</div>');
        new Button({
            appendTo: '#sizes',
            text: 'flower'
        }).on('click', () => {
            Loading.show(newCfg({
                faceMode: LoadingFaceMode.flower,
                sizeMode: size
            }));
        });
        new Button({
            appendTo: '#sizes',
            text: 'ring'
        }).on('click', () => {
            Loading.show(newCfg({
                faceMode: LoadingFaceMode.ring,
                sizeMode: size
            }));
        });
        new Button({
            appendTo: '#sizes',
            text: 'bar'
        }).on('click', () => {
            Loading.show(newCfg({
                faceMode: LoadingFaceMode.bar,
                sizeMode: size
            }));
        });
    });
    $('#wid1').click(() => {
        Loading.show(newCfg({
            faceMode: LoadingFaceMode.flower,
            width: 300
        }));
    });
    $('#wid2').click(() => {
        Loading.show(newCfg({
            faceMode: LoadingFaceMode.ring,
            width: 300
        }));
    });
    $('#wid3').click(() => {
        Loading.show(newCfg({
            faceMode: LoadingFaceMode.bar,
            width: 300
        }));
    });
    $('#ovy1').click(() => {
        Loading.show(newCfg({
            faceMode: LoadingFaceMode.flower,
            overlay: false
        }));
    });
    $('#ovy2').click(() => {
        Loading.show(newCfg({
            faceMode: LoadingFaceMode.ring,
            overlay: false
        }));
    });
    $('#ovy3').click(() => {
        Loading.show(newCfg({
            faceMode: LoadingFaceMode.bar,
            overlay: false
        }));
    });
    Dom.applyStyle(`
    .jsfx-loading.my-flower,
    .jsfx-loading.my-ring
    .jsfx-loading.my-bar{
        --color: orange;
    }`);
    $('#css1').click(() => {
        Loading.show(newCfg({
            faceMode: LoadingFaceMode.flower,
            cls: 'my-flower'
        }));
    });
    $('#css2').click(() => {
        Loading.show(newCfg({
            faceMode: LoadingFaceMode.ring,
            cls: 'my-ring'
        }));
    });
    $('#css3').click(() => {
        Loading.show(newCfg({
            faceMode: LoadingFaceMode.bar,
            cls: 'my-bar'
        }));
    });
});
