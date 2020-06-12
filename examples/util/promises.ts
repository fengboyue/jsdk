/// <reference path='../../dist/jsdk.d.ts' /> 
//PromisePlan a
let a = Promises.createPlan<string>(function () {
    let s='a';
    Konsole.print('a:'+s);
    this.resolve(s);
});

//PromisePlan b
let b = Promises.createPlan<string>(function (s) {
    s+='b';
    Konsole.print('b:'+s);
    this.resolve(s);
});

//PromisePlan c
let c = Promises.createPlan<string>(function (s) {
    s+='c';
    Konsole.print('c:'+s);
    this.resolve(s);
});

$1('#order').on('click',() => {    
    Promises.order([a, b, c]).then((s) => {
        Konsole.print('The result of order mode = ' + s);
    });
})
$1('#all').on('click',() => {
    Promises.all([a, b, c]).then((s) => {
        Konsole.print('The result of all mode = ' + s);
    });
})
$1('#race').on('click',() => {
    Promises.race([a, b, c]).then((s) => {
        Konsole.print('The result of race mode = ' + s);
    });
})
