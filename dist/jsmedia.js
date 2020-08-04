//# sourceURL=jsmedia.js
/**
* JSDK 2.4.0 
* https://github.com/fengboyue/jsdk/
* (c) 2007-2020 Frank.Feng<boyue.feng@foxmail.com>
* MIT license
*/
var JS;
(function (JS) {
    let media;
    (function (media) {
        let W = window, A = W.AudioContext || W['msAudioContext'], AC = new A();
        class Sound {
            constructor(cfg) {
                this._bus = new EventBus(this);
                this._d = false;
                let T = this;
                T._cfg = Jsons.union({
                    volume: 1,
                    loop: false
                }, cfg);
                if (T._cfg.on)
                    Jsons.forEach(T._cfg.on, (v, k) => { T._bus.on(k, v); });
            }
            _check() {
                if (this._d)
                    throw new StateError('The object was destroyed!');
            }
            load(url) {
                let T = this;
                T._check();
                return new Promise((resolve, reject) => {
                    Ajax.get({
                        url: url,
                        type: 'arraybuffer',
                        onSending: req => {
                            if (T._cfg.on && T._cfg.on.loading)
                                T._bus.fire('loading', [req]);
                        },
                        onCompleted: res => {
                            AC.decodeAudioData(res.data, (buffer) => {
                                T._src = url;
                                T._buffer = buffer;
                                resolve(T);
                            }, err => {
                                if (T._cfg.on && T._cfg.on.decode_error)
                                    T._bus.fire('decode_error', [err]);
                                reject(err);
                            });
                        },
                        onError: res => {
                            if (T._cfg.on && T._cfg.on.load_error)
                                T._bus.fire('load_error', [res]);
                            reject(res);
                        }
                    });
                });
            }
            on(type, fn, once) {
                this._bus.on(type, fn, once);
                return this;
            }
            off(type, fn) {
                this._bus.off(type, fn);
                return this;
            }
            loop(is) {
                let T = this;
                if (is == void 0)
                    return T._cfg.loop;
                T._cfg.loop = is;
                return T;
            }
            src() {
                return this._src;
            }
            play(delay, offset, duration) {
                let T = this;
                T._check();
                T.stop();
                T._gain = AC.createGain();
                T._gain.gain.value = T._cfg.volume;
                T._node = AC.createBufferSource();
                T._node.buffer = T._buffer;
                let c = T._cfg;
                T._node.loop = c.loop;
                if (c.on && c.on.ended)
                    T._node.onended = e => {
                        T._bus.fire('ended');
                    };
                T._node.connect(T._gain);
                if (c.handler) {
                    let node = c.handler.call(T, AC);
                    T._gain.connect(node);
                    node.connect(AC.destination);
                }
                else {
                    T._gain.connect(AC.destination);
                }
                if (c.on && c.on.playing)
                    T._bus.fire('playing', [AC, T._gain.gain]);
                T._node.start(delay || 0, offset || 0, duration);
            }
            stop() {
                this._check();
                if (this._node)
                    this._node.stop();
            }
            volume(n) {
                let T = this;
                T._check();
                T._cfg.volume = n;
                if (T._gain)
                    T._gain.gain.value = n;
            }
            destroy() {
                let T = this;
                T._d = true;
                T._cfg = null;
                T._src = null;
                T._buffer = null;
                T._gain.disconnect();
                T._node.disconnect();
                T._bus.destroy();
            }
        }
        media.Sound = Sound;
    })(media = JS.media || (JS.media = {}));
})(JS || (JS = {}));
var Sound = JS.media.Sound;
var JS;
(function (JS) {
    let media;
    (function (media) {
        class Video {
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
        media.Video = Video;
    })(media = JS.media || (JS.media = {}));
})(JS || (JS = {}));
var Video = JS.media.Video;