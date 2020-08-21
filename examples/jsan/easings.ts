/// <reference path='../../dist/jsdk.d.ts' /> 
JS.imports('$jsan').then(() => {
    let cfg = <AnimInit>{
        autoReverse: true,
        autoReset: true,
        duration: 5000,
        loop: true,
        frames: {
            from: { x: 0 },
            to: { x: 200 }
        }
    }, easings = [
        { el: 'div0', fn: 'LINEAR' },
        { el: 'div1', fn: 'LINEAR' },
        { el: 'div2', fn: 'QUAD_IN' },
        { el: 'div3', fn: 'QUAD_OUT' },
        { el: 'div4', fn: 'QUAD_IN_OUT' },
        { el: 'div5', fn: 'CUBIC_IN' },
        { el: 'div6', fn: 'CUBIC_OUT' },
        { el: 'div7', fn: 'CUBIC_IN_OUT' },
        { el: 'div8', fn: 'QUART_IN' },
        { el: 'div9', fn: 'QUART_OUT' },
        { el: 'div10', fn: 'QUART_IN_OUT' },
        { el: 'div11', fn: 'QUINT_IN' },
        { el: 'div12', fn: 'QUINT_OUT' },
        { el: 'div13', fn: 'QUINT_IN_OUT' },
        { el: 'div14', fn: 'SINE_IN' },
        { el: 'div15', fn: 'SINE_OUT' },
        { el: 'div16', fn: 'SINE_IN_OUT' },
        { el: 'div17', fn: 'EXPO_IN' },
        { el: 'div18', fn: 'EXPO_OUT' },
        { el: 'div19', fn: 'EXPO_IN_OUT' },
        { el: 'div20', fn: 'CIRC_IN' },
        { el: 'div21', fn: 'CIRC_OUT' },
        { el: 'div22', fn: 'CIRC_IN_OUT' },
        { el: 'div23', fn: 'ELASTIC_IN' },
        { el: 'div24', fn: 'ELASTIC_OUT' },
        { el: 'div25', fn: 'ELASTIC_IN_OUT' },
        { el: 'div26', fn: 'BACK_IN' },
        { el: 'div27', fn: 'BACK_OUT' },
        { el: 'div28', fn: 'BACK_IN_OUT' },
        { el: 'div29', fn: 'BOUNCE_IN' },
        { el: 'div30', fn: 'BOUNCE_OUT' },
        { el: 'div31', fn: 'BOUNCE_IN_OUT' }
    ], anims = [], html = '';

    easings.forEach(a => {
        html += `${a.fn}:<div id="${a.el}" class="brick"></div>`;
        anims.push(new MoveAnim(<any>Jsons.union(cfg, <MoveAnimInit>{
            target: '#' + a.el,
            easing: Easings[a.fn]
        })))
    })
    $1('#ctor').innerHTML = html;

    let anim;
    $1('#btnPlay').on('click', () => {
        if(!anim) anim = new ParallelAnim({
            anims: anims
        })
        anim.play()
    })
    $1('#btnPause').on('click', () => {
        if (anim) anim.pause()
    })
    $1('#btnStop').on('click', () => {
        if (anim) anim.stop()
    })

})
