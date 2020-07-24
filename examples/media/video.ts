/// <reference path='../../dist/jsdk.d.ts' /> 
JS.imports([
    '$jsmedia'
]).then(() => {
    let v = new Video({
        appendTo:'#player',
        // src: 'https://www.runoob.com/try/demo_source/movie.mp4',
        width:200,
        height:200
    });

    $1('#btn').on('click', ()=>{
        v.src('https://www.w3school.com.cn/i/movie.ogg');
        v.play()
    }) 
})
