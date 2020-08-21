/// <reference path="../../dist/jsdk.d.ts" /> 
$1('#ajax').on('click',() => {
    Http.send({
        thread: true,
        url: '/jsdk/examples/lang/thread-ajax.js',
        responseType: 'text'
    }).then((res)=>{
        $1('#txt').innerHTML = res.data;
    })
});
