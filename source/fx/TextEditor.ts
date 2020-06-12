/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path='../../libs/summernote/0.8.12/summernote.d.ts' />
/// <reference path='RowsInput.ts'/>
module JS {

    export namespace fx {

        export interface TextEditorButtonOptions {
            name: string;
            html: string;
            tip?: string;
            onClick: (this: TextEditor, options: TextEditorButtonOptions) => void;
        }

        export class TextEditorConfig extends RowsInputConfig<TextEditor> {
            buttons?: Array<TextEditorButtonOptions>;
            toolbar?: Array<any> = [
                ['style', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
                ['font', ['fontsize']],
                ['color', ['forecolor', 'backcolor']],
                ['para', ['ul', 'ol', 'paragraph', 'height']],
                ['insert', ['hr', 'table', 'picture', 'link']],
                ['view', ['fullscreen', 'codeview', 'undo', 'redo', 'help']]
            ];
            maxlength?: number = Infinity;
            placeholder?: string;
            disableDragAndDrop?: boolean = false;
            fontNames?: string[] = ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New'];
            height?: number;
            width?: number;
            listeners?: TextEditorListeners;
        }

        export type TextEditorEvents = FormWidgetEvents |
            'init' | 'keyup' | 'keydown' | 'mousedown' | 'mouseup' | 'paste' | 'enter' | 'imageupload';
        export interface TextEditorListeners extends FormWidgetListeners<TextEditor> {
            init?: EventHandler<TextEditor>
            keyup?: EventHandler1<TextEditor, number> //keyCode
            keydown?: EventHandler1<TextEditor, number> //keyCode
            mousedown?: EventHandler1<TextEditor, number> //mouseCode
            mouseup?: EventHandler1<TextEditor, number> //mouseCode
            paste?: EventHandler<TextEditor>;
            enter?: EventHandler<TextEditor>;
            imageupload?: EventHandler1<TextEditor, File[]> //files
        }

        @widget('JS.fx.TextEditor')
        export class TextEditor extends RowsInput {

            constructor(cfg: TextEditorConfig) {
                super(cfg);
            }

            public undo() {
                this._mainEl.summernote('undo');
                return this;
            }

            public redo() {
                this._mainEl.summernote('redo');
                return this;
            }

            public readonly(): boolean
            public readonly(is: boolean): this
            public readonly(is?: boolean): any {
                if (arguments.length == 0) return (<TextEditorConfig>this._config).readonly;
                this._mainEl.summernote('disable');
                (<TextEditorConfig>this._config).readonly = is;
                return this;
            }
            public disable() {
                this._mainEl.summernote('disable');
                (<TextEditorConfig>this._config).disabled = true;
                return this
            }
            public enable() {
                this._mainEl.summernote('enable');
                (<TextEditorConfig>this._config).disabled = false;
                return this
            }

            /**
             * Focus in current editor.
             */
            public focus() {
                this._mainEl.summernote('focus');
                return this
            }

            public insertImage(url: string, filename?: string | ((this: TextEditor, image: JQuery<HTMLElement>) => void)) {
                this._mainEl.summernote('insertImage', url, Types.isString(filename) ? filename : (img: JQuery<HTMLElement>) => {
                    (<Function>filename).apply(this, [img])
                });
                return this;
            }
            public insertNode(node: Node) {
                this._mainEl.summernote('insertNode', node);
                return this;
            }
            public insertText(text: string) {
                this._mainEl.summernote('insertText', text);
                return this;
            }
            public insertHtml(html: string) {
                this._mainEl.summernote('pasteHTML', html);
                return this;
            }

            public insertLink(text: string, href?: string, isNewWindow?: boolean) {
                this._mainEl.summernote('createLink', {
                    url: href || '#',
                    text: text,
                    isNewWindow: isNewWindow == undefined ? true : isNewWindow
                });
                return this;
            }

            protected _bodyFragment(type?: string): string {
                let cfg = <TextEditorConfig>this._config,
                    counter = Number.isFinite(cfg.maxlength) && cfg.counter ? `
                <div style="float:${cfg.counter.place}">
                <span class="counter ${cfg.counter.cls}"></span>
                </div>
                `: '';
                return `<div jsfx-role="main" class="summernote"></div>${counter}`
            }

            protected _destroy() {
                this._mainEl.summernote('destroy');
                super._destroy();
            }

            protected _onAfterRender() {
                let cfg = (<TextEditorConfig>this._config),
                    callbacks = {
                        onInit: () => {
                            this._fire('init')
                        },
                        onBlur: () => {
                            this._fire('blur')
                        },
                        onFocus: () => {
                            this._fire('focus')
                        },
                        onEnter: () => {
                            this._fire('enter')
                        },
                        onKeyup: (e: JQuery.Event) => {
                            this._fire('keyup', [e.keyCode])
                        },
                        onKeydown: (e: JQuery.Event) => {
                            this._fire('keydown', [e.keyCode])
                        },
                        onMousedown: (e: JQuery.Event) => {
                            this._fire('mousedown', [e.keyCode])
                        },
                        onMouseup: (e: JQuery.Event) => {
                            this._fire('mouseup', [e.keyCode])
                        },
                        onPaste: () => {
                            this._fire('paste')
                        },
                        onImageUpload: (files) => {
                            this._fire('imageupload', [files])
                        },
                        onChange: (html) => {
                            //BUGFIX: ［summernote的bug］当文本减少时会触发两次事件（changing+changed）
                            if (html != this.value()) this._setValue(html)
                        }
                    },
                    snCfg: SummernoteOptions = {
                        airMode: false,
                        dialogsInBody: true,
                        dialogsFade: true,
                        disableDragAndDrop: cfg.disableDragAndDrop,
                        focus: cfg.autofocus,
                        fontNames: cfg.fontNames,
                        width: cfg.width,
                        height: cfg.height,
                        lang: cfg.locale,
                        placeholder: cfg.placeholder,
                        toolbar: <any>cfg.toolbar,
                        callbacks: callbacks
                    };

                if (cfg.buttons) {
                    let btnNames = [], btnJson = {};
                    cfg.buttons.forEach(btn => {
                        btnNames.push(btn.name);
                        btnJson[btn.name] = (ctx) => {
                            var ui = $.summernote.ui, button = ui.button({
                                contents: btn.html,
                                tooltip: btn.tip,
                                click: () => {
                                    btn.onClick.apply(this, [btn])
                                }
                            });
                            return button.render();
                        }
                    })
                    snCfg.toolbar.push(<any>['mybutton', btnNames]);
                    snCfg.buttons = btnJson;
                }
                this._mainEl.summernote(snCfg);
                //BUGFIX:［summernote的bug］placeholder未隐藏
                if (!this.isEmpty()) this.widgetEl.find('.note-placeholder').css('display', 'none');

                //add facemode
                let cls = '';
                this._eachMode('faceMode', mode => {
                    cls += ' border-' + mode;
                });
                this.widgetEl.find('div.note-editor').addClass(cls);

                super._onAfterRender()
            }

            protected _onAfterInit() {
                if (this.readonly()) this.readonly(true);
            }

            public isEmpty() {
                return this._mainEl.summernote('isEmpty')
            }

            public value(): string
            public value(val: string): this
            public value(val?: string): any {
                let cfg = <FormWidgetConfig<any>>this._config, oldVal = this._valueModel.get(this.name()) || '';
                if (arguments.length == 0) return oldVal;

                val = val || '';
                if (val != (this._getDomValue() || '')) this._mainEl.summernote('code', val);
                return this
            }

            protected _iniValue() {
                let cfg = <FormWidgetConfig<any>>this._config, v = cfg.iniValue || '';
                this._mainEl.summernote('code', v);
                this._setValue(v, true); //直接赋值给valueModel，因为编辑器第一次不会触发change事件
            }

            protected _getDomValue(): string {
                if (this.isEmpty()) return '';//防止编辑器的初始字符串：<p><br></p>
                let v = <string>this._mainEl.summernote('code')
                return v == void 0 ? '' : v
            }

            protected _showError(msg: string) {
                super._showError(msg);
                this.widgetEl.find('.note-editor').addClass('jsfx-input-error');
            }
            protected _hideError() {
                super._hideError();
                this.widgetEl.find('.note-editor').removeClass('jsfx-input-error');
            }
        }

    }

}
import TextEditor = JS.fx.TextEditor;
import TextEditorEvents = JS.fx.TextEditorEvents;
import TextEditorConfig = JS.fx.TextEditorConfig;