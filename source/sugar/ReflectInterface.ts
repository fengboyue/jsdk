/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.5.0
 * @update Move to sugar package and rename.
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="Class.ts"/>

/**
 * Add reflect method for Function.prototype
 */
interface Function {
    /**
     * Returns the reflected Class of this class constructor.
     */
    class: Class<any>;
}

/**
 * Add reflect methods for Object.prototype
 */
interface Object {
    /**
     * Returns full name of the class.
     */
    className: string;
    /**
     * Returns the reflected Class.
     */
    getClass(): Class<any>;
}
