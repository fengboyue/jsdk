JSDK 2.0+ is the most comprehensive TS/JS framework, including lots of features, frameworks and tools from the bottom layers to top layers. It is very suitable to be the cornerstone of any JS library, like JDK for Java.

It supports such following features:
<p class="warn">
Annotation, Reflection, AOP, IOC & Component, Dependency Injection, Thread, Timer, Unit Test, Event Bus, Animations, Application Framework. A group of advanced widgets and more powerful toolboxes are also provided.
</p>

JSDK will greatly help you to develop libraries, components, widgets, applications and even games.

## Download
Via <code>Github</code>: https://github.com/fengboyue/jsdk/releases

or via <code>npm</code>:
```shell
npm install jsdk-offical -g
```

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
* *If you need to run JSDK on a browser that does not support ES6, please use [Babel](https://babeljs.io/docs/en/).*

## Resources Online
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

## Launch Local Resources
You can launch a http server on your PC to visit these resources quickly.
1. Suppose you download and unzip JSDK to the <code>{JSDK-INSTALL}</code> directory.
2. Run a http server and set your server path <code>http://localhost/jsdk/</code> to refer to your <code>{JSDK-INSTALL}</code>.
3. Open your browser and visit the URL.

## License
JSDK is licensed under the MIT license since version 2.0.
* *Other open source libraries include in JSDK's releases are licensed under their stated licenses*

## Updates

### v2.3.1 - 2020/7/26
[Bugfix] 
- fix a bug of EventBus's _call method caused by the last refactoring.
- fix a bug after Bom.ready() has been called many times.

[Removed] 
- remove redundancy @aop annotation.

[Changed] 
- refactor some methods of Page class.
- refactor App Event.
- minify size of source code.
- minify Reflect.js.

### v2.3.0 - 2020/7/24
[Added] 
- create new module named jsmedia with advanced audio and video players.
- add interval time for Seqkeys in Keyboard class.
- Ajax class supports new response type: arraybuffer.

### v2.2.0 - 2020/7/17
[Added] 
- create new module named jsinput for complex key and mouse events.
- generate index.html for every directory of examples automatically.

[Changed] 
- rename "importMode" to "canImport" in global configuration.
- if EventHandler function renturn false means that: evt.stopPropagation();evt.preventDefault().
- revise parts of contents in the guides.
- lightweight bugfixes & optimizes.

### v2.1.0 - 2020/7/11
[Added] 
- create new animation module named jsan.
- add computedStyle method on HTMLElement.prototype.
- add some useful methods to Colors class.
- add Type.json from Type.object which only presents class instance now.

[Removed] 
- remove and modified some unused methods of Dates class and Date.prototye.
- remove some unused type definitions on Model classes.
- remove some unused jsdocs.

[Changed] 
- redesign new stronger Timer class for constant interval time and calculation of FPS.
- move all Model and View classes to new "jsmv" module from old "jsui" module.
- rename the package of "JS.data.*" to "JS.ds.*" and create new "jsds" module for keeping system module size smaller.
- move the package of "JS.store.*" to "jsvp" module for keeping system module size smaller.

## Old Versions
The <a href="https://sourceforge.net/projects/jsdk2/" target="_blank">
0.x versions</a> of JSDK was no longer upgraded and maintained. Please use the latest version.