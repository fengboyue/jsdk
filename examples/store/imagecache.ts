/// <reference path='../../dist/jsdk.d.ts' /> 
JS.imports('$jsds').then(() => {
    let cache = new ImageCache();
    cache.load([
        {
            id: '1',
            url: '../jsfx/carousel/greatwall.jpg'
        }
    ]).then(()=>{
        (<HTMLImageElement>$1('#img1')).src = cache.get('1').src;
    })
})
