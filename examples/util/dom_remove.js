$1('#rmDiv').on('click', () => {
    $1('#html').remove();
});
$1('#rmLink').on('click', () => {
    $1('#html').remove('li:first-child');
});
