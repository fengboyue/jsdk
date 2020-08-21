## JSAN
JSAN是2.1版本开始新提供的动画库，它包含7个独立动画类与2个控制型动画类。

动画类名|简介|类型
---|---|---
MoveAnim|位移动画|
TranslateAnim|偏移动画|
FadeAnim|透明度动画|
GradientAnim|渐变色动画|
ScaleAnim|缩放动画|
SkewAnim|倾斜动画|
RotateAnim|旋转动画|
ParallelAnim|并行动画|控制型
SequentialAnim|串行动画|控制性

## 示例代码
以旋转动画为例：
```javascript
let anim1 = new RotateAnim({
    easing: Easings.BACK_IN_OUT,
    duration: 5000,//5s
    el: '#xxx',    //html element its id is "xxx"
    frames: {
        from: 45,  //angle value in 0~360
        to: 180    //angle value in 0~360
    }
});
anim1.play()
```
执行<code>pause</code>或<code>stop</code>就可以暂停或停止：
```javascript
anim1.pause();
```
上述旋转动画是以2D方式旋转，你可以稍作修改为3D旋转动画：
```javascript
let anim2 = new RotateAnim({
    easing: Easings.BACK_IN_OUT,
    duration: 5000,
    el: '#xxx',  
    frames: {
        from: {
            aX: 45, aY: 120, aZ: 180  //set angles of x and y and z 
        },
        to: {
            aX: 180, aY: 180, aZ: 120
        }
    }
});
anim2.play();
```

## 缓动函数
你应该注意到动画参数中<code>easing</code>的值，这是动画中常用的缓动函数，它提供了让动画加速或减速的效果。如果你不设置该参数，缺省值就是：<code>Easings.LINEAR</code>，即匀速动画。

本质上，缓动函数是一个与t（当前时刻）、d（播放时长）、begin（开始值）、end（结束值）相关的函数：
```javascript
/**
 * @param {number} t elapsed time
 * @param {number} b begin
 * @param {number} c increment = end - begin
 * @param {number} d duration time
 * @returns {number}
 */
export type EasingFunction = (t: number, b: number, c: number, d: number, ...args) => number;
```
* *JSAN中已经预定义好了30多种常见的缓动函数，当然你也可以使用自己定义的缓动函数。*

## 多动画控制
很多时候，我们需要串行执行或并行执行一组动画，以达到组合式动画的效果。

举例，我们先定义两个动画，一个渐变色动画，一个偏移动画：
```javascript
let anim1 = new GradientAnim({
    duration: 5000,
    el: '#xxx',
    frames: {
        from: {
            backgroundColor: '#00FF00'
        },
        to: {
            backgroundColor: '#1E90FF'
        }
    }
});

let anim2 = new TranslateAnim({
    duration: 5000,
    el: '#xxx',
    frames: {
        frames: {
            from: { oX: 0 },
            to: { oX: 200 }
        }
    }
});
```

如果我们串行执行这两个动画，将会看到该元素先完成渐变背景色，再开始平移：
```javascript
let anim = new SequentialAnim({
    anims: [anim1,anim2]
});
anim.play();
```

如果我们并行执行这两个动画，将会看到该元素一边移动一边渐变背景色：
```javascript
let anim = new ParallelAnim({
    anims: [anim1,anim2]
});
anim.play();
```

## 更多示例
请去<code>examples/jsan</code>目录中查看更多动画示例。