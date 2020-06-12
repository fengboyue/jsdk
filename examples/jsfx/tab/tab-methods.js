JS.imports('$jsfx').then(() => {
    let fn = function (e, ...args) {
        Assert.true(Types.isKlass(this, Tab));
        Assert.true(Types.ofKlass(e, Event));
        JSLogger.info(this.id, e.type, args);
    };
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
            heading: '<i class="la la-puzzle-piece"></i> Functions'
        }
    ];
    let tab1 = new Tab({
        id: 'tab1',
        data: data,
        colorMode: ColorMode.success,
        listeners: {
            activing: fn,
            actived: fn
        }
    });
    $('#btn1').click(() => {
        tab1.enableTab(2);
    });
    $('#btn2').click(() => {
        tab1.disableTab(2);
    });
    $('#btn3').click(() => {
        alert(tab1.isEnabledTab(2));
    });
    $('#btn4').click(() => {
        tab1.activeTab(2);
    });
    let tab2 = new Tab({
        id: 'tab2',
        data: data,
        colorMode: ColorMode.warning,
        listeners: {
            activing: fn,
            actived: fn
        }
    });
    $('#btn5').click(() => {
        tab2.showTab(2);
    });
    $('#btn6').click(() => {
        tab2.hideTab(2);
    });
    $('#btn7').click(() => {
        alert(tab2.isShownTab(2));
    });
    $('#btn8').click(() => {
        tab2.activeTab(2);
    });
    let tab3 = new Tab({
        id: 'tab3',
        colorMode: ColorMode.danger,
        listeners: {
            activing: fn,
            actived: fn
        }
    });
    $('#btn9').click(() => {
        tab3.addTab({
            content: $('#vars'),
            heading: 'Tab ' + (tab3.length() + 1)
        });
    });
    $('#btn10').click(() => {
        tab3.removeTab(tab3.length());
    });
    $('#btn11').click(() => {
        tab3.activeTab(tab3.length());
    });
});
