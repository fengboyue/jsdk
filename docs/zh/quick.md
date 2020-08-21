JSDK 2.0+是最全面的TS/JS框架，包括了从最底层到最上层的大量特性、框架与工具。<br>
它非常适合做任何JS库的基石，就像JDK在Java中的作用那样。

主要支持以下特性： 
<p class="warn">
注解、反射、切面、组件与依赖注入、线程、定时器、单元测试、事件总线、动画库、应用框架，还提供一组高级UI组件及强大的工具箱。
</p>
基于JSDK来开发你的类库、组件、应用甚至游戏，你的开发工作将得到巨大的助力。

## 下载
从<code>Github</code>上下载: https://github.com/fengboyue/jsdk/releases

或从 <code>npm</code> 上下载:
```shell
npm install jsdk-offical -g
```

## 基础知识 
JSDK 2.0+是基于 <code>ES6 / TypeScript 2.0+</code> 编写的。

如果你第一次接触JSDK，那么你需要先具备以下基础知识：
> ES6的核心语法及新API，比如：类定义／多行字符串／箭头函数／原生类型的新API/Promise等
>
> TypeScript 2.0+ 语法及编译参数
>
> VSCode开发工具的安装与设置，工程的配置与编译

*备注：*
* *如果你仅在普通JS工程中使用JSDK，则无需学习 TypeScript和 VSCode*
* *我<b>强烈建议你在TS工程中使用JSDK</b>，这将让JSDK的全部特性都生效*
* *如果你需要在不支持ES6的浏览器上运行JSDK，请使用 [Babel](https://babeljs.io/docs/en/)*

## 在线资源
你可以访问以下在线资源了解更多：
<p class="warn">
<a href="https://fengboyue.github.io/jsdk/docs/#/zh/quick" target="_blank">JSDK开发指南</a>
<br>
<a href="https://fengboyue.github.io/jsdk/tests" target="_blank">JSDK自测用例</a>
<br>
<a href="https://fengboyue.github.io/jsdk/examples" target="_blank">JSDK示例</a>
<br>
<a href="https://fengboyue.github.io/jsdk/api" target="_blank">JSDK API文档</a>
</p>

## 启动本地资源
启动本地Http Server，访问上述资源将会更快。
1. 假设你本地JSDK安装目录为<code>{JSDK-INSTALL}</code>。
2. 在你本机运行一个Http Server，设置服务器的Web路径 <code>http://localhost/jsdk/</code> 指向你的<code>{JSDK-INSTALL}</code>。
3. 打开浏览器访问此Web地址。

## 许可协议
JSDK自2.0版开始支持MIT许可协议。
* *JSDK发布包中所引入的其他开源类库受其申明的许可协议保护*

## 更新日志

### v2.5.0 Milestone
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
- Add computedStyle method on HTMLElement.prototype.
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

## 旧版本
<a href="https://github.com/fengboyue/jsdk-0.x" target="_blank">
0.X版本的JSDK</a>已不再升级与维护，请使用最新版本。