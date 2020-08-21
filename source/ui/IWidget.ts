/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
module JS {
    export namespace ui {
        export interface IWidgetConfig {
        }

        export interface IWidget {
            id: string;
            name(): string;
            show(): this;
            hide(): this
            isShown(): boolean;
            locale(): string;
            locale(locale: string):this;
            on(type: string, fn: EventHandler<this>): this;
            off(type?: string): this;
            destroy(): void;
        }

        export interface IValueWidget extends IWidget {
            iniValue<T>(): T;
            iniValue<T>(val?: T, render?:boolean): this;
            value<T>(): T;
            value<T>(val?: T, silent?: boolean): this;
            reset(): this;
            valueModel(): Model;
            validate(): string | boolean;
            clear(): this;
        }

        export interface IDataWidget extends IWidget {
            data<T>(): T;
            data(data: any, silent?: boolean): this;
            load<T>(api: string | HttpRequest): Promise<ResultSet<T>>;
            reload(): this;
            dataModel<M>(): M;
        }

        export interface ICRUDWidget<T> extends IValueWidget {
            crudValue(): T;
            isCrud(): boolean;
        }

        export type WidgetEvents = 'showing' | 'shown' | 'hiding' | 'hidden' | 'rendering' | 'rendered' | 'destroying' | 'destroyed';

        /**
         * The @widget annotation.
         */
        export function widget(fullName: string, alias?: string): any {
            return Annotations.define({
                name: 'widget',
                handler: (anno: string, values: Array<string>, obj: Function | object) => {
                    let ctor = <Function>obj, name = values[0];
                    //注册类名与别名
                    Class.reflect(ctor, name, alias ? alias : (name.slice(name.lastIndexOf('.')+1)).toLowerCase());
                },
                target: AnnotationTarget.CLASS
            }, [fullName]);
        }
    }
}

import widget = JS.ui.widget;

import IWidgetConfig = JS.ui.IWidgetConfig;
import IWidget = JS.ui.IWidget;
import IValueWidget = JS.ui.IValueWidget;
import IDataWidget = JS.ui.IDataWidget;
import ICRUDWidget = JS.ui.ICRUDWidget;
import WidgetEvents = JS.ui.WidgetEvents;