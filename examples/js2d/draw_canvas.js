JS.imports(['$js2d', '$jsds']).then(() => {
    let W = 500, H = 500, ds = new Display({
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
        mode: 'canvas'
    }), randomPoint = () => {
        return [Random.number({ min: 0, max: W }, true), Random.number({ min: 0, max: H }, true)];
    }, drawStyle = () => {
        return {
            lineWidth: Number($1('#lineWidth').val()),
            strokeStyle: $1('#strokeColor').val(),
            fillStyle: $1('#fillColor').val()
        };
    };
    $1('#btnLine').on('click', () => {
        ds.drawLine([randomPoint(), randomPoint()], drawStyle());
    });
    $1('#btnRect').on('click', () => {
        let p = randomPoint();
        ds.drawRect([p[0], p[1], Random.number({ min: 0, max: W / 2 }, true), Random.number({ min: 0, max: H / 2 }, true)], drawStyle());
    });
    $1('#btnTriangle').on('click', () => {
        let p = randomPoint();
        ds.drawTri([randomPoint(), randomPoint(), randomPoint()], drawStyle());
    });
    $1('#btnCircle').on('click', () => {
        ds.drawCircle([randomPoint(), Random.number({ min: 10, max: W / 2 }, true)], drawStyle());
    });
    $1('#btnCirArc').on('click', () => {
        ds.drawArc([randomPoint(), Random.number({ min: 50, max: W / 2 }, true), Random.number({ min: 0, max: 2 }) * Math.PI, Random.number({ min: 0, max: 2 }) * Math.PI, true], drawStyle());
    });
    $1('#btnPath').on('click', () => {
        let ps = [];
        for (var i = 0; i < 5; i++) {
            ps.push(randomPoint());
        }
        ds.drawPath(ps, drawStyle());
    });
    $1('#btnText').on('click', () => {
        ds.drawText(['JS2D', randomPoint()], Jsons.union({
            textStyle: {
                font: '40px Arial',
                align: 'center'
            }
        }, drawStyle()));
    });
    let cache = new ImageCache();
    cache.load([
        {
            id: '1945',
            url: '1945.gif'
        }
    ]).then(() => {
        $1('#btnImage').on('click', () => {
            let xy = randomPoint();
            ds.drawImage({
                src: cache.get('1945'),
                x: 4, y: 400, w: 65, h: 65
            }, {
                x: xy[0],
                y: xy[1]
            });
        });
    });
    $1('#btnClear').on('click', () => {
        ds.clear();
    });
});
