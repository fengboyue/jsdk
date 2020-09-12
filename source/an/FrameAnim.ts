/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.7.0
 * @update New designed class for image frames animation
 * 
 * @version 2.1.0
 * @author Frank.Feng
 */
/// <reference path="../util/Images.ts"/>

module JS {

    export namespace an {

        export class FrameAnimInit extends AnimInit {
            frames: ImageFrameSet;
            onUpdateImage?: (el: HTMLElement | object, fr: ImageFrame) => void;
        }

        export class FrameAnim extends Anim {
            protected _cfg: FrameAnimInit;
            private _frames: ImageFrame[] = [];

            constructor(cfg: FrameAnimInit) {
                super(<FrameAnimInit>Jsons.union(new FrameAnimInit(), cfg));

                this._frames = Images.parseFrames(this._cfg.frames)
            }

            private _updateImage(el: HTMLElement, fr: ImageFrame) {
                let json = {
                    backgroundImage: `url("${fr.src}")`,
                    backgroundPosition: `-${fr.x}px -${fr.y}px`,
                    width: fr.w != void 0 ? (fr.w + 'px') : null,
                    height: fr.h != void 0 ? (fr.h + 'px') : null
                };
                el.css(json)
            }

            //frame index
            private _fi = -1;
            protected _reset() {
                super._reset();
                this._fi = -1;
            }
            protected _resetTargets() {
                let fn = this._cfg.onUpdateImage || this._updateImage, i = this._cfg.direction == 'backward' ? this._frames.length - 1 : 0;
                this._targets.forEach(ta => {
                    fn(ta, this._frames[i]);
                })
            }

            private _updateFrame(dt: number) {
                let m = this, c = m._cfg, size = m._frames.length, fn = c.onUpdateImage || m._updateImage;
                this._targets.forEach(ta => {
                    fn(ta, m._frames[m._fi]);
                    m._dir == 'forward' ? m._fi++ : m._fi--;
                })
            }

            private _lt = 0;
            protected _setupTimer() {
                super._setupTimer();
                let m = this, c = m._cfg, r = m._timer, size = m._frames.length;
                r.on(<TimerEvents>'looping', (e, loop: number)=> {
                    if ((loop - 1) % size == 0) {
                        if (loop > 1 && c.direction == 'alternate') m._dir = m._dir == 'backward' ? 'forward' : 'backward';
                        m._fi = m._dir == 'backward' ? size - 1 : 0;
                        m._lt = e.timeStamp;
                        m._bus.fire('looping', [(loop - 1) / size + 1])
                    }
                    m._bus.fire('updating', [e.timeStamp-m._lt, c.duration])
                });
                r.on(<TimerEvents>'looped', (e, loop: number) => {
                    m._bus.fire('updated', [e.timeStamp-m._lt, c.duration])
                    if (loop % size == 0) {
                        m._loop = loop / size;
                        m._bus.fire('looped', [m._loop])
                    }
                });
            }

            play(): Promise<boolean> {
                let m = this, c = m._cfg, l = c.loop,
                    maxLoop = l == false || l < 0 ? 0 : (l === true ? Infinity : l),
                    framesSize = m._frames.length;

                return Promises.create<boolean>(function () {
                    if (m.isRunning() || m._frames.length == 0) this.resolve(false);

                    m._loop = 0;
                    if (!m._timer) {
                        m._timer = new Timer((t) => {
                            m._updateFrame(t)
                        }, {
                            intervalMode: 'BF',
                            delay: c.delay || 0,
                            loop: maxLoop * framesSize,
                            interval: (c.duration + c.endDelay) / framesSize
                        });
                        m._setupTimer();
                    }
                    m._timer.on(<TimerEvents>'finished', () => {
                        this.resolve(true);
                    });
                    m._timer.start()
                })
            }

        }
    }
}

import FrameAnimInit = JS.an.FrameAnimInit;
import FrameAnim = JS.an.FrameAnim;