/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.5.0
 * @author Frank.Feng
 */

module JS {

    export namespace media {

        export interface RemoteAudio {
            id: string,
            url: string
        }

        export interface AudioCacheInit {
            name: string
            loaderror?: (this:AudioCache, res:HttpResponse)=>void
        }

        export class AudioCache {
            private _cache: DataCache;
            private _init:AudioCacheInit;

            constructor(init: AudioCacheInit){
                this._init = init;
                this._cache = new DataCache({
                    name: init.name
                })
            }

            private _load(id: string, url:string){
                let m = this;
                return Promises.create<void>(function(){
                    Http.get({
                        url: url,
                        responseType: 'arraybuffer',
                        success: res => {
                            m.set(id, res.data).then(()=>{
                                this.resolve()
                            })
                        }
                    }).catch(res=>{
                        if (m._init.loaderror) m._init.loaderror.call(m,res)
                    })
                })
            }
            load(imgs: RemoteAudio[]|RemoteAudio){
                let ms:RemoteAudio[] = Types.isArray(imgs)?<RemoteAudio[]>imgs:[<any>imgs],
                plans = [];

                ms.forEach(img=>{
                    plans.push(Promises.newPlan(this._load,[img.id, img.url],this))
                })
                
                return Promises.order<void>(plans)
            }

            async get(id:string){
                return await this._cache.read<ArrayBuffer>(id)
            }
            async set(id:string, data: ArrayBuffer){
                return await this._cache.write<ArrayBuffer>({
                    id: id,
                    data: data
                })
            }
            async has(id:string) {
                return await this._cache.hasKey(id)
            }
            async clear(){
                await this._cache.clear()
            }
            async destroy(){
                await this._cache.destroy()
            }
        }
    }
}

//预定义短类名
import AudioCache = JS.media.AudioCache;