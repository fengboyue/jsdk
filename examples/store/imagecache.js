let cache = new ImageCache();
cache.load([
    {
        id: '1',
        url: '../jsfx/carousel/greatwall.jpg'
    }
]).then(() => {
    $1('#img1').src = cache.get('1').src;
});
