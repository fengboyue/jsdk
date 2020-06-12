importScripts('/jsdk/dist/system.min.js');
importScripts('/jsdk/examples/lang/QuickSorter.js');
const me = Thread.initContext();
me.onposted((numbers) => {
    let sorted = new QuickSorter().sort(numbers);
    me.callMain('print', sorted);
});
