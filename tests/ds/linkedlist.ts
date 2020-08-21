/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.LinkedListTest')
        export class LinkedListTest extends TestCase {

            private a = new LinkedList<Number>();

            protected setUp() {
                this.a.clear();
            }

            test1() {
                this.a.add(3);
                this.a.add([2,1]);
                Assert.equal(3, this.a.get(0));
                Assert.equal(1, this.a.get(2));

                this.a.addAt(1, 0.5);
                Assert.equal(0.5, this.a.get(1));
                Assert.equal(4, this.a.size());

                let b = new LinkedList<Number>();
                b.addLast(22); //22
                Assert.equal([22], b.toArray());
                b.addFirst(11); //11,22
                Assert.equal([11,22], b.toArray());
                b.addAt(0,33); //33,11,22
                Assert.equal([33,11,22], b.toArray());
                b.addAt(2,44); //33,11,44,22
                Assert.equal([33,11,44,22], b.toArray());
                
                Assert.equal(4, b.size());
                Assert.equal(33, b.get(0));
                Assert.equal(11, b.get(1));
                Assert.equal(44, b.get(2));
                Assert.equal(22, b.get(3));
                Assert.equal(33, b.getFirst());
                Assert.equal(22, b.getLast());
                
                this.a.addAll(b);
                Assert.equal(8, this.a.size());
                Assert.equal(22, this.a.get(7));
                Assert.equal([3,0.5,2,1,33,11,44,22], this.a.toArray());
            }
            test2() {
                this.a.removeFirst();
                Assert.equal(0, this.a.size());
                
                this.a.removeLast();
                Assert.equal(0, this.a.size());
                
                this.a.add([3,2,1]);
                this.a.removeFirst();
                Assert.equal([2,1], this.a.toArray());
                this.a.removeLast();
                Assert.equal([2], this.a.toArray());
                this.a.removeFirst();
                Assert.equal([], this.a.toArray());
            }
            test3() {
                Assert.equal(null, this.a.peek());
                
                this.a.add([3,2,1]);
                Assert.equal(3, this.a.peek());
                Assert.equal(3, this.a.size());
                
                Assert.equal(1, this.a.peekLast());
                Assert.equal(3, this.a.size());
                
                Assert.equal(3, this.a.peekFirst());
                Assert.equal(3, this.a.size());
            }
            test4(){
                this.a.add([3,2,1,1]);
                Assert.equal(0, this.a.indexOf(3));
                Assert.equal(2, this.a.indexOf(1));
                Assert.equal(3, this.a.lastIndexOf(1));
                Assert.equal(1, this.a.lastIndexOf(2));
                Assert.true(this.a.contains(2));
                Assert.false(this.a.contains(-1));
                Assert.false(this.a.contains(null));
                Assert.false(this.a.contains(undefined));
            }
            test5(){
                this.a.add([3,2,1,1]);
                Assert.equal(3, this.a.get(0));
                Assert.equal(3, this.a.getFirst());
                Assert.equal(1, this.a.getLast());
                Assert.equal(1, this.a.get(3));
            }
            test6(){
                this.a.add([3,2,1,1]);
                let b = this.a.clone();
                Assert.equal(this.a.toArray(), b.toArray());
            }
            test7(){
                this.a.add([3,2,1]);
                
                Assert.true(this.a.each(item=>{
                    return item > 0
                }));
            }
        }
    }
}
