- *备注：以下代码的语法均为TypeScript*

## 类的定义
JSDK推荐的全类名格式为：<br>
- {类库名}.{包名}.{短类名}<br>
比如：JS.util.Ajax。<br>

我们来定义一个类：<code>WHO.virus.Convid19</code>
```javascript
module WHO {

    export namespace virus {

        export class Convid19 {

        }
    }
}        
```
为方便在其他类中直接以短类名访问而无须import导入，我们可以在下方添加一行代码：
```javascript
import Convid19 = WHO.virus.Convid19;
```

## 类型结构的定义
已知Convid19是一种RNA病毒，我们再定义一种数据类型：<code>RNA</code>
```javascript
module WHO {

    export namespace virus {

        export type RNA = JsonObject<Array<Number>>;
    }
}    
import RNA = WHO.virus.RNA;
```

## 抽象类与接口
我们定义一个抽象类<code>RNAVirus</code>及一个<code>Cloneable</code>接口：
```javascript
module WHO {

    export namespace virus {

        export interface Cloneable<T> {
            clone(): T[];
        }

        export abstract class RNAVirus<T> implements Cloneable<T>{
            public readonly rna: RNA;

            constructor(rna: RNA) {
                this.rna = rna
            }
        }
    }
}
import Cloneable = WHO.virus.Cloneable;        
import RNAVirus = WHO.virus.RNAVirus;       
```
作为<code>Convid19</code>类的父类：
```javascript
export class Convid19 extends RNAVirus<Convid19> {
    public clone(): this[] {
        let arr = [];
        for (i = 0, max = Random.number(9999,true); i <= max; i++) { 
            arr[i] = new Convid19(this.rna);
        }
        return arr
    }
}
```

## 混入式多重继承
JS的语法并不支持多重继承，但我们可以利用JS的原型链变相实现多重继承，我们称之为<b>Mixin</b>。

举例：<code>Convid19</code>类已经继承了<code>RNAVirus</code>类，但是我们还想让它继承另一个类<code>InfectiousVirus（传染性病毒）</code>以获得其<code>infect(传染)</code> 方法。
那么我们可以通过<b>Mixin</b>技术来实现：
```javascript
export class InfectiousVirus {
    public infect() {
        ...
    }
    ... //other methods
}

Convid19.mixin(InfectiousVirus, ['infect']); //Only mix the infect method

let c19 = new Convid19(...);
Konsole.print((<InfectiousVirus>c19).infect());
```

## 枚举类
我们为冠状病毒家族定义一个枚举类：
```javascript
export enum ConvidViruses {
    229E = '229E',
    OC43 = 'OC43',
    NL63 = 'NL63',
    HKU1 = 'HKU1',
    SARS = 'SARS',
    MERS = 'MERS',
    CONVID19 = 'CONVID19'
}     
```

## 类文件的管理
JSDK建议参照Java的类文件组织规范：
> 1. 一个类文件最好仅包含一个主类以及与附属类／接口／类型的定义。（这点与Java稍有不同）
> 
> 2. 一个类文件应该以其主类的短类名来命名。比如: Ajax.ts以其主类JS.util.Ajax的短类名取名。
> 
> 3. 一个类文件应该以其主类的包名空间来作为路径存放。比如: Ajax.ts文件路径为：/util/Ajax.ts。

<p class="warn">
在JSDK的世界里，一切皆类！
</p>