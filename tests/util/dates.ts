/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.DatesTest')
        export class DatesTest extends TestCase {

            protected setUp(){
                Date.class.cancelAop('format');
            }

            public test1() {
                Assert.true(Dates.isLeapYear(2004));
                Assert.false(Dates.isLeapYear(1999));
            }
            public test2() {
                Assert.true(Dates.getDaysOfMonth(1,2019)==28);
                Assert.true(Dates.getDaysOfMonth(2,2019)==31);
            }
            public test3() {
                Assert.true(new Date(2019,0,1,1,1,1).equals(new Date('2019-1-1'), 'd'));
            }
            public test4() {
                let d = new Date(2019,0,1);
                Assert.true(d.setLastTime().diff(new Date('2019-1-1').setLastTime())==0);
                Assert.true(d.isBefore(new Date('2019-1-2')));
                Assert.true(d.isAfter(new Date('2018-12-31')));
            }
            public test5(){
                Assert.true(new Date('2018-12-30').getWeek()==52);
                Assert.true(new Date('2018-12-31').getWeek()==53);
                Assert.true(new Date('2019-1-1').getWeek()==1);
            }
            public test6(){
                let d = new Date('2018-12-30');
                d.setWeek(52);
                Assert.true(d.getWeek()==52);
                Assert.true(d.equals(new Date('2018-12-24'), 'd'));
                
                d.setWeek(53);
                Assert.true(d.getWeek()==53);
                Assert.true(d.equals(new Date('2018-12-31'), 'd'));
            }
            public test8(){
                Assert.true(new Date(2019,0,1,12,0,1,123).equals(new Date(2019,0,1,12,0,1,123)));
                Assert.false(new Date(2019,0,1,12,0,1,123).equals(new Date(2019,0,1,12,0,1,124)));
            }
            public test9(){
                let d = new Date('2019-1-2'), d1 = new Date('2019-1-1'), d2 = new Date('2019-1-3');
                Assert.true(d.between(d1,d2));
                Assert.false(d.between(d2,d1));
                Assert.true(d.between(d,d2));               
            }
            public test10(){
                let d = new Date('2019-1-2'), d1 = new Date('2019-1-1'), d2 = new Date('2019-1-3');
                Assert.true(d.isAfter(d1));
                Assert.false(d.isAfter(d2));
                Assert.false(d.isAfter(d));               
            }
            public test11(){
                let d = new Date('2019-1-2'), d1 = new Date('2019-1-1'), d2 = new Date('2019-1-3');
                Assert.true(d.isBefore(d2));
                Assert.false(d.isBefore(d1));
                Assert.false(d.isBefore(d));               
            }
            public test12(){
                Assert.true(new Date().isToday(new Date()));            
            }
            public test13(){
                let d = new Date('2019-1-1').setZeroTime(),
                    h = d.getHours(),
                    m = d.getMinutes(),
                    s = d.getSeconds(),
                    ms = d.getMilliseconds();
                
                Assert.true(d.clone().add(1, 'y').equals(new Date('2020-1-1'),'d'));
                Assert.true(d.clone().add(-1, 'y').equals(new Date('2018-1-1'),'d'));

                Assert.true(d.clone().add(1, 'M').equals(new Date('2019-2-1'),'d'));
                Assert.true(d.clone().add(-1, 'M').equals(new Date('2018-12-1'),'d'));

                Assert.true(d.clone().add(1, 'd').equals(new Date('2019-1-2'),'d'));
                Assert.true(d.clone().add(-1, 'd').equals(new Date('2018-12-31'),'d'));

                Assert.true(d.clone().add(1, 'w').equals(new Date('2019-1-8'),'d'));
                Assert.true(d.clone().add(-1, 'w').equals(new Date('2018-12-25'),'d'));

                Assert.true(d.clone().add(1, 'h').getHours()==h+1);
                Assert.true(d.clone().add(-1, 'h').getHours()==23);

                Assert.true(d.clone().add(1, 'm').getMinutes()==m+1);
                Assert.true(d.clone().add(-1, 'm').getMinutes()==59);

                Assert.true(d.clone().add(1, 's').getSeconds()==s+1);
                Assert.true(d.clone().add(-1, 's').getSeconds()==59);

                Assert.true(d.clone().add(1, 'ms').getMilliseconds()==ms+1);
                Assert.true(d.clone().add(-1, 'ms').getMilliseconds()==999);
            }
            public test14(){
                let d = new Date('2019-1-1').setZeroTime(), offset = d.formatTimezoneOffset();
                d.setTimezoneOffset(Number(offset)/100);

                Assert.true(d.formatTimezoneOffset()===offset);
            }
            public test15(){
                let d = new Date('2019-1-1').setZeroTime();
                
                Assert.true(d.clone().set({year: 2018}).getFullYear()==2018);
                Assert.true(d.clone().set({month: 11}).getMonth()==11);
                Assert.true(d.clone().set({day: 30}).getDate()==30);
                Assert.true(d.clone().set({week: 52}).getWeek()==52);
                Assert.true(d.clone().set({hour: 12}).getHours()==12);
                Assert.true(d.clone().set({minute: 10}).getMinutes()==10);
                Assert.true(d.clone().set({second: 59}).getSeconds()==59);
                Assert.true(d.clone().set({millisecond: 999}).getMilliseconds()==999);
                Assert.true(d.clone().set({timezoneOffset: -480}).getTimezoneOffset()==-480);
            }
            public test16(){
                Dates.I18N_RESOURCE = {
                    en: {
                        AM: 'AM',
                        PM: 'PM',
                        WEEK_DAY_NAMES: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                        WEEK_DAY_SHORT_NAMES: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                        MONTH_NAMES: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                        MONTH_SHORT_NAMES: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                    },
                    zh: {
                        AM: '上午',
                        PM: '下午',
                        WEEK_DAY_NAMES: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
                        WEEK_DAY_SHORT_NAMES: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
                        MONTH_NAMES: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                        MONTH_SHORT_NAMES: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
                    }
                }

                let d = new Date('2019-1-1 13:02:03');
                
                Assert.equal('2019-01-01', d.format('YYYY-MM-DD'));
                Assert.equal('2019-1-1', d.format('YYYY-M-D'));
                Assert.equal('19年1月1日', d.format('YY年M月D日'));
                
                Assert.equal('2019/Jan/01', d.format('YYYY/MMM/DD','en'));
                Assert.equal('2019/一月/01', d.format('YYYY/MMM/DD','zh'));
                Assert.equal('2019/January/01', d.format('YYYY/MMMM/DD','en'));
                Assert.equal('2019/一月/01', d.format('YYYY/MMMM/DD','zh'));

                Assert.equal('2019/01 Tue', d.format('YYYY/MM ddd','en'));
                Assert.equal('2019/01 周二', d.format('YYYY/MM ddd','zh'));
                Assert.equal('2019/01 Tuesday', d.format('YYYY/MM dddd','en'));
                Assert.equal('2019/01 星期二', d.format('YYYY/MM dddd','zh'));

                Assert.equal('19/1/1 13:02:03', d.format('YY/M/D HH:mm:ss'));
                Assert.equal('19/1/1 1:2:3', d.format('YY/M/D h:m:s'));
                
                Assert.equal('19/1/1 PM 1:02', d.format('YY/M/D A h:mm','en'));
                Assert.equal('19/1/1 下午 1:02', d.format('YY/M/D A h:mm','zh'));
            }
        }
    }
}
