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
        /**
         * @type CarouselItem
         */
        export type CarouselItem = {
            src: string;
            caption?: string;
            desc?: string;
            imgAlt?: string;
        }
        export class CarouselConfig extends WidgetConfig<Carousel> {
            items?: Array<CarouselItem>;
            /**
             * The amount of time to delay between automatically cycling an item. If false, carousel will not automatically cycle.
             *
             * @default 5000
             */
            interval?: number | false = 5000 //5 seconds
            /**
             * Actived item index
             */
            activeIndex?: number = 0;
            listeners?: CarouselListeners;
        }

        export type CarouselEvents = WidgetEvents | 'transiting' | 'transited';

        /**
         * [fromIndex,toIndex]
         */
        export type CarouselEventHandler_Transiting<W> = EventHandler2<W, number, number>;
        /**
         * [fromIndex,toIndex]
         */
        export type CarouselEventHandler_Transited<W> = EventHandler2<W, number, number>;

        export interface CarouselListeners extends WidgetListeners<Carousel> {
            transiting?: CarouselEventHandler_Transiting<Carousel>
            transited?: CarouselEventHandler_Transited<Carousel>
        }

        @widget('JS.fx.Carousel')
        export class Carousel extends Widget {

            constructor(cfg: CarouselConfig) {
                super(cfg)
            }

            public prev(): Carousel {
                this.widgetEl.carousel('prev');
                return this;
            }
            public next(): Carousel {
                this.widgetEl.carousel('next');
                return this;
            }
            public pause(): Carousel {
                this.widgetEl.carousel('pause');
                return this;
            }
            public cycle(): Carousel {
                this.widgetEl.carousel('cycle');
                return this;
            }
            /**
             * Slide index from 0.
             * @param num 
             */
            public goto(num: number): Carousel {
                this.widgetEl.carousel(num);
                return this;
            }

            protected _destroy() {
                this.widgetEl.carousel('dispose');
                super._destroy();
            }

            public length() {
                let items = (<CarouselConfig>this._config).items;
                return !items ? 0 : items.length
            }

            public add(item: CarouselItem, from?: number) {
                let size =  this.length();
                if (!Types.isDefined(from) || from >= size) from = size-1;

                let cfg = <CarouselConfig>this._config;
                cfg.items = cfg.items||[];
                cfg.items.add([item], from);
                this._renderItems(from);
                return this
            }

            public remove(num: number) {
                if (!Types.isDefined(num) || num < 0) return this;
                let size = this.length();
                if (size == 0 || num >= size) return this;

                let cfg = <CarouselConfig>this._config;
                if (!cfg.items) cfg.items = [];
                cfg.items.remove(num);
                this._renderItems(num>=0?num:0);
                return this
            }
            public clear() {
                this.widgetEl.find('.carousel-indicators').empty();
                this.widgetEl.find('.carousel-inner').empty();
                (<CarouselConfig>this._config).items = null;
            }

            private _limitActive() {
                let cfg = <CarouselConfig>this._config, size = this.length();
                cfg.activeIndex = cfg.activeIndex >= (size-1) ? (size-1) : (cfg.activeIndex <= 0 ? 0 : cfg.activeIndex);
            }

            private _indHtml(i: number) {
                let is = (<CarouselConfig>this._config).activeIndex == i;
                return `<li data-target="#${this.id}" data-slide-to="${i}" class="${is ? 'active' : ''}"></li>`
            }
            private _itemHtml(item: CarouselItem, i: number) {
                let is = (<CarouselConfig>this._config).activeIndex == i;
                let capHtml = '';

                if (item.caption || item.desc) {
                    capHtml =
                        `<div class="carousel-caption d-md-block">
                        <h5>${item.caption || ''}</h5>
                        <p>${item.desc || ''}</p>
                    </div>`
                }
                return `
                <div class="carousel-item ${is ? 'active' : ''}" jsfx-index="${i}">
                    <img class="d-block w-100" src="${item.src}" style="height:${Lengths.toCSS(this._config.height, '100%')};" alt="${item.imgAlt || ''}">
                    ${capHtml}
                </div>
                `
            }

            private _renderItems(num:number) {
                this._limitActive();
                let cfg = <CarouselConfig>this._config, indsHtml = '', itemsHtml = '';

                if (cfg.items) cfg.items.forEach((item, i) => {
                    indsHtml += this._indHtml(i);
                    itemsHtml += this._itemHtml(item, i);
                })

                this.pause();
                this.widgetEl.find('.carousel-indicators').html(indsHtml);
                this.widgetEl.find('.carousel-inner').html(itemsHtml);
                this.widgetEl.carousel({
                    interval: <number>cfg.interval
                });
                this.goto(num);
            }

            protected _render() {
                this._limitActive();
                let cfg = <CarouselConfig>this._config, indsHtml = '', itemsHtml = '';

                if (cfg.items) cfg.items.forEach((item, i) => {
                    indsHtml += this._indHtml(i);
                    itemsHtml += this._itemHtml(item, i);
                })
                let html = `
                <ol class="carousel-indicators">
                    ${indsHtml}
                </ol>
                <div class="carousel-inner" style="height:${Lengths.toCSS(cfg.height,'100%')}">
                    ${itemsHtml}
                </div>
                <a class="carousel-control-prev" href="#${this.id}" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                </a>
                <a class="carousel-control-next" href="#${this.id}" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                </a>
                `
                this.widgetEl.attr('data-ride', 'carousel');
                this.widgetEl.addClass('carousel slide bg-light');
                this.widgetEl.css({ 'width': Lengths.toCSS(cfg.width,'100%') })
                this.widgetEl.html(html);

                this.widgetEl.on('slide.bs.carousel', (e) => {
                    let from = e.from, to = e.to;
                    if (from != -1 && to != -1) this._fire('transiting', [from, to])//BUGFIX: bootstrap has repeat event when from/to=-1 
                })
                this.widgetEl.on('slid.bs.carousel', (e) => {
                    let from = e.from, to = e.to;
                    this._fire('transited', [from, to])
                })

                this.widgetEl.carousel({
                    interval: <number>cfg.interval
                });
            }

        }

    }
}
import Carousel = JS.fx.Carousel;
import CarouselEvents = JS.fx.CarouselEvents;
import CarouselListeners = JS.fx.CarouselListeners;
import CarouselConfig = JS.fx.CarouselConfig;
import CarouselItem = JS.fx.CarouselItem;