var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var JS;
(function (JS) {
    let examples;
    (function (examples) {
        let ButtonsTemplateView = class ButtonsTemplateView extends TemplateView {
            initialize() {
                this._config = {
                    container: '#ctr1',
                    tpl: `{{#.}}<div cls="items-{{name}}">
                            <div id="btn{{@index}}" color-mode="{{name}}" ${View.WIDGET_ATTRIBUTE}="button">
                            </div>{{/.}}`,
                    widgetConfigs: {
                        'btn': {
                            listeners: {
                                click: function () { alert('Button<' + this.id + '>\'s colorMode is: ' + this.widgetEl.find('button').text()); }
                            }
                        }
                    }
                };
                this.on('widgetiniting', (e, klass, newConfig) => {
                    newConfig.colorMode = $1('#' + newConfig.id).attr('color-mode');
                    newConfig.text = newConfig.colorMode;
                });
                super.initialize();
            }
        };
        ButtonsTemplateView = __decorate([
            component('JS.examples.ButtonsTemplateView')
        ], ButtonsTemplateView);
        examples.ButtonsTemplateView = ButtonsTemplateView;
    })(examples = JS.examples || (JS.examples = {}));
})(JS || (JS = {}));
var ButtonsTemplateView = JS.examples.ButtonsTemplateView;
