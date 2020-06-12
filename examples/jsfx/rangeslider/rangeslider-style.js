JS.imports([
    '$jsfx.rangeslider'
]).then(() => {
    let faces = ['flat', 'big', 'modern', 'sharp', 'round', 'square'];
    faces.forEach((m, i) => {
        new RangeSlider({
            id: 'face' + (i + 1),
            title: m + ':',
            titlePlace: 'top',
            faceMode: m
        });
    });
    faces.forEach((m, i) => {
        new RangeSlider({
            id: 'col' + (i + 1),
            title: 'warning:',
            titlePlace: 'top',
            faceMode: m,
            colorMode: ColorMode.warning
        });
    });
    Dom.applyStyle(`.jsfx-rangeslider.black {
            --color: black;
        }`);
    faces.forEach((m, i) => {
        new RangeSlider({
            id: 'cus' + (i + 1),
            title: 'black color:',
            titlePlace: 'top',
            faceMode: m,
            cls: 'black'
        });
    });
});
