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
    let data1 = new Grid({
        id: 'data1',
        columns: cols,
        height: 190
    });
    $('#data1-btn1').click(() => {
        JSLogger.info(data1.data());
    });
    $('#data1-btn2').click(() => {
        data1.data(data);
    });
    $('#data1-btn3').click(() => {
        data1.clear();
    });
    let data2 = new Grid({
        id: 'data2',
        columns: cols,
        height: 190,
        pagingBar: true
    });
    $('#data2-btn1').click(() => {
        data2.load('data.json');
    });
    $('#data2-btn2').click(() => {
        data2.reload();
    });
    $('#data2-btn3').click(() => {
        data2.loadPage(2);
    });
    new Grid({
        id: 'sort1',
        columns: [
            { text: 'ID', field: 'id', sortable: 'asc' },
            { text: 'TITLE', field: 'title', sortable: true },
            { text: 'IMPORTANCE', field: 'importance' },
            { text: 'VERSION', field: 'version' },
            { text: 'STATUS', field: 'status' },
            { text: 'CREATOR', field: 'creatorNickName' },
            { text: 'CREATED DATE', field: 'gmtCreated' },
            { text: 'HANDLER', field: 'handlerNickName' }
        ],
        height: 190,
        dataQuery: 'data.json',
        pagingBar: true,
        checkable: true
    });
    let col1 = new Grid({
        id: 'col1',
        columns: cols,
        height: 190,
        dataQuery: 'data.json'
    });
    $('#col1-btn1').click(() => {
        col1.hideColumn(1);
    });
    $('#col1-btn2').click(() => {
        col1.showColumn(1);
    });
    let chk1 = new Grid({
        id: 'chk1',
        columns: cols,
        height: 190,
        dataQuery: 'data.json',
        checkable: true
    });
    $('#chk1-btn1').click(() => {
        chk1.hideCheckbox();
    });
    $('#chk1-btn2').click(() => {
        chk1.showCheckbox();
    });
    let sel1 = new Grid({
        id: 'sel1',
        columns: cols,
        height: 190,
        dataQuery: 'data.json',
        checkable: true
    });
    $('#sel1-btn1').click(() => {
        sel1.select(0);
    });
    $('#sel1-btn2').click(() => {
        sel1.unselect(0);
    });
    $('#sel1-btn3').click(() => {
        JSLogger.info(sel1.getSelectedData());
    });
    $('#sel1-btn4').click(() => {
        JSLogger.info(sel1.getSelectedIds());
    });
});
