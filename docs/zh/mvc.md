## 模型
<b>jsmvc</b> 模块有三种模型类：对象模型、列模型、翻页列模型。
* *模型类也是JSFX的表单组件（和Grid组件）的内置对象，帮助JSFX组件完成数据监听与数据绑定功能*

### 对象模型
<b>JS.model.Model</b> 类内部以JSON格式保存一组键值对。

#### 字段
<b>Model</b> 类的每个键称为 <b>Field</b>（字段）。<b>Model</b> 类的所有字段可以类定义时定义：
```javascript
@klass('Person')
class Person extends Model {
    static DEFAULT_FIELDS = [
        { name: 'no', isId: true },
        { name: 'name' },
        { name: 'age' },
        { name: 'birthday' }
    ]
}
```
* <b>Model</b>类必须使用<b>@klass</b>注解以支持反射

也可以在实例化时动态定义：
```javascript
let person = new Person({
    [
        { name: 'no', isId: true },
        { name: 'name' },
        { name: 'age' },
        { name: 'birthday' }
    ]
})
```

还可以在实例化后动态添加：
```javascript
person.addFields({
    [
        { name: 'no', isId: true },
        { name: 'name' },
        { name: 'age' },
        { name: 'birthday' }
    ]
})
```

判定某字段是否为ID字段：
```javascript
Assert.true(person.isIdField('no'));
Assert.false(person.isIdField('age'));
```

### 数据加载
加载本地JSON数据：
```javascript
person.set('no', 1001);
person.set('name', 'Bill');

//or
person.setData({
    no: 1001,
    name: 'Bill'
});
```

加载远程JSON数据：
```javascript
person.load('bill.json').then(()=>{
    Assert.true('Bill', person.get('name'))
})
```

### 远程JSON格式
模型的远程数据的标准规格定义在 <b>ResultSet</b> 类中：
```javascript
/**
* A result contains remote json response for model.
*/
export class ResultSet {

    public static DEFAULT_FORMAT: ResultSetFormat = {
        rootProperty: undefined,
        dataProperty: 'data',
        totalProperty: 'paging.total',
        pageProperty: 'paging.page',
        pageSizeProperty: 'paging.pageSize',
        messageProperty: 'msg',
        versionProperty: 'version',
        langProperty: 'lang',
        successProperty: 'code',
        successCode: 'success'
    }
}
```

即标准JSON格式为：
```javascript
{
    version: string,
    lang: string,
    code: string,
    msg: string,
    data: PrimitiveType|Array<PrimitiveType>|JsonObject<PrimitiveType>,
    paging?: {
        pageSize: number,
        total: number,
        page: number
    } 
}
```

假设你项目中的JSON规格为：
```javascript
{
    ver: string,
    locale: string,
    status: number, //200 is success
    errorMsg: string,
    response: {
        sizePerPage: number,
        totalRows: number,
        pageNo: number,
        data: any
    } 
}
```

你可以覆盖 <b>ResultSet.DEFAULT_FORMAT</b>，这样Model就能从远程数据源正确取值了:
```javascript
ResultSet.DEFAULT_FORMAT: ResultSetFormat = {
    rootProperty: undefined,
    dataProperty: 'response.data',
    totalProperty: 'response.totalRows',
    pageProperty: 'response.pageNo',
    pageSizeProperty: 'response.sizePerPage',
    messageProperty: 'errorMsg',
    versionProperty: 'ver',
    langProperty: 'locale',
    successProperty: 'status',
    successCode: 200
}
```

### 字段名映射
很多时候，服务端或本地定义的JSON字段名与<b>Model</b>内部定义的字段名存在差异，这时就需要用到字段名映射功能。

例如，远程JSON文件<code>alias.json</code>的数据格式如下：
```javascript
{
    version: "1.0",
    lang: "en",
    code: "success",
    data: {
        id: 1001,         //mapping "no"
        alias: 'Bill'     //mapping "name"
    }
}
```
我们可以修改字段映射：
```javascript
person.updateFields({
    [
        { name: 'no', nameMapping: 'id'},
        { name: 'name', nameMapping: 'alias' }
    ]
})
```
之后我们就可以按照模型自己的字段名正确读取数据了：
```javascript
person.load('alias.json').then(()=>{
    Assert.true('Bill', person.get('name')); //read from nameMapping
})
```

### 数据校验
先设置字段的校验器：
```javascript
person.updateField({
    name: 'no', 
    validators: [
        {
            name: 'custom',//Validator Type Name
            message: 'The "no" field must be number!',
            validate: (val: any) => {
                return typeof val == 'number'
            }
        }
    ]
})
```
* 校验器的更多类型及用法请查阅API文档。
* 可以同时设置多个字段的多种校验器；这里只写最简单的例子。

再设置校验相关的事件监听：
```javascript
person.on('fieldvalidated', (e, rst:ValidateResult, val:any, fieldName)=>{
    if(rst.hasError()) alert(`The ${fieldName} field's value is wrong!`)
})
```

最后开始校验字段的值：
```javascript
person.validateField('no');
```
* validate()方法可以校验所有字段的值。

### 列模型
<b>JS.model.ListModel</b> 类的内部存储格式为JSON数组。

其通常的输出格式为：<b>JsonObject[ ]</b>。你也可以设置其Model类型，再以 <b>Model[ ]</b> 格式输出：
```javascript
let persons = new ListModel();
...
person.getData(); //return JsonObject[]
person.getModels(Person); //return Person[]
person.getRowModel(0, Person); //return the Person of row[0]
```
* <b>ListModel</b> 类并没有直接提供校验方法，你可以先获取其行模型对象，再对其进行校验。

<b>ListModel</b> 类可以添加并提交排序参数：当其加载远程数据时（直接拼接在URL的queryString上）提交至服务器。
```javascript
let persons = new ListModel({
    sorters: [{
        field:'gmtCreated',
        dir: 'desc'
    },{
        field: 'name',
        dir: 'asc'
    }]
});
//or
persons.addSorter('gmtCreated', 'desc');
persons.addSorter('name', 'asc');
```

### 翻页列模型
<b>JS.model.PageModel</b> 类是 <b>ListModel</b> 类的子类，提供了 <b>ListModel</b> 所没有的提交翻页参数的功能。

```javascript
let persons = new PageModel({
    dataQuery: {
        url: 'test-data/persons-page.json',
        pageSize: 20
    }
});
persons.on('loadsuccess', function () {
    let me = <PageModel>this; 
    Assert.equal(10, me.getCurrentPage())
    Assert.equal(3, me.getData().length);
    Assert.equal('Smith', me.getRowModel<Person>(2, Person).get('name'));
});
persons.loadPage(10); 
```

## 视图
View是一组Widget的容器，管理其内部的Widget的创建、渲染、读写、销毁等操作。

<b>JS.view.View</b> 类有三个子类，分别是：
> SimpleView 简单视图：适合渲染不带数据的简单组件。
>
> TemplateView 模版视图：用本地或远程数据与HTML模版合并后生成HTML片段，基于此片段再渲染组件。
> 
> FormView 表单视图：适合渲染表单型组件。

* *后面的两个例子讲述简单视图与模版视图的用法，表单视图的用法位于JSFX组件章节*

### 组件标签
View类会自动搜索与其配置的组件同ID的HTML标签并实例化组件对象。一个视图化widget标签是长这样的：
```html
<div id="xxx" js-wgt="button">
```

上述标签将会被Views搜索到并反射式实例化为一个id为<code>xxx</code>的 <b>JS.fx.Button</b>（其别名为button）实例：
```javascript
Class.aliasInstance<T>('button', {id:'xxx'});//等价于: let btn = new Button({id: 'xxx'})
```

### 简单视图
我们以 <b>SimpleView</b> 为例，来看看如何使用View。

先在HTML文件写好三个按钮的HTML片段：
```html
<div id="btn0" js-wgt="button">
<div id="btn1" js-wgt="button">
<div id="btn2" js-wgt="button">
```
再用view对象渲染出所有按钮：
```javascript
let view = new SimpleView({
    defaultConfig: <ButtonConfig>{
        faceMode: ButtonFaceMode.shadow
    },            
    widgetConfigs: <JsonObject<ButtonConfig>>{
        btn0: {
            text: 'BUTTON-1'
        },
        btn1: {
            text: 'BUTTON-2'
        },
        btn2: {
            text: 'BUTTON-3'
        }
    }
});
view.render();
```

换一种方式，我们也可以定义一个 <b>SimpleView</b> 的子类，用 <b>@component</b> 标记为IOC组件：
```javascript
@component('JS.sample.ButtonsView')
export class ButtonsView extends SimpleView {

    initialize() {
        this._config = {
            defaultConfig: <ButtonConfig>{
                faceMode: ButtonFaceMode.shadow
            },            
            widgetConfigs: <JsonObject<ButtonConfig>>{
                btn0: {
                    text: 'BUTTON-1'
                },
                btn1: {
                    text: 'BUTTON-2'
                },
                btn2: {
                    text: 'BUTTON-3'
                }
            }
        };
        super.initialize();
    }
}
```
* *<b>ButtonsView</b>实例化时就会自动调用render方法*

当被依赖注入时就会被自动实例化：
```javascript
@component('JS.sample.ClassA') 
export class ClassA {
    @inject()
    public view: ButtonsView = null;  //必须初始化为null，因为TS在编译时会忽略没有初始化的类属性
}
```

或者当IOC容器查找时也会被自动实例化：
```javascript
let view = Components.get<ButtonsView>(ButtonsView);
```

### 模版视图
我们继续用上面的例子，看看如何用模版视图来实现同样的需求。

模版视图会以数据与模版合并生成HTML片段，所以不需要在HTML文件里写按钮标签（仅仅写一个DIV容器即可）：
```html
<div id="buttons"></div>
```

实例化一个模版视图对象：
```javascript
JS.imports([
    '$handlebars', //Must import handlebars as tpl engine
    '$jsfx'
]).then(()=>{
    let view = new TemplateView({
        container: '#buttons',
        defaultConfig: <ButtonConfig>{
            faceMode: ButtonFaceMode.shadow
        },            
        widgetConfigs: <JsonObject<ButtonConfig>>{
            btn0: {
                text: 'BUTTON-1'
            },
            btn1: {
                text: 'BUTTON-2'
            },
            btn2: {
                text: 'BUTTON-3'
            }
        }, 
        tpl: 
        `{{#.}}
        <div id="{{id}}" js-wgt="button"></div>
        {{/.}}`
    });
})
```
* *JSDK使用的模版引擎是handlebars，所以模版语法也是handlebars的语法*

加载数据并自动完成渲染：
```javascript
//load local data
view.data([{
    "id":"btn0"
},{
    "id":"btn1"
},{
    "id":"btn2"
}]);
//or load remote data
//view.load('buttons.json');
```

## 组件与IOC容器
<b>JS.ioc.Components</b> 是一个IOC容器，提供对容器中所有IOC组件对象的注册、初始化、销毁等功能，并且能有效节约内存开销。
- *IOC容器目前仅支持单例模式*

### 定义组件类
使用 <b>@component</b> 注解定义一个IOC组件，则表示此类将被IOC容器管理：
```javascript
module JS {
    export namespace sample {
        @component('JS.sample.ClassA') //参数必须为类的正确全名
        export class ClassA {
        }
    }
}  
```

### 组件查找
<b>Components</b>可以通过<code>get</code>访问查找组件对象：
```javascript
let clsA = Components.get<ClassA>(ClassA);
Konsole.print(clsA.a);
```

### 依赖注入
假设组件类 <b>ClassA</b> 的属性<code>a</code>为组件类<b>ClassB</b>，我们可以用 <b>@inject</b> 注解自动注入属性<code>a</code>：
```javascript
module JS {
    export namespace sample {
        @component('JS.sample.ClassB') 
        export class ClassB {
        }

        @component('JS.sample.ClassA') 
        export class ClassA {
            @inject()
            public a: ClassB = null;  //必须初始化为null，因为TS在编译时会忽略没有初始化的类属性
        }
    }
}  
```

### 安全组件
一个类如果有可被修改的属性，那么我们称之为有状态类，反之我们称之为无状态类。<br>
在单例型容器下，每个类都仅有一个实例存在；如果组件实例是有状态的，可能造成内部值被多个调用点不期望的修改，因此是不安全的。

为了组件安全运行，我们提倡定义无状态组件，即<b>组件的属性为以下类型才是安全的</b>：
- 常量
- 其他安全的组件类

*备注：如果某个组件类不安全，那么所有装配此组件的其他组件类也会变得不安全*