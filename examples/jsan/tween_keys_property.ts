/// <reference path='../../dist/jsdk.d.ts' /> 
JS.imports('$jsan').then(() => {
    let logEl = $1('.battery-log'),
        battery = {
            charged: '0%',
            cycles: 120
        },
        anim = new TweenAnim({
            keys: {
                charged: '100%',
                cycles: 130
            },
            on: {
                updated: function () {
                    logEl.innerHTML = Jsons.stringify(battery);
                }
            },
            round: 0
        }).targets(battery);
    
    logEl.innerHTML = Jsons.stringify(battery);
    $1('#demo').on('click', () => {
        anim.play()
    })
})
