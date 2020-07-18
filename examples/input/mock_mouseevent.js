JS.imports([
    '$jsinput'
]).then(() => {
    $1('#btn').on('click', (e) => {
        let button = ['LEFT', 'MIDDLE', 'RIGHT'];
        $1('#info').innerHTML += `<div>MouseButton: ${button[e.button]}</div>`;
        Konsole.print(e);
        return false;
    });
    window.on('click', (e) => {
        alert('click window, mouse button:' + e.button);
    });
    UIMocker.fireMouseEvent('click', {
        button: MouseButton.RIGHT
    });
    $L('ul button').forEach(b => {
        b.on('click', () => {
            UIMocker.fireMouseEvent('click', {
                target: $1('#btn'),
                button: Number(b.attr('data-button'))
            });
            return false;
        });
    });
});
