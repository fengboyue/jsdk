/// <reference path='../../../dist/jsdk.d.ts' /> 

module JS {

    export namespace examples {

            @compo('JS.examples.ColorsTemplateView')
            export class ColorsTemplateView extends TemplateView {

                initialize() {
                    this._config = {
                        container:'#ctr1',
                        tpl: '{{#.}}<div style="color:{{color}};">{{name}}:{{color}}</div>{{/.}}'
                    }
                    super.initialize();
                }

            }
    }
} 
import ColorsTemplateView = JS.examples.ColorsTemplateView