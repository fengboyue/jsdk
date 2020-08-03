## Install
Please install the following develop tools yourself before using JSDK:
```
Node.js
TypeScript      Recommend v3.0+
VSCode          Recommend v1.45+
uglifyjs        A recommended and optional compression tool
```

## Use JSDK in project
We use JSDK in TS project as an example.

### Create Project 
1. First create a new workspace in vscode or import an existing project into the new workspace.<br>
Then create the following directories in your <code>{PROJECT-ROOT}/</code> directory.
```
|--libs   //library directory for JSDK
|--dist   //compiled js files
|--source //source ts/js files
|--build  //build scripts
```

2. Copy all files under <code>{JSDK-INSTALL}/libs/</code> to <code>{PROJECT-ROOT}/libs/</code>.<br>
Then copy all files under <code>{JSDK-INSTALL}/dist/</code> to <code>{PROJECT-ROOT}/libs/jsdk/{JSDK-VERSION}/</code>.
* *JSDK-VERSION is the version of JSDK you installed, such as: 2.0.0, 2.2.0, etc*

### Project Configuration
In order for JSDK to load its configured libraries correctly in your project, you need to modify the global configuration of JSDK.

Suppose the deployed url of your project is: <code>{PROJECT-URL}</code> .<br>
* *You can use a relative path of the url*

<b>[Way 1]</b><br> 
Open the global configuration file <code>{PROJECT-ROOT}/libs/jsdk/{JSDK-VERSION}/jsdk-config.js</code>, and modify the item:
```
libRoot:  '{PROJECT-URL}/libs',
```

<b>[Way 2]</b><br> 
or configure in TS/JS code:
```
JS.config({
    libRoot:  '{PROJECT-URL}/libs',
})
```
* *For details of global configuration, please refer to the "Library Management" section*

### Loading Core library
JSDK kernel library <code>jscore</code> and the global configuration file <code>jsdk-config.js</code> must be loaded in HTML first: 
```html
<!--JSDK's necessary kernel file-->
<script src="{PROJECT-URL}/libs/jsdk/{JSDK-VERSION}/jscore.min.js"></script>
<!--JSDK's global config file-->
<script src="{PROJECT-URL}/libs/jsdk/{JSDK-VERSION}/jsdk-config.js"></script>
```

### Loading Non-Core libraries
There are two ways to load a library configured in JSDK: dynamic loading and static loading. <br>

<b>[Dynamic loading]</b><br>
Load a library in TS/JS code, which is recommended:
```javascript
/// <reference path="../libs/jsdk/{JSDK-VERSION}/jsdk.d.ts" /> 
JS.imports([
    '$jsunit' //you need to load a library named jsunit
]).then(()=>{
    //do you want
});
```
<b>[Static loading]</b><br>
Load a library in HTML code:
```html
<!-- you need to load a library named jsunit -->
<script src="{PROJECT-URL}/libs/jsdk/{JSDK-VERSION}/jsunit.min.js"></script>
```

### TS Project Compilation
Create the file <code>build/build.json</code> as compile configuration file: 
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
If your system is Linux or Mac OS, create the building script <code>build/build.sh</code>：
```
#!/bin/bash
name="myproject"
echo "Start to complie ${name}"
tsc -d --target es6 -p build.json
echo "Start to minify ${name}"
uglifyjs ../dist/${name}.js --warn --ecma 6 -o ../dist/${name}.min.js
echo "Finished building ${name}"
```

Finally, run the <code>build.sh</code> to compile your project.<br>
The compiled files are located in <code>{PROJECT-ROOT}/dist/</code>:
<p class="warn">
myproject.js<br>
myproject.min.js
</p>