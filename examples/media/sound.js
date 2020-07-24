JS.imports([
    '$jsmedia'
]).then(() => {
    let s1 = new Sound({
        loop: true
    });
    s1.load('blueyellow.wav').then(() => {
        $1('#btnPlay1').on('click', () => {
            s1.play();
        });
        $1('#btnStop1').on('click', () => {
            s1.stop();
        });
        $1('#range1').on('input', function () {
            s1.volume(parseInt(this.value) / parseInt(this.max));
        });
    });
    let s2 = new Sound({
        on: {
            ended: function (e) {
                alert('Ended: ' + this.src());
            }
        }
    });
    s2.load('clapping-crowd.wav').then(() => {
        $1('#btnPlay2').on('click', () => {
            s2.play();
        });
        $1('#btnStop2').on('click', () => {
            s2.stop();
        });
        $1('#range2').on('input', function () {
            s2.volume(parseInt(this.value) / parseInt(this.max));
        });
    });
});
