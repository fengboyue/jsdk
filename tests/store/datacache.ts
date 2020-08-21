/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.DataCacheTest')
        export class DataCacheTest extends TestCase {
            private cache: DataCache = new DataCache({
                name: 'test'
            });

            async test1() {
                await this.cache.clear();

                await this.cache.write({
                    id: '1',
                    data: undefined
                });
                let data:any = await this.cache.read<string>('1');
                Assert.equal(undefined, data);

                await this.cache.write({
                    id: '2',
                    data: null
                });
                data = await this.cache.read<string>('2');
                Assert.equal(null, data);

                await this.cache.write({
                    id: '3',
                    data: 3.14
                });
                data = await this.cache.read<string>('3');
                Assert.equal(3.14, data);

                await this.cache.write({
                    id: '4',
                    data: '3.14'
                });
                data = await this.cache.read<string>('4');
                Assert.equal('3.14', data);

                await this.cache.write({
                    id: '5',
                    data: false
                });
                data = await this.cache.read<string>('5');
                Assert.equal(false, data);

                let json = {
                    n1: '1',
                    n2: null,
                    n3: 1.01,
                    n4: true
                }
                await this.cache.write({
                    id: '6',
                    data: json
                });
                data = await this.cache.read<string>('6');
                Assert.equal(Jsons.clone(json), <any>data);

                await this.cache.delete('6');

                let keys = await this.cache.keys();
                Assert.equal(5, keys.length);
            }

            async test2(){
                await this.cache.clear();

                await this.cache.load({
                    id: '1',
                    url: 'test-data/blueyellow.wav',
                    type: 'arraybuffer'
                });
                let data:any = await this.cache.read<ArrayBuffer>('1');
                Assert.true(Types.isArrayBuffer(data));

                await this.cache.load({
                    id: '2',
                    url: 'test-data/bundle1.json',
                    type: 'text'
                });
                data = await this.cache.read<string>('2');
                Assert.true(Types.isString(data));
            }
        }
    }
}
