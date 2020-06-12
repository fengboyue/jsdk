/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="FormWidget.ts"/>
/// <reference path="../util/Numbers.ts"/>

module JS {

    export namespace fx {

        export enum ProgressFaceMode {
            square = 'square',
            round = 'round',
            striped = 'striped',
            animated = 'animated'
        }

        export class ProgressConfig extends FormWidgetConfig<Progress> {
            /**
             * 取值范围0～1
             * @default 0
             */
            iniValue?: number = 0;
            height?: number;
            faceMode?: ProgressFaceMode | ProgressFaceMode[];
        }

        @widget('JS.fx.Progress')
        export class Progress extends FormWidget {

            constructor(config: ProgressConfig) {
                super(config);
            }

            public value(): number
            public value(val: number, silent?: boolean): this
            public value(val?: number, silent?: boolean): any {
                if (arguments.length == 0) return super.value();

                val = val || 0;
                if (val > 1 || val < 0) throw new Errors.RangeError('Progress value must in [0,1]!');

                let newVal = val ? val.round(2) : 0

                this._setValue(newVal, silent);
                this._mainEl.css('width', newVal * 100 + '%');
                this._mainEl.text(newVal ? newVal * 100 + '%' : '');

                return this
            }
            public height(): number
            public height(val: number): this
            public height(val?: number): any {
                if (arguments.length == 0) return this._mainEl.parent().css('height');

                this._mainEl.parent().css('height', val);
                this._config.height = val;
                return this;
            }

            protected _bodyFragment() {
                let cfg = <ProgressConfig>this._config, cls = `progress ${cfg.sizeMode || ''}`, barCls = 'progress-bar',
                    val = cfg.iniValue||0;
                if (this._hasFaceMode(ProgressFaceMode.square)) cls += ' border-square';
                if (this._hasFaceMode(ProgressFaceMode.striped)) barCls += ' progress-bar-striped';
                if (this._hasFaceMode(ProgressFaceMode.animated)) barCls += ' progress-bar-striped progress-bar-animated';

                if (cfg.colorMode) barCls += ` bg-${cfg.colorMode}`;
                return `
                <div class="${cls}" ${cfg.height ? 'style="height:' + cfg.height + 'px"' : ''}>
                    <div class="${barCls} ${cfg.disabled ? 'disabled' : ''}" style="width:${val * 100}%" jsfx-role="main" role="progressbar">${val ? (val * 100 + '%') : ''}</div>
                </div>
                `
            }

            public disable() {
                this._mainEl.addClass('disabled');
                (<ProgressConfig>this._config).disabled = true;
                return this
            }
            public enable() {
                this._mainEl.removeClass('disabled');
                (<ProgressConfig>this._config).disabled = false;
                return this
            }

        }
    }
}
import Progress = JS.fx.Progress;
import ProgressFaceMode = JS.fx.ProgressFaceMode;
import ProgressConfig = JS.fx.ProgressConfig;