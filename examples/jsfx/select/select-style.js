JS.imports([
    '$jsfx.select'
]).then(() => {
    let data = [{
            id: '1',
            text: 'large'
        }, {
            id: '2',
            text: 'medium'
        }, {
            id: '3',
            text: 'small'
        }];
    new Select({
        id: 'sel1',
        placeholder: 'Choose...',
        title: 'single',
        data: data
    });
    new Select({
        id: 'sel2',
        placeholder: 'Choose...',
        title: 'multiple',
        data: data,
        multiple: true
    });
    new Select({
        id: 'w1',
        title: 'title=100px',
        titlePlace: 'left',
        data: data,
        width: 200,
        titleWidth: 100
    });
    new Select({
        id: 'w2',
        title: 'title=100px',
        titlePlace: 'top',
        data: data,
        width: 200,
        titleWidth: 100
    });
    let sizes = ['hg', 'lg', 'md', 'sm', 'xs'];
    sizes.forEach((v, i) => {
        new Select({
            id: 'size' + i,
            appendTo: '#sizes',
            title: v,
            titlePlace: 'top',
            sizeMode: v,
            data: data
        });
        new Select({
            id: 'size_m' + i,
            appendTo: '#sizes',
            title: v,
            titlePlace: 'top',
            sizeMode: v,
            data: data,
            multiple: true
        });
    });
    let colors = {
        Success: ColorMode.success,
        Danger: ColorMode.danger,
        Warning: ColorMode.warning,
        Info: ColorMode.info,
        Primary: ColorMode.primary,
        Secondary: ColorMode.secondary,
        Accent: ColorMode.accent,
        Metal: ColorMode.metal,
        Light: ColorMode.light,
        Dark: ColorMode.dark
    };
    let i = 1;
    for (let name in colors) {
        new Select({
            id: 'focus_s' + i,
            appendTo: '#focuses',
            title: name + '/single',
            titlePlace: 'top',
            colorMode: colors[name],
            data: data
        });
        new Select({
            id: 'focus_m' + i,
            appendTo: '#focuses',
            title: name + '/multiple',
            titlePlace: 'top',
            colorMode: colors[name],
            data: data,
            multiple: true
        });
        new Select({
            id: 'out_s' + i,
            appendTo: '#outlines',
            title: name + '/single',
            titlePlace: 'top',
            colorMode: colors[name],
            data: data,
            outline: true
        });
        new Select({
            id: 'out_m' + i,
            appendTo: '#outlines',
            title: name + '/multiple',
            titlePlace: 'top',
            colorMode: colors[name],
            data: data,
            multiple: true,
            outline: true
        });
        i++;
    }
    let faces = [SelectFaceMode.square, SelectFaceMode.round, SelectFaceMode.pill, SelectFaceMode.shadow];
    faces.forEach((v, i) => {
        new Select({
            id: 'face_s' + i,
            appendTo: '#faces',
            title: v + '/single',
            titlePlace: 'top',
            faceMode: v,
            data: data
        });
        new Select({
            id: 'face_m' + i,
            appendTo: '#faces',
            title: v + '/multiple',
            titlePlace: 'top',
            faceMode: v,
            data: data,
            multiple: true
        });
    });
    Dom.applyStyle(`
    .jsfx-select.my-vars{
        --bg-color: #000;
        --text-color: #fff;
        --border-color: red;
        --placeholder-color: #ccc;
        --arrow-color: #fff;
        --selected-color: red;
        --hover-bg-color: red;
        --hover-text-color: #fff;

        //choice for mutiple
        --choice-text-color: red;
        --choice-back-color: #fff;
        --choice-border-color: #fff;
        --choice-remove-color: red;
    }
    `);
    new Select({
        id: 'cus1',
        title: 'My Single Select',
        titlePlace: 'top',
        cls: 'my-vars',
        data: data
    });
    new Select({
        id: 'cus2',
        title: 'My Multiple Select',
        titlePlace: 'top',
        cls: 'my-vars',
        data: data,
        multiple: true
    });
});
