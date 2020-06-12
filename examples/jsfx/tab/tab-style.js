JS.imports('$jsfx').then(() => {
    let data = [
        {
            content: $('#vars'),
            heading: '<i class="la la-puzzle-piece"></i> Variables'
        },
        {
            content: $('#objects'),
            heading: '<i class="la la-puzzle-piece"></i> Objects'
        },
        {
            content: $('#functions'),
            heading: '<i class="la la-puzzle-piece"></i> Functions',
            disabled: true
        }
    ];
    new Tab({
        id: 'tab1',
        headStyle: 'font-size:larger;',
        data: data,
        colorMode: ColorMode.success
    });
    new Tab({
        id: 'tab2',
        headStyle: 'font-size:larger;',
        data: data,
        faceMode: TabFaceMode.underline,
        colorMode: ColorMode.success
    });
    new Tab({
        id: 'tab3',
        headStyle: 'font-size:larger;',
        data: data,
        faceMode: TabFaceMode.pill,
        colorMode: ColorMode.success
    });
    new Tab({
        id: 'tab4',
        data: data,
        faceMode: [TabFaceMode.vertical, TabFaceMode.outline],
        colorMode: ColorMode.success,
        headLeftWidth: 150
    });
    new Tab({
        id: 'tab5',
        data: data,
        faceMode: [TabFaceMode.vertical, TabFaceMode.underline],
        colorMode: ColorMode.success,
        headLeftWidth: 150
    });
    new Tab({
        id: 'tab6',
        data: data,
        faceMode: [TabFaceMode.vertical, TabFaceMode.pill],
        colorMode: ColorMode.success,
        headLeftWidth: 150
    });
    new Tab({
        id: 'tab7',
        data: data,
        faceMode: [TabFaceMode.vertical, TabFaceMode.underline],
        colorMode: ColorMode.success,
        headLeftWidth: 150,
        height: 200
    });
});
