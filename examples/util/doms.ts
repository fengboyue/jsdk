/// <reference path='../../dist/jsdk.d.ts' /> 

$1('#loadHtml').on('click',()=>{
    Dom.loadHTML('html.html', true, false, '#html', (doc)=>{
        let nodes = doc.getElementsByTagName('mybutton');
        if(nodes) for(let i=0,len = nodes.length;i<len;i++) {
            let node = nodes[i];
            Dom.rename(node, 'button');
        }
        return doc
    }).then((url)=>{
        JSLogger.info(url)
    })
})
$1('#loadFragment').on('click',()=>{
    Dom.loadHTML('fragment.html', true, false, '#html').then((url)=>{
        JSLogger.info(url)
    })
})
$1('#loadCss').on('click',()=>{
    Dom.loadCSS('blue.css').then((url)=>{
        JSLogger.info(url)
    })
})