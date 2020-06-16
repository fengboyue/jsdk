JSUnit是JSDK附带的单元测试框架，能帮助你编写、运行测试用例来提升你的代码质量。
* *你可以先访问[JSDK自测页](http://localhost/jsdk/tests/)，直观看到JSUnit的运行效果。*

我们来学习如何用JSUnit编写测试用例并运行。
<br>
1. 编写测试用例类：<code>MyTest1.ts</code>

```typescript
@klass('MyTest1')
export class MyTest1 extends TestCase {

    protected setUp() {
        //每个测试方法开始前执行的代码
    }
    protected tearDown() {
        //每个测试方法结束后执行的代码
    }

    public test1() {
        Assert.true(1===1);//添加断言测试代码
    }
}
```

2. 如果需要将测试用例分组化管理，可以定义测试套件类，比如：<code>SimpleTestSuite.ts</code>

```typescript
@klass('SimpleTestSuite')
export class SimpleTestSuite extends TestSuite {
    constructor() {
        super([
                MyTest4.class, //此套件缺省包含三个用例
                MyTest5.class,
                MyTest6.class,
        ])
    }
}
```

3. 新建测试运行页面

首先，将所有测试类ts文件编译至一个js文件中，比如：<code>my-test.js</code>。<br>
然后，拷贝两个文件 <code>/tests/jsunit.css</code> 和 <code>/tests/index.html</code>到你的新测试目录下。
最后，在index.html中修改旧代码如下：
```html
<script>
    JS.config({
        'minimize': false,  
        'jsdkRoot': '/dist' //maybe needs modify
    });
    JS.imports([
        '$jsunit', 
        'my-test.js'
    ]).then(() => {
        TestRunner.addTests([
            MyTest1.class,
            MyTest2.class,
            MyTest3.class,
            SimpleTestSuite.class
        ]);
        TestRunner.run();
    })
</script>
```

4. 打开浏览器并访问此页面的网址，你就可以看到上述测试代码自动运行后的结果。