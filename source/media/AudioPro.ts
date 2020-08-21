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

        export interface AudioProInit {
            /** Default volume: 0~1 float */
            volume?: number,
            /** Default value for cyclic play */
            loop?: boolean,

            /**
             * Create new AudioNode to handle complex effects before playing.
             */
            handler?: (this: AudioPro, ac: AudioContext) => AudioNode,

            /**
             * Be called before an audio play.
             */
            playing?: EventHandler<AudioPro>;
            /**
             * Be called when an audio finished to play.
             */
            played?: EventHandler<AudioPro>
        }

        /**
         * Audio Processor.
         */
        export class AudioPro {
            private _init: AudioProInit;
            private _node: AudioBufferSourceNode;
            private _gain: GainNode;

            static play(id: string, cache: AudioCache){
                new AudioPro().play(id, cache)
            }

            constructor(init?: AudioProInit) {
                this._init = Jsons.union({
                    volume: 1,
                    loop: false
                }, init);
            }

            loop(): boolean
            loop(is: boolean): this
            loop(is?: boolean): any {
                let m = this;
                if (is == void 0) return m._init.loop;
                m._init.loop = is;
                m._node.loop = is;
                return m
            }

            _play(a: AudioBuffer) {
                let m = this;
                m.stop();

                // Create a gain node.
                m._gain = AC.createGain();
                m._gain.gain.value = m._init.volume;

                m._node = AC.createBufferSource();
                m._node.buffer = a;
                let c = m._init;
                m._node.loop = c.loop;
                if (c.played) m._node.onended = e => {
                    m._dispose();
                    c.played.call(m)
                };
                // Connect the source to the gain node.
                m._node.connect(m._gain);

                if (c.handler) {
                    let node: AudioNode = c.handler.call(m, AC);
                    m._gain.connect(node);
                    node.connect(AC.destination)
                } else {
                    // Connect the gain node to the destination.
                    m._gain.connect(AC.destination);
                }

                if (c.playing) c.playing.call(m);
                m._node.start();
            }

            play(a: ArrayBuffer) 
            play(id: string, cache: AudioCache)
            play(a: string|ArrayBuffer, cache?: AudioCache){
                if(typeof a == 'string') {
                    cache.get(a).then(buf => {
                        this.play(buf)
                    })
                }else{
                    if (a) AC.decodeAudioData(<ArrayBuffer>a, (buffer: AudioBuffer) => {
                        this._play(buffer)
                    }, err => {
                        JSLogger.error('Decode audio buffer fail!')
                    })
                }
            }

            stop() {
                if (this._node) this._node.stop();
            }

            /**
             * Sets volume of current sound.
             * @param n 0~1
             */
            volume(n: number) {
                let m = this;
                m._init.volume = n;
                if (m._gain) m._gain.gain.value = n;
            }

            _dispose() {
                let m = this;
                m._gain.disconnect();
                m._node.disconnect();
            }

        }

    }
}
import AudioProInit = JS.media.AudioProInit;
import AudioPro = JS.media.AudioPro;