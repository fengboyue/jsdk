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
        let ColorsTemplateView = class ColorsTemplateView extends TemplateView {
            initialize() {
                this._config = {
                    container: '#ctr1',
                    tpl: '{{#.}}<div style="color:{{color}};">{{name}}:{{color}}</div>{{/.}}'
                };
                super.initialize();
            }
        };
        ColorsTemplateView = __decorate([
            compo('JS.examples.ColorsTemplateView')
        ], ColorsTemplateView);
        examples.ColorsTemplateView = ColorsTemplateView;
    })(examples = JS.examples || (JS.examples = {}));
})(JS || (JS = {}));
var ColorsTemplateView = JS.examples.ColorsTemplateView;
