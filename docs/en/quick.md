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

### v2.6.0 - 2020/9/1
- Add val|css|empty|remove methods for HTMLElement.
- Bugfix the return values by box() of HTMLElement.
- New "js2d" module for 2D drawing.

### v2.5.0 Milestone - 2020/8/21
- Now "cachedImport" of global configuration supports custom timestamp string.
- New "math" module for vector and geometry calculations.
- New "jsugar" module for containing advanced syntax featues that already exists.
- New "JS.net" package and Http class insteading of old Ajax class.
- Rename NotHandleError class to RefusedError.
- Rename Bundle class to I18N.
- New DataCache class for binary files.
- New ImageCache class for preload images.

### v2.4.0 - 2020/8/3
- Support drag/tap events for mobile browsers.
- Rename system module to jscore.
- Rename jsmv module to jsmvc.
- Refactor some class of the input module.
- Set the default interval time of SeqKeys to Infinity.
- Change "canImport" to "closeImport" in global configuration.
- Rename "minimize" to "minImport" in global configuration.
- Add new "cachedImport" item in global configuration.

### v2.3.1 - 2020/7/26
- Fix a bug of EventBus's _call method caused by the last refactoring.
- Fix a bug when Bom.ready() had been called many times.
- Remove redundancy @aop annotation.
- Refactor some methods of Page class.
- Refactor App Event.
- Minify size of source code.
- Minify Reflect.js.

### v2.3.0 - 2020/7/24
- New "media" module supports advanced audio and video players.
- Add interval time for Seqkeys in Keyboard class.
- Ajax class supports new response type: arraybuffer.

### v2.2.0 - 2020/7/17
- New "input" module for complex key and mouse events.
- Generate index.html for every directory of examples automatically.
- Rename "importMode" to "canImport" in global configuration.
- Now, if EventHandler function renturn false means that: evt.stopPropagation();evt.preventDefault().
- Revise parts of contents in the guides.
- Lightweight bugfixes & optimizes.

### v2.1.0 - 2020/7/11
- New "animation" module.
- Add some useful methods to Colors class.
- Add Type.json from Type.object which only presents class instance now.
- Remove and modified some unused methods of Dates class and Date.prototye.
- Remove some unused type definitions on Model classes.
- Remove some unused jsdocs.
- Redesign new stronger Timer class for constant interval time and calculation of FPS.
- Move all Model and View classes to new "jsmv" module from old "jsui" module.
- Rename the package of "JS.data.*" to "JS.ds.*" and create separated "jsds" module for keeping core module smaller.
- Move the package of "JS.store.*" to "jsvp" module for keeping core module smaller.

### v2.0.0 Milestone - 2020/6/16
- Release all-new JDSK 2.0!

## Old Versions
The <a href="https://github.com/fengboyue/jsdk-0.x" target="_blank">
0.X versions</a> of JSDK was no longer upgraded and maintained. Please use the latest version.