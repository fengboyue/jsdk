JSDK 2.0+ is the most comprehensive TS/JS framework, including lots of features, frameworks and tools from the bottom to top layers. It is very suitable to be the cornerstone of any JS library, like JDK for Java.

It supports such following features:
<p class="warn">
Annotation, Reflection, AOP, Component & Dependency Injection, Thread, Timer, Unit-Test, Event-Bus, Animations, 2D-Drawing, Application Framework. A group of advanced widgets and more powerful tools are also provided.
</p>

JSDK can greatly help you to develop libraries, components, widgets, applications and even games.

## Download
Via <code>Github</code>: https://github.com/fengboyue/jsdk/releases

or via <code>npm</code>:
```shell
npm install jsdk-offical -g
```

## Usage
Load the core file and global config file of JSDK in HTML:
```html
<script src="{PROJECT-URL}/libs/jsdk/{JSDK-VERSION}/jscore.min.js"></script><!-- ziped: 4kb -->
<script src="{PROJECT-URL}/libs/jsdk/{JSDK-VERSION}/jsdk-config.js"></script><!-- unziped: 5kb -->
```
Load your required library (or JS/CSS files) in TS/JS code and call its API:
```javascript
/// <reference path="../libs/jsdk/{JSDK-VERSION}/jsdk.d.ts" /> 
JS.imports([
    '$jsunit' //Suppose you need to load jsunit library for unit-test
]).then(()=>{
    TestRunner.addTests([
        ......
    ]);
    TestRunner.run();
});
```
* *For JSDK libraries, please read the chapter "Library Management"*


## Basic knowledge 
JSDK 2.0+ was written in <code>ES6</code> and <code>TypeScript 2.0+</code>.

If you touch JSDK for the first time, you need to have these following basic knowledge:
> ES6 core features : class definition / multiline string / arrow function / new native APIs / Promise etc.
>
> TypeScript 2.0+ syntax and compilation parameters.
>
> VSCode: installation, configuration, creation and compilation of projects.

*Remarks*
* *If you only use JSDK in ordinary JS projects, you do not need to learn TypeScript and VSCode.*
* *It is <b>strongly recommended to use JSDK in TS projects</b>, which will make all features of JSDK effective.*
* *If you need to run JSDK on a browser that does not support ES6, please load [Babel](https://babeljs.io/docs/en/) or [es6-shim](https://github.com/paulmillr/es6-shim) before using JSDK.*

## Online Resources 
You can visit the following online resources on Github to know more:
<p class="warn">
<a href="https://fengboyue.github.io/jsdk/docs/#/en/quick" target="_blank">JSDK Guides</a>
<br>
<a href="https://fengboyue.github.io/jsdk/tests" target="_blank">JSDK Self-Tests</a>
<br>
<a href="https://fengboyue.github.io/jsdk/examples" target="_blank">JSDK Examples</a>
<br>
<a href="https://fengboyue.github.io/jsdk/api" target="_blank">JSDK API Docs</a>
</p>

## Local Resources
You can launch a http server on your PC to visit these resources quickly.
1. Suppose you download and unzip JSDK to the <code>{JSDK-INSTALL}</code> directory.
2. Run a http server and set your server path <code>http://localhost/jsdk/</code> to refer to your <code>{JSDK-INSTALL}</code>.
3. Open your browser and visit the URL.

## License
JSDK is licensed under the MIT license since version 2.0.
* *Other open source libraries include in JSDK's releases are licensed under their stated licenses*

## Updates

### v2.7.0 - Milestone
- Update "jscore" for micro kernel.
- Update "jsan" for new tween and frame animations.
- New tool classes such as CssTool, Images, Objects.
- Fix some bugs.

## Old Versions
The <a href="https://github.com/fengboyue/jsdk-0.x" target="_blank">
0.X versions</a> of JSDK was no longer upgraded and maintained. Please use the latest version.