/**
* JSDK 2.0.0 
* https://github.com/fengboyue/jsdk/
* (c) 2007-2020 Frank.Feng<boyue.feng@foxmail.com>
* MIT license
*/
/// <reference path="../libs/reflect/2.0.0/reflect.d.ts" />
/// <reference path="../libs/ua-parser/0.7.20/ua-parser.d.ts" />
/// <reference path="../libs/jquery/3.2.1/jquery.d.ts" />
/// <reference path="../libs/bootstrap/4.0.0/bootstrap.d.ts" />
/// <reference path="../libs/datepicker/1.9.0/datepicker.d.ts" />
/// <reference path="../libs/daterangepicker/3.0.5/daterangepicker.d.ts" />
/// <reference path="../libs/blockui/2.70.0/blockui.d.ts" />
/// <reference path="../libs/sweetalert2/7.26.9/sweetalert2.d.ts" />
/// <reference path="../libs/ion-rangeslider/2.3.0/ion.rangeSlider.d.ts" />
/// <reference path="../libs/select2/4.0.11/select2.d.ts" />
/// <reference path="../libs/slidereveal/1.1.2/jquery.slidereveal.d.ts" />
/// <reference path="../libs/summernote/0.8.12/summernote.d.ts" />
/// <reference path="../libs/toastr/2.1.4/toastr.d.ts" />
/// <reference path="../libs/webuploader/0.1.5/webuploader.d.ts" />
/// <reference path="../libs/clipboard/2.0.0/clipboard.d.ts" />
/// <reference path="../libs/handlebars/4.1.2/handlebars.d.ts" />
declare module JS {
    namespace an {
        enum AnimState {
            STOPPED = 0,
            RUNNING = 1,
            PAUSED = 2
        }
        class AnimConfig {
            autoReverse?: boolean;
            autoReset?: boolean;
            duration?: number;
            loop?: boolean | number;
            delay?: number;
            direction?: 'forward' | 'backward';
            easing?: EasingFunction;
            onStarting?: EventHandler<Anim>;
            onFinished?: EventHandler<Anim>;
        }
        abstract class Anim {
            protected _cfg: AnimConfig;
            protected _timer: AnimTimer;
            protected _dir: 'forward' | 'backward';
            protected _loop: number;
            constructor(cfg: AnimConfig);
            protected _init(): void;
            protected _convertFrame(f: KeyFrame): number | JsonObject<number> | JsonObject<JsonObject<number>>;
            config(): AnimConfig;
            config(cfg: AnimConfig): this;
            direction(): 'forward' | 'backward';
            direction(d: 'forward' | 'backward'): this;
            getState(): AnimState;
            getLooped(): number;
            abstract play(t?: number): this;
            protected _reset(): void;
            pause(): this;
            stop(): this;
        }
    }
}
import AnimState = JS.an.AnimState;
import AnimConfig = JS.an.AnimConfig;
import Anim = JS.an.Anim;
declare module JS {
    namespace an {
        type AnimTimerEvents = TimerEvents | 'looping' | 'looped';
        type AnimTimerConfig = {
            delay?: number;
            duration?: number;
            loop?: boolean | number;
        };
        class AnimTimer extends Timer {
            protected _cfg: AnimTimerConfig;
            constructor(tick: TimerTask, cfg?: AnimTimerConfig);
            protected _loop(begin?: boolean): void;
            protected _cycle(): void;
            protected _cancelTimer(): void;
        }
    }
}
import AnimTimer = JS.an.AnimTimer;
declare module JS {
    namespace an {
        type EasingFunction = (t: number, b: number, c: number, d: number, ...args: any[]) => number;
        class Easings {
            static LINEAR: EasingFunction;
            static QUAD_IN: EasingFunction;
            static QUAD_OUT: EasingFunction;
            static QUAD_IN_OUT: EasingFunction;
            static CUBIC_IN: EasingFunction;
            static CUBIC_OUT: EasingFunction;
            static CUBIC_IN_OUT: EasingFunction;
            static QUART_IN: EasingFunction;
            static QUART_OUT: EasingFunction;
            static QUART_IN_OUT: EasingFunction;
            static QUINT_IN: EasingFunction;
            static QUINT_OUT: EasingFunction;
            static QUINT_IN_OUT: EasingFunction;
            static SINE_IN: EasingFunction;
            static SINE_OUT: EasingFunction;
            static SINE_IN_OUT: EasingFunction;
            static EXPO_IN: EasingFunction;
            static EXPO_OUT: EasingFunction;
            static EXPO_IN_OUT: EasingFunction;
            static CIRC_IN: EasingFunction;
            static CIRC_OUT: EasingFunction;
            static CIRC_IN_OUT: EasingFunction;
            static ELASTIC_IN: EasingFunction;
            static ELASTIC_OUT: EasingFunction;
            static ELASTIC_IN_OUT: EasingFunction;
            static BACK_IN: EasingFunction;
            static BACK_OUT: EasingFunction;
            static BACK_IN_OUT: EasingFunction;
            static BOUNCE_IN: EasingFunction;
            static BOUNCE_OUT: EasingFunction;
            static BOUNCE_IN_OUT: EasingFunction;
        }
    }
}
import EasingFunction = JS.an.EasingFunction;
import Easings = JS.an.Easings;
declare module JS {
    namespace an {
        class ElementAnimConfig extends AnimConfig {
            el: HTMLElement | string;
            frames: KeyFrames;
        }
        abstract class ElementAnim extends Anim {
            protected _cfg: ElementAnimConfig;
            protected _el: HTMLElement;
            protected _frame: KeyFrame;
            private _from;
            private _to;
            private _frames;
            constructor(cfg: ElementAnimConfig);
            protected abstract _onUpdate(newFrame: KeyFrame): void;
            private _parseFrames;
            config<T extends ElementAnimConfig>(): T;
            config<T extends ElementAnimConfig>(cfg: T): this;
            private _num;
            protected _newFrame(from: KeyFrame, to: KeyFrame, t: number, d: number, e: EasingFunction): number | JsonObject<number> | JsonObject<JsonObject<number>>;
            protected _newVal(t: number, d: number, from: number, to: number, e: EasingFunction, base: number): number;
            private _calc;
            private _reset4loop;
            protected _reset(): void;
            private _resetFrame;
            protected _resetInitial(): void;
            play(): this;
            stop(): this;
        }
    }
}
import ElementAnimConfig = JS.an.ElementAnimConfig;
import ElementAnim = JS.an.ElementAnim;
declare module JS {
    namespace an {
        type FadeKeyFrame = number;
        type FadeKeyFrames = JsonObject<FadeKeyFrame>;
        class FadeAnimConfig extends ElementAnimConfig {
            frames: FadeKeyFrames;
        }
        class FadeAnim extends ElementAnim {
            private _o;
            constructor(cfg: FadeAnimConfig);
            config<T extends ElementAnimConfig>(): T;
            config<T extends ElementAnimConfig>(cfg: T): this;
            protected _onUpdate(f: FadeKeyFrame): void;
            protected _resetInitial(): void;
        }
    }
}
import FadeKeyFrame = JS.an.FadeKeyFrame;
import FadeKeyFrames = JS.an.FadeKeyFrames;
import FadeAnimConfig = JS.an.FadeAnimConfig;
import FadeAnim = JS.an.FadeAnim;
declare module JS {
    namespace an {
        type GradientKeyFrame = {
            color?: HEX;
            backgroundColor?: HEX;
            borderColor?: HEX;
            borderTopColor?: HEX;
            borderRightColor?: HEX;
            borderBottomColor?: HEX;
            borderLeftColor?: HEX;
        };
        type GradientKeyFrames = JsonObject<GradientKeyFrame>;
        class GradientAnimConfig extends ElementAnimConfig {
            frames: GradientKeyFrames;
        }
        class GradientAnim extends ElementAnim {
            private _cls;
            constructor(cfg: GradientAnimConfig);
            config<T extends ElementAnimConfig>(): T;
            config<T extends ElementAnimConfig>(cfg: T): this;
            private _newColor;
            protected _convertFrame(f: GradientKeyFrame): JsonObject<RGBA>;
            protected _newFrame(from: JsonObject<RGBA>, to: JsonObject<RGBA>, t: number, d: number, e: EasingFunction): JsonObject<RGBA>;
            protected _onUpdate(j: JsonObject<RGBA>): void;
            protected _resetInitial(): void;
        }
    }
}
import GradientKeyFrame = JS.an.GradientKeyFrame;
import GradientKeyFrames = JS.an.GradientKeyFrames;
import GradientAnimConfig = JS.an.GradientAnimConfig;
import GradientAnim = JS.an.GradientAnim;
declare module JS {
    namespace an {
        type KeyFrame = number | JsonObject<number> | JsonObject<JsonObject<number>> | any;
        type KeyFrames = JsonObject<KeyFrame>;
    }
}
import KeyFrame = JS.an.KeyFrame;
import KeyFrames = JS.an.KeyFrames;
declare module JS {
    namespace an {
        type MoveKeyFrame = {
            x?: number;
            y?: number;
        };
        type MoveKeyFrames = JsonObject<MoveKeyFrame>;
        class MoveAnimConfig extends ElementAnimConfig {
            frames: MoveKeyFrames;
        }
        class MoveAnim extends ElementAnim {
            private _xy;
            constructor(cfg: MoveAnimConfig);
            config<T extends ElementAnimConfig>(): T;
            config<T extends ElementAnimConfig>(cfg: T): this;
            protected _onUpdate(f: MoveKeyFrame): void;
            protected _resetInitial(): void;
        }
    }
}
import MoveKeyFrame = JS.an.MoveKeyFrame;
import MoveKeyFrames = JS.an.MoveKeyFrames;
import MoveAnimConfig = JS.an.MoveAnimConfig;
import MoveAnim = JS.an.MoveAnim;
declare module JS {
    namespace an {
        class ParallelAnimConfig extends AnimConfig {
            anims: Anim[];
            el?: HTMLElement | string;
        }
        class ParallelAnim extends Anim {
            protected _cfg: ParallelAnimConfig;
            private _plans;
            private _sta;
            constructor(cfg: ParallelAnimConfig);
            getState(): AnimState;
            config(): ParallelAnimConfig;
            config(cfg: ParallelAnimConfig): this;
            play(): this;
            pause(): this;
            stop(): this;
        }
    }
}
import ParallelAnimConfig = JS.an.ParallelAnimConfig;
import ParallelAnim = JS.an.ParallelAnim;
declare module JS {
    namespace an {
        type RotateKeyFrame = number | {
            aX?: number;
            aY?: number;
            aZ?: number;
        };
        type RotateKeyFrames = JsonObject<RotateKeyFrame>;
        class RotateAnimConfig extends ElementAnimConfig {
            frames: RotateKeyFrames;
        }
        class RotateAnim extends ElementAnim {
            constructor(cfg: RotateAnimConfig);
            protected _newVal(t: number, d: number, from: number, to: number, e: EasingFunction, base: number): number;
            protected _onUpdate(v: RotateKeyFrame): void;
            protected _resetInitial(): void;
        }
    }
}
import RotateKeyFrame = JS.an.RotateKeyFrame;
import RotateKeyFrames = JS.an.RotateKeyFrames;
import RotateAnimConfig = JS.an.RotateAnimConfig;
import RotateAnim = JS.an.RotateAnim;
declare module JS {
    namespace an {
        type ScaleKeyFrame = number | {
            sX?: number;
            sY?: number;
            sZ?: number;
        };
        type ScaleKeyFrames = JsonObject<ScaleKeyFrame>;
        class ScaleAnimConfig extends ElementAnimConfig {
            frames: ScaleKeyFrames;
        }
        class ScaleAnim extends ElementAnim {
            constructor(cfg: ScaleAnimConfig);
            protected _resetInitial(): void;
            protected _onUpdate(v: ScaleKeyFrame): void;
        }
    }
}
import ScaleKeyFrame = JS.an.ScaleKeyFrame;
import ScaleKeyFrames = JS.an.ScaleKeyFrames;
import ScaleAnimConfig = JS.an.ScaleAnimConfig;
import ScaleAnim = JS.an.ScaleAnim;
declare module JS {
    namespace an {
        class SequentialAnimConfig extends AnimConfig {
            anims: Anim[];
            el?: HTMLElement | string;
        }
        class SequentialAnim extends Anim {
            protected _cfg: SequentialAnimConfig;
            private _i;
            private _sta;
            constructor(cfg: SequentialAnimConfig);
            config(): SequentialAnimConfig;
            config(cfg: SequentialAnimConfig): this;
            play(): this;
            pause(): this;
            stop(): this;
        }
    }
}
import SequentialAnimConfig = JS.an.SequentialAnimConfig;
import SequentialAnim = JS.an.SequentialAnim;
declare module JS {
    namespace an {
        type SkewKeyFrame = {
            aX?: number;
            aY?: number;
        };
        type SkewKeyFrames = JsonObject<SkewKeyFrame>;
        class SkewAnimConfig extends ElementAnimConfig {
            frames: SkewKeyFrames;
            firstMode?: 'both' | 'x' | 'y';
        }
        class SkewAnim extends ElementAnim {
            constructor(cfg: SkewAnimConfig);
            protected _init(): void;
            protected _resetInitial(): void;
            protected _onUpdate(f: SkewKeyFrame): void;
        }
    }
}
import SkewKeyFrame = JS.an.SkewKeyFrame;
import SkewKeyFrames = JS.an.SkewKeyFrames;
import SkewAnimConfig = JS.an.SkewAnimConfig;
import SkewAnim = JS.an.SkewAnim;
declare module JS {
    namespace an {
        type TranslateKeyFrame = {
            oX?: number;
            oY?: number;
            oZ?: number;
        };
        type TranslateKeyFrames = JsonObject<TranslateKeyFrame>;
        class TranslateAnimConfig extends ElementAnimConfig {
            frames: TranslateKeyFrames;
        }
        class TranslateAnim extends ElementAnim {
            constructor(cfg: TranslateAnimConfig);
            protected _resetInitial(): void;
            protected _onUpdate(f: TranslateKeyFrame): void;
        }
    }
}
import TranslateKeyFrame = JS.an.TranslateKeyFrame;
import TranslateKeyFrames = JS.an.TranslateKeyFrames;
import TranslateAnimConfig = JS.an.TranslateAnimConfig;
import TranslateAnim = JS.an.TranslateAnim;
declare module JS {
    namespace model {
        interface Api<T> extends AjaxRequest {
            dataKlass?: Klass<T>;
        }
    }
}
import Api = JS.model.Api;
interface Array<T> {
    add(a: T | T[], from?: number): this;
    remove(index: number): this;
    remove(find: (item: T, i: number, array: Array<T>) => boolean): boolean;
}
declare module JS {
    namespace util {
        class Arrays {
            static newArray(a: ArrayLike<any>, from?: number): any;
            static toArray<T>(a: T | T[]): T[];
            static equal<T, K>(a1: Array<T>, a2: Array<K>, equal?: (item1: T, item2: K, index: number) => boolean): boolean;
            static equalToString(a1: Array<any>, a2: Array<any>): boolean;
            static same(a1: Array<any>, a2: Array<any>): boolean;
            static slice(args: ArrayLike<any>, fromIndex?: number, endIndex?: number): Array<any>;
        }
    }
}
import Arrays = JS.util.Arrays;
interface Promise<T> {
    always(fn: (this: this, v: any, success: boolean) => any | Promise<any>): Promise<T>;
}
declare module JS {
    namespace util {
        type PromiseContext<T> = {
            resolve: (value: T) => void;
            reject: (value: T) => void;
        };
        type PromisePlan<T> = (value?: any) => Promise<T>;
        type PromisePlans<T> = Array<PromisePlan<T>>;
        class Promises {
            static create<T>(fn: (this: PromiseContext<T>, ...args: any[]) => void, ...args: any[]): Promise<T>;
            static createPlan<T>(fn: (this: PromiseContext<T>, ...args: any[]) => void): PromisePlan<T>;
            static newPlan<T>(p: PromisePlan<T>, args?: any[], ctx?: any): PromisePlan<T>;
            static resolvePlan<T>(v: any): PromisePlan<T>;
            static rejectPlan<T>(v: any): PromisePlan<T>;
            static order<T>(plans: PromisePlans<T>): Promise<void>;
            static all<T>(plans: PromisePlans<T>): Promise<any[]>;
            static race<T>(plans: PromisePlans<T>): Promise<any>;
        }
    }
}
import Promises = JS.util.Promises;
import PromiseContext = JS.util.PromiseContext;
import PromisePlan = JS.util.PromisePlan;
import PromisePlans = JS.util.PromisePlans;
declare module JS {
    namespace util {
        interface AjaxRequest {
            thread?: boolean | ThreadPreload;
            url: string;
            async?: boolean;
            cache?: boolean;
            contentType?: string | false;
            parsers?: {
                html?: (data: string) => Document;
                xml?: (data: string) => XMLDocument;
                json?: (data: string) => JsonObject;
                text?: (data: string) => string;
            };
            data?: JsonObject | string;
            responseFilter?(data: string, type: 'xml' | 'html' | 'json' | 'text'): string;
            type?: 'xml' | 'html' | 'json' | 'text';
            headers?: JsonObject<string | null | undefined>;
            ifModified?: boolean;
            method?: 'HEAD' | 'GET' | 'POST' | 'OPTIONS' | 'PUT' | 'DELETE';
            mimeType?: string;
            username?: string;
            password?: string;
            timeout?: number;
            crossCookie?: boolean;
            onSending?: ((req: AjaxRequest) => boolean | void);
            onCompleted?: ((res: AjaxResponse) => void);
            onError?: ((res: AjaxResponse) => void);
        }
        interface AjaxResponse {
            request: AjaxRequest;
            url: string;
            raw: any;
            type: 'xml' | 'html' | 'json' | 'text';
            data: any;
            status: number;
            statusText: 'cancel' | 'timeout' | 'abort' | 'parseerror' | 'nocontent' | 'notmodified' | string;
            headers: JsonObject<string>;
            xhr: XMLHttpRequest;
        }
        class Ajax {
            private static _toQuery;
            static toRequest(quy: string | AjaxRequest, data?: JsonObject | QueryString): AjaxRequest;
            static send(req: AjaxRequest | URLString): Promise<AjaxResponse>;
            private static _inMain;
            static get(req: AjaxRequest | URLString): Promise<AjaxResponse>;
            static post(req: AjaxRequest | URLString): Promise<AjaxResponse>;
            static _ON: {};
            static on(ev: 'sending', fn: (req: AjaxRequest) => boolean | void): any;
            static on(ev: 'completed', fn: (res: AjaxResponse) => void): any;
            static on(ev: 'error', fn: (res: AjaxResponse) => void): any;
            static sendBeacon(e: 'beforeunload' | 'unload', fn: (evt: Event) => void, scope?: any): void;
            private static _inThread;
        }
    }
}
import Ajax = JS.util.Ajax;
import AjaxRequest = JS.util.AjaxRequest;
import AjaxResponse = JS.util.AjaxResponse;
declare module JS {
    namespace lang {
        type PrimitiveType = null | undefined | string | number | boolean | String | Number | Boolean;
        type JsonObject<T = any> = {
            [key: string]: T;
        };
        type Callback<T = Function> = {
            fn: T;
            ctx?: any;
            args?: Array<any>;
        };
        type Fallback<T = Function> = T | Callback<T>;
        interface Klass<T> extends Function {
        }
        interface Iterware<T> {
            each(fn: (item: T, index: number, iter: Iterware<T>) => boolean, thisArg?: any): boolean;
        }
        enum Type {
            null = "null",
            undefined = "undefined",
            string = "string",
            boolean = "boolean",
            number = "number",
            date = "date",
            array = "array",
            json = "json",
            object = "object",
            function = "function",
            class = "class",
            symbol = "symbol"
        }
    }
}
import JsonObject = JS.lang.JsonObject;
import Callback = JS.lang.Callback;
import Fallback = JS.lang.Fallback;
import Klass = JS.lang.Klass;
import Iterware = JS.lang.Iterware;
import Type = JS.lang.Type;
import PrimitiveType = JS.lang.PrimitiveType;
declare module JS {
    namespace util {
        class Types {
            static isSymbol(o: any): boolean;
            static isArguments(o: any): boolean;
            static isNaN(n: any): boolean;
            static isNumber(n: any): boolean;
            static isNumeric(n: any): boolean;
            static isFloat(n: number | string | Number): boolean;
            static isInt(n: number | string | Number): boolean;
            static isBoolean(obj: any): boolean;
            static isString(obj: any): boolean;
            static isDate(obj: any): boolean;
            static isDefined(obj: any): boolean;
            static isNull(obj: any): boolean;
            static isUndefined(obj: any): boolean;
            static isObject(obj: any): boolean;
            static isJsonObject(obj: any): boolean;
            static isArray(obj: any): boolean;
            static isError(obj: any): boolean;
            static isFile(obj: any): boolean;
            static isFormData(obj: any): boolean;
            static isBlob(obj: any): boolean;
            static isFunction(fn: any, pure?: boolean): boolean;
            static isRegExp(obj: any): boolean;
            static isArrayBuffer(obj: any): boolean;
            static isElement(el: any): boolean;
            static isWindow(el: any): boolean;
            static isKlass(obj: any, klass: Klass<any>): boolean;
            static ofKlass(obj: any, klass: Klass<any>): boolean;
            static equalKlass(kls: any, klass?: Klass<any>): boolean;
            static subKlass(kls1: Klass<any>, kls2: Klass<any>): boolean;
            static equalClass(cls1: Class<any>, cls2: Class<any>): boolean;
            static subClass(cls1: Class<any>, cls2: Class<any>): boolean;
            static isTypedArray(value: any): boolean;
            static type(obj: any): Type;
        }
    }
}
import Types = JS.util.Types;
declare module JS {
    namespace util {
        class Check {
            static EMAIL: RegExp;
            static EMAIL_DOMAIN: RegExp;
            static YYYY_MM_DD: RegExp;
            static HALFWIDTH_CHARS: RegExp;
            static FULLWIDTH_CHARS: RegExp;
            static NUMBERS_ONLY: RegExp;
            static LETTERS_ONLY: RegExp;
            static LETTERS_OR_NUMBERS: RegExp;
            static ENGLISH_ONLY: RegExp;
            static CHINESE_ONLY: RegExp;
            static IP: RegExp;
            static isEmpty(obj: any): boolean;
            static isEmptyObject(obj: any): boolean;
            static isBlank(s: string): boolean;
            static isFormatDate(str: string, format?: RegExp): boolean;
            static isEmail(str: string, pattern?: RegExp): boolean;
            static isEmails(str: string, pattern?: RegExp): boolean;
            static isEmailDomain(str: string): boolean;
            static isOnlyNumber(str: string): boolean;
            static isPositive(n: number | string): boolean;
            static isNegative(n: number | string): boolean;
            static isHalfwidthChars(str: string): boolean;
            static isFullwidthChars(str: any): boolean;
            static isEnglishOnly(str: string): boolean;
            static isChineseOnly(str: string): boolean;
            static isFormatNumber(n: number | string, iLength: number, fLength?: number): boolean;
            static greater(n1: number | string, n2: number | string): boolean;
            static greaterEqual(n1: number | string, n2: number | string): boolean;
            static less(n1: number | string, n2: number | string): boolean;
            static lessEqual(n1: number | string, n2: number | string): boolean;
            static isBetween(n: number | string, min: number | string, max: number | string): boolean;
            static shorter(str: string, len: number): boolean;
            static longer(str: string, len: number): boolean;
            static equalLength(str: string, len: number): boolean;
            static isLettersOnly(str: string): boolean;
            static isLettersOrNumbers(str: string): boolean;
            static isIP(str: string): boolean;
            static isExistUrl(url: string): boolean;
            static isPattern(str: string, exp: RegExp): boolean;
            static byServer(settings: string | AjaxRequest, judge: (res: AjaxResponse) => boolean): Promise<boolean>;
        }
    }
}
import Check = JS.util.Check;
declare module JS {
    namespace util {
        type EventHandler<T = any> = (this: T, e: Event, ...args: any[]) => boolean | void;
        type EventHandler1<T, ARG1> = (this: T, e: Event, ARG1: any) => boolean | void;
        type EventHandler2<T, ARG1, ARG2> = (this: T, e: Event, ARG1: any, ARG2: any) => boolean | void;
        type EventHandler3<T, ARG1, ARG2, ARG3> = (this: T, e: Event, ARG1: any, ARG2: any, ARG3: any) => boolean | void;
        class EventBus {
            private _ctx;
            private _isD;
            private _map;
            constructor(context?: any);
            context(): any;
            context(ctx: any): void;
            destroy(): void;
            isDestroyed(): boolean;
            private _add;
            private _remove;
            private _removeByEuid;
            private _euid;
            on<H = EventHandler>(types: string, handler: H, once?: boolean): boolean;
            find(type: string): EventHandler[];
            find(type: string, euid: number): EventHandler;
            types(): () => IterableIterator<string>;
            off(types?: string, handler?: EventHandler): boolean;
            private _call;
            fire(e: string | Event, args?: Array<any>): boolean;
        }
    }
}
import EventHandler = JS.util.EventHandler;
import EventHandler1 = JS.util.EventHandler1;
import EventHandler2 = JS.util.EventHandler2;
import EventHandler3 = JS.util.EventHandler3;
import EventBus = JS.util.EventBus;
interface HTMLElement {
    box(): {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    attr(key: string): string;
    attr(key: string, val: string): this;
    html(): string;
    html(html: string): this;
    addClass(cls: string): this;
    removeClass(cls: string): this;
    hasClass(cls: string): boolean;
    toggleClass(cls: string, isAdd?: boolean): this;
    on(type: string, fn: (this: HTMLElement, e: Event) => boolean | void, once?: boolean): this;
    off(type?: string, fn?: (this: HTMLElement, e: Event) => boolean | void): this;
    find(selector: string): HTMLElement;
    findAll(selector: string): NodeListOf<HTMLElement>;
    computedStyle(pseudo?: string): CSSStyleDeclaration;
}
interface Window {
    on(type: string, fn: (this: Window, e: Event) => boolean | void, once?: boolean): this;
    off(type?: string, fn?: (this: Window, e: Event) => boolean | void): this;
}
declare module JS {
    namespace util {
        class Dom {
            static $1(selector: string | HTMLElement): HTMLElement;
            static $L(selector: string): NodeListOf<HTMLElement>;
            static rename(node: Element, newTagName: string): void;
            static applyStyle(code: string, id?: string): void;
            static applyHtml(html: string | Document, appendTo?: string | HTMLElement, ignore?: {
                script?: boolean;
                css?: boolean;
            } | boolean): Promise<string>;
            static loadCSS(url: string, async?: boolean, uncache?: boolean): Promise<string>;
            static loadJS(url: string, async?: boolean, uncache?: boolean): Promise<string>;
            static loadHTML(url: string, async?: boolean, appendTo?: string | HTMLElement, ignore?: {
                script?: boolean;
                css?: boolean;
            } | boolean, preHandler?: (doc: Document) => Document): Promise<string>;
        }
    }
}
import Dom = JS.util.Dom;
declare const $1: typeof Dom.$1;
declare const $L: typeof Dom.$L;
declare module JS {
    let version: string;
    type GlobalConfig = {
        importMode?: 'js' | 'html';
        minimize?: boolean;
        jsdkRoot?: string;
        libRoot?: string;
        libs?: JsonObject<string | Array<string>>;
    };
    function config(): GlobalConfig;
    function config(opts: GlobalConfig): void;
    function config<T>(key: keyof GlobalConfig): T;
    function config(key: keyof GlobalConfig, val: any): void;
    function imports(url: string | string[]): Promise<any>;
}
declare module JS {
    namespace util {
        class Jsons {
            static parse(text: string, reviver?: (key: any, value: any) => any): any;
            static stringfy(value: any, replacer?: (key: string, value: any) => any | (number | string)[] | null, space?: string | number): string;
            static clone<T>(obj: T): T;
            static forEach<T>(json: JsonObject<T>, fn: (value: T, key: string) => any, that?: any): void;
            static some<T>(json: JsonObject<T>, fn: (value: T, key: string) => boolean, that?: any): boolean;
            static hasKey(json: JsonObject, key: string): boolean;
            static values<T>(json: JsonObject<T>): T[];
            static keys(json: JsonObject): string[];
            static equalKeys(json1: JsonObject, json2: JsonObject): boolean;
            static equal(json1: JsonObject<PrimitiveType>, json2: JsonObject<PrimitiveType>): boolean;
            static replaceKeys(json: JsonObject, keyMapping: JsonObject<string> | ((this: JsonObject, val: any, key: string) => string), needClone?: boolean): JsonObject;
            private static _union;
            static union(...jsons: JsonObject[]): JsonObject;
            static minus(json1: JsonObject, json2: JsonObject): JsonObject<any>;
            static intersect(json1: JsonObject, json2: JsonObject): JsonObject<any>;
            static filter(json: JsonObject, fn: (this: JsonObject, value: object, key: string) => boolean): JsonObject;
            static find(data: JsonObject, path: string): any;
        }
    }
}
import Jsons = JS.util.Jsons;
declare module JS {
    namespace util {
        class Functions {
            static call(fb: Fallback<any>): any;
            static execute(code: string, ctx?: any, argsExpression?: string, args?: ArrayLike<any>): any;
        }
    }
}
import Functions = JS.util.Functions;
declare module JS {
    namespace util {
        class Strings {
            static padStart(text: string, maxLength: number, fill?: string): string;
            static padEnd(text: string, maxLength: number, fill?: string): string;
            static nodeHTML(nodeType: string, attrs?: JsonObject<string>, text?: string): string;
            static escapeHTML(html: string): string;
            static format(tpl: string, ...data: any[]): string;
            static merge(tpl: string, data: JsonObject<PrimitiveType | ((data: JsonObject, match: string, key: string) => string)>): string;
        }
    }
}
import Strings = JS.util.Strings;
declare module JS {
    namespace util {
        class Konsole {
            static clear(): void;
            static count(label?: string): void;
            static countReset(label?: string): void;
            static time(label?: string): void;
            static timeEnd(label?: string): void;
            static trace(data: any, css?: string): void;
            static text(data: string, css?: string): void;
            private static _print;
            static print(...data: any[]): void;
        }
    }
}
import Konsole = JS.util.Konsole;
declare module JS {
    namespace util {
        enum LogLevel {
            ALL = 6,
            TRACE = 5,
            DEBUG = 4,
            INFO = 3,
            WARN = 2,
            ERROR = 1,
            OFF = 0
        }
        interface LogAppender {
            log(level: LogLevel.TRACE | LogLevel.DEBUG | LogLevel.INFO | LogLevel.WARN | LogLevel.ERROR, ...data: any[]): void;
        }
        class ConsoleAppender implements LogAppender {
            private name;
            constructor(name: string);
            log(level: LogLevel.TRACE | LogLevel.DEBUG | LogLevel.INFO | LogLevel.WARN | LogLevel.ERROR, ...data: any[]): void;
            private _log;
        }
        class Log {
            level: LogLevel;
            private _name;
            private _appender;
            constructor(name: string, level: LogLevel, appender?: Klass<LogAppender>);
            name(): string;
            private _log;
            trace(...data: any[]): void;
            debug(...data: any[]): void;
            info(...data: any[]): void;
            warn(...data: any[]): void;
            error(...data: any[]): void;
            clear(): void;
        }
    }
}
import LogLevel = JS.util.LogLevel;
import LogAppender = JS.util.LogAppender;
import Log = JS.util.Log;
declare let JSLogger: Log;
declare module JS {
    namespace lang {
        export interface AopAdvisor {
            before?: (this: any, ...args: any[]) => void;
            around?: (this: any, fn: Function, ...args: any[]) => any;
            after?: (this: any, returns: any) => void;
            throws?: (this: any, e: Error) => void;
        }
        export enum AnnotationTarget {
            ANY = 1,
            CLASS = 2,
            FIELD = 4,
            METHOD = 8,
            PARAMETER = 16
        }
        type AnnotationDefinition = {
            name: string;
            handler?: (annoName: string, values: Array<any>, target: Klass<any> | object, key?: string, d?: PropertyDescriptor) => void;
            target?: number;
        };
        export class Annotation extends Function {
        }
        export class Annotations {
            static getPropertyType(obj: object, propertyKey: string): any;
            static getValue(anno: Annotation, klass: Klass<any>): any;
            static getValue(anno: Annotation, obj: object, propertyKey: string): any;
            static setValue(annoName: string | Annotation, metaValue: any, obj: Klass<any>): void;
            static setValue(annoName: string | Annotation, metaValue: any, obj: object, propertyKey: string): void;
            static hasAnnotation(anno: Annotation, obj: object | Klass<any>, propertyKey?: string): boolean;
            static getAnnotations(obj: object | Klass<any>): string[];
            static define(definition: string | AnnotationDefinition, params?: ArrayLike<any>): Function | PropertyDescriptor;
        }
        export function deprecated(info?: string): any;
        export function before(fn: (this: any, ...args: any[]) => void): any;
        export function after(fn: (this: any, returns: any) => void): any;
        export function around(fn: (this: any, fn: Function, ...args: any[]) => any): any;
        export function throws(fn: (this: any, e: Error) => void): any;
        export function aop(advisor: AopAdvisor): any;
        export {};
    }
}
import AnnotationTarget = JS.lang.AnnotationTarget;
import Annotation = JS.lang.Annotation;
import Annotations = JS.lang.Annotations;
import AopAdvisor = JS.lang.AopAdvisor;
import deprecated = JS.lang.deprecated;
import before = JS.lang.before;
import after = JS.lang.after;
import around = JS.lang.around;
import throws = JS.lang.throws;
import aop = JS.lang.aop;
declare module JS {
    namespace reflect {
        function klass(fullName: string): any;
        class Method {
            readonly ownerClass: Class<any>;
            readonly name: string;
            readonly paramTypes: Array<Type>;
            readonly returnType: Type;
            readonly fn: Function;
            readonly isStatic: boolean;
            readonly annotations: string[];
            readonly parameterAnnotations: string[];
            constructor(clazz: Class<any>, name: string, isStatic: boolean, fn: Function, paramTypes: Array<Type>, returnType: Type);
            invoke(obj: object, ...args: Array<any>): any;
        }
        class Field {
            readonly ownerClass: Class<any>;
            readonly name: string;
            readonly type: Type;
            readonly isStatic: boolean;
            readonly annotations: string[];
            constructor(clazz: Class<any>, name: string, isStatic: boolean, type: Type);
            set(value: any, obj?: object): void;
            get(obj?: object): any;
        }
        class Class<T> {
            readonly name: string;
            readonly shortName: string;
            private _klass;
            private _superklass;
            private _methods;
            private _fields;
            constructor(name: string, klass: T);
            static getSuperklass(klass: Klass<any>): Klass<any>;
            private static _reflectable;
            static byName(name: string): Klass<any>;
            static newInstance<T>(ctor: string | Klass<T>, ...args: any[]): T;
            static aliasInstance<T>(alias: string | Klass<T>, ...args: any[]): T;
            static aop(klass: Klass<any>, method: string, advisor: AopAdvisor): void;
            static cancelAop(klass: Klass<any>, method: string): void;
            aop(method: string, advisor: AopAdvisor): void;
            private _cancelAop;
            cancelAop(method?: string): void;
            equals(cls: Class<any>): boolean;
            equalsKlass(cls: Klass<any>): boolean;
            subclassOf(cls: Class<any> | Klass<any>): boolean;
            newInstance<T>(...args: any[]): T;
            getSuperclass(): Class<T>;
            getKlass<T>(): Klass<T>;
            private _parseStaticMembers;
            private _parseInstanceMembers;
            private _forceProto;
            private _isValidStatic;
            private _isValidInstance;
            private _init;
            private _toArray;
            method(name: string): Method;
            methodsMap(): JsonObject<Method>;
            methods(): Method[];
            field(name: string, instance?: object): Field;
            private _instanceFields;
            fieldsMap(instance?: object, anno?: Annotation): JsonObject<Field>;
            fields(instance?: object, anno?: Annotation): Field[];
            private static _MAP;
            private static _ALIAS_MAP;
            static forName<T>(name: string | Klass<T>, isAlias?: boolean): Class<T>;
            static all(): JsonObject<Class<any>>;
            static register<T>(klass: Klass<T>, className?: string, alias?: string): void;
            static classesOf(ns: string): Class<any>[];
        }
    }
}
import Method = JS.reflect.Method;
import Field = JS.reflect.Field;
import Class = JS.reflect.Class;
import klass = JS.reflect.klass;
interface Function {
    class: Class<any>;
    aop(this: Function, advisor: AopAdvisor, that?: any): (...args: any[]) => Function;
    mixin(kls: Klass<any>, methodNames?: string[]): void;
}
interface Object {
    className: string;
    getClass(): Class<any>;
}
declare var __decorate: (decorators: any, target: any, key: any, desc: any) => any;
declare module JS {
    namespace lang {
        class JSError extends Error {
            cause: Error;
            constructor(msg?: string, cause?: Error);
        }
        class NotHandledError extends JSError {
        }
        class NotFoundError extends JSError {
        }
        class ArithmeticError extends JSError {
        }
        class ArgumentError extends JSError {
        }
        class StateError extends JSError {
        }
        class NetworkError extends JSError {
        }
        class TimeoutError extends JSError {
        }
    }
}
import JSError = JS.lang.JSError;
import NotHandledError = JS.lang.NotHandledError;
import NotFoundError = JS.lang.NotFoundError;
import ArithmeticError = JS.lang.ArithmeticError;
import ArgumentError = JS.lang.ArgumentError;
import StateError = JS.lang.StateError;
import NetworkError = JS.lang.NetworkError;
import TimeoutError = JS.lang.TimeoutError;
declare module JS {
    namespace lang {
        let Errors: {
            Error: ErrorConstructor;
            JSError: typeof JSError;
            URIError: URIErrorConstructor;
            ReferenceError: ReferenceErrorConstructor;
            TypeError: TypeErrorConstructor;
            RangeError: RangeErrorConstructor;
            SyntaxError: SyntaxErrorConstructor;
            EvalError: EvalErrorConstructor;
            NotHandledError: typeof NotHandledError;
            NotFoundError: typeof NotFoundError;
            ArithmeticError: typeof ArithmeticError;
            ArgumentError: typeof ArgumentError;
            StateError: typeof StateError;
            NetworkError: typeof NetworkError;
            TimeoutError: typeof TimeoutError;
        };
    }
}
import Errors = JS.lang.Errors;
declare module JS {
    namespace util {
        type URLString = string;
        type QueryString = string;
        type URIData = {
            scheme?: string;
            user?: string;
            password?: string;
            host: string;
            port?: number;
            path?: string;
            params?: JsonObject<string>;
            fragment?: string;
        };
        class URI {
            private _scheme;
            private _user;
            private _pwd;
            private _host;
            private _port;
            private _path;
            private _params;
            private _frag;
            constructor(cfg?: string | URL | URIData);
            private _parse;
            private _parseStr;
            userinfo(): string;
            fragment(): string;
            fragment(str: string): this;
            queryString(): string;
            queryString(str: string): this;
            path(): string;
            path(str: string): this;
            port(): number;
            port(port: number): this;
            host(): string;
            host(str: string): this;
            user(): string;
            user(str: string): this;
            password(): string;
            password(str: string): this;
            scheme(): string;
            scheme(str: string): this;
            query(key: string): string;
            query(key: string, value: string, encode?: boolean): this;
            queryObject(): JsonObject<string>;
            queryObject(params: JsonObject<string>, encode?: boolean): this;
            isAbsolute(): boolean;
            toAbsolute(): string;
            toRelative(): string;
            toString(): string;
            static getAbsoluteDir(): any;
            static toAbsoluteURL(url: string): string;
            static toQueryString(json: JsonObject<string>, encode?: boolean): QueryString;
            static parseQueryString(query: QueryString, decode?: boolean): JsonObject<string>;
        }
    }
}
import URI = JS.util.URI;
import URLString = JS.util.URLString;
import QueryString = JS.util.QueryString;
declare module JS {
    namespace util {
        type Locale = string;
        class Locales {
            static lang(locale: Locale): string;
            static country(locale: Locale): string;
        }
    }
}
import Locale = JS.util.Locale;
import Locales = JS.util.Locales;
declare module JS {
    namespace util {
        type JsonResource = JsonObject<PrimitiveType | Array<any> | RegExp | JsonObject>;
        type Resource = URLString | JsonResource;
        class Bundle {
            private _lc;
            private _d;
            private _load;
            constructor(res: Resource, locale?: Locale);
            get(): JsonObject;
            get(key: string): any;
            getKeys(): (string | number | symbol)[];
            hasKey(k: string): boolean;
            getLocale(): Locale;
            set(d: JsonObject): this;
        }
    }
}
import JsonResource = JS.util.JsonResource;
import Resource = JS.util.Resource;
import Bundle = JS.util.Bundle;
interface Date {
    getWeek(): number;
    setWeek(week: number, dayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6): Date;
    clone(): Date;
    setZeroTime(): Date;
    setLastTime(): Date;
    setNowTime(): Date;
    equals(date: Date, type?: 'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'M' | 'y'): boolean;
    between(start: Date, end: Date): boolean;
    isAfter(date: Date): boolean;
    isBefore(date: Date): boolean;
    isToday(date: Date): boolean;
    add(v: number, type: 'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'M' | 'y'): Date;
    setTimezoneOffset(offset: number): Date;
    formatTimezoneOffset(): string;
    set(config: {
        millisecond?: number;
        second?: number;
        minute?: number;
        hour?: number;
        day?: number;
        week?: number;
        month?: number;
        year?: number;
        timezoneOffset?: number;
    }): Date;
    diff(date?: Date): number;
    format(format?: string, locale?: Locale): string;
}
declare module JS {
    namespace util {
        class Dates {
            static I18N_RESOURCE: Resource;
            static isValidDate(d: Date | string | number): boolean;
            static isLeapYear(y: number): boolean;
            static getDaysOfMonth(m: number, y?: number): number;
            static getFirstDayOfMonth(d: Date): Date;
            static getLastDayOfMonth(d: Date): Date;
            static getDayOfWeek(d: Date, dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6): Date;
        }
    }
}
import Dates = JS.util.Dates;
interface Number {
    stringfy(): string;
    round(digit?: number): number;
    toInt(): number;
    format(digit?: number): string;
    equals(n: number | string | Number, dLen?: number): boolean;
    add(n: number | string | Number): number;
    sub(n: number | string | Number): number;
    mul(n: number | string | Number): number;
    div(n: number | string | Number): number;
    isNaN(): boolean;
    isFinite(): boolean;
    isZero(): boolean;
    isFloat(): boolean;
    isInt(): boolean;
    isPositive(): boolean;
    isNegative(): boolean;
    isOdd(): boolean;
    isEven(): boolean;
    abs(): number;
    fractionLength(): number;
    integerLength(): number;
    fractionalPart(): string;
    integralPart(): string;
}
declare module JS {
    namespace util {
        class Numbers {
            static min(...numbers: Array<number>): number;
            static max(...numbers: Array<number>): number;
            static termwise(...args: Array<number | '+' | '-' | '*' | '/'>): number;
            static algebra(expression: string, values?: JsonObject<number | string | Number>): number;
        }
    }
}
import Numbers = JS.util.Numbers;
declare module JS {
    namespace lang {
        class AssertError extends JSError {
        }
        class Assert {
            static fail(msg?: string): void;
            static failNotSameType(expected: any, actual: any, msg?: string): void;
            static failNotEqual(expected: any, actual: any, msg?: string): void;
            static failEqual(expected: any, actual: any, msg?: string): void;
            static _equal(expected: any, actual: any): boolean;
            static equal(expected: Date, actual: Date, msg?: string): any;
            static equal(expected: any[], actual: any[], msg?: string): any;
            static equal(expected: JsonObject, actual: JsonObject, msg?: string): any;
            static equal(expected: PrimitiveType, actual: PrimitiveType, msg?: string): any;
            static notEqual(expected: Date, actual: Date, msg?: string): any;
            static notEqual(expected: any[], actual: any[], msg?: string): any;
            static notEqual(expected: JsonObject, actual: JsonObject, msg?: string): any;
            static notEqual(expected: PrimitiveType, actual: PrimitiveType, msg?: string): any;
            static sameType(expected: any, actual: any, msg?: string): void;
            static notSameType(expected: any, actual: any, msg?: string): void;
            static true(condition: boolean, msg?: string): void;
            static false(condition: boolean, msg?: string): void;
            static defined(obj: object, msg?: string): void;
            static notDefined(obj: object, msg?: string): void;
            static error(fn: Fallback<any>, msg?: string): void;
            static equalError(error: Klass<Error>, fn: Fallback<any>, msg?: string): void;
        }
    }
}
import Assert = JS.lang.Assert;
import AssertError = JS.lang.AssertError;
declare module JS {
    namespace lang {
        enum OS {
            Windows = "Windows",
            MacOS = "Mac OS",
            Unix = "Unix",
            Linux = "Linux",
            CentOS = "CentOS",
            Ubuntu = "Ubuntu",
            iOS = "iOS",
            Android = "Android",
            WindowsPhone = "Windows Phone"
        }
        enum DeviceType {
            desktop = "desktop",
            console = "console",
            mobile = "mobile",
            tablet = "tablet",
            smarttv = "smarttv",
            wearable = "wearable",
            embedded = "embedded"
        }
        enum Browser {
            Edge = "Edge",
            IE = "IE",
            Firefox = "Firefox",
            Chrome = "Chrome",
            Opera = "Opera",
            Safari = "Safari",
            iOS = "iOS",
            WeChat = "WeChat",
            QQ = "QQ",
            UC = "UC"
        }
        type BrowserDisplay = {
            screenWidth: number;
            screenHeight: number;
            screenViewWidth: number;
            screenViewHeight: number;
            windowX: number;
            windowY: number;
            docX: number;
            docY: number;
            docScrollX: number;
            docScrollY: number;
            docWidth: number;
            docHeight: number;
            docViewWidth: number;
            docViewHeight: number;
            colorDepth: number;
            pixelDepth: number;
            devicePixelRatio: number;
        };
        type HardwareSupport = {
            logicalCPUCores: number;
        };
        type SystemInfo = {
            ua: string;
            display: BrowserDisplay;
            browser: {
                name: string;
                version?: string;
            };
            engine: {
                name: string;
                version: string;
            };
            device: {
                model: string;
                type: DeviceType;
                vendor: string;
            };
            os: {
                name: string;
                version?: string;
            };
            locale: Locale;
            cookieEnabled: boolean;
            online: boolean;
            hardware: {
                cpuName: string;
                cpuCores: number;
            };
        };
        class System {
            private static _info;
            static info(refresh?: boolean): SystemInfo;
            static display(refresh?: boolean): BrowserDisplay;
            static isDevice(device: DeviceType): boolean;
            static isBrowser(b: Browser | string): boolean;
            static isOS(os: OS | string, version?: string): boolean;
            static isLang(lang: string): boolean;
            static isCountry(country: string): boolean;
            static timezoneString(tz?: 'GMT' | 'UTC' | 'UT'): string;
            static performance(): Performance;
            static highResTime(): number;
        }
    }
}
import System = JS.lang.System;
import OS = JS.lang.OS;
import Browser = JS.lang.Browser;
import DeviceType = JS.lang.DeviceType;
import SystemInfo = JS.lang.SystemInfo;
import BrowserWindow = JS.lang.BrowserDisplay;
declare module JS {
    namespace util {
        class Bom {
            static ready(fn: Function): void;
            static iframeWindow(el: string | Element): Window;
            static iframeDocument(el: string | Element): Document;
            static fullscreen(): void;
            static normalscreen(): void;
        }
    }
}
import Bom = JS.util.Bom;
declare module JS {
    namespace ui {
        type MouseEvents = 'click' | 'dblclick' | 'mouseleave' | 'mouseenter' | 'mouseout' | 'mouseover' | 'mousedown' | 'mouseup' | 'mousemove' | 'mousewheel' | 'drag' | 'drop' | 'dragend' | 'dragstart' | 'dragenter' | 'dragleave' | 'dragover';
        type KeyboardEvents = 'keyup' | 'keydown' | 'keypress';
        type TouchEvents = 'touchstart' | 'touchend' | 'touchmove' | 'touchcancel';
    }
}
import MouseEvents = JS.ui.MouseEvents;
import KeyboardEvents = JS.ui.KeyboardEvents;
import TouchEvents = JS.ui.TouchEvents;
declare module JS {
    namespace ui {
        interface IWidgetConfig {
        }
        interface IWidget {
            id: string;
            name(): string;
            show(): this;
            hide(): this;
            isShown(): boolean;
            locale(): string;
            locale(locale: string): this;
            on(type: string, fn: EventHandler<this>): this;
            off(type?: string): this;
            destroy(): void;
        }
        interface IValueWidget extends IWidget {
            iniValue<T>(): T;
            iniValue<T>(val?: T, render?: boolean): this;
            value<T>(): T;
            value<T>(val?: T, silent?: boolean): this;
            reset(): this;
            valueModel(): Model;
            validate(): string | boolean;
            clear(): this;
        }
        interface IDataWidget extends IWidget {
            data<T>(): T;
            data(data: any, silent?: boolean): this;
            load<T>(api: string | AjaxRequest): Promise<ResultSet<T>>;
            reload(): this;
            dataModel<M>(): M;
        }
        interface ICRUDWidget<T> extends IValueWidget {
            crudValue(): T;
            isCrud(): boolean;
        }
        type WidgetEvents = 'showing' | 'shown' | 'hiding' | 'hidden' | 'rendering' | 'rendered' | 'destroying' | 'destroyed';
        function widget(fullName: string, alias?: string): any;
    }
}
import widget = JS.ui.widget;
import IWidgetConfig = JS.ui.IWidgetConfig;
import IWidget = JS.ui.IWidget;
import IValueWidget = JS.ui.IValueWidget;
import IDataWidget = JS.ui.IDataWidget;
import ICRUDWidget = JS.ui.ICRUDWidget;
import WidgetEvents = JS.ui.WidgetEvents;
declare module JS {
    namespace view {
        interface ViewWidgetConfig extends IWidgetConfig {
            id?: string;
            klass?: string | Klass<IWidget>;
        }
        type ViewEvents = 'rendering' | 'rendered' | 'widgetiniting' | 'widgetinited' | 'dataupdated' | 'validated';
        interface ViewConfig {
        }
        abstract class View implements IComponent {
            protected _widgets: JsonObject<IWidget>;
            protected _model: Modelable<any>;
            protected _eventBus: EventBus;
            protected _config: ViewConfig;
            initialize(): void;
            destroy(): void;
            config(): ViewConfig;
            protected abstract _render(): any;
            protected _fire(e: ViewEvents, args?: Array<any>): boolean;
            render(): void;
            getModel(): Modelable<any>;
            getWidget<W extends IWidget>(id: string): W;
            getWidgets(): JsonObject<IWidget>;
            addWidget(wgt: IWidget): View;
            removeWidget(id: string): View;
            destroyWidget(id: string): View;
            on(type: 'rendering', handler: EventHandler<this>): any;
            on(type: 'rendered', handler: EventHandler<this>): any;
            on(type: 'widgetiniting', handler: EventHandler2<this, string | Klass<IWidget>, ViewWidgetConfig>): any;
            on(type: 'widgetinited', handler: EventHandler1<this, IWidget>): any;
            on(type: 'dataupdated', handler: EventHandler2<this, any, any>): any;
            on(type: 'validated', handler: EventHandler2<this, ValidateResult, any>): any;
            off(type?: string): void;
            eachWidget(fn: (w: IWidget) => void): void;
            protected _newWidget<T extends IWidget>(id: string, cfg: ViewWidgetConfig | IWidgetConfig, defaults: IWidgetConfig): T;
        }
    }
}
import ViewEvents = JS.view.ViewEvents;
import ViewWidgetConfig = JS.view.ViewWidgetConfig;
import ViewConfig = JS.view.ViewConfig;
import View = JS.view.View;
declare module JS {
    namespace model {
        type PageEvents = 'fullscreening' | 'fullscreened' | 'normalscreening' | 'normalscreened' | 'loading' | 'loaded' | 'unloading' | 'close';
        abstract class Page implements IComponent {
            initialize(): void;
            destroy(): void;
            abstract render(): any;
            private static _bus;
            static fireEvent(e: PageEvents, args?: any[]): void;
            static onEvent<H = EventHandler<Page>>(e: string, handler: H): void;
            static offEvent(e: PageEvents): void;
            private static _page;
            static current(page: Klass<Page>): void;
            static current<P extends Page>(): P;
            static view<V extends View>(view: Klass<V>): V;
            static uri(): URI;
            static load(url?: string): void;
            static open(url: any, target?: 'blank' | 'parent' | 'self', specs?: {
                width?: number;
                height?: number;
                top?: number;
                left?: number;
                location?: boolean;
                menubar?: boolean;
                resizable?: boolean;
                scrollbars?: boolean;
                status?: boolean;
                titlebar?: boolean;
                toolbar?: boolean;
            }): any;
            static fullscreen(onoff: boolean): void;
        }
    }
}
import PageEvents = JS.model.PageEvents;
import Page = JS.model.Page;
declare module JS {
    namespace model {
        class AppEvent extends CustomEvent<any> {
            url: string;
            constructor(type: string, initDict?: any);
        }
        type AppSettings = {
            name: string;
            version?: string;
            logLevel?: LogLevel;
            properties?: JsonObject;
        };
        class App {
            private static _sets;
            private static _logger;
            static init(settings: AppSettings): void;
            static namespace(): string;
            static appName(): string;
            static version(): string;
            static logger(): Log;
            static properties(): JsonObject;
            static properties(properties: JsonObject): App;
            static property(key: string): any;
            static property(key: string, val: any): App;
            static _bus: EventBus;
            static fireEvent<E>(e: E, arg?: StoreDataType): void;
            static onEvent<H = EventHandler<App>>(e: string, handler: H, once?: boolean): void;
            static offEvent(e: string): void;
        }
    }
}
import App = JS.model.App;
import AppEvent = JS.model.AppEvent;
import AppSettings = JS.model.AppSettings;
declare module JS {
    namespace model {
        interface ResultSetFormat {
            rootProperty?: string;
            recordsProperty?: string;
            totalProperty?: string;
            pageProperty?: string;
            pageSizeProperty?: string;
            messageProperty?: string;
            versionProperty?: string;
            langProperty?: string;
            successProperty?: string;
            successCode?: any;
            isSuccess?: (root: any) => boolean;
        }
        class ResultSet<T = PrimitiveType | Array<any> | JsonObject | Model> {
            static DEFAULT_FORMAT: ResultSetFormat;
            private _rawObject;
            private _data;
            private _page;
            private _pageSize;
            private _total;
            private _version;
            private _lang;
            private _msg;
            private _success;
            rawObject(): any;
            rawObject(response: any): this;
            data(): T;
            data(data: T): this;
            count(): number;
            total(): number;
            total(total: number): this;
            page(): number;
            page(page: number): this;
            pageSize(): number;
            pageSize(pageSize: number): this;
            version(): string;
            version(v: string): this;
            lang(): string;
            lang(lang: string): this;
            message(): string;
            message(msg: string): this;
            success(): boolean;
            success(success: boolean): this;
            static parseJSON<T>(raw: JsonObject, format?: ResultSetFormat): ResultSet<T>;
        }
    }
}
import ResultSet = JS.model.ResultSet;
import ResultSetFormat = JS.model.ResultSetFormat;
declare module JS {
    namespace model {
        abstract class AjaxProxy {
            abstract execute<T>(req: string | AjaxRequest, data?: JsonObject | QueryString): Promise<ResultSet<T>>;
            s: any;
        }
    }
}
import AjaxProxy = JS.model.AjaxProxy;
declare module JS {
    namespace model {
        class JsonProxy extends AjaxProxy {
            constructor();
            execute<T>(query: string | AjaxRequest, data?: JsonObject | QueryString): Promise<ResultSet<T>>;
        }
    }
}
import JsonProxy = JS.model.JsonProxy;
declare module JS {
    namespace model {
        abstract class Service implements IComponent {
            initialize(): void;
            destroy(): void;
            static DEFAULT_PROXY: Klass<AjaxProxy>;
            protected _proxy: AjaxProxy;
            proxy(proxy: AjaxProxy): this;
            proxy(): AjaxProxy;
            call<T>(api: Api<T>, params?: JsonObject): Promise<T>;
        }
    }
}
import Service = JS.model.Service;
declare module JS {
    namespace ds {
        class BiMap<K, V> {
            private _m;
            constructor(k?: Array<[K, V]>);
            inverse(): BiMap<V, K>;
            delete(k: K): boolean;
            forEach(fn: (value: V, key: K, map: Map<K, V>) => void, ctx?: any): void;
            clear(): void;
            size(): number;
            has(k: K): boolean;
            get(k: K): V;
            put(k: K, v: V): void;
            putAll(map: Map<K, V> | BiMap<K, V>): void;
        }
    }
}
import BiMap = JS.ds.BiMap;
declare module JS {
    namespace ds {
        class LinkedList<T> implements Iterware<T> {
            private _s;
            private _hd;
            private _tl;
            constructor();
            each(fn: (item: T, index: number, iter: LinkedList<T>) => boolean, thisArg?: any): boolean;
            size(): number;
            isEmpty(): boolean;
            clear(): void;
            clone(): LinkedList<T>;
            toArray(): Array<T>;
            getFirst(): T;
            getLast(): T;
            private _check;
            get(i: number): T;
            private _findAt;
            private _fromFirst;
            private _fromLast;
            indexOf(data: T): number;
            lastIndexOf(data: T): number;
            contains(data: T): boolean;
            private _addLast;
            private _addFirst;
            add(a: T | T[]): void;
            addAll(list: LinkedList<T>): void;
            private _addAt;
            addAt(i: number, a: T | T[]): void;
            addLast(a: T | T[]): void;
            addFirst(a: T | T[]): void;
            removeFirst(): T;
            removeLast(): T;
            removeAt(i: number): T;
            peek(): T;
            peekFirst(): T;
            peekLast(): T;
            toString(): string;
        }
    }
}
import LinkedList = JS.ds.LinkedList;
declare module JS {
    namespace ds {
        class Queue<T> implements Iterware<T> {
            protected list: LinkedList<T>;
            constructor(a?: T | T[]);
            each(fn: (item: T, index: number, iter: Queue<T>) => boolean, thisArg?: any): boolean;
            size(): number;
            isEmpty(): boolean;
            clear(): void;
            clone(): Queue<T>;
            toArray(): Array<T>;
            get(i: number): T;
            indexOf(data: T): number;
            lastIndexOf(data: T): number;
            contains(data: T): boolean;
            push(a: T): void;
            pop(): T;
            peek(): T;
            toString(): string;
        }
    }
}
import Queue = JS.ds.Queue;
declare module JS {
    namespace ds {
        class Stack<T> implements Iterware<T> {
            protected list: LinkedList<T>;
            constructor(a?: T | T[]);
            each(fn: (item: T, index: number, iter: Stack<T>) => boolean, thisArg?: any): boolean;
            size(): number;
            isEmpty(): boolean;
            clear(): void;
            clone(): Stack<T>;
            toArray(): Array<T>;
            peek(): T;
            pop(): T;
            push(item: T): void;
            toString(): string;
        }
    }
}
import Stack = JS.ds.Stack;
declare module JS {
    namespace model {
        namespace validator {
            type ValidatorType = 'required' | 'format' | 'range' | 'length' | 'custom';
            class ValidatorConfig {
            }
            abstract class Validator {
                protected _cfg: ValidatorConfig;
                constructor(cfg: ValidatorConfig);
                abstract validate(value: any): string | boolean;
                static create(type: ValidatorType, cfg: ValidatorConfig): Validator;
            }
            type InvalidField = {
                field: string;
                message: string;
            };
            class ValidateResult {
                private _errors;
                addError(field: string, msg?: string): void;
                length(): number;
                hasError(field?: string): boolean;
                clear(): void;
                getErrors(field?: string): InvalidField[];
            }
            class CustomValidatorConfig extends ValidatorConfig {
                allowEmpty?: boolean;
                validate?: (value: any) => boolean;
                message?: string;
            }
            class CustomValidator extends Validator {
                constructor(cfg: CustomValidatorConfig);
                validate(val: any): string | boolean;
            }
            class RequiredValidatorConfig extends ValidatorConfig {
                message?: string;
            }
            class RequiredValidator extends Validator {
                constructor(cfg: RequiredValidatorConfig);
                validate(val: any): string | boolean;
            }
            class RangeValidatorConfig extends ValidatorConfig {
                allowEmpty?: boolean;
                min?: number;
                max?: number;
                nanMessage?: string;
                tooMinMessage?: string;
                tooMaxMessage?: string;
            }
            class RangeValidator extends Validator {
                constructor(cfg: RangeValidatorConfig);
                validate(val: string | number): string | boolean;
            }
            class LengthValidatorConfig extends ValidatorConfig {
                allowEmpty?: boolean;
                short?: number;
                long?: number;
                invalidTypeMessage?: string;
                tooShortMessage?: string;
                tooLongMessage?: string;
            }
            class LengthValidator extends Validator {
                constructor(cfg: LengthValidatorConfig);
                validate(val: string | string[]): string | boolean;
            }
            class FormatValidatorConfig extends ValidatorConfig {
                allowEmpty?: boolean;
                matcher?: RegExp;
                message?: string;
            }
            class FormatValidator extends Validator {
                constructor(cfg: FormatValidatorConfig);
                validate(val: any): string | boolean;
            }
        }
    }
}
import InvalidField = JS.model.validator.InvalidField;
import ValidateResult = JS.model.validator.ValidateResult;
import Validator = JS.model.validator.Validator;
import ValidatorType = JS.model.validator.ValidatorType;
import CustomValidator = JS.model.validator.CustomValidator;
import RequiredValidator = JS.model.validator.RequiredValidator;
import RangeValidator = JS.model.validator.RangeValidator;
import LengthValidator = JS.model.validator.LengthValidator;
import FormatValidator = JS.model.validator.FormatValidator;
declare module JS {
    namespace model {
        interface RequiredValidatorSetting extends JS.model.validator.RequiredValidatorConfig {
            name: 'required';
        }
        interface FormatValidatorSetting extends JS.model.validator.FormatValidatorConfig {
            name: 'format';
        }
        interface RangeValidatorSetting extends JS.model.validator.RangeValidatorConfig {
            name: 'range';
        }
        interface LengthValidatorSetting extends JS.model.validator.LengthValidatorConfig {
            name: 'length';
        }
        interface CustomValidatorSetting extends JS.model.validator.CustomValidatorConfig {
            name: 'custom';
        }
        type ValidatorSetting = RequiredValidatorSetting | FormatValidatorSetting | RangeValidatorSetting | LengthValidatorSetting | CustomValidatorSetting;
        interface FieldConfig {
            readonly name: string;
            readonly type?: string | 'string' | 'int' | 'float' | 'boolean' | 'date' | 'object' | 'array';
            isId?: boolean;
            readonly nullable?: boolean;
            readonly defaultValue?: any;
            readonly setter?: (this: Field, value: any) => any;
            readonly nameMapping?: string | ((this: Field) => string);
            readonly comparable?: (val1: any, val2: any) => number;
            readonly validators?: Array<ValidatorSetting>;
        }
        class Field {
            protected _config: FieldConfig;
            constructor(config: FieldConfig);
            config(): FieldConfig;
            name(): string;
            alias(): string;
            isId(): boolean;
            defaultValue(): any;
            type(): 'string' | 'int' | 'float' | 'boolean' | 'date' | 'object' | 'array';
            nullable(): boolean;
            set(val: any): any;
            compare(v1: any, v2: any): number;
            isEqual(v1: any, v2: any): boolean;
            validate(value: any, errors?: ValidateResult): boolean | string;
        }
    }
}
import ModelField = JS.model.Field;
import RequiredValidatorSetting = JS.model.RequiredValidatorSetting;
import FormatValidatorSetting = JS.model.FormatValidatorSetting;
import RangeValidatorSetting = JS.model.RangeValidatorSetting;
import LengthValidatorSetting = JS.model.LengthValidatorSetting;
import CustomValidatorSetting = JS.model.CustomValidatorSetting;
import ValidatorSetting = JS.model.ValidatorSetting;
import FieldConfig = JS.model.FieldConfig;
declare module JS {
    namespace model {
        interface Modelable<T extends Model> {
            on(event: ModelEvents, fn: EventHandler<this>): this;
            off(event?: ModelEvents): this;
            clone(): this;
            reload(): Promise<ResultSet<T>>;
            load(req: string | AjaxRequest, silent?: boolean): Promise<ResultSet<T>>;
            setData(data: any, silent?: boolean): this;
            getData(): any;
            iniData(): any;
            iniData(data: any): this;
            reset(): this;
            clear(): this;
            validate(result?: ValidateResult): string | boolean;
            destroy(): void;
            isDestroyed(): boolean;
        }
        type ModelEvents = 'dataupdating' | 'dataupdated' | 'fieldchanged' | 'validated' | 'fieldvalidated' | 'loading' | 'loadsuccess' | 'loadfailure' | 'loaderror';
        type ModelListeners<M> = {
            dataupdating: EventHandler2<M, JsonObject, JsonObject>;
            dataupdated: EventHandler2<M, JsonObject, JsonObject>;
            fieldchanged: EventHandler3<M, any, any, string>;
            validated: EventHandler2<M, ValidateResult, JsonObject>;
            fieldvalidated: EventHandler3<M, ValidateResult, any, string>;
            loading: EventHandler1<M, AjaxRequest>;
            loadsuccess: EventHandler1<M, ResultSet<any>>;
            loadfailure: EventHandler1<M, ResultSet<any>>;
            loaderror: EventHandler1<M, AjaxResponse | Error>;
        };
        class ModelConfig {
            readonly listeners?: ModelListeners<this>;
            idProperty?: string;
            readonly fields?: Array<FieldConfig | string>;
            dataQuery?: string | AjaxRequest;
            iniData?: JsonObject;
        }
        class Model {
            protected _config: ModelConfig;
            private readonly _fields;
            private _eventBus;
            protected _data: JsonObject;
            static DEFAULT_FIELDS: Array<FieldConfig | string>;
            constructor(cfg?: ModelConfig);
            private _check;
            private _newField;
            protected _addFields(fields: Array<FieldConfig | string>): void;
            addFields(fields: Array<FieldConfig | string>): this;
            addField(field: FieldConfig | string): this;
            isIdField(name: string): boolean;
            removeFields(names: Array<string>): this;
            removeField(name: string): this;
            updateField(field: FieldConfig | string): this;
            updateFields(fields: Array<FieldConfig | string>): this;
            clone(): this;
            reload(): Promise<ResultSet<unknown>>;
            load<T>(quy: string | AjaxRequest, silent?: boolean): Promise<ResultSet<T>>;
            setData(data: JsonObject, silent?: boolean): this;
            hasField(name: string): boolean;
            get(fieldName: string): any;
            set(key: string, value: any, equal?: boolean | ((this: this, newVal: any, oldVal: any) => boolean)): this;
            iniData(): any;
            iniData(data: any): this;
            getData(): JsonObject<any>;
            getId(): any;
            setId(id: number | string): this;
            isEmpty(): boolean;
            protected _isD: boolean;
            destroy(): void;
            isDestroyed(): boolean;
            getField(name: string): Field;
            getFields(): JsonObject<Field>;
            getIdField(): Field;
            reset(): this;
            clear(): this;
            validate(result?: ValidateResult): string | boolean;
            validateField(fieldName: string, value?: any, result?: ValidateResult): string | boolean;
            protected _fire(type: ModelEvents, args?: any[]): void;
            on(type: string, fn: EventHandler<this>, once?: boolean): this;
            off(type?: string): this;
        }
    }
}
import Model = JS.model.Model;
import ModelEvents = JS.model.ModelEvents;
import ModelConfig = JS.model.ModelConfig;
import Modelable = JS.model.Modelable;
declare module JS {
    namespace model {
        type ListModelEvents = 'dataupdating' | 'dataupdated' | 'rowadded' | 'rowremoved' | 'validated' | 'rowvalidated' | 'loading' | 'loadsuccess' | 'loadfailure' | 'loaderror';
        interface ListModelListeners<M> {
            dataupdating: EventHandler2<M, JsonObject[], JsonObject[]>;
            dataupdated: EventHandler2<M, JsonObject[], JsonObject[]>;
            rowadded: EventHandler2<M, JsonObject[], number>;
            rowremoved: EventHandler2<M, JsonObject, number>;
            validated: EventHandler2<M, ValidateResult, JsonObject[]>;
            rowvalidated: EventHandler3<M, ValidateResult, JsonObject[], number>;
            loading: EventHandler1<M, AjaxRequest>;
            loadsuccess: EventHandler1<M, ResultSet<any>>;
            loadfailure: EventHandler1<M, ResultSet<any>>;
            loaderror: EventHandler1<M, AjaxResponse | Error>;
        }
        type Sorter = {
            field: string;
            dir?: 'asc' | 'desc';
            sort?: (record1: any, record2: any) => number;
        };
        class ListModelConfig {
            autoLoad?: boolean;
            readonly listeners?: ListModelListeners<this>;
            sorters?: Array<Sorter>;
            dataQuery?: string | AjaxRequest;
            iniData?: JsonObject[];
        }
        class ListModel {
            protected _config: ListModelConfig;
            protected _data: JsonObject[];
            protected _eventBus: EventBus;
            private _isD;
            constructor(cfg?: ListModelConfig);
            protected _initConfig(cfg?: ListModelConfig): JsonObject<any>;
            protected _check(): void;
            addSorter(field: string, dir?: 'asc' | 'desc'): void;
            removeSorter(field: string): void;
            clearSorters(): void;
            sort(field: string, dir?: 'desc' | 'asc'): Promise<any>;
            getSorterBy(fieldName: string): Sorter;
            private _sortParams;
            reload(): Promise<ResultSet<JsonObject<any>[]>>;
            private _modelKlass;
            modelKlass(): Klass<Model>;
            modelKlass(klass: Klass<Model>): this;
            load<R = JsonObject[]>(quy: string | AjaxRequest, silent?: boolean): Promise<ResultSet<R>>;
            getData(): JsonObject[];
            setData(data: JsonObject[], silent?: boolean): this;
            iniData(): any;
            iniData(data: any): this;
            reset(): this;
            add(records: JsonObject | JsonObject[], silent?: boolean): this;
            insert(index: number, records: JsonObject | JsonObject[], silent?: boolean): this;
            getRowModel<T extends Model>(index: number, klass?: Klass<T>): T;
            getModels<T extends Model>(klass?: Klass<T>): T[];
            getRowById(id: number | string): JsonObject;
            getRow(index: number): JsonObject;
            indexOfId(id: number | string): number;
            removeAt(index: number, silent?: boolean): this;
            clear(silent?: boolean): this;
            validate(): string | boolean;
            validateRow(index: number): string | boolean;
            size(): number;
            isEmpty(): boolean;
            clone(): this;
            protected _fire(type: string, args?: any[]): void;
            on<H = EventHandler<this>>(type: string, fn: H, once?: boolean): this;
            off(type?: string): this;
            destroy(): void;
            isDestroyed(): boolean;
        }
    }
}
import ListModel = JS.model.ListModel;
import ListModelConfig = JS.model.ListModelConfig;
import ListModelEvents = JS.model.ListModelEvents;
import ListModelListeners = JS.model.ListModelListeners;
declare module JS {
    namespace ui {
        enum LengthUnit {
            PCT = "%",
            PX = "px",
            IN = "in",
            CM = "cm",
            MM = "mm",
            EM = "em",
            EX = "ex",
            PT = "pt",
            PC = "pc",
            REM = "rem"
        }
        class Lengths {
            static toNumber(len: string | number, unit?: LengthUnit): number;
            static toCSS(len: string | number, defaultVal: string, unit?: LengthUnit): string;
        }
    }
}
import Lengths = JS.ui.Lengths;
declare module JS {
    namespace ui {
        type HEX = string;
        type RGBAString = string;
        type RGBA = {
            r: number;
            g: number;
            b: number;
            a?: number;
        };
        type HSLAString = string;
        type HSLA = {
            h: number;
            s: number;
            l: number;
            a?: number;
        };
        class Colors {
            static hex2rgba(hex: HEX): RGBA;
            static rgba2hex(r: number, g: number, b: number, a?: number): HEX;
            static rgba2css(c: RGBA): RGBAString;
            static hsla2string(c: HSLA): HSLAString;
            static hsl2rgb(hsl: HSLA): RGBA;
            static rgbTohsl(rgb: RGBA): HSLA;
            static css2rgba(css: string): RGBA;
        }
    }
}
import HEX = JS.ui.HEX;
import RGBAString = JS.ui.RGBAString;
import RGBA = JS.ui.RGBA;
import HSLAString = JS.ui.HSLAString;
import HSLA = JS.ui.HSLA;
import Colors = JS.ui.Colors;
declare module JS {
    namespace ui {
        type LR = 'left' | 'right';
        type LRC = 'left' | 'right' | 'center';
        type LRTB = 'left' | 'right' | 'top' | 'bottom';
        type LOC9 = 'lt' | 'lm' | 'lb' | 'ct' | 'cm' | 'cb' | 'rt' | 'rm' | 'rb';
    }
}
import LR = JS.ui.LR;
import LRC = JS.ui.LRC;
import LRTB = JS.ui.LRTB;
import LOC9 = JS.ui.LOC9;
declare module JS {
    namespace ui {
        class KeyCode {
            static Back: number;
            static Tab: number;
            static Clear: number;
            static Enter: number;
            static shift: number;
            static Control: number;
            static Alt: number;
            static Pause: number;
            static CapsLock: number;
            static Esc: number;
            static Space: number;
            static PageUp: number;
            static PageDown: number;
            static End: number;
            static Home: number;
            static Left: number;
            static Up: number;
            static Right: number;
            static Down: number;
            static Select: number;
            static Print: number;
            static Execute: number;
            static Insert: number;
            static Delete: number;
            static Help: number;
            static 0: number;
            static 1: number;
            static 2: number;
            static 3: number;
            static 4: number;
            static 5: number;
            static 6: number;
            static 7: number;
            static 8: number;
            static 9: number;
            static a: number;
            static b: number;
            static c: number;
            static d: number;
            static e: number;
            static f: number;
            static g: number;
            static h: number;
            static i: number;
            static j: number;
            static k: number;
            static l: number;
            static m: number;
            static n: number;
            static o: number;
            static p: number;
            static q: number;
            static r: number;
            static s: number;
            static t: number;
            static u: number;
            static v: number;
            static w: number;
            static x: number;
            static y: number;
            static z: number;
            static pad0: number;
            static pad1: number;
            static pad2: number;
            static pad3: number;
            static pad4: number;
            static pad5: number;
            static pad6: number;
            static pad7: number;
            static pad8: number;
            static pad9: number;
            static 'pad*': number;
            static 'pad+': number;
            static 'pad-': number;
            static 'pad.': number;
            static 'pad/': number;
            static F1: number;
            static F2: number;
            static F3: number;
            static F4: number;
            static F5: number;
            static F6: number;
            static F7: number;
            static F8: number;
            static F9: number;
            static F10: number;
            static F11: number;
            static F12: number;
            static NumLk: number;
            static ScrLk: number;
            static ';': number;
            static '=': number;
            static ',': number;
            static '-': number;
            static '.': number;
            static '/': number;
            static '`': number;
            static '[': number;
            static '\\': number;
            static ']': number;
            static "'": number;
        }
    }
}
import KeyCode = JS.ui.KeyCode;
declare module JS {
    namespace fx {
        enum SizeMode {
            hg = "hg",
            lg = "lg",
            md = "md",
            sm = "sm",
            xs = "xs"
        }
        enum ColorMode {
            success = "success",
            danger = "danger",
            warning = "warning",
            info = "info",
            primary = "primary",
            secondary = "secondary",
            accent = "accent",
            metal = "metal",
            light = "light",
            dark = "dark"
        }
        interface WidgetListeners<T> {
            showing?: EventHandler<T>;
            shown?: EventHandler<T>;
            hiding?: EventHandler<T>;
            hidden?: EventHandler<T>;
            rendering?: EventHandler<T>;
            rendered?: EventHandler<T>;
            destroying?: EventHandler<T>;
            destroyed?: EventHandler<T>;
        }
        class WidgetConfig<W> implements IWidgetConfig {
            readonly id?: string;
            name?: string;
            tip?: string;
            style?: string;
            width?: string | number;
            height?: string | number;
            cls?: string;
            appendTo?: string | Element | JQuery;
            renderTo?: string | Element | JQuery;
            hidden?: boolean;
            sizeMode?: SizeMode;
            colorMode?: ColorMode;
            faceMode?: string | Array<string>;
            locale?: Locale;
            i18n?: Resource;
            listeners?: WidgetListeners<W>;
        }
    }
}
import SizeMode = JS.fx.SizeMode;
import ColorMode = JS.fx.ColorMode;
import WidgetConfig = JS.fx.WidgetConfig;
import WidgetListeners = JS.fx.WidgetListeners;
declare module JS {
    namespace fx {
        abstract class Widget implements IWidget {
            readonly id: string;
            widgetEl: JQuery<HTMLElement>;
            protected _eventBus: EventBus;
            protected _config: WidgetConfig<Widget>;
            protected _initialConfig: WidgetConfig<Widget>;
            constructor(cfg: WidgetConfig<Widget>);
            protected _onBeforeInit(): void;
            protected _onAfterInit(): void;
            protected _initDom(): void;
            private _initConfig;
            initialConfig<V>(key?: string): V;
            protected _onBeforeRender(): void;
            protected _onAfterRender(): void;
            render<T extends Widget>(): T;
            protected abstract _render(): void | false;
            name(): string;
            protected _hasFaceMode(key: string, cfg?: WidgetConfig<Widget>): boolean;
            protected _eachMode(type: 'sizeMode' | 'colorMode' | 'faceMode', fn: (this: Widget, mode: string) => void, cfg?: WidgetConfig<Widget>): void;
            private _isD;
            destroy(): void;
            protected _destroy(): void;
            show(): this;
            hide(): this;
            isShown(): boolean;
            on<H = EventHandler<this>>(types: string, fn: H, once?: boolean): this;
            off(types?: string): this;
            protected _fire<E>(e: E, args?: Array<any>): boolean;
            static I18N: Resource;
            private _i18nBundle;
            private _createBundle;
            protected _i18n(): JsonObject;
            protected _i18n<T>(key: string): T;
            locale(): string;
            locale(locale: string): this;
        }
    }
}
import Widget = JS.fx.Widget;
declare module JS {
    namespace fx {
        type FormWidgetEvents = WidgetEvents | 'changed' | 'validating' | 'validated' | 'loading' | 'loadsuccess' | 'loadfailure' | 'loaderror' | 'dataupdating' | 'dataupdated';
        type FormWidgetEventHanler_Changed<T> = EventHandler2<T, any, any>;
        type FormWidgetEventHanler_Validating<T> = EventHandler3<T, ValidateResult, any, string>;
        type FormWidgetEventHanler_Validated<T> = EventHandler3<T, ValidateResult, any, string>;
        type FormWidgetEventHanler_Loading<T> = EventHandler1<T, AjaxRequest>;
        type FormWidgetEventHanler_Loadsuccess<T> = EventHandler1<T, ResultSet<any>>;
        type FormWidgetEventHanler_Loadfailure<T> = EventHandler1<T, ResultSet<any>>;
        type FormWidgetEventHanler_Loaderror<T> = EventHandler1<T, AjaxResponse | Error>;
        type FormWidgetEventHanler_Dataupdating<T> = EventHandler2<T, any, any>;
        type FormWidgetEventHanler_Dataupdated<T> = EventHandler2<T, any, any>;
        interface FormWidgetListeners<T> extends WidgetListeners<T> {
            changed?: FormWidgetEventHanler_Changed<T>;
            validating?: FormWidgetEventHanler_Validating<T>;
            validated?: FormWidgetEventHanler_Validated<T>;
            loading?: FormWidgetEventHanler_Loading<T>;
            loadsuccess?: FormWidgetEventHanler_Loadsuccess<T>;
            loadfailure?: FormWidgetEventHanler_Loadfailure<T>;
            loaderror?: FormWidgetEventHanler_Loaderror<T>;
            dataupdating?: FormWidgetEventHanler_Dataupdating<T>;
            dataupdated?: FormWidgetEventHanler_Dataupdated<T>;
        }
        class FormWidgetConfig<T extends FormWidget> extends WidgetConfig<T> {
            disabled?: boolean;
            dataModel?: Klass<ListModel>;
            valueModel?: Klass<Model> | Model;
            validators?: Array<ValidatorSetting>;
            autoValidate?: boolean;
            validateMode?: 'tip' | {
                mode: 'tip';
                place?: LRTB;
            } | {
                showError: (this: T, errorMsg: string) => void;
                hideError: (this: T) => void;
            } | any;
            readonly?: boolean;
            title?: string;
            titlePlace?: 'left' | 'top';
            titleTextPlace?: LOC9;
            titleCls?: string;
            titleStyle?: string;
            titleWidth?: string | number;
            bodyCls?: string;
            bodyStyle?: string;
            data?: any;
            dataQuery?: string | AjaxRequest;
            iniValue?: any;
            listeners?: FormWidgetListeners<T>;
        }
        abstract class FormWidget extends Widget implements IValueWidget, IDataWidget {
            constructor(cfg: FormWidgetConfig<any>);
            iniValue(): any;
            iniValue(v: any, render?: boolean): this;
            readonly(): boolean;
            readonly(is: boolean): this;
            protected _onBeforeInit(): void;
            protected _onAfterInit(): void;
            disable(): this;
            enable(): this;
            isEnabled(): boolean;
            title(text: string): this;
            title(): string;
            protected abstract _bodyFragment(): string;
            protected _hAlign(): string;
            protected _vAlign(): string;
            protected _mainEl: JQuery<HTMLElement>;
            protected _render(): void;
            protected _onBeforeRender(): void;
            protected _iniValue(): void;
            protected _onAfterRender(): void;
            protected _showError(msg: string): void;
            protected _hideError(): void;
            private _getTipEl;
            protected _showTipError(msg: string): void;
            protected _hideTipError(): void;
            protected _validate(name: string, val: any, rst: ValidateResult): string | boolean;
            validate(): string | boolean;
            protected _dataModel: ListModel;
            dataModel<M>(): M;
            protected _initDataModel(): void;
            data(): any;
            data(data: any, silent?: boolean): this;
            protected _renderData(): void;
            clear(silent?: boolean): this;
            load(quy: string | AjaxRequest, silent?: boolean): Promise<ResultSet<any>>;
            reload(): this;
            protected _equalValues(newVal: any, oldVal: any): boolean;
            value(): any;
            value(val: any, silent?: boolean): this;
            protected _setValue(val: any, silent?: boolean): void;
            protected _renderValue(): void;
            reset(): this;
            protected _valueModel: Model;
            valueModel(): Model;
            protected _initValueModel(): void;
        }
    }
}
import FormWidgetConfig = JS.fx.FormWidgetConfig;
import FormWidget = JS.fx.FormWidget;
import FormWidgetEvents = JS.fx.FormWidgetEvents;
declare module JS {
    namespace fx {
        enum ButtonFaceMode {
            square = "square",
            round = "round",
            round_left = "round-left",
            round_right = "round-right",
            pill = "pill",
            pill_left = "pill-left",
            pill_right = "pill-right",
            shadow = "shadow"
        }
        interface ButtonListeners extends WidgetListeners<Button> {
            'click': EventHandler<Button>;
        }
        class ButtonConfig extends WidgetConfig<Button> {
            faceMode?: ButtonFaceMode | Array<ButtonFaceMode>;
            text?: string;
            iconCls?: string;
            cls?: string;
            outline?: boolean;
            badge?: string | {
                text: string;
                color?: ColorMode;
            };
            dropMenu?: DropMenuOptions;
            listeners?: ButtonListeners;
            disabled?: boolean;
        }
        type DropMenuOptions = {
            dir?: 'left' | 'right' | 'up' | 'down';
            items: Array<DropMenuItem>;
        };
        type DropMenuItem = {
            caption?: string;
            text?: string;
            html?: string;
            href?: string;
            selected?: boolean;
            hasDivider?: boolean;
            iconCls?: string;
            onClick?: EventHandler<Button>;
        };
        type ButtonEvents = WidgetEvents | 'click';
        class Button extends Widget {
            constructor(cfg: ButtonConfig);
            protected _mainEl: JQuery<HTMLElement>;
            protected _render(): void;
            protected _onAfterRender(): void;
            private _dropDown;
            private _dropDownItems;
            private _dropDownItem;
            disable(): this;
            enable(): this;
            toggle(): Button;
            badge(): string;
            badge(option: string | {
                text: string;
                color?: ColorMode;
            }): this;
        }
    }
}
import Button = JS.fx.Button;
import ButtonConfig = JS.fx.ButtonConfig;
import ButtonFaceMode = JS.fx.ButtonFaceMode;
import DropDownOptions = JS.fx.DropMenuOptions;
import DropDownItem = JS.fx.DropMenuItem;
import ButtonEvents = JS.fx.ButtonEvents;
import ButtonListeners = JS.fx.ButtonListeners;
declare module JS {
    namespace fx {
        type CarouselItem = {
            src: string;
            caption?: string;
            desc?: string;
            imgAlt?: string;
        };
        class CarouselConfig extends WidgetConfig<Carousel> {
            items?: Array<CarouselItem>;
            interval?: number | false;
            activeIndex?: number;
            listeners?: CarouselListeners;
        }
        type CarouselEvents = WidgetEvents | 'transiting' | 'transited';
        type CarouselEventHandler_Transiting<W> = EventHandler2<W, number, number>;
        type CarouselEventHandler_Transited<W> = EventHandler2<W, number, number>;
        interface CarouselListeners extends WidgetListeners<Carousel> {
            transiting?: CarouselEventHandler_Transiting<Carousel>;
            transited?: CarouselEventHandler_Transited<Carousel>;
        }
        class Carousel extends Widget {
            constructor(cfg: CarouselConfig);
            prev(): Carousel;
            next(): Carousel;
            pause(): Carousel;
            cycle(): Carousel;
            goto(num: number): Carousel;
            protected _destroy(): void;
            length(): number;
            add(item: CarouselItem, from?: number): this;
            remove(num: number): this;
            clear(): void;
            private _limitActive;
            private _indHtml;
            private _itemHtml;
            private _renderItems;
            protected _render(): void;
        }
    }
}
import Carousel = JS.fx.Carousel;
import CarouselEvents = JS.fx.CarouselEvents;
import CarouselListeners = JS.fx.CarouselListeners;
import CarouselConfig = JS.fx.CarouselConfig;
import CarouselItem = JS.fx.CarouselItem;
declare module JS {
    namespace fx {
        interface ChoiceOption {
            id: string | number;
            text?: string;
        }
        type ChoiceEvents = FormWidgetEvents | 'click';
        interface ChoiceListeners<T> extends FormWidgetListeners<T> {
            click?: EventHandler<T>;
        }
        class ChoiceConfig<T extends Choice> extends FormWidgetConfig<T> {
            iniValue?: string | Array<string>;
            data?: ChoiceOption[];
            textColorMode?: ColorMode;
            listeners?: ChoiceListeners<T>;
        }
        abstract class Choice extends FormWidget {
            constructor(cfg: ChoiceConfig<any>);
            protected _bodyFragment(): string;
            private _choicesHtml;
            isSelected(): boolean;
            protected abstract _getDomValue(): any;
            protected abstract _setDomValue(v: any): any;
            protected _renderData(type?: 'checkbox' | 'radio'): void;
            protected _renderValue(): void;
            protected _onAfterRender(): void;
            abstract select(values?: any): this;
            abstract unselect(values?: any): this;
            disable(): this;
            enable(): this;
            readonly(): boolean;
            readonly(is: boolean): this;
        }
    }
}
import Choice = JS.fx.Choice;
declare module JS {
    namespace fx {
        class CheckboxConfig extends ChoiceConfig<Checkbox> {
            iniValue?: Array<string>;
            faceMode?: CheckboxFaceMode | Array<CheckboxFaceMode>;
        }
        enum CheckboxFaceMode {
            square = "square",
            round = "round",
            inline = "inline",
            list = "list"
        }
        class Checkbox extends Choice {
            protected _getDomValue(): string[];
            protected _setDomValue(v: String[]): void;
            constructor(cfg: CheckboxConfig);
            protected _equalValues(newVal: Array<string>, oldVal: Array<string>): boolean;
            protected _renderData(): void;
            value(): Array<string>;
            value(val: Array<string>, silent?: boolean): this;
            select(val?: string | Array<string>): this;
            unselect(val?: string | Array<string>): this;
        }
    }
}
import CheckboxConfig = JS.fx.CheckboxConfig;
import CheckboxFaceMode = JS.fx.CheckboxFaceMode;
import Checkbox = JS.fx.Checkbox;
declare module JS {
    namespace fx {
        type InputEvents = FormWidgetEvents;
        interface InputListeners<T extends Input> extends FormWidgetListeners<T> {
        }
        class InputConfig<T extends Input> extends FormWidgetConfig<T> {
            inputCls?: string;
            inputStyle?: string;
            maxlength?: number;
            placeholder?: string;
            autoclear?: boolean;
            autofocus?: boolean;
            outline?: boolean;
            listeners?: InputListeners<T>;
        }
        abstract class Input extends FormWidget {
            constructor(cfg: InputConfig<any>);
            maxlength(): number;
            maxlength(len: number): this;
            placeholder(): string;
            placeholder(holder: string): this;
        }
    }
}
import InputEvents = JS.fx.InputEvents;
import InputListeners = JS.fx.InputListeners;
import InputConfig = JS.fx.InputConfig;
import Input = JS.fx.Input;
declare module JS {
    namespace fx {
        enum LineInputFaceMode {
            square = "square",
            round = "round",
            pill = "pill",
            shadow = "shadow"
        }
        interface LineInputIcon {
            tip?: string;
            onClick?: ((this: Input, ...args: any[]) => any);
            cls: string;
        }
        interface LineInputAddon {
            tip?: string;
            onClick?: ((this: Input, ...args: any[]) => any);
            faceMode?: ButtonFaceMode | Array<ButtonFaceMode>;
            colorMode?: ColorMode;
            outline?: boolean;
            text: string;
            gradient?: {
                from: HEX;
                to: HEX;
            };
            iconCls?: string;
            dropMenu?: DropMenuOptions;
        }
        class LineInputConfig<T extends LineInput> extends InputConfig<T> {
            inputCls?: string;
            inputStyle?: string;
            innerIcon?: string | LineInputIcon;
            leftAddon?: string | LineInputAddon;
            rightAddon?: string | LineInputAddon;
            textAlign?: LR;
            faceMode?: LineInputFaceMode | Array<LineInputFaceMode>;
        }
        abstract class LineInput extends Input {
            constructor(cfg: InputConfig<any>);
            private _inputAttrs;
            protected _inputHtml(type?: string): string;
            private _iconHtml;
            private _inputGroup;
            protected _bodyFragment(type?: string): string;
            protected _render(): void;
            protected _onAfterRender(): void;
            private _renderAddon;
            private _toAddon;
            private _renderAddons;
            protected _showError(msg: string): void;
            protected _hideError(): void;
        }
    }
}
import LineInputFaceMode = JS.fx.LineInputFaceMode;
import LineInputIcon = JS.fx.LineInputIcon;
import LineInputAddon = JS.fx.LineInputAddon;
import LineInputConfig = JS.fx.LineInputConfig;
import LineInput = JS.fx.LineInput;
declare module JS {
    namespace fx {
        type DatePickerEvents = InputEvents | 'pickershown' | 'pickerhidden';
        interface DatePickerListeners extends InputListeners<DatePicker> {
            pickershown?: EventHandler<DatePicker>;
            pickerhidden?: EventHandler<DatePicker>;
        }
        class DatePickerConfig extends LineInputConfig<DatePicker> {
            iniValue?: string | Date;
            defaultViewDate?: string | Date;
            title?: string;
            format?: string;
            minDate?: Date | string;
            maxDate?: Date | string;
            autoclose?: boolean;
            startView?: 0 | 1 | 2 | 3 | 4;
            todayBtn?: boolean;
            todayHighlight?: boolean;
            calendarWeeks?: boolean;
            clearBtn?: boolean;
            orientation?: 'auto' | 'lt' | 'lb' | 'rt' | 'rb';
            datesDisabled?: string | string[];
            daysOfWeekDisabled?: string | number[];
            daysOfWeekHighlighted?: string | number[];
            embedded?: boolean;
            multidate?: boolean | number;
            multidateSeparator?: string;
            listeners?: DatePickerListeners;
        }
        class DatePicker extends LineInput {
            private _picker;
            constructor(cfg: DatePickerConfig);
            showPicker(): DatePicker;
            hidePicker(): DatePicker;
            value(): string;
            value(val: string | Date, silent?: boolean): this;
            protected _renderValue(): this;
            protected _inputHtml(): string;
            protected _onBeforeRender(): void;
            protected _onAfterRender(): void;
            protected _destroy(): void;
        }
    }
}
import DatePickerConfig = JS.fx.DatePickerConfig;
import DatePicker = JS.fx.DatePicker;
import DatePickerEvents = JS.fx.DatePickerEvents;
import DatePickerListeners = JS.fx.DatePickerListeners;
declare module JS {
    namespace fx {
        type DateRangePickerEvents = InputEvents | 'pickershown' | 'pickerhidden' | 'pickercanceled';
        interface DateRangePickerListeners extends InputListeners<DateRangePicker> {
            pickershown?: EventHandler<DateRangePicker>;
            pickerhidden?: EventHandler<DateRangePicker>;
            pickercanceled?: EventHandler<DateRangePicker>;
        }
        class DateRangePickerConfig extends LineInputConfig<DateRangePicker> {
            readonly?: boolean;
            iniValue?: Array<string | Date>;
            format?: string;
            dateSeparator?: string;
            minDate?: Date | string;
            maxDate?: Date | string;
            minYear?: number;
            maxYear?: number;
            popDir?: 'left' | 'right' | 'center';
            dropPos?: 'down' | 'up';
            autoclose?: boolean;
            minutesPlus?: boolean;
            secondsPlus?: boolean;
            minutesStep?: number;
            ranges?: JsonObject<Array<Date>>;
            showCalendars?: boolean;
            listeners?: DateRangePickerListeners;
        }
        class DateRangePicker extends LineInput {
            private _picker;
            constructor(cfg: DateRangePickerConfig);
            private _autoFormat;
            protected _equalValues(newVal: string[], oldVal: string[]): boolean;
            private _errorType;
            value(): string[];
            value(val: string | string[] | Date[], silent?: boolean): this;
            private _formatDate;
            private _dateString;
            protected _renderValue(): Widget;
            protected _onAfterRender(): void;
            _autoclear(): void;
        }
    }
}
import DateRangePickerEvents = JS.fx.DateRangePickerEvents;
import DateRangePickerListeners = JS.fx.DateRangePickerListeners;
import DateRangePickerConfig = JS.fx.DateRangePickerConfig;
import DateRangePicker = JS.fx.DateRangePicker;
declare module JS {
    namespace fx {
        enum DialogFaceMode {
            round = "round",
            square = "square"
        }
        interface DialogButtonOption {
            text: string;
            colorMode?: ColorMode | string;
            onClick?: ((this: Dialog, e: Event, button: HTMLElement, index: number) => boolean | void);
        }
        class DialogConfig extends WidgetConfig<Dialog> {
            title?: string;
            faceMode?: DialogFaceMode;
            hidden?: boolean;
            buttons?: Array<DialogButtonOption>;
            html?: string | Element | JQuery<HTMLElement>;
            url?: string;
            autoDestroy?: boolean;
            childWidgets?: JsonObject<WidgetConfig<any>>;
            listeners?: DialogListeners;
        }
        type DialogEvents = WidgetEvents;
        interface DialogListeners extends WidgetListeners<Dialog> {
        }
        class Dialog extends Widget {
            private _children;
            constructor(config: DialogConfig);
            private _loaded;
            load(api?: string, params?: JsonObject, encode?: boolean): void;
            show<Dialog>(): this;
            hide<Dialog>(): this;
            toggle(): this;
            isShown(): boolean;
            protected _mainEl: JQuery<HTMLElement>;
            protected _render(): void;
            protected _destroy(): void;
            buttons(): JQuery;
            child<T = Widget | JsonObject<Widget>>(id?: string): T;
            private _renderChildren;
            protected _onAfterInit(): void;
        }
    }
}
import Dialog = JS.fx.Dialog;
import DialogConfig = JS.fx.DialogConfig;
import DialogEvents = JS.fx.DialogEvents;
import DialogListeners = JS.fx.DialogListeners;
import DialogFaceMode = JS.fx.DialogFaceMode;
declare module JS {
    namespace fx {
        class TextInputConfig extends LineInputConfig<TextInput> {
        }
        class TextInput extends LineInput {
            constructor(cfg: TextInputConfig);
            value(): string;
            value(val: string, silent?: boolean): this;
            protected _onAfterRender(): void;
        }
    }
}
import TextInput = JS.fx.TextInput;
import TextInputConfig = JS.fx.TextInputConfig;
declare module JS {
    namespace fx {
        class EmailInputConfig extends TextInputConfig {
            multiple?: boolean;
            innerIcon?: string | LineInputIcon;
        }
        class EmailInput extends TextInput {
            constructor(cfg: EmailInputConfig);
            protected _bodyFragment(): string;
            protected _onAfterRender(): void;
        }
    }
}
import EmailInput = JS.fx.EmailInput;
import EmailInputConfig = JS.fx.EmailInputConfig;
declare module JS {
    namespace model {
        type PageModelEvents = ListModelEvents | 'pagechanged';
        interface PageModelListeners<M = PageModel> extends ListModelListeners<M> {
            pagechanged: EventHandler2<M, number, number>;
        }
        interface PageQuery extends AjaxRequest {
            pageSize?: number;
            page?: number;
        }
        interface PageModelParametersMapping {
            totalField?: string;
            pageField?: string;
            pageSizeField?: string;
            sortersField?: string;
        }
        class PageModelConfig extends ListModelConfig {
            dataQuery?: string | PageQuery;
            readonly listeners?: PageModelListeners<this>;
            readonly parametersMapping?: PageModelParametersMapping;
        }
        class PageModel extends ListModel {
            protected _config: PageModelConfig;
            private _cacheTotal;
            constructor(cfg?: PageModelConfig);
            protected _initConfig(cfg?: PageModelConfig): JsonObject<any>;
            private _newParams;
            load<R = JsonObject[]>(quy: string | PageQuery, silent?: boolean): Promise<ResultSet<R>>;
            reload(): Promise<ResultSet<JsonObject<any>[]>>;
            loadPage(page?: number, isForce?: boolean): Promise<ResultSet<JsonObject<any>[]>>;
            total(): number;
            total(total?: number): this;
            pageSize(): number;
            pageSize(size?: number): this;
            getCurrentPage(): number;
            getPrevPage(): number;
            getNextPage(): number;
            getFirstPage(): number;
            getLastPage(): number;
            loadPrevPage(): Promise<ResultSet<JsonObject<any>[]>>;
            loadNextPage(): Promise<ResultSet<JsonObject<any>[]>>;
            loadFirstPage(): Promise<ResultSet<JsonObject<any>[]>>;
            loadLastPage(): Promise<ResultSet<JsonObject<any>[]>>;
        }
    }
}
import PageModel = JS.model.PageModel;
import PageModelConfig = JS.model.PageModelConfig;
import PageModelEvents = JS.model.PageModelEvents;
import PageQuery = JS.model.PageQuery;
declare module JS {
    namespace fx {
        enum GridFaceMode {
            striped = "striped",
            outline = "outline",
            inline = "inline"
        }
        type GridHeadStyle = {
            cls?: string;
            textAlign?: 'left' | 'center' | 'right';
        };
        type GridBodyStyle = {
            cls?: string;
            textAlign?: 'left' | 'center' | 'right';
        };
        type GridColumnOption = {
            field: string;
            text: string;
            sortable?: boolean | 'asc' | 'desc';
            width?: number | string;
            tip?: string;
            renderer?: (value: any, rowNumber: number, colNumber: number, field: string) => string;
        };
        class GridConfig extends WidgetConfig<Grid> {
            columns: Array<GridColumnOption>;
            checkable?: boolean;
            dataModel?: Klass<PageModel>;
            data?: Array<object>;
            dataQuery?: string | PageQuery;
            autoLoad?: boolean;
            headStyle?: GridHeadStyle;
            bodyStyle?: GridBodyStyle;
            pageSizes?: number[];
            pagingBar?: boolean;
            faceMode?: GridFaceMode | GridFaceMode[];
            i18n?: Resource | GridResource;
            listeners?: GridListeners;
        }
        type GridEvents = WidgetEvents | 'loadsuccess' | 'loadfailure' | 'dataupdating' | 'dataupdated' | 'selected' | 'unselected' | 'allselected' | 'allunselected' | 'rowclick' | 'cellclick';
        interface GridListeners extends WidgetListeners<Grid> {
            loadsuccess?: EventHandler<Grid>;
            loadfailure?: EventHandler<Grid>;
            dataupdating?: EventHandler<Grid>;
            dataupdated?: EventHandler<Grid>;
            selected?: EventHandler1<Grid, number>;
            unselected?: EventHandler1<Grid, number>;
            allselected?: EventHandler<Grid>;
            allunselected?: EventHandler<Grid>;
            rowclick?: EventHandler1<Grid, number>;
            cellclick?: EventHandler2<Grid, number, number>;
        }
        type GridResource = {
            firstPage: string;
            lastPage: string;
            previousPage: string;
            nextPage: string;
            rowsInfo: string;
            empty: string;
            loadingMsg: string;
        };
        class Grid extends Widget {
            static I18N: GridResource;
            constructor(cfg: GridConfig);
            getFieldName(col: number): string;
            getCellNode(row: number, col: number): JQuery<HTMLElement>;
            protected _dataModel: PageModel;
            dataModel<M extends PageModel>(): M;
            protected _initDataModel(): void;
            protected _onBeforeInit(): void;
            private _hChk;
            private _bChks;
            private _headChk;
            private _bodyChks;
            private _newCheckbox;
            private _bindHeadCheckbox;
            private _bindBodyCheckbox;
            isSelected(row: number): boolean;
            select(): any;
            select(row: number): any;
            unselect(): any;
            unselect(row: number): any;
            getSelectedIds(): string[];
            getSelectedData(): JsonObject[];
            checkable(): boolean;
            hideCheckbox(): void;
            showCheckbox(): void;
            private _colIndexOf;
            hideColumn(col: number): any;
            hideColumn(field: string): any;
            showColumn(col: number): any;
            showColumn(field: string): any;
            private _bindSortFields;
            private _bindSortField;
            private _sortField;
            private _thHtml;
            private _tdHtml;
            private _headHtml;
            private _renderBody;
            private _pageHtml;
            private _pagesHtml;
            private _pagesizeHtml;
            private _pagesizesHtml;
            private _renderPagingbar;
            private _changePageSize;
            loadPage(page: number): Promise<ResultSet<JsonObject<any>[]>>;
            clear(): this;
            protected _render(): void;
            protected _onAfterRender(): void;
            protected _renderData(): void;
            data(): any;
            data(data: any, silent?: boolean): this;
            load<M>(quy: string | PageQuery, silent?: boolean): Promise<ResultSet<M>>;
            reload(): this;
        }
    }
}
import Grid = JS.fx.Grid;
import GridFaceMode = JS.fx.GridFaceMode;
import GridResource = JS.fx.GridResource;
import GridEvents = JS.fx.GridEvents;
import GridColumnOptions = JS.fx.GridColumnOption;
import GridHeadStyle = JS.fx.GridHeadStyle;
import GridBodyStyle = JS.fx.GridBodyStyle;
import GridConfig = JS.fx.GridConfig;
import GridListeners = JS.fx.GridListeners;
declare module JS {
    namespace fx {
        enum LoadingFaceMode {
            flower = "flower",
            ring = "ring",
            bar = "bar"
        }
        class LoadingConfig {
            renderTo?: string | HTMLElement | JQuery;
            width?: number;
            transparent?: boolean;
            faceMode?: LoadingFaceMode;
            colorMode?: ColorMode;
            sizeMode?: SizeMode;
            overlay?: boolean;
            duration?: number;
            cls?: string;
            message?: string;
            listeners?: {
                showed?: (e: Event, cfg: LoadingConfig) => void;
                hidden?: (e: Event, cfg: LoadingConfig) => void;
            };
        }
        class Loading {
            static show(cfg?: LoadingConfig): void;
            static hide(el: string | HTMLElement | JQuery): void;
        }
    }
}
import Loading = JS.fx.Loading;
import LoadingFaceMode = JS.fx.LoadingFaceMode;
import LoadingConfig = JS.fx.LoadingConfig;
declare module JS {
    namespace fx {
        interface MessageBoxResult {
            value?: undefined | true | any;
            dismiss?: 'cancel' | 'backdrop' | 'close' | 'esc' | 'timer';
        }
        class MessageBoxConfig {
            title?: string;
            titleText?: string;
            text?: string;
            html?: string | JQuery;
            footer?: string | JQuery;
            type?: 'success' | 'error' | 'warning' | 'info' | 'question' | 'custom';
            backdrop?: boolean | string;
            toast?: boolean;
            target?: string;
            input?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'range' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file' | 'url';
            width?: number | string;
            background?: string;
            position?: 'top' | 'top-start' | 'top-end' | 'top-left' | 'top-right' | 'center' | 'center-start' | 'center-end' | 'center-left' | 'center-right' | 'bottom' | 'bottom-start' | 'bottom-end' | 'bottom-left' | 'bottom-right';
            grow?: 'row' | 'column' | 'fullscreen' | false;
            customClass?: string;
            timer?: number;
            animation?: boolean;
            heightAuto?: boolean;
            allowOutsideClick?: boolean;
            allowEscapeKey?: boolean;
            allowEnterKey?: boolean;
            stopKeydownPropagation?: boolean;
            keydownListenerCapture?: boolean;
            showConfirmButton?: boolean;
            showCancelButton?: boolean;
            confirmButtonText?: string;
            cancelButtonText?: string;
            confirmButtonColor?: string;
            cancelButtonColor?: string;
            confirmButtonClass?: string;
            cancelButtonClass?: string;
            reverseButtons?: boolean;
            focusConfirm?: boolean;
            focusCancel?: boolean;
            showCloseButton?: boolean;
            imageUrl?: string;
            imageWidth?: number;
            imageHeight?: number;
            imageAlt?: string;
            imageClass?: string;
            inputPlaceholder?: string;
            inputValue?: string;
            inputOptions?: JsonObject<string>;
            inputAutoTrim?: boolean;
            inputAttributes?: {
                [attribute: string]: string;
            };
            inputValidator?: (inputValue: string) => Promise<string | null>;
            inputClass?: string;
            listeners?: {
                confirming?: (e: Event, inputValue: any) => Promise<any | void>;
                opening?: (e: Event, modal: HTMLElement) => void;
                opened?: (e: Event, modal: HTMLElement) => void;
                closing?: (e: Event, modal: HTMLElement) => void;
                closed?: (e: Event) => void;
            };
        }
        class MessageBox {
            static show(config: MessageBoxConfig): Promise<MessageBoxResult>;
            static clickConfirm(): void;
            static clickCancel(): void;
            static disableConfirmButton(): void;
            static enableConfirmButton(): void;
            static disableButtons(): void;
            static getTitle(): string;
            static getContent(): string;
            static close(): void;
            static isShown(): boolean;
        }
    }
}
import MessageBox = JS.fx.MessageBox;
import MessageBoxResult = JS.fx.MessageBoxResult;
declare module JS {
    namespace fx {
        class NumberInputConfig extends LineInputConfig<NumberInput> {
            min?: number;
            max?: number;
            step?: number;
            iniValue?: number;
            fractionDigits?: number;
            textAlign?: 'left' | 'right';
        }
        class NumberInput extends LineInput {
            constructor(cfg: NumberInputConfig);
            protected _onAfterRender(): void;
            protected _bodyFragment(): string;
            min(min?: number): number;
            max(max?: number): number;
            step(st?: number): number;
            value(): number;
            value(val: number, silent?: boolean): this;
            protected _renderValue(): void;
        }
    }
}
import NumberInput = JS.fx.NumberInput;
import NumberInputConfig = JS.fx.NumberInputConfig;
declare module JS {
    namespace fx {
        class PasswordConfig extends TextInputConfig {
            visible?: boolean;
        }
        class Password extends TextInput {
            constructor(cfg: PasswordConfig);
            protected _render(): void;
            protected _bodyFragment(): string;
            private _visible;
            visible(visible?: boolean): boolean;
            toggleVisible(): void;
        }
    }
}
import Password = JS.fx.Password;
import PasswordConfig = JS.fx.PasswordConfig;
declare module JS {
    namespace fx {
        type PopupEvents = WidgetEvents;
        interface PopupListeners extends WidgetListeners<Popup> {
        }
        class PopupConfig extends WidgetConfig<Popup> {
            disabled?: boolean;
            hidden?: boolean;
            target: string | HTMLElement | JQuery;
            animation?: boolean;
            place?: LRTB | 'auto';
            title?: string;
            content: string | HTMLElement;
            htmlable?: boolean;
            template?: string;
            trigger?: Bootstrap.Trigger;
            listeners?: PopupListeners;
        }
        class Popup extends Widget {
            private _pop;
            constructor(cfg: PopupConfig);
            toggle(): this;
            show(): this;
            isShown(): boolean;
            hide(): this;
            enable(): this;
            disable(): void;
            isEnable(): boolean;
            protected _destroy(): void;
            protected _onAfterInit(): void;
            protected _render(): false;
        }
    }
}
import Popup = JS.fx.Popup;
import PopupEvents = JS.fx.PopupEvents;
import PopupListeners = JS.fx.PopupListeners;
declare module JS {
    namespace fx {
        enum ProgressFaceMode {
            square = "square",
            round = "round",
            striped = "striped",
            animated = "animated"
        }
        class ProgressConfig extends FormWidgetConfig<Progress> {
            iniValue?: number;
            height?: number;
            faceMode?: ProgressFaceMode | ProgressFaceMode[];
        }
        class Progress extends FormWidget {
            constructor(config: ProgressConfig);
            value(): number;
            value(val: number, silent?: boolean): this;
            height(): number;
            height(val: number): this;
            protected _bodyFragment(): string;
            disable(): this;
            enable(): this;
        }
    }
}
import Progress = JS.fx.Progress;
import ProgressFaceMode = JS.fx.ProgressFaceMode;
import ProgressConfig = JS.fx.ProgressConfig;
declare module JS {
    namespace fx {
        class RadioConfig extends ChoiceConfig<Radio> {
            iniValue?: string;
            faceMode?: RadioFaceMode | Array<RadioFaceMode>;
        }
        enum RadioFaceMode {
            dot = "dot",
            ring = "ring",
            inline = "inline",
            list = "list"
        }
        class Radio extends Choice {
            protected _getDomValue(): string;
            protected _setDomValue(v: string): void;
            constructor(cfg: RadioConfig);
            value(): string;
            value(val: string, silent?: boolean): this;
            protected _renderData(): void;
            select(val?: string): this;
            unselect(): this;
        }
    }
}
import RadioConfig = JS.fx.RadioConfig;
import RadioFaceMode = JS.fx.RadioFaceMode;
import Radio = JS.fx.Radio;
declare module JS {
    namespace fx {
        type RangeSliderEvents = FormWidgetEvents;
        interface RangeSliderListeners extends FormWidgetListeners<RangeSlider> {
        }
        enum RangeSliderFaceMode {
            flat = "flat",
            big = "big",
            modern = "modern",
            sharp = "sharp",
            round = "round",
            square = "square"
        }
        class RangeSliderConfig extends FormWidgetConfig<RangeSlider> {
            iniValue?: number | number[];
            listeners?: RangeSliderListeners;
            type?: 'single' | 'double';
            step?: number;
            data?: Array<number>;
            scaled?: boolean;
            scales?: number;
            minInterval?: number;
            maxInterval?: number;
            fromFixed?: boolean;
            fromMin?: number;
            fromMax?: number;
            fromShadow?: boolean;
            toFixed?: boolean;
            toMin?: number;
            toMax?: number;
            toShadow?: boolean;
            faceMode?: RangeSliderFaceMode;
            hideMinMax?: boolean;
            hideFromTo?: boolean;
            sliderCls?: string;
            format?: string | Function;
            dataPrefix?: string;
            dataPostfix?: string;
            maxValuePostfix?: string;
            closeValuesDecorate?: boolean;
            closeValuesSeparator?: string;
            valuesSeparator?: string;
        }
        class RangeSlider extends FormWidget {
            private _slider;
            constructor(cfg: RangeSliderConfig);
            private _getFromTo;
            private _transfer;
            protected _destroy(): void;
            protected _bodyFragment(): string;
            protected _onBeforeRender(): void;
            protected _onAfterRender(): void;
            protected _iniValue(): void;
            data(): Array<number>;
            data(data: Array<number>, silent?: boolean): this;
            protected _renderData(): void;
            value(): number | number[];
            value(val: number | number[], silent?: boolean): this;
            _renderValue(): void;
            maxValue(): number;
            minValue(): number;
        }
    }
}
import RangeSliderFaceMode = JS.fx.RangeSliderFaceMode;
import RangeSliderConfig = JS.fx.RangeSliderConfig;
import RangeSliderEvents = JS.fx.RangeSliderEvents;
import RangeSliderListeners = JS.fx.RangeSliderListeners;
import RangeSlider = JS.fx.RangeSlider;
declare module JS {
    namespace fx {
        enum RowsInputFaceMode {
            square = "square",
            round = "round",
            shadow = "shadow"
        }
        interface RowsInputCounterOptions {
            tpl?: string;
            place?: 'left' | 'right';
            cls?: string;
        }
        class RowsInputConfig<T extends RowsInput> extends InputConfig<T> {
            counter?: false | RowsInputCounterOptions;
            iniValue?: string;
            faceMode?: RowsInputFaceMode | RowsInputFaceMode[];
        }
        abstract class RowsInput extends Input {
            constructor(cfg: RowsInputConfig<RowsInput>);
            value(): string;
            value(val: string, silent?: boolean): this;
            private _counterHtml;
            protected _updateCounter(): void;
            protected _setValue(val: any, silent?: boolean): void;
            protected _showError(msg: string): void;
            protected _hideError(): void;
        }
    }
}
import RowsInput = JS.fx.RowsInput;
import RowsInputConfig = JS.fx.RowsInputConfig;
import RowsInputFaceMode = JS.fx.RowsInputFaceMode;
declare module JS {
    namespace fx {
        enum SelectFaceMode {
            square = "square",
            round = "round",
            pill = "pill",
            shadow = "shadow"
        }
        type SelectEvents = FormWidgetEvents | 'selected' | 'unselected';
        interface SelectListeners extends FormWidgetListeners<Select> {
            selected?: EventHandler1<Select, SelectOption[]>;
            unselected?: EventHandler1<Select, SelectOption[]>;
        }
        class SelectOption {
            id: string | number;
            text: string;
            selected?: boolean;
            title?: string;
            disabled?: boolean;
            children?: Array<SelectOption>;
        }
        class SelectConfig extends FormWidgetConfig<Select> {
            rtl?: boolean;
            outline?: boolean;
            faceMode?: SelectFaceMode | SelectFaceMode[];
            placeholder?: string;
            autoSelectFirst?: boolean;
            iniValue?: string | string[];
            data?: Array<SelectOption>;
            crud?: boolean;
            multiple?: boolean;
            allowClear?: boolean;
            maximumSelectionLength?: number;
            formatSelection?: (object: any, container: JQuery, escapeMarkup: (markup: string) => string) => string;
            formatResult?: (object: any, container: JQuery, query: any, escapeMarkup: (markup: string) => string) => string;
            width?: string | number;
            autoSearch?: boolean;
            minimumInputLength?: number;
            inputable?: boolean;
            autoEscape?: boolean;
            optionRender?: (this: Select, option: SelectOption, optionEl: JQuery) => string;
            selectionRender?: (this: Select, option: SelectOption, optionEl: JQuery) => string;
            listeners?: SelectListeners;
        }
        class Select extends FormWidget implements ICRUDWidget<JsonObject[]> {
            constructor(cfg: SelectConfig);
            load(api: string | AjaxRequest): Promise<ResultSet<any>>;
            iniValue(): string | string[];
            iniValue(v: string | string[], render?: boolean): this;
            protected _destroy(): void;
            protected _bodyFragment(): string;
            protected _onAfterRender(): void;
            private _optionHtml;
            private _initSelect2;
            addOption(opt: SelectOption): Select;
            addOptions(data: Array<SelectOption>): Select;
            removeOption(id: string | number): Select;
            removeOptions(ids: Array<string | number>): Select;
            select(i: number, silent?: boolean): void;
            isCrud(): boolean;
            crudValue(): JsonObject[];
            data(): SelectOption[];
            data(data: SelectOption[], silent?: boolean, mode?: 'append'): this;
            data(data: Array<string | number>, silent?: boolean, mode?: 'remove'): this;
            protected _iniValue(): void;
            protected _renderData(): void;
            private _renderDataBy;
            protected _renderValue(): void;
            protected _equalValues(newVal: string | string[], oldVal: string | string[]): boolean;
            value(): string | string[];
            value(val: string | string[], silent?: boolean): this;
            protected _showError(msg: string): void;
            protected _hideError(): void;
        }
    }
}
import Select = JS.fx.Select;
import SelectFaceMode = JS.fx.SelectFaceMode;
import SelectEvents = JS.fx.SelectEvents;
import SelectOption = JS.fx.SelectOption;
import SelectConfig = JS.fx.SelectConfig;
declare module JS {
    namespace fx {
        type SiderEvents = WidgetEvents | 'opening' | 'opened' | 'closing' | 'closed' | 'loaded';
        interface SiderListeners extends WidgetListeners<Sider> {
            opening?: EventHandler<Sider>;
            opened?: EventHandler<Sider>;
            closing?: EventHandler<Sider>;
            closed?: EventHandler<Sider>;
            loaded?: EventHandler1<Sider, Window>;
        }
        enum SiderFaceMode {
            over = "over",
            overlay = "overlay",
            push = "push"
        }
        class SiderConfig extends WidgetConfig<Sider> {
            title?: string;
            titleCls?: string;
            titleStyle?: string;
            hidden?: boolean;
            width?: string | number;
            faceMode?: SiderFaceMode;
            place?: 'left' | 'right';
            escKey?: boolean;
            speed?: number;
            url?: string;
            html?: string | Element | JQuery;
            trigger?: string | Element | JQuery;
            listeners?: SiderListeners;
        }
        class Sider extends Widget {
            private _overlay;
            constructor(cfg: SiderConfig);
            toggle(): void;
            show(): this;
            hide(): this;
            loadHtml(html: string | Element | JQuery): this;
            loadUrl(url: string): this;
            reload(): this;
            getFrame(): HTMLElement;
            protected _onAfterInit(): void;
            protected _mainEl: JQuery<HTMLElement>;
            protected _render(): void;
            protected _destroy(): void;
            title(): string;
            title(text: string): this;
        }
    }
}
import SiderFaceMode = JS.fx.SiderFaceMode;
import SiderConfig = JS.fx.SiderConfig;
import SiderEvents = JS.fx.SiderEvents;
import SiderListeners = JS.fx.SiderListeners;
import Sider = JS.fx.Sider;
declare module JS {
    namespace fx {
        enum SwitchFaceMode {
            shadow = "shadow"
        }
        class SwitchConfig extends FormWidgetConfig<Switch> {
            iniValue?: 'on' | 'off';
            faceMode?: SwitchFaceMode;
            listeners?: SwitchListeners;
        }
        type SwitchEvents = FormWidgetEvents | 'on' | 'off';
        interface SwitchListeners extends FormWidgetListeners<Switch> {
            on?: EventHandler<Switch>;
            off?: EventHandler<Switch>;
        }
        class Switch extends FormWidget {
            constructor(config: SwitchConfig);
            protected _onAfterRender(): void;
            protected _bodyFragment(): string;
            value(): 'on' | 'off';
            value(val: 'on' | 'off', silent?: boolean): this;
            _renderValue(): void;
            toggle(): this;
        }
    }
}
import Switch = JS.fx.Switch;
import SwitchFaceMode = JS.fx.SwitchFaceMode;
import SwitchEvents = JS.fx.SwitchEvents;
import SwitchConfig = JS.fx.SwitchConfig;
declare module JS {
    namespace fx {
        enum TabFaceMode {
            horizontal = "horizontal",
            vertical = "vertical",
            pill = "pill",
            outline = "outline",
            underline = "underline"
        }
        type TabEvents = WidgetEvents | 'activing' | 'actived';
        interface TabListeners extends WidgetListeners<Tab> {
            activing?: (this: Tab, e: Event, toEl: JQuery, fromEl: JQuery) => void;
            actived?: (this: Tab, e: Event, toEl: JQuery, fromEl: JQuery) => void;
        }
        type TabItem = {
            heading: string;
            content?: string | Element | JQuery;
            disabled?: boolean;
        };
        class TabConfig extends WidgetConfig<Tab> {
            activeIndex?: number;
            faceMode?: TabFaceMode | Array<TabFaceMode>;
            data?: TabItem[];
            headCls?: string;
            headLeftWidth?: string | number;
            headStyle?: string;
            listeners?: TabListeners;
        }
        class Tab extends Widget {
            constructor(cfg: TabConfig);
            disableTab(num: number): this;
            enableTab(num: number): this;
            isEnabledTab(num: number): boolean;
            activeTab(num: number): this;
            isActivedTab(num: number): boolean;
            private _limitIndex;
            hideTab(num: number): this;
            showTab(num: number): this;
            isShownTab(num: number): boolean;
            getActiveIndex(): number;
            clear(): this;
            tabs(): TabItem[];
            tabs(items: TabItem[]): this;
            addTab(tabs: TabItem | TabItem[], from?: number): this;
            removeTab(num: number): this;
            removeTabHeading(heading: string): this;
            length(): number;
            private _head;
            private _content;
            private _html;
            protected _render(): void;
            protected _destroy(): void;
        }
    }
}
import Tab = JS.fx.Tab;
import TabFaceMode = JS.fx.TabFaceMode;
import TabEvents = JS.fx.TabEvents;
import TabListeners = JS.fx.TabListeners;
import TabItem = JS.fx.TabItem;
import TabConfig = JS.fx.TabConfig;
declare module JS {
    namespace fx {
        class TelInputConfig extends LineInputConfig<TelInput> {
            innerIcon?: string | LineInputIcon;
        }
        class TelInput extends TextInput {
            constructor(cfg: TelInputConfig);
            protected _bodyFragment(): string;
        }
    }
}
import TelInput = JS.fx.TelInput;
import TelInputConfig = JS.fx.TelInputConfig;
declare module JS {
    namespace fx {
        class TextAreaConfig extends RowsInputConfig<TextArea> {
            resize?: 'auto' | 'both' | 'vertical' | 'horizontal' | 'none';
            rows?: number;
        }
        class TextArea extends RowsInput {
            constructor(cfg: TextAreaConfig);
            protected _bodyFragment(): string;
            protected _renderValue(): void;
            protected _onAfterRender(): void;
            protected _showError(msg: string): void;
            protected _hideError(): void;
        }
    }
}
import TextArea = JS.fx.TextArea;
import TextAreaConfig = JS.fx.TextAreaConfig;
declare module JS {
    namespace fx {
        interface TextEditorButtonOptions {
            name: string;
            html: string;
            tip?: string;
            onClick: (this: TextEditor, options: TextEditorButtonOptions) => void;
        }
        class TextEditorConfig extends RowsInputConfig<TextEditor> {
            buttons?: Array<TextEditorButtonOptions>;
            toolbar?: Array<any>;
            maxlength?: number;
            placeholder?: string;
            disableDragAndDrop?: boolean;
            fontNames?: string[];
            height?: number;
            width?: number;
            listeners?: TextEditorListeners;
        }
        type TextEditorEvents = FormWidgetEvents | 'init' | 'keyup' | 'keydown' | 'mousedown' | 'mouseup' | 'paste' | 'enter' | 'imageupload';
        interface TextEditorListeners extends FormWidgetListeners<TextEditor> {
            init?: EventHandler<TextEditor>;
            keyup?: EventHandler1<TextEditor, number>;
            keydown?: EventHandler1<TextEditor, number>;
            mousedown?: EventHandler1<TextEditor, number>;
            mouseup?: EventHandler1<TextEditor, number>;
            paste?: EventHandler<TextEditor>;
            enter?: EventHandler<TextEditor>;
            imageupload?: EventHandler1<TextEditor, File[]>;
        }
        class TextEditor extends RowsInput {
            constructor(cfg: TextEditorConfig);
            undo(): this;
            redo(): this;
            readonly(): boolean;
            readonly(is: boolean): this;
            disable(): this;
            enable(): this;
            focus(): this;
            insertImage(url: string, filename?: string | ((this: TextEditor, image: JQuery<HTMLElement>) => void)): this;
            insertNode(node: Node): this;
            insertText(text: string): this;
            insertHtml(html: string): this;
            insertLink(text: string, href?: string, isNewWindow?: boolean): this;
            protected _bodyFragment(type?: string): string;
            protected _destroy(): void;
            protected _onAfterRender(): void;
            protected _onAfterInit(): void;
            isEmpty(): JQuery<HTMLElement>;
            value(): string;
            value(val: string): this;
            protected _iniValue(): void;
            protected _getDomValue(): string;
            protected _showError(msg: string): void;
            protected _hideError(): void;
        }
    }
}
import TextEditor = JS.fx.TextEditor;
import TextEditorEvents = JS.fx.TextEditorEvents;
import TextEditorConfig = JS.fx.TextEditorConfig;
declare module JS {
    namespace fx {
        type ToastType = 'success' | 'info' | 'warning' | 'error';
        export interface ToastListeners {
            shown?: (e: Event, type: ToastType) => void;
            hidden?: (e: Event, type: ToastType) => void;
            click?: (e: Event, type: ToastType) => void;
            closeclick?: (e: Event, type: ToastType) => void;
        }
        export class ToastConfig {
            cls?: string;
            htmlable?: boolean;
            rtl?: boolean;
            title?: string;
            message?: string;
            type?: ToastType;
            closeButton?: boolean;
            progressBar?: boolean;
            newestOnTop?: boolean;
            place?: 'lt' | 'lb' | 'ct' | 'cb' | 'rt' | 'rb';
            timeout?: number;
            listeners?: ToastListeners;
        }
        export class Toast {
            static show(cfg: ToastConfig): void;
            static clearAll(): void;
        }
        export {};
    }
}
import Toast = JS.fx.Toast;
import ToastConfig = JS.fx.ToastConfig;
import ToastListeners = JS.fx.ToastListeners;
declare module JS {
    namespace util {
        type MimeFile = {
            id: string;
            mime?: string;
            name: string;
            ext?: string;
            size?: number;
            uri: string;
        };
        type FileExts = {
            title?: string;
            extensions?: string;
            mimeTypes?: string;
        };
        class MimeFiles {
            static SOURCE_FILES: FileExts;
            static IMAGE_FILES: FileExts;
            static DOC_FILES: FileExts;
            static COMPRESSED_FILES: FileExts;
            static VIDEO_FILES: FileExts;
            static AUDIO_FILES: FileExts;
            static WEB_FILES: FileExts;
        }
        enum FileSizeUnit {
            B = "B",
            KB = "KB",
            MB = "MB",
            GB = "GB",
            TB = "TB"
        }
        type FileReadListener = {
            abort?: (this: File, e: ProgressEvent) => void;
            error?: (this: File, e: ProgressEvent) => void;
            load?: (this: File, e: ProgressEvent) => void;
            loadend?: (this: File, e: ProgressEvent) => void;
            loadstart?: (this: File, e: ProgressEvent) => void;
            progress?: (this: File, e: ProgressEvent) => void;
        };
        class Files {
            static ONE_KB: number;
            static ONE_MB: number;
            static ONE_GB: number;
            static ONE_TB: number;
            private static _createReader;
            static readAsArrayBuffer(file: File, listener: FileReadListener): void;
            static readAsBinaryString(file: File, listener: FileReadListener): void;
            static readAsDataURL(file: File, listener: FileReadListener): void;
            static readAsText(file: File, listener: FileReadListener): void;
            static getFileName(path: string): string;
            static getExt(path: string): string;
            static isFileExt(path: string, exts: string): boolean;
            static isSourceFile(path: string): boolean;
            static isImageFile(path: string): boolean;
            static isDocFile(path: string): boolean;
            static isAudioFile(path: string): boolean;
            static isVideoFile(path: string): boolean;
            static isCompressedFile(path: string): boolean;
            static isWebFile(path: string): boolean;
            static convertSize(size: string | number, orgUnit: FileSizeUnit, tarUnit: FileSizeUnit): number;
            static toSizeString(byte: string | number, sizeUnit?: FileSizeUnit): string;
        }
    }
}
import MimeFile = JS.util.MimeFile;
import FileExts = JS.util.FileExts;
import MimeFiles = JS.util.MimeFiles;
import FileSizeUnit = JS.util.FileSizeUnit;
import Files = JS.util.Files;
declare module JS {
    namespace fx {
        enum UploaderFaceMode {
            list = "list",
            image = "image",
            square = "square",
            round = "round",
            shadow = "shadow"
        }
        class UploaderConfig extends FormWidgetConfig<Uploader> {
            readonly?: boolean;
            server?: string;
            dnd?: boolean;
            paste?: boolean | 'body';
            accept?: FileExts;
            thumb?: {
                width?: number;
                height?: number;
            };
            compress?: {
                width?: number;
                height?: number;
            };
            maxNumbers?: number;
            maxTotalSize?: number;
            maxSingleSize?: number;
            duplicate?: boolean;
            needProgerss?: boolean;
            multiple?: boolean;
            fieldName?: string;
            uploadData?: JsonObject;
            faceMode?: UploaderFaceMode | UploaderFaceMode[];
            i18n?: Resource | UploaderResource;
            iniValue?: MimeFile[];
            data?: MimeFile[];
            dataFormat?: ResultSetFormat | ((this: Uploader, rawData: any) => ResultSet<MimeFile[]>);
            listeners?: UploaderListeners;
        }
        interface UploaderListeners extends FormWidgetListeners<Uploader> {
            adding?: EventHandler1<Uploader, MimeFile>;
            added?: EventHandler1<Uploader, MimeFile>;
            removed?: EventHandler1<Uploader, MimeFile>;
            uploading?: EventHandler1<Uploader, MimeFile>;
            uploadprogress?: EventHandler2<Uploader, MimeFile, number>;
            uploadsuccess?: EventHandler2<Uploader, MimeFile, any>;
            uploadfailure?: EventHandler2<Uploader, MimeFile, string>;
            uploaded?: EventHandler1<Uploader, MimeFile>;
            beginupload?: EventHandler<Uploader>;
            endupload?: EventHandler<Uploader>;
        }
        type UploaderEvents = FormWidgetEvents | 'adding' | 'added' | 'removed' | 'uploading' | 'uploadprogress' | 'uploadsuccess' | 'uploaderror' | 'uploaded' | 'beginupload' | 'endupload';
        type UploaderResource = {
            pickTitle: string;
            pickTip: string;
            retryTip: string;
            removeTip: string;
            viewDenied: string;
            exceedMaxSize: string;
            wrongDuplicate: string;
            wrongType: string;
            exceedNumbers: string;
            exceedMaxTotalSize: string;
        };
        class Uploader extends FormWidget implements ICRUDWidget<MimeFile[]> {
            static I18N: UploaderResource;
            private _uploader;
            constructor(cfg: UploaderConfig);
            protected _initUploader(cfg: UploaderConfig): void;
            protected _showError(msg: string): void;
            protected _hideError(): void;
            protected _onAfterRender(): void;
            private _createShadow;
            readonly(): boolean;
            readonly(is: boolean): this;
            disable(): this;
            enable(): this;
            private _pickText;
            protected _bodyFragment(): string;
            isCrud(): boolean;
            crudValue(): MimeFile[];
            iniValue(): MimeFile[];
            iniValue(v: MimeFile[], render?: boolean): this;
            value(): MimeFile[];
            value(file: MimeFile | MimeFile[]): this;
            protected _equalValues(newVal: MimeFile[], oldVal: MimeFile[]): boolean;
            add(file: MimeFile | MimeFile[]): this;
            remove(id: string | string[]): this;
            data(): MimeFile[];
            data(data: MimeFile[]): this;
            private _onUploadSuccess;
            private _onUploadFail;
            private _onFileDequeued;
            private _fileIcon;
            private _onFileQueued;
            private _renderFile;
            private _makeThumb;
            private _bindActions;
            private _toMimeFiles;
            private _toMimeFile;
            private _toWUFile;
            protected _removeFile(wuFileId: string): this;
            protected _retryFile(wuFileId: string): this;
            protected _addFiles(files: MimeFile[]): this;
            inProgress(): boolean;
        }
    }
}
import Uploader = JS.fx.Uploader;
import UploaderEvents = JS.fx.UploaderEvents;
import UploaderConfig = JS.fx.UploaderConfig;
import UploaderFaceMode = JS.fx.UploaderFaceMode;
import UploaderResource = JS.fx.UploaderResource;
declare module JS {
    namespace ioc {
        interface IComponent {
            initialize(): any;
            destroy(): any;
        }
        class Components {
            private static _cmps;
            static get<T>(klassName: string): T;
            static get<T>(klass: Klass<T>): T;
            static add<T>(klassName: string): T;
            static add<T>(klass: Klass<T>): T;
            static remove(klassName: string): any;
            static remove(klassName: Klass<any>): any;
            static clear(): void;
            private static _injectFields;
        }
    }
}
import IComponent = JS.ioc.IComponent;
import Components = JS.ioc.Components;
declare module JS {
    namespace ioc {
        function component(className: string): any;
        function inject(): any;
    }
}
import component = JS.ioc.component;
import inject = JS.ioc.inject;
declare module JS {
    namespace lang {
        type ThreadRunner = {
            id: string;
            imports: (...urls: string[]) => void;
            onposted: (data: any) => void;
            postMain: (data: any) => void;
            callMain: (fnName: string, ...args: any[]) => void;
            terminate: () => void;
        };
        interface Runnable {
            run: ((this: ThreadRunner) => void) | URLString;
        }
        enum ThreadState {
            NEW = "NEW",
            RUNNING = "RUNNING",
            TERMINATED = "TERMINATED",
            DESTROYED = "DESTROYED"
        }
        type ThreadPreload = string | string[];
        class Thread implements Runnable {
            readonly id: string;
            private _wk;
            private _bus;
            private _state;
            private _url;
            private _libs;
            constructor(target?: Runnable | {
                run: (this: ThreadRunner) => void;
                [key: string]: any;
            }, preload?: ThreadPreload);
            getState(): String;
            run(): void;
            private _define;
            private _predefine;
            private _stringify;
            isRunning(): boolean;
            start(): this;
            terminate(): this;
            destroy(): void;
            isDestroyed(): boolean;
            on(e: 'message', fn: EventHandler<this>): this;
            on(e: 'error', fn: EventHandler<this>): this;
            off(e: 'message' | 'error'): this;
            private _warn;
            postThread(data: any, transfer?: Array<ArrayBuffer | MessagePort | ImageBitmap>): this;
            static initContext(): ThreadRunner;
            private static _defines;
        }
    }
}
import Runnable = JS.lang.Runnable;
import Thread = JS.lang.Thread;
import ThreadRunner = JS.lang.ThreadRunner;
import ThreadState = JS.lang.ThreadState;
import ThreadPreload = JS.lang.ThreadPreload;
declare module JS {
    namespace store {
        type StorePrimitiveType = PrimitiveType | Date | JsonObject<PrimitiveType> | Array<PrimitiveType>;
        export type StoreDataType = StorePrimitiveType | JsonObject<StorePrimitiveType> | Array<StorePrimitiveType>;
        export class StoreHelper {
            static toString(value: StoreDataType): string;
            static parse<T = StoreDataType>(data: string): T;
        }
        export {};
    }
}
import StoreDataType = JS.store.StoreDataType;
import StoreHelper = JS.store.StoreHelper;
declare module JS {
    namespace store {
        class CookieStore {
            static EXPIRES_DATETIME: string;
            static PATH: string;
            static DOMAIN: string;
            static get<T = StoreDataType>(key: string): T;
            static set(key: string, value: StoreDataType, expireHours?: number, path?: string): void;
            static remove(key: string): void;
            static clear(): void;
        }
    }
}
import CookieStore = JS.store.CookieStore;
declare module JS {
    namespace store {
        class LocalStore {
            static get<T extends StoreDataType>(key: string): T;
            static set(key: string, value: StoreDataType): void;
            static remove(key: string): void;
            static key(i: number): string;
            static size(): number;
            static clear(): void;
        }
    }
}
import LocalStore = JS.store.LocalStore;
declare module JS {
    namespace store {
        class SessionStore {
            static get<T extends StoreDataType>(key: string): T;
            static set(key: string, value: StoreDataType): void;
            static remove(key: string): void;
            static key(i: number): string;
            static size(): number;
            static clear(): void;
        }
    }
}
import SessionStore = JS.store.SessionStore;
declare module JS {
    namespace ui {
        interface CustomElementConfig {
            tagName: string;
            extendsTagName?: string;
            onConstructor?: (this: CustomElement, cfg: CustomElementConfig) => void;
            onCreated?: (this: CustomElement) => void;
            onDestroyed?: (this: CustomElement) => void;
            onAdopted?: (this: CustomElement) => void;
            onAttributeChanged?: (this: CustomElement, attrName: string, oldVal: any, newVal: any) => void;
        }
        class CustomElement extends HTMLElement {
            private _config;
            constructor(cfg: CustomElementConfig);
            connectedCallback(): void;
            disconnectedCallback(): void;
            adoptedCallback(): void;
            attributeChangedCallback(attrName: string, oldVal: any, newVal: any): void;
            static define(config: CustomElementConfig): HTMLElement;
        }
    }
}
import CustomElementConfig = JS.ui.CustomElementConfig;
import CustomElement = JS.ui.CustomElement;
declare module JS {
    namespace unit {
        class TestCase {
            protected name: string;
            constructor(name?: string);
            getName(): string;
            protected setUp(): void;
            protected tearDown(): void;
            countTests(): number;
            private _createResult;
            run(result?: TestResult): TestResult;
            runMethod(name: string): void;
            private _count;
            private _methods;
            getTestMethods(): {};
            private _addTestMethods;
            addTestMethod(method: Method): void;
        }
    }
}
import TestCase = JS.unit.TestCase;
declare module JS {
    namespace unit {
        class TestFailure {
            private _method;
            private _error;
            constructor(failed: Method, error: Error);
            failedMethod(): Method;
            thrownError(): Error;
            isFailure(): boolean;
        }
    }
}
import TestFailure = JS.unit.TestFailure;
declare module JS {
    namespace unit {
        interface TestListener {
            addError(e: Error, method: Method, tc: TestCase): void;
            addFailure(e: AssertError, method: Method, tc: TestCase): void;
            endTest(method: Method, tc: TestCase): void;
            startTest(method: Method, tc: TestCase): void;
            endSuite(suite: TestSuite, result: TestResult): void;
            startSuite(suite: TestSuite, result: TestResult): void;
        }
    }
}
import TestListener = JS.unit.TestListener;
declare module JS {
    namespace unit {
        class TestResult {
            private _fails;
            private _errors;
            private _failCount;
            private _errorCount;
            private _listeners;
            private _isStoped;
            private _runCount;
            constructor();
            isSuccessTestMethod(methodName: string, caseName: string): boolean;
            errors(): JsonObject<TestFailure>;
            failures(): JsonObject<TestFailure>;
            runCount(): number;
            shouldStop(): boolean;
            addListener(listener: TestListener): void;
            removeListener(listener: TestListener): void;
            addError(e: Error, method: Method, test: TestCase): void;
            addFailure(e: AssertError, method: Method, test: TestCase): void;
            endTest(method: Method, test: TestCase): void;
            startTest(method: Method, test: TestCase): void;
            stop(): void;
            failureCount(): number;
            errorCount(): number;
            wasSuccessful(): boolean;
            run(test: TestCase): void;
        }
    }
}
import TestResult = JS.unit.TestResult;
declare module JS {
    namespace unit {
        type TestClass = TestCase | TestSuite | Class<TestCase | TestSuite>;
        class TestSuite {
            private _name;
            private _cases;
            constructor(name?: string | TestClass | Class<TestCase | TestSuite>[]);
            getTestCases(): TestCase[];
            getName(): string;
            countTests(): number;
            run(result: TestResult): void;
            runTest(test: TestCase, result: TestResult): void;
            addTest(test: TestClass | Class<TestCase | TestSuite>[]): void;
            private _addTest;
            private _addTestMethods;
        }
    }
}
import TestSuite = JS.unit.TestSuite;
import TestClass = JS.unit.TestClass;
declare module JS {
    namespace unit {
        class TestUI implements TestListener {
            private _suite;
            private _result;
            private _startTime;
            constructor(runner: TestRunner);
            addError(): void;
            addFailure(): void;
            endTest(method: Method, test: TestCase): void;
            startTest(method: Method, test: TestCase): void;
            endSuite(): void;
            startSuite(suite: TestSuite, result: TestResult): void;
            private _COLORS;
            private _FLAGS;
            private _renderOption;
            private _addOption;
            private _printTrace;
            private _printTestCase;
            private _init;
        }
    }
}
declare module JS {
    namespace unit {
        class TestRunner {
            private _ui;
            private _result;
            private _suite;
            constructor();
            doRun(test?: TestClass): TestResult;
            doStop(): void;
            private static _test;
            static addTests(tests: Array<TestClass>): void;
            static run(test?: TestClass): TestResult;
            static load(url: string | string[], tests?: Array<TestClass>): void;
        }
    }
}
import TestRunner = JS.unit.TestRunner;
declare module JS {
    namespace util {
        class ClipBoard {
            static copyTarget(clicker: string | HTMLElement, target: string | HTMLElement): void;
            static cutTarget(clicker: string | HTMLElement, target: string | HTMLElement): void;
            private static _do;
            static copyText(clicker: string | HTMLElement, text: string): void;
        }
    }
}
import ClipBoard = JS.util.ClipBoard;
declare module JS {
    namespace util {
        class Random {
            static number(max?: number, isInt?: boolean): number;
            static number(range?: {
                min?: number;
                max: number;
            }, isInt?: boolean): number;
            static string(len?: number, chars?: string): string;
            static uuid(len?: number, radix?: number): string;
            private static _string;
        }
    }
}
import Random = JS.util.Random;
declare module JS {
    namespace util {
        interface TemplateCompileOptions extends CompileOptions {
        }
        interface CompiledTemplate extends HandlebarsTemplateDelegate {
        }
        interface TemplateHelper extends Handlebars.HelperDelegate {
        }
        class Templator {
            private _hb;
            constructor();
            compile(tpl: string, options?: TemplateCompileOptions): CompiledTemplate;
            registerHelper(name: string, fn: TemplateHelper): void;
            unregisterHelper(name: string): void;
            static safeString(s: string): any;
        }
    }
}
import Templator = JS.util.Templator;
declare module JS {
    namespace util {
        type TimerTask = (this: Timer, elapsedTime: number) => void;
        type TimerConfig = {
            delay?: number;
            loop?: boolean | number;
            interval?: number;
            intervalMode?: 'OF' | 'BF';
        };
        type TimerEvents = 'starting' | 'finished';
        enum TimerState {
            STOPPED = 0,
            RUNNING = 1,
            PAUSED = 2
        }
        class Timer {
            protected _bus: EventBus;
            protected _cfg: TimerConfig;
            protected _tick: TimerTask;
            protected _timer: any;
            protected _sta: TimerState;
            protected _ts0: any;
            protected _ts: number;
            protected _et: number;
            protected _pt: number;
            protected _count: number;
            constructor(tick: TimerTask, cfg?: TimerConfig);
            on(type: string, fn: EventHandler<this>): this;
            off(type: string, fn?: EventHandler<this>): this;
            count(): number;
            config(): TimerConfig;
            config(cfg?: TimerConfig): this;
            pause(): this;
            protected _cancelTimer(): void;
            protected _reset(): void;
            stop(): this;
            protected _finish(): void;
            getState(): TimerState;
            fps(): number;
            maxFPS(): number;
            protected _cycle(skip?: boolean): void;
            start(): void;
        }
    }
}
import Timer = JS.util.Timer;
import TimerState = JS.util.TimerState;
import TimerEvents = JS.util.TimerEvents;
import TimerTask = JS.util.TimerTask;
import TimerOptions = JS.util.TimerConfig;
declare module JS {
    namespace view {
        interface FormViewConfig extends ViewConfig {
            valueModel?: Klass<Model>;
            defaultConfig?: IWidgetConfig;
            widgetConfigs?: JsonObject<ViewWidgetConfig | IWidgetConfig>;
        }
        abstract class FormView extends View {
            protected _config: FormViewConfig;
            protected _model: Model;
            reset(): this;
            clear(): this;
            iniValues(): JsonObject<any>;
            iniValues(values: JsonObject<any>, render?: boolean): this;
            validate(id?: string): boolean;
            private _validateWidget;
            getModel(): Model;
            values(): JsonObject;
            values(values: any): this;
            protected _render(): void;
        }
    }
}
import FormView = JS.view.FormView;
import FormViewConfig = JS.view.FormViewConfig;
declare module JS {
    namespace view {
        interface PageViewConfig extends ViewConfig, ViewWidgetConfig {
        }
        abstract class PageView extends View {
            protected _config: PageViewConfig;
            protected _model: PageModel;
            load(api: PageQuery): Promise<ResultSet<unknown>>;
            reload(): this;
            protected _render(): void;
        }
    }
}
import PageViewConfig = JS.view.PageViewConfig;
import PageView = JS.view.PageView;
declare module JS {
    namespace view {
        interface SimpleViewConfig extends ViewConfig {
            defaultConfig?: IWidgetConfig;
            widgetConfigs?: JsonObject<ViewWidgetConfig | IWidgetConfig>;
        }
        abstract class SimpleView extends View {
            protected _config: SimpleViewConfig;
            protected _render(): void;
        }
    }
}
import SimpleViewConfig = JS.view.SimpleViewConfig;
import SimpleView = JS.view.SimpleView;
declare module JS {
    namespace view {
        interface TemplateViewConfig extends ViewConfig {
            container: string | HTMLElement;
            tpl: string;
            data?: any;
            defaultConfig?: IWidgetConfig;
            widgetConfigs?: JsonObject<ViewWidgetConfig | IWidgetConfig>;
        }
        abstract class TemplateView extends View {
            protected _config: TemplateViewConfig;
            protected _engine: Templator;
            protected _model: ListModel;
            initialize(): void;
            data(data: any): void;
            load(api: string | AjaxRequest): Promise<ResultSet<JsonObject<any>[]>>;
            protected _render(): void;
        }
    }
}
import TemplateViewConfig = JS.view.TemplateViewConfig;
import TemplateView = JS.view.TemplateView;
