JSDK 2.0是最全面的JS/TS框架之一，几乎包括了从最底层到最上层的众多特性、框架与工具。<br>
它非常适合做任何JS库的基石，就像JDK在Java中的作用那样。

主要支持以下特性： 
<p class="warn">
注解、反射、切面、IOC容器与组件、依赖注入、线程、定时器、单元测试、事件总线、应用框架，还提供一组高级UI组件及强大的工具箱。
</p>
基于JSDK来开发你的类库、组件、应用甚至游戏，你的开发工作将得到巨大的助力。

## 下载
```shell
npm install jsdk-offical -g
```

## 基础知识 
JSDK 2.0是基于 <code>ES6 / TypeScript 2.0+</code> 编写的。

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

## JSDK在线资源
你可以访问以下在线资源更多的了解JSDK：
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
1. 假设你本地JSDK安装目录为<code>{JSDK-DIR}</code>。
2. 在你本机运行一个Http Server，设置服务器的Web路径 <code>http://localhost/jsdk/</code> 指向你的<code>{JSDK-DIR}</code>。
3. 打开浏览器访问此Web地址。

## 许可协议
JSDK自2.0版开始支持MIT许可协议。
* *JSDK发布包中所引入的其他开源类库受其申明的许可协议保护*

## 旧版本
<a href="https://sourceforge.net/projects/jsdk2/" target="_blank">
旧版本的JSDK</a>已不再升级与维护，请使用最新的2.0版本。