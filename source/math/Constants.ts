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
         * 2D point array
         */
        export type ArrayPoint2 = [number, number];
        /**
         * 3D point array
         */
        export type ArrayPoint3 = [number, number, number];
        /**
         * 2D polar point object
         * 
         * @property d the distance between point and the origin
         * @property a the angle in radian between point and X-axis
         */
        export type PolarPoint2 = { d: number, a: number };
        /**
         * 3D polar point object
         * 
         * @property d the distance between point and the origin
         * @property ax the angle in radian between the project segment of point and X-axis; [0,2*PI)
         * @property az the angle in radian between point and Z-axis; [0,PI)
         */
        export type PolarPoint3 = { d: number, ax: number, az: number };
    }
}

import ArrayPoint2 = JS.math.ArrayPoint2;
import ArrayPoint3 = JS.math.ArrayPoint3;
import PolarPoint2 = JS.math.PolarPoint2;
import PolarPoint3 = JS.math.PolarPoint3;