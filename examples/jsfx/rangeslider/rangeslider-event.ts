/// <reference path="../../../dist/jsdk.d.ts" /> 
JS.imports([
    '$jsfx.rangeslider'
]).then(() => {
    let fn = function (e: Event, ...args) {
        Assert.true(Types.isKlass(this, RangeSlider));
        Assert.true(Types.ofKlass(e, Event));
        JSLogger.info(this, e.type, args);
    }

    new RangeSlider({
        id:'evt1',
        title:'Single Value:',
        titlePlace:'top',
        listeners: {
            changed: fn
        }
    })
    new RangeSlider({
        id:'evt2',
        type: 'double',
        title:'Double Values:',
        titlePlace:'top',
        listeners: {
            changed: fn
        }
    })
    
})