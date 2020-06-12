/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.NumbersTest')
        export class NumbersTest extends TestCase {

            public test1() {
                Assert.equal(Number(-1e-7).stringfy(), '-0.0000001');
                Assert.equal(Number(2/3).stringfy(), '0.6666666666666666');
            }
            public test2() {
                Assert.equal(Number(-1e-7).format(), '-0.0000001');
                Assert.equal(Number(-1e-7).format(10), '-0.0000001000');
                Assert.equal(Number(123456).format(3), '123,456.000');
                Assert.equal(Number(-123456.785).format(2), '-123,456.78');
                Assert.equal(Number(123456.785).format(2), '123,456.79');
            }
            public test3() {
                let n1 = Number(0.5), n2 = Number(78.1112223335), n3 = Number(535);
                Assert.equal(n1.round(0).stringfy(), '1');
                Assert.equal(n2.round(9).stringfy(), '78.111222334');
                Assert.equal(n3.round(2).stringfy(), '535');
            }
            public test4() {
                let n1 = Number(0.5), n2 = Number(78.5112223335), n3 = Number(-535);
                Assert.equal(n1.toInt().stringfy(), '1');
                Assert.equal(n2.toInt().stringfy(), '79');
                Assert.equal(n3.toInt().stringfy(), '-535');
            }
            public test5() {
                Assert.true(Number(78.567).equals(78.567));
                Assert.true(Number(78.5675).equals(78.568, 3));
            }
            public test6() {
                Assert.equal(Number(0.1).add(0.2).stringfy(), '0.3');
                Assert.equal(Number(0.15).sub(0.1).stringfy(), '0.05');
                Assert.equal(Number(0.1).mul(0.2).stringfy(), '0.02');
                Assert.equal(Number(0.15).div(0.2).stringfy(), '0.75');
            }
            public test7() {
                Assert.true(Number(undefined).isNaN());
                Assert.false(Number(78.123).isNaN());

                Assert.false(Number(undefined).isFinite());
                Assert.false(Number(1 / 0).isFinite());

                Assert.true(Number(null).isZero());
                Assert.false(Number(undefined).isZero());
                Assert.false(Number(78.000000001).isZero());

                Assert.true(Number(null).isInt());
                Assert.true(Number(78.00).isInt());
                Assert.false(Number(78.000000001).isInt());

                Assert.false(Number(0).isFloat());
                Assert.false(Number(78.00).isFloat());
                Assert.true(Number(78.000000001).isFloat());

                Assert.false(Number(undefined).isPositive());
                Assert.false(Number(0).isPositive());
                Assert.true(Number(0.0001).isPositive());

                Assert.false(Number(undefined).isNegative());
                Assert.false(Number(0).isNegative());
                Assert.true(Number(-0.0001).isNegative());

                Assert.false(Number(undefined).isOdd());
                Assert.false(Number(0).isOdd());
                Assert.false(Number(0.1).isOdd());
                Assert.true(Number(1.0).isOdd());

                Assert.false(Number(undefined).isEven());
                Assert.true(Number(0).isEven());
                Assert.false(Number(0.2).isEven());
                Assert.true(Number(2.0).isEven());
            }
            public test8() {
                Assert.equal(Number(123456.00000789).integerLength(), 6);
                Assert.equal(Number(123456.00000789).fractionLength(), 8);
                Assert.equal(Number(-0.00000789).integerLength(), 1);
                Assert.equal(Number(-123456.0000).fractionLength(), 0);
                Assert.equal(Number(0).integerLength(), 1);
                Assert.equal(Number(0).fractionLength(), 0);
            }
            public test9() {
                Assert.true(Numbers.min(1.01, Number(1), -1) === -1);
                Assert.true(Numbers.max(1.01, Number(1), -1) === 1.01);
            }
            public test10() {
                Assert.equal(Numbers.termwise(1.01, '+', Number(1)), 2.01);
                Assert.equal(Numbers.termwise(0.15, '/', 0.2, '+', Number(0.3)), 1.05);
            }
            public test11() {
                Assert.equal(Numbers.algebra(' - 2.01*(0.3894567-1.5908+7.9999)/(+3.1-9.9)'), 2.0095733775);
                Assert.equal(Numbers.algebra(' a*(0.3894567-1.5908+d)/(+b-c)', {
                    a: -2.01,
                    b: 3.1,
                    c: 9.9,
                    d: 7.9999
                }), 2.0095733775);
            }
        }
    }
}
