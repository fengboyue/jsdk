/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.BiMapTest')
        export class BiMapTest extends TestCase {

            private a = new BiMap<string, number>();

            protected setUp() {
                this.a.clear();
            }

            public test1() {
                this.a.put('k1',1);
                this.a.put('k2',2);
                this.a.put('k3',3);

                let b = this.a.inverse();
                
                Assert.equal('k1', b.get(1));
                Assert.equal(3, b.size());
                Assert.equal(1, this.a.get('k1'));
                Assert.equal(2, this.a.get('k2'));
                Assert.equal(3, this.a.size());
            }
            public test2() {
                this.a = new BiMap<string, number>([
                    ['k1',1],['k2',2],['k3',3]
                ]);
                
                Assert.equal(3, this.a.size());
                Assert.equal(1, this.a.get('k1'));
                Assert.true(this.a.has('k1'));
                
                this.a.delete('k1');
                Assert.equal(2, this.a.size());
                Assert.equal(undefined, this.a.get('k1'));
                Assert.false(this.a.has('k1'));
            }
            public test3() {
                this.a = new BiMap<string, number>([
                    ['k1',1],['k2',2],['k3',3]
                ]);

                Assert.false(this.a.has('k4'));
                Assert.true(this.a.has('k1'));
            }
        }
    }
}
