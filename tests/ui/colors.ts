/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.ColorsTest')
        export class ColorsTest extends TestCase {

            test1() {
                Assert.equal({r:39,g:174,b:96,a:1}, Colors.hex2rgba('27ae60'));
                Assert.equal({r:39,g:174,b:96,a:1}, Colors.hex2rgba('#27ae60'));
                Assert.equal({r:39,g:174,b:96,a:1}, Colors.hex2rgba('#27ae60ff'));

                Assert.equal({r:255,g:255,b:255,a:1}, Colors.hex2rgba('fff'));
                Assert.equal({r:255,g:255,b:255,a:1}, Colors.hex2rgba('#fff'));

                Assert.equal({r:0,g:0,b:0,a:1}, Colors.hex2rgba('000'));
                Assert.equal({r:0,g:0,b:0,a:1}, Colors.hex2rgba('#000'));
                Assert.equal({r:0,g:0,b:0,a:0}, Colors.hex2rgba('#0000'));
                Assert.equal({r:0,g:0,b:0,a:1}, Colors.hex2rgba('000f'));
            }

            test2() {
                Assert.equal('#000000', Colors.rgba2hex(0,0,0));
                Assert.equal('#ffffff', Colors.rgba2hex(255,255,255));
                
                Assert.equal('#000000ff', Colors.rgba2hex(0,0,0,1));
                Assert.equal('#ffffff00', Colors.rgba2hex(255,255,255,0));
                
                Assert.equal('#27ae60', Colors.rgba2hex(39,174,96));
                Assert.equal('#27ae6000', Colors.rgba2hex(39,174,96,0));
                Assert.equal('#27ae60ff', Colors.rgba2hex(39,174,96,1));
            }

            /**
             * 
            * Opacity %   255 Step        2 digit HEX prefix
            *  0%          0.00            00
            *  5%          12.75           0C
            *  10%         25.50           19
            *  15%         38.25           26
            *  20%         51.00           33
            *  25%         63.75           3F
            *  30%         76.50           4C
            *  35%         89.25           59
            *  40%         102.00          66
            *  45%         114.75          72
            *  50%         127.50          7F
            *  55%         140.25          8C
            *  60%         153.00          99
            *  65%         165.75          A5
            *  70%         178.50          B2
            *  75%         191.25          BF
            *  80%         204.00          CC
            *  85%         216.75          D8
            *  90%         229.50          E5
            *  95%         242.25          F2
            *  100%        255.00          FF
             */
            test3() {
                Assert.equal('#0000000c', Colors.rgba2hex(0,0,0,0.05));
                Assert.equal('#00000019', Colors.rgba2hex(0,0,0,0.10));
                Assert.equal('#00000026', Colors.rgba2hex(0,0,0,0.15));
                Assert.equal('#00000033', Colors.rgba2hex(0,0,0,0.20));
                Assert.equal('#0000003f', Colors.rgba2hex(0,0,0,0.25));
                Assert.equal('#0000004c', Colors.rgba2hex(0,0,0,0.30));
                Assert.equal('#00000059', Colors.rgba2hex(0,0,0,0.35));
                Assert.equal('#00000066', Colors.rgba2hex(0,0,0,0.40));
                Assert.equal('#00000072', Colors.rgba2hex(0,0,0,0.45));
                Assert.equal('#0000007f', Colors.rgba2hex(0,0,0,0.50));
                Assert.equal('#0000008c', Colors.rgba2hex(0,0,0,0.55));
                Assert.equal('#00000099', Colors.rgba2hex(0,0,0,0.60));
                Assert.equal('#000000a5', Colors.rgba2hex(0,0,0,0.65));
                Assert.equal('#000000b2', Colors.rgba2hex(0,0,0,0.70));
                Assert.equal('#000000bf', Colors.rgba2hex(0,0,0,0.75));
                Assert.equal('#000000cc', Colors.rgba2hex(0,0,0,0.80));
                Assert.equal('#000000d8', Colors.rgba2hex(0,0,0,0.85));
                Assert.equal('#000000e5', Colors.rgba2hex(0,0,0,0.90));
                Assert.equal('#000000f2', Colors.rgba2hex(0,0,0,0.95));
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

        }
    }
}
