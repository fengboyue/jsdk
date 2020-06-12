/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="Kernel.ts"/>
/// <reference path="../reflect/Enhance.ts"/>

/// <reference path="../util/Errors.ts"/>
/// <reference path="../util/Dates.ts"/>
/// <reference path="../util/Numbers.ts"/>
/// <reference path="../util/Locale.ts"/>
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
         * browser window info
         */
        export type BrowserWindow = {
            /**
             * 窗口相对于屏幕的x坐标
             */
            screenX: number;
            /**
             * 窗口相对于屏幕的y坐标
             */
            screenY: number;
            /**
             * 窗口实际宽度
             */
            width: number;
            /**
             * 窗口实际高度
             */
            height: number;
            /**
             * 可见区域宽度
             */
            viewWidth: number;
            /**
             * 可见区域高度
             */
            viewHeight: number;
            /**
             * 文档相对于窗口的x坐标
             */
            docX: number;
            /**
             * 文档相对于窗口的y坐标
             */
            docY: number;
            /**
             * 文档x方向上滚动距离
             */
            docScrollX: number;
            /**
             * 文档y方向上滚动距离
             */
            docScrollY: number;
            /**
             * 文档全部宽度
             */
            docWidth: number;
            /**
             * 文档全部高度
             */
            docHeight: number;
            /**
             * 文档可视宽度
             */
            docViewWidth: number;
            /**
             * 文档可视高度 
             */
            docViewHeight: number;
            /**
             * 色彩深度
             */
            colorDepth: number;
            /**
             * 色彩分辨率
             */
            pixelDepth: number;
            /**
             * 当前显示设备的物理像素分辨率与CSS像素分辨率的比率
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
            window: BrowserWindow;
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
            public static info(isRefresh?: boolean): SystemInfo {
                if (!isRefresh && System._info) return System._info;

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
                    window: null
                };

                if(self.window){//在线程脚本中时没有window对象
                    let winscreen = window.screen, docbody = document.body;
                    info.window = {
                        screenX: window.screenLeft || window.screenX,
                        screenY: window.screenTop || window.screenY,
                        width: winscreen.width,
                        height: winscreen.height,
                        viewWidth: winscreen.availWidth,
                        viewHeight: winscreen.availHeight,
    
                        docX: docbody ? docbody.clientLeft : 0,
                        docY: docbody ? docbody.clientTop : 0,
                        docScrollX: docbody ? docbody.scrollLeft : 0,
                        docScrollY: docbody ? docbody.scrollTop : 0,
                        docWidth: docbody ? docbody.scrollWidth : 0,
                        docHeight: docbody ? docbody.scrollHeight : 0,
                        docViewWidth: docbody ? docbody.clientWidth : 0,
                        docViewHeight: docbody ? docbody.clientHeight : 0,
    
                        colorDepth: winscreen.colorDepth,
                        pixelDepth: winscreen.pixelDepth,
                        devicePixelRatio: window.devicePixelRatio
                    };
                }

                System._info = info;
                return info;
            }


            /**
             * Is the type of?
             */
            public static isDevice(device:DeviceType): boolean {
                return System.info().device.type == device;
            }

            /**
             * Is the brower?
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
             * The returned value represents the time elapsed since the time origin.
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
import BrowserWindow = JS.lang.BrowserWindow;