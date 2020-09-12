/// <reference path='../../dist/jsdk.d.ts' /> 
JS.imports('$jsan').then(() => {
    let demoContentEl = $1('.demo-content'),
        fragment = document.createDocumentFragment(),
        easings = [
            'LINEAR',
            'QUAD_IN',
            'QUAD_OUT',
            'QUAD_IN_OUT',
            'CUBIC_IN',
            'CUBIC_OUT',
            'CUBIC_IN_OUT',
            'QUART_IN',
            'QUART_OUT',
            'QUART_IN_OUT',
            'QUINT_IN',
            'QUINT_OUT',
            'QUINT_IN_OUT',
            'SINE_IN',
            'SINE_OUT',
            'SINE_IN_OUT',
            'EXPO_IN',
            'EXPO_OUT',
            'EXPO_IN_OUT',
            'CIRC_IN',
            'CIRC_OUT',
            'CIRC_IN_OUT',
            'ELASTIC_IN',
            'ELASTIC_OUT',
            'ELASTIC_IN_OUT',
            'BACK_IN',
            'BACK_OUT',
            'BACK_IN_OUT',
            'BOUNCE_IN',
            'BOUNCE_OUT',
            'BOUNCE_IN_OUT'];

    function createEasingDemo(easing) {
        var demoEl = document.createElement('div');
        demoEl.classList.add('stretched', 'square', 'el');
        new TweenAnim({
            keys: {
                translateX: 250
            },
            direction: 'alternate',
            loop: true,
            delay: 500,
            endDelay: 500,
            duration: 2000,
            easing: easing
        }).targets(demoEl).play();
        fragment.appendChild(demoEl);
    }

    easings.forEach(function (easeName) {
        createEasingDemo(easeName);
    });

    demoContentEl.innerHTML = '';
    demoContentEl.appendChild(fragment);
})
