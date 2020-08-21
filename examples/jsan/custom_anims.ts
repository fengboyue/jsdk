/// <reference path='../../dist/jsdk.d.ts' /> 
JS.imports('$jsan').then(() => {
    let cfg = <AnimInit>{
        autoReverse: true,
        autoReset: true,
        duration: 5000,
        loop: 4
    };

    let anim1 = new CustomAnim(<any>Jsons.union(cfg, <CustomAnimInit>{
        target: '#div1',
        cycle: function(el, t){
            
        }
    }))
        
        // <any>Jsons.union(cfg, {
        // target: '#div1',
        // cycle: (el, t)=>{

        // }
    // }));
    // let anim2 = new CustomAnim(<any>Jsons.union(cfg, <CustomAnimConfig>{
    //     target: '#div2'
    // }));

    $1('#btn1').on('click', () => {
       
    })
    $1('#btn2').on('click', () => {
        
    })

})
