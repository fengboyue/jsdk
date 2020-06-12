/// <reference path="../../../dist/jsdk.d.ts" /> 
JS.imports([
    '$jsfx.uploader'
]).then(() => {
    let cfg = {
        accept: {
            title: 'Words',
            extensions: 'doc,docx'
        },
        maxNumbers: 3,
        maxSingleSize: Files.ONE_KB*100,
        maxTotalSize: Files.ONE_KB*300
    };

    let localCfg = Jsons.union(cfg, {
        i18n: {
            en: Uploader.I18N,
            zh: {
                pickTitle: '请选择你的本地文件',
                pickTip: '<文件限制>\n文件类型为{fileExts}\n总文件尺寸为{maxTotalSize}\n最大文件数{maxNumbers}个\n单个文件最大为{maxSingleSize}',
                retryTip: '重试',
                removeTip: '删除',
                viewDenied: '在本地模式下此文件不可查看',
                exceedMaxSize:'超出了单个文件最大尺寸',
                wrongDuplicate: '不可上传重复文件',
                wrongType: '错误的文件类型',
                exceedNumbers: '超出了文件最大数量',
                exceedMaxTotalSize: '超出了文件总最大尺寸'
            }
        }
    })
    new Uploader(Jsons.union(localCfg, {
        id:'up1',
        title: '中文：',
        locale:'zh'
    }));
    $('#up1-btn1').click(()=>{
        new Uploader(Jsons.union(localCfg, {
            id:'up1',
            title: '中文：',
            locale:'zh'
        }));
    })
    $('#up1-btn2').click(()=>{
        new Uploader(Jsons.union(localCfg, {
            id:'up1',
            title: 'English:',
            locale:'en'
        }));
    })

    let remoteCfg = Jsons.union(cfg, {
        i18n: 'i18n.json',
    });

    new Uploader(Jsons.union(remoteCfg, {
        id:'up2',
        title: '中文：',
        locale:'zh'
    }));
    $('#up2-btn1').click(()=>{
        new Uploader(Jsons.union(remoteCfg, {
            id:'up2',
            title: '中文：',
            locale:'zh'
        }));
    })
    $('#up2-btn2').click(()=>{
        new Uploader(Jsons.union(remoteCfg, {
            id:'up2',
            title: 'English:',
            locale:'en'
        }));
    })

})