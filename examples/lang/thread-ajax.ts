/// <reference path="../../dist/jsdk.d.ts" /> 
$1('#ajax').on('click',() => {
    Ajax.send({
        thread: true,
        url: '/jsdk/examples/lang/thread-ajax.js',
        type: 'text'
    }).then((res)=>{
        $1('#txt').html(res.data);
    })
});
