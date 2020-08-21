
## Multithreading
As we all know, there are at least three threads in browser: JS thread, UI thread and event thread.
JS thread is the main thread of JS engine, which usually runs in single thread mode and is mutually exclusive with UI thread. For example, when we execute a time-consuming JS code, we will obviously feel that UI is not responding.<br>
To improve performance, HTML5 provides a multi-threaded API named WebWorker. Using this new feature, we can create sub threads in JS main thread. We can put time-consuming code into a sub thread to execute in parallel, so as to reduce the running time of main thread and the blocking time of UI thread.

### Replace WebWorker With Thread
Webworker requires that sub-thread code be written in a separate JS file:
```javascript
let worker = new Worker('http://mydomain/calculate.js');
```
This brings many of problems:
<p class="tip">
Deployment opaque: The calling code in main thread must know the deployment URL of the sub-thread file.
<br><br>
Loading library code cannot be omitted: The sub-thread file header must load every dependented js library manually.
<br><br>
Non object-oriented: It runs thread file not thread class.
<br><br>
Poor mutual accessibility: The code in the sub thread file can not directly call another code in main thread, but only allowed to return message data.
</p>

JSDK provides a new thread class <b>JS.lang.Thread</b> to substitute for WebWorker. 
Its key features are as follows:
> Two running modes: supports runing both thread code(code-mode) and thread file(file-mode).
>
> When a Thread runs in thread code, a temporary thread file will is created automatically.
> When this temporary thread file once be created, it will automatically find the URL of jscore.js or jscore.min.js in main thread. If the jscore file be found, it will be loaded automatically, so as to ensure that sub thread runs in same of JSDK with main thread.
>
> In the "run" method(the threaded method) of Thread class, you can: call other non-threaded methods of this thread class; or send a message to main thread; or stop this thread.
>
> In non-threaded method of Thread class, you can: send a message to sub-thread code or file; or stop this thread.

*Note: Please avoid circular calls between threaded method and non threaded methods, which may lead to dead loops.*

### Thread Example Code
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

If you need to use third-party library in thread code-mode, you must load these libraries in head of thread code:
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

### Ajax in Thread
We know that Ajax (sync or async) will open a new HTTP connection. If this connection is time-consuming, you can execute Ajax in thread mode:
```javascript
Http.send({
    url: '....',
    thread: true //send ajax request in webworker thread
})
```
<p class="tip">
Notes:
<br><br>
1. Please do not read or write DOM objects in the "run" method or thread file, which is forbidden by WebWorker. Want to access DOM, you can send a message in threaded method to notify some non-threaded methods to do it.
<br><br>
2. The Thread class in old version of JSDK is actually a pseudo thread class, is a loop controller based on setTimeout function. 
It is designed for the old version of jsgf(JSDK Game Framework), has a narrow usage and be blocking main thread. If you want to use JSDK in game projects, I strongly recommend that you use JSDK 2.0+ for better game performance and more advanced syntaxes.
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

<b>Used in Animations and Games</b>
>
> If you are a senior game developer, you can customize your main loop class based on Timer class.
> 
> If you are a senior animation developer, you can extend from Anim class and use AnimTimer class(a subclass of Timer), and then customize your animation class.