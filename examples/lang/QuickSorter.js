var JS;
(function (JS) {
    let example;
    (function (example) {
        class QuickSorter {
            constructor() {
                this._bus = new EventBus(this);
            }
            onCycle(fn) {
                this._bus.on('cycle', fn);
            }
            sort(arr) {
                let len = arr.length;
                if (len <= 1)
                    return arr;
                let index = Math.floor(len / 2), pivot = arr.splice(index, 1)[0], left = [], right = [];
                arr.forEach(a => {
                    a < pivot ? left.push(a) : right.push(a);
                });
                return this.sort(left).concat([pivot], this.sort(right));
            }
        }
        example.QuickSorter = QuickSorter;
    })(example = JS.example || (JS.example = {}));
})(JS || (JS = {}));
var QuickSorter = JS.example.QuickSorter;
