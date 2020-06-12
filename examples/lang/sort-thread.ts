/// <reference path="../../dist/jsdk.d.ts" /> 
/// <reference path="QuickSorter.ts" /> 

importScripts('/dist/system.min.js');
importScripts('/examples/lang/QuickSorter.js');

const me = Thread.initContext();
me.onposted((numbers: number[])=>{
    let sorted = new QuickSorter().sort(numbers);
    me.callMain('print', sorted);
})