JS.imports([
    '$jsfx.uploader'
]).then(() => {
    let val = [{
            id: '1',
            name: 'w3c-logo.png',
            uri: 'https://www.w3.org/2008/site/images/logo-w3c-screen-lg.png'
        }, {
            id: '2',
            name: 'w3c-logo.doc',
            uri: 'https://www.w3.org/2008/site/images/logo-w3c-screen-lg.doc'
        }];
    new Uploader({
        id: 'face1',
        title: 'List-Mode:',
        faceMode: UploaderFaceMode.list
    });
    new Uploader({
        id: 'face2',
        title: 'Image-Mode:',
        faceMode: UploaderFaceMode.image
    });
    new Uploader({
        id: 'face3',
        title: 'Round-Mode:',
        faceMode: UploaderFaceMode.round
    });
    new Uploader({
        id: 'face4',
        title: 'Shadow-Mode:',
        faceMode: UploaderFaceMode.shadow
    });
    new Uploader({
        id: 'size1',
        title: 'hg:',
        iniValue: val,
        sizeMode: SizeMode.hg
    });
    new Uploader({
        id: 'size2',
        title: 'lg:',
        iniValue: val,
        sizeMode: SizeMode.lg
    });
    new Uploader({
        id: 'size3',
        title: 'md:',
        iniValue: val,
        sizeMode: SizeMode.md
    });
    new Uploader({
        id: 'size4',
        title: 'sm:',
        iniValue: val,
        sizeMode: SizeMode.sm
    });
    new Uploader({
        id: 'size5',
        title: 'xs:',
        iniValue: val,
        sizeMode: SizeMode.xs
    });
    new Uploader({
        id: 'size6',
        title: 'hg:',
        iniValue: val,
        faceMode: UploaderFaceMode.image,
        sizeMode: SizeMode.hg
    });
    new Uploader({
        id: 'size7',
        title: 'lg:',
        iniValue: val,
        faceMode: UploaderFaceMode.image,
        sizeMode: SizeMode.lg
    });
    new Uploader({
        id: 'size8',
        title: 'md:',
        iniValue: val,
        faceMode: UploaderFaceMode.image,
        sizeMode: SizeMode.md
    });
    new Uploader({
        id: 'size9',
        title: 'sm:',
        iniValue: val,
        faceMode: UploaderFaceMode.image,
        sizeMode: SizeMode.sm
    });
    new Uploader({
        id: 'size10',
        title: 'xs:',
        iniValue: val,
        faceMode: UploaderFaceMode.image,
        sizeMode: SizeMode.xs
    });
    let sta1 = new Uploader({
        id: 'sta1',
        title: 'disabled:',
        titlePlace: 'top',
        faceMode: UploaderFaceMode.list,
        iniValue: val
    }).disable();
    $('#sta1-btn1').click(() => {
        sta1.disable();
    });
    $('#sta1-btn2').click(() => {
        sta1.enable();
    });
    let sta2 = new Uploader({
        id: 'sta2',
        title: 'disabled:',
        titlePlace: 'top',
        faceMode: UploaderFaceMode.image,
        iniValue: val
    }).disable();
    $('#sta2-btn1').click(() => {
        sta2.disable();
    });
    $('#sta2-btn2').click(() => {
        sta2.enable();
    });
    let sta3 = new Uploader({
        id: 'sta3',
        title: 'readonly:',
        titlePlace: 'top',
        faceMode: UploaderFaceMode.list,
        iniValue: val
    }).readonly(true);
    $('#sta3-btn1').click(() => {
        sta3.readonly(true);
    });
    $('#sta3-btn2').click(() => {
        sta3.readonly(false);
    });
    let sta4 = new Uploader({
        id: 'sta4',
        title: 'readonly:',
        titlePlace: 'top',
        faceMode: UploaderFaceMode.image,
        iniValue: val
    }).readonly(true);
    $('#sta4-btn1').click(() => {
        sta4.readonly(true);
    });
    $('#sta4-btn2').click(() => {
        sta4.readonly(false);
    });
    Dom.applyStyle(`.jsfx-uploader.green {
            --pick-color: #fff;
            --pick-bgcolor: #44ab47;
            --bdcolor: green;
            --file-color: green;
        }`);
    new Uploader({
        id: 'sty1',
        faceMode: UploaderFaceMode.image,
        iniValue: val,
        cls: 'green'
    });
});
