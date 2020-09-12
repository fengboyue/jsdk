## 音频
<b>JS.media.AudioPro</b> 类支持多实例播放多个音频，还可以对每个音频作混音、节拍、滤波等音效处理，而原生的 <b>Audio</b> 类则无法做到。

<b>注意:</b> 
- AudioPro 类是没有播放器界面的，除非你自己写一个播放器界面与之一起工作。
- 当需要使用浏览器自带的播放器界面且无需同时播放多个音频文件时，你才需要用到<code>audio</code>标签及<b>Audio</b>类。

### 音频预加载
当有多个音频文件需要播放时，你应该先用 <b>AudioCache</b> 类将它们加载至持久缓存中，而不是保留在内存中。
```javascript
let ac = new AudioCache();
ac.load([{
    id: 'a1',
    url: 'blueyellow.wav'
},{
    id: 'a2',
    url: 'clapping-crowd.wav'
}])
```

### 音频播放
播放缓存中的音频：
```javascript
let ap1 = new AudioPro();
ap1.play('a1', ac);
```

改变音量和循环播放：
```javascript
ap1.volume(0.5);
ap1.loop(true);
```

多个音频同时播放：
```javascript
let ap2 = new AudioPro();
ap2.play('a2', ac);
```

快捷播放（当你不需要改变音量或音效时）：
```javascript
AudioPro.play('a1', ac);
```

### 音效处理
比如，添加一个低波过滤器：
```javascript
let ap = new AudioPro({
    handler: (ac: AudioContext)=>{
        // Create the filter
        let filter = ac.createBiquadFilter();
        // Create and specify parameters for the low-pass filter.
        filter.type = 'lowpass'; // Low-pass filter. See BiquadFilterNode docs
        filter.frequency.value = 440; // Set cutoff to 440 HZ
        return filter
    }
});
```
## 视频

### 实例化播放器
如果页面上已有<code>video</code>标签：
```html
<video id="v1" width="200" height="200"></video>
```

你可以用<code>id</code>初始化一个视频播放器实例：
```javascript
let vp = new VideoPlayer({
    id: 'v1',
    src: 'https://www.runoob.com/try/demo_source/movie.mp4'
});
```

如果页面上没有<code>video</code>标签，可以渲染出新的<code>video</code>标签到容器元素上：
```javascript
let vp = new VideoPlayer({
    appendTo: document.body,
    src: 'https://www.runoob.com/try/demo_source/movie.mp4',
    width: 200,
    height: 200
});
```

### 播放
点击一个按钮开始播放视频：
```javascript
$1('#btn').on('click', ()=>{
    vp.play()
}) 
```

## 注意事项
<p class='tip'>
警告：<br>
当用户还没有与文档作任何交互时，脚本去执行 VideoPlayer.play() 或 AudioPro.play() 都会失败且浏览器将抛出DOMException。
</p>