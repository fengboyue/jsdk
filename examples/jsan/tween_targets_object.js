JS.imports('$jsan').then(() => {
    let logEl = $1('.battery-log'), battery = {
        charged: '0%',
        cycles: 120
    }, anim = new TweenAnim({
        keys: {
            charged: '100%',
            cycles: 130
        },
        round: 0,
        on: {
            updated: function () {
                logEl.innerHTML = Jsons.stringify(battery);
            }
        }
    }).targets(battery);
    logEl.innerHTML = Jsons.stringify(battery);
    $1('#demo').on('click', () => {
        anim.play();
    });
});
