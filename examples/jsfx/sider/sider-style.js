JS.imports([
    '$jsfx.sider'
]).then(() => {
    let over1 = new Sider({
        title: 'Over:left'
    });
    $('#btn1').click(() => {
        over1.toggle();
    });
    let over2 = new Sider({
        title: 'Over:right',
        place: 'right'
    });
    $('#btn2').click(() => {
        over2.toggle();
    });
    let overlay1 = new Sider({
        title: 'Overlay:left',
        faceMode: SiderFaceMode.overlay
    });
    $('#btn3').click(() => {
        overlay1.toggle();
    });
    let overlay2 = new Sider({
        title: 'Over:right',
        faceMode: SiderFaceMode.overlay,
        place: 'right'
    });
    $('#btn4').click(() => {
        overlay2.toggle();
    });
    let push1 = new Sider({
        title: 'Push:left',
        faceMode: SiderFaceMode.push
    });
    $('#btn5').click(() => {
        push1.toggle();
    });
    let push2 = new Sider({
        title: 'Push:right',
        faceMode: SiderFaceMode.push,
        place: 'right'
    });
    $('#btn6').click(() => {
        push2.toggle();
    });
    let lay1 = new Sider({
        title: 'My Head Demo <img src="https://img.icons8.com/windows/24/000000/circled-left-2.png">',
        titleCls: 'my-head',
        html: '<div>This is a demo.</div>'
    });
    $('#btn7').click(() => {
        lay1.toggle();
    });
});
