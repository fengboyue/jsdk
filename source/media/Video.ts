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

        export type VideoConfig = {
            id?: string,
            appendTo?: HTMLElement | string;
            controls?: boolean;
            loop?: boolean;
            muted?: boolean;
            poster?: URLString;
            preload?: 'auto' | 'meta' | 'none';
            width?: number;//px
            height?: number;//px
            src?: URLString;
            on?: JsonObject<(this: HTMLMediaElement) => void>
        }

        /**
         * Video player.
         */
        export class Video {
            protected _c: VideoConfig;
            protected _el: HTMLMediaElement;
            protected _src: URLString;

            constructor(c: VideoConfig) {
                let T = this;
                T._c = Jsons.union({
                    controls:true,
                    autoplay:false,
                    loop: false,
                    muted: false, 
                    preload: 'auto'
                }, c);
                T._src = T._c.src;

                let el = <HTMLMediaElement>$1('#'+T._c.id);
                if (el) { 
                    T._el = el;
                    Jsons.forEach(T._c, (v,k)=>{
                        if(k!='id' && k!='ctor' && k!='on') T._el.attr(k, <any>v)
                    })
                } else {
                    let ctr = (Types.isString(T._c.appendTo) ? $1(<string>T._c.appendTo) : <HTMLElement>T._c.appendTo) || document.body,
                        id = T._c.id || Random.uuid(4);
                    
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
                    this._el = <HTMLMediaElement>$1(`#${id}`)
                }
                if (T._c.on) Jsons.forEach(T._c.on, (v, k) => { this.on(<MediaEvents>k, v) })
            }

            /**
             * Gets/Sets the address or URL of the current media resource.
             */
            public src(): URLString
            public src(src: URLString): this
            public src(src?: URLString): any {
                let T = this;
                if (!src) return T._src;

                T._src = src;
                T._el.src = src;
                T._el.load();
                return T
            }
            /**
             * Gets or sets the current playback position, in seconds.
             */
            public currentTime(): number
            public currentTime(t: number): this
            public currentTime(t?: number): any {
                return this._gs('currentTime', t)
            }

            /**
             * Gets or sets the default playback rate when the user is not using fast forward or reverse for a video resource.
             */
            public defaultPlaybackRate(): number
            public defaultPlaybackRate(r: number): this
            public defaultPlaybackRate(r?: number): any {
                return this._gs('defaultPlaybackRate', r)
            }

            /**
             * Gets or sets the current rate of speed for the media resource to play. This speed is expressed as a multiple of the normal speed of the media resource.
             */
            public playbackRate(): number
            public playbackRate(r: number): this
            public playbackRate(r?: number): any {
                return this._gs('playbackRate', r)
            }

            /**
             * Gets or sets the default muted when the user is not muted on a video resource.
             */
            public defaultMuted(): boolean
            public defaultMuted(is: boolean): this
            public defaultMuted(is?: boolean): any {
                return this._gs('defaultMuted', is)
            }

            /**
             * Gets or sets a flag that indicates whether the audio track on video media is muted.
             */
            public muted(): boolean
            public muted(is: boolean): this
            public muted(is?: boolean): any {
                return this._gs('muted', is)
            }

            /**
             * Returns the duration in seconds of the current media resource. A NaN value is returned if duration is not available, or Infinity if the media resource is streaming.
             */
            public duration(): number {
                return this._el.duration
            }

            /**
             * Loads and starts playback of a media resource.
             * 
             * Note: Uncaught (in promise) DOMException: play() failed because the user didn’t interact with the document first.
             * Autoplay Policy Changes:
                1. Muted autoplay is always allowed.
                2. Autoplay with sound is allowed if:
                User has interacted with the domain (click, tap, etc.).
                On desktop, the user’s Media Engagement Index threshold has been crossed,
                meaning the user has previously play video with sound.
                On mobile, the user has added the site to his or her home screen.
                3. Top frames can delegate autoplay permission to their iframes to
                allow autoplay with sound.
             */
            public play() {
                return this._el.play()
            }

            /**
             * Gets a flag that specifies whether playback is paused.
             */
            public paused(): boolean {
                return this._el.paused
            }
            /**
             * Gets information about whether the playback has ended or not.
             */
            public ended(): boolean {
                return this._el.ended
            }
            /**
             * Returns an object representing the current error state of the audio or video element.
             */
            public error(): MediaError | null {
                return this._el.error
            }
            /**
             * Gets or sets a flag to specify whether playback should restart after it completes.
             */
            public loop(): boolean
            public loop(is: boolean): this
            public loop(is?: boolean): any {
                return this._gs('loop', is)
            }

            /**
             * Gets TimeRanges for the current media resource that has been played.
             */
            public played(): TimeRanges {
                return this._el.played
            }

            /**
             * Gets or sets the volume level for audio portions of the media element.
             */
            public volume(): number
            public volume(v: number): this
            public volume(v?: number): any {
                return this._gs('volume', v)
            }

            /**
             * Pauses the current playback and sets paused to TRUE. This can be used to test whether the media is playing or paused. You can also use the pause or play events to tell whether the media is playing or not.
             */
            public pause() {
                this._el.pause();
                return this
            }

            public preload(): 'auto' | 'meta' | 'none'
            public preload(s: 'auto' | 'meta' | 'none'): this
            public preload(s?: 'auto' | 'meta' | 'none'): any {
                return this._gs('preload', s)
            }

            public crossOrigin(): string | null
            public crossOrigin(s: string): this
            public crossOrigin(s?: string): any {
                return this._gs('crossOrigin', s)
            }

            private _gs(p: string, v: any) {
                if (v == void 0) return this._el[p];
                this._el[p] = v;
                return this
            }

            /**
             * Returns a string that specifies whether the client can play a given media resource type.
             */
            public canPlayType(type: string): CanPlayTypeResult {
                return this._el.canPlayType(type)
            }

            public on(e: MediaEvents, fn: (this: HTMLMediaElement) => void) {
                this._el['on' + e] = fn
            }

        }

    }
}
import VideoConfig = JS.media.VideoConfig;
import Video = JS.media.Video;