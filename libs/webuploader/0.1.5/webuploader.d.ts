declare module WebUploader {

    interface PickerOptions {
        /**
         * @property {Seletor|dom} 指定选择文件的按钮容器，不指定则不创建按钮。注意 这里虽然写的是 id, 但是不是只支持 id, 还支持 class, 或者 dom 节点。
         */
        id?: JQuery.Selector | Document
        /**
         * @property{String} 请采用 innerHTML 代替
         */
        label?: string;
        /**
         * @property {String} 指定按钮文字。不指定时优先从指定的容器中看是否自带文字。
         */
        innerHTML?: string;
        /**
         * @property {Boolean} 是否开起同时选择多个文件能力。
         */
        multiple?: boolean;
    }
    interface AcceptOptions {
        /**
         * @property {String} 文字描述
         */
        title?: string;
        /**
         * @property {String} 允许的文件后缀，不带点，多个用逗号分割。
         */
        extensions?: string;
        /**
         * @property {String} 多个用逗号分割。
         */
        mimeTypes?: string;
    }
    interface ThumbOptions {
        width?: number;
        height?: number;

        // 图片质量，只有type为`image/jpeg`的时候才有效。
        quality?: number;

        // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
        allowMagnify: boolean;

        // 是否允许裁剪。
        crop: boolean;

        // 为空的话则保留原有图片格式。
        // 否则强制转换成指定的类型。
        type: string;
    }
    interface CompressOptions {
        width?: number;
        height?: number;

        // 图片质量，只有type为`image/jpeg`的时候才有效。
        quality?: number;

        // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
        allowMagnify: boolean,

        // 是否允许裁剪。
        crop: boolean,

        // 是否保留头部meta信息。
        preserveHeaders: boolean,

        // 如果发现压缩后文件大小比原来还大，则使用原来图片
        // 此属性可能会影响图片自动纠正功能
        noCompressIfLarger: boolean,

        // 单位字节，如果图片大小小于此值，不会采用压缩。
        compressSize?: number;
    }
    interface UploaderOptions {
        // swf文件路径
        swf?: string;

        // 文件接收服务端。
        server?: string;

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.

        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        resize?: boolean;
        /**
         * @property {Selector} [可选] [默认值：undefined] 指定Drag And Drop拖拽的容器，如果不指定，则不启动。
         */
        dnd?: JQuery.Selector;
        /**
         * @property {Selector} [可选] [默认值：false] 是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开。
         */
        disableGlobalDnd?: boolean;
        /**
         * @property {Selector} [可选] [默认值：undefined] 指定监听paste事件的容器，如果不指定，不启用此功能。此功能为通过粘贴来添加截屏的图片。建议设置为document.body.
         */
        paste?: Element|JQuery.Selector;
        /**
         * @property {Selector, Object} [可选] [默认值：undefined] 指定选择文件的按钮容器，不指定则不创建按钮。
         */
        pick?: JQuery.Selector | PickerOptions;

        /**
         * @property {Array} [可选] [默认值：null] 指定接受哪些类型的文件。 由于目前还有ext转mimeType表，所以这里需要分开指定。
         */
        accept?: AcceptOptions;

        /**
         * @property {Object} [可选] 配置生成缩略图的选项。
         */
        thumb?: ThumbOptions;
        /**
         * @property {Object} [可选] 配置压缩的图片的选项。如果此选项为false, 则图片在上传前不进行压缩。
         */
        compress?: CompressOptions;
        /**
         * @property {Boolean} [可选] [默认值：false] 设置为 true 后，不需要手动调用上传，有文件选择即开始上传。
         */
        auto?: boolean;
        /**
         * @property {Object} [可选] [默认值：html5,flash] 指定运行时启动顺序。默认会想尝试 html5 是否支持，如果支持则使用 html5, 否则则使用 flash.
         * 可以将此值设置成 flash，来强制使用 flash 运行时。
         */
        // runtimeOrder?: any;
        /**
         * @property {Boolean} [可选] [默认值：false] 是否允许在文件传输时提前把下一个文件准备好。 
         * 对于一个文件的准备工作比较耗时，比如图片压缩，md5序列化。 如果能提前在当前文件传输期处理，可以节省总体耗时。
         */
        prepareNextFile?: boolean;
        /**
         * @property {Boolean} [可选] [默认值：false] 是否要分片处理大文件上传。
         */
        chunked?: boolean;
        /**
         * @property {Boolean} [可选] [默认值：5242880] 如果要分片，分多大一片？ 默认大小为5M.
         */
        chunkSize?: boolean;
        /**
         * @property {Boolean} [可选] [默认值：2] 如果某个分片由于网络问题出错，允许自动重传多少次？
         */
        chunkRetry?: boolean;
        /**
         * @property {Boolean} [可选] [默认值：3] 上传并发数。允许同时最大上传进程数。
         */
        threads?: boolean;
        /**
         * @property {Object} [可选] [默认值：{}] 文件上传请求的参数表，每次发送都会发送此对象中的参数。
         */
        formData?: object;
        /**
         * @property {Object} [可选] [默认值：'file'] 设置文件上传域的name。
         */
        fileVal?: string;
        /**
         * @property {Object} [可选] [默认值：'POST'] 文件上传方式，POST或者GET。
         */
        method?: 'POST' | 'GET'
        /**
         * @property {Object} [可选] [默认值：false] 是否已二进制的流的方式发送文件，这样整个上传内容php://input都为文件内容， 其他参数在$_GET数组中。
         */
        sendAsBinary?: boolean;
        /**
         * @property {int} [可选] [默认值：undefined] 验证文件总数量, 超出则不允许加入队列。
         */
        fileNumLimit?: number;
        /**
         * @property {int} [可选] [默认值：undefined] 验证文件总大小是否超出限制, 超出则不允许加入队列。
         */
        fileSizeLimit?: number;
        /**
         * @property {int} [可选] [默认值：undefined] 验证单个文件大小是否超出限制, 超出则不允许加入队列。
         */
        fileSingleSizeLimit?: number;
        /**
         * @property {Boolean} [可选] [默认值：undefined] 去重， 根据文件名字、文件大小和最后修改时间来生成hash Key.
         */
        duplicate?: boolean;
        /**
         * @property {String, Array} [可选] [默认值：undefined] 默认所有 Uploader.register 了的 widget 都会被加载，如果禁用某一部分，请通过此 option 指定黑名单。
         */
        disableWidgets?: string | Array<any>;

        headers?: object;

    }

    type Stat = {
        successNum?: number,// 上传成功的文件数
        progressNum?: number,// 上传中的文件数
        cancelNum?: number,// 被删除的文件数
        invalidNum?: number,// 无效的文件数
        uploadFailNum?: number,// 上传失败的文件数
        queueNum?: number,// 还在队列中的文件数
        interruptNum?: number// 被暂停的文件数
    }

    enum FileStatus {
        inited = 'inited',// 初始状态
        queued = 'queued',// 已经进入队列, 等待上传
        progress = 'progress',// 上传中
        complete = 'complete',// 上传完成。
        error = 'error',// 上传出错，可重试
        interrupt = 'interrupt',// 上传中断，可续传
        invalid = 'invalid',// 文件不合格，不能重试上传。会自动从队列中移除
        cancelled = 'cancelled'// 文件被移除
    }

    class File {
        constructor(source: object);

        id: string;
        name: string;
        size: number;
        type: string;
        lastModifiedDate?: number;
        ext: string;
        statusText?: FileStatus;
        source?: JsonObject;
        getStatus?(): FileStatus;
        getRuid?(): string;
        getSource?(): any;
    }

    class Uploader {
        constructor(options: UploaderOptions);

        static create(options: UploaderOptions): Uploader;

        getStat(): Stat;
        destroy(): void;
        addFiles(file: File | Array<File>): any;
        removeFile(file: File | string, isDelete?: boolean);
        getFile(id: string): File;
        getFiles(status?: FileStatus): Array<File>;
        retry(file?: File);
        sort(fn: Function);
        reset(); //重置队列
        upload(file: File | string);//开始上传。此方法可以从初始状态调用开始上传流程，也可以从暂停状态调用，继续上传流程。可以指定开始某一个文件。
        stop(suspend?: boolean);//暂停上传。第一个参数为是否中断上传当前正在上传的文件。
        stop(file?: File);//如果第一个参数是文件，则只暂停指定文件。
        cancelFile(file: File | string);//标记文件状态为已取消, 同时将中断文件传输。
        isInProgress(): boolean //判断Uplaoder是否正在上传中。
        skipFile(file: File | string); //跳过一个文件上传，直接标记指定文件为已上传状态。
        //当 width 或者 height 的值介于 0 - 1 时，被当成百分比使用
        makeThumb(file: File, callback: (error: boolean, dataURL: string) => void, width?: number, height?: number);

        off(eventName: string);
        on(eventName: string, callback: Function);
        on(eventName: 'beforeFileQueued', callback: (file: File) => void);
        on(eventName: 'fileQueued', callback: (file: File) => void);
        on(eventName: 'filesQueued', callback: (file: File) => void);
        on(eventName: 'fileDequeued', callback: (file: File) => void);
        on(eventName: 'uploadStart', callback: (file: File) => void);
        on(eventName: 'uploadProgress', callback: (file: File, percentage: number) => void);
        on(eventName: 'uploadSuccess', callback: (file: File, response: object) => void);
        on(eventName: 'uploadError', callback: (file: File, reason: string) => void);
        on(eventName: 'uploadComplete', callback: (file: File) => void);
        on(eventName: 'error', callback: (type: string) => void);
    }

}


