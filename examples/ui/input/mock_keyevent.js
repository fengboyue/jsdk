JS.imports([
    '$jsui'
]).then(() => {
    let fn = function (type, e) {
        $1('#info').innerHTML += `<div>Event: ${type}; KeyCode: ${e.keyCode}</div>`;
        Konsole.print(e);
    };
    window.on('keydown', (e) => {
        fn('keydown', e);
    });
    window.on('keyup', (e) => {
        fn('keyup', e);
    });
    let fire = function (type, el) {
        Keyboards.fireEvent(type, { keyCode: VK[el.attr('data-key')] });
    };
    $L('button').forEach(b => {
        b.on('mousedown', () => {
            fire('keydown', b);
        });
        b.on('mouseup', () => {
            fire('keyup', b);
        });
    });
});
