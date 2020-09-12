## Intro
From version 2.7, <b>JSAN</b> provides two new classes (<b>TweenAnim</b> and <b>FrameAnim</b>) to replace many animation classes in the old version. The two animation-control classes in old version now be replaced by new control class <b>Timeline</b>.

## Tween Animation

The tween animation will change one or some properties values of targets from begin value to end value within the specified duration. The change function from begin value to end value is called: <b>EasingFunction</b>。
### Initialize
<iframe  
 height=600 
 width=90% 
 src="/jsdk/examples/jsan/tween_init.html?_=1"  
 frameborder=0  
 allowfullscreen>
 </iframe>

### Set Tartgets
Set Tartgets with CSS selector:
<iframe  
 height=600 
 width=90% 
 src="/jsdk/examples/jsan/tween_targets_selector.html"  
 frameborder=0  
 allowfullscreen>
 </iframe> 

Set Tartgets with NodeList:
<iframe  
 height=600 
 width=90% 
 src="/jsdk/examples/jsan/tween_targets_nodelist.html"  
 frameborder=0  
 allowfullscreen>
 </iframe> 

Set Tartgets with JS Object:
<iframe  
 height=600 
 width=90% 
 src="/jsdk/examples/jsan/tween_targets_object.html"  
 frameborder=0  
 allowfullscreen>
 </iframe> 

Set Tartgets with array:
<iframe  
 height=600 
 width=90% 
 src="/jsdk/examples/jsan/tween_targets_array.html"  
 frameborder=0  
 allowfullscreen>
 </iframe> 

### Animated Keys
During the initialization, TweenAnim will automatically judge which property type that a <b>key</b> contained in the <b>keys</b> is of the targets.

When <b>key</b> is <b>CSS property</b>:
<iframe  
 height=600 
 width=90% 
 src="/jsdk/examples/jsan/tween_keys_css.html"  
 frameborder=0  
 allowfullscreen>
 </iframe> 

When <b>key</b> is <b>CSS Transfrom</b>:
<iframe  
 height=600 
 width=90% 
 src="/jsdk/examples/jsan/tween_keys_transform.html"  
 frameborder=0  
 allowfullscreen>
 </iframe> 

When <b>key</b> is <b>Dom Attribute</b>:
<iframe  
 height=600 
 width=90% 
 src="/jsdk/examples/jsan/tween_keys_attr.html"  
 frameborder=0  
 allowfullscreen>
 </iframe> 

When <b>key</b> is <b>JS Object Property</b>:
<iframe  
 height=600 
 width=90% 
 src="/jsdk/examples/jsan/tween_keys_property.html"  
 frameborder=0  
 allowfullscreen>
 </iframe> 

### Animated Value Types
 <iframe  
 height=600 
 width=90% 
 src="/jsdk/examples/jsan/tween_value_types.html"  
 frameborder=0  
 allowfullscreen>
 </iframe> 

### Easing Function
Standard Easing Functions:
<iframe  
height=600 
width=90% 
src="/jsdk/examples/jsan/tween_easings.html"  
frameborder=0  
allowfullscreen>
</iframe> 

STEPS Easing Function:
<iframe  
height=600 
width=90% 
src="/jsdk/examples/jsan/tween_easing_steps.html"  
frameborder=0  
allowfullscreen>
</iframe> 

Custom Easing Function:
<iframe  
height=600 
width=90% 
src="/jsdk/examples/jsan/tween_easing_custom.html"  
frameborder=0  
allowfullscreen>
</iframe>  

### Controls

Play, Pause, Stop and Replay:
<iframe  
height=600 
width=90% 
src="/jsdk/examples/jsan/tween_controls.html"  
frameborder=0  
allowfullscreen>
</iframe> 

Seek Play:
<iframe  
height=600 
width=90% 
src="/jsdk/examples/jsan/tween_controls_seek.html"  
frameborder=0  
allowfullscreen>
</iframe> 

### Events
<iframe  
height=600 
width=90% 
src="/jsdk/examples/jsan/tween_events.html"  
frameborder=0  
allowfullscreen>
</iframe> 

## Frame Animation
Frame animation will change background image of HTMLElement in specified duration, that it will produce an animation effect similar to movie or GIF.

### Image Frame
We usually concentrate many image frames in one image file, and use CSS style to display an image frame.

For example, in <code>1945.gif</code> there are eight image frames:<br>
<img src="assets/images/plane-frames.png" />

We can define a <b>ImageFrameSet</b> to represent the eight frames:
```javascript
let fs = <ImageFrameSet>{
    src: '../js2d/1945.gif',
    w: 32,
    h: 32,
    items: [       //8 frames offset data
        [4, 4],    //[offsetX, offsetY]
        ...          
        [228, 228]
    ]
})
```

When all the frames in a set are aligned in a row or column, it can be defined in a simpler way:<br>
Using offset data of the first frame and the total number of all frames, <b>FrameAnim</b> class will automatically calculate all frame data.
```javascript
let fs = <ImageFrameSet>{
    src: '../js2d/1945.gif',
    w: 32,
    h: 32,
    items: {
        ox: 4,     //first frame's offsetX
        oy: 4,     //first frame's offsetY
        split: 1,  //split width between every frame
        axis: 'x', //aligned direction
        total: 8   //total frames number
    }
})
```

### Initialize
Initialize a FrameAnim object with a <b>ImageFrameSet</b>:
<iframe  
height=600 
width=90% 
src="/jsdk/examples/jsan/frame_init.html"  
frameborder=0  
allowfullscreen>
</iframe> 

### Controls
<iframe  
height=600 
width=90% 
src="/jsdk/examples/jsan/frame_controls.html"  
frameborder=0  
allowfullscreen>
</iframe> 

### Events
The event types supported by frame animation are same as that of tween animation. Please refer to the events chapter of tween animation.


## Multi-Animations Controls
<b>Timeline</b> class can controls the sequential and parallel execution of multi-animations.

### Sequential Animations
<iframe  
height=600 
width=90% 
src="/jsdk/examples/jsan/timeline_tween_order.html"  
frameborder=0  
allowfullscreen>
</iframe> 

### Parallel Animation
<iframe  
height=600 
width=90% 
src="/jsdk/examples/jsan/timeline_tween_parallel.html"  
frameborder=0  
allowfullscreen>
</iframe> 

### Composite Frame Animations
<iframe  
height=600 
width=90% 
src="/jsdk/examples/jsan/timeline_frame.html"  
frameborder=0  
allowfullscreen>
</iframe> 