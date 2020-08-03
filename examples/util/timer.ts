/// <reference path='../../dist/jsdk.d.ts' /> 
/*冒泡排序*/
function bubbleSort(arr){
    for(var i=0;i<arr.length-1;i++){
        for(var j=0;j<arr.length-i;j++){
            if(arr[j]>arr[j+1]){
                var temp = arr[j]
                arr[j] = arr[j+1]
                arr[j+1] = temp
            }
        }
    }
    return arr
}

let timer1 = new Timer(function(){
    // Time consuming calculation
    let arr=[];
    for (let i = 0; i < 5000; i++) {
        arr[i] = Random.number(10000,true)
    }
    bubbleSort(arr);

    $1('#div1').innerHTML = 'Counter:'+this.count()+' MaxFPS:'+this.maxFPS()+' FPS:'+this.fps()
}, {
    loop: true,
    interval: 50, //fps = 1000/50 = 20
});

$1('#btn1').on('click',()=>{
    timer1.start()
})
$1('#btn2').on('click',()=>{
    timer1.pause()
})
$1('#btn3').on('click',()=>{
    timer1.stop()
})
$1('#btnBF').on('click',()=>{
    timer1.config({
        intervalMode: 'BF'
    })
})
$1('#btnOF').on('click',()=>{
    timer1.config({
        intervalMode: 'OF'
    })
})