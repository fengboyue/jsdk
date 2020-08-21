<p class="warn" style="font-size:larger">
In JSDK's world, everything is Class!
</p>

- *Note: all code of this guide are written in TypeScript*

## Definition of Class
The recommended full class name format is:<br>
- {library-name}.{package-name}.{short-class-name}<br>
Like this: JS.util.Strings <br>

Let's learn to define a new class: <b>WHO.virus.Convid19</b>
```javascript
module WHO {

    export namespace virus {

        export class Convid19 {

        }
    }
}        
```
For refering it by its short class name in other classes without import again, you can add one line:
```javascript
import Convid19 = WHO.virus.Convid19;
```

## Type Class
We knew Convid19 is a RNA virus, now define a type class <b>RNA</b> for it: 
```javascript
module WHO {

    export namespace virus {

        export type RNA = JsonObject<Array<Number>>;
    }
}    
import RNA = WHO.virus.RNA;
```

## Abstract Class and Interface
Then define an abstract class <b>RNAVirus</b>and an interface <b>Cloneable</b>:
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
As parent class of <b>Convid19</b>:
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

## Multiple Inheritance
The syntax of JS does not support multiple inheritance, but we can use the prototype chain to realize multiple inheritance in a disguised form. In JS, we call it <b>Mixin</b>.

For example, <b>Convid19</b> class had inherited from <b>RNAVirus</b> class,
and we also want it to inherit from another class <b>InfectiousVirus</b> for gaining its <code>infect</code> method, then we can realize by <b>Mixin</b>: 
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
* The Mixin feature needs importing <b>jsugar</b> module.

## Enumeration Class
Finally define an enumeration class for all known convid viruses: 
```javascript
export enum ConvidViruses {
    '229E' = '229E',
    OC43 = 'OC43',
    NL63 = 'NL63',
    HKU1 = 'HKU1',
    SARS = 'SARS',
    MERS = 'MERS',
    CONVID19 = 'CONVID19'
}     
```

## Class File Management
JSDK recommends to keep up with Java on class file organizations(slightly differents with Java): 
> 1. A class file is BEST to contains only one main class and many subsidiary classes/interfaces/types.
> 
> 2. A class file SHOULD be named by the short class name of its main class. For example: The file Strings.ts is named by the short name of JS.util.Strings.
> 
> 3. A class file SHOULD be stored by the package names of its main class. For example: The file path of Strings.ts is "/util/Strings.ts".
