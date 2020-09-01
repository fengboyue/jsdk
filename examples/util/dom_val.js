let printVal = (el) => {
    Konsole.print(el.id + '\'s value is:', el.val());
};
$1('#get').on('click', () => {
    printVal($1('#p'));
    printVal($1('#c2'));
    printVal($1('#r3'));
    printVal($1('#s1'));
    printVal($1('#s2'));
    printVal($1('#t'));
});
$1('#set').on('click', () => {
    $1('#p').val('this is input');
    $1('#c2').val(['2']);
    $1('#r3').val('2');
    $1('#s1').val('green');
    $1('#s2').val(['red', 'green', 'blue']);
    $1('#t').val('this is textarea');
});
