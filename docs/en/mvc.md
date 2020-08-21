## Models
The <b>jsmvc</b> module has three model classes: <b>Model</b>, <b>ListModel</b> and <b>PageModel</b>.
* *These model classes also are built-in objects of jsfx's form widgets (and Grid widget) which help jsfx widgets to complete data-events listening and data binding.*

### Model
<b>JS.model.Model</b> stores a set of key-value pairs in JSON format.

#### Field
Each key of <b>Model</b> is called <b>Field</b>. All fields of a model class can be defined when the model class is defined:
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
* Any model class <b>MUST</b> use @klass annotation to support reflection

You can also dynamically define fields in instantiation:
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

Also can dynamically define fields after instantiation:
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

To determine whether a field is an ID field:
```javascript
Assert.true(person.isIdField('no'));
Assert.false(person.isIdField('age'));
```

### Data Loading
To load local data:
```javascript
person.set('no', 1001);
person.set('name', 'Bill');

//or
person.setData({
    no: 1001,
    name: 'Bill'
});
```

To load remote json data:
```javascript
person.load('bill.json').then(()=>{
    Assert.true('Bill', person.get('name'))
})
```

### Remote JSON Format
The Remote-JSON-Format of Models is defined in <b>ResultSet</b> class:
```javascript
/**
* A result contains remote json response for models such as Model/ListModel/PageModel.
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

The standard JSON format of Models is as follows:
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

Suppose remote JSON specification in your project like this:
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

You can cover ResultSet.DEFAULT_Format so that Models can load correct values from remote data source:
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

### Field Name Mapping
In some cases, there are many differences in the data field names between server and local. So the function of field name mapping is needed.

For example, the data format of remote file <code>alias.json</code> is as follows:
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
We can modify field mappings:
```javascript
person.updateFields({
    [
        { name: 'no', nameMapping: 'id'},
        { name: 'name', nameMapping: 'alias' }
    ]
})
```
After this we can read the data correctly:
```javascript
person.load('alias.json').then(()=>{
    Assert.true('Bill', person.get('name')); //read from nameMapping
})
```

### Data Validation
Set field validators first:
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
* For more types and usage of validators, please refer to the API documentation.
* You can set multiple validators for multiple fields at the same time; here is only the simplest sample.

Then set event monitoring related with validation:
```javascript
person.on('fieldvalidated', (e, rst:ValidateResult, val:any, fieldName)=>{
    if(rst.hasError()) alert(`The ${fieldName} field's value is wrong!`)
})
```

Finally start to verify the value of the field:
```javascript
person.validateField('no');
```
* The validate() method validates the values of all fields.

### ListModel
The internal storage format of <b>JS.model.ListModel</b> class is a JSON array.

Its normal output format is JsonObject[ ]. You can also set its model type and output it in the Model[ ] format:
```javascript
let persons = new ListModel();
...
person.getData(); //return JsonObject[]
person.getModels(Person); //return Person[]
person.getRowModel(0, Person); //return the Person of row[0]
```
* The ListModel does not provides validation methods directly. You can output its row model object first and then validate it.

The <b>ListModel</b> can adds and submits sort parameters: when it loads remote data the sort parameters will be directly spliced on the URL and be submitted to the server.
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

### PageModel
<b>JS.model.PageModel</b> class is a subclass of <b>ListModel</b> and provides the function of submitting pagation parameters that <b>ListModel</b> does not has.
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

## Views
View is a container for a group of widgets which manages the creation, rendering, reading-writing, and destroying operations of its internal widgets.

<b>JS.view.View</b> has three subclasses:
> SimpleView is suitable for rendering simple widgets without data.
>
> TemplateView merges local or remote data with HTML template to generate HTML fragment, and then render its widgets based on this fragment.
> 
> FormView is suitable for rendering form widgets.

* *The following two examples show the usage of SimpleView and TemplateView. The usage of FormView is located in the JSFX section.*

### Viewed Widget Tag
The view class automatically searches for HTML tag which has  same ID with its configured widget and instantiates the widget class. An viewed widget tag like this:
```html
<div id="xxx" js-wgt="button">
```

The above tag will be searched by view class and reflectingly instantiate as JS.fx.Button(its alias equals button):
```javascript
let btn = Class.aliasInstance<T>('button', {id:'xxx'});//Equals to: let btn = new Button({id: 'xxx'})
```

### Simple View
Let's take <b>SimpleView</b> as an example to see how to use view.

First, write three tags of button widget in your HTML file:
```html
<div id="btn0" js-wgt="button">
<div id="btn1" js-wgt="button">
<div id="btn2" js-wgt="button">
```
Then you can render all buttons with <b>SimpleView</b>:
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

In another way, you can also define a subclass of <b>SimpleView</b> and mark it as IOC component with <b>@component</b>:
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
* *The render method will be called automatically when <b>ButtonsView</b> is instantiated*

It will be automatically instantiated when it is injected by other components:
```javascript
@component('JS.sample.ClassA') 
export class ClassA {
    @inject()
    public view: ButtonsView = null;//Must be initialized to null because TS ignores uninitialized class properties at compile time
}
```

Or it will be automatically instantiated when the IOC container gets it:
```javascript
let view = Components.get<ButtonsView>(ButtonsView);
```

### Template View
Let's continue with the example above to see how to use <b>TemplateView</b> to achieve the same requirement.

Because <b>TemplateView</b> will merge data with its template to generate HTML fragment, so there is no need to write button tags in your HTML file(just write a div container):
```html
<div id="buttons"></div>
```

Instantiate a <b>TemplateView</b> object:
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
* *The template engine used by JSDK is handlebars, so the template syntax is also the syntax of handlebars.*

Load data and automatically complete rendering:
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

## Component & IOC Container
The <b>JS.ioc.Components</b> is IOC container. It can register, initialize and destroy all IOC components in it and save memory cost effectively.
- *The IOC container only supports single instance mode*

### Define IOC Component
Use <code>@component</code> to mark a IOC component class, indicates that this class will be managed by the IOC container:
```javascript
module JS {
    export namespace sample {
        @component('JS.sample.ClassA') //Argument must be full name of the class
        export class ClassA {
        }
    }
}  
```

### Dependency Lookup
<b>Components</b> can lookups the component object through get method by the class name or constructor:
```javascript
let clsA = Components.get<ClassA>(ClassA);
Konsole.print(clsA.a);
```

### Dependency Injection
Suppose the type of property <code>a</code> in component <b>ClassA</b> is component <b>ClassB</b>, you can use the <code>@inject</code> annotation to automatically instantiate property a.
```javascript
module JS {
    export namespace sample {
        @component('JS.sample.ClassB') 
        export class ClassB {
        }

        @component('JS.sample.ClassA') 
        export class ClassA {
            @inject()
            public a: ClassB = null;  //Must be initialized to null because TS ignores uninitialized class properties at compile time
        }
    }
}  
```

### Safe Component
If a class has modifiable properties, we call it stateful class, otherwise we call it stateless class.<br>
In a singleton container, only one instance of each class exists. If the component instance is stateful, it may cause its property value to be modified by internal code unexpectedly, so it is unsafe.

In order to make safe components, we advocate defining stateless components. <b>This means that a component is safe when its properties are of the following types</b>: 
- constant
- other safe component classes

*Note: if a component class is unsafe, all other component classes that depend on this component will also become unsafe*
