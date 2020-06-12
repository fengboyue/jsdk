/// <reference path="../../../dist/jsdk.d.ts" /> 
JS.imports([
    '$jsfx.texteditor'
]).then(() => {

    let txt1 = new TextEditor({
        id: 'txt1',
        maxlength:100,
        width: 600,
        height:200,
        iniValue: 'This is ini Text.'
    })

    $('#btn1').click(()=>{
        txt1.load('data.json')
    })
    $('#btn2').click(()=>{
        txt1.clear()
    })
    $('#btn3').click(()=>{
        txt1.reset()
    })
    $('#btn4').click(()=>{
        JSLogger.info(txt1.value())
    })

    $('#btn5').click(()=>{
        txt1.insertText('<div>JS.fx.TextEditor</div>')
    })
    $('#btn6').click(()=>{
        txt1.insertLink('JS.fx.TextEditor');
    })
    $('#btn7').click(()=>{
        txt1.insertImage('https://www.w3.org/2015/10/W3C-Developers_Assets/W3C-Developers-Dark.png', function(img){
            img.css('width', img.width()/2);
            img.css('height', img.height()/2);
        })
    })
})