// Type definitions for for Ion.RangeSlider 2.3.0
// Project: https://github.com/IonDen/ion.rangeSlider/
// Definitions by: Feng BoYue <https://github.com/fengboyue>

// API documentation: http://ionden.com/a/plugins/ion.rangeSlider/api.html

interface JQuery {
    ionRangeSlider(): JQuery;
    ionRangeSlider(options: IonRangeSliderOptions): JQuery;
}

interface IonRangeSliderOptions {
    /**
     * Choose slider type, could be single - for one handle, or double for two handles
     * @default single
     */
    type?: 'single'|'double';
    /**
     * Set slider minimum value
     * @default 10
     */
    min?: number;
    /**
     * Set slider maximum value
     * @default 100
     */
    max?: number;
    /**
     * Set start position for left handle (or for single handle)
     * @default min
     */
    from?:number;
    /**
     * Set start position for right handle
     * @default max
     */
    to?:number;
    /**
     * Set sliders step. Always > 0. Could be fractional.
     * @default 1
     */
    step?:number;
    /**
     * Set up your own array of possible slider values. They could be numbers or strings. If the values array is set up, min, max and step param, are no longer can be changed.
     * @default []
     */
    values?: Array<number|string>;
    /**
     * Activates keyboard controls. Move left: ←, ↓, A, S. Move right: →, ↑, W, D.
     * @default true
     */
    keyboard?: boolean;

    /**
     * Enables grid of values.
     * @default false
     */
    grid?: boolean;
    /**
     * Set left and right grid borders.
     * @default true
     */
    grid_margin?: boolean;
    /**
     * Number of grid units.
     * @default 4
     */
    grid_num?:number;	
    /**
     * Snap grid to sliders step (step param). If activated, grid_num will not be used.
     * @default false
     */
    grid_snap?: boolean;

    /**
     * Allow user to drag whole range. Only in double type
     * @default false
     */
    drag_interval?: boolean;
    /**
     * Set minimum diapason between sliders. Only in double type
     */
    min_interval?: number;
    /**
     * Set maximum diapason between sliders. Only in double type
     */
    max_interval?: number;

    /**
     * Fix position of left (or single) handle.
     * @default false
     */
    from_fixed?:boolean;
    /**
     * Set minimum limit for left handle.
     * @default min
     */
    from_min?:number;
    /**
     * Set the maximum limit for left handle
     * @default max
     */
    from_max?:number;
    /**
     * Highlight the limits for left handle
     * @default false
     */
    from_shadow?:boolean;
    /**
     * Fix position of right handle.
     * @default false
     */
    to_fixed?:boolean;
    /**
     * Set the minimum limit for right handle
     * @default min
     */
    to_min?:number;
    /**
     * Set the maximum limit for right handle
     * @default max
     */
    to_max?:number;
    /**
     * Highlight the limits for right handle
     * @default false
     */
    to_shadow?:boolean;

    /**
     * Choose UI skin to use
     * @default flat
     */
    skin?:'flat'|'big'|'modern'|'sharp'|'round'|'square';
    /**
     * Hides min and max labels
     * @default false
     */
    hide_min_max?:boolean;
    /**
     * Hide from and to labels
     * @default false
     */
    hide_from_to?:boolean;
    /**
     * Slider will be always inside it's container.
     * @default false
     */
    force_edges?:boolean;
    /**
     * Traverse extra CSS-classes to slider container
     */
    extra_classes?:string;
    /**
     * Locks slider and makes it inactive (visually). input is NOT disabled. Can still be send with forms.
     * @default false
     */
    block?:boolean;

    /**
     * Improve readability of long numbers. 10000000 → 10 000 000
     * @default true
     */
    prettify_enabled?:boolean;
    /**
     * Set up your own separator for long numbers. 10 000, 10.000, 10-000 etc.
     * @default ' '
     */
    prettify_separator?: string;
    /**
     * Set up your own prettify function. Can be anything. For example, you can set up unix time as slider values and than transform them to cool looking dates.
     * @default null
     */
    prettify?: (val:string|number)=>string;
    /**
     * Set prefix for values. Will be set up right before the number: $100
     */
    prefix?:string;
    /**
     * Set postfix for values. Will be set up right after the number: 100k
     */
    postfix?:string;
    /**
     * Special postfix, used only for maximum value. Will be showed after handle will reach maximum right position. For example 0 — 100+
     */
    max_postfix?:string;
    /**
     * Used for "double" type and only if prefix or postfix was set up. Determine how to decorate close values. For example: $10k — $100k or $10 — 100k
     * @default true
     */
    decorate_both?:boolean;
    /**
     * 	Set your own separator for close values. Used for double type. Default: 10 — 100. Or you may set: 10 to 100, 10 + 100, 10 → 100 etc.
     * @default ' - '
     */
    values_separator?:string;

    /**
     * Separator for double values in input value property. Default FROM;TO. Only for double type
     * @default ';'
     */
    input_values_separator?:string;
    /**
     * Locks slider and makes it inactive. input is disabled too. Invisible to forms.
     * @default false
     */
    disable?:boolean;

    /**
     * Scope for callbacks. Pass any object. Callback will be executed like this: onChange.call(scope);
     * @default null
     */
    scope?:object;	
    /**
     * Callback. Is called on slider start.
     */
    onStart?: Function;
    /**
     * Callback. IS called on each values change.
     */
    onChange?: Function;
    /**
     * Callback. Is called than user releases handle.
     */
    onFinish?: Function;
    /**
     * Callback. Is called than slider is modified by external methods update or reset.
     */
    onUpdate?: Function;
}

