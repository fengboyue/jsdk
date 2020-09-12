/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../../libs/jquery/3.2.1/jquery.d.ts" /> 
/// <reference path="../../libs/bootstrap/4.0.0/bootstrap.d.ts" /> 

/// <reference path="../lang/System.ts"/>
/// <reference path="../model/Model.ts"/>
/// <reference path="../model/ListModel.ts"/>
/// <reference path="../util/CssTool.ts"/>
/// <reference path='../ui/Placements.ts'/>
/// <reference path="../ui/IWidget.ts"/>
/// <reference path="../net/URI.ts"/>
module JS {

    export namespace fx {

        export enum SizeMode {
            hg = 'hg',
            lg = 'lg',
            md = 'md',
            sm = 'sm',
            xs = 'xs'
        }

        export enum ColorMode {
            success = 'success',
            danger = 'danger',
            warning = 'warning',
            info = 'info',
            primary = 'primary',
            secondary = 'secondary',
            accent = 'accent',
            metal = 'metal',
            light = 'light',
            dark = 'dark'
        }

        export interface WidgetListeners<T> {
            showing?: EventHandler<T>;
            shown?: EventHandler<T>;
            hiding?: EventHandler<T>;
            hidden?: EventHandler<T>;
            rendering?: EventHandler<T>;
            rendered?: EventHandler<T>;
            destroying?: EventHandler<T>;
            destroyed?: EventHandler<T>;
        }

        export class WidgetConfig<W> implements IWidgetConfig {
            readonly id?: string;
            name?: string = '';
            tip?: string = '';
            /**
             * Additional CSS styles that will be rendered into an inline style attribute when the widget is rendered.
             */
            style?: string = '';
            width?: string | number;
            height?: string | number;
            /**
             * The CSS class to add to this widget's element
             */
            cls?: string = '';
            appendTo?: string | Element | JQuery = 'body';
            /**
             * Render to DOM element.
             */
            renderTo?: string | Element | JQuery = null;
            hidden?: boolean = false;
            sizeMode?: SizeMode = SizeMode.md;
            colorMode?: ColorMode;
            faceMode?: string | Array<string> = null;
            /**
             * A locale string, like 'en', 'en-us', 'zh'.
             */
            locale?: Locale = 'en';
            /**
             * I18N resource.
             */
            i18n?: I18NResource|URLString = null;

            /**
             * 事件监听
             */
            listeners?: WidgetListeners<W>; //初始事件监听
        }
    }
}

import SizeMode = JS.fx.SizeMode;
import ColorMode = JS.fx.ColorMode;
import WidgetConfig = JS.fx.WidgetConfig;
import WidgetListeners = JS.fx.WidgetListeners;
