/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.3.0
 * @author Frank.Feng
 */

module JS {

    export namespace media {

        let W = window, A = W.AudioContext || W['msAudioContext'], AC: AudioContext = new A();

        export interface SoundConfig {
            /** 0~1 float */
            volume?: number;
            /** cyclic play */
            loop?: boolean;
            /**
             * Create new AudioNode to handle complex effects before playing.
             */
            handler?: (this: Sound, ac: AudioContext) => AudioNode,
            on?: {
                /**
                 * @event (this:Sound, e: CustomEvent, request: AjaxRequest)
                 */
                loading?: EventHandler1<Sound, AjaxRequest>
                /**
                 * @event (this:Sound, e: CustomEvent, response: AjaxResponse)
                 */
                load_error?: EventHandler1<Sound, AjaxResponse>
                /**
                 * @event (this:Sound, e: CustomEvent, err: DOMException)
                 */
                decode_error?: EventHandler1<Sound, DOMException>
                /**
                 * @event (this:Sound, e: CustomEvent, ac:AudioContext, ap:AudioParam)
                 */
                playing?: EventHandler2<Sound, AudioContext, AudioParam>;
                /**
                 * @event (this:Sound, e: Event)
                 */
                ended?: EventHandler<Sound>
            }
        }

        /**
         * Audio player.
         */
        export class Sound {
            private _cfg: SoundConfig;
            private _bus = new EventBus(this);
            private _src: string;
            private _buffer: AudioBuffer;
            private _node: AudioBufferSourceNode;
            private _gain: GainNode;
            private _d: boolean = false;

            constructor(cfg?: SoundConfig) {
                let T = this;
                T._cfg = Jsons.union({
                    volume: 1,
                    loop: false
                }, cfg);
                if (T._cfg.on) Jsons.forEach(T._cfg.on, (v, k) => { T._bus.on(k, v) });
            }

            protected _check() {
                if (this._d) throw new StateError('The object was destroyed!')
            }

            public load(url: URLString): Promise<this> {
                let T = this;
                T._check();
                return new Promise<this>((resolve, reject) => {
                    Ajax.get({
                        url: url,
                        type: 'arraybuffer',
                        onSending: req => {
                            if (T._cfg.on && T._cfg.on.loading) T._bus.fire('loading', [req])
                        },
                        onCompleted: res => {
                            AC.decodeAudioData(res.data, (buffer) => {
                                T._src = url;
                                T._buffer = buffer;
                                resolve(T)
                            }, err => {
                                if (T._cfg.on && T._cfg.on.decode_error) T._bus.fire('decode_error', [err]);
                                reject(err)
                            });
                        },
                        onError: res => {
                            if (T._cfg.on && T._cfg.on.load_error) T._bus.fire('load_error', [res]);
                            reject(res)
                        }
                    })
                })
            }

            public on(type: string, fn: EventHandler, once?: boolean) {
                this._bus.on(type, fn, once);
                return this
            }
            public off(type: string, fn: EventHandler) {
                this._bus.off(type, fn);
                return this
            }

            public loop(): boolean
            public loop(is: boolean): this
            public loop(is?: boolean): any {
                let T = this;
                if (is == void 0) return T._cfg.loop;
                T._cfg.loop = is;
                return T
            }

            public src() {
                return this._src
            }

            /**
             * It is used to schedule playback of the audio data contained in the buffer, or to begin playback immediately.
             * 
             * @throws TypeError 
             * A negative value was specified for one or more of the three time parameters. 
             * Please don't attempt to tamper with the laws of temporal physics.
             * 
             * @param delay The time, in seconds, at which the sound should begin to play, in the same time coordinate system used by the AudioContext. If when is less than (AudioContext.currentTime, or if it's 0, the sound begins to play at once. The default value is 0.
             * @param offset An offset, specified as the number of seconds in the same time coordinate system as the AudioContext, to the time within the audio buffer that playback should begin. For example, to start playback halfway through a 10-second audio clip, offset should be 5. The default value, 0, will begin playback at the beginning of the audio buffer, and offsets past the end of the audio which will be played (based on the audio buffer's duration and/or the loopEnd property) are silently clamped to the maximum value allowed. The computation of the offset into the sound is performed using the sound buffer's natural sample rate, rather than the current playback rate, so even if the sound is playing at twice its normal speed, the midway point through a 10-second audio buffer is still 5.
             * @param duration The duration of the sound to be played, specified in seconds. If this parameter isn't specified, the sound plays until it reaches its natural conclusion or is stopped using the stop() method. Using this parameter is functionally identical to calling start(when, offset) and then calling stop(when+duration).
             */
            public play(delay?: number, offset?: number, duration?: number) {
                let T = this;
                T._check()
                T.stop();
                // Create a gain node.
                T._gain = AC.createGain();
                T._gain.gain.value = T._cfg.volume;

                T._node = AC.createBufferSource();
                T._node.buffer = T._buffer;
                let c = T._cfg;
                T._node.loop = c.loop;
                if (c.on && c.on.ended) T._node.onended = e => {
                    T._bus.fire('ended')
                };
                // Connect the source to the gain node.
                T._node.connect(T._gain);

                if (c.handler) {
                    let node: AudioNode = c.handler.call(T, AC);
                    T._gain.connect(node);
                    node.connect(AC.destination)
                } else {
                    // Connect the gain node to the destination.
                    T._gain.connect(AC.destination);
                }

                if (c.on && c.on.playing) T._bus.fire('playing', [AC, T._gain.gain]);
                T._node.start(delay || 0, offset || 0, duration);
            }

            public stop() {
                this._check();
                if (this._node) this._node.stop();
            }

            /**
             * Sets volume of current sound.
             * @param n 0~1
             */
            public volume(n: number) {
                let T = this;
                T._check();
                T._cfg.volume = n;
                if (T._gain) T._gain.gain.value = n;
            }

            public destroy() {
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

    }
}
import SoundConfig = JS.media.SoundConfig;
import Sound = JS.media.Sound;

