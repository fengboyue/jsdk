<b>jsmath</b> 模块提供了二维／三维向量类以及多种坐标系与平面几何图形的相关类及运算工具。
这些类及运算方法主要用于2D/3D的动画、绘图及游戏领域。

## 点
<b>JS.math.ArrayPoint2</b> 是数组格式的二维直角坐标点；<b>JS.math.ArrayPoint3</b> 则是数组格式的三维直角坐标点。
```javascript
let p1: ArrayPoint2 = [1, -1]; //x = 1, y = -1
let p2: ArrayPoint3 = [1, -1, 0]; //x = 1, y = -1, z = 0
```
<b>JS.math.PolarPoint2</b>是JSON格式的二维极坐标点；<b>JS.math.PolarPoint2</b> 则是JSON格式的三维极坐标点。
```javascript
export type PolarPoint2 = { d: number, a: number };
export type PolarPoint3 = { d: number, ax: number, az: number };
```

<b>JS.math.Point2</b> 是二维直角坐标点类：
```javascript
let p1 = new Point2(1, -1);
```
* 同理<b>JS.math.Point3</b>是三维直角坐标点类

<b>Point2</b> 类与 <b>ArrayPoint2</b> 不同的是：它不仅携带坐标数据还自带了很多有用的方法。<br>
比如，求点[1,-1]与点[-1,1]间的距离：
```javascript
let p1 = new Point2(1, -1);
p1.distance(-1, 1);//Equals: Point2.distance(1,-1,-1,1);
```

### 互转换
<b>Point2</b> 与 <b>ArrayPoint2</b> 之间的互转换：
```javascript
Point2.toPoint([1, -1]);    //convert to Point2
new Point2(1,-1).toArray(); //convert to ArrayPoint2
```

点的直角坐标与极坐标之间的互转换：
```javascript
Point2.xy2polar(1, 1);                //convert to PolarPoint2
Point2.polar2xy(1.414, 0.25*Math.PI); //convert to Point2
```

## 弧度
弧度是点到原点的连线与X正轴之间的夹角。弧度为正时表示该夹角从X正轴开始顺时针方向旋转；为负时表示该夹角从X正轴开始逆时针方向旋转。

求点[1,-1]的弧度：
```javascript
new Point2(1, -1).radian();
```

弧度与角度的换算：
```javascript
Radians.rad2deg(0.5*Math.PI); //equals 45
Radians.deg2rad(90); //equals Math.PI/2
```

## 向量
向量是非常有用的数学（或物理学）概念。
一个向量代表了一个点A到另一个点B的方向与长度。

当A、B两点重合时，向量的长度为零，则此向量为<b>零向量</b>；长度为1的向量称之为<b>单位向量</b>；与当前向量垂直的向量，称之为<b>法向量</b>；位于2D向量左侧的为<b>左法向量</b>，位于2D向量右侧的为<b>右法向量</b>。另外，向量的四则运算在几何学和物理学上都有明确意义。这里不做详细描述，具体请参看相关的数学教材。

如何获得一个向量呢？我们可以这样构造出一个从点p1到点p2的向量：
```javascript
let v1 = Vector2.toVector([1,-1],[-1,1]); //p1(1,-1) -> p2(-1,1)
```

### 向量的运算
```javascript
let v1:Vector2, v2:Vector2;
...

v1.add(v2); // +
v1.sub(v2); // -
v1.mul(10); // *
v1.div(10); // /

v1.dot(v2); //dot product
Vector2.cross(v1,v2); //cross product
v1.equals(v1.clone().negate().negate()); //return true

Vector2.Zero.equals(new Vector2(0,0)); //return true
Vector2.UnitY.equals(Vector2.UnitX.clone().getNormR().normalize()); //return true
Vector2.toVector([1,1],[0,0]).getProject(Vector2.UnitX).equals(Vector2.UnitX); //return true
```

### 位置判定
```javascript
let v1:Vector2, v2:Vector2;
...

v1.verticalTo(v2); //whether v1 is vertical to v2
v1.parallelTo(v2); //whether v1 is parallel to v2
v1.angle(v2);      //The angle in radian between v1 and v2
```

## 平面几何
<b>jsmath.geom</b> 包提供了以下常用的几何图形类：

图形类名|说明
---|---
Line| A straight line in 2D
Segment| A line segment in 2D
Rect| A rectangle in 2D
Triangle| A triangle in 2D
Circle| A circle in 2D
Ellipse| A ellipse parallel to XY axis in 2D
CirArc| An arc in circle in 2D
Polygon| A closed polygon in 2D
Polyline| A unclosed poly segments in 2D

### 位置判定
比如，判定点[1,1]是否在某个图形内或边线上：
```javascript
let line = Line.toLine(...);
line.inside([1,1]);
line.onside([1,1]);

let seg = Segment.toSegment(...);
seg.inside([1,1]);
seg.onside([1,1]);

let rect = Rect.toRect(...);
rect.inside([1,1]);
rect.onside([1,1]);

....

let pg = new Polygon(...);
pg.inside([1,1]);
pg.onside([1,1]);
```

再比如，判定两个图形是否相交：
```javascript
let line:Line, rect:Rect, cir:Circle, p:Polygon;
...

rect.intersects(line);
rect.intersects(cir);

p.intersects(line);
p.intersects(cir);
p.intersects(rect);
```
