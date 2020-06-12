JS.imports('$jsfx').then(() => {
    let fn = function (e, ...args) {
        Assert.true(Types.isKlass(this, Dialog));
        Assert.true(Types.ofKlass(e, Event));
        JSLogger.info(this.id, e.type, args);
    };
    $('#btn1').on('click', function () {
        new Dialog({
            title: 'Tpl Dialog',
            html: $('#tpl1'),
            hidden: false
        });
    });
    $('#btn2').on('click', function () {
        new Dialog({
            title: 'W3C',
            html: '<div><a href="https://www.w3.org/">W3C Website</a></div>'
        }).show();
    });
    $('#btn3').on('click', function () {
        new Dialog({
            title: 'W3C',
            url: 'https://www.w3.org/',
            hidden: false,
            width: 1200,
            height: 500
        });
    });
    $('#btn4').on('click', function () {
        new Dialog({
            title: 'W3C',
            url: 'https://www.w3.org/',
            buttons: [{
                    text: 'Button1',
                    colorMode: ColorMode.danger,
                    onClick: fn
                }, {
                    text: 'Button2',
                    onClick: fn
                }]
        }).show();
    });
    $('#btn5').on('click', function () {
        new Dialog({
            html: '<div id="textinput1" jsfx-alias="textinput"></div>',
            childWidgets: {
                textinput1: {
                    colorMode: ColorMode.primary,
                    placeholder: 'input something'
                }
            },
            buttons: [{
                    text: 'Close',
                    colorMode: ColorMode.light
                }]
        }).show();
    });
    $('#btn-round').on('click', function () {
        new Dialog({
            title: 'Round Dialog',
            html: $('#tpl1'),
            hidden: false,
            faceMode: DialogFaceMode.round
        });
    });
    $('#btn-square').on('click', function () {
        new Dialog({
            title: 'Square Dialog',
            html: $('#tpl1'),
            hidden: false
        });
    });
    let dialog = new Dialog({
        html: '<div><div>Press "esc" to close the dialog.</div><div>See web console for events logs.</div></div>',
        autoDestroy: false,
        listeners: {
            'showing': fn,
            'shown': fn,
            'hiding': fn,
            'hidden': fn
        }
    });
    $('#btn6').on('click', function () {
        dialog.show();
    });
});
