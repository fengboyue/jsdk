/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.7.0
 * @author Frank.Feng
 */
module JS {

    export namespace an {

        let J = Jsons;

        type AnimatedKeyType = 'css' | 'transform' | 'attribute' | 'property';

        /**
         * The function accepts 3 arguments:
         * target	The curently animated targeted element
         * index	The index of the animated targeted element
         * total    The length of all animated targeted elements
         */
        type AnimatedValueFunction = (target: HTMLElement | object, index: number, total: number) => number | string | Array<number | string>;

        export type AnimatedValueType = CssValueString | number | Array<number | string> | AnimatedValueFunction;

        export class TweenAnimInit extends AnimInit {
            keys: JsonObject<AnimatedValueType>;
            /**
             * The default easing function is LINEAR.
             */
            easing?: keyof typeof Easings | ((target: HTMLElement | object, i: number, total: number) => EasingFunction) = 'LINEAR';
            /**
             * Round numbers with a fraction length.<br>
             * 保留N位小数位数
             */
            round?: number = 3;
        }

        type TargetKeyValue = {
            key: string;
            type: AnimatedKeyType;
            val: string | number;
        }
        let ValidTransforms = ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY', 'perspective', 'matrix', 'matrix3d'],
            has = (s: string, w: string) => {
                return s.indexOf(w) > -1
            },
            isDom = (a: HTMLElement) => {
                return a.nodeType || a instanceof SVGElement
            },
            parseEasingParameters = (string) => {
                var match = /\(([^)]+)\)/.exec(string);
                return match ? match[1].split(',').map(function (p) { return parseFloat(p); }) : [];
            },
            getAnimationType = (el: any, key: string): AnimatedKeyType => {
                if (isDom(el) && el.hasAttribute(key)) return 'attribute';
                if (isDom(el) && ValidTransforms.indexOf(key) > -1) return 'transform';
                if (isDom(el) && key !== 'transform' && key in el.style) return 'css';
                return 'property'
            },
            getTargetVal = (key: string, el: HTMLElement | object): TargetKeyValue => {
                let type: AnimatedKeyType = getAnimationType(el, key),
                    n: string;
                if (type == 'property') {
                    n = el[key]
                } else if (type == 'attribute') {
                    n = (<HTMLElement>el).attr(key);
                } else if (type == 'css') {
                    n = (<HTMLElement>el).css(key);
                } else if (type == 'transform' && ValidTransforms.indexOf(key) > -1) {
                    n = getTransformValue(<HTMLElement>el, key)
                }
                return {
                    key: key,
                    type: type,
                    val: n || '0'
                }
            },
            parseTransform = (el: HTMLElement): Map<string, string> => {
                if (!isDom(el)) { return; }
                let str = el.style.transform || '',
                    reg = /(\w+)\(([^)]*)\)/g,
                    transforms = new Map(),
                    m;
                while (m = reg.exec(str)) { transforms.set(m[1], m[2]); }
                return transforms;
            },
            getTransformUnit = (key) => {
                if (has(key, 'translate') || key === 'perspective') return 'px';
                if (has(key, 'rotate') || has(key, 'skew')) return 'deg';
                return null
            },
            getTransformValue = (el: HTMLElement, key: string): string => {
                return parseTransform(el).get(key) || defaultTransformValue(key);
            },
            defaultTransformValue = (key: string): string => {
                return has(key, 'scale') ? '1' : 0 + getTransformUnit(key);
            },
            setTargetVals = (kvs: TargetKeyValue[], el: HTMLElement | object) => {
                let trans = [];
                kvs.forEach((kv, i) => {
                    let type = kv.type, v = `${kv.val}`;
                    if (type == 'property') {
                        el[kv.key] = kv.val;
                    } else if (type == 'attribute') {
                        (<HTMLElement>el).attr(kv.key, v)
                    } else if (type == 'css') {
                        (<HTMLElement>el).css(kv.key, v)
                    } else if (type == 'transform') {
                        trans.add(i)
                    }
                })

                //transform集中处理
                let s = '';
                trans.forEach(j => {
                    let kv = kvs[j];
                    s += `${kv.key}(${kv.val})`
                });
                if (s) (<HTMLElement>el).style.transform = s
            },
            degUnit = (key: string, v: string | number): string => {
                if (typeof v !== 'string') return v + '';

                if (key.startsWith('rotate') || key.startsWith('skew')) {
                    if (v.endsWith('rad')) return (parseFloat(v) * 180 / Math.PI) + 'deg';
                    if (v.endsWith('turn')) return (parseFloat(v) * 360) + 'deg';
                    return v;
                } else return v
            },
            setTargetVal = (val: string | number, key: string, type: AnimatedKeyType, el: HTMLElement | object) => {
                if (type == 'property') {
                    el[key] = val;
                } else if (type == 'attribute') {
                    (<HTMLElement>el).attr(key, val == void 0 ? <any>val : (val + ''))
                } else if (type == 'css') {
                    (<HTMLElement>el).css(key, val)
                }
            }

        export class TweenAnim extends Anim {
            protected _cfg: TweenAnimInit;
            //缓存每个目标的初始值
            private _iniValues: Array<TargetKeyValue[]> = [];

            constructor(cfg: TweenAnimInit) {
                super(<TweenAnimInit>Jsons.union(new TweenAnimInit(), cfg));
            }

            private _getValues(ta: HTMLElement | object): TargetKeyValue[] {
                let a = [];
                Jsons.forEach(this._cfg.keys, (v, k) => {
                    a.add(getTargetVal(k, ta))
                })
                return a
            }

            private _saveIniValues() {
                if (this._iniValues.length == 0) {
                    this._iniValues = [];
                    this._targets.forEach(ta => {
                        this._iniValues.push(this._getValues(ta))
                    })
                } 
            }

            protected _resetTargets() {
                if(this._iniValues.length>=this._targets.length) this._targets.forEach((ta, i) => {
                    let kvs = this._iniValues[i];
                    setTargetVals(kvs, ta)
                })
            }

            private _calc(from: number, to: number, t: number, d: number, target: HTMLElement | object, i: number, total: number) {
                let cfg = this._cfg, b, c, n: number;

                if (this._dir == 'forward') {
                    b = from;
                    c = to - from
                } else {
                    b = to;
                    c = from - to
                }

                if (typeof cfg.easing == 'string') {
                    let fn = <EasingFunction>Easings[cfg.easing], args = [t, b, c, d];
                    if (!Types.isFunction(fn)) {
                        let name = cfg.easing.split('(')[0], a = parseEasingParameters(cfg.easing);
                        fn = Easings[name];
                        args.add(a)
                    }
                    n = fn.apply(null, args)
                } else {
                    let fn = cfg.easing.call(null, target, i, total);
                    n = fn(t, b, c, d)
                }
                return n.round(cfg.round)
            }

            private _calcColor(
                el: HTMLElement | object, i: number, total: number,
                key: string,
                type: AnimatedKeyType,
                from: string,
                to: string,
                t: number, d: number) {
                let fromCol = CssTool.convertToRGB(from), toCol = CssTool.convertToRGB(to),
                    newR = this._calc(fromCol.r, toCol.r, t, d, el, i, total),
                    newG = this._calc(fromCol.g, toCol.g, t, d, el, i, total),
                    newB = this._calc(fromCol.b, toCol.b, t, d, el, i, total),
                    newCol = CssTool.rgbString({ r: newR, g: newG, b: newB });
                setTargetVal(newCol, key, type, el)
            }
            private _calcPercent(
                el: HTMLElement | object, i: number, total: number,
                key: string,
                type: AnimatedKeyType,
                from: string,
                to: string,
                t: number, d: number) {
                let newV = this._calc(parseFloat(from), parseFloat(to), t, d, el, i, total);
                setTargetVal(newV + '%', key, type, el)
            }
            private _calcNormal(
                el: HTMLElement | object, i: number, total: number,
                key: string,
                type: AnimatedKeyType,
                from: string | number,
                to: string | number,
                t: number, d: number) {
                setTargetVal(this._calcNormalVal(el, i, total, key, from, to, t, d), key, type, el)
            }
            private _calcNormalVal(
                el: HTMLElement | object, i: number, total: number,
                key: string,
                from: string | number,
                to: string | number,
                t: number, d: number) {
                let toVal = Types.isNumber(to) ? <number>to : CssTool.numberOf(degUnit(key, CssTool.calcValue(<string>to, from)));
                return this._calc(CssTool.numberOf(degUnit(key, from)), toVal, t, d, el, i, total)
            }

            private _updateTargets(t: number) {
                let total = this._targets.length, d = this._cfg.duration;
                this._targets.forEach((ta, i) => {
                    let trans = '';
                    Jsons.forEach(this._cfg.keys, (v, k) => {
                        let oKV = this._iniValues[i].find((v) => {
                            return v.key == k
                        }), newVal: CssValueString | number, oldVal: string | number;

                        if (Types.isArray(v)) {
                            oldVal = v[0];
                            newVal = v[1];
                        } else if (Types.isFunction(v)) {
                            let rst = (<Function>v).call(null, ta, i, total);

                            if (Types.isArray(rst)) {
                                oldVal = rst[0];
                                newVal = rst[1]
                            } else {
                                oldVal = oKV.val;
                                newVal = rst
                            }
                        } else {
                            oldVal = oKV.val;
                            newVal = <string | number>v
                        }

                        if (CssTool.isColor(<string>newVal)) {
                            this._calcColor(ta, i, total, k, oKV.type, <string>oldVal, <string>newVal, t, d)
                        } else if (Types.isString(newVal) && (<string>newVal).endsWith('%')) {
                            this._calcPercent(ta, i, total, k, oKV.type, <string>oldVal, <string>newVal, t, d)
                        } else if (oKV.type == 'transform') {
                            let val = this._calcNormalVal(ta, i, total, k, oldVal, newVal, t, d);
                            v = CssTool.normValue(val, defaultTransformValue(k), getTransformUnit(k));
                            trans += ` ${k}(${v})`;
                        } else this._calcNormal(ta, i, total, k, oKV.type, oldVal, newVal, t, d)
                    })
                    if (trans) (<HTMLElement>ta).style.transform = trans;
                })
            }

            //TODO: 未经测试
            // tick(t: number): void {
            //     this._prepare();
            //     if (!this.isRunning()) this._saveIniValues();
            //     this._timer.tick(t)
            // }

            seek(dt: number) {
                if (this._iniValues.length == 0) {
                    this._targets.forEach(ta => {
                        this._iniValues.push(this._getValues(ta))
                    })
                }
                this._updateTargets(dt)
            }

            protected _setupTimer(){
                super._setupTimer();
                let T = this, c = T._cfg, r = T._timer;
                r.on(<TimerEvents>'looping', (e, loop: number) => {
                    if (loop > 1 && c.direction == 'alternate') T._dir = T._dir == 'backward' ? 'forward' : 'backward';
                    T._bus.fire('looping', [loop])
                });
                r.on(<TimerEvents>'looped', (e, loop: number) => {
                    T._loop = loop;
                    T._bus.fire('looped', [loop])
                });
            }

            private _prepare() {
                let T = this, c = T._cfg;
                if (!T._timer) {
                    T._timer = new AnimTimer((t) => {
                        T._updateTargets(t)
                    }, {
                        delay: c.delay,
                        endDelay: c.endDelay,
                        duration: c.duration,
                        loop: c.loop
                    });
                    T._setupTimer()
                }
            }

            play(): Promise<boolean> {
                let T = this, c = T._cfg;
                return Promises.create<boolean>(function () {
                    if (T.isRunning()) this.resolve(false);
                    T._prepare();
                    T._timer.on(<TimerEvents>'finished', () => {
                        this.resolve(true);
                    });
                    T._saveIniValues();
                    T._timer.start()
                })
            }

        }
    }
}

import TweenAnimInit = JS.an.TweenAnimInit;
import TweenAnim = JS.an.TweenAnim;
import AnimatedValueType = JS.an.AnimatedValueType;