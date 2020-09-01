
## Library configuration
If a js library named xyz (version 1.0.0) needs to be managed by JSDK, you need to complete the following steps.

1. Create directory <code>/{PROJECT_ROOT}/libs/xyz/1.0.0/</code> and copy such following files to the above directory:

```
xyz.js
xyz.min.js
xyz.css
xyz.min.css
xyz.d.ts
```
- *Note: compressed files and d.ts file are recommended but not required*

2. Open the file <code>/{PROJECT_ROOT}/libs/jsdk/{JSDK-VERSION}/jsdk-config.js</code> and add configuration item for new library:

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
/// <reference path="{PROJECT_ROOT}/libs/xyz/1.0.0/xyz.d.ts" /> 
JS.imports('$xyz').then(()=>{ //$xyz is JLU format
    //your code
});
```
### JSDK global configuration
<code>jsdk-config.js</code> is the global configuration file of JSDK.<br>

You can modify this file directly or dynamically override its configuration items in JS code:
```javascript
JS.config({
    closeImport: boolean,         //True indicates to close importing function. For example: The following libraries had been loaded statically in HTML so that you need close importing.
    cachedImport: boolean|string, //False indicates to add a timestamp "_={now}" after each URL to block loading caching file; String indicates to add a timestamp "_={string}" after each URL to block loading caching file at first time.
    
    minImport: boolean,    //True indicates JSDK will load the minimized file(its ".min" file) of JS or CSS
    jsdkRoot: null|string, //The root url of JSDK self-library. The default is null that indicates JSDK self-library be deployed under libRoot: {libsRoot}/jsdk/{JSDK-VERSION}/. 
                           //Note: The config item means JSDK self-library is allowed to be deployed outside the "libRoot".
    libRoot: '/libs',      //The root url of 3rd-party libraries using by JSDK. 
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
The bottom module is <b>jscore</b>, includes all basic features and tools;
The toppest modules are <b>jsvp</b> and <b>jsfx</b>. 
In real development, you don't need to load the entire <code>jsdk.js</code>, but just load modules you need.

### JSDK Modules List
Module Name|Remarks|Includes|Self Depends|3rd Depends|Min Sizes
---|---|---|---|---|---
jscore|core module|JS.util.* <br>JS.net.* <br>JS.lang.*  ||No|76 kb
jsugar|syntax sugars:<br>reflect/annotation/aop/mixin|JS.sugar.* |jscore|No|28 kb
jsds|data structures+stores|JS.ds.*<br>JS.store.* |jscore |No|13 kb
jsmedia|audio+video|JS.media.* |jsds |No|5 kb
jsmath|math tools|JS.math.* |jscore |No|38 kb
js2d|2d drawing|JS.d2.* |jsmath |No|9 kb
jsui|ui+events|JS.input.*<br>JS.ui.* |jsds |Optional:<br>clipboard/polymer|16 kb
jsmvc|model+views+component|JS.ioc.* <br>JS.model.* <br>JS.view.* |jsugar<br>jsui |Optional:<br>handlebars|29 kb
jsan|animations|JS.an.* |jsui |No|17 kb
jsfx|widgets |JS.fx.* |jsmvc|Yes|js: 112 kb<br>css: 104 kb
jsvp|app framework|JS.app.* |jsmvc|No|4 kb
jsunit|unit-test framework|JS.unit.* |jsugar|Optional:<br>ua-parser|js: 9 kb<br>css: 669 b
jsdk|all above modules|JS.* ||Yes|js: 334 kb

### Custom JSDK Module 
When you need smaller module file, you can modify the build script in <code>build/</code> directory. 
Remove classes or packages you dont need, and rebuild new module files.

For example, you don't need Button of JSFX, you can remove the JS.fx.Button class in building script of jsfx module.

The detailed steps are as follows:
1. Open the file <code>build/jsfx.json</code>, and remove this line:

```
../source/fx/Button.ts
```

2. Execute command line after saving: 

```
./build-module.sh jsfx
```
After execution, new generated files such as <code>jsfx.js</code> and <code>jsfx.min.js</code> in the <code>dist</code> directory no longer includes Button class.

<p class='tip'>
Warn:<br>
Some classes may be referenced by other classes, so make sure those other classes are not used before removing them.
</p>

