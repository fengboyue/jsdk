/// <reference path="../../../dist/jsdk.d.ts" /> 
JS.imports([
    '$jsfx.toast'
]).then(() => {
    let fn = function (e: Event, ...args) {
        Assert.true(Types.ofKlass(e, Event));
        JSLogger.info(e.type, args);
    }

    new Button({
        id: 'btn1',
        text: 'warning',
        colorMode: ColorMode.warning,
        listeners: {
            click: function () {
                Toast.show({
                    type: 'warning',
                    title: 'Toast demo',
                    message: "View the console!",
                    listeners:{
                        'shown': fn
                    }
                });
            }
        }
    });
    new Button({
        id: 'btn2',
        text: 'error',
        colorMode: ColorMode.danger,
        listeners: {
            click: function () {
                Toast.show({
                    type: 'error',
                    title: 'Toast demo',
                    message: "View the console!",
                    listeners:{
                        'shown': fn
                    }
                })    
            }
        }
    });
    new Button({
        id: 'btn3',
        text: 'success',
        colorMode: ColorMode.success,
        listeners: {
            click: function () {
                Toast.show({
                    type: 'success',
                    title: 'Toast demo',
                    message: "View the console!",
                    listeners:{
                        'shown': fn
                    }
                });
            }
        }
    });
    new Button({
        id: 'btn4',
        text: 'info',
        colorMode: ColorMode.info,
        listeners: {
            click: function () {
                Toast.show({
                    type: 'info',
                    title: 'Toast demo',
                    message: "View the console!",
                    listeners:{
                        'shown': fn
                    }
                });
            }
        }
    });

    new Button({
        id: 'btn5',
        text: 'progressBar',
        colorMode: ColorMode.metal,
        listeners: {
            click: function () {
                Toast.show({
                    type: 'info',
                    progressBar: true,
                    message: 'Progress demo'
                });
            }
        }
    });

    Dom.applyStyle(`
    .jsfx-toast.accent{
        --info: var(--color-accent);
    }
    `);
    new Button({
        id: 'btn6',
        text: 'Custom Color',
        colorMode: ColorMode.primary,
        listeners: {
            click: function () {
                Toast.show({
                    type: 'info',
                    message: 'My accent style',
                    cls: 'accent'
                });
            }
        }
    });

})