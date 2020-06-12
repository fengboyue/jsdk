/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.StringsTest')
        export class StringsTest extends TestCase {

            public test1() {
                Assert.equal('<div id="1">xxx</div>', Strings.nodeHTML('div',{id:'1'},'xxx'));
            }
            public test2() {
                Assert.equal(undefined, Strings.format(undefined, 2019));
                Assert.equal(null, Strings.format(null, 2019));
                Assert.equal('2019-1-1', Strings.format('%s-%f-%d','2019',1,1));
                Assert.equal('\n', Strings.format('%n'));
                Assert.equal('%s', Strings.format('%%s'), '2019');
                Assert.equal('false', Strings.format('%b', ''));
            }

            public test3() {
                let s = Strings.merge('a1={a1},b1={b1},{c}', {
                    a1:'aaa',
                    b1:'bbb'
                });
                Assert.equal('a1=aaa,b1=bbb,{c}', s);

                s = Strings.merge('a1={a1},b1={b1},{c}', {
                    a1:'aaa',
                    b1:'bbb',
                    c: (data:any)=>{
                        return data['d']
                    },
                    d: 'ddd'
                });
                Assert.equal('a1=aaa,b1=bbb,ddd', s);

                s = Strings.merge('a1={}', {
                    a1:'aaa'
                });
                Assert.equal('a1={}', s);
            }

        }
    }
}
