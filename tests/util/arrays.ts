/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.ArraysTest')
        export class ArraysTest extends TestCase {
            private a: Array<any>;

            protected setUp() {
                this.a = [1, '-1', undefined, null, { name: 'jsdk' }];
            }

            test1() {
                Assert.equal(Arrays.newArray(null), []);
                Assert.equal(Arrays.newArray(undefined), []);
            }
            test2() {
                Assert.equal(this.a.findIndex(it=>{return it==1}), 0);
                Assert.equal(this.a.findIndex(it=>{return it===undefined}), 2);
                Assert.equal(this.a.findIndex(it=>{return it===null}), 3);
                Assert.equal(this.a.findIndex(it=>{return it==0}), -1);

                Assert.equal(this.a.findIndex(item => {
                    return 'jsdk' === (item && item.name)
                }), 4);

            }
            test3() {
                let rst = this.a.remove(item => {
                    return 'jsdk' === (item && item.name)
                });
                Assert.true(rst);
                Assert.equal(this.a.length, 4);
                Assert.equal(null, this.a[this.a.length - 1]);
            }
            test4() {
                this.a.remove(it=>{return it==1});
                Assert.equal(undefined, this.a[1]);
            }
            test5() {
                let oldLen = this.a.length;
                this.a.add([new Date(), 'insertAt'], 0);
                Assert.true(this.a.length==oldLen+2);
                Assert.true(new Date().equals(this.a[0], 'd'));
                Assert.true('insertAt'==this.a[1]);

                let b = [1,2,3];
                b.add([4,5]);
                Assert.true(b.length==5);
                Assert.true(b.toString()=='1,2,3,4,5');
            }
            test6(){
                Assert.false(Arrays.equal([1,2],[2,3]));
                Assert.true(Arrays.equal([1,2],[1,2]));
                Assert.true(Arrays.equal([[1],[2]],[[1],[2]],(item1,item2)=>{
                    return item1[0]===item2[0]
                }));    
            }

            test7() {
                let a1 = [1,2,3],a2 = [3,2,1], a3 = [1,3,2];
                Assert.true(Arrays.same(a1,a2));
                Assert.true(Arrays.same(a1,a3));
                Assert.true(Arrays.same(a2,a3));
            }
        }
    }
}
