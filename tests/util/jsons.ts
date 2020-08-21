/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.JsonsTest')
        export class JsonsTest extends TestCase {
            private _json1;
            private _json2;
            protected setUp() {
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
                }
                this._json2 = {
                    a: undefined,
                    b: null,
                    c: '123',
                    d: 1,
                    g: [null, undefined, function () { }, { a: 2, b: false, c: '456', d: {} }],
                    h: { a: 2, d: [] },
                    k: {}
                }
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
        }
    }
}
