/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.ArraysTest')
        export class ArraysTest extends TestCase {
            private a: Array<any>;

            protected setUp() {
                this.a = [1, '-1', undefined, null, { name: 'jsdk' }];
            }

            public test1() {
                Assert.equalArray(Arrays.newArray(null), []);
                Assert.equalArray(Arrays.newArray(undefined), []);
            }
            public test2() {
                Assert.equal(this.a.findIndex(it=>{return it==1}), 0);
                Assert.equal(this.a.findIndex(it=>{return it===undefined}), 2);
                Assert.equal(this.a.findIndex(it=>{return it===null}), 3);
                Assert.equal(this.a.findIndex(it=>{return it==0}), -1);

                Assert.equal(this.a.findIndex(item => {
                    return 'jsdk' === (item && item.name)
                }), 4);

            }
            public test3() {
                let rst = this.a.remove(item => {
                    return 'jsdk' === (item && item.name)
                });
                Assert.equal(rst.length, 4);
                Assert.equal(this.a.length, 4);
                Assert.equal(null, this.a[this.a.length - 1]);
            }
            public test4() {
                this.a.remove(it=>{return it==1});
                Assert.equal(this.a[1], undefined);
            }
            public test5() {
                let oldLen = this.a.length;
                this.a.add([new Date(), 'insertAt'], 0);
                Assert.true(this.a.length==oldLen+2);
                Assert.true(Dates.isSameDay(new Date(),this.a[0]));
                Assert.true('insertAt'==this.a[1]);

                let b = [1,2,3];
                b.add([4,5]);
                Assert.true(b.length==5);
                Assert.true(b.toString()=='1,2,3,4,5');
            }
            public test6(){
                Assert.false(Arrays.equal([1,2],[2,3]));
                Assert.true(Arrays.equal([1,2],[1,2]));
                Assert.true(Arrays.equal([[1],[2]],[[1],[2]],(item1,item2)=>{
                    return item1[0]===item2[0]
                }));    
            }
            public test7() {
                let a = [1,2,3];
                a[4] = 9;
                Assert.true(a.hasOwnProperty('4') && a[4] === 9);

                Object.seal(a);
                Assert.error(()=>{
                    a[5] = 99;
                });

                a[0] = 123;
                Assert.true(a[0] === 123);
            }
            public test8() {
                let a = [1,2,3];
                a[4] = 9;
                Assert.true(a.hasOwnProperty('4') && a[4] === 9);

                Object.freeze(a);
                Assert.error(()=>{
                    a[5] = 99;
                })

                Assert.error(()=>{
                    a[0] = 123;
                });
            }
        }
    }
}
