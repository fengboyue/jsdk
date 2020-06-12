JS.imports([
    '$jsfx.select'
]).then(() => {
    let fn = function (e, ...args) {
        Assert.true(Types.isKlass(this, Select));
        Assert.true(Types.ofKlass(e, Event));
        JSLogger.info(this, e.type, args);
    };
    let data = [{
            id: '1',
            text: '111'
        }, {
            id: '2',
            text: '222'
        }, {
            id: '3',
            text: '333'
        }];
    let v1 = new Select({
        id: 'v1',
        data: data,
        listeners: {
            changed: fn
        }
    });
    $('#v1-btn1').click(() => {
        v1.value('1');
    });
    $('#v1-btn2').click(() => {
        v1.value(null);
    });
    let v2 = new Select({
        id: 'v2',
        data: data,
        multiple: true,
        listeners: {
            changed: fn
        }
    });
    $('#v2-btn1').click(() => {
        v2.value(['2', '3']);
    });
    $('#v2-btn2').click(() => {
        v2.value(null);
    });
    new Select({
        id: 's1',
        data: data,
        listeners: {
            selected: fn
        }
    });
    new Select({
        id: 's2',
        data: data,
        multiple: true,
        listeners: {
            selected: fn
        }
    });
    new Select({
        id: 'u1',
        data: data,
        multiple: true,
        listeners: {
            unselected: fn
        }
    });
});
