//# sourceURL=../dist/jsan.js
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
