/// <reference path="../../dist/jsdk.d.ts" /> 

@klass('Person')
class Person extends Model {
    public static DEFAULT_FIELDS = [
        { name: 'code', type: 'int', isId: true },
        { name: 'name', type: 'string' },
        { name: 'age', type: 'float'},
        { name: 'birthday', type: 'date' },
        { name: 'data', type: 'object' }
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

            public test1() {
                Assert.true(this.person.isEmpty());
                
                this.person.set('code', 1001);
                this.person.set('name', 'Bill');
                this.person.set('data', {a:1});
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

            public test2() {
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

            public test3() {
                this.person.set('code', 1001);
                this.person.set('name', 'Bill');
                this.person.set('data', {a:1});
                Assert.false(this.person.isEmpty());

                let cln = this.person.clone();
                Assert.false(cln.isEmpty());
                Assert.equal('Bill', cln.get('name'));
            }

            public test4() {
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

            public test5() {
                Assert.true(this.person.isEmpty());

                this.person.destroy();
                Assert.equalError(JSError, ()=>{
                    this.person.set('code', 1002);
                })
            }

            public test6() {
                Assert.equal('date', this.person.getField('birthday').type());

                this.person.updateField({
                    name: 'birthday',
                    type: 'string',
                    setter: function(val:string){
                        return new Date(val).setZeroTime().add(1, 'd').format()
                    }
                });
                Assert.equal('string', this.person.getField('birthday').type());

                this.person.set('birthday', new Date().format());
                Assert.equal(new Date().setZeroTime().add(1, 'd').format(), this.person.get('birthday'));
            }

            public test7(){
                this.person.updateField({
                    name: 'data',
                    nameMapping: '_data'
                });

                this.person.setData({
                    _data: [1,2,3]
                });
                Assert.equalArray([1,2,3], this.person.get('data'));
            }


        }
    }
}
