## JSVP Architecture
JSVP is an application development architecture recommended by JSDK. 
It consists of three layers: Service－View－Page，similar to MVC(Model-View-Controller).
It has been proved that advantages of such an application architecture is clear and efficient, easy reuse and easy maintenance.

Detailed description:
> Service layer: provides shared services, called by Views or Pages. Such as business data access, email / sms sending and receiving, timer animation, big data processing thread, etc. A set of related service methods should be centralized in a service class.
>
> View layer: is the container of widgets, provides rendering, destroy, event response and data access to managed widgets. A widget should be managed by only one View, many views are allowed in one page.
>
> Page layer: is the controller of all views within the page, and also the event processor at page level or application level. Each html should have a page class.

* *All service classes, view classes and page classes must use @component annotation*
* *All service classes only can use @inject to inject other service classes, should not use any view class or page class*
* *All view classes only can use @inject to inject other view class or service classes, should use page classes as little as possible*
* *All page classes only can use @inject to inject other view class or service classes, should not use any other page class*


## Standard Directories
The project directories recommended by JSVP is as follows:
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

## Project Example
For example, you need an application to read login user information. You can finish it by the following steps:

1. In <code>html/</code> directory, create a page: <code>login_user.html</code>

```
- html/          //html files
  login_user.html
```

Remember to load JSDK core library statically in <code>login_user.html</code>:

```html
<script src="/libs/jsdk/2.0.0/system.js"></script>
<script src="/libs/jsdk/2.0.0/jsdk-config.js"></script>
```

2. In <code>source/</code> directory, create these directories and files:

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

3. Finally, create a global file: <code>app-config.ts</code>, which be shared by all pages and be placed in <code>source</code> root directory. It is for application initialization and configuration:

```javascript
JS.config({
    minimize: false, //for develop mode
    jsdkRoot: '/libs/jsdk/2.0.0',
    libRoot: '/libs'
})
App.init({
    name: 'MyApp', //project name
    version: '1.0' //project version
})
```

And load this <code>app-config.js</code> in <code>LoginUserPage.ts</code>：

```javascript
JS.imports([
    '$jsvp', //load jsvp library
    '/source/app-config.js', //load global file
    '/source/page/LoginUserPage.js', //load current page class
    ...
]).then(()=>{
    Page.current(LoginUserPage);
})
```

4. For complete application, please visit:
http://fengboyue.github.io/jsdk/examples/app/html/login.html

## Event Processing
JSVP supports two level events: page-level event and application-level event.

### Application-level Event
An application-level event is broadcast in all pages of the current browser.
When a page publishes application-level event, subscribers of other pages will be notified immediately.

For example, an user clicks the "exit" button on the current page. This button publishes an application-level event "logout", and subscribers of other pages will immediately know that this event occurs.

Other pages subscribe the "logout" event in advance:
```javascript
App.onEvent('logout', (e: AppEvent) => {
    //self.close(); //用户退出了，我们也把自己关了吧
})
```
Publishes the "logout" event on the current page:
```javascript
Dom.$1('#btn').on('click', ()=>{
    ...
    App.fireEvent('logout');
})
```

### Page-level Event
A page-level event is only broadcast in the current page.

For example, the widget1 reloads data and publishes a page-level event "widget1.reload", then all subscribers of same page will immediately know that this event occurs.

Other code subscribe the "widget1.reload" event in advance:
```javascript
Page.onEvent('widget1.reload', (e) => {
    //widget1重新加载了，我们也刷新下吧
})
```
widget1 publishes this event:
```javascript
Page.fireEvent('widget1.reload');
```
