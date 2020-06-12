/// <reference path="../../../dist/jsdk.d.ts" /> 
JS.imports('$jsfx').then(() => {
    let fn = function (e: Event, ...args) {
        Assert.true(Types.isKlass(this, TextArea));
        Assert.true(Types.ofKlass(e, Event));
        JSLogger.info(this, e.type, args);
    }

    new TextArea({
        id:'txt1',
        listeners: {
            changed: fn
        }
    })
})    