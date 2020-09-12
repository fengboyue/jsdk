## 简介
<b>JSAN</b> 从 2.7 版本开始提供全新精简设计的两个动画类取代旧版诸多动画类。
新版两个动画类：补间动画类 <b>TweenAnim</b> 与帧动画类 <b>FrameAnim</b>。
旧版有并行、串行两种动画控制类，现在被动画控制类 <b>Timeline</b> 取代。

## 补间动画

补间动画会在指定的持续时间内，把目标对象的属性值从初始值不断变化到最终值。初始值到最终值的变化函数称为缓动函数 <b>EasingFunction</b>。
### 初始化
<iframe  
 height=600 
 width=90% 
 src="/jsdk/examples/jsan/tween_init.html?_=1"  
 frameborder=0  
 allowfullscreen>
 </iframe>

### 设定目标
用CSS selector设定目标：
<iframe  
 height=600 
 width=90% 
 src="/jsdk/examples/jsan/tween_targets_selector.html"  
 frameborder=0  
 allowfullscreen>
 </iframe> 

将NodeList设定为目标：
<iframe  
 height=600 
 width=90% 
 src="/jsdk/examples/jsan/tween_targets_nodelist.html"  
 frameborder=0  
 allowfullscreen>
 </iframe> 

将JS Object设定为目标：
<iframe  
 height=600 
 width=90% 
 src="/jsdk/examples/jsan/tween_targets_object.html"  
 frameborder=0  
 allowfullscreen>
 </iframe> 

将一组对象设定为目标：
<iframe  
 height=600 
 width=90% 
 src="/jsdk/examples/jsan/tween_targets_array.html"  
 frameborder=0  
 allowfullscreen>
 </iframe> 

### 可变属性
补间动画在初始化时，会自动判断 <b>keys</b> 所包含的属性 <b>key</b> 是目标的哪种属性。

当 <b>key</b> 为 <b>CSS Property</b> 时：
<iframe  
 height=600 
 width=90% 
 src="/jsdk/examples/jsan/tween_keys_css.html"  
 frameborder=0  
 allowfullscreen>
 </iframe> 

当 <b>key</b> 为 <b>CSS Transfrom</b> 时：
<iframe  
 height=600 
 width=90% 
 src="/jsdk/examples/jsan/tween_keys_transform.html"  
 frameborder=0  
 allowfullscreen>
 </iframe> 

当 <b>key</b> 为 <b>Dom Attribute</b> 时：
<iframe  
 height=600 
 width=90% 
 src="/jsdk/examples/jsan/tween_keys_attr.html"  
 frameborder=0  
 allowfullscreen>
 </iframe> 

当 <b>key</b> 为 <b>JS Object Property</b> 时：
<iframe  
 height=600 
 width=90% 
 src="/jsdk/examples/jsan/tween_keys_property.html"  
 frameborder=0  
 allowfullscreen>
 </iframe> 

### 可变属性的值类型
 <iframe  
 height=600 
 width=90% 
 src="/jsdk/examples/jsan/tween_value_types.html"  
 frameborder=0  
 allowfullscreen>
 </iframe> 

### 缓动函数
标准缓动函数：
<iframe  
height=600 
width=90% 
src="/jsdk/examples/jsan/tween_easings.html"  
frameborder=0  
allowfullscreen>
</iframe> 

步进缓动函数：
<iframe  
height=600 
width=90% 
src="/jsdk/examples/jsan/tween_easing_steps.html"  
frameborder=0  
allowfullscreen>
</iframe> 

自定义缓动函数：
<iframe  
height=600 
width=90% 
src="/jsdk/examples/jsan/tween_easing_custom.html"  
frameborder=0  
allowfullscreen>
</iframe>  

### 控制

播放、暂停、停止与重新播放：
<iframe  
height=600 
width=90% 
src="/jsdk/examples/jsan/tween_controls.html"  
frameborder=0  
allowfullscreen>
</iframe> 

进度式播放：
<iframe  
height=600 
width=90% 
src="/jsdk/examples/jsan/tween_controls_seek.html"  
frameborder=0  
allowfullscreen>
</iframe> 

### 事件
<iframe  
height=600 
width=90% 
src="/jsdk/examples/jsan/tween_events.html"  
frameborder=0  
allowfullscreen>
</iframe> 

## 帧动画
帧动画会在指定的持续时间内，不断改变DOM对象的背景图，会产生一种类似于电影或GIF动画的效果。

### 图像帧
我们通常将多个图像帧集中在同一个图片文件内，用CSS样式来控制显示某一帧图像。

比如，在<code>1945.gif</code>中有以下八帧图像：<br>
<img src="assets/images/plane-frames.png" />

我们可以定义一个图像帧集合来表示这八帧图像：
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

当一个集合中的所有帧图像是连续排成行或列，可以用更简单的方式来定义：<br>
仅需第一帧的位置数据与帧数量，FrameAnim类会自动计算出所有的帧数据。
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

### 初始化
用图像帧集合来初始化一个帧动画实例：
<iframe  
height=600 
width=90% 
src="/jsdk/examples/jsan/frame_init.html"  
frameborder=0  
allowfullscreen>
</iframe> 

### 控制
<iframe  
height=600 
width=90% 
src="/jsdk/examples/jsan/frame_controls.html"  
frameborder=0  
allowfullscreen>
</iframe> 

### 事件
帧动画支持的事件类型与补间动画一致，可查阅补间动画的事件章节。


## 多动画控制
用 <b>Timeline</b> 类可以控制多个动画的串、并行执行。

### 串行动画
<iframe  
height=600 
width=90% 
src="/jsdk/examples/jsan/timeline_tween_order.html"  
frameborder=0  
allowfullscreen>
</iframe> 

### 并行动画
<iframe  
height=600 
width=90% 
src="/jsdk/examples/jsan/timeline_tween_parallel.html"  
frameborder=0  
allowfullscreen>
</iframe> 

### 复合式帧动画
<iframe  
height=600 
width=90% 
src="/jsdk/examples/jsan/timeline_frame.html"  
frameborder=0  
allowfullscreen>
</iframe> 