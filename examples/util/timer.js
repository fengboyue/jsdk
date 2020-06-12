let timer1 = new Timer();
$1('#btn1').on('click', () => {
    timer1.startForever(function (counter) {
        $1('#div1').html('Counter:' + counter);
    }, { interval: 3000 });
});
$1('#btn2').on('click', () => {
    timer1.suspend();
});
$1('#btn3').on('click', () => {
    timer1.stop();
});
$1('#btn4').on('click', () => {
    timer1.restart();
});
