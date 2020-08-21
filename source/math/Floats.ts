/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.5.0
 * @author Frank.Feng
 */
module JS {

    export namespace math {

        /**
         * Float tool
         */
        export class Floats {

            static EQUAL_PRECISION = 0.0001

            /**
             * Determine the equals of two float numbers approximatively.
             */
            static equal(n1: number, n2: number, eps = this.EQUAL_PRECISION) {
                let d = n1 - n2, n = d < 0 ? -d : d;
                return n <= eps;
            }
            /**
             * Determine float n1 > float n2 approximatively.
             */
            static greater(n1: number, n2: number, eps = this.EQUAL_PRECISION) {
                if (this.equal(n1, n2, eps)) return false;
                return n1 > n2
            }
            /**
             * Determine float n1 >= float n2 approximatively.
             */
            static greaterEqual(n1: number, n2: number, eps = this.EQUAL_PRECISION) {
                if (this.equal(n1, n2, eps)) return true;
                return n1 > n2
            }
            /**
             * Determine float n1 < float n2 approximatively.
             */
            static less(n1: number, n2: number, eps = this.EQUAL_PRECISION) {
                if (this.equal(n1, n2, eps)) return false;
                return n1 < n2
            }
            /**
             * Determine float n1 <= float n2 approximatively.
             */
            static lessEqual(n1: number, n2: number, eps = this.EQUAL_PRECISION) {
                if (this.equal(n1, n2, eps)) return true;
                return n1 < n2
            }

        }

    }
}

import Floats = JS.math.Floats;