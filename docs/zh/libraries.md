
## 类库配置
假设一个名为xyz的类库（版本1.0.0）需要被JSDK管理，那么你需要完成以下步骤。
1. 创建目录：<code>/{PROJECT_ROOT}/libs/xyz/1.0.0/</code>, 拷贝以下文件至上述目录中：

```
xyz.js
xyz.min.js
xyz.css
xyz.min.css
xyz.d.ts
```
- *备注：压缩文件和d.ts定义文件最好有但非必须*

2. 打开文件 <code>/{PROJECT_ROOT}/libs/jsdk/{JSDK-VERSION}/jsdk-config.js</code>，添加新类库配置项:

```javascript
JS.config({
    ...
    libs: [
        ...
        xyz: [
            '$abc',//假设其依赖已有类库abc
            '~/xyz/1.0.0/xyz.css',
            '~/xyz/1.0.0/xyz.js'
        ]
    ]
});
```

3. 你就可以用<b>JLU</b>格式加载此类库了:

```javascript
/// <reference path="{PROJECT_ROOT}/libs/xyz/1.0.0/xyz.d.ts" /> 
JS.imports('$xyz').then(()=>{ //$xyz is JLU format
    //your code
});
```
### JSDK全局配置
<code>jsdk-config.js</code>是全局配置文件。<br>
你可以直接修改此文件，也可以在代码中动态覆写其配置项：

```javascript
JS.config({
    canImport: true|false,         //True表示JSDK将启用动态加载；False表示JSDK将关闭动态加载因后续类库可能已在html中静态加载过。
    minimize: true|false,          //是否加载JS或CSS资源的最小化文件(自动加载.min文件)。
    jsdkRoot: null,                //JSDK自库的根网址。缺省为null时表示JSDK库部署在{libsRoot}/jsdk/{JSDK-VERSION}下；其他网址时表示部署在该网址。
    libRoot: '/libs',              //第三方类库的根网址。     
    libs: {
        ...
    }
})     
```
- *备注：如果采用代码中覆写配置项，则仅在此页面内生效*

### JLU规范
JLU（JSDK Library URI）是JSDK为类库加载而定义的统一URI格式。

- Format 1
<p class="warn">
http(s)://domain/path/xxx.{js|css|html}(#async)
</p>
- Format 2
<p class="warn">
${libName}
</p>
- Format 3
<p class="warn">
~/{libName}/x.y.z/xxx.{js|css|html}(#async)
</p>

说明：
> 1. 符号 $ 表示后面是类库名。举例："$xxx" 表示类库"xxx"。
>
> 2. 符号 ~ 表示类库的根目录。举例："~/path/xxx.js"的路径等价于 "{libRoot}/path/xxx.js"。
>
> 3. 以"#async"结尾的URI指示JSDK以异步方式加载此资源，否则以同步方式加载。

## 加载类库
例如：在页面上显示一个JSFX按钮，需要加载JSFX类库：
```javascript
JS.imports([
    '$jsfx'
]).then(() => {
    new Button({
        id: 'btn1',
        text: 'This is button1'
    });
})    
```

## JSDK模块
JSDK被划分成多个模块（类库）。最底层的核心模块是<b>system</b>，包含了全部的工具类、反射、注解、线程、切面、容器等基础功能；最上层的模块是<b>jsvp</b>和<b>jsfx</b>。在实际开发中，你可以不必加载整个<code>jsdk.js</code>，而是仅仅加载你需要的模块。
### 模块清单
模块名|备注|所含包|依赖模块|最小尺寸
---|---|---|---|---
system|核心库|JS.util.* <br>JS.lang.* <br>JS.reflect.* ||102kb
jsds|数据结构库|JS.ds.* |system |6kb
jsmedia|音视频播放器|JS.media.* |system |4kb
jsinput|外设事件库|JS.input.* |jsds |7kb
jsui|UI基础库|JS.ui.* |system |5kb
jsmv|模型、视图及IOC库|JS.ioc.* <br>JS.model.* <br>JS.view.* |jsui |29kb
jsan|动画库|JS.an.* |jsui |16kb
jsfx|Widget组件库 |JS.fx.* |jsmv|js: 112kb<br>css: 104kb
jsvp|应用层框架|JS.store.*<br>JS.app.* |jsmv|8kb
jsunit|单元测试框架|JS.unit.* |system|js: 9kb<br>css: 669b
jsdk|包含上述全部模块|JS.* ||js: 279kb

### 自定义模块
当你需要更小尺寸的模块文件，你可以修改build/目录下的构建脚本，去掉不需要用到的类或包，重新构建出自定义的模块文件。

比如，你不需要用到JSFX中的Button类，你可以从jsfx库的构建脚本中去掉JS.fx.Button。具体操作如下：
1. 打开build/jsfx.json文件，删除此行：

```
"../source/fx/Button.ts",
```

2. 保存后执行构建命令：

```
./build-module.sh jsfx
```
执行后，dist/目录下的jsfx.js及jsfx.min.js里不再包含Button类。

<p class='tip'>
警告：<br>
某些类可能被其他类所引用，所以去掉这些类前请确认那些其他类不会被用到。
</p>

