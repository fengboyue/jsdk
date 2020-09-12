/// <reference path="../../dist/jsdk.d.ts" /> 

module JS {

    export namespace test {

        @klass('JS.test.CssToolTest')
        export class CssToolTest extends TestCase {

            test1() {
                Assert.equal(null, CssTool.hex2rgb('27ae60'));
                Assert.equal({r:39,g:174,b:96,a:1}, CssTool.hex2rgb('#27ae60'));
                Assert.equal({r:39,g:174,b:96,a:1}, CssTool.hex2rgb('#27ae60ff'));

                Assert.equal(null, CssTool.hex2rgb('fff'));
                Assert.equal({r:255,g:255,b:255,a:1}, CssTool.hex2rgb('#fff'));

                Assert.equal(null, CssTool.hex2rgb('000'));
                Assert.equal({r:0,g:0,b:0,a:1}, CssTool.hex2rgb('#000'));
                Assert.equal({r:0,g:0,b:0,a:0}, CssTool.hex2rgb('#0000'));
                Assert.equal(null, CssTool.hex2rgb('000f'));
            }

            test2() {
                Assert.equal('#000000', CssTool.rgb2hex(0,0,0));
                Assert.equal('#ffffff', CssTool.rgb2hex(255,255,255));
                
                Assert.equal('#000000ff', CssTool.rgb2hex(0,0,0,1));
                Assert.equal('#ffffff00', CssTool.rgb2hex(255,255,255,0));
                
                Assert.equal('#27ae60', CssTool.rgb2hex(39,174,96));
                Assert.equal('#27ae6000', CssTool.rgb2hex(39,174,96,0));
                Assert.equal('#27ae60ff', CssTool.rgb2hex(39,174,96,1));
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
                Assert.equal('#0000000c', CssTool.rgb2hex(0,0,0,0.05));
                Assert.equal('#00000019', CssTool.rgb2hex(0,0,0,0.10));
                Assert.equal('#00000026', CssTool.rgb2hex(0,0,0,0.15));
                Assert.equal('#00000033', CssTool.rgb2hex(0,0,0,0.20));
                Assert.equal('#0000003f', CssTool.rgb2hex(0,0,0,0.25));
                Assert.equal('#0000004c', CssTool.rgb2hex(0,0,0,0.30));
                Assert.equal('#00000059', CssTool.rgb2hex(0,0,0,0.35));
                Assert.equal('#00000066', CssTool.rgb2hex(0,0,0,0.40));
                Assert.equal('#00000072', CssTool.rgb2hex(0,0,0,0.45));
                Assert.equal('#0000007f', CssTool.rgb2hex(0,0,0,0.50));
                Assert.equal('#0000008c', CssTool.rgb2hex(0,0,0,0.55));
                Assert.equal('#00000099', CssTool.rgb2hex(0,0,0,0.60));
                Assert.equal('#000000a5', CssTool.rgb2hex(0,0,0,0.65));
                Assert.equal('#000000b2', CssTool.rgb2hex(0,0,0,0.70));
                Assert.equal('#000000bf', CssTool.rgb2hex(0,0,0,0.75));
                Assert.equal('#000000cc', CssTool.rgb2hex(0,0,0,0.80));
                Assert.equal('#000000d8', CssTool.rgb2hex(0,0,0,0.85));
                Assert.equal('#000000e5', CssTool.rgb2hex(0,0,0,0.90));
                Assert.equal('#000000f2', CssTool.rgb2hex(0,0,0,0.95));
            }

            test4() {
                Assert.equal(0.05, CssTool.hex2rgb('#0000000c').a);
                Assert.equal(0.10, CssTool.hex2rgb('#00000019').a);
                Assert.equal(0.15, CssTool.hex2rgb('#00000026').a);
                Assert.equal(0.20, CssTool.hex2rgb('#00000033').a);
                Assert.equal(0.25, CssTool.hex2rgb('#0000003f').a);
                Assert.equal(0.30, CssTool.hex2rgb('#0000004c').a);
                Assert.equal(0.35, CssTool.hex2rgb('#00000059').a);
                Assert.equal(0.40, CssTool.hex2rgb('#00000066').a);
                Assert.equal(0.45, CssTool.hex2rgb('#00000072').a);
                Assert.equal(0.50, CssTool.hex2rgb('#0000007f').a);
                Assert.equal(0.55, CssTool.hex2rgb('#0000008c').a);
                Assert.equal(0.60, CssTool.hex2rgb('#00000099').a);
                Assert.equal(0.65, CssTool.hex2rgb('#000000a5').a);
                Assert.equal(0.70, CssTool.hex2rgb('#000000b2').a);
                Assert.equal(0.75, CssTool.hex2rgb('#000000bf').a);
                Assert.equal(0.80, CssTool.hex2rgb('#000000cc').a);
                Assert.equal(0.85, CssTool.hex2rgb('#000000d8').a);
                Assert.equal(0.90, CssTool.hex2rgb('#000000e5').a);
                Assert.equal(0.95, CssTool.hex2rgb('#000000f2').a);
            }

        }
    }
}
