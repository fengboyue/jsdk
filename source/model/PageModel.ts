/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../lang/System.ts"/>
/// <reference path="Model.ts"/>
/// <reference path="ListModel.ts"/>

module JS {

    export namespace model {

        export type PageModelEvents = ListModelEvents | 'pagechanged';

        export interface PageModelListeners<M = PageModel> extends ListModelListeners<M> {
            /**
             * @event (e, newPage, oldPage)
             */
            pagechanged: EventHandler2<M, number, number>
        };

        export interface PageQuery extends AjaxRequest {
            pageSize?: number;
            page?: number;
        }

        export interface PageModelParametersMapping {
            totalField?: string,
            pageField?: string,
            pageSizeField?: string,
            sortersField?: string
        }

        export class PageModelConfig extends ListModelConfig {
            dataQuery?: string | PageQuery = {
                url: '',
                pageSize: Infinity,
                page: 1
            };
            readonly listeners?: PageModelListeners<this>;
            readonly parametersMapping?: PageModelParametersMapping = {
                totalField: 'total',
                pageField: 'page',
                pageSizeField: 'pageSize',
                sortersField: 'sorters'
            };
        }

        /**
         * A pagation model class.
         */
        @klass('JS.model.PageModel')
        export class PageModel extends ListModel {
            protected _config: PageModelConfig;
            private _cacheTotal: number = null;//缓存服务器返回的值

            constructor(cfg?: PageModelConfig) {
                super(cfg);
            }

            protected _initConfig(cfg?: PageModelConfig) {
                return Jsons.union(new PageModelConfig(), cfg)
            }

            private _newParams<R>(query: PageQuery):string {
                let json = {}, cfg = this._config, mapping = cfg.parametersMapping;
                json[mapping.pageSizeField] = (!query.pageSize || query.pageSize == Infinity) ? '' : query.pageSize;
                json[mapping.pageField] = query.page || 1;
                json[mapping.totalField] = this._cacheTotal == null ? '' : this._cacheTotal;

                let sorters = this._config.sorters, s = '';
                if (sorters) {
                    sorters.forEach((sorter: Sorter) => {
                        s += `${sorter.field} ${sorter.dir ? sorter.dir : 'asc'},`;
                    });
                    json[mapping.sortersField] = s.slice(0, s.length - 1);
                }

                return URI.toQueryString(json)+'&'+(Types.isString(query.data)?query.data:URI.toQueryString(<JsonObject>query.data))
            }

            public load<R = JsonObject[]>(quy: string | PageQuery, silent?: boolean): Promise<ResultSet<R>> {
                this._check();

                let me = this,
                query = <PageQuery>Jsons.union(Ajax.toRequest(this._config.dataQuery),Ajax.toRequest(quy));
                
                this._fire('loading', [query]);
                me._config.dataQuery = query;//save for reload
                        
                return new JsonProxy().execute<R>({
                    method: query.method,
                    url: query.url
                }, me._newParams(query)).then(function (result: ResultSet<R>) {
                    if (result.success()) {
                        me.total(result.total());
                        me.setData(<any>result.data(), silent);
                        me._fire('loadsuccess', [result]);

                        let oldPage = me.getCurrentPage(), newPage = query.page;
                        if (oldPage != newPage) me._fire(<any>'pagechanged', [newPage, oldPage]);
                    } else {
                        me._fire('loadfailure', [result]);
                    }
                    return Promise.resolve(<any>result);
                }).catch(function (err: AjaxResponse | Error) {
                    me._fire('loaderror', [err]);
                });
            }
            public reload() {
                return this.load(null);
            }
            
            public loadPage(page?: number, isForce?: boolean) {
                if (!isForce && this.getCurrentPage() == page) return;
                return this.load(<any>{ page: page });
            }

            public total(): number
            public total(total?: number): this
            public total(total?: number): any {
                if (arguments.length == 0) return this._cacheTotal || this.size();

                this._cacheTotal = total == void 0 ? null : total;
                return this;
            }

            public pageSize(): number
            public pageSize(size?: number): this
            public pageSize(size?: number): any {
                let cfg = this._config, query = <PageQuery>cfg.dataQuery;
                if (arguments.length == 0) return query.pageSize;

                query.pageSize = size == void 0 ? Infinity : size;
                return this;
            }
            public getCurrentPage(): number {
                let cfg = this._config;
                return (<PageQuery>cfg.dataQuery).page;
            }
            public getPrevPage(): number {
                let page = this.getCurrentPage();
                return page <= 1 ? 1 : page - 1;
            }
            public getNextPage(): number {
                let currentPage = this.getCurrentPage()
                    , totalPages = this.getLastPage()
                return (currentPage + 1 > totalPages) ? totalPages : (currentPage + 1);
            }
            public getFirstPage(): number {
                return 1;
            }
            public getLastPage(): number {
                let total = this.total(), pageSize = this.pageSize();
                if (total == 0 || !isFinite(pageSize)) return 1;

                let max = Math.ceil(total / pageSize);
                return max == 0 ? 1 : max;
            }

            public loadPrevPage() {
                return this.loadPage(this.getPrevPage());
            }
            public loadNextPage() {
                return this.loadPage(this.getNextPage());
            }
            public loadFirstPage() {
                return this.loadPage(1);
            }
            public loadLastPage() {
                return this.loadPage(this.getLastPage());
            }
        }

    }
}

//预定义短类名
import PageModel = JS.model.PageModel;
import PageModelConfig = JS.model.PageModelConfig;
import PageModelEvents = JS.model.PageModelEvents;
import PageQuery = JS.model.PageQuery;

