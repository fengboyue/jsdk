/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="Konsole.ts"/>
module JS {

    export namespace util {

        export enum LogLevel {
            ALL = 6,
            TRACE = 5,
            DEBUG = 4,
            INFO = 3,
            WARN = 2,
            ERROR = 1,
            OFF = 0
        }

        let LogLevels = ['OFF','ERROR','WARN','INFO','DEBUG','TRACE','ALL'],
        LogLevelStyles = [
            '',
            'color:red;background-color:#fff0f0;',//error
            'color:orange;background-color:#fffbe6;',//warn
            'color:black;background-color:white;',//info
            'color:white;background-color:gray;',//debug
            'color:white;background-color:black;',//trace
            ''
        ];

        export interface LogAppender {
            log(level: LogLevel.TRACE | LogLevel.DEBUG | LogLevel.INFO | LogLevel.WARN | LogLevel.ERROR, ...data: any[]): void
        }

        export class ConsoleAppender implements LogAppender {

            private name = '';
            constructor(name: string){
                this.name = name;
            }
            public log(level: LogLevel.TRACE | LogLevel.DEBUG | LogLevel.INFO | LogLevel.WARN | LogLevel.ERROR, ...data: any[]) {
                this._log(LogLevels[level], LogLevelStyles[level], data)
            }
            private _log(cmd: string, css: string, data: any[]) {
                console.group(`%c${cmd} ${this.name?'['+this.name+'] ':''}${new Date().toISOString()}`, css);
                if(data) data.forEach(a => {
                    cmd != 'INFO' && cmd != 'WARN'?Konsole.trace(a):Konsole.print(a);
                });
                console.groupEnd();
            }

        }

        export class Log {
            public level: LogLevel;
            private _name: string;
            private _appender;
            
            constructor(name: string, level: LogLevel, appender?:Klass<LogAppender>){
                this._appender = !appender?new ConsoleAppender(name):Class.newInstance(appender, name);
                this.level  = level || LogLevel.ALL;
                this._name = name;
            }

            public name(){
                return this._name
            }

            private _log(level: LogLevel.TRACE | LogLevel.DEBUG | LogLevel.INFO | LogLevel.WARN | LogLevel.ERROR, data: any[]) {
                if (level <= this.level) {
                    this._appender.log.apply(this._appender, [level].concat(data));
                }
            }

            public trace(...data) {
                this._log(LogLevel.TRACE, data);
            }

            public debug(...data) {
                this._log(LogLevel.DEBUG, data);
            }

            public info(...data) {
                this._log(LogLevel.INFO, data);
            }

            public warn(...data) {
                this._log(LogLevel.WARN, data);
            }

            public error(...data) {
                this._log(LogLevel.ERROR, data);
            }

            public clear() {
                this._appender.clear()
            }
        }
    }
}
import LogLevel = JS.util.LogLevel;
import LogAppender = JS.util.LogAppender;
import Log = JS.util.Log;

let JSLogger = new Log(`JSDK ${JS.version}`, LogLevel.INFO);
Konsole.text(`Powered by JSDK ${JS.version}`, 'font-weight:bold;');