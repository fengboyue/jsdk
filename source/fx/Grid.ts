/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../model/PageModel.ts"/>
/// <reference path="Widget.ts"/>

module JS {

    export namespace fx {

        export enum GridFaceMode {
            striped = 'striped',
            outline = 'outline',
            inline = 'inline'
        }

        export type GridHeadStyle = {
            cls?: string;
            textAlign?: 'left' | 'center' | 'right'
        }

        export type GridBodyStyle = {
            cls?: string;
            textAlign?: 'left' | 'center' | 'right';
        }

        export type GridColumnOption = {
            field: string;
            text: string;
            sortable?: boolean | 'asc' | 'desc';
            width?: number | string;
            tip?: string;
            renderer?: (value: any, rowNumber: number, colNumber: number, field: string) => string;
        }

        export class GridConfig extends WidgetConfig<Grid> {

            columns: Array<GridColumnOption>;
            checkable?: boolean = false;
            dataModel?: Klass<PageModel> = PageModel;
            data?: Array<object> = [];
            dataQuery?: string | PageQuery;
            /**
             * Auto load dataQuery after rendered.
             */
            autoLoad?: boolean = true;

            headStyle?: GridHeadStyle = {
                textAlign: 'left'
            };

            bodyStyle?: GridBodyStyle = {
                textAlign: 'left'
            };

            pageSizes?: number[] = [10, 20, 30, 50];

            pagingBar?: boolean = false;

            faceMode?: GridFaceMode | GridFaceMode[];

            i18n?: Resource | GridResource = null;

            listeners?: GridListeners;
        }

        export type GridEvents = WidgetEvents | 'loadsuccess' | 'loadfailure' | 'dataupdating' | 'dataupdated' | 'selected' | 'unselected' | 'allselected' | 'allunselected' | 'rowclick' | 'cellclick';

        export interface GridListeners extends WidgetListeners<Grid> {
            loadsuccess?: EventHandler<Grid>
            loadfailure?: EventHandler<Grid>
            dataupdating?: EventHandler<Grid>
            dataupdated?:EventHandler<Grid>
            selected?: EventHandler1<Grid, number> //rowNumber
            unselected?:EventHandler1<Grid, number> //rowNumber
            allselected?: EventHandler<Grid>
            allunselected?: EventHandler<Grid>
            rowclick?: EventHandler1<Grid, number> //rowNumber
            cellclick?: EventHandler2<Grid, number, number> //rowNumber, colNumber
        }

        export type GridResource = {
            firstPage: string,
            lastPage: string,
            previousPage: string,
            nextPage: string,
            rowsInfo: string,
            empty: string,
            loadingMsg: string
        }

        @widget('JS.fx.Grid')
        export class Grid extends Widget {

            public static I18N: GridResource = {
                firstPage: 'First Page',
                lastPage: 'Last Page',
                previousPage: 'Previous Page',
                nextPage: 'Next Page',
                rowsInfo: '{beginRow} - {endRow} of {total} records',
                empty: 'No data found.',
                loadingMsg: 'Loading...'
            }

            constructor(cfg: GridConfig) {
                super(cfg);
            }

            public getFieldName(col: number) {
                let cfg = <GridConfig>this._config, cols = cfg.columns;
                if (col <= 0 || col >= cols.length) return null;
                return cols[col+1].field
            }

            public getCellNode(row: number, col: number) {
                return $(`#${this.id}_btable`).find(`td>div[jsfx-row=${row}][jsfx-col=${col}]`)
            }

            protected _dataModel: PageModel;
            public dataModel<M extends PageModel>(): M {
                return <M>this._dataModel
            }
            protected _initDataModel() {
                let cfg = <GridConfig>this._config;
                this._dataModel = Class.newInstance<PageModel>(cfg.dataModel, {
                    iniData: cfg.data,
                    pageSize: (<PageQuery>cfg.dataQuery).pageSize
                });

                (<FormWidgetEvents[]>['loading', 'loadsuccess', 'loadfailure', 'loaderror', 'dataupdating', 'dataupdated']).forEach(e => {
                    let me = this;
                    this._dataModel.on(e, function () {
                        if (e == 'dataupdated') me.data(this.getData(), true);
                        me._fire<FormWidgetEvents>(e, Arrays.slice(arguments, 1));
                    })
                })
            }
            /**
             * 在父类构造函数中的Dom初始化之前，由子类重载实现
             * @param config 
             */
            protected _onBeforeInit() {
                let cfg = <GridConfig>this._config;
                //init dataQuery
                cfg.dataQuery = <PageQuery>Jsons.union({
                    page: 1,
                    pageSize: cfg.pageSizes ? cfg.pageSizes[0] : Infinity
                },Ajax.toRequest(cfg.dataQuery));

                cfg.dataModel = PageModel;
                this._initDataModel();
            }

            ////////////////////////////Checkbox私有方法区: BEGIN////////////////////////////
            private _hChk: JQuery = null;
            private _bChks: JQuery = null;
            private _headChk() {
                if (this._hChk == null) this._hChk = $(`#${this.id}_htable tr>th:first-child input:checkbox`);
                return this._hChk;
            }
            private _bodyChks() {
                if (this._bChks == null) this._bChks = $(`#${this.id}_btable tr>td:first-child input:checkbox`);
                return this._bChks;
            }

            private _newCheckbox(el, id: string, i?: number) {
                let me = this, cfg = me._config;
                new Checkbox({
                    renderTo: el,
                    width: 'auto',
                    colorMode: cfg.colorMode,
                    sizeMode: cfg.sizeMode,
                    data: [{ id: id }]
                }).on('click', function () {
                    this.isSelected() ? me.select(i) : me.unselect(i)
                })
            }
            private _bindHeadCheckbox() {//表头Checkbox事件
                if (!(<GridConfig>this._config).checkable) return;
                this._hChk = null;
                let span = $(`#${this.id}_htable tr>th:first-child span[jsfx-alias=checkbox]`);
                this._newCheckbox(span, '-1');
            }

            private _bindBodyCheckbox() {//表体Checkbox事件
                if (!(<GridConfig>this._config).checkable) return;
                this._bChks = null;
                let me = this, spans = $(`#${this.id}_btable tr>td:first-child span[jsfx-alias=checkbox]`);
                spans.each(function (i) {
                    me._newCheckbox(this, $(this).attr('jsfx-id'), i+1);
                })

            }
            ////////////////////////////Checkbox私有方法区: END////////////////////////////

            ////////////////////////////Checkbox公有方法区: BEGIN////////////////////////////
            /**
             * The row is selected?
             * @param row >=0
             */
            public isSelected(row: number): boolean {
                let chks = this._bodyChks();
                if (chks.length == 0) return false;

                return $(chks.get(row)).prop('checked')
            }

            /**
             * Select all rows.
             */
            public select()
            /**
             * Select one row.
             * @param row >=0
             */
            public select(row: number)
            public select(i?: number) {
                if (arguments.length == 0 || i == void 0) {
                    this._headChk().prop('checked', true);
                    this._bodyChks().prop('checked', true);
                    if(this.checkable()) $(`#${this.id}_btable`).find(`tr`).addClass('selected');

                    this._fire<GridEvents>('allselected');
                    return
                }

                $(this._bodyChks().get(i)).prop('checked', true);
                if(this.checkable()) $(`#${this.id}_btable`).find(`tr[jsfx-row=${i}]`).addClass('selected');
                this._fire<GridEvents>('selected', [i]);

                if (this._bodyChks().not(':checked').length == 0) {
                    this._headChk().prop('checked', true);
                    if(this.checkable()) $(`#${this.id}_btable`).find(`tr`).addClass('selected');

                    this._fire<GridEvents>('allselected');
                }
            }
            /**
             * Select all rows.
             */
            public unselect()
            /**
             * Select one row.
             * @param row >=0
             */
            public unselect(row: number)
            public unselect(i?: number) {
                if (arguments.length == 0 || i == void 0) {
                    this._headChk().prop('checked', false);
                    this._bodyChks().prop('checked', false);
                    if(this.checkable()) $(`#${this.id}_btable`).find(`tr`).removeClass('selected');

                    this._fire<GridEvents>('allunselected');
                    return
                }

                $(this._bodyChks().get(i)).prop('checked', false);
                if(this.checkable()) $(`#${this.id}_btable`).find(`tr[jsfx-row=${i}]`).removeClass('selected');
                this._fire<GridEvents>('unselected', [i]);

                this._headChk().prop('checked', false);
                if (this._bodyChks().not(':not(:checked)').length == 0) {
                    if(this.checkable()) $(`#${this.id}_btable`).find(`tr`).removeClass('selected');

                    this._fire<GridEvents>('allunselected');
                }
            }

            public getSelectedIds(): string[] {
                let chks = this._bodyChks(), ids = [];
                chks.each((i: number, el: HTMLElement) => {
                    let n = $(el);
                    if (n.prop('checked')) ids[ids.length] = n.val();
                });
                return ids;
            }
            public getSelectedData(): JsonObject[] {
                let chks = this._bodyChks(), data = [], cData = this.data();
                chks.each((i: number, el: HTMLElement) => {
                    if ($(el).prop('checked')) {
                        data.push(cData[i]);
                    }
                });
                return data;
            }

            public checkable(){
                return (<GridConfig>this._config).checkable
            }

            public hideCheckbox() {
                this.widgetEl.find('.table tr').find('th:eq(0),td:eq(0)').find('.jsfx-checkbox').hide()
            }
            public showCheckbox() {
                this.widgetEl.find('.table tr').find('th:eq(0),td:eq(0)').find('.jsfx-checkbox').show()
            }
            ////////////////////////////Checkbox公有方法区: END////////////////////////////


            ////////////////////////////列及排序方法区: BEGIN////////////////////////////
            private _colIndexOf(field: string) {
                let name = <string>field;
                let col = (<GridConfig>this._config).columns.findIndex((option: GridColumnOption) => {
                    return option.field == name;
                });
                if (col < 0) throw new Errors.NotFoundError(`Not found the field:<${name}>`);
                return col;
            }

            public hideColumn(col: number)
            public hideColumn(field: string)
            public hideColumn(v: number | string) {
                let i = Types.isNumeric(v) ? Number(v)-1 : this._colIndexOf(<string>v);
                this.widgetEl.find(`tr th:eq(${i}),tr td:eq(${i})`).hide();
            }

            public showColumn(col: number)
            public showColumn(field: string)
            public showColumn(v: number | string) {
                let i = Types.isNumeric(v) ? Number(v)-1 : this._colIndexOf(<string>v);
                this.widgetEl.find(`tr th:eq(${i}),tr td:eq(${i})`).show();
            }

            private _bindSortFields() {
                let cols = (<GridConfig>this._config).columns;
                cols.forEach((col: GridColumnOption) => {
                    if (col.sortable) this._bindSortField(col.field, Types.isBoolean(col.sortable) ? 'desc' : <'asc' | 'desc'>col.sortable);
                })
            }

            private _bindSortField(fieldName: string, defaultDir: 'desc' | 'asc') {
                let me = <Grid>this,
                    el = this.widgetEl.find('#' + this.id + '_sort_' + fieldName);
                el.click(function () {
                    let jEl = $(this);
                    if (jEl.hasClass('la-arrow-up')) {
                        me._sortField(fieldName, 'desc', jEl);
                    } else {
                        me._sortField(fieldName, 'asc', jEl);
                    }
                    me.reload();
                })
                this._sortField(fieldName, defaultDir, el);
            }

            private _sortField(field: string, dir: 'desc' | 'asc', el: JQuery) {
                let model = <PageModel>this._dataModel;
                if ('desc' == dir) {
                    el.removeClass('la-arrow-up').addClass('la-arrow-down');
                    model.addSorter(field, 'desc');
                } else {
                    el.removeClass('la-arrow-down').addClass('la-arrow-up');
                    model.addSorter(field, 'asc');
                }
            }
            ////////////////////////////列及排序方法区: END////////////////////////////

            ////////////////////////////表渲染区: BEGIN////////////////////////////
            private _thHtml(col: GridColumnOption, colNumber: number): string {
                let cfg = <GridConfig>this._config,
                    html = col.text,
                    title = col.tip ? col.tip : col.text,
                    sortDir = col.sortable === true ? 'desc' : '' + col.sortable,
                    sort = col.sortable ? `<i id="${this.id + '_sort_' + col.field}" style="cursor:pointer;vertical-align:middle;" class="la la-arrow-${sortDir == 'asc' ? 'up' : 'down'}"></i>` : '',
                    hasCheckbox = colNumber == 1 && cfg.checkable,
                    width = Lengths.toCssString(col.width,'100%'),
                    cell =
                        `<div class="cell items-${cfg.headStyle.textAlign} items-middle" jsfx-col="${colNumber}" title="${title}">
                    ${html}${sort ? sort : ''}</div>`;

                if (col.sortable) this._dataModel.addSorter(col.field, <any>sortDir);
                return `<th width="${width}" nowrap>
                ${hasCheckbox ? `<div class="items-left items-middle"><span jsfx-alias="checkbox"/>${cell}</div>` : cell}
                </th>`;
            }
            private _tdHtml(opt: GridColumnOption, html: string, title: string, col: number, row: number): string {
                let cfg = <GridConfig>this._config,
                    hasCheckbox = col == 0 && cfg.checkable,
                    id = this.data()[row]['id'],
                    width = Lengths.toCssString(opt.width,'100%'),
                    cell =
                        `<div class="cell items-${cfg.bodyStyle.textAlign} items-middle" jsfx-row="${row}" jsfx-col="${col}" title="${title}">
                    ${html}</div>`;
                return `<td width="${width}" nowrap>
                ${hasCheckbox ? `<div class="items-left items-middle" jsfx-row="${row}" jsfx-col="${col}"><span jsfx-alias="checkbox" jsfx-id="${id}"/>${cell}</div>` : cell}
                </td>`;
            }

            private _headHtml(columns: Array<GridColumnOption>) {
                let html = '';
                columns.forEach((col: GridColumnOption, i: number) => {
                    html += this._thHtml(col, i+1);
                }, this);
                return html;
            }

            private _renderBody() {
                let cfg = <GridConfig>this._config,
                    columns = cfg.columns, data = this.data() || [];
                if (!columns) return;

                let html = '';
                data.forEach((rowData: JsonObject, rowIndex: number) => {
                    if (rowData) {
                        let tr = '';
                        columns.forEach((col: GridColumnOption, colIndex: number) => {
                            if (col) {
                                let val = rowData[col.field], hVal = val == void 0 ? '' : Strings.escapeHTML(String(val));
                                tr += this._tdHtml(col, col.renderer ? col.renderer.call(this, val, colIndex, rowIndex) : hVal, hVal, colIndex, rowIndex);
                            }
                        });
                        tr = `<tr jsfx-row="${rowIndex}">${tr}</tr>`;
                        html += tr;
                    }
                });

                Check.isEmpty(data)?$(`#${this.id}_nodata`).show():$(`#${this.id}_nodata`).hide();
                
                $(`#${this.id}_btable>tbody`).off().empty().html(html)
                    .off('click', 'tr').on('click', 'tr', (e: JQuery.Event) => {
                        let row = $(e.currentTarget), rowNumber = parseInt(row.attr('jsfx-row'));
                        this._fire<GridEvents>('rowclick', [rowNumber])
                        if(this.checkable()) this.isSelected(rowNumber) ? this.unselect(rowNumber) : this.select(rowNumber);    
                        return false;
                    })
                    .off('click', 'td>div').on('click', 'td>div', (e: JQuery.Event) => {
                        let row = $(e.currentTarget),
                            colNumber = parseInt(row.attr('jsfx-col')),
                            rowNumber = parseInt(row.attr('jsfx-row'));
                        this._fire<GridEvents>('cellclick', [rowNumber, colNumber])    
                        return true;
                    });
                this._bindBodyCheckbox();
            }
            ////////////////////////////表渲染区: END////////////////////////////

            ////////////////////////////翻页渲染区: BEGIN////////////////////////////
            private _pageHtml(page: number) {
                let model = <PageModel>this._dataModel;
                return `
                <li>
                    <a class="pager-link pager-link-number ${model.getCurrentPage() == page ? 'selected' : ''}" data-page="${page}" title="${page}">${page}</a>
                </li>
                `
            }
            private _pagesHtml() {
                let model = <PageModel>this._dataModel,
                    page = model.getCurrentPage(),
                    lastPage = model.getLastPage(),
                    html = '';

                let begin = page < 6 ? 1 : ((lastPage - 4) <= page ? lastPage - 4 : page - 2),
                    end = (begin + 4) > lastPage ? lastPage : (begin + 4),
                    empty = '<li><a href="javascript:void(0);">...</a></li>';
                if (begin > 1) html += empty;
                for (let i = begin; i <= end; i++) {
                    html += this._pageHtml(i);
                }
                if ((lastPage - end) > 0) html += empty;
                return html;
            }
            private _pagesizeHtml(pagesize: number) {
                let cfg = <GridConfig>this._config,
                    size = (<PageQuery>cfg.dataQuery).pageSize,
                    selected = size == pagesize ? '<i class="fa fa-check"></i>' : '';
                return `<button class="dropdown-item ${cfg.sizeMode ? 'btn-' + cfg.sizeMode : ''} ${selected ? 'selected' : ''}" jsfx-pagesize="${pagesize}">${pagesize}${selected}</button>`
            }
            private _pagesizesHtml() {
                let pageSizes = (<GridConfig>this._config).pageSizes;
                if (!pageSizes) return '';

                let html = '';
                pageSizes.forEach(size => {
                    html += this._pagesizeHtml(size);
                });
                return html;
            }

            private _renderPagingbar() {
                if (!(<GridConfig>this._config).pagingBar) return;

                let cfg = <GridConfig>this._config,
                    model = <PageModel>this._dataModel,
                    el = $(`#${this.id}_pagingbar`),
                    page = model.getCurrentPage(),
                    prevPage = model.getPrevPage(),
                    nextPage = model.getNextPage(),
                    lastPage = model.getLastPage(),
                    pageSize = (<PageQuery>cfg.dataQuery).pageSize,
                    total = model.total(),
                    beginRow = total == 0 ? 0 : pageSize * (page - 1) + 1,
                    endRow = total == 0 ? 0 : (page == lastPage ? total : page * pageSize);

                let rowsInfo: string = Strings.merge(this._i18n('rowsInfo'), {
                    beginRow: beginRow,
                    endRow: endRow,
                    total: total
                }) || '', html =
                        `<ul class="pager-nav">
                    <li>
                        <a title="${this._i18n('firstPage')}" class="pager-link pager-link-arrow" data-page="1">
                            <i class="la la-angle-double-left"></i>
                        </a>
                    </li>
                    <li>
                        <a title="${this._i18n('previousPage')}" class="pager-link pager-link-arrow" data-page="${prevPage}">
                            <i class="la la-angle-left"></i>
                        </a>
                    </li>
                    ${this._pagesHtml()}
                    <li>
                        <a title="${this._i18n('nextPage')}" class="pager-link pager-link-arrow" data-page="${nextPage}">
                            <i class="la la-angle-right"></i>
                        </a>
                    </li>
                    <li>
                        <a title="${this._i18n('lastPage')}" class="pager-link pager-link-arrow" data-page="${lastPage}">
                            <i class="la la-angle-double-right"></i>
                        </a>
                    </li>
                </ul>
                <div class="pager-info items-middle">
                    <div class="btn-group dropup">
                        <button id="${this.id}_pagesize" title="选择每页条数" class="btn dropdown-toggle ${cfg.sizeMode ? 'btn-' + cfg.sizeMode : ''}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        ${pageSize}
                        </button>
                        <div class="dropdown-menu">
                        ${this._pagesizesHtml()}
                        </div>
                    </div>
                    <span class="pager-detail">${rowsInfo}</span>
                </div>`
                el.html(html);

                let me = this, pages = this.widgetEl.find('a.pager-link');
                pages.click(function () {
                    let pNumber = parseInt($(this).attr('data-page'));
                    if (pNumber) me.loadPage(pNumber);
                })
                let buttons = this.widgetEl.find('div.pager-info div.dropdown-menu>button');
                buttons.click(function () {
                    me._changePageSize($(this));
                })

                //取消全部选中
                this.unselect();
            }
            ////////////////////////////翻页渲染区: END////////////////////////////

            private _changePageSize(el: JQuery) {
                el.siblings().removeClass('selected').find('i').remove();
                el.remove('i').addClass('selected').append('<i class="fa fa-check"></i>');
                let pageSize = parseInt(el.attr('jsfx-pagesize'));
                $('#' + this.id + '_pagesize').text(pageSize);

                this.load(<any>{pageSize: pageSize});
            }

            public loadPage(page: number) {
                return (<PageModel>this._dataModel).loadPage(page);
            }

            public clear(): this {
                return this.data(null)
            }

            protected _render() {
                let cfg = <GridConfig>this._config,
                    heights = {
                        md: 34
                    },
                    bodyCls = 'table';

                if (this._hasFaceMode(GridFaceMode.striped)) bodyCls += ' striped';

                let hStyle = cfg.headStyle,
                    bStyle = cfg.bodyStyle,
                    bHeight = Types.isNumeric(cfg.height) ? (Number(cfg.height) - heights[cfg.sizeMode]) + 'px' : '100%',
                    html =
                        `<!-- 表头容器 -->
                    <div class="head">
                        <table id="${this.id}_htable" class="table ${hStyle.cls || ''}">
                            <tr>
                            ${this._headHtml(cfg.columns)}
                            </tr>
                        </table>
                    </div>
                    <!-- 表体容器-->
                    <div class="body" style="height:${bHeight};min-height:${bHeight};max-height:${bHeight};">
                        <div id="${this.id}_nodata" class="items-center items-middle w-100 h-100">
                        ${this._i18n('empty')}
                        </div>
                        <table id="${this.id}_btable" class="${bodyCls}">
                            <tbody text-align="${bStyle.textAlign}">
                            </tbody>
                        </table>
                    </div>        
                    <!-- 分页容器-->
                    <div id="${this.id}_pagingbar" class="pager"></div>`;

                let cls = ` ${cfg.colorMode || ''} ${cfg.sizeMode} ${this._hasFaceMode(GridFaceMode.outline) ? 'outline' : ''} ${this._hasFaceMode(GridFaceMode.inline) ? 'inline' : ''}`;
                this.widgetEl.addClass(cls).css('max-width', cfg.width ? cfg.width : 'auto').html(html);
            }

            protected _onAfterRender() {
                let cfg = <GridConfig>this._config;
                if (cfg.data) this.data(cfg.data, true);
                let pageQuery = <PageQuery>cfg.dataQuery;
                if (pageQuery.url && cfg.autoLoad) this.load(pageQuery);

                this._bindHeadCheckbox();
                this._bindSortFields();

                let head = this.widgetEl.find('.head');
                let body = this.widgetEl.find('.body');
                body.scroll(() => {//head,body的table联动
                    head.scrollLeft(body.scrollLeft());
                });

                //宽度响应式
                $(`${this.id}_htable`).resize(() => {//head,body的table等宽
                    $(`${this.id}_htable`).css('width', $(`${this.id}_btable`).css('width'));
                })
            }

            protected _renderData() {
                this._renderBody();
                this._renderPagingbar();
            }

            public data(): any
            public data(data: any, silent?: boolean): this
            public data(data?: any, silent?: boolean): any {
                let cfg = <GridConfig>this._config;
                if (arguments.length == 0) return this._dataModel.getData();

                this._dataModel.setData(data, silent);
                this._renderData();
                return this;
            }

            public load<M>(quy: string | PageQuery, silent?: boolean): Promise<ResultSet<M>> {
                let cfg = <FormWidgetConfig<any>>this._config,
                oQuery = Ajax.toRequest(cfg.dataQuery), nQuery = Ajax.toRequest(quy);

                cfg.dataQuery = <PageQuery>Jsons.union(oQuery, {
                    page: 1,
                    pageSize: Number($(`#${this.id}_pagesize`).text())
                }, nQuery);
                return this._dataModel.load(<PageQuery>cfg.dataQuery, silent);
            }

            public reload() {
                this._dataModel.reload();
                return this
            }

        }

    }

}
import Grid = JS.fx.Grid;
import GridFaceMode = JS.fx.GridFaceMode;
import GridResource = JS.fx.GridResource;
import GridEvents = JS.fx.GridEvents;
import GridColumnOptions = JS.fx.GridColumnOption;
import GridHeadStyle = JS.fx.GridHeadStyle;
import GridBodyStyle = JS.fx.GridBodyStyle;
import GridConfig = JS.fx.GridConfig;
import GridListeners = JS.fx.GridListeners;