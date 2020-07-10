/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="Class.ts"/>

/**
 * Add reflect and aop methods for Function.prototype
 */
interface Function {
  /**
   * Returns the reflected Class of this class constructor.
   */
  class: Class<any>;
  /**
   * Returns a new function for AOP.
   * @param advisor 
   * @param that the 'this' context 
   */
  aop(this: Function, advisor: AopAdvisor, that?: any): (...args) => Function;
  /**
   * Mixin other class methods in this class.
   */
  mixin(kls: Klass<any>, methodNames?: string[]): void;
}

/**
 * Add some reflect methods for Object.prototype
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

(function () {

let $F = Function.prototype;
$F.aop = function (advisor: AopAdvisor, that?: any) {
  let old = <Function>this,
    fn = function () {
      let args = Arrays.newArray(arguments),
        ctx = that || this,
        rst = undefined;

      if (advisor.before) advisor.before.apply(ctx, args);

      try {
        rst = advisor.around ? advisor.around.apply(ctx, [old].concat(args)) : old.apply(ctx, args);
      } catch (e) {
        if (advisor.throws) advisor.throws.apply(ctx, [e]);
      }

      if (advisor.after) advisor.after.apply(ctx, [rst]);

      return rst
    }
  return fn
}
$F.mixin = function (kls: Klass<any>, methodNames?: string[]): void {
    if(!kls) return 
    let kp = kls.prototype, tp = this.prototype, ms = Reflect.ownKeys(kp);

    for (let i = 0, len = ms.length; i < len; i++) {
        let m = ms[i]
        if('constructor'!=m && !tp[m]){
            if(methodNames) {
              if(methodNames.findIndex(v=>{return v==m})>-1) tp[m] = kp[m]
            }else{
              tp[m] = kp[m]
            }
        }
    }
}
})()

//修复TS生成的注解函数：为@before|@after等切面注解
var __decorate = function (decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  if (key && r && typeof target[key] == 'function') delete r.value;//BUGFIX: target[key]方法可能被AOP修改为新方法，但r.value仍旧指向旧方法，导致执行Object.defineProperty后target[key]恢复为旧方法
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};