Since version 2.5, JSDK abstracts many of advanced syntax features from jscore module to new <b>jsugar</b> module. For some modules such as <b>jsmvc/jsvp/jsunit</b>, these syntax sugars such as <b>reflec/annotation/aop</b> is basic and indispensable; However, for other modules, it is not required at all. Therefore, it is a better way to use these features as a separate library for choosing by other libraries.
* jsunit/jsmvc/jsvp has been configured to import jsugar automatically.

## Annotation
Annotation provides more additional information for class, is also foundation feature of AOP and DI.

### Usage of Annotation
Let's take a look at example code:
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
- *@deprecated is an annotation function provided by JSDK, prints warning message on console to indicate that a class or property or method has been discarded.*

### Predefined Annotations
JSDK has defined the following annotation functions, which can be used directly:

Annotation|In Module|Scope
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

- *See api doc for parameters of annotation function*

### Custom Annotation
Suppose you want to define a new annotation: <code>@version</code>, it is used to record the version of class.

1. Define new annotation
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

2. Use new annotation
```javascript
@version('1.2.3')
export class MyClass {
}
Konsole.print(Annotations.getValue(version, MyClass)); //print: 1.2.3
```

## Reflection
Reflection is a mechanism for dynamically obtaining the information of class properties and methods at runtime. 
It allows us to dynamically instantiate a class, dynamically call its methods and dynamically read or write its properties.

- *The reflection functions of JSDK is provided by <b> JS.reflect.Class</b>. If you have know Java, it will be easier to understand.*

### Make Reflectable Class
Unlike Java, not every JS class supports reflection. JSDK has two ways to make a class supports reflection.

<b>[Way 1]</b><br> 
When define a class, use annotation <code>@klass</code> to mark it as reflectable class.
```javascript
module WHO {
    export namespace virus {
        @klass('WHO.virus.Convid19') //Argument must be full name of the class
        export class Convid19 {
        }
    }
}        
```

<b>[Way 2]</b><br> 
You can also use tool method. (This way is more suitable for classes that cannot be annotated)
```javascript
Class.reflect(Convid19, 'WHO.virus.Convid19');
```
* Native <b>Object</b> class already supports reflection in jsugar.

<br>


<b>Tip:</b> The following annotations can mark a class to support reflection:
- @klass
- @component
- @widget

### Use of Reflections
When a class supports reflection, you can access more inner informations using its reflection class.

1. Get reflect Class
```javascript
let cls1 = Convid19.class;
Konsole.print(cls1) //print the reflect Class of Convid19
let cls2 = new Convid19().getClass();
Konsole.print(cls2) //print the reflect Class of Convid19
let cls3 = Class.forName('WHO.virus.Convid19');
Konsole.print(cls3) //print the reflect Class of Convid19
Konsole.print(cls1===cls2 && cls2===cls3) //print true
```

2. Get methods and fields
```javascript
let c = new Convid19(),
    cls = c.getClass();
Konsole.print(cls.getKlass()); //print Convid19
Konsole.print(cls.methods());  //print all static methods and instance methods
Konsole.print(cls.fields(c));  //print all static fields and instance fields
```

3. Reflective instantiation
```javascript
let c = Class.newInstance('WHO.virus.Convid19'); //equals: new Convid19();
```

## AOP
AOP is mechanism of replacing for the original function or method. New function can be implanted at a cut point to modify its original behavior.

<b>jsugar</b> supports the following cut points of AOP:
- before
- around
- after
- throws

You can AOP a function in <b>jsugar</b>:
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
*Note: the original function has not been changed*

You also can AOP a method of class using its reflectable class in <b>jsugar</b> :
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

*Note: The class method has been changed. If you need to restore the original method, execute cancelAop:*
```javascript
Date.class.cancelAop('format');
```

You also can AOP a method of class by AOP annotations in <b>jsugar</b>:
```javascript
class Me {
    @before((s)=>{return s+'\n'})
    format(s:string){
        return s
    }
}
```
