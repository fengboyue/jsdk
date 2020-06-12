JS.imports([
    '$jsfx'
]).then(() => {
    let data = [];
    for (let i = 0; i < 5; i++) {
        data.push({
            id: i + 1,
            title: `This is ${i + 1}`,
            importance: ['high', 'medium', 'low'][Random.number(2, true)],
            version: '1.0',
            status: null,
            creatorNickName: 'boyue',
            gmtCreated: '2018/01/01',
            handlerNickName: 'boyue'
        });
    }
    let cols = [
        { text: 'ID', field: 'id' },
        { text: 'TITLE', field: 'title' },
        { text: 'IMPORTANCE', field: 'importance' },
        { text: 'VERSION', field: 'version' },
        { text: 'STATUS', field: 'status' },
        { text: 'CREATOR', field: 'creatorNickName' },
        { text: 'CREATED DATE', field: 'gmtCreated' },
        { text: 'HANDLER', field: 'handlerNickName' }
    ];
    let fn = function (e, ...args) {
        Assert.true(Types.isKlass(this, Grid));
        Assert.true(Types.ofKlass(e, Event));
        JSLogger.info(this.id, e.type, args);
    };
    let grid1 = new Grid({
        id: 'grid1',
        columns: cols,
        data: data,
        height: 190,
        checkable: true,
        listeners: {
            selected: fn,
            unselected: fn,
            allselected: fn,
            allunselected: fn,
            rowclick: fn,
            cellclick: fn
        }
    });
});
