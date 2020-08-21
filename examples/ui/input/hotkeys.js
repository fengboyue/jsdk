JS.imports([
    '$jsui'
]).then(() => {
    let kb1 = new Keys(), kb2 = new Keys($1('#tt')), isON = true, on = () => {
        isON = true;
        kb1.onKeyDown('a + d + enter', function (e) {
            $1('#info').innerHTML += `<div>You press ${e.type}</div>`;
            return false;
        });
        kb1.onKeyUp('a', function (e, kb) {
            $1('#info').innerHTML += `<div>You hold ${e.type} for ${e.timeStamp - kb.getKeyDownTime(e.keyCode)}ms</div>`;
            return false;
        });
        kb2.onKeyDown('ctrl+v', function (e) {
            $1('#info').innerHTML += `<div>You press ${e.type} on Textarea#${this.id}</div>`;
            return false;
        });
        $1('#info').innerHTML += `<div>You set ON!</div>`;
    }, off = () => {
        isON = false;
        kb1.off();
        kb2.off();
        $1('#info').innerHTML += `<div>You set OFF!</div>`;
    };
    $1('#switch').on('click', (ev) => {
        isON ? off() : on();
    });
    on();
});
