## 控制台
JSDK用工具类<b>JS.util.Konsole</b>取代了直接使用console对象。

在控制台打印带样式的文本：
```javascript
Konsole.text(`Welcome to JSDK ${JS.version}`, `font-weight:bold;color:blue;text-shadow:1px 1px 1px #D2E9FF;`);
```

在控制台打印多个数据：
```javascript
Konsole.print(1, 2, 3);
```

清空控制台的输出信息：
```javascript
Konsole.clear();
```

## 日志
### 使用日志类
在需要日志输出的地方，实例化一个日志类：
```javascript
let myLogger = new Log('My Logger', LogLevel.INFO); //设置输出级别为INFO
```

你也可以将某个包名或某个类名作为日志名。用来标示出该日志类应该被此包或此类使用：
```javascript
let logger1 = new Log('JS.data.*'); 
let logger2 = new Log(Button.class.name); 
```

现在，可以使用日志对象来输出日志了：
```javascript
myLogger.trace('this is trace');
myLogger.debug('this is debug');
myLogger.info('this is info');
myLogger.warn('this is warn');
myLogger.error('this is error');
```

### 日志级别
可使用的日志级别共5级，再加上ALL/OFF两个控制用级别，一共是7级：
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
* *ALL表示输出全部；OFF表示无任何输出*

只有当某条信息的级别小于等于日志对象所规定的输出级别时，这条信息才会被输出。<br>
比如，日志对象的输出级别设置为WARN；某条信息的级别为INFO则该条信息不会输出至控制台：
```javascript
let myLogger = new Log('My Logger', LogLevel.WARN); //输出级别为WARN

myLogger.info('info'); //信息级别高出WARN, 控制台不会打印
myLogger.error('error'); //信息级别低于WARN, 控制台会打印: error
```

### 输出模式
缺省情况下，日志信息直接输出到控制台。JSDK也允许你来定义输出到其他地方。

例如，我们需要将日志提交到服务器而不是控制台。<br>
第一步：先定义一个新类<code>AjaxAppender</code>
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
第二步：用<code>AjaxAppender</code>来实例化日志对象
```javascript
let myLogger = new Log('My Logger', LogLevel.INFO, AjaxAppender); 
```
当我们使用新的myLogger对象时，输入的日志就提交至服务器了。

## 错误处理
JSDK提供了<b>JS.lang.JSError</b>类作为自定义Error的父类（继承自原生的Error类）。

### 预定义Error
JSDK预定义了7个Error类，继承自JSError类。你可以直接使用这些Error，它们分别是：
```text
RefusedError
NotFoundError
ArithmeticError
ArgumentError
StateError
NetworkError
TimeoutError
```
* *使用类JS.util.Errors，你可以更快访问到全部Error类：包括原生Error类和JSDK的预定义Error类。*

### 自定义Error
举例，定义一个名为MyError的新类：
```javascript
export class MyError extends JSError { }
```

然后就可以使用：
```javascript
throw new MyError('xxxxx');
```

### 正确使用异常
与Java不同的是，JS语法中并没有捕获式异常和运行时异常的区分，都属于运行时异常。<br>

由于JS的错误异常可以在代码中随时随地抛出而无需编译前声明，所以我们应该遵循一些好的<b>异常处理原则</b>：
> 1. 必须中止的错误发生时，请抛出异常；抛出前应考虑用高层级的异常类来包装原有的低层级的异常；同时应该在jsdoc中备注何时会发生何种异常，以便调用者注意。
>
> 2. 必须保证健壮运行的代码应该捕获并屏蔽异常，不要再向上抛出异常。
>
> 3. 非必要时尽量不抛出异常；方法可以尽量设计成以返回null或false表示执行失败，同时考虑日志打印异常上下文信息以方便调试。

## 国际化
JSDK提供工具类<b>JS.util.I18N</b>来管理国际化资源。

### 资源的加载
I18N类允许以两种方式加载JSON格式的资源：本地的资源数据或远程的资源文件。

<b>1. 加载本地的资源数据</b>

```javascript
let i18n = new I18N('zh-CN').set({
    'zh': { 
        k1: '中文'
    },
    'zh-CN': {//将加载这块数据
        k1: '中文，中国'
    },
    'CN': {
        k1: '中国'
    }
}); 
```

<code>set</code>方法会以下顺序去查找资源数据中的键（假设当前时区为"zh-CN"），找到后加载数据：
<p class="warn">
zh_CN<br>
zh
</p>

* *当前键不存在则自动查找下一级键。如果最终所有这些键都不存在，则I8N类会自动装载整个JSON数据。*

<b>2. 加载远程的资源文件</b>

```javascript
let i18n = new I18N(); //缺省为系统时区：System.info().locale
i18n.load('http://mydomain/xxx.yyy', 'zh-CN'); //当前时区为zh-CN
```
<code>xxx.yyy</code>文件是一个JSON格式的资源文件：
```text
{
    "k1": "中文，中国"
}
```

<code>load</code>方法会以下顺序去依次查找资源文件名（假设当前时区为"zh-CN"），找到后以Ajax方式加载数据：
<p class="warn">
xxx_zh_CN.yyy<br>
xxx_zh.yyy<br>
xxx.yyy
</p>

* *当前文件不存在则自动查找下一级文件。如果最终所有这些文件都不存在，则会打印错误日志：未找到任何可用的资源文件。*

### 资源的使用

```javascript
i18n.get('k1'); //Read the value of "k1" in current locale
i18n.get(); //Read all key-value pairs in current locale
```

## 事件总线
JSDK提供了事件总线类<b>JS.util.EventBus</b>来管理事件的订阅与发布。

我们在需要使用事件管理器的地方，初始化一个EventBus对象：
```javascript
let bus = new EventBus(...);
```

### 事件订阅
事件的监听方在事件发生前需要订阅事件（假设事件名为"ring"）：
```javascript
bus.on('ring', (e:Event, a, b)=>{
    Konsole.print(a, b); //print 1 and 2
    return false //返回False将阻止事件的继续传播
})
```
### 事件发布
事件的触发方在事件发生时需要发布事件：
```javascript
bus.fire('ring', [1,2]);
```

## DOM与BOM
JSDK对<code>HTMLElement</code>对象的原型链进行了扩展，增加了一些仿jQuery的方法。方便用户无须加载jquery库就可以完成基本的DOM操作。

扩展方法如下：
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

    computedStyle(pseudo?:string):CSSStyleDeclaration;
}
```
* *你可以在DOM对象上直接使用上述方法。*

同时，JSDK对<code>Window</code>对象的原型链进行了扩展，增加了两个方法以取代旧方法： addListener/removeListener。
```javascript
interface Window {
    on(type:string, fn:(this:Window, e:Event)=>boolean|void, once?:boolean):this;
    off(type?:string, fn?:(this:Window, e:Event)=>boolean|void):this;
}
```
* *你可以在Window对象上直接使用上述方法。*

另外，工具类<b>JS.util.Dom</b>／<b>JS.util.Bom</b>提供了很多有用方法。
```javascript
Bom.ready(() => {
    //$1 === Dom.S1
    $1('btn1').on('click',()=>{
        //do you want
    })
})
```
* *更多方法请参看API文档*

<p class="tip">
注意：
<br><br>
请不要在线程代码中使用HTMLElement的扩展方法以及JS.util.Dom类，也不要尝试执行任何与DOM相关的API，否则会直接导致线程脚本错误。因为WebWorker规范禁止在线程代码中读写DOM。
</p>

## Promise助手
HTML5提供了 <b>Promise</b> 来更好的支持异步回调式编程。
例如，我们实例化一个 <b>Promise</b> 对象：
```javascript
let p = new Promise<T>((resolve, reject) => {
    ...
    resolve(1);
    ...
    reject(2);
})
```
上述代码显得不够简明且产生了硬值依赖，JSDK提供了助手类 <b>JS.util.Promises</b> 可以实现更好的写法：
```javascript
let p = Promises.create(function(a, b){
    ...
    this.resolve(a);
    ...
    this.reject(b);
}, 1, 2)
```

### 计划与计划队列
JSDK将返回Promise类型的函数定义为 <b>PromisePlan</b>：
```javascript
export type PromisePlan<T> = (...args:any[])=>Promise<T>;
```
而将一组 <b>PromisePlan</b> 定义为 <b>PromisePlans</b> 计划队列：
```javascript
export type PromisePlans<T> = Array<PromisePlan<T>>;
```

### 计划队列的执行
一个异步计划的执行很简单，一组异步计划的执行与结果返回才是难点。<br>

原生的 <b>Promise</b> 类已提供两种队列执行模式：
* <b>all</b>: 并行执行，所有异步执行都完成才返回。
* <b>race</b>: 并行执行，任一个异步执行完成就返回。

现实情况下，我们常常需要第三种执行模式：
* <b>order</b>: 串行执行，执行完一个异步才能执行下一个异步。最后一个执行完毕才返回。

<b>Promises</b> 类提供了对以上三种执行模式的支持：
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