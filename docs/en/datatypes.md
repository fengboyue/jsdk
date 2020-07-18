## Common TS Types
JSDK predefine some common types in TS, which can be used as variable types directly: 
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

## Classes of data structure
JSDK provids following data structure classes in the "JS.ds.*" package:
* BiMap: Bidirectional mapping table
* LinkedList: Bidirectional linked list for high frequency insert and delete operations
* Queue: FIFO Queue
* Stack: FILO Stack

## Type determination
JSDK provides tool class <b>JS.util.Types</b> to determine data type of variables.

### Determinate variable type
```javascript
Types.typeof(a)
```
This method determines and returns one of the following predefined types:
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

### Determine by specified type
```javascript
Assert.true(Types.isKlass(new Error(), Error));
Assert.true(Types.ofKlass(new JSError(), Error));
Assert.true(Types.equalKlass(Error, Error));
Assert.true(Types.subKlass(JSError, Error));

Assert.true(Types.equalClass(Object.class, Object.class));
Assert.true(Types.subClass(String.class, Object.class));

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

## Value Checking
JSDK provides tool class <b>JS.util.Check</b> to check value or format of variables.

### Empty values checking
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

### Format Checking
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
* *See api doc for more methods*

### Check by server
```javascript
Check.byServer({
    url:'xxx.json',
    type:'json'
}, (res)=>{
    return res.data.code == 'success'
}).then((ok)=>{
    Assert.true(ok)
})
```

## Numerical Calculation
### Extension methods on Number
JSDK extends the prototype chain of the Number object.

For example: Add stringfy method, can transfer the number even represented by scientific notation to a numeric string in normal format.
```javascript
Assert.equal(Number(-1e-7).stringify(), '-0.0000001');
Assert.equal(Number(2/3).stringify(), '0.6666666666666666');
```

Another example: Add high-precision add/subtract/multiple/divide methods to solve the problem of float operation error.
```javascript
Assert.equal(Number(0.1).add(0.2).stringify(), '0.3');
Assert.equal(Number(0.15).sub(0.1).stringify(), '0.05');
Assert.equal(Number(0.1).mul(0.2).stringify(), '0.02');
Assert.equal(Number(0.15).div(0.2).stringify(), '0.75');
```
* *See api doc for more methods*

### Math Operations
JSDK provides tool class <b>JS.util.Numbers</b> to calculate math operations.

#### Termwise calculation
```javascript
Assert.equal(Numbers.termwise(1.01, '+', 1), 2.01);
Assert.equal(Numbers.termwise(0.15, '/', 0.2, '+', 0.3), 1.05);
```

#### Algebra calculation
```javascript
Assert.equal(Numbers.algebra(' - 2.01*(0.3894567-1.5908+7.9999)/(+3.1-9.9)'), 2.0095733775);
Assert.equal(Numbers.algebra(' a*(0.3894567-1.5908+d)/(+b-c)', {
    a: -2.01,
    b: 3.1,
    c: 9.9,
    d: 7.9999
}), 2.0095733775);
```

> Remarks
>
> Base on Number/Numbers of JSDK helps you develop better JS calculators.