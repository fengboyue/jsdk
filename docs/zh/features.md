
## 注解
注解为类提供了更多附带信息，也是AOP切面、依赖注入等特性的基础特性。

### 注解的应用
我们先看一个例子：
```javascript
@deprecated()
export class MyClass {
    @deprecated()    
    public name;

    @deprecated()
    public clone() {
    }
}
```
- *@deprecated是一个JSDK自带的注解函数，会在控制台打印警告信息：提示该类或该属性或该方法已被废弃。*

### 预定义注解
JSDK已定义了以下注解函数，可以直接使用：

注解函数|所属模块|作用域
---|---|---
@klass|system|class
@deprecated|system|class/method/field
@before|system|method
@after|system|method
@around|system|method
@throws|system|method
@aop|system|method
@component|jsvp|class
@inject|jsvp|field
@widget|jsfx|class

- *注解函数的参数请参看API文档*

### 自定义注解
假设我们想要定义一个新注解：<code>@version</code>，它用来记录类的版本信息。

1. 定义新注解
```javascript
export function version(ver: string): any {
    return Annotations.define({
        name: 'version',
        handler: (anno: string, values: Array<string>, klass: Function) => {
            //do you want
        },
        target: AnnotationTarget.CLASS
    }, [ver]);
}
```

2. 使用此注解
```javascript
@version('1.2.3')
export class MyClass {
}
Konsole.print(Annotations.getValue(version, MyClass)); //print: 1.2.3
```

## 反射
反射是在运行时动态获取类的属性、方法信息的一种机制。它让我们可以对一个类进行动态实例化、动态调用方法、动态读写属性。

- *JSDK的反射特性是由类：<b>JS.reflect.Class</b>来提供的。如果你有Java基础知识，将更容易理解。*

### 让类支持反射
与Java不同的是，并非每个JS类都支持反射特性。JSDK有两种方式可以让类支持反射。<br>
<b>[方法一]</b><br> 
在类定义时使用注解<code>@klass</code>标记其为可反射的类
```javascript
module WHO {
    export namespace virus {
        @klass('WHO.virus.Convid19') //参数必须为类的正确全名
        export class Convid19 {
        }
    }
}        
```

<b>[方法二]</b><br> 
也可以使用工具方法来支持反射。(此方法适更适合于那些无法添加注解的类)
```javascript
Class.register(Convid19, 'WHO.virus.Convid19');
```

在JSDK中，以下JS原生对象类已支持反射：
- Object
- String
- Boolean
- Number
- Array
- Date

在JSDK中，以下注解可标记类支持反射：
- @klass
- @component
- @widget

### 反射的使用
当类支持反射后，我们就可以通过其反射类获取更多的类信息。

1. 获取其反射类
```javascript
let cls1 = Convid19.class;
Konsole.print(cls1) //print the reflect Class of Convid19
let cls2 = new Convid19().getClass();
Konsole.print(cls2) //print the reflect Class of Convid19
let cls3 = Class.forName('WHO.virus.Convid19');
Konsole.print(cls3) //print the reflect Class of Convid19
Konsole.print(cls1===cls2 && cls2===cls3) //print true
```

2. 读取类信息
```javascript
let c = new Convid19(),
    cls = c.getClass();
Konsole.print(cls.getKlass()); //print Convid19
Konsole.print(cls.methods());  //print all static methods and instance methods
Konsole.print(cls.fields(c));  //print all static fields and instance fields
```

3. 反射式实例化
```javascript
let c = Class.newInstance('WHO.virus.Convid19'); //equals: new Convid19();
```

## AOP切面
切面是对原函数或方法的一种替换机制，可在切入点植入新函数用于修改其原有行为。

JSDK支持以下切入点：
- before
- around
- after
- throws

JSDK中可以对函数切面：
```javascript
let format = function(s: string){
    return ' ' + s + ' '
}
let trim = format.aop({ //Returns a new modified function
    before: (s: string) => {
        ...
    },
    around: function (fn: Function, s: string) {
        return fn.apply(this, [s&&s.trim()])
    },
    after: (returns: string) => {
        ...
    }
})
```
*注意：原函数并未被改变。*

也可以对可反射类的方法切面：
```javascript
Date.class.aop('format', {//The 'format' method of Date class be changed.
    before: (format: string) => {
        Assert.equal(s, format);
    },
    around: function (fn: Function, format: string) {
        return (<string>fn.apply(this, [format])).replace('1900-', '2019-')
    },
    after: (returns: string) => {
        Assert.true(returns.startsWith('2019-'));
    }
})
```

*注意：类方法已被改变。如果需要恢复原方法，执行cancelAop：*
```javascript
Date.class.cancelAop('format');
```

还可以用AOP注解，对可反射类的方法切面：
```javascript
class Me {
    @before((s)=>{return s+'\n'})
    format(s:string){
        return s
    }
}
```

## IOC容器与组件
<b>JS.ioc.Components</b>是一个IOC容器，提供对容器中所有IOC组件对象的注册、初始化、销毁等功能，并且能有效节约内存开销。
- *此 IOC 容器目前仅支持单例模式*

### 定义IOC组件类
使用<code>@component</code>注解定义一个IOC组件，则表示此类将被IOC容器管理：
```javascript
module Demo {
    export namespace cmp {
        @component('Demo.cmp.ClassA') //参数必须为类的正确全名
        export class ClassA {
        }
    }
}  
```

### 组件查找
<b>Components</b>可以通过get访问查找组件对象：
```javascript
let clsA = Components.get<ClassA>(ClassA);
Konsole.print(clsA.a);
```

### 依赖注入
假设组件类<code>ClassA</code>的属性a为组件类<code>ClassB</code>，我们可以用<code>@inject</code>注解自动注入属性a：
```javascript
module Demo {
    export namespace cmp {
        @component('Demo.cmp.ClassB') 
        export class ClassB {
        }

        @component('Demo.cmp.ClassA') 
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


## 多线程
众所周知，浏览器至少存在三个线程：JS线程、UI线程及事件线程。JS线程是JS引擎的主线程，通常以单线程模式运行，且与UI线程是互斥的。例如：当我们执行一段耗时的JS代码时，会明显感觉到UI不响应。<br>
为改善性能，HTML5推出了WebWorker的多线程API。利用这个新特性，我们可以在JS主线程内创建子线程：将耗时的代码放入子线程并行执行，从而减少主线程的整体运行时间，同时也减少对了UI线程的阻塞。

### 取代WebWorker
WebWorker要求将子线程代码写在一个独立JS文件中并加载：
```javascript
let worker = new Worker('http://mydomain/calculate.js');
```
这带来诸多不便：
<p class="tip">
部署不透明：主线程中的调用代码必须知道子线程文件的URL部署地址。
<br><br>
加载代码不可省略：子线程文件头部加载所依赖的全部脚本。
<br><br>
非面向对象：运行的是线程文件而非线程类，封装性不好。
<br><br>
互访问性差：子线程文件中的代码不可以直接调用主线程中的代码，仅以消息数据作为返回。
</p>

JSDK提供了全新的线程类<b>JS.lang.Thread</b>来取代直接使用WebWorker API。其关键特性如下：
> 两种运行模式：既支持运行线程代码（run方法代码），也支持运行线程脚本（外部独立文件）。
>
> 当Thread类运行线程代码时，会创建并运行一个临时的子线程脚本。
> 此临时子线程文件创建时会自动查找主线程中的system.js或system.min.js的URL地址，找到后会自动加载：以保证和主线程运行在同一JSDK版本环境下。
>
> Thread类的线程方法（run方法）中可以：调用类的其他非线程方法；或向主线程发送消息；或中止本线程执行。
>
> Thread类的非线程方法中可以：向子线程发送消息；或中止本线程执行。

*注意：请自行避免线程方法与非线程方法的循环调用，这可能导致死循环。*

### 线程类示例
举例，我们需要在线程中完成两个数相加。

最简单的写法如下：
```javascript
let plus = new Thread({
    run:function(){ //All code in run method will be output to the temporary thread file
        this.onposted((data)=>{
            this.postMain(data[0]+data[1]); //return result by message
        })
    }
});
plus.on('message',function(e, num){
    Konsole.print(num); //print 3
    this.terminate();   //stop thread
});
plus.start().postThread([1,2]); //post two numbers to sub thread: 1 and 2
```

如果上述计算需要反复用到或者存在更复杂的逻辑，你最好定义一个线程类来完成同样的功能：
```javascript
class Plus extends Thread {
    public run() {
        this.onposted((data)=>{
            this.callMain('_plus', data[0] + data[1]); //return result by call _print method in main thread
        })
    }
    private _print(n){
        Konsole.print(n);
        this.terminate(); 
    }
}

let plus = new Plus();
plus.start().postThread([1,2]); 
```

如果在线程代码中需要用到第三方库，那么你必须在线程代码的头部加载此类库：
```javascript
class Plus extends Thread {
    public run() {
        this.imports('/bignumber.js'); //load 3rd library
            
        this.onposted((data)=>{
            this.callMain('_plus', BigNumber.add(data[0],data[1])); //calc by 3rd library
        })
    }
    private _print(n){
        Konsole.print(n);
        this.terminate(); 
    }
}
```

### 线程中使用Ajax
我们知道Ajax（无论同步还是异步）会打开新的HTTP连接，如果建立此连接非常耗时，那么你可以用线程模式中执行Ajax：
```javascript
Ajax.send({
    url: '....',
    thread: true //send ajax request in webworker thread
})
```
<p class="tip">
注意事项
<br><br>
1. 请不要在线程代码或线程脚本中读写DOM对象，这是被WebWorker明令禁止的。如需读写DOM，你可以发送消息给主线程代码让其来访问DOM。
<br><br>
2. JSDK 0.X～1.0版本中的Thread类实际上是伪线程类，是一个基于setTimeout函数的循环控制器。它是专为旧版的JSGF(JSDK Game Framework)打造的，比当前新版的真线程类适用范围窄且性能差。如果你想要在游戏项目中使用JSDK，那么我强烈建议你使用JSDK 2.0以便获得更好的游戏性能以及更全面的高级特性。
</p>

## 定时器
JSDK提供定时器类<b>JS.util.Timer</b>来执行定时化或循环化任务。
```javascript
//明天的23:59:59执行一次
new Timer(()=>{
    //do you want
}, {
    loop: 1,
    delay: new Date().add(1, 'd').setLastTime()-new Date()
}).start();

//每三秒执行一次，一直不停
new Timer(()=>{
    //do you want
}, {
    loop: true,
    interval: 3000
}).start();
```

### 执行模式
<code>Timer</code>类的参数<code>intervalMode</code>提供两种间隔执行模式：<code>OF</code>模式和<code>BF</code>模式。缺省模式为<code>OF</code>。

在<code>OF</code>模式下，定时器将尽可能保持固定的频率（帧率）来执行任务。当任务本身的执行时间大于等于间隔时间时，定时器将立即执行下一个任务而不等待。可变间隔时间的执行模式最大程度上避免了耗时任务带来的更长执行延迟，因此有更高的执行效率。

而在<code>BF</code>模式下，无论任务执行时长是多少，定时器都保持固定的间隔时间来执行下一个任务。因此高耗时的任务将直接影响执行频率。这是和<code>setInterval</code>一样的传统执行模式。

只有当任务执行时间无限接近于零时，这两种执行模式才是等效的。绝大多数时候，定时任务都需要设置为<code>OF</code>模式。

> 动画与游戏开发
>
> 如果你是高级游戏开发者，你可以基于Timer类来定制你的游戏主循环类。
> 
> 如果你是高级动画开发者，你可以继承JSAN中Anim类和使用AnimTimer类（是Timer类的子类）来实现自己的动画类。

## Promise助手
HTML5提供了Promise API来更好的支持异步回调式编程。
例如，我们实例化一个Promise对象：
```javascript
let p = new Promise<T>((resolve, reject) => {
    ...
    resolve(1);
    ...
    reject(2);
})
```
上述代码显得不够简明且产生了硬值依赖，JSDK提供了助手类JS.util.Promises可以实现更好的写法：
```javascript
let p = Promises.create(function(a, b){
    ...
    this.resolve(a);
    ...
    this.reject(b);
}, 1, 2)
```

### 计划与计划队列
JSDK将一个返回Promise类型的函数定义为PromisePlan计划（TS类型）：
```javascript
export type PromisePlan<T> = (value?:any)=>Promise<T>;
```
而将一组PromisePlan计划定义为PromisePlans计划队列：
```javascript
export type PromisePlans<T> = Array<PromisePlan<T>>;
```

### 计划队列的执行
一个异步计划的执行很简单，一组异步计划的执行与结果返回才是难点。<br>

原生的Promise类已提供两种队列执行模式：
* <b>all</b>: 并行执行，所有异步执行都完成才返回。
* <b>race</b>: 并行执行，任一个异步执行完成就返回。

现实情况下，我们常常需要第三种执行模式：
* <b>order</b>: 串行执行，执行完一个异步才能执行下一个异步。最后一个执行完毕才返回。

Promises类提供了对以上三种执行模式的支持：
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