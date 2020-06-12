/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.FunctionsTest')
        export class FunctionsTest extends TestCase {
            private _fn: Function;

            protected setUp() {
                this._fn = function (a) {
                    return this + a;
                }
            }

            public test1() {
                class Pig {};
                class Fly {
                    fly() {
                      return 'I can fly';
                    }
                    eat() {
                      return 'I can eat';
                    }
                };

                let pig = new Pig(); 
                Assert.equal(undefined, (<Fly>pig).fly);
                Assert.equal(undefined, (<Fly>pig).eat);

                Pig.mixin(Fly, ['fly']);
                pig = new Pig(); 
                Assert.equal('I can fly', (<Fly>pig).fly());
                Assert.equal(undefined, (<Fly>pig).eat);

                Pig.mixin(Fly);
                pig = new Pig(); 
                Assert.equal('I can fly', (<Fly>pig).fly());
                Assert.equal('I can eat', (<Fly>pig).eat());
            }

            public test2() {
                Assert.equal(1, Functions.execute('return this(a)-this(b);', Number, 'b,a', [1, 2]));
            }
            public test3() {
                let newFn = this._fn.aop({
                    before: function (a:number) {
                        Assert.equal(7, a);
                    },
                    after: function (rtn:number) {
                        Assert.equal(116, rtn);
                    },
                    around: function (fn:Function, a:number) {
                        return fn.call(this, a)+10;
                    }
                }, 99)
                Assert.equal(116, newFn(7));
            }
        }
    }
}
