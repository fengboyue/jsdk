JS FaceX简称JSFX，是JSDK自带的一组widgets。
> JSFX组件样式需要浏览器支持CSS3。
> 
> JSFX组件依赖：jQuery(v3.2.1+)／Bootstrap(v4+)。 
>
> 其中一些组件依赖第三方开源字库： FA(font-awesome v5.9)或LA(line-awesome v1.1)
>
> 其中一些组件依赖第三方开源组件。

*备注：*
* *所有依赖已被JSDK的全局配置文件（jsdk-config.js）管理，开发人员无需关注细节。*
* *如你的项目中使用了上述类库的更低版本，请自行升级或查阅类库官方文档以解决版本兼容问题。*

## 组件清单
组件短类名|别名|类别|描述|依赖模块名
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


## 组件使用
1. 在HTML中添加DIV标签作为组件标签并给出其id。

```html
<div id="dp1" />
```

2. 在TS代码中加载组件所依赖的模块且实例化。

```javascript
JS.imports([
    '$jsfx.datepicker' //加载DatePicker依赖的模块名
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

## 事件监听
JSFX组件的事件监听有两种方式：

1、在组件初始化时添加监听函数
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

2、在组件初始化后添加监听函数
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
* *不同的组件支持不同的事件名，具体请查阅API文档。*

## 表单组件

### 尺寸／颜色／外观
JSFX的大多数表单型组件提供:
> 五种尺寸：hg/lg/md/sm/xs
>
> 十种颜色模式：success/danger/warning/info/primary/secondary/accent/metal/light/dark
>
> 三种外观模式：square/round/shadow

* *部分组件有其他外观模式，具体参考其API文档*<br>
* *如果需要自定义尺寸、颜色或外观，可以覆盖缺省的css文件或者为组件实例赋值新的样式属性。*

### 组件布局
任何一个表单组件由两部分组成：标题和组件体，可以通过指定标题的宽度值或百分比来分配两者的宽度占比。

标题相对位置支持2种模式： 
- top: 位于组件体之上
- left: 位于组件体之左

此外，标题内部文本支持9种位置模式：
- lt: 左上
- lm: 左中
- lb: 左下
- ct: 中上
- cm: 中中
- cb: 中下
- rt: 右上
- rm: 右中
- rb: 右下

[表单示例代码](http://localhost/jsdk/examples/ui/formview/formview.html) 展示了一组良好布局的表单组件，全部标题居左且右对齐。
其代码设置如下：

```javascript
titleWidth: 120,
titlePlace: 'left',
titleTextPlace: 'rm' //right-middle
```

### 数据与值
组件的数据是指组件的可选值列表，而组件的值是用户当前选中的一个数据项。

组件的数据通过以下api来读写：

```javascript
wgt.data();//get data of wgt
wgt.data(['1','2','3']);//set data of wgt
wgt.load('xxx.json');//load data of wgt
```

组件的值通过以下api来读写：

```javascript
wgt.value();//get value of wgt
wgt.value('2');//set value 2 of wgt
```

### 数据绑定与值绑定
JSFX的表单组件都有两个内置属性：dataModel/valueModel，提供了数据绑定与值绑定功能，即属性中的数据与值与DOM中的数据与值自动关联。

比如：我们修改组件对象的值则页面上的组件选中值也会改变。
```javascript
let wgt = new Select({...});
wgt.value('1');//change the value first
```

或者我们从页面上重新选择组件的值，我们会发现组件对象的值会获得最新值。
```javascript
console.log(wgt.value());//select a new value first
```

### 值、初始值与重置
组件的值是当前值，初始值在组件初始化时给出（以后也可以修改），重置后组件的值会被初始值覆盖。

示例代码：

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

### 校验
你可以在初始化时配置校验规则，比如：

```javascript
let chk = new Checkbox({
    id: 'el',
    data: data,
    validators: [{
        name: 'required',//校验器名
        message: 'You must select one!'
    }, {
        name: 'custom',//校验器名
        message: 'You must select <small>!',
        validate: (val:string[]) => {
            if(!val) return false;
            return val.findIndex((v)=>{return v=='2'})>-1
        }
    }],
    listeners: {
        validated: (e, rst: ValidateResult, val: string, field: string) => {//校验事件
            if (rst.hasError()) JSLogger.info(rst.getErrors(field))
        }
    }
});
```
JSFX支持五种校验器，分别是：
> required
>
> format
>
> range
>
> length
>
> custom

* *每种校验器的参数说明请参看API文档*


### 表单视图
表单中通常有许多组件，假设每个组件像上述代码那样实例化，那么将产生大量冗余代码。所以JSDK提供了FormView类来管理表单中的所有组件，批量简化了以下操作：实例化、销毁、值读写、值重置、值校验等。

1. 在HTML中书写表单视图的容器及组件标签：

```html
<div id="fv1">
    <div id="first_name" jsfx-alias="textinput" /> <!-- 属性 jsfx-alias 应该填写组件的别名 -->
    <div id="last_name" jsfx-alias="textinput" />
    <div id="submit" jsfx-alias="button" />    
</div>
```
2. 定义一个MyFormView类文件：

```javascript
module JS {
    export namespace examples {
        @component('JS.examples.MyFormView')
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

3. 在TS/JS代码中使用MyFormView：

```javascript
JS.imports([
    '$jsui',
    'MyFormView.js'
]).then(() => {
    let fv = new MyFormView();
    fv.initialize();
    fv.render();
    //or: 
    //let fv = Components.get<MyFormView>(MyFormView);
    //fv.render();
})
```

* *完整的示例代码，请访问 [FormView示例](http://localhost/jsdk/examples/ui/formview/formview.html)*


## 国际化
JSFX组件的初始化配置项<code>i18n</code>来定义国际化资源，初始化配置项<code>locale</code>来设置组件的时区。在组件代码内部，使用<code>JS.util.Bundle</code>工具类来读写国际化文案。

### 资源定义
例如，Grid组件的<code>i18n</code>属性缺省时只定义了英文资源。
假设你需要添加中文资源以显示中文，可以有两种方式扩展。

<b>[方法一]</b><br> 
直接在代码中添加中文资源

你可以添加在Grid的静态资源属性上（对所有Grid都生效）
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

或者你也可以仅在当前Grid对象上添加中文资源（仅对当前对象生效）
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

<b>[方法二]</b><br> 
添加资源文件，这是我们推荐的方法。

添加以下两个资源文件至"/libs/jsdk/grid/"目录下。
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
然后，再添加如下代码：
```
Grid.I18N = '/libs/jsdk/grid/grid.json'; //web server path
```

### 显示语言
我们初始化一个Grid对象，并设置为显示中文：
```javascript
let grid = new Grid({
    locale: 'zh'
})
```
我们也可以将上述显示中文的Grid对象改为显示英文：
```javascript
grid.locale('en');
grid.render();
```

## 自定义样式
我们推荐的做法是：为该组件的预定义CSS变量（此特性需要浏览器支持CSS3）赋新值。

举例：我们需要一个黑底白字的按钮。
1. 在HTML代码中添加新按钮样式：

```html
<style>
.jsfx-button.blackbutton{ //新样式名为blackbutton
    --bgcolor: black;     //Button组件的预定义变量可查阅"/saas/_button.scss"的文件头
    --bdcolor: black;
    --color: white;
    --hover-bgcolor: white;
    --hover-color: black;
}    
</style>    
```

或者用JS代码添加新按钮样式：

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

2. 在组件初始化时使用新样式名：

```javascript
new Button({
    id: 'btn1',
    text: 'This is a black button',
    cls: 'blackbutton' //追加新样式名
})
```
<br>   

*如果系统自带的预定义变量不能满足你的自定义需求，还可以试试以下方法：*<br>
* *加载一个新的css文件，覆盖jsfx.css中样式定义。*<br>
* *或者修改某个组件的scss文件并重新编译jsfx.css。（但你应该明白这是很不好的做法）*<br>
* *或者给我发邮件，描述你的自定义需求。*

## 自定义组件
假设你有自己的UI组件或某个第三方组件，希望封装成JSFX组件。

例如，现有第三方提供的时间选择器组件<code>xpicker</code>，你打算将其封装成JSFX的表单型组件。
1. 将其源文件、css文件放置于libs目录下：

```
- libs/        
    - xpicker/ 
        - 1.0.0/
            xpicker.js
            xpicker.min.ts
            xpicker.css
            xpicker.min.css
            xpicker.d.ts     //TS类型定义文件，如有需要引用可添加  
            - i18n/          //国际化资源文件夹，如需国际化资源可添加
                en.js
                zh.js
```

2. 在你的<code>jsdk-config.js</code>文件中添加模块定义：

```
'xpicker': [
    '$jsfx',
    '~/xpicker/1.0.0/xpicker.css', 
    '~/xpicker/1.0.0/xpicker.js',  
    '~/xpicker/1.0.0/XPicker.js', //新包装类XPicker的编译后文件
],
```

3. 创建<code>XPicker.ts</code>文件如下：

```javascript
/// <reference path="../libs/jsdk/2.0.0/jsdk.d.ts" />
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

4. 将上述ts文件编译成<code>XPicker.js</code>至其类库目录下。

编译脚本<code>build-xpicker.sh</code>的内容如下：
```
tsc -d --target es6 -p xpicker.json
uglifyjs ../libs/xpicker/1.0.0/XPicker.js --warn --ecma 6 -o ../libs/xpicker/1.0.0/XPicker.min.js
```

其中，编译配置文件<code>xpicker.json</code>的内容如下：
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

5. 在TS／JS代码中使用新的XPicker类：

```javascript
JS.imports([
    '$xpicker' //加载模块名
]).then(() => {
    let dp = new My.fx.XPicker({
        ...
    })
})    
```

## 更多组件示例
请访问[JSFX示例](http://localhost/jsdk/examples/jsfx/)