## 开发环境安装
请先自行安装以下开发工具：
```
Node.js
TypeScript      推荐3.0+
VSCode          推荐1.45+
uglifyjs        首选压缩工具，可选
```

## 工程中使用JSDK
我们以TS工程中使用JSDK为例。

### 创建工程 
1. 先在VSCode上创建新工作区或导入已有工程入新工作区。<br>
再在你的<code>{PROJECT-ROOT}/</code>下创建以下目录结构：

```
|--libs   //library directory for JSDK
|--dist   //compiled js files
|--source //source ts/js files
|--build  //build scripts
```

2. 拷贝 <code>/{JSDK-INSTALL}/libs/</code>下的所有文件到 <code>{PROJECT-ROOT}/libs/</code>;<br>
再拷贝 <code>/{JSDK-INSTALL}/dist/</code> 下的所有文件到 <code>{PROJECT-ROOT}/libs/jsdk/{JSDK-VERSION}/</code>。

* *JSDK-VERSION就是你安装的JSDK的版本号，例如：2.0.0, 2.2.0等*

### 工程配置
为了让你工程中的JSDK能正确加载已配置的类库，那么你需要修改JSDK的全局配置。

假设你的工程部署网址为：<code>{PROJECT-URL}</code> 。<br>
* *此URL可以使用相对地址*

<b>[方法一]</b><br>
直接修改JSDK的全局配置文件<code>{PROJECT-ROOT}/libs/jsdk/{JSDK-VERSION}/jsdk-config.js</code>
```
libRoot:  '{PROJECT-URL}/libs',
```

<b>[方法二]</b><br>
或者在TS代码中动态配置
```
JS.config({
    libRoot:  '{PROJECT-URL}/libs',
})
```
* *全局配置项的详细说明请参看的“类库管理”章节*

### 加载核心库

必须在HTML中先加载JSDK核心库<code>jscore</code>及全局配置文件<code>jsdk-config.js</code>：

```html
<!--JSDK's necessary kernel file-->
<script src="{PROJECT-URL}/libs/jsdk/{JSDK-VERSION}/jscore.min.js"></script>
<!--JSDK's global config file-->
<script src="{PROJECT-URL}/libs/jsdk/{JSDK-VERSION}/jsdk-config.js"></script>
```

### 加载非核心库

有两种方式加载JSDK中已配置的非核心库：动态加载与静态加载。

<b>[动态加载]</b><br>
在TS／JS代码中加载类库，这是推荐的方式。
```javascript
/// <reference path="../libs/jsdk/{JSDK-VERSION}/jsdk.d.ts" /> 
JS.imports([
    '$jsunit' //you need to load a library named jsunit
]).then(()=>{
    //do you want
});
```
<b>[静态加载]</b><br>
在HTML代码中加载类库。
```html
<script src="{PROJECT-URL}/libs/jsdk/{JSDK-VERSION}/jsunit.min.js"></script>
```

### TS工程编译
创建一个编译配置文件<code>build/build.json</code>：
```
{
    "compilerOptions": {
        "charset": "utf-8",
        "module": "none",
        "target": "es6",
        "noImplicitAny": false,
        "removeComments": true,
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true,
        "sourceMap": false,
        "listFiles":true,
        "noLib": true,
        "outFile": "../dist/myproject.js"
    },
    "include": [
        "../source/**/*.ts"
    ]
}
```
假设你的系统为Linux或MacOS，创建构建脚本<code>build/build.sh</code>：
```
#!/bin/bash
name="myproject"
echo "Start to complie ${name}"
tsc -d --target es6 -p build.json
echo "Start to minify ${name}"
uglifyjs ../dist/${name}.js --warn --ecma 6 -o ../dist/${name}.min.js
echo "Finished building ${name}"
```

最后，执行<code>build.sh</code>来编译工程源码。<br>
编译成功后的文件位于<code>{PROJECT-ROOT}/dist/</code>下：
<p class="warn">
myproject.js<br>
myproject.min.js
</p>