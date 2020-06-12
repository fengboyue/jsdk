
## 类库配置
假设一个名为xyz的类库（版本1.0.0）需要被JSDK管理，那么你需要完成以下步骤。
1. 创建目录：<code>/{your project root}/libs/xyz/1.0.0/</code>, 拷贝以下文件至上述目录中：

```
xyz.js
xyz.min.js
xyz.css
xyz.min.css
xyz.d.ts
```
- *备注：压缩文件和d.ts定义文件最好有但非必须*

2. 打开文件 <code>/{your project root}/libs/jsdk/2.0.0/jsdk-config.js</code>，添加新类库配置项:

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
/// <reference path="{your project root}/libs/xyz/1.0.0/xyz.d.ts" /> 
JS.imports('$xyz').then(()=>{ //$xyz is JLU format
    //your code
});
```
### JSDK全局配置
<code>jsdk-config.js</code>是全局配置文件。<br>
你可以直接修改此文件，你可以在代码中动态覆写其配置项：

```javascript
JS.config({
    importMode: 'js'|'html',            //值为js时表示JSDK当前使用动态加载模式，值为html时表示类库已在html文件中静态加载所以JSDK当前关闭动态加载。
    minimize: true|false,               //是否加载JS或CSS资源的最小化文件(自动加载.min文件)。
    jsdkRoot: null,                     //JSDK自库的根网址。缺省为null时表示JSDK库部署在libsRoot目录以下；其他网址时表示部署在该网址。
    libRoot: '/libs',                   //第三方类库的根网址。     
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
${libName}/path/xxx.{js|css|html}(#async)
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
system|核心模块|JS.util.* <br>JS.lang.* <br>JS.reflect.* <br>JS.ioc.* <br>JS.store.* <br>JS.data.* ||114kb
jsui|Model包及UI接口|JS.model.* <br>JS.ui.* |system |32kb
jsfx|JS FaceX：一组widget组件包 |JS.fx.* |system<br>jsui|js: 112kb<br>css: 104kb
jsvp|JSDK应用层框架|JS.app.* |system<br>jsui|4kb
jsunit|单元测试框架|JS.unit.* |system|js: 9kb<br>css: 669b
jsdk|包含全部模块|JS.* |system<br>jsui<br>jsfx<br>jsvp<br>jsunit|253kb

### 自定义模块
当你需要更小尺寸的模块文件，你可以修改build/目录下的构建脚本，去掉不需要用到的类或包，重新构建出自定义的模块文件。

比如，你不需要用到JSDK自带的堆栈、队列、链表等数据结构类，你可以去掉JS.data.*。具体操作如下：
1. 打开build/system.json文件，删除此行：

```
../source/data/*.ts
```

2. 保存后重新执行命令行：

```
./build.sh
```
执行后，dist/目录下的system.js及jsdk.js里不再包含data包。

<p class='tip'>
警告：<br>
某些类可能被上层类所引用，所以去掉这些类前请确认那些上层类不会被用到。<br>
比如，JS.data.BiMap(双向映射表)被JS.fx.Uploader组件所用到，去掉JS.data包将导致Uploader组件不可用。如果你需要用到Uploader组件，可以稍作调整：在system.json文件中添加上BiMap.ts。
</p>

