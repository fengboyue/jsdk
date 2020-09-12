<b>JSMATH</b> module provides 2D/3D vector classes, variety of coordinate systems and plane geometry classes and computing tools.
These classes and tools are mainly used in 2D/3D animations, drawings and games.

## Point
<b>ArrayPoint2</b> is a 2D point of cartesian coordinates in array format;<b>ArrayPoint3</b> is a 3D point of cartesian coordinates in array format.
```javascript
let p1: ArrayPoint2 = [1, -1]; //x = 1, y = -1
let p2: ArrayPoint3 = [1, -1, 0]; //x = 1, y = -1, z = 0
```
<b>PolarPoint2</b> is a 2D point of polar coordinates in JSON format;<b>PolarPoint2</b> is a 3D point of polar coordinates in JSON format.
```javascript
export type PolarPoint2 = { d: number, a: number };
export type PolarPoint3 = { d: number, ax: number, az: number };
```

<b>Point2</b> is a 2D point class of cartesian coordinates:
```javascript
let p1 = new Point2(1, -1);
```
* And <b>Point3</b> is a 3D point class of cartesian coordinates.

The difference of <b>Point2</b> and <b>ArrayPoint2</b> is: It not only carries coordinate data, but also has many useful methods.<br>
For example, calc the distance between point[1, -1] and point[-1,1]:
```javascript
let p1 = new Point2(1, -1);
p1.distance(-1, 1);//Equals: Point2.distance(1,-1,-1,1);
```

### Conversions
Conversions between <b>Point2</b> and <b>ArrayPoint2</b>:
```javascript
Point2.toPoint([1, -1]);    //convert to Point2
new Point2(1,-1).toArray(); //convert to ArrayPoint2
```

Conversions between cartesian coordinates and polar coordinates of a point:
```javascript
Point2.xy2polar(1, 1);                //convert to PolarPoint2
Point2.polar2xy(1.414, 0.25*Math.PI); //convert to Point2
```

## Radian
Radian is the angle between the line from a point to the origin and positive x-axis.
A positive radian indicates that the angle rotates clockwise from positive x-axis.

Get the radian of point[1, -1]:
```javascript
new Point2(1, -1).radian();
```

Conversions between radian and degree:
```javascript
Radians.rad2deg(0.5*Math.PI); //equals 45
Radians.deg2rad(90); //equals Math.PI/2
```

## Vector
Vector is an very useful mathematical (or physical) concept.
An vector represents the direction and length of point A to point B.

When point A is equals point B the length of the vector is zero, so the vector is called <b>Zero Vector</b>; An vector with 1 length is called <b>Unit Vector</b>; An vector is vertical to the current vector is called <b>Norm Vector</b>; The one on the left of 2D vector is <b>Left Norm Vector</b>, the one on the right of 2D vector is <b>Right Norm Vector</b>. 
The arithmetic operations of vector have definite meanings in geometry and physics. Here is no detailed descriptions, please read other mathematics textbooks for details.

How to get a vector? We can build a vector from point P1 to point P2 in this way:
```javascript
let v = Vector2.toVector([1,-1],[-1,1]); //p1(1,-1) -> p2(-1,1)
```

### Operations of Vector
```javascript
let v1: Vector2, v2: Vector2;
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

### Position Determinations
```javascript
let v1: Vector2, v2: Vector2;
...

v1.verticalTo(v2); //whether v1 is vertical to v2
v1.parallelTo(v2); //whether v1 is parallel to v2
v1.angle(v2);      //The angle in radian between v1 and v2
```

## Plane Geometry
<b>jsmath.geom</b> package provides the following common geometry shapes:

Shape Class|Description
---|---
Line| A straight line in 2D
Segment| A line segment in 2D
Rect| A rectangle in 2D
Triangle| A triangle in 2D
Circle| A circle in 2D
Ellipse| An ellipse parallel to XY axis in 2D
CirArc| An arc of circle in 2D
Polygon| A closed polygon in 2D
Polyline| An unclosed poly segments in 2D

### Position Determinations
For example, determinate point [1,1] whether is in a shape or on the edge of a shape:
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

Another example is to determine whether two shapes intersect:
```javascript
let line:Line, rect:Rect, cir:Circle, p:Polygon;
...

rect.intersects(line);
rect.intersects(cir);

p.intersects(line);
p.intersects(cir);
p.intersects(rect);
```
