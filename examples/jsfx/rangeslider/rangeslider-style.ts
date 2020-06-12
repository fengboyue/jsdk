/// <reference path="../../../dist/jsdk.d.ts" /> 
JS.imports([
    '$jsfx.rangeslider'
]).then(() => {
    let faces = ['flat','big','modern','sharp','round','square'];

    faces.forEach((m,i)=>{
        new RangeSlider({
            id:'face'+(i+1),
            title: m+':',
            titlePlace: 'top',
            faceMode: <any>m
        })
    })

    faces.forEach((m,i)=>{
        new RangeSlider({
            id:'col'+(i+1),
            title: 'warning:',
            titlePlace: 'top',
            faceMode: <any>m,
            colorMode: ColorMode.warning
        })
    })

    Dom.applyStyle(
        `.jsfx-rangeslider.black {
            --color: black;
        }`);
    faces.forEach((m,i)=>{
        new RangeSlider({
            id:'cus'+(i+1),
            title: 'black color:',
            titlePlace: 'top',
            faceMode: <any>m,
            cls: 'black'
        })
    })
})