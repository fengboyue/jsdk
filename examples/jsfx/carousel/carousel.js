JS.imports('$jsfx').then(() => {
    let fn = function (e, ...args) {
        Assert.true(Types.isKlass(this, Carousel));
        Assert.true(Types.ofKlass(e, Event));
        JSLogger.info(this.id, e.type, args);
    };
    let items = [{
            src: 'wonders.jpg',
            caption: 'Slide 1',
            desc: 'The wonders of the world'
        }, {
            src: 'pyramids.png',
            caption: 'Slide 2',
            desc: 'The Pyramids of Egypt'
        }, {
            src: 'greatwall.jpg',
            caption: 'Slide 3',
            desc: 'The GreatWall of China'
        }, {
            src: 'picchu.jpg',
            caption: 'Slide 4',
            desc: 'Machu Picchu in Peru'
        }];
    let car1 = new Carousel({
        id: 'car1',
        width: 800,
        height: 400,
        items: items,
        listeners: {
            'transiting': fn,
            'transited': fn
        }
    });
    for (let i = 0; i < 4; i++) {
        new Button({
            id: 'goto' + (i + 1),
            text: 'Goto slide' + (i + 1)
        }).on('click', () => {
            car1.goto(i);
        });
    }
    new Button({
        id: 'btn-prev',
        text: 'Prev'
    }).on('click', () => {
        car1.prev();
    });
    new Button({
        id: 'btn-next',
        text: 'Next'
    }).on('click', () => {
        car1.next();
    });
    new Button({
        id: 'btn-pause',
        text: 'Pause'
    }).on('click', () => {
        car1.pause();
    });
    new Button({
        id: 'btn-continue',
        text: 'Continue'
    }).on('click', () => {
        car1.cycle();
    });
    let car2 = new Carousel({
        id: 'car2',
        width: 800,
        height: 400,
        listeners: {
            'transiting': fn,
            'transited': fn
        }
    });
    new Button({
        id: 'btn-add',
        text: 'Add'
    }).on('click', () => {
        let item = Jsons.clone(items[0]);
        item.caption = 'Slide ' + (car2.length() + 1);
        car2.add(item);
    });
    new Button({
        id: 'btn-remove',
        text: 'Remove'
    }).on('click', () => {
        car2.remove(car2.length() - 1);
    });
    new Button({
        id: 'btn-clear',
        text: 'Clear'
    }).on('click', () => {
        car2.clear();
    });
});
