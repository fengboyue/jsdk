JS.imports([
    '$jsfx.sider'
]).then(() => {
    let fn = function (e, ...args) {
        Assert.true(Types.ofKlass(e, Event));
        JSLogger.info(this.id, e.type, args);
    };
    let lay1 = new Sider({
        title: 'LoadHtml Demo',
        html: '<div>This is a HTML demo.</div>'
    });
    $('#btn1').click(() => {
        lay1.toggle();
    });
    let lay2 = new Sider({
        title: 'LoadUrl Demo',
        place: 'right',
        width: 800,
        url: 'inner.html',
        listeners: {
            'closing': fn,
            'closed': fn,
            'loaded': function (e, fWindow) {
                fWindow.$('#txt1 input').val('value from parent');
            }
        }
    });
    $('#btn2').click(() => {
        lay2.toggle();
    });
});
