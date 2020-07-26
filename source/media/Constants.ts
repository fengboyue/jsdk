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

        export type MediaEvents = 'abort' | 'canplay' | 'canplaythrough' | 'durationchange' | 'emptied' | 'ended' | 'error' | 'loadeddata' | 'loadedmetadata' | 'loadstart' | 'pause' | 'play' | 'playing' | 'progress' | 'ratechange' | 'readystatechange' | 'seeking' | 'seeked' | 'stalled' | 'suspend' | 'timeupdate' | 'volumechange' | 'waiting';

        export type MediaTypes = 'video/ogg'|'video/mp4'|'video/webm'|'audio/ogg'|'audio/mpeg';

    }
}
import MediaEvents = JS.media.MediaEvents;
import MediaTypes = JS.media.MediaTypes;