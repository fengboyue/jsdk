//# sourceURL=jsan.js
/**
* JSDK 2.4.0 
* https://github.com/fengboyue/jsdk/
* (c) 2007-2020 Frank.Feng<boyue.feng@foxmail.com>
* MIT license
*/
var JS;
(function (JS) {
    let an;
    (function (an) {
        let AnimState;
        (function (AnimState) {
            AnimState[AnimState["STOPPED"] = 0] = "STOPPED";
            AnimState[AnimState["RUNNING"] = 1] = "RUNNING";
            AnimState[AnimState["PAUSED"] = 2] = "PAUSED";
        })(AnimState = an.AnimState || (an.AnimState = {}));
        class AnimConfig {
            constructor() {
                this.autoReverse = false;
                this.autoReset = false;
                this.duration = 3000;
                this.loop = 1;
                this.delay = 0;
                this.direction = 'forward';
                this.easing = an.Easings.LINEAR;
            }
        }
        an.AnimConfig = AnimConfig;
        class Anim {
            constructor(cfg) {
                this._timer = null;
                this._dir = 'forward';
                this._loop = 0;
                this._init();
                this.config(cfg);
            }
            _init() {
                this.config(new AnimConfig());
            }
            _convertFrame(f) {
                return f;
            }
            config(cfg) {
                if (!cfg)
                    return this._cfg;
                this._cfg = Jsons.union(this._cfg, cfg);
                this.direction(this._cfg.direction);
                return this;
            }
            direction(d) {
                if (!d)
                    return this._dir;
                this._dir = d;
                return this;
            }
            getState() {
                return this._timer ? this._timer.getState() : AnimState.STOPPED;
            }
            getLooped() {
                return this._loop;
            }
            _reset() {
                let T = this;
                T._loop = 0;
                T._dir = T._cfg.direction;
                if (T._timer)
                    T._timer.stop();
            }
            pause() {
                if (this._timer)
                    this._timer.pause();
                return this;
            }
            stop() {
                this._reset();
                return this;
            }
        }
        an.Anim = Anim;
    })(an = JS.an || (JS.an = {}));
})(JS || (JS = {}));
var AnimState = JS.an.AnimState;
var AnimConfig = JS.an.AnimConfig;
var Anim = JS.an.Anim;
var JS;
(function (JS) {
    let an;
    (function (an) {
        class AnimTimer extends Timer {
            constructor(tick, cfg) {
                super(tick, cfg);
                let c = this._cfg;
                c.duration = c.duration || 1;
            }
            _loop(begin) {
                if (this._sta != TimerState.RUNNING)
                    return;
                let p = this._cfg.loop, d = this._cfg.duration, t0 = System.highResTime(), t = t0 - this._ts0;
                if (this._count < p) {
                    this._et = t0 - this._ts;
                    if (begin)
                        this._bus.fire('looping', [this._count + 1]);
                    let lp = false;
                    if (t > d) {
                        this._bus.fire('looped', [++this._count]);
                        this._ts0 = t0;
                        lp = true;
                    }
                    else {
                        this._tick.call(this, t);
                    }
                    this._ts = t0;
                    this._timer = requestAnimationFrame(() => {
                        this._loop(lp);
                    });
                }
                else {
                    this._finish();
                }
            }
            _cycle() {
                this._timer = requestAnimationFrame(() => {
                    this._loop(true);
                });
            }
            _cancelTimer() {
                if (this._timer)
                    cancelAnimationFrame(this._timer);
                this._timer = null;
            }
        }
        an.AnimTimer = AnimTimer;
    })(an = JS.an || (JS.an = {}));
})(JS || (JS = {}));
var AnimTimer = JS.an.AnimTimer;
var JS;
(function (JS) {
    let an;
    (function (an) {
        const PI = Math.PI, pow = Math.pow, sqrt = Math.sqrt, abs = Math.abs, sin = Math.sin, cos = Math.cos, asin = Math.asin;
        class Easings {
        }
        Easings.LINEAR = function (t, b, c, d) {
            return c * t / d + b;
        };
        Easings.QUAD_IN = function (t, b, c, d) {
            return c * (t /= d) * t + b;
        };
        Easings.QUAD_OUT = function (t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        };
        Easings.QUAD_IN_OUT = function (t, b, c, d) {
            if ((t /= d / 2) < 1)
                return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        };
        Easings.CUBIC_IN = function (t, b, c, d) {
            return c * (t /= d) * t * t + b;
        };
        Easings.CUBIC_OUT = function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        };
        Easings.CUBIC_IN_OUT = function (t, b, c, d) {
            if ((t /= d / 2) < 1)
                return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        };
        Easings.QUART_IN = function (t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        };
        Easings.QUART_OUT = function (t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        };
        Easings.QUART_IN_OUT = function (t, b, c, d) {
            if ((t /= d / 2) < 1)
                return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        };
        Easings.QUINT_IN = function (t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        };
        Easings.QUINT_OUT = function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        };
        Easings.QUINT_IN_OUT = function (t, b, c, d) {
            if ((t /= d / 2) < 1)
                return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        };
        Easings.SINE_IN = function (t, b, c, d) {
            return -c * cos(t / d * (PI / 2)) + c + b;
        };
        Easings.SINE_OUT = function (t, b, c, d) {
            return c * sin(t / d * (PI / 2)) + b;
        };
        Easings.SINE_IN_OUT = function (t, b, c, d) {
            return -c / 2 * (cos(PI * t / d) - 1) + b;
        };
        Easings.EXPO_IN = function (t, b, c, d) {
            return (t == 0) ? b : c * pow(2, 10 * (t / d - 1)) + b;
        };
        Easings.EXPO_OUT = function (t, b, c, d) {
            return (t == d) ? b + c : c * (-pow(2, -10 * t / d) + 1) + b;
        };
        Easings.EXPO_IN_OUT = function (t, b, c, d) {
            if (t == 0)
                return b;
            if (t == d)
                return b + c;
            if ((t /= d / 2) < 1)
                return c / 2 * pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-pow(2, -10 * --t) + 2) + b;
        };
        Easings.CIRC_IN = function (t, b, c, d) {
            return -c * (sqrt(1 - (t /= d) * t) - 1) + b;
        };
        Easings.CIRC_OUT = function (t, b, c, d) {
            return c * sqrt(1 - (t = t / d - 1) * t) + b;
        };
        Easings.CIRC_IN_OUT = function (t, b, c, d) {
            if ((t /= d / 2) < 1)
                return -c / 2 * (sqrt(1 - t * t) - 1) + b;
            return c / 2 * (sqrt(1 - (t -= 2) * t) + 1) + b;
        };
        Easings.ELASTIC_IN = function (t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0)
                return b;
            if ((t /= d) == 1)
                return b + c;
            if (!p)
                p = d * .3;
            if (a < abs(c)) {
                a = c;
                var s = p / 4;
            }
            else
                var s = p / (2 * PI) * asin(c / a);
            return -(a * pow(2, 10 * (t -= 1)) * sin((t * d - s) * (2 * PI) / p)) + b;
        };
        Easings.ELASTIC_OUT = function (t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0)
                return b;
            if ((t /= d) == 1)
                return b + c;
            if (!p)
                p = d * .3;
            if (a < abs(c)) {
                a = c;
                var s = p / 4;
            }
            else
                var s = p / (2 * PI) * asin(c / a);
            return a * pow(2, -10 * t) * sin((t * d - s) * (2 * PI) / p) + c + b;
        };
        Easings.ELASTIC_IN_OUT = function (t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0)
                return b;
            if ((t /= d / 2) == 2)
                return b + c;
            if (!p)
                p = d * (.3 * 1.5);
            if (a < abs(c)) {
                a = c;
                var s = p / 4;
            }
            else
                var s = p / (2 * PI) * asin(c / a);
            if (t < 1)
                return -.5 * (a * pow(2, 10 * (t -= 1)) * sin((t * d - s) * (2 * PI) / p)) + b;
            return a * pow(2, -10 * (t -= 1)) * sin((t * d - s) * (2 * PI) / p) * .5 + c + b;
        };
        Easings.BACK_IN = function (t, b, c, d, s) {
            if (s == undefined)
                s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        };
        Easings.BACK_OUT = function (t, b, c, d, s) {
            if (s == undefined)
                s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        };
        Easings.BACK_IN_OUT = function (t, b, c, d, s) {
            if (s == undefined)
                s = 1.70158;
            if ((t /= d / 2) < 1)
                return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        };
        Easings.BOUNCE_IN = function (t, b, c, d) {
            return c - Easings.BOUNCE_OUT(d - t, 0, c, d) + b;
        };
        Easings.BOUNCE_OUT = function (t, b, c, d) {
            const n1 = 2.75, n2 = 7.5625;
            if ((t /= d) < (1 / n1)) {
                return c * (n2 * t * t) + b;
            }
            else if (t < (2 / n1)) {
                return c * (n2 * (t -= (1.5 / n1)) * t + .75) + b;
            }
            else if (t < (2.5 / 2.75)) {
                return c * (n2 * (t -= (2.25 / n1)) * t + .9375) + b;
            }
            else {
                return c * (n2 * (t -= (2.625 / n1)) * t + .984375) + b;
            }
        };
        Easings.BOUNCE_IN_OUT = function (t, b, c, d) {
            if (t < d / 2)
                return Easings.BOUNCE_IN(t * 2, 0, c, d) * .5 + b;
            return Easings.BOUNCE_OUT(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        };
        an.Easings = Easings;
    })(an = JS.an || (JS.an = {}));
})(JS || (JS = {}));
var Easings = JS.an.Easings;
var JS;
(function (JS) {
    let an;
    (function (an) {
        let J = Jsons;
        class ElementAnimConfig extends an.AnimConfig {
        }
        an.ElementAnimConfig = ElementAnimConfig;
        class ElementAnim extends an.Anim {
            constructor(cfg) {
                super(cfg);
            }
            _parseFrames(frames) {
                let T = this;
                J.some(frames, (v, k) => {
                    if (k == 'from' || k == '0%') {
                        T._from = this._convertFrame(v);
                    }
                    else if (k == 'to' || k == '100%') {
                        T._to = this._convertFrame(v);
                    }
                    return T._from != void 0 && T._to != void 0;
                });
            }
            config(cfg) {
                if (!cfg)
                    return this._cfg;
                if (cfg.el)
                    this._el = $1(cfg.el);
                if (cfg.frames)
                    this._parseFrames(cfg.frames);
                return super.config(cfg);
            }
            _num(k) {
                return k ? Number(k.substr(0, k.length - 1)) : 0;
            }
            _newFrame(from, to, t, d, e) {
                if (Types.isNumber(from)) {
                    return this._newVal(t, d, from, to, e, this._frame);
                }
                else {
                    let json = {};
                    J.forEach(from, (v, k) => {
                        json[k] = this._newVal(t, d, from[k], to[k], e, this._frame == void 0 ? null : this._frame[k]);
                    });
                    return json;
                }
            }
            _newVal(t, d, from, to, e, base) {
                let n = e.call(null, t, from, to - from, d);
                if (base == void 0)
                    return n;
                let tx = from >= to ? 'min' : 'max';
                return Math[tx](n, base);
            }
            _calc(d, t, e) {
                let T = this, fwd = T._dir == 'forward';
                if (!Check.isEmpty(T._frames)) {
                    let n = Number(t * 100 / d).round(2), key, delKeys = [];
                    J.forEach(T._frames, (v, k) => {
                        let nk = T._num(k);
                        if (!nk.isNaN() && nk.round(2) <= n) {
                            delKeys.push(k);
                            if (nk > T._num(key))
                                key = k;
                        }
                    });
                    if (key) {
                        T._frame = T._convertFrame(T._frames[key]);
                        delKeys.forEach((v) => { delete T._frames[v]; });
                        return T._frame;
                    }
                }
                let from = fwd ? T._from : T._to, to = fwd ? T._to : T._from;
                return T._newFrame(from, to, t, d, e);
            }
            _reset4loop() {
                let T = this;
                T._frame = null;
                T._frames = J.clone(T._cfg.frames);
                delete T._frames.from;
                delete T._frames.to;
                delete T._frames['0%'];
                delete T._frames['100%'];
            }
            _reset() {
                let T = this;
                T._frame = null;
                T._frames = null;
                super._reset();
            }
            _resetFrame() {
                this._onUpdate(this._dir == 'forward' ? this._from : this._to);
            }
            _resetInitial() { }
            play() {
                let T = this, r = T._timer, c = T._cfg;
                if (!r) {
                    T._reset();
                    r = new an.AnimTimer((et) => {
                        T._onUpdate.call(T, T._calc(c.duration, et, c.easing));
                    }, {
                        delay: c.delay,
                        duration: c.duration,
                        loop: c.loop
                    });
                    if (c.onStarting)
                        r.on('starting', () => {
                            c.onStarting.call(T);
                            T._resetFrame();
                        });
                    r.on('looping', (e, ct) => {
                        T._loop = ct;
                        T._reset4loop();
                        if (ct > 1 && c.autoReverse)
                            T.direction(T._dir == 'backward' ? 'forward' : 'backward');
                        if (!c.autoReverse)
                            T._resetFrame();
                    });
                    r.on('finished', () => {
                        if (c.autoReset)
                            T._resetInitial();
                        if (c.onFinished)
                            c.onFinished.call(T);
                        T._reset();
                    });
                    T._timer = r;
                }
                if (T.getState() == an.AnimState.RUNNING)
                    return T;
                if (T._from == void 0 || T._to == void 0)
                    throw new NotFoundError('Not found "from" or "to"!');
                r.start();
                return T;
            }
            stop() {
                super.stop();
                let T = this, c = T._cfg;
                if (c.autoReset)
                    T._resetInitial();
                return T;
            }
        }
        an.ElementAnim = ElementAnim;
    })(an = JS.an || (JS.an = {}));
})(JS || (JS = {}));
var ElementAnimConfig = JS.an.ElementAnimConfig;
var ElementAnim = JS.an.ElementAnim;
var JS;
(function (JS) {
    let an;
    (function (an) {
        class FadeAnimConfig extends an.ElementAnimConfig {
        }
        an.FadeAnimConfig = FadeAnimConfig;
        class FadeAnim extends an.ElementAnim {
            constructor(cfg) {
                super(cfg);
            }
            config(cfg) {
                if (!cfg)
                    return this._cfg;
                let m = super.config(cfg);
                if (this._el)
                    this._o = this._el.computedStyle().opacity || '1';
                return m;
            }
            _onUpdate(f) {
                this._el.style.opacity = f + '';
            }
            _resetInitial() {
                this._el.style.opacity = this._o;
            }
        }
        an.FadeAnim = FadeAnim;
    })(an = JS.an || (JS.an = {}));
})(JS || (JS = {}));
var FadeAnimConfig = JS.an.FadeAnimConfig;
var FadeAnim = JS.an.FadeAnim;
var JS;
(function (JS) {
    let an;
    (function (an) {
        let J = Jsons;
        class GradientAnimConfig extends an.ElementAnimConfig {
        }
        an.GradientAnimConfig = GradientAnimConfig;
        class GradientAnim extends an.ElementAnim {
            constructor(cfg) {
                super(cfg);
            }
            config(cfg) {
                if (!cfg)
                    return this._cfg;
                let m = super.config(cfg);
                if (this._el) {
                    let s = this._el.computedStyle();
                    this._cls = {
                        color: s.color,
                        backgroundColor: s.backgroundColor,
                        borderColor: s.borderColor,
                        borderTopColor: s.borderTopColor,
                        borderRightColor: s.borderRightColor,
                        borderBottomColor: s.borderBottomColor,
                        borderLeftColor: s.borderLeftColor
                    };
                }
                return m;
            }
            _newColor(t, d, from, to, k, e, base) {
                return this._newVal(t, d, from[k], to[k], e, base == null ? null : base[k]);
            }
            _convertFrame(f) {
                let json = {};
                J.forEach(f, (v, k) => {
                    json[k] = Colors.hex2rgba(v);
                });
                return json;
            }
            _newFrame(from, to, t, d, e) {
                let json = {};
                J.forEach(from, (v, k) => {
                    json[k] = {};
                    J.forEach(from[k], (vv, kk) => {
                        json[k][kk] = this._newColor(t, d, from[k], to[k], kk, e, this._frame == void 0 ? null : this._frame[k]);
                    });
                });
                return json;
            }
            _onUpdate(j) {
                let el = this._el;
                J.forEach(j, (v, k) => {
                    el.style[k] = Colors.rgba2css(v);
                });
            }
            _resetInitial() {
                let el = this._el, c = this._cls;
                J.forEach(c, (v, k) => {
                    el.style[k] = v;
                });
            }
        }
        an.GradientAnim = GradientAnim;
    })(an = JS.an || (JS.an = {}));
})(JS || (JS = {}));
var GradientAnimConfig = JS.an.GradientAnimConfig;
var GradientAnim = JS.an.GradientAnim;
var JS;
(function (JS) {
    let an;
    (function (an) {
        class MoveAnimConfig extends an.ElementAnimConfig {
        }
        an.MoveAnimConfig = MoveAnimConfig;
        class MoveAnim extends an.ElementAnim {
            constructor(cfg) {
                super(cfg);
            }
            config(cfg) {
                if (!cfg)
                    return this._cfg;
                let m = super.config(cfg);
                if (this._el) {
                    let s = this._el.computedStyle();
                    this._xy = {
                        x: Lengths.toNumber(s.left),
                        y: Lengths.toNumber(s.top)
                    };
                }
                return m;
            }
            _onUpdate(f) {
                let el = this._el;
                if (f.x != void 0)
                    el.style.left = f.x + 'px';
                if (f.y != void 0)
                    el.style.top = f.y + 'px';
            }
            _resetInitial() {
                let el = this._el, xy = this._xy;
                el.style.left = xy.x + 'px';
                el.style.top = xy.y + 'px';
            }
        }
        an.MoveAnim = MoveAnim;
    })(an = JS.an || (JS.an = {}));
})(JS || (JS = {}));
var MoveAnimConfig = JS.an.MoveAnimConfig;
var MoveAnim = JS.an.MoveAnim;
var JS;
(function (JS) {
    let an;
    (function (an) {
        class ParallelAnimConfig extends an.AnimConfig {
        }
        an.ParallelAnimConfig = ParallelAnimConfig;
        let E = Check.isEmpty;
        class ParallelAnim extends an.Anim {
            constructor(cfg) {
                super(cfg);
                this._sta = an.AnimState.STOPPED;
            }
            getState() {
                return this._sta;
            }
            config(cfg) {
                let T = this;
                if (!cfg)
                    return T._cfg;
                super.config(cfg);
                let c = T._cfg, as = c.anims;
                if (!E(as)) {
                    T._plans = [];
                    as.forEach(a => {
                        a.config(Jsons.union(c, a.config()));
                        T._plans.push(Promises.createPlan(function () {
                            a.config({
                                onFinished: () => { this.resolve(); }
                            });
                            a.play();
                        }));
                    });
                }
                return T;
            }
            play() {
                let T = this, c = T._cfg;
                if (E(c.anims) || T.getState() == an.AnimState.RUNNING)
                    return T;
                T._sta = an.AnimState.RUNNING;
                Promises.all(T._plans).always(() => {
                    if (c.onFinished)
                        c.onFinished.call(T);
                });
                return T;
            }
            pause() {
                let T = this, c = T._cfg;
                if (T._sta != an.AnimState.RUNNING)
                    return T;
                T._sta = an.AnimState.PAUSED;
                if (!E(c.anims)) {
                    c.anims.forEach(a => {
                        a.pause();
                    });
                }
                return T;
            }
            stop() {
                let T = this, c = T._cfg;
                T._sta = an.AnimState.STOPPED;
                if (!E(c.anims)) {
                    c.anims.forEach(a => {
                        a.stop();
                    });
                }
                return T;
            }
        }
        an.ParallelAnim = ParallelAnim;
    })(an = JS.an || (JS.an = {}));
})(JS || (JS = {}));
var ParallelAnimConfig = JS.an.ParallelAnimConfig;
var ParallelAnim = JS.an.ParallelAnim;
var JS;
(function (JS) {
    let an;
    (function (an) {
        class RotateAnimConfig extends an.ElementAnimConfig {
        }
        an.RotateAnimConfig = RotateAnimConfig;
        class RotateAnim extends an.ElementAnim {
            constructor(cfg) {
                super(cfg);
            }
            _newVal(t, d, from, to, e, base) {
                let v = super._newVal(t, d, from, to, e, base);
                return v < 0 ? 0 : (v > 360 ? 360 : v);
            }
            _onUpdate(v) {
                let el = this._el;
                if (!Types.isNumber(v)) {
                    let x = v.x, y = v.y, z = v.z;
                    if (x != void 0)
                        el.style.transform = ` rotateX(${x}deg)`;
                    if (y != void 0)
                        el.style.transform += ` rotateY(${y}deg)`;
                    if (z != void 0)
                        el.style.transform += ` rotateZ(${z}deg)`;
                }
                else {
                    el.style.transform = `rotate(${v}deg)`;
                }
            }
            _resetInitial() {
                this._el.style.transform = `rotate(0deg)`;
            }
        }
        an.RotateAnim = RotateAnim;
    })(an = JS.an || (JS.an = {}));
})(JS || (JS = {}));
var RotateAnimConfig = JS.an.RotateAnimConfig;
var RotateAnim = JS.an.RotateAnim;
var JS;
(function (JS) {
    let an;
    (function (an) {
        class ScaleAnimConfig extends an.ElementAnimConfig {
        }
        an.ScaleAnimConfig = ScaleAnimConfig;
        class ScaleAnim extends an.ElementAnim {
            constructor(cfg) {
                super(cfg);
            }
            _resetInitial() {
                this._el.style.transform = `scaleX(1) scaleY(1) scaleZ(1)`;
            }
            _onUpdate(v) {
                let x, y, z;
                if (!Types.isNumber(v)) {
                    x = v.x;
                    y = v.y;
                    z = v.z;
                }
                else {
                    x = v;
                    y = y;
                }
                this._el.style.transform = `scaleX(${x == void 0 ? 1 : x}) scaleY(${y == void 0 ? 1 : y}) scaleZ(${z == void 0 ? 1 : z})`;
            }
        }
        an.ScaleAnim = ScaleAnim;
    })(an = JS.an || (JS.an = {}));
})(JS || (JS = {}));
var ScaleAnimConfig = JS.an.ScaleAnimConfig;
var ScaleAnim = JS.an.ScaleAnim;
var JS;
(function (JS) {
    let an;
    (function (an) {
        class SequentialAnimConfig extends an.AnimConfig {
        }
        an.SequentialAnimConfig = SequentialAnimConfig;
        let E = Check.isEmpty;
        class SequentialAnim extends an.Anim {
            constructor(cfg) {
                super(cfg);
                this._i = 0;
                this._sta = an.AnimState.STOPPED;
            }
            config(cfg) {
                if (!cfg)
                    return this._cfg;
                super.config(cfg);
                let c = this._cfg, as = c.anims;
                if (!E(as)) {
                    as.forEach((a, i) => {
                        a.config(Jsons.union(c, a.config()));
                        if (i < as.length - 1) {
                            a.config({
                                onFinished: () => {
                                    as[i + 1].play();
                                }
                            });
                        }
                        else {
                            a.config({
                                onFinished: () => {
                                    if (c.onFinished)
                                        c.onFinished.call(this);
                                }
                            });
                        }
                        a.config({
                            onStarting: () => { this._i = i; }
                        });
                    });
                }
                return this;
            }
            play() {
                let T = this, c = T._cfg;
                if (E(c.anims) || T.getState() == an.AnimState.RUNNING)
                    return T;
                c.anims[T._i].play();
                return T;
            }
            pause() {
                let T = this, c = T._cfg;
                if (T._sta != an.AnimState.RUNNING)
                    return T;
                T._sta = an.AnimState.PAUSED;
                if (!E(c.anims))
                    c.anims[T._i].pause();
                return T;
            }
            stop() {
                let T = this, c = T._cfg;
                T._sta = an.AnimState.STOPPED;
                if (!E(c.anims))
                    c.anims[T._i].stop();
                T._i = 0;
                return T;
            }
        }
        an.SequentialAnim = SequentialAnim;
    })(an = JS.an || (JS.an = {}));
})(JS || (JS = {}));
var SequentialAnimConfig = JS.an.SequentialAnimConfig;
var SequentialAnim = JS.an.SequentialAnim;
var JS;
(function (JS) {
    let an;
    (function (an) {
        class SkewAnimConfig extends an.ElementAnimConfig {
            constructor() {
                super(...arguments);
                this.firstMode = 'both';
            }
        }
        an.SkewAnimConfig = SkewAnimConfig;
        class SkewAnim extends an.ElementAnim {
            constructor(cfg) {
                super(cfg);
            }
            _init() {
                this.config(new SkewAnimConfig());
            }
            _resetInitial() {
                this._el.style.transform = `skew(0deg,0deg)`;
            }
            _onUpdate(f) {
                let m = this._cfg.firstMode, el = this._el;
                if (m == 'both') {
                    el.style.transform = `skew(${f.aX || 0}deg,${f.aY || 0}deg)`;
                }
                else {
                    let sx = `skewX(${f.aX || 0}deg)`, sy = `skewY(${f.aY || 0}deg)`;
                    el.style.transform = m == 'x' ? `${sx} ${sy}` : `${sy} ${sx}`;
                }
            }
        }
        an.SkewAnim = SkewAnim;
    })(an = JS.an || (JS.an = {}));
})(JS || (JS = {}));
var SkewAnimConfig = JS.an.SkewAnimConfig;
var SkewAnim = JS.an.SkewAnim;
var JS;
(function (JS) {
    let an;
    (function (an) {
        class TranslateAnimConfig extends an.ElementAnimConfig {
        }
        an.TranslateAnimConfig = TranslateAnimConfig;
        class TranslateAnim extends an.ElementAnim {
            constructor(cfg) {
                super(cfg);
            }
            _resetInitial() {
                this._el.style.transform = `translateX(0px) translateY(0px) translateZ(0px)`;
            }
            _onUpdate(f) {
                this._el.style.transform = `translateX(${f.oX || 0}px) translateY(${f.oY || 0}px) translateZ(${f.oZ || 0}px)`;
            }
        }
        an.TranslateAnim = TranslateAnim;
    })(an = JS.an || (JS.an = {}));
})(JS || (JS = {}));
var TranslateAnimConfig = JS.an.TranslateAnimConfig;
var TranslateAnim = JS.an.TranslateAnim;