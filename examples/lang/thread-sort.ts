/// <reference path="SortThread.ts" /> 
JSLogger.level = LogLevel.ALL;

let numbers = [],
    thread1 = new SortThread(),
    thread2 = new SortThread({
        run: 'sort-thread.js',
        print(numbers) {
            let html = '';
            numbers.forEach(n => {
                html += `${n}<br/>`;
            });
            $1('#sorted2').innerHTML = html;
        }
    }),
    random = function () {
        let max = 10000;
        for (let i = 0; i < max; i++) {
            numbers[i] = Random.number(max, true);
        }
        let html = '';
        numbers.forEach(n => {
            html += `${n}<br/>`
        })
        $1('#unsort').innerHTML = html;
    };

$1('#random').on('click',() => {
    random()
});
$1('#sort1').on('click',() => {
    thread1.terminate();
    thread1.sort(numbers);
});
$1('#sort2').on('click',() => {
    thread2.terminate();
    thread2.sort(numbers);
});
