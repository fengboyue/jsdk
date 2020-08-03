/// <reference path='../../dist/jsdk.d.ts' /> 
JS.imports([
    '$handlebars#async',
    '$jsui'
]).then(()=>{
    let te = new Templator(), array = [];
    for (let i = 0; i < 100000; i++) {
        array[i] = { val: i + 1 };
    }
    
    $1('#btn1').on('click', () => {
        let html = te.compile('{{#.}}Number: {{val}}<br/>{{/.}}')(array);
        $1('#container1').innerHTML = html;
    })
    
    $1('#btn2').on('click', () => {
        let json = {
            val: 9999
        }
        let html = te.compile('Number: {{val}}<br/>')(json);
        $1('#container1').innerHTML = html;
    })
})
