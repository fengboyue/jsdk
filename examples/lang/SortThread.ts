
/// <reference path="../../dist/jsdk.d.ts" /> 
/// <reference path="QuickSorter.ts" /> 

module JS {

    export namespace example {

        export class SortThread extends Thread {

            public run(this:ThreadRunner){
                this.imports('/examples/lang/QuickSorter.js');
                
                this.onposted((numbers: number[])=>{
                    let sorted = new JS.example.QuickSorter().sort(numbers);
                    this.callMain('print', sorted);
                })
            }

            public print(numbers:number[]){
                let html = '';
                numbers.forEach(n=>{
                    html+=`${n}<br/>`
                })
                $1('#sorted1').html(html);
            }

            public sort(numbers:number[]){
                this.start();
                this.postThread(numbers)
            }
            
        }
    }

}
import SortThread = JS.example.SortThread;
