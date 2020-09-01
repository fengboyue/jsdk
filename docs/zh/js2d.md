<b>js2d</b> 模块的核心类<b>JS.d2.Display</b>提供了二维图形、文本、图像的绘制、更新与清除等功能。
<b>Display</b>类可以看作是一块二维画布，它支持两种绘图模式：<code>canvas</code>与<code>div</code>。

在<code>canvas</code>模式下：<br>
<b>Display</b>会实例化一个H5的<code>Canvas</code>对象，调用Canvas的绘图API来完成图形、文本、图像的绘制与画布清除，但不支持对已绘制的文本、图像的修改（只能在上面重绘）。

* *此绘图模式非常适合静态图形的绘制，比如：图表。*

在<code>div</code>模式下：<br>
<b>Display</b>会生成一个<code>DIV</code>对象作为画布容器，完成文本、图像的绘制、更新、拖放与清除，但不支持图形的绘制（比如：线段、矩形、圆、三角形等）。
在此模式下，当需要绘制一个文本或图像时，<b>Display</b>会添加一个（文本或图片的）子DIV到容器DIV中；如果你在绘制时，给这个子DIV的ID赋值，那么以后就可以用此ID来更新或删除此DIV对象。

* *此绘图模式非常适合动态图像的绘制，比如：游戏。*

在游戏中常常会使用分层式画布。比如：不会经常改变的背景放置于一个图层，经常位移的精灵放置于另一个图层且置于背景图层之上。
使用<b>js2d</b>的话，你可以将多个<b>Display</b>叠放（顺序设置每个<b>Display</b>的zIndex）在一起，每个<b>Display</b>就是一个图层。

## Canvas模式

### 初始化Display

假设某个div作为Display的容器：
```html
<div id="container"></div>
```
再初始化一个实例：
```javascript
let ds = new Display({
    holder: '#container', //如果不指定容器则以document.body作为容器
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

### 图形绘制
```javascript
ds.drawLine([[0,0], [100,100]]);// from Point(0,0) to Point(100,100)
ds.drawRect([20, 50, 100, 200]);// x: 20, y: 50, width: 100, height: 200
ds.drawCircle([[200,200], 50);// x: 200, y: 200, r: 50
```

### 文本绘制
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

### 图像绘制
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
在<code>1945.gif</code>中，上述坐标<code>(x: 4, y: 400, w: 65, h: 65)</code>的图像是一架P-38战斗机。<br>
以上代码将在画布的<code>(50,50)</code>坐标处画出一架p-38：<br>
<img src="assets/images/p38.png" width="64px" height="64px"/>

### 区域清除
```javascript
ds.clear([0,0,500,500]);//equals: ds.clear()
```

## Div模式

### 初始化Display
```javascript
let ds = new Display({
    holder: '#container', //如果不指定容器则以document.body作为容器
    id: 'd1',
    x: 20,
    y: 20,
    width: 500,
    height: 500,
    cssStyle: 'background:black;',
    mode: 'div'
})
```

### 文本绘制
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

#### 改变文字
```javascript
ds.changeText('txt0', 'JSDK');
```

### 图像绘制
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

#### 改变图像
在<code>1945.gif</code>中，坐标<code>(x: 400, y: 400, w: 65, h: 65)</code>的图像是一架A6M零式战斗机。<br>
<img src="assets/images/a6m.png" width="64px" height="64px"/>

我们将<code>img0</code>的图像改为A6M战斗机：
```javascript
ds.changeImage('img0', {x: 400, y: 400}); //dont need to change the image src, width and height
```         

### 更新节点
我们将文本和图像移动到点<code>(0,0)</code>且设置成半透明：
```javascript
ds.updateChild('txt0', {x: 0, y: 0, opacity: 0.5});
ds.updateChild('img0', {x: 0, y: 0, opacity: 0.5});
```  

### 节点删除
```javascript
ds.removeChild('xxx'); // xxx is a node's id
```
### 画布清空
```javascript
ds.clear();
```