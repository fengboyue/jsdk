JS.imports(['$js2d', '$jsds']).then(() => {
    let i = 0, j = 0, W = 500, H = 500, ds = new Display({
        holder: '#container',
        id: 'd1',
        x: 20,
        y: 20,
        width: W,
        height: H,
        cssStyle: 'background:black;',
        drawStyle: {
            strokeStyle: 'white',
            lineWidth: 1
        },
        mode: 'div'
    }), randomPoint = () => {
        return [Random.number({ min: 0, max: W }, true), Random.number({ min: 0, max: H }, true)];
    }, drawStyle = () => {
        return {
            strokeStyle: $1('#strokeColor').val(),
            fillStyle: $1('#fillColor').val()
        };
    }, fighterFrames = [{ x: 4, y: 400 }, { x: 70, y: 400 }, { x: 136, y: 400 }], fIndex = 0, flyTimer = new Timer(() => {
        ds.changeImage('img0', fighterFrames[fIndex]);
        fIndex == 2 ? fIndex = 0 : fIndex++;
    }, {
        loop: true
    }), moveTimer = new Timer(() => {
        let img = $1('#img0');
        if (img) {
            let box = img.box(), nx = Random.number({ min: -10, max: 10 }, true), ny = Random.number({ min: -10, max: 10 }, true);
            if (box.x + nx < 0 || box.x + nx > W)
                nx = -nx;
            if (box.y + ny < 0 || box.y + ny > H)
                ny = -ny;
            ds.updateChild('img0', {
                x: nx > 0 ? `+=${nx}` : `-=${Math.abs(nx)}`,
                y: ny > 0 ? `+=${ny}` : `-=${Math.abs(ny)}`,
                zIndex: 1
            });
        }
    }, {
        loop: true,
        interval: 150
    });
    $1('#btnText1').on('click', () => {
        ds.drawText(['JS2D', randomPoint()], Jsons.union({
            textStyle: {
                font: '40px Arial',
                align: 'center'
            }
        }, drawStyle()), {
            id: 'txt' + i++
        });
    });
    $1('#btnText2').on('click', () => {
        ds.drawText(['JS2D', randomPoint()], Jsons.union({
            textStyle: {
                font: '40px Arial',
                align: 'center'
            }
        }, drawStyle()), {
            id: 'txt' + i++,
            draggable: true,
            style: 'cursor:pointer;'
        });
    });
    $1('#btnChangeText').on('click', () => {
        ds.changeText('txt0', 'JSDK');
    });
    let cache = new ImageCache();
    cache.load([
        {
            id: '1945',
            url: '1945.gif'
        }
    ]).then(() => {
        $1('#btnImage1').on('click', () => {
            let xy = randomPoint();
            ds.drawImage({
                src: cache.get('1945'),
                x: 4, y: 400, w: 65, h: 65
            }, {
                x: xy[0],
                y: xy[1],
                id: 'img' + j++
            });
        });
        $1('#btnImage2').on('click', () => {
            let xy = randomPoint();
            ds.drawImage({
                src: cache.get('1945'),
                x: 4, y: 400, w: 65, h: 65
            }, {
                x: xy[0],
                y: xy[1],
                id: 'img' + j++,
                draggable: true,
                style: 'cursor:pointer;'
            });
        });
        $1('#btnFlyFighter').on('click', () => {
            flyTimer.start();
        });
        $1('#btnMoveFighter').on('click', () => {
            moveTimer.start();
        });
    });
    $1('#btnClear').on('click', () => {
        ds.clear();
        i = j = 0;
        flyTimer.stop();
        moveTimer.stop();
    });
});
