## Audio
<b>JS.media.AudioPro</b> class supports playing multiple audio in the meantime, and can perform effects processing such as mixing, rhythm, filtering, etc. But native <b>Audio</b> class can't.

*Note: <b>AudioPro</b> class has no player UI, so you need <code>audio</code> tag or <b>Audio</b> class when your users only need to play one audio in the meantime and control it in player UI.*

### Audio Files Preload
When multiple audio files will need to be played, you should first load them into the persistent cache using <b>AudioCache</b> class, rather than keeping them in memory.
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

### Audio Play

Play audio by id in the cache:
```javascript
let ap1 = new AudioPro();
ap1.play('a1', ac);
```

Change volume and loop playing:
```javascript
ap1.volume(0.5);
ap1.loop(true);
```

Play another audio in the meantime:
```javascript
let ap2 = new AudioPro();
ap2.play('a2', ac);
```

Play directly (when you don't need to change volume or effects):
```javascript
AudioPro.play('a1', ac);
```

### Audio Effects Processing
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

You can initialize a <b>VideoPlayer</b> instance with tag's <code>id</code>:
```javascript
let vp = new VideoPlayer({
    id: 'v1',
    src: 'https://www.runoob.com/try/demo_source/movie.mp4'
});
```

If there is no <code>video</code> tag on the page, you can render a new <code>video</code> tag to the container element:
```javascript
let vp = new VideoPlayer({
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

## Warn
<p class='tip'>
The browser will throw an uncaught DOMException if the script execute VideoPlayer.play() or AudioPro.play() when the user didn’t interact with the document first.
</p>