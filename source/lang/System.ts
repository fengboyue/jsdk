/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../core/Kernel.ts"/>

/// <reference path="../util/Dates.ts"/>
/// <reference path="../util/Numbers.ts"/>
/// <reference path="../util/Locales.ts"/>
/// <reference path="../util/Konsole.ts"/>

/// <reference path="Assert.ts"/>
/// <reference path="../../libs/ua-parser/0.7.20/ua-parser.d.ts" />

module JS {

    export namespace lang {

        /**
         * operating system
         */
        export enum OS {
            Windows = 'Windows',
            MacOS = 'Mac OS',
            Unix = 'Unix',
            Linux = 'Linux',
            CentOS = 'CentOS',
            Ubuntu = 'Ubuntu',
            iOS = 'iOS',
            Android = 'Android',
            WindowsPhone = 'Windows Phone'
        }

        /**
         * it devices
         */
        export enum DeviceType {
            desktop = 'desktop',
            console = 'console',
            mobile = 'mobile',
            tablet = 'tablet',
            smarttv = 'smarttv',
            wearable = 'wearable',
            embedded = 'embedded'
        }

        /**
         * famous browsers
         */
        export enum Browser {
            Edge = 'Edge',
            IE = 'IE',
            Firefox = 'Firefox',
            Chrome = 'Chrome',
            Opera = 'Opera',
            Safari = 'Safari',
            iOS = 'iOS',
            WeChat = 'WeChat',
            QQ = 'QQ',
            UC = 'UC'
        }

        /**
         * browser display info
         */
        export type BrowserDisplay = {
            /**
             * Screen full width
             */
            screenWidth: number;
            /**
             * Screen full height
             */
            screenHeight: number;
            /**
             * Screen view width
             */
            screenViewWidth: number;
            /**
             * Screen view height
             */
            screenViewHeight: number;

            /**
             * X coordinate of browser window relative to screen
             */
            windowX: number;
            /**
             * Y coordinate of browser window relative to screen
             */
            windowY: number;
            
            /**
             * X coordinate of document relative to window
             */
            docX: number;
            /**
             * Y coordinate of document relative to window
             */
            docY: number;
            /**
             * Scroll distance of document viewport in X coordinate
             */
            docScrollX: number;
            /**
             * Scroll distance of document viewport in Y coordinate
             */
            docScrollY: number;
            /**
             * Document full width
             */
            docWidth: number;
            /**
             * Document full height
             */
            docHeight: number;
            /**
             * Document view width
             */
            docViewWidth: number;
            /**
             * Document view height
             */
            docViewHeight: number;
            /**
             * Color depth of screen
             */
            colorDepth: number;
            /**
             * Pixel depth of screen
             */
            pixelDepth: number;
            /**
             * Ratio of physical pixel resolution to CSS pixel resolution of display device
             */
            devicePixelRatio: number;
        }

        export type HardwareSupport = {
            logicalCPUCores: number;
        }

        /**
         * Runtime Env
         */
        export type SystemInfo = {
            ua: string;
            display: BrowserDisplay;
            browser: { 
                name: string, 
                version?: string 
            };
            engine: {
                name: string,
                version: string
            };
            device: {
                /**
                 * Determined dynamically
                 */
                model: string,

                type: DeviceType,

                /**
                 * Possible vendor:
                 * Acer, Alcatel, Amazon, Apple, Archos, Asus, BenQ, BlackBerry, Dell, GeeksPhone,
                 * Google, HP, HTC, Huawei, Jolla, Lenovo, LG, Meizu, Microsoft, Motorola, Nexian,
                 * Nintendo, Nokia, Nvidia, Ouya, Palm, Panasonic, Polytron, RIM, Samsung, Sharp,
                 * Siemens, Sony-Ericsson, Sprint, Xbox, ZTE
                 */
                vendor: string;
            };
            os: { 
                name: string, 
                version?: string 
            };
            locale: Locale;
            cookieEnabled: boolean;
            online: boolean;
            hardware: {
                cpuName: string,
                cpuCores: number
            };
        }

        /**
         * System helper
         */
        export class System {
            private static _info: SystemInfo;

            /**
             * Returns all system infomations.
             */
            public static info(refresh?: boolean): SystemInfo {
                if (!refresh && System._info) return System._info;

                var parser = window['UAParser'] && new UAParser(), dev:any = parser?parser.getDevice():{};
                if(!dev.type) dev.type = DeviceType.desktop;

                let info: SystemInfo = {
                    ua: navigator.userAgent,
                    browser: parser && parser.getBrowser(),
                    engine: parser && parser.getEngine(),
                    device: <any>dev,
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

                if(self.window){//在线程脚本中时没有window对象
                    let winscreen = window.screen, 
                        doc = (a)=>{return Math.max(document.documentElement[a], document.body[a]);};
                    info.display = {
                        screenWidth: winscreen.width,
                        screenHeight: winscreen.height,
                        screenViewWidth: winscreen.availWidth,
                        screenViewHeight: winscreen.availHeight,
    
                        windowX: window.screenLeft || window.screenX,
                        windowY: window.screenTop || window.screenY,
                        
                        docX: doc('clientLeft')||0,
                        docY: doc('clientTop')||0, 
                        docScrollX: doc('scrollLeft')||0, 
                        docScrollY: doc('scrollTop')||0, 
                        docWidth: doc('scrollWidth')||0, 
                        docHeight: doc('scrollHeight')||0, 
                        docViewWidth: doc('clientWidth')||0, 
                        docViewHeight: doc('clientHeight')||0, 
    
                        colorDepth: winscreen.colorDepth,
                        pixelDepth: winscreen.pixelDepth,
                        devicePixelRatio: window.devicePixelRatio
                    };
                }

                System._info = info;
                return info;
            }

            /**
             * Returns display infomations.
             */
            public static display(refresh?: boolean): BrowserDisplay {
                return this.info(refresh).display
            }

            /**
             * Is the type of?
             */
            public static isDevice(device:DeviceType): boolean {
                return System.info().device.type == device;
            }

            /**
             * Is this browser?
             * @param b 
             */
            public static isBrowser(b: Browser|string): boolean {
                return System.info().browser.name == b;
            }

            /**
             * Is the OS?
             */
            public static isOS(os: OS|string, version?:string): boolean {
                let sos = System.info().os, is = sos.name == os;
                if(!is) return false;

                return version && sos.version?sos.version.indexOf(version)==0:true
            }
            /**
             * Is the same language?
             */
            public static isLang(lang: string): boolean {
                return Locales.lang(System.info().locale) == lang;
            }
            /**
             * Is the country?
             */
            public static isCountry(country: string): boolean {
                return Locales.country(System.info().locale) == country;
            }

            /**
             * Returns current time zone string.
             */
            public static timezoneString(tz?:'GMT'|'UTC'|'UT'): string {
                return (tz||'GMT') + new Date().formatTimezoneOffset();
            }

            /**
             * Returns performance object.
             */
            public static performance(): Performance {
                return window.performance;
            }

            /**
             * The returned value which unit is millisecond using 9-digits microsecond float represents the time elapsed since the time origin.
             * The time origin is a standard time which is considered to be the beginning of the current document's lifetime.
             * 返回单位为毫秒，但使用了9位小数的浮点数来达到微秒级别的精确度。
             */
            public static highResTime(): number {
                return performance.now()
            }

        }
    }
}

import System = JS.lang.System;
import OS = JS.lang.OS;
import Browser = JS.lang.Browser;
import DeviceType = JS.lang.DeviceType;
import SystemInfo = JS.lang.SystemInfo;
import BrowserWindow = JS.lang.BrowserDisplay;