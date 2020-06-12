var JS;
(function (JS) {
    let example;
    (function (example) {
        class SortThread extends Thread {
            run() {
                this.imports('/examples/lang/QuickSorter.js');
                this.onposted((numbers) => {
                    let sorted = new JS.example.QuickSorter().sort(numbers);
                    this.callMain('print', sorted);
                });
            }
            print(numbers) {
                let html = '';
                numbers.forEach(n => {
                    html += `${n}<br/>`;
                });
                $1('#sorted1').html(html);
            }
            sort(numbers) {
                this.start();
                this.postThread(numbers);
            }
        }
        example.SortThread = SortThread;
    })(example = JS.example || (JS.example = {}));
})(JS || (JS = {}));
var SortThread = JS.example.SortThread;
