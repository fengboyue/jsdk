/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.2.0
 * @author Frank.Feng
 */

module JS {

    export namespace input {

        /**
         * https://unixpapa.com/js/key.html
         */
        export let VK = {
            BACK_SPACE   : 8,   
            TAB          : 9,   
            ENTER        : 13,  
            SHIFT        : 16,  
            CTRL         : 17,  
            ALT          : 18,  
            PAUSE        : 19,  
            CAPS_LOCK    : 20,  
            ESC          : 27,  
            SPACE        : 32,  
            PAGE_UP      : 33,  
            PAGE_DOWN    : 34,  
            END          : 35,  
            HOME         : 36,  
            LEFT         : 37,  
            UP           : 38,  
            RIGHT        : 39,  
            DOWN         : 40,  
            PRINT_SCREEN : 44,  
            INSERT       : 45,  
            DELETE       : 46,  
            
            KEY0         : 48,
            KEY1         : 49,
            KEY2         : 50,
            KEY3         : 51,
            KEY4         : 52,
            KEY5         : 53,
            KEY6         : 54,
            KEY7         : 55,
            KEY8         : 56,
            KEY9         : 57,
            
            A            : 65,
            B            : 66,
            C            : 67,
            D            : 68,
            E            : 69,
            F            : 70,
            G            : 71,
            H            : 72,
            I            : 73,
            J            : 74,
            K            : 75,
            L            : 76,
            M            : 77,
            N            : 78,
            O            : 79,
            P            : 80,
            Q            : 81,
            R            : 82,
            S            : 83,
            T            : 84,
            U            : 85,
            V            : 86,
            W            : 87,
            X            : 88,
            Y            : 89,
            Z            : 90,

            /** Numbers in NUMPAD */
            PAD0         : 96,
            PAD1         : 97,
            PAD2         : 98,
            PAD3         : 99,
            PAD4         : 100,
            PAD5         : 101,
            PAD6         : 102,
            PAD7         : 103,
            PAD8         : 104,
            PAD9         : 105,

            /** * in NUMPAD */
            MULTIPLY     : 106, 
            /** + in NUMPAD */
            PLUS         : 107, 
            /** - in NUMPAD */
            SUBTRACT     : 109, 
            /** . in NUMPAD */
            DECIMAL      : 110, 
            /** / in NUMPAD */
            DIVIDE       : 111, 

            F1           : 112,
            F2           : 113,
            F3           : 114,
            F4           : 115,
            F5           : 116,
            F6           : 117,
            F7           : 118,
            F8           : 119,
            F9           : 120,
            F10          : 121,
            F11          : 122,
            F12          : 123,

            NUM_LOCK     : 144, 
            SCROLL_LOCK  : 145, 
            /**
             *  Mac平台上指的是 command键（⌘），而在Windows平台指的是 windows键（⊞）
             */
            META_LEFT    : 91,  
            META_RIGHT   : 93,  
    
            /** ; */
            SEMICOLON    : 186,
            /** = */ 
            EQUAL_SIGN   : 187,
            /** , */ 
            COMMA        : 188,
            /** - */ 
            HYPHEN       : 189, 
            /** . */
            PERIOD       : 190,
            /** / */ 
            SLASH        : 191, 
            /** ` */
            APOSTROPHE   : 192, 
            /** [ */
            LEFT_SQUARE_BRACKET: 219, 
            /** \ */
            BACK_SLASH   : 220, 
            /** ] */
            RIGHT_SQUARE_BRACKET: 221, 
            /** ' */
            QUOTE : 222
        }

    }
}
import VK = JS.input.VK;