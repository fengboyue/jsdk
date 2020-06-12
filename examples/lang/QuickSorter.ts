/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace example {

        export class QuickSorter {
            private _bus = new EventBus(this);

            public onCycle(fn:(e:CustomEvent, array:number[])=>void){
                this._bus.on('cycle', fn)
            }

            public sort(arr: number[]) {
                let len = arr.length;
                if (len <= 1) return arr;

                let index = Math.floor(len / 2),
                    pivot = arr.splice(index, 1)[0],
                    left = [], right = [];

                arr.forEach(a => {
                    a < pivot ? left.push(a) : right.push(a);
                })

                return this.sort(left).concat([pivot], this.sort(right));
            }
        }
    }
}
import QuickSorter = JS.example.QuickSorter;
