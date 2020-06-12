/// <reference path="../../dist/jsdk.d.ts" /> 
/// <reference path="model.ts" /> 

@klass('ListPerson')
class ListPerson extends Model {
    public static DEFAULT_FIELDS = [
        { name: 'id', type: 'int'},
        { name: 'name', nameMapping: 'field1', type: 'string' },
        { name: 'age', nameMapping: 'field2', type: 'float', defaultValue: 99.99 }
    ]
}
module JS {

    export namespace test {

        @klass('JS.test.ListModelTest')
        export class ListModelTest extends TestCase {

            private persons: ListModel;

            protected setUp() {
                this.persons = new ListModel().modelKlass(Person);
            }

            public test1() {
                this.persons.add({ code: 1001, name: 'Arthur' });
                this.persons.add(new Person().setData({ code: 2001, name: 'Bill' }));
                Assert.equal(2, this.persons.size());

                this.persons.add([
                    { code: 3001, name: 'Smith' },
                    { code: 4001, name: 'David' }
                ]);
                Assert.equal(4, this.persons.size());
                Assert.equal('David', this.persons.getRowModel<Person>(3).get('name'));
            }

            public test2() {
                this.persons.insert(0, { code: 1001, name: 'Arthur' });
                Assert.equal(1, this.persons.size());

                this.persons.insert(0, [
                    { code: 3001, name: 'Smith' },
                    { code: 4001, name: 'David' }
                ]);
                Assert.equal(3, this.persons.size());
                Assert.equal('Smith', this.persons.getRow(0)['name']);
                Assert.equal('David', this.persons.getRowModel<Person>(1).get('name'));
            }

            public test3() {
                this.persons.insert(1, [
                    { code: 3001, name: 'Smith' },
                    { code: 4001, name: 'David' },
                    { code: 5001, name: 'Xman' },
                    { code: 6001, name: 'Zoro' }
                ]);
                Assert.equal(2, this.persons.indexOfId(5001));

                this.persons.clear();
                Assert.equal(0, this.persons.size());
                Assert.true(this.persons.isEmpty());
            }

            public test4() {
                this.persons.insert(0, [
                    { code: 3001, name: 'Smith' },
                    { code: 4001, name: 'David' },
                    { code: 5001, name: 'Xman' },
                    { code: 6001, name: 'Zoro' }
                ]);

                this.persons.removeAt(0);
                Assert.equal(3, this.persons.size());
                Assert.equal('David', this.persons.getRowModel<Person>(0).get('name'));

                this.persons.removeAt(1);
                Assert.equal(2, this.persons.size());
                Assert.equal('David', this.persons.getRowModel<Person>(0).get('name'));

                this.persons.insert(0, [
                    { code: 3001, name: 'Smith' }
                ]);
                Assert.equal(3, this.persons.size());
                Assert.equal('Smith', this.persons.getRowModel<Person>(0).get('name'));
                Assert.equal('David', this.persons.getRowModel<Person>(1).get('name'));
                Assert.equal('Zoro', this.persons.getRowModel<Person>(2).get('name'));
            }

            public test5() {
                this.persons.iniData([
                    { code: 3001, name: 'Smith' },
                    { code: 4001, name: 'David' },
                    { code: 5001, name: 'Xman' },
                    { code: 6001, name: 'Zoro' }
                ]);
                Assert.equal(4, this.persons.iniData().length);
                Assert.equal(0, this.persons.size());
                
                this.persons.setData([
                    { code: 3001, name: 'Smith' },
                    { code: 4001, name: 'David' }
                ]);
                Assert.equal(2, this.persons.getData().length);
                Assert.equal(2, this.persons.size());
                
                this.persons.reset();
                Assert.equal(4, this.persons.getData().length);
                Assert.equal(4, this.persons.size());

                this.persons.clear();
                Assert.equal(null, this.persons.getData());
                Assert.equal(4, this.persons.iniData().length);
            }

            public test6() {
                let persons = new ListModel().modelKlass(ListPerson);

                persons.load('test-data/persons-list.json').then((result) => {
                    Assert.equal(3, result.count());
                    Assert.equal('Smith', persons.getRowModel<ListPerson>(2).get('name'));
                })
            }

            public test7() {
                let persons = new ListModel({
                    sorters: [{
                        field:'gmtCreated'
                    },{
                        field:'name',
                        dir:'asc'
                    }]
                }).modelKlass(ListPerson);
                persons.addSorter('name', 'desc');

                persons.load('test-data/persons-list.json').then((result) => {
                    Assert.equal(3, result.count());
                    Assert.equal('Smith', persons.getRowModel<ListPerson>(2).get('name'));
                })
            }

        }
    }
}
