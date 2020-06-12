JS.imports('$jsfx').then(() => {
    let colors = [
        ColorMode.primary,
        ColorMode.secondary,
        ColorMode.light,
        ColorMode.dark,
        ColorMode.success,
        ColorMode.danger,
        ColorMode.warning,
        ColorMode.info,
        ColorMode.accent,
        ColorMode.metal,
    ];
    colors.forEach((color, i) => {
        new Progress({
            id: 'col' + i,
            appendTo: '#colors',
            title: color,
            colorMode: color,
            iniValue: 0.5
        });
    });
    [ProgressFaceMode.square, ProgressFaceMode.round, ProgressFaceMode.striped, ProgressFaceMode.animated].forEach((f, i) => {
        new Progress({
            id: 'face' + (i + 1),
            title: f,
            colorMode: ColorMode.primary,
            iniValue: 0.5,
            faceMode: f
        });
    });
    [ProgressFaceMode.square, ProgressFaceMode.round, ProgressFaceMode.striped, ProgressFaceMode.animated].forEach((f, i) => {
        new Progress({
            id: 'sta' + (i + 1),
            title: f + '(Disabled)',
            colorMode: ColorMode.primary,
            iniValue: 0.5,
            faceMode: f,
            disabled: true
        });
    });
    [SizeMode.hg, SizeMode.lg, SizeMode.md, SizeMode.sm, SizeMode.xs].forEach((size, i) => {
        new Progress({
            id: 'size' + (i + 1),
            title: size,
            colorMode: ColorMode.primary,
            iniValue: 0.5,
            sizeMode: size
        });
    });
    new Progress({
        id: 'height1',
        title: '15px:',
        colorMode: ColorMode.primary,
        iniValue: 0.5,
        height: 15
    });
    Dom.applyStyle(`.jsfx-progress.red {
            --title-color: red;
            --bgcolor: black;
            --bar-color: red;
        }`);
    new Progress({
        id: 'cus1',
        title: 'RED:',
        cls: 'red',
        iniValue: 0.5
    });
});
