/// <reference path="../../dist/jsdk.d.ts" /> 

@klass('Person')
class Person extends Model {
    static DEFAULT_FIELDS = [
        { name: 'code', isId: true },
        { name: 'name' },
        { name: 'age' },
        { name: 'birthday' },
        { name: 'data' }
    ]
}

module JS {

    export namespace test {

        @klass('JS.test.ModelTest')
        export class ModelTest extends TestCase {
            private person: Person;

            protected setUp() {
                this.person = new Person();
            }

            test1() {
                Assert.true(this.person.isEmpty());

                this.person.set('code', 1001);
                this.person.set('name', 'Bill');
                this.person.set('data', { a: 1 });
                Assert.false(this.person.isEmpty());

                Assert.equal(1001, this.person.get('code'));
                Assert.equal('Bill', this.person.get('name'));
                Assert.equal(1, this.person.get('data')['a']);
                Assert.equal(1001, this.person.getId());
                Assert.equal(5, Jsons.values(this.person.getFields()).length);
                Assert.equal(null, this.person.get('age'));
                Assert.true(this.person.hasField('age'));
                Assert.false(this.person.hasField('time'));

                this.person.clear();
                Assert.true(this.person.isEmpty());
            }

            test2() {
                Assert.equal(5, Jsons.values(this.person.getFields()).length);

                this.person.removeField('age');
                Assert.equal(4, Jsons.values(this.person.getFields()).length);
                Assert.false(this.person.hasField('age'));
                Assert.equal(undefined, this.person.get('age'));

                this.person.addField('age');
                Assert.equal(5, Jsons.values(this.person.getFields()).length);
                Assert.true(this.person.hasField('age'));
                Assert.equal(null, this.person.get('age'));
            }

            test3() {
                this.person.set('code', 1001);
                this.person.set('name', 'Bill');
                this.person.set('data', { a: 1 });
                Assert.false(this.person.isEmpty());

                let cln = this.person.clone();
                Assert.false(cln.isEmpty());
                Assert.equal('Bill', cln.get('name'));
            }

            test4() {
                this.person.set('code', 1001);
                Assert.equal(1001, this.person.getData()['code']);
                Assert.true(Check.isEmpty(this.person.iniData()));

                this.person.iniData({
                    'code': 2001
                })
                Assert.equal(1001, this.person.getData()['code']);
                Assert.equal(2001, this.person.iniData()['code']);

                this.person.reset();
                Assert.equal(2001, this.person.getData()['code']);

                this.person.clear();
                Assert.true(this.person.isEmpty());
                Assert.false(Check.isEmpty(this.person.iniData()));
            }

            test5() {
                Assert.true(this.person.isEmpty());

                this.person.destroy();
                Assert.equalError(JSError, () => {
                    this.person.set('code', 1002);
                })
            }

            test6() {
                this.person.updateField({
                    name: 'birthday',
                    setter: function (val: string) {
                        return new Date(val).setZeroTime().add(1, 'd').format()
                    }
                });

                this.person.set('birthday', new Date().format());
                Assert.equal(new Date().setZeroTime().add(1, 'd').format(), this.person.get('birthday'));
            }

            test7() {
                this.person.updateField({
                    name: 'data',
                    nameMapping: '_data'
                });

                this.person.setData({
                    _data: [1, 2, 3]
                });
                Assert.equal([1, 2, 3], this.person.get('data'));
            }


        }
    }
}
