//@ sourceURL=tests.js
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var JS;
(function (JS) {
    let test;
    (function (test) {
        let BiMapTest = class BiMapTest extends TestCase {
            constructor() {
                super(...arguments);
                this.a = new BiMap();
            }
            setUp() {
                this.a.clear();
            }
            test1() {
                this.a.put('k1', 1);
                this.a.put('k2', 2);
                this.a.put('k3', 3);
                let b = this.a.inverse();
                Assert.equal('k1', b.get(1));
                Assert.equal(3, b.size());
                Assert.equal(1, this.a.get('k1'));
                Assert.equal(2, this.a.get('k2'));
                Assert.equal(3, this.a.size());
            }
            test2() {
                this.a = new BiMap([
                    ['k1', 1], ['k2', 2], ['k3', 3]
                ]);
                Assert.equal(3, this.a.size());
                Assert.equal(1, this.a.get('k1'));
                Assert.true(this.a.has('k1'));
                this.a.delete('k1');
                Assert.equal(2, this.a.size());
                Assert.equal(undefined, this.a.get('k1'));
                Assert.false(this.a.has('k1'));
            }
            test3() {
                this.a = new BiMap([
                    ['k1', 1], ['k2', 2], ['k3', 3]
                ]);
                Assert.false(this.a.has('k4'));
                Assert.true(this.a.has('k1'));
            }
        };
        BiMapTest = __decorate([
            klass('JS.test.BiMapTest')
        ], BiMapTest);
        test.BiMapTest = BiMapTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let LinkedListTest = class LinkedListTest extends TestCase {
            constructor() {
                super(...arguments);
                this.a = new LinkedList();
            }
            setUp() {
                this.a.clear();
            }
            test1() {
                this.a.add(3);
                this.a.add([2, 1]);
                Assert.equal(3, this.a.get(0));
                Assert.equal(1, this.a.get(2));
                this.a.addAt(1, 0.5);
                Assert.equal(0.5, this.a.get(1));
                Assert.equal(4, this.a.size());
                let b = new LinkedList();
                b.addLast(22);
                Assert.equal([22], b.toArray());
                b.addFirst(11);
                Assert.equal([11, 22], b.toArray());
                b.addAt(0, 33);
                Assert.equal([33, 11, 22], b.toArray());
                b.addAt(2, 44);
                Assert.equal([33, 11, 44, 22], b.toArray());
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
                Assert.equal([3, 0.5, 2, 1, 33, 11, 44, 22], this.a.toArray());
            }
            test2() {
                this.a.removeFirst();
                Assert.equal(0, this.a.size());
                this.a.removeLast();
                Assert.equal(0, this.a.size());
                this.a.add([3, 2, 1]);
                this.a.removeFirst();
                Assert.equal([2, 1], this.a.toArray());
                this.a.removeLast();
                Assert.equal([2], this.a.toArray());
                this.a.removeFirst();
                Assert.equal([], this.a.toArray());
            }
            test3() {
                Assert.equal(null, this.a.peek());
                this.a.add([3, 2, 1]);
                Assert.equal(3, this.a.peek());
                Assert.equal(3, this.a.size());
                Assert.equal(1, this.a.peekLast());
                Assert.equal(3, this.a.size());
                Assert.equal(3, this.a.peekFirst());
                Assert.equal(3, this.a.size());
            }
            test4() {
                this.a.add([3, 2, 1, 1]);
                Assert.equal(0, this.a.indexOf(3));
                Assert.equal(2, this.a.indexOf(1));
                Assert.equal(3, this.a.lastIndexOf(1));
                Assert.equal(1, this.a.lastIndexOf(2));
                Assert.true(this.a.contains(2));
                Assert.false(this.a.contains(-1));
                Assert.false(this.a.contains(null));
                Assert.false(this.a.contains(undefined));
            }
            test5() {
                this.a.add([3, 2, 1, 1]);
                Assert.equal(3, this.a.get(0));
                Assert.equal(3, this.a.getFirst());
                Assert.equal(1, this.a.getLast());
                Assert.equal(1, this.a.get(3));
            }
            test6() {
                this.a.add([3, 2, 1, 1]);
                let b = this.a.clone();
                Assert.equal(this.a.toArray(), b.toArray());
            }
            test7() {
                this.a.add([3, 2, 1]);
                Assert.true(this.a.each(item => {
                    return item > 0;
                }));
            }
        };
        LinkedListTest = __decorate([
            klass('JS.test.LinkedListTest')
        ], LinkedListTest);
        test.LinkedListTest = LinkedListTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
let Person = class Person extends Model {
};
Person.DEFAULT_FIELDS = [
    { name: 'code', type: 'int', isId: true },
    { name: 'name', type: 'string' },
    { name: 'age', type: 'float' },
    { name: 'birthday', type: 'date' },
    { name: 'data', type: 'object' }
];
Person = __decorate([
    klass('Person')
], Person);
var JS;
(function (JS) {
    let test;
    (function (test) {
        let ModelTest = class ModelTest extends TestCase {
            setUp() {
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
                });
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
                });
            }
            test6() {
                Assert.equal('date', this.person.getField('birthday').type());
                this.person.updateField({
                    name: 'birthday',
                    type: 'string',
                    setter: function (val) {
                        return new Date(val).setZeroTime().add(1, 'd').format();
                    }
                });
                Assert.equal('string', this.person.getField('birthday').type());
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
        };
        ModelTest = __decorate([
            klass('JS.test.ModelTest')
        ], ModelTest);
        test.ModelTest = ModelTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
let ListPerson = class ListPerson extends Model {
};
ListPerson.DEFAULT_FIELDS = [
    { name: 'id', type: 'int' },
    { name: 'name', nameMapping: 'field1', type: 'string' },
    { name: 'age', nameMapping: 'field2', type: 'float', defaultValue: 99.99 }
];
ListPerson = __decorate([
    klass('ListPerson')
], ListPerson);
var JS;
(function (JS) {
    let test;
    (function (test) {
        let ListModelTest = class ListModelTest extends TestCase {
            setUp() {
                this.persons = new ListModel().modelKlass(Person);
            }
            test1() {
                this.persons.add({ code: 1001, name: 'Arthur' });
                this.persons.add(new Person().setData({ code: 2001, name: 'Bill' }));
                Assert.equal(2, this.persons.size());
                this.persons.add([
                    { code: 3001, name: 'Smith' },
                    { code: 4001, name: 'David' }
                ]);
                Assert.equal(4, this.persons.size());
                Assert.equal('David', this.persons.getRowModel(3).get('name'));
            }
            test2() {
                this.persons.insert(0, { code: 1001, name: 'Arthur' });
                Assert.equal(1, this.persons.size());
                this.persons.insert(0, [
                    { code: 3001, name: 'Smith' },
                    { code: 4001, name: 'David' }
                ]);
                Assert.equal(3, this.persons.size());
                Assert.equal('Smith', this.persons.getRow(0)['name']);
                Assert.equal('David', this.persons.getRowModel(1).get('name'));
            }
            test3() {
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
            test4() {
                this.persons.insert(0, [
                    { code: 3001, name: 'Smith' },
                    { code: 4001, name: 'David' },
                    { code: 5001, name: 'Xman' },
                    { code: 6001, name: 'Zoro' }
                ]);
                this.persons.removeAt(0);
                Assert.equal(3, this.persons.size());
                Assert.equal('David', this.persons.getRowModel(0).get('name'));
                this.persons.removeAt(1);
                Assert.equal(2, this.persons.size());
                Assert.equal('David', this.persons.getRowModel(0).get('name'));
                this.persons.insert(0, [
                    { code: 3001, name: 'Smith' }
                ]);
                Assert.equal(3, this.persons.size());
                Assert.equal('Smith', this.persons.getRowModel(0).get('name'));
                Assert.equal('David', this.persons.getRowModel(1).get('name'));
                Assert.equal('Zoro', this.persons.getRowModel(2).get('name'));
            }
            test5() {
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
            test6() {
                let persons = new ListModel().modelKlass(ListPerson);
                persons.load('test-data/persons-list.json').then((result) => {
                    Assert.equal(3, result.count());
                    Assert.equal('Smith', persons.getRowModel(2).get('name'));
                });
            }
            test7() {
                let persons = new ListModel({
                    sorters: [{
                            field: 'gmtCreated'
                        }, {
                            field: 'name',
                            dir: 'asc'
                        }]
                }).modelKlass(ListPerson);
                persons.addSorter('name', 'desc');
                persons.load('test-data/persons-list.json').then((result) => {
                    Assert.equal(3, result.count());
                    Assert.equal('Smith', persons.getRowModel(2).get('name'));
                });
            }
        };
        ListModelTest = __decorate([
            klass('JS.test.ListModelTest')
        ], ListModelTest);
        test.ListModelTest = ListModelTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let PageModelTest = class PageModelTest extends TestCase {
            setUp() {
                this.persons = new PageModel({
                    dataQuery: {
                        url: 'test-data/persons-page.json'
                    }
                });
            }
            test1() {
                this.persons.on('loadsuccess', function () {
                    let me = this;
                    Assert.equal(10, me.getCurrentPage());
                    Assert.equal(3, me.getData().length);
                    Assert.equal('Smith', this.getRowModel(2, Person).get('name'));
                });
                this.persons.pageSize(100);
                this.persons.loadPage(10);
            }
        };
        PageModelTest = __decorate([
            klass('JS.test.PageModelTest')
        ], PageModelTest);
        test.PageModelTest = PageModelTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test_1) {
        var ClassTest_1;
        let ClassTest = ClassTest_1 = class ClassTest extends TestCase {
            test1() {
                Assert.equal(ClassTest_1.class, this.getClass());
                Assert.equal(TestCase.class, this.getClass().getSuperclass());
                Assert.equal('JS.test.ClassTest', this.className);
                Assert.equal(ClassTest_1, this.getClass().getKlass());
                Assert.equal(Object.class, TestCase.class.getSuperclass());
                Assert.equal(Object, TestCase.class.getSuperclass().getKlass());
            }
            test2() {
                Assert.equal(Class.forName('JS.test.ClassTest'), this.getClass());
                Assert.equal(Class.forName('Object'), Object.class);
                Assert.equal(Class.byName('JS.test.ClassTest'), ClassTest_1);
                Assert.equal(Class.byName('Object'), Object);
            }
            test3() {
                Assert.equal(Class.newInstance('JS.test.ClassTest').getClass(), ClassTest_1.class);
                Assert.equal(Class.newInstance(JSError, 'sss', new TypeError('ttt')).cause.message, 'ttt');
            }
            test4() {
                let test = new TestCase('test'), clazz = test.getClass();
                Assert.equal(5, clazz.fields(test).length);
                Assert.equal(11, clazz.methods().length);
            }
            test5() {
                let pModel = PageModel.class.newInstance(), lModel = ListModel.class.newInstance(), clazz = pModel.getClass(), superClass = clazz.getSuperclass();
                let fields = clazz.fieldsMap(pModel), methods = clazz.methodsMap(), superFields = superClass.fieldsMap(lModel), superMethods = superClass.methodsMap();
                Assert.equal(Jsons.keys(Jsons.minus(fields, Jsons.intersect(fields, superFields))), ['_cacheTotal']);
                Assert.equal(Jsons.keys(Jsons.minus(methods, superMethods)).length, 13);
            }
            test6() {
                let s = '1900-MM-dd';
                Date.class.aop('format', {
                    before: (format) => {
                        Assert.equal(s, format);
                    },
                    around: function (fn, format) {
                        return fn.apply(this, [format]).replace('1900-', '2019-');
                    },
                    after: (returns) => {
                        Assert.true(returns.startsWith('2019-'));
                    }
                });
                new Date().format(s);
                Date.class.cancelAop('format');
            }
        };
        ClassTest = ClassTest_1 = __decorate([
            klass('JS.test.ClassTest')
        ], ClassTest);
        test_1.ClassTest = ClassTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let ColorsTest = class ColorsTest extends TestCase {
            test1() {
                Assert.equal({ r: 39, g: 174, b: 96, a: 1 }, Colors.hex2rgba('27ae60'));
                Assert.equal({ r: 39, g: 174, b: 96, a: 1 }, Colors.hex2rgba('#27ae60'));
                Assert.equal({ r: 39, g: 174, b: 96, a: 1 }, Colors.hex2rgba('#27ae60ff'));
                Assert.equal({ r: 255, g: 255, b: 255, a: 1 }, Colors.hex2rgba('fff'));
                Assert.equal({ r: 255, g: 255, b: 255, a: 1 }, Colors.hex2rgba('#fff'));
                Assert.equal({ r: 0, g: 0, b: 0, a: 1 }, Colors.hex2rgba('000'));
                Assert.equal({ r: 0, g: 0, b: 0, a: 1 }, Colors.hex2rgba('#000'));
                Assert.equal({ r: 0, g: 0, b: 0, a: 0 }, Colors.hex2rgba('#0000'));
                Assert.equal({ r: 0, g: 0, b: 0, a: 1 }, Colors.hex2rgba('000f'));
            }
            test2() {
                Assert.equal('#000000', Colors.rgba2hex(0, 0, 0));
                Assert.equal('#ffffff', Colors.rgba2hex(255, 255, 255));
                Assert.equal('#000000ff', Colors.rgba2hex(0, 0, 0, 1));
                Assert.equal('#ffffff00', Colors.rgba2hex(255, 255, 255, 0));
                Assert.equal('#27ae60', Colors.rgba2hex(39, 174, 96));
                Assert.equal('#27ae6000', Colors.rgba2hex(39, 174, 96, 0));
                Assert.equal('#27ae60ff', Colors.rgba2hex(39, 174, 96, 1));
            }
            test3() {
                Assert.equal('#0000000c', Colors.rgba2hex(0, 0, 0, 0.05));
                Assert.equal('#00000019', Colors.rgba2hex(0, 0, 0, 0.10));
                Assert.equal('#00000026', Colors.rgba2hex(0, 0, 0, 0.15));
                Assert.equal('#00000033', Colors.rgba2hex(0, 0, 0, 0.20));
                Assert.equal('#0000003f', Colors.rgba2hex(0, 0, 0, 0.25));
                Assert.equal('#0000004c', Colors.rgba2hex(0, 0, 0, 0.30));
                Assert.equal('#00000059', Colors.rgba2hex(0, 0, 0, 0.35));
                Assert.equal('#00000066', Colors.rgba2hex(0, 0, 0, 0.40));
                Assert.equal('#00000072', Colors.rgba2hex(0, 0, 0, 0.45));
                Assert.equal('#0000007f', Colors.rgba2hex(0, 0, 0, 0.50));
                Assert.equal('#0000008c', Colors.rgba2hex(0, 0, 0, 0.55));
                Assert.equal('#00000099', Colors.rgba2hex(0, 0, 0, 0.60));
                Assert.equal('#000000a5', Colors.rgba2hex(0, 0, 0, 0.65));
                Assert.equal('#000000b2', Colors.rgba2hex(0, 0, 0, 0.70));
                Assert.equal('#000000bf', Colors.rgba2hex(0, 0, 0, 0.75));
                Assert.equal('#000000cc', Colors.rgba2hex(0, 0, 0, 0.80));
                Assert.equal('#000000d8', Colors.rgba2hex(0, 0, 0, 0.85));
                Assert.equal('#000000e5', Colors.rgba2hex(0, 0, 0, 0.90));
                Assert.equal('#000000f2', Colors.rgba2hex(0, 0, 0, 0.95));
            }
            test4() {
                Assert.equal(0.05, Colors.hex2rgba('#0000000c').a);
                Assert.equal(0.10, Colors.hex2rgba('#00000019').a);
                Assert.equal(0.15, Colors.hex2rgba('#00000026').a);
                Assert.equal(0.20, Colors.hex2rgba('#00000033').a);
                Assert.equal(0.25, Colors.hex2rgba('#0000003f').a);
                Assert.equal(0.30, Colors.hex2rgba('#0000004c').a);
                Assert.equal(0.35, Colors.hex2rgba('#00000059').a);
                Assert.equal(0.40, Colors.hex2rgba('#00000066').a);
                Assert.equal(0.45, Colors.hex2rgba('#00000072').a);
                Assert.equal(0.50, Colors.hex2rgba('#0000007f').a);
                Assert.equal(0.55, Colors.hex2rgba('#0000008c').a);
                Assert.equal(0.60, Colors.hex2rgba('#00000099').a);
                Assert.equal(0.65, Colors.hex2rgba('#000000a5').a);
                Assert.equal(0.70, Colors.hex2rgba('#000000b2').a);
                Assert.equal(0.75, Colors.hex2rgba('#000000bf').a);
                Assert.equal(0.80, Colors.hex2rgba('#000000cc').a);
                Assert.equal(0.85, Colors.hex2rgba('#000000d8').a);
                Assert.equal(0.90, Colors.hex2rgba('#000000e5').a);
                Assert.equal(0.95, Colors.hex2rgba('#000000f2').a);
            }
        };
        ColorsTest = __decorate([
            klass('JS.test.ColorsTest')
        ], ColorsTest);
        test.ColorsTest = ColorsTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let ArraysTest = class ArraysTest extends TestCase {
            setUp() {
                this.a = [1, '-1', undefined, null, { name: 'jsdk' }];
            }
            test1() {
                Assert.equal(Arrays.newArray(null), []);
                Assert.equal(Arrays.newArray(undefined), []);
            }
            test2() {
                Assert.equal(this.a.findIndex(it => { return it == 1; }), 0);
                Assert.equal(this.a.findIndex(it => { return it === undefined; }), 2);
                Assert.equal(this.a.findIndex(it => { return it === null; }), 3);
                Assert.equal(this.a.findIndex(it => { return it == 0; }), -1);
                Assert.equal(this.a.findIndex(item => {
                    return 'jsdk' === (item && item.name);
                }), 4);
            }
            test3() {
                let rst = this.a.remove(item => {
                    return 'jsdk' === (item && item.name);
                });
                Assert.true(rst);
                Assert.equal(this.a.length, 4);
                Assert.equal(null, this.a[this.a.length - 1]);
            }
            test4() {
                this.a.remove(it => { return it == 1; });
                Assert.equal(undefined, this.a[1]);
            }
            test5() {
                let oldLen = this.a.length;
                this.a.add([new Date(), 'insertAt'], 0);
                Assert.true(this.a.length == oldLen + 2);
                Assert.true(new Date().equals(this.a[0], 'd'));
                Assert.true('insertAt' == this.a[1]);
                let b = [1, 2, 3];
                b.add([4, 5]);
                Assert.true(b.length == 5);
                Assert.true(b.toString() == '1,2,3,4,5');
            }
            test6() {
                Assert.false(Arrays.equal([1, 2], [2, 3]));
                Assert.true(Arrays.equal([1, 2], [1, 2]));
                Assert.true(Arrays.equal([[1], [2]], [[1], [2]], (item1, item2) => {
                    return item1[0] === item2[0];
                }));
            }
            test7() {
                let a = [1, 2, 3];
                a[4] = 9;
                Assert.true(a.hasOwnProperty('4') && a[4] === 9);
                Object.seal(a);
                Assert.error(() => {
                    a[5] = 99;
                });
                a[0] = 123;
                Assert.true(a[0] === 123);
            }
            test8() {
                let a = [1, 2, 3];
                a[4] = 9;
                Assert.true(a.hasOwnProperty('4') && a[4] === 9);
                Object.freeze(a);
                Assert.error(() => {
                    a[5] = 99;
                });
                Assert.error(() => {
                    a[0] = 123;
                });
            }
        };
        ArraysTest = __decorate([
            klass('JS.test.ArraysTest')
        ], ArraysTest);
        test.ArraysTest = ArraysTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let BundleTest = class BundleTest extends TestCase {
            constructor() {
                super(...arguments);
                this._data1 = {
                    'zh': {
                        k1: '中文',
                        k2: 'xxx'
                    },
                    'zh-CN': {
                        k1: '中文，中国'
                    },
                    'CN': {
                        k1: '中国'
                    }
                };
                this._data2 = {
                    k1: '中文，中国'
                };
            }
            test1() {
                let bundle = new Bundle('test-data/bundle1.json', 'zh-CN');
                Assert.equal(bundle.get('k1'), '中文，中国');
            }
            test2() {
                let bundle = new Bundle('test-data/bundle1.json', 'zh');
                Assert.equal(bundle.get('k1'), '中文');
            }
            test3() {
                let bundle = new Bundle('test-data/bundle1.json');
                Assert.notEqual(bundle.get('k1'), '无时区');
            }
            test4() {
                let bundle = new Bundle('test-data/bundle1.json', 'en');
                Assert.equal(bundle.get('k1'), 'English');
            }
            test5() {
                let bundle = new Bundle(this._data1, 'zh');
                Assert.equal(bundle.get('k1'), '中文');
            }
            test6() {
                let bundle = new Bundle(this._data1, 'zh-CN');
                Assert.equal(bundle.get('k1'), '中文，中国');
            }
            test7() {
                let bundle = new Bundle(this._data1, 'CN');
                Assert.equal(bundle.get('k1'), '中国');
            }
            test8() {
                let bundle = new Bundle(this._data2);
                Assert.equal(bundle.get('k1'), '中文，中国');
            }
            test9() {
                let bundle = new Bundle(this._data2);
                Assert.equal(undefined, bundle.get('k2'));
                Assert.equal(bundle.getLocale().toString(), System.info().locale.toString());
            }
        };
        BundleTest = __decorate([
            klass('JS.test.BundleTest')
        ], BundleTest);
        test.BundleTest = BundleTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let CheckTest = class CheckTest extends TestCase {
            test1() {
                Assert.false(Check.isIP('JSDK.255.255.255'));
                Assert.true(Check.isIP('0.0.0.0'));
                Assert.false(Check.isIP('255.255.255.256'));
                Assert.false(Check.isIP('0.0.0'));
                Assert.false(Check.isIP('0.0.0.0.0'));
                Assert.false(Check.isIP('+10.0.0.0'));
            }
            test2() {
                Assert.true(Check.isPattern('JSDK.org', /^JSDK\..*/));
                Assert.false(Check.isPattern('$JSDK.org', /^JSDK\..*/));
            }
            test3() {
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
            test4() {
                Assert.true(Check.isEmail('jsunit@jsdk.org'));
                Assert.false(Check.isEmail('@jsdk.org'));
                Assert.false(Check.isEmail('jsdk.org'));
                Assert.false(Check.isEmail('邮箱@jsdk.org'));
                Assert.false(Check.isEmail('jsunit@jsdk.邮箱'));
            }
            test5() {
                Assert.true(Check.isEmails('jsunit@jsdk.org jsui@jsdk.org;jsgf@jsdk.org'));
                Assert.true(Check.isEmails('jsui@jsdk.org;  '));
                Assert.false(Check.isEmails('jsui@jsdk.org;jsdk.org'));
                Assert.false(Check.isEmails('邮箱@jsdk.org jsui@jsdk.org'));
                Assert.false(Check.isEmails('jsunit@jsdk.邮箱;jsui@jsdk.org;'));
            }
            test6() {
                Assert.false(Check.isEmailDomain('@jsdk'));
                Assert.true(Check.isEmailDomain('@jsdk.org'));
                Assert.true(Check.isEmailDomain('@jsdk.org.cn'));
                Assert.false(Check.isEmailDomain('jsdk.org'));
                Assert.false(Check.isEmailDomain('@邮箱.org'));
            }
            test7() {
                Assert.true(Check.isOnlyNumber('2007'));
                Assert.false(Check.isOnlyNumber('2019.0'));
                Assert.false(Check.isOnlyNumber('+2017'));
            }
            test8() {
                Assert.true(Check.isHalfwidthChars('JSDK 2007~2019'));
                Assert.false(Check.isHalfwidthChars('JSDK 2007年～2019年'));
            }
            test9() {
                Assert.true(Check.isFullwidthChars('从二零零七年到二零一九年'));
                Assert.false(Check.isFullwidthChars('JSDK 2007年～2019年'));
            }
            test10() {
                Assert.true(Check.isEnglishOnly('JSDK:2007~2019'));
                Assert.false(Check.isEnglishOnly('JSDK：2007～2019'));
            }
            test11() {
                Assert.true(Check.isChineseOnly('从二零零七年到二零一九年'));
                Assert.false(Check.isChineseOnly('JSDK:2007～2019'));
            }
            test12() {
                Assert.true(Check.isFormatNumber('-02019.23', 4));
                Assert.true(Check.isFormatNumber('-2019.2300', 4, 3));
                Assert.false(Check.isFormatNumber('-02019.2309', 4, 3));
            }
            test13() {
                Assert.true(Check.greater('02019.230', 2019.22222229));
                Assert.false(Check.greater('-02019.23', -2019.23));
                Assert.true(Check.greaterEqual('02019.230', 2019.23));
            }
            test14() {
                Assert.true(Check.less('02019.22', 2019.220001));
                Assert.false(Check.less('-02019.23', -2019.23));
                Assert.true(Check.lessEqual('02019.230', 2019.23));
            }
            test15() {
                Assert.true(Check.shorter('JSDK', 5));
                Assert.false(Check.shorter('JSDK', 3));
                Assert.false(Check.shorter(null, 4));
                Assert.true(Check.longer('JSDK', 3));
                Assert.false(Check.longer('JSDK', 4));
                Assert.false(Check.longer(null, 4));
                Assert.false(Check.equalLength(null, 4));
                Assert.true(Check.equalLength('null', 4));
            }
            test16() {
                Assert.true(Check.isLettersOnly('JSDK'));
                Assert.false(Check.isLettersOnly('J S D K'));
                Assert.false(Check.isLettersOnly('JSDK2019'));
            }
            test17() {
                Assert.true(Check.isLettersOrNumbers('JSDK'));
                Assert.false(Check.isLettersOrNumbers('J S D K'));
                Assert.true(Check.isLettersOrNumbers('JSDK2019'));
            }
            test18() {
                Assert.true(Check.isEmpty(undefined));
                Assert.true(Check.isEmpty(null));
                Assert.true(Check.isEmpty(''));
                Assert.false(Check.isEmpty(' '));
                Assert.true(Check.isEmpty({}));
                Assert.false(Check.isEmpty({ a: undefined }));
                Assert.true(Check.isEmpty([]));
                Assert.false(Check.isEmpty([undefined]));
            }
            test19() {
                Assert.true(Check.isBlank(undefined));
                Assert.true(Check.isBlank(null));
                Assert.true(Check.isBlank(''));
                Assert.true(Check.isBlank(' '));
            }
            test20() {
                Check.byServer({
                    url: 'test-data/persons-list.json',
                    type: 'json'
                }, (res) => {
                    return res.data.code == 'success';
                }).then((ok) => {
                    Assert.true(ok);
                });
            }
        };
        CheckTest = __decorate([
            klass('JS.test.CheckTest')
        ], CheckTest);
        test.CheckTest = CheckTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let DatesTest = class DatesTest extends TestCase {
            setUp() {
                Date.class.cancelAop('format');
            }
            test1() {
                Assert.true(Dates.isLeapYear(2004));
                Assert.false(Dates.isLeapYear(1999));
            }
            test2() {
                Assert.true(Dates.getDaysOfMonth(1, 2019) == 28);
                Assert.true(Dates.getDaysOfMonth(2, 2019) == 31);
            }
            test3() {
                Assert.true(new Date(2019, 0, 1, 1, 1, 1).equals(new Date('2019-1-1'), 'd'));
            }
            test4() {
                let d = new Date(2019, 0, 1);
                Assert.true(d.setLastTime().diff(new Date('2019-1-1').setLastTime()) == 0);
                Assert.true(d.isBefore(new Date('2019-1-2')));
                Assert.true(d.isAfter(new Date('2018-12-31')));
            }
            test5() {
                Assert.true(new Date('2018-12-30').getWeek() == 52);
                Assert.true(new Date('2018-12-31').getWeek() == 53);
                Assert.true(new Date('2019-1-1').getWeek() == 1);
            }
            test6() {
                let d = new Date('2018-12-30');
                d.setWeek(52);
                Assert.true(d.getWeek() == 52);
                Assert.true(d.equals(new Date('2018-12-24'), 'd'));
                d.setWeek(53);
                Assert.true(d.getWeek() == 53);
                Assert.true(d.equals(new Date('2018-12-31'), 'd'));
            }
            test8() {
                Assert.true(new Date(2019, 0, 1, 12, 0, 1, 123).equals(new Date(2019, 0, 1, 12, 0, 1, 123)));
                Assert.false(new Date(2019, 0, 1, 12, 0, 1, 123).equals(new Date(2019, 0, 1, 12, 0, 1, 124)));
            }
            test9() {
                let d = new Date('2019-1-2'), d1 = new Date('2019-1-1'), d2 = new Date('2019-1-3');
                Assert.true(d.between(d1, d2));
                Assert.false(d.between(d2, d1));
                Assert.true(d.between(d, d2));
            }
            test10() {
                let d = new Date('2019-1-2'), d1 = new Date('2019-1-1'), d2 = new Date('2019-1-3');
                Assert.true(d.isAfter(d1));
                Assert.false(d.isAfter(d2));
                Assert.false(d.isAfter(d));
            }
            test11() {
                let d = new Date('2019-1-2'), d1 = new Date('2019-1-1'), d2 = new Date('2019-1-3');
                Assert.true(d.isBefore(d2));
                Assert.false(d.isBefore(d1));
                Assert.false(d.isBefore(d));
            }
            test12() {
                Assert.true(new Date().isToday(new Date()));
            }
            test13() {
                let d = new Date('2019-1-1').setZeroTime(), h = d.getHours(), m = d.getMinutes(), s = d.getSeconds(), ms = d.getMilliseconds();
                Assert.true(d.clone().add(1, 'y').equals(new Date('2020-1-1'), 'd'));
                Assert.true(d.clone().add(-1, 'y').equals(new Date('2018-1-1'), 'd'));
                Assert.true(d.clone().add(1, 'M').equals(new Date('2019-2-1'), 'd'));
                Assert.true(d.clone().add(-1, 'M').equals(new Date('2018-12-1'), 'd'));
                Assert.true(d.clone().add(1, 'd').equals(new Date('2019-1-2'), 'd'));
                Assert.true(d.clone().add(-1, 'd').equals(new Date('2018-12-31'), 'd'));
                Assert.true(d.clone().add(1, 'w').equals(new Date('2019-1-8'), 'd'));
                Assert.true(d.clone().add(-1, 'w').equals(new Date('2018-12-25'), 'd'));
                Assert.true(d.clone().add(1, 'h').getHours() == h + 1);
                Assert.true(d.clone().add(-1, 'h').getHours() == 23);
                Assert.true(d.clone().add(1, 'm').getMinutes() == m + 1);
                Assert.true(d.clone().add(-1, 'm').getMinutes() == 59);
                Assert.true(d.clone().add(1, 's').getSeconds() == s + 1);
                Assert.true(d.clone().add(-1, 's').getSeconds() == 59);
                Assert.true(d.clone().add(1, 'ms').getMilliseconds() == ms + 1);
                Assert.true(d.clone().add(-1, 'ms').getMilliseconds() == 999);
            }
            test14() {
                let d = new Date('2019-1-1').setZeroTime(), offset = d.formatTimezoneOffset();
                d.setTimezoneOffset(Number(offset) / 100);
                Assert.true(d.formatTimezoneOffset() === offset);
            }
            test15() {
                let d = new Date('2019-1-1').setZeroTime();
                Assert.true(d.clone().set({ year: 2018 }).getFullYear() == 2018);
                Assert.true(d.clone().set({ month: 11 }).getMonth() == 11);
                Assert.true(d.clone().set({ day: 30 }).getDate() == 30);
                Assert.true(d.clone().set({ week: 52 }).getWeek() == 52);
                Assert.true(d.clone().set({ hour: 12 }).getHours() == 12);
                Assert.true(d.clone().set({ minute: 10 }).getMinutes() == 10);
                Assert.true(d.clone().set({ second: 59 }).getSeconds() == 59);
                Assert.true(d.clone().set({ millisecond: 999 }).getMilliseconds() == 999);
                Assert.true(d.clone().set({ timezoneOffset: -480 }).getTimezoneOffset() == -480);
            }
            test16() {
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
                };
                let d = new Date('2019-1-1 13:02:03');
                Assert.equal('2019-01-01', d.format('YYYY-MM-DD'));
                Assert.equal('2019-1-1', d.format('YYYY-M-D'));
                Assert.equal('19年1月1日', d.format('YY年M月D日'));
                Assert.equal('2019/Jan/01', d.format('YYYY/MMM/DD', 'en'));
                Assert.equal('2019/一月/01', d.format('YYYY/MMM/DD', 'zh'));
                Assert.equal('2019/January/01', d.format('YYYY/MMMM/DD', 'en'));
                Assert.equal('2019/一月/01', d.format('YYYY/MMMM/DD', 'zh'));
                Assert.equal('2019/01 Tue', d.format('YYYY/MM ddd', 'en'));
                Assert.equal('2019/01 周二', d.format('YYYY/MM ddd', 'zh'));
                Assert.equal('2019/01 Tuesday', d.format('YYYY/MM dddd', 'en'));
                Assert.equal('2019/01 星期二', d.format('YYYY/MM dddd', 'zh'));
                Assert.equal('19/1/1 13:02:03', d.format('YY/M/D HH:mm:ss'));
                Assert.equal('19/1/1 1:2:3', d.format('YY/M/D h:m:s'));
                Assert.equal('19/1/1 PM 1:02', d.format('YY/M/D A h:mm', 'en'));
                Assert.equal('19/1/1 下午 1:02', d.format('YY/M/D A h:mm', 'zh'));
            }
        };
        DatesTest = __decorate([
            klass('JS.test.DatesTest')
        ], DatesTest);
        test.DatesTest = DatesTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let ErrorsTest = class ErrorsTest extends TestCase {
            test1() {
                Assert.equalError(TypeError, () => {
                    throw new Errors.TypeError();
                });
            }
            test2() {
                Assert.equalError(TypeError, () => {
                    throw new Errors.TypeError('xxx');
                });
            }
            test3() {
                Assert.equalError(JSError, () => {
                    throw new Errors.JSError('xxx', new TypeError());
                });
            }
        };
        ErrorsTest = __decorate([
            klass('JS.test.ErrorsTest')
        ], ErrorsTest);
        test.ErrorsTest = ErrorsTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let FilesTest = class FilesTest extends TestCase {
            test1() {
                Assert.true(Files.isFileExt('/a.log', '.log'));
                Assert.false(Files.isFileExt('/a.lg', '.log'));
                Assert.false(Files.isFileExt('/a.log.', '.log'));
            }
            test2() {
                Assert.true(Files.isCompressedFile('/a.zip'));
                Assert.true(Files.isCompressedFile('http://.com/a.rar'));
                Assert.true(Files.isImageFile('http://a.com/b.png'));
            }
            test3() {
                Assert.equal(0, Files.convertSize(null, FileSizeUnit.B, FileSizeUnit.GB));
                Assert.equal(0, Files.convertSize(undefined, FileSizeUnit.KB, FileSizeUnit.TB));
                Assert.equal(0, Files.convertSize('', FileSizeUnit.TB, FileSizeUnit.B));
                Assert.equal(0, Files.convertSize(0, FileSizeUnit.MB, FileSizeUnit.KB));
                Assert.equal(1, Files.convertSize(1024, FileSizeUnit.B, FileSizeUnit.KB));
                Assert.equal(1, Files.convertSize(1024, FileSizeUnit.KB, FileSizeUnit.MB));
                Assert.equal(1, Files.convertSize(1024, FileSizeUnit.MB, FileSizeUnit.GB));
                Assert.equal(1, Files.convertSize(1024, FileSizeUnit.GB, FileSizeUnit.TB));
                Assert.equal(0.5, Files.convertSize(512, FileSizeUnit.B, FileSizeUnit.KB));
                Assert.equal(0.5, Files.convertSize(512, FileSizeUnit.KB, FileSizeUnit.MB));
                Assert.equal(0.5, Files.convertSize(512, FileSizeUnit.MB, FileSizeUnit.GB));
                Assert.equal(0.5, Files.convertSize(512, FileSizeUnit.GB, FileSizeUnit.TB));
                Assert.equal(0.00048828125, Files.convertSize(512, FileSizeUnit.B, FileSizeUnit.MB));
                Assert.equal(536870912, Files.convertSize(512, FileSizeUnit.MB, FileSizeUnit.B));
            }
            test4() {
                Assert.equal('0B', Files.toSizeString(null));
                Assert.equal('0B', Files.toSizeString(undefined));
                Assert.equal('0B', Files.toSizeString(''));
                Assert.equal('0B', Files.toSizeString(0));
                Assert.equal('0KB', Files.toSizeString('0', FileSizeUnit.KB));
                Assert.equal('0MB', Files.toSizeString('0', FileSizeUnit.MB));
                Assert.equal('0GB', Files.toSizeString('0', FileSizeUnit.GB));
                Assert.equal('0TB', Files.toSizeString('0', FileSizeUnit.TB));
                Assert.equal('1B', Files.toSizeString(1));
                Assert.equal('1KB', Files.toSizeString(Files.ONE_KB));
                Assert.equal('1MB', Files.toSizeString(Files.ONE_MB));
                Assert.equal('1GB', Files.toSizeString(Files.ONE_GB));
                Assert.equal('1TB', Files.toSizeString(Files.ONE_TB));
                Assert.equal('1KB', Files.toSizeString(1, FileSizeUnit.KB));
                Assert.equal('1MB', Files.toSizeString(1, FileSizeUnit.MB));
                Assert.equal('1GB', Files.toSizeString(1, FileSizeUnit.GB));
                Assert.equal('1TB', Files.toSizeString(1, FileSizeUnit.TB));
            }
        };
        FilesTest = __decorate([
            klass('JS.test.FilesTest')
        ], FilesTest);
        test.FilesTest = FilesTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let FunctionsTest = class FunctionsTest extends TestCase {
            setUp() {
                this._fn = function (a) {
                    return this + a;
                };
            }
            test1() {
                class Pig {
                }
                ;
                class Fly {
                    fly() {
                        return 'I can fly';
                    }
                    eat() {
                        return 'I can eat';
                    }
                }
                ;
                let pig = new Pig();
                Assert.equal(undefined, pig.fly);
                Assert.equal(undefined, pig.eat);
                Pig.mixin(Fly, ['fly']);
                pig = new Pig();
                Assert.equal('I can fly', pig.fly());
                Assert.equal(undefined, pig.eat);
                Pig.mixin(Fly);
                pig = new Pig();
                Assert.equal('I can fly', pig.fly());
                Assert.equal('I can eat', pig.eat());
            }
            test2() {
                Assert.equal(1, Functions.execute('return this(a)-this(b);', Number, 'b,a', [1, 2]));
            }
            test3() {
                let newFn = this._fn.aop({
                    before: function (a) {
                        Assert.equal(7, a);
                    },
                    after: function (rtn) {
                        Assert.equal(116, rtn);
                    },
                    around: function (fn, a) {
                        return fn.call(this, a) + 10;
                    }
                }, 99);
                Assert.equal(116, newFn(7));
            }
        };
        FunctionsTest = __decorate([
            klass('JS.test.FunctionsTest')
        ], FunctionsTest);
        test.FunctionsTest = FunctionsTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let JsonsTest = class JsonsTest extends TestCase {
            setUp() {
                this._json1 = {
                    a: null,
                    b: undefined,
                    c: 0,
                    d: '123',
                    e: false,
                    f: new Date(),
                    g: [undefined, null, function () { }, { a: 1, b: true, c: '123' }],
                    h: { a: 1, b: true, c: '123' },
                    i: function () { }
                };
                this._json2 = {
                    a: undefined,
                    b: null,
                    c: '123',
                    d: 1,
                    g: [null, undefined, function () { }, { a: 2, b: false, c: '456', d: {} }],
                    h: { a: 2, d: [] },
                    k: {}
                };
            }
            test1() {
                let json = Jsons.union(this._json1, this._json2);
                Assert.equal(json.a, null);
                Assert.equal(json.b, null);
                Assert.equal(json.c, '123');
                Assert.equal(json.d, 1);
                Assert.equal(json.e, false);
                Assert.equal(new Date().equals(json.f, 'd'), true);
                Assert.equal(json.g.length, 4);
                Assert.equal(json.g[0], null);
                Assert.equal(json.g[1], null);
                Assert.equal(Types.isFunction(json.g[2]), true);
                Assert.equal(json.g[3].c, '456');
                Assert.equal(Types.isJsonObject(json.g[3].d), true);
                Assert.equal(json.h.a, 2);
                Assert.equal(json.h.b, true);
                Assert.equal(Types.isArray(json.h.d), true);
                Assert.equal(Types.isJsonObject(json.k), true);
                Assert.equal(Types.isFunction(json.i), true);
            }
        };
        JsonsTest = __decorate([
            klass('JS.test.JsonsTest')
        ], JsonsTest);
        test.JsonsTest = JsonsTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let NumbersTest = class NumbersTest extends TestCase {
            test1() {
                Assert.equal(Number(-1e-7).stringify(), '-0.0000001');
                Assert.equal(Number(2 / 3).stringify(), '0.6666666666666666');
            }
            test2() {
                Assert.equal(Number(-1e-7).format(), '-0.0000001');
                Assert.equal(Number(-1e-7).format(10), '-0.0000001000');
                Assert.equal(Number(123456).format(3), '123,456.000');
                Assert.equal(Number(-123456.785).format(2), '-123,456.78');
                Assert.equal(Number(123456.785).format(2), '123,456.79');
            }
            test3() {
                let n1 = Number(0.5), n2 = Number(78.1112223335), n3 = Number(535);
                Assert.equal(n1.round(0).stringify(), '1');
                Assert.equal(n2.round(9).stringify(), '78.111222334');
                Assert.equal(n3.round(2).stringify(), '535');
            }
            test4() {
                let n1 = Number(0.5), n2 = Number(78.5112223335), n3 = Number(-535);
                Assert.equal(n1.toInt().stringify(), '1');
                Assert.equal(n2.toInt().stringify(), '79');
                Assert.equal(n3.toInt().stringify(), '-535');
            }
            test5() {
                Assert.true(Number(78.567).equals(78.567));
                Assert.true(Number(78.5675).equals(78.568, 3));
            }
            test6() {
                Assert.equal(Number(0.1).add(0.2).stringify(), '0.3');
                Assert.equal(Number(0.15).sub(0.1).stringify(), '0.05');
                Assert.equal(Number(0.1).mul(0.2).stringify(), '0.02');
                Assert.equal(Number(0.15).div(0.2).stringify(), '0.75');
            }
            test7() {
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
            test8() {
                Assert.equal(Number(123456.00000789).integerLength(), 6);
                Assert.equal(Number(123456.00000789).fractionLength(), 8);
                Assert.equal(Number(-0.00000789).integerLength(), 1);
                Assert.equal(Number(-123456.0000).fractionLength(), 0);
                Assert.equal(Number(0).integerLength(), 1);
                Assert.equal(Number(0).fractionLength(), 0);
            }
            test9() {
                Assert.true(Numbers.min(1.01, Number(1), -1) === -1);
                Assert.true(Numbers.max(1.01, Number(1), -1) === 1.01);
            }
            test10() {
                Assert.equal(Numbers.termwise(1.01, '+', Number(1)), 2.01);
                Assert.equal(Numbers.termwise(0.15, '/', 0.2, '+', Number(0.3)), 1.05);
            }
            test11() {
                Assert.equal(Numbers.algebra(' - 2.01*(0.3894567-1.5908+7.9999)/(+3.1-9.9)'), 2.0095733775);
                Assert.equal(Numbers.algebra(' a*(0.3894567-1.5908+d)/(+b-c)', {
                    a: -2.01,
                    b: 3.1,
                    c: 9.9,
                    d: 7.9999
                }), 2.0095733775);
            }
        };
        NumbersTest = __decorate([
            klass('JS.test.NumbersTest')
        ], NumbersTest);
        test.NumbersTest = NumbersTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let RandomTest = class RandomTest extends TestCase {
            test1() {
                Assert.true(Check.isBetween(Random.number(100), 0, 100));
                Assert.true(Check.isBetween(Random.number({ min: 1, max: 2 }), 1, 2));
                let n = Random.number({ min: 1, max: 2 }, true);
                Assert.true(n === 1 || n === 2);
            }
            test2() {
                Assert.true(Random.uuid(10).length == 10);
                Assert.true(Random.uuid().length == 36);
            }
        };
        RandomTest = __decorate([
            klass('JS.test.RandomTest')
        ], RandomTest);
        test.RandomTest = RandomTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let StringsTest = class StringsTest extends TestCase {
            test1() {
                Assert.equal('<div id="1">xxx</div>', Strings.nodeHTML('div', { id: '1' }, 'xxx'));
            }
            test2() {
                Assert.equal(undefined, Strings.format(undefined, 2019));
                Assert.equal(null, Strings.format(null, 2019));
                Assert.equal('2019-1-1', Strings.format('%s-%f-%d', '2019', 1, 1));
                Assert.equal('\n', Strings.format('%n'));
                Assert.equal('%s', Strings.format('%%s'), '2019');
                Assert.equal('false', Strings.format('%b', ''));
            }
            test3() {
                let s = Strings.merge('a1={a1},b1={b1},{c}', {
                    a1: 'aaa',
                    b1: 'bbb'
                });
                Assert.equal('a1=aaa,b1=bbb,{c}', s);
                s = Strings.merge('a1={a1},b1={b1},{c}', {
                    a1: 'aaa',
                    b1: 'bbb',
                    c: (data) => {
                        return data['d'];
                    },
                    d: 'ddd'
                });
                Assert.equal('a1=aaa,b1=bbb,ddd', s);
                s = Strings.merge('a1={}', {
                    a1: 'aaa'
                });
                Assert.equal('a1={}', s);
            }
        };
        StringsTest = __decorate([
            klass('JS.test.StringsTest')
        ], StringsTest);
        test.StringsTest = StringsTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        var TypesTest_1;
        let TypesTest = TypesTest_1 = class TypesTest extends TestCase {
            test1() {
                Assert.true(Types.isKlass(new JSError(), JSError));
                Assert.false(Types.isKlass(new Error(), JSError));
                Assert.true(Types.isKlass(new TestCase(), TestCase));
                Assert.true(Types.ofKlass(new TypesTest_1(), TestCase));
                Assert.false(Types.ofKlass(new TestCase(), TypesTest_1));
                Assert.true(Types.ofKlass(this, TestCase));
            }
            test2() {
                Assert.true(Types.equalKlass(JSError, JSError));
                Assert.false(Types.equalKlass(new JSError(), JSError));
                Assert.false(Types.equalKlass(JSError, Error));
                Assert.true(Types.subKlass(JSError, Error));
                Assert.true(Types.subKlass(TypesTest_1, TestCase));
                Assert.false(Types.subKlass(TestCase, TypesTest_1));
            }
            test3() {
                Assert.true(Types.equalClass(new Class('JS.unit.TestCase', TestCase), TestCase.class));
                Assert.false(Types.equalClass(new Class('JS.unit.TestCase', TestCase), TypesTest_1.class));
                Assert.true(Types.subClass(new Class('JS.unit.TestCase', TestCase), Object.class));
                Assert.true(Types.subClass(new Class('JS.test.TypesTest', TypesTest_1), TestCase.class));
                Assert.false(Types.equalClass(new Class('JS.unit.TestCase', TestCase), TypesTest_1.class));
                Assert.true(Types.subClass(new Class('JS.unit.TestCase', TestCase), Object.class));
            }
            test4() {
                Assert.equal(Types.type(null), Type.null);
                Assert.equal(Types.type(undefined), Type.undefined);
                Assert.equal(Types.type(''), Type.string);
                Assert.equal(Types.type(1), Type.number);
                Assert.equal(Types.type(new Date()), Type.date);
                Assert.equal(Types.type(true), Type.boolean);
                Assert.equal(Types.type(Object), Type.class);
                Assert.equal(Types.type(JSError), Type.class);
                Assert.equal(Types.type(new JSError()), Type.object);
                Assert.equal(Types.type({}), Type.json);
                Assert.equal(Types.type([]), Type.array);
                Assert.equal(Types.type(() => { }), Type.function);
            }
        };
        TypesTest = TypesTest_1 = __decorate([
            klass('JS.test.TypesTest')
        ], TypesTest);
        test.TypesTest = TypesTest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let test;
    (function (test) {
        let URITest = class URITest extends TestCase {
            test1() {
                let uri = new URI();
                Assert.equal('http://', uri.toAbsolute());
                Assert.equal('', uri.toRelative());
                Assert.equal('', uri.toString());
            }
            test2() {
                let uri = new URI('http://www.w3c.org');
                Assert.equal('http://www.w3c.org', uri.toAbsolute());
                Assert.equal('', uri.toRelative());
                Assert.equal('http://www.w3c.org', uri.toString());
            }
            test3() {
                let uri = new URI('/');
                Assert.equal('http://', uri.toAbsolute());
                Assert.equal('', uri.toRelative());
                Assert.equal('', uri.toString());
            }
            test4() {
                let uri = new URI('https://username:password@example.com:123/path/data?key=%20value#frag');
                Assert.equal('https', uri.scheme());
                Assert.equal('username', uri.user());
                Assert.equal('password', uri.password());
                Assert.equal('username:password', uri.userinfo());
                Assert.equal('example.com', uri.host());
                Assert.equal(123, uri.port());
                Assert.equal('/path/data', uri.path());
                Assert.equal('key=%20value', uri.queryString());
                Assert.equal({ key: '%20value' }, uri.queryObject());
                Assert.equal(' value', uri.query('key'));
                Assert.equal('frag', uri.fragment());
            }
            test5() {
                let uri = new URI();
                uri.scheme('https');
                uri.user('username');
                uri.password('password');
                uri.host('example.com');
                uri.port(123);
                uri.path('/path/data');
                uri.queryString('key=%20value');
                uri.fragment('frag');
                Assert.equal('https://username:password@example.com:123/path/data?key=%20value#frag', uri.toString());
                Assert.equal('https://username:password@example.com:123/path/data?key=%20value#frag', uri.toAbsolute());
                Assert.equal('/path/data?key=%20value#frag', uri.toRelative());
            }
        };
        URITest = __decorate([
            klass('JS.test.URITest')
        ], URITest);
        test.URITest = URITest;
    })(test = JS.test || (JS.test = {}));
})(JS || (JS = {}));
