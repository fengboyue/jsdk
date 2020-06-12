/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.CheckTest')
        export class CheckTest extends TestCase {
            public test1() {
                Assert.false(Check.isIP('JSDK.255.255.255'));
                Assert.true(Check.isIP('0.0.0.0'));
                Assert.false(Check.isIP('255.255.255.256'));
                Assert.false(Check.isIP('0.0.0'));
                Assert.false(Check.isIP('0.0.0.0.0'));
                Assert.false(Check.isIP('+10.0.0.0'));
            }

            public test2() {
                Assert.true(Check.isPattern('JSDK.org', /^JSDK\..*/));
                Assert.false(Check.isPattern('$JSDK.org', /^JSDK\..*/));
            }
            public test3() {
                Assert.true(Check.isFormatDate('2019-01-01'));
                Assert.true(Check.isFormatDate('2019-1-1'));
                Assert.true(Check.isFormatDate('2019/01/01'));
                Assert.true(Check.isFormatDate('2019-12-1'));
                Assert.true(Check.isFormatDate('2019/12/1'));

                Assert.false(Check.isFormatDate('2019-'));
                Assert.false(Check.isFormatDate('2019-01'));
                Assert.false(Check.isFormatDate('01/01'));
                Assert.false(Check.isFormatDate('2019-001-1'));
                Assert.false(Check.isFormatDate('2019-01-001'));
            }
            public test4() {
                Assert.true(Check.isEmail('jsunit@jsdk.org'));
                Assert.false(Check.isEmail('@jsdk.org'));
                Assert.false(Check.isEmail('jsdk.org'));
                Assert.false(Check.isEmail('邮箱@jsdk.org'));
                Assert.false(Check.isEmail('jsunit@jsdk.邮箱'));
            }
            public test5() {
                Assert.true(Check.isEmails('jsunit@jsdk.org jsui@jsdk.org;jsgf@jsdk.org'));
                Assert.true(Check.isEmails('jsui@jsdk.org;  '));
                Assert.false(Check.isEmails('jsui@jsdk.org;jsdk.org'));
                Assert.false(Check.isEmails('邮箱@jsdk.org jsui@jsdk.org'));
                Assert.false(Check.isEmails('jsunit@jsdk.邮箱;jsui@jsdk.org;'));
            }
            public test6() {
                Assert.false(Check.isEmailDomain('@jsdk'));
                Assert.true(Check.isEmailDomain('@jsdk.org'));
                Assert.true(Check.isEmailDomain('@jsdk.org.cn'));
                Assert.false(Check.isEmailDomain('jsdk.org'));
                Assert.false(Check.isEmailDomain('@邮箱.org'));
            }
            public test7() {
                Assert.true(Check.isOnlyNumber('2007'));
                Assert.false(Check.isOnlyNumber('2019.0'));
                Assert.false(Check.isOnlyNumber('+2017'));
            }
            public test8() {
                Assert.true(Check.isHalfwidthChars('JSDK 2007~2019'));
                Assert.false(Check.isHalfwidthChars('JSDK 2007年～2019年'));
            }
            public test9() {
                Assert.true(Check.isFullwidthChars('从二零零七年到二零一九年'));
                Assert.false(Check.isFullwidthChars('JSDK 2007年～2019年'));
            }
            public test10() {
                Assert.true(Check.isEnglishOnly('JSDK:2007~2019'));
                Assert.false(Check.isEnglishOnly('JSDK：2007～2019'));
            }
            public test11() {
                Assert.true(Check.isChineseOnly('从二零零七年到二零一九年'));
                Assert.false(Check.isChineseOnly('JSDK:2007～2019'));
            }
            public test12() {
                Assert.true(Check.isFormatNumber('-02019.23', 4));
                Assert.true(Check.isFormatNumber('-2019.2300', 4, 3));
                Assert.false(Check.isFormatNumber('-02019.2309', 4, 3));
            }
            public test13() {
                Assert.true(Check.greater('02019.230', 2019.22222229));
                Assert.false(Check.greater('-02019.23', -2019.23));
                Assert.true(Check.greaterEqual('02019.230', 2019.23));
            }
            public test14() {
                Assert.true(Check.less('02019.22', 2019.220001));
                Assert.false(Check.less('-02019.23', -2019.23));
                Assert.true(Check.lessEqual('02019.230', 2019.23));
            }
            public test15() {
                Assert.true(Check.shorter('JSDK', 5));
                Assert.false(Check.shorter('JSDK', 3));
                Assert.false(Check.shorter(null, 4));

                Assert.true(Check.longer('JSDK', 3));
                Assert.false(Check.longer('JSDK', 4));
                Assert.false(Check.longer(null, 4));

                Assert.false(Check.equalLength(null, 4));
                Assert.true(Check.equalLength('null', 4));
            }
            public test16() {
                Assert.true(Check.isLettersOnly('JSDK'));
                Assert.false(Check.isLettersOnly('J S D K'));
                Assert.false(Check.isLettersOnly('JSDK2019'));
            }
            public test17() {
                Assert.true(Check.isLettersOrNumbers('JSDK'));
                Assert.false(Check.isLettersOrNumbers('J S D K'));
                Assert.true(Check.isLettersOrNumbers('JSDK2019'));
            }
            public test18() {
                Assert.true(Check.isEmpty(undefined));
                Assert.true(Check.isEmpty(null));
                Assert.true(Check.isEmpty(''));
                Assert.false(Check.isEmpty(' '));
                Assert.true(Check.isEmpty({}));
                Assert.false(Check.isEmpty({ a: undefined }));
                Assert.true(Check.isEmpty([]));
                Assert.false(Check.isEmpty([undefined]));
            }
            public test19() {
                Assert.true(Check.isBlank(undefined));
                Assert.true(Check.isBlank(null));
                Assert.true(Check.isBlank(''));
                Assert.true(Check.isBlank(' '));
            }
            public test20() {
                Check.byServer({
                    url:'test-data/persons-list.json',
                    type:'json'
                }, (res)=>{
                    return res.data.code == 'success'
                }).then((ok)=>{
                    Assert.true(ok)
                })
            }
            
        }
    }
}
