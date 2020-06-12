/// <reference path="../../../dist/jsdk.d.ts" /> 
JS.imports([
    '$jsfx.uploader'
]).then(() => {
    let files = [
        {
            "id": "001",
            "name": "123.jpg",
            "uri": "http://www.w3school.com.cn/ui2017/icon2.png"
        },
        {
            "id": "002",
            "name": "345.jpg",
            "uri": "http://www.w3school.com.cn/ui2017/icon4.png"
        },
        {
            "id": "003",
            "name": "789.jpg",
            "uri": "http://www.w3school.com.cn/ui2017/icon4.png"
        }
    ];
    let fn = function (e: Event, ...args) {
        Assert.true(Types.isKlass(this, Uploader));
        Assert.true(Types.ofKlass(e, Event));
        JSLogger.info((<Uploader>this), e.type, args);
    }, listeners = {
        adding: <any>fn,
        added: fn,
        removed: fn,
        uploading: fn,
        uploadprogress: fn,
        uploadsuccess: fn,
        uploadfailure: fn,
        uploaded: fn,
        beginupload: fn,
        endupload: fn,
        changed: fn
    };

    new Uploader({
        id:'dnd1',
        title: 'List-Mode:',
        titlePlace: 'top',
        tip: 'Support for drag and drop file to the uploader',
        dnd: true
    })
    new Uploader({
        id:'dnd2',
        title: 'Image-Mode:',
        titlePlace: 'top',
        tip: 'Support for drag and drop file to the uploader',
        faceMode: UploaderFaceMode.image,
        dnd:true
    })

    new Uploader({
        id:'copy1',
        title: 'Paste to this widget',
        titlePlace: 'top',
        tip: 'Support for clipboard copy and paste to the uploader',
        paste: true
    })
    new Uploader({
        id:'copy2',
        title: 'Paste to the body',
        titlePlace: 'top',
        tip: 'Support for clipboard copy and paste to the uploader',
        faceMode: UploaderFaceMode.image,
        paste:'body'
    })

    new Uploader({
        id:'limit1',
        maxNumbers: 3,
        maxSingleSize: Files.ONE_KB*100,
        maxTotalSize: Files.ONE_KB*300,
        duplicate: true
    })
    new Uploader({
        id:'limit2',
        accept: MimeFiles.IMAGE_FILES,
        duplicate: true
    })
    
    let add = new Uploader({
        id:'add',
        listeners: listeners
    })
    $('#add-btn1').click(()=>{
        add.add(files[0])
    })
    $('#add-btn2').click(()=>{
        add.remove(files[0].id)
    })
    $('#add-btn3').click(()=>{
        add.value(files)
    })
    $('#add-btn4').click(()=>{
        add.clear()
    })
    $('#add-btn5').click(()=>{
        Konsole.print(add.value())
    })

    let load = new Uploader({
        id:'load'
    })
    $('#load-btn1').click(()=>{
        load.load('data.json')
    })
    $('#load-btn2').click(()=>{
        load.data(null)
    })
    $('#load-btn3').click(()=>{
        Konsole.print(load.data())
    })

    let crud = new Uploader({
        id:'crud'
    })
    $('#crud-btn1').click(()=>{
        Konsole.print(crud.iniValue())
    })
    $('#crud-btn2').click(()=>{
        crud.iniValue(files, true)
    })
    $('#crud-btn3').click(()=>{
        crud.add(files[0])
    })
    $('#crud-btn4').click(()=>{
        crud.remove(files[0].id)
    })
    $('#crud-btn5').click(()=>{
        crud.clear()
    })
    $('#crud-btn6').click(()=>{
        crud.reset()
    })
    $('#crud-btn7').click(()=>{
        crud.value(files)
    })
    $('#crud-btn8').click(()=>{
        Konsole.print(crud.value())
    })
    $('#crud-btn9').click(()=>{
        Konsole.print(crud.crudValue())
    })

    let val1 = new Uploader({
        id: 'val1',
        title: 'Required <span class="text-danger">*</span>',
        validators: [{
            name: 'required',
            message: 'The <val1> uploader has at least one file!'
        }]
    })
    $('#chk').click(()=>{
        val1.validate()
    })

})