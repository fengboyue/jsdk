/// <reference path="../../../dist/jsdk.d.ts" /> 
JS.imports([
    '$jsfx.rangeslider'
]).then(() => {
    let rs1 = new RangeSlider({
        id:'data1'
    })

    $('#data-btn1').click(()=>{
        rs1.data([50,1000]);
    })
    $('#data-btn2').click(()=>{
        JSLogger.info(rs1.data());
    })
    $('#data-btn3').click(()=>{
        rs1.data(null);
    })
    $('#data-btn4').click(()=>{
        rs1.load('data.json')
    })

    let val1 = new RangeSlider({
        id:'val1',
        data: [50,1000],
        title:'Single Value:',
        titlePlace:'top'
    })
    let val2 = new RangeSlider({
        id:'val2',
        data: [50,1000],
        type: 'double',
        title:'Double Values:',
        titlePlace:'top'
    })

    $('#val1-btn1').click(()=>{
        val1.value(99);
    })
    $('#val1-btn2').click(()=>{
        JSLogger.info(val1.value());
    })
    $('#val1-btn3').click(()=>{
        val1.clear();
    })
    $('#val1-btn4').click(()=>{
        val1.reset();
    })

    $('#val2-btn1').click(()=>{
        val2.value([99,199]);
    })
    $('#val2-btn2').click(()=>{
        JSLogger.info(val2.value());
    })
    $('#val2-btn3').click(()=>{
        val2.clear();
    })
    $('#val2-btn4').click(()=>{
        val2.reset();
    })
    
})