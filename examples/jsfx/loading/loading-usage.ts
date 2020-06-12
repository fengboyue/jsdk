/// <reference path="../../../dist/jsdk.d.ts" /> 
JS.imports('$jsfx.loading').then(() => {

    let fn = function (e: Event, ...args) {
        Assert.true(Types.ofKlass(e, Event));
        JSLogger.info(e.type, args);
    }

    $('#btn1').click(()=>{
        Loading.show({
            message: 'Just a moment...',
            colorMode: ColorMode.success,
            duration: 10000,
            listeners: {
                showed: fn,
                hidden: fn
            }
        })
    })

    $('#btn2').click(()=>{
        Loading.show({
            faceMode: LoadingFaceMode.ring
        });
    })
    $('#btn3').click(()=>{
        Loading.show({
            faceMode: LoadingFaceMode.bar
        });
    })

    $('#btn4').click(()=>{
        Loading.show({
            message: 'Just a moment...',
            duration: 0
        })
    })

})