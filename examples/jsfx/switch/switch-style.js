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
        ColorMode.metal
    ];
    colors.forEach((color, i) => {
        new Switch({
            id: 'col' + i,
            appendTo: '#colors',
            title: color,
            colorMode: color
        });
    });
    let sizes = [
        SizeMode.hg,
        SizeMode.lg,
        SizeMode.md,
        SizeMode.sm,
        SizeMode.xs
    ];
    sizes.forEach((size, i) => {
        new Switch({
            id: 'size' + i,
            appendTo: '#sizes',
            title: size,
            sizeMode: size
        });
    });
    new Switch({
        id: 'sh1',
        title: 'shadow:',
        faceMode: SwitchFaceMode.shadow
    });
    new Switch({
        id: 'st1',
        title: 'readonly:',
        readonly: true
    });
    new Switch({
        id: 'st2',
        title: 'disabled:',
        disabled: true
    });
    Dom.applyStyle(`.jsfx-switch.red {
            --on-color: #f18585;
            --off-color: #eee;
            --button-color: red;
            --bdcolor: red;
        }`);
    new Switch({
        id: 'cus1',
        title: 'RED:',
        cls: 'red'
    });
});
