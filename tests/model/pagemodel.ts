/// <reference path="../../dist/jsdk.d.ts" /> 
/// <reference path="listmodel.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.PageModelTest')
        export class PageModelTest extends TestCase {

            private persons: PageModel;

            protected setUp() {
                this.persons = new PageModel({
                    dataQuery: {
                        url: 'test-data/persons-page.json'
                    }
                })
            }

            public test1() {
                this.persons.on('loadsuccess', function () {
                    let me = <PageModel>this; 
                    Assert.equal(10, me.getCurrentPage())
                    Assert.equal(3, me.getData().length);
                    Assert.equal('Smith', this.getRowModel<Person>(2, Person).get('name'));
                });
                this.persons.pageSize(100);
                this.persons.loadPage(10);
            }
        }
    }
}