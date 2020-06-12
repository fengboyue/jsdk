/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.FilesTest')
        export class FilesTest extends TestCase {

            public test1() {
                Assert.true(Files.isFileExt('/a.log','.log'));
                Assert.false(Files.isFileExt('/a.lg','.log'));
                Assert.false(Files.isFileExt('/a.log.','.log'));
            }
            public test2() {
                Assert.true(Files.isCompressedFile('/a.zip'));
                Assert.true(Files.isCompressedFile('http://.com/a.rar'));
                Assert.true(Files.isImageFile('http://a.com/b.png'));
            }
            public test3() {
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
            public test4() {
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
            
        }
    }
}
