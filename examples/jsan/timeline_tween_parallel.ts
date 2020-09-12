/// <reference path='../../dist/jsdk.d.ts' /> 
JS.imports('$jsan').then(() => {
    let anim = new Timeline({
        duration: 800,
        autoreset: true
    })
    .add({
        type: 'tween',
        targets: '.square.el-1',
        keys: { left: '+=250' },
        duration: 500,
        endDelay: 1300
    }, 0)
    .add({
        type: 'tween',
        targets: '.circle.el-1',
        keys: { left: '+=250' },
        endDelay: 500
    }, 500)
    .add({
        type: 'tween',
        targets: '.square.el-2',
        keys: { left: '+=250' }
    })
    .add({
        type: 'tween',
        targets: '.circle.el-2',
        keys: { left: '+=250' },
        endDelay: 1000
    }, 0)

    $1('#demo').on('click', () => {
        $1('.log').innerHTML = 'Playing...'
        anim.play().then((excuted)=>{
            if(excuted) $1('.log').innerHTML = 'All Finished!'
        })
    })
})
