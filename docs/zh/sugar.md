从 2.5 版本开始，JSDK将诸多的高级语法特性从核心库抽出到新的 <b>jsugar</b> 库。对于一些类库（<b>jsmvc/jsvp/jsunit</b>等）来说，<b>反射／注解／切面</b>等高级特性是基础特性、不可或缺的，但对于另一些类库来说则完全不需要。所以将这些特性作为一个独立库以供其他类库选择使用是一种更好的方式。
* <b>jsunit/jsmvc/jsvp</b>等库已配置为自动导入<b>jsugar</b>库

## 注解
注解为类提供了更多附带信息，也是AOP切面、依赖注入等特性的基础特性。

### 注解的应用
我们先看一个例子：
```javascript
@deprecated()
export class MyClass {
    @deprecated()    
    public name;

    @deprecated()
    public clone() {
    }
}
```
- *@deprecated是一个JSDK自带的注解函数，会在控制台打印警告信息：提示该类或该属性或该方法已被废弃。*

### 预定义注解
JSDK已定义了以下注解函数，可以直接使用：

注解函数|所属模块|作用域
---|---|---
@klass|jsugar|class
@deprecated|jsugar|class/method/field
@before|jsugar|method
@after|jsugar|method
@around|jsugar|method
@throws|jsugar|method
@component|jsmvc|class
@inject|jsmvc|field
@widget|jsfx|class

- *注解函数的参数请参看API文档*

### 自定义注解
假设我们想要定义一个新注解：<code>@version</code>，它用来记录类的版本信息。

1. 定义新注解
```javascript
export function version(ver: string): any {
    return Annotations.define({
        name: 'version',
        handler: (anno: string, values: Array<string>, klass: Function) => {
            //do you want
        },
        target: AnnotationTarget.CLASS
    }, [ver]);
}
```

2. 读取注解的值
```javascript
@version('1.2.3')
export class MyClass {
}
Konsole.print(Annotations.getValue(version, MyClass)); //print: 1.2.3
```

## 反射
反射是在运行时动态获取类的属性、方法信息的一种机制。它让我们可以对一个类进行动态实例化、动态调用方法、动态读写属性。

- *JSDK的反射特性是由类：<b>JS.reflect.Class</b>来提供的。如果你有Java基础知识，将更容易理解。*

### 让类支持反射
与Java不同的是，并非每个JS类都支持反射特性。JSDK有两种方式可以让类支持反射。<br>
<b>[方法一]</b><br> 
在类定义时使用注解<code>@klass</code>标记其为可反射的类
```javascript
module WHO {
    export namespace virus {
        @klass('WHO.virus.Convid19') //参数必须为类的正确全名
        export class Convid19 {
        }
    }
}        
```

<b>[方法二]</b><br> 
也可以使用工具方法来支持反射。(此方法适更适合于那些无法添加注解的类)
```javascript
Class.reflect(Convid19, 'WHO.virus.Convid19');
```
* 在 <b>jsugar</b> 中，原生的 <b>Object</b> 类已支持反射

<br>


<b>［提示］</b>以下注解可标记一个类支持反射：
- @klass
- @component
- @widget

### 反射的使用
当类支持反射后，我们就可以通过其反射类获取更多的类信息。

1. 获取其反射类
```javascript
let cls1 = Convid19.class;
Konsole.print(cls1) //print the reflect Class of Convid19
let cls2 = new Convid19().getClass();
Konsole.print(cls2) //print the reflect Class of Convid19
let cls3 = Class.forName('WHO.virus.Convid19');
Konsole.print(cls3) //print the reflect Class of Convid19
Konsole.print(cls1===cls2 && cls2===cls3) //print true
```

2. 读取类信息
```javascript
let c = new Convid19(),
    cls = c.getClass();
Konsole.print(cls.getKlass()); //print Convid19
Konsole.print(cls.methods());  //print all static methods and instance methods
Konsole.print(cls.fields(c));  //print all static fields and instance fields
```

3. 反射式实例化
```javascript
let c = Class.newInstance('WHO.virus.Convid19'); //equals: new Convid19();
```

## 切面
切面（AOP）是对原函数或方法的一种替换机制，可在切入点植入新函数用于修改其原有行为。

<b>jsugar</b> 支持以下切入点：
- before
- around
- after
- throws

<b>jsugar</b> 可以对函数切面：
```javascript
let format = function(s: string){
    return ' ' + s + ' '
}
let trim = format.aop({ //Returns a new modified function
    before: (s: string) => {
        ...
    },
    around: function (fn: Function, s: string) {
        return fn.apply(this, [s&&s.trim()])
    },
    after: (returns: string) => {
        ...
    }
})
```
*注意：原函数并未被改变。*

也可以对可反射类的方法切面：
```javascript
Date.class.aop('format', {//The 'format' method of Date class be changed.
    before: (format: string) => {
        Assert.equal(s, format);
    },
    around: function (fn: Function, format: string) {
        return (<string>fn.apply(this, [format])).replace('1900-', '2019-')
    },
    after: (returns: string) => {
        Assert.true(returns.startsWith('2019-'));
    }
})
```

*注意：类方法已被改变。如果需要恢复原方法，执行cancelAop：*
```javascript
Date.class.cancelAop('format');
```

还可以用切面注解，对可反射类的方法切面：
```javascript
class Me {
    @before((s)=>{return s+'\n'})
    format(s:string){
        return s
    }
}
```