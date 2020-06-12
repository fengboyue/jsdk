JSUnit is a unit test framework in JSDK, which can help you write and run test cases to improve your code quality.
* *First you can visit the [JSDK Self-test Page](http://localhost/tests/), it is an visual example of JSUnit.*

Let's learn how to write test cases in JSUnit and how to run them.<br>
1. Create a testcase in the file: <code>MyTest1.ts</code> .

```typescript
@klass('MyTest1')
export class MyTest1 extends TestCase {

    protected setUp() {
        //The method named setUp will be executed before the start of each test method
    }
    protected tearDown() {
        //The method name tearDown will be executed after the ending of each test method
    }

    public test1() {
        Assert.true(1===1);//Add assert code for your test
    }
}
```

2. If you need to group many of test cases, you can define a test suite to manage them, for example : <code>SimpleTestSuite.ts</code> .

```typescript
@klass('SimpleTestSuite')
export class SimpleTestSuite extends TestSuite {
    constructor() {
        super([
                MyTest4.class, //This suite contains three test cases by default
                MyTest5.class,
                MyTest6.class,
        ])
    }
}
```

3. Create a JSUnit running page.

First compile all TS files into a JS file. Such as <code>my-test.js</code>。<br>
Then copy two files <code>/tests/jsunit.css</code> and <code>/tests/index.html</code> into your testing directory.
Finall remove old code and add new code in <code>index.html</code>: 
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

4. Open a browser and visit the html on web server, then you can see the test result of automatic running.