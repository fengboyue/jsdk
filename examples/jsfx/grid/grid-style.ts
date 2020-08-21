/// <reference path="../../../dist/jsdk.d.ts" /> 
JS.imports([
    '$jsfx'
]).then(() => {

    let data = [];
    for (let i = 0; i < 5; i++) {
        data.push({
            id: i + 1,
            title: `This is ${i + 1}`,
            importance: ['high','medium','low'][Random.number(2,true)],
            version: '1.0',
            status: null,
            creatorNickName: 'boyue',
            gmtCreated: '2018/01/01',
            handlerNickName: 'boyue'
        })
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
    new Grid({
        id: 'w1',
        data: data,
        columns: cols,
        width: 700
    });

    new Grid({
        id: 'w2',
        data: data,
        columns: [
            { text: 'ID', field: 'id', width: 30 },
            { text: 'TITLE', field: 'title', width: 120 },
            { text: 'IMPORTANCE', field: 'importance', width: 110 },
            { text: 'VERSION', field: 'version', width: 90 },
            { text: 'STATUS', field: 'status', width: 90 },
            { text: 'CREATOR', field: 'creatorNickName', width: 100 },
            { text: 'CREATED DATE', field: 'gmtCreated', width: 150 },
            { text: 'HANDLER', field: 'handlerNickName', width: 100 }
        ],
        width: 700
    });

    new Grid({
        id: 'w3',
        data: data,
        columns: [
            { text: 'ID', field: 'id', width: 30 },
            { text: 'TITLE', field: 'title'},
            { text: 'IMPORTANCE', field: 'importance', width: 110 },
            { text: 'VERSION', field: 'version', width: 90 },
            { text: 'STATUS', field: 'status'},
            { text: 'CREATOR', field: 'creatorNickName', width: 100 },
            { text: 'CREATED DATE', field: 'gmtCreated', width: 150 },
            { text: 'HANDLER', field: 'handlerNickName', width: 100 }
        ],
        width: 700
    });

    new Grid({
        id: 's1',
        data: data,
        columns: cols
    });
    new Grid({
        id: 's2',
        data: data,
        columns: cols,
        width: 500,
        height: 150
    });

    new Grid({
        id: 'a1',
        data: data,
        columns: cols,
        faceMode: GridFaceMode.inline,
        headStyle:{
            textAlign:'left'
        },
        bodyStyle: {
            textAlign:'left'
        }
    });
    new Grid({
        id: 'a2',
        data: data,
        columns: cols,
        faceMode: GridFaceMode.inline,
        headStyle:{
            textAlign:'center'
        },
        bodyStyle: {
            textAlign:'center'
        }
    });
    new Grid({
        id: 'a3',
        data: data,
        columns: cols,
        faceMode: GridFaceMode.inline,
        headStyle:{
            textAlign:'right'
        },
        bodyStyle: {
            textAlign:'right'
        }
    });

    let sizes:SizeMode[] = <any>['hg','lg','md','sm','xs'];
    sizes.forEach((size, i) => {
        $('#sizes').append(`<div>${size.toString()}</div>`);
        new Grid({
            id: 'size' + i,
            appendTo: '#sizes',
            data: data,
            columns: cols,
            sizeMode: size,
            faceMode: [GridFaceMode.inline, GridFaceMode.outline, GridFaceMode.striped],
            pagingBar: true,
            checkable: true
        });
    })

    let faces = [
        GridFaceMode.striped,
        GridFaceMode.outline,
        GridFaceMode.inline,
        [GridFaceMode.outline, GridFaceMode.inline]
    ];

    faces.forEach((f, i) => {
        $('#faces').append(`<div>${f.toString()}</div>`);
        new Grid({
            id: 'face' + i,
            appendTo: '#faces',
            data: data,
            columns: cols,
            faceMode: f,
            pagingBar: true,
            checkable: true
        });
    })

    let colors = [
        ColorMode.success,
        ColorMode.danger,
        ColorMode.warning,
        ColorMode.info,
        ColorMode.primary,
        ColorMode.secondary,
        ColorMode.accent,
        ColorMode.metal,
        ColorMode.light,
        ColorMode.dark
    ];

    colors.forEach((c, i) => {
        $('#colors').append(`<div>${c}</div>`);
        new Grid({
            id: 'col' + i,
            appendTo: '#colors',
            data: data,
            columns: cols,
            colorMode: c,
            faceMode: [GridFaceMode.inline, GridFaceMode.outline, GridFaceMode.striped],
            pagingBar: true,
            checkable: true
        });
    })

    new Grid({
        id: 'cell1',
        columns: [
            { text: 'ID', field: 'id' },
            { text: 'TITLE', field: 'title' },
            {
                text: 'IMPORTANCE*', field: 'importance', width:70,
                renderer: function (val, col, row) {
                    return val?String(val).toUpperCase():'';
                }
            },
            { text: 'VERSION', field: 'version' },
            { text: 'STATUS', field: 'status' },
            { text: 'CREATOR', field: 'creatorNickName' },
            {
                text: 'CREATED DATE*', field: 'gmtCreated', width:100,
                renderer: function (val, col, row) {
                    return val?`<div ${View.WIDGET_ATTRIBUTE}="button" data="${new Date(val).format('YY-MM-DD')}"></div>`:''
                }
            },
            { text: 'HANDLER', field: 'handlerNickName' }
        ],
        data: data,
        listeners: {
            rendered: function(){
                this.widgetEl.find(`[${View.WIDGET_ATTRIBUTE}=button]`).each((i,el)=>{
                    new Button({
                        renderTo:el,
                        text: $(el).attr('data'),
                        sizeMode:SizeMode.sm,
                        colorMode: ColorMode.primary,
                        faceMode:ButtonFaceMode.pill
                    })
                })
            }
        }
    });

    Dom.applyStyle(`
    .jsfx-grid.my-style{
        --grid-bdcolor: orange;
        --head-bgcolor: orange;
        --head-color: white;
        --body-bgcolor: #fff;
        --body-color: #000;
        --hover-bgcolor: black;
        --hover-color: white;
        --striped-bgcolor: yellow;
        --striped-color: #000;
        --pager-color: white;
        --pager-bgcolor: black;
        --pager-selected-color: #fff;
        --pager-selected-bgcolor: orange;
        --pagesizes-hover-color: black;
        --pagesizes-hover-bgcolor: white;
    }`);
    new Grid({
        id: 'cus1',
        cls: 'my-style',
        data: data,
        columns: cols,
        faceMode: [GridFaceMode.inline, GridFaceMode.outline, GridFaceMode.striped],
        pagingBar: true
    });

    new Grid({
        id: 'info1',
        data: data,
        columns: cols,
        pagingBar: true,
        i18n: <GridResource>{
            rowsInfo: 'Total: {total}, From {beginRow} To {endRow}'
        }
    });

    Grid.I18N = <GridResource>Jsons.union(Grid.I18N, {
        rowsInfo: 'Total = {total}, {beginRow} ~ {endRow}'
    })
    new Grid({
        id: 'info2',
        data: data,
        columns: cols,
        pagingBar: true
    });

})