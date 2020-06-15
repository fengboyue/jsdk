
## Library configuration
If a js library named xyz (version 1.0.0) needs to be managed by JSDK, you need to complete the following steps.

1. Create directory <code>/{your project root}/libs/xyz/1.0.0/</code> and copy such following files to the above directory:

```
xyz.js
xyz.min.js
xyz.css
xyz.min.css
xyz.d.ts
```
- *Note: compressed files and d.ts file are recommended but not required*

2. Open the file <code>/{your project root}/libs/jsdk/2.0.0/jsdk-config.js</code> and add configuration item for new library:

```javascript
JS.config({
    ...
    libs: [
        ...
        xyz: [
            '$abc',//Suppose it depends on the existing library "abc"
            '~/xyz/1.0.0/xyz.css',
            '~/xyz/1.0.0/xyz.js'
        ]
    ]
});
```

3. Finally you can load xyz library in <b>JLU</b> format:

```javascript
/// <reference path="{your project root}/libs/xyz/1.0.0/xyz.d.ts" /> 
JS.imports('$xyz').then(()=>{ //$xyz is JLU format
    //your code
});
```
### JSDK global configuration
<code>jsdk-config.js</code> is the global configuration file of JSDK.<br>

You can modify this file directly or dynamically override its configuration items in JS code:
```javascript
JS.config({
    importMode: 'js'|'html',  //When is JS, JSDK will load any library dynamically;
                              //when is HTML, JSDK will not load any library dynamically because any library was loaded statically in HTML.
    minimize: true|false,     //Whether to load minimized files of JS or CSS(load their ".min" file automatically)
    jsdkRoot: null,           //The Root URL of JSDK self-library. The default is null means JSDK deploy in the libRoot directory. 
                              //Note: JSDK self-library is allowed to be deployed outside the libRoot directory
    libRoot: '/libs',         //The Root URL of 3rd party library. 
    libs: {
        ...
    }
})    
```
- *Note: if you override configuration items in JS code, it will only take effect in this page*

### JLU specification
JLU(JSDK Library URI) is an uniform URI format defined by JSDK for library loading.

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

Remarks
> 1. The symbol $ indicates that a library name is followed. For example, "$xxx" means a library named "xxx".
>
> 2. The symbol ~ represents the library root. For example, "~/path/xxx.js" equals to "{libRoot}/path/xxx.js".
>
> 3. An URI ending with "#async" indicates that this resource will be loaded asynchronously, otherwise it be loaded synchronously.

## Loading library
For example: for displaying a JSFX button on a page, you need to load the JSFX library. 
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

## Modules of JSDK
JSDK is divided into several modules(libraries).
The most bottom core module is <b>system</b>, includes all keys features and tools;
The toppest modules are <b>jsvp</b> and <b>jsfx</b>. 
In real development, you don't have to load the entire <code>jsdk.js</code>, but just load the modules you need.

### JSDK Modules List
Module Name|Remarks|Includes|Depends|Min Sizes
---|---|---|---|---
system|core module|JS.util.* <br>JS.lang.* <br>JS.reflect.* <br>JS.ioc.* <br>JS.store.* <br>JS.data.* ||114kb
jsui|Model package & UI interfaces|JS.model.* <br>JS.ui.* |system |32kb
jsfx|JS FaceX: JSDK widgets |JS.fx.* |system<br>jsui|js: 112kb<br>css: 104kb
jsvp|JSDK App Framework|JS.app.* |system<br>jsui|4kb
jsunit|Unit Test Framework|JS.unit.* |system|js: 9kb<br>css: 669b
jsdk|includes all modules|JS.* |system<br>jsui<br>jsfx<br>jsvp<br>jsunit|253kb

### Custom JSDK Module 
When you need smaller module files, you can modify the build scripts in <code>build/</code> directory. 
Remove classes or packages you dont need, and rebuild new module files.

For example, you don't need to use Stack, Queue, LinkedList and other data structure classes of JSDK, you can remove the JS.data.* package in system module.

The detailed steps are as follows:
1. Open the file <code>build/system.json</code>, and remove this line:

```
../source/data/*.ts
```

2. Execute command line after saving: 

```
./build.sh
```
After execution, new generated files such as <code>system.js</code> and <code>jsdk.js</code> in the <code>dist</code> directory no longer include data structure classes.

<p class='tip'>
Warn:<br>
Some classes may be referenced by upper classes, so make sure those upper classes are not used before removing them.<br>
For example, JS.data.BiMap is used by JS.fx.Uploader, so remove the JS.data.* package will make the Uploader widget unavailable.
If you need to use the Uploader widget, you can adjust it slightly: add the BiMap class in <code>system.json</code>.
</p>

