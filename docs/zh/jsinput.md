<code>JSINPUT</code>模块支持鼠标事件、键盘事件的高级特性，比如：快捷键、连续键、事件模拟等。
其中，<code>JS.input.Keyboard</code>类提供了两种组合键（快捷键、连续键）的监听与键盘按键状态查询；<code>JS.input.UIMocker</code>类提供了键盘事件和鼠标事件的模拟。

## 键码表
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

## 快捷键（Hotkeys）
快捷键也可以称为热键，通常用于应用程序和组件。其表达式为：
```text
keyChar1 + keyChar2 + ... + keyCharN
```

举例，当用户光标焦点在<code>textarea</code>上时，按下组合键<code>Ctrl+F</code>会弹出一个查找框：
```javascript
let kb = new Keyboard($1('#textarea1'));
kb.onKeyDown('ctrl+f', function(e: KeyboardEvent) {
    //open your dialog for finding
    ...
    return false
})
```

你也可以在<code>window</code>上监听快捷键。例如，按下<code>CTRL+ALT+L</code>就锁住屏幕：
```javascript
let kb = new Keyboard();//this scope is window
kb.onKeyDown('ctrl+alt+L', function(e: KeyboardEvent) {
    //Lock screen before leaving 
    ...
    return false
})
```

## 连续键（Seqkeys）
连续键是按顺序按下的一组键。其表达式如下（最后一个键符可以为一个热键）：
```text
keychar1 , keychar2 , ... , keycharN-1, keycharN|Hotkeys 
```

比如，在<b>街霸II</b>游戏里，隆(RYU)在按下<code>↓→ + P</code>后会发出波动拳(Hadouken)。<br>
<img src="assets/images/ryu-hado-blue.gif" />

在<code>JSINPUT</code>中可以用以下代码来实现：
```javascript
let kb = new Keyboard();
kb.onKeyDown('DOWN, RIGHT + P', function(e: KeyboardEvent) {
    player.hadouken('blue');//Fire a blue hadouken ball
    return false
})
```

### 长时间按键
当隆(RYU)在按住<code>P</code>键保持2秒后再放开，会发出威力更大的红色波动拳。<br>
<img src="assets/images/ryu-hado-red.gif" />

将前面的代码稍作修改就可以实现：
```javascript
let kb = new Keyboard();
//Must listen KeyUp event for calc holding time
kb.onKeyUp('DOWN, RIGHT + P', function(e: KeyboardEvent, kb: Keyboard) {
    //Current key is the tail keyChar(P) of the Seqkeys
    player.hadouken(e.timeStamp-kb.getKeyDownTime(e.keyCode) > 2000?'red':'blue');
    return false
})
```

## 事件模拟

### 键盘事件模拟
```javascript
//Mock press ENTER on button1
UIMocker.fireKeyEvent('keydown', VK['ENTER'], {el: $1('#button1')})
//Mock press ESC on window
UIMocker.fireKeyEvent('keydown', VK['ESC'])
```

### 鼠标事件模拟
```javascript
//Mock click mouse left button on button1
UIMocker.fireMouseEvent('click', {
    el: $1('#button1'),
    button: MouseButton.LEFT
})
//Mock click mouse right button on winodw
UIMocker.fireMouseEvent('click', {
    button: MouseButton.RIGHT
})
```