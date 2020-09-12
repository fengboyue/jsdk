JS FaceX its short name is <b>JSFX</b>, is a set of widgets provided by JSDK.
> The JSFX widgets require the browser to support CSS3.
> 
> The JSFX library depends on jQuery(v3.2.1+) and Bootstrap(v4+).
>
> Some of JSFX widgets depend on open fonts: FA(font-awesome v5.9) or LA(line-awesome v1.1).
>
> Some of JSFX widgets depend on open source widgets.

*Note*
* *All dependent libraries have been managed by JSDK, developers don't need to care details.*
* *If you had use lower version of these above class libraries in your project, please upgrade or check official document of the library to solve version compatibility.*

## Widgets List
widget name|alias|type|desc|depends module
---|---|---|---|---
Select|select|form widget||$jsfx.select
Radio|radio|form widget||$jsfx
Checkbox|checkbox|form widget||$jsfx
TextInput|textinput|form widget||$jsfx
EmailInput|emailinput|form widget||$jsfx
TelInput|telinput|form widget||$jsfx
NumberInput|numberinput|form widget||$jsfx
Password|password|form widget||$jsfx
TextArea|textarea|form widget||$jsfx
TextEditor|texteditor|form widget||$jsfx.texteditor
DatePicker|datepicker|form widget||$jsfx.datepicker
DateRangePicker|daterangepicker|form widget||$jsfx.daterangepicker
Uploader|uploader|form widget||$jsfx.uploader
Button|button|||$jsfx
Dialog|dialog|||$jsfx
Grid|grid||paged data grid|$jsfx
Progress|progress|||$jsfx
RangeSlider|rangeslider|||$jsfx.rangeslider
Switch|switch||on/off switch|$jsfx
Tab|tab|||$jsfx
Carousel|carousel|||$jsfx
Loading|loading||loading message box|$jsfx.loading
MessageBox|messagebox||message confirm box|$jsfx.messagebox
Popup|popup||tip box|$jsfx
Toast|toast||auto message box|$jsfx.toast
Sider|sider||float side window|$jsfx.sider


## Usage of widget
1. Add a div tag as widget tag in HTML and give its id.

```html
<div id="dp1" />
```

2. Load the module that the widget depends on in TS code and instantiate it.

```javascript
JS.imports([
    '$jsfx.datepicker' 
]).then(() => {
    let dp1 = new DatePicker({
        id:'dp1',
        placeholder: 'select a date between [2007-08-30, 2019-08-01]',
        defaultViewDate: '2019-01-01',
        minDate: '2007-08-30',
        maxDate: '2019-08-01'
    })
})    
```

## Event Listening
There are two methods for event listening of JSFX widget:

1. Add listening function at widget initialization.
```javascript
let btn = new Button({
    id:'el',
    text: 'BUTTON',
    listeners: {
        'click': ()=>{
            //do you want
        }
    }
})
```

2. Add listening function on widget instance.
```javascript
let btn = new Button({
    id:'el',
    text: 'BUTTON'
})
...
btn.on('click', ()=>{
    //do you want
})
```
* *Different widgets support different event types. Please see api doc for details.*

## Form Widget

### Sizes/Colors/Faces
Most form widgets of JSFX provide:
> Five sizes: hg/lg/md/sm/xs
>
> Ten colors: success/danger/warning/info/primary/secondary/accent/metal/light/dark
>
> Three faces: square/round/shadow

* *Some widgets have other face modes. Please see api doc for details.*<br>
* *If you need to customize the size or color or face, you can rewrite the css file of the widget or give new values to style vars predefined in the widget css.*

### Inner Layouts
Any form widget consists of two parts: <code>title</code> and <code>body</code>. You can assign their width values or percentages.

The title has two types of relative position:
- top: on the body
- left: left of the body

In addition, the inner text of title supports 9 location modes:
- lt: left-top
- lm: left-middle
- lb: left-bottom
- ct: center-top
- cm: center-middle
- cb: center-bottom
- rt: right-top
- rm: right-middle
- rb: right-bottom

[Form Sample](http://fengboyue.github.io/jsdk/examples/ui/formview/formview.html) shows a set of well laid out form widgets with all titles aligned right.

Its layout code is as follows:

```javascript
titleWidth: 120,
titlePlace: 'left',  //means title left and body right
titleTextPlace: 'rm' //right-middle
```

### Data & Value
The data of a widget is the list of selectable values of the widget, the value of a widget is a data item currently selected by user.

The data of a widget is read and written through the following api:

```javascript
wgt.data();//get data of wgt
wgt.data(['1','2','3']);//set data of wgt
wgt.load('xxx.json');//load data of wgt
```

The value of a widget is read and written through the following api:

```javascript
wgt.value();//get value of wgt
wgt.value('2');//set value 2 of wgt
```

### Data binding & Value binding
The form widgets of JSFX have two built-in properties: <code>dataModel/valueModel</code>, which provide the functions of data binding and value binding.

For example, if you modify the value of a widget object, the selected value of the widget on page will also be changed.
```javascript
let wgt = new Select({...});
wgt.value('1');//change the value first
```

Or you can reselect the value of the widget from page, and you will find that the value of the widget object will get the latest value.
```javascript
console.log(wgt.value());//select a new value on page first
```

### Value/iniValue and Reset
The value is the current value of a widget, the <code>iniValue</code> is default value when a widget be initiated.
After reset, the value of a widget will be overwritten by its <code>iniValue</code>.

Sample code:

```javascript
let data = [{
    id: '1',
    text: '111'
},{
    id: '2',
    text: '222'
},{
    id: '3',
    text: '333'
}];

let s1 = new Select({
    id: 's1',
    data: data,
    value: '2',
    iniValue: '3'
}) 
console.log(s1.value());//print '2'

s1.value('1');
console.log(s1.value());//print '1'

s1.reset();
console.log(s1.value());//print '3'

s1.iniValue('1');
s1.reset();
console.log(s1.value());//print '1'
```

### Validate
You can configure validators at initialization, such as:

```javascript
let chk = new Checkbox({
    id: 'el',
    data: data,
    validators: [{
        name: 'required',//required validator
        message: 'You must select one!'
    }, {
        name: 'custom',//custom validator
        message: 'You must select <small>!',
        validate: (val:string[]) => {
            if(!val) return false;
            return val.findIndex((v)=>{return v=='2'})>-1
        }
    }],
    listeners: {
        validated: (e, rst: ValidateResult, val: string, field: string) => {//validate event
            if (rst.hasError()) JSLogger.info(rst.getErrors(field))
        }
    }
});
```

JSFX supports five types of <code>validators</code>:
> required
>
> format
>
> range
>
> length
>
> custom

* *Please see api doc for parameters description of each validator*


### Form View
There are usually many widgets in a form. If each widget is instantiated like the above code, a lot of redundant code will be written.
So JSDK provides <b>FormView</b> class to manage all widgets in a form, batch simplifies the following operations: instantiation, destruction, value reading and writing, value reset, value validating, etc.

1. Add a form container and widget tags in HTML:

```html
<div id="fv1">
    <div id="first_name" js-wgt="textinput" /> <!-- The "js-wgt" attribute should be filled in the alias of widget. -->
    <div id="last_name" js-wgt="textinput" />
    <div id="submit" js-wgt="button" />    
</div>
```
2. Define <b>MyFormView</b> class in TS: 

```javascript
module JS {
    export namespace examples {
        @compo('JS.examples.MyFormView')
        export class MyFormView extends FormView {
            initialize() {
                this._config = {
                    defaultConfig: <InputConfig<any>>{
                        colorMode: ColorMode.accent,
                        sizeMode: SizeMode.sm,
                        placeholder: 'please input...',
                        titleWidth: 120,
                        validateMode: {
                            mode: 'tip',
                            place: 'left'
                        },
                        validators: [{
                            name: 'required',
                            message: 'Required'
                        }]
                    },
                    widgetConfigs: {
                        'first_name': <TextInputConfig>{
                            title: 'First Name:'
                        },
                        'last_name': <TextInputConfig>{
                            title: 'Last Name:'
                        },
                        'submit': <ButtonConfig>{
                            text: 'Submit',
                            colorMode: ColorMode.info,
                            listeners: {
                                click: () => {
                                    JSLogger.info(this.values());//Returns formview values
                                }
                            }
                        }
                    }
                };
                super.initialize();
            }
        }
    }
}
import MyFormView = JS.examples.MyFormView;
```

3. Use <b>MyFormView</b> in TS/JS:

```javascript
JS.imports([
    '$jsui',
    'MyFormView.js'
]).then(() => {
    let fv = new MyFormView();
    fv.initialize();
    fv.render();
    //or: 
    //let fv = Compos.get<MyFormView>(MyFormView);
    //fv.render();
})
```

* *[Full FormView Sample](http://fengboyue.github.io/jsdk/examples/ui/formview/formview.html)*


## I18N
The config item <code>i18n</code> of a widget is its i18n resources, the config item <code>locale</code> of a widget is its locale.
Within JSFX widgets, use the <b>JS.util.I18N</b> class to read international texts from resource.

### Definition of resource
For example, the <code>i18n</code> item of <b>Grid</b> only defines English resource by default.
Suppose you need to add Chinese resource for displaying Chinese text, there are two ways.

<b>[Way 1]</b><br>  
Add Chinese resource data for <b>Grid</b> in JS code.

You can add to the static resource property of Grid class (effective for all grids):
```javascript
Grid.I18N = {
    en: {
        firstPage: 'First Page',
        lastPage: 'Last Page',
        previousPage: 'Previous Page',
        nextPage: 'Next Page',
        rowsInfo: '{beginRow} - {endRow} of {total} records',
        empty: 'No data found.',
        loadingMsg: 'Loading...'
    },
    zh: {
        firstPage: '首页',
        lastPage: '未页',
        previousPage: '上一页',
        nextPage: '下一页',
        rowsInfo: '第{beginRow}条到第{endRow}条，共{total}条',
        empty: '无数据',
        loadingMsg: '加载中...'
    }
}
```

Or you can add to a grid object (effective for the object):
```javascript
let grid = new Grid({
    i18n: {
        en: {
            firstPage: 'First Page',
            lastPage: 'Last Page',
            previousPage: 'Previous Page',
            nextPage: 'Next Page',
            rowsInfo: '{beginRow} - {endRow} of {total} records',
            empty: 'No data found.',
            loadingMsg: 'Loading...'
        },
        zh: {
            firstPage: '首页',
            lastPage: '未页',
            previousPage: '上一页',
            nextPage: '下一页',
            rowsInfo: '第{beginRow}条到第{endRow}条，共{total}条',
            empty: '无数据',
            loadingMsg: '加载中...'
        }
    }
})
```

<b>[Way 2]</b><br>  
Add resource files for <b>Grid</b>, which is recommended.

Add the following two resource files to "/libs/jsdk/grid/".
1. <code>grid_en.json</code>

```json
{
    "firstPage": "First Page",
    "lastPage": "Last Page",
    "previousPage": "Previous Page",
    "nextPage": "Next Page",
    "rowsInfo": "{beginRow} - {endRow} of {total} records",
    "empty": "No data found.",
    "loadingMsg": "Loading..."
}
```
2. <code>grid_zh.json</code>

```json
{
    "firstPage": "首页",
    "lastPage": "末页",
    "previousPage": "上一页",
    "nextPage": "下一页",
    "rowsInfo": "第{beginRow}条到第{endRow}条，共{total}条",
    "empty": "无数据",
    "loadingMsg": "加载中..."
}
```
Then add the following code:
```
Grid.I18N = '/libs/jsdk/grid/grid.json'; //web server path
```

### Display in language
We initialize a grid object and set it to display in Chinese:
```javascript
let grid = new Grid({
    locale: 'zh'
})
```
We can also change the grid object to display in English:
```javascript
grid.locale('en');
grid.render();
```

## Custom Styles
The recommended way is to assign new values to predefined CSS variables for this widget, which requires the browser to support CSS3.

For example: we need a button with white text on black background.

1. Add a new button style to your HTML code:

```html
<style>
.jsfx-button.blackbutton{ //Our new style name is blackbutton
    --bgcolor: black;     //Predefined variables for Button can be found in the head of "/saas/_button.scss".
    --bdcolor: black;
    --color: white;
    --hover-bgcolor: white;
    --hover-color: black;
}    
</style>    
```

Or add the new button stype in JS code:

```javascript
Dom.applyStyle(`
    .jsfx-button.blackbutton{
        --bgcolor: black;
        --bdcolor: black;
        --color: white;
        --hover-bgcolor: white;
        --hover-color: black;
    }
`);
```

2. Use the new style name at initialization:

```javascript
new Button({
    id: 'btn1',
    text: 'This is a black button',
    cls: 'blackbutton' //set to new style name
})
```
<br>   

*If predefined variables of a widget can not meet your custom requirements, you can also try the following ways:*<br>
* *Load a new css file, overwrite the styles in jsfx.css.*<br>
* *Modify its SCSS file of the widget and recompile it to jsfx.css. But you should understand that this is a temporary approach.*<br>
* *Email me to describe your special requirements. Maybe I can or can't solve it.*

## Custom Widget
Suppose you want to wrap your own widget or an open widget to a JSFX widget.

For example, you want to wrap <code>xpicker</code>(a fictitious open source time-picker) to a JSFX form widget.

1. Place its source files in the <code>libs</code> directory:

```
- libs/        
    - xpicker/ 
        - 1.0.0/
            xpicker.js
            xpicker.min.ts
            xpicker.css
            xpicker.min.css
            xpicker.d.ts     //The type definition file of TS, which can be added if necessary 
            - i18n/          //The i18n resource folder, which can be added if necessary
                en.js
                zh.js
```

2. Add new module definition to your <code>jsdk-config.js</code>:

```
'xpicker': [
    '$jsfx',
    '~/xpicker/1.0.0/xpicker.css', 
    '~/xpicker/1.0.0/xpicker.js',  
    '~/xpicker/1.0.0/XPicker.js',  //Compiled file of the new wrapper class "Xpicker"
],
```

3. Create <code>XPicker.ts</code> file:

```javascript
/// <reference path="../libs/jsdk/{JSDK-VERSION}/jsdk.d.ts" />
/// <reference path="../libs/xpicker/1.0.0/xpicker.d.ts" />
module My {
    export namespace fx {
        export type XPickerEvents = InputEvents | 'event1' | 'event2';
        export interface XPickerListeners extends InputListeners<XPicker> {
            event1?: EventHandler<XPicker>;
            event2?: EventHandler<XPicker>;
        }

        export class XPickerConfig extends LineInputConfig<XPicker> {
            ... //define more properties
            listeners?: XPickerListeners;
        }

        @widget('My.fx.XPicker') //default alias is xpicker the lowercase of short class name
        export class XPicker extends LineInput {

            constructor(cfg: XPickerConfig) {
                super(cfg);
            }

            //override these parent methods

            public value(val?: string | Date, silent?: boolean): any {
                ...
            }

            protected _renderValue() {
                ...
            }

            protected _inputHtml() {
                ...
            }

            protected _onBeforeRender() {
                ...
            }

            protected _onAfterRender() {
                ...
                this._mainEl.on('input change blur', () => {
                    let newVal = this._mainEl.val();
                    if(this.value()!=newVal) this._setValue(newVal);
                });

                super._onAfterRender()
            }

            protected _destroy(): void {
                ...
                super._destroy()
            }
        }
    }
}
```

4. Compile the above ts file to its library directory.

The compile script file <code>build-xpicker.sh</code>:
```
tsc -d --target es6 -p xpicker.json
uglifyjs ../libs/xpicker/1.0.0/XPicker.js --warn --ecma 6 -o ../libs/xpicker/1.0.0/XPicker.min.js
```

The compile config file <code>xpicker.json</code>:
```json
{
    "extends":"../build/base",
    "compilerOptions": {
        "outFile": "../libs/xpicker/1.0.0/XPicker.js",
        "noLib": true
    },
    "include": [
        "../source/widget/XPicker.ts"
    ]
} 
```

5. Use <b>XPicker</b> class in TS/JS code:

```javascript
JS.imports([
    '$xpicker' //load xpicker library
]).then(() => {
    let dp = new My.fx.XPicker({
        ...
    })
})    
```

## More Examples
Please visit [JSFX Examples](http://fengboyue.github.io/jsdk/examples/jsfx/)