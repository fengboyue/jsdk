/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../../libs/ion-rangeslider/2.3.0/ion.rangeSlider.d.ts"/>
/// <reference path="FormWidget.ts"/>

module JS {

    export namespace fx {

        export type RangeSliderEvents = FormWidgetEvents;

        export interface RangeSliderListeners extends FormWidgetListeners<RangeSlider> {
        }

        export enum RangeSliderFaceMode {
            flat = 'flat',
            big = 'big',
            modern = 'modern',
            sharp = 'sharp',
            round = 'round',
            square = 'square'
        }

        export class RangeSliderConfig extends FormWidgetConfig<RangeSlider> {

            iniValue?: number | number[];
            listeners?: RangeSliderListeners;

            /**
             * Choose slider type, could be single - for one handle, or double for two handles
             * @default single
             */
            type?: 'single' | 'double';
            /**
             * Set sliders step. Always > 0. Could be fractional.
             * @default 1
             */
            step?: number;
            /**
             * Set up your own array of possible slider values. They could be numbers or strings. If the values array is set up, min, max and step param, are no longer can be changed.
             * @default []
             */
            data?: Array<number>;

            /**
             * Enables scale mark for values.
             * @default false
             */
            scaled?: boolean;
            /**
             * Number of scale marks.
             * @default 4
             */
            scales?: number;

            /**
             * Set minimum diapason between sliders. Only in double type
             */
            minInterval?: number;
            /**
             * Set maximum diapason between sliders. Only in double type
             */
            maxInterval?: number;

            /**
             * Fix position of left (or single) handle.
             * @default false
             */
            fromFixed?: boolean;
            /**
             * Set minimum limit for left handle.
             * @default min
             */
            fromMin?: number;
            /**
             * Set the maximum limit for left handle
             * @default max
             */
            fromMax?: number;
            /**
             * Highlight the limits for left handle
             * @default false
             */
            fromShadow?: boolean;
            /**
             * Fix position of right handle.
             * @default false
             */
            toFixed?: boolean;
            /**
             * Set the minimum limit for right handle
             * @default min
             */
            toMin?: number;
            /**
             * Set the maximum limit for right handle
             * @default max
             */
            toMax?: number;
            /**
             * Highlight the limits for right handle
             * @default false
             */
            toShadow?: boolean;

            /**
             * Choose UI skin to use
             * @default round
             */
            faceMode?: RangeSliderFaceMode = RangeSliderFaceMode.round;
            /**
             * Hides min and max labels
             * @default false
             */
            hideMinMax?: boolean;
            /**
             * Hide from and to labels
             * @default false
             */
            hideFromTo?: boolean;
            /**
             * Traverse extra CSS-classes to slider container
             */
            sliderCls?: string;

            /**
             * Improve readability of long numbers. 10000000 → 10 000 000
             */
            format?: string | Function;
            /**
             * Set prefix for data. Will be set up right before the number: $100
             */
            dataPrefix?: string;
            /**
             * Set postfix for data. Will be set up right after the number: 100k
             */
            dataPostfix?: string;
            /**
             * Special postfix, used only for maximum value. Will be showed after handle will reach maximum right position. For example 0 — 100+
             */
            maxValuePostfix?: string;
            /**
             * Used for "double" type and only if prefix or postfix was set up. Determine how to decorate close values. For example: $10k — $100k or $10 — 100k
             * @default true
             */
            closeValuesDecorate?: boolean;
            /**
             * 	Set your own separator for close values. Used for double type. Default: 10 — 100. Or you may set: 10 to 100, 10 + 100, 10 → 100 etc.
             * @default ' - '
             */
            closeValuesSeparator?: string;
            /**
             * Separator for double values in input value property. Default FROM;TO. Only for double type
             * @default ';'
             */
            valuesSeparator?: string;
        }

        @widget('JS.fx.RangeSlider')
        export class RangeSlider extends FormWidget {
            private _slider;

            constructor(cfg: RangeSliderConfig) {
                super(cfg);
            }

            private _getFromTo() {
                let arr = Arrays.toArray<number>(this.value()),
                    from = arr.length > 0 ? arr[0] : null, to = arr.length > 1 ? arr[1] : null;
                return [from, to]
            }

            private _transfer() {
                let cfg = <RangeSliderConfig>this._config, fromTo = this._getFromTo();

                return <IonRangeSliderOptions>{
                    type: cfg.type,
                    min: cfg.data[0],
                    max: cfg.data[1],
                    from: fromTo[0],
                    to: fromTo[1],
                    step: cfg.step,
                    keyboard: false,

                    grid: cfg.scaled,
                    grid_margin: true,
                    grid_num: cfg.scales,
                    grid_snap: false,

                    drag_interval: true,
                    min_interval: cfg.minInterval,
                    max_interval: cfg.maxInterval,
                    from_fixed: cfg.fromFixed,
                    from_min: cfg.fromMin,
                    from_max: cfg.fromMax,
                    from_shadow: cfg.fromShadow,
                    to_fixed: cfg.toFixed,
                    to_min: cfg.toMin,
                    to_max: cfg.toMax,
                    to_shadow: cfg.toShadow,

                    skin: cfg.faceMode || 'round',
                    hide_min_max: cfg.hideMinMax,
                    hide_from_to: cfg.hideFromTo,
                    force_edges: true,
                    extra_classes: cfg.sliderCls,
                    block: cfg.readonly,

                    prettify_enabled: cfg.format ? true : false,
                    prettify_separator: Types.isString(cfg.format) ? <string>cfg.format : ' ',
                    prettify: Types.isFunction(cfg.format) ? <any>cfg.format : null,
                    prefix: cfg.dataPrefix,
                    postfix: cfg.dataPostfix,
                    max_postfix: cfg.maxValuePostfix,
                    decorate_both: cfg.closeValuesDecorate,
                    values_separator: cfg.closeValuesSeparator,

                    input_values_separator: cfg.valuesSeparator,
                    disable: cfg.disabled,

                    scope: this,
                    onFinish: (data) => {
                        let cfg = <RangeSliderConfig>this._config, v = cfg.type == 'double' ? [data.from, data.to] : data.from;
                        this._setValue(v);
                    }

                }
            }

            protected _destroy(): void {
                this._slider.destroy();
                super._destroy();
            }

            protected _bodyFragment(): string {
                let cfg = <RangeSliderConfig>this._config;
                if (!cfg.data) cfg.data = [0, 100];

                return `<input name="${this.name()}" type="text" jsfx-role="main" data-min="${cfg.data[0]}" data-max="${cfg.data[1]}"/>`
            }

            protected _onBeforeRender() {
                if (this._slider) this._slider.destroy();
                super._onBeforeRender();
            }

            protected _onAfterRender() {
                if (this._config.colorMode) this.widgetEl.find('[jsfx-role=body]').addClass(this._config.colorMode);
                this._mainEl.ionRangeSlider(this._transfer());
                this._slider = this._mainEl.data('ionRangeSlider');

                super._onAfterRender();
            }

            protected _iniValue(){
                let cfg = <RangeSliderConfig>this._config, type = cfg.type, min = this.minValue(), max = this.maxValue();
                if (cfg.iniValue == null) cfg.iniValue = type == 'double' ? [min, max] : min;
                super._iniValue()
            }

            public data(): Array<number>
            public data(data: Array<number>, silent?: boolean): this
            public data(data?: Array<number>, silent?: boolean): any {
                if (arguments.length == 0) return super.data();
                if (data == null) data = [0, 100];
                return super.data(data, silent)
            }

            protected _renderData() {
                let data = (<RangeSliderConfig>this._config).data,
                    min = this._mainEl.data('min'),
                    max = this._mainEl.data('max');
                if (data && (min + '-' + max) != (data[0] + '-' + data[1])) {
                    this._slider.update({
                        min: data[0],
                        max: data[1]
                    });
                    this._mainEl.data({
                        min: data[0],
                        max: data[1]
                    })
                }
            }

            public value(): number | number[]
            public value(val: number | number[], silent?: boolean): this
            public value(val?: number | number[], silent?: boolean): any {
                if (arguments.length == 0) return super.value();

                let cfg = <RangeSliderConfig>this._config;
                if (val != null) {
                    let min = this.minValue(), max = this.maxValue();
                    if (cfg.type == 'double') {
                        if (val[0] < min) val[0] = min;
                        if (val[1] > max) val[1] = max;
                    } else {
                        if (val < min) {
                            val = min
                        } else if (val > max) {
                            val = max
                        }
                    }
                }
                return super.value(val, silent)
            }

            public _renderValue(): void {
                let cfg = <RangeSliderConfig>this._config,
                    fromTo = this._getFromTo(), sValue = cfg.type == 'double' ? (fromTo[0] || '' + cfg.valuesSeparator + fromTo[1] || '') : String(fromTo[0] || '');

                if (sValue != this._mainEl.prop('value')) this._slider.update({
                    from: fromTo[0], to: fromTo[1]
                });
            }

            public maxValue() {
                return (<RangeSliderConfig>this._config).data[1]
            }
            public minValue() {
                return (<RangeSliderConfig>this._config).data[0]
            }

        }
    }

}
import RangeSliderFaceMode = JS.fx.RangeSliderFaceMode;
import RangeSliderConfig = JS.fx.RangeSliderConfig;
import RangeSliderEvents = JS.fx.RangeSliderEvents;
import RangeSliderListeners = JS.fx.RangeSliderListeners;
import RangeSlider = JS.fx.RangeSlider;
