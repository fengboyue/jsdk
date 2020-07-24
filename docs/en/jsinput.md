<code>JSINPUT</code> module supports advanced features of mouse events and keyboard events, such as hotkeys, sequential keys, events mock, etc.

In this package, <code>JS.input.Keyboard</code> class provides two combination keys (hot key and sequential key) listening and key status query; <code>JS.input.UIMocker</code> class provides simulations of keyboard and mouse events.

## Key Code Table
<code>JS.input.VK</code> class defines key codes for many common keys:
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
You can use the VK class to get the keycode of a keychar:
```javascript
Konsole.print(VK['F1']);
```

## Hotkeys
Hotkeys, also known as shortcut keys, is commonly used for applications and widgets. Its expression is as follows:
```text
keychar1 + keychar2 + ... + keycharN
```

For example, when the user's cursor focus in a <code>textarea</code>, pressing <code>Ctrl + F</code> will pop up a finding dialog:
```javascript
let kb = new Keyboard($1('#textarea1'));
kb.onKeyDown('ctrl+f', function(e: KeyboardEvent) {
    //open your dialog for finding
    ...
    return false
})
```

You can also listen hotkeys on <code>window</code>. For example, pressing <code>Ctrl + Alt + L</code> will locks the screen:
```javascript
let kb = new Keyboard();//this scope is window
kb.onKeyDown('ctrl+alt+L', function(e: KeyboardEvent) {
    //Lock screen before leaving 
    ...
    return false
})
```

## Seqkeys
Seqkeys is a continuous of keys that are pressed in sequential order. The expression is as follows (the last keychar also could be a hotkeys):
```text
keychar1 , keychar2 , ... , keycharN-1, keycharN|Hotkeys 
```

For example, in <b>Street Fighter II</b>, Ryu sends out Hadouken after pressing <code>↓→ + P</code>.<br>
<img src="assets/images/ryu-hado-blue.gif" />

It can be implemented easily in <code>JSINPUT</code> with the following code:
```javascript
let kb = new Keyboard();
kb.onKeyDown('DOWN, RIGHT + P', function(e: KeyboardEvent) {
    player.hadouken('blue');//Fire a blue hadouken ball
    return false
})
```

### Interval Time
In the above example, suppose you press <code>↓</code>, and wait for 3 seconds or even 30 minutes and then press <code>→ + P</code>. Such a unlimited time interval of Seqkeys is obviously not suitable for the needs.

In fact, you can set the maximum interval time between sequential keys to be 200ms:
```javascript
kb.seqInterval(200);//200ms
```
* *Any key be press down exceeding the maximum interval will be ignored.*
* *The default maximum interval is 300 ms.*

### Holding Time
When Ryu holds the <code>P</code> key for 2 seconds and up it, he will sends out more powerful red Hadouken.<br>
<img src="assets/images/ryu-hado-red.gif" />

With a little modification of the previous code, you can achieve this effect:
```javascript
let kb = new Keyboard();
//Must listen KeyUp event for calc holding time
kb.onKeyUp('DOWN, RIGHT + P', function(e: KeyboardEvent, kb: Keyboard) {
    //Current key is the tail keyChar(P) of the Seqkeys
    player.hadouken(e.timeStamp-kb.getKeyDownTime(e.keyCode) > 2000?'red':'blue');
    return false
})
```

## Events Mock

### Mock Keyboard Events
```javascript
//Mock press ENTER on button1
UIMocker.fireKeyEvent('keydown', VK['ENTER'], {el: $1('#button1')})
//Mock press ESC on window
UIMocker.fireKeyEvent('keydown', VK['ESC'])
```

### Mock Mouse Events
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