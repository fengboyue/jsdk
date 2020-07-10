let a = Promises.createPlan(function () {
    let s = 'a';
    Konsole.print('a:' + s);
    this.resolve(s);
});
let b = Promises.createPlan(function (s) {
    s += 'b';
    Konsole.print('b:' + s);
    this.resolve(s);
});
let c = Promises.createPlan(function (s) {
    s += 'c';
    Konsole.print('c:' + s);
    this.resolve(s);
});
$1('#order').on('click', () => {
    Promises.order([a, b, c]).then((s) => {
        Konsole.print('The result of "order" mode = ' + s);
    });
});
$1('#all').on('click', () => {
    Promises.all([a, b, c]).then((s) => {
        Konsole.print('The result of "all" mode = ' + s);
    });
});
$1('#race').on('click', () => {
    Promises.race([a, b, c]).then((s) => {
        Konsole.print('The result of "race" mode = ' + s);
    });
});
