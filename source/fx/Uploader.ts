/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../../libs/webuploader/0.1.5/webuploader.d.ts" />
/// <reference path="../util/Files.ts"/>
/// <reference path="FormWidget.ts"/>
/// <reference path="Toast.ts"/>
/// <reference path="UploaderFiles.ts"/>

module JS {

    export namespace fx {

        let E = Check.isEmpty, A = Arrays;
        
        export enum UploaderFaceMode {
            list = 'list',
            image = 'image',
            square = 'square',
            round = 'round',
            shadow = 'shadow'
        }

        export class UploaderConfig extends FormWidgetConfig<Uploader> {
            readonly?: boolean = false;

            server?: string;
            dnd?: boolean = false;
            paste?: boolean | 'body' = false;
            accept?: FileAccepts;
            /**
             * 配置生成缩略图的选项。
             */
            thumb?: { width?: number, height?: number } = { width: 1, height: 1 };
            /**
             * 配置压缩的图片的选项。如果此选项为undefined, 则图片在上传前不进行压缩。
             */
            compress?: { width?: number, height?: number };

            maxNumbers?: number;
            maxTotalSize?: number;
            maxSingleSize?: number;
            duplicate?: boolean = true;
            needProgerss?: boolean;
            multiple?: boolean = false;

            /**
             * 文件上传域的name
             */
            fieldName?: string = 'file';

            uploadData?: JsonObject;

            faceMode?: UploaderFaceMode | UploaderFaceMode[] = [UploaderFaceMode.square, UploaderFaceMode.list];

            i18n?: URLString | UploaderResource;
            
            iniValue?: MimeFile[] = null;
            data?: MimeFile[] = null;
            dataFormat?: ResultSetFormat | ((this: Uploader, rawData: any) => ResultSet<MimeFile[]>);
            listeners?: UploaderListeners;
        }

        export interface UploaderListeners extends FormWidgetListeners<Uploader> {
            adding?: EventHandler1<Uploader, MimeFile>
            added?: EventHandler1<Uploader, MimeFile>
            removed?: EventHandler1<Uploader, MimeFile>
            uploading?: EventHandler1<Uploader, MimeFile>
            uploadprogress?: EventHandler2<Uploader, MimeFile, number>//file, percentage
            uploadsuccess?:  EventHandler2<Uploader, MimeFile, any>//file, response
            uploadfailure?: EventHandler2<Uploader, MimeFile, string>//file, reason
            uploaded?: EventHandler1<Uploader, MimeFile>
            beginupload?: EventHandler<Uploader>
            endupload?: EventHandler<Uploader>
        }

        export type UploaderEvents = FormWidgetEvents |
            'adding' | 'added' | 'removed' |
            'uploading' | 'uploadprogress' | 'uploadsuccess' | 'uploaderror' | 'uploaded' |
            'beginupload' | 'endupload';

        export type UploaderResource = {
            pickTitle: string,
            pickTip: string,
            retryTip: string,
            removeTip: string,
            viewDenied: string,
            exceedMaxSize: string,
            wrongDuplicate: string,
            wrongType: string,
            exceedNumbers: string,
            exceedMaxTotalSize: string
        }

        @widget('JS.fx.Uploader')
        export class Uploader extends FormWidget implements ICRUDWidget<MimeFile[]> {

            public static I18N: UploaderResource = {
                pickTitle: 'Select your local files please',
                pickTip: '<Accepts>\nFileExts={fileExts}\nMaxTotalSize={maxTotalSize}\nMaxNumbers={maxNumbers}\nMaxSingleSize={maxSingleSize}',
                retryTip: 'Retry',
                removeTip: 'Remove',
                viewDenied: 'The file can\'t be viewed in local mode',
                exceedMaxSize: 'Exceed the max size of single file',
                wrongDuplicate: 'Can\'t upload duplicate file',
                wrongType: 'Wrong file type',
                exceedNumbers: 'Exceed the max numbers of file',
                exceedMaxTotalSize: 'Exceed the max size of total files'
            }

            private _uploader: WebUploader.Uploader;

            constructor(cfg: UploaderConfig) {
                super(cfg);
            }

            protected _initUploader(cfg: UploaderConfig) {
                if (this._uploader) return;

                let me = this;
                $('#' + this.id).find('.classic-pick').on('click', function () {
                    $('#' + me.id).find('.webuploader-element-invisible').click();
                });

                let url = JS.config('libs')['webuploader.swf'];
                url = url.startsWith('~') ? (JS.config('libRoot') || '') + url.slice(1) : url;

                let cf = {
                    pick: {
                        id: `#${this.id} .pick`,
                        multiple: cfg.multiple
                    },
                    paste: cfg.paste == true ? `#${this.id}` : (cfg.paste == 'body' ? document.body : undefined),
                    dnd: cfg.dnd ? `#${this.id}` : undefined,
                    swf: url,
                    auto: true,
                    accept: cfg.accept || null,
                    fileNumLimit: cfg.maxNumbers || undefined,
                    fileSizeLimit: cfg.maxTotalSize || undefined,
                    fileSingleSizeLimit: cfg.maxSingleSize || undefined,
                    disableGlobalDnd: false,
                    duplicate: cfg.duplicate,
                    fileVal: cfg.fieldName,
                    formData: cfg.uploadData || {},
                    thumb: {
                        width: cfg.thumb && cfg.thumb.width,
                        height: cfg.thumb && cfg.thumb.height,
                        // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
                        allowMagnify: false,
                        // 是否允许裁剪。
                        crop: false,
                        // 为空的话则保留原有图片格式。
                        type: ''
                    },
                    compress: cfg.compress && cfg.compress.width && cfg.compress.height ? {
                        width: cfg.compress.width,
                        height: cfg.compress.height,
                        // 图片质量，只有type为`image/jpeg`的时候才有效。
                        quality: 90,
                        // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
                        allowMagnify: false,
                        // 是否允许裁剪。
                        crop: false,
                        // 是否保留头部meta信息。
                        preserveHeaders: true,
                        // 如果发现压缩后文件大小比原来还大，则使用原来图片
                        noCompressIfLarger: true,
                        // 单位字节，如果图片大小小于此值，不会采用压缩。
                        compressSize: 0
                    } : false
                };

                this._uploader = WebUploader.Uploader.create(<WebUploader.UploaderOptions>cf);

                let eMap = {
                    'adding': 'beforeFileQueued',
                    'added': 'filesQueued',
                    'removed': 'fileDequeued',
                    'uploading': 'uploadStart',
                    'uploadprogress': 'uploadProgress',
                    'uploadsuccess': 'uploadSuccess',
                    'uploaderror': 'uploadError',
                    'uploaded': 'uploadComplete',
                    'beginupload': 'startUpload',
                    'endupload': 'uploadFinished'
                };
                this._uploader.on(eMap['adding'], function (file) {
                    return me._fire('adding', [me._toMimeFile(file)]);
                });
                this._uploader.on(eMap['added'], function (files: Array<WebUploader.File>) {
                    files.forEach((file) => {
                        me._onFileQueued(file);
                    })
                    me._fire('added', [me._toMimeFiles(files)]);
                });
                this._uploader.on(eMap['removed'], function (file) {
                    me._onFileDequeued(file);
                    me._fire('removed', [me._toMimeFile(file)]);
                });
                this._uploader.on(eMap['uploading'], function (file, percentage) {
                    me._fire('uploading', [me._toMimeFile(file), percentage]);
                });
                this._uploader.on(eMap['uploaderror'], function (file, reason) {
                    me._onUploadFail(file);
                    me._fire('uploaderror', [me._toMimeFile(file), reason]);
                });
                this._uploader.on(eMap['uploadsuccess'], function (file, response) {
                    me._onUploadSuccess(file, response);
                    me._fire('uploadsuccess', [me._toMimeFile(file), response]);
                });
                this._uploader.on(eMap['uploaded'], function (file) {
                    me._fire('uploaded', [me._toMimeFile(file)]);
                });
                this._uploader.on(eMap['beginupload'], function () {
                    me._fire('beginupload');
                });
                this._uploader.on(eMap['endupload'], function () {
                    me._fire('endupload');
                });

                let errors = {
                    'F_EXCEED_SIZE': 'exceedMaxSize',
                    'F_DUPLICATE': 'wrongDuplicate',
                    'Q_TYPE_DENIED': 'wrongType',
                    'Q_EXCEED_NUM_LIMIT': 'exceedNumbers',
                    'Q_EXCEED_SIZE_LIMIT': 'exceedMaxTotalSize'
                }
                this._uploader.on('error', (type: string) => {
                    Toast.show({ type: 'error', message: me._i18n<string>(errors[type]), place: 'cb' })
                });
            }

            protected _showError(msg: string) {
                super._showError(msg);
                this.widgetEl.find('.body').addClass('jsfx-input-error');
            }
            protected _hideError() {
                super._hideError();
                this.widgetEl.find('.body').removeClass('jsfx-input-error');
            }

            /**
             * 在父类构造函数中的Widget初始化之前，由子类重载实现
             * @param config 
             */
            protected _onAfterRender() {
                this._initUploader(<UploaderConfig>this._config);
                super._onAfterRender();
            }

            private _createShadow(id: string, ctor: JQuery): JQuery {
                return $(`<div id="${id}"></div>`).css({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: "#808080",
                    opacity: 0.1,
                    zIndex: (Number(ctor.css('z-index')) || 0) + 1
                })
            }

            public readonly(): boolean
            public readonly(is: boolean): this
            public readonly(is?: boolean): any {
                let cfg = <UploaderConfig>this._config;
                if (arguments.length == 0) return cfg.readonly;

                if (cfg.readonly == is) return this;
                cfg.readonly = is;
                $(`#${this.id} .body`)[is ? 'addClass' : 'removeClass']('readonly');

                let p = $(`#${this.id} .pick`);
                is ? p.hide() : p.show();
                return this;
            }

            public disable() {
                if (!this.isEnabled()) return this;

                (<UploaderConfig>this._config).disabled = true;
                let ctor = $(`#${this.id} .body`).addClass('disabled');
                this._createShadow(this.id + '_shadow', ctor).appendTo(ctor);
                return this;
            }
            public enable() {
                if (this.isEnabled()) return this;

                (<UploaderConfig>this._config).disabled = false;
                $(`#${this.id} .body`).removeClass('disabled');
                $('#' + this.id + '_shadow').remove();
                return this;
            }

            private _pickText(key: string) {
                let cfg = <UploaderConfig>this._config,
                    fileExts = (cfg.accept && cfg.accept.title) || '*',
                    maxTotalSize = cfg.maxTotalSize ? Files.toSizeString(cfg.maxTotalSize) : '*',
                    maxNumbers = cfg.maxNumbers || '*',
                    maxSingleSize = cfg.maxSingleSize ? Files.toSizeString(cfg.maxSingleSize) : '*';
                return Strings.merge(this._i18n<string>(key) || '', {
                    fileExts: fileExts,
                    maxTotalSize: maxTotalSize,
                    maxNumbers: maxNumbers,
                    maxSingleSize: maxSingleSize
                })
            }

            protected _bodyFragment() {
                let cfg = <UploaderConfig>this._config,
                    title = this._pickText('pickTitle'),
                    tip = this._pickText('pickTip').replace(/\n/g, '&#10;'),
                    fag = !this._hasFaceMode(UploaderFaceMode.image) ?
                        `<ul class="files-area list"></ul>` :
                        `<div class="files-area image"></div>`,
                    cls = '';

                if (this._hasFaceMode(UploaderFaceMode.shadow)) cls += ' border-shadow';
                if (this._hasFaceMode(UploaderFaceMode.round)) cls += ' border-round';

                return `
                <div class="body font-${cfg.sizeMode || 'md'}${cls}">
                    <div class="pick" title="${tip}">
                        <i class="la la-cloud-upload"></i>
                        <span class="pick-title">${title}</span>
                    </div>
                    ${fag}
                </div>`
            }

            isCrud(): boolean {
                return true
            }

            public crudValue(): MimeFile[] {
                let val = this.value()||[],
                    iniVal = this.iniValue()||[],
                    arr = [];

                iniVal.forEach(v => {
                    if (val.findIndex(it => {
                        return it.id == v.id
                    }) < 0) {
                        arr[arr.length] = Jsons.union(v ,{ _crud: 'D' })
                    }
                });
                val.forEach(v => {
                    if (iniVal.findIndex(it => {
                        return it.id == v.id
                    }) < 0) {
                        if(!v.id.startsWith('WU_FILE_') && v.id!=v['_wuid']) arr[arr.length] = Jsons.union(v ,{ _crud: 'C' })
                    }
                });

                return arr;
            }

            public iniValue(): MimeFile[]
            public iniValue(v: MimeFile[], render?:boolean): this
            public iniValue(v?: MimeFile[], render?:boolean): any {
                if (arguments.length == 0) return super.iniValue();
                return super.iniValue(v, render)
            }

            public value(): MimeFile[]
            public value(file: MimeFile | MimeFile[]): this
            public value(file?: MimeFile | MimeFile[]): any {
                if (arguments.length == 0) return super.value();

                if (E(file)) {
                    this._uploader.reset();
                    $(`#${this.id} .files-area`).children().remove();
                    this._setValue(null);
                    return this;
                }
                return this.add(<any>file)
            }

            protected _equalValues(newVal: MimeFile[], oldVal: MimeFile[]): boolean {
                return A.equal(oldVal, newVal, (file1, file2) => {
                    return file1.id == file2.id
                })
            }

            public add(file: MimeFile | MimeFile[]) {
                if (E(file)) return this;

                this._addFiles(A.toArray(file));
                return this
            }
            //id可以是临时id，也可以是上传成功后的正式id
            public remove(id: string | string[]) {
                if (E(id)) return this;

                let rms: string[] = A.toArray(id);
                rms.forEach(i=>{
                    let el = this.widgetEl.find(`[file-id="${i}"]`);
                    if(el.length==1) this._removeFile(el.attr('wu-id'));
                })  
                return this
            }

            public data(): MimeFile[]
            public data(data: MimeFile[]): this
            public data(data?: MimeFile[]): any {
                if (arguments.length == 0) return this.value();
                return this.value(data)
            }

            private _onUploadSuccess(wuFile: WebUploader.File, res: any): void {
                let cfg = <UploaderConfig>this._config, fmt = cfg.dataFormat,
                    result: ResultSet<MimeFile> = Types.isFunction(fmt) ? (<Function>fmt).apply(this, res) : ResultSet.parseJSON(res, <any>fmt);
                if (result.success()) {
                    //update id + uri
                    let file = <MimeFile>result.data(),
                        val = this.value() || [],
                        index = val.findIndex(item => {
                            return wuFile.id == item.id;
                        })
                    if (index >= 0) {
                        let oFile = val[index];
                        oFile.id = file.id;//改写id成服务器端id
                        oFile.uri = file.uri;
                    }
                } else {
                    this._onUploadFail(wuFile);
                }
            }

            private _onUploadFail(file: WebUploader.File): void {
                this.widgetEl.find(`[file-id="${file.id}"]`).addClass('fail');
            }

            private _onFileDequeued(file: WebUploader.File) {
                this.widgetEl.find(`[wu-id="${file.id}"]`).remove();
                let newVal = Jsons.clone(this.value()).remove((mFile)=>{return mFile['_wuid']==file.id});
                this._valueModel.set(this.name(), newVal);
            }

            private _fileIcon(path: string) {
                let icon = 'alt';
                if (Files.isFileType(path, 'pdf')) {
                    icon = 'pdf'
                } else if (Files.isFileType(path, 'doc,docx')) {
                    icon = 'word'
                } else if (Files.isFileType(path, 'xls,xlsx')) {
                    icon = 'excel'
                } else if (Files.isFileType(path, 'ppt,pptx')) {
                    icon = 'powerpoint'
                } else if (Files.isFileType(path, FileTypes.AUDIOS)) {
                    icon = 'audio'
                } else if (Files.isFileType(path, FileTypes.VIDEOS)) {
                    icon = 'video'
                } else if (Files.isFileType(path, FileTypes.ZIPS)) {
                    icon = 'archive'
                } else if (Files.isFileType(path, FileTypes.CODES)) {
                    icon = 'code'
                } else if (Files.isFileType(path, FileTypes.IMAGES)) {
                    icon = 'image'
                }
                return '<span><i class="far fa-file-' + icon + '"></i></span>'
            }

            private _onFileQueued(wuFile: WebUploader.File) {
                let file = this._toMimeFile(wuFile);
                this._renderFile(file);
                if (this._hasFaceMode(UploaderFaceMode.image)) {
                    let isImage = Files.isFileType(file.name, FileTypes.IMAGES);
                    if (!file.uri && isImage) {
                        this._makeThumb(wuFile);//生成50%缩略图
                    } else if (!isImage) this.widgetEl.find(`[file-id=${file.id}] img`).replaceWith(this._fileIcon('.' + file.ext));
                }

                //已存在的文件则忽略不上传
                if (file.uri) this._uploader.skipFile(wuFile.id);
                //save wuid 
                file['_wuid'] = wuFile.id;
                this.widgetEl.find('[file-id]:last-child').attr('wu-id', wuFile.id);

                //需要同步添加至value
                this._setValue((this.value() || []).concat(file));
            }

            private _renderFile(file: MimeFile) {
                //file-id可能是source.id也可能是wu.id
                let url = file.uri || '', fId = file.id || '',
                    fileLink = `<a id="${this.id}-${fId}" src="${url}" href="javascript:void(0);">${file.name}</a>`,
                    retryTip = this._i18n<string>('retryTip') || 'Retry', removeTip = this._i18n<string>('removeTip') || 'Remove',
                    html = !this._hasFaceMode(UploaderFaceMode.image) ?
                $(`<li file-id="${fId}">
                    <div class="text-truncate file-name" title="${Strings.escapeHTML(file.name)}">
                        ${this._fileIcon('.' + file.ext)}
                        ${fileLink}
                    </div>
                    <div class="file-actions">
                        <span class="action remove text-center" title="${removeTip}"><i class="fa fa-times"></i></span>
                        <span class="action retry text-center" title="${retryTip}"><i class="fa fa-upload"></i></span>
                    </div>
                </li>`)
                    : $(`
                    <div file-id="${fId}">
                    <div class="file-image-area">
                        <div class="file-image items-center items-middle"><img id="${this.id}-${fId}" src="${url}"/></div>
                        <div class="file-actions">
                            <span class="action remove text-center" title="${removeTip}"><i class="fa fa-times"></i></span>
                            <span class="action retry text-center" title="${retryTip}"><i class="fa fa-upload"></i></span>
                        </div>
                    </div>
                    <div class="text-truncate file-name" title="${Strings.escapeHTML(file.name)}">
                    ${fileLink}
                    </div>
                    </div>
                `);
                this.widgetEl.find(`.files-area`).append(html);

                this._bindActions(fId);
            }

            private _makeThumb(file: WebUploader.File) {
                this._uploader.makeThumb(file, (error, src) => {
                    let el = this.widgetEl.find(`[file-id=${file.id}]`);
                    if (error) {
                        el.find('img').replaceWith(this._fileIcon('.' + file.ext));
                        return
                    }
                    el.find(`#${this.id}-${file.id}`).attr('src', src);
                });
            }

            private _bindActions(fileId: string): void {
                //enlarge
                let fEl = this.widgetEl.find(`[file-id="${fileId}"]`);
                fEl.on('click', !this._hasFaceMode(UploaderFaceMode.image) ? 'a' : 'a,.file-image', (e: JQuery.Event) => {
                    let src = this.widgetEl.find(`#${this.id}-${fileId}`).attr('src');
                    if (src) {
                        (Files.isFileType(src, FileTypes.IMAGES) || (<string>src).indexOf('data:image/') == 0) ? window.open().document.body.innerHTML = `<img src="${src}" >` : window.open(src);
                    } else {
                        Toast.show({
                            type: 'error',
                            message: this._i18n<string>('viewDenied')
                        })
                    }
                    return false
                });
                //remove
                fEl.on('click', '.action.remove', (e: JQuery.Event) => {
                    this._removeFile(fEl.attr('wu-id'));
                    fEl.remove();
                    return false
                })
                //retry
                fEl.on('click', '.action.retry', (e: JQuery.Event) => {
                    this._retryFile(fEl.attr('wu-id'));
                    return false
                })
            }

            private _toMimeFiles(wfs: WebUploader.File[]): MimeFile[] {
                if (E(wfs)) return [];

                let fs = [];
                wfs.forEach(file => {
                    fs.push(this._toMimeFile(file));
                })
                return fs;
            }
            private _toMimeFile(wf: WebUploader.File): MimeFile {
                if (!wf) return null;

                return {
                    id: wf.source.id || wf.id,
                    mime: wf.type,
                    name: wf.name,
                    ext: wf.ext,
                    size: wf.size,
                    uri: wf.source.uri
                }
            }
            private _toWUFile(cf: MimeFile): WebUploader.File {
                if (!cf) return null;
                if (!cf.uri) throw new URIError(`The file<${cf.name}> has not URI.`);
                let file = {
                    id: cf.id,
                    type: cf.mime,
                    name: cf.name,
                    ext: cf.ext || Files.getFileType(cf.name),
                    size: cf.size || 1,
                    getRuid: () => { return '' },
                    getSource: () => { return null }
                }

                file['uri'] = cf.uri;
                return file;
            }

            protected _removeFile(wuFileId: string) {
                let f = this._uploader.getFile(wuFileId);
                if (f) this._uploader.removeFile(f, true);
                return this
            }
            protected _retryFile(wuFileId: string) {
                let f = this._uploader.getFile(wuFileId);
                if (f) this._uploader.retry(f);
                return this
            }

            protected _addFiles(files: MimeFile[]) {
                if (E(files)) return this;

                let wuFiles = [], value = this.value()||[];
                files.forEach(f => {
                    //不可重复添加
                    if(value.findIndex((v)=>{return v.id==f.id})<0) wuFiles.push(new WebUploader.File(this._toWUFile(f)));
                })
                if(wuFiles.length>0) this._uploader.addFiles(wuFiles);
                return this
            }

            public inProgress(): boolean {
                return this._uploader.isInProgress();
            }

        }

    }

}
import Uploader = JS.fx.Uploader;
import UploaderEvents = JS.fx.UploaderEvents;
import UploaderConfig = JS.fx.UploaderConfig;
import UploaderFaceMode = JS.fx.UploaderFaceMode;
import UploaderResource = JS.fx.UploaderResource;
