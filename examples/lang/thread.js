JSLogger.level = LogLevel.ALL;
$1('#two').on('click', () => {
    let obj = {
        run: function () {
            this.onposted(data => {
                this.postMain(data);
            });
        }
    }, handler = function (e, data) {
        console.log(`Thread<${this.id}> reveived data=${data}`);
        this.destroy();
    };
    new Thread(obj).on('message', handler).start().postThread('abcd').destroy();
    new Thread(obj).on('message', handler).start().postThread('1234').destroy();
});
let ctrl = new Thread({
    run: function () {
        this.onposted(data => {
            this.callMain('print', data);
        });
    },
    print: function (data) {
        console.log('Thread received: ' + data);
    }
});
$1('#btn1').on('click', () => {
    console.log(ctrl.getState());
});
$1('#btn2').on('click', () => {
    ctrl.start();
});
$1('#btn3').on('click', () => {
    ctrl.postThread(Random.uuid(8));
});
$1('#btn4').on('click', () => {
    ctrl.terminate();
});
$1('#btn5').on('click', () => {
    ctrl.destroy();
});
