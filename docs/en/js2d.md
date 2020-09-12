<b>JS.d2.Display</b> the core class of <b>JS2D</b> module provides the functions of drawing, updating and clearing 2D shapes, texts and images.
The <b>Display</b> class can be seen as a two-dimensional canvas, it supports two drawing modes: 
<code>canvas</code> and <code>div</code>.

In <code>canvas</code> mode:<br>
The <b>Display</b> initialize a H5 <code>Canvas</code> object, call the APIs of canvas to complete the drawing of shapes, texts and images and the removal of canvas. However, it does not support any modification of drawn texts and images (only redrawing on them).
* *This drawing mode is very suitable for drawing static graphics, such as charts.*

In <code>div</code> mode:<br>
The <b>Display</b> generate a <code>DIV</code> node as a canvas to complete the drawing, updating, dragging and removing of texts and images. However, it does not support drawing shapes (such as: lines, segments, rectangles, circles, triangles, etc.).
In this mode, when a text or image needs to be drawn, <b>Display</b> will add a sub div of the text or image to the container div; If you assign a value to the ID of the sub div while drawing, you can use this ID to update or delete the div node later.
* *This drawing mode is very suitable for drawing dynamic graphics, such as games.*

Layered canvases are often used in games development. For example: the backgrounds will be not frequently changed is placed in a canvas layer, and the sprites will be frequently changed is placed in another canvas layer that be placed above the background layer.
If you use <b>js2d</b> in your game, you can stack multiple <b>Display</b> together (set the zIndex of each <b>Display</b> in sequence), so that each <b>Display</b> is a canvas layer.

## Canvas Mode

### Initialize Display

Suppose this div as a container for <b>Display</b>:
```html
<div id="container"></div>
```
Initialize a <b>Display</b> instance:
```javascript
let ds = new Display({
    holder: '#container', //If you do not specify a container, document.body will be as the default container
    id: 'd1',
    x: 20,
    y: 20,
    width: 500,
    height: 500,
    cssStyle: 'background:black;',
    drawStyle: {
        strokeStyle: 'white',
        lineWidth: 1
    },
    mode: 'canvas'
})
```

### Draw Shape
```javascript
ds.drawLine([[0,0], [100,100]]);// from Point(0,0) to Point(100,100)
ds.drawRect([20, 50, 100, 200]);// x: 20, y: 50, width: 100, height: 200
ds.drawCircle([[200,200], 50);// x: 200, y: 200, r: 50
```

### Draw Text
```javascript
ds.drawText(['JS2D', [0, 0]], {
    lineWidth: 2,
    strokeStyle: 'red',
    fillStyle: 'white',
    textStyle: {
        font: '40px Arial',
        align: 'center'
    }
})
```

### Draw Image
```javascript
let cache = new ImageCache();
cache.load([
    {
        id: '1945', //image id
        url: '1945.gif'
    }
]).then(() => {
    ds.drawImage({
        src: cache.get('1945'), //get image by id
        x: 4, y: 400, w: 65, h: 65 //this image sprite's position in the gif
    }, {
        x: 50,
        y: 50
    })
})
```
In <code>1945.gif</code>, the image of the coordinates <code>(x: 4, y: 400, w: 65, h: 65)</code> is a P-38 fighter.<br>
The above code will draw a P-38 at the point<code>(50,50)</code> on the display:<br>
<img src="assets/images/p38.png" width="64px" height="64px"/>

### Clear Area
```javascript
ds.clear([0,0,500,500]);//equals: ds.clear()
```

## Div Mode

### Initialize Display
```javascript
let ds = new Display({
    holder: '#container', //If you do not specify a container, document.body will be as the default container
    id: 'd1',
    x: 20,
    y: 20,
    width: 500,
    height: 500,
    cssStyle: 'background:black;',
    mode: 'div'
})
```

### Draw Text
```javascript
ds.drawText(['JS2D', [0, 0]], {
    lineWidth: 2,
    strokeStyle: 'red',
    fillStyle: 'white',
    textStyle: {
        font: '40px Arial',
        align: 'center'
    }
}, {
    id: 'txt0', //the text element's id
    draggable: true //the text element be allows drag&drop in this display
})
```

#### Change Text
```javascript
ds.changeText('txt0', 'JSDK');
```

### Draw Image
```javascript
......
ds.drawImage({
    src: cache.get('1945'),
    x: 4, y: 400, w: 65, h: 65
}, {
    x: 50,
    y: 50,
    id: 'img0', //the image element's id
    draggable: true //the image element be allows drag&drop in this display
})
```

#### Change Image
In <code>1945.gif</code>, the image of the coordinates <code>(x: 4, y: 400, w: 65, h: 65)</code> is a A6M fighter.<br>
<img src="assets/images/a6m.png" width="64px" height="64px"/>

We change the image of <code>img0</code> to A6M fighter :
```javascript
ds.changeImage('img0', {x: 400, y: 400}); //dont need to change the image src, width and height
```         

### Update ChildNode
We move the text and image to the point<code>(0,0)</code> and set their opacities :
```javascript
ds.updateChild('txt0', {x: 0, y: 0, opacity: 0.5});
ds.updateChild('img0', {x: 0, y: 0, opacity: 0.5});
```  

### Remove ChildNode
```javascript
ds.removeChild('xxx'); // xxx is a node's id
```
### Display Empty
```javascript
ds.clear();
```