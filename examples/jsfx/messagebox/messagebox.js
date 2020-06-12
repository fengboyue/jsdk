JS.imports([
    '$jsfx.messagebox'
]).then(() => {
    var btn1 = new Button({
        id: 'btn1',
        text: 'warning',
        colorMode: ColorMode.warning,
        listeners: {
            click: function () {
                MessageBox.show({
                    type: 'warning',
                    text: "Please click the button!",
                    imageWidth: 50,
                    imageHeight: 50
                });
            }
        }
    });
    var btn2 = new Button({
        id: 'btn2',
        text: 'error',
        colorMode: ColorMode.danger,
        listeners: {
            click: function () {
                MessageBox.show({
                    type: 'error',
                    text: "Please click the button!"
                });
            }
        }
    });
    var btn3 = new Button({
        id: 'btn3',
        text: 'Success',
        colorMode: ColorMode.success,
        listeners: {
            click: function () {
                MessageBox.show({
                    type: 'success',
                    text: "Please click the button!"
                });
            }
        }
    });
    var btn4 = new Button({
        id: 'btn4',
        text: 'info',
        colorMode: ColorMode.info,
        listeners: {
            click: function () {
                MessageBox.show({
                    type: 'info',
                    text: "Please click the button!"
                });
            }
        }
    });
    var btn5 = new Button({
        id: 'btn5',
        text: 'question',
        colorMode: ColorMode.primary,
        listeners: {
            click: function () {
                MessageBox.show({
                    type: 'question',
                    title: "JSDK is BEST?",
                    showCancelButton: true,
                    text: "Please click the button!"
                });
            }
        }
    });
    var btn6 = new Button({
        id: 'btn6',
        text: '自定义',
        colorMode: ColorMode.dark,
        listeners: {
            click: function () {
                MessageBox.show({
                    title: "About JSDK",
                    text: "Do you think JSDK is BEST?",
                    confirmButtonText: "<i class='la la-thumbs-up'></i><span>Yes, I agree</span>",
                    showCancelButton: true,
                    cancelButtonText: "<i class='la la-thumbs-down'></i><span>No, I don\'t think so</span>",
                }).then(function (result) {
                    let by = result.dismiss ? ` be dismissed by "${result.dismiss}"` : ` be confirmed`;
                    JSLogger.info(`"${MessageBox.getTitle()}"${by}`, 'Your selection is:' + (result.value == true ? 'Agreed' : 'Not agreed'));
                });
            }
        }
    });
});
