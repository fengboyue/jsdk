JS.imports([
    '$jsmedia'
]).then(() => {
    let v = new VideoPlayer({
        appendTo: '#player',
        width: 200,
        height: 200
    });
    $1('#btn').on('click', () => {
        v.src('https://www.w3school.com.cn/i/movie.ogg');
        v.play();
    });
});
