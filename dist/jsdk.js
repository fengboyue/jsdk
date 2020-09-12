//# sourceURL=../dist/jsdk.js
//JSDK 2.7.0 MIT
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
        class AnimInit {
            constructor() {
                this.duration = 1000;
                this.delay = 0;
                this.endDelay = 0;
                this.autoreset = false;
                this.direction = 'forward';
                this.loop = 1;
            }
        }
        an.AnimInit = AnimInit;
        class Anim {
            constructor(cfg) {
                this._timer = null;
                this._loop = 0;
                this._targets = [];
                this._bus = new EventBus(this);
                this._cfg = Jsons.union(this._cfg, cfg);
                this.targets(this._cfg.targets);
                this.direction(this._cfg.direction == 'backward' ? 'backward' : 'forward');
                if (this._cfg.on)
                    Jsons.forEach(this._cfg.on, (v, k) => {
                        this.on(k, v);
                    });
            }
            config() {
                return Jsons.clone(this._cfg);
            }
            on(ev, fn) {
                this._bus.on(ev, fn);
                return this;
            }
            off(ev) {
                this._bus.off(ev);
                return this;
            }
            _tars(t) {
                if (Types.isArrayLike(t)) {
                    if (t instanceof NodeList)
                        return Arrays.newArray(t);
                    let as = [];
                    t.forEach((a) => {
                        typeof a == 'string' ? as.add(Arrays.newArray($L(a))) : as.add(a);
                    });
                    return as;
                }
                else if (typeof t == 'string') {
                    return Arrays.newArray($L(t));
                }
                else if (t instanceof HTMLElement) {
                    return [t];
                }
                return t instanceof Object ? [t] : [];
            }
            targets(t) {
                let els = this._tars(t);
                els.forEach(el => {
                    this._targets.add(el);
                });
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
            isRunning() {
                return this.getState() == AnimState.RUNNING;
            }
            getLooped() {
                return this._loop;
            }
            _reset() {
                let T = this;
                T._loop = 0;
                T._dir = T._cfg.direction == 'backward' ? 'backward' : 'forward';
            }
            _resetTargets() { }
            _setupTimer() {
                let T = this, r = T._timer, c = T._cfg;
                r.on('starting', () => {
                    T._reset();
                    T._bus.fire('starting');
                });
                r.on('pausing', () => {
                    T._bus.fire('pausing');
                });
                r.on('paused', () => {
                    T._bus.fire('paused');
                });
                r.on('updating', (e, t, d, l) => {
                    T._bus.fire('updating', [t, d, l]);
                });
                r.on('updated', (e, t, d, l) => {
                    T._bus.fire('updated', [t, d, l]);
                });
                r.on('finished', () => {
                    T._bus.fire('finished');
                    if (c.autoreset)
                        T._resetTargets();
                });
            }
            pause() {
                if (this._timer)
                    this._timer.pause();
                return this;
            }
            stop() {
                let T = this;
                if (T._timer)
                    T._timer.stop();
                T._reset();
                return T;
            }
            replay() {
                this.stop();
                this.play();
            }
        }
        an.Anim = Anim;
    })(an = JS.an || (JS.an = {}));
})(JS || (JS = {}));
var AnimState = JS.an.AnimState;
var AnimInit = JS.an.AnimInit;
var Anim = JS.an.Anim;
var JS;
(function (JS) {
    let an;
    (function (an) {
        class AnimTimer extends Timer {
            constructor(tick, cfg) {
                super(tick, cfg);
                this._loopEnd = false;
            }
            _runTask(t) {
                let T = this, d = T._cfg.duration;
                T._bus.fire('updating', [t, d, T._count + 1]);
                T._task(t);
                T._bus.fire('updated', [t, d, T._count + 1]);
            }
            _loopTick(t) {
                if (!this.isRunning())
                    return;
                var T = this, c = T._cfg, p = c.loop;
                if (T._count < p) {
                    var d = c.duration, delay = T._count == 0 ? 0 : (c.delay || 0), endDelay = c.endDelay || 0, et = t - T._ts;
                    T._et = et;
                    if (et >= delay && et < (d + delay)) {
                        if (T._loopEnd) {
                            T._loopEnd = false;
                            T._bus.fire('looping', [T._count + 1]);
                        }
                        T._runTask(et - delay);
                    }
                    else if (et >= (d + delay)) {
                        if (!T._loopEnd) {
                            T._runTask(d);
                            T._loopEnd = true;
                        }
                        if (et >= (d + delay + endDelay)) {
                            ++T._count;
                            T._ts = t;
                            T._bus.fire('looped', [T._count]);
                        }
                    }
                }
                else {
                    T._finish();
                }
            }
            _cancelTimer() {
                if (this._timer)
                    cancelAnimationFrame(this._timer);
                this._timer = null;
            }
            pause() {
                this._cancelTimer();
                super.pause();
                return this;
            }
            tick(ts) {
                let T = this;
                if (this._et == 0) {
                    this._ts0 = ts;
                    this._ts = ts;
                    this._count = 0;
                    this._pt = 0;
                    T._bus.fire('starting');
                    this._loopEnd = true;
                    T._state(TimerState.RUNNING);
                }
                if (T.getState() == TimerState.PAUSED) {
                    let dt = ts - T._pt;
                    T._ts0 += dt;
                    T._ts += dt;
                    T._pt = 0;
                    T._state(TimerState.RUNNING);
                }
                if (this.isRunning())
                    this._loopTick(System.highResTime());
            }
            _loop(t) {
                this.tick(t);
                if (this.isRunning())
                    this._timer = requestAnimationFrame(function (ts) {
                        this._loop(ts);
                    }.bind(this));
            }
            start() {
                if (this.isRunning())
                    return;
                this._timer = requestAnimationFrame((t) => {
                    this._loop(t);
                });
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
        let minMax = (n, min, max) => {
            return Math.min(Math.max(n, min), max);
        };
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
        Easings.STEPS = function (t, b, c, d, steps) {
            steps = steps == void 0 ? 10 : (steps < 1 ? 1 : steps);
            let m = Math.ceil((minMax(t / d, 0.000001, 1)) * steps) * (1 / steps);
            return b + c * m;
        };
        an.Easings = Easings;
    })(an = JS.an || (JS.an = {}));
})(JS || (JS = {}));
var Easings = JS.an.Easings;
var JS;
(function (JS) {
    let util;
    (function (util) {
        class Images {
            static parseFrames(frames) {
                let frs = [], items = frames.items, isA = util.Types.isArray(items), len = isA ? items.length : items.total;
                for (let i = 0; i < len; i++) {
                    let x, y;
                    if (isA) {
                        x = items[0];
                        y = items[1];
                    }
                    else {
                        let offs = items, axis = offs.axis, sign = axis.startsWith('-') ? -1 : 1;
                        x = axis.endsWith('x') ? (offs.ox + sign * i * (frames.w + (offs.split || 0))) : offs.ox;
                        y = axis.endsWith('y') ? (offs.oy + sign * i * (frames.h + (offs.split || 0))) : offs.oy;
                    }
                    frs.push({
                        src: frames.src,
                        w: frames.w,
                        h: frames.h,
                        x: x,
                        y: y
                    });
                }
                return frs;
            }
        }
        util.Images = Images;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Images = JS.util.Images;
var JS;
(function (JS) {
    let an;
    (function (an) {
        class FrameAnimInit extends an.AnimInit {
        }
        an.FrameAnimInit = FrameAnimInit;
        class FrameAnim extends an.Anim {
            constructor(cfg) {
                super(Jsons.union(new FrameAnimInit(), cfg));
                this._frames = [];
                this._fi = -1;
                this._lt = 0;
                this._frames = Images.parseFrames(this._cfg.frames);
            }
            _updateImage(el, fr) {
                let json = {
                    backgroundImage: `url("${fr.src}")`,
                    backgroundPosition: `-${fr.x}px -${fr.y}px`,
                    width: fr.w != void 0 ? (fr.w + 'px') : null,
                    height: fr.h != void 0 ? (fr.h + 'px') : null
                };
                el.css(json);
            }
            _reset() {
                super._reset();
                this._fi = -1;
            }
            _resetTargets() {
                let fn = this._cfg.onUpdateImage || this._updateImage, i = this._cfg.direction == 'backward' ? this._frames.length - 1 : 0;
                this._targets.forEach(ta => {
                    fn(ta, this._frames[i]);
                });
            }
            _updateFrame(dt) {
                let m = this, c = m._cfg, size = m._frames.length, fn = c.onUpdateImage || m._updateImage;
                this._targets.forEach(ta => {
                    fn(ta, m._frames[m._fi]);
                    m._dir == 'forward' ? m._fi++ : m._fi--;
                });
            }
            _setupTimer() {
                super._setupTimer();
                let m = this, c = m._cfg, r = m._timer, size = m._frames.length;
                r.on('looping', (e, loop) => {
                    if ((loop - 1) % size == 0) {
                        if (loop > 1 && c.direction == 'alternate')
                            m._dir = m._dir == 'backward' ? 'forward' : 'backward';
                        m._fi = m._dir == 'backward' ? size - 1 : 0;
                        m._lt = e.timeStamp;
                        m._bus.fire('looping', [(loop - 1) / size + 1]);
                    }
                    m._bus.fire('updating', [e.timeStamp - m._lt, c.duration]);
                });
                r.on('looped', (e, loop) => {
                    m._bus.fire('updated', [e.timeStamp - m._lt, c.duration]);
                    if (loop % size == 0) {
                        m._loop = loop / size;
                        m._bus.fire('looped', [m._loop]);
                    }
                });
            }
            play() {
                let m = this, c = m._cfg, l = c.loop, maxLoop = l == false || l < 0 ? 0 : (l === true ? Infinity : l), framesSize = m._frames.length;
                return Promises.create(function () {
                    if (m.isRunning() || m._frames.length == 0)
                        this.resolve(false);
                    m._loop = 0;
                    if (!m._timer) {
                        m._timer = new Timer((t) => {
                            m._updateFrame(t);
                        }, {
                            intervalMode: 'BF',
                            delay: c.delay || 0,
                            loop: maxLoop * framesSize,
                            interval: (c.duration + c.endDelay) / framesSize
                        });
                        m._setupTimer();
                    }
                    m._timer.on('finished', () => {
                        this.resolve(true);
                    });
                    m._timer.start();
                });
            }
        }
        an.FrameAnim = FrameAnim;
    })(an = JS.an || (JS.an = {}));
})(JS || (JS = {}));
var FrameAnimInit = JS.an.FrameAnimInit;
var FrameAnim = JS.an.FrameAnim;
var JS;
(function (JS) {
    let an;
    (function (an_1) {
        let J = Jsons, first = (a) => {
            return a.length == 0 ? null : a[0];
        }, last = (a) => {
            return a.length == 0 ? null : a[a.length - 1];
        };
        class TimelineInit {
            constructor() {
                this.duration = 1000;
                this.delay = 0;
                this.endDelay = 0;
                this.autoreset = false;
            }
        }
        an_1.TimelineInit = TimelineInit;
        class Timeline {
            constructor(cfg) {
                this._seqAnims = [];
                this._synAnims = [];
                this._bus = new EventBus(this);
                this._isRunning = false;
                this._seqFinished = false;
                this._synFinished = false;
                this._cfg = J.union(new TimelineInit(), cfg);
                this._targets = [];
                let els = this._tars(this._cfg.targets);
                els.forEach(el => {
                    this._targets.add(el);
                });
            }
            on(ev, fn) {
                this._bus.on(ev, fn);
                return this;
            }
            off(ev) {
                this._bus.off(ev);
                return this;
            }
            _tars(t) {
                if (Types.isArrayLike(t)) {
                    if (t instanceof NodeList)
                        return Arrays.newArray(t);
                    let as = [];
                    t.forEach((a) => {
                        typeof a == 'string' ? as.add(Arrays.newArray($L(a))) : as.add(a);
                    });
                    return as;
                }
                else if (typeof t == 'string') {
                    return Arrays.newArray($L(t));
                }
                else if (t instanceof HTMLElement) {
                    return [t];
                }
                return t instanceof Object ? [t] : [];
            }
            add(a, start) {
                let c = this._cfg;
                a = J.union({
                    targets: this._targets,
                    duration: c.duration,
                    endDelay: c.endDelay,
                    autoreset: c.autoreset
                }, a, {
                    delay: (start || 0) + (a.delay || c.delay || 0)
                });
                let anim = (a.type == 'tween' ? new an_1.TweenAnim(a) : new an_1.FrameAnim(a));
                if (this._synAnims.length == 0 || start != void 0) {
                    this._synAnims.add(anim);
                }
                else {
                    let anims = this._seqAnims, lastAnim;
                    if (anims.length < 1) {
                        lastAnim = first(this._synAnims);
                    }
                    else {
                        lastAnim = anims[anims.length - 1];
                    }
                    lastAnim.on('finished', () => {
                        anim.play();
                    });
                    this._seqAnims.add(anim);
                }
                return this;
            }
            _resolve(ctx, f) {
                if (f)
                    this._isRunning = false;
                ctx.resolve(f);
            }
            play() {
                let m = this;
                return Promises.create(function () {
                    if (m._isRunning)
                        m._resolve(this, false);
                    m._isRunning = true;
                    m._seqFinished = false;
                    m._synFinished = false;
                    m._bus.fire('starting');
                    if (m._synAnims.length == 0) {
                        m._bus.fire('finished');
                        m._resolve(this, false);
                    }
                    let lastAnim = last(m._seqAnims);
                    if (lastAnim)
                        lastAnim.on('finished', () => {
                            m._seqFinished = true;
                            if (m._synFinished) {
                                m._bus.fire('finished');
                                m._resolve(this, true);
                            }
                        });
                    let plans = [];
                    m._synAnims.forEach(an => {
                        plans.push(Promises.createPlan(function () {
                            an.play().then(() => {
                                this.resolve();
                            });
                        }));
                    });
                    Promises.all(plans).then(() => {
                        m._synFinished = true;
                        if (m._seqFinished) {
                            m._bus.fire('finished');
                            m._resolve(this, true);
                        }
                    });
                });
            }
        }
        an_1.Timeline = Timeline;
    })(an = JS.an || (JS.an = {}));
})(JS || (JS = {}));
var TimelineInit = JS.an.TimelineInit;
var Timeline = JS.an.Timeline;
var JS;
(function (JS) {
    let an;
    (function (an) {
        let J = Jsons;
        class TweenAnimInit extends an.AnimInit {
            constructor() {
                super(...arguments);
                this.easing = 'LINEAR';
                this.round = 3;
            }
        }
        an.TweenAnimInit = TweenAnimInit;
        let ValidTransforms = ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY', 'perspective', 'matrix', 'matrix3d'], has = (s, w) => {
            return s.indexOf(w) > -1;
        }, isDom = (a) => {
            return a.nodeType || a instanceof SVGElement;
        }, parseEasingParameters = (string) => {
            var match = /\(([^)]+)\)/.exec(string);
            return match ? match[1].split(',').map(function (p) { return parseFloat(p); }) : [];
        }, getAnimationType = (el, key) => {
            if (isDom(el) && el.hasAttribute(key))
                return 'attribute';
            if (isDom(el) && ValidTransforms.indexOf(key) > -1)
                return 'transform';
            if (isDom(el) && key !== 'transform' && key in el.style)
                return 'css';
            return 'property';
        }, getTargetVal = (key, el) => {
            let type = getAnimationType(el, key), n;
            if (type == 'property') {
                n = el[key];
            }
            else if (type == 'attribute') {
                n = el.attr(key);
            }
            else if (type == 'css') {
                n = el.css(key);
            }
            else if (type == 'transform' && ValidTransforms.indexOf(key) > -1) {
                n = getTransformValue(el, key);
            }
            return {
                key: key,
                type: type,
                val: n || '0'
            };
        }, parseTransform = (el) => {
            if (!isDom(el)) {
                return;
            }
            let str = el.style.transform || '', reg = /(\w+)\(([^)]*)\)/g, transforms = new Map(), m;
            while (m = reg.exec(str)) {
                transforms.set(m[1], m[2]);
            }
            return transforms;
        }, getTransformUnit = (key) => {
            if (has(key, 'translate') || key === 'perspective')
                return 'px';
            if (has(key, 'rotate') || has(key, 'skew'))
                return 'deg';
            return null;
        }, getTransformValue = (el, key) => {
            return parseTransform(el).get(key) || defaultTransformValue(key);
        }, defaultTransformValue = (key) => {
            return has(key, 'scale') ? '1' : 0 + getTransformUnit(key);
        }, setTargetVals = (kvs, el) => {
            let trans = [];
            kvs.forEach((kv, i) => {
                let type = kv.type, v = `${kv.val}`;
                if (type == 'property') {
                    el[kv.key] = kv.val;
                }
                else if (type == 'attribute') {
                    el.attr(kv.key, v);
                }
                else if (type == 'css') {
                    el.css(kv.key, v);
                }
                else if (type == 'transform') {
                    trans.add(i);
                }
            });
            let s = '';
            trans.forEach(j => {
                let kv = kvs[j];
                s += `${kv.key}(${kv.val})`;
            });
            if (s)
                el.style.transform = s;
        }, degUnit = (key, v) => {
            if (typeof v !== 'string')
                return v + '';
            if (key.startsWith('rotate') || key.startsWith('skew')) {
                if (v.endsWith('rad'))
                    return (parseFloat(v) * 180 / Math.PI) + 'deg';
                if (v.endsWith('turn'))
                    return (parseFloat(v) * 360) + 'deg';
                return v;
            }
            else
                return v;
        }, setTargetVal = (val, key, type, el) => {
            if (type == 'property') {
                el[key] = val;
            }
            else if (type == 'attribute') {
                el.attr(key, val == void 0 ? val : (val + ''));
            }
            else if (type == 'css') {
                el.css(key, val);
            }
        };
        class TweenAnim extends an.Anim {
            constructor(cfg) {
                super(Jsons.union(new TweenAnimInit(), cfg));
                this._iniValues = [];
            }
            _getValues(ta) {
                let a = [];
                Jsons.forEach(this._cfg.keys, (v, k) => {
                    a.add(getTargetVal(k, ta));
                });
                return a;
            }
            _saveIniValues() {
                if (this._iniValues.length == 0) {
                    this._iniValues = [];
                    this._targets.forEach(ta => {
                        this._iniValues.push(this._getValues(ta));
                    });
                }
            }
            _resetTargets() {
                if (this._iniValues.length >= this._targets.length)
                    this._targets.forEach((ta, i) => {
                        let kvs = this._iniValues[i];
                        setTargetVals(kvs, ta);
                    });
            }
            _calc(from, to, t, d, target, i, total) {
                let cfg = this._cfg, b, c, n;
                if (this._dir == 'forward') {
                    b = from;
                    c = to - from;
                }
                else {
                    b = to;
                    c = from - to;
                }
                if (typeof cfg.easing == 'string') {
                    let fn = an.Easings[cfg.easing], args = [t, b, c, d];
                    if (!Types.isFunction(fn)) {
                        let name = cfg.easing.split('(')[0], a = parseEasingParameters(cfg.easing);
                        fn = an.Easings[name];
                        args.add(a);
                    }
                    n = fn.apply(null, args);
                }
                else {
                    let fn = cfg.easing.call(null, target, i, total);
                    n = fn(t, b, c, d);
                }
                return n.round(cfg.round);
            }
            _calcColor(el, i, total, key, type, from, to, t, d) {
                let fromCol = CssTool.convertToRGB(from), toCol = CssTool.convertToRGB(to), newR = this._calc(fromCol.r, toCol.r, t, d, el, i, total), newG = this._calc(fromCol.g, toCol.g, t, d, el, i, total), newB = this._calc(fromCol.b, toCol.b, t, d, el, i, total), newCol = CssTool.rgbString({ r: newR, g: newG, b: newB });
                setTargetVal(newCol, key, type, el);
            }
            _calcPercent(el, i, total, key, type, from, to, t, d) {
                let newV = this._calc(parseFloat(from), parseFloat(to), t, d, el, i, total);
                setTargetVal(newV + '%', key, type, el);
            }
            _calcNormal(el, i, total, key, type, from, to, t, d) {
                setTargetVal(this._calcNormalVal(el, i, total, key, from, to, t, d), key, type, el);
            }
            _calcNormalVal(el, i, total, key, from, to, t, d) {
                let toVal = Types.isNumber(to) ? to : CssTool.numberOf(degUnit(key, CssTool.calcValue(to, from)));
                return this._calc(CssTool.numberOf(degUnit(key, from)), toVal, t, d, el, i, total);
            }
            _updateTargets(t) {
                let total = this._targets.length, d = this._cfg.duration;
                this._targets.forEach((ta, i) => {
                    let trans = '';
                    Jsons.forEach(this._cfg.keys, (v, k) => {
                        let oKV = this._iniValues[i].find((v) => {
                            return v.key == k;
                        }), newVal, oldVal;
                        if (Types.isArray(v)) {
                            oldVal = v[0];
                            newVal = v[1];
                        }
                        else if (Types.isFunction(v)) {
                            let rst = v.call(null, ta, i, total);
                            if (Types.isArray(rst)) {
                                oldVal = rst[0];
                                newVal = rst[1];
                            }
                            else {
                                oldVal = oKV.val;
                                newVal = rst;
                            }
                        }
                        else {
                            oldVal = oKV.val;
                            newVal = v;
                        }
                        if (CssTool.isColor(newVal)) {
                            this._calcColor(ta, i, total, k, oKV.type, oldVal, newVal, t, d);
                        }
                        else if (Types.isString(newVal) && newVal.endsWith('%')) {
                            this._calcPercent(ta, i, total, k, oKV.type, oldVal, newVal, t, d);
                        }
                        else if (oKV.type == 'transform') {
                            let val = this._calcNormalVal(ta, i, total, k, oldVal, newVal, t, d);
                            v = CssTool.normValue(val, defaultTransformValue(k), getTransformUnit(k));
                            trans += ` ${k}(${v})`;
                        }
                        else
                            this._calcNormal(ta, i, total, k, oKV.type, oldVal, newVal, t, d);
                    });
                    if (trans)
                        ta.style.transform = trans;
                });
            }
            seek(dt) {
                if (this._iniValues.length == 0) {
                    this._targets.forEach(ta => {
                        this._iniValues.push(this._getValues(ta));
                    });
                }
                this._updateTargets(dt);
            }
            _setupTimer() {
                super._setupTimer();
                let T = this, c = T._cfg, r = T._timer;
                r.on('looping', (e, loop) => {
                    if (loop > 1 && c.direction == 'alternate')
                        T._dir = T._dir == 'backward' ? 'forward' : 'backward';
                    T._bus.fire('looping', [loop]);
                });
                r.on('looped', (e, loop) => {
                    T._loop = loop;
                    T._bus.fire('looped', [loop]);
                });
            }
            _prepare() {
                let T = this, c = T._cfg;
                if (!T._timer) {
                    T._timer = new an.AnimTimer((t) => {
                        T._updateTargets(t);
                    }, {
                        delay: c.delay,
                        endDelay: c.endDelay,
                        duration: c.duration,
                        loop: c.loop
                    });
                    T._setupTimer();
                }
            }
            play() {
                let T = this, c = T._cfg;
                return Promises.create(function () {
                    if (T.isRunning())
                        this.resolve(false);
                    T._prepare();
                    T._timer.on('finished', () => {
                        this.resolve(true);
                    });
                    T._saveIniValues();
                    T._timer.start();
                });
            }
        }
        an.TweenAnim = TweenAnim;
    })(an = JS.an || (JS.an = {}));
})(JS || (JS = {}));
var TweenAnimInit = JS.an.TweenAnimInit;
var TweenAnim = JS.an.TweenAnim;
Promise.prototype.always = function (fn) {
    return this.then((t1) => {
        return fn.call(this, t1, true);
    }).catch((t2) => {
        return fn.call(this, t2, false);
    });
};
var JS;
(function (JS) {
    let core;
    (function (core) {
        let AS = Array.prototype.slice, newArray = (a, from) => {
            return a == void 0 ? [] : AS.apply(a, [from == void 0 ? 0 : from]);
        };
        class Promises {
            static create(fn, ...args) {
                return new Promise((resolve, reject) => {
                    fn.apply({
                        resolve: resolve,
                        reject: reject
                    }, newArray(arguments, 1));
                });
            }
            static createPlan(fn) {
                return function () {
                    return Promises.create.apply(Promises, [fn].concat(Array.prototype.slice.apply(arguments)));
                };
            }
            static newPlan(p, args, ctx) {
                return () => { return p.apply(ctx || p, args); };
            }
            static resolvePlan(v) {
                return () => { return Promise.resolve(v); };
            }
            static rejectPlan(v) {
                return () => { return Promise.reject(v); };
            }
            static order(ps) {
                var seq = Promise.resolve();
                ps.forEach(plan => {
                    seq = seq.then(plan);
                });
                return seq;
            }
            static all(ps) {
                var a = [];
                ps.forEach(task => {
                    a.push(task());
                });
                return Promise.all(a);
            }
            static race(ps) {
                var a = [];
                ps.forEach(task => {
                    a.push(task());
                });
                return Promise.race(a);
            }
        }
        core.Promises = Promises;
    })(core = JS.core || (JS.core = {}));
})(JS || (JS = {}));
var Promises = JS.core.Promises;
var JS;
(function (JS) {
    let core;
    (function (core) {
        let D, _head = () => { return D.querySelector('head'); }, _uncached = (u) => {
            return `${u}${u.indexOf('?') < 0 ? '?' : '&'}_=${new Date().getTime()}`;
        }, _loading = (k, a, b) => {
            if (!a) {
                k['onreadystatechange'] = () => {
                    if (k['readyState'] == 'loaded' || k['readyState'] == 'complete')
                        b();
                };
                k.onload = k.onerror = b;
            }
        };
        if (self['HTMLElement'])
            D = document;
        class Loader {
            static css(url, async = false, uncached) {
                if (!url)
                    return Promise.reject(null);
                return core.Promises.create(function () {
                    let k = D.createElement('link'), back = () => {
                        k.onload = k.onerror = k['onreadystatechange'] = null;
                        k = null;
                        this.resolve(url);
                    };
                    k.type = 'text/css';
                    k.rel = 'stylesheet';
                    k.charset = 'utf-8';
                    _loading(k, async, back);
                    k.href = uncached ? _uncached(url) : url;
                    _head().appendChild(k);
                    if (async)
                        back();
                });
            }
            static js(url, async = false, uncached) {
                if (!url)
                    return Promise.reject(null);
                return core.Promises.create(function () {
                    let s = D.createElement('script'), back = () => {
                        s.onload = s.onerror = s['onreadystatechange'] = null;
                        s = null;
                        this.resolve(url);
                    };
                    s.type = 'text/javascript';
                    s.async = async;
                    _loading(s, async, back);
                    s.src = uncached ? _uncached(url) : url;
                    _head().appendChild(s);
                    if (async)
                        back();
                });
            }
        }
        core.Loader = Loader;
    })(core = JS.core || (JS.core = {}));
})(JS || (JS = {}));
var Loader = JS.core.Loader;
var JS;
(function (JS) {
    JS.version = '2.7.0';
    function config(d, v) {
        let l = arguments.length;
        if (l == 0)
            return _cfg;
        if (!d)
            return;
        if (typeof d === 'string') {
            if (l == 1) {
                return _cfg[d];
            }
            else {
                _cfg[d] = v;
                return;
            }
        }
        else {
            for (let k in d) {
                if (d.hasOwnProperty(k))
                    _cfg[k] = d[k];
            }
        }
    }
    JS.config = config;
    let P = Promises, _cfg = {}, _ldd = {}, _ts = (u) => {
        let c = JS.config('cachedImport');
        if (c === true)
            return u;
        let s = '_=' + (c ? c : '' + Date.now());
        return u.lastIndexOf('?') > 0 ? `${u}&${s}` : `${u}?${s}`;
    }, _min = (u, t) => {
        if (JS.config('minImport')) {
            if (u.endsWith('.min.' + t))
                return u;
            if (u.endsWith('.' + t))
                return u.slice(0, u.length - t.length - 1) + '.min.' + t;
        }
        else
            return u;
    }, _impLib = (v) => {
        let a = v.endsWith('#async'), n = a ? v.slice(0, v.length - 6) : v, c = JS.config('libs')[n];
        if (c) {
            let ps = typeof c == 'string' ? [c] : c, tasks = [];
            ps.forEach(path => {
                if (path.startsWith('$')) {
                    tasks.push(_impLib(path.slice(1)));
                }
                else {
                    tasks.push(_impFile(path + (a ? '#async' : '')));
                }
            });
            return P.newPlan(P.order, [tasks]);
        }
        else {
            console.error('Not found the <' + n + '> library in JSDK settings.');
            return P.resolvePlan(null);
        }
    }, _impFile = (s) => {
        let u = s;
        if (s.startsWith('!')) {
            let jr = JS.config('jsdkRoot');
            jr = jr ? jr : (JS.config('libRoot') + '/jsdk/' + JS.version);
            u = jr + s.slice(1);
        }
        else if (s.startsWith('~')) {
            u = JS.config('libRoot') + s.slice(1);
        }
        let us = u.split('#'), len = us.length, u0 = us[0], ayc = len > 1 && us[1] == 'async';
        if (_ldd[u0])
            return P.resolvePlan(null);
        _ldd[u0] = 1;
        if (u0.endsWith('.js')) {
            return P.newPlan(Loader.js, [_ts(_min(u0, 'js')), ayc]);
        }
        else if (u0.endsWith('.css')) {
            return P.newPlan(Loader.css, [_ts(_min(u0, 'css')), ayc]);
        }
    };
    function imports(url) {
        if (JS.config('closeImport'))
            return Promise.resolve();
        let us = typeof url === 'string' ? [url] : url, tasks = [];
        us.forEach(uri => {
            tasks.push(uri.startsWith('$') ? _impLib(uri.slice(1)) : _impFile(uri));
        });
        return P.order(tasks);
    }
    JS.imports = imports;
})(JS || (JS = {}));
var JS;
(function (JS) {
    let lang;
    (function (lang) {
        let Type;
        (function (Type) {
            Type["null"] = "null";
            Type["undefined"] = "undefined";
            Type["string"] = "string";
            Type["boolean"] = "boolean";
            Type["number"] = "number";
            Type["date"] = "date";
            Type["array"] = "array";
            Type["json"] = "json";
            Type["object"] = "object";
            Type["function"] = "function";
            Type["class"] = "class";
            Type["symbol"] = "symbol";
        })(Type = lang.Type || (lang.Type = {}));
    })(lang = JS.lang || (JS.lang = {}));
})(JS || (JS = {}));
var Type = JS.lang.Type;
var JS;
(function (JS) {
    let util;
    (function (util) {
        let _of = function (a, s) {
            return typeof a === s;
        }, _is = function (a, s) {
            return toString.call(a) === `[object ${s}]`;
        }, _isKlass = function (obj) {
            if (typeof obj != 'function')
                return false;
            let proto = obj.prototype;
            if (proto === undefined || proto.constructor !== obj)
                return false;
            if (Object.getOwnPropertyNames(proto).length >= 2)
                return true;
            var str = obj.toString();
            if (str.slice(0, 5) == "class")
                return true;
            if (/^function\s+\(|^function\s+anonymous\(/.test(str))
                return false;
            if (/\b\(this\b|\bthis[\.\[]\b/.test(str)) {
                if (/classCallCheck\(this/.test(str))
                    return true;
                return /^function\sdefault_\d+\s*\(/.test(str);
            }
            return false;
        }, _superklass = (klass) => {
            if (Object === klass)
                return null;
            let sup = Object.getPrototypeOf(klass);
            return Object.getPrototypeOf(Object) === sup ? Object : sup;
        };
        class Types {
            static isSymbol(o) {
                return _of(o, 'symbol');
            }
            static isArguments(o) {
                return _is(o, 'Arguments');
            }
            static isNaN(n) {
                return n != null && isNaN(n);
            }
            static isNumber(n) {
                return _of(n, 'number');
            }
            static isNumeric(n) {
                return (this.isNumber(n) || this.isString(n)) && !isNaN(n - parseFloat(n));
            }
            static isFloat(n) {
                return Number(n).isFloat();
            }
            static isInt(n) {
                return Number(n).isInt();
            }
            static isBoolean(obj) {
                return _of(obj, 'boolean');
            }
            static isString(obj) {
                return _of(obj, 'string');
            }
            static isDate(obj) {
                return _is(obj, 'Date');
            }
            static isDefined(obj) {
                return obj != void 0;
            }
            static isNull(obj) {
                return obj === null;
            }
            static isUndefined(obj) {
                return obj === void 0;
            }
            static isObject(obj) {
                return _is(obj, 'Object');
            }
            static isJsonObject(obj) {
                let OP = Object.prototype;
                if (!obj || OP.toString.call(obj) !== '[object Object]')
                    return false;
                let proto = Object.getPrototypeOf(obj);
                if (!proto)
                    return true;
                let ctor = OP.hasOwnProperty.call(proto, 'constructor') && proto.constructor, fnToString = Function.prototype.toString;
                return typeof ctor === 'function' && fnToString.call(ctor) === fnToString.call(Object);
            }
            static isArray(obj) {
                return Array.isArray(obj) || obj instanceof Array;
            }
            static isArrayLike(obj) {
                if (this.isString(obj))
                    return false;
                let l = obj && obj['length'] || null;
                return typeof l == 'number' && l >= 0 && l <= Number.MAX_SAFE_INTEGER;
            }
            static isError(obj) {
                return _of(obj, 'Error');
            }
            static isFile(obj) {
                return _is(obj, 'File');
            }
            static isFormData(obj) {
                return _is(obj, 'FormData');
            }
            static isBlob(obj) {
                return _is(obj, 'Blob');
            }
            static isFunction(fn, pure) {
                return _of(fn, 'function') && (!pure ? true : !this.equalKlass(fn));
            }
            static isRegExp(obj) {
                return _is(obj, 'RegExp');
            }
            static isArrayBuffer(obj) {
                return _is(obj, 'ArrayBuffer');
            }
            static isTypedArray(value) {
                return value && this.isNumber(value.length) && /^\[object (?:Uint8|Uint8Clamped|Uint16|Uint32|Int8|Int16|Int32|Float32|Float64)Array]$/.test(toString.call(value));
            }
            static isElement(el) {
                return el && typeof el === 'object' && (el.nodeType === 1 || el.nodeType === 9);
            }
            static isWindow(el) {
                return el != null && el === el.window;
            }
            static isKlass(obj, klass) {
                if (!this.ofKlass(obj, klass))
                    return false;
                return obj.constructor && obj.constructor === klass;
            }
            static ofKlass(obj, klass) {
                return obj instanceof klass;
            }
            static equalKlass(kls, klass) {
                if (!_isKlass(kls))
                    return false;
                return klass ? (kls === klass) : true;
            }
            static subklassOf(kls1, kls2) {
                if (kls2 === Object || kls1 === kls2)
                    return true;
                let superXls = _superklass(kls1);
                while (superXls != null) {
                    if (superXls === kls2)
                        return true;
                    superXls = _superklass(superXls);
                }
                return false;
            }
            static type(obj) {
                if (obj === null)
                    return Type.null;
                let type = typeof obj;
                if (type == 'number' || type == 'bigint')
                    return Type.number;
                if (type == 'object') {
                    if (this.isJsonObject(obj))
                        return Type.json;
                    if (this.isArray(obj))
                        return Type.array;
                    if (this.isDate(obj))
                        return Type.date;
                    ;
                    return Type.object;
                }
                return _isKlass(obj) ? Type.class : type;
            }
        }
        util.Types = Types;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Types = JS.util.Types;
var JS;
(function (JS) {
    let util;
    (function (util) {
        let N = Number, _test = function (s, exp) {
            return s && exp.test(s.trim());
        }, EMAIL = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@([A-Za-z0-9]+(?:-[A-Za-z0-9]+)?\.)+[A-Za-z0-9]+(?:-[A-Za-z0-9]+)?$/, EMAIL_DOMAIN = /^@([A-Za-z0-9]+(?:-[A-Za-z0-9]+)?\.)+[A-Za-z0-9]+(?:-[A-Za-z0-9]+)?$/, YYYY_MM_DD = /^(\d{1,4})(-|\/)(\d{1,2})(-|\/)(\d{1,2})$/, HALFWIDTH_CHARS = /^[\u0000-\u00FF]+$/, FULLWIDTH_CHARS = /^[\u0391-\uFFE5]+$/, NUMBERS_ONLY = /^\d+$/, LETTERS_ONLY = /^[A-Za-z]+$/, LETTERS_OR_NUMBERS = /^[A-Za-z\d]+$/, ENGLISH_ONLY = /^[A-Za-z\d\s\`\~\!\@\#\$\%\^\&\*\(\)\_\-\+\=\[\]\{\}\|\:\;\"\'\<\>\,\.\?\\\/]+$/, CHINESE_ONLY = /^[\u4E00-\u9FA5]+$/, IP = /^(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5])$/;
        class Check {
            static isEmpty(v) {
                return v == void 0
                    || v === ''
                    || (v.hasOwnProperty('length') && v.length == 0)
                    || Check.isEmptyObject(v);
            }
            static isEmptyObject(v) {
                var name;
                for (name in v) {
                    return false;
                }
                return true;
            }
            static isBlank(s) {
                return s == void 0 || s.trim() === '';
            }
            static isFormatDate(s, format) {
                return _test(s, format || YYYY_MM_DD);
            }
            static isEmail(s, exp) {
                return _test(s, exp ? exp : EMAIL);
            }
            static isEmails(s, exp) {
                s = s || '';
                if (this.isBlank(s))
                    return false;
                return s.split(/;|\s+/).every(as => {
                    return as.length == 0 || this.isEmail(as, exp);
                });
            }
            static isEmailDomain(str) {
                return _test(str, EMAIL_DOMAIN);
            }
            static isOnlyNumber(str) {
                return _test(str, NUMBERS_ONLY);
            }
            static isPositive(n) {
                return N(n).isPositive();
            }
            static isNegative(n) {
                return N(n).isNegative();
            }
            static isHalfwidthChars(str) {
                return _test(str, HALFWIDTH_CHARS);
            }
            static isFullwidthChars(str) {
                return _test(str, FULLWIDTH_CHARS);
            }
            static isEnglishOnly(str) {
                return _test(str, ENGLISH_ONLY);
            }
            static isChineseOnly(str) {
                return _test(str, CHINESE_ONLY);
            }
            static isFormatNumber(n, iLength, fLength) {
                if (!util.Types.isNumeric(n))
                    return false;
                let num = N(n), iLen = num.integerLength(), dLen = num.fractionLength();
                if (iLen > iLength)
                    return false;
                if (util.Types.isDefined(fLength) && dLen > fLength)
                    return false;
                return true;
            }
            static greater(n1, n2) {
                return N(n1) > N(n2);
            }
            static greaterEqual(n1, n2) {
                return N(n1) >= N(n2);
            }
            static less(n1, n2) {
                return N(n1) < N(n2);
            }
            static lessEqual(n1, n2) {
                return N(n1) <= N(n2);
            }
            static isBetween(n, min, max) {
                let num = N(n);
                return num > N(min) && num < N(max);
            }
            static shorter(s, len) {
                return s && s.length < len;
            }
            static longer(s, len) {
                return s && s.length > len;
            }
            static equalLength(s, len) {
                return s && s.length == len;
            }
            static isLettersOnly(s) {
                return _test(s, LETTERS_ONLY);
            }
            static isLettersOrNumbers(s) {
                return _test(s, LETTERS_OR_NUMBERS);
            }
            static isIP(s) {
                return _test(s.trim(), IP);
            }
            static isExistUrl(url) {
                let xhr = new XMLHttpRequest();
                return new Promise(function (resolve, reject) {
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState == 4)
                            xhr.status == 200 ? resolve(true) : reject(false);
                    };
                    xhr.open('HEAD', url, true);
                    xhr.send();
                });
            }
            static isPattern(s, exp) {
                return _test(s, exp);
            }
            static byServer(req, judge) {
                return new Promise(function (resolve, reject) {
                    Http.send(req).then(res => {
                        judge.apply(null, [res]) ? resolve(true) : reject(false);
                    });
                });
            }
        }
        util.Check = Check;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Check = JS.util.Check;
var JS;
(function (JS) {
    let util;
    (function (util) {
        let A = Array, Y = util.Types, E = util.Check.isEmpty;
        class Jsons {
            static parse(text, reviver) {
                return text ? JSON.parse(text, reviver) : null;
            }
            static stringify(value, replacer, space) {
                return JSON.stringify(value, replacer, space);
            }
            static clone(obj) {
                if (obj == void 0 || 'object' != typeof obj)
                    return obj;
                let copy;
                if (obj instanceof Date) {
                    copy = new Date();
                    copy.setTime(obj.getTime());
                    return copy;
                }
                if (obj instanceof A) {
                    copy = [];
                    for (var i = 0, len = obj.length; i < len; ++i) {
                        copy[i] = this.clone(obj[i]);
                    }
                    return copy;
                }
                if (Y.isJsonObject(obj)) {
                    copy = {};
                    var keys = Reflect.ownKeys(obj);
                    keys.forEach(key => {
                        copy[key] = this.clone(obj[key]);
                    });
                    return copy;
                }
                return obj;
            }
            static forEach(json, fn, that) {
                if (!json)
                    return;
                let keys = Object.keys(json);
                keys.forEach((key, i) => {
                    fn.apply(that || json, [json[key], key]);
                });
            }
            static some(json, fn, that) {
                if (!json)
                    return;
                let keys = Object.keys(json);
                return keys.some((key, i) => {
                    return fn.apply(that || json, [json[key], key]);
                });
            }
            static hasKey(json, key) {
                return json && key != void 0 && json.hasOwnProperty(key);
            }
            static values(json) {
                if (!json)
                    return null;
                let arr = [];
                this.forEach(json, v => {
                    arr[arr.length] = v;
                });
                return arr;
            }
            static keys(json) {
                if (!json)
                    return null;
                let keys = [];
                this.forEach(json, (v, k) => {
                    keys[keys.length] = k;
                });
                return keys;
            }
            static equalKeys(json1, json2) {
                let empty1 = E(json1), empty2 = E(json2);
                if (empty1 && empty2)
                    return true;
                if (empty1 || empty2)
                    return false;
                let map2 = this.clone(json2);
                this.forEach(json1, (v, k) => {
                    delete map2[k];
                });
                return E(map2);
            }
            static equal(json1, json2) {
                let empty1 = E(json1), empty2 = E(json2);
                if (empty1 && empty2)
                    return true;
                if (empty1 || empty2)
                    return false;
                let map2 = this.clone(json2);
                this.forEach(json1, (v, k) => {
                    if ((k in map2) && map2[k] === v)
                        delete map2[k];
                });
                return E(map2);
            }
            static replaceKeys(json, keyMapping, needClone) {
                if (!keyMapping)
                    return json;
                let clone = needClone ? this.clone(json) : json;
                this.forEach(clone, function (val, oldKey) {
                    let newKey = Y.isFunction(keyMapping) ? keyMapping.apply(clone, [val, oldKey]) : keyMapping[oldKey];
                    if (newKey != oldKey && clone.hasOwnProperty(oldKey)) {
                        let temp = clone[oldKey];
                        delete clone[oldKey];
                        clone[newKey] = temp;
                    }
                });
                return clone;
            }
            static _union(...args) {
                var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
                if (typeof target === "boolean") {
                    deep = target;
                    target = arguments[i] || {};
                    i++;
                }
                if (typeof target !== "object" && !Y.isFunction(target)) {
                    target = {};
                }
                for (; i < length; i++) {
                    if ((options = arguments[i]) != null) {
                        for (name in options) {
                            src = target[name];
                            copy = options[name];
                            if (target === copy) {
                                continue;
                            }
                            if (deep && copy && (Y.isJsonObject(copy) ||
                                (copyIsArray = A.isArray(copy)))) {
                                if (copyIsArray) {
                                    copyIsArray = false;
                                    clone = src && A.isArray(src) ? src : [];
                                }
                                else {
                                    clone = src && Y.isJsonObject(src) ? src : {};
                                }
                                target[name] = this._union(deep, clone, copy);
                            }
                            else if (copy !== undefined) {
                                target[name] = copy;
                            }
                        }
                    }
                }
                return target;
            }
            ;
            static union(...jsons) {
                if (arguments.length <= 1)
                    return jsons[0];
                return this._union.apply(this, [true, {}].concat(jsons));
            }
            static minus(json1, json2) {
                if (E(json1) || E(json2))
                    return json1;
                let newJson = {};
                this.forEach(json1, (v, k) => {
                    if (!json2.hasOwnProperty(k))
                        newJson[k] = v;
                });
                return newJson;
            }
            static intersect(json1, json2) {
                if (E(json1) || E(json2))
                    return json1;
                let newJson = {};
                this.forEach(json1, (v, k) => {
                    if (json2.hasOwnProperty(k))
                        newJson[k] = v;
                });
                return newJson;
            }
            static filter(json, fn) {
                let newJson = {};
                this.forEach(json, (v, k) => {
                    if (fn.apply(json, [v, k]))
                        newJson[k] = v;
                });
                return newJson;
            }
            static find(data, path) {
                if (!path)
                    return data;
                const array = path.split('.');
                if (array.length == 1)
                    return data[path];
                let v = data;
                array.forEach((a) => {
                    if (v && a)
                        v = v[a];
                });
                return v;
            }
        }
        util.Jsons = Jsons;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Jsons = JS.util.Jsons;
var JS;
(function (JS) {
    let net;
    (function (net) {
        let Y = Types, J = Jsons, _URI_REG = /^(([^\:\/\?\#]+)\:)?(\/\/([^\/\?\#]*))?([^\?\#]*)(\\?([^\#]*))?(\#(.*))?/, _AUTH_REG = /^(([^\:@]*)(\:([^\:@]*))?@)?([^\:@]*)(\:(\d{1,3}))?/;
        let _ADU = null;
        class URI {
            constructor(cfg) {
                this._scheme = null;
                this._user = null;
                this._pwd = null;
                this._host = null;
                this._port = null;
                this._path = null;
                this._params = null;
                this._frag = null;
                this._parse(cfg);
            }
            _parse(cfg) {
                if (Y.isString(cfg)) {
                    this._parseStr(cfg);
                }
                else if (cfg && cfg.href) {
                    this._parseStr(cfg.href);
                }
                else if (cfg) {
                    let uri = cfg;
                    this.scheme(uri.scheme ? uri.scheme : 'http');
                    this.user(uri.user);
                    this.password(uri.password);
                    this.host(uri.host);
                    this.port(Y.isDefined(uri.port) ? uri.port : 80);
                    this.path(uri.path);
                    this._params = uri.params;
                    this.fragment(uri.fragment);
                }
            }
            _parseStr(uri) {
                let array = _URI_REG.exec(uri);
                if (!array)
                    throw new URIError('An invalid URI: ' + uri);
                this._scheme = array[2];
                this._frag = array[9];
                let auth = array[4];
                if (auth) {
                    let authArr = _AUTH_REG.exec(auth);
                    if (!authArr)
                        throw new URIError('An invalid auth part of URI: ' + uri);
                    if (authArr[2])
                        this._user = authArr[2];
                    if (authArr[4])
                        this._pwd = authArr[4];
                    if (authArr[5])
                        this._host = authArr[5];
                    if (Y.isDefined(authArr[7]))
                        this._port = parseInt(authArr[7]);
                }
                let path = array[5];
                if (path && path != '/') {
                    if (!this.isAbsolute() && path.startsWith('/') && !uri.startsWith('/'))
                        path = path.slice(1);
                    this.path(path);
                }
                let query = array[7];
                if (query)
                    this._params = URI.parseQueryString(query);
            }
            userinfo() {
                return this._user ? this._user + (this._pwd ? (':' + this._pwd) : '') : '';
            }
            fragment(str) {
                if (arguments.length == 0)
                    return this._frag;
                this._frag = str || '';
                return this;
            }
            queryString(str) {
                if (arguments.length == 0) {
                    if (!this._params)
                        return null;
                    let query = '';
                    J.forEach(this._params, (v, k) => {
                        query += `${query ? '&' : ''}${k}=${v}`;
                    });
                    return query;
                }
                this._params = URI.parseQueryString(str);
                return this;
            }
            path(str) {
                if (arguments.length == 0)
                    return this._path;
                this._path = str || null;
                return this;
            }
            port(port) {
                if (arguments.length == 0)
                    return this._port;
                this._port = port;
                return this;
            }
            host(str) {
                if (arguments.length == 0)
                    return this._host;
                this._host = str || '';
                return this;
            }
            user(str) {
                if (arguments.length == 0)
                    return this._user;
                this._user = str || '';
                return this;
            }
            password(str) {
                if (arguments.length == 0)
                    return this._pwd;
                this._pwd = str || '';
                return this;
            }
            scheme(str) {
                if (arguments.length == 0)
                    return this._scheme;
                this._scheme = str || '';
                return this;
            }
            query(key, value, encode) {
                if (!this._params)
                    this._params = {};
                if (arguments.length > 1) {
                    value = value || '';
                    this._params[key] = encode ? encodeURIComponent(value) : value;
                    return this;
                }
                return decodeURIComponent(this._params[key]);
            }
            queryObject(params, encode) {
                if (arguments.length == 0)
                    return this._params;
                J.forEach(params, (value, key) => {
                    this.query(key, value, encode);
                });
                return this;
            }
            isAbsolute() {
                return this._host ? true : false;
            }
            toAbsolute() {
                let userinfo = this.userinfo(), port = Y.isDefined(this._port) ? ':' + this._port : '', path = this.path() || '', query = this.queryString() || '', fragment = this._frag ? '#' + this._frag : '';
                path = path + (!query && !fragment ? '' : '?' + query + fragment);
                return (this._scheme || 'http') + '://' + (userinfo ? userinfo + '@' : '') + (this._host || '') + port + (!path || path.startsWith('/') ? path : ('/' + path));
            }
            toRelative() {
                let query = this.queryString() || '', fragment = this._frag ? '#' + this._frag : '';
                return (this._path || '') + (!query && !fragment ? '' : '?' + query + fragment);
            }
            toString() {
                return this.isAbsolute() ? this.toAbsolute() : this.toRelative();
            }
            static getAbsoluteDir() {
                if (_ADU)
                    return _ADU;
                var div = document.createElement('div');
                div.innerHTML = '<a href="./"></a>';
                _ADU = div.firstChild['href'];
                div = null;
                return _ADU;
            }
            static toAbsoluteURL(url) {
                if (url.startsWith('http://') || url.startsWith('https://'))
                    return url;
                let loc = self.location;
                if (url.startsWith('/'))
                    return loc.origin + url;
                let p = loc.pathname || '/';
                if (p)
                    p = p.slice(0, p.lastIndexOf('/') + 1);
                return this.getAbsoluteDir() + url;
            }
            static toQueryString(json, encode) {
                if (!json)
                    return '';
                let q = '';
                J.forEach(json, (v, k) => {
                    q += `&${k}=${encode ? encodeURIComponent(v) : v}`;
                });
                return q;
            }
            static parseQueryString(query, decode) {
                if (Check.isEmpty(query))
                    return {};
                let q = query.startsWith('?') ? query.slice(1) : query, ps = {}, arr = q.split('&');
                arr.forEach(function (v) {
                    if (v) {
                        let kv = v.split('=');
                        ps[kv[0]] = decode ? decodeURIComponent(kv[1]) : kv[1];
                    }
                });
                return ps;
            }
        }
        net.URI = URI;
    })(net = JS.net || (JS.net = {}));
})(JS || (JS = {}));
var URI = JS.net.URI;
var JS;
(function (JS) {
    let util;
    (function (util) {
        class Locales {
            static lang(locale) {
                if (!locale)
                    return null;
                let arr = locale.split('-');
                if (arr.length == 1)
                    return locale;
                return arr[0];
            }
            static country(locale) {
                if (!locale)
                    return null;
                let arr = locale.split('-');
                if (arr.length == 1)
                    return null;
                return arr[1];
            }
        }
        util.Locales = Locales;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Locales = JS.util.Locales;
var JS;
(function (JS) {
    let util;
    (function (util) {
        class I18N {
            constructor(lc) {
                this._d = {};
                this.locale(lc);
            }
            _load(lc, prefix, suffix) {
                let lang = util.Locales.lang(lc), country = util.Locales.country(lc);
                if (country) {
                    let rst = this._loadJson(`${prefix}_${lang}_${country}.${suffix}`);
                    if (rst)
                        return true;
                }
                if (lang) {
                    let rst = this._loadJson(`${prefix}_${lang}.${suffix}`);
                    if (rst)
                        return true;
                }
                return this._loadJson(`${prefix}.${suffix}`);
            }
            _loadJson(u) {
                let xhr = new XMLHttpRequest();
                xhr.open('GET', u, false);
                xhr.responseType = 'json';
                xhr.send();
                if (xhr.status != 200)
                    return false;
                this.set(xhr.response);
                return true;
            }
            load(url, locale) {
                let T = this, lc = locale || T._lc, pos = url.lastIndexOf('.'), suffix = pos < 0 ? '' : url.slice(pos + 1), prefix = pos < 0 ? url : url.slice(0, pos);
                return T._load(lc, prefix, suffix);
            }
            get(k) {
                if (arguments.length == 0)
                    return this._d;
                return k && this._d ? this._d[k] : undefined;
            }
            getKeys() {
                return Reflect.ownKeys(this._d);
            }
            hasKey(k) {
                return this._d.hasOwnProperty(k);
            }
            locale(lc) {
                if (arguments.length == 0)
                    return this._lc;
                this._lc = lc || System.info().locale;
                return this;
            }
            set(d) {
                let T = this;
                d = d || {};
                if (d.hasOwnProperty(T._lc)) {
                    this._d = d[T._lc];
                }
                else {
                    let lang = util.Locales.lang(T._lc);
                    this._d = d.hasOwnProperty(lang) ? d[lang] : d;
                }
                return this;
            }
        }
        util.I18N = I18N;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var I18N = JS.util.I18N;
var JS;
(function (JS) {
    let util;
    (function (util) {
        class Dates {
            static isValidDate(d) {
                if (d == null)
                    return false;
                return !isNaN(new Date(d).getTime());
            }
            static isLeapYear(y) {
                return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
            }
            static getDaysOfMonth(m, y) {
                y = y || new Date().getFullYear();
                return [31, (this.isLeapYear(y) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m];
            }
            static getFirstDayOfMonth(d) { return d.clone().set({ day: 1 }); }
            static getLastDayOfMonth(d) {
                return d.clone().set({ day: Dates.getDaysOfMonth(d.getMonth(), d.getFullYear()) });
            }
            static getDayOfWeek(d, dayOfWeek) {
                let d2 = dayOfWeek != void 0 ? dayOfWeek : 1, d1 = d.getDay();
                if (d2 == 0)
                    d2 = 7;
                if (d1 == 0)
                    d1 = 7;
                return d.clone().add((d2 - d1) % 7, 'd');
            }
        }
        Dates.I18N_RESOURCE = {
            AM: 'AM',
            PM: 'PM',
            WEEK_DAY_NAMES: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            WEEK_DAY_SHORT_NAMES: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            MONTH_NAMES: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            MONTH_SHORT_NAMES: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        };
        util.Dates = Dates;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Dates = JS.util.Dates;
(function () {
    var D = Date, $P = D.prototype, pad = function (s, l) {
        new D();
        if (!l) {
            l = 2;
        }
        return ("000" + s).slice(l * -1);
    };
    $P.getWeek = function () {
        let date0 = new D(this.getFullYear(), 0, 1), diff = Math.round((this.valueOf() - date0.valueOf()) / 86400000);
        return Math.ceil((diff + ((date0.getDay() + 1) - 1)) / 7);
    };
    $P.setWeek = function (week, dayOfWeek) {
        let dw = Types.isDefined(dayOfWeek) ? dayOfWeek : 1;
        return this.setTime(Dates.getDayOfWeek(this, dw).add(week - this.getWeek(), 'w').getTime());
    };
    $P.clone = function () { return new D(this.getTime()); };
    $P.setZeroTime = function () {
        let T = this;
        T.setHours(0);
        T.setMinutes(0);
        T.setSeconds(0);
        T.setMilliseconds(0);
        return T;
    };
    $P.setLastTime = function () {
        let T = this;
        T.setHours(23);
        T.setMinutes(59);
        T.setSeconds(59);
        T.setMilliseconds(999);
        return T;
    };
    $P.setNowTime = function () {
        let T = this, n = new D();
        T.setHours(n.getHours());
        T.setMinutes(n.getMinutes());
        T.setSeconds(n.getSeconds());
        T.setMilliseconds(n.getMilliseconds());
        return T;
    };
    $P.equals = function (d, p = 'ms') {
        let T = this;
        if (p == 'ms')
            return T.diff(d) == 0;
        if (p == 's')
            return T.getSeconds() == d.getSeconds();
        if (p == 'm')
            return T.getMinutes() == d.getMinutes();
        if (p == 'h')
            return T.getHours() == d.getHours();
        if (p == 'y')
            return T.getFullYear() == d.getFullYear();
        if (p == 'M')
            return T.getMonth() == d.getMonth();
        if (p == 'd')
            return T.getFullYear() == d.getFullYear() && T.getMonth() == d.getMonth() && T.getDate() == d.getDate();
        if (p == 'w')
            return T.getWeek() == d.getWeek();
        return false;
    };
    $P.between = function (start, end) { return this.diff(start) >= 0 && this.diff(end) <= 0; };
    $P.isAfter = function (d) { return this.diff(d) > 0; };
    $P.isBefore = function (d) { return this.diff(d) < 0; };
    $P.isToday = function () { return this.equals(new D(), 'd'); };
    $P.add = function (v, type) {
        let T = this;
        if (v == 0)
            return T;
        switch (type) {
            case 'ms': {
                T.setMilliseconds(T.getMilliseconds() + v);
                return T;
            }
            case 's': {
                return T.add(v * 1000, 'ms');
            }
            case 'm': {
                return T.add(v * 60000, 'ms');
            }
            case 'h': {
                return T.add(v * 3600000, 'ms');
            }
            case 'd': {
                T.setDate(T.getDate() + v);
                return T;
            }
            case 'w': {
                return T.add(v * 7, 'd');
            }
            case 'M': {
                var n = T.getDate();
                T.setDate(1);
                T.setMonth(T.getMonth() + v);
                T.setDate(Math.min(n, Dates.getDaysOfMonth(T.getMonth(), T.getFullYear())));
                return T;
            }
            case 'y': {
                return T.add(v * 12, 'M');
            }
        }
        return T;
    };
    $P.setTimezoneOffset = function (offset) {
        var here = this.getTimezoneOffset(), there = Number(offset) * -6 / 10;
        return this.add(there - here, 'm');
    };
    $P.formatTimezoneOffset = function () {
        var n = this.getTimezoneOffset() * -10 / 6, r;
        if (n < 0) {
            r = (n - 10000).toString();
            return r.charAt(0) + r.substr(2);
        }
        else {
            r = (n + 10000).toString();
            return "+" + r.substr(1);
        }
    };
    let vt = function (n, min, max) {
        if (!Types.isDefined(n)) {
            return false;
        }
        else if (n < min || n > max) {
            throw new RangeError(n + ' is not a valid value');
        }
        return true;
    };
    $P.set = function (config) {
        let T = this;
        if (vt(config.millisecond, 0, 999)) {
            T.add(config.millisecond - T.getMilliseconds(), 'ms');
        }
        if (vt(config.second, 0, 59)) {
            T.add(config.second - T.getSeconds(), 's');
        }
        if (vt(config.minute, 0, 59)) {
            T.add(config.minute - T.getMinutes(), 'm');
        }
        if (vt(config.hour, 0, 23)) {
            T.add(config.hour - T.getHours(), 'h');
        }
        if (vt(config.day, 1, Dates.getDaysOfMonth(T.getMonth(), T.getFullYear()))) {
            T.add(config.day - T.getDate(), 'd');
        }
        if (vt(config.week, 0, 53)) {
            T.setWeek(config.week);
        }
        if (vt(config.month, 0, 11)) {
            T.add(config.month - T.getMonth(), 'M');
        }
        if (vt(config.year, 0, 9999)) {
            T.add(config.year - T.getFullYear(), 'y');
        }
        if (config.timezoneOffset) {
            T.setTimezoneOffset(config.timezoneOffset);
        }
        return T;
    };
    $P.diff = function (date) {
        return this - (date || new D());
    };
    $P.format = function (format, locale) {
        let T = this, fmt = format || 'YYYY-MM-DD HH:mm:ss', i18n = new I18N(locale).set(Dates.I18N_RESOURCE);
        return fmt.replace(/YYYY|YY|MMMM|MMM|MM|M|DD|D|hh|h|HH|H|mm|m|ss|s|dddd|ddd|A/g, function (m) {
            switch (m) {
                case "YYYY":
                    return pad(T.getFullYear(), 4);
                case "YY":
                    return pad(T.getFullYear());
                case "MMMM":
                    return i18n.get('MONTH_NAMES')[T.getMonth()];
                case "MMM":
                    return i18n.get('MONTH_SHORT_NAMES')[T.getMonth()];
                case "MM":
                    return pad((T.getMonth() + 1));
                case "M":
                    return T.getMonth() + 1;
                case "DD":
                    return pad(T.getDate());
                case "D":
                    return T.getDate();
                case "hh":
                    {
                        let h = T.getHours();
                        return pad(h < 13 ? (h === 0 ? 12 : h) : (h - 12));
                    }
                case "h":
                    {
                        let h = T.getHours();
                        return h < 13 ? (h === 0 ? 12 : h) : (h - 12);
                    }
                case "HH":
                    return pad(T.getHours());
                case "H":
                    return T.getHours();
                case "mm":
                    return pad(T.getMinutes());
                case "m":
                    return T.getMinutes();
                case "ss":
                    return pad(T.getSeconds());
                case "s":
                    return T.getSeconds();
                case "dddd":
                    return i18n.get('WEEK_DAY_NAMES')[T.getDay()];
                case "ddd":
                    return i18n.get('WEEK_DAY_SHORT_NAMES')[T.getDay()];
                case "A":
                    return i18n.get(T.getHours() < 12 ? 'AM' : 'PM');
                default:
                    return m;
            }
        });
    };
}());
(function () {
    var N = Number, $N = N.prototype;
    $N.stringify = function () {
        if (this.isNaN())
            return null;
        if (this.isZero())
            return '0';
        let t = this.toString(), m = t.match(/^(\+|\-)?(\d+)\.?(\d*)[Ee](\+|\-)(\d+)$/);
        if (!m)
            return t;
        let zhe = m[2], xiao = m[3], zhi = N(m[5]), fu = m[1] == '-' ? '-' : '', zfu = m[4], ws = (zfu == '-' ? -1 : 1) * zhi - xiao.length, n = zhe + xiao;
        if (ws == 0)
            return fu + n;
        if (ws > 0)
            return fu + n + Strings.padEnd('', ws, '0');
        let dws = n.length + ws;
        if (dws <= 0)
            return fu + '0.' + Strings.padEnd('', -1 * dws, '0') + n;
        return n.slice(0, dws - 1) + '.' + n.slice(dws);
    };
    $N.round = function (d) {
        if (this.isNaN() || this.isInt() || !N.isFinite(d))
            return N(this);
        let n = (!d || d < 0) ? 0 : d, pow = Math.pow(10, n);
        return Math.round(this * pow) / pow;
    };
    $N.toInt = function () {
        return this.round(0);
    };
    var f3 = (s) => {
        return s.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    };
    $N.format = function (dLen) {
        let d = dLen == void 0 || !Number.isFinite(dLen) ? this.fractionLength() : dLen, s = this.round(d).abs().stringify(), sign = this.isNegative() ? '-' : '';
        let sn = N(s);
        if (sn.isInt())
            return sign + f3(sn.toString()) + (d < 1 ? '' : '.' + Strings.padEnd('', d, '0'));
        let p = s.indexOf('.'), ints = s.slice(0, p), digs = s.slice(p + 1);
        return sign + f3(ints) + '.' + Strings.padEnd(digs, d, '0');
    };
    $N.equals = function (n, dLen) {
        if (this.isNaN())
            throw new TypeError('This number is NaN!');
        let num = N(n);
        if (num.isNaN())
            throw new TypeError('The compared number is NaN!');
        return this.round(dLen).valueOf() == num.round(dLen).valueOf();
    };
    $N.add = function (n) {
        const v = N(n);
        if (this.valueOf() == 0)
            return v;
        if (v.valueOf() == 0)
            return this;
        if (this.isInt() && v.isInt())
            return this.valueOf() + v.valueOf();
        let m = Math.pow(10, Math.max(this.fractionLength(), v.fractionLength())), n1 = this.mul(m).valueOf(), n2 = v.mul(m).valueOf();
        return (n1 + n2) / m;
    };
    $N.sub = function (n) {
        const v = N(n);
        if (v.valueOf() == 0)
            return this;
        if (this.isInt() && v.isInt())
            return this.valueOf() - v.valueOf();
        let m = Math.pow(10, Math.max(this.fractionLength(), v.fractionLength())), n1 = this.mul(m).valueOf(), n2 = v.mul(m).valueOf();
        return (n1 - n2) / m;
    };
    $N.mul = function (n) {
        if (this.valueOf() == 0)
            return 0;
        const v = N(n);
        if (v.valueOf() == 0)
            return 0;
        if (this.isInt() && v.isInt())
            return v.valueOf() * this.valueOf();
        let s1 = this.stringify(this), s2 = v.stringify(), m1 = s1.indexOf('.') >= 0 ? s1.split(".")[1].length : 0, m2 = s2.indexOf('.') >= 0 ? s2.split(".")[1].length : 0, n1 = N(s1.replace('.', '')), n2 = N(s2.replace('.', ''));
        return n1 * n2 / Math.pow(10, m1 + m2);
    };
    $N.div = function (n) {
        if (this.valueOf() == 0)
            return 0;
        const v = N(n);
        if (v.valueOf() == 0)
            throw new ArithmeticError('Can not divide an Zero.');
        let s1 = this.stringify(), s2 = v.stringify(), m1 = s1.indexOf('.') >= 0 ? s1.split(".")[1].length : 0, m2 = s2.indexOf('.') >= 0 ? s2.split(".")[1].length : 0, n1 = N(s1.replace('.', '')), n2 = N(s2.replace('.', ''));
        return (n1 / n2) * Math.pow(10, m2 - m1);
    };
    $N.isNaN = function () {
        return isNaN(this);
    };
    $N.isFinite = function () {
        return isFinite(this);
    };
    $N.isZero = function () {
        return this == 0;
    };
    $N.isFloat = function () {
        if (isNaN(this))
            return false;
        return !this.isInt();
    };
    $N.isInt = function () {
        return Math.floor(this) == this;
    };
    $N.isPositive = function () {
        if (isNaN(this))
            return false;
        return this > 0;
    };
    $N.isNegative = function () {
        if (isNaN(this))
            return false;
        return this < 0;
    };
    $N.isOdd = function () {
        if (!this.isInt())
            return false;
        return (this.valueOf() & 1) != 0;
    };
    $N.isEven = function () {
        if (!this.isInt())
            return false;
        return (this.valueOf() & 1) == 0;
    };
    $N.abs = function () {
        return Math.abs(this);
    };
    $N.fractionLength = function () {
        if (this.isInt() || this.isNaN())
            return 0;
        let s = this.stringify();
        return s.slice(s.indexOf('.') + 1).length;
    };
    $N.integerLength = function () {
        if (this.isNaN())
            return 0;
        return this.abs().toFixed(0).length;
    };
    $N.fractionalPart = function () {
        if (this.isInt() || this.isNaN())
            return '';
        let s = this.stringify();
        return s.slice(s.indexOf('.') + 1);
    };
    $N.integralPart = function () {
        if (this.isNaN())
            return '';
        let s = this.stringify(), i = s.indexOf('.');
        if (i < 0)
            return s;
        return s.slice(0, i);
    };
}());
var JS;
(function (JS) {
    let util;
    (function (util) {
        let N = Number, _opt = function (v1, opt, v2) {
            var rst = null, v = N(v1);
            switch (opt) {
                case '+':
                    rst = v.add(v2);
                    break;
                case '-':
                    rst = v.sub(v2);
                    break;
                case '*':
                    rst = v.mul(v2);
                    break;
                case '/':
                    rst = v.div(v2);
                    break;
            }
            return rst;
        };
        class Numbers {
            static min(...numbers) {
                let m = 0;
                numbers.forEach((n, i) => {
                    if (i == 0 || n < m)
                        m = n;
                });
                return m;
            }
            static max(...numbers) {
                let m = 0;
                numbers.forEach((n, i) => {
                    if (i == 0 || n > m)
                        m = n;
                });
                return m;
            }
            static termwise(...args) {
                if (arguments.length <= 0)
                    return 0;
                if (arguments.length == 1)
                    return N(args[0]).valueOf();
                var rst = null;
                for (var i = 1; i < args.length; i = i + 2) {
                    if (i == 1) {
                        rst = _opt(args[i - 1], args[i], args[i + 1]);
                    }
                    else {
                        rst = _opt(rst, args[i], args[i + 1]);
                    }
                }
                return rst;
            }
            static algebra(expression, values) {
                let exp = expression.replace(/\s+/g, '');
                if (values) {
                    util.Jsons.forEach(values, (n, k) => {
                        exp = exp.replace(new RegExp(k, 'g'), N(n) + '');
                    });
                }
                exp = exp.replace(/\-{2}(\d+\.*\d*)/g, '+$1');
                exp = exp.replace(/(\(|^)\++(\d+\.*\d*)/g, '$1$2');
                exp = exp.replace(/(^|\(|\D^\))\-(\d+\.*\d*)/g, '$1(0-$2)');
                JSLogger.debug(exp);
                let opts = exp.split(/(\d+\.?\d*)/);
                opts.forEach((v, i, array) => {
                    if (v && v.length > 0) {
                        if (util.Types.isNumeric(v)) {
                            array[i] = `(Number(${v}))`;
                        }
                        else {
                            v = v.replace(/[\+\-\*\/]/g, (m) => {
                                if (m == '+') {
                                    return '.add';
                                }
                                else if (m == '-') {
                                    return '.sub';
                                }
                                else if (m == '*') {
                                    return '.mul';
                                }
                                else if (m == '/') {
                                    return '.div';
                                }
                                return m;
                            });
                            array[i] = v;
                        }
                    }
                });
                JSLogger.debug(opts.join(''));
                return eval(opts.join('')).valueOf();
            }
        }
        util.Numbers = Numbers;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Numbers = JS.util.Numbers;
var JS;
(function (JS) {
    let util;
    (function (util) {
        class Konsole {
            static clear() {
                console.clear();
            }
            static count(label) {
                console.count(label);
            }
            static countReset(label) {
                console.countReset(label);
            }
            static time(label) {
                console.time(label);
            }
            static timeEnd(label) {
                console.timeEnd(label);
            }
            static trace(data, css) {
                if (!data)
                    console.trace();
                let arr = [data];
                if (typeof data == 'string' && css)
                    arr[arr.length] = css;
                console.trace.apply(null, arr);
            }
            static text(data, css) {
                typeof css ? console.log('%c' + data, css) : console.log(data);
            }
            static _print(d) {
                typeof d == 'string' ? console.log(d) : console.dirxml(d);
            }
            static print(...data) {
                data.forEach(d => {
                    this._print(d);
                });
            }
        }
        util.Konsole = Konsole;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Konsole = JS.util.Konsole;
var JS;
(function (JS) {
    let lang;
    (function (lang) {
        class JSError extends Error {
            constructor(msg, cause) {
                super(cause ? (cause.message || '') + ' -> ' + (msg || '') : msg || '');
                this.cause = null;
                if (cause)
                    this.cause = cause;
            }
        }
        lang.JSError = JSError;
        class RefusedError extends JSError {
        }
        lang.RefusedError = RefusedError;
        class NotFoundError extends JSError {
        }
        lang.NotFoundError = NotFoundError;
        class ArithmeticError extends JSError {
        }
        lang.ArithmeticError = ArithmeticError;
        class ArgumentError extends JSError {
        }
        lang.ArgumentError = ArgumentError;
        class StateError extends JSError {
        }
        lang.StateError = StateError;
        class ParseError extends JSError {
        }
        lang.ParseError = ParseError;
        class NetworkError extends JSError {
        }
        lang.NetworkError = NetworkError;
        class TimeoutError extends JSError {
        }
        lang.TimeoutError = TimeoutError;
    })(lang = JS.lang || (JS.lang = {}));
})(JS || (JS = {}));
var JSError = JS.lang.JSError;
var RefusedError = JS.lang.RefusedError;
var NotFoundError = JS.lang.NotFoundError;
var ArithmeticError = JS.lang.ArithmeticError;
var ArgumentError = JS.lang.ArgumentError;
var StateError = JS.lang.StateError;
var ParseError = JS.lang.ParseError;
var NetworkError = JS.lang.NetworkError;
var TimeoutError = JS.lang.TimeoutError;
(function () {
    var AP = Array.prototype;
    AP.add = function (obj, from) {
        let m = this;
        if (obj == void 0)
            return m;
        let a = obj instanceof Array ? obj : [obj], i = from == void 0 ? m.length : (from < 0 ? 0 : from);
        AP.splice.apply(m, [i, 0].concat(a));
        return m;
    };
    AP.remove = function (f) {
        let i = typeof f === 'number' ? f : this.findIndex(f);
        if (i < 0 || i >= this.length)
            return false;
        this.splice(i, 1);
        return true;
    };
}());
var JS;
(function (JS) {
    let util;
    (function (util) {
        let E = util.Check.isEmpty, AS = Array.prototype.slice;
        class Arrays {
            static newArray(a, from) {
                return a == void 0 ? [] : AS.apply(a, [from == void 0 ? 0 : from]);
            }
            static toArray(a) {
                return a == void 0 ? [] : (util.Types.isArray(a) ? a : [a]);
            }
            static equal(a1, a2, eq) {
                if (a1 === a2)
                    return true;
                let y1 = E(a1), y2 = E(a2);
                if (y1 && y2)
                    return true;
                if (y1 !== y2)
                    return false;
                if (a1.length != a2.length)
                    return false;
                return a1.every((item1, i) => {
                    return eq ? eq(item1, a2[i], i) : item1 === a2[i];
                });
            }
            static equalToString(a1, a2) {
                if (a1 === a2)
                    return true;
                if (a1 == void 0 && a2 == void 0)
                    return true;
                if (!a1 || !a2)
                    return false;
                if (a1.length != a2.length)
                    return false;
                return a1.toString() == a2.toString();
            }
            static same(a1, a2, eq) {
                if (a1 === a2 || (E(a1) && E(a2)))
                    return true;
                if (a1.length != a2.length)
                    return false;
                let na = a2.slice(), fail = a1.some(t1 => {
                    let r = na.remove(t2 => {
                        return eq ? eq(t1, t2) : t1 === t2;
                    });
                    return !r;
                });
                if (fail)
                    return false;
                return na.length == 0;
            }
            static slice(args, fromIndex, endIndex) {
                return AS.apply(args, [fromIndex || 0, endIndex || args.length]);
            }
        }
        util.Arrays = Arrays;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Arrays = JS.util.Arrays;
var JS;
(function (JS) {
    let lang;
    (function (lang) {
        class AssertError extends lang.JSError {
        }
        lang.AssertError = AssertError;
        let T = Types, F = Functions;
        class Assert {
            static fail(msg) {
                throw new AssertError(msg);
            }
            static failNotSameType(expected, actual, msg) {
                this.fail((msg || '') + ' expected type:<' + expected + '> but was:<' + actual + '>');
            }
            static failNotEqual(expected, actual, msg) {
                this.fail((msg || '') + ' expected:<' + expected + '> but was:<' + actual + '>');
            }
            static failEqual(expected, actual, msg) {
                this.fail((msg || '') + ' <' + expected + '> equals to <' + actual + '>');
            }
            static _equal(expected, actual) {
                if (expected === actual)
                    return true;
                if (T.isArray(expected) && T.isArray(actual) && Arrays.equal(expected, actual))
                    return true;
                if (T.isJsonObject(expected) && T.isJsonObject(actual) && Jsons.equal(expected, actual))
                    return true;
                if (T.isDate(expected) && T.isDate(actual) && expected.getTime() === actual.getTime())
                    return true;
                return false;
            }
            static equal(expected, actual, msg) {
                if (this._equal(expected, actual))
                    return;
                this.failNotEqual(expected, actual, msg);
            }
            static notEqual(expected, actual, msg) {
                if (!this._equal(expected, actual))
                    return;
                this.failEqual(expected, actual, msg);
            }
            static sameType(expected, actual, msg) {
                let et = T.type(expected), at = T.type(actual);
                if (et == at)
                    return;
                this.failNotSameType(et, at, msg);
            }
            static notSameType(expected, actual, msg) {
                if (T.type(expected) != T.type(actual))
                    return;
                this.fail((msg || '') + ' expected not same type');
            }
            static true(condition, msg) {
                if (!condition)
                    this.fail((msg || '') + ' expected:<TRUE> but was:<FALSE>');
            }
            static false(condition, msg) {
                if (condition)
                    this.fail((msg || '') + ' expected:<FALSE> but was:<TRUE>');
            }
            static defined(obj, msg) {
                this.true(obj != void 0, msg);
            }
            static notDefined(obj, msg) {
                this.true(obj == void 0, msg);
            }
            static error(fn, msg) {
                let has = false;
                try {
                    F.call(fn);
                }
                catch (e) {
                    has = true;
                }
                if (!has)
                    this.fail((msg || '') + ' expected throw an error');
            }
            static equalError(error, fn, msg) {
                let has = false;
                try {
                    F.call(fn);
                }
                catch (e) {
                    if (T.ofKlass(e, error))
                        has = true;
                }
                if (!has)
                    this.fail((msg || '') + ' expected throw an error');
            }
        }
        lang.Assert = Assert;
    })(lang = JS.lang || (JS.lang = {}));
})(JS || (JS = {}));
var Assert = JS.lang.Assert;
var AssertError = JS.lang.AssertError;
var JS;
(function (JS) {
    let lang;
    (function (lang_1) {
        let OS;
        (function (OS) {
            OS["Windows"] = "Windows";
            OS["MacOS"] = "Mac OS";
            OS["Unix"] = "Unix";
            OS["Linux"] = "Linux";
            OS["CentOS"] = "CentOS";
            OS["Ubuntu"] = "Ubuntu";
            OS["iOS"] = "iOS";
            OS["Android"] = "Android";
            OS["WindowsPhone"] = "Windows Phone";
        })(OS = lang_1.OS || (lang_1.OS = {}));
        let DeviceType;
        (function (DeviceType) {
            DeviceType["desktop"] = "desktop";
            DeviceType["console"] = "console";
            DeviceType["mobile"] = "mobile";
            DeviceType["tablet"] = "tablet";
            DeviceType["smarttv"] = "smarttv";
            DeviceType["wearable"] = "wearable";
            DeviceType["embedded"] = "embedded";
        })(DeviceType = lang_1.DeviceType || (lang_1.DeviceType = {}));
        let Browser;
        (function (Browser) {
            Browser["Edge"] = "Edge";
            Browser["IE"] = "IE";
            Browser["Firefox"] = "Firefox";
            Browser["Chrome"] = "Chrome";
            Browser["Opera"] = "Opera";
            Browser["Safari"] = "Safari";
            Browser["iOS"] = "iOS";
            Browser["WeChat"] = "WeChat";
            Browser["QQ"] = "QQ";
            Browser["UC"] = "UC";
        })(Browser = lang_1.Browser || (lang_1.Browser = {}));
        class System {
            static info(refresh) {
                if (!refresh && System._info)
                    return System._info;
                var parser = window['UAParser'] && new UAParser(), dev = parser ? parser.getDevice() : {};
                if (!dev.type)
                    dev.type = DeviceType.desktop;
                let info = {
                    ua: navigator.userAgent,
                    browser: parser && parser.getBrowser(),
                    engine: parser && parser.getEngine(),
                    device: dev,
                    os: parser && parser.getOS(),
                    locale: navigator.language,
                    cookieEnabled: navigator.cookieEnabled,
                    online: navigator.onLine,
                    hardware: {
                        cpuName: parser && parser.getCPU().architecture,
                        cpuCores: navigator.hardwareConcurrency
                    },
                    display: null
                };
                if (self.window) {
                    let winscreen = window.screen, doc = (a) => { return Math.max(document.documentElement[a], document.body[a]); };
                    info.display = {
                        screenWidth: winscreen.width,
                        screenHeight: winscreen.height,
                        screenViewWidth: winscreen.availWidth,
                        screenViewHeight: winscreen.availHeight,
                        windowX: window.screenLeft || window.screenX,
                        windowY: window.screenTop || window.screenY,
                        docX: doc('clientLeft') || 0,
                        docY: doc('clientTop') || 0,
                        docScrollX: doc('scrollLeft') || 0,
                        docScrollY: doc('scrollTop') || 0,
                        docWidth: doc('scrollWidth') || 0,
                        docHeight: doc('scrollHeight') || 0,
                        docViewWidth: doc('clientWidth') || 0,
                        docViewHeight: doc('clientHeight') || 0,
                        colorDepth: winscreen.colorDepth,
                        pixelDepth: winscreen.pixelDepth,
                        devicePixelRatio: window.devicePixelRatio
                    };
                }
                System._info = info;
                return info;
            }
            static display(refresh) {
                return this.info(refresh).display;
            }
            static isDevice(device) {
                return System.info().device.type == device;
            }
            static isBrowser(b) {
                return System.info().browser.name == b;
            }
            static isOS(os, version) {
                let sos = System.info().os, is = sos.name == os;
                if (!is)
                    return false;
                return version && sos.version ? sos.version.indexOf(version) == 0 : true;
            }
            static isLang(lang) {
                return Locales.lang(System.info().locale) == lang;
            }
            static isCountry(country) {
                return Locales.country(System.info().locale) == country;
            }
            static timezoneString(tz) {
                return (tz || 'GMT') + new Date().formatTimezoneOffset();
            }
            static performance() {
                return window.performance;
            }
            static highResTime() {
                return performance.now();
            }
        }
        lang_1.System = System;
    })(lang = JS.lang || (JS.lang = {}));
})(JS || (JS = {}));
var System = JS.lang.System;
var OS = JS.lang.OS;
var Browser = JS.lang.Browser;
var DeviceType = JS.lang.DeviceType;
var JS;
(function (JS) {
    let util;
    (function (util) {
        let R = false, W = self;
        class Bom {
            static ready(fn) {
                if (R) {
                    fn();
                    return;
                }
                let D = document, callback = function () {
                    R = true;
                    fn();
                    callback = null;
                };
                let wc = W['HTMLImports'] && W['HTMLImports'].whenReady;
                if (wc)
                    return wc(callback);
                if (D.readyState === "complete") {
                    setTimeout(callback, 1);
                }
                else if (D.addEventListener) {
                    D.addEventListener("DOMContentLoaded", callback, false);
                    W.addEventListener("load", callback, false);
                }
                else {
                    D['attachEvent']("onreadystatechange", callback);
                    W['attachEvent']("onload", callback);
                    var top = false;
                    try {
                        top = (W.frameElement == null && D.documentElement) ? true : false;
                    }
                    catch (e) { }
                    if (top && top['doScroll']) {
                        (function doScrollCheck() {
                            if (!R) {
                                try {
                                    top['doScroll']('left');
                                }
                                catch (e) {
                                    return setTimeout(doScrollCheck, 50);
                                }
                                callback();
                            }
                        })();
                    }
                }
            }
            static iframeWindow(el) {
                let e = util.Dom.$1(el);
                if (!e)
                    return null;
                return e['contentWindow'];
            }
            static iframeDocument(el) {
                let e = util.Dom.$1(el);
                if (!e)
                    return null;
                return e['contentDocument'] || e['contentWindow'].document;
            }
            static fullscreen() {
                let de = document.documentElement;
                let fnName = de['mozRequestFullScreen'] ? 'mozRequestFullScreen' : (de['webkitRequestFullScreen'] ? 'webkitRequestFullScreen' : 'requestFullscreen');
                if (de[fnName])
                    de[fnName]();
            }
            static normalscreen() {
                let D = document, fnName = D['mozCancelFullScreen'] ? 'mozCancelFullScreen' : (D['webkitCancelFullScreen'] ? 'webkitCancelFullScreen' : 'exitFullscreen');
                if (D[fnName])
                    D[fnName]();
            }
        }
        util.Bom = Bom;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Bom = JS.util.Bom;
var JS;
(function (JS) {
    let ui;
    (function (ui) {
        function widget(fullName, alias) {
            return Annotations.define({
                name: 'widget',
                handler: (anno, values, obj) => {
                    let ctor = obj, name = values[0];
                    Class.reflect(ctor, name, alias ? alias : (name.slice(name.lastIndexOf('.') + 1)).toLowerCase());
                },
                target: AnnotationTarget.CLASS
            }, [fullName]);
        }
        ui.widget = widget;
    })(ui = JS.ui || (JS.ui = {}));
})(JS || (JS = {}));
var widget = JS.ui.widget;
var JS;
(function (JS) {
    let view;
    (function (view) {
        class View {
            constructor() {
                this._widgets = {};
                this._eventBus = new EventBus(this);
            }
            initialize() { }
            destroy() {
                if (this._widgets) {
                    Jsons.forEach(this._widgets, w => {
                        w.destroy();
                    });
                }
            }
            config() {
                return this._config;
            }
            _fire(e, args) {
                return this._eventBus.fire(e, args);
            }
            render() {
                Bom.ready(() => {
                    this._fire('rendering');
                    this._render();
                    this._fire('rendered');
                });
            }
            getModel() {
                return this._model;
            }
            getWidget(id) {
                return this._widgets[id];
            }
            getWidgets() {
                return this._widgets;
            }
            addWidget(wgt) {
                if (wgt)
                    this._widgets[wgt.id] = wgt;
                return this;
            }
            removeWidget(id) {
                delete this._widgets[id];
                return this;
            }
            destroyWidget(id) {
                let w = this._widgets[id];
                if (!w)
                    return this;
                w.destroy();
                delete this._widgets.id;
                return this;
            }
            on(type, handler) {
                this._eventBus.on(type, handler);
            }
            off(type) {
                this._eventBus.off(type);
            }
            eachWidget(fn) {
                Jsons.forEach(this._widgets, (w) => {
                    fn.apply(this, [w]);
                });
            }
            _newWidget(id, cfg, defaults) {
                if (!id) {
                    JSLogger.error('The widget\'s id was empty when be inited!');
                    return null;
                }
                let vconfig = cfg, newConfig = Jsons.union(defaults, vconfig, { id: id }), klass = newConfig.klass || $1('#' + id).attr(View.WIDGET_ATTRIBUTE);
                if (!klass) {
                    JSLogger.error(`The widget<${id}> was not configured for its klass type!`);
                    return null;
                }
                this._fire('widgetiniting', [klass, newConfig]);
                let wgt = Class.aliasInstance(klass, newConfig);
                this._fire('widgetinited', [wgt]);
                return wgt;
            }
        }
        View.WIDGET_ATTRIBUTE = 'js-wgt';
        view.View = View;
    })(view = JS.view || (JS.view = {}));
})(JS || (JS = {}));
var View = JS.view.View;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var JS;
(function (JS) {
    let app;
    (function (app) {
        let Page = class Page {
            initialize() { }
            destroy() { }
            static fireEvent(e, args) {
                this._bus.fire(e, args);
            }
            static onEvent(e, handler, once) {
                this._bus.on(e, handler, once);
            }
            static offEvent(e) {
                this._bus.off(e);
            }
            static init(page) {
                let T = this, p = Compos.get(page);
                T._page = p;
                T._bus.context(T._page);
                Bom.ready(() => {
                    T._page.enter();
                });
            }
            static currentPage() {
                return this._page;
            }
            static view(v) {
                return Compos.get(v);
            }
            static redirect(url, query) {
                let T = this, p = T._page;
                if (p) {
                    T.fireEvent('leaving', [p]);
                    Compos.remove(p.className);
                }
                let uri = new URI(url);
                if (query)
                    Types.isString(query) ? uri.queryString(query) : uri.queryObject(query);
                location.href = uri.toString();
            }
            static open(url, specs) {
                let args = [url, 'blank'];
                if (specs) {
                    let spe = '';
                    Jsons.forEach(specs, (v, k) => {
                        spe += `${k}=${Types.isNumber(v) ? v : (v ? 'yes' : 'no')},`;
                    });
                    if (spe)
                        args.push(spe);
                }
                return window.open.apply(window, args);
            }
            static fullscreen(onoff) {
                let T = this;
                if (onoff) {
                    T.fireEvent('fullscreening');
                    Bom.fullscreen();
                    T.fireEvent('fullscreened');
                }
                else {
                    T.fireEvent('normalscreening');
                    Bom.normalscreen();
                    T.fireEvent('normalscreened');
                }
            }
        };
        Page._bus = new EventBus();
        Page = __decorate([
            klass('JS.app.Page')
        ], Page);
        app.Page = Page;
    })(app = JS.app || (JS.app = {}));
})(JS || (JS = {}));
var Page = JS.app.Page;
var JS;
(function (JS) {
    let app;
    (function (app) {
        class AppEvent extends CustomEvent {
            constructor(type, initDict) {
                super(type, initDict);
            }
        }
        app.AppEvent = AppEvent;
        class App {
            static init(cfg) {
                this._cfg = cfg;
                this._cfg.properties = this._cfg.properties || {};
                this._logger = new Log(this.NS(), cfg.logLevel || LogLevel.INFO);
            }
            static NS() {
                return this._cfg.name + '/' + this.version();
            }
            static appName() {
                return this._cfg.name;
            }
            static version() {
                return this._cfg.version;
            }
            static logger() {
                return this._logger;
            }
            static properties(properties) {
                if (arguments.length == 0)
                    return this._cfg.properties;
                this._cfg.properties = Jsons.union(this._cfg.properties, properties);
                return this;
            }
            static property(key, val) {
                if (arguments.length == 1)
                    return this.properties()[key];
                return this.properties({ key: val });
            }
            static fireEvent(e, arg) {
                let p = app.Page.currentPage(), pn = p && p.className, k = `${e}|${pn ? `${pn}|` : ''}${App.NS()}`;
                LocalStore.remove(k);
                LocalStore.set(k, arg);
            }
            static onEvent(e, handler, once) {
                this._bus.on(e, handler, once);
            }
            static offEvent(e) {
                this._bus.off(e);
            }
        }
        App._bus = new EventBus(App);
        app.App = App;
    })(app = JS.app || (JS.app = {}));
})(JS || (JS = {}));
var App = JS.app.App;
var AppEvent = JS.app.AppEvent;
(function () {
    var oldSetItem = localStorage.setItem;
    localStorage.setItem = function (key, val) {
        let ev = new CustomEvent('AppEvent');
        ev['key'] = key;
        ev['newValue'] = val;
        window.dispatchEvent(ev);
        oldSetItem.apply(this, arguments);
    };
    window.on('AppEvent storage', (e) => {
        if (e.newValue == null)
            return;
        let name = e.key;
        if (!name || name.indexOf('|' + App.NS()) < 0)
            return;
        let ps = name.split('|'), ev = new AppEvent(ps[0]);
        ev.fromUrl = e.url;
        ev.fromPage = ps.length == 3 ? ps[1] : null;
        App._bus.fire(ev, [StoreHelper.parse(e.newValue)]);
    });
})();
var JS;
(function (JS) {
    let model;
    (function (model) {
        let F = Jsons.find;
        class ResultSet {
            constructor() {
                this._data = null;
                this._page = 1;
                this._pageSize = Infinity;
            }
            rawObject(response) {
                if (arguments.length == 0)
                    return this._rawObject;
                this._rawObject = response;
                return this;
            }
            data(data) {
                if (arguments.length == 0)
                    return this._data;
                this._data = data;
                return this;
            }
            count() {
                return this._data == void 0 ? 0 : (this._data['length'] || 0);
            }
            total(total) {
                if (arguments.length == 0)
                    return this._total;
                this._total = total;
                return this;
            }
            page(page) {
                if (arguments.length == 0)
                    return this._page;
                this._page = page;
                return this;
            }
            pageSize(pageSize) {
                if (arguments.length == 0)
                    return this._pageSize;
                this._pageSize = pageSize;
                return this;
            }
            version(v) {
                if (arguments.length == 0)
                    return this._version;
                this._version = v;
                return this;
            }
            lang(lang) {
                if (arguments.length == 0)
                    return this._lang;
                this._lang = lang;
                return this;
            }
            message(msg) {
                if (arguments.length == 0)
                    return this._msg;
                this._msg = msg;
                return this;
            }
            success(success) {
                if (arguments.length == 0)
                    return this._success;
                this._success = success;
                return this;
            }
            static parseJSON(raw, format) {
                if (!raw)
                    return null;
                const fmt = format || this.DEFAULT_FORMAT, root = F(raw, fmt.rootProperty);
                let result = new ResultSet();
                result.lang(F(root, fmt.langProperty));
                result.message(F(root, fmt.messageProperty));
                result.version(F(root, fmt.versionProperty));
                result.success(fmt.isSuccess ? fmt.isSuccess(root) : (root[fmt.successProperty] === (fmt.successCode || true)));
                result.data(F(root, fmt.dataProperty));
                result.rawObject(root);
                result.page(F(root, fmt.pageProperty));
                result.pageSize(F(root, fmt.pageSizeProperty));
                result.total(F(root, fmt.totalProperty));
                return result;
            }
        }
        ResultSet.DEFAULT_FORMAT = {
            rootProperty: undefined,
            dataProperty: 'data',
            totalProperty: 'paging.total',
            pageProperty: 'paging.page',
            pageSizeProperty: 'paging.pageSize',
            messageProperty: 'msg',
            versionProperty: 'version',
            langProperty: 'lang',
            successProperty: 'code',
            successCode: 'success'
        };
        model.ResultSet = ResultSet;
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var ResultSet = JS.model.ResultSet;
var JS;
(function (JS) {
    let model;
    (function (model) {
        let AjaxProxy = class AjaxProxy {
        };
        AjaxProxy = __decorate([
            klass('JS.model.AjaxProxy')
        ], AjaxProxy);
        model.AjaxProxy = AjaxProxy;
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var AjaxProxy = JS.model.AjaxProxy;
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var JS;
(function (JS) {
    let model;
    (function (model) {
        let JsonProxy = class JsonProxy extends model.AjaxProxy {
            constructor() {
                super();
            }
            execute(query) {
                var req = Jsons.union({
                    method: 'GET'
                }, Http.toRequest(query), {
                    async: true,
                    responseType: 'json'
                });
                return new Promise(function (resolve, reject) {
                    Http.send(req).always((res) => {
                        let result = model.ResultSet.parseJSON(res.data);
                        result && result.success() ? resolve(result) : reject(res);
                    });
                });
            }
        };
        JsonProxy = __decorate([
            klass('JS.model.JsonProxy'),
            __metadata("design:paramtypes", [])
        ], JsonProxy);
        model.JsonProxy = JsonProxy;
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var JsonProxy = JS.model.JsonProxy;
var JS;
(function (JS) {
    let app;
    (function (app) {
        var Service_1;
        let Service = Service_1 = class Service {
            initialize() { }
            ;
            destroy() {
                this._proxy = null;
            }
            proxy(proxy) {
                if (arguments.length == 0)
                    return this._proxy;
                this._proxy = proxy;
                return this;
            }
            call(api, params) {
                if (!this._proxy)
                    this._proxy = Class.newInstance(Service_1.DEFAULT_PROXY);
                return new Promise((resolve, reject) => {
                    api.data = params;
                    return this._proxy.execute(api).then((result) => {
                        let model = Class.newInstance(api.dataKlass || Model), rds = result.data();
                        Types.ofKlass(model, Model) ? model.setData(rds) : model = rds;
                        resolve(model);
                    }).catch((res) => {
                        reject(res);
                    });
                });
            }
        };
        Service.DEFAULT_PROXY = JsonProxy;
        Service = Service_1 = __decorate([
            klass('JS.app.Service')
        ], Service);
        app.Service = Service;
    })(app = JS.app || (JS.app = {}));
})(JS || (JS = {}));
var Service = JS.app.Service;
var JS;
(function (JS) {
    let d2;
    (function (d2) {
        class Display {
            constructor(cfg) {
                this._dStyle = {
                    lineWidth: 1,
                    strokeStyle: '#000000',
                    shadowStyle: {
                        color: '#000000',
                        blur: 0,
                        offsetX: 0,
                        offsetY: 0
                    }
                };
                this._cfg = Jsons.union({
                    mode: 'div',
                    x: 0,
                    y: 0,
                    zIndex: 0,
                    width: 0,
                    height: 0,
                    drawStyle: this._dStyle
                }, cfg);
                let c = this._cfg, D = $1(c.holder) || document.body, sty = `position:${D == document.body ? 'absolute' : 'relative'};overflow:hidden;left:${c.x}px;top:${c.y}px;z-index:${c.zIndex};${c.cssStyle || ''}`;
                if (c.mode == 'canvas') {
                    D.append(`<canvas id="${c.id}" width="${c.width}" height="${c.height}" style="${sty}"></canvas>`);
                    this._ctx = $1('#' + c.id).getContext("2d");
                    this._applyDrawStyle(c.drawStyle);
                }
                else {
                    D.append(`<div id="${c.id}" style="${sty};width:${c.width}px;height:${c.height}px;"></div>`);
                    this._div = $1('#' + c.id);
                    this._div.on('dragover', (e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                    });
                }
            }
            clear(rect) {
                let c = this._cfg;
                if (c.mode == 'canvas') {
                    let a;
                    if (rect) {
                        a = rect;
                    }
                    else {
                        let b = $1('#' + c.id).box();
                        a = [0, 0, b.w, b.h];
                    }
                    this._ctx.clearRect.apply(this._ctx, a);
                }
                else {
                    $1('#' + c.id).empty();
                }
            }
            _check(m) {
                if (this._cfg.mode != m)
                    throw new RefusedError(`The operation is only supported in "${m}" mode.`);
            }
            _canvasLG(d, size) {
                let x1, y1, x2, y2;
                if (d.dir == 'left') {
                    x1 = size.w;
                    y1 = x2 = y2 = 0;
                }
                else if (d.dir == 'right') {
                    x1 = y1 = y2 = 0;
                    x2 = size.w;
                }
                else if (d.dir == 'top') {
                    x1 = x2 = y2 = 0;
                    y1 = size.h;
                }
                else if (d.dir == 'bottom') {
                    x1 = x2 = y1 = 0;
                    y2 = size.h;
                }
                let lg = this._ctx.createLinearGradient(x1, y1, x2, y2);
                if (d.colors)
                    d.colors.forEach(it => {
                        lg.addColorStop(it.stop, it.color);
                    });
                return lg;
            }
            _applyDrawStyle(st) {
                if (!st)
                    return;
                let m = this, ctx = m._ctx;
                if (st.lineWidth != void 0)
                    ctx.lineWidth = st.lineWidth || 1;
                let ss = st.strokeStyle;
                if (ss)
                    ctx.strokeStyle = ss;
                let shs = st.shadowStyle;
                if (shs) {
                    if (shs.color != void 0)
                        ctx.shadowColor = shs.color;
                    if (shs.blur != void 0)
                        ctx.shadowBlur = shs.blur;
                    if (shs.offsetX != void 0)
                        ctx.shadowOffsetX = shs.offsetX;
                    if (shs.offsetY != void 0)
                        ctx.shadowOffsetY = shs.offsetY;
                }
                ctx.fillStyle = 'transparent';
            }
            _applyDrawingStyle(st) {
                if (!st)
                    return;
                let T = this, ctx = T._ctx;
                T._applyDrawStyle(st);
                if (st.translate)
                    ctx.translate.apply(ctx, st.translate);
                if (st.scale)
                    ctx.scale.apply(ctx, st.scale);
                if (st.rotate != void 0)
                    ctx.rotate(st.rotate);
                if (st.transform)
                    ctx.transform.apply(ctx, st.transform);
            }
            _textDrawingStyle(st) {
                if (!st)
                    return '';
                let T = this, dStyle = T._dStyle, css = `word-wrap:break-word;text-overflow:ellipsis;`;
                if (st.fillStyle == void 0 || Types.isString(st.fillStyle)) {
                    css += `color:${st.fillStyle || 'transparent'};`;
                }
                else {
                    let fs = st.fillStyle, s = '';
                    fs.colors.forEach(c => {
                        s += `,${c.color} ${c.stop == void 0 ? '' : `${c.stop * 100}%`}`;
                    });
                    css += `linear-gradient(to ${fs.dir}${s};`;
                }
                let shs = st.shadowStyle;
                if (shs) {
                    css += `text-shadow:${shs.offsetX || dStyle.shadowStyle.offsetX} ${shs.offsetY || dStyle.shadowStyle.offsetY} ${shs.blur || dStyle.shadowStyle.blur} ${shs.color || dStyle.shadowStyle.color};`;
                }
                let ts = st.textStyle;
                if (ts) {
                    if (ts.align != void 0)
                        css += `text-align:${ts.align};`;
                    if (ts.font != void 0)
                        css += `font:${ts.font};`;
                }
                if (st.strokeStyle)
                    css +=
                        `text-stroke:${st.lineWidth || 1}px ${st.strokeStyle};
                -webkit-text-stroke:${st.lineWidth || 1}px ${st.strokeStyle};
                -moz-text-stroke:${st.lineWidth || 1}px ${st.strokeStyle};`;
                css += this._transformStyle(st);
                return css;
            }
            _transformStyle(st) {
                if (!st)
                    return '';
                let css = '';
                let ts = st.translate;
                if (ts != void 0)
                    css = `translate(${ts[0]}px,${ts[1]}px);`;
                let sc = st.scale;
                if (sc != void 0)
                    css += `scale(${sc[0]},${sc[1]});`;
                let ro = st.rotate;
                if (ro != void 0)
                    css += `scale(${Radians.rad2deg(ro, true)}deg);`;
                let tf = st.transform;
                if (tf != void 0)
                    css += `matrix(${tf[0]},${tf[1]},${tf[2]},${tf[3]},${tf[4]},${tf[5]});`;
                return css;
            }
            config(cfg) {
                if (!cfg)
                    return this._cfg;
                this._cfg = Jsons.union(this._cfg, cfg);
                return this;
            }
            setDrawStyle(style) {
                this._cfg.drawStyle = style || this._dStyle;
                if (this._cfg.mode == 'canvas')
                    this._applyDrawStyle(this._cfg.drawStyle);
                return this;
            }
            _drawLine(ctx, p1, p2) {
                ctx.moveTo(p1[0], p1[1]);
                ctx.lineTo(p2[0], p2[1]);
            }
            drawLine(line, style) {
                this._check('canvas');
                let ctx = this._ctx, p1, p2;
                if (Types.isArray(line)) {
                    p1 = line[0];
                    p2 = line[1];
                }
                else {
                    p1 = line.p1();
                    p2 = line.p2();
                }
                ctx.beginPath();
                this._applyDrawingStyle(style);
                this._drawLine(ctx, p1, p2);
                ctx.stroke();
                ctx.closePath();
            }
            drawCircle(arc, style) {
                this._check('canvas');
                let ctx = this._ctx, a;
                if (arc instanceof Circle) {
                    a = [arc.x, arc.y, arc.r, 0, 2 * Math.PI, false];
                }
                else {
                    a = [arc[0][0], arc[0][1], arc[1], 0, 2 * Math.PI, false];
                }
                ctx.beginPath();
                this._applyDrawingStyle(style);
                ctx.arc.apply(ctx, a);
                ctx.stroke();
                ctx.closePath();
            }
            drawArc(arc, style) {
                this._check('canvas');
                let ctx = this._ctx, a;
                if (arc instanceof CirArc) {
                    a = [arc.x, arc.y, arc.r, arc.sAngle, arc.eAngle, arc.dir === 0];
                }
                else {
                    a = [arc[0][0], arc[0][1], arc[1], arc[2], arc[3], arc[4]];
                }
                ctx.beginPath();
                this._applyDrawingStyle(style);
                ctx.arc.apply(ctx, a);
                ctx.stroke();
                ctx.closePath();
            }
            _fillStyle(ctx, fs, size) {
                if (Types.isString(fs)) {
                    ctx.fillStyle = fs;
                }
                else if (Jsons.hasKey(fs, 'image')) {
                    ctx.fillStyle = ctx.createPattern(fs.image, fs.repeat);
                }
                else {
                    ctx.fillStyle = this._canvasLG(fs, size);
                }
            }
            drawRect(rect, style) {
                this._check('canvas');
                let ctx = this._ctx, r = rect instanceof Rect ? [rect.x, rect.y, rect.w, rect.h] : rect;
                this._applyDrawingStyle(style);
                ctx.strokeRect.apply(ctx, r);
                if (style && style.fillStyle) {
                    this._fillStyle(ctx, style.fillStyle, { w: r[2], h: r[3] });
                    ctx.fillRect.apply(ctx, r);
                }
            }
            drawTri(tri, style) {
                this._check('canvas');
                let ctx = this._ctx, p1, p2, p3;
                if (tri instanceof Triangle) {
                    p1 = tri.p1();
                    p2 = tri.p2();
                    p3 = tri.p3();
                }
                else {
                    p1 = tri[0];
                    p2 = tri[1];
                    p3 = tri[2];
                }
                ctx.beginPath();
                this._applyDrawingStyle(style);
                this._drawLine(ctx, p1, p2);
                this._drawLine(ctx, p2, p3);
                this._drawLine(ctx, p3, p1);
                ctx.stroke();
                ctx.closePath();
            }
            drawPath(p, style) {
                this._check('canvas');
                let ctx = this._ctx, ps;
                ps = p instanceof Polygon ? p.vertexes() : p;
                ctx.beginPath();
                this._applyDrawingStyle(style);
                let size = ps.length;
                if (size < 2)
                    return;
                ps.forEach((pt, i) => {
                    if (i < size - 1) {
                        this._drawLine(ctx, pt, ps[i + 1]);
                    }
                });
                ctx.stroke();
                ctx.closePath();
            }
            _setAttrs(a) {
                let el = $1('#' + a.id);
                if (el) {
                    el.on('dragstart', (e) => {
                        e.dataTransfer.effectAllowed = 'move';
                    });
                    el.on('dragend', (e) => {
                        e.preventDefault();
                        let el = e.target, box = el.box(), ox = e.offsetX - box.w / 2, oy = e.offsetY - box.h / 2;
                        el.css({
                            left: ox > 0 ? `+=${ox}` : `-=${Math.abs(ox)}`,
                            top: oy > 0 ? `+=${oy}` : `-=${Math.abs(oy)}`
                        });
                    });
                }
            }
            drawText(t, style, a) {
                if (this._cfg.mode == 'canvas') {
                    let ctx = this._ctx, ta = [t[0], t[1][0], t[1][1]];
                    if (t.length > 2)
                        ta.push(t[2]);
                    this._applyDrawingStyle(style);
                    let ts = style.textStyle;
                    if (ts) {
                        if (ts.align != void 0)
                            ctx.textAlign = ts.align;
                        if (ts.font != void 0)
                            ctx.font = ts.font;
                    }
                    if (style && style.fillStyle) {
                        let ms = ctx.measureText(ta[0]);
                        this._fillStyle(ctx, style.fillStyle, { w: ms.width, h: ms.emHeightAscent });
                        ctx.fillText.apply(ctx, ta);
                    }
                    ctx.strokeText.apply(ctx, ta);
                }
                else {
                    let p = t[1], maxWidth = t.length > 2 ? `max-width:${t[2]}px;` : '', css = this._textDrawingStyle(style);
                    this._div.append(Strings.nodeHTML('div', {
                        id: (a && a.id) || '',
                        draggable: a && a.draggable ? "true" : "false",
                        style: `position:absolute;left:${p[0]}px;top:${p[1]}px;${maxWidth}${css}${a && a.opacity != void 0 ? `opacity:${a.opacity};` : ''}${a && a.zIndex != void 0 ? `z-index:${a.zIndex};` : ''}${a && a.style || ''}`
                    }, t[0]));
                    if (a)
                        this._setAttrs(a);
                }
            }
            changeText(id, text) {
                this._check('div');
                let el = $1('#' + id);
                if (el)
                    el.textContent = text;
            }
            drawImage(img, a) {
                let pic, url, sx, sy, sw, sh, dx, dy, dw, dh;
                if (img instanceof HTMLImageElement) {
                    pic = img;
                    sx = sy = 0;
                    sw = dw = pic.width;
                    sh = dh = pic.height;
                }
                else {
                    url = img.src instanceof HTMLImageElement ? img.src.src : img.src;
                    sx = img.x;
                    sy = img.y;
                    sw = dw = img.w;
                    sh = dh = img.h;
                }
                dx = a && a.x || 0;
                dy = a && a.y || 0;
                if (this._cfg.mode == 'canvas') {
                    this._ctx.drawImage(pic, sx, sy, sw, sh, dx, dy, dw, dh);
                }
                else {
                    this._div.append(Strings.nodeHTML('div', {
                        id: (a && a.id) || '',
                        draggable: a && a.draggable ? "true" : "false",
                        style: `position:absolute;overflow:hidden;left:${dx}px;top:${dy}px;width:${sw}px;height:${sh}px;${a && a.opacity != void 0 ? `opacity:${a.opacity};` : ''}background:url('${url}') -${sx}px -${sy}px no-repeat;${a && a.zIndex != void 0 ? `z-index:${a.zIndex};` : ''}${a && a.style || ''}`
                    }));
                    if (a)
                        this._setAttrs(a);
                }
            }
            changeImage(id, newImg) {
                this._check('div');
                let img = $1('#' + id);
                if (img) {
                    if (newImg instanceof HTMLImageElement) {
                        img.style.backgroundImage = `url("${newImg.src}")`;
                    }
                    else {
                        if (newImg.src != void 0)
                            img.style.backgroundImage = `url("${newImg.src.src}")`;
                        img.style.backgroundPosition = `-${newImg.x}px -${newImg.y}px`;
                        if (newImg.w != void 0)
                            img.style.width = newImg.w + 'px';
                        if (newImg.h != void 0)
                            img.style.height = newImg.h + 'px';
                    }
                }
            }
            updateChild(id, a) {
                this._check('div');
                let el = $1('#' + id);
                if (el) {
                    if (a.draggable != void 0)
                        el.draggable = a.draggable;
                    el.css({
                        left: a.x != void 0 ? a.x + 'px' : null,
                        top: a.y != void 0 ? a.y + 'px' : null,
                        opacity: a.opacity != void 0 ? a.opacity + '' : null,
                        zIndex: a.zIndex != void 0 ? a.zIndex + '' : null,
                        style: a.style || null
                    });
                }
            }
            removeChild(id) {
                this._check('div');
                let img = $1('#' + id);
                if (img)
                    img.remove();
            }
            appendChild(node) {
                this._check('div');
                this._div.append(node);
                return this;
            }
            find(selector) {
                return this._div.find(selector);
            }
            findAll(selector) {
                return this._div.findAll(selector);
            }
        }
        d2.Display = Display;
    })(d2 = JS.d2 || (JS.d2 = {}));
})(JS || (JS = {}));
var Display = JS.d2.Display;
var JS;
(function (JS) {
    let ds;
    (function (ds) {
        class BiMap {
            constructor(m) {
                this._m = new Map();
                this.putAll(m);
            }
            inverse() {
                let m = new BiMap();
                if (this.size() >= 0)
                    this._m.forEach((v, k) => { m.put(v, k); });
                return m;
            }
            delete(k) {
                return this._m.delete(k);
            }
            forEach(fn, ctx) {
                this._m.forEach(fn, ctx);
            }
            clear() {
                this._m.clear();
            }
            size() {
                return this._m.size;
            }
            has(k) {
                return this._m.has(k);
            }
            get(k) {
                return this._m.get(k);
            }
            put(k, v) {
                this._m.set(k, v);
            }
            putAll(map) {
                if (map) {
                    map instanceof Array ? map.forEach(kv => { this.put(kv["0"], kv["1"]); }) : map.forEach((v, k) => { this.put(k, v); });
                }
            }
            static convert(json) {
                let m = new BiMap();
                Jsons.forEach(json, (v, k) => {
                    m.put(k, v);
                });
                return m;
            }
        }
        ds.BiMap = BiMap;
    })(ds = JS.ds || (JS.ds = {}));
})(JS || (JS = {}));
var BiMap = JS.ds.BiMap;
var JS;
(function (JS) {
    let ds;
    (function (ds) {
        let J = Jsons;
        class LinkedList {
            constructor() {
                this._s = 0;
                this._hd = null;
                this._tl = null;
            }
            each(fn, thisArg) {
                if (this._s == 0)
                    return true;
                let rst = true, i = 0, node = this._hd;
                while (node) {
                    if (!fn.call(thisArg || this, node.data, i, this)) {
                        rst = false;
                        break;
                    }
                    node = node.next;
                    ++i;
                }
                return rst;
            }
            size() {
                return this._s;
            }
            isEmpty() {
                return this._s == 0;
            }
            clear() {
                this._hd = null;
                this._tl = null;
                this._s = 0;
            }
            clone() {
                let list = new LinkedList();
                if (this._s > 0) {
                    let node = this._hd;
                    while (node) {
                        list.add(J.clone(node.data));
                        node = node.next;
                    }
                }
                return list;
            }
            toArray() {
                let arr = [];
                this.each(d => {
                    arr[arr.length] = d;
                    return true;
                });
                return arr;
            }
            getFirst() {
                return this._hd ? this._hd.data : null;
            }
            getLast() {
                return this._tl ? this._tl.data : null;
            }
            get(i) {
                if (i > this._s || i < 0)
                    return null;
                if (i == 0)
                    return this._hd ? this._hd.data : null;
                if (i == this._s - 1)
                    return this._tl ? this._tl.data : null;
                let node = this._findAt(i);
                return node ? node.data : null;
            }
            _findAt(i) {
                return i < this._s / 2 ? this._fromFirst(i) : this._fromLast(i);
            }
            _fromFirst(i) {
                if (i <= 0)
                    return this._hd;
                let node = this._hd, count = 1;
                while (count <= i) {
                    node = node.next;
                    count++;
                }
                return node;
            }
            _fromLast(i) {
                if (i >= (this.size() - 1))
                    return this._tl;
                let node = this._tl, count = this._s - 1;
                while (count > i) {
                    node = node.prev;
                    count--;
                }
                return node;
            }
            indexOf(data, eq) {
                if (this.isEmpty())
                    return -1;
                let rst = -1;
                this.each((item, i) => {
                    let is = eq ? eq(data, item) : (data === item);
                    if (is)
                        rst = i;
                    return !is;
                });
                return rst;
            }
            lastIndexOf(data, eq) {
                if (this.isEmpty())
                    return -1;
                let j = -1, node = this._tl, i = this._s - 1;
                while (node) {
                    if (eq ? eq(data, node.data) : (data === node.data)) {
                        j = i;
                        break;
                    }
                    node = node.prev;
                    --i;
                }
                return j;
            }
            contains(data, eq) {
                return this.indexOf(data, eq) > -1;
            }
            _addLast(d) {
                let node = { data: J.clone(d), prev: null, next: null };
                if (this._tl) {
                    node.prev = this._tl;
                    this._tl.next = node;
                }
                this._tl = node;
                if (!this._hd)
                    this._hd = this._tl;
                this._s += 1;
            }
            _addFirst(d) {
                let node = { data: J.clone(d), prev: null, next: null };
                if (this._hd) {
                    node.next = this._hd;
                    this._hd.prev = node;
                }
                this._hd = node;
                if (!this._tl)
                    this._tl = this._hd;
                this._s += 1;
            }
            add(a) {
                if (Types.isArray(a)) {
                    a.forEach(el => {
                        this._addLast(el);
                    });
                }
                else {
                    this._addLast(a);
                }
            }
            addAll(list) {
                if (!list || list.isEmpty())
                    return;
                list.each(d => {
                    this._addLast(d);
                    return true;
                });
            }
            _addAt(i, a) {
                let nextNode = this._findAt(i);
                if (!nextNode)
                    return;
                let prevNode = nextNode.prev, newNode = { data: J.clone(a), next: nextNode, prev: prevNode };
                prevNode.next = newNode;
                nextNode.prev = newNode;
                this._s += 1;
            }
            addAt(i, a) {
                if (i <= 0) {
                    this.addFirst(a);
                    return;
                }
                else if (i >= this.size()) {
                    this.addLast(a);
                    return;
                }
                if (!Types.isArray(a)) {
                    this._addAt(i, a);
                }
                else {
                    a.forEach((t, j) => {
                        this._addAt(i + j, t);
                    });
                }
            }
            addLast(a) {
                this.add(a);
            }
            addFirst(a) {
                if (Types.isArray(a)) {
                    for (let i = a.length - 1; i >= 0; i--) {
                        this._addFirst(a[i]);
                    }
                }
                else {
                    this._addFirst(a);
                }
            }
            removeFirst() {
                if (this._s == 0)
                    return null;
                let data = this._hd.data;
                if (this._s > 1) {
                    this._hd = this._hd.next;
                    this._hd.prev = null;
                }
                else {
                    this._hd = null;
                    this._tl = null;
                }
                this._s--;
                return data;
            }
            removeLast() {
                if (this._s == 0)
                    return null;
                let data = this._tl.data;
                if (this._s > 1) {
                    this._tl = this._tl.prev;
                    this._tl.next = null;
                }
                else {
                    this._hd = null;
                    this._tl = null;
                }
                this._s--;
                return data;
            }
            removeAt(i) {
                if (this.isEmpty() || i > this._s || i < 0)
                    return null;
                if (i == 0) {
                    return this.removeFirst();
                }
                else if (i == this.size() - 1) {
                    return this.removeLast();
                }
                let node = this._findAt(i);
                if (!node)
                    return null;
                let next = node.next, prev = node.prev;
                if (next)
                    next.prev = prev;
                if (prev)
                    prev.next = next;
                this._s--;
                return node.data;
            }
            peek() {
                return this._hd ? this._hd.data : null;
            }
            peekFirst() {
                return this.peek();
            }
            peekLast() {
                return this._tl ? this._tl.data : null;
            }
            toString() {
                return '[' + this.toArray().toString() + ']';
            }
        }
        ds.LinkedList = LinkedList;
    })(ds = JS.ds || (JS.ds = {}));
})(JS || (JS = {}));
var LinkedList = JS.ds.LinkedList;
var JS;
(function (JS) {
    let ds;
    (function (ds) {
        class Queue {
            constructor(maxSize) {
                this._list = new ds.LinkedList();
                this._ms = Infinity;
                this._ms = maxSize;
            }
            each(fn, thisArg) {
                return this._list.each((item, i) => {
                    return fn.call(thisArg || this, item, i, this);
                }, thisArg);
            }
            maxSize() {
                return this._ms;
            }
            size() {
                return this._list.size();
            }
            isFull() {
                return this.size() == this._ms;
            }
            isEmpty() {
                return this.size() == 0;
            }
            clear() {
                this._list.clear();
            }
            clone() {
                let list = new Queue();
                list._list = this._list.clone();
                return list;
            }
            toArray() {
                return this._list.toArray();
            }
            get(i) {
                return this._list.get(i);
            }
            indexOf(data, eq) {
                return this._list.indexOf(data, eq);
            }
            lastIndexOf(data, eq) {
                return this._list.lastIndexOf(data, eq);
            }
            contains(data, eq) {
                return this.indexOf(data, eq) > -1;
            }
            add(a) {
                if (this.isFull())
                    return false;
                this._list.addLast(a);
                return true;
            }
            remove() {
                return this._list.removeFirst();
            }
            peek() {
                return this._list.peekFirst();
            }
            toString() {
                return '[' + this._list.toArray().toString() + ']';
            }
        }
        ds.Queue = Queue;
    })(ds = JS.ds || (JS.ds = {}));
})(JS || (JS = {}));
var Queue = JS.ds.Queue;
var JS;
(function (JS) {
    let ds;
    (function (ds) {
        class Stack {
            constructor(a) {
                this.list = new ds.LinkedList();
                this.list.add(a);
            }
            each(fn, thisArg) {
                return this.list.each((item, i) => {
                    return fn.call(thisArg || this, item, i, this);
                }, thisArg);
            }
            size() {
                return this.list.size();
            }
            isEmpty() {
                return this.size() == 0;
            }
            clear() {
                this.list.clear();
            }
            clone() {
                let list = new Stack();
                list.list = this.list.clone();
                return list;
            }
            toArray() {
                return this.list.toArray();
            }
            peek() {
                return this.list.peekLast();
            }
            pop() {
                return this.list.removeLast();
            }
            push(item) {
                this.list.addLast(item);
            }
            toString() {
                return '[' + this.list.toArray().toString() + ']';
            }
        }
        ds.Stack = Stack;
    })(ds = JS.ds || (JS.ds = {}));
})(JS || (JS = {}));
var Stack = JS.ds.Stack;
var JS;
(function (JS) {
    let model;
    (function (model) {
        let validator;
        (function (validator) {
            let E = Check.isEmpty, J = Jsons;
            class ValidatorConfig {
            }
            validator.ValidatorConfig = ValidatorConfig;
            class Validator {
                constructor(cfg) {
                    this._cfg = cfg;
                }
                static create(type, cfg) {
                    return Class.newInstance({
                        'required': RequiredValidator,
                        'custom': CustomValidator,
                        'range': RangeValidator,
                        'format': FormatValidator,
                        'length': LengthValidator
                    }[type], cfg);
                }
            }
            validator.Validator = Validator;
            class ValidateResult {
                constructor() {
                    this._errors = [];
                }
                addError(field, msg) {
                    this._errors.push({ field: field, message: msg });
                }
                length() {
                    return this._errors.length;
                }
                hasError(field) {
                    if (!field)
                        return this.length() > 0;
                    return this.getErrors(field).length == 0;
                }
                clear() {
                    this._errors = [];
                }
                getErrors(field) {
                    let errs = this._errors;
                    if (errs.length < 1)
                        return [];
                    if (!field)
                        return errs;
                    let fields = [];
                    errs.forEach(e => {
                        if (e.field == field)
                            fields.push(e);
                    });
                    return fields;
                }
            }
            validator.ValidateResult = ValidateResult;
            class CustomValidatorConfig extends ValidatorConfig {
                constructor() {
                    super(...arguments);
                    this.allowEmpty = true;
                }
            }
            validator.CustomValidatorConfig = CustomValidatorConfig;
            class CustomValidator extends Validator {
                constructor(cfg) {
                    super(J.union(new CustomValidatorConfig(), cfg));
                }
                validate(val) {
                    let cfg = this._cfg;
                    if ((E(val) && !cfg.allowEmpty) || !cfg.validate(val))
                        return cfg.message || false;
                    return true;
                }
            }
            validator.CustomValidator = CustomValidator;
            class RequiredValidatorConfig extends ValidatorConfig {
            }
            validator.RequiredValidatorConfig = RequiredValidatorConfig;
            class RequiredValidator extends Validator {
                constructor(cfg) {
                    super(cfg);
                }
                validate(val) {
                    if (val == void 0 || E(String(val).trim()))
                        return this._cfg.message || false;
                    return true;
                }
            }
            validator.RequiredValidator = RequiredValidator;
            class RangeValidatorConfig extends ValidatorConfig {
                constructor() {
                    super(...arguments);
                    this.allowEmpty = true;
                }
            }
            validator.RangeValidatorConfig = RangeValidatorConfig;
            class RangeValidator extends Validator {
                constructor(cfg) {
                    super(J.union(new RangeValidatorConfig(), cfg));
                }
                validate(val) {
                    let cfg = this._cfg;
                    if ((E(val) && !cfg.allowEmpty) || !Types.isNumeric(val))
                        return cfg.nanMessage;
                    let min = cfg.min, max = cfg.max;
                    val = Number(val == void 0 ? 0 : val);
                    if (min != void 0 && val < min)
                        return cfg.tooMinMessage;
                    if (max != void 0 && val > max)
                        return cfg.tooMaxMessage;
                    return true;
                }
            }
            validator.RangeValidator = RangeValidator;
            class LengthValidatorConfig extends ValidatorConfig {
                constructor() {
                    super(...arguments);
                    this.allowEmpty = true;
                }
            }
            validator.LengthValidatorConfig = LengthValidatorConfig;
            class LengthValidator extends Validator {
                constructor(cfg) {
                    super(J.union(new LengthValidatorConfig(), cfg));
                }
                validate(val) {
                    let cfg = this._cfg;
                    if (E(val)) {
                        return !cfg.allowEmpty ? (cfg.invalidTypeMessage || false) : true;
                    }
                    if (!Types.isString(val) && !Types.isArray(val))
                        return cfg.invalidTypeMessage || false;
                    let short = cfg.short, long = cfg.long, len = val ? val.length : 0;
                    if (short != void 0 && len < short)
                        return cfg.tooShortMessage || false;
                    if (long != void 0 && len > long)
                        return cfg.tooLongMessage || false;
                    return true;
                }
            }
            validator.LengthValidator = LengthValidator;
            class FormatValidatorConfig extends ValidatorConfig {
                constructor() {
                    super(...arguments);
                    this.allowEmpty = true;
                }
            }
            validator.FormatValidatorConfig = FormatValidatorConfig;
            class FormatValidator extends Validator {
                constructor(cfg) {
                    super(J.union(new FormatValidatorConfig(), cfg));
                }
                validate(val) {
                    let cfg = this._cfg;
                    return (E(val) && !cfg.allowEmpty) || !cfg.matcher.test(val) ? (cfg.message || false) : true;
                }
            }
            validator.FormatValidator = FormatValidator;
        })(validator = model.validator || (model.validator = {}));
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var ValidateResult = JS.model.validator.ValidateResult;
var Validator = JS.model.validator.Validator;
var CustomValidator = JS.model.validator.CustomValidator;
var RequiredValidator = JS.model.validator.RequiredValidator;
var RangeValidator = JS.model.validator.RangeValidator;
var LengthValidator = JS.model.validator.LengthValidator;
var FormatValidator = JS.model.validator.FormatValidator;
var JS;
(function (JS) {
    let model;
    (function (model) {
        class Field {
            constructor(config) {
                this._cfg = Jsons.union({
                    isId: false,
                    nullable: true,
                    defaultValue: null
                }, config);
            }
            config(cfg) {
                let T = this;
                if (cfg == void 0)
                    return T._cfg;
                T._cfg = Jsons.union(T._cfg, cfg);
                return T;
            }
            name() {
                return this._cfg.name;
            }
            alias() {
                let mp = this._cfg.nameMapping;
                if (!mp)
                    return this.name();
                return Types.isString(mp) ? mp : mp.call(this);
            }
            isId() {
                return this._cfg.isId;
            }
            defaultValue() {
                return this._cfg.defaultValue;
            }
            nullable() {
                return this._cfg.nullable;
            }
            set(val) {
                let T = this;
                if (!T.nullable() && val == void 0)
                    throw new TypeError(`This Field<${T.name()}> must be not null`);
                let fn = T._cfg.setter, v = fn ? fn.apply(T, [val]) : val;
                return v === undefined ? T._cfg.defaultValue : v;
            }
            validate(value, errors) {
                let cfg = this._cfg, vts = cfg.validators, rst, ret = '';
                if (!vts)
                    return true;
                for (let i = 0, len = vts.length; i < len; ++i) {
                    const vSpec = vts[i];
                    rst = Validator.create(vSpec.name, vSpec).validate(value);
                    if (rst !== true) {
                        if (errors)
                            errors.addError(cfg.name, rst === false ? '' : rst);
                        ret += ret ? ('|' + rst) : rst;
                    }
                }
                return ret || true;
            }
        }
        model.Field = Field;
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var ModelField = JS.model.Field;
var JS;
(function (JS) {
    let model;
    (function (model_1) {
        let E = Check.isEmpty, J = Jsons;
        class ModelConfig {
            constructor() {
                this.idProperty = 'id';
                this.iniData = null;
            }
        }
        model_1.ModelConfig = ModelConfig;
        let Model = class Model {
            constructor(cfg) {
                this._fields = {};
                this._eventBus = new EventBus(this);
                this._data = {};
                this._isD = false;
                cfg = J.union(new ModelConfig(), cfg);
                let defaultFields = this.getClass().getKlass().DEFAULT_FIELDS;
                this._config = Types.isDefined(defaultFields) ? J.union(cfg, { fields: defaultFields }) : cfg;
                this._addFields(this._config.fields);
                let listeners = this._config.listeners;
                if (listeners)
                    J.forEach(listeners, (v, key) => {
                        this.on(key, v);
                    });
            }
            _check() {
                if (this.isDestroyed())
                    throw new RefusedError('The model was destroyed!');
            }
            _newField(cfg) {
                let tField = null;
                if (cfg.name in this._fields) {
                    tField = this._fields[cfg.name];
                    tField.config(cfg);
                }
                else {
                    cfg.isId = cfg.isId || this._config.idProperty === cfg.name;
                    tField = new model_1.Field(cfg);
                }
                this._fields[tField.name()] = tField;
                if (tField.isId())
                    this._config.idProperty = cfg.name;
            }
            _addFields(fields) {
                if (!fields)
                    return;
                for (let i = 0, len = fields.length; i < len; i++) {
                    const fieldCfg = fields[i];
                    this._newField(Types.isString(fieldCfg) ? { name: fieldCfg } : fieldCfg);
                }
            }
            addFields(fields) {
                this._check();
                this._addFields(fields);
                return this;
            }
            addField(field) {
                this.addFields([field]);
                return this;
            }
            isIdField(name) {
                return name == this._config.idProperty;
            }
            removeFields(names) {
                this._check();
                names.forEach((name) => {
                    this.removeField(name);
                });
                return this;
            }
            removeField(name) {
                this._check();
                if (this.isIdField(name))
                    throw new JSError('Can\'t remove the ID field!');
                if (this._fields.hasOwnProperty(name))
                    delete this._fields[name];
                return this;
            }
            updateField(field) {
                this._check();
                let name = Types.isString(field) ? field : field.name;
                if (this.isIdField(name))
                    throw new JSError('Can\'t update the ID field!');
                if (!this._fields.hasOwnProperty(name))
                    return;
                delete this._fields[name];
                this.addFields([field]);
                return this;
            }
            updateFields(fields) {
                fields.forEach(field => {
                    this.updateField(field);
                });
                return this;
            }
            clone() {
                let model = Class.newInstance(this.className, J.clone(this._config));
                model.setData(this.getData());
                return model;
            }
            reload() {
                return this.load(this._config.dataQuery);
            }
            load(quy, silent) {
                this._check();
                let me = this, query = J.union(Http.toRequest(this._config.dataQuery), Http.toRequest(quy));
                this._fire('loading', [query]);
                this._config.dataQuery = query;
                return new model_1.JsonProxy().execute(query).then(function (result) {
                    if (result) {
                        let records = result.data();
                        if (!records)
                            me._fire('loadfailure', [result]);
                        me.setData(Types.isArray(records) ? records[0].getData() : records, silent);
                        me._fire('loadsuccess', [result]);
                    }
                    return Promise.resolve(result);
                }).catch(function (err) {
                    if (Types.ofKlass(err, Error))
                        JSLogger.error('[' + err.name + ']' + err.message);
                    me._fire('loaderror', [err]);
                });
            }
            setData(data, silent) {
                this._check();
                let oldData = J.clone(this._data), newData = data;
                if (!silent)
                    this._fire('dataupdating', [newData, oldData]);
                this._data = {};
                if (newData) {
                    if (E(this._fields)) {
                        J.forEach(newData, (v, k) => {
                            this._newField({ name: k });
                            this.set(k, v, true);
                        });
                    }
                    else {
                        J.forEach(this._fields, (f, name) => {
                            this.set(name, newData[f.alias()], true);
                        });
                    }
                }
                if (!silent)
                    this._fire('dataupdated', [newData, oldData]);
                return this;
            }
            hasField(name) {
                return this._fields.hasOwnProperty(name);
            }
            get(fieldName) {
                let field = this.getField(fieldName);
                if (!field)
                    return undefined;
                let v = this._data[field.alias()];
                return v == void 0 ? null : v;
            }
            set(key, value, equal) {
                this._check();
                let field = this.getField(key);
                if (!field)
                    return;
                let alias = field.alias(), oldVal = this._data[alias], newVal = field.set(value);
                this._data[alias] = newVal;
                let eq = equal == void 0 ? false : (Types.isFunction(equal) ? (equal.apply(this, [newVal, oldVal])) : equal);
                if (!eq)
                    this._fire('fieldchanged', [newVal, oldVal, field.name()]);
                return this;
            }
            iniData(d) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.iniData;
                cfg.iniData = d;
                return this;
            }
            getData() {
                return this._data;
            }
            getId() {
                return this.get(this._config.idProperty);
            }
            setId(id) {
                this._check();
                this.set(this._config.idProperty, id);
                return this;
            }
            isEmpty() {
                return E(this._data);
            }
            destroy() {
                if (this._isD)
                    return;
                this._eventBus.destroy();
                this._eventBus = null;
                this._data = null;
                this._isD = true;
            }
            isDestroyed() {
                return this._isD;
            }
            getField(name) {
                return this._fields[name];
            }
            getFields() {
                return this._fields;
            }
            getIdField() {
                if (!this._fields)
                    return null;
                let f = null;
                J.some(this._fields, field => {
                    let is = field.isId();
                    if (is)
                        f = field;
                    return is;
                });
                return f;
            }
            reset() {
                return this.setData(this.iniData());
            }
            clear() {
                return this.setData(null);
            }
            validate(result) {
                let vdata = this._data;
                if (E(vdata))
                    return true;
                let rst = result || new ValidateResult(), str = '';
                J.forEach(vdata, (v, k) => {
                    let field = this.getField(k);
                    if (field) {
                        let ret = this.validateField(field.name(), v, rst);
                        if (ret !== true)
                            str += (str ? '|' : '') + ret;
                    }
                });
                this._fire('validated', [rst, vdata]);
                return str || true;
            }
            validateField(fieldName, value, result) {
                if (!result)
                    result = new ValidateResult();
                let field = this.getField(fieldName);
                if (!field)
                    return true;
                let rst = result || new ValidateResult(), val = arguments.length > 1 ? value : this.get(fieldName);
                let vdt = field.validate(val, rst);
                this._fire('fieldvalidated', [rst, val, fieldName]);
                return Types.isBoolean(vdt) ? vdt : `[${fieldName}]=` + vdt;
            }
            _fire(type, args) {
                this._eventBus.fire(type, args);
            }
            on(type, fn, once) {
                this._check();
                this._eventBus.on(type, fn, once);
                return this;
            }
            off(type) {
                this._check();
                this._eventBus.off(type);
                return this;
            }
        };
        Model.DEFAULT_FIELDS = [];
        Model = __decorate([
            klass('JS.model.Model'),
            __metadata("design:paramtypes", [ModelConfig])
        ], Model);
        model_1.Model = Model;
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var Model = JS.model.Model;
var ModelConfig = JS.model.ModelConfig;
var JS;
(function (JS) {
    let model;
    (function (model_2) {
        let J = Jsons;
        ;
        class ListModelConfig {
            constructor() {
                this.autoLoad = false;
            }
        }
        model_2.ListModelConfig = ListModelConfig;
        let ListModel = class ListModel {
            constructor(cfg) {
                this._data = [];
                this._eventBus = new EventBus(this);
                this._isD = false;
                this._modelKlass = null;
                this._config = this._initConfig(cfg);
                let listeners = this._config.listeners;
                if (listeners)
                    J.forEach(listeners, (v, key) => {
                        this.on(key, v);
                    });
                if (this._config.iniData)
                    this.setData(this._config.iniData);
                if (this._config.autoLoad)
                    this.reload();
            }
            _initConfig(cfg) {
                return J.union(new ListModelConfig(), cfg);
            }
            _check() {
                if (this.isDestroyed())
                    throw new RefusedError('The model was destroyed!');
            }
            addSorter(field, dir) {
                this._check();
                let newSorter = {
                    field: field,
                    dir: dir ? dir : 'asc'
                }, has = false, sorters = this._config.sorters;
                if (!sorters)
                    sorters = [];
                sorters.some((sorter) => {
                    if (newSorter.field == sorter.field) {
                        has = true;
                        if (newSorter.sort)
                            sorter.sort = newSorter.sort;
                        sorter.dir = newSorter.dir;
                        return true;
                    }
                    return false;
                });
                if (!has)
                    sorters.push(newSorter);
                this._config.sorters = sorters;
            }
            removeSorter(field) {
                this._check();
                let sorters = this._config.sorters;
                if (!sorters)
                    return;
                sorters.remove(item => {
                    return item.field == field;
                });
            }
            clearSorters() {
                this._check();
                this._config.sorters = [];
            }
            sort(field, dir) {
                this._check();
                this.addSorter(field, dir);
                return this.reload();
            }
            getSorterBy(fieldName) {
                let sorters = this._config.sorters;
                if (!sorters)
                    return null;
                let sorter = null;
                sorters.some((srt) => {
                    let is = srt.field === fieldName;
                    if (is)
                        sorter = srt;
                    return is;
                });
                return sorter;
            }
            _sortParams() {
                let sorters = this._config.sorters;
                if (!sorters)
                    return null;
                let s = '';
                sorters.forEach((sorter) => {
                    s += `${sorter.field} ${sorter.dir ? sorter.dir : 'asc'},`;
                });
                s = s.slice(0, s.length - 1);
                return { sorters: s };
            }
            reload() {
                return this.load(this._config.dataQuery);
            }
            modelKlass(klass) {
                if (arguments.length == 0)
                    return this._modelKlass;
                this._modelKlass = klass;
                return this;
            }
            load(quy, silent) {
                this._check();
                let me = this, query = J.union(Http.toRequest(this._config.dataQuery), Http.toRequest(quy));
                query.data = J.union(query.data, this._sortParams());
                this._fire('loading', [query]);
                this._config.dataQuery = query;
                return new model_2.JsonProxy().execute(query).then(function (result) {
                    if (result.success()) {
                        me.setData(result.data(), silent);
                        me._fire('loadsuccess', [result]);
                    }
                    else {
                        me._fire('loadfailure', [result]);
                    }
                    return Promise.resolve(result);
                }).catch(function (err) {
                    if (Types.ofKlass(err, Error))
                        JSLogger.error('[' + err.name + ']' + err.message);
                    me._fire('loaderror', [err]);
                });
            }
            getData() {
                return this.isEmpty() ? null : this._data;
            }
            setData(data, silent) {
                this._check();
                let newData = data, oldData = J.clone(this._data);
                if (!silent)
                    this._fire('dataupdating', [newData, oldData]);
                this._data = data || [];
                if (!silent)
                    this._fire('dataupdated', [newData, oldData]);
                return this;
            }
            iniData(d) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.iniData;
                cfg.iniData = d;
                return this;
            }
            reset() {
                return this.setData(this.iniData());
            }
            add(records, silent) {
                return this.insert(this._data.length, records, silent);
            }
            insert(index, records, silent) {
                if (!records)
                    return this;
                this._check();
                this._data = this._data || [];
                let models = Arrays.toArray(records);
                this._data.add(models, index);
                if (!silent)
                    this._fire('rowadded', [models, index]);
                return this;
            }
            getRowModel(index, klass) {
                if (index < 0 || index >= this.size())
                    return null;
                let d = this._data[index];
                if (!d)
                    return null;
                let k = klass || this._modelKlass;
                if (!k)
                    throw new NotFoundError('The model klass not found!');
                return Class.newInstance(k).setData(d, true);
            }
            getModels(klass) {
                if (this.size() == 0)
                    return null;
                let k = klass || this._modelKlass;
                if (!k)
                    throw new NotFoundError('The model klass not found!');
                let mds = [];
                this._data.forEach((d, i) => {
                    mds[i] = Class.newInstance(k).setData(d, true);
                });
                return mds;
            }
            getRowById(id) {
                return this.getRow(this.indexOfId(id));
            }
            getRow(index) {
                if (index < 0 || index >= this.size())
                    return null;
                return this._data[index] || null;
            }
            indexOfId(id) {
                if (!id || this.size() == 0)
                    return -1;
                let idName = 'id';
                if (this._modelKlass && Types.subklassOf(this._modelKlass, model_2.Model)) {
                    let model = Class.newInstance(this._modelKlass), field = model.getIdField();
                    if (field)
                        idName = field.alias();
                }
                let index = -1;
                this._data.some((obj, i) => {
                    let ret = obj[idName] == id;
                    if (ret)
                        index = i;
                    return ret;
                });
                return index;
            }
            removeAt(index, silent) {
                this._check();
                if (this.size() == 0)
                    return this;
                const obj = this._data[index];
                if (obj) {
                    this._data.remove(index);
                    if (!silent)
                        this._fire('rowremoved', [obj, index]);
                }
                return this;
            }
            clear(silent) {
                return this.setData(null, silent);
            }
            validate() {
                if (this.size() == 0)
                    return true;
                let rst = new ValidateResult(), str = '';
                this._data.forEach(m => {
                    let ret = m.validate(rst);
                    if (ret !== true)
                        str += (str ? '|' : '') + ret;
                });
                this._fire('validated', [this._data, rst]);
                return str || true;
            }
            validateRow(index) {
                let row = this.getRow(index);
                if (!row)
                    return null;
                let rst = row.validate();
                this._fire('rowvalidated', [rst, row, index]);
                return rst;
            }
            size() {
                return !this._data ? 0 : this._data.length;
            }
            isEmpty() {
                return this.size() == 0;
            }
            clone() {
                let model = Class.newInstance(this.className, J.clone(this._config));
                model.setData(this.getData());
                return model;
            }
            _fire(type, args) {
                this._eventBus.fire(type, args);
            }
            on(type, fn, once) {
                this._check();
                this._eventBus.on(type, fn, once);
                return this;
            }
            off(type) {
                this._check();
                this._eventBus.off(type);
                return this;
            }
            destroy() {
                if (this._isD)
                    return;
                this._eventBus.destroy();
                this._eventBus = null;
                this._data = null;
                this._isD = true;
            }
            isDestroyed() {
                return this._isD;
            }
        };
        ListModel = __decorate([
            klass('JS.model.ListModel'),
            __metadata("design:paramtypes", [ListModelConfig])
        ], ListModel);
        model_2.ListModel = ListModel;
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var ListModel = JS.model.ListModel;
var ListModelConfig = JS.model.ListModelConfig;
var JS;
(function (JS) {
    let util;
    (function (util) {
        let _num = (s) => {
            let n = parseFloat(s);
            return n.isNaN() ? 0 : n;
        };
        class CssTool {
            static isHEX(a) {
                return /^#[0-9A-F]{3,8}$/i.test(a);
            }
            static isRGB(a) {
                return /^rgb/.test(a);
            }
            static isHSL(a) {
                return /^hsl/.test(a);
            }
            static isColor(a) {
                return this.isHEX(a) || this.isRGB(a) || this.isHSL(a);
            }
            static rgb2hex(r, g, b, a) {
                let s = [r, g, b];
                if (a != void 0)
                    s.push(Number((a * 255).integralPart()));
                return '#' + s.map(x => {
                    let h = x.toString(16);
                    return h.length === 1 ? '0' + h : h;
                }).join('');
            }
            static hex2rgb(hex) {
                if (!this.isHEX(hex))
                    return null;
                let a = false, h = hex.slice(hex.startsWith('#') ? 1 : 0), l = h.length;
                if (l == 4 || l == 8)
                    a = true;
                if (l == 3 || l == 4)
                    h = [...h].map(x => x + x).join('');
                let n = parseInt(h, 16);
                return {
                    r: (n >>> (a ? 24 : 16)),
                    g: ((n & (a ? 0x00ff0000 : 0x00ff00)) >>> (a ? 16 : 8)),
                    b: ((n & (a ? 0x0000ff00 : 0x0000ff)) >>> (a ? 8 : 0)),
                    a: a ? Number((n & 0x000000ff) / 255).round(2) : 1
                };
            }
            static rgbString(c) {
                if (!c)
                    return '';
                let has = c.a != void 0;
                return `rgb${has ? 'a' : ''}(${c.r},${c.g},${c.b}${has ? `,${c.a}` : ''})`;
            }
            static toTRGB(s) {
                if (s.startsWith('rgba(')) {
                    let r = /^rgba\((.+),(.+),(.+),(.+)\)$/.exec(s);
                    if (r)
                        return {
                            r: Number(r[1]),
                            g: Number(r[2]),
                            b: Number(r[3]),
                            a: Number(r[4])
                        };
                }
                else if (s.startsWith('rgb(')) {
                    let r = /^rgb\((.+),(.+),(.+)\)$/.exec(s);
                    if (r)
                        return {
                            r: Number(r[1]),
                            g: Number(r[2]),
                            b: Number(r[3])
                        };
                }
                return null;
            }
            static convertToRGB(val) {
                if (this.isHEX(val))
                    return this.hex2rgb(val);
                if (this.isHSL(val))
                    return this.hsl2rgb(val);
                return this.toTRGB(val);
            }
            static hslString(c) {
                if (!c)
                    return '';
                let has = c.a != void 0;
                return `hsl(${c.h},${(c.s * 100).round(2)}%,${(c.l * 100).round(2)}%${has ? `,${c.a}` : ''})`;
            }
            static hsl2rgb(hsl) {
                if (!this.isHSL(hsl))
                    return null;
                let hsla = this.toTHSL(hsl), h = hsla.h, s = hsla.s, l = hsla.l, r, g, b;
                if (s == 0) {
                    r = g = b = l;
                }
                else {
                    var hue2rgb = (p, q, t) => {
                        if (t < 0)
                            t += 1;
                        if (t > 1)
                            t -= 1;
                        if (t < 1 / 6)
                            return p + (q - p) * 6 * t;
                        if (t < 1 / 2)
                            return q;
                        if (t < 2 / 3)
                            return p + (q - p) * (2 / 3 - t) * 6;
                        return p;
                    };
                    var q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
                    r = hue2rgb(p, q, h + 1 / 3);
                    g = hue2rgb(p, q, h);
                    b = hue2rgb(p, q, h - 1 / 3);
                }
                return {
                    r: Math.round(r * 255),
                    g: Math.round(g * 255),
                    b: Math.round(b * 255),
                    a: hsla.a
                };
            }
            static rgb2hsl(rgb) {
                if (!rgb)
                    return null;
                let r = rgb.r, g = rgb.g, b = rgb.b;
                r /= 255, g /= 255, b /= 255;
                var max = Math.max(r, g, b), min = Math.min(r, g, b), h, s, l = (max + min) / 2;
                if (max == min) {
                    h = s = 0;
                }
                else {
                    var d = max - min;
                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                    switch (max) {
                        case r:
                            h = (g - b) / d + (g < b ? 6 : 0);
                            break;
                        case g:
                            h = (b - r) / d + 2;
                            break;
                        case b:
                            h = (r - g) / d + 4;
                            break;
                    }
                    h /= 6;
                }
                return {
                    h: h,
                    s: s,
                    l: l,
                    a: rgb.a
                };
            }
            static hyphenCase(name) {
                return name.replace(/([A-Z])/g, (a, b) => { return '-' + b.toLowerCase(); });
            }
            static numberOf(val) {
                return util.Types.isNumber(val) ? val : _num(val);
            }
            static unitOf(val) {
                if (val == void 0 || util.Types.isNumber(val))
                    return '';
                let split = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(val);
                return split ? split[1] : '';
            }
            static calcValue(v, baseVal) {
                if (!v)
                    return baseVal + '';
                if (v.indexOf(',') > 0 || v.indexOf(' ') > 0)
                    return v;
                let u = this.unitOf(v) || this.unitOf(baseVal) || 'px';
                if (v.startsWith('+=') || v.startsWith('-=')) {
                    let ov = this.numberOf(baseVal), nv = _num(v.replace('=', ''));
                    return ov + nv + u;
                }
                else if (v.startsWith('*=')) {
                    let ov = this.numberOf(baseVal), nv = _num(v.replace('*=', ''));
                    return ov * nv + u;
                }
                return parseFloat(v).isNaN() ? v : (_num(v) + u);
            }
            static normValue(v, df, du) {
                if (v == void 0)
                    return df;
                return util.Types.isNumber(v) ? (v + (du === undefined ? 'px' : (du || ''))) : v;
            }
        }
        CssTool.toTHSL = (h) => {
            var hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(h) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(h);
            return {
                h: parseInt(hsl[1], 10) / 360,
                s: parseInt(hsl[2], 10) / 100,
                l: parseInt(hsl[3], 10) / 100,
                a: parseFloat(hsl[4]) || 1
            };
        };
        util.CssTool = CssTool;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var CssTool = JS.util.CssTool;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let SizeMode;
        (function (SizeMode) {
            SizeMode["hg"] = "hg";
            SizeMode["lg"] = "lg";
            SizeMode["md"] = "md";
            SizeMode["sm"] = "sm";
            SizeMode["xs"] = "xs";
        })(SizeMode = fx.SizeMode || (fx.SizeMode = {}));
        let ColorMode;
        (function (ColorMode) {
            ColorMode["success"] = "success";
            ColorMode["danger"] = "danger";
            ColorMode["warning"] = "warning";
            ColorMode["info"] = "info";
            ColorMode["primary"] = "primary";
            ColorMode["secondary"] = "secondary";
            ColorMode["accent"] = "accent";
            ColorMode["metal"] = "metal";
            ColorMode["light"] = "light";
            ColorMode["dark"] = "dark";
        })(ColorMode = fx.ColorMode || (fx.ColorMode = {}));
        class WidgetConfig {
            constructor() {
                this.name = '';
                this.tip = '';
                this.style = '';
                this.cls = '';
                this.appendTo = 'body';
                this.renderTo = null;
                this.hidden = false;
                this.sizeMode = SizeMode.md;
                this.faceMode = null;
                this.locale = 'en';
                this.i18n = null;
            }
        }
        fx.WidgetConfig = WidgetConfig;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var SizeMode = JS.fx.SizeMode;
var ColorMode = JS.fx.ColorMode;
var WidgetConfig = JS.fx.WidgetConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let J = Jsons;
        let Widget = class Widget {
            constructor(cfg) {
                this._config = null;
                this._initialConfig = null;
                this._isD = false;
                this._i18nObj = null;
                if (!cfg.id && cfg.renderTo) {
                    let wgt = $(cfg.renderTo);
                    if (wgt.length == 1) {
                        this.widgetEl = wgt;
                        let id = wgt.attr('id');
                        if (id) {
                            this.id = id;
                        }
                        else {
                            this.id = Random.uuid(4, 10).toString();
                            wgt.attr('id', this.id);
                        }
                    }
                }
                else {
                    this.id = cfg.id || Random.uuid(4, 10).toString();
                }
                this._initConfig(cfg);
                this._onBeforeInit();
                this._initDom();
                this._onAfterInit();
            }
            _onBeforeInit() { }
            _onAfterInit() { }
            _initDom() {
                let cfg = this._config;
                this.widgetEl = $('#' + this.id);
                if (this.widgetEl.length == 0) {
                    this.widgetEl = $('<div />', {
                        id: this.id,
                        width: cfg.width,
                        height: cfg.height,
                        title: cfg.tip,
                        style: cfg.style,
                        'klass-name': this.className
                    }).appendTo(cfg.appendTo || 'body');
                }
                else {
                    let attrs = {};
                    if (cfg.tip)
                        attrs['title'] = cfg.tip;
                    if (cfg.style)
                        attrs['style'] = (this.widgetEl.attr('style') || '') + cfg.style;
                    if (!Check.isEmpty(attrs))
                        this.widgetEl.attr(attrs);
                    if (cfg.width)
                        this.widgetEl.css('width', cfg.width);
                }
                this._eventBus = new EventBus(this);
                let listeners = cfg.listeners;
                if (listeners && listeners.rendering)
                    this.on('rendering', listeners.rendering);
                this.render();
            }
            _initConfig(cfg) {
                let defaultCfg = Class.newInstance(this.className + 'Config');
                cfg.name = cfg.name || this.id;
                this._config = J.union(defaultCfg, cfg);
                this._initialConfig = J.clone(this._config);
            }
            initialConfig(key) {
                return J.clone(key ? this._initialConfig[key] : this._initialConfig);
            }
            _onBeforeRender() { }
            _onAfterRender() { }
            render() {
                this._onBeforeRender();
                this._fire('rendering');
                this.off();
                this.widgetEl.off().empty();
                let cfg = this._config;
                this.widgetEl.addClass(`jsfx-${this.getClass().shortName.toLowerCase()} ${cfg.colorMode ? 'color-' + cfg.colorMode : ''} size-${cfg.sizeMode} ${cfg.cls || ''}`);
                let is = this._render();
                let lts = cfg.listeners || {};
                J.forEach(lts, function (handler, type) {
                    if (handler)
                        this.on(type, handler);
                }, this);
                this._onAfterRender();
                if (is !== false)
                    this._fire('rendered');
                return this;
            }
            name() {
                return this._config.name || '';
            }
            _hasFaceMode(key, cfg) {
                cfg = cfg || this._config;
                let t = cfg.faceMode;
                if (!t)
                    return false;
                return t == key || t[key] === true || $.inArray(key, t) != -1;
            }
            _eachMode(type, fn, cfg) {
                cfg = cfg || this._config;
                let mode = cfg[type];
                if (!mode)
                    return;
                let me = this;
                if (Types.isArray(mode)) {
                    mode.forEach(m => {
                        fn.apply(this, [m]);
                    });
                }
                else {
                    fn.apply(me, [mode]);
                }
            }
            destroy() {
                this._fire('destroying');
                this._destroy();
                this._fire('destroyed');
            }
            _destroy() {
                this.off();
                this.widgetEl.remove();
                this._eventBus.destroy();
                this._isD = true;
            }
            show() {
                this._fire('showing');
                this.widgetEl.css('display', '');
                this._fire('shown');
                return this;
            }
            hide() {
                this._fire('hiding');
                this.widgetEl.css('display', 'none');
                this._fire('hidden');
                return this;
            }
            isShown() {
                return this.widgetEl.css('display') != 'none';
            }
            on(types, fn, once) {
                this._eventBus.on(types, fn, once);
                return this;
            }
            off(types) {
                this._eventBus.off(types);
                return this;
            }
            _fire(e, args) {
                return this._eventBus.fire(e, args);
            }
            _newI18N() {
                let lc = this._config.locale, n = new I18N(lc), v = this.getClass().getKlass()['I18N'];
                if (v)
                    typeof v == 'string' ? n.load(v) : n.set(v);
                let i18n = this._config.i18n;
                if (i18n) {
                    if (Types.isString(i18n)) {
                        n.load(i18n, lc);
                    }
                    else {
                        n.set(J.union(n.get(), i18n));
                    }
                }
                this._i18nObj = n;
            }
            _i18n(key) {
                if (!this._i18nObj)
                    this._newI18N();
                return this._i18nObj.get(key);
            }
            locale(lc) {
                if (arguments.length == 0)
                    return this._config.locale;
                this._config.locale = lc;
                return this;
            }
        };
        Widget.I18N = null;
        Widget = __decorate([
            klass('JS.fx.Widget'),
            __metadata("design:paramtypes", [fx.WidgetConfig])
        ], Widget);
        fx.Widget = Widget;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Widget = JS.fx.Widget;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let J = Jsons;
        class FormWidgetConfig extends fx.WidgetConfig {
            constructor() {
                super(...arguments);
                this.disabled = false;
                this.dataModel = ListModel;
                this.valueModel = Model;
                this.validators = [];
                this.autoValidate = false;
                this.validateMode = 'tip';
                this.readonly = false;
                this.titlePlace = 'left';
                this.titleTextPlace = 'rm';
                this.data = null;
                this.iniValue = null;
            }
        }
        fx.FormWidgetConfig = FormWidgetConfig;
        class FormWidget extends fx.Widget {
            constructor(cfg) {
                super(cfg);
            }
            iniValue(v, render) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.iniValue;
                cfg.iniValue = v;
                if (render)
                    this.value(v, true);
                return this;
            }
            readonly(is) {
                if (arguments.length == 0)
                    return this._config.readonly;
                this._mainEl.prop('readonly', is);
                this._config.readonly = is;
                return this;
            }
            _onBeforeInit() {
                this._initDataModel();
                this._initValueModel();
            }
            _onAfterInit() {
                let cfg = this._config;
                if (cfg.dataQuery)
                    this.load(cfg.dataQuery, true);
                cfg.disabled ? this.disable() : this.enable();
            }
            disable() {
                this._mainEl.prop('disabled', true);
                this._config.disabled = true;
                return this;
            }
            enable() {
                this._mainEl.prop('disabled', false);
                this._config.disabled = false;
                return this;
            }
            isEnabled() {
                return !this._config.disabled;
            }
            title(text) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.title;
                this.widgetEl.find('div[jsfx-role="title"]>span').html(text);
                cfg.title = text;
                return this;
            }
            _hAlign() {
                let al = this._config.titleTextPlace || 'lm';
                return { 'l': 'left', 'r': 'right', 'c': 'center' }[al.substr(0, 1)];
            }
            _vAlign() {
                let al = this._config.titleTextPlace || 'lm';
                return { 't': 'top', 'b': 'bottom', 'm': 'middle' }[al.substr(1, 1)];
            }
            _render() {
                let cfg = this._config, titleAttrs = cfg.tip ? ` title=${cfg.tip}` : '';
                if (cfg.title) {
                    let tValign = this._vAlign(), tHalign = this._hAlign(), p0 = tHalign == 'right' && cfg.titlePlace == 'top' ? 'p-0' : '', cls = `${p0} font-${cfg.sizeMode || 'md'} items-${tValign} items-${tHalign} ${cfg.colorMode ? 'text-' + cfg.colorMode : ''} ${cfg.titleCls || ''}"`;
                    let style = Types.isDefined(cfg.titleWidth) ? `width:${CssTool.normValue(cfg.titleWidth, '100%')};` : '';
                    if (cfg.titleStyle)
                        style += cfg.titleStyle;
                    titleAttrs += ` class="${cls}"`;
                    if (style)
                        titleAttrs += ` style="${style}"`;
                }
                let html = `<div jsfx-role="title"${titleAttrs}>${cfg.title ? '<span>' + cfg.title + '</span>' : ''}</div> 
                    <div jsfx-role="body" class="font-${cfg.sizeMode || 'md'} items-middle ${cfg.bodyCls || ''}" style="flex:1;${cfg.bodyStyle || ''}">
                        ${this._bodyFragment()}
                    </div>`;
                this.widgetEl.html(html);
                this._mainEl = this.widgetEl.find('[jsfx-role=main]');
            }
            _onBeforeRender() {
                let cfg = this._config, w = CssTool.normValue(cfg.width, '100%'), d = cfg.titlePlace == 'left' ? 'flex' : 'grid', css = {
                    'display': (w == 'auto' ? 'inline-' : '') + d,
                    'width': w
                };
                this.widgetEl.css(css);
            }
            _iniValue() {
                let cfg = this._config;
                this.value(cfg.iniValue, true);
            }
            _onAfterRender() {
                this.on('validated', (e, rst, val, name) => {
                    window.setTimeout(() => {
                        rst.hasError() ? this._showError(rst.getErrors(name)[0].message) : this._hideError();
                    }, 100);
                });
                this._iniValue();
            }
            _showError(msg) {
                let cfg = this._config, mode = cfg.validateMode, fn = (mode == 'tip' || (mode && mode['mode'] == 'tip')) ? this._showTipError : mode['showError'];
                if (fn)
                    fn.apply(this, [msg]);
            }
            _hideError() {
                let cfg = this._config, mode = cfg.validateMode, fn = (mode == 'tip' || (mode && mode['mode'] == 'tip')) ? this._hideTipError : mode['hideError'];
                if (fn)
                    fn.call(this);
            }
            _getTipEl(place) {
                let cfg = this._config;
                return this.widgetEl.find(cfg.titlePlace == 'left' && place == 'left' ? '[jsfx-role=title]>span' : '[jsfx-role=body]');
            }
            _showTipError(msg) {
                if (!msg)
                    return;
                let div = this.widgetEl.find('.error .tooltip-inner');
                if (div.length == 1) {
                    div.html(msg);
                }
                else {
                    let cfg = this._config, mode = cfg.validateMode, place = mode && mode['place'] ? mode['place'] : 'right', el = this._getTipEl(place);
                    el.tooltip({
                        placement: place,
                        offset: '0, 2px',
                        fallbackPlacement: 'clockwise',
                        container: el[0],
                        trigger: 'manual',
                        html: false,
                        title: msg,
                        template: '<div class="tooltip error" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
                    }).tooltip('show');
                }
            }
            _hideTipError() {
                let cfg = this._config, mode = cfg.validateMode, place = mode && mode['place'] ? mode['place'] : 'right', el = this._getTipEl(place);
                if (el.tooltip)
                    el.tooltip('dispose');
            }
            _validate(name, val, rst) {
                let field = new ModelField({
                    name: name,
                    validators: this._config.validators
                });
                return field.validate(val, rst);
            }
            validate() {
                if (Check.isEmpty(this._config.validators))
                    return true;
                let name = this.name(), rst = new ValidateResult(), val = J.clone(this.value());
                this._fire('validating', [rst, val, name]);
                let vdt = this._validate(name, val, rst);
                this._fire('validated', [rst, val, name]);
                return vdt;
            }
            dataModel() {
                return this._dataModel;
            }
            _initDataModel() {
                let me = this, cfg = this._config;
                this._dataModel = Class.newInstance(cfg.dataModel);
                ['loading', 'loadsuccess', 'loadfailure', 'loaderror', 'dataupdating', 'dataupdated'].forEach(e => {
                    this._dataModel.on(e, function () {
                        if (e == 'dataupdated')
                            me.data(this.getData(), true);
                        me._fire(e, Arrays.slice(arguments, 1));
                    });
                });
            }
            data(data, silent) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.data;
                let newData = J.clone(data), oldData = J.clone(cfg.data);
                if (!silent)
                    this._fire('dataupdating', [newData, oldData]);
                cfg.data = data;
                if (this._dataModel)
                    this._dataModel.setData(data, true);
                this._renderData();
                this._renderValue();
                if (!silent)
                    this._fire('dataupdated', [newData, oldData]);
                return this;
            }
            _renderData() { }
            clear(silent) {
                return this.value(null, silent);
            }
            load(quy, silent) {
                let cfg = this._config;
                cfg.dataQuery = J.union(Http.toRequest(cfg.dataQuery), Http.toRequest(quy));
                return this._dataModel.load(cfg.dataQuery, silent);
            }
            reload() {
                if (this._dataModel)
                    this._dataModel.reload();
                return this;
            }
            _equalValues(newVal, oldVal) {
                return oldVal == newVal;
            }
            value(val, silent) {
                let cfg = this._config, oldVal = this._valueModel.get(this.name());
                if (arguments.length == 0)
                    return oldVal;
                this._setValue(val, silent);
                this._renderValue();
                return this;
            }
            _setValue(val, silent) {
                this._hideError();
                this._valueModel.set(this.name(), val, silent || this._equalValues(val, this.value()));
                if (this._config.autoValidate)
                    this.validate();
            }
            _renderValue() {
                let v = this.value() || '';
                if (this._mainEl.val() !== v)
                    this._mainEl.val(v);
            }
            reset() {
                return this.value(this._config.iniValue);
            }
            valueModel() {
                return this._valueModel;
            }
            _initValueModel() {
                let cfg = this._config, vModel = cfg.valueModel;
                if (!vModel) {
                    this._valueModel = new Model();
                }
                else if (Types.subklassOf(vModel, Model)) {
                    this._valueModel = Class.newInstance(vModel);
                }
                else {
                    this._valueModel = vModel;
                }
                this._valueModel.addField({
                    name: this.name(),
                    validators: cfg.validators
                });
                let me = this;
                this._valueModel.on('dataupdated', function (e, newData) {
                    let fName = me.name();
                    if (newData && newData.hasOwnProperty(fName)) {
                        me.value(newData[fName]);
                    }
                });
                this._valueModel.on('fieldchanged', (e, newVal, oldVal) => {
                    this._fire('changed', [newVal, oldVal]);
                });
            }
        }
        fx.FormWidget = FormWidget;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var FormWidgetConfig = JS.fx.FormWidgetConfig;
var FormWidget = JS.fx.FormWidget;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let ButtonFaceMode;
        (function (ButtonFaceMode) {
            ButtonFaceMode["square"] = "square";
            ButtonFaceMode["round"] = "round";
            ButtonFaceMode["round_left"] = "round-left";
            ButtonFaceMode["round_right"] = "round-right";
            ButtonFaceMode["pill"] = "pill";
            ButtonFaceMode["pill_left"] = "pill-left";
            ButtonFaceMode["pill_right"] = "pill-right";
            ButtonFaceMode["shadow"] = "shadow";
        })(ButtonFaceMode = fx.ButtonFaceMode || (fx.ButtonFaceMode = {}));
        class ButtonConfig extends fx.WidgetConfig {
            constructor() {
                super(...arguments);
                this.faceMode = ButtonFaceMode.square;
                this.outline = false;
                this.dropMenu = null;
                this.disabled = false;
            }
        }
        fx.ButtonConfig = ButtonConfig;
        let Button = class Button extends fx.Widget {
            constructor(cfg) {
                super(cfg);
            }
            _render() {
                let cfg = this._config, text = cfg.text || '', cls = 'btn btn-block', bdgAttr = '';
                if (cfg.colorMode)
                    cls += ` btn-${cfg.colorMode}`;
                if (cfg.outline)
                    cls += ' btn-outline';
                if (cfg.sizeMode)
                    cls += ` btn-${cfg.sizeMode}`;
                if (cfg.badge) {
                    let isStr = Types.isString(cfg.badge), bdg = {
                        text: isStr ? cfg.badge : cfg.badge.text || '',
                        color: isStr ? fx.ColorMode.danger : cfg.badge.color || fx.ColorMode.danger
                    };
                    cls += ' jsfx-badge jsfx-badge-' + bdg.color;
                    bdgAttr = ` data-badge="${bdg.text}"`;
                }
                if (cfg.dropMenu)
                    cls += ` dropdown-toggle`;
                this._eachMode('faceMode', mode => {
                    cls += ' border-' + mode;
                });
                if (cfg.cls)
                    cls += ' ' + cfg.cls;
                let icon = '';
                if (cfg.iconCls)
                    icon = `<i class="${cfg.iconCls}"></i>`;
                let button = `<button type="button" ${cfg.style ? 'style="' + cfg.style + '"' : ''} ${cfg.disabled ? 'disabled' : ''} ${bdgAttr} title="${cfg.tip}" ${cfg.dropMenu ? 'data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"' : ''} class="${cls}" jsfx-role="main">
                ${icon}${text ? (icon ? ` ${text}` : text) : ''}</button>`;
                if (cfg.dropMenu)
                    button = this._dropDown(button);
                this.widgetEl.html(button);
                this._mainEl = this.widgetEl.find('[jsfx-role=main]');
            }
            _onAfterRender() {
                this._mainEl.on('click', () => {
                    return this._fire('click');
                });
            }
            _dropDown(buttonHtml) {
                let dropDown = this._config.dropMenu, html = `
                    <div class="btn-group ${'drop' + (dropDown.dir || 'down')}">
                        ${buttonHtml}
                        <div class="dropdown-menu">
                        ${this._dropDownItems(dropDown.items)}
                        </div>
                    </div>
                `;
                return html;
            }
            _dropDownItems(items) {
                if (!Types.isDefined(items))
                    return '';
                let html = '';
                items.forEach((item, i) => {
                    html += this._dropDownItem(item, i);
                });
                return html;
            }
            _dropDownItem(item, index) {
                let id = 'dropdown-item' + index + '-' + Random.uuid(3, 10), span = item.html || `${item.iconCls ? `<i class="${item.iconCls}"></i>` : ''}<span class="">${Strings.escapeHTML(item.text)}</span>`, html = '';
                if (item.caption)
                    html += `<h6 class='dropdown-header'>${Strings.escapeHTML(item.caption)}</h6>`;
                html += `<a class='dropdown-item ${this._config.colorMode} ${item.selected ? 'active' : ''}' id='${id}'  href='${item.href ? encodeURI(item.href) : 'javascript:void(0);'}'>${span}</a>`;
                if (item.hasDivider)
                    html += `<div class='dropdown-divider'></div>`;
                let me = this;
                if (item.onClick)
                    $(document).on('click', '#' + id, function (e) {
                        return item.onClick.apply(me, [e.originalEvent, item]);
                    });
                return html;
            }
            disable() {
                this._mainEl.prop('disabled', true);
                this._config.disabled = true;
                return this;
            }
            enable() {
                this._mainEl.prop('disabled', false);
                this._config.disabled = false;
                return this;
            }
            toggle() {
                let d = this._mainEl.find('.dropdown-toggle');
                if (d.length < 1)
                    return;
                d.dropdown('toggle');
                return this;
            }
            badge(option) {
                if (arguments.length == 0) {
                    return this._mainEl.attr('data-badge');
                }
                else if (Check.isEmpty(option)) {
                    this._mainEl.removeAttr('data-badge');
                }
                else {
                    let isStr = Types.isString(option), bdg = {
                        text: isStr ? option : option.text || '',
                        color: isStr ? fx.ColorMode.danger : option.color || fx.ColorMode.danger
                    };
                    this._mainEl.addClass('jsfx-badge jsfx-badge-' + bdg.color);
                    bdg.text ? this._mainEl.attr('data-badge', bdg.text) : this._mainEl.removeAttr('data-badge');
                }
                return this;
            }
        };
        Button = __decorate([
            widget('JS.fx.Button'),
            __metadata("design:paramtypes", [ButtonConfig])
        ], Button);
        fx.Button = Button;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Button = JS.fx.Button;
var ButtonConfig = JS.fx.ButtonConfig;
var ButtonFaceMode = JS.fx.ButtonFaceMode;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class CarouselConfig extends fx.WidgetConfig {
            constructor() {
                super(...arguments);
                this.interval = 5000;
                this.activeIndex = 0;
            }
        }
        fx.CarouselConfig = CarouselConfig;
        let Carousel = class Carousel extends fx.Widget {
            constructor(cfg) {
                super(cfg);
            }
            prev() {
                this.widgetEl.carousel('prev');
                return this;
            }
            next() {
                this.widgetEl.carousel('next');
                return this;
            }
            pause() {
                this.widgetEl.carousel('pause');
                return this;
            }
            cycle() {
                this.widgetEl.carousel('cycle');
                return this;
            }
            goto(num) {
                this.widgetEl.carousel(num);
                return this;
            }
            _destroy() {
                this.widgetEl.carousel('dispose');
                super._destroy();
            }
            length() {
                let items = this._config.items;
                return !items ? 0 : items.length;
            }
            add(item, from) {
                let size = this.length();
                if (!Types.isDefined(from) || from >= size)
                    from = size - 1;
                let cfg = this._config;
                cfg.items = cfg.items || [];
                cfg.items.add([item], from);
                this._renderItems(from);
                return this;
            }
            remove(num) {
                if (!Types.isDefined(num) || num < 0)
                    return this;
                let size = this.length();
                if (size == 0 || num >= size)
                    return this;
                let cfg = this._config;
                if (!cfg.items)
                    cfg.items = [];
                cfg.items.remove(num);
                this._renderItems(num >= 0 ? num : 0);
                return this;
            }
            clear() {
                this.widgetEl.find('.carousel-indicators').empty();
                this.widgetEl.find('.carousel-inner').empty();
                this._config.items = null;
            }
            _limitActive() {
                let cfg = this._config, size = this.length();
                cfg.activeIndex = cfg.activeIndex >= (size - 1) ? (size - 1) : (cfg.activeIndex <= 0 ? 0 : cfg.activeIndex);
            }
            _indHtml(i) {
                let is = this._config.activeIndex == i;
                return `<li data-target="#${this.id}" data-slide-to="${i}" class="${is ? 'active' : ''}"></li>`;
            }
            _itemHtml(item, i) {
                let is = this._config.activeIndex == i;
                let capHtml = '';
                if (item.caption || item.desc) {
                    capHtml =
                        `<div class="carousel-caption d-md-block">
                        <h5>${item.caption || ''}</h5>
                        <p>${item.desc || ''}</p>
                    </div>`;
                }
                return `
                <div class="carousel-item ${is ? 'active' : ''}" jsfx-index="${i}">
                    <img class="d-block w-100" src="${item.src}" style="height:${CssTool.normValue(this._config.height, '100%')};" alt="${item.imgAlt || ''}">
                    ${capHtml}
                </div>
                `;
            }
            _renderItems(num) {
                this._limitActive();
                let cfg = this._config, indsHtml = '', itemsHtml = '';
                if (cfg.items)
                    cfg.items.forEach((item, i) => {
                        indsHtml += this._indHtml(i);
                        itemsHtml += this._itemHtml(item, i);
                    });
                this.pause();
                this.widgetEl.find('.carousel-indicators').html(indsHtml);
                this.widgetEl.find('.carousel-inner').html(itemsHtml);
                this.widgetEl.carousel({
                    interval: cfg.interval
                });
                this.goto(num);
            }
            _render() {
                this._limitActive();
                let cfg = this._config, indsHtml = '', itemsHtml = '';
                if (cfg.items)
                    cfg.items.forEach((item, i) => {
                        indsHtml += this._indHtml(i);
                        itemsHtml += this._itemHtml(item, i);
                    });
                let html = `
                <ol class="carousel-indicators">
                    ${indsHtml}
                </ol>
                <div class="carousel-inner" style="height:${CssTool.normValue(cfg.height, '100%')}">
                    ${itemsHtml}
                </div>
                <a class="carousel-control-prev" href="#${this.id}" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                </a>
                <a class="carousel-control-next" href="#${this.id}" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                </a>
                `;
                this.widgetEl.attr('data-ride', 'carousel');
                this.widgetEl.addClass('carousel slide bg-light');
                this.widgetEl.css({ 'width': CssTool.normValue(cfg.width, '100%') });
                this.widgetEl.html(html);
                this.widgetEl.on('slide.bs.carousel', (e) => {
                    let from = e.from, to = e.to;
                    if (from != -1 && to != -1)
                        this._fire('transiting', [from, to]);
                });
                this.widgetEl.on('slid.bs.carousel', (e) => {
                    let from = e.from, to = e.to;
                    this._fire('transited', [from, to]);
                });
                this.widgetEl.carousel({
                    interval: cfg.interval
                });
            }
        };
        Carousel = __decorate([
            widget('JS.fx.Carousel'),
            __metadata("design:paramtypes", [CarouselConfig])
        ], Carousel);
        fx.Carousel = Carousel;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Carousel = JS.fx.Carousel;
var CarouselConfig = JS.fx.CarouselConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let A = Arrays;
        class ChoiceConfig extends fx.FormWidgetConfig {
        }
        fx.ChoiceConfig = ChoiceConfig;
        class Choice extends fx.FormWidget {
            constructor(cfg) {
                super(cfg);
            }
            _bodyFragment() {
                let isList = this._hasFaceMode('list') ? true : false;
                return `<div class="jsfx-choice-${isList ? 'list' : 'inline'}"> </div>`;
            }
            _choicesHtml(type) {
                let cfg = this._config, data = cfg.data;
                if (!data)
                    return '';
                let val = A.toArray(this.value()), html = '', textColor = cfg.textColorMode ? 'text-' + cfg.textColorMode : '', mode1 = this._hasFaceMode('round') ? 'round' : 'square', mode2 = this._hasFaceMode('ring') ? 'ring' : 'dot', disable = cfg.disabled ? 'disabled' : '';
                data.forEach((d, i) => {
                    html += `
                    <label class="font-${cfg.sizeMode || 'md'} ${mode1} ${mode2} ${cfg.colorMode || ''} ${textColor} ${disable}">
                        <input id="${this.id}_${i}" name="${this.name()}" ${disable} ${val.findIndex(it => { return it == d.id; }) >= 0 ? 'checked' : ''} type="${type}" value="${d.id}"/>
                        <span class="text">${d.text || ''}</span>
                        <span class="choice"></span>
                    </label>`;
                });
                return html;
            }
            isSelected() {
                return !Check.isEmpty(this.value());
            }
            _renderData(type) {
                this.widgetEl.find('[jsfx-role=body]>div').off().empty().html(this._choicesHtml(type));
                if (!this.readonly()) {
                    let el = this.widgetEl.find('input');
                    el.on('change', () => {
                        this._setValue(this._getDomValue());
                    }).on('click', () => {
                        this._setValue(this._getDomValue(), true);
                        this._fire('click');
                    });
                }
            }
            _renderValue() {
                let cVal = this.value(), v = A.toArray(cVal), val = A.toArray(this._getDomValue());
                if (!A.same(val, v)) {
                    this._setDomValue(cVal);
                }
            }
            _onAfterRender() {
                this._renderData();
                super._onAfterRender();
            }
            disable() {
                this._config.disabled = true;
                this.widgetEl.find('input').prop('disabled', true);
                this.widgetEl.find('label').addClass('disabled');
                return this;
            }
            enable() {
                this._config.disabled = false;
                this.widgetEl.find('input').prop('disabled', false);
                this.widgetEl.find('label').removeClass('disabled');
                return this;
            }
            readonly(is) {
                if (arguments.length == 0)
                    return this._config.readonly;
                this.widgetEl.find('input').prop('readonly', is);
                this._config.readonly = is;
                return this;
            }
        }
        fx.Choice = Choice;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Choice = JS.fx.Choice;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class CheckboxConfig extends fx.ChoiceConfig {
            constructor() {
                super(...arguments);
                this.faceMode = CheckboxFaceMode.inline;
            }
        }
        fx.CheckboxConfig = CheckboxConfig;
        let CheckboxFaceMode;
        (function (CheckboxFaceMode) {
            CheckboxFaceMode["square"] = "square";
            CheckboxFaceMode["round"] = "round";
            CheckboxFaceMode["inline"] = "inline";
            CheckboxFaceMode["list"] = "list";
        })(CheckboxFaceMode = fx.CheckboxFaceMode || (fx.CheckboxFaceMode = {}));
        let Checkbox = class Checkbox extends fx.Choice {
            _getDomValue() {
                let v = [], els = this.widgetEl.find('input:checked');
                els.each((i, el) => {
                    v.push($(el).val());
                });
                return v;
            }
            _setDomValue(v) {
                this.widgetEl.find('input').each((i, el) => {
                    let n = $(el);
                    n.prop('checked', !Check.isEmpty(v) && v.findIndex(it => { return it == n.val(); }) > -1 ? true : false);
                });
            }
            constructor(cfg) {
                super(cfg);
            }
            _equalValues(newVal, oldVal) {
                return Arrays.same(newVal, oldVal);
            }
            _renderData() {
                super._renderData('checkbox');
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value();
                return super.value(val || [], silent);
            }
            select(val) {
                if (Check.isEmpty(val)) {
                    let v = [], els = this.widgetEl.find('input:checkbox');
                    els.each((i, el) => {
                        v.push($(el).val());
                    });
                    this._setDomValue(v);
                }
                else {
                    this.unselect();
                    let oldVal = this.value() || [], addVal = Arrays.toArray(val);
                    addVal.forEach(v => {
                        if (oldVal.findIndex(it => { return it == v; }) == -1)
                            oldVal.push(v);
                    });
                    this.value(oldVal);
                }
                return this;
            }
            unselect(val) {
                if (!val) {
                    this.value(null);
                }
                else {
                    let oldVal = this.value() || [], delVal = Arrays.toArray(val);
                    delVal.forEach(v => {
                        oldVal.remove(it => {
                            return it == v;
                        });
                    });
                    this.value(oldVal);
                }
                return this;
            }
        };
        Checkbox = __decorate([
            widget('JS.fx.Checkbox'),
            __metadata("design:paramtypes", [CheckboxConfig])
        ], Checkbox);
        fx.Checkbox = Checkbox;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var CheckboxConfig = JS.fx.CheckboxConfig;
var CheckboxFaceMode = JS.fx.CheckboxFaceMode;
var Checkbox = JS.fx.Checkbox;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        ;
        class InputConfig extends fx.FormWidgetConfig {
            constructor() {
                super(...arguments);
                this.inputCls = '';
                this.inputStyle = '';
                this.maxlength = Infinity;
                this.placeholder = '';
                this.autoclear = true;
                this.autofocus = false;
                this.outline = false;
            }
        }
        fx.InputConfig = InputConfig;
        class Input extends fx.FormWidget {
            constructor(cfg) {
                super(cfg);
            }
            maxlength(len) {
                if (arguments.length == 0)
                    return this._config.maxlength;
                this._mainEl.prop('maxlength', len);
                this._config.maxlength = len;
                return this;
            }
            placeholder(holder) {
                if (arguments.length == 0)
                    return this._config.placeholder;
                holder = holder || '';
                this._config.placeholder = holder;
                this._mainEl.attr('placeholder', holder);
                return this;
            }
        }
        fx.Input = Input;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var InputConfig = JS.fx.InputConfig;
var Input = JS.fx.Input;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let LineInputFaceMode;
        (function (LineInputFaceMode) {
            LineInputFaceMode["square"] = "square";
            LineInputFaceMode["round"] = "round";
            LineInputFaceMode["pill"] = "pill";
            LineInputFaceMode["shadow"] = "shadow";
        })(LineInputFaceMode = fx.LineInputFaceMode || (fx.LineInputFaceMode = {}));
        class LineInputConfig extends fx.InputConfig {
            constructor() {
                super(...arguments);
                this.inputCls = '';
                this.inputStyle = '';
                this.textAlign = 'left';
                this.faceMode = LineInputFaceMode.square;
            }
        }
        fx.LineInputConfig = LineInputConfig;
        class LineInput extends fx.Input {
            constructor(cfg) {
                super(cfg);
            }
            _inputAttrs(type = 'text') {
                let cfg = this._config, cls = '', shape = LineInputFaceMode.square;
                this._eachMode('faceMode', mode => {
                    cls += ' border-' + mode;
                    if (mode != LineInputFaceMode.shadow)
                        shape = mode;
                });
                if (cfg.leftAddon || cfg.rightAddon)
                    cls += ` border-${cfg.leftAddon ? 'square' : shape}-left border-${cfg.rightAddon ? 'square' : shape}-right`;
                let color = cfg.colorMode;
                if (color)
                    cls += ` ${cfg.outline ? 'border' : 'focus'}-${color}`;
                let style = `text-align:${cfg.textAlign};${cfg.inputStyle}`;
                return {
                    'jsfx-role': 'main',
                    type: type,
                    placeholder: Strings.escapeHTML(cfg.placeholder),
                    autofocus: cfg.autofocus ? 'autofocus' : undefined,
                    readonly: cfg.readonly ? 'readonly' : undefined,
                    disabled: cfg.disabled ? 'disabled' : undefined,
                    maxlength: Number.isFinite(cfg.maxlength) && cfg.maxlength > 0 ? cfg.maxlength + '' : '',
                    style: style,
                    'class': `form-control ${cls} ${cfg.inputCls}`,
                    'data-toggle': 'tooltip',
                    'data-trigger': 'hover focus'
                };
            }
            _inputHtml(type = 'text') {
                return Strings.nodeHTML('input', this._inputAttrs(type));
            }
            _iconHtml(icon, id, lr) {
                if (!icon)
                    return '';
                let me = this, cfg = this._config;
                if (icon.onClick)
                    $(document).on('click', '#' + id, function (e) {
                        if (me.isEnabled())
                            icon.onClick.apply(me, [e.originalEvent, this]);
                        return false;
                    });
                let display = id.endsWith('-clear') && (this.readonly() || !this.isEnabled() || Check.isEmpty(this.value())) ? 'style="display:none;"' : '';
                return `<span id="${id}" title="${icon.tip || ''}" ${display} class="jsfx-input-icon ${lr}-icon">
                <span><i class="${icon.cls} ${cfg.colorMode ? 'text-' + cfg.colorMode : ''}"></i></span></span>`;
            }
            _inputGroup(type) {
                let cfg = this._config, cls = 'jsfx-input-div', innerIcon = Types.isString(cfg.innerIcon) ? { cls: cfg.innerIcon } : cfg.innerIcon, clearIcon = cfg.autoclear ? {
                    cls: 'fas fa-times-circle',
                    tip: 'Clear',
                    onClick: function (e, el) {
                        this.clear();
                        $(el).hide();
                        return false;
                    }
                } : null, leftIcon = cfg.textAlign == 'right' ? clearIcon : innerIcon, rightIcon = cfg.textAlign == 'right' ? innerIcon : clearIcon;
                if (leftIcon)
                    cls += ' left-icon';
                if (rightIcon)
                    cls += ' right-icon';
                return `
                    <div class="${cls}">
                    ${this._inputHtml(type)}
                    ${this._iconHtml(leftIcon, this.id + '-icon' + (cfg.textAlign == 'right' ? '-clear' : ''), 'left')}
                    ${this._iconHtml(rightIcon, this.id + '-icon' + (cfg.textAlign == 'right' ? '' : '-clear'), 'right')}
                    </div>`;
            }
            _bodyFragment(type = 'text') {
                let cfg = this._config, cls = 'jsfx-input-group input-group font-' + (cfg.sizeMode || 'md');
                return `<div class="${cls}">
                            ${cfg.leftAddon ? '<div id="' + this.id + '-btn-left" class="input-group-prepend"/>' : ''}
                            ${this._inputGroup(type)}
                            ${cfg.rightAddon ? '<div id="' + this.id + '-btn-right" class="input-group-append"/>' : ''}
                        </div>`;
            }
            _render() {
                super._render();
                this._renderAddons();
            }
            _onAfterRender() {
                let cfg = this._config;
                if (cfg.autoclear)
                    this._mainEl.on('change input focus blur', () => {
                        if (cfg.disabled || cfg.readonly)
                            return;
                        let clear = $('#' + this.id + '-icon-clear');
                        Check.isEmpty(this._mainEl.val()) ? clear.hide() : clear.show();
                    });
                super._onAfterRender();
            }
            _renderAddon(cfg, id, isLeft) {
                cfg['sizeMode'] = this._config.sizeMode || 'md';
                let fm = [];
                if (this._hasFaceMode('shadow'))
                    fm.push('shadow');
                fm.push(fx.ButtonFaceMode.square);
                if (this._hasFaceMode('round', cfg)) {
                    fm.push(isLeft ? fx.ButtonFaceMode.round_left : fx.ButtonFaceMode.round_right);
                }
                else if (this._hasFaceMode('round')) {
                    fm.push(isLeft ? fx.ButtonFaceMode.round_left : fx.ButtonFaceMode.round_right);
                }
                else if (this._hasFaceMode('pill', cfg)) {
                    fm.push(isLeft ? fx.ButtonFaceMode.pill_left : fx.ButtonFaceMode.pill_right);
                }
                else if (this._hasFaceMode('pill')) {
                    fm.push(isLeft ? fx.ButtonFaceMode.pill_left : fx.ButtonFaceMode.pill_right);
                }
                cfg.faceMode = fm;
                if (!cfg.onClick && !cfg.dropMenu)
                    cfg['style'] = 'cursor:default;';
                cfg['id'] = id;
                cfg.colorMode = cfg.colorMode || this._config.colorMode || fx.ColorMode.primary;
                let btn = new fx.Button(cfg);
                if (cfg.onClick)
                    btn.on('click', () => {
                        cfg.onClick.apply(this);
                    });
            }
            _toAddon(addon) {
                return Types.isString(addon) ? { text: addon } : addon;
            }
            _renderAddons() {
                let cfg = this._config;
                if (cfg.leftAddon)
                    this._renderAddon(this._toAddon(cfg.leftAddon), this.id + '-btn-left', true);
                if (cfg.rightAddon)
                    this._renderAddon(this._toAddon(cfg.rightAddon), this.id + '-btn-right', false);
            }
            _showError(msg) {
                super._showError(msg);
                this._mainEl.addClass('jsfx-input-error');
                this.widgetEl.find('[jsfx-role=body]').find('.jsfx-input-icon i').addClass('text-danger');
            }
            _hideError() {
                super._hideError();
                this._mainEl.removeClass('jsfx-input-error');
                this.widgetEl.find('[jsfx-role=body]').find('.jsfx-input-icon i').removeClass('text-danger');
            }
        }
        fx.LineInput = LineInput;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var LineInputFaceMode = JS.fx.LineInputFaceMode;
var LineInputConfig = JS.fx.LineInputConfig;
var LineInput = JS.fx.LineInput;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class DatePickerConfig extends fx.LineInputConfig {
            constructor() {
                super(...arguments);
                this.title = '';
                this.format = 'YYYY-MM-DD';
                this.autoclose = false;
                this.todayBtn = false;
                this.todayHighlight = false;
                this.calendarWeeks = false;
                this.clearBtn = false;
                this.orientation = 'auto';
                this.embedded = false;
                this.multidateSeparator = ',';
            }
        }
        fx.DatePickerConfig = DatePickerConfig;
        let DatePicker = class DatePicker extends fx.LineInput {
            constructor(cfg) {
                super(cfg);
            }
            showPicker() {
                this._picker.datepicker('show');
                return this;
            }
            hidePicker() {
                this._picker.datepicker('hide');
                return this;
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value();
                return super.value(Types.isDate(val) ? val.format(this._config.format) : val, silent);
            }
            _renderValue() {
                let v = this.value() || '';
                if (this._mainEl.val() !== v)
                    this._picker.datepicker('update', v);
                return this;
            }
            _inputHtml() {
                let cfg = this._config;
                if (!cfg.embedded)
                    return super._inputHtml();
                return `<div id="${this.id}_picker"></div><input name="${this.name()}" type="hidden" jsfx-role="main">`;
            }
            _onBeforeRender() {
                if (this._picker)
                    this._picker.datepicker('destroy');
                if (!this._config.embedded)
                    super._onBeforeRender();
            }
            _onAfterRender() {
                let cfg = Jsons.clone(this._config), el = cfg.embedded ? $(`#${this.id}_picker`) : this._mainEl;
                cfg.orientation = { auto: 'auto', lt: 'left top', lb: 'left bottom', rt: 'right top', rb: 'right bottom' }[cfg.orientation];
                let c = cfg;
                c.immediateUpdates = true;
                c.language = cfg.locale;
                c.enableOnReadonly = false;
                c.todayBtn = cfg.todayBtn ? 'linked' : false;
                c.startDate = cfg.minDate;
                c.endDate = cfg.maxDate;
                c.weekStart = 1;
                c.updateViewDate = false;
                c.format = cfg.format.replace(/YYYY|YY|MMMM|MMM|MM|M|DD|D|dddd|ddd/g, function (m) {
                    switch (m) {
                        case "YYYY":
                            return 'yyyy';
                        case "YY":
                            return 'yy';
                        case "MMMM":
                            return 'MM';
                        case "MMM":
                            return 'M';
                        case "MM":
                            return 'mm';
                        case "M":
                            return 'm';
                        case "DD":
                            return 'dd';
                        case "D":
                            return 'd';
                        case "dddd":
                            return 'DD';
                        case "ddd":
                            return 'D';
                        default: return m;
                    }
                });
                this._picker = el.datepicker(c);
                this._picker.on('show', () => {
                    if ($('.datepicker').css('display') == 'block')
                        this._fire('pickershown');
                });
                this._picker.on('hide', () => {
                    this._fire('pickerhidden');
                });
                this._picker.on('changeDate', () => {
                    this._setValue(this._picker.datepicker('getFormattedDate'));
                });
                this._mainEl.on('input change blur', () => {
                    let newVal = this._mainEl.val();
                    if (this.value() != newVal)
                        this._setValue(newVal);
                });
                super._onAfterRender();
            }
            _destroy() {
                if (this._picker)
                    this._picker.datepicker('destroy');
                super._destroy();
            }
        };
        DatePicker = __decorate([
            widget('JS.fx.DatePicker'),
            __metadata("design:paramtypes", [DatePickerConfig])
        ], DatePicker);
        fx.DatePicker = DatePicker;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var DatePickerConfig = JS.fx.DatePickerConfig;
var DatePicker = JS.fx.DatePicker;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class DateRangePickerConfig extends fx.LineInputConfig {
            constructor() {
                super(...arguments);
                this.readonly = false;
                this.format = 'YYYY/MM/DD';
                this.dateSeparator = ' - ';
                this.popDir = 'center';
                this.autoclose = false;
                this.minutesPlus = false;
                this.secondsPlus = false;
                this.showCalendars = true;
            }
        }
        fx.DateRangePickerConfig = DateRangePickerConfig;
        let DateRangePicker = class DateRangePicker extends fx.LineInput {
            constructor(cfg) {
                super(cfg);
            }
            _autoFormat() {
                let cfg = this._config;
                if (cfg.secondsPlus)
                    return 'YYYY/MM/DD HH:mm:ss';
                if (cfg.minutesPlus)
                    return 'YYYY/MM/DD HH:mm';
                return 'YYYY/MM/DD';
            }
            _equalValues(newVal, oldVal) {
                if (!oldVal && !newVal)
                    return true;
                if (!oldVal || !newVal)
                    return false;
                return oldVal[0] == newVal[0] && oldVal[1] == newVal[1];
            }
            _errorType(val) {
                throw new TypeError('An invalid date format for DateRangePicker:' + val.toString());
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value();
                let cfg = this._config, arr = null;
                if (val) {
                    arr = [];
                    if (Types.isArray(val)) {
                        if (val.length < 2)
                            this._errorType(val);
                        arr = [this._formatDate(val[0]), this._formatDate(val[1])];
                    }
                    else if (val.indexOf(cfg.dateSeparator) < 0) {
                        this._errorType(val);
                    }
                    else {
                        arr = val.split(cfg.dateSeparator);
                    }
                }
                return super.value(arr, silent);
            }
            _formatDate(date) {
                let d = date ? date : new Date();
                return Types.isDate(d) ? d.format(this._config.format || this._autoFormat()) : (d || '');
            }
            _dateString(val) {
                let cfg = this._config;
                return Check.isEmpty(val) ? '' : `${this._formatDate(val[0])}${cfg.dateSeparator}${this._formatDate(val[1])}`;
            }
            _renderValue() {
                let val = this.value(), today = new Date(), text = this._dateString(val);
                if (text != this._mainEl.val()) {
                    this._mainEl.val(text);
                    if (this._picker) {
                        let d1 = val ? val[0] || today : today, d2 = val ? val[1] || today : today;
                        this._mainEl.data('daterangepicker').setStartDate(d1);
                        this._mainEl.data('daterangepicker').setEndDate(d2);
                    }
                }
                if (text && this.isEnabled() && !this.readonly())
                    $(`#${this.id}-icon-clear`).show();
                return this;
            }
            _onAfterRender() {
                let cfg = this._config, value = this.value(), val = [undefined, undefined];
                if (value) {
                    if (!value[0])
                        value[0] = undefined;
                    if (!value[1])
                        value[1] = undefined;
                    val = [value[0], value[1]];
                }
                let c = {
                    showDropdowns: true,
                    startDate: val[0],
                    endDate: val[1],
                    minDate: cfg.minDate,
                    maxDate: cfg.maxDate,
                    minYear: cfg.minYear,
                    maxYear: cfg.maxYear,
                    opens: cfg.popDir,
                    drops: cfg.dropPos,
                    locale: Jsons.union(this._i18n(), { format: this._autoFormat() }, { format: cfg.format, separator: cfg.dateSeparator }),
                    autoUpdateInput: false,
                    autoApply: cfg.autoclose,
                    timePicker: cfg.secondsPlus || cfg.minutesPlus,
                    timePickerSeconds: cfg.secondsPlus,
                    timePickerIncrement: cfg.minutesStep,
                    timePicker24Hour: true,
                    ranges: cfg.ranges,
                    linkedCalendars: false,
                    showCustomRangeLabel: false,
                    alwaysShowCalendars: cfg.showCalendars
                };
                cfg.format = c.locale['format'];
                cfg.dateSeparator = c.locale['separator'];
                if (cfg.maxlength && Number.isFinite(cfg.maxlength))
                    c.maxSpan = { days: 7 };
                this._picker = this._mainEl.daterangepicker(c);
                this._picker.on('show.daterangepicker', () => {
                    this._fire('pickershown');
                });
                this._picker.on('hide.daterangepicker', () => {
                    this._fire('pickerhidden');
                });
                this._picker.on('cancel.daterangepicker', () => {
                    this._fire('pickercanceled');
                });
                this._picker.on('apply.daterangepicker', (e, picker) => {
                    let format = picker.locale.format, d1 = picker.startDate.format(format), d2 = picker.endDate.format(format);
                    this._setValue([d1, d2]);
                    this._mainEl.val(this._dateString([d1, d2]));
                    this._autoclear();
                });
                this._iniValue();
                this._autoclear();
            }
            _autoclear() {
                let cfg = this._config;
                if (cfg.autoclear && !cfg.disabled && !cfg.readonly) {
                    let clear = $('#' + this.id + '-icon-clear');
                    Check.isEmpty(this.value()) ? clear.hide() : clear.show();
                }
            }
        };
        DateRangePicker = __decorate([
            widget('JS.fx.DateRangePicker'),
            __metadata("design:paramtypes", [DateRangePickerConfig])
        ], DateRangePicker);
        fx.DateRangePicker = DateRangePicker;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var DateRangePickerConfig = JS.fx.DateRangePickerConfig;
var DateRangePicker = JS.fx.DateRangePicker;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let DialogFaceMode;
        (function (DialogFaceMode) {
            DialogFaceMode["round"] = "round";
            DialogFaceMode["square"] = "square";
        })(DialogFaceMode = fx.DialogFaceMode || (fx.DialogFaceMode = {}));
        class DialogConfig extends fx.WidgetConfig {
            constructor() {
                super(...arguments);
                this.title = '';
                this.faceMode = DialogFaceMode.square;
                this.hidden = true;
                this.html = '';
                this.autoDestroy = true;
            }
        }
        fx.DialogConfig = DialogConfig;
        ;
        let Dialog = class Dialog extends fx.Widget {
            constructor(config) {
                super(config);
                this._loaded = false;
            }
            load(api, params, encode) {
                let cfg = this._config, remote = api || cfg.url;
                if (!remote)
                    return;
                let url = new URI(remote).queryObject(params, encode).toString();
                cfg.url = url;
                this._mainEl.find('div.modal-body').off().empty().html('<iframe frameborder="0" width="100%" height="100%" src="' + url + '"></iframe>');
            }
            show() {
                if (!this._loaded)
                    this.load();
                this._mainEl.modal('show');
                return this;
            }
            hide() {
                this._mainEl.modal('hide');
                return this;
            }
            toggle() {
                this._mainEl.modal('toggle');
                return this;
            }
            isShown() {
                let d = this._mainEl.data('bs.modal');
                return d ? d._isShown : false;
            }
            _render() {
                let cfg = this._config, cHtml = cfg.html ? (Types.isString(cfg.html) ? cfg.html : $(cfg.html).html()) : '';
                let btnHtml = '', buttons = cfg.buttons;
                if (buttons && buttons.length > 0) {
                    btnHtml = '<div class="modal-footer">';
                    buttons.forEach((opt, i) => {
                        btnHtml += `<button id="${this.id + '_button' + i}" type="button" class="btn btn-${opt.colorMode || fx.ColorMode.primary}" data-dismiss="modal">${opt.text}</button>`;
                    });
                    btnHtml += '</div>';
                }
                let titleHtml = '';
                if (cfg.title)
                    titleHtml = `
                <div class="modal-header">
                <div class="modal-title">${cfg.title}</div>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
                </div>
                `;
                let html = `
                <div class="modal fade" tabindex="-1" role="dialog" aria-hidden="false" jsfx-role="main">
                    <div class="modal-dialog modal-dialog-centered" role="document" style="min-width:${CssTool.normValue(cfg.width, 'auto')}">
                    <div class="modal-content" style="border-radius:${this._hasFaceMode(DialogFaceMode.round) ? '0.3rem' : '0px'}">
                        ${titleHtml}
                        <div class="modal-body jsfx-dialog-body" style="height:${CssTool.normValue(cfg.height, '100%')}">
                        ${cHtml}
                        </div>
                        ${btnHtml}
                    </div>
                    </div>
                </div>
                `;
                this.widgetEl.html(html);
                this._renderChildren();
                let btnCt = this.widgetEl.find('div.modal-footer');
                if (buttons && btnCt.length == 1) {
                    buttons.forEach((opt, i) => {
                        let me = this;
                        if (opt.onClick)
                            $('#' + this.id + '_button' + i).click(function (e) {
                                return opt.onClick.apply(me, [e.originalEvent, this, i]);
                            });
                    });
                }
                this._mainEl = this.widgetEl.find('[jsfx-role=main]');
                this._mainEl.off();
                this._mainEl.on('show.bs.modal', () => { this._fire('showing'); });
                this._mainEl.on('shown.bs.modal', () => { this._fire('shown'); });
                this._mainEl.on('hide.bs.modal', () => { this._fire('hiding'); });
                this._mainEl.on('hidden.bs.modal', () => {
                    this._fire('hidden');
                    if (this._config.autoDestroy)
                        this.destroy();
                });
                this._mainEl.modal({
                    backdrop: 'static',
                    show: !cfg.hidden
                });
            }
            _destroy() {
                super._destroy();
                this._mainEl.modal('dispose');
                $('div.modal-backdrop').remove();
                Jsons.forEach(this._children, wgt => {
                    wgt.destroy();
                });
            }
            buttons() {
                return this._mainEl.find('div.modal-footer button');
            }
            child(id) {
                return id ? this._children : this._children[id];
            }
            _renderChildren() {
                let els = this.widgetEl.find(`div.modal-body div[${View.WIDGET_ATTRIBUTE}]`);
                if (els.length < 1)
                    return;
                this._children = {};
                let wConfigs = this._config.childWidgets;
                els.each((i, e) => {
                    let el = $(e), name = el.attr('name'), id = el.attr('id'), alias = el.attr(View.WIDGET_ATTRIBUTE);
                    let cfg = Jsons.union(wConfigs && wConfigs[id], { id: id, name: name });
                    this._children[id] = Class.aliasInstance(alias, cfg);
                });
            }
            _onAfterInit() {
                if (!this._config.hidden)
                    this.show();
            }
        };
        Dialog = __decorate([
            widget('JS.fx.Dialog'),
            __metadata("design:paramtypes", [DialogConfig])
        ], Dialog);
        fx.Dialog = Dialog;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Dialog = JS.fx.Dialog;
var DialogConfig = JS.fx.DialogConfig;
var DialogFaceMode = JS.fx.DialogFaceMode;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class TextInputConfig extends fx.LineInputConfig {
        }
        fx.TextInputConfig = TextInputConfig;
        let TextInput = class TextInput extends fx.LineInput {
            constructor(cfg) {
                super(cfg);
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value();
                return super.value(val, silent);
            }
            _onAfterRender() {
                this._mainEl.off('input change paste').on('input change paste', () => {
                    this._setValue(this._mainEl.val());
                });
                super._onAfterRender();
            }
        };
        TextInput = __decorate([
            widget('JS.fx.TextInput'),
            __metadata("design:paramtypes", [TextInputConfig])
        ], TextInput);
        fx.TextInput = TextInput;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var TextInput = JS.fx.TextInput;
var TextInputConfig = JS.fx.TextInputConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class EmailInputConfig extends fx.TextInputConfig {
            constructor() {
                super(...arguments);
                this.multiple = false;
                this.innerIcon = 'fa fa-envelope-o';
            }
        }
        fx.EmailInputConfig = EmailInputConfig;
        let EmailInput = class EmailInput extends fx.TextInput {
            constructor(cfg) {
                super(cfg);
            }
            _bodyFragment() {
                return super._bodyFragment('email');
            }
            _onAfterRender() {
                super._onAfterRender();
                this._mainEl.prop('multiple', this._config.multiple);
            }
        };
        EmailInput = __decorate([
            widget('JS.fx.EmailInput'),
            __metadata("design:paramtypes", [EmailInputConfig])
        ], EmailInput);
        fx.EmailInput = EmailInput;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var EmailInput = JS.fx.EmailInput;
var EmailInputConfig = JS.fx.EmailInputConfig;
var JS;
(function (JS) {
    let model;
    (function (model) {
        ;
        class PageModelConfig extends model.ListModelConfig {
            constructor() {
                super(...arguments);
                this.dataQuery = {
                    url: '',
                    pageSize: Infinity,
                    page: 1
                };
                this.parametersMapping = {
                    totalField: 'total',
                    pageField: 'page',
                    pageSizeField: 'pageSize',
                    sortersField: 'sorters'
                };
            }
        }
        model.PageModelConfig = PageModelConfig;
        let PageModel = class PageModel extends model.ListModel {
            constructor(cfg) {
                super(cfg);
                this._cacheTotal = null;
            }
            _initConfig(cfg) {
                return Jsons.union(new PageModelConfig(), cfg);
            }
            _newParams(query) {
                let json = {}, cfg = this._config, mapping = cfg.parametersMapping;
                json[mapping.pageSizeField] = (!query.pageSize || query.pageSize == Infinity) ? '' : query.pageSize;
                json[mapping.pageField] = query.page || 1;
                json[mapping.totalField] = this._cacheTotal == null ? '' : this._cacheTotal;
                let sorters = this._config.sorters, s = '';
                if (sorters) {
                    sorters.forEach((sorter) => {
                        s += `${sorter.field} ${sorter.dir ? sorter.dir : 'asc'},`;
                    });
                    json[mapping.sortersField] = s.slice(0, s.length - 1);
                }
                return URI.toQueryString(json) + '&' + (Types.isString(query.data) ? query.data : URI.toQueryString(query.data));
            }
            load(quy, silent) {
                this._check();
                let me = this, query = Jsons.union(Http.toRequest(this._config.dataQuery), Http.toRequest(quy));
                this._fire('loading', [query]);
                me._config.dataQuery = query;
                return new model.JsonProxy().execute({
                    method: query.method,
                    url: query.url,
                    data: me._newParams(query)
                }).then(function (result) {
                    if (result.success()) {
                        me.total(result.total());
                        me.setData(result.data(), silent);
                        me._fire('loadsuccess', [result]);
                        let oldPage = me.getCurrentPage(), newPage = query.page;
                        if (oldPage != newPage)
                            me._fire('pagechanged', [newPage, oldPage]);
                    }
                    else {
                        me._fire('loadfailure', [result]);
                    }
                    return Promise.resolve(result);
                }).catch(function (err) {
                    me._fire('loaderror', [err]);
                });
            }
            reload() {
                return this.load(null);
            }
            loadPage(page, isForce) {
                if (!isForce && this.getCurrentPage() == page)
                    return;
                return this.load({ page: page });
            }
            total(total) {
                if (arguments.length == 0)
                    return this._cacheTotal || this.size();
                this._cacheTotal = total == void 0 ? null : total;
                return this;
            }
            pageSize(size) {
                let cfg = this._config, query = cfg.dataQuery;
                if (arguments.length == 0)
                    return query.pageSize;
                query.pageSize = size == void 0 ? Infinity : size;
                return this;
            }
            getCurrentPage() {
                let cfg = this._config;
                return cfg.dataQuery.page;
            }
            getPrevPage() {
                let page = this.getCurrentPage();
                return page <= 1 ? 1 : page - 1;
            }
            getNextPage() {
                let currentPage = this.getCurrentPage(), totalPages = this.getLastPage();
                return (currentPage + 1 > totalPages) ? totalPages : (currentPage + 1);
            }
            getFirstPage() {
                return 1;
            }
            getLastPage() {
                let total = this.total(), pageSize = this.pageSize();
                if (total == 0 || !isFinite(pageSize))
                    return 1;
                let max = Math.ceil(total / pageSize);
                return max == 0 ? 1 : max;
            }
            loadPrevPage() {
                return this.loadPage(this.getPrevPage());
            }
            loadNextPage() {
                return this.loadPage(this.getNextPage());
            }
            loadFirstPage() {
                return this.loadPage(1);
            }
            loadLastPage() {
                return this.loadPage(this.getLastPage());
            }
        };
        PageModel = __decorate([
            klass('JS.model.PageModel'),
            __metadata("design:paramtypes", [PageModelConfig])
        ], PageModel);
        model.PageModel = PageModel;
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var PageModel = JS.model.PageModel;
var PageModelConfig = JS.model.PageModelConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let GridFaceMode;
        (function (GridFaceMode) {
            GridFaceMode["striped"] = "striped";
            GridFaceMode["outline"] = "outline";
            GridFaceMode["inline"] = "inline";
        })(GridFaceMode = fx.GridFaceMode || (fx.GridFaceMode = {}));
        class GridConfig extends fx.WidgetConfig {
            constructor() {
                super(...arguments);
                this.checkable = false;
                this.dataModel = PageModel;
                this.data = [];
                this.autoLoad = true;
                this.headStyle = {
                    textAlign: 'left'
                };
                this.bodyStyle = {
                    textAlign: 'left'
                };
                this.pageSizes = [10, 20, 30, 50];
                this.pagingBar = false;
                this.i18n = null;
            }
        }
        fx.GridConfig = GridConfig;
        let Grid = class Grid extends fx.Widget {
            constructor(cfg) {
                super(cfg);
                this._hChk = null;
                this._bChks = null;
            }
            getFieldName(col) {
                let cfg = this._config, cols = cfg.columns;
                if (col <= 0 || col >= cols.length)
                    return null;
                return cols[col + 1].field;
            }
            getCellNode(row, col) {
                return $(`#${this.id}_btable`).find(`td>div[jsfx-row=${row}][jsfx-col=${col}]`);
            }
            dataModel() {
                return this._dataModel;
            }
            _initDataModel() {
                let cfg = this._config;
                this._dataModel = Class.newInstance(cfg.dataModel, {
                    iniData: cfg.data,
                    pageSize: cfg.dataQuery.pageSize
                });
                ['loading', 'loadsuccess', 'loadfailure', 'loaderror', 'dataupdating', 'dataupdated'].forEach(e => {
                    let me = this;
                    this._dataModel.on(e, function () {
                        if (e == 'dataupdated')
                            me.data(this.getData(), true);
                        me._fire(e, Arrays.slice(arguments, 1));
                    });
                });
            }
            _onBeforeInit() {
                let cfg = this._config;
                cfg.dataQuery = Jsons.union({
                    page: 1,
                    pageSize: cfg.pageSizes ? cfg.pageSizes[0] : Infinity
                }, Http.toRequest(cfg.dataQuery));
                cfg.dataModel = PageModel;
                this._initDataModel();
            }
            _headChk() {
                if (this._hChk == null)
                    this._hChk = $(`#${this.id}_htable tr>th:first-child input:checkbox`);
                return this._hChk;
            }
            _bodyChks() {
                if (this._bChks == null)
                    this._bChks = $(`#${this.id}_btable tr>td:first-child input:checkbox`);
                return this._bChks;
            }
            _newCheckbox(el, id, i) {
                let me = this, cfg = me._config;
                new fx.Checkbox({
                    renderTo: el,
                    width: 'auto',
                    colorMode: cfg.colorMode,
                    sizeMode: cfg.sizeMode,
                    data: [{ id: id }]
                }).on('click', function () {
                    this.isSelected() ? me.select(i) : me.unselect(i);
                });
            }
            _bindHeadCheckbox() {
                if (!this._config.checkable)
                    return;
                this._hChk = null;
                let span = $(`#${this.id}_htable tr>th:first-child span[${View.WIDGET_ATTRIBUTE}=checkbox]`);
                this._newCheckbox(span, '-1');
            }
            _bindBodyCheckbox() {
                if (!this._config.checkable)
                    return;
                this._bChks = null;
                let me = this, spans = $(`#${this.id}_btable tr>td:first-child span[${View.WIDGET_ATTRIBUTE}=checkbox]`);
                spans.each(function (i) {
                    me._newCheckbox(this, $(this).attr('jsfx-id'), i + 1);
                });
            }
            isSelected(row) {
                let chks = this._bodyChks();
                if (chks.length == 0)
                    return false;
                return $(chks.get(row)).prop('checked');
            }
            select(i) {
                if (arguments.length == 0 || i == void 0) {
                    this._headChk().prop('checked', true);
                    this._bodyChks().prop('checked', true);
                    if (this.checkable())
                        $(`#${this.id}_btable`).find(`tr`).addClass('selected');
                    this._fire('allselected');
                    return;
                }
                $(this._bodyChks().get(i)).prop('checked', true);
                if (this.checkable())
                    $(`#${this.id}_btable`).find(`tr[jsfx-row=${i}]`).addClass('selected');
                this._fire('selected', [i]);
                if (this._bodyChks().not(':checked').length == 0) {
                    this._headChk().prop('checked', true);
                    if (this.checkable())
                        $(`#${this.id}_btable`).find(`tr`).addClass('selected');
                    this._fire('allselected');
                }
            }
            unselect(i) {
                if (arguments.length == 0 || i == void 0) {
                    this._headChk().prop('checked', false);
                    this._bodyChks().prop('checked', false);
                    if (this.checkable())
                        $(`#${this.id}_btable`).find(`tr`).removeClass('selected');
                    this._fire('allunselected');
                    return;
                }
                $(this._bodyChks().get(i)).prop('checked', false);
                if (this.checkable())
                    $(`#${this.id}_btable`).find(`tr[jsfx-row=${i}]`).removeClass('selected');
                this._fire('unselected', [i]);
                this._headChk().prop('checked', false);
                if (this._bodyChks().not(':not(:checked)').length == 0) {
                    if (this.checkable())
                        $(`#${this.id}_btable`).find(`tr`).removeClass('selected');
                    this._fire('allunselected');
                }
            }
            getSelectedIds() {
                let chks = this._bodyChks(), ids = [];
                chks.each((i, el) => {
                    let n = $(el);
                    if (n.prop('checked'))
                        ids[ids.length] = n.val();
                });
                return ids;
            }
            getSelectedData() {
                let chks = this._bodyChks(), data = [], cData = this.data();
                chks.each((i, el) => {
                    if ($(el).prop('checked')) {
                        data.push(cData[i]);
                    }
                });
                return data;
            }
            checkable() {
                return this._config.checkable;
            }
            hideCheckbox() {
                this.widgetEl.find('.table tr').find('th:eq(0),td:eq(0)').find('.jsfx-checkbox').hide();
            }
            showCheckbox() {
                this.widgetEl.find('.table tr').find('th:eq(0),td:eq(0)').find('.jsfx-checkbox').show();
            }
            _colIndexOf(field) {
                let name = field;
                let col = this._config.columns.findIndex((option) => {
                    return option.field == name;
                });
                if (col < 0)
                    throw new NotFoundError(`Not found the field:<${name}>`);
                return col;
            }
            hideColumn(v) {
                let i = Types.isNumeric(v) ? v - 1 : this._colIndexOf(v);
                this.widgetEl.find(`tr th:eq(${i}),tr td:eq(${i})`).hide();
            }
            showColumn(v) {
                let i = Types.isNumeric(v) ? v - 1 : this._colIndexOf(v);
                this.widgetEl.find(`tr th:eq(${i}),tr td:eq(${i})`).show();
            }
            _bindSortFields() {
                let cols = this._config.columns;
                cols.forEach((col) => {
                    if (col.sortable)
                        this._bindSortField(col.field, Types.isBoolean(col.sortable) ? 'desc' : col.sortable);
                });
            }
            _bindSortField(fieldName, defaultDir) {
                let me = this, el = this.widgetEl.find('#' + this.id + '_sort_' + fieldName);
                el.click(function () {
                    let jEl = $(this);
                    if (jEl.hasClass('la-arrow-up')) {
                        me._sortField(fieldName, 'desc', jEl);
                    }
                    else {
                        me._sortField(fieldName, 'asc', jEl);
                    }
                    me.reload();
                });
                this._sortField(fieldName, defaultDir, el);
            }
            _sortField(field, dir, el) {
                let model = this._dataModel;
                if ('desc' == dir) {
                    el.removeClass('la-arrow-up').addClass('la-arrow-down');
                    model.addSorter(field, 'desc');
                }
                else {
                    el.removeClass('la-arrow-down').addClass('la-arrow-up');
                    model.addSorter(field, 'asc');
                }
            }
            _thHtml(col, colNumber) {
                let cfg = this._config, html = col.text, title = col.tip ? col.tip : col.text, sortDir = col.sortable === true ? 'desc' : '' + col.sortable, sort = col.sortable ? `<i id="${this.id + '_sort_' + col.field}" style="cursor:pointer;vertical-align:middle;" class="la la-arrow-${sortDir == 'asc' ? 'up' : 'down'}"></i>` : '', hasCheckbox = colNumber == 1 && cfg.checkable, width = CssTool.normValue(col.width, '100%'), cell = `<div class="cell items-${cfg.headStyle.textAlign} items-middle" jsfx-col="${colNumber}" title="${title}">
                    ${html}${sort ? sort : ''}</div>`;
                if (col.sortable)
                    this._dataModel.addSorter(col.field, sortDir);
                return `<th width="${width}" nowrap>
                ${hasCheckbox ? `<div class="items-left items-middle"><span ${View.WIDGET_ATTRIBUTE}="checkbox"/>${cell}</div>` : cell}
                </th>`;
            }
            _tdHtml(opt, html, title, col, row) {
                let cfg = this._config, hasCheckbox = col == 0 && cfg.checkable, id = this.data()[row]['id'], width = CssTool.normValue(opt.width, '100%'), cell = `<div class="cell items-${cfg.bodyStyle.textAlign} items-middle" jsfx-row="${row}" jsfx-col="${col}" title="${title}">
                    ${html}</div>`;
                return `<td width="${width}" nowrap>
                ${hasCheckbox ? `<div class="items-left items-middle" jsfx-row="${row}" jsfx-col="${col}"><span ${View.WIDGET_ATTRIBUTE}="checkbox" jsfx-id="${id}"/>${cell}</div>` : cell}
                </td>`;
            }
            _headHtml(columns) {
                let html = '';
                columns.forEach((col, i) => {
                    html += this._thHtml(col, i + 1);
                }, this);
                return html;
            }
            _renderBody() {
                let cfg = this._config, columns = cfg.columns, data = this.data() || [];
                if (!columns)
                    return;
                let html = '';
                data.forEach((rowData, rowIndex) => {
                    if (rowData) {
                        let tr = '';
                        columns.forEach((col, colIndex) => {
                            if (col) {
                                let val = rowData[col.field], hVal = val == void 0 ? '' : Strings.escapeHTML(String(val));
                                tr += this._tdHtml(col, col.renderer ? col.renderer.call(this, val, colIndex, rowIndex) : hVal, hVal, colIndex, rowIndex);
                            }
                        });
                        tr = `<tr jsfx-row="${rowIndex}">${tr}</tr>`;
                        html += tr;
                    }
                });
                Check.isEmpty(data) ? $(`#${this.id}_nodata`).show() : $(`#${this.id}_nodata`).hide();
                $(`#${this.id}_btable>tbody`).off().empty().html(html)
                    .off('click', 'tr').on('click', 'tr', (e) => {
                    let row = $(e.currentTarget), rowNumber = parseInt(row.attr('jsfx-row'));
                    this._fire('rowclick', [rowNumber]);
                    if (this.checkable())
                        this.isSelected(rowNumber) ? this.unselect(rowNumber) : this.select(rowNumber);
                    return false;
                })
                    .off('click', 'td>div').on('click', 'td>div', (e) => {
                    let row = $(e.currentTarget), colNumber = parseInt(row.attr('jsfx-col')), rowNumber = parseInt(row.attr('jsfx-row'));
                    this._fire('cellclick', [rowNumber, colNumber]);
                    return true;
                });
                this._bindBodyCheckbox();
            }
            _pageHtml(page) {
                let model = this._dataModel;
                return `
                <li>
                    <a class="pager-link pager-link-number ${model.getCurrentPage() == page ? 'selected' : ''}" data-page="${page}" title="${page}">${page}</a>
                </li>
                `;
            }
            _pagesHtml() {
                let model = this._dataModel, page = model.getCurrentPage(), lastPage = model.getLastPage(), html = '';
                let begin = page < 6 ? 1 : ((lastPage - 4) <= page ? lastPage - 4 : page - 2), end = (begin + 4) > lastPage ? lastPage : (begin + 4), empty = '<li><a href="javascript:void(0);">...</a></li>';
                if (begin > 1)
                    html += empty;
                for (let i = begin; i <= end; i++) {
                    html += this._pageHtml(i);
                }
                if ((lastPage - end) > 0)
                    html += empty;
                return html;
            }
            _pagesizeHtml(pagesize) {
                let cfg = this._config, size = cfg.dataQuery.pageSize, selected = size == pagesize ? '<i class="fa fa-check"></i>' : '';
                return `<button class="dropdown-item ${cfg.sizeMode ? 'btn-' + cfg.sizeMode : ''} ${selected ? 'selected' : ''}" jsfx-pagesize="${pagesize}">${pagesize}${selected}</button>`;
            }
            _pagesizesHtml() {
                let pageSizes = this._config.pageSizes;
                if (!pageSizes)
                    return '';
                let html = '';
                pageSizes.forEach(size => {
                    html += this._pagesizeHtml(size);
                });
                return html;
            }
            _renderPagingbar() {
                if (!this._config.pagingBar)
                    return;
                let cfg = this._config, model = this._dataModel, el = $(`#${this.id}_pagingbar`), page = model.getCurrentPage(), prevPage = model.getPrevPage(), nextPage = model.getNextPage(), lastPage = model.getLastPage(), pageSize = cfg.dataQuery.pageSize, total = model.total(), beginRow = total == 0 ? 0 : pageSize * (page - 1) + 1, endRow = total == 0 ? 0 : (page == lastPage ? total : page * pageSize);
                let rowsInfo = Strings.merge(this._i18n('rowsInfo'), {
                    beginRow: beginRow,
                    endRow: endRow,
                    total: total
                }) || '', html = `<ul class="pager-nav">
                    <li>
                        <a title="${this._i18n('firstPage')}" class="pager-link pager-link-arrow" data-page="1">
                            <i class="la la-angle-double-left"></i>
                        </a>
                    </li>
                    <li>
                        <a title="${this._i18n('previousPage')}" class="pager-link pager-link-arrow" data-page="${prevPage}">
                            <i class="la la-angle-left"></i>
                        </a>
                    </li>
                    ${this._pagesHtml()}
                    <li>
                        <a title="${this._i18n('nextPage')}" class="pager-link pager-link-arrow" data-page="${nextPage}">
                            <i class="la la-angle-right"></i>
                        </a>
                    </li>
                    <li>
                        <a title="${this._i18n('lastPage')}" class="pager-link pager-link-arrow" data-page="${lastPage}">
                            <i class="la la-angle-double-right"></i>
                        </a>
                    </li>
                </ul>
                <div class="pager-info items-middle">
                    <div class="btn-group dropup">
                        <button id="${this.id}_pagesize" title="选择每页条数" class="btn dropdown-toggle ${cfg.sizeMode ? 'btn-' + cfg.sizeMode : ''}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        ${pageSize}
                        </button>
                        <div class="dropdown-menu">
                        ${this._pagesizesHtml()}
                        </div>
                    </div>
                    <span class="pager-detail">${rowsInfo}</span>
                </div>`;
                el.html(html);
                let me = this, pages = this.widgetEl.find('a.pager-link');
                pages.click(function () {
                    let pNumber = parseInt($(this).attr('data-page'));
                    if (pNumber)
                        me.loadPage(pNumber);
                });
                let buttons = this.widgetEl.find('div.pager-info div.dropdown-menu>button');
                buttons.click(function () {
                    me._changePageSize($(this));
                });
                this.unselect();
            }
            _changePageSize(el) {
                el.siblings().removeClass('selected').find('i').remove();
                el.remove('i').addClass('selected').append('<i class="fa fa-check"></i>');
                let pageSize = parseInt(el.attr('jsfx-pagesize'));
                $('#' + this.id + '_pagesize').text(pageSize);
                this.load({ pageSize: pageSize });
            }
            loadPage(page) {
                return this._dataModel.loadPage(page);
            }
            clear() {
                return this.data(null);
            }
            _render() {
                let cfg = this._config, heights = {
                    md: 34
                }, bodyCls = 'table';
                if (this._hasFaceMode(GridFaceMode.striped))
                    bodyCls += ' striped';
                let hStyle = cfg.headStyle, bStyle = cfg.bodyStyle, bHeight = Types.isNumeric(cfg.height) ? (cfg.height - heights[cfg.sizeMode]) + 'px' : '100%', html = `<!-- 表头容器 -->
                    <div class="head">
                        <table id="${this.id}_htable" class="table ${hStyle.cls || ''}">
                            <tr>
                            ${this._headHtml(cfg.columns)}
                            </tr>
                        </table>
                    </div>
                    <!-- 表体容器-->
                    <div class="body" style="height:${bHeight};min-height:${bHeight};max-height:${bHeight};">
                        <div id="${this.id}_nodata" class="items-center items-middle w-100 h-100">
                        ${this._i18n('empty')}
                        </div>
                        <table id="${this.id}_btable" class="${bodyCls}">
                            <tbody text-align="${bStyle.textAlign}">
                            </tbody>
                        </table>
                    </div>        
                    <!-- 分页容器-->
                    <div id="${this.id}_pagingbar" class="pager"></div>`;
                let cls = ` ${cfg.colorMode || ''} ${cfg.sizeMode} ${this._hasFaceMode(GridFaceMode.outline) ? 'outline' : ''} ${this._hasFaceMode(GridFaceMode.inline) ? 'inline' : ''}`;
                this.widgetEl.addClass(cls).css('max-width', cfg.width ? cfg.width : 'auto').html(html);
            }
            _onAfterRender() {
                let cfg = this._config;
                if (cfg.data)
                    this.data(cfg.data, true);
                let pageQuery = cfg.dataQuery;
                if (pageQuery.url && cfg.autoLoad)
                    this.load(pageQuery);
                this._bindHeadCheckbox();
                this._bindSortFields();
                let head = this.widgetEl.find('.head');
                let body = this.widgetEl.find('.body');
                body.scroll(() => {
                    head.scrollLeft(body.scrollLeft());
                });
                $(`${this.id}_htable`).resize(() => {
                    $(`${this.id}_htable`).css('width', $(`${this.id}_btable`).css('width'));
                });
            }
            _renderData() {
                this._renderBody();
                this._renderPagingbar();
            }
            data(data, silent) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return this._dataModel.getData();
                this._dataModel.setData(data, silent);
                this._renderData();
                return this;
            }
            load(quy, silent) {
                let cfg = this._config, oQuery = Http.toRequest(cfg.dataQuery), nQuery = Http.toRequest(quy);
                cfg.dataQuery = Jsons.union(oQuery, {
                    page: 1,
                    pageSize: Number($(`#${this.id}_pagesize`).text())
                }, nQuery);
                return this._dataModel.load(cfg.dataQuery, silent);
            }
            reload() {
                this._dataModel.reload();
                return this;
            }
        };
        Grid.I18N = {
            firstPage: 'First Page',
            lastPage: 'Last Page',
            previousPage: 'Previous Page',
            nextPage: 'Next Page',
            rowsInfo: '{beginRow} - {endRow} of {total} records',
            empty: 'No data found.',
            loadingMsg: 'Loading...'
        };
        Grid = __decorate([
            widget('JS.fx.Grid'),
            __metadata("design:paramtypes", [GridConfig])
        ], Grid);
        fx.Grid = Grid;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Grid = JS.fx.Grid;
var GridFaceMode = JS.fx.GridFaceMode;
var GridConfig = JS.fx.GridConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let LoadingFaceMode;
        (function (LoadingFaceMode) {
            LoadingFaceMode["flower"] = "flower";
            LoadingFaceMode["ring"] = "ring";
            LoadingFaceMode["bar"] = "bar";
        })(LoadingFaceMode = fx.LoadingFaceMode || (fx.LoadingFaceMode = {}));
        class LoadingConfig {
            constructor() {
                this.width = 200;
                this.transparent = true;
                this.faceMode = LoadingFaceMode.bar;
                this.sizeMode = fx.SizeMode.md;
                this.overlay = true;
                this.duration = 3000;
            }
        }
        fx.LoadingConfig = LoadingConfig;
        let Loading = class Loading {
            static show(cfg) {
                let c = Jsons.union(new LoadingConfig(), cfg);
                c.cls = `jsfx-loading ${c.sizeMode} ${c.colorMode || ''} ${c.transparent || !c.message ? 'transparent' : ''} ${c.cls || ''}`;
                let msg = '';
                if (c.faceMode == LoadingFaceMode.flower) {
                    let html = '';
                    for (let i = 1; i < 5; i++) {
                        html += `<div class="loading-flower circle${i}"></div>`;
                    }
                    msg = `<div class="items-center">
                            <div class="items-middle jsfx-loading-icon flower">
                                <div class="circle-group group1">${html}</div>
                                <div class="circle-group group2">${html}</div>
                                <div class="circle-group group3">${html}</div>
                            </div>
                            <span class="jsfx-loading-msg">${c.message || ''}<span>
                            </div>`;
                }
                else if (c.faceMode == LoadingFaceMode.ring) {
                    msg = `<div class="items-middle items-center">
                              <div class="jsfx-loading-icon ring"><div></div><div></div><div></div><div></div></div>
                              <span class="jsfx-loading-msg">${c.message || ''}<span>
                           </div>`;
                }
                else {
                    $('#jsfx-loading-css').remove();
                    if (c.duration) {
                        Dom.applyStyle(`.jsfx-loading-bar .jsfx-loading-progress:before{animation: load ${c.duration / 1000 * 1.25}s ease-out 1 !important;}`, 'jsfx-loading-css');
                    }
                    msg = `<div class="jsfx-loading-bar">
                                <div class="jsfx-loading-progress"></div>
                                <div class="jsfx-loading-msg">${c.message || ''}</div>
                           </div>`;
                }
                let ucfg = {
                    css: {
                        width: c.width + 'px',
                        left: `calc((100% - ${c.width}px) / 2)`
                    },
                    message: msg,
                    showOverlay: c.overlay,
                    blockMsgClass: c.cls,
                    timeout: c.duration
                }, ltns = c.listeners;
                if (ltns) {
                    if (ltns.showed)
                        ucfg.onBlock = () => {
                            ltns.showed.apply(null, [new CustomEvent('showed'), c]);
                        };
                    if (ltns.hidden)
                        ucfg.onUnblock = () => {
                            ltns.hidden.apply(null, [new CustomEvent('hidden'), c]);
                        };
                }
                cfg.renderTo ? $(cfg.renderTo).block(ucfg) : $.blockUI(ucfg);
            }
            static hide(el) {
                el ? $(el).unblock() : $.unblockUI();
            }
        };
        Loading = __decorate([
            widget('JS.fx.Loading')
        ], Loading);
        fx.Loading = Loading;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Loading = JS.fx.Loading;
var LoadingFaceMode = JS.fx.LoadingFaceMode;
var LoadingConfig = JS.fx.LoadingConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class MessageBoxConfig {
            constructor() {
                this.type = 'custom';
                this.confirmButtonClass = 'jsfx-btn-confirm';
                this.cancelButtonClass = 'jsfx-btn-cancel';
            }
        }
        fx.MessageBoxConfig = MessageBoxConfig;
        let MessageBox = class MessageBox {
            static show(config) {
                let c = new MessageBoxConfig();
                c = Jsons.union(c, config);
                let cfg = c, lts = c.listeners;
                if (lts) {
                    if (lts.confirming)
                        cfg.preConfirm = (inputVal) => {
                            lts.confirming.apply(null, [new CustomEvent('confirming'), inputVal]);
                        };
                    if (lts.opening)
                        cfg.onBeforeOpen = (el) => {
                            lts.opening.apply(null, [new CustomEvent('opening'), el]);
                        };
                    if (lts.opened)
                        cfg.onOpen = (el) => {
                            lts.opened.apply(null, [new CustomEvent('opened'), el]);
                        };
                    if (lts.closing)
                        cfg.onClose = (el) => {
                            lts.closing.apply(null, [new CustomEvent('closing'), el]);
                        };
                    if (lts.closed)
                        cfg.onAfterClose = () => {
                            lts.closed.apply(null, [new CustomEvent('closed')]);
                        };
                }
                let colorMode;
                if (c.type == 'custom') {
                    colorMode = 'btn-' + fx.ColorMode.info;
                }
                else if (c.type == 'question') {
                    colorMode = 'btn-' + fx.ColorMode.dark;
                }
                else if (c.type == 'error') {
                    colorMode = 'btn-' + fx.ColorMode.danger;
                }
                else {
                    colorMode = 'btn-' + cfg.type;
                }
                cfg.confirmButtonClass = colorMode + ' jsfx-messagebox-btn ' + (cfg.confirmButtonClass || '');
                cfg.cancelButtonClass = 'jsfx-messagebox-btn ' + (cfg.cancelButtonClass || '');
                cfg.buttonsStyling = false;
                if (cfg.type == 'custom')
                    delete cfg.type;
                return swal(cfg);
            }
            static clickConfirm() {
                swal.clickConfirm();
            }
            static clickCancel() {
                swal.clickCancel();
            }
            static disableConfirmButton() {
                swal.disableConfirmButton();
            }
            static enableConfirmButton() {
                swal.enableConfirmButton();
            }
            static disableButtons() {
                swal.disableButtons();
            }
            static getTitle() {
                return $(swal.getTitle()).html();
            }
            static getContent() {
                return $(swal.getContent()).html();
            }
            static close() {
                swal.close();
            }
            static isShown() {
                return swal.isVisible();
            }
        };
        MessageBox = __decorate([
            widget('JS.fx.MessageBox')
        ], MessageBox);
        fx.MessageBox = MessageBox;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var MessageBox = JS.fx.MessageBox;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class NumberInputConfig extends fx.LineInputConfig {
            constructor() {
                super(...arguments);
                this.min = -Infinity;
                this.max = Infinity;
                this.step = 1;
                this.iniValue = 0;
                this.fractionDigits = Infinity;
                this.textAlign = 'right';
            }
        }
        fx.NumberInputConfig = NumberInputConfig;
        let NumberInput = class NumberInput extends fx.LineInput {
            constructor(cfg) {
                super(cfg);
            }
            _onAfterRender() {
                let cfg = this._config;
                this.min(cfg.min);
                this.max(cfg.max);
                this.step(cfg.step);
                this._mainEl.off('input change paste').on('input change paste', () => {
                    this._setValue(this._mainEl.val());
                });
                super._onAfterRender();
            }
            _bodyFragment() {
                return super._bodyFragment('number');
            }
            min(min) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.min;
                if (!Number.isFinite(min))
                    return;
                if (min > this.max())
                    throw new RangeError('The min value greater than max value!');
                cfg.min = min;
                this._mainEl.prop('min', cfg.min);
                return cfg.min;
            }
            max(max) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.max;
                if (!Number.isFinite(max))
                    return;
                if (max < this.min())
                    throw new RangeError('The max value less than min value!');
                cfg.max = max;
                this._mainEl.prop('max', cfg.max);
                return cfg.max;
            }
            step(st) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.step;
                cfg.step = st;
                this._mainEl.prop('step', cfg.step);
                return cfg.step;
            }
            value(val, silent) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return super.value();
                let v = val == void 0 ? null : Math.min(Math.max(val, cfg.min), cfg.max);
                return super.value(v == null ? null : v.round(cfg.fractionDigits), silent);
            }
            _renderValue() {
                let cfg = this._config, v = this.value();
                if (v == null) {
                    this._mainEl.val('');
                }
                else {
                    let s = v.format(cfg.fractionDigits);
                    if (this._mainEl.val() !== s)
                        this._mainEl.val(s);
                }
            }
        };
        NumberInput = __decorate([
            widget('JS.fx.NumberInput'),
            __metadata("design:paramtypes", [NumberInputConfig])
        ], NumberInput);
        fx.NumberInput = NumberInput;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var NumberInput = JS.fx.NumberInput;
var NumberInputConfig = JS.fx.NumberInputConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class PasswordConfig extends fx.TextInputConfig {
            constructor() {
                super(...arguments);
                this.visible = true;
            }
        }
        fx.PasswordConfig = PasswordConfig;
        let Password = class Password extends fx.TextInput {
            constructor(cfg) {
                super(cfg);
                this._visible = false;
            }
            _render() {
                let cfg = this._config;
                if (cfg.visible)
                    cfg.innerIcon = {
                        cls: this.visible() ? 'fa fa-eye' : 'fa fa-eye-slash',
                        onClick: () => {
                            this.toggleVisible();
                        }
                    };
                super._render();
            }
            _bodyFragment() {
                return super._bodyFragment('password');
            }
            visible(visible) {
                if (!this._config.visible || arguments.length == 0)
                    return this._visible;
                this._visible = visible;
                this._mainEl.prop('type', visible ? 'text' : 'password');
                let icon = $('#' + this.id + '-icon-left').find('i');
                if (visible) {
                    icon.removeClass('fa-eye-slash').addClass('fa-eye');
                }
                else {
                    icon.removeClass('fa-eye').addClass('fa-eye-slash');
                }
                return visible;
            }
            toggleVisible() {
                this.visible(!this.visible());
            }
        };
        Password = __decorate([
            widget('JS.fx.Password'),
            __metadata("design:paramtypes", [PasswordConfig])
        ], Password);
        fx.Password = Password;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Password = JS.fx.Password;
var PasswordConfig = JS.fx.PasswordConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        ;
        class PopupConfig extends fx.WidgetConfig {
            constructor() {
                super(...arguments);
                this.disabled = false;
                this.hidden = true;
                this.animation = true;
                this.place = 'auto';
                this.htmlable = true;
                this.trigger = 'manual';
            }
        }
        fx.PopupConfig = PopupConfig;
        let Popup = class Popup extends fx.Widget {
            constructor(cfg) {
                super(cfg);
            }
            toggle() {
                this._pop.popover('toggle');
                return this;
            }
            show() {
                this._pop.popover('show');
                return this;
            }
            isShown() {
                return !this._config.hidden;
            }
            hide() {
                this._pop.popover('hide');
                return this;
            }
            enable() {
                this._pop.popover('enable');
                this._config.disabled = false;
                return this;
            }
            disable() {
                this._pop.popover('disable');
                this._config.disabled = true;
            }
            isEnable() {
                return !this._config.disabled;
            }
            _destroy() {
                this._pop.popover('dispose');
                super._destroy();
            }
            _onAfterInit() {
                let cfg = this._config;
                if (!cfg.hidden)
                    this.show();
                cfg.disabled ? this.disable() : this.enable();
            }
            _render() {
                let cfg = this._config, json = {
                    animation: cfg.animation,
                    title: cfg.title,
                    content: cfg.content,
                    html: cfg.htmlable,
                    placement: cfg.place,
                    trigger: cfg.trigger
                };
                if (cfg.template)
                    json['template'] = cfg.template;
                this._pop = $(cfg.target).popover(json);
                this._pop.on('show.bs.popover', () => {
                    this._fire('showing');
                });
                this._pop.on('shown.bs.popover', () => {
                    this._fire('shown');
                    this._config.hidden = false;
                });
                this._pop.on('hide.bs.popover', () => {
                    this._fire('hiding');
                });
                this._pop.on('hidden.bs.popover', () => {
                    this._fire('hidden');
                    this._config.hidden = true;
                });
                this._pop.on('inserted.bs.popover', () => {
                    this._fire('rendered');
                });
                return false;
            }
        };
        Popup = __decorate([
            widget('JS.fx.Popup'),
            __metadata("design:paramtypes", [PopupConfig])
        ], Popup);
        fx.Popup = Popup;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Popup = JS.fx.Popup;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let ProgressFaceMode;
        (function (ProgressFaceMode) {
            ProgressFaceMode["square"] = "square";
            ProgressFaceMode["round"] = "round";
            ProgressFaceMode["striped"] = "striped";
            ProgressFaceMode["animated"] = "animated";
        })(ProgressFaceMode = fx.ProgressFaceMode || (fx.ProgressFaceMode = {}));
        class ProgressConfig extends fx.FormWidgetConfig {
            constructor() {
                super(...arguments);
                this.iniValue = 0;
            }
        }
        fx.ProgressConfig = ProgressConfig;
        let Progress = class Progress extends fx.FormWidget {
            constructor(config) {
                super(config);
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value();
                val = val || 0;
                if (val > 1 || val < 0)
                    throw new RangeError('Progress value must in [0,1]!');
                let newVal = val ? val.round(2) : 0;
                this._setValue(newVal, silent);
                this._mainEl.css('width', newVal * 100 + '%');
                this._mainEl.text(newVal ? newVal * 100 + '%' : '');
                return this;
            }
            height(val) {
                if (arguments.length == 0)
                    return this._mainEl.parent().css('height');
                this._mainEl.parent().css('height', val);
                this._config.height = val;
                return this;
            }
            _bodyFragment() {
                let cfg = this._config, cls = `progress ${cfg.sizeMode || ''}`, barCls = 'progress-bar', val = cfg.iniValue || 0;
                if (this._hasFaceMode(ProgressFaceMode.square))
                    cls += ' border-square';
                if (this._hasFaceMode(ProgressFaceMode.striped))
                    barCls += ' progress-bar-striped';
                if (this._hasFaceMode(ProgressFaceMode.animated))
                    barCls += ' progress-bar-striped progress-bar-animated';
                if (cfg.colorMode)
                    barCls += ` bg-${cfg.colorMode}`;
                return `
                <div class="${cls}" ${cfg.height ? 'style="height:' + cfg.height + 'px"' : ''}>
                    <div class="${barCls} ${cfg.disabled ? 'disabled' : ''}" style="width:${val * 100}%" jsfx-role="main" role="progressbar">${val ? (val * 100 + '%') : ''}</div>
                </div>
                `;
            }
            disable() {
                this._mainEl.addClass('disabled');
                this._config.disabled = true;
                return this;
            }
            enable() {
                this._mainEl.removeClass('disabled');
                this._config.disabled = false;
                return this;
            }
        };
        Progress = __decorate([
            widget('JS.fx.Progress'),
            __metadata("design:paramtypes", [ProgressConfig])
        ], Progress);
        fx.Progress = Progress;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Progress = JS.fx.Progress;
var ProgressFaceMode = JS.fx.ProgressFaceMode;
var ProgressConfig = JS.fx.ProgressConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class RadioConfig extends fx.ChoiceConfig {
            constructor() {
                super(...arguments);
                this.faceMode = RadioFaceMode.inline;
            }
        }
        fx.RadioConfig = RadioConfig;
        let RadioFaceMode;
        (function (RadioFaceMode) {
            RadioFaceMode["dot"] = "dot";
            RadioFaceMode["ring"] = "ring";
            RadioFaceMode["inline"] = "inline";
            RadioFaceMode["list"] = "list";
        })(RadioFaceMode = fx.RadioFaceMode || (fx.RadioFaceMode = {}));
        let Radio = class Radio extends fx.Choice {
            _getDomValue() {
                return this.widgetEl.find('input:checked').val();
            }
            _setDomValue(v) {
                v ? this.widgetEl.find(`input[value=${v}]`).prop('checked', true) : this.widgetEl.find('input').prop('checked', false);
            }
            constructor(cfg) {
                super(cfg);
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value();
                return super.value(val, silent);
            }
            _renderData() {
                super._renderData('radio');
            }
            select(val) {
                return this.value(val);
            }
            unselect() {
                return this.value(null);
            }
        };
        Radio = __decorate([
            widget('JS.fx.Radio'),
            __metadata("design:paramtypes", [RadioConfig])
        ], Radio);
        fx.Radio = Radio;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var RadioConfig = JS.fx.RadioConfig;
var RadioFaceMode = JS.fx.RadioFaceMode;
var Radio = JS.fx.Radio;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let RangeSliderFaceMode;
        (function (RangeSliderFaceMode) {
            RangeSliderFaceMode["flat"] = "flat";
            RangeSliderFaceMode["big"] = "big";
            RangeSliderFaceMode["modern"] = "modern";
            RangeSliderFaceMode["sharp"] = "sharp";
            RangeSliderFaceMode["round"] = "round";
            RangeSliderFaceMode["square"] = "square";
        })(RangeSliderFaceMode = fx.RangeSliderFaceMode || (fx.RangeSliderFaceMode = {}));
        class RangeSliderConfig extends fx.FormWidgetConfig {
            constructor() {
                super(...arguments);
                this.faceMode = RangeSliderFaceMode.round;
            }
        }
        fx.RangeSliderConfig = RangeSliderConfig;
        let RangeSlider = class RangeSlider extends fx.FormWidget {
            constructor(cfg) {
                super(cfg);
            }
            _getFromTo() {
                let arr = Arrays.toArray(this.value()), from = arr.length > 0 ? arr[0] : null, to = arr.length > 1 ? arr[1] : null;
                return [from, to];
            }
            _transfer() {
                let cfg = this._config, fromTo = this._getFromTo();
                return {
                    type: cfg.type,
                    min: cfg.data[0],
                    max: cfg.data[1],
                    from: fromTo[0],
                    to: fromTo[1],
                    step: cfg.step,
                    keyboard: false,
                    grid: cfg.scaled,
                    grid_margin: true,
                    grid_num: cfg.scales,
                    grid_snap: false,
                    drag_interval: true,
                    min_interval: cfg.minInterval,
                    max_interval: cfg.maxInterval,
                    from_fixed: cfg.fromFixed,
                    from_min: cfg.fromMin,
                    from_max: cfg.fromMax,
                    from_shadow: cfg.fromShadow,
                    to_fixed: cfg.toFixed,
                    to_min: cfg.toMin,
                    to_max: cfg.toMax,
                    to_shadow: cfg.toShadow,
                    skin: cfg.faceMode || 'round',
                    hide_min_max: cfg.hideMinMax,
                    hide_from_to: cfg.hideFromTo,
                    force_edges: true,
                    extra_classes: cfg.sliderCls,
                    block: cfg.readonly,
                    prettify_enabled: cfg.format ? true : false,
                    prettify_separator: Types.isString(cfg.format) ? cfg.format : ' ',
                    prettify: Types.isFunction(cfg.format) ? cfg.format : null,
                    prefix: cfg.dataPrefix,
                    postfix: cfg.dataPostfix,
                    max_postfix: cfg.maxValuePostfix,
                    decorate_both: cfg.closeValuesDecorate,
                    values_separator: cfg.closeValuesSeparator,
                    input_values_separator: cfg.valuesSeparator,
                    disable: cfg.disabled,
                    scope: this,
                    onFinish: (data) => {
                        let cfg = this._config, v = cfg.type == 'double' ? [data.from, data.to] : data.from;
                        this._setValue(v);
                    }
                };
            }
            _destroy() {
                this._slider.destroy();
                super._destroy();
            }
            _bodyFragment() {
                let cfg = this._config;
                if (!cfg.data)
                    cfg.data = [0, 100];
                return `<input name="${this.name()}" type="text" jsfx-role="main" data-min="${cfg.data[0]}" data-max="${cfg.data[1]}"/>`;
            }
            _onBeforeRender() {
                if (this._slider)
                    this._slider.destroy();
                super._onBeforeRender();
            }
            _onAfterRender() {
                if (this._config.colorMode)
                    this.widgetEl.find('[jsfx-role=body]').addClass(this._config.colorMode);
                this._mainEl.ionRangeSlider(this._transfer());
                this._slider = this._mainEl.data('ionRangeSlider');
                super._onAfterRender();
            }
            _iniValue() {
                let cfg = this._config, type = cfg.type, min = this.minValue(), max = this.maxValue();
                if (cfg.iniValue == null)
                    cfg.iniValue = type == 'double' ? [min, max] : min;
                super._iniValue();
            }
            data(data, silent) {
                if (arguments.length == 0)
                    return super.data();
                if (data == null)
                    data = [0, 100];
                return super.data(data, silent);
            }
            _renderData() {
                let data = this._config.data, min = this._mainEl.data('min'), max = this._mainEl.data('max');
                if (data && (min + '-' + max) != (data[0] + '-' + data[1])) {
                    this._slider.update({
                        min: data[0],
                        max: data[1]
                    });
                    this._mainEl.data({
                        min: data[0],
                        max: data[1]
                    });
                }
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value();
                let cfg = this._config;
                if (val != null) {
                    let min = this.minValue(), max = this.maxValue();
                    if (cfg.type == 'double') {
                        if (val[0] < min)
                            val[0] = min;
                        if (val[1] > max)
                            val[1] = max;
                    }
                    else {
                        if (val < min) {
                            val = min;
                        }
                        else if (val > max) {
                            val = max;
                        }
                    }
                }
                return super.value(val, silent);
            }
            _renderValue() {
                let cfg = this._config, fromTo = this._getFromTo(), sValue = cfg.type == 'double' ? (fromTo[0] || '' + cfg.valuesSeparator + fromTo[1] || '') : String(fromTo[0] || '');
                if (sValue != this._mainEl.prop('value'))
                    this._slider.update({
                        from: fromTo[0], to: fromTo[1]
                    });
            }
            maxValue() {
                return this._config.data[1];
            }
            minValue() {
                return this._config.data[0];
            }
        };
        RangeSlider = __decorate([
            widget('JS.fx.RangeSlider'),
            __metadata("design:paramtypes", [RangeSliderConfig])
        ], RangeSlider);
        fx.RangeSlider = RangeSlider;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var RangeSliderFaceMode = JS.fx.RangeSliderFaceMode;
var RangeSliderConfig = JS.fx.RangeSliderConfig;
var RangeSlider = JS.fx.RangeSlider;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let RowsInputFaceMode;
        (function (RowsInputFaceMode) {
            RowsInputFaceMode["square"] = "square";
            RowsInputFaceMode["round"] = "round";
            RowsInputFaceMode["shadow"] = "shadow";
        })(RowsInputFaceMode = fx.RowsInputFaceMode || (fx.RowsInputFaceMode = {}));
        class RowsInputConfig extends fx.InputConfig {
            constructor() {
                super(...arguments);
                this.counter = {
                    tpl: '{length}/{maxLength}',
                    place: 'right',
                    cls: ''
                };
                this.faceMode = RowsInputFaceMode.square;
            }
        }
        fx.RowsInputConfig = RowsInputConfig;
        class RowsInput extends fx.Input {
            constructor(cfg) {
                super(cfg);
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value();
                return super.value(val, silent);
            }
            _counterHtml() {
                let cfg = this._config;
                if (!cfg.counter || !cfg.counter.tpl)
                    return '';
                let max = cfg.maxlength;
                if (!max || !Number.isFinite(max))
                    return '';
                let v = this.value() || '', len = v.length;
                return Strings.merge(cfg.counter.tpl, {
                    length: len,
                    maxLength: max
                });
            }
            _updateCounter() {
                let cfg = this._config;
                if (!cfg.counter)
                    return;
                let counter = this.widgetEl.find('.counter');
                counter.off().empty().html(this._counterHtml());
                if (!cfg.autoValidate)
                    return;
                let v = this.value(), len = v ? v.length : 0, max = this.maxlength();
                len > max ? this._showError('') : this._hideError();
            }
            _setValue(val, silent) {
                super._setValue(val, silent);
                this._updateCounter();
            }
            _showError(msg) {
                super._showError(msg);
                this.widgetEl.find('.counter').addClass('error');
            }
            _hideError() {
                super._hideError();
                this.widgetEl.find('.counter').removeClass('error');
            }
        }
        fx.RowsInput = RowsInput;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var RowsInput = JS.fx.RowsInput;
var RowsInputConfig = JS.fx.RowsInputConfig;
var RowsInputFaceMode = JS.fx.RowsInputFaceMode;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let J = Jsons, Y = Types, E = Check.isEmpty;
        let SelectFaceMode;
        (function (SelectFaceMode) {
            SelectFaceMode["square"] = "square";
            SelectFaceMode["round"] = "round";
            SelectFaceMode["pill"] = "pill";
            SelectFaceMode["shadow"] = "shadow";
        })(SelectFaceMode = fx.SelectFaceMode || (fx.SelectFaceMode = {}));
        class SelectOption {
            constructor() {
                this.selected = false;
                this.disabled = false;
            }
        }
        fx.SelectOption = SelectOption;
        class SelectConfig extends fx.FormWidgetConfig {
            constructor() {
                super(...arguments);
                this.rtl = false;
                this.outline = false;
                this.autoSelectFirst = false;
                this.crud = false;
                this.multiple = false;
                this.allowClear = false;
                this.maximumSelectionLength = Infinity;
                this.autoSearch = false;
                this.minimumInputLength = 0;
                this.inputable = false;
                this.autoEscape = true;
            }
        }
        fx.SelectConfig = SelectConfig;
        let Select = class Select extends fx.FormWidget {
            constructor(cfg) {
                super(cfg);
            }
            load(api) {
                if (this._config.autoSearch)
                    throw new RefusedError('The method be not supported when autoSearch is true!');
                return super.load(api);
            }
            iniValue(v, render) {
                if (arguments.length == 0)
                    return super.iniValue();
                return super.iniValue(v, render);
            }
            _destroy() {
                this._mainEl.select2('destroy');
                super._destroy();
            }
            _bodyFragment() {
                let cfg = this._config, cls = '';
                if (cfg.colorMode) {
                    if (cfg.outline)
                        cls += ' outline';
                    cls += ` ${cfg.colorMode}`;
                }
                this._eachMode('faceMode', (mode) => {
                    cls += ' face-' + mode;
                });
                return `<div class="w-100 font-${cfg.sizeMode || 'md'} ${cls}">
                            <select name="${this.name()}" jsfx-role="main" class="form-control"></select>
                        </div>`;
            }
            _onAfterRender() {
                this._initSelect2();
                this._renderData();
                let me = this;
                this._mainEl.on('change', function (e, data) {
                    if (data == '_jsfx')
                        return;
                    let nv = $(this).val();
                    me._setValue(E(nv) ? null : nv);
                });
                let evts = ['selected', 'unselected'];
                ['select2:select', 'select2:unselect'].forEach((type, i) => {
                    this._mainEl.on(type, e => {
                        me._fire(evts[i], [e.params.data]);
                    });
                });
                super._onAfterRender();
            }
            _optionHtml(data) {
                let html = '';
                data.forEach(op => {
                    if (op.children) {
                        let childrenHtml = this._optionHtml(op.children);
                        html += `<optgroup label="${op.text}">${childrenHtml}</optgroup>`;
                    }
                    else {
                        html += `<option value="${op.id}" ${op.disabled ? 'disabled' : ''} ${op.selected ? 'selected' : ''}>${op.text}</option>`;
                    }
                });
                return html;
            }
            _initSelect2() {
                let cfg = this._config, dataQuery = cfg.dataQuery, url = dataQuery ? (Y.isString(dataQuery) ? dataQuery : dataQuery.url) : null, jsonParams = dataQuery ? (Y.isString(dataQuery) ? null : dataQuery.data) : null, options = {
                    disabled: cfg.disabled,
                    allowClear: cfg.allowClear,
                    width: '100%',
                    minimumInputLength: cfg.minimumInputLength < 1 ? 1 : cfg.minimumInputLength,
                    language: cfg.locale,
                    placeholder: cfg.placeholder,
                    multiple: cfg.multiple,
                    tags: cfg.inputable,
                    tokenSeparators: [' ']
                };
                let cls = 'jsfx-select ' + ' ' + (cfg.colorMode || '') + ' font-' + (cfg.sizeMode || 'md') + (cfg.cls || '');
                this._eachMode('faceMode', (mode) => {
                    cls += ' border-' + mode;
                });
                options.dropdownCssClass = cls;
                if (cfg.rtl)
                    options.dir = 'rtl';
                if (!cfg.autoSearch) {
                    options.minimumResultsForSearch = Infinity;
                    options.minimumInputLength = 0;
                }
                if (!cfg.autoEscape) {
                    options.escapeMarkup = (c) => { return c; };
                }
                let me = this;
                if (cfg.optionRender)
                    options.templateResult = function (data, el) {
                        return cfg.optionRender.apply(me, [data, el]);
                    };
                if (cfg.selectionRender)
                    options.templateSelection = function (data, el) {
                        return cfg.selectionRender.apply(me, [data, el]);
                    };
                if (cfg.autoSearch && url)
                    options.ajax = {
                        url: function (pms) {
                            return url + (pms.term || '');
                        },
                        dataType: 'json',
                        delay: 500,
                        data: function () { return jsonParams ? jsonParams : {}; },
                        processResults: (res, params) => {
                            let data = J.find(res, ResultSet.DEFAULT_FORMAT.dataProperty);
                            this.data(data);
                            return {
                                results: data
                            };
                        },
                        cache: true
                    };
                this._mainEl.select2(options);
            }
            addOption(opt) {
                return this.data([opt], false, 'append');
            }
            addOptions(data) {
                return this.data(data, false, 'append');
            }
            removeOption(id) {
                return this.data([id], false, 'remove');
            }
            removeOptions(ids) {
                return this.data(ids, false, 'remove');
            }
            select(i, silent) {
                let cfg = this._config;
                if (i < 0 || E(cfg.data) || i >= cfg.data.length)
                    return;
                this.value('' + cfg.data[i].id, silent);
            }
            isCrud() {
                let cfg = this._config;
                return cfg.multiple && cfg.crud;
            }
            crudValue() {
                if (!this.isCrud())
                    return null;
                let val = Arrays.toArray(this.value()), iniVal = Arrays.toArray(this.iniValue()), arr = [];
                iniVal.forEach((v) => {
                    if (val.findIndex(it => {
                        return it == v;
                    }) < 0) {
                        arr[arr.length] = {
                            _crud: 'D',
                            id: v
                        };
                    }
                });
                val.forEach((v) => {
                    if (iniVal.findIndex(it => {
                        return it == v;
                    }) < 0) {
                        arr[arr.length] = {
                            _crud: 'C',
                            id: v
                        };
                    }
                });
                return arr;
            }
            data(data, silent, mode) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.data;
                let newData, newDataCopy, oldData = J.clone(cfg.data);
                if (mode == 'append') {
                    let tmp = J.clone(cfg.data) || [];
                    newData = tmp.add(data);
                    newDataCopy = J.clone(newData);
                }
                else if (mode == 'remove') {
                    let tmp = J.clone(cfg.data) || [];
                    data.forEach(id => {
                        tmp.remove(item => {
                            return item.id == id;
                        });
                    });
                    newData = tmp;
                    newDataCopy = J.clone(newData);
                }
                else {
                    newData = data;
                    newDataCopy = J.clone(newData);
                }
                if (!silent)
                    this._fire('dataupdating', [newDataCopy, oldData]);
                cfg.data = newData;
                if (this._dataModel)
                    this._dataModel.setData(newData, true);
                this._renderDataBy(mode ? data : newData, mode);
                this._renderValue();
                if (!silent)
                    this._fire('dataupdated', [newDataCopy, oldData]);
                return this;
            }
            _iniValue() {
                let cfg = this._config;
                if (cfg.autoSelectFirst && cfg.data && cfg.data.length > 0)
                    cfg.iniValue = '' + cfg.data[0].id;
                super._iniValue();
            }
            _renderData() {
                this._renderDataBy(this._config.data);
            }
            _renderDataBy(data, mode) {
                if (data) {
                    if (!mode)
                        this._mainEl.empty();
                    if (mode != 'remove') {
                        this._mainEl.append(this._optionHtml(data));
                    }
                    else {
                        data.forEach(id => {
                            this._mainEl.find(`option[value="${id}"]`).remove();
                        });
                    }
                }
                else {
                    if (mode != 'remove')
                        this._mainEl.empty();
                }
            }
            _renderValue() {
                let v = this.value();
                if (!this._equalValues(v, this._mainEl.val()))
                    this._mainEl.val(v).trigger('change', '_jsfx');
            }
            _equalValues(newVal, oldVal) {
                if (E(oldVal) && E(newVal))
                    return true;
                let cfg = this._config;
                return cfg.multiple ? Arrays.equalToString(oldVal, newVal) : oldVal == newVal;
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value();
                let cfg = this._config;
                if ((cfg.multiple && Y.isString(val)) || (!cfg.multiple && Y.isArray(val)))
                    throw new TypeError(`Wrong value type for select<${this.id}>!`);
                return super.value(val, silent);
            }
            _showError(msg) {
                super._showError(msg);
                this.widgetEl.find('.select2-selection').addClass('jsfx-input-error');
            }
            _hideError() {
                super._hideError();
                this.widgetEl.find('.select2-selection').removeClass('jsfx-input-error');
            }
        };
        Select = __decorate([
            widget('JS.fx.Select'),
            __metadata("design:paramtypes", [SelectConfig])
        ], Select);
        fx.Select = Select;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Select = JS.fx.Select;
var SelectFaceMode = JS.fx.SelectFaceMode;
var SelectOption = JS.fx.SelectOption;
var SelectConfig = JS.fx.SelectConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let SiderFaceMode;
        (function (SiderFaceMode) {
            SiderFaceMode["over"] = "over";
            SiderFaceMode["overlay"] = "overlay";
            SiderFaceMode["push"] = "push";
        })(SiderFaceMode = fx.SiderFaceMode || (fx.SiderFaceMode = {}));
        class SiderConfig extends fx.WidgetConfig {
            constructor() {
                super(...arguments);
                this.hidden = true;
                this.faceMode = SiderFaceMode.over;
            }
        }
        fx.SiderConfig = SiderConfig;
        let Sider = class Sider extends fx.Widget {
            constructor(cfg) {
                if (cfg.hidden === undefined)
                    cfg.hidden = true;
                cfg.appendTo = 'body';
                if (!cfg.faceMode)
                    cfg.faceMode = SiderFaceMode.over;
                super(cfg);
            }
            toggle() {
                this.widgetEl.slideReveal('toggle');
            }
            show() {
                this.widgetEl.slideReveal('show');
                return this;
            }
            hide() {
                this.widgetEl.slideReveal('hide');
                return this;
            }
            loadHtml(html) {
                let cfg = this._config;
                if (html)
                    cfg.html = html;
                if (!cfg.html)
                    return;
                let h = Types.isString(cfg.html) ? cfg.html : $(cfg.html).html();
                this._mainEl.off().empty().html(h);
                this._fire('loaded');
                return this;
            }
            loadUrl(url) {
                let cfg = this._config;
                if (url)
                    cfg.url = url;
                if (!cfg.url)
                    return;
                this._mainEl.off().empty();
                let iframe = document.createElement('iframe'), fn = () => {
                    let ifr = $(`#${this.id}_iframe`)[0], fWin = Bom.iframeWindow(ifr);
                    fWin.Page.onEvent('close', (e, ...args) => {
                        this._fire('closing', args);
                        this.widgetEl.slideReveal('hide', false);
                        this._fire('closed', args);
                    });
                    this._fire('loaded', [fWin]);
                };
                iframe.id = this.id + '_iframe';
                iframe.src = cfg.url;
                if (iframe['attachEvent']) {
                    iframe['attachEvent']('onload', fn);
                }
                else {
                    iframe.onload = fn;
                }
                this._mainEl.append(iframe);
                return this;
            }
            reload() {
                let cfg = this._config;
                cfg.html ? this.loadHtml(null) : this.loadUrl(null);
                return this;
            }
            getFrame() {
                return $(`#${this.id}_iframe`)[0];
            }
            _onAfterInit() {
                let cfg = this._config;
                this.reload();
                if (!cfg.hidden)
                    this.show();
            }
            _render() {
                let cfg = this._config, html = `
                    <div class="jsfx-sider-head ${cfg.titleCls || ''}" style="${cfg.titleStyle || ''}">
                        <div jsfx-role="title" class="text-truncate">${cfg.title || ''}</div>
                        <button type="button" class="close" aria-label="Close"><i class="la la-arrow-${cfg.place || 'left'}"></i></button>                            
                    </div>
                    <div class="jsfx-sider-body" jsfx-role="main"></div>
                    `;
                this.widgetEl.addClass(`jsfx-sider ${cfg.place || 'left'}`).html(html);
                let isPush = cfg.faceMode == SiderFaceMode.push;
                this.widgetEl = $('#' + this.id).slideReveal({
                    width: cfg.width || undefined,
                    trigger: cfg.trigger ? $(cfg.trigger) : undefined,
                    push: isPush,
                    overlay: !isPush,
                    overlayColor: 'rgba(0, 0, 0, 0.25)',
                    position: cfg.place,
                    speed: cfg.speed,
                    autoEscape: cfg.escKey == false ? false : true,
                    show: () => {
                        this.widgetEl.addClass((cfg.faceMode == SiderFaceMode.overlay ? 'overlay-' : '') + 'sider-shadow');
                        this._fire('opening');
                    },
                    shown: () => { this._fire('opened'); },
                    hide: () => {
                        this.widgetEl.removeClass((cfg.faceMode == SiderFaceMode.overlay ? 'overlay-' : '') + 'sider-shadow');
                        this._fire('closing');
                    },
                    hidden: () => { this._fire('closed'); }
                });
                let overs = $('.slide-reveal-overlay');
                if (overs.length > 0) {
                    this._overlay = $(overs[0]);
                    if (cfg.faceMode == SiderFaceMode.over)
                        this._overlay.remove();
                }
                this.widgetEl.find('button.close').click(() => {
                    this.hide();
                });
                this._mainEl = this.widgetEl.find('[jsfx-role=main]');
            }
            _destroy() {
                if (this._overlay)
                    this._overlay.remove();
                super._destroy();
            }
            title(text) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.title;
                this.widgetEl.find('div[jsfx-role="title"]').html(text);
                cfg.title = text;
                return this;
            }
        };
        Sider = __decorate([
            widget('JS.fx.Sider'),
            __metadata("design:paramtypes", [SiderConfig])
        ], Sider);
        fx.Sider = Sider;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var SiderFaceMode = JS.fx.SiderFaceMode;
var SiderConfig = JS.fx.SiderConfig;
var Sider = JS.fx.Sider;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let SwitchFaceMode;
        (function (SwitchFaceMode) {
            SwitchFaceMode["shadow"] = "shadow";
        })(SwitchFaceMode = fx.SwitchFaceMode || (fx.SwitchFaceMode = {}));
        class SwitchConfig extends fx.FormWidgetConfig {
            constructor() {
                super(...arguments);
                this.iniValue = 'off';
            }
        }
        fx.SwitchConfig = SwitchConfig;
        let Switch = class Switch extends fx.FormWidget {
            constructor(config) {
                super(config);
            }
            _onAfterRender() {
                let me = this;
                this._mainEl.on('change', function () {
                    let is = $(this).is(':checked');
                    me._setValue(is ? 'on' : 'off');
                    me._fire(is ? 'on' : 'off');
                });
                super._onAfterRender();
            }
            _bodyFragment() {
                let cls = '', cfg = this._config;
                if (this._hasFaceMode(SwitchFaceMode.shadow))
                    cls += ' border-shadow';
                return `<input name="${this.name()}" jsfx-role="main" type="checkbox" class="${cls}" ${cfg.readonly ? 'readonly' : ''}/>`;
            }
            value(val, silent) {
                if (arguments.length == 0)
                    return super.value() || 'off';
                return super.value(val, silent);
            }
            _renderValue() {
                this._mainEl.prop('checked', this.value() == 'on');
            }
            toggle() {
                let v = this.value();
                return this.value(v == 'on' ? 'off' : 'on');
            }
        };
        Switch = __decorate([
            widget('JS.fx.Switch'),
            __metadata("design:paramtypes", [SwitchConfig])
        ], Switch);
        fx.Switch = Switch;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Switch = JS.fx.Switch;
var SwitchFaceMode = JS.fx.SwitchFaceMode;
var SwitchConfig = JS.fx.SwitchConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let TabFaceMode;
        (function (TabFaceMode) {
            TabFaceMode["horizontal"] = "horizontal";
            TabFaceMode["vertical"] = "vertical";
            TabFaceMode["pill"] = "pill";
            TabFaceMode["outline"] = "outline";
            TabFaceMode["underline"] = "underline";
        })(TabFaceMode = fx.TabFaceMode || (fx.TabFaceMode = {}));
        class TabConfig extends fx.WidgetConfig {
            constructor() {
                super(...arguments);
                this.activeIndex = 0;
                this.faceMode = null;
                this.headLeftWidth = '15%';
            }
        }
        fx.TabConfig = TabConfig;
        let Tab = class Tab extends fx.Widget {
            constructor(cfg) {
                super(cfg);
            }
            disableTab(num) {
                let index = this._limitIndex(num);
                if (index < 0)
                    return this;
                let cfg = this._config;
                cfg.data[index].disabled = true;
                let tab = $(`#${this.id}_headers li:nth-child(${index + 1}) a`);
                tab.addClass('disabled');
                return this;
            }
            enableTab(num) {
                let index = this._limitIndex(num);
                if (index < 0)
                    return this;
                let cfg = this._config;
                cfg.data[index].disabled = false;
                let tab = $(`#${this.id}_headers li:nth-child(${index + 1}) a`);
                tab.removeClass('disabled');
                return this;
            }
            isEnabledTab(num) {
                let size = this.length();
                if (size == 0 || num < 1 || num > size)
                    return false;
                let cfg = this._config;
                return cfg.data && !cfg.data[num - 1].disabled;
            }
            activeTab(num) {
                let index = this._limitIndex(num);
                if (index < 0)
                    return this;
                let cfg = this._config;
                cfg.activeIndex = index;
                cfg.data[index].disabled = false;
                let tab = $(`#${this.id}_headers li:nth-child(${index + 1}) a`);
                tab.removeClass('disabled').css('display', '').tab('show');
                return this;
            }
            isActivedTab(num) {
                let tab = $(`#${this.id}_headers li:nth-child(${num}) a`);
                return tab.length == 1 && tab.hasClass('active');
            }
            _limitIndex(num) {
                let size = this.length();
                if (size == 0)
                    return -1;
                if (num >= size) {
                    return size - 1;
                }
                else if (num < 1)
                    return 0;
                return num - 1;
            }
            hideTab(num) {
                this.activeTab(num - 1);
                $(`#${this.id}_headers li:nth-child(${num}) a`).css('display', 'none');
                return this;
            }
            showTab(num) {
                $(`#${this.id}_headers li:nth-child(${num}) a`).css('display', '');
                return this;
            }
            isShownTab(num) {
                let tab = $(`#${this.id}_headers li:nth-child(${num}) a`);
                return tab.length == 1 && tab.css('display') != 'none';
            }
            getActiveIndex() {
                return this._config.activeIndex + 1;
            }
            clear() {
                return this.tabs(null);
            }
            tabs(items) {
                if (arguments.length == 0)
                    return this._config.data;
                this._config.data = items;
                this.render();
                return this;
            }
            addTab(tabs, from) {
                let size = this.length();
                if (!Types.isDefined(from) || from > size) {
                    from = size + 1;
                }
                else if (size == 0 || from < 1)
                    from = 1;
                let cfg = this._config;
                cfg.data = cfg.data || [];
                cfg.data.add(Arrays.toArray(tabs), from - 1);
                this.render();
                return this;
            }
            removeTab(num) {
                if (num > this.length() || num < 1)
                    return this;
                let cfg = this._config;
                cfg.data = cfg.data || [];
                cfg.data.remove(num - 1);
                this.render();
                return this;
            }
            removeTabHeading(heading) {
                let cfg = this._config;
                cfg.data = cfg.data || [];
                let i = cfg.data.findIndex((item) => {
                    return heading == item.heading;
                }, 0);
                if (i < 0)
                    return this;
                return this.removeTab(i + 1);
            }
            length() {
                let data = this._config.data;
                return data ? data.length : 0;
            }
            _head(item, i) {
                return `
                <li class="nav-item">
                    <a  id="${this.id}_${i}-tab" jsfx-index="${i}" class="nav-link ${item.disabled ? 'disabled' : ''}" 
                    data-toggle="tab" href="#${this.id}_${i}" role="tab" aria-controls="${this.id}_${i}" aria-selected="false">
                    ${item.heading}</a>
                </li>
                `;
            }
            _content(item, i) {
                let html = Types.isString(item.content) ? item.content : $(item.content).html();
                return `<div class="tab-pane fade" id="${this.id}_${i}" role="tabpanel" aria-labelledby="${this.id}_${i}-tab">${html || ''}</div>`;
            }
            _html() {
                let cfg = this._config, data = cfg.data, heads = '', contents = '';
                if (!data)
                    return '';
                data.forEach((item, i) => {
                    heads += this._head(item, i);
                    contents += this._content(item, i);
                });
                let cls = '';
                if (this._hasFaceMode(TabFaceMode.pill)) {
                    cls += ' nav-pills';
                }
                else if (this._hasFaceMode(TabFaceMode.underline)) {
                    cls += ' jsfx-tab-underline';
                }
                else {
                    cls += ' nav-tabs';
                }
                cls += ' ' + cfg.colorMode || '';
                let isVtl = this._hasFaceMode(TabFaceMode.vertical);
                if (isVtl)
                    cls += ' flex-column';
                let hHtml = `<ul id="${this.id}_headers" role="tablist" class="nav${cls} ${cfg.headCls || ''}" style="${cfg.headStyle || ''}">${heads}</ul>`, cHtml = `<div class="${isVtl ? 'vertical' : ''} tab-content" style="height:${CssTool.normValue(cfg.height, '100%')};">${contents}</div>`, leftWidth = CssTool.normValue(cfg.headLeftWidth, '100%');
                return isVtl ?
                    `
                <div class="w-100">
                <div style="float:left;width:${leftWidth};">${hHtml}</div>
                <div style="margin-left:${leftWidth};">${cHtml}</div>
                </div>
                ` : `${hHtml}${cHtml}`;
            }
            _render() {
                this.widgetEl.html(this._html());
                if (this.length() > 0) {
                    let tablist = this.widgetEl.find('ul[role=tablist]');
                    tablist.on('show.bs.tab', (e) => {
                        this._fire('activing', [e.target, e.relatedTarget]);
                    });
                    tablist.on('shown.bs.tab', (e) => {
                        this._fire('actived', [e.target, e.relatedTarget]);
                    });
                    this.activeTab(this.getActiveIndex());
                }
            }
            _destroy() {
                this.widgetEl.find('a[role=tab]').each(function () { $(this).tab('dispose'); });
                super._destroy();
            }
        };
        Tab = __decorate([
            widget('JS.fx.Tab'),
            __metadata("design:paramtypes", [TabConfig])
        ], Tab);
        fx.Tab = Tab;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Tab = JS.fx.Tab;
var TabFaceMode = JS.fx.TabFaceMode;
var TabConfig = JS.fx.TabConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class TelInputConfig extends fx.LineInputConfig {
            constructor() {
                super(...arguments);
                this.innerIcon = 'fa fa-mobile';
            }
        }
        fx.TelInputConfig = TelInputConfig;
        let TelInput = class TelInput extends fx.TextInput {
            constructor(cfg) {
                super(cfg);
            }
            _bodyFragment() {
                return super._bodyFragment('tel');
            }
        };
        TelInput = __decorate([
            widget('JS.fx.TelInput'),
            __metadata("design:paramtypes", [TelInputConfig])
        ], TelInput);
        fx.TelInput = TelInput;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var TelInput = JS.fx.TelInput;
var TelInputConfig = JS.fx.TelInputConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class TextAreaConfig extends fx.RowsInputConfig {
            constructor() {
                super(...arguments);
                this.resize = 'none';
                this.rows = 3;
            }
        }
        fx.TextAreaConfig = TextAreaConfig;
        let TextArea = class TextArea extends fx.RowsInput {
            constructor(cfg) {
                super(cfg);
            }
            _bodyFragment() {
                let cfg = this._config, cls = 'form-control font-' + cfg.sizeMode, readonly = cfg.readonly ? ' readonly' : '', autofocus = cfg.autofocus ? ' autofocus' : '', max = cfg.maxlength, maxLength = max && Number.isFinite(max) ? (' maxLength=' + max) : '';
                if (cfg.colorMode) {
                    cls += ` ${cfg.outline ? 'border' : 'focus'}-${cfg.colorMode}`;
                }
                this._eachMode('faceMode', mode => {
                    cls += ' border-' + mode;
                });
                let counter = Number.isFinite(cfg.maxlength) && cfg.counter ? `
                <div style="float:${cfg.counter.place}">
                <span class="counter ${cfg.counter.cls}"></span>
                </div>
                ` : '';
                return `
                    <textarea name="${this.name()}" jsfx-role="main" 
                    ${readonly}
                    ${autofocus}
                    ${maxLength}
                    style="resize:${cfg.resize}"
                    class="${cls}"
                    rows="${cfg.rows}"
                    placeholder="${cfg.placeholder}"></textarea>${counter}`;
            }
            _renderValue() {
                let v = this.value() || '';
                if (this._mainEl.val() == v)
                    return;
                this._mainEl.val(v);
            }
            _onAfterRender() {
                this._mainEl.on('input change paste', () => {
                    this._setValue(this._mainEl.val());
                    this._updateCounter();
                });
                super._onAfterRender();
            }
            _showError(msg) {
                super._showError(msg);
                this._mainEl.addClass('jsfx-input-error');
            }
            _hideError() {
                super._hideError();
                this._mainEl.removeClass('jsfx-input-error');
            }
        };
        TextArea = __decorate([
            widget('JS.fx.TextArea'),
            __metadata("design:paramtypes", [TextAreaConfig])
        ], TextArea);
        fx.TextArea = TextArea;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var TextArea = JS.fx.TextArea;
var TextAreaConfig = JS.fx.TextAreaConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        class TextEditorConfig extends fx.RowsInputConfig {
            constructor() {
                super(...arguments);
                this.toolbar = [
                    ['style', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
                    ['font', ['fontsize']],
                    ['color', ['forecolor', 'backcolor']],
                    ['para', ['ul', 'ol', 'paragraph', 'height']],
                    ['insert', ['hr', 'table', 'picture', 'link']],
                    ['view', ['fullscreen', 'codeview', 'undo', 'redo', 'help']]
                ];
                this.maxlength = Infinity;
                this.disableDragAndDrop = false;
                this.fontNames = ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New'];
            }
        }
        fx.TextEditorConfig = TextEditorConfig;
        let TextEditor = class TextEditor extends fx.RowsInput {
            constructor(cfg) {
                super(cfg);
            }
            undo() {
                this._mainEl.summernote('undo');
                return this;
            }
            redo() {
                this._mainEl.summernote('redo');
                return this;
            }
            readonly(is) {
                if (arguments.length == 0)
                    return this._config.readonly;
                this._mainEl.summernote('disable');
                this._config.readonly = is;
                return this;
            }
            disable() {
                this._mainEl.summernote('disable');
                this._config.disabled = true;
                return this;
            }
            enable() {
                this._mainEl.summernote('enable');
                this._config.disabled = false;
                return this;
            }
            focus() {
                this._mainEl.summernote('focus');
                return this;
            }
            insertImage(url, filename) {
                this._mainEl.summernote('insertImage', url, Types.isString(filename) ? filename : (img) => {
                    filename.apply(this, [img]);
                });
                return this;
            }
            insertNode(node) {
                this._mainEl.summernote('insertNode', node);
                return this;
            }
            insertText(text) {
                this._mainEl.summernote('insertText', text);
                return this;
            }
            insertHtml(html) {
                this._mainEl.summernote('pasteHTML', html);
                return this;
            }
            insertLink(text, href, isNewWindow) {
                this._mainEl.summernote('createLink', {
                    url: href || '#',
                    text: text,
                    isNewWindow: isNewWindow == undefined ? true : isNewWindow
                });
                return this;
            }
            _bodyFragment(type) {
                let cfg = this._config, counter = Number.isFinite(cfg.maxlength) && cfg.counter ? `
                <div style="float:${cfg.counter.place}">
                <span class="counter ${cfg.counter.cls}"></span>
                </div>
                ` : '';
                return `<div jsfx-role="main" class="summernote"></div>${counter}`;
            }
            _destroy() {
                this._mainEl.summernote('destroy');
                super._destroy();
            }
            _onAfterRender() {
                let cfg = this._config, callbacks = {
                    onInit: () => {
                        this._fire('init');
                    },
                    onBlur: () => {
                        this._fire('blur');
                    },
                    onFocus: () => {
                        this._fire('focus');
                    },
                    onEnter: () => {
                        this._fire('enter');
                    },
                    onKeyup: (e) => {
                        this._fire('keyup', [e.keyCode]);
                    },
                    onKeydown: (e) => {
                        this._fire('keydown', [e.keyCode]);
                    },
                    onMousedown: (e) => {
                        this._fire('mousedown', [e.keyCode]);
                    },
                    onMouseup: (e) => {
                        this._fire('mouseup', [e.keyCode]);
                    },
                    onPaste: () => {
                        this._fire('paste');
                    },
                    onImageUpload: (files) => {
                        this._fire('imageupload', [files]);
                    },
                    onChange: (html) => {
                        if (html != this.value())
                            this._setValue(html);
                    }
                }, snCfg = {
                    airMode: false,
                    dialogsInBody: true,
                    dialogsFade: true,
                    disableDragAndDrop: cfg.disableDragAndDrop,
                    focus: cfg.autofocus,
                    fontNames: cfg.fontNames,
                    width: cfg.width,
                    height: cfg.height,
                    lang: cfg.locale,
                    placeholder: cfg.placeholder,
                    toolbar: cfg.toolbar,
                    callbacks: callbacks
                };
                if (cfg.buttons) {
                    let btnNames = [], btnJson = {};
                    cfg.buttons.forEach(btn => {
                        btnNames.push(btn.name);
                        btnJson[btn.name] = (ctx) => {
                            var ui = $.summernote.ui, button = ui.button({
                                contents: btn.html,
                                tooltip: btn.tip,
                                click: () => {
                                    btn.onClick.apply(this, [btn]);
                                }
                            });
                            return button.render();
                        };
                    });
                    snCfg.toolbar.push(['mybutton', btnNames]);
                    snCfg.buttons = btnJson;
                }
                this._mainEl.summernote(snCfg);
                if (!this.isEmpty())
                    this.widgetEl.find('.note-placeholder').css('display', 'none');
                let cls = '';
                this._eachMode('faceMode', mode => {
                    cls += ' border-' + mode;
                });
                this.widgetEl.find('div.note-editor').addClass(cls);
                super._onAfterRender();
            }
            _onAfterInit() {
                if (this.readonly())
                    this.readonly(true);
            }
            isEmpty() {
                return this._mainEl.summernote('isEmpty');
            }
            value(val) {
                let cfg = this._config, oldVal = this._valueModel.get(this.name()) || '';
                if (arguments.length == 0)
                    return oldVal;
                val = val || '';
                if (val != (this._getDomValue() || ''))
                    this._mainEl.summernote('code', val);
                return this;
            }
            _iniValue() {
                let cfg = this._config, v = cfg.iniValue || '';
                this._mainEl.summernote('code', v);
                this._setValue(v, true);
            }
            _getDomValue() {
                if (this.isEmpty())
                    return '';
                let v = this._mainEl.summernote('code');
                return v == void 0 ? '' : v;
            }
            _showError(msg) {
                super._showError(msg);
                this.widgetEl.find('.note-editor').addClass('jsfx-input-error');
            }
            _hideError() {
                super._hideError();
                this.widgetEl.find('.note-editor').removeClass('jsfx-input-error');
            }
        };
        TextEditor = __decorate([
            widget('JS.fx.TextEditor'),
            __metadata("design:paramtypes", [TextEditorConfig])
        ], TextEditor);
        fx.TextEditor = TextEditor;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var TextEditor = JS.fx.TextEditor;
var TextEditorConfig = JS.fx.TextEditorConfig;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let toastrPosition = {
            lt: 'toast-top-left',
            rt: 'toast-top-right',
            ct: 'toast-top-center',
            lb: 'toast-bottom-left',
            rb: 'toast-bottom-right',
            cb: 'toast-bottom-center'
        };
        class ToastConfig {
            constructor() {
                this.htmlable = false;
                this.type = 'info';
                this.progressBar = false;
                this.place = 'ct';
            }
        }
        fx.ToastConfig = ToastConfig;
        let Toast = class Toast {
            static show(cfg) {
                if (!cfg.title && !cfg.message)
                    return;
                let c = Jsons.union(new ToastConfig(), cfg);
                if (cfg.timeout == 0)
                    c.extendedTimeOut = 0;
                c.toastClass = 'toast jsfx-toast ' + cfg.cls || '';
                c.escapeHtml = !c.htmlable;
                c.timeOut = c.timeout;
                delete c['cls'];
                delete c['htmlable'];
                delete c['timeout'];
                let lts = cfg.listeners;
                if (lts) {
                    if (lts.shown)
                        c.onShown = () => { lts.shown.apply(null, [new Event('shown')]); };
                    if (lts.hidden)
                        c.onHidden = () => { lts.shown.apply(null, [new Event('hidden')]); };
                    if (lts.closeclick)
                        c.onCloseClick = () => { lts.shown.apply(null, [new Event('closeclick')]); };
                    if (lts.click)
                        c.onclick = () => { lts.shown.apply(null, [new Event('click')]); };
                    delete c['listeners'];
                }
                c.positionClass = toastrPosition[cfg.place || 'ct'];
                delete c['place'];
                toastr.options = c;
                toastr[cfg.type](cfg.message, cfg.title);
            }
            static clearAll() {
                toastr.remove();
            }
        };
        Toast = __decorate([
            widget('JS.fx.Toast')
        ], Toast);
        fx.Toast = Toast;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Toast = JS.fx.Toast;
var ToastConfig = JS.fx.ToastConfig;
var JS;
(function (JS) {
    let util;
    (function (util) {
        class FileTypes {
        }
        FileTypes.CODES = 'c,h,cpp,ini,idl,hpp,hxx,hp,hh,cxx,cc,s,asm,log,bak,' +
            'as,ts,js,json,xml,html,htm,xhtml,xht,css,md,mkd,markdown,' +
            'java,properties,jsp,vm,ftl,' +
            'swift,m,mm,' +
            'cgi,sh,applescript,bat,sql,rb,py,php,php3,php4,' +
            'p,pp,pas,dpr,cls,frm,vb,bas,vbs,' +
            'cs,config,asp,aspx,' +
            'yaml,vhd,vhdl,cbl,cob,coffee,clj,lisp,lsp,cl,jl,el,erl,groovy,less,lua,go,ml,pl,pm,al,perl,r,scala,st,tcl,tk,itk,v,y,d,' +
            'xq,xql,xqm,xqy,xquery';
        FileTypes.IMAGES = 'pic,jpg,jpeg,png,gif,bmp,webp,tif,tiff,svg,wbmp,tga,pcx,ico,psd,ai';
        FileTypes.DOCS = 'md,markdown,msg,eml,txt,rtf,pdf,doc,docx,csv,xls,xlsx,ppt,pptx,wps';
        FileTypes.ZIPS = 'zip,7z,z,bz2,gz,tar,taz,tgz,rar,arj,lzh';
        FileTypes.VIDEOS = 'mp4,rm,rmvb,mpg,mpeg,mpg4,avi,dv,3gpp,asf,asx,wmv,qt,mov,ogv,flv,mkv,webm';
        FileTypes.AUDIOS = 'ogg,wav,mpga,mp2,mp3,au,snd,mid,midi,ra,ram,aif,aiff,webm';
        util.FileTypes = FileTypes;
        let FileSizeUnit;
        (function (FileSizeUnit) {
            FileSizeUnit["B"] = "B";
            FileSizeUnit["KB"] = "KB";
            FileSizeUnit["MB"] = "MB";
            FileSizeUnit["GB"] = "GB";
            FileSizeUnit["TB"] = "TB";
        })(FileSizeUnit = util.FileSizeUnit || (util.FileSizeUnit = {}));
        class Files {
            static getFileName(path) {
                let pos = path.lastIndexOf('/');
                if (pos < 0)
                    return path;
                return path.slice(pos + 1);
            }
            static getFileType(path) {
                let pos = path.lastIndexOf('.');
                if (pos < 0)
                    return '';
                return path.slice(pos + 1);
            }
            static isFileType(path, exts) {
                if (!path || !exts)
                    return false;
                let ext = this.getFileType(path);
                return ext ? (exts.toLowerCase() + ',').indexOf(ext + ',') >= 0 : false;
            }
            static convertSize(size, orgUnit, tarUnit) {
                if (!size)
                    return 0;
                let s = Number(size);
                if (s <= 0)
                    return 0;
                let map = {
                    'B': 0, 'KB': 1, 'MB': 2, 'GB': 3, 'TB': 4
                }, r1 = map[orgUnit], r2 = map[tarUnit];
                return s * Math.pow(1024, r1 - r2);
            }
            static toSizeString(byte, sizeUnit) {
                let unit = sizeUnit || FileSizeUnit.B, TC = this.convertSize;
                if (!byte)
                    return '0' + unit;
                let kb = TC(byte, unit, FileSizeUnit.KB);
                if (kb == 0)
                    return '0' + unit;
                if (kb < 1)
                    return byte + 'B';
                let mb = TC(byte, unit, FileSizeUnit.MB);
                if (mb < 1)
                    return kb + 'KB';
                let gb = TC(byte, unit, FileSizeUnit.GB);
                if (gb < 1)
                    return mb + 'MB';
                let tb = TC(byte, unit, FileSizeUnit.TB);
                return tb < 1 ? (gb + 'GB') : (tb + 'TB');
            }
        }
        Files.ONE_KB = 1024;
        Files.ONE_MB = 1048576;
        Files.ONE_GB = 1073741824;
        Files.ONE_TB = 1099511627776;
        util.Files = Files;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var FileSizeUnit = JS.util.FileSizeUnit;
var Files = JS.util.Files;
var FileTypes = JS.util.FileTypes;
var JS;
(function (JS) {
    let fx;
    (function (fx) {
        let E = Check.isEmpty, A = Arrays;
        let UploaderFaceMode;
        (function (UploaderFaceMode) {
            UploaderFaceMode["list"] = "list";
            UploaderFaceMode["image"] = "image";
            UploaderFaceMode["square"] = "square";
            UploaderFaceMode["round"] = "round";
            UploaderFaceMode["shadow"] = "shadow";
        })(UploaderFaceMode = fx.UploaderFaceMode || (fx.UploaderFaceMode = {}));
        class UploaderConfig extends fx.FormWidgetConfig {
            constructor() {
                super(...arguments);
                this.readonly = false;
                this.dnd = false;
                this.paste = false;
                this.thumb = { width: 1, height: 1 };
                this.duplicate = true;
                this.multiple = false;
                this.fieldName = 'file';
                this.faceMode = [UploaderFaceMode.square, UploaderFaceMode.list];
                this.iniValue = null;
                this.data = null;
            }
        }
        fx.UploaderConfig = UploaderConfig;
        let Uploader = class Uploader extends fx.FormWidget {
            constructor(cfg) {
                super(cfg);
            }
            _initUploader(cfg) {
                if (this._uploader)
                    return;
                let me = this;
                $('#' + this.id).find('.classic-pick').on('click', function () {
                    $('#' + me.id).find('.webuploader-element-invisible').click();
                });
                let url = JS.config('libs')['webuploader.swf'];
                url = url.startsWith('~') ? (JS.config('libRoot') || '') + url.slice(1) : url;
                let cf = {
                    pick: {
                        id: `#${this.id} .pick`,
                        multiple: cfg.multiple
                    },
                    paste: cfg.paste == true ? `#${this.id}` : (cfg.paste == 'body' ? document.body : undefined),
                    dnd: cfg.dnd ? `#${this.id}` : undefined,
                    swf: url,
                    auto: true,
                    accept: cfg.accept || null,
                    fileNumLimit: cfg.maxNumbers || undefined,
                    fileSizeLimit: cfg.maxTotalSize || undefined,
                    fileSingleSizeLimit: cfg.maxSingleSize || undefined,
                    disableGlobalDnd: false,
                    duplicate: cfg.duplicate,
                    fileVal: cfg.fieldName,
                    formData: cfg.uploadData || {},
                    thumb: {
                        width: cfg.thumb && cfg.thumb.width,
                        height: cfg.thumb && cfg.thumb.height,
                        allowMagnify: false,
                        crop: false,
                        type: ''
                    },
                    compress: cfg.compress && cfg.compress.width && cfg.compress.height ? {
                        width: cfg.compress.width,
                        height: cfg.compress.height,
                        quality: 90,
                        allowMagnify: false,
                        crop: false,
                        preserveHeaders: true,
                        noCompressIfLarger: true,
                        compressSize: 0
                    } : false
                };
                this._uploader = WebUploader.Uploader.create(cf);
                let eMap = {
                    'adding': 'beforeFileQueued',
                    'added': 'filesQueued',
                    'removed': 'fileDequeued',
                    'uploading': 'uploadStart',
                    'uploadprogress': 'uploadProgress',
                    'uploadsuccess': 'uploadSuccess',
                    'uploaderror': 'uploadError',
                    'uploaded': 'uploadComplete',
                    'beginupload': 'startUpload',
                    'endupload': 'uploadFinished'
                };
                this._uploader.on(eMap['adding'], function (file) {
                    return me._fire('adding', [me._toMimeFile(file)]);
                });
                this._uploader.on(eMap['added'], function (files) {
                    files.forEach((file) => {
                        me._onFileQueued(file);
                    });
                    me._fire('added', [me._toMimeFiles(files)]);
                });
                this._uploader.on(eMap['removed'], function (file) {
                    me._onFileDequeued(file);
                    me._fire('removed', [me._toMimeFile(file)]);
                });
                this._uploader.on(eMap['uploading'], function (file, percentage) {
                    me._fire('uploading', [me._toMimeFile(file), percentage]);
                });
                this._uploader.on(eMap['uploaderror'], function (file, reason) {
                    me._onUploadFail(file);
                    me._fire('uploaderror', [me._toMimeFile(file), reason]);
                });
                this._uploader.on(eMap['uploadsuccess'], function (file, response) {
                    me._onUploadSuccess(file, response);
                    me._fire('uploadsuccess', [me._toMimeFile(file), response]);
                });
                this._uploader.on(eMap['uploaded'], function (file) {
                    me._fire('uploaded', [me._toMimeFile(file)]);
                });
                this._uploader.on(eMap['beginupload'], function () {
                    me._fire('beginupload');
                });
                this._uploader.on(eMap['endupload'], function () {
                    me._fire('endupload');
                });
                let errors = {
                    'F_EXCEED_SIZE': 'exceedMaxSize',
                    'F_DUPLICATE': 'wrongDuplicate',
                    'Q_TYPE_DENIED': 'wrongType',
                    'Q_EXCEED_NUM_LIMIT': 'exceedNumbers',
                    'Q_EXCEED_SIZE_LIMIT': 'exceedMaxTotalSize'
                };
                this._uploader.on('error', (type) => {
                    fx.Toast.show({ type: 'error', message: me._i18n(errors[type]), place: 'cb' });
                });
            }
            _showError(msg) {
                super._showError(msg);
                this.widgetEl.find('.body').addClass('jsfx-input-error');
            }
            _hideError() {
                super._hideError();
                this.widgetEl.find('.body').removeClass('jsfx-input-error');
            }
            _onAfterRender() {
                this._initUploader(this._config);
                super._onAfterRender();
            }
            _createShadow(id, ctor) {
                return $(`<div id="${id}"></div>`).css({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: "#808080",
                    opacity: 0.1,
                    zIndex: (Number(ctor.css('z-index')) || 0) + 1
                });
            }
            readonly(is) {
                let cfg = this._config;
                if (arguments.length == 0)
                    return cfg.readonly;
                if (cfg.readonly == is)
                    return this;
                cfg.readonly = is;
                $(`#${this.id} .body`)[is ? 'addClass' : 'removeClass']('readonly');
                let p = $(`#${this.id} .pick`);
                is ? p.hide() : p.show();
                return this;
            }
            disable() {
                if (!this.isEnabled())
                    return this;
                this._config.disabled = true;
                let ctor = $(`#${this.id} .body`).addClass('disabled');
                this._createShadow(this.id + '_shadow', ctor).appendTo(ctor);
                return this;
            }
            enable() {
                if (this.isEnabled())
                    return this;
                this._config.disabled = false;
                $(`#${this.id} .body`).removeClass('disabled');
                $('#' + this.id + '_shadow').remove();
                return this;
            }
            _pickText(key) {
                let cfg = this._config, fileExts = (cfg.accept && cfg.accept.title) || '*', maxTotalSize = cfg.maxTotalSize ? Files.toSizeString(cfg.maxTotalSize) : '*', maxNumbers = cfg.maxNumbers || '*', maxSingleSize = cfg.maxSingleSize ? Files.toSizeString(cfg.maxSingleSize) : '*';
                return Strings.merge(this._i18n(key) || '', {
                    fileExts: fileExts,
                    maxTotalSize: maxTotalSize,
                    maxNumbers: maxNumbers,
                    maxSingleSize: maxSingleSize
                });
            }
            _bodyFragment() {
                let cfg = this._config, title = this._pickText('pickTitle'), tip = this._pickText('pickTip').replace(/\n/g, '&#10;'), fag = !this._hasFaceMode(UploaderFaceMode.image) ?
                    `<ul class="files-area list"></ul>` :
                    `<div class="files-area image"></div>`, cls = '';
                if (this._hasFaceMode(UploaderFaceMode.shadow))
                    cls += ' border-shadow';
                if (this._hasFaceMode(UploaderFaceMode.round))
                    cls += ' border-round';
                return `
                <div class="body font-${cfg.sizeMode || 'md'}${cls}">
                    <div class="pick" title="${tip}">
                        <i class="la la-cloud-upload"></i>
                        <span class="pick-title">${title}</span>
                    </div>
                    ${fag}
                </div>`;
            }
            isCrud() {
                return true;
            }
            crudValue() {
                let val = this.value() || [], iniVal = this.iniValue() || [], arr = [];
                iniVal.forEach(v => {
                    if (val.findIndex(it => {
                        return it.id == v.id;
                    }) < 0) {
                        arr[arr.length] = Jsons.union(v, { _crud: 'D' });
                    }
                });
                val.forEach(v => {
                    if (iniVal.findIndex(it => {
                        return it.id == v.id;
                    }) < 0) {
                        if (!v.id.startsWith('WU_FILE_') && v.id != v['_wuid'])
                            arr[arr.length] = Jsons.union(v, { _crud: 'C' });
                    }
                });
                return arr;
            }
            iniValue(v, render) {
                if (arguments.length == 0)
                    return super.iniValue();
                return super.iniValue(v, render);
            }
            value(file) {
                if (arguments.length == 0)
                    return super.value();
                if (E(file)) {
                    this._uploader.reset();
                    $(`#${this.id} .files-area`).children().remove();
                    this._setValue(null);
                    return this;
                }
                return this.add(file);
            }
            _equalValues(newVal, oldVal) {
                return A.equal(oldVal, newVal, (file1, file2) => {
                    return file1.id == file2.id;
                });
            }
            add(file) {
                if (E(file))
                    return this;
                this._addFiles(A.toArray(file));
                return this;
            }
            remove(id) {
                if (E(id))
                    return this;
                let rms = A.toArray(id);
                rms.forEach(i => {
                    let el = this.widgetEl.find(`[file-id="${i}"]`);
                    if (el.length == 1)
                        this._removeFile(el.attr('wu-id'));
                });
                return this;
            }
            data(data) {
                if (arguments.length == 0)
                    return this.value();
                return this.value(data);
            }
            _onUploadSuccess(wuFile, res) {
                let cfg = this._config, fmt = cfg.dataFormat, result = Types.isFunction(fmt) ? fmt.apply(this, res) : ResultSet.parseJSON(res, fmt);
                if (result.success()) {
                    let file = result.data(), val = this.value() || [], index = val.findIndex(item => {
                        return wuFile.id == item.id;
                    });
                    if (index >= 0) {
                        let oFile = val[index];
                        oFile.id = file.id;
                        oFile.uri = file.uri;
                    }
                }
                else {
                    this._onUploadFail(wuFile);
                }
            }
            _onUploadFail(file) {
                this.widgetEl.find(`[file-id="${file.id}"]`).addClass('fail');
            }
            _onFileDequeued(file) {
                this.widgetEl.find(`[wu-id="${file.id}"]`).remove();
                let newVal = Jsons.clone(this.value()).remove((mFile) => { return mFile['_wuid'] == file.id; });
                this._valueModel.set(this.name(), newVal);
            }
            _fileIcon(path) {
                let icon = 'alt';
                if (Files.isFileType(path, 'pdf')) {
                    icon = 'pdf';
                }
                else if (Files.isFileType(path, 'doc,docx')) {
                    icon = 'word';
                }
                else if (Files.isFileType(path, 'xls,xlsx')) {
                    icon = 'excel';
                }
                else if (Files.isFileType(path, 'ppt,pptx')) {
                    icon = 'powerpoint';
                }
                else if (Files.isFileType(path, FileTypes.AUDIOS)) {
                    icon = 'audio';
                }
                else if (Files.isFileType(path, FileTypes.VIDEOS)) {
                    icon = 'video';
                }
                else if (Files.isFileType(path, FileTypes.ZIPS)) {
                    icon = 'archive';
                }
                else if (Files.isFileType(path, FileTypes.CODES)) {
                    icon = 'code';
                }
                else if (Files.isFileType(path, FileTypes.IMAGES)) {
                    icon = 'image';
                }
                return '<span><i class="far fa-file-' + icon + '"></i></span>';
            }
            _onFileQueued(wuFile) {
                let file = this._toMimeFile(wuFile);
                this._renderFile(file);
                if (this._hasFaceMode(UploaderFaceMode.image)) {
                    let isImage = Files.isFileType(file.name, FileTypes.IMAGES);
                    if (!file.uri && isImage) {
                        this._makeThumb(wuFile);
                    }
                    else if (!isImage)
                        this.widgetEl.find(`[file-id=${file.id}] img`).replaceWith(this._fileIcon('.' + file.ext));
                }
                if (file.uri)
                    this._uploader.skipFile(wuFile.id);
                file['_wuid'] = wuFile.id;
                this.widgetEl.find('[file-id]:last-child').attr('wu-id', wuFile.id);
                this._setValue((this.value() || []).concat(file));
            }
            _renderFile(file) {
                let url = file.uri || '', fId = file.id || '', fileLink = `<a id="${this.id}-${fId}" src="${url}" href="javascript:void(0);">${file.name}</a>`, retryTip = this._i18n('retryTip') || 'Retry', removeTip = this._i18n('removeTip') || 'Remove', html = !this._hasFaceMode(UploaderFaceMode.image) ?
                    $(`<li file-id="${fId}">
                    <div class="text-truncate file-name" title="${Strings.escapeHTML(file.name)}">
                        ${this._fileIcon('.' + file.ext)}
                        ${fileLink}
                    </div>
                    <div class="file-actions">
                        <span class="action remove text-center" title="${removeTip}"><i class="fa fa-times"></i></span>
                        <span class="action retry text-center" title="${retryTip}"><i class="fa fa-upload"></i></span>
                    </div>
                </li>`)
                    : $(`
                    <div file-id="${fId}">
                    <div class="file-image-area">
                        <div class="file-image items-center items-middle"><img id="${this.id}-${fId}" src="${url}"/></div>
                        <div class="file-actions">
                            <span class="action remove text-center" title="${removeTip}"><i class="fa fa-times"></i></span>
                            <span class="action retry text-center" title="${retryTip}"><i class="fa fa-upload"></i></span>
                        </div>
                    </div>
                    <div class="text-truncate file-name" title="${Strings.escapeHTML(file.name)}">
                    ${fileLink}
                    </div>
                    </div>
                `);
                this.widgetEl.find(`.files-area`).append(html);
                this._bindActions(fId);
            }
            _makeThumb(file) {
                this._uploader.makeThumb(file, (error, src) => {
                    let el = this.widgetEl.find(`[file-id=${file.id}]`);
                    if (error) {
                        el.find('img').replaceWith(this._fileIcon('.' + file.ext));
                        return;
                    }
                    el.find(`#${this.id}-${file.id}`).attr('src', src);
                });
            }
            _bindActions(fileId) {
                let fEl = this.widgetEl.find(`[file-id="${fileId}"]`);
                fEl.on('click', !this._hasFaceMode(UploaderFaceMode.image) ? 'a' : 'a,.file-image', (e) => {
                    let src = this.widgetEl.find(`#${this.id}-${fileId}`).attr('src');
                    if (src) {
                        (Files.isFileType(src, FileTypes.IMAGES) || src.indexOf('data:image/') == 0) ? window.open().document.body.innerHTML = `<img src="${src}" >` : window.open(src);
                    }
                    else {
                        fx.Toast.show({
                            type: 'error',
                            message: this._i18n('viewDenied')
                        });
                    }
                    return false;
                });
                fEl.on('click', '.action.remove', (e) => {
                    this._removeFile(fEl.attr('wu-id'));
                    fEl.remove();
                    return false;
                });
                fEl.on('click', '.action.retry', (e) => {
                    this._retryFile(fEl.attr('wu-id'));
                    return false;
                });
            }
            _toMimeFiles(wfs) {
                if (E(wfs))
                    return [];
                let fs = [];
                wfs.forEach(file => {
                    fs.push(this._toMimeFile(file));
                });
                return fs;
            }
            _toMimeFile(wf) {
                if (!wf)
                    return null;
                return {
                    id: wf.source.id || wf.id,
                    mime: wf.type,
                    name: wf.name,
                    ext: wf.ext,
                    size: wf.size,
                    uri: wf.source.uri
                };
            }
            _toWUFile(cf) {
                if (!cf)
                    return null;
                if (!cf.uri)
                    throw new URIError(`The file<${cf.name}> has not URI.`);
                let file = {
                    id: cf.id,
                    type: cf.mime,
                    name: cf.name,
                    ext: cf.ext || Files.getFileType(cf.name),
                    size: cf.size || 1,
                    getRuid: () => { return ''; },
                    getSource: () => { return null; }
                };
                file['uri'] = cf.uri;
                return file;
            }
            _removeFile(wuFileId) {
                let f = this._uploader.getFile(wuFileId);
                if (f)
                    this._uploader.removeFile(f, true);
                return this;
            }
            _retryFile(wuFileId) {
                let f = this._uploader.getFile(wuFileId);
                if (f)
                    this._uploader.retry(f);
                return this;
            }
            _addFiles(files) {
                if (E(files))
                    return this;
                let wuFiles = [], value = this.value() || [];
                files.forEach(f => {
                    if (value.findIndex((v) => { return v.id == f.id; }) < 0)
                        wuFiles.push(new WebUploader.File(this._toWUFile(f)));
                });
                if (wuFiles.length > 0)
                    this._uploader.addFiles(wuFiles);
                return this;
            }
            inProgress() {
                return this._uploader.isInProgress();
            }
        };
        Uploader.I18N = {
            pickTitle: 'Select your local files please',
            pickTip: '<Accepts>\nFileExts={fileExts}\nMaxTotalSize={maxTotalSize}\nMaxNumbers={maxNumbers}\nMaxSingleSize={maxSingleSize}',
            retryTip: 'Retry',
            removeTip: 'Remove',
            viewDenied: 'The file can\'t be viewed in local mode',
            exceedMaxSize: 'Exceed the max size of single file',
            wrongDuplicate: 'Can\'t upload duplicate file',
            wrongType: 'Wrong file type',
            exceedNumbers: 'Exceed the max numbers of file',
            exceedMaxTotalSize: 'Exceed the max size of total files'
        };
        Uploader = __decorate([
            widget('JS.fx.Uploader'),
            __metadata("design:paramtypes", [UploaderConfig])
        ], Uploader);
        fx.Uploader = Uploader;
    })(fx = JS.fx || (JS.fx = {}));
})(JS || (JS = {}));
var Uploader = JS.fx.Uploader;
var UploaderConfig = JS.fx.UploaderConfig;
var UploaderFaceMode = JS.fx.UploaderFaceMode;
var JS;
(function (JS) {
    let input;
    (function (input) {
        let MouseButton;
        (function (MouseButton) {
            MouseButton[MouseButton["LEFT"] = 0] = "LEFT";
            MouseButton[MouseButton["MIDDLE"] = 1] = "MIDDLE";
            MouseButton[MouseButton["RIGHT"] = 2] = "RIGHT";
        })(MouseButton = input.MouseButton || (input.MouseButton = {}));
    })(input = JS.input || (JS.input = {}));
})(JS || (JS = {}));
var MouseButton = JS.input.MouseButton;
var JS;
(function (JS) {
    let input;
    (function (input) {
        class Cursors {
            static set(sty, el = document.body) {
                el.style.cursor = sty;
            }
            static url(url, el = document.body) {
                el.style.cursor = `url("${url}")`;
            }
        }
        input.Cursors = Cursors;
    })(input = JS.input || (JS.input = {}));
})(JS || (JS = {}));
var Cursors = JS.input.Cursors;
var JS;
(function (JS) {
    let input;
    (function (input) {
        class Keyboards {
            static newEvent(type, args) {
                let a = Jsons.union({
                    bubbles: false,
                    cancelable: false,
                    view: null,
                    ctrlKey: false,
                    altKey: false,
                    shiftKey: false,
                    metaKey: false
                }, args), doc = a.target ? a.target.ownerDocument : document;
                a.view = a.view || doc.defaultView;
                let eo = new KeyboardEvent(type, a);
                Object.defineProperty(eo, 'keyCode', {
                    value: a.keyCode,
                    writable: true
                });
                if (a.target)
                    Object.defineProperty(eo, 'target', {
                        value: a.target,
                        writable: true
                    });
                return eo;
            }
            static fireEvent(type, args) {
                let n = (args && args.target) || window;
                n.dispatchEvent(this.newEvent(type, args));
            }
        }
        input.Keyboards = Keyboards;
    })(input = JS.input || (JS.input = {}));
})(JS || (JS = {}));
var Keyboards = JS.input.Keyboards;
var JS;
(function (JS) {
    let input;
    (function (input) {
        input.VK = {
            BACK_SPACE: 8,
            TAB: 9,
            ENTER: 13,
            SHIFT: 16,
            CTRL: 17,
            ALT: 18,
            PAUSE: 19,
            CAPS_LOCK: 20,
            ESC: 27,
            SPACE: 32,
            PAGE_UP: 33,
            PAGE_DOWN: 34,
            END: 35,
            HOME: 36,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            PRINT_SCREEN: 44,
            INSERT: 45,
            DELETE: 46,
            KEY0: 48,
            KEY1: 49,
            KEY2: 50,
            KEY3: 51,
            KEY4: 52,
            KEY5: 53,
            KEY6: 54,
            KEY7: 55,
            KEY8: 56,
            KEY9: 57,
            A: 65,
            B: 66,
            C: 67,
            D: 68,
            E: 69,
            F: 70,
            G: 71,
            H: 72,
            I: 73,
            J: 74,
            K: 75,
            L: 76,
            M: 77,
            N: 78,
            O: 79,
            P: 80,
            Q: 81,
            R: 82,
            S: 83,
            T: 84,
            U: 85,
            V: 86,
            W: 87,
            X: 88,
            Y: 89,
            Z: 90,
            PAD0: 96,
            PAD1: 97,
            PAD2: 98,
            PAD3: 99,
            PAD4: 100,
            PAD5: 101,
            PAD6: 102,
            PAD7: 103,
            PAD8: 104,
            PAD9: 105,
            MULTIPLY: 106,
            PLUS: 107,
            SUBTRACT: 109,
            DECIMAL: 110,
            DIVIDE: 111,
            F1: 112,
            F2: 113,
            F3: 114,
            F4: 115,
            F5: 116,
            F6: 117,
            F7: 118,
            F8: 119,
            F9: 120,
            F10: 121,
            F11: 122,
            F12: 123,
            NUM_LOCK: 144,
            SCROLL_LOCK: 145,
            META_LEFT: 91,
            META_RIGHT: 93,
            SEMICOLON: 186,
            EQUAL_SIGN: 187,
            COMMA: 188,
            HYPHEN: 189,
            PERIOD: 190,
            SLASH: 191,
            APOSTROPHE: 192,
            LEFT_SQUARE_BRACKET: 219,
            BACK_SLASH: 220,
            RIGHT_SQUARE_BRACKET: 221,
            QUOTE: 222
        };
    })(input = JS.input || (JS.input = {}));
})(JS || (JS = {}));
var VK = JS.input.VK;
var JS;
(function (JS) {
    let input;
    (function (input) {
        let J = Jsons;
        class Keys {
            constructor(el) {
                this._mapping = {};
                this._d = false;
                this._i = Infinity;
                this._ts = 0;
                let ele = el || window, T = this;
                T._m = {};
                T._q = new Queue(16);
                T._busDown = new EventBus(ele);
                T._busUp = new EventBus(ele);
                ele.on('keydown', (e) => {
                    let c = e.keyCode, sz = T._q.size(), lastC = T._q.get(sz - 1), repeat = sz > 0 && c === lastC;
                    if (T._q.isFull())
                        T._q.remove();
                    if (!repeat) {
                        if (lastC == null)
                            T._ts = e.timeStamp;
                        if (e.timeStamp - T._ts <= T._i)
                            T._q.add(c);
                    }
                    T._ts = e.timeStamp;
                    if (!J.hasKey(T._m, c) || !repeat)
                        T._m[c] = e.timeStamp;
                    if (!repeat && J.hasKey(T._m, c))
                        T._fireCheck(c, T._busDown);
                });
                ele.on('keyup', (e) => {
                    let c = e.keyCode;
                    if (J.hasKey(T._m, c)) {
                        T._fireCheck(c, T._busUp);
                        delete T._m[e.keyCode];
                    }
                });
            }
            _fireCheck(c, bus) {
                let T = this, types = bus.types();
                types.forEach(ty => {
                    if (T.isHotKeys(ty) && T._endsWithCode(c, ty, '+') && T._isHotKeysPressing(ty))
                        bus.fire(input.Keyboards.newEvent(ty, { keyCode: c }), [this]);
                    if (T.isSeqKeys(ty) && T._endsWithCode(c, ty, ',') && T._isSeqKeysPressing(ty))
                        bus.fire(input.Keyboards.newEvent(ty, { keyCode: c }), [this]);
                    if (input.VK[ty] == c && T.isPressingKey(c))
                        bus.fire(input.Keyboards.newEvent(ty, { keyCode: c }), [this]);
                });
            }
            _endsWithCode(c, ty, sn) {
                return (this._mapping[ty] + sn).endsWith(c + sn);
            }
            isSeqKeys(k) {
                return k && k.indexOf(',') > 0;
            }
            isHotKeys(k) {
                return k && k.indexOf('+') > 0;
            }
            _on(k, fn, bus) {
                let T = this, ty = T._keyChar(k);
                if (!J.hasKey(T._mapping, ty))
                    T._mapping[ty] = T._numeric(ty, T.isHotKeys(ty) ? '+' : (T.isSeqKeys(ty) ? ',' : ''));
                bus.on(ty, fn);
                return T;
            }
            onKeyDown(k, fn) {
                return this._on(k, fn, this._busDown);
            }
            onKeyUp(k, fn) {
                return this._on(k, fn, this._busUp);
            }
            _off(bus, k) {
                this._check();
                bus.off(k ? this._keyChar(k) : undefined);
                return this;
            }
            offKeyDown(k) {
                return this._off(this._busDown, k);
            }
            offKeyUp(k) {
                return this._off(this._busUp, k);
            }
            _equalsSeqkeys(keys, keyCodes) {
                let sa = '';
                keys.forEach((b, i) => {
                    if (i == 0) {
                        sa += input.VK[b];
                    }
                    else {
                        sa += `,${input.VK[b]}`;
                    }
                });
                return keyCodes.endsWith(sa + ']');
            }
            _isSeqKeysPressing(k) {
                let a = k.split('\,'), l = a.length;
                if (l == 1)
                    return false;
                let lk = a[l - 1], m = this, codes = this._q.toString();
                if (m.isHotKeys(lk)) {
                    if (!m._isHotKeysPressing(lk))
                        return false;
                    a.remove(l - 1);
                    a.add(lk.split('\+'));
                }
                else {
                    if (!m.isPressingKey(lk))
                        return false;
                }
                return this._equalsSeqkeys(a, codes);
            }
            _keyChar(s) {
                return s.replace(/\s*/g, '').toUpperCase();
            }
            _isHotKeysPressing(k) {
                let T = this, s = T._keyChar(k), a = s.split('\+');
                if (a.length == 1)
                    return false;
                return a.every((b, i) => {
                    if (i > 0 && !T.beforeKeyDown(a[i - 1], b))
                        return false;
                    return T.isPressingKey(b);
                });
            }
            _numeric(ty, sign) {
                if (!sign)
                    return input.VK[ty];
                let a = ty.split(sign), sk = '';
                a.forEach(k => {
                    sk += `${!sk ? '' : sign}${input.VK[k.toUpperCase()]}`;
                });
                return sk;
            }
            isPressingKeys(keys) {
                let T = this, k = T._keyChar(keys);
                if (!k)
                    return false;
                if (T.isSeqKeys(k)) {
                    return T._isSeqKeysPressing(k);
                }
                else if (T.isHotKeys(k)) {
                    return T._isHotKeysPressing(k);
                }
                return this.isPressingKey(input.VK[k]);
            }
            isPressingKey(c) {
                let T = this, n = c == void 0 ? null : (Types.isNumber(c) ? c : input.VK[T._keyChar(c)]);
                return J.hasKey(T._m, n);
            }
            getPressingQueue() {
                return this._q.clone();
            }
            seqInterval(t) {
                if (t == void 0)
                    return this._i;
                this._i = t;
                return this;
            }
            getKeyDownTime(c) {
                let T = this, n = c == void 0 ? null : (Types.isNumber(c) ? c : input.VK[T._keyChar(c)]);
                return !J.hasKey(T._m, n) ? 0 : T._m[n];
            }
            beforeKeyDown(k1, k2) {
                let d1 = this.getKeyDownTime(k1), d2 = this.getKeyDownTime(k2);
                return d1 > 0 && d2 > 0 && d1 < d2;
            }
            off() {
                let T = this;
                T._check();
                T._busDown.off();
                T._busUp.off();
                return T;
            }
            clear(c) {
                let T = this;
                if (c == void 0) {
                    T._mapping = {};
                    T._m = {};
                    T._q.clear();
                    T._ts = 0;
                    return;
                }
                let a = Types.isNumber(c) ? [c] : c;
                a.forEach(k => {
                    T._m[k] = null;
                });
                return T;
            }
            _check() {
                if (this._d)
                    throw new RefusedError();
            }
            destroy() {
                let T = this;
                T._d = true;
                T.clear();
                T._busDown.destroy();
                T._busUp.destroy();
            }
        }
        input.Keys = Keys;
    })(input = JS.input || (JS.input = {}));
})(JS || (JS = {}));
var Keys = JS.input.Keys;
var JS;
(function (JS) {
    let input;
    (function (input) {
        class MouseEventInits {
            constructor() {
                this.target = null;
                this.bubbles = false;
                this.cancelable = false;
                this.view = null;
                this.screenX = 0;
                this.screenY = 0;
                this.clientX = 0;
                this.clientY = 0;
                this.ctrlKey = false;
                this.altKey = false;
                this.shiftKey = false;
                this.metaKey = false;
                this.button = 0;
                this.buttons = 0;
                this.relatedTarget = null;
            }
        }
        input.MouseEventInits = MouseEventInits;
        class Mouses {
            static newEvent(type, args) {
                let m = Jsons.union(new MouseEventInits(), args), doc = m.target ? m.target.ownerDocument : document, et = doc.createEvent('MouseEvents');
                m.view = m.view || doc.defaultView;
                let detail = type == 'click' || type == 'mousedown' || type == 'mouseup' ? 1 : (type == 'dblclick' ? 2 : 0);
                et.initMouseEvent(type, m.bubbles, m.cancelable, m.view, detail, m.screenX, m.screenY, m.clientX, m.clientY, m.ctrlKey, m.altKey, m.shiftKey, m.metaKey, m.button, m.relatedTarget);
                return et;
            }
            static fireEvent(type, args) {
                let n = (args && args.target) || window;
                n.dispatchEvent(this.newEvent(type, args));
            }
        }
        input.Mouses = Mouses;
    })(input = JS.input || (JS.input = {}));
})(JS || (JS = {}));
var Mouses = JS.input.Mouses;
var MouseEventInits = JS.input.MouseEventInits;
var JS;
(function (JS) {
    let input;
    (function (input) {
        const D = document, DRAG_MOVE_PX = 5, DRAG_IMAGE_OPACITY = 0.5, DBL_TAP_INTERVAL = 300, LONG_TAP_INTERVAL = 750, CTXMENU = 900, RM_ATTS = ['id', 'class', 'style', 'draggable'], KB_PROPS = ['altKey', 'ctrlKey', 'metaKey', 'shiftKey'], PT_PROPS = ['pageX', 'pageY', 'clientX', 'clientY', 'screenX', 'screenY'];
        var DataTransfer = (function () {
            function DataTransfer() {
                this._dropEffect = 'move';
                this._effectAllowed = 'all';
                this._data = {};
            }
            Object.defineProperty(DataTransfer.prototype, "dropEffect", {
                get: function () {
                    return this._dropEffect;
                },
                set: function (value) {
                    this._dropEffect = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataTransfer.prototype, "effectAllowed", {
                get: function () {
                    return this._effectAllowed;
                },
                set: function (value) {
                    this._effectAllowed = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataTransfer.prototype, "types", {
                get: function () {
                    return Object.keys(this._data);
                },
                enumerable: true,
                configurable: true
            });
            DataTransfer.prototype.clearData = function (type) {
                if (type != null) {
                    delete this._data[type];
                }
                else {
                    this._data = null;
                }
            };
            DataTransfer.prototype.getData = function (type) {
                return this._data[type] || '';
            };
            DataTransfer.prototype.setData = function (type, value) {
                this._data[type] = value;
            };
            DataTransfer.prototype.setDragImage = function (img, offsetX, offsetY) {
                instance.setDragImage(img, offsetX, offsetY);
            };
            return DataTransfer;
        }());
        class TouchDelegate {
            constructor() {
                this._tapStart = 0;
                this._tapTimer = null;
                this._lastTapEnd = 0;
                var supportsPassive = false;
                D.addEventListener('test', null, {
                    get passive() {
                        supportsPassive = true;
                        return true;
                    }
                });
                if ('ontouchstart' in D) {
                    let T = this, ts = T._touchstart.bind(T), tm = T._touchmove.bind(T), te = T._touchend.bind(T), opt = supportsPassive ? { passive: false, capture: false } : false;
                    D.addEventListener('touchstart', ts, opt);
                    D.addEventListener('touchmove', tm, opt);
                    D.addEventListener('touchend', te);
                    D.addEventListener('touchcancel', te);
                }
            }
            setDragImage(img, offsetX, offsetY) {
                this._imgCustom = img;
                this._imgOffset = { x: offsetX, y: offsetY };
            }
            _touchstart(e) {
                var T = this;
                if (T._shouldHandle(e)) {
                    T._reset();
                    T._tapStart = System.highResTime();
                    T._tapEvent = e;
                    T._fireEvent(e, 'tap', e.target);
                    if (!T._tapTimer)
                        T._tapTimer = setTimeout(() => {
                            T._fireEvent(e, 'singletap', e.target);
                        }, DBL_TAP_INTERVAL);
                    if (T._tapStart - T._lastTapEnd < DBL_TAP_INTERVAL) {
                        if (T._tapTimer)
                            clearTimeout(T._tapTimer);
                        T._fireEvent(e, 'doubletap', e.target);
                    }
                    var src = T._closestDraggable(e.target);
                    if (src) {
                        T._dragSource = src;
                        T._ptDown = T._getPoint(e);
                        T._lastDragEvent = e;
                        e.preventDefault();
                        setTimeout(function () {
                            if (T._dragSource == src && T._img == null) {
                                if (T._fireEvent(e, 'contextmenu', src)) {
                                    T._reset();
                                }
                            }
                        }, CTXMENU);
                    }
                }
            }
            ;
            _touchmove(e) {
                let T = this;
                if (T._shouldHandle(e)) {
                    var target = T._getTarget(e);
                    if (T._dragSource && !T._img) {
                        var delta = T._getDelta(e);
                        if (delta > DRAG_MOVE_PX) {
                            T._fireEvent(e, 'dragstart', T._dragSource);
                            T._createImage(e);
                            T._fireEvent(e, 'dragenter', target);
                        }
                    }
                    if (T._img) {
                        T._lastDragEvent = e;
                        e.preventDefault();
                        if (target != T._lastDragTarget) {
                            T._fireEvent(e, 'dragleave', T._lastDragTarget);
                            T._fireEvent(e, 'dragenter', target);
                            T._lastDragTarget = target;
                        }
                        T._moveImage(e);
                        T._fireEvent(e, 'dragover', target);
                    }
                }
            }
            ;
            _touchend(e) {
                let T = this;
                if (T._shouldHandle(e)) {
                    if (!T._img) {
                        T._dragSource = null;
                        if (e.type == 'touchend') {
                            T._lastTapEnd = System.highResTime();
                            let t = T._tapEvent.touches && T._tapEvent.touches[0];
                            if ((T._lastTapEnd - T._tapStart) >= LONG_TAP_INTERVAL)
                                T._fireEvent(T._tapEvent, 'longtap', T._tapEvent.target);
                        }
                    }
                    T._destroyImage();
                    if (T._dragSource) {
                        if (e.type == 'touchend') {
                            T._fireEvent(T._lastDragEvent, 'drop', T._lastDragTarget);
                        }
                        T._fireEvent(T._lastDragEvent, 'dragend', T._dragSource);
                        T._reset();
                    }
                    e.preventDefault();
                }
            }
            ;
            _shouldHandle(e) {
                return e && e.touches && e.touches.length < 2;
            }
            ;
            _reset() {
                let T = this;
                if (T._tapTimer)
                    clearTimeout(T._tapTimer);
                T._tapTimer = null;
                T._destroyImage();
                T._tapStart = 0;
                T._tapEvent = null;
                T._dragSource = null;
                T._lastDragEvent = null;
                T._lastDragTarget = null;
                T._ptDown = null;
                T._dataTransfer = new DataTransfer();
            }
            ;
            _getPoint(e, page) {
                if (e && e.touches) {
                    e = e.touches[0];
                }
                return { x: page ? e.pageX : e.clientX, y: page ? e.pageY : e.clientY };
            }
            ;
            _getDelta(e) {
                var p = this._getPoint(e);
                return Math.abs(p.x - this._ptDown.x) + Math.abs(p.y - this._ptDown.y);
            }
            ;
            _getTarget(e) {
                var pt = this._getPoint(e), el = D.elementFromPoint(pt.x, pt.y);
                while (el && getComputedStyle(el).pointerEvents == 'none') {
                    el = el.parentElement;
                }
                return el;
            }
            ;
            _createImage(e) {
                let T = this;
                if (T._img) {
                    T._destroyImage();
                }
                var src = T._imgCustom || T._dragSource;
                T._img = src.cloneNode(true);
                T._copyStyle(src, T._img);
                T._img.style.top = T._img.style.left = '-9999px';
                if (!T._imgCustom) {
                    var rc = src.getBoundingClientRect(), pt = T._getPoint(e);
                    T._imgOffset = { x: pt.x - rc.left, y: pt.y - rc.top };
                    T._img.style.opacity = DRAG_IMAGE_OPACITY.toString();
                }
                T._moveImage(e);
                D.body.appendChild(T._img);
            }
            ;
            _destroyImage() {
                let T = this;
                if (T._img && T._img.parentElement) {
                    T._img.parentElement.removeChild(T._img);
                }
                T._img = null;
                T._imgCustom = null;
            }
            ;
            _moveImage(e) {
                var T = this;
                if (T._img) {
                    requestAnimationFrame(function () {
                        var pt = T._getPoint(e, true), s = T._img.style;
                        s.position = 'absolute';
                        s.pointerEvents = 'none';
                        s.zIndex = '999999';
                        s.left = Math.round(pt.x - T._imgOffset.x) + 'px';
                        s.top = Math.round(pt.y - T._imgOffset.y) + 'px';
                    });
                }
            }
            ;
            _copyProps(dst, src, props) {
                for (var i = 0; i < props.length; i++) {
                    var p = props[i];
                    dst[p] = src[p];
                }
            }
            ;
            _copyStyle(src, dst) {
                RM_ATTS.forEach(function (att) {
                    dst.removeAttribute(att);
                });
                if (src instanceof HTMLCanvasElement) {
                    var cSrc = src, cDst = dst;
                    cDst.width = cSrc.width;
                    cDst.height = cSrc.height;
                    cDst.getContext('2d').drawImage(cSrc, 0, 0);
                }
                var cs = getComputedStyle(src);
                for (var i = 0; i < cs.length; i++) {
                    var key = cs[i];
                    dst.style[key] = cs[key];
                }
                dst.style.pointerEvents = 'none';
                for (var i = 0; i < src.children.length; i++) {
                    this._copyStyle(src.children[i], dst.children[i]);
                }
            }
            ;
            _fireEvent(e, type, target) {
                if (e && target) {
                    let T = this, evt = D.createEvent('Event'), t = e.touches ? e.touches[0] : e;
                    evt.initEvent(type, true, true);
                    evt['button'] = 0;
                    evt['which'] = evt['buttons'] = 1;
                    T._copyProps(evt, e, KB_PROPS);
                    T._copyProps(evt, t, PT_PROPS);
                    if (T._dragSource)
                        evt['dataTransfer'] = T._dataTransfer;
                    target.dispatchEvent(evt);
                    return evt.defaultPrevented;
                }
                return false;
            }
            ;
            _closestDraggable(e) {
                for (; e; e = e.parentElement) {
                    if (e.hasAttribute('draggable') && e.draggable) {
                        return e;
                    }
                }
                return null;
            }
            ;
        }
        let instance = new TouchDelegate();
        D.body.ondrop = function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();
        };
    })(input = JS.input || (JS.input = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let util;
    (function (util) {
        class Functions {
            static call(fb) {
                let isFn = util.Types.isFunction(fb), fn = isFn ? fb : fb.fn, ctx = isFn ? undefined : fb.ctx, args = isFn ? undefined : fb.args;
                return fn.apply(ctx, args);
            }
            static execute(code, ctx, argsExpression, args) {
                let argsList = argsExpression || '';
                return Function.constructor.apply(null, argsList.split(',').concat([code])).apply(ctx, util.Arrays.newArray(args));
            }
        }
        util.Functions = Functions;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Functions = JS.util.Functions;
var JS;
(function (JS) {
    let util;
    (function (util) {
        class Strings {
            static padStart(text, maxLength, fill) {
                let s = text || '';
                if (s.length >= maxLength)
                    return s;
                let fs = fill ? fill : ' ';
                for (let i = 0; i < maxLength; i++) {
                    let tmp = fs + s, d = tmp.length - maxLength;
                    if (d < 0) {
                        s = tmp;
                    }
                    else {
                        s = fs.substr(0, fs.length - d) + s;
                        break;
                    }
                }
                return s;
            }
            static padEnd(text, maxLength, fill) {
                let s = text || '';
                if (s.length >= maxLength)
                    return s;
                let fs = fill ? fill : ' ';
                for (let i = 0; i < maxLength; i++) {
                    let tmp = s + fs, d = tmp.length - maxLength;
                    if (d < 0) {
                        s = tmp;
                    }
                    else {
                        s += fs.substr(0, fs.length - d);
                        break;
                    }
                }
                return s;
            }
            static nodeHTML(nodeType, attrs, text) {
                let a = '';
                if (attrs)
                    util.Jsons.forEach(attrs, (v, k) => {
                        if (v != void 0) {
                            if (util.Types.isBoolean(v)) {
                                if (v === true)
                                    a += ` ${k}`;
                            }
                            else {
                                a += ` ${k}="${v || ''}"`;
                            }
                        }
                    });
                return `<${nodeType}${a}>${text || ''}</${nodeType}>`;
            }
            static escapeHTML(html) {
                if (!html)
                    return '';
                let chars = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;',
                    '/': '&#x2F;',
                    '`': '&#x60;',
                    '=': '&#x3D;'
                };
                return html.replace(/[&<>"'`=\/]/g, function (s) {
                    return chars[s];
                });
            }
            static format(tpl, ...data) {
                if (!tpl)
                    return tpl;
                let i = 0;
                data = data || [];
                return tpl.replace(/\%(%|s|b|d|f|n)/gm, (s, ...args) => {
                    let v = i >= data.length ? '' : data[i++];
                    switch (args[0]) {
                        case 'b': {
                            v = Boolean(v).toString();
                            break;
                        }
                        case 'd': {
                            v = Number(v).toInt().toString();
                            break;
                        }
                        case 'f': {
                            v = Number(v).stringify();
                            break;
                        }
                        case 'n': {
                            v = '\n';
                            break;
                        }
                        case '%': {
                            v = '%';
                        }
                    }
                    return v;
                });
            }
            static merge(tpl, data) {
                if (!tpl || !data)
                    return tpl;
                return tpl.replace(/\{(\w+)\}/g, (str, ...args) => {
                    let m = args[0], s = data[m];
                    return s === undefined ? str : (util.Types.isFunction(s) ? s(data, str, m) : (s == null ? '' : String(s)));
                });
            }
        }
        util.Strings = Strings;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Strings = JS.util.Strings;
var JS;
(function (JS) {
    let util;
    (function (util) {
        let LogLevel;
        (function (LogLevel) {
            LogLevel[LogLevel["ALL"] = 6] = "ALL";
            LogLevel[LogLevel["TRACE"] = 5] = "TRACE";
            LogLevel[LogLevel["DEBUG"] = 4] = "DEBUG";
            LogLevel[LogLevel["INFO"] = 3] = "INFO";
            LogLevel[LogLevel["WARN"] = 2] = "WARN";
            LogLevel[LogLevel["ERROR"] = 1] = "ERROR";
            LogLevel[LogLevel["OFF"] = 0] = "OFF";
        })(LogLevel = util.LogLevel || (util.LogLevel = {}));
        let LEVELS = ['OFF', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE', 'ALL'], STYLES = [
            '',
            'color:red;background-color:#fff0f0;',
            'color:orange;background-color:#fffbe6;',
            'color:black;background-color:white;',
            'color:white;background-color:gray;',
            'color:white;background-color:black;',
            ''
        ];
        class ConsoleAppender {
            constructor(name) {
                this.name = '';
                this.name = name;
            }
            log(level, ...data) {
                this._log(LEVELS[level], STYLES[level], data);
            }
            _log(cmd, css, data) {
                console.group(`%c${cmd} ${this.name ? '[' + this.name + '] ' : ''}${new Date().toISOString()}`, css);
                if (data)
                    data.forEach(a => {
                        cmd != 'INFO' && cmd != 'WARN' ? util.Konsole.trace(a) : util.Konsole.print(a);
                    });
                console.groupEnd();
            }
        }
        util.ConsoleAppender = ConsoleAppender;
        class Log {
            constructor(name, level, appender) {
                this._appender = !appender ? new ConsoleAppender(name) : Reflect.construct(appender, name);
                this.level = level || LogLevel.ALL;
                this._name = name;
            }
            name() {
                return this._name;
            }
            _log(level, data) {
                if (level <= this.level) {
                    this._appender.log.apply(this._appender, [level].concat(data));
                }
            }
            trace(...data) {
                this._log(LogLevel.TRACE, data);
            }
            debug(...data) {
                this._log(LogLevel.DEBUG, data);
            }
            info(...data) {
                this._log(LogLevel.INFO, data);
            }
            warn(...data) {
                this._log(LogLevel.WARN, data);
            }
            error(...data) {
                this._log(LogLevel.ERROR, data);
            }
            clear() {
                this._appender.clear();
            }
        }
        util.Log = Log;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var LogLevel = JS.util.LogLevel;
var Log = JS.util.Log;
let JSLogger = new Log(`JSDK ${JS.version}`, LogLevel.INFO);
Konsole.text(`Powered by JSDK ${JS.version}`, 'font-weight:bold;');
var JS;
(function (JS) {
    let sugar;
    (function (sugar) {
        let T = Types, R = Reflect;
        let AnnotationTarget;
        (function (AnnotationTarget) {
            AnnotationTarget[AnnotationTarget["ANY"] = 1] = "ANY";
            AnnotationTarget[AnnotationTarget["CLASS"] = 2] = "CLASS";
            AnnotationTarget[AnnotationTarget["FIELD"] = 4] = "FIELD";
            AnnotationTarget[AnnotationTarget["METHOD"] = 8] = "METHOD";
            AnnotationTarget[AnnotationTarget["PARAMETER"] = 16] = "PARAMETER";
        })(AnnotationTarget = sugar.AnnotationTarget || (sugar.AnnotationTarget = {}));
        class Annotation extends Function {
        }
        sugar.Annotation = Annotation;
        class Annotations {
            static getPropertyType(obj, propertyKey) {
                return R.getMetadata('design:type', obj, propertyKey);
            }
            static getValue(anno, obj, propertyKey) {
                return R.getMetadata(anno.name, obj, propertyKey);
            }
            static setValue(annoName, metaValue, obj, propertyKey) {
                R.defineMetadata(typeof annoName == 'string' ? annoName : annoName.name, metaValue, obj, propertyKey);
            }
            static hasAnnotation(anno, obj, propertyKey) {
                return R.hasMetadata(anno.name, obj, propertyKey);
            }
            static getAnnotations(obj) {
                return R.getMetadataKeys(obj);
            }
            static define(definition, params) {
                let args = Arrays.newArray(params), isStr = T.isString(definition), annoName = isStr ? definition : definition.name, handler = isStr ? null : definition.handler, target = (isStr ? AnnotationTarget.ANY : definition.target) || AnnotationTarget.ANY, fn = function (anno, values, obj, key, d) {
                    if (0 == (target & AnnotationTarget.ANY)) {
                        if (T.equalKlass(obj)) {
                            if (0 == (target & AnnotationTarget.CLASS))
                                return _wrongTarget(anno, obj.name);
                        }
                        else if (key) {
                            if (T.isFunction(obj[key])) {
                                if (0 == (target & AnnotationTarget.METHOD))
                                    return _wrongTarget(anno, obj.constructor.name, key, 'method');
                            }
                            else {
                                if (0 == (target & AnnotationTarget.FIELD))
                                    return _wrongTarget(anno, obj.constructor.name, key, 'field');
                            }
                        }
                    }
                    Annotations.setValue(anno, values, obj, key);
                    if (handler)
                        handler.apply(null, [anno, values, obj, key, d]);
                };
                if (T.equalKlass(args[0])) {
                    let obj = args[0];
                    let detor = function (tar) {
                        fn.call(null, annoName, undefined, tar);
                    };
                    return R.decorate([detor], obj);
                }
                else if (args.length == 3 && args[0]['constructor']) {
                    let obj = args[0], key = args[1], desc = args[2];
                    let detor = function (tar, k) {
                        fn.call(null, annoName, undefined, tar, k, desc);
                    };
                    return R.decorate([detor], obj, key);
                }
                let values = args;
                return function (tar, key, d) {
                    fn.call(null, annoName, values, tar, key, d);
                };
            }
        }
        sugar.Annotations = Annotations;
        var _wrongTarget = function (anno, klass, key, type) {
            JSLogger.error(key ?
                `A [${anno}] annotation should not be marked on the '${key}' ${type} of ${klass}.`
                :
                    `A [${anno}] annotation should not be marked on the '${klass}' class.`);
        };
    })(sugar = JS.sugar || (JS.sugar = {}));
})(JS || (JS = {}));
var AnnotationTarget = JS.sugar.AnnotationTarget;
var Annotation = JS.sugar.Annotation;
var Annotations = JS.sugar.Annotations;
var JS;
(function (JS) {
    let sugar;
    (function (sugar) {
        let Y = Types, J = Jsons;
        function klass(fullName) {
            return sugar.Annotations.define({
                name: 'klass',
                handler: (anno, values, obj) => {
                    Class.reflect(obj, values[0]);
                },
                target: sugar.AnnotationTarget.CLASS
            }, [fullName]);
        }
        sugar.klass = klass;
        class Method {
            constructor(clazz, name, isStatic, fn, paramTypes, returnType) {
                this.isStatic = false;
                this.annotations = [];
                this.parameterAnnotations = [];
                this.ownerClass = clazz;
                this.name = name;
                this.paramTypes = paramTypes;
                this.returnType = returnType;
                this.fn = fn;
                this.isStatic = isStatic;
            }
            invoke(obj, ...args) {
                let fn = this.isStatic ? this.ownerClass.getKlass() : this.fn, context = this.isStatic ? this.ownerClass.getKlass() : obj;
                return Reflect.apply(fn, context, args);
            }
        }
        sugar.Method = Method;
        class Field {
            constructor(clazz, name, isStatic, type) {
                this.isStatic = false;
                this.annotations = [];
                this.ownerClass = clazz;
                this.name = name;
                this.type = type;
                this.isStatic = isStatic;
            }
            set(value, obj) {
                let target = this.isStatic ? this.ownerClass.getKlass() : obj;
                target[this.name] = value;
            }
            get(obj) {
                let target = this.isStatic ? this.ownerClass.getKlass() : obj;
                return target[this.name];
            }
        }
        sugar.Field = Field;
        class Class {
            constructor(name, klass) {
                this._methods = {};
                this._fields = {};
                this.name = name;
                klass.class = this;
                this._klass = klass;
                this.shortName = this._klass.name;
                this._superklass = Class.getSuperklass(this._klass);
                this._init();
            }
            static getSuperklass(klass) {
                if (Object === klass)
                    return null;
                let sup = Object.getPrototypeOf(klass);
                return Object.getPrototypeOf(Object) === sup ? Object : sup;
            }
            static _reflectable(obj, className) {
                obj.className = className;
                if (!obj.getClass) {
                    obj.getClass = function () {
                        return Class.forName(this.className);
                    };
                }
            }
            static byName(name) {
                if (!name)
                    return null;
                var p = name.split('.'), len = p.length, p0 = p[0], b = window[p0] || eval(p0);
                if (!b)
                    throw new TypeError('Can\'t found class:' + name);
                for (var i = 1; i < len; i++) {
                    var pi = p[i];
                    if (!pi)
                        break;
                    b[pi] = b[pi] || {};
                    b = b[pi];
                }
                return b;
            }
            static newInstance(ctor, ...args) {
                let tar = Y.isString(ctor) ? Class.byName(ctor) : ctor;
                if (!tar)
                    throw new NotFoundError(`The class<${ctor}> is not found!`);
                return Reflect.construct(tar, J.clone(args));
            }
            static aliasInstance(alias, ...args) {
                let cls = Class.forName(alias, true);
                if (!cls)
                    throw new NotFoundError(`The class<${alias}> is not found!`);
                return cls.newInstance.apply(cls, args);
            }
            static aop(klass, method, advisor) {
                let isStatic = klass.hasOwnProperty(method), m = isStatic ? klass[method] : klass.prototype[method];
                if (!Y.isFunction(m))
                    return;
                let obj = isStatic ? klass : klass.prototype;
                if (!obj.hasOwnProperty('__' + method))
                    obj['__' + method] = m;
                Object.defineProperty(obj, method, {
                    value: m.aop(advisor),
                    writable: true
                });
            }
            static cancelAop(klass, method) {
                let isStatic = klass.hasOwnProperty(method), m = isStatic ? klass[method] : klass.prototype[method];
                if (!Y.isFunction(m))
                    return;
                let obj = isStatic ? klass : klass.prototype;
                obj[method] = obj['__' + method];
            }
            aop(method, advisor) {
                let m = this.method(method);
                if (!m)
                    return;
                let pro = m.isStatic ? this._klass : this._klass.prototype;
                pro[method] = m.fn.aop(advisor);
            }
            _cancelAop(m) {
                let pro = m.isStatic ? this._klass : this._klass.prototype;
                pro[m.name] = m.fn;
            }
            cancelAop(method) {
                let ms = method ? [this.method(method)] : this.methods();
                ms.forEach(m => {
                    this._cancelAop(m);
                });
            }
            equals(cls) {
                if (!cls)
                    return false;
                return cls instanceof Class ? this.getKlass() === cls.getKlass() : this.getKlass() === cls;
            }
            subclassOf(cls) {
                let klass = (cls.constructor && cls.constructor === Class) ? cls.getKlass() : cls;
                return Y.subklassOf(this.getKlass(), klass);
            }
            newInstance(...args) {
                let obj = Reflect.construct(this._klass, Arrays.newArray(arguments));
                Class._reflectable(obj, this.name);
                return obj;
            }
            getSuperclass() {
                if (this === Object.class)
                    return null;
                return this._superklass ? this._superklass.class : Object.class;
            }
            getKlass() {
                return this._klass.prototype.constructor;
            }
            _parseStaticMembers(ctor) {
                let mKeys = ctor === Object ? ['class'] : Reflect.ownKeys(ctor);
                for (let i = 0, len = mKeys.length; i < len; i++) {
                    const key = mKeys[i].toString();
                    if (!this._isValidStatic(key))
                        continue;
                    const obj = ctor[key];
                    if (Y.isFunction(obj)) {
                        this._methods[key] = new Method(this, key, true, obj, null, null);
                    }
                    else {
                        this._fields[key] = new Field(this, key, true, Y.type(obj));
                    }
                }
            }
            _parseInstanceMembers(proto) {
                let protoKeys = proto === Object.prototype ? ['toString'] : Reflect.ownKeys(proto);
                for (let i = 0, len = protoKeys.length; i < len; i++) {
                    const key = protoKeys[i].toString();
                    if (!this._isValidInstance(key))
                        continue;
                    const obj = this._forceProto(proto, key);
                    if (Y.isFunction(obj)) {
                        this._methods[key] = new Method(this, key, false, obj, null, null);
                    }
                    else {
                        this._fields[key] = new Field(this, key, false, Y.type(obj));
                    }
                }
            }
            _forceProto(proto, key) {
                let rst;
                try {
                    rst = proto[key];
                }
                catch (e) {
                    if (this._klass === File) {
                        if (key == 'lastModified')
                            return 0;
                        if (key == 'lastModifiedDate')
                            return new Date();
                    }
                    try {
                        let obj = this.newInstance();
                        return obj[key];
                    }
                    catch (e1) {
                        return '';
                    }
                }
                return rst;
            }
            _isValidStatic(mName) {
                return ['prototype', 'name', 'length'].findIndex(v => {
                    return v == mName;
                }) < 0;
            }
            _isValidInstance(mName) {
                return !mName.startsWith('__') && mName != 'constructor';
            }
            _init() {
                this._parseStaticMembers(this._klass);
                this._parseInstanceMembers(this._klass.prototype);
            }
            _toArray(json) {
                let arr = [];
                J.forEach(json, v => {
                    arr[arr.length] = v;
                });
                return arr;
            }
            method(name) {
                return this.methodsMap()[name];
            }
            methodsMap() {
                return this._methods;
            }
            methods() {
                return this._toArray(this.methodsMap());
            }
            field(name, instance) {
                return this.fieldsMap(instance)[name];
            }
            _instanceFields(instance) {
                let fs = {}, keys = Reflect.ownKeys(instance);
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i].toString();
                    if (this._isValidInstance(key)) {
                        const obj = instance[key];
                        if (!Y.isFunction(obj))
                            fs[key] = new Field(this, key, false, Y.type(obj));
                    }
                }
                this._fields = J.union(fs, this._fields);
            }
            fieldsMap(instance, anno) {
                if (instance)
                    this._instanceFields(instance);
                let fs = {};
                if (anno && instance) {
                    J.forEach(this._fields, (field, key) => {
                        if (sugar.Annotations.hasAnnotation(anno, instance, key))
                            fs[key] = field;
                    });
                }
                else {
                    fs = this._fields;
                }
                return fs;
            }
            fields(instance, anno) {
                return this._toArray(this.fieldsMap(instance, anno));
            }
            static forName(name, isAlias) {
                if (!name)
                    return null;
                let isStr = Y.isString(name);
                if (!isStr && name.class)
                    return name.class;
                let classname = isStr ? name : name.name;
                return isAlias ? this._ALIAS_MAP[classname] : this._MAP[classname];
            }
            static all() {
                return this._MAP;
            }
            static reflect(klass, className, alias) {
                let name = className || klass.name, cls = this.forName(name);
                if (cls)
                    return;
                if (klass !== Object) {
                    var $P = klass.prototype;
                    $P.className = name;
                    $P.getClass = function () { return Class.forName(name); };
                }
                let cs = new Class(name, klass);
                this._MAP[name] = cs;
                if (alias)
                    this._ALIAS_MAP[alias] = cs;
            }
            static classesOf(ns) {
                if (!ns)
                    return null;
                if (ns.endsWith('.*'))
                    ns = ns.slice(0, ns.length - 2);
                let a = [];
                J.forEach(this._MAP, (cls, name) => {
                    if (name.startsWith(ns))
                        a.push(cls);
                });
                return a;
            }
        }
        Class._MAP = {};
        Class._ALIAS_MAP = {};
        sugar.Class = Class;
    })(sugar = JS.sugar || (JS.sugar = {}));
})(JS || (JS = {}));
var Method = JS.sugar.Method;
var Field = JS.sugar.Field;
var Class = JS.sugar.Class;
var klass = JS.sugar.klass;
Class.reflect(Object);
var JS;
(function (JS) {
    let ioc;
    (function (ioc) {
        class Compos {
            static get(cmpt) {
                let cmp;
                if (Types.isString(cmpt)) {
                    cmp = this._cmps[cmpt];
                }
                if (!cmp)
                    cmp = this.add(cmpt);
                return cmp;
            }
            static add(cmpt) {
                let cmp, clazz = Class.forName(cmpt);
                if (!clazz)
                    return undefined;
                if (this._cmps.hasOwnProperty(clazz.name)) {
                    return this._cmps[clazz.name];
                }
                else {
                    cmp = clazz.newInstance();
                    this._injectFields(clazz, cmp);
                    this._cmps[clazz.name] = cmp;
                    if (cmp.initialize)
                        cmp.initialize();
                }
                return cmp;
            }
            static remove(cmpt) {
                let clazz = Class.forName(cmpt);
                if (!clazz)
                    return;
                let cmp = this._cmps[clazz.name];
                if (cmp) {
                    if (cmp.destroy)
                        cmp.destroy();
                    delete this._cmps[clazz.name];
                }
            }
            static clear() {
                Jsons.forEach(this._cmps, cmp => {
                    if (cmp.destroy)
                        cmp.destroy();
                });
                this._cmps = {};
            }
            static _injectFields(clazz, cmp) {
                let fields = clazz.fieldsMap(cmp, ioc.inject);
                Jsons.forEach(fields, (v, k) => {
                    let f = Annotations.getPropertyType(cmp, k);
                    if (!f || !Types.equalKlass(f))
                        throw new TypeError('The type of Field[' + k + '] is invalid!');
                    let cls = f.class;
                    cmp[k] = this.get(cls.name);
                });
            }
        }
        Compos._cmps = {};
        ioc.Compos = Compos;
    })(ioc = JS.ioc || (JS.ioc = {}));
})(JS || (JS = {}));
var Compos = JS.ioc.Compos;
var JS;
(function (JS) {
    let ioc;
    (function (ioc) {
        function compo(className) {
            return Annotations.define({
                name: 'compo',
                handler: (anno, values, obj) => {
                    let className = values[0];
                    Class.reflect(obj, className);
                    ioc.Compos.add(Class.forName(className).name);
                }
            }, arguments);
        }
        ioc.compo = compo;
        function inject() {
            return Annotations.define({
                name: 'inject',
                target: AnnotationTarget.FIELD
            });
        }
        ioc.inject = inject;
    })(ioc = JS.ioc || (JS.ioc = {}));
})(JS || (JS = {}));
var compo = JS.ioc.compo;
var inject = JS.ioc.inject;
var JS;
(function (JS) {
    let util;
    (function (util) {
        let EUID = 1, E = util.Check.isEmpty;
        class EventBus {
            constructor(context) {
                this._isD = false;
                this._map = new Map();
                this._ctx = util.Jsons.clone(context);
            }
            context(ctx) {
                if (arguments.length == 0)
                    return this._ctx;
                this._ctx = ctx;
            }
            destroy() {
                this.off();
                this._ctx = null;
                this._isD = true;
            }
            isDestroyed() {
                return this._isD;
            }
            _add(type, h) {
                let fns = this._map.get(type) || [];
                fns[fns.length] = h;
                this._map.set(type, fns);
            }
            _remove(type, h) {
                if (!h) {
                    this._map.set(type, []);
                }
                else {
                    let fns = this._map.get(type);
                    if (!E(fns)) {
                        fns.remove(fn => {
                            return fn['euid'] === h['euid'];
                        });
                        this._map.set(type, fns);
                    }
                }
            }
            _removeByEuid(type, euid) {
                let fns = this._map.get(type);
                if (!E(fns)) {
                    fns.remove(fn => {
                        return fn['euid'] === euid;
                    });
                    this._map.set(type, fns);
                }
            }
            _euid(h, one, type) {
                let me = this, euid = h['euid'] || EUID++, fn = function () {
                    if (one)
                        me._removeByEuid(type, euid);
                    return h.apply(this, arguments);
                };
                fn['euid'] = h['euid'] = euid;
                return fn;
            }
            on(types, handler, once) {
                if (this.isDestroyed())
                    return false;
                types.split(' ').forEach((tp) => {
                    this._add(tp, this._euid(handler, once, tp));
                });
                return true;
            }
            original(type, euid) {
                let fns = this._map.get(type);
                if (arguments.length >= 1) {
                    if (!E(fns)) {
                        let i = fns.findIndex(fn => {
                            return fn['euid'] === euid;
                        });
                        if (i > -1)
                            return fns[i];
                    }
                    return null;
                }
                return fns || null;
            }
            types() {
                return Array.from(this._map.keys());
            }
            off(types, handler) {
                if (this.isDestroyed())
                    return false;
                if (types) {
                    types.split(' ').forEach((tp) => {
                        this._remove(tp, handler);
                    });
                }
                else {
                    this._map.clear();
                }
                return true;
            }
            _call(e, fn, args, that) {
                let evt = e['originalEvent'] ? e['originalEvent'] : e, arr = [evt];
                if (args && args.length > 0)
                    arr = arr.concat(args);
                let rst = fn.apply(that || this._ctx, arr);
                if (rst === false) {
                    evt.stopPropagation();
                    evt.preventDefault();
                }
            }
            fire(e, args, that) {
                let is = util.Types.isString(e), fns = this._map.get(is ? e : e.type);
                if (!E(fns)) {
                    let evt = is ? new CustomEvent(e) : e;
                    fns.forEach(fn => { this._call(evt, fn, args, that); });
                }
            }
        }
        util.EventBus = EventBus;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var EventBus = JS.util.EventBus;
var JS;
(function (JS) {
    let lang;
    (function (lang) {
        let ThreadState;
        (function (ThreadState) {
            ThreadState["NEW"] = "NEW";
            ThreadState["RUNNING"] = "RUNNING";
            ThreadState["TERMINATED"] = "TERMINATED";
            ThreadState["DESTROYED"] = "DESTROYED";
        })(ThreadState = lang.ThreadState || (lang.ThreadState = {}));
        let SYS_URL = null, _system = (srt) => {
            let src = srt.src.replace(/\?.*/, '');
            return src.endsWith('/jscore.js') || src.endsWith('/jscore.min.js') ? src : null;
        }, _docSystem = function (doc) {
            let scripts = doc.getElementsByTagName('script');
            if (scripts) {
                for (let i = 0, len = scripts.length; i < len; i++) {
                    let src = _system(scripts[i]);
                    if (src)
                        return src;
                }
            }
            let links = doc.querySelectorAll('link[rel=import]');
            if (links) {
                for (let i = 0, len = links.length; i < len; i++) {
                    let link = links[i];
                    if (link['import']) {
                        let src = _docSystem(link['import']);
                        if (src)
                            return src;
                    }
                }
            }
        }, _findSystem = function () {
            if (SYS_URL)
                return SYS_URL;
            let p = self.__jscore;
            if (p) {
                SYS_URL = p;
                return SYS_URL;
            }
            ;
            SYS_URL = _docSystem(document);
            return SYS_URL;
        };
        class Thread {
            constructor(target, preload) {
                this._bus = new EventBus(this);
                this._state = ThreadState.NEW;
                this._url = null;
                this._libs = [];
                if (target) {
                    let members = Reflect.ownKeys(target);
                    for (let i = 0, len = members.length; i < len; i++) {
                        const key = members[i].toString();
                        if (key.startsWith('__') || key == 'constructor')
                            continue;
                        const m = target[key];
                        if (Types.isFunction(m) || key == 'run')
                            this[key] = m;
                    }
                }
                this.id = Random.uuid(4, 10);
                if (preload) {
                    this._libs = this._libs.concat(typeof preload == 'string' ? [preload] : preload);
                }
            }
            getState() { return new String(this._state); }
            run() { }
            ;
            _define(fnName) {
                let fn = Thread._defines[fnName], fnBody = fn.toString().replace(/^function/, '');
                return `this.${fnName}=function${fnBody}`;
            }
            _predefine(id) {
                let sys = _findSystem();
                return `
                //@ sourceURL=thread-${id}.js
                this.id="${id}";
                this.__jscore="${sys}";
                importScripts("${sys}");
                ${this._define('imports')}
                ${this._define('onposted')}
                ${this._define('postMain')}
                ${this._define('callMain')}
                ${this._define('terminate')}
                ${this._libs.length > 0 ? `this.imports("${this._libs.join('","')}");` : ''}`;
            }
            _stringify(fn) {
                let script = this._predefine(this.id), fnText = fn.toString().trim(), fnBody = '';
                let rst = /[^{]+{((.|\n)*)}$/.exec(fnText);
                if (rst)
                    fnBody = rst[1];
                return `(()=>{${script}${fnBody}})()`;
            }
            isRunning() {
                return this._state == 'RUNNING';
            }
            start() {
                if (this.isDestroyed())
                    return this._warn('start');
                if (this.isRunning())
                    this.terminate();
                this._state = ThreadState.RUNNING;
                if (Types.isString(this.run)) {
                    this._url = this.run;
                }
                else {
                    let fnString = this._stringify(this.run);
                    this._url = self.URL.createObjectURL(new Blob([fnString], { type: 'text/javascript' }));
                }
                this._wk = new Worker(this._url);
                this._wk.onmessage = e => {
                    let d = e.data;
                    if (d.cmd == 'CLOSE') {
                        this.terminate();
                    }
                    else if (d.cmd.startsWith('#')) {
                        let fnName = d.cmd.slice(1);
                        this[fnName].apply(this, d.data);
                    }
                    else {
                        this._bus.fire('message', [d.data]);
                    }
                };
                this._wk.onerror = e => {
                    JSLogger.error(e, `Thread<${this.id}> run error!`);
                    this._bus.fire('error', [e.message]);
                    this.terminate();
                };
                return this;
            }
            terminate() {
                if (this.isDestroyed())
                    return this;
                if (this._wk)
                    this._wk.terminate();
                if (this._url)
                    window.URL.revokeObjectURL(this._url);
                this._state = ThreadState.TERMINATED;
                this._wk = null;
                this._url = null;
                return this;
            }
            destroy() {
                setTimeout(() => {
                    this.terminate();
                    this._state = ThreadState.DESTROYED;
                    this._bus.destroy();
                }, 100);
            }
            isDestroyed() {
                return this._state == 'DESTROYED';
            }
            on(e, fn) {
                this._bus.on(e, fn);
                return this;
            }
            off(e) {
                this._bus.off(e);
                return this;
            }
            _warn(act) {
                JSLogger.warn(`Cannot ${act} from Thread<id=${this.id};state=${this._state}>!`);
                return this;
            }
            postThread(data, transfer) {
                if (this._state != 'RUNNING')
                    return this._warn('post data');
                if (this._wk)
                    this._wk.postMessage.apply(this._wk, Check.isEmpty(transfer) ? [data] : [data].concat(transfer));
                return this;
            }
            static initContext() {
                if (self.imports)
                    return self;
                self.imports = this._defines['imports'];
                self.onposted = this._defines['onposted'];
                self.postMain = this._defines['postMain'];
                self.callMain = this._defines['callMain'];
                self.terminate = this._defines['terminate'];
                return self;
            }
        }
        Thread._defines = {
            imports: function (...urls) {
                urls.forEach(u => {
                    importScripts(self.URI.toAbsoluteURL(u));
                });
            },
            onposted: function (fn) {
                self.addEventListener('message', function (e) {
                    fn.call(self, e.data);
                }, false);
            },
            postMain: function (data) {
                self.postMessage({ cmd: 'DATA', data: data }, null);
            },
            callMain: function (fnName, ...args) {
                self.postMessage({ cmd: '#' + fnName, data: Array.prototype.slice.call(arguments, 1) }, null);
            },
            terminate: function () {
                self.postMessage({ cmd: 'CLOSE' }, null);
            }
        };
        lang.Thread = Thread;
    })(lang = JS.lang || (JS.lang = {}));
})(JS || (JS = {}));
var Thread = JS.lang.Thread;
var ThreadState = JS.lang.ThreadState;
var JS;
(function (JS) {
    let math;
    (function (math) {
        class Coords2 {
            static rotate(p, rad) {
                let pt = this.rotateX(p, rad);
                return this.rotateY(pt, rad);
            }
            static rotateX(p, rad) {
                let x = p[0], y = p[1];
                return [x * Math.cos(rad) - y * Math.sin(rad), y];
            }
            static rotateY(p, rad) {
                let x = p[0], y = p[1];
                return [x, x * Math.sin(rad) + y * Math.cos(rad)];
            }
            static translate(p, dx, dy) {
                let pt = this.translateX(p, dx);
                return this.translateY(pt, dy);
            }
            static translateX(p, delta) {
                let x = p[0], y = p[1];
                return [x + delta, y];
            }
            static translateY(p, delta) {
                let x = p[0], y = p[1];
                return [x, y + delta];
            }
        }
        math.Coords2 = Coords2;
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Coords2 = JS.math.Coords2;
var JS;
(function (JS) {
    let math;
    (function (math) {
        class Floats {
            static equal(n1, n2, eps = this.EQUAL_PRECISION) {
                let d = n1 - n2, n = d < 0 ? -d : d;
                return n <= eps;
            }
            static greater(n1, n2, eps = this.EQUAL_PRECISION) {
                if (this.equal(n1, n2, eps))
                    return false;
                return n1 > n2;
            }
            static greaterEqual(n1, n2, eps = this.EQUAL_PRECISION) {
                if (this.equal(n1, n2, eps))
                    return true;
                return n1 > n2;
            }
            static less(n1, n2, eps = this.EQUAL_PRECISION) {
                if (this.equal(n1, n2, eps))
                    return false;
                return n1 < n2;
            }
            static lessEqual(n1, n2, eps = this.EQUAL_PRECISION) {
                if (this.equal(n1, n2, eps))
                    return true;
                return n1 < n2;
            }
        }
        Floats.EQUAL_PRECISION = 0.0001;
        math.Floats = Floats;
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Floats = JS.math.Floats;
var JS;
(function (JS) {
    let math;
    (function (math) {
        class Point2 {
            constructor(x, y) {
                this.x = x || 0;
                this.y = y || 0;
            }
            static toPoint(p) {
                return new Point2().set(p);
            }
            static toArray(p) {
                return p instanceof Point2 ? p.toArray() : p;
            }
            static polar2xy(d, rad) {
                let x, y;
                switch (rad / Math.PI) {
                    case 0:
                        x = d;
                        y = 0;
                        break;
                    case 0.5:
                        x = 0;
                        y = d;
                        break;
                    case 1:
                        x = -d;
                        y = 0;
                        break;
                    case 1.5:
                        x = 0;
                        y = -d;
                        break;
                    case 2:
                        x = d;
                        y = 0;
                        break;
                    default:
                        x = d * Math.cos(rad);
                        y = d * Math.sin(rad);
                }
                return [x.round(12), y.round(12)];
            }
            static xy2polar(x, y) {
                return {
                    d: Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)),
                    a: Point2.radian(x, y)
                };
            }
            static equal(x1, y1, x2, y2) {
                if (arguments.length > 3)
                    return math.Floats.equal(x1, x2) && math.Floats.equal(y1, y2);
                if (x1 == void 0 && x1 === y1)
                    return true;
                if (x1 == void 0 || y1 == void 0)
                    return false;
                let px1 = x1[0], py1 = x1[1], px2 = y1[0], py2 = y1[1];
                return math.Floats.equal(px1, px2) && math.Floats.equal(py1, py2);
            }
            static isOrigin(x, y) {
                return this.equal(x, y, 0, 0);
            }
            static distanceSq(x1, y1, x2, y2) {
                let dx = x1 - x2, dy = y1 - y2;
                return dx * dx + dy * dy;
            }
            static distance(x1, y1, x2, y2) {
                return Math.sqrt(this.distanceSq(x1, y1, x2, y2));
            }
            static radian(x1, y1, x2, y2) {
                let xx = x2 || 0, yy = y2 || 0;
                if (this.isOrigin(x1, y1) && Point2.isOrigin(xx, yy))
                    return 0;
                return Math.atan2(y1 - yy, x1 - xx);
            }
            set(p) {
                if (Types.isArray(p)) {
                    this.x = p[0];
                    this.y = p[1];
                }
                else if ('x' in p) {
                    this.x = p.x;
                    this.y = p.y;
                }
                else {
                    let pp = Point2.polar2xy(p.d, p.a);
                    this.x = pp[0];
                    this.y = pp[1];
                }
                return this;
            }
            toPolar() {
                return Point2.xy2polar(this.x, this.y);
            }
            toArray() {
                return [this.x, this.y];
            }
            clone() {
                return new Point2(this.x, this.y);
            }
            equals(p) {
                return math.Floats.equal(this.x, p.x) && math.Floats.equal(this.y, p.y);
            }
            radian() {
                return Point2.radian(this.x, this.y);
            }
            distanceSq(x, y) {
                return Point2.distanceSq(this.x, this.y, x, y);
            }
            distance(x, y) {
                return Math.sqrt(this.distanceSq(x, y));
            }
            distanceL1(x, y) {
                return Math.abs(this.x - x) + Math.abs(this.y - y);
            }
            distanceLinf(x, y) {
                return Math.max(Math.abs(this.x - x), Math.abs(this.y - y));
            }
            translate(x, y) {
                this.x += x;
                this.y += y;
                return this;
            }
            moveTo(x, y) {
                this.x = x;
                this.y = y;
                return this;
            }
            clamp(min, max) {
                let T = this;
                if (T.x > max) {
                    T.x = max;
                }
                else if (T.x < min) {
                    T.x = min;
                }
                if (T.y > max) {
                    T.y = max;
                }
                else if (T.y < min) {
                    T.y = min;
                }
                return T;
            }
            clampMin(min) {
                let T = this;
                if (T.x < min)
                    T.x = min;
                if (T.y < min)
                    T.y = min;
                return T;
            }
            clampMax(max) {
                let T = this;
                if (T.x > max)
                    T.x = max;
                if (T.y > max)
                    T.y = max;
                return T;
            }
            toward(step, rad) {
                let p = Point2.polar2xy(step, rad);
                return this.translate(p[0], p[1]);
            }
        }
        Point2.ORIGIN = new Point2(0, 0);
        math.Point2 = Point2;
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Point2 = JS.math.Point2;
var JS;
(function (JS) {
    let math;
    (function (math) {
        let M = Math;
        class Point3 {
            constructor(x, y, z) {
                this.x = x || 0;
                this.y = y || 0;
                this.z = z || 0;
            }
            static toPoint(p) {
                return new Point3().set(p);
            }
            static equal(x1, y1, z1, x2, y2, z2) {
                return math.Floats.equal(x1, x2) && math.Floats.equal(y1, y2) && math.Floats.equal(z1, z2);
            }
            static isOrigin(x, y, z) {
                return this.equal(x, y, z, 0, 0, 0);
            }
            static polar2xyz(d, az, ax) {
                let tmp = d * M.sin(az);
                return [tmp * M.cos(ax), tmp * M.sin(ax), d * M.cos(az)];
            }
            static xyz2polar(x, y, z) {
                let d = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
                return {
                    d: d,
                    az: M.acos(z / d),
                    ax: M.atan(y / x)
                };
            }
            static distanceSq(x1, y1, z1, x2, y2, z2) {
                let dx = x1 - x2, dy = y1 - y2, dz = z1 - z2;
                return dx * dx + dy * dy + dz * dz;
            }
            static distance(x1, y1, z1, x2, y2, z2) {
                return Math.sqrt(this.distanceSq(x1, y1, z1, x2, y2, z2));
            }
            set(p) {
                if (Types.isArray(p)) {
                    this.x = p[0];
                    this.y = p[1];
                    this.z = p[2];
                }
                else {
                    p = p;
                    this.x = p.x;
                    this.y = p.y;
                    this.z = p.z;
                }
                return this;
            }
            equals(p) {
                return math.Floats.equal(this.x, p.x) && math.Floats.equal(this.y, p.y) && math.Floats.equal(this.z, p.z);
            }
            clone() {
                return new Point3(this.x, this.y, this.z);
            }
            distanceSq(p) {
                let dx = this.x - p.x, dy = this.y - p.y, dz = this.z - p.z;
                return dx * dx + dy * dy + dz * dz;
            }
            distance(p) {
                return Math.sqrt(this.distanceSq(p));
            }
            distanceL1(p) {
                return Math.abs(this.x - p.x) + Math.abs(this.y - p.y) + Math.abs(this.z - p.z);
            }
            distanceLinf(p) {
                let tmp = Math.max(Math.abs(this.x - p.x), Math.abs(this.y - p.y));
                return Math.max(tmp, Math.abs(this.z - p.z));
            }
            toArray() {
                return [this.x, this.y, this.z];
            }
            moveTo(x, y, z) {
                this.x = x;
                this.y = y;
                this.z = z;
                return this;
            }
            clamp(min, max) {
                let T = this;
                if (T.x > max) {
                    T.x = max;
                }
                else if (T.x < min) {
                    T.x = min;
                }
                if (T.y > max) {
                    T.y = max;
                }
                else if (T.y < min) {
                    T.y = min;
                }
                if (T.z > max) {
                    T.z = max;
                }
                else if (T.z < min) {
                    T.z = min;
                }
                return T;
            }
            clampMin(min) {
                let T = this;
                if (T.x < min)
                    T.x = min;
                if (T.y < min)
                    T.y = min;
                if (T.z < min)
                    T.z = min;
                return T;
            }
            clampMax(max) {
                let T = this;
                if (T.x > max)
                    T.x = max;
                if (T.y > max)
                    T.y = max;
                if (T.z > max)
                    T.z = max;
                return T;
            }
        }
        math.Point3 = Point3;
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Point3 = JS.math.Point3;
var JS;
(function (JS) {
    let math;
    (function (math) {
        let PI = Math.PI;
        class Radians {
            static rad2deg(rad, limit) {
                let r = rad * 180 / PI;
                return limit ? this.positive(r) : r;
            }
            static deg2rad(deg) {
                return deg * PI / 180;
            }
            static positive(rad) {
                return rad < 0 ? this.ONE_CYCLE + rad : rad;
            }
            static equal(rad1, rad2) {
                return rad1 == rad2 || math.Floats.equal(this.positive(rad1) % PI, this.positive(rad2) % PI, 1e-12);
            }
            static reverse(rad) {
                return rad < PI ? rad + PI : rad - PI;
            }
        }
        Radians.EAST = 0;
        Radians.SOUTH = 0.5 * PI;
        Radians.WEST = PI;
        Radians.NORTH = 1.5 * PI;
        Radians.ONE_CYCLE = 2 * PI;
        math.Radians = Radians;
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Radians = JS.math.Radians;
var JS;
(function (JS) {
    let math;
    (function (math) {
        class Vector2 {
            constructor(x, y) {
                this.x = x || 0;
                this.y = y || 0;
            }
            static toVector(p1, p2) {
                let l = arguments.length;
                if (l == 1) {
                    let line = p1;
                    return new Vector2().set(line.p1(), line.p2());
                }
                else {
                    return new Vector2().set(p1, p2);
                }
            }
            static whichSide(p1, p2, p) {
                let v1 = Vector2.toVector(p1, p), v2 = Vector2.toVector(p2, p), rst = Vector2.cross(v1, v2);
                if (math.Floats.equal(0, rst))
                    return 0;
                return rst > 0 ? 1 : -1;
            }
            static cross(v1, v2) {
                return v1.x * v2.y - v2.x * v1.y;
            }
            static lerp(from, to, amount) {
                if (amount < 0 || amount > 1)
                    throw new RangeError();
                let x = from.x + amount * (to.x - from.x), y = from.y + amount * (to.y - from.y);
                return new Vector2(x, y);
            }
            set(f, t) {
                let l = arguments.length, isA = Types.isArray(f);
                this.x = l == 1 ? f.x : isA ? t[0] - f[0] : t.x - f.x;
                this.y = l == 1 ? f.y : isA ? t[1] - f[1] : t.y - f.y;
                return this;
            }
            equals(v) {
                if (this.isZero() && v.isZero())
                    return true;
                if (this.isZero() || v.isZero())
                    return false;
                return math.Floats.equal(v.lengthSq(), this.lengthSq()) && math.Radians.equal(v.radian(), this.radian());
            }
            toString() {
                return "(" + this.x + "," + this.y + ")";
            }
            toArray() {
                return [this.x, this.y];
            }
            clone() {
                return new Vector2(this.x, this.y);
            }
            negate() {
                this.x = -this.x;
                this.y = -this.y;
                return this;
            }
            add(v) {
                this.x += v.x;
                this.y += v.y;
                return this;
            }
            sub(v) {
                this.x -= v.x;
                this.y -= v.y;
                return this;
            }
            mul(n) {
                this.x *= n;
                this.y *= n;
                return this;
            }
            div(n) {
                this.x /= n;
                this.y /= n;
                return this;
            }
            lengthSq() {
                return this.x * this.x + this.y * this.y;
            }
            length() {
                return Math.sqrt(this.lengthSq());
            }
            dot(v) {
                return this.x * v.x + this.y * v.y;
            }
            normalize() {
                return this.div(this.length());
            }
            radian() {
                return math.Point2.radian(this.x, this.y);
            }
            _angle(v) {
                let vv = Vector2.UnitX, vDot = v.dot(vv) / (v.length() * vv.length());
                if (vDot < -1.0)
                    vDot = -1.0;
                if (vDot > 1.0)
                    vDot = 1.0;
                return Math.acos(vDot);
            }
            angle(v) {
                if (v && v.isZero() && this.isZero())
                    throw new RangeError('Can\'t with zero vector');
                return Math.abs(this._angle(this) - this._angle(v));
            }
            isZero() {
                return this.x == 0 && this.y == 0;
            }
            verticalTo(v) {
                return math.Radians.equal(this.angle(v), Math.PI / 2);
            }
            parallelTo(v) {
                let a = this.angle(v);
                return math.Radians.equal(a, 0) || math.Radians.equal(a, Math.PI);
            }
            getNormL() {
                return new Vector2(this.y, -this.x);
            }
            getNormR() {
                return new Vector2(-this.y, this.x);
            }
            getProject(v) {
                var dp = this.dot(v), vv = v.lengthSq();
                return new Vector2((dp / vv) * v.x, (dp / vv) * v.y);
            }
            _rebound(v, leftSide) {
                if (this.parallelTo(v))
                    return this.clone();
                let n = leftSide ? v.getNormL() : v.getNormR(), p = this.getProject(n);
                return p.sub(this).mul(2).add(this);
            }
            getReboundL(v) {
                return this._rebound(v, true);
            }
            getReboundR(v) {
                return this._rebound(v, false);
            }
            abs() {
                this.x = Math.abs(this.x);
                this.y = Math.abs(this.y);
                return this;
            }
        }
        Vector2.Zero = new Vector2(0, 0);
        Vector2.One = new Vector2(1, 1);
        Vector2.UnitX = new Vector2(1, 0);
        Vector2.UnitY = new Vector2(0, 1);
        math.Vector2 = Vector2;
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Vector2 = JS.math.Vector2;
var JS;
(function (JS) {
    let math;
    (function (math) {
        class Vector3 {
            constructor(x, y, z) {
                this.x = x || 0;
                this.y = y || 0;
                this.z = z || 0;
            }
            static toVector(p1, p2) {
                return new Vector3().set(p1, p2);
            }
            static cross(v1, v2) {
                let x = v1.y * v2.z - v1.z * v2.y, y = v2.x * v1.z - v2.z * v1.x, z = v1.x * v2.y - v1.y * v2.x;
                return new Vector3(x, y, z);
            }
            static lerp(from, to, amount) {
                if (amount < 0 || amount > 1)
                    throw new RangeError();
                let x = from.x + amount * (to.x - from.x), y = from.y + amount * (to.y - from.y), z = from.z + amount * (to.z - from.z);
                return new Vector3(x, y, z);
            }
            set(f, t) {
                if (t == void 0) {
                    this.x = f.x;
                    this.y = f.y;
                    this.z = f.z;
                }
                else {
                    let is = Types.isArray(f), ff = is ? math.Point3.toPoint(f) : f, tt = is ? math.Point3.toPoint(t) : t;
                    this.x = tt.x - ff.x;
                    this.y = tt.y - ff.y;
                    this.z = tt.z - ff.z;
                }
                return this;
            }
            equals(v) {
                return math.Floats.equal(v.lengthSq(), this.lengthSq()) && this.x / v.x == this.y / v.y && this.y / v.y == this.z / v.z;
            }
            toString() {
                return "(" + this.x + "," + this.y + "," + this.z + ")";
            }
            toArray() {
                return [this.x, this.y, this.z];
            }
            clone() {
                return new Vector3(this.x, this.y, this.z);
            }
            negate() {
                this.x = -this.x;
                this.y = -this.y;
                this.z = -this.z;
                return this;
            }
            add(v) {
                this.x += v.x;
                this.y += v.y;
                this.z += v.z;
                return this;
            }
            sub(v) {
                this.x -= v.x;
                this.y -= v.y;
                this.z -= v.z;
                return this;
            }
            mul(n) {
                this.x *= n;
                this.y *= n;
                this.z *= n;
                return this;
            }
            div(n) {
                this.x /= n;
                this.y /= n;
                this.z /= n;
                return this;
            }
            lengthSq() {
                return (this.x * this.x + this.y * this.y + this.z * this.z);
            }
            length() {
                return Math.sqrt(this.lengthSq());
            }
            dot(v) {
                return this.x * v.x + this.y * v.y + this.z * v.z;
            }
            normalize() {
                return this.div(this.length());
            }
            abs() {
                this.x = Math.abs(this.x);
                this.y = Math.abs(this.y);
                this.z = Math.abs(this.z);
                return this;
            }
        }
        Vector3.Zero = new Vector3(0, 0, 0);
        Vector3.One = new Vector3(1, 1, 1);
        Vector3.UnitX = new Vector3(1, 0, 0);
        Vector3.UnitY = new Vector3(0, 1, 0);
        Vector3.UnitZ = new Vector3(0, 0, 1);
        math.Vector3 = Vector3;
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Vector3 = JS.math.Vector3;
var JS;
(function (JS) {
    let math;
    (function (math) {
        let geom;
        (function (geom) {
            let AngleType;
            (function (AngleType) {
                AngleType[AngleType["ACUTE"] = 0] = "ACUTE";
                AngleType[AngleType["RIGHT"] = 1] = "RIGHT";
                AngleType[AngleType["OBTUSE"] = 2] = "OBTUSE";
                AngleType[AngleType["UNKNOWN"] = 3] = "UNKNOWN";
            })(AngleType = geom.AngleType || (geom.AngleType = {}));
            let ArcType;
            (function (ArcType) {
                ArcType[ArcType["OPEN"] = 0] = "OPEN";
                ArcType[ArcType["PIE"] = 1] = "PIE";
            })(ArcType = geom.ArcType || (geom.ArcType = {}));
            let P = math.Point2, V = math.Vector2;
            class Shapes {
                static crossPoints(line, sh, unClosed) {
                    let isLine = !(line instanceof geom.Segment), vs = sh.vertexes(), ps = [], size = vs.length, isCollinear = vs.some((p1, i) => {
                        let b;
                        if (unClosed) {
                            if (i == size - 1)
                                return false;
                            b = new geom.Segment().set(p1, vs[i + 1]);
                        }
                        else {
                            b = new geom.Segment().set(p1, vs[i < size - 1 ? i + 1 : 0]);
                        }
                        if (geom.Line.isCollinearLine(b, line))
                            return true;
                        let cp = isLine ? b.crossLine(line) : b.crossSegment(line);
                        if (cp && ps.findIndex(p => {
                            return P.equal(p, cp);
                        }) < 0)
                            ps.push(cp);
                        return false;
                    });
                    return isCollinear ? [] : ps;
                }
                static inShape(p, sh, unClosed) {
                    let vs = sh.vertexes(), size = vs.length, p0 = p instanceof P ? p.toArray() : p, first = 0;
                    return vs.every((p1, i) => {
                        let p2;
                        if (unClosed) {
                            if (i == size - 1)
                                return true;
                            p2 = vs[i + 1];
                        }
                        else {
                            p2 = vs[i < size - 1 ? i + 1 : 0];
                        }
                        let s = V.whichSide(p1, p2, p0);
                        if (s == 0)
                            return false;
                        if (i == 0)
                            first = s;
                        return s * first > 0;
                    });
                }
                static onShape(p, sh, unClosed) {
                    let vs = sh.vertexes(), size = vs.length, p0 = p instanceof P ? p.toArray() : p;
                    if (size == 2) {
                        let p1 = vs[0], p2 = vs[1];
                        return geom.Segment.inSegment(p1, p2, p0);
                    }
                    return vs.some((p1, i) => {
                        let p2;
                        if (unClosed) {
                            if (i == size - 1)
                                return false;
                            p2 = vs[i + 1];
                        }
                        else {
                            p2 = vs[i < size - 1 ? i + 1 : 0];
                        }
                        return geom.Segment.inSegment(p1, p2, p0);
                    });
                }
            }
            geom.Shapes = Shapes;
        })(geom = math.geom || (math.geom = {}));
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Shapes = JS.math.geom.Shapes;
var AngleType = JS.math.geom.AngleType;
var ArcType = JS.math.geom.ArcType;
var JS;
(function (JS) {
    let math;
    (function (math) {
        let P = math.Point2, V = math.Vector2;
        let geom;
        (function (geom) {
            class Line {
                constructor(x1, y1, x2, y2) {
                    this.x1 = x1 || 0;
                    this.y1 = y1 || 0;
                    this.x2 = x2 || 0;
                    this.y2 = y2 || 0;
                }
                static toLine(p1, p2) {
                    return new Line().set(p1, p2);
                }
                static slope(p1, p2) {
                    let a = p2[0] - p1[0], b = p2[1] - p1[1];
                    return a == 0 ? null : b / a;
                }
                static position(p1, p2, p3, p4) {
                    let T = this, same1 = P.equal(p1, p2), same2 = P.equal(p3, p4);
                    if (same1 && same2)
                        return 0;
                    if (same1 && !same2)
                        return T.isCollinear(p1, p3, p4) ? 0 : -1;
                    if (!same1 && same2)
                        return T.isCollinear(p1, p2, p3) ? 0 : -1;
                    let k1 = T.slope(p1, p2), k2 = T.slope(p3, p4);
                    if ((k1 == null && k2 === 0) || (k2 == null && k1 === 0))
                        return 2;
                    if ((k1 == null && k2 == null) || math.Floats.equal(k1, k2)) {
                        return V.whichSide(p1, p2, p3) == 0 ? 0 : -1;
                    }
                    else {
                        return math.Floats.equal(k1 * k2, -1) ? 2 : 1;
                    }
                }
                static isCollinear(p1, p2, p3) {
                    return V.whichSide(p1, p2, p3) == 0;
                }
                static isCollinearLine(l1, l2) {
                    let p1 = l1.p1(), p2 = l1.p2(), p3 = l2.p1(), p4 = l2.p2();
                    return this.isCollinear(p1, p2, p3) && this.isCollinear(p1, p2, p4);
                }
                static distanceSqToPoint(p1, p2, p) {
                    let x1 = p1[0], y1 = p1[1], x2 = p2[0], y2 = p2[1], px = p[0], py = p[1];
                    x2 -= x1;
                    y2 -= y1;
                    px -= x1;
                    py -= y1;
                    let dot = px * x2 + py * y2, proj = dot * dot / (x2 * x2 + y2 * y2), lenSq = px * px + py * py - proj;
                    if (lenSq < 0)
                        lenSq = 0;
                    return lenSq;
                }
                static distanceToPoint(p1, p2, p) {
                    return Math.sqrt(this.distanceSqToPoint(p1, p2, p));
                }
                toSegment() {
                    return new geom.Segment(this.x1, this.y1, this.x2, this.y2);
                }
                toVector() {
                    return new V(this.x2 - this.x1, this.y2 - this.y1);
                }
                p1(x, y) {
                    if (x == void 0)
                        return [this.x1, this.y1];
                    this.x1 = x;
                    this.y1 = y;
                    return this;
                }
                p2(x, y) {
                    if (x == void 0)
                        return [this.x2, this.y2];
                    this.x2 = x;
                    this.y2 = y;
                    return this;
                }
                vertexes(ps) {
                    if (arguments.length == 0) {
                        return [this.p1(), this.p2()];
                    }
                    let p1 = ps[0], p2 = ps[1];
                    this.p1(p1[0], p1[1]);
                    return this.p2(p2[0], p2[1]);
                }
                set(pt1, pt2) {
                    let len = arguments.length, p1 = len == 1 ? pt1.p1() : pt1, p2 = len == 1 ? pt1.p2() : pt2;
                    this.x1 = p1[0];
                    this.y1 = p1[1];
                    this.x2 = p2[0];
                    this.y2 = p2[1];
                    return this;
                }
                clone() {
                    return new Line(this.x1, this.y1, this.x2, this.y2);
                }
                equals(s) {
                    return Line.position(s.p1(), s.p2(), this.p1(), this.p2()) == 0;
                }
                isEmpty() {
                    return this.x1 == 0 && this.y1 == 0 && this.x2 == 0 && this.y2 == 0;
                }
                inside(s) {
                    let T = this;
                    if (!s || T.isEmpty())
                        return false;
                    if (Types.isArray(s))
                        return Line.isCollinear(T.p1(), T.p2(), s);
                    if (s.isEmpty())
                        return false;
                    return s.vertexes().every(p => {
                        return T.inside(p);
                    });
                }
                onside(p) {
                    return this.inside(p);
                }
                intersects(s) {
                    if (!s || this.isEmpty() || s.isEmpty())
                        return false;
                    let pos = Line.position(this.p1(), this.p2(), s.p1(), s.p2());
                    if (pos < 0)
                        return false;
                    if (s instanceof geom.Segment) {
                        return s.crossLine(this) != null;
                    }
                    else {
                        return true;
                    }
                }
                bounds() {
                    return null;
                }
                slope() {
                    return (this.y2 - this.y1) / (this.x2 - this.x1);
                }
                perimeter() {
                    return Infinity;
                }
                _cpOfLinePoint(p1, p2, p3) {
                    let p1p2 = V.toVector(p1, p2), p1p3 = V.toVector(p1, p3), p = p1p3.getProject(p1p2), d = p.length(), pp = P.polar2xy(d, p.radian());
                    return [pp[0] + p1[0], pp[1] + p1[1]];
                }
                _cpOfLineLine(p1, p2, p3, p4) {
                    let x1 = p1[0], y1 = p1[1], x2 = p2[0], y2 = p2[1], x3 = p3[0], y3 = p3[1], x4 = p4[0], y4 = p4[1];
                    if (Line.position(p1, p2, p3, p4) < 1)
                        return null;
                    let x = ((x1 - x2) * (x3 * y4 - x4 * y3) - (x3 - x4) * (x1 * y2 - x2 * y1)) / ((x3 - x4) * (y1 - y2) - (x1 - x2) * (y3 - y4)), y = ((y1 - y2) * (x3 * y4 - x4 * y3) - (x1 * y2 - x2 * y1) * (y3 - y4)) / ((y1 - y2) * (x3 - x4) - (x1 - x2) * (y3 - y4));
                    return [x, y];
                }
                _cpOfLineRay(p1, p2, p3, rad) {
                    let p4 = P.toPoint(p3).toward(10, rad).toArray(), p = this._cpOfLineLine(p1, p2, p3, p4);
                    if (!p)
                        return null;
                    return V.toVector(p3, p4).parallelTo(V.toVector(p3, p)) ? p : null;
                }
                crossPoint(p) {
                    return this._cpOfLinePoint(this.p1(), this.p2(), p);
                }
                crossLine(l) {
                    return this._cpOfLineLine(this.p1(), this.p2(), l.p1(), l.p2());
                }
                crossRay(p, rad) {
                    return this._cpOfLineRay(this.p1(), this.p2(), p, rad);
                }
            }
            Line.X = new Line(0, 0, 1, 0);
            Line.Y = new Line(0, 0, 0, 1);
            geom.Line = Line;
        })(geom = math.geom || (math.geom = {}));
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Line = JS.math.geom.Line;
var JS;
(function (JS) {
    let math;
    (function (math) {
        let geom;
        (function (geom) {
            let M = Math, P = math.Point2, L = geom.Line, V = math.Vector2;
            let relativeCCW = function (x1, y1, x2, y2, px, py) {
                x2 -= x1;
                y2 -= y1;
                px -= x1;
                py -= y1;
                let ccw = px * y2 - py * x2;
                if (ccw == 0.0) {
                    ccw = px * x2 + py * y2;
                    if (ccw > 0.0) {
                        px -= x2;
                        py -= y2;
                        ccw = px * x2 + py * y2;
                        if (ccw < 0.0) {
                            ccw = 0.0;
                        }
                    }
                }
                return (ccw < 0.0) ? -1 : ((ccw > 0.0) ? 1 : 0);
            }, inDiagonalRect = (p1, p2, p) => {
                if (P.equal(p, p1) || P.equal(p, p2))
                    return true;
                return M.min(p1[0], p2[0]) <= p[0] && p[0] <= M.max(p1[0], p2[0])
                    && M.min(p1[1], p2[1]) <= p[1] && p[1] <= M.max(p1[1], p2[1]);
            };
            class Segment extends geom.Line {
                static toSegment(p1, p2) {
                    return new Segment().set(p1, p2);
                }
                static inSegment(p1, p2, p) {
                    return inDiagonalRect(p1, p2, p) && V.whichSide(p1, p2, p) == 0;
                }
                static distanceSqToPoint(p1, p2, p) {
                    let x1 = p1[0], y1 = p1[1], x2 = p2[0], y2 = p2[1], px = p[0], py = p[1];
                    x2 -= x1;
                    y2 -= y1;
                    px -= x1;
                    py -= y1;
                    let dot = px * x2 + py * y2, proj;
                    if (dot <= 0.0) {
                        proj = 0.0;
                    }
                    else {
                        px = x2 - px;
                        py = y2 - py;
                        dot = px * x2 + py * y2;
                        if (dot <= 0.0) {
                            proj = 0.0;
                        }
                        else {
                            proj = dot * dot / (x2 * x2 + y2 * y2);
                        }
                    }
                    let lenSq = px * px + py * py - proj;
                    if (lenSq < 0)
                        lenSq = 0;
                    return lenSq;
                }
                static distanceToPoint(p1, p2, p) {
                    return M.sqrt(this.distanceSqToPoint(p1, p2, p));
                }
                static intersect(p1, p2, p3, p4) {
                    let x1 = p1[0], y1 = p1[1], x2 = p2[0], y2 = p2[1], x3 = p3[0], y3 = p3[1], x4 = p4[0], y4 = p4[1];
                    return ((relativeCCW(x1, y1, x2, y2, x3, y3) *
                        relativeCCW(x1, y1, x2, y2, x4, y4) <= 0)
                        && (relativeCCW(x3, y3, x4, y4, x1, y1) *
                            relativeCCW(x3, y3, x4, y4, x2, y2) <= 0));
                }
                toLine() {
                    return new geom.Line(this.x1, this.y1, this.x2, this.y2);
                }
                equals(s, isStrict) {
                    let p1 = [this.x1, this.y1], p2 = [this.x2, this.y2], p3 = [s.x1, s.y1], p4 = [s.x2, s.y2];
                    if (isStrict)
                        return P.equal(p1, p3) && P.equal(p2, p4);
                    return (P.equal(p1, p3) && P.equal(p2, p4)) || (P.equal(p1, p4) && P.equal(p2, p3));
                }
                inside(s) {
                    let T = this;
                    if (!s || T.isEmpty())
                        return false;
                    if (Types.isArray(s))
                        return geom.Shapes.onShape(s, T);
                    if (s.isEmpty())
                        return false;
                    if (s instanceof Segment)
                        return T.inside([s.x1, s.y1]) && T.inside([s.x2, s.y2]);
                }
                intersects(s) {
                    if (!s || this.isEmpty() || s.isEmpty())
                        return false;
                    let pos = L.position(this.p1(), this.p2(), s.p1(), s.p2());
                    if (pos < 0)
                        return false;
                    if (s instanceof Segment) {
                        return s.crossSegment(this) != null;
                    }
                    else {
                        return true;
                    }
                }
                bounds() {
                    let T = this, minX = M.min(T.x1, T.x2), maxX = M.max(T.x1, T.x2), minY = M.min(T.y1, T.y2), maxY = M.max(T.y1, T.y2);
                    return new geom.Rect(minX, minY, maxX - minX, maxY - minY);
                }
                perimeter() {
                    return P.distance(this.x1, this.y1, this.x2, this.y2);
                }
                ratioPoint(ratio) {
                    let p1 = this.p1(), p2 = this.p2();
                    return [(p1[0] + ratio * p2[0]) / (1 + ratio),
                        (p1[1] + ratio * p2[1]) / (1 + ratio)];
                }
                midPoint() {
                    return this.ratioPoint(1);
                }
                _cpOfSS(s1, s2) {
                    let p = s1.toLine().crossLine(s2.toLine());
                    if (!p)
                        return null;
                    return s1.inside(p) && s2.inside(p) ? p : null;
                }
                _cpOfSL(s1, s2) {
                    let p = s1.toLine().crossLine(s2);
                    if (!p)
                        return null;
                    return s1.inside(p) ? p : null;
                }
                _cpOfSR(s1, p3, rad) {
                    let p4 = P.toPoint(p3).toward(10, rad).toArray(), p = this._cpOfSL(s1, L.toLine(p3, p4));
                    if (!p)
                        return null;
                    return V.toVector(p3, p4).parallelTo(V.toVector(p3, p)) ? p : null;
                }
                crossSegment(s) {
                    return this._cpOfSS(this, s);
                }
                crossLine(l) {
                    return this._cpOfSL(this, l);
                }
                crossRay(p, rad) {
                    return this._cpOfSR(this, p, rad);
                }
            }
            geom.Segment = Segment;
        })(geom = math.geom || (math.geom = {}));
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Segment = JS.math.geom.Segment;
var JS;
(function (JS) {
    let math;
    (function (math) {
        let geom;
        (function (geom) {
            let M = Math, F = math.Floats, P = math.Point2, V = math.Vector2, R = math.Radians, S = geom.Segment;
            class CirArc {
                constructor(type, x, y, r, sAngle, eAngle, dir = 1) {
                    this.type = type || geom.ArcType.OPEN;
                    this.x = x || 0;
                    this.y = y || 0;
                    this.r = r || 0;
                    this.sAngle = sAngle || 0;
                    this.eAngle = eAngle || 0;
                    this.dir = dir == void 0 ? 1 : dir;
                }
                static toArc(type, c, r, sAngle, eAngle, dir = 1) {
                    return new CirArc(type, c[0], c[1], r, sAngle, eAngle, dir);
                }
                isEmpty() {
                    return this.r <= 0 || this.sAngle === this.eAngle;
                }
                center(x, y) {
                    if (x == void 0)
                        return [this.x, this.y];
                    this.x = x;
                    this.y = y;
                    return this;
                }
                set(s) {
                    this.type = s.type;
                    this.x = s.x;
                    this.y = s.y;
                    this.r = s.r;
                    this.sAngle = s.sAngle;
                    this.eAngle = s.eAngle;
                    this.dir = s.dir;
                    return this;
                }
                clone() {
                    return new CirArc(this.type, this.x, this.y, this.r, this.sAngle, this.eAngle, this.dir);
                }
                equals(s) {
                    return s.type == this.type && P.equal(s.x, s.y, this.x, this.y) && F.equal(this.r, s.r) && F.equal(this.sAngle, s.sAngle) && F.equal(this.eAngle, s.eAngle) && this.dir === s.dir;
                }
                _inAngle(p, ps, cache) {
                    let pc = ps[0], pa = ps[1], pb = ps[2];
                    if (S.inSegment(pc, pa, p) || S.inSegment(pc, pb, p))
                        return false;
                    let va = !cache ? V.toVector(pc, pa) : cache.va, vb = !cache ? V.toVector(pc, pb) : cache.vb, vp = V.toVector(pc, p), realAngle = !cache ? R.deg2rad(this.angle()) : cache.realRad, minAngle = !cache ? va.angle(vb) : cache.minRad, is = R.equal(minAngle, vp.angle(va) + vp.angle(vb));
                    return F.equal(realAngle, minAngle) ? is : !is;
                }
                inside(s) {
                    if (!s || this.isEmpty())
                        return false;
                    if (Types.isArray(s)) {
                        if (this.type == geom.ArcType.OPEN) {
                            return (F.equal(this.r * this.r, P.distanceSq(s[0], s[1], this.x, this.y))) && this._inAngle(s, this.vertexes());
                        }
                        else {
                            return new geom.Circle(this.x, this.y, this.r).inside(s) && this._inAngle(s, this.vertexes());
                        }
                    }
                    if (s.isEmpty())
                        return false;
                    return s.vertexes().every(p => {
                        return this.inside(p);
                    });
                }
                onside(p) {
                    if (this.isEmpty())
                        return false;
                    if (!F.equal(this.r * this.r, P.distanceSq(p[0], p[1], this.x, this.y)))
                        return false;
                    let isIn = this._inAngle(p, this.vertexes());
                    if (!isIn)
                        return false;
                    if (this.type == geom.ArcType.OPEN)
                        return true;
                    let ps = this.vertexes(), pc = ps[0], pa = ps[1], pb = ps[2];
                    return S.inSegment(pc, pa, p) || S.inSegment(pc, pb, p);
                }
                intersects(s) {
                    throw new Error("Method not implemented.");
                }
                _crossByRay(rad) {
                    return P.toPoint(this.center()).toward(this.r, rad).toArray();
                }
                _bounds(ps) {
                    let minX, minY, maxX, maxY, aX = [], aY = [];
                    ps.forEach(p => {
                        aX.push(p[0]);
                        aY.push(p[1]);
                    });
                    minX = M.min.apply(M, aX);
                    maxX = M.max.apply(M, aX);
                    minY = M.min.apply(M, aY);
                    maxY = M.max.apply(M, aY);
                    return new geom.Rect(minX, minY, maxX - minX, maxY - minY);
                }
                bounds() {
                    if (this.isEmpty())
                        return null;
                    let ps = this.vertexes();
                    return new geom.Triangle().set(ps[0], ps[1], ps[2]).bounds();
                }
                arcLength() {
                    return this.r * M.abs(this.eAngle - this.sAngle);
                }
                perimeter() {
                    return this.type == geom.ArcType.OPEN ? this.arcLength() : 2 * this.r + this.arcLength();
                }
                area() {
                    return this.type == geom.ArcType.OPEN ? 0 : M.abs(this.eAngle - this.sAngle) * this.r * this.r * 0.5;
                }
                vertexes(ps) {
                    if (arguments.length == 0) {
                        let pc = [this.x, this.y], pa = P.toPoint(P.polar2xy(this.r, this.sAngle)).translate(this.x, this.y), pb = P.toPoint(P.polar2xy(this.r, this.eAngle)).translate(this.x, this.y);
                        return [pc, [pa.x, pa.y], [pb.x, pb.y]];
                    }
                    let p1 = ps[0], pa = ps[1], pb = ps[2];
                    this.x = p1[0];
                    this.y = p1[1];
                    this.r = P.distance(pa[0], pa[1], this.x, this.y);
                    this.sAngle = V.toVector([this.x, this.y], pa).radian();
                    this.eAngle = V.toVector([this.x, this.y], pb).radian();
                    return this;
                }
                angle() {
                    let dif = R.positive(this.eAngle - this.sAngle), d = R.rad2deg(dif) % 360;
                    return this.dir == 1 ? d : 360 - d;
                }
                moveTo(x, y) {
                    this.x = x;
                    this.y = y;
                    return this;
                }
            }
            geom.CirArc = CirArc;
        })(geom = math.geom || (math.geom = {}));
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var CirArc = JS.math.geom.CirArc;
var JS;
(function (JS) {
    let math;
    (function (math) {
        let geom;
        (function (geom) {
            let P = math.Point2, F = math.Floats, L = geom.Line, S = geom.Segment;
            class Circle {
                constructor(x, y, r) {
                    this.x = x || 0;
                    this.y = y || 0;
                    this.r = r || 0;
                }
                static toCircle(c, r) {
                    return new Circle(c[0], c[1], r);
                }
                set(c, r) {
                    if (arguments.length == 1) {
                        this.x = c.x;
                        this.y = c.y;
                        this.r = c.r;
                    }
                    else {
                        let p = P.toArray(c);
                        this.x = p[0];
                        this.y = p[1];
                        this.r = r;
                    }
                    return this;
                }
                isEmpty() {
                    return this.r <= 0;
                }
                clone() {
                    return new Circle(this.x, this.y, this.r);
                }
                equals(s) {
                    return F.equal(this.x, s.x) && F.equal(this.y, s.y) && F.equal(this.r, s.r);
                }
                inside(s) {
                    if (!s || this.isEmpty())
                        return false;
                    if (Types.isArray(s))
                        return F.greater(this.r * this.r, P.distanceSq(this.x, this.y, s[0], s[1]));
                    if (s.isEmpty())
                        return false;
                    if (s instanceof geom.Rect || s instanceof S || s instanceof geom.Triangle)
                        return s.vertexes().every(p => {
                            return this.inside(p);
                        });
                    let dd = P.distanceSq(this.x, this.y, s.x, s.y), rr = this.r - s.r;
                    return F.less(dd, rr * rr);
                }
                onside(p) {
                    return !this.isEmpty() && F.equal(this.r * this.r, P.distanceSq(this.x, this.y, p[0], p[1]));
                }
                intersects(s) {
                    if (!s || this.isEmpty() || s.isEmpty())
                        return false;
                    if (s instanceof L) {
                        let d = L.distanceSqToPoint(s.p1(), s.p2(), [this.x, this.y]), rr = this.r * this.r;
                        if (F.greaterEqual(d, rr))
                            return false;
                        if (!(s instanceof S))
                            return true;
                        return F.equal(d, S.distanceSqToPoint(s.p1(), s.p2(), [this.x, this.y]));
                    }
                    if (s instanceof Circle) {
                        let dd = P.distanceSq(this.x, this.y, s.x, s.y), rr = this.r + s.r;
                        return F.less(dd, rr * rr);
                    }
                    if (s.inside(this) || this.inside(s))
                        return true;
                    return s.edges().some(b => {
                        return this.intersects(b);
                    });
                }
                bounds() {
                    return new geom.Rect(this.x - this.r, this.y - this.r, 2 * this.r, 2 * this.r);
                }
                moveTo(x, y) {
                    this.x = x;
                    this.y = y;
                    return this;
                }
                perimeter() {
                    return 2 * this.r * Math.PI;
                }
                area() {
                    return this.r * this.r * Math.PI;
                }
                vertexes(ps) {
                    throw new Error("Method not implemented.");
                }
            }
            geom.Circle = Circle;
        })(geom = math.geom || (math.geom = {}));
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Circle = JS.math.geom.Circle;
var JS;
(function (JS) {
    let math;
    (function (math) {
        let geom;
        (function (geom) {
            let P = math.Point2, F = math.Floats, L = geom.Line, S = geom.Segment;
            class Ellipse {
                constructor(x, y, rx, ry) {
                    this.x = x || 0;
                    this.y = y || 0;
                    this.rx = rx || 0;
                    this.ry = ry || 0;
                }
                static toEllipse(c, rx, ry) {
                    return new Ellipse(c[0], c[1], rx, ry);
                }
                set(c, rx, ry) {
                    if (arguments.length == 1) {
                        this.x = c.x;
                        this.y = c.y;
                        this.rx = c.rx;
                        this.ry = c.ry;
                    }
                    else {
                        let p = P.toArray(c);
                        this.x = p[0];
                        this.y = p[1];
                        this.rx = rx;
                        this.ry = ry;
                    }
                    return this;
                }
                isEmpty() {
                    return this.rx <= 0 || this.ry <= 0;
                }
                clone() {
                    return new Ellipse(this.x, this.y, this.rx, this.ry);
                }
                equals(s) {
                    return F.equal(this.x, s.x) && F.equal(this.y, s.y) && F.equal(this.rx, s.rx) && F.equal(this.ry, s.ry);
                }
                inside(s) {
                    if (!s || this.isEmpty())
                        return false;
                    if (Types.isArray(s)) {
                        let dx = s[0] - this.x, dy = s[1] - this.y, rxx = this.rx * this.rx, ryy = this.ry * this.ry;
                        return !this.isEmpty() && F.greater(1, (dx * dx) / rxx + (dy * dy) / ryy);
                    }
                    if (s.isEmpty())
                        return false;
                    return s.vertexes().every(p => {
                        return this.inside(p);
                    });
                }
                onside(p) {
                    if (this.isEmpty())
                        return false;
                    let dx = p[0] - this.x, dy = p[1] - this.y, rxx = this.rx * this.rx, ryy = this.ry * this.ry;
                    return !this.isEmpty() && F.equal(1, (dx * dx) / rxx + (dy * dy) / ryy);
                }
                intersects(s) {
                    throw new Error("Method not implemented.");
                }
                bounds() {
                    return new geom.Rect(this.x - this.rx, this.y - this.ry, 2 * this.rx, 2 * this.ry);
                }
                moveTo(x, y) {
                    this.x = x;
                    this.y = y;
                    return this;
                }
                perimeter() {
                    let a = this.rx, b = this.ry;
                    return Math.PI * (3 / 2 * (a + b) - Math.sqrt(a * b));
                }
                area() {
                    return this.rx * this.ry * Math.PI;
                }
                vertexes(ps) {
                    throw new Error("Method not implemented.");
                }
            }
            geom.Ellipse = Ellipse;
        })(geom = math.geom || (math.geom = {}));
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Ellipse = JS.math.geom.Ellipse;
var JS;
(function (JS) {
    let math;
    (function (math) {
        let geom;
        (function (geom) {
            let M = Math, N = Number;
            class Polygon {
                constructor(points) {
                    this._points = points || [];
                }
                isEmpty() {
                    return this._points.length == 0;
                }
                numberVertexes() {
                    return this._points.length;
                }
                clone() {
                    return new Polygon(this._points.slice());
                }
                _contains(x, y) {
                    let T = this, len = T.numberVertexes();
                    if (len <= 2 || !T.bounds().inside([x, y]))
                        return false;
                    let hits = 0, lastx = T._points[len - 1][0], lasty = T._points[len - 1][1], curx, cury;
                    for (let i = 0; i < len; lastx = curx, lasty = cury, i++) {
                        let pi = T._points[i], pj = T._points[i < len - 1 ? i + 1 : 0];
                        if (geom.Segment.inSegment(pi, pj, [x, y]))
                            return false;
                        curx = pi[0];
                        cury = pi[1];
                        if (cury == lasty) {
                            continue;
                        }
                        let leftx;
                        if (curx < lastx) {
                            if (x >= lastx) {
                                continue;
                            }
                            leftx = curx;
                        }
                        else {
                            if (x >= curx) {
                                continue;
                            }
                            leftx = lastx;
                        }
                        let test1, test2;
                        if (cury < lasty) {
                            if (y < cury || y >= lasty) {
                                continue;
                            }
                            if (x < leftx) {
                                hits++;
                                continue;
                            }
                            test1 = x - curx;
                            test2 = y - cury;
                        }
                        else {
                            if (y < lasty || y >= cury) {
                                continue;
                            }
                            if (x < leftx) {
                                hits++;
                                continue;
                            }
                            test1 = x - lastx;
                            test2 = y - lasty;
                        }
                        if (test1 < (test2 / (lasty - cury) * (lastx - curx))) {
                            hits++;
                        }
                    }
                    return ((hits & 1) != 0);
                }
                inside(s) {
                    return s && !this.isEmpty() && this._contains(s[0], s[1]);
                }
                onside(p) {
                    return !this.isEmpty() && geom.Shapes.onShape(p, this);
                }
                intersects(s) {
                    if (!s || this.isEmpty() || s.isEmpty())
                        return false;
                    let size = this.numberVertexes();
                    return this._points.some((p, i) => {
                        let x1 = p[0], y1 = p[1], px = this._points[i < size - 1 ? (i + 1) : 0];
                        return s.intersects(new geom.Segment(x1, y1, px[0], px[1]));
                    });
                }
                bounds() {
                    if (this.numberVertexes() == 0)
                        return new geom.Rect();
                    if (this._bounds == null)
                        this._calculateBounds();
                    return this._bounds.bounds();
                }
                _calculateBounds() {
                    let minX = N.MAX_VALUE, minY = N.MAX_VALUE, maxX = N.MIN_VALUE, maxY = N.MIN_VALUE;
                    this._points.forEach(p => {
                        minX = M.min(minX, p[0]);
                        maxX = M.max(maxX, p[0]);
                        minY = M.min(minY, p[1]);
                        maxY = M.max(maxY, p[1]);
                    });
                    this._bounds = new geom.Rect(minX, minY, maxX - minX, maxY - minY);
                }
                _updateBounds(x, y) {
                    let T = this;
                    if (x < T._bounds.x) {
                        T._bounds.w = T._bounds.w + (T._bounds.x - x);
                        T._bounds.x = x;
                    }
                    else {
                        T._bounds.w = M.max(T._bounds.w, x - T._bounds.x);
                    }
                    if (y < T._bounds.y) {
                        T._bounds.h = T._bounds.h + (T._bounds.y - y);
                        T._bounds.y = y;
                    }
                    else {
                        T._bounds.h = M.max(T._bounds.h, y - T._bounds.y);
                    }
                }
                addPoint(x, y) {
                    this._points.push([x, y]);
                    if (this._bounds != null)
                        this._updateBounds(x, y);
                    return this;
                }
                vertexes(ps) {
                    if (arguments.length == 0)
                        return this._points;
                    this._points = ps;
                    return this;
                }
                perimeter() {
                    if (this._len != void 0)
                        return this._len;
                    this._len = 0;
                    let size = this.numberVertexes();
                    if (size < 2)
                        return 0;
                    this._points.forEach((p, i) => {
                        let x1 = p[0], y1 = p[1], px = this._points[i < size - 1 ? (i + 1) : 0];
                        this._len += math.Point2.distance(x1, y1, px[0], px[1]);
                    });
                    return this._len;
                }
                equals(s) {
                    let ps = s.vertexes();
                    if (ps.length != this.numberVertexes())
                        return false;
                    return this._points.every((p, i) => {
                        let pi = ps[i];
                        return math.Point2.equal(p[0], p[1], pi[0], pi[1]);
                    });
                }
            }
            geom.Polygon = Polygon;
        })(geom = math.geom || (math.geom = {}));
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Polygon = JS.math.geom.Polygon;
var JS;
(function (JS) {
    let math;
    (function (math) {
        let geom;
        (function (geom) {
            class Polyline extends geom.Polygon {
                clone() {
                    return new Polyline(this._points);
                }
                inside(s) {
                    return false;
                }
                onside(p) {
                    return !this.isEmpty() && geom.Shapes.onShape(p, this, true);
                }
                intersects(s) {
                    if (!s || this.isEmpty() || s.isEmpty())
                        return false;
                    let size = this.numberVertexes();
                    return this._points.some((p, i) => {
                        if (i >= size - 1)
                            return false;
                        let x1 = p[0], y1 = p[1], px = this._points[i + 1];
                        return s.intersects(new geom.Segment(x1, y1, px[0], px[1]));
                    });
                }
                perimeter() {
                    if (this._len != void 0)
                        return this._len;
                    this._len = 0;
                    let size = this.numberVertexes();
                    if (size < 2)
                        return 0;
                    this._points.forEach((p, i) => {
                        if (i < size - 1) {
                            let x1 = p[0], y1 = p[1], px = this._points[i + 1];
                            this._len += math.Point2.distance(x1, y1, px[0], px[1]);
                        }
                    });
                    return this._len;
                }
                equals(s) {
                    return super.equals(s);
                }
            }
            geom.Polyline = Polyline;
        })(geom = math.geom || (math.geom = {}));
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Polyline = JS.math.geom.Polyline;
var JS;
(function (JS) {
    let math;
    (function (math) {
        let geom;
        (function (geom) {
            let M = Math, S = geom.Segment, N = Number;
            class Rect {
                constructor(x, y, w, h) {
                    this.set(x, y, w, h);
                }
                static toRect(p, w, h) {
                    return new Rect(p[0], p[1], w, h);
                }
                static centerTo(rect1, rect2) {
                    let w1 = rect1.w, h1 = rect1.h, w2 = rect2.w, h2 = rect2.h;
                    rect1.x = rect2.x + (w2 - w1) / 2;
                    rect1.y = rect2.y + (h2 - h1) / 2;
                }
                static limitIn(rect1, rect2) {
                    if (rect1.x < rect2.x) {
                        rect1.x = rect2.x;
                    }
                    else if (rect1.x > (rect2.x + rect2.w - rect1.w)) {
                        rect1.x = rect2.x + rect2.w - rect1.w;
                    }
                    ;
                    if (rect1.y < rect2.y) {
                        rect1.y = rect2.y;
                    }
                    else if (rect1.y > (rect2.y + rect2.h - rect1.h)) {
                        rect1.y = rect2.y + rect2.h - rect1.h;
                    }
                }
                minX() {
                    return this.x;
                }
                minY() {
                    return this.y;
                }
                maxX() {
                    return this.x + this.w;
                }
                maxY() {
                    return this.y + this.h;
                }
                centerX() {
                    return this.x + this.w / 2;
                }
                centerY() {
                    return this.y + this.h / 2;
                }
                clone() {
                    return new Rect(this.x, this.y, this.w, this.h);
                }
                equals(s) {
                    let T = this;
                    if (T.w != s.w || T.h != s.h)
                        return false;
                    return math.Floats.equal(T.x, s.x) && math.Floats.equal(T.y, s.y);
                }
                set(xx, yy, ww, hh) {
                    let len = arguments.length, x = len == 1 ? xx.x : xx, y = len == 1 ? xx.y : yy, w = len == 1 ? xx.w : ww, h = len == 1 ? xx.h : hh;
                    this.x = Number(x || 0).round(3);
                    this.y = Number(y || 0).round(3);
                    this.w = Number(w || 0).round(3);
                    this.h = Number(h || 0).round(3);
                    return this;
                }
                isEmpty() {
                    return this.w <= 0 || this.h <= 0;
                }
                size(w, h) {
                    if (w == void 0)
                        return { w: this.w, h: this.h };
                    this.w = w < 0 ? 0 : w;
                    this.h = h < 0 ? 0 : h;
                    return this;
                }
                moveTo(x, y) {
                    this.x = x;
                    this.y = y;
                    return this;
                }
                area() {
                    return this.w * this.h;
                }
                perimeter() {
                    return 2 * (this.w + this.h);
                }
                vertexes(ps) {
                    if (arguments.length == 0) {
                        let T = this, a = [T.x, T.y], b = [T.x + T.w, T.y], c = [T.x + T.w, T.y + T.h], d = [T.x, T.y + T.h];
                        return [a, b, c, d];
                    }
                    let p1 = ps[0], p2 = ps[1], p3 = ps[2];
                    this.x = p1[0];
                    this.y = p1[1];
                    this.w = p2[0] - p1[0];
                    this.h = p3[1] - p2[1];
                    return this;
                }
                _inside(x, y) {
                    let T = this;
                    return x > T.x && x < (T.x + T.w) && y > T.y && y < (T.y + T.h);
                }
                inside(s) {
                    if (!s || this.isEmpty())
                        return false;
                    if (Types.isArray(s))
                        return this._inside(s[0], s[1]);
                    if (s.isEmpty())
                        return false;
                    if (s instanceof geom.Segment) {
                        let vs = s.vertexes();
                        return vs.every(v => {
                            return this.inside(v);
                        });
                    }
                    if (s instanceof Rect) {
                        let rect1 = this, rect2 = s;
                        return (rect2.x >= rect1.x && rect2.y >= rect1.y &&
                            (rect2.x + rect2.w) <= (rect1.x + rect1.w) &&
                            (rect2.y + rect2.h) <= (rect1.y + rect1.h));
                    }
                    let c = s;
                    if (!geom.Shapes.inShape([c.x, c.y], this))
                        return false;
                    let rr = c.r * c.r;
                    return this.edges().every(b => {
                        return math.Floats.greaterEqual(geom.Line.distanceSqToPoint(b.p1(), b.p2(), [c.x, c.y]), rr);
                    });
                }
                onside(p) {
                    return !this.isEmpty() && geom.Shapes.onShape(p, this);
                }
                intersects(s) {
                    let T = this;
                    if (!s || T.isEmpty() || s.isEmpty())
                        return false;
                    if (s instanceof Rect) {
                        let x = s.x, y = s.y, w = s.w, h = s.h, x0 = T.x, y0 = T.y;
                        return (x + w > x0 &&
                            y + h > y0 &&
                            x < x0 + T.w &&
                            y < y0 + T.h);
                    }
                    let ps = geom.Shapes.crossPoints(s, T), len = ps.length;
                    if (len == 0)
                        return false;
                    if (len == 1) {
                        if (!(s instanceof geom.Segment))
                            return false;
                        let p1 = s.p1(), p2 = s.p2();
                        return T._inside(p1[0], p1[1]) || T._inside(p2[0], p2[1]);
                    }
                    return true;
                }
                intersection(rect) {
                    if (this.isEmpty() || rect.isEmpty())
                        return null;
                    let rect1 = this, rect2 = rect, t = M.max(rect1.y, rect2.y), r = M.min(rect1.x + rect1.w, rect2.x + rect2.w), b = M.min(rect1.y + rect1.h, rect2.y + rect2.h), l = M.max(rect1.x, rect2.x);
                    return (b > t && r > l) ? new Rect(l, t, r - l, b - t) : null;
                }
                bounds() {
                    return this.clone();
                }
                edges() {
                    let p4 = this.vertexes();
                    return [
                        S.toSegment(p4[0], p4[1]),
                        S.toSegment(p4[1], p4[2]),
                        S.toSegment(p4[2], p4[3]),
                        S.toSegment(p4[3], p4[0])
                    ];
                }
                union(r) {
                    let T = this, tx2 = T.w, ty2 = T.h;
                    if ((tx2 | ty2) < 0) {
                        return r.clone();
                    }
                    let rx2 = r.w, ry2 = r.h;
                    if ((rx2 | ry2) < 0) {
                        return T.clone();
                    }
                    let tx1 = T.x, ty1 = T.y;
                    tx2 += tx1;
                    ty2 += ty1;
                    let rx1 = r.x, ry1 = r.y;
                    rx2 += rx1;
                    ry2 += ry1;
                    if (tx1 > rx1)
                        tx1 = rx1;
                    if (ty1 > ry1)
                        ty1 = ry1;
                    if (tx2 < rx2)
                        tx2 = rx2;
                    if (ty2 < ry2)
                        ty2 = ry2;
                    tx2 -= tx1;
                    ty2 -= ty1;
                    return new Rect(tx1, ty1, tx2, ty2);
                }
            }
            geom.Rect = Rect;
        })(geom = math.geom || (math.geom = {}));
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Rect = JS.math.geom.Rect;
var JS;
(function (JS) {
    let math;
    (function (math) {
        let geom;
        (function (geom) {
            let P = math.Point2, V = math.Vector2, N = Numbers, S = geom.Segment;
            class Triangle {
                constructor(x1, y1, x2, y2, x3, y3) {
                    this.x1 = x1 || 0;
                    this.y1 = y1 || 0;
                    this.x2 = x2 || 0;
                    this.y2 = y2 || 0;
                    this.x3 = x3 || 0;
                    this.y3 = y3 || 0;
                }
                static toTri(p1, p2, p3) {
                    return new Triangle().set(p1, p2, p3);
                }
                isEmpty() {
                    return geom.Line.isCollinear(this.p1(), this.p2(), this.p3());
                }
                p1(x, y) {
                    if (x == void 0)
                        return [this.x1, this.y1];
                    this.x1 = x;
                    this.y1 = y;
                    return this;
                }
                p2(x, y) {
                    if (x == void 0)
                        return [this.x2, this.y2];
                    this.x2 = x;
                    this.y2 = y;
                    return this;
                }
                p3(x, y) {
                    if (x == void 0)
                        return [this.x3, this.y3];
                    this.x3 = x;
                    this.y3 = y;
                    return this;
                }
                set(p1, p2, p3) {
                    if (arguments.length == 1)
                        return this.vertexes(p1.vertexes());
                    return this.vertexes([p1, p2, p3]);
                }
                vertexes(ps) {
                    let T = this;
                    if (arguments.length == 0)
                        return [[T.x1, T.y1], [T.x2, T.y2], [T.x3, T.y3]];
                    let p1 = ps[0], p2 = ps[1], p3 = ps[2];
                    this.x1 = p1[0];
                    this.y1 = p1[1];
                    this.x2 = p2[0];
                    this.y2 = p2[1];
                    this.x3 = p3[0];
                    this.y3 = p3[1];
                    return this;
                }
                clone() {
                    let T = this;
                    return new Triangle(T.x1, T.y1, T.x2, T.y2, T.x3, T.y3);
                }
                equals(s) {
                    if (this.isEmpty() && s.isEmpty())
                        return true;
                    return Arrays.same(this.vertexes(), s.vertexes(), (p1, p2) => { return P.equal(p1, p2); });
                }
                inside(s) {
                    let T = this;
                    if (!s || T.isEmpty())
                        return false;
                    if (Types.isArray(s))
                        return geom.Shapes.inShape(s, this);
                    if (s.isEmpty())
                        return false;
                    if (s instanceof geom.Circle) {
                        let c = s;
                        if (!geom.Shapes.inShape([c.x, c.y], this))
                            return false;
                        let rr = c.r * c.r;
                        return this.edges().every(b => {
                            return math.Floats.greaterEqual(geom.Line.distanceSqToPoint(b.p1(), b.p2(), [c.x, c.y]), rr);
                        });
                    }
                    return s.vertexes().every(p => {
                        return T.inside(p) || T.onside(p);
                    });
                }
                onside(p) {
                    return !this.isEmpty() && geom.Shapes.onShape(p, this);
                }
                _addPoint(a, p) {
                    if (p && a.findIndex(b => { return P.equal(b, p); }) < 0)
                        a.push(p);
                }
                intersects(s) {
                    let T = this;
                    if (!s || T.isEmpty() || s.isEmpty())
                        return false;
                    if (s instanceof geom.Rect) {
                        if (T.inside(s))
                            return true;
                        let ps = [];
                        T.edges().forEach(b => {
                            let cps = geom.Shapes.crossPoints(b, s);
                            cps.forEach(it => {
                                T._addPoint(ps, it);
                            });
                        });
                        return ps.length >= 2;
                    }
                    let ps = geom.Shapes.crossPoints(s, T), len = ps.length;
                    if (len == 0)
                        return false;
                    if (len >= 2)
                        return true;
                    if (!(s instanceof S))
                        return false;
                    let p1 = s.p1(), p2 = s.p2();
                    return T.inside(p1) || T.inside(p2);
                }
                bounds() {
                    let T = this, minX = N.min(T.x1, T.x2, T.x3), minY = N.min(T.y1, T.y2, T.y3), maxX = N.max(T.x1, T.x2, T.x3), maxY = N.max(T.y1, T.y2, T.y3), w = maxX - minX, h = maxY - minY, x = minX, y = minY;
                    return new geom.Rect(x, y, w, h);
                }
                edges() {
                    let ps = this.vertexes(), p1 = ps[0], p2 = ps[1], p3 = ps[2], a = new S(p1[0], p1[1], p2[0], p2[1]), b = new S(p2[0], p2[1], p3[0], p3[1]), c = new S(p3[0], p3[1], p1[0], p1[1]);
                    return [a, b, c];
                }
                _sides() {
                    let ps = this.vertexes(), p1 = ps[0], p2 = ps[1], p3 = ps[2], a = P.distance(p1[0], p1[1], p2[0], p2[1]), b = P.distance(p2[0], p2[1], p3[0], p3[1]), c = P.distance(p3[0], p3[1], p1[0], p1[1]);
                    return [a, b, c];
                }
                perimeter() {
                    if (this.isEmpty())
                        return 0;
                    let s = this._sides();
                    return s[0] + s[1] + s[2];
                }
                angles() {
                    let T = this;
                    if (T.isEmpty())
                        return [];
                    let a1 = new V().set(T.p1(), T.p2()).angle(new V().set(T.p1(), T.p3())), a2 = new V().set(T.p2(), T.p1()).angle(new V().set(T.p2(), T.p3())), d1 = math.Radians.rad2deg(a1), d2 = math.Radians.rad2deg(a2), d3 = 180 - d1 - d2;
                    return [d1, d2, d3];
                }
                angleType() {
                    if (this.isEmpty())
                        return geom.AngleType.UNKNOWN;
                    let as = this.angles(), d1 = as[0] - 90, d2 = as[1] - 90, d3 = as[2] - 90;
                    if (d1 == 0 || d2 == 0 || d3 == 0)
                        return geom.AngleType.RIGHT;
                    if (d1 < 0 || d2 < 0 || d3 < 0)
                        return geom.AngleType.ACUTE;
                    return geom.AngleType.OBTUSE;
                }
                area() {
                    if (this.isEmpty())
                        return 0;
                    let s = this._sides(), a = s[0], b = s[1], c = s[2], p = (a + b + c) / 2;
                    return Math.sqrt(p * (p - a) * (p - b) * (p - c));
                }
                gravityPoint() {
                    let T = this;
                    if (T.isEmpty())
                        return null;
                    let p1 = T.p1(), p2 = T.p2(), p3 = T.p3();
                    return [(p1[0] + p2[0] + p3[0]) / 3, (p1[1] + p2[1] + p3[1]) / 3];
                }
            }
            geom.Triangle = Triangle;
        })(geom = math.geom || (math.geom = {}));
    })(math = JS.math || (JS.math = {}));
})(JS || (JS = {}));
var Triangle = JS.math.geom.Triangle;
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var JS;
(function (JS) {
    let media;
    (function (media) {
        class AudioCache {
            constructor(init) {
                this._init = init;
                this._cache = new DataCache({
                    name: init.name
                });
            }
            _load(id, url) {
                let m = this;
                return Promises.create(function () {
                    Http.get({
                        url: url,
                        responseType: 'arraybuffer',
                        success: res => {
                            m.set(id, res.data).then(() => {
                                this.resolve();
                            });
                        }
                    }).catch(res => {
                        if (m._init.loaderror)
                            m._init.loaderror.call(m, res);
                    });
                });
            }
            load(imgs) {
                let ms = Types.isArray(imgs) ? imgs : [imgs], plans = [];
                ms.forEach(img => {
                    plans.push(Promises.newPlan(this._load, [img.id, img.url], this));
                });
                return Promises.order(plans);
            }
            get(id) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield this._cache.read(id);
                });
            }
            set(id, data) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield this._cache.write({
                        id: id,
                        data: data
                    });
                });
            }
            has(id) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield this._cache.hasKey(id);
                });
            }
            clear() {
                return __awaiter(this, void 0, void 0, function* () {
                    yield this._cache.clear();
                });
            }
            destroy() {
                return __awaiter(this, void 0, void 0, function* () {
                    yield this._cache.destroy();
                });
            }
        }
        media.AudioCache = AudioCache;
    })(media = JS.media || (JS.media = {}));
})(JS || (JS = {}));
var AudioCache = JS.media.AudioCache;
var JS;
(function (JS) {
    let media;
    (function (media) {
        let W = window, A = W.AudioContext || W['msAudioContext'], AC = new A();
        class AudioPro {
            constructor(init) {
                this._init = Jsons.union({
                    volume: 1,
                    loop: false
                }, init);
            }
            static play(id, cache) {
                new AudioPro().play(id, cache);
            }
            loop(is) {
                let m = this;
                if (is == void 0)
                    return m._init.loop;
                m._init.loop = is;
                m._node.loop = is;
                return m;
            }
            _play(a) {
                let m = this;
                m.stop();
                m._gain = AC.createGain();
                m._gain.gain.value = m._init.volume;
                m._node = AC.createBufferSource();
                m._node.buffer = a;
                let c = m._init;
                m._node.loop = c.loop;
                if (c.played)
                    m._node.onended = e => {
                        m._dispose();
                        c.played.call(m);
                    };
                m._node.connect(m._gain);
                if (c.handler) {
                    let node = c.handler.call(m, AC);
                    m._gain.connect(node);
                    node.connect(AC.destination);
                }
                else {
                    m._gain.connect(AC.destination);
                }
                if (c.playing)
                    c.playing.call(m);
                m._node.start();
            }
            play(a, cache) {
                if (typeof a == 'string') {
                    cache.get(a).then(buf => {
                        this.play(buf);
                    });
                }
                else {
                    if (a)
                        AC.decodeAudioData(a, (buffer) => {
                            this._play(buffer);
                        }, err => {
                            JSLogger.error('Decode audio buffer fail!');
                        });
                }
            }
            stop() {
                if (this._node)
                    this._node.stop();
            }
            volume(n) {
                let m = this;
                m._init.volume = n;
                if (m._gain)
                    m._gain.gain.value = n;
            }
            _dispose() {
                let m = this;
                m._gain.disconnect();
                m._node.disconnect();
            }
        }
        media.AudioPro = AudioPro;
    })(media = JS.media || (JS.media = {}));
})(JS || (JS = {}));
var AudioPro = JS.media.AudioPro;
var JS;
(function (JS) {
    let media;
    (function (media) {
        class VideoPlayer {
            constructor(c) {
                let T = this;
                T._c = Jsons.union({
                    controls: true,
                    autoplay: false,
                    loop: false,
                    muted: false,
                    preload: 'auto'
                }, c);
                T._src = T._c.src;
                let el = $1('#' + T._c.id);
                if (el) {
                    T._el = el;
                    Jsons.forEach(T._c, (v, k) => {
                        if (k != 'id' && k != 'ctor' && k != 'on')
                            T._el.attr(k, v);
                    });
                }
                else {
                    let ctr = (Types.isString(T._c.appendTo) ? $1(T._c.appendTo) : T._c.appendTo) || document.body, id = T._c.id || Random.uuid(4);
                    ctr.append(Strings.nodeHTML('video', {
                        id: id,
                        controls: T._c.controls,
                        loop: T._c.loop,
                        muted: T._c.muted,
                        preload: T._c.preload,
                        poster: T._c.poster,
                        width: T._c.width,
                        height: T._c.height,
                        src: T._c.src
                    }));
                    this._el = $1(`#${id}`);
                }
                if (T._c.on)
                    Jsons.forEach(T._c.on, (v, k) => { this.on(k, v); });
            }
            src(src) {
                let T = this;
                if (!src)
                    return T._src;
                T._src = src;
                T._el.src = src;
                T._el.load();
                return T;
            }
            currentTime(t) {
                return this._gs('currentTime', t);
            }
            defaultPlaybackRate(r) {
                return this._gs('defaultPlaybackRate', r);
            }
            playbackRate(r) {
                return this._gs('playbackRate', r);
            }
            defaultMuted(is) {
                return this._gs('defaultMuted', is);
            }
            muted(is) {
                return this._gs('muted', is);
            }
            duration() {
                return this._el.duration;
            }
            play() {
                return this._el.play();
            }
            paused() {
                return this._el.paused;
            }
            ended() {
                return this._el.ended;
            }
            error() {
                return this._el.error;
            }
            loop(is) {
                return this._gs('loop', is);
            }
            played() {
                return this._el.played;
            }
            volume(v) {
                return this._gs('volume', v);
            }
            pause() {
                this._el.pause();
                return this;
            }
            preload(s) {
                return this._gs('preload', s);
            }
            crossOrigin(s) {
                return this._gs('crossOrigin', s);
            }
            _gs(p, v) {
                if (v == void 0)
                    return this._el[p];
                this._el[p] = v;
                return this;
            }
            canPlayType(type) {
                return this._el.canPlayType(type);
            }
            on(e, fn) {
                this._el['on' + e] = fn;
            }
        }
        media.VideoPlayer = VideoPlayer;
    })(media = JS.media || (JS.media = {}));
})(JS || (JS = {}));
var VideoPlayer = JS.media.VideoPlayer;
var JS;
(function (JS) {
    let net;
    (function (net) {
        class MIME {
        }
        MIME.exe = 'application/octet-stream';
        MIME.bin = 'application/octet-stream';
        MIME.eps = 'application/postscript';
        MIME.word = 'application/vnd.ms-word';
        MIME.xls = 'application/vnd.ms-excel';
        MIME.ppt = 'application/vnd.ms-powerpoint';
        MIME.mdb = 'application/x-msaccess';
        MIME.pdf = 'application/pdf';
        MIME.odt = 'application/vnd.oasis.opendocument.text';
        MIME.swf = 'application/x-shockwave-flash';
        MIME.apk = 'application/vnd.android.package-archive';
        MIME.jar = 'application/java-archive';
        MIME.dll = 'application/x-msdownload';
        MIME.class = 'application/octet-stream';
        MIME.gz = 'application/x-gzip';
        MIME.tgz = 'application/x-gzip';
        MIME.bz = 'application/x-bzip2';
        MIME.zip = 'application/zip';
        MIME.rar = 'application/x-rar';
        MIME.tar = 'application/x-tar';
        MIME.z = 'application/x-compress';
        MIME.z7 = 'application/x-7z-compressed';
        MIME.arj = 'application/arj';
        MIME.lzh = 'application/x-lzh';
        MIME.ZIPS = MIME.gz + ',' + MIME.tgz + ',' + MIME.bz + ',' + MIME.zip
            + ',' + MIME.rar + ',' + MIME.tar + ',' + MIME.z + ',' + MIME.z7 + ',' + MIME.arj + ',' + MIME.lzh;
        MIME.text = 'text/plain';
        MIME.md = 'text/x-markdown';
        MIME.html = 'text/html';
        MIME.xml = 'text/xml';
        MIME.css = 'text/css';
        MIME.json = 'application/json,text/json';
        MIME.js = 'application/javascript,text/javascript,application/ecmascript,application/x-ecmascript';
        MIME.rtf = 'text/rtf';
        MIME.rtfd = 'text/rtfd';
        MIME.sql = 'text/x-sql';
        MIME.sh = 'application/x-sh';
        MIME.csv = 'text/csv';
        MIME.svg = 'image/svg+xml';
        MIME.jpg = 'image/jpeg';
        MIME.gif = 'image/gif';
        MIME.png = 'image/png';
        MIME.webp = 'image/webp';
        MIME.bmp = 'image/bmp,image/x-ms-bmp';
        MIME.tif = 'image/tiff';
        MIME.tga = 'image/x-targa';
        MIME.pcx = 'image/x-pcx';
        MIME.pic = 'image/x-pict';
        MIME.ico = 'image/x-icon';
        MIME.ai = 'application/illustrator';
        MIME.psd = 'image/vnd.adobe.photoshop,image/x-photoshop';
        MIME.WEB_IMAGES = MIME.svg + ',' + MIME.jpg + ',' + MIME.gif + ',' + MIME.png + ',' + MIME.webp;
        MIME.IMAGES = MIME.WEB_IMAGES + ',' + MIME.bmp + ',' + MIME.tif + ',' + MIME.tga + ',' + MIME.pcx
            + ',' + MIME.pic + ',' + MIME.ico + ',' + MIME.ai + ',' + MIME.psd;
        MIME.wav = 'audio/wav,audio/x-wav';
        MIME.ogg = 'audio/ogg';
        MIME.mp4_a = 'audio/mp4';
        MIME.webm_a = 'audio/webm';
        MIME.wma = 'audio/x-ms-wma';
        MIME.mp3 = 'audio/mpeg';
        MIME.mid = 'audio/midi,audio/x-midi';
        MIME.au = 'audio/basic';
        MIME.aif = 'audio/x-aiff';
        MIME.H5_AUDIOS = MIME.ogg + ',' + MIME.wav + ',' + MIME.mp4_a + ',' + MIME.webm_a;
        MIME.AUDIOS = MIME.H5_AUDIOS + ',' + MIME.mp3 + ',' + MIME.mid + ',' + MIME.wma + ',' + MIME.au + ',' + MIME.aif;
        MIME.ogv = 'video/ogg';
        MIME.mp4_v = 'video/mp4';
        MIME.webm_v = 'video/webm';
        MIME.avi = 'video/x-msvideo';
        MIME.dv = 'video/x-dv';
        MIME.mpeg = 'video/mpeg';
        MIME.mov = 'video/quicktime';
        MIME.wmv = 'video/x-ms-wmv';
        MIME.asf = 'video/x-ms-asf';
        MIME.flv = 'video/x-flv';
        MIME.mkv = 'video/x-matroska';
        MIME.gpp3 = 'video/3gpp';
        MIME.rm = 'application/vnd.rn-realmedia';
        MIME.H5_VIDEOS = MIME.ogv + ',' + MIME.mp4_v + ',' + MIME.webm_v;
        MIME.VIDEOS = MIME.H5_VIDEOS + ',' + MIME.avi + ',' + MIME.dv + ',' + MIME.mpeg + ',' + MIME.mov
            + ',' + MIME.wmv + ',' + MIME.asf + ',' + MIME.flv + ',' + MIME.mkv + ',' + MIME.gpp3 + ',' + MIME.rm;
        net.MIME = MIME;
    })(net = JS.net || (JS.net = {}));
})(JS || (JS = {}));
var MIME = JS.net.MIME;
var JS;
(function (JS) {
    let net;
    (function (net) {
        let Y = Types, J = Jsons, _judgeType = (t, dt) => {
            if (net.MIME.text == t)
                return 'text';
            if (net.MIME.html = t)
                return 'html';
            if (net.MIME.xml == t)
                return 'xml';
            if (net.MIME.json.indexOf(t) > -1)
                return 'json';
            return dt;
        }, _headers = (xhr) => {
            let headers = {}, hString = xhr.getAllResponseHeaders(), hRegexp = /([^\s]*?):[ \t]*([^\r\n]*)/mg, match = null;
            while ((match = hRegexp.exec(hString))) {
                headers[match[1]] = match[2];
            }
            return headers;
        }, _response = (req, xhr, error) => {
            let type = req.responseType, headers = _headers(xhr);
            if (!type && xhr.status > 0)
                type = _judgeType(headers['Content-Type'], type);
            return {
                request: req,
                url: xhr.responseURL,
                raw: xhr.response,
                type: type,
                data: xhr.response,
                status: xhr.status,
                statusText: error || (xhr.status == 0 ? 'error' : xhr.statusText),
                headers: headers,
                xhr: xhr
            };
        }, _parseResponse = function (res, req, xhr) {
            try {
                let raw = req.responseType == 'xml' ? xhr.responseXML : xhr.response, cvt = req.converts && req.converts[res.type];
                if (req.responseFilter)
                    raw = req.responseFilter(raw, res.type);
                res.data = cvt ? cvt(raw, res) : raw;
            }
            catch (e) {
                res.statusText = 'parseerror';
                if (req.error)
                    req.error(res);
                if (Http._ON['error'])
                    Http._ON['error'](res);
                this.reject(res);
            }
        }, _error = function (req, xhr, error) {
            let res = _response(req, xhr, error);
            if (req.error)
                req.error(res);
            if (Http._ON['error'])
                Http._ON['error'](res);
            this.reject(res);
        }, CACHE = {
            lastModified: {},
            etag: {}
        }, _done = function (oURL, req, xhr) {
            if (xhr['_isTimeout'])
                return;
            let status = xhr.status, isSucc = status >= 200 && status < 300 || status === 304, res = _response(req, xhr);
            if (isSucc) {
                let modified = null;
                if (req.ifModified) {
                    modified = xhr.getResponseHeader('Last-Modified');
                    if (modified)
                        CACHE.lastModified[oURL] = modified;
                    modified = xhr.getResponseHeader('etag');
                    if (modified)
                        CACHE.etag[oURL] = modified;
                }
                if (status === 204 || req.method === "HEAD") {
                    res.statusText = 'nocontent';
                }
                else if (status === 304) {
                    res.statusText = 'notmodified';
                }
                _parseResponse.call(this, res, req, xhr);
            }
            if (req.complete)
                req.complete(res);
            if (Http._ON['complete'])
                Http._ON['complete'](res);
            if (isSucc) {
                if (req.success)
                    req.success(res);
                if (Http._ON['success'])
                    Http._ON['success'](res);
                this.resolve(res);
            }
            else
                this.reject(res);
        }, _queryString = function (data) {
            if (Y.isString(data)) {
                return encodeURI(data);
            }
            else if (Y.isJsonObject(data)) {
                let str = '';
                J.forEach(data, (v, k) => {
                    str += `&${k}=${encodeURIComponent(v)}`;
                });
                return str;
            }
            return '';
        }, _queryURL = (req) => {
            let url = req.url.replace(/^\/\//, location.protocol + '//');
            if (!Check.isEmpty(req.data))
                url = `${url}${url.indexOf('?') < 0 ? '?' : ''}${_queryString(req.data)}`;
            return url;
        }, _finalURL = (url, cache) => {
            url = url.replace(/([?&])_=[^&]*/, '$1');
            if (!cache)
                url = `${url}${url.indexOf('?') < 0 ? '?' : '&'}_=${Date.now()}`;
            return url;
        }, _send = function (req) {
            if (!req.url)
                JSLogger.error('Sent an ajax request without URL.');
            req = J.union({
                method: 'GET',
                crossCookie: false,
                async: true,
                responseType: 'text',
                cache: true
            }, req);
            let xhr = new XMLHttpRequest(), oURL = _queryURL(req), url = _finalURL(oURL, req.cache), reqType = req.requestMime, resType = req.responseType, headers = req.headers || {};
            if (!reqType && (Y.isString(req.data) || Y.isJsonObject(req.data)))
                reqType = 'application/x-www-form-urlencoded;charset=UTF-8';
            xhr.open(req.method, url, req.async, req.username, req.password);
            xhr.setRequestHeader('Accept', resType && net.MIME[resType] ? net.MIME[resType] + ',*/*;q=0.01' : '*/*');
            if (reqType)
                xhr.setRequestHeader('Content-Type', reqType);
            if (!headers['X-Requested-With'])
                headers['X-Requested-With'] = "XMLHttpRequest";
            if (req.overrideResponseMime && xhr.overrideMimeType)
                xhr.overrideMimeType(req.overrideResponseMime);
            if (req.ifModified) {
                if (CACHE.lastModified[oURL])
                    xhr.setRequestHeader('If-Modified-Since', CACHE.lastModified[oURL]);
                if (CACHE.etag[oURL])
                    xhr.setRequestHeader('If-None-Match', CACHE.etag[oURL]);
            }
            for (let h in headers)
                xhr.setRequestHeader(h, headers[h]);
            if (req.progress)
                xhr.onprogress = function (e) { req.progress(e, xhr); };
            xhr.onerror = (e) => {
                _error.call(this, req, xhr, 'error');
            };
            xhr.withCredentials = req.crossCookie;
            let oAbort = xhr.abort;
            xhr.abort = function () {
                _error.call(this, req, xhr, xhr['_isTimeout'] ? 'timeout' : 'abort');
                oAbort.call(this);
            };
            if (req.async) {
                xhr.responseType = (resType == 'html' || resType == 'xml') ? 'document' : resType;
                xhr.timeout = req.timeout || 0;
                xhr.ontimeout = () => {
                    _error.call(this, req, xhr, 'timeout');
                };
                xhr.onreadystatechange = () => {
                    if (xhr.readyState == 4 && xhr.status > 0)
                        _done.call(this, oURL, req, xhr);
                };
            }
            let data = null;
            if (req.method != 'HEAD' && req.method != 'GET') {
                data = Y.isJsonObject(req.data) ? J.stringify(req.data) : req.data;
            }
            try {
                if (req.async && req.timeout > 0) {
                    var timer = self.setTimeout(function () {
                        xhr['_isTimeout'] = true;
                        xhr.abort();
                        self.clearTimeout(timer);
                    }, req.timeout);
                }
                xhr['timestamp'] = new Date().getTime();
                xhr.send(data);
            }
            catch (e) {
                _error.call(this, req, xhr, 'error');
            }
            if (!req.async && xhr.status > 0)
                _done.call(this, oURL, req, xhr);
        };
        class Http {
            static toRequest(quy) {
                return Y.isString(quy) ? { url: quy } : quy;
            }
            static send(req) {
                let q = this.toRequest(req);
                return q.thread ? this._inThread(req) : this._inMain(req);
            }
            static _inMain(req) {
                return Promises.create(function () {
                    _send.call(this, req);
                });
            }
            static get(req) {
                let r = this.toRequest(req);
                r.method = 'GET';
                return this.send(r);
            }
            static post(req) {
                let r = this.toRequest(req);
                r.method = 'POST';
                return this.send(r);
            }
            static upload(file, url) {
                let fm;
                if (file instanceof FormData) {
                    fm = file;
                }
                else {
                    fm = new FormData();
                    fm.append(file.postName || 'file', file.data, file.fileName);
                }
                return this.send({
                    url: url,
                    method: 'POST',
                    data: fm,
                    requestMime: 'multipart/form-data'
                });
            }
            static on(ev, fn) {
                this._ON[ev] = fn;
            }
            static sendBeacon(e, fn, scope) {
                window.addEventListener('unload', scope ? fn : function (e) { fn.call(scope, e); }, false);
            }
            static _inThread(req) {
                let r = this.toRequest(req);
                r.url = net.URI.toAbsoluteURL(r.url);
                return Promises.create(function () {
                    let ctx = this;
                    new Thread({
                        run: function () {
                            this.onposted((request) => {
                                self.Http._inMain(request).then((res) => {
                                    delete res.xhr;
                                    this.postMain(res);
                                });
                            });
                        }
                    }, typeof r.thread === 'boolean' ? null : r.thread).on('message', function (e, res) {
                        ctx.resolve(res);
                        this.terminate();
                    }).start().postThread(r);
                });
            }
        }
        Http._ON = {};
        net.Http = Http;
    })(net = JS.net || (JS.net = {}));
})(JS || (JS = {}));
var Http = JS.net.Http;
var JS;
(function (JS) {
    let store;
    (function (store) {
        let T = Types, J = Jsons, TP = Type, S = J.stringify;
        class StoreHelper {
            static toString(value) {
                if (T.isUndefined(value))
                    return 'undefined';
                if (T.isNull(value))
                    return 'null';
                if (T.isString(value))
                    return S(['string', value]);
                if (T.isBoolean(value))
                    return S(['boolean', value]);
                if (T.isNumber(value))
                    return S(['number', value]);
                if (T.isDate(value))
                    return S(['date', '' + value.valueOf()]);
                if (T.isArray(value) || T.isJsonObject(value))
                    return S(['object', S(value)]);
            }
            static parse(data) {
                if (TP.null == data)
                    return null;
                if (TP.undefined == data)
                    return undefined;
                let [type, val] = J.parse(data), v = val;
                switch (type) {
                    case TP.boolean:
                        v = Boolean(val);
                        break;
                    case TP.number:
                        v = Number(val);
                        break;
                    case TP.date:
                        v = new Date(val);
                        break;
                    case TP.array:
                        v = J.parse(val);
                        break;
                    case TP.json:
                        v = J.parse(val);
                        break;
                }
                return v;
            }
        }
        store.StoreHelper = StoreHelper;
    })(store = JS.store || (JS.store = {}));
})(JS || (JS = {}));
var StoreHelper = JS.store.StoreHelper;
var JS;
(function (JS) {
    let store;
    (function (store) {
        let D = document;
        class CookieStore {
            static get(key) {
                let reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)", "gi"), data = reg.exec(D.cookie), str = data ? window['unescape'](data[2]) : null;
                return store.StoreHelper.parse(str);
            }
            ;
            static set(key, value, expireHours, path) {
                if (!key)
                    return;
                let exp = CookieStore.EXPIRES_DATETIME;
                if (Types.isDefined(expireHours) && expireHours > 0) {
                    var date = new Date();
                    date.setTime(date.getTime() + expireHours * 3600 * 1000);
                    exp = date.toUTCString();
                }
                let p = path ? path : CookieStore.PATH;
                let domain = CookieStore.DOMAIN;
                if (domain)
                    domain = 'domain=' + domain;
                D.cookie = key + '=' + window['escape']('' + store.StoreHelper.toString(value)) + '; path=' + p + '; expires=' + exp + domain;
            }
            ;
            static remove(key) {
                let date = new Date();
                date.setTime(date.getTime() - 10000);
                D.cookie = key + "=; expire=" + date.toUTCString();
            }
            ;
            static clear() {
                D.cookie = '';
            }
            ;
        }
        CookieStore.EXPIRES_DATETIME = 'Wed, 15 Apr 2099 00:00:00 GMT';
        CookieStore.PATH = '/';
        CookieStore.DOMAIN = self.document ? D.domain : null;
        store.CookieStore = CookieStore;
    })(store = JS.store || (JS.store = {}));
})(JS || (JS = {}));
var CookieStore = JS.store.CookieStore;
var JS;
(function (JS) {
    let store;
    (function (store) {
        class DataCache {
            constructor(init) {
                this._init = init;
                this._tName = init.name;
            }
            destroy() {
                let me = this;
                return Promises.create(function () {
                    me._open().then(db => {
                        db.deleteObjectStore(me._tName);
                        this.resolve();
                    });
                });
            }
            _open() {
                let me = this;
                return Promises.create(function () {
                    let dbReq = window.indexedDB.open(me._tName, 1);
                    dbReq.onupgradeneeded = (e) => {
                        let db = dbReq.result;
                        db.onerror = () => { this.reject(null); };
                        if (!db.objectStoreNames.contains(me._tName))
                            db.createObjectStore(me._tName, { keyPath: 'id', autoIncrement: false });
                    };
                    dbReq.onsuccess = (e) => {
                        let db = e.target['result'];
                        this.resolve(db);
                    };
                });
            }
            keys() {
                let me = this;
                return Promises.create(function () {
                    me._open().then(db => {
                        let tx = db.transaction(me._tName, 'readonly'), table = tx.objectStore(me._tName), req = table.getAllKeys();
                        req.onsuccess = (e) => {
                            let rst = e.target['result'];
                            db.close();
                            this.resolve(rst);
                        };
                        req.onerror = (e) => {
                            db.close();
                        };
                    });
                });
            }
            hasKey(id) {
                let me = this;
                return Promises.create(function () {
                    me._open().then(db => {
                        let tx = db.transaction(me._tName, 'readonly'), table = tx.objectStore(me._tName), req = table.getKey(id);
                        req.onsuccess = (e) => {
                            let rst = e.target['result'];
                            db.close();
                            this.resolve(rst !== undefined);
                        };
                        req.onerror = (e) => {
                            db.close();
                        };
                    });
                });
            }
            write(d) {
                let me = this;
                return Promises.create(function () {
                    me._open().then(db => {
                        let tx = db.transaction(me._tName, 'readwrite'), table = tx.objectStore(me._tName), req = table.put(d);
                        req.onsuccess = (e) => {
                            db.close();
                            this.resolve();
                        };
                        req.onerror = (e) => {
                            db.close();
                            if (me._init.onWriteFail)
                                me._init.onWriteFail.call(me, e);
                        };
                    });
                });
            }
            delete(id) {
                let me = this;
                return Promises.create(function () {
                    me._open().then(db => {
                        let table = db.transaction(me._tName, 'readwrite').objectStore(me._tName), req = table.delete(id);
                        req.onsuccess = (e) => {
                            db.close();
                            this.resolve();
                        };
                        req.onerror = (e) => {
                            db.close();
                            if (me._init.onWriteFail)
                                me._init.onWriteFail.call(me, e);
                            this.reject();
                        };
                    }).catch(() => {
                        this.reject();
                    });
                });
            }
            clear() {
                let me = this;
                return Promises.create(function () {
                    me._open().then(db => {
                        let table = db.transaction(me._tName, 'readwrite').objectStore(me._tName), req = table.clear();
                        req.onsuccess = (e) => {
                            db.close();
                            this.resolve();
                        };
                        req.onerror = (e) => {
                            db.close();
                            if (me._init.onWriteFail)
                                me._init.onWriteFail.call(me, e);
                        };
                    });
                });
            }
            read(id) {
                let me = this;
                return Promises.create(function () {
                    me._open().then(db => {
                        let table = db.transaction(me._tName, 'readonly').objectStore(me._tName), req = table.get(id);
                        req.onsuccess = (e) => {
                            let file = e.target['result'];
                            db.close();
                            if (file) {
                                this.resolve(file.data);
                            }
                            else {
                                if (me._init.onReadFail)
                                    me._init.onReadFail.call(me, e);
                            }
                        };
                        req.onerror = (e) => {
                            db.close();
                            if (me._init.onReadFail)
                                me._init.onReadFail.call(me, e);
                        };
                    });
                });
            }
            load(d) {
                let me = this;
                return Promises.create(function () {
                    Http.get({
                        url: d.url,
                        responseType: d.type,
                        error: res => {
                            if (me._init.onLoadFail)
                                me._init.onLoadFail.call(me, res);
                            this.reject(me);
                        },
                        success: res => {
                            me.write({
                                id: d.id,
                                data: res.raw
                            }).then(() => {
                                this.resolve(me);
                            }).catch(() => {
                                this.reject(me);
                            });
                        }
                    });
                });
            }
        }
        store.DataCache = DataCache;
    })(store = JS.store || (JS.store = {}));
})(JS || (JS = {}));
var DataCache = JS.store.DataCache;
var JS;
(function (JS) {
    let store;
    (function (store) {
        class ImageCache {
            constructor() {
                this._map = {};
            }
            _load(id, url, uncached) {
                let m = this;
                return Promises.create(function () {
                    let img = new Image();
                    img.onload = () => {
                        if (!uncached)
                            m.set(id, img);
                        this.resolve();
                    };
                    img.src = url;
                });
            }
            load(imgs) {
                let ms = Types.isArray(imgs) ? imgs : [imgs], plans = [];
                ms.forEach(img => {
                    plans.push(Promises.newPlan(this._load, [img.id, img.url], this));
                });
                return Promises.all(plans);
            }
            set(id, img) {
                this._map[id] = img;
            }
            get(id) {
                return this._map[id];
            }
            has(id) {
                return this._map.hasOwnProperty(id);
            }
            clear() {
                this._map = {};
            }
        }
        store.ImageCache = ImageCache;
    })(store = JS.store || (JS.store = {}));
})(JS || (JS = {}));
var ImageCache = JS.store.ImageCache;
var JS;
(function (JS) {
    let store;
    (function (store) {
        let L = localStorage;
        class LocalStore {
            static get(key) {
                let str = L.getItem(key);
                if (!str)
                    return undefined;
                return store.StoreHelper.parse(str);
            }
            ;
            static set(key, value) {
                L.setItem(key, store.StoreHelper.toString(value));
            }
            ;
            static remove(key) {
                L.removeItem(key);
            }
            ;
            static key(i) {
                return L.key(i);
            }
            ;
            static size() {
                return L.length;
            }
            ;
            static clear() {
                L.clear();
            }
            ;
        }
        store.LocalStore = LocalStore;
    })(store = JS.store || (JS.store = {}));
})(JS || (JS = {}));
var LocalStore = JS.store.LocalStore;
var JS;
(function (JS) {
    let store;
    (function (store) {
        let S = sessionStorage;
        class SessionStore {
            static get(key) {
                let str = S.getItem(key);
                if (!str)
                    return undefined;
                return store.StoreHelper.parse(str);
            }
            ;
            static set(key, value) {
                S.setItem(key, store.StoreHelper.toString(value));
            }
            ;
            static remove(key) {
                S.removeItem(key);
            }
            ;
            static key(i) {
                return S.key(i);
            }
            ;
            static size() {
                return S.length;
            }
            ;
            static clear() {
                S.clear();
            }
            ;
        }
        store.SessionStore = SessionStore;
    })(store = JS.store || (JS.store = {}));
})(JS || (JS = {}));
var SessionStore = JS.store.SessionStore;
var JS;
(function (JS) {
    let sugar;
    (function (sugar) {
        let T = Types;
        function deprecated(info) {
            return sugar.Annotations.define({
                name: 'deprecated',
                handler: (anno, values, obj, propertyKey) => {
                    let info = values ? (values[0] || '') : '', text = null;
                    if (T.equalKlass(obj)) {
                        text = `The [${obj.name}] class`;
                    }
                    else {
                        let klass = obj.constructor;
                        text = `The [${propertyKey}] ${T.isFunction(obj[propertyKey]) ? 'method' : 'field'} of ${klass.name}`;
                    }
                    JSLogger.warn(text + ' has been deprecated. ' + info);
                }
            }, arguments);
        }
        sugar.deprecated = deprecated;
        var _aop = function (args, fn, anno) {
            return sugar.Annotations.define({
                name: anno,
                handler: (anno, values, obj, methodName) => {
                    let adv = {};
                    if (T.isFunction(values[0])) {
                        adv[anno] = values[0];
                    }
                    else {
                        adv = values[0];
                        if (!adv)
                            return;
                    }
                    sugar.Class.aop(obj.constructor, methodName, adv);
                },
                target: sugar.AnnotationTarget.METHOD
            }, args);
        };
        function before(fn) {
            return _aop(arguments, fn, 'before');
        }
        sugar.before = before;
        function after(fn) {
            return _aop(arguments, fn, 'after');
        }
        sugar.after = after;
        function around(fn) {
            return _aop(arguments, fn, 'around');
        }
        sugar.around = around;
        function throws(fn) {
            return _aop(arguments, fn, 'throws');
        }
        sugar.throws = throws;
    })(sugar = JS.sugar || (JS.sugar = {}));
})(JS || (JS = {}));
(function () {
    let $F = Function.prototype;
    $F.aop = function (advisor, that) {
        let old = this, fn = function () {
            let args = Arrays.newArray(arguments), ctx = that || this, rst = undefined;
            if (advisor.before)
                advisor.before.apply(ctx, args);
            try {
                rst = advisor.around ? advisor.around.apply(ctx, [old].concat(args)) : old.apply(ctx, args);
            }
            catch (e) {
                if (advisor.throws)
                    advisor.throws.apply(ctx, [e]);
            }
            if (advisor.after)
                advisor.after.apply(ctx, [rst]);
            return rst;
        };
        return fn;
    };
    $F.mixin = function (kls, methodNames) {
        if (!kls)
            return;
        let kp = kls.prototype, tp = this.prototype, ms = Reflect.ownKeys(kp);
        for (let i = 0, len = ms.length; i < len; i++) {
            let m = ms[i];
            if ('constructor' != m && !tp[m]) {
                if (methodNames) {
                    if (methodNames.findIndex(v => { return v == m; }) > -1)
                        tp[m] = kp[m];
                }
                else {
                    tp[m] = kp[m];
                }
            }
        }
    };
})();
var __decorate = function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    if (key && r && typeof target[key] == 'function')
        delete r.value;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var deprecated = JS.sugar.deprecated;
var before = JS.sugar.before;
var after = JS.sugar.after;
var around = JS.sugar.around;
var throws = JS.sugar.throws;
var JS;
(function (JS) {
    let ui;
    (function (ui) {
        class ClipBoard {
            static copyTarget(clicker, target) {
                this._do('copy', clicker, target);
            }
            static cutTarget(clicker, target) {
                this._do('cut', clicker, target);
            }
            static _do(action, clicker, target) {
                Bom.ready(() => {
                    let cli = Dom.$1(clicker), tar = Dom.$1(target);
                    if (!cli || !tar)
                        throw new NotFoundError('The clicker or target not found!');
                    cli.attr('data-clipboard-action', action);
                    cli.attr('data-clipboard-target', '#' + tar.attr('id'));
                    new ClipboardJS('#' + cli.attr('id'));
                });
            }
            static copyText(clicker, text) {
                Bom.ready(() => {
                    let cli = Dom.$1(clicker);
                    if (cli)
                        throw new NotFoundError('The clicker not found!');
                    cli.attr('data-clipboard-text', text);
                    new ClipboardJS('#' + cli.attr('id'));
                });
            }
        }
        ui.ClipBoard = ClipBoard;
    })(ui = JS.ui || (JS.ui = {}));
})(JS || (JS = {}));
var ClipBoard = JS.ui.ClipBoard;
var JS;
(function (JS) {
    let ui;
    (function (ui) {
        class CustomElement extends HTMLElement {
            constructor(cfg) {
                super();
                this._config = cfg;
                cfg.onConstructor.apply(this, this._config);
            }
            connectedCallback() {
                this._config.onCreated.apply(this);
            }
            disconnectedCallback() {
                this._config.onDestroyed.apply(this);
            }
            adoptedCallback() {
                this._config.onAdopted.apply(this);
            }
            attributeChangedCallback(attrName, oldVal, newVal) {
                this._config.onAttributeChanged.apply(this, [attrName, oldVal, newVal]);
            }
            static define(config) {
                customElements.define(config.tagName, CustomElement, { extends: config.extendsTagName });
                return CustomElement.prototype;
            }
        }
        ui.CustomElement = CustomElement;
    })(ui = JS.ui || (JS.ui = {}));
})(JS || (JS = {}));
var CustomElement = JS.ui.CustomElement;
var JS;
(function (JS) {
    let ui;
    (function (ui) {
        class Templator {
            constructor() {
                this._hb = Handlebars.create();
            }
            compile(tpl, options) {
                return this._hb.compile(tpl, options);
            }
            registerHelper(name, fn) {
                this._hb.registerHelper(name, fn);
            }
            unregisterHelper(name) {
                this._hb.unregisterHelper(name);
            }
            static safeString(s) {
                return new Handlebars.SafeString(s);
            }
        }
        ui.Templator = Templator;
    })(ui = JS.ui || (JS.ui = {}));
})(JS || (JS = {}));
var Templator = JS.ui.Templator;
var JS;
(function (JS) {
    let unit;
    (function (unit) {
        let TestCase = class TestCase {
            constructor(name) {
                this._count = 0;
                this._methods = {};
                this.name = name || this.className;
                this._addTestMethods();
            }
            getName() {
                return this.name;
            }
            setUp() {
            }
            tearDown() {
            }
            countTests() {
                return this._count;
            }
            _createResult() {
                return new unit.TestResult();
            }
            run(result) {
                let rst = result ? result : this._createResult();
                rst.run(this);
                return rst;
            }
            runMethod(name) {
                let ept = null;
                this.setUp();
                try {
                    this._methods[name].invoke(this);
                }
                catch (e) {
                    ept = e;
                }
                finally {
                    try {
                        this.tearDown();
                    }
                    catch (e2) {
                        if (ept == null)
                            ept = e2;
                    }
                }
                if (ept != null)
                    throw ept;
            }
            getTestMethods() {
                return this._methods;
            }
            _addTestMethods() {
                let methods = this.getClass().methods();
                methods.forEach(m => {
                    if (!m.isStatic && m.name.startsWith('test')) {
                        this.addTestMethod(m);
                    }
                });
            }
            addTestMethod(method) {
                this._methods[method.name] = method;
                this._count++;
            }
        };
        TestCase = __decorate([
            klass('JS.unit.TestCase'),
            __metadata("design:paramtypes", [String])
        ], TestCase);
        unit.TestCase = TestCase;
    })(unit = JS.unit || (JS.unit = {}));
})(JS || (JS = {}));
var TestCase = JS.unit.TestCase;
var JS;
(function (JS) {
    let unit;
    (function (unit) {
        class TestFailure {
            constructor(failed, error) {
                this._method = failed;
                this._error = error;
            }
            failedMethod() {
                return this._method;
            }
            thrownError() {
                return this._error;
            }
            isFailure() {
                return this.thrownError() instanceof AssertError;
            }
        }
        unit.TestFailure = TestFailure;
    })(unit = JS.unit || (JS.unit = {}));
})(JS || (JS = {}));
var TestFailure = JS.unit.TestFailure;
var JS;
(function (JS) {
    let unit;
    (function (unit) {
        class TestResult {
            constructor() {
                this._fails = {};
                this._errors = {};
                this._failCount = 0;
                this._errorCount = 0;
                this._listeners = [];
                this._isStoped = false;
                this._runCount = 0;
            }
            isSuccessTestMethod(methodName, caseName) {
                let name = `${caseName}.${methodName}`;
                return (this._errors[name] || this._fails[name]) ? false : true;
            }
            errors() {
                return this._errors;
            }
            failures() {
                return this._fails;
            }
            runCount() {
                return this._runCount;
            }
            shouldStop() {
                return this._isStoped;
            }
            addListener(listener) {
                this._listeners.push(listener);
            }
            removeListener(listener) {
                this._listeners.remove(it => {
                    return it == listener;
                });
            }
            addError(e, method, test) {
                this._errors[test.getName() + '.' + method.name] = new unit.TestFailure(method, e);
                this._errorCount++;
                this._listeners.forEach(li => {
                    li.addError(e, method, test);
                });
            }
            addFailure(e, method, test) {
                this._fails[test.getName() + '.' + method.name] = new unit.TestFailure(method, e);
                this._failCount++;
                this._listeners.forEach(li => {
                    li.addFailure(e, method, test);
                });
            }
            endTest(method, test) {
                this._listeners.forEach(li => {
                    li.endTest(method, test);
                });
            }
            startTest(method, test) {
                this._runCount++;
                this._listeners.forEach(li => {
                    li.startTest(method, test);
                });
            }
            stop() {
                this._isStoped = true;
            }
            failureCount() {
                return this._failCount;
            }
            errorCount() {
                return this._errorCount;
            }
            wasSuccessful() {
                return this.failureCount() == 0 && this.errorCount() == 0;
            }
            run(test) {
                let methods = test.getTestMethods();
                Jsons.forEach(methods, (m, name) => {
                    this.startTest(m, test);
                    try {
                        test.runMethod(name);
                    }
                    catch (e) {
                        if (e instanceof AssertError) {
                            this.addFailure(e, m, test);
                        }
                        else if (e instanceof Error) {
                            this.addError(e, m, test);
                        }
                    }
                    this.endTest(m, test);
                });
            }
        }
        unit.TestResult = TestResult;
    })(unit = JS.unit || (JS.unit = {}));
})(JS || (JS = {}));
var TestResult = JS.unit.TestResult;
var JS;
(function (JS) {
    let unit;
    (function (unit) {
        var TestSuite_1;
        let Y = Types;
        let TestSuite = TestSuite_1 = class TestSuite {
            constructor(name) {
                this._cases = [];
                if (Y.isString(name)) {
                    this._name = name;
                }
                else {
                    this.addTest(name);
                }
                this._addTestMethods();
                this._name = this._name || this.className;
            }
            getTestCases() {
                return this._cases;
            }
            getName() {
                return this._name;
            }
            countTests() {
                let count = 0;
                this._cases.forEach(tc => {
                    count += tc.countTests();
                });
                return count;
            }
            run(result) {
                this._cases.some(t => {
                    if (result.shouldStop())
                        return true;
                    this.runTest(t, result);
                });
            }
            runTest(test, result) {
                test.run(result);
            }
            addTest(test) {
                if (!test)
                    return;
                if (Y.isArray(test)) {
                    test.forEach(clazz => {
                        this._addTest(clazz);
                    });
                }
                else {
                    this._addTest(test);
                }
            }
            _addTest(test) {
                if (!test)
                    return;
                let m = this;
                if (Y.ofKlass(test, TestSuite_1)) {
                    m._cases = m._cases.concat(test.getTestCases());
                }
                else if (Y.ofKlass(test, unit.TestCase)) {
                    m._cases[m._cases.length] = test;
                }
                else if (test.subclassOf(TestSuite_1.class)) {
                    m._cases = m._cases.concat(Class.newInstance(test.name).getTestCases());
                }
                else if (test.subclassOf(unit.TestCase.class)) {
                    m._cases[m._cases.length] = Class.newInstance(test.name);
                }
            }
            _addTestMethods() {
                let methods = this.getClass().methods(), tc = null;
                methods.forEach(m => {
                    if (!m.isStatic && m.name.startsWith('test')) {
                        if (tc == null)
                            tc = new unit.TestCase(this.className);
                        tc.addTestMethod(m);
                    }
                });
                if (tc)
                    this._cases.push(tc);
            }
        };
        TestSuite = TestSuite_1 = __decorate([
            klass('JS.unit.TestSuite'),
            __metadata("design:paramtypes", [Object])
        ], TestSuite);
        unit.TestSuite = TestSuite;
    })(unit = JS.unit || (JS.unit = {}));
})(JS || (JS = {}));
var TestSuite = JS.unit.TestSuite;
var JS;
(function (JS) {
    let unit;
    (function (unit) {
        class TestUI {
            constructor(runner) {
                this._startTime = 0;
                this._COLORS = {
                    'red': 'firebrick', 'green': 'forestgreen', 'current': 'black'
                };
                this._FLAGS = {
                    'red': '✘ ', 'green': '✔ ', 'current': '▸ '
                };
                $1('#btnRun').off().on('click', () => {
                    runner.doRun();
                });
                $1('#btnStop').off().on('click', () => {
                    runner.doStop();
                });
            }
            addError() {
                $1('#errors').innerHTML = this._result.errorCount() + '';
            }
            addFailure() {
                $1('#failures').innerHTML = this._result.failureCount() + '';
            }
            endTest(method, test) {
                let p = this._result.runCount() / this._suite.countTests() * 100, pro = $1('#progress');
                pro.style.width = p + '%';
                pro.style.backgroundColor = this._result.isSuccessTestMethod(method.name, test.getName()) ? 'forestgreen' : 'firebrick';
                pro.attr('title', this._result.runCount() + '/' + this._suite.countTests());
                this._renderOption(`${test.getName()}.${method.name}`, this._result.isSuccessTestMethod(method.name, test.getName()) ? 'green' : 'red');
            }
            startTest(method, test) {
                $1('#runs').innerHTML = this._result.runCount() + '/' + this._suite.countTests();
                this._renderOption(`${test.getName()}.${method.name}`, 'current');
            }
            endSuite() {
                let time = Number((System.highResTime() - this._startTime) / 1000).round(6);
                $1('#info').innerHTML = `All tests was completed in ${time} seconds.`;
                $1('#progress').style.backgroundColor = this._result.wasSuccessful() ? 'forestgreen' : 'firebrick';
                $1('#btnRun').removeAttribute('disabled');
            }
            startSuite(suite, result) {
                this._suite = suite;
                this._result = result;
                this._init(suite);
                $1('#btnRun').attr('disabled', 'disabled');
                this._startTime = System.highResTime();
            }
            _renderOption(testName, type) {
                let option = $1('#tests').querySelector(`option[value="${testName}"]`);
                option.style.color = this._COLORS[type];
                option.textContent = this._FLAGS[type] + option.attr('rawText');
            }
            _addOption(optgroup, text, value) {
                let txt = Strings.escapeHTML(text);
                optgroup['append'](`<option rawText="${txt}" value="${value ? value : ''}">${txt}</option>`);
            }
            _printTrace(testName) {
                $1('#trace').off().innerHTML = '';
                let failure = this._result.errors()[testName] || this._result.failures()[testName];
                if (!failure)
                    return;
                let error = failure.thrownError();
                this._addOption($1('#trace'), `${failure.isFailure() ? 'AssertError' : error.name}: ${error.message}`);
                let stack = error.stack;
                if (stack) {
                    stack.split('\n').forEach((line, index) => {
                        if (index > 0)
                            this._addOption($1('#trace'), line);
                    });
                }
            }
            _printTestCase(tc) {
                let tests = $1('#tests'), optgroup = document.createElement('optgroup'), methods = tc.getTestMethods();
                Jsons.forEach(methods, (m) => {
                    this._addOption(optgroup, m.name, `${tc.getName()}.${m.name}`);
                });
                tests['append'](optgroup.attr('label', '▷ ' + tc.getName()));
            }
            _init(suite) {
                let sys = System.info();
                $1('#env').innerHTML = `${sys.browser.name} ${sys.browser.version || ''} / ${sys.os.name} ${sys.os.version || ''} / ${sys.device.type}`;
                $1('#info').innerHTML = '';
                let pro = $1('#progress'), sty = pro.style;
                sty.width = '0%';
                sty.backgroundColor = 'forestgreen';
                pro.attr('title', '');
                $1('#runs').innerHTML = '0/0';
                $1('#errors').innerHTML = '0';
                $1('#failures').innerHTML = '0';
                $1('#trace').off().innerHTML = '';
                let tests = $1('#tests'), cases = suite.getTestCases();
                tests.off().innerHTML = '';
                cases.forEach(tc => {
                    this._printTestCase(tc);
                });
                let me = this;
                tests.on('change', function () {
                    let testName = this.find('option:checked').attr('value');
                    me._printTrace(testName);
                });
            }
        }
        unit.TestUI = TestUI;
    })(unit = JS.unit || (JS.unit = {}));
})(JS || (JS = {}));
var JS;
(function (JS) {
    let unit;
    (function (unit) {
        class TestRunner {
            constructor() {
                this._ui = new JS.unit.TestUI(this);
            }
            doRun(test) {
                this._suite = (!test || Types.isKlass(test, unit.TestSuite) ? test : new unit.TestSuite(test)) || this._suite;
                this._result = new unit.TestResult();
                this._result.addListener(this._ui);
                this._ui.startSuite(this._suite, this._result);
                this._suite.run(this._result);
                this._ui.endSuite();
                return this._result;
            }
            doStop() {
                this._result.stop();
            }
            static addTests(tests) {
                tests.forEach(test => {
                    this._test.addTest(test);
                });
            }
            static run(test) {
                let runner = new TestRunner();
                return runner.doRun(test || this._test);
            }
            static load(url, tests) {
                let urls = typeof url == 'string' ? [url] : url, tasks = [];
                urls.forEach(u => {
                    tasks.push(Promises.newPlan(Loader.js, [u]));
                });
                Promises.order(tasks).then(() => {
                    if (tests)
                        this.addTests(tests);
                    this.run();
                });
            }
        }
        TestRunner._test = new unit.TestSuite();
        unit.TestRunner = TestRunner;
    })(unit = JS.unit || (JS.unit = {}));
})(JS || (JS = {}));
var TestRunner = JS.unit.TestRunner;
if (self['HTMLElement'])
    (function () {
        const D = document, HP = HTMLElement.prototype, oa = HP.append, op = HP.prepend, or = HP.remove, _ad = function (html) {
            if (!html)
                return;
            let div = D.createElement('div'), nodes = null, fg = D.createDocumentFragment();
            div.innerHTML = html;
            nodes = div.childNodes;
            for (let i = 0, len = nodes.length; i < len; i++) {
                fg.appendChild(nodes[i].cloneNode(true));
            }
            this.appendChild(fg);
            nodes = null;
            fg = null;
        }, _pd = function (html) {
            if (!html)
                return;
            let div = D.createElement('div'), nodes = null, fg = D.createDocumentFragment();
            div.innerHTML = html;
            nodes = div.childNodes;
            for (let i = 0, len = nodes.length; i < len; i++) {
                fg.appendChild(nodes[i].cloneNode(true));
            }
            this.insertBefore(fg, this.firstChild);
            nodes = null;
            fg = null;
        };
        HP.append = function (...nodes) {
            nodes.forEach(n => {
                typeof n == 'string' ? _ad.call(this, n) : oa.call(this, n.cloneNode(true));
            });
        };
        HP.prepend = function (...nodes) {
            nodes.forEach(n => {
                typeof n == 'string' ? _pd.call(this, n) : op.call(this, n);
            });
        };
        HP.box = function () {
            let box = this.computedStyle();
            return {
                x: parseFloat(box.left) + System.display().docScrollX,
                y: parseFloat(box.top) + System.display().docScrollY,
                w: parseFloat(box.width),
                h: parseFloat(box.height)
            };
        };
        HP.attr = function (key, val) {
            if (arguments.length == 1)
                return this.getAttribute(key);
            this.setAttribute(key, val);
            return this;
        };
        let _on = function (type, fn, opts) {
            if (!this['_bus'])
                this['_bus'] = new EventBus(this);
            let bus = this['_bus'], cb = e => {
                bus.fire(e);
            }, once = (opts && opts['once']) ? true : false;
            bus.on(type, fn, once);
            if (this.addEventListener)
                this.addEventListener(type, cb, opts);
        };
        HP.on = function (type, fn, opts) {
            let types = type.split(' ');
            types.forEach(t => {
                _on.call(this, t, fn, opts);
            });
            return this;
        };
        let _rm = function (type, fn, opts) {
            if (!fn)
                return;
            if (this.removeEventListener)
                this.removeEventListener(type, fn, opts || false);
        }, _rms = function (type, fns, opts) {
            if (fns)
                fns.forEach(f => { _rm.call(this, type, f, opts); });
        }, _off = function (type, fn, opts) {
            let bus = this['_bus'];
            if (bus) {
                let oFn = fn ? bus.original(type, fn['euid']) : undefined;
                bus.off(type, oFn);
                _rm.call(this, type, oFn, opts);
            }
            else {
                _rm.call(this, type, fn, opts);
            }
        };
        HP.off = function (type, fn, capture) {
            if (!type) {
                let bus = this['_bus'];
                if (bus) {
                    let types = bus.types();
                    for (let i = 0, len = types.length; i < len; i++) {
                        let ty = types[i];
                        _rms.call(this, ty, bus.original(ty), capture);
                    }
                    bus.off();
                }
            }
            else {
                let types = type.split(' ');
                types.forEach(t => {
                    _off.call(this, t, fn, capture);
                });
            }
            return this;
        };
        HP.find = HP.querySelector;
        HP.findAll = HP.querySelectorAll;
        HP.computedStyle = function (p) {
            return document.defaultView.getComputedStyle(this, p || null);
        };
        let _getV = function () {
            if (this instanceof HTMLTextAreaElement) {
                return this.value || '';
            }
            else if (this instanceof HTMLInputElement) {
                if (this.type == 'checkbox') {
                    let chks = document.getElementsByName(this.name);
                    if (chks.length > 0) {
                        let a = [];
                        [].forEach.call(chks, function (chk) {
                            if (chk.checked)
                                a.push(chk.value);
                        });
                        return a;
                    }
                    return this.checked ? [this.value] : [];
                }
                if (this.type == 'radio') {
                    let rds = document.getElementsByName(this.name);
                    if (rds.length > 0) {
                        for (let i = 0, l = rds.length; i < l; i++) {
                            let rd = rds.item(i);
                            if (rd.checked)
                                return rd.value;
                        }
                        return null;
                    }
                    return this.checked ? this.value : null;
                }
                return this.value || '';
            }
            else if (this instanceof HTMLSelectElement) {
                let opts = this.findAll('option:checked');
                if (opts.length > 0) {
                    let a = [];
                    for (let i = 0, l = opts.length; i < l; i++) {
                        let opt = opts.item(i);
                        if (this.multiple) {
                            if (opt.selected)
                                a.push(opt.value);
                        }
                        else {
                            if (opt.selected)
                                return opt.value;
                        }
                    }
                    return a;
                }
                return [];
            }
            return undefined;
        }, _setV = function (v) {
            if (this instanceof HTMLTextAreaElement) {
                this.value = v || '';
            }
            else if (this instanceof HTMLInputElement) {
                if (this.type == 'checkbox') {
                    let chks = document.getElementsByName(this.name), vs = v;
                    if (chks.length > 0) {
                        [].forEach.call(chks, function (chk) {
                            chk.checked = vs.indexOf(chk.value) > -1;
                        });
                    }
                    else {
                        if (vs.indexOf(this.value) > -1)
                            this.checked = true;
                    }
                    return this;
                }
                if (this.type == 'radio') {
                    let rds = document.getElementsByName(this.name);
                    if (rds.length > 0) {
                        for (let i = 0, l = rds.length; i < l; i++) {
                            let rd = rds.item(i);
                            if (v == rd.value) {
                                rd.checked = true;
                                return this;
                            }
                        }
                    }
                    else {
                        if (v == this.value)
                            this.checked = true;
                    }
                    return this;
                }
                this.value = v;
            }
            else if (this instanceof HTMLSelectElement) {
                let opts = this.findAll('option'), vs = typeof v == 'string' ? [v] : v;
                if (opts.length > 0) {
                    for (let i = 0, l = opts.length; i < l; i++) {
                        let opt = opts.item(i);
                        opt.selected = vs.indexOf(opt.value) > -1;
                    }
                }
            }
            return this;
        };
        HP.val = function (v) {
            return arguments.length == 0 ? _getV.call(this) : _setV.call(this, v);
        };
        let setCssValue = (el, k, v) => {
            let st = el.style;
            if (v === undefined) {
                st.removeProperty(CssTool.hyphenCase(k));
            }
            else if (v != null) {
                let w = v + '';
                st.setProperty(CssTool.hyphenCase(k), CssTool.calcValue(w, el.css(k)), w.endsWith(' !important') ? 'important' : '');
            }
        };
        HP.css = function (name, val) {
            if (arguments.length == 1) {
                if (typeof name == 'string') {
                    let key = CssTool.hyphenCase(name);
                    return this.style.getPropertyValue(key) || this.computedStyle().getPropertyValue(key);
                }
                else {
                    let s = '';
                    Jsons.forEach(name, (v, k) => {
                        if (v != void 0)
                            s += `${CssTool.hyphenCase(k)}:${CssTool.calcValue(v, this.style.getPropertyValue(k))};`;
                    });
                    this.style.cssText += s;
                }
            }
            else {
                setCssValue(this, name, val);
            }
            return this;
        };
        HP.empty = function (s) {
            let chs = this.findAll(s || '*');
            if (chs.length > 0)
                [].forEach.call(chs, function (node) {
                    if (node.nodeType == 1)
                        node.off().remove();
                });
            return this;
        };
        HP.remove = function (s) {
            this.empty.call(this, s);
            if (!s)
                or.call(this.off());
        };
        let DP = Document.prototype;
        DP.on = HP.addEventListener;
        DP.off = HP.removeEventListener;
        let WP = Window.prototype;
        WP.on = HP.addEventListener;
        WP.off = HP.removeEventListener;
    })();
var JS;
(function (JS) {
    let util;
    (function (util) {
        let D;
        if (self['HTMLElement'])
            D = document;
        class Dom {
            static $1(selector) {
                return typeof selector == 'string' ? D.querySelector(selector) : selector;
            }
            static $L(selector) {
                return D.querySelectorAll(selector);
            }
            static rename(node, newTagName) {
                let newNode = D.createElement(newTagName), aNames = node['getAttributeNames']();
                if (aNames)
                    aNames.forEach(name => {
                        newNode.setAttribute(name, node.getAttribute(name));
                    });
                newNode.append.apply(newNode, node.childNodes);
                node.parentNode.replaceChild(newNode, node);
            }
            static applyStyle(code, id) {
                if (!code)
                    return;
                this.$1('head').append(`<style${id ? ' id="' + id + '"' : ''}>${code}</style>`);
            }
            static applyHtml(html, appendTo, ignore) {
                if (!html)
                    return Promise.reject(null);
                return Promises.create(function () {
                    let doc = typeof html == 'string' ? new DOMParser().parseFromString(html, 'text/html') : html, url = doc.URL, el = Dom.$1(appendTo || D.body);
                    el.append.apply(el, doc.body.childNodes);
                    let ignoreCss = ignore === true || (ignore && ignore.css) ? true : false;
                    if (!ignoreCss) {
                        let cssFiles = doc.querySelectorAll('link[rel=stylesheet]');
                        if (cssFiles) {
                            for (let i = 0, len = cssFiles.length; i < len; i++) {
                                let css = cssFiles[i], href = css.getAttribute('href');
                                if (href)
                                    Loader.css(href, false);
                            }
                        }
                    }
                    let ignoreScript = ignore === true || (ignore && ignore.script) ? true : false;
                    if (!ignoreScript) {
                        let scs = doc.getElementsByTagName('script'), syncs = [], back = () => {
                            syncs = null;
                            scs = null;
                            if (typeof html == 'string')
                                doc = null;
                            this.resolve(url);
                        };
                        if (scs && scs.length > 0) {
                            for (let i = 0, len = scs.length; i < len; i++) {
                                let sc = scs[i];
                                sc.src ? (sc.async ? Loader.js(sc.src, true) : syncs.push(Loader.js(sc.src, false))) : eval(sc.text);
                            }
                            Promises.order(syncs).then(() => {
                                back();
                            }).catch((u) => {
                                JSLogger.error('Load inner script fail: ' + u + '\n; parent html:' + url);
                                back();
                            });
                        }
                        else {
                            back();
                        }
                    }
                    else {
                        if (typeof html == 'string')
                            doc = null;
                        this.resolve(url);
                    }
                });
            }
            static loadHTML(url, async, opts) {
                if (!url)
                    return Promise.reject(null);
                return Promises.create(function () {
                    Http.get({
                        responseType: 'html',
                        url: url,
                        cache: false,
                        async: async
                    }).then((res) => {
                        let fn = opts && opts.prehandle;
                        Dom.applyHtml(fn ? fn(res.data) : res.data, opts && opts.appendTo, opts && opts.ignore).then(() => { this.resolve(url); });
                    });
                });
            }
        }
        util.Dom = Dom;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Dom = JS.util.Dom;
const $1 = Dom.$1;
const $L = Dom.$L;
var JS;
(function (JS) {
    let util;
    (function (util) {
        class Objects {
            static readwrite(obj, props, listeners) {
                let ps = typeof props == 'string' ? [props] : props, fs = listeners;
                ps.forEach(p => {
                    Object.defineProperty(obj, p, {
                        configurable: true,
                        enumerable: true,
                        writable: true,
                        get: () => {
                            return obj[p];
                        },
                        set: (val) => {
                            let oVal = obj[p];
                            if (fs && fs.changing)
                                fs.changing.call(obj, p, val, oVal);
                            obj[p] = val;
                            if (fs && fs.changed)
                                fs.changed.call(obj, p, val, oVal);
                        }
                    });
                });
            }
            static readonly(obj, props) {
                let ps = typeof props == 'string' ? [props] : props;
                ps.forEach(p => {
                    Object.defineProperty(obj, p, {
                        configurable: true,
                        enumerable: true,
                        writable: false
                    });
                });
            }
        }
        util.Objects = Objects;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Objects = JS.util.Objects;
var JS;
(function (JS) {
    let util;
    (function (util) {
        var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        class Random {
            static number(range, isInt) {
                let num = 0, min = 0, max = 1;
                if (util.Types.isNumber(range)) {
                    max = range;
                }
                else {
                    min = range.min || 0;
                    max = range.max;
                }
                num = Math.random() * (max - min) + min;
                return isInt ? Number(num).toInt() : num;
            }
            static string(len, chars) {
                return this._str(chars ? chars.split('') : CHARS, len);
            }
            static uuid(len, radix) {
                return this._str(CHARS, len, radix);
            }
            static _str(chars, len, radix) {
                var uuid = [], i;
                radix = radix || chars.length;
                if (len) {
                    for (i = 0; i < len; i++)
                        uuid[i] = chars[0 | Math.random() * radix];
                }
                else {
                    var r;
                    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                    uuid[14] = '4';
                    for (i = 0; i < 36; i++) {
                        if (!uuid[i]) {
                            r = 0 | Math.random() * 16;
                            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                        }
                    }
                }
                return uuid.join('');
            }
        }
        util.Random = Random;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Random = JS.util.Random;
var JS;
(function (JS) {
    let util;
    (function (util) {
        let TimerState;
        (function (TimerState) {
            TimerState[TimerState["STOPPED"] = 0] = "STOPPED";
            TimerState[TimerState["RUNNING"] = 1] = "RUNNING";
            TimerState[TimerState["PAUSED"] = 2] = "PAUSED";
        })(TimerState = util.TimerState || (util.TimerState = {}));
        class Timer {
            constructor(task, cfg) {
                this._bus = new util.EventBus(this);
                this._sta = TimerState.STOPPED;
                this._ts = 0;
                this._et = 0;
                this._pt = 0;
                this._count = 0;
                this._task = task;
                this._config(cfg);
            }
            on(type, fn) {
                this._bus.on(type, fn);
                return this;
            }
            off(type, fn) {
                this._bus.off(type, fn);
                return this;
            }
            count() {
                return this._count;
            }
            _config(cfg) {
                this._cfg = util.Jsons.union({
                    delay: 0,
                    loop: 1,
                    interval: 0,
                    intervalMode: 'BF'
                }, this._cfg, cfg);
                let c = this._cfg;
                if (c.interval != void 0 && c.interval < 0)
                    c.interval = 0;
                let l = c.loop;
                l = l == false || l < 0 ? 0 : (l === true ? Infinity : l);
                c.loop = l;
                return this;
            }
            pause() {
                let m = this;
                if (!m.isRunning())
                    return m;
                m._bus.fire('pausing', [m._count + 1]);
                m._state(TimerState.PAUSED);
                m._pt = System.highResTime();
                m._bus.fire('paused', [m._count + 1]);
                return m;
            }
            _cancelTimer() {
                if (this._timer)
                    window.clearTimeout(this._timer);
                this._timer = null;
            }
            _reset() {
                let m = this;
                m._cancelTimer();
                m._state(TimerState.STOPPED);
                m._count = 0;
                m._ts0 = 0;
                m._ts = 0;
                m._et = 0;
                m._pt = 0;
            }
            stop() {
                this._finish();
                return this;
            }
            _finish() {
                this._reset();
                this._bus.fire('finished');
            }
            getState() {
                return this._sta;
            }
            isRunning() {
                return this.getState() == TimerState.RUNNING;
            }
            _state(s) {
                this._sta = s;
            }
            fps() {
                return this._et == 0 ? 0 : 1000 / this._et;
            }
            maxFPS() {
                let t = this._cfg.interval;
                return t == 0 ? Infinity : 1000 / t;
            }
            looped() {
                return this._count + 1;
            }
            _loopTask(skip) {
                if (!this.isRunning())
                    return;
                let T = this, p = T._cfg.loop;
                if (T._count < p) {
                    let t = 0, opts = T._cfg, t0 = System.highResTime();
                    T._et = t0 - T._ts;
                    if (!skip) {
                        T._bus.fire('looping', [T._count + 1]);
                        T._task.call(T, T._et);
                        T._bus.fire('looped', [T._count + 1]);
                        let t1 = System.highResTime();
                        t = t1 - t0;
                        ++T._count;
                    }
                    T._ts = t0;
                    let d = opts.interval - t, needSkip = opts.intervalMode == 'OF' && d < 0;
                    if (needSkip) {
                        T._loopTask(needSkip);
                    }
                    else {
                        T._timer = setTimeout(() => { T._loopTask(needSkip); }, opts.intervalMode == 'BF' ? opts.interval : d);
                    }
                }
                else {
                    T._finish();
                }
            }
            _start(begin) {
                this._loopTask(!begin);
            }
            start() {
                let T = this;
                if (this.isRunning())
                    return;
                let first = false, wait = T._cfg.delay;
                if (T.getState() == TimerState.PAUSED) {
                    wait = 0;
                    let dt = System.highResTime() - T._pt;
                    T._ts0 += dt;
                    T._ts += dt;
                    T._pt = 0;
                }
                else {
                    first = true;
                    T._reset();
                }
                T._state(TimerState.RUNNING);
                T._timer = setTimeout(() => {
                    if (first) {
                        this._ts0 = System.highResTime();
                        this._ts = this._ts0;
                        T._bus.fire('starting');
                    }
                    T._start(first);
                }, wait);
            }
        }
        util.Timer = Timer;
    })(util = JS.util || (JS.util = {}));
})(JS || (JS = {}));
var Timer = JS.util.Timer;
var TimerState = JS.util.TimerState;
var JS;
(function (JS) {
    let view;
    (function (view) {
        let J = Jsons;
        class FormView extends view.View {
            reset() {
                this.eachWidget((w) => {
                    if (w.reset)
                        w.reset();
                });
                return this;
            }
            clear() {
                this.eachWidget((w) => {
                    if (w.clear)
                        w.clear();
                });
                return this;
            }
            iniValues(values, render) {
                let T = this;
                if (arguments.length == 0) {
                    let vals = {};
                    T.eachWidget((w) => {
                        if (w.iniValue)
                            vals[w.id] = w.iniValue();
                    });
                    return vals;
                }
                else {
                    if (values) {
                        J.forEach(values, (val, id) => {
                            let w = T._widgets[id];
                            if (w && w.iniValue)
                                w.iniValue(val, render);
                        });
                    }
                    else {
                        T.eachWidget((w) => {
                            if (w.iniValue)
                                w.iniValue(null, render);
                        });
                    }
                }
                return T;
            }
            validate(id) {
                let T = this, wgts = T._widgets;
                if (Check.isEmpty(wgts))
                    return true;
                if (!id) {
                    let ok = true;
                    J.forEach(wgts, (wgt) => {
                        if (T._validateWidget(wgt) !== true)
                            ok = false;
                    });
                    return ok;
                }
                return T._validateWidget(T._widgets[id]);
            }
            _validateWidget(wgt) {
                if (!wgt || !wgt.validate)
                    return true;
                return wgt.validate() === true;
            }
            getModel() {
                return this._model;
            }
            values(values) {
                if (arguments.length == 1) {
                    this._model.setData(values);
                    return this;
                }
                else {
                    let d = {};
                    this.eachWidget(w => {
                        if (w.value && w.isEnabled()) {
                            d[w.name()] =
                                w.isCrud && w.isCrud() ? w.crudValue() : w.value();
                        }
                    });
                    return d;
                }
            }
            _render() {
                let T = this;
                if (T._config) {
                    let cfg = T._config;
                    J.forEach(cfg.widgetConfigs, (config, id) => {
                        config['valueModel'] = T._model || T._config.valueModel;
                        let wgt = T._newWidget(id, config, cfg.defaultConfig);
                        if (wgt && wgt.valueModel && !T._model)
                            T._model = wgt.valueModel();
                        T.addWidget(wgt);
                    });
                    if (T._model) {
                        T._model.on('validated', (e, result, data) => {
                            T._fire('validated', [result, data]);
                        });
                        T._model.on('dataupdated', (e, newData, oldData) => {
                            T._fire('dataupdated', [newData, oldData]);
                        });
                    }
                }
            }
        }
        view.FormView = FormView;
    })(view = JS.view || (JS.view = {}));
})(JS || (JS = {}));
var FormView = JS.view.FormView;
var JS;
(function (JS) {
    let view;
    (function (view) {
        class SimpleView extends view.View {
            _render() {
                if (this._config) {
                    let cfg = this._config;
                    Jsons.forEach(cfg.widgetConfigs, (config, id) => {
                        this.addWidget(this._newWidget(id, config, cfg.defaultConfig));
                    });
                }
            }
        }
        view.SimpleView = SimpleView;
    })(view = JS.view || (JS.view = {}));
})(JS || (JS = {}));
var SimpleView = JS.view.SimpleView;
var JS;
(function (JS) {
    let view;
    (function (view) {
        class TemplateView extends view.View {
            constructor() {
                super(...arguments);
                this._model = new ListModel();
            }
            initialize() {
                this._engine = new Templator();
                let me = this;
                this._model.on('dataupdated', function (e, newData, oldData) {
                    me._config.data = this.getData();
                    me.render();
                    me._fire('dataupdated', [newData, oldData]);
                });
            }
            data(data) {
                this._model.setData(data);
            }
            load(api) {
                return this._model.load(api);
            }
            _render() {
                let cfg = this._config;
                if (cfg && cfg.data && cfg.container && cfg.tpl) {
                    let html = this._engine.compile(cfg.tpl)(cfg.data), ctr = $1(cfg.container);
                    ctr.off().innerHTML = html;
                    let wConfigs = cfg.widgetConfigs;
                    if (!Check.isEmpty(wConfigs))
                        ctr.findAll(`[${view.View.WIDGET_ATTRIBUTE}]`).forEach((el) => {
                            let realId = $1(el).attr('id'), prefixId = realId.replace(/(\d)*/g, '');
                            this.addWidget(this._newWidget(realId, wConfigs[prefixId], cfg.defaultConfig));
                        });
                }
            }
        }
        view.TemplateView = TemplateView;
    })(view = JS.view || (JS.view = {}));
})(JS || (JS = {}));
var TemplateView = JS.view.TemplateView;
