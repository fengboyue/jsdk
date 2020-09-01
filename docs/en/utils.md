## Console
JSDK provides <b>JS.util.Konsole</b> instead of using console object directly.

Print styled text in the console:
```javascript
Konsole.text(`Welcome to JSDK ${JS.version}`, `font-weight:bold;color:blue;text-shadow:1px 1px 1px #D2E9FF;`);
```

Print values in the console:
```javascript
Konsole.print(1, 2, 3);
```

Clear the console:
```javascript
Konsole.clear();
```

## Log
### Usage of Log class
Instantiate a Log object before you need to output log info:
```javascript
let myLogger = new Log('My Logger', LogLevel.INFO); //set output level is INFO
```

You can also use a package name or a class name as log name, which indicate that the log object should be used by this package or class:
```javascript
let logger1 = new Log('JS.data.*'); 
let logger2 = new Log(Button.class.name); 
```

Now you can use log object to output info:
```javascript
myLogger.trace('this is trace');
myLogger.debug('this is debug');
myLogger.info('this is info');
myLogger.warn('this is warn');
myLogger.error('this is error');
```

### Log Level
The available log levels are 5 levels, plus all and off control levels, all levels are 7 in total:
```javascript
export enum LogLevel {
    ALL = 6,
    TRACE = 5,
    DEBUG = 4,
    INFO = 3,
    WARN = 2,
    ERROR = 1,
    OFF = 0
}
```
* *All means output all; OFF means no output*

Only when the level of a message is less than or equal to the output level limited by the log object, the message will be output.<br>
For example, the output level of a log object is set to WARN; if the level of a message is INFO, the message will not be output:
```javascript
let myLogger = new Log('My Logger', LogLevel.WARN); //output level is WARN

myLogger.info('info'); //INFO > WARN, console don't print the message
myLogger.error('error'); //INFO < WARN, console print the message
```

### Log Output
By default, logs are output directly to the console. JSDK allows you to change output to other places.

For example, we need to commit logs to the server instead of the console.<br>
Step 1: Define a new class <code>AjaxAppender</code>
```javascript
export class AjaxAppender implements LogAppender {

    private name = '';
    constructor(name: string){
        this.name = name;
    }
    public log(level: LogLevel.TRACE | LogLevel.DEBUG | LogLevel.INFO | LogLevel.WARN | LogLevel.ERROR, ...data: any[]) {
        Http.send({
            url: 'xxxx',
            data: {
                name: this.name,
                values: Jsons.stringify(data)
            }
        })
    }
}
```
Step 2: Use <code>AjaxAppender</code> to instantiate a log object
```javascript
let myLogger = new Log('My Logger', LogLevel.INFO, AjaxAppender); 
```
When we use the new myLogger, logs are committed to the server.

## Error Handling
JSDK provides <b>JS.lang.JSError</b> as the parent class of custom error. (it extends the native Error class)

### Predefine Error Class
JSDK predefine 7 Error classes, extends JSError. You can use these error classes directly. They are:
```text
RefusedError
NotFoundError
ArithmeticError
ArgumentError
StateError
NetworkError
TimeoutError
```
* *By the class JS.util.Errors, you can access all error classes more quickly, include all native Error classes and predefine Error classes.*

### Custom Error
For example, define a new error class named MyError:
```javascript
export class MyError extends JSError { }
```

Then you can use it:
```javascript
throw new MyError('xxxxx');
```

### Principles of using errors
Unlike Java, there is no distinction between catched exception and runtime exception in JS syntax. All JS errors belong to runtime exception.<br>

Because JS errors can be thrown in any code at anytime, without pre compilation declaration, so we should follow some good </b>error handling principles</b>:
> 1. Please throw an error when a wrong occurs that must stop running code; Before throwing, you should consider using high-level error class to wrap the original low-level error; At the same time, we should write when and what errors will occur in jsDoc so that callers can pay attention to them.
>
> 2. A code must be ensured in a robust running should catch and shield errors, do not throw them upward.
>
> 3. Try not to throw exceptions when not necessary; A method can be designed to return null or false for execution failures, at the same time you can consider logging exception context info for debugging.

## I18N
JSDK provides <b>JS.util.I18N</b> to manage I18N resource.

### Resource Loading
I18N class can load two types of JSON-format I18N resources: local resource data or remote resource file.

<b>1. Load local resource.</b>

```javascript
let i18n = new I18N('zh-CN').set({
    'zh': { 
        k1: '中文'
    },
    'zh-CN': {//will be loaded
        k1: '中文，中国'
    },
    'CN': {
        k1: '中国'
    }
});
```

The <code>set</code> method looks up the key in resource data by the following order(Suppose current locale is "zh-CN"), then load its value when a locale key be found: 
<p class="warn">
zh_CN<br>
zh
</p>

* *If current key does not exist, the next level key will be found automatically. If all of these keys do not exist in the end, I18N class will loads the entire JSON.*

<b>2. Load remote resource.</b>

```javascript
let i18n = new I18N(); //default locale is system locale: System.info().locale
i18n.load('http://mydomain/xxx.yyy', 'zh-CN'); //current locale is zh-CN
```
The <code>xxx.yyy</code> file content is same as:
```text
{
    "k1": "中文，中国"
}
```

The <code>load</code> method looks up the resource file by the following order(Suppose the current locale is "zh-CN"), then load data by Ajax when a file be found: 
<p class="warn">
xxx_zh_CN.yyy<br>
xxx_zh.yyy<br>
xxx.yyy
</p>

* *If the current file does not exist, the next level file will be found automatically. If all of these files do not exist in the end, I18N class will log the error "Any valid resource file not found".*

### Usage of I18N-Resource

```javascript
i18n.get('k1'); //Read the value of "k1" in current locale
i18n.get(); //Read all key-value pairs in current locale
```

## Event Bus
JSDK provides <b>JS.util.EventBus</b> to manage subscription and publishing of events.

You can initialize an eventbus object where you need to use the event manager:
```javascript
let bus = new EventBus(...);
```

### Subscibe Event
Event listeners need to subscribe to an event before it occurs(suppose the event type is "ring"):
```javascript
bus.on('ring', (e:Event, a, b)=>{
    Konsole.print(a, b); //print 1 and 2
    return false //Return false will prevent the event to propagate
})
```
### Publish Event
The trigger of the event needs to publish the event when it occurs:
```javascript
bus.fire('ring', [1,2]);
```

## DOM & BOM
JSDK extends the prototype chain of the <code>HtmlElement</code> object. Add some jQuery style methods to it, so it helps users to complete basic DOM operations without loading jQuery library.

The extension methods are as follows:
```javascript
interface HTMLElement {
    attr(key:string):string;
    attr(key:string, val:string):this;
    
    html():string;
    html(html:string):this;

    addClass(cls:string):this;
    removeClass(cls:string):this;
    hasClass(cls:string):boolean;
    toggleClass(cls:string, isAdd?:boolean):this;

    on(type:string, fn:(this:HTMLElement, e:Event)=>boolean|void, once?:boolean):this;
    off(type?:string, fn?:(this:HTMLElement, e:Event)=>boolean|void):this;

    find(selector:string):HTMLElement;
    findAll(selector:string):NodeListOf<HTMLElement>;

    ......
}    
```
* *You can use these methods directly on native DOM object.*

And JSDK extends the prototype chain of the <code>Window</code> object. Add two methods to it for replacing the old methods of addListener/removeListener.
```javascript
interface Window {
    on(type:string, fn:(this:Window, e:Event)=>boolean|void, once?:boolean):this;
    off(type?:string, fn?:(this:Window, e:Event)=>boolean|void):this;
}
```
* *You can use these methods directly on Window object.*

In addition, two tool classes <b>JS.util.Dom</b> and <b>JS.util.Bom</b> have many useful methods.
```javascript
Bom.ready(() => {
    //$1 === Dom.S1
    $1('btn1').on('click',()=>{
        //do you want
    })
})
```
* *See api doc for more methods*

<p class="tip">
Warn:
<br><br>
Do not use Dom methods and JS.util.Dom class in WebWork thread, and also do not try to execute any api related DOM, otherwise it will directly lead to thread script errors. Because the WebWorker specification bans reading and writing DOM in threaded code.
</p>


## Promise Helper
HTML5 provides the <b>Promise</b> api to better support asynchronous callback programming.

For example, we instantiate a <b>Promise</b> object:
```javascript
let p = new Promise<T>((resolve, reject) => {
    ...
    resolve(1);
    ...
    reject(2);
})
```

The above code is not concise enough and hard values dependency. JSDK provides a helper class <b>JS.util.Promises</b> to better do it:
```javascript
let p = Promises.create(function(a, b){
    ...
    this.resolve(a);
    ...
    this.reject(b);
}, 1, 2)
```

### Promise Plan & Promises Queue
JSDK defines a TS type that returns Promise as <b>PromisePlan</b>:
```javascript
export type PromisePlan<T> = (...args:any[])=>Promise<T>;
```
And names a queue of promise plans as <b>PromisePlans</b>:
```javascript
export type PromisePlans<T> = Array<PromisePlan<T>>;
```

### Promises Execution
The execution of an async plan is very simple, and the execution of a queue of async plans are difficult.<br>

The native <b>Promise</b> class provides two execution modes for promise queue:
* <b>all</b>: Parallel execute and returns result after all async plans are completed.
* <b>race</b>: Parallel execute and returns result when any async plan is completed.

In reality, we often need the third mode of execution:
* <b>order</b>: Sequential orderly execute and returns result when the last async plan is completed.

<b>Promises</b> supports for all above execution modes:
```javascript
//PromisePlan a
let a = Promises.createPlan<string>(function () {
    this.resolve('a');
});

//PromisePlan b
let b = Promises.createPlan<string>(function (s) {
    this.resolve(s+'b');
});

//PromisePlan c
let c = Promises.createPlan<string>(function (s) {
    this.resolve(s+'c');
});

Promises.order([a, b, c]).then((s) => {
    Konsole.print('The result of order mode = ' + s);
});
Promises.all([a, b, c]).then((s) => {
    Konsole.print('The result of all mode = ' + s);
});
Promises.race([a, b, c]).then((s) => {
    Konsole.print('The result of race mode = ' + s);
});
```