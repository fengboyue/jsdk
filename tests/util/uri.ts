/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.URITest')
        export class URITest extends TestCase {

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
                Assert.equal({key:'%20value'}, uri.queryObject());
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
            
        }
    }
}
