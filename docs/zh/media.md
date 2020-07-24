## 音频
<code>JS.media.Sound</code>类支持同时加载并播放多个声音文件并可以对其作混音、节拍、滤波等音效处理，而原生的<code>Audio</code>类则无法做到。
但<code>Sound</code>类是没有播放器界面的，所以当你的用户是用播放器界面且一次只播放一个音频时，你才需要<code>audio</code>标签及<code>Audio</code>类。

### 多音频播放
下面的例子中，加载两个音频文件并同时播放：
```javascript
let s1 = new Sound();
s1.load('blueyellow.wav').then(()=>{
    $1('#btnPlay1').on('click', ()=>{
        s1.play()
    }) 
});

let s2 = new Sound();
s2.load('clapping-crowd.wav').then(()=>{
    $1('#btnPlay2').on('click', ()=>{
        s2.play()
    }) 
});
```

### 音量调节
拖动Range输入框，实时改变当前的音量：
```javascript
$1('#range1').on('input', function(this: HTMLInputElement){
    s1.volume(parseInt(this.value)/parseInt(this.max))
})
```

### 音效处理
比如，添加一个低波过滤器：
```javascript
let s1 = new Sound({
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

### 实例化
如果页面上已有<code>video</code>标签：
```html
<video id="v1" width="200" height="200"></video>
```

你可以用id初始化一个视频播放器实例：
```javascript
let vp = new Video({
    id: 'v1',
    src: 'https://www.runoob.com/try/demo_source/movie.mp4'
});
```

如果页面上没有<code>video</code>标签，可以渲染到一个容器元素上：
```javascript
let vp = new Video({
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
当用户还没有与文档作任何交互时，脚本去执行Video.play()或Sound.play()都会失败且浏览器将抛出DOMException。
</p>