
## Annotation
Annotation provides more additional information for class, is also foundation feature of AOP and DI.

### Use of Annotation
Let's take a look at example code:
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
- *@deprecated is an annotation function provided by JSDK, prints warning message on console to indicate that a class or property or method has been discarded.*

### Predefined Annotations
JSDK has defined the following annotation functions, which can be used directly:

Annotation|Module|Scope
---|---|---
@klass|jscore|class
@deprecated|jscore|class/method/field
@before|jscore|method
@after|jscore|method
@around|jscore|method
@throws|jscore|method
@component|jsvp|class
@inject|jsvp|field
@widget|jsfx|class

- *See api doc for parameters of annotation function*

### Custom Annotation
Suppose you want to define a new annotation: <code>@version</code>, it is used to record the version of class.

1. Define new annotation
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

2. Use new annotation
```javascript
@version('1.2.3')
export class MyClass {
}
Konsole.print(Annotations.getValue(version, MyClass)); //print: 1.2.3
```

## Reflection
Reflection is a mechanism for dynamically obtaining the information of class properties and methods at runtime. 
It allows us to dynamically instantiate a class, dynamically call its methods and dynamically read or write its properties.

- *The reflection functions of JSDK is provided by <b> JS.reflect.Class</b>. If you have know Java, it will be easier to understand.*

### Make Reflectable Class
Unlike Java, not every JS class supports reflection. JSDK has two ways to make a class supports reflection.

<b>[Way 1]</b><br> 
When define a class, use annotation <code>@klass</code> to mark it as reflectable class.
```javascript
module WHO {
    export namespace virus {
        @klass('WHO.virus.Convid19') //Argument must be full name of the class
        export class Convid19 {
        }
    }
}        
```

<b>[Way 2]</b><br> 
You can also use tool method. (This way is more suitable for classes that cannot be annotated)
```javascript
Class.register(Convid19, 'WHO.virus.Convid19');
```

In JSDK, the following JS native classes already support reflection:
- Object
- String
- Boolean
- Number
- Array
- Date

In JSDK, the following annotations can mark class to support reflection:
- @klass
- @component
- @widget

### Use of Reflections
When a class supports reflection, you can access more inner informations using its reflection class.

1. Get reflect Class
```javascript
let cls1 = Convid19.class;
Konsole.print(cls1) //print the reflect Class of Convid19
let cls2 = new Convid19().getClass();
Konsole.print(cls2) //print the reflect Class of Convid19
let cls3 = Class.forName('WHO.virus.Convid19');
Konsole.print(cls3) //print the reflect Class of Convid19
Konsole.print(cls1===cls2 && cls2===cls3) //print true
```

2. Get methods and fields
```javascript
let c = new Convid19(),
    cls = c.getClass();
Konsole.print(cls.getKlass()); //print Convid19
Konsole.print(cls.methods());  //print all static methods and instance methods
Konsole.print(cls.fields(c));  //print all static fields and instance fields
```

3. Reflective instantiation
```javascript
let c = Class.newInstance('WHO.virus.Convid19'); //equals: new Convid19();
```

## AOP
AOP is mechanism of replacing for the original function or method. New function can be implanted at a cut point to modify its original behavior.

JSDK supports the following cut points:
- before
- around
- after
- throws

You can AOP a function in JSDK:
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
*Note: the original function has not been changed*

You also can AOP a method of class using its reflectable class:
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

*Note: The class method has been changed. If you need to restore the original method, execute cancelAop:*
```javascript
Date.class.cancelAop('format');
```

You also can AOP a method of class by AOP annotations:
```javascript
class Me {
    @before((s)=>{return s+'\n'})
    format(s:string){
        return s
    }
}
```

## IOC Container & Components
The <b>JS.ioc.Components</b> is IOC container. It can register, initialize and destroy all IOC components in it and save memory cost effectively.
- *The IOC container only supports single instance mode*

### Define IOC Component
Use <code>@component</code> to mark a IOC component class, indicates that this class will be managed by the IOC container:
```javascript
module Demo {
    export namespace cmp {
        @component('Demo.cmp.ClassA') //Argument must be full name of the class
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
Suppose the type of property "a" in the component <code>ClassA</code> is the component <code>ClassB</code>, you can use the <code>@inject</code> annotation to automatically instantiate property a.
```javascript
module Demo {
    export namespace cmp {
        @component('Demo.cmp.ClassB') 
        export class ClassB {
        }

        @component('Demo.cmp.ClassA') 
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


## Multithreading
As we all know, there are at least three threads in browser: JS thread, UI thread and event thread.
JS thread is the main thread of JS engine, which usually runs in single thread mode and is mutually exclusive with UI thread. For example, when we execute a time-consuming JS code, we will obviously feel that UI is not responding.<br>
To improve performance, HTML5 provides a multi-threaded API named WebWorker. Using this new feature, we can create sub threads in JS main thread. We can put time-consuming code into a sub thread to execute in parallel, so as to reduce the running time of main thread and the blocking time of UI thread.

### Substitute for WebWork
Webworker requires that the sub thread code be written in a separate JS file:
```javascript
let worker = new Worker('http://mydomain/calculate.js');
```
This brings many of problems:
<p class="tip">
Deployment opaque: The calling code in main thread must know the deployment URL of the sub thread file.
<br><br>
Loading library code cannot be omitted: The sub thread file header must write the code to load all dependent class libraries.
<br><br>
Non object oriented: It runs thread files not thread classes.
<br><br>
Poor mutual visits: The code in the sub thread file can not directly call the code in main thread, but only return message data.
</p>

JSDK provides a new thread class <b>JS.lang.Thread</b> to substitute for WebWork. 
Its key features are as follows:
> Two running modes: supports both running thread code and running thread file.
>
> When Thread class runs thread code, a temporary thread file will is created automatically.
> When this temporary thread file is created, it will automatically find the URL of jscore.js or jscore.min.js in main thread. If the jscore file be found, its URL will be loaded automatically, so as to ensure that sub thread runs in same version of JSDK with main thread.
>
> In threaded method (the "run" method) of Thread class, you can: call other non threaded methods of this thread class; or send a message to main thread; or stop this thread.
>
> In non threaded method of Thread class, you can: send a message to the sub thread code or file; or stop this thread.

*Note: Please avoid circular calls between threaded methods and non threaded methods by yourself, which may lead to dead loops.*

### Thread Example
For example, you need to add two numbers in a thread.

The simplest way to write as follows:
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

If the above calculation needs to be repeatedly used or there is more complex logic, you'd better define a thread class to complete the same function:
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

If you need to use third-party libraries in thread code, you must load these libraries in head of thread code:
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

### Ajax in Thread Mode
We know that Ajax (sync or async) will open a new HTTP connection. If this connection is time-consuming, you can execute Ajax in thread mode:
```javascript
Ajax.send({
    url: '....',
    thread: true //send ajax request in webworker thread
})
```
<p class="tip">
Notes:
<br><br>
1. Please do not read or write DOM objects in thread code or thread file, which is forbidden by WebWorker. Want to access DOM, you can send a message to inform the main thread code to do it.
<br><br>
2. The Thread class in JSDK 0.x~1.0 is actually a pseudo thread class, is a loop controller based on setTimeout function. 
It is designed for the old version of jsgf(JSDK Game Framework), has a narrow usage and poor performance compared with the current version of the real Thread class. If you want to use JSDK in game projects, I strongly recommend that you use JSDK 2.0 for better game performance and more advanced features.
</p>

## Timer
JSDK provides <b>JS.util.Timer</b> to execute some scheduled or cyclic tasks.
```javascript
//It will be executed at 23:59:59 tomorrow
new Timer(()=>{
    //do you want
}, {
    loop: 1,
    delay: new Date().add(1, 'd').setLastTime()-new Date()
}).start();

//It will be executed per three seconds and never stops
new Timer(()=>{
    //do you want
}, {
    loop: true,
    interval: 3000
}).start();
```

### Execution Modes
The parameter <code>intervalMode</code> of <code>Timer</code> class provides two interval execution modes: <code>OF</code> mode and <code>BF</code> mode. The default mode is <code>OF</code>.

In <code>OF</code> mode, the timer will maintain a fixed frequency (frame rate) to execute task as quickly as possible. When the execution time of task is longer than or equal to the interval time, the timer will immediately execute the next task without waiting. The execution mode with variable interval time avoids longer delay caused by time-consuming task, so it has higher execution efficiency.

In <code>BF</code> mode, no matter how long the task is executed, the timer keeps a fixed interval to execute next task. Therefore, a time-consuming task will directly affect the execution frequency. This is same execution mode with the traditional <code>setInterval</code>.

Only when the execution time of a task is infinitely close to zero, the two modes are equivalent. Most of times, you need <code>OF</code> mode.

> Animation and Game Developments
>
> If you are a senior game developer, you can customize your main loop class based on Timer class.
> 
> If you are a senior animation developer, you can extend from Anim class and use AnimTimer class(a subclass of Timer), and then customize your animation class.

## Promise Helper
HTML5 provides the Promise api to better support asynchronous callback programming.

For example, we instantiate a Promise object:
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
JSDK names a function that returns Promise type as PromisePlan(TS type class):
```javascript
export type PromisePlan<T> = (value?:any)=>Promise<T>;
```
And names a queue of promise plans as PromisePlans:
```javascript
export type PromisePlans<T> = Array<PromisePlan<T>>;
```

### Promises Execution
The execution of an async plan is very simple, and the execution of a queue of async plans are difficult.<br>

The native Promise class provides two execution modes for promise queue:
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