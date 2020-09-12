/// <reference path='../../dist/jsdk.d.ts' /> 
JS.imports('$jsan').then(() => {
    let anim = new TweenAnim({
        keys: {
            translateX: function (el, i) {
                return 100 * (i + 1)
            }
        },
        direction: 'alternate',
        loop: true,
        duration: 10000
    }).targets($L('.el')), progressEl = $1('.progress');
    
    progressEl.on('input', function(this: HTMLInputElement) {
        anim.seek(anim.config().duration * (parseFloat(this.value) / 100));
    });
})
