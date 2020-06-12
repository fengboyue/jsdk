/// <reference path="../../../dist/jsdk.d.ts" /> 
JS.imports([
    '$jsfx.daterangepicker'
]).then(() => {
    new DateRangePicker({
        id:'txt1',
        placeholder: 'Choose dates limited in [2019/12/01, 2019/12/15]',
        minDate: '2019/12/01',
        maxDate: '2019/12/15',
        iniValue: ['2019/12/01', '2019/12/15']
    })
    new DateRangePicker({
        id:'txt2',
        placeholder: 'Choose dates + times',
        minutesPlus: true
    })
    new DateRangePicker({
        id:'txt3',
        placeholder: 'Prechoose from 2019/07/01 to Today',
        iniValue: ['2019/07/01', null]
    })
    new DateRangePicker({
        id:'txt4',
        placeholder: 'Prechoose from Today to 2030/07/01',
        iniValue: [null,'2030/07/01']
    })
    new DateRangePicker({
        id:'txt5',
        placeholder: 'autofocus',
        autofocus: true
    })
    new DateRangePicker({
        id:'txt6',
        placeholder: 'has no autoclear when readonly',
        readonly: true
    })

    new DateRangePicker({
        id:'fmt1',
        title: 'YY MM DD',
        format: 'YY MM DD',
        iniValue: ['19 07 01','19 08 01']
    })
    new DateRangePicker({
        id:'fmt2',
        title: 'M/D/YYYY HH:mm To M/D/YYYY HH:mm',
        format: 'M/D/YYYY HH:mm',
        minutesPlus: true,
        iniValue: ['7/1/2019 10:01','8/1/2019 22:12'],
        dateSeparator: ' To '
    })
    new DateRangePicker({
        id:'fmt3',
        title: 'M/D/YYYY A hh:mm:ss',
        format: 'M/D/YYYY A hh:mm:ss',
        secondsPlus: true,
        iniValue: ['7/1/2019 AM 10:01:23','8/1/2019 PM 10:12:59'],
        dateSeparator: '-'
    })

    var today = new Date(),
    ranges = {
        'Today': [today, today],
        'Yesterday': [today.clone().add(-1, 'd'), today.clone().add(-1, 'd')],
        'Last 7 Days': [today.clone().add(-6, 'd'), today],
        'Last 30 Days': [today.clone().add(-29, 'd'), today],
        'This Month': [today.getFirstDayOfMonth(), today.getLastDayOfMonth()],
        'Last Month': [today.clone().add(-1,'M').getFirstDayOfMonth(), today.clone().add(-1,'M').getLastDayOfMonth()]
    };
    new DateRangePicker({
        id:'ran1',
        ranges: ranges
    })
    new DateRangePicker({
        id:'ran2',
        ranges: ranges,
        showCalendars: false
    })

    new DateRangePicker({
        id:'sta1',
        title: 'Disabled',
        iniValue: ['2019/07/01','2019/08/01'],
        disabled: true
    })

    new DateRangePicker({
        id: 'sty1',
        placeholder: 'Icon + Buttons',
        colorMode: ColorMode.dark,
        leftAddon: {
            text:'PREV',
            colorMode: ColorMode.dark
        },
        rightAddon: {
            text:'NEXT',
            colorMode: ColorMode.dark
        },
        innerIcon: 'fa fa-calendar'
    })
    new DateRangePicker({
        id: 'sty2',
        placeholder: 'Icon + Buttons(Pill)',
        colorMode: ColorMode.accent,
        faceMode: [LineInputFaceMode.shadow, LineInputFaceMode.pill],
        leftAddon: {
            colorMode: ColorMode.info,
            text: 'PREV'
        },
        rightAddon: {
            colorMode: ColorMode.accent,
            text: 'NEXT'
        },
        innerIcon: 'fa fa-calendar'
    })
    var dropMenuItems = [{
        caption: 'Classes',
        text: 'JS.fx.Widget'
    },{
        text: 'JS.fx.FormWidget'
    },{
        text: 'JS.fx.Input'
    },{
        text: 'JS.fx.DateRangePicker'
    }];
    new DateRangePicker({
        id: 'sty3',
        placeholder: 'Right DropDown Buttons(Pill)',
        colorMode: ColorMode.accent,
        faceMode: [LineInputFaceMode.shadow, LineInputFaceMode.pill],
        leftAddon: {
            colorMode: ColorMode.info,
            text: 'LEFT'
        },
        rightAddon: {
            colorMode: ColorMode.accent,
            text: 'Inheritances',
            dropMenu: {
                dir:'right',
                items: dropMenuItems
            }
        }
    })

    new DateRangePicker({
        id: 'sty4',
        placeholder: 'Left DropDown Buttons(Round)',
        colorMode: ColorMode.accent,
        faceMode: [LineInputFaceMode.shadow, LineInputFaceMode.round],
        leftAddon: {
            colorMode: ColorMode.info,
            text: 'Inheritances',
            dropMenu: {
                dir: 'left',
                items: dropMenuItems
            }
        },
        rightAddon: {
            colorMode: ColorMode.accent,
            text: 'RIGHT'
        }
    })

    new DateRangePicker({
        id:'val1',
        autoValidate: true,
        title: 'Require(*)',
        validators: [{
            name: 'required',
            message: 'Must not be Empty!'
        }],
        validateMode: {
            mode: 'tip',
            place: 'top'
        }
    })
    new DateRangePicker({
        id:'val2',
        autoValidate: true,
        title: 'Must be 2019/12/31',
        validators: [{
            name: 'custom',
            validate: (val: string[])=>{
                if(!val) return false;
                return val[0]=='2019/12/31' && val[0]==val[1]
            },
            message: 'Must be [2019/12/31,2019/12/31]'
        }],
        validateMode: {
            mode: 'tip',
            place: 'bottom'
        }
    })
})    