JS.imports([
    '$jsmedia'
]).then(() => {
    let cache = new AudioCache({
        name: 'test.audio'
    }), a1 = new AudioPro({
        played: () => {
            alert('This audio1 play to end!');
        }
    }), a2 = new AudioPro({
        played: () => {
            alert('This audio2 play to end!');
        }
    });
    cache.load([{
            id: 'a1',
            url: 'blueyellow.wav'
        }, {
            id: 'a2',
            url: 'clapping-crowd.wav'
        }]).then(() => {
        $1('#btnPlay1').on('click', () => {
            a1.play('a1', cache);
        });
        $1('#btnStop1').on('click', () => {
            a1.stop();
        });
        $1('#range1').on('input', function () {
            a1.volume(parseInt(this.value) / parseInt(this.max));
        });
        $1('#btnPlay2').on('click', () => {
            a2.play('a2', cache);
        });
        $1('#btnStop2').on('click', () => {
            a2.stop();
        });
        $1('#range2').on('input', function () {
            a2.volume(parseInt(this.value) / parseInt(this.max));
        });
    });
});
