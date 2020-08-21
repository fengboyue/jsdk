The <b>input</b> package of <b>JSUI</b> module supports advanced features of mouse and keyboard events, such as hotkeys, sequential keys, events mocks, etc. It also supports drag and tap events on mobile browsers.

## Key Events
<code>JS.input.Keys</code> provides two combination keys (hot keys and sequential keys) listening and key status query.<br>
<code>JS.input.Keyboards</code> provides simulations of keyboard events.

### Key Code Table
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

### Hotkeys
Hotkeys, also known as shortcut keys, is commonly used for applications and widgets. Its expression is as follows:
```text
keychar1 + keychar2 + ... + keycharN
```

For example, when the user's cursor focus in a <code>textarea</code>, pressing <code>Ctrl + F</code> will pop up a finding dialog:
```javascript
let kb = new Keys($1('#textarea1'));
kb.onKeyDown('ctrl+f', function(e: KeyboardEvent) {
    //open your dialog for finding
    ...
    return false
})
```

You can also listen hotkeys on <code>window</code>. For example, pressing <code>Ctrl + Alt + L</code> will locks the screen:
```javascript
let kb = new Keys();//this scope is window
kb.onKeyDown('ctrl+alt+L', function(e: KeyboardEvent) {
    //Lock screen before leaving 
    ...
    return false
})
```

### Seqkeys
Seqkeys is a continuous of keys that are pressed in sequential order. The expression is as follows (the last keychar also could be a hotkeys):
```text
keychar1 , keychar2 , ... , keycharN-1, keycharN|Hotkeys 
```

For example, in <b>Street Fighter II</b>, Ryu sends out Hadouken after pressing <code>↓→ + P</code>.<br>
<img src="assets/images/ryu-hado-blue.gif" />

It can be implemented easily in JSDK with the following code:
```javascript
let kb = new Keys();
kb.onKeyDown('DOWN, RIGHT + P', function(e: KeyboardEvent) {
    player.hadouken('blue');//Fire a blue hadouken ball
    return false
})
```

#### Interval Time
In the above example, suppose you press <code>↓</code>, and wait for 30 seconds or even 30 minutes and then press <code>→ + P</code>. Such a unlimited time interval of Seqkeys is obviously not suitable for needs.

In fact, you can set maximum interval time between sequential keys:
```javascript
kb.seqInterval(1000);//1000ms
```
* *Any key be press down exceeding maximum interval time will be ignored.*
* *The default maximum interval time is Infinity.*

#### Holding Time
When Ryu holds the <code>P</code> key for 2 seconds and up it, he will sends out more powerful Red Hadouken.<br>
<img src="assets/images/ryu-hado-red.gif" />

With a little modification of the previous code, you can achieve this effect:
```javascript
let kb = new Keys();
//Must listen KeyUp event for calc holding time
kb.onKeyUp('DOWN, RIGHT + P', function(e: KeyboardEvent, kb: Keys) {
    //Current key is the tail keyChar(P) of the Seqkeys
    player.hadouken(e.timeStamp-kb.getKeyDownTime(e.keyCode) > 2000?'red':'blue');
    return false
})
```

### Mock Keyboard Events
```javascript
//Mock press ENTER on button1
Keyboards.fireEvent('keydown', {keyCode: VK['ENTER'], el: $1('#button1')})
//Mock press ESC on window
Keyboards.fireEvent('keydown', {keyCode: VK['ESC']})
```

## Mouse Events
### Mock Mouse Events
<code>JS.input.Mouses</code> provides simulations of keyboard events.

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

## Drag Events
PC browsers support mouse drag and drop events, but mobile browsers only support touch events not drag and drop events.<br>
When your page loads the <code>jsui</code> module, it will automatically supports drag and drop events on mobile browsers.

Please open the follow samples with your Mobile browser and PC browser respectively:<br>
<a href="/jsdk/examples/ui/input/drag_image.html" target="_blank">
Drag boxes with image effect</a><br>
<a href="/jsdk/examples/ui/input/drag_text.html" target="_blank">
Drag texts</a>

## Tap Events
The click event on mobile browser has high delay time, so a series of tap events are usually used instead of a series of click events: <code>tap | singletap | doubletap | longtap</code>.
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
Please use your mobile browser to open the sample page:<br>
<a href="/jsdk/examples/ui/input/tap.html" target="_blank">
Tap on Mobile</a><br>

<p class='tip'>
Note:<br>
In the mobile browser, jsinput will automatically block the click event. So if buttons on your page needs to be clicked in both PC browser and Mobile browser, please use the following compatible code:<br>
$1('#btnTap').on('click tap', fn);
</p>
