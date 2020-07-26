/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="Widget.ts"/>
module JS {

    export namespace fx {

        let A = Arrays;

        export interface ChoiceOption {
            id: string | number
            text?: string
        }

        export type ChoiceEvents = FormWidgetEvents | 'click';

        export interface ChoiceListeners<T> extends FormWidgetListeners<T> {
            click?: EventHandler<T>;
        }

        export class ChoiceConfig<T extends Choice> extends FormWidgetConfig<T> {
            iniValue?: string | Array<string>;
            data?: ChoiceOption[];
            textColorMode?: ColorMode;
            listeners?: ChoiceListeners<T>;
        }

        export abstract class Choice extends FormWidget {

            constructor(cfg: ChoiceConfig<any>) {
                super(cfg);
            }

            protected _bodyFragment() {
                let isList = this._hasFaceMode('list') ? true : false;

                return `<div class="jsfx-choice-${isList ? 'list' : 'inline'}"> </div>`
            }

            private _choicesHtml(type: string): string {
                let cfg = (<ChoiceConfig<any>>this._config), data = cfg.data;
                if (!data) return '';

                let val = A.toArray<string>(this.value()),
                    html = '',
                    textColor = cfg.textColorMode ? 'text-' + cfg.textColorMode : '',
                    mode1 = this._hasFaceMode('round') ? 'round' : 'square',
                    mode2 = this._hasFaceMode('ring') ? 'ring' : 'dot',
                    disable = cfg.disabled ? 'disabled' : '';
                data.forEach((d, i) => {
                    html += `
                    <label class="font-${cfg.sizeMode || 'md'} ${mode1} ${mode2} ${cfg.colorMode || ''} ${textColor} ${disable}">
                        <input id="${this.id}_${i}" name="${this.name()}" ${disable} ${val.findIndex(it=>{return it==d.id}) >= 0 ? 'checked' : ''} type="${type}" value="${d.id}"/>
                        <span class="text">${d.text || ''}</span>
                        <span class="choice"></span>
                    </label>`
                })

                return html
            }

            public isSelected(): boolean {
                return !Check.isEmpty(this.value())
            }

            protected abstract _getDomValue();
            protected abstract _setDomValue(v:any);

            protected _renderData(type?:'checkbox'|'radio') {
                this.widgetEl.find('[jsfx-role=body]>div').off().empty().html(this._choicesHtml(type));

                if (!this.readonly()) {
                    let el = this.widgetEl.find('input');
                    el.on('change', () => {
                        this._setValue(this._getDomValue());
                    }).on('click', () => {
                        this._setValue(this._getDomValue(), true);//点击时就同步最新的值
                        this._fire(<ChoiceEvents>'click')
                    });
                }
            }
            protected _renderValue(): void {
                let cVal = this.value(),
                    v = A.toArray(cVal),
                    val = A.toArray(this._getDomValue());
                if (!A.same(val, v)) {
                    this._setDomValue(cVal);
                }
            }

            protected _onAfterRender() {
                this._renderData();//渲染data
                super._onAfterRender();
            }

            public abstract select(values?: any): this;
            public abstract unselect(values?: any): this;

            public disable() {
                (<ChoiceConfig<any>>this._config).disabled = true;

                this.widgetEl.find('input').prop('disabled', true);
                this.widgetEl.find('label').addClass('disabled');
                return this
            }
            public enable() {
                (<ChoiceConfig<any>>this._config).disabled = false;

                this.widgetEl.find('input').prop('disabled', false);
                this.widgetEl.find('label').removeClass('disabled');
                return this
            }

            public readonly(): boolean
            public readonly(is: boolean): this
            public readonly(is?: boolean): any {
                if (arguments.length == 0) return (<FormWidgetConfig<any>>this._config).readonly;
                this.widgetEl.find('input').prop('readonly', is);
                (<FormWidgetConfig<any>>this._config).readonly = is;
                return this;
            }

        }

    }

}
import Choice = JS.fx.Choice;
