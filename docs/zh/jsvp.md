## JSVP架构
JSVP是一个由JSDK推荐的应用层开发架构，它包括三层：页面层－视图层－服务层，即Service－View－Page，类似于MVC(Model-View-Controller)。实践证明，这样的应用层架构的优点是结构清晰、开发高效、便于重用、易于维护。

其中：
> Service层：提供共享式服务，比如业务数据的存取、邮件／短信收发、定时器动画、大数据处理线程等公共服务，被全体View或Page调用。一组相关的服务方法应集中在一个服务类中。
>
> View层：是widgets的容器，提供对托管widgets的渲染、销毁、事件响应与数据存取。一个组件应该仅被一个View管理，一个页面允许存在多个View类。
>
> Page层：是页面内所有Views的控制器，也是页面级或应用级的事件处理器。每个页面应对应一个Page类。

* *所有Service类、View类、Page类都必须使用@compo注解*
* *Service类中仅可使用@inject注解自动注入其他Service类，不应该用到任何View类或Page类*
* *View类中仅可使用@inject注解自动注入其他View类或Service类，尽可能少用到Page类*
* *Page类中仅可使用@inject注解自动注入View类或Service类，不应该用到其他Page类*

## 标准目录
JSVP推荐的工程目录如下：
```
+ build/         //build scripts
+ dist/          //complied js files
+ libs/          //libraries
+ html/          //html files
+ style/         //css and images
- source/        //ts source code
     + model/    //model classes
     + api/      //api classes
     + service/  //service classes
     + view/     //view classes
     + page/     //page classes
```

## 工程示例
例如，你需要一个读取登录用户信息的页面。你可以参考以下步骤：
1. 在html目录下创建页面<code>login_user.html</code>

```
- html/          //html files
  login_user.html
```

记得在<code>login_user.html</code>中静态加载JSDK核心库：

```html
<script src="/libs/jsdk/{JSDK-VERSION}/jscore.js"></script>
<script src="/libs/jsdk/{JSDK-VERSION}/jsdk-config.js"></script>
```

2. 在source目录中创建这些目录及文件：

```
- source/        //ts source code
     - model/    
       User.ts
     - api/      
       UserApi.ts
     - service/  
       UserService.ts
     - view/     
       UserView.ts
     - page/ 
       LoginUserPage.ts
```

3. 最后，我们创建一个全局文件：<code>app-config.ts</code>放置于source根目录下，用来初始化应用：

```javascript
JS.config({
    minimize: false, //for develop mode
    jsdkRoot: '/libs/jsdk/{JSDK-VERSION}',
    libRoot: '/libs'
})
App.init({
    name: 'MyApp', //project name
    version: '1.0' //project version
})
```

同时在<code>LoginUserPage.ts</code>加载此<code>app-config.js</code>：

```javascript
JS.imports([
    '$jsvp', //load jsvp library
    '/source/app-config.js', //load global file
    '/source/page/LoginUserPage.js', //load current page class
    ...
]).then(()=>{
    Page.init(LoginUserPage);
})
```

4. 完整的示例代码请访问：
http://fengboyue.github.io/jsdk/examples/app/html/login.html

## 事件处理
JSVP支持两级事件机制，分别是页面级事件和应用级事件。

### 应用级事件
一个应用级事件会在当前浏览器的所有页面中广播。这意味着，当一个页面发布应用级事件时，其他页面的订阅者会立即被通知到。

例如，当用户在当前页面上点击“退出”按钮。此按钮发布了一个应用级事件"logout"，那么其他页面的订阅代码都会立即知道此事件发生。

其他页面提前订阅“退出”事件：
```javascript
App.onEvent('logout', (e: AppEvent) => {
    //self.close(); //用户退出了，我们也把自己关了吧
})
```
当前页面发布“退出”事件：
```javascript
Dom.$1('#btn').on('click', ()=>{
    ...
    App.fireEvent('logout');
})
```

### 页面级事件
一个页面级事件只会在当前页面中广播。

例如，页面上的某个组件widget1重新加载数据后，发布了一个页面级事件“widget1.reload”，那么同一页面的订阅代码都会立即知道此事件发生。

其他代码提前订阅事件：
```javascript
Page.onEvent('widget1.reload', (e) => {
    //widget1重新加载了，我们也刷新下吧
})
```
widget1发布事件：
```javascript
Page.fireEvent('widget1.reload');
```
