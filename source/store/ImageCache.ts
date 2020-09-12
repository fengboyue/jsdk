/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.7.0
 * @update Add "uncached" property for preloading image only
 * 
 * @version 2.5.0
 * @author Frank.Feng
 */

module JS {

    export namespace store {

        export interface RemoteImage {
            id: string,
            url: string,
            uncached?: boolean
        }

        export class ImageCache {
            private _map: JsonObject<HTMLImageElement> = {}

            private _load(id: string, url: string, uncached: boolean) {
                let m: ImageCache = this;
                return Promises.create<void>(function () {
                    let img = new Image();
                    img.onload = () => {
                        if (!uncached) m.set(id, img);
                        this.resolve()
                    }
                    img.src = url
                })
            }
            load(imgs: RemoteImage[] | RemoteImage) {
                let ms: RemoteImage[] = Types.isArray(imgs) ? <RemoteImage[]>imgs : [<any>imgs],
                    plans = [];

                ms.forEach(img => {
                    plans.push(Promises.newPlan(this._load, [img.id, img.url], this))
                })

                return Promises.all<void>(plans)
            }

            set(id: string, img: HTMLImageElement) {
                this._map[id] = img
            }
            get(id: string): HTMLImageElement {
                return this._map[id]
            }
            has(id: string) {
                return this._map.hasOwnProperty(id)
            }
            clear() {
                this._map = {}
            }

        }
    }
}

//预定义短类名
import ImageCache = JS.store.ImageCache;