## Sound
<code>JS.media.Sound</code> class supports loading and playing multiple sound files at the same time, and can perform effects processing such as mixing, rhythm, filtering, etc. The native <code>Audio</code> class cannot.

But <code>Sound</code> class has no player on UI, so you need <code>audio</code> tag or <code>Audio</code> class only when your user needs to play one audio at a time by the player controls.

### Multiple Sounds Playing
In the following code, load two sound files and play them at the same time:
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

### Modulation
Drag a range input to change the current volume in playing time:
```javascript
$1('#range1').on('input', function(this: HTMLInputElement){
    s1.volume(parseInt(this.value)/parseInt(this.max))
})
```

### Sound Effects Processing
For example, add a low pass filter:
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
## Video

### Instantiation
If the page already has a <code>video</code> tag:
```html
<video id="v1" width="200" height="200"></video>
```

You can initialize a <code>Video</code> instance with tag's id:
```javascript
let vp = new Video({
    id: 'v1',
    src: 'https://www.runoob.com/try/demo_source/movie.mp4'
});
```

If there is no <code>video</code> tag on the page, you can render it to a container element:
```javascript
let vp = new Video({
    appendTo: document.body,
    src: 'https://www.runoob.com/try/demo_source/movie.mp4',
    width: 200,
    height: 200
});
```

### Play
Click a button to start playing the video:
```javascript
$1('#btn').on('click', ()=>{
    vp.play()
}) 
```

## Note
<p class='tip'>
Warn:<br>
The browser will throw an uncaught DOMException if the script execute Video.play() or Sound.play() when the user didn’t interact with the document first.
</p>