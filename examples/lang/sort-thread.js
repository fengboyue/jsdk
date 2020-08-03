importScripts('/jsdk/dist/jscore.js');
importScripts('/jsdk/examples/lang/QuickSorter.js');
const me = Thread.initContext();
me.onposted((numbers) => {
    let sorted = new QuickSorter().sort(numbers);
    me.callMain('print', sorted);
});
