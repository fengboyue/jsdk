
## 多线程
众所周知，浏览器至少存在三个线程：JS线程、UI线程及事件线程。JS线程是JS引擎的主线程，通常以单线程模式运行，且与UI线程是互斥的。例如：当我们执行一段耗时的JS代码时，会明显感觉到UI不响应。<br>
为改善性能，HTML5推出了WebWorker的多线程API。利用这个新特性，我们可以在JS主线程内创建子线程：将耗时的代码放入子线程并行执行，从而减少主线程的整体运行时间，同时也减少对了UI线程的阻塞。

### 取代WebWorker
<b>WebWorker</b> 要求将子线程代码写在一个独立JS文件中并加载：
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

<b>JSDK</b> 提供了全新的线程类<b>JS.lang.Thread</b>来取代直接使用 WebWorker API。其关键特性如下：
> 两种运行模式：既支持运行线程代码（run方法代码），也支持运行线程脚本（外部独立文件）。
>
> 当Thread类运行线程代码时，会创建并运行一个临时的子线程脚本。
> 此临时子线程文件创建时会自动查找主线程中的 <b>jscore.js</b> 或 <b>jscore.min.js</b> 的URL地址，找到后会自动加载：以保证和主线程运行在同一JSDK版本环境下。
>
> Thread类的线程方法（run方法）中可以：调用类的其他非线程方法；或向主线程发送消息；或中止本线程执行。
>
> Thread类的非线程方法中可以：向子线程发送消息；或中止本线程执行。

*注意：请自行避免线程方法与非线程方法的循环调用，这可能导致死循环。*

### 线程类示例
举例：在线程中计算两数之和。

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
            this.callMain('_plus', BigNumber.add(data[0],data[1])); //calc using BigNumber
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
Http.send({
    url: '....',
    thread: true //send ajax request in webworker thread
})
```
<p class="tip">
注意事项
<br><br>
1. 请不要在线程代码或线程脚本中读写DOM对象，这是被WebWorker明令禁止的。如需读写DOM，你可以发送消息给主线程代码让其来访问DOM。
<br><br>
2. JSDK旧版本中的Thread类实际上是伪线程类，是一个基于setTimeout函数的循环控制器。它是专为旧版的JSGF(JSDK Game Framework)打造的，比当前新版的真线程类适用范围窄且会阻塞主线程。如果你想要在游戏项目中使用JSDK，那么我强烈建议你使用JSDK 2.0+以便获得更好的游戏性能以及更多的高级语法特性。
</p>

## 定时器
<b>JSDK</b> 提供定时器类 <b>JS.util.Timer</b> 来执行定时化或循环化任务。
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
<b>Timer</b> 类的参数<code>intervalMode</code>提供两种间隔执行模式：<code>OF</code>模式和<code>BF</code>模式。缺省模式为<code>OF</code>。

在<code>OF</code>模式下，定时器将尽可能保持固定的频率（帧率）来执行任务。当任务本身的执行时间大于等于间隔时间时，定时器将立即执行下一个任务而不等待。可变间隔时间的执行模式最大程度上避免了耗时任务带来的更长执行延迟，因此有更高的执行效率。

而在<code>BF</code>模式下，无论任务执行时长是多少，定时器都保持固定的间隔时间来执行下一个任务。因此高耗时的任务将直接影响执行频率。这是和<code>setInterval</code>一样的传统执行模式。

只有当任务执行时间无限接近于零时，这两种执行模式才是等效的。绝大多数时候，定时任务都需要设置为<code>OF</code>模式。

<b>用于动画与游戏</b>
>
> 如果你是高级游戏开发者，你可以基于Timer类来定制你的游戏主循环类。
> 
> 如果你是高级动画开发者，你可以继承JSAN中Anim类和使用AnimTimer类（是Timer类的子类）来实现自己的动画类。