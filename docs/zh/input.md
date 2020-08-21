JSUI模块的 <b>input</b> 包支持键盘事件、鼠标事件的高级特性与事件模拟，也支持移动设备上拖放事件和Tap事件。

## 键盘事件
<code>JS.input.Keys</code>类提供了两种组合键（快捷键、连续键）的监听与键盘按键状态查询。<br>
<code>JS.input.Keyboards</code>类提供了键盘事件的模拟。

### 键码表
<code>JS.input.VK</code>类定义了许多常用键的键码：
```javascript
export let VK = {
    BACK_SPACE   : 8,   
    TAB          : 9,   
    ENTER        : 13,  
    SHIFT        : 16,  
    CTRL         : 17,  
    ALT          : 18,  
    PAUSE        : 19,  
    CAPS_LOCK    : 20,  
    ESC          : 27,
    ......
}            
```
你可以用VK类获取键符（keyChar）的键码（keyCode）：
```javascript
Konsole.print(VK['F1']);
```

### 快捷键（Hotkeys）
快捷键也可以称为热键，通常用于应用程序和组件。其表达式为：
```text
keyChar1 + keyChar2 + ... + keyCharN
```

举例，当用户光标焦点在<code>textarea</code>上时，按下组合键<code>Ctrl+F</code>会弹出一个查找框：
```javascript
let kb = new Keys($1('#textarea1'));
kb.onKeyDown('ctrl+f', function(e: KeyboardEvent) {
    //open your dialog for finding
    ...
    return false
})
```

你也可以在<code>window</code>上监听快捷键。例如，按下<code>CTRL+ALT+L</code>就锁住屏幕：
```javascript
let kb = new Keys();//this scope is window
kb.onKeyDown('ctrl+alt+L', function(e: KeyboardEvent) {
    //Lock screen before leaving 
    ...
    return false
})
```

### 连续键（Seqkeys）
连续键是按顺序按下的一组键。其表达式如下（最后一个键符可以为一个热键）：
```text
keychar1 , keychar2 , ... , keycharN-1, keycharN|Hotkeys 
```

比如，在<b>街霸II</b>游戏里，隆(RYU)在按下<code>↓→ + P</code>后会发出波动拳(Hadouken)。<br>
<img src="assets/images/ryu-hado-blue.gif" />

在JSDK中可以用以下代码来实现：
```javascript
let kb = new Keys();
kb.onKeyDown('DOWN, RIGHT + P', function(e: KeyboardEvent) {
    player.hadouken('blue');//Fire a blue hadouken ball
    return false
})
```

#### 间隔时间
在上面的例子中，假设你按下<code>↓</code>，等待30秒甚至30分钟后再下<code>→ + P</code>。这样无间隔时间限制的连续键显然不符合需要。
实际上，你可以设定连续键的最大间隔时间：
```javascript
kb.seqInterval(1000);//1000ms
```
* *超过最大间隔时间的连续键将被忽略*
* *缺省的最大间隔时间为Infinity(无限大)*

#### 长时间按键
当隆(RYU)在按住<code>P</code>键保持2秒后再放开，会发出威力更大的红色波动拳。<br>
<img src="assets/images/ryu-hado-red.gif" />

将前面的代码稍作修改就可以实现：
```javascript
let kb = new Keys();
//Must listen KeyUp event for calc holding time
kb.onKeyUp('DOWN, RIGHT + P', function(e: KeyboardEvent, kb: Keys) {
    //Current key is the tail keyChar(P) of the Seqkeys
    player.hadouken(e.timeStamp-kb.getKeyDownTime(e.keyCode) > 2000?'red':'blue');
    return false
})
```

### 键盘事件模拟
```javascript
//Mock press ENTER on button1
Keyboards.fireEvent('keydown', VK['ENTER'], {el: $1('#button1')})
//Mock press ESC on window
Keyboards.fireEvent('keydown', VK['ESC'])
```

## 鼠标事件

### 鼠标事件模拟
<code>JS.input.Mouses</code>类支持鼠标事件模拟。

```javascript
//Mock click mouse left button on button1
Mouses.fireEvent('click', {
    el: $1('#button1'),
    button: MouseButton.LEFT
})
//Mock click mouse right button on winodw
Mouses.fireEvent('click', {
    button: MouseButton.RIGHT
})
```

## 拖放事件
PC版浏览器是支持鼠标拖放事件的；但手机浏览器仅支持Touch事件而不支持拖放事件的。<br>
当你的页面加载<code>jsui</code>模块后，将自动支持在移动设备上的拖放事件。

请用手机浏览器和PC浏览器分别打开示例页面：<br>
<a href="/jsdk/examples/input/drag_image.html" target="_blank">
拖放时带图片效果</a><br>
<a href="/jsdk/examples/input/drag_text.html" target="_blank">
拖放文本</a>

## Tap事件
手机浏览器的click事件是有延迟的，所以通常用一系列Tap事件来代替一系列click事件：
tap | singletap | doubletap | longtap。
```javascript
JS.imports([
    '$jsui'
]).then(() => {
    let fn = function (e: Event) {
        $1('#info').innerHTML += e.type + ' on ' + (<HTMLElement>e.target).id + '<br>'
    }

    $1('#btnTap').on('tap', fn);
    $1('#btnSingleTap').on('singletap', fn);
    $1('#btnDoubleTap').on('doubletap', fn);
    $1('#btnLongTap').on('longtap', fn); //The holding time for longtap is 750ms
})
```
请用手机浏览器打开示例页面：<br>
<a href="/jsdk/examples/input/tap.html" target="_blank">
Tap on Mobile</a><br>

<p class='tip'>
注意:<br>
在手机浏览器上，JSINPUT将会自动屏蔽click事件。所以如果你页面上的按钮需要在PC浏览器和手机浏览器下都可以正常点击。请使用以下兼容写法:<br>
$1('#btnTap').on('click tap', fn);
</p>
