/// <reference path='../../../dist/jsdk.d.ts' /> 

module JS {

    export namespace examples {

            @compo('JS.examples.ButtonsTemplateView')
            export class ButtonsTemplateView extends TemplateView {

                initialize() {
                    this._config = {
                        container: '#ctr1',
                        tpl: `{{#.}}<div cls="items-{{name}}">
                            <div id="btn{{@index}}" color-mode="{{name}}" ${View.WIDGET_ATTRIBUTE}="button">
                            </div>{{/.}}`,
                        widgetConfigs: {
                            'btn': <ButtonConfig>{
                                listeners: {
                                    click: function () { alert('Button<' + this.id + '>\'s colorMode is: '+ this.widgetEl.find('button').text()) }
                                }
                            }
                        }
                    };
                    this.on('widgetiniting', (e, klass, newConfig: ButtonConfig) => {
                        newConfig.colorMode = <any>$1('#' + newConfig.id).attr('color-mode');
                        newConfig.text = newConfig.colorMode;
                    });
                    super.initialize();
                }

            }
    }
} 
import ButtonsTemplateView = JS.examples.ButtonsTemplateView