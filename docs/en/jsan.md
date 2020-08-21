## JSAN
JSAN is new animation module since version of 2.1.
It contains 7 independent animation classes and 2 control animation classes.

Animation Class|Introduction|Type
---|---|---
MoveAnim|Move animation by (x,y)|
TranslateAnim|Translate animation by (offsetX, offsetY)|
FadeAnim|Opacity animation|
GradientAnim|Gradient color animation|
ScaleAnim|Scale animation|
SkewAnim|Skew animation|
RotateAnim|Rotate2D or Rotate3D animation|
ParallelAnim|Execute a set of animations in parallel|control-type
SequentialAnim|Execute a set of animations in sequential order|control-type

## Sample Code
Use rotate animation as a sample:
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
You can <code> pause </code> or <code> stop </code> this animation:
```javascript
anim1.pause();
```
The above animation is 2D rotation. You can modify it to 3D rotate animation:
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

## Easing Function
You should notice the value of <code>easing</code> in the animation config, which is a commonly used function in animation. It provides the effect of accelerating or decelerating the animation. If you don't set this parameter, the default value is: <code>Easings.LINEAR</code>, which is uniform velocity.

In essence, the easing function is a function related to t(current time), d(duration), begin(begin value) and end(end value):
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
* *JSAN has defined more than 30 kinds of common easing functions. Of course, you can also use your own easing functions.*

## Multi animations control
Many times, we need to execute a set of animations in sequential order or parallel to achieve the effect of combined animation.

For example, we define two animations, a gradient animation and a translate animation:
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

If we play these two animations in sequential order, we'll see that the element completes the gradient background color first, and then starts to move:
```javascript
let anim = new SequentialAnim({
    anims: [anim1,anim2]
});
anim.play();
```

If we play these two animations in parallel, we'll see that the element moves and fades the background color at same time:
```javascript
let anim = new ParallelAnim({
    anims: [anim1,anim2]
});
anim.play();
```

## More Examples
Please see more animation examples in <code>examples/jsan</code> directory.