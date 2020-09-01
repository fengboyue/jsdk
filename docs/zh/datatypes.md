## 常用TS类型
JSDK 预定义了一些常用的 <b>TypeScript</b> 类型，可以直接作为变量类型来使用：
```javascript
/**
 * The primitive type of JS language.
 */
export type PrimitiveType = null|undefined|string|number|boolean;

/**
 * The JsonObject type is a JSON object containing zero or more key-value pairs.
 */
export type JsonObject<T = any> {
    [key: string]: T;
}

/**
 * A string of URL
 */
export type URLString = string;

/**
 * Locale string such as "zh-CN", "zh", "en-US", "en"
 */
export type Locale = string;

/**
 * A callback type in json format.
 */
export type Callback<T = Function> = {
    fn: T;             //回调函数
    ctx?: any;         //回调函数的this上下文
    args?: Array<any>; //回调函数的输入参数
}
/**
 * A callback function or callback type in json format.
 */
export type Fallback<T = Function> = T | Callback<T>

/**
 * class constructor
 */
export interface Klass<T> extends Function {
}
```

## 数据结构类
JSDK 在 <b>JS.ds.*</b> 包下提供了以下数据结构类：
* BiMap: 双向映射表
* LinkedList: 双向链表，适合高频插入／删除操作
* Queue: 队列，即先进先出队列
* Stack: 栈，即先进后出栈

## 类型判定
JSDK 提供了工具类 <b>JS.util.Types</b> 来判定各种数据类型。

### 判断变量类型
```javascript
Types.typeof(a)
```
该方法会判断并返回以下预定义类型中的一个：
```javascript
enum Type {
    null = "null",
    undefined = "undefined",
    string = "string",
    boolean = "boolean",
    number = "number",
    date = "date",
    array = "array",
    json = "json",
    object = "object",
    function = "function",
    class = "class",
    symbol = "symbol"
}
```

### 判断指定类型
```javascript
Assert.true(Types.isKlass(new Error(), Error));
Assert.true(Types.ofKlass(new JSError(), Error));
Assert.true(Types.equalKlass(Error, Error));
Assert.true(Types.subklassOf(JSError, Error));

Assert.true(Types.isNull(null));
Assert.true(Types.isUndefined(undefined));
Assert.true(Types.isDefined(''));
Assert.true(Types.isObject({}));
Assert.true(Types.isString(''));
Assert.true(Types.isBoolean(false));
Assert.true(Types.isDate(new Date()));
Assert.true(Types.isArray([]));
Assert.true(Types.isJsonObject({}));
Assert.true(Types.isFunction(()=>{}));
Assert.true(Types.isSymbol(Symbol()));
Assert.true(Types.isRegexp(/1/));

Assert.true(Types.isNumber(1));
Assert.true(Types.isNumeric('1'));
Assert.true(Types.isInt(1));
Assert.true(Types.isFloat(1.1));
Assert.true(Types.isNaN(Number('a')));

Assert.true(Types.isArguments(...));
Assert.true(Types.isArrayBuffer(...));
Assert.true(Types.isTypedArray(...));
Assert.true(Types.isFile(...));
Assert.true(Types.isFormData(...));
Assert.true(Types.isError(...));
Assert.true(Types.isElement(...));
Assert.true(Types.isWindow(...));
```

## 值检查
JSDK 提供了工具类 <b>JS.util.Check</b> ，用来检查变量的值内容或格式。

### 空值检查
```javascript
Assert.true(Check.isBlank(null));
Assert.true(Check.isBlank(undefined));
Assert.true(Check.isBlank('  '));

Assert.true(Check.isEmpty(null));
Assert.true(Check.isEmpty(undefined));
Assert.true(Check.isEmpty([]));
Assert.true(Check.isEmpty({}));

Assert.true(Check.isEmptyObjecy(null));
Assert.true(Check.isEmptyObjecy(undefined));
Assert.true(Check.isEmptyObjecy({}));
```

### 格式检查
```javascript
Assert.true(Check.isIP('127.0.0.1'));
Assert.true(Check.isEmail('a@b.c'));
Assert.true(Check.isFormatDate('2020/1/1'));

Assert.true(Check.isFormatNumber('-2019.2300', 4, 3));
Assert.true(Check.greater('02019.230', 2019.22222229));
Assert.true(Check.less('02019.22', 2019.220001));

Assert.true(Check.shorter('JSDK', 5));
Assert.true(Check.longer('JSDK', 3));
Assert.true(Check.equalLength('null', 4));
```
* *更多检查方法请查阅API文档*

### 服务器端检查
```javascript
Check.byServer({
    url: 'xxx.json',
    responseType: 'json'
}, (res)=>{
    return res.data.code == 'success'
}).then((ok)=>{
    Assert.true(ok)
})
```

## 数值计算
### Number扩展方法
JSDK 对原生的 <b>Number</b> 对象的原型链作了方法扩展。

例如：增加了stringfy方法，支持将科学计数法表示的数字转换成正常格式的字符串。
```javascript
Assert.equal(Number(-1e-7).stringify(), '-0.0000001');
Assert.equal(Number(2/3).stringify(), '0.6666666666666666');
```

又例如：增加了高精度的加减乘除运算方法，以解决浮点数运算误差问题。
```javascript
Assert.equal(Number(0.1).add(0.2).stringify(), '0.3');
Assert.equal(Number(0.15).sub(0.1).stringify(), '0.05');
Assert.equal(Number(0.1).mul(0.2).stringify(), '0.02');
Assert.equal(Number(0.15).div(0.2).stringify(), '0.75');
```
* *更多扩展方法请查阅API文档*

### 四则计算
JSDK 还提供了工具类 <b>JS.util.Numbers</b> ，其支持多种四则计算。

#### 逐项计算
```javascript
Assert.equal(Numbers.termwise(1.01, '+', 1), 2.01);
Assert.equal(Numbers.termwise(0.15, '/', 0.2, '+', 0.3), 1.05);
```

#### 表达式计算
```javascript
Assert.equal(Numbers.algebra(' - 2.01*(0.3894567-1.5908+7.9999)/(+3.1-9.9)'), 2.0095733775);
Assert.equal(Numbers.algebra(' a*(0.3894567-1.5908+d)/(+b-c)', {
    a: -2.01,
    b: 3.1,
    c: 9.9,
    d: 7.9999
}), 2.0095733775);
```

> 提示
>
> 基于 JSDK 的 Number/Numbers，有助于你开发更好的JS计算器。

## 数据持久化缓存
### 创建缓存数据库
当你有很多二进制大数据的时候，你应该将其持久化至 <b>JS.store.DataCache</b>（基于本地持久化数据库IndexDB）中，而不是保留在内存中：
```javascript
let cache = new DataCache({
    name: 'MyCache' //创建或重新打开一个名为MyCache的本地数据库
});
```

### 写入数据
```javascript
Http.get({
    url: 'xxx.doc',
    responseType: 'blob',
    success: res => {
        cache.write('1', res.data); //write blob data
    }
})
```

你也可以持久化其他格式数据（原始类型或JSON）：
```javascript
cache.write('2', {a: 1, b: '1', c: false}); //write json data
```

### 读取数据
```javascript
cache.read('1').then((data: Blob)=>{
    //do your next
})
```

### 清空缓存数据库
清空 <code>MyCache</code> 缓存数据库：
```javascript
cache.clear().then((data: Blob)=>{
    //do your next
})
```

### 销毁缓存数据库
销毁 <code>MyCache</code> 缓存数据库：
```javascript
cache.destroy().then((data: Blob)=>{
    //do your next
})
```
* 销毁后的 MyCache 实例将无法再读写，除非你重新再创建

## 图像内存缓存
### 创建与预加载
当你需要显示很多图片时，可以用 <b>JS.store.ImageCache</b> 提前预加载：
```javascript
let cache = new ImageCache();
cache.load([
    {
        id: '1',
        url: '../jsfx/carousel/greatwall.jpg'
    }
])
```

### 显示图片
在需要显示的时候再将其显示在界面上：
```javascript
(<HTMLImageElement>$1('#img1')).src = cache.get('1').src;
```

### 清空所有图片
```javascript
cache.clear()
```
