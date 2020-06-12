JS.imports('$jsfx').then(() => {
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
        new Button({
            id: 'color' + i,
            text: name,
            colorMode: colors[name]
        });
        new Button({
            id: 'out' + i,
            text: name,
            colorMode: colors[name],
            outline: true
        });
        i++;
    }
    i = 1;
    for (let name in colors) {
        new Button({
            id: `sta${i}-1`,
            text: 'Disable',
            disabled: true,
            colorMode: colors[name]
        });
        new Button({
            id: `sta${i}-2`,
            text: 'Enable',
            colorMode: colors[name]
        });
        i++;
    }
    ['hg', 'lg', 'md', 'sm', 'xs'].forEach((v, i) => {
        new Button({
            id: 'size' + i,
            appendTo: '#sizes',
            text: v + ' button',
            colorMode: ColorMode.primary,
            sizeMode: v
        });
    });
    let faces = {
        Square: ButtonFaceMode.square,
        Round: ButtonFaceMode.round,
        Pill: ButtonFaceMode.pill,
        Shadow: ButtonFaceMode.shadow
    };
    i = 1;
    for (let name in faces) {
        new Button({
            id: 'face' + i,
            text: name,
            faceMode: faces[name],
            colorMode: ColorMode.info
        });
        i++;
    }
    new Button({
        id: 'icon1',
        colorMode: ColorMode.success,
        iconCls: 'fa fa-calendar-check-o'
    });
    new Button({
        id: 'icon2',
        colorMode: ColorMode.success,
        faceMode: ButtonFaceMode.pill,
        outline: true,
        iconCls: 'fa fa-calendar-check-o'
    });
    new Button({
        id: 'icon3',
        colorMode: ColorMode.success,
        text: 'Icon Button',
        iconCls: 'fa fa-calendar-check-o'
    });
    new Button({
        id: 'icon4',
        text: 'Icon Button',
        colorMode: ColorMode.success,
        faceMode: ButtonFaceMode.pill,
        outline: true,
        iconCls: 'fa fa-calendar-check-o'
    });
    new Button({
        id: 'bdg1',
        text: 'Large',
        colorMode: ColorMode.primary,
        sizeMode: SizeMode.lg,
        badge: 'new'
    });
    new Button({
        id: 'bdg2',
        text: 'Normal',
        colorMode: ColorMode.primary,
        badge: {
            text: 'new',
            color: ColorMode.info
        }
    });
    new Button({
        id: 'bdg3',
        text: 'Small',
        colorMode: ColorMode.primary,
        sizeMode: SizeMode.sm,
        badge: {
            text: 'new',
            color: ColorMode.accent
        }
    });
    new Button({
        id: 'bdg4',
        iconCls: 'fa fa-calendar-check-o',
        colorMode: ColorMode.danger,
        faceMode: ButtonFaceMode.pill
    }).badge({
        text: '99',
        color: ColorMode.warning
    });
    let items = new Array();
    items = [{
            text: 'Menu1'
        }, {
            text: 'Menu2'
        }];
    new Button({
        id: 'dd1',
        text: 'DropDown',
        colorMode: ColorMode.primary,
        dropMenu: {
            items: items
        }
    });
    new Button({
        id: 'dd2',
        text: 'DropUp + Outline + Shadow',
        colorMode: ColorMode.success,
        faceMode: ButtonFaceMode.shadow,
        outline: true,
        dropMenu: {
            dir: 'up',
            items: items
        }
    });
    new Button({
        id: 'dd3',
        text: 'DropLeft + Outline + Pill + Shadow',
        colorMode: ColorMode.info,
        faceMode: [ButtonFaceMode.shadow, ButtonFaceMode.pill],
        outline: true,
        dropMenu: {
            dir: 'left',
            items: items
        }
    });
    new Button({
        id: 'dd4',
        text: 'DropRight + Shadow',
        colorMode: ColorMode.accent,
        faceMode: ButtonFaceMode.shadow,
        dropMenu: {
            dir: 'right',
            items: items
        }
    });
    items.push({
        html: '<i class="la la-map-marker"/> JSDK (Click Me)',
        selected: true,
        href: 'https://github.com/fengboyue/jsdk'
    });
    new Button({
        id: 'dd5',
        text: 'Selected Menu Item(Href)',
        colorMode: ColorMode.success,
        dropMenu: {
            items: items
        }
    });
    new Button({
        id: 'dd6',
        text: 'Group/Divider Menu',
        colorMode: ColorMode.info,
        dropMenu: {
            items: [{
                    caption: 'Utils',
                    text: 'JS.fx.Arrays'
                }, {
                    text: 'JS.util.Jsons'
                }, {
                    hasDivider: true,
                    text: 'JS.util.Dates'
                }, {
                    caption: 'Widgets',
                    text: 'JS.fx.Button'
                }, {
                    text: 'JS.fx.TextInput'
                }, {
                    text: 'JS.fx.Label'
                }]
        }
    });
    new Button({
        id: 'btn1',
        text: 'My Button',
        cls: 'my-button'
    });
    Dom.applyStyle(`
    .jsfx-button.my-vars{
        --bgcolor: black;
        --bdcolor: black;
        --color: white;
        --hover-bgcolor: white;
        --hover-color: black;
    }
    `);
    new Button({
        id: 'btn2',
        text: 'My Button',
        cls: 'my-vars'
    });
});
