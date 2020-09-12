//# sourceURL=../dist/js2d.js
//JSDK 2.7.0 MIT
var JS;
(function (JS) {
    let d2;
    (function (d2) {
        class Display {
            constructor(cfg) {
                this._dStyle = {
                    lineWidth: 1,
                    strokeStyle: '#000000',
                    shadowStyle: {
                        color: '#000000',
                        blur: 0,
                        offsetX: 0,
                        offsetY: 0
                    }
                };
                this._cfg = Jsons.union({
                    mode: 'div',
                    x: 0,
                    y: 0,
                    zIndex: 0,
                    width: 0,
                    height: 0,
                    drawStyle: this._dStyle
                }, cfg);
                let c = this._cfg, D = $1(c.holder) || document.body, sty = `position:${D == document.body ? 'absolute' : 'relative'};overflow:hidden;left:${c.x}px;top:${c.y}px;z-index:${c.zIndex};${c.cssStyle || ''}`;
                if (c.mode == 'canvas') {
                    D.append(`<canvas id="${c.id}" width="${c.width}" height="${c.height}" style="${sty}"></canvas>`);
                    this._ctx = $1('#' + c.id).getContext("2d");
                    this._applyDrawStyle(c.drawStyle);
                }
                else {
                    D.append(`<div id="${c.id}" style="${sty};width:${c.width}px;height:${c.height}px;"></div>`);
                    this._div = $1('#' + c.id);
                    this._div.on('dragover', (e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                    });
                }
            }
            clear(rect) {
                let c = this._cfg;
                if (c.mode == 'canvas') {
                    let a;
                    if (rect) {
                        a = rect;
                    }
                    else {
                        let b = $1('#' + c.id).box();
                        a = [0, 0, b.w, b.h];
                    }
                    this._ctx.clearRect.apply(this._ctx, a);
                }
                else {
                    $1('#' + c.id).empty();
                }
            }
            _check(m) {
                if (this._cfg.mode != m)
                    throw new RefusedError(`The operation is only supported in "${m}" mode.`);
            }
            _canvasLG(d, size) {
                let x1, y1, x2, y2;
                if (d.dir == 'left') {
                    x1 = size.w;
                    y1 = x2 = y2 = 0;
                }
                else if (d.dir == 'right') {
                    x1 = y1 = y2 = 0;
                    x2 = size.w;
                }
                else if (d.dir == 'top') {
                    x1 = x2 = y2 = 0;
                    y1 = size.h;
                }
                else if (d.dir == 'bottom') {
                    x1 = x2 = y1 = 0;
                    y2 = size.h;
                }
                let lg = this._ctx.createLinearGradient(x1, y1, x2, y2);
                if (d.colors)
                    d.colors.forEach(it => {
                        lg.addColorStop(it.stop, it.color);
                    });
                return lg;
            }
            _applyDrawStyle(st) {
                if (!st)
                    return;
                let m = this, ctx = m._ctx;
                if (st.lineWidth != void 0)
                    ctx.lineWidth = st.lineWidth || 1;
                let ss = st.strokeStyle;
                if (ss)
                    ctx.strokeStyle = ss;
                let shs = st.shadowStyle;
                if (shs) {
                    if (shs.color != void 0)
                        ctx.shadowColor = shs.color;
                    if (shs.blur != void 0)
                        ctx.shadowBlur = shs.blur;
                    if (shs.offsetX != void 0)
                        ctx.shadowOffsetX = shs.offsetX;
                    if (shs.offsetY != void 0)
                        ctx.shadowOffsetY = shs.offsetY;
                }
                ctx.fillStyle = 'transparent';
            }
            _applyDrawingStyle(st) {
                if (!st)
                    return;
                let T = this, ctx = T._ctx;
                T._applyDrawStyle(st);
                if (st.translate)
                    ctx.translate.apply(ctx, st.translate);
                if (st.scale)
                    ctx.scale.apply(ctx, st.scale);
                if (st.rotate != void 0)
                    ctx.rotate(st.rotate);
                if (st.transform)
                    ctx.transform.apply(ctx, st.transform);
            }
            _textDrawingStyle(st) {
                if (!st)
                    return '';
                let T = this, dStyle = T._dStyle, css = `word-wrap:break-word;text-overflow:ellipsis;`;
                if (st.fillStyle == void 0 || Types.isString(st.fillStyle)) {
                    css += `color:${st.fillStyle || 'transparent'};`;
                }
                else {
                    let fs = st.fillStyle, s = '';
                    fs.colors.forEach(c => {
                        s += `,${c.color} ${c.stop == void 0 ? '' : `${c.stop * 100}%`}`;
                    });
                    css += `linear-gradient(to ${fs.dir}${s};`;
                }
                let shs = st.shadowStyle;
                if (shs) {
                    css += `text-shadow:${shs.offsetX || dStyle.shadowStyle.offsetX} ${shs.offsetY || dStyle.shadowStyle.offsetY} ${shs.blur || dStyle.shadowStyle.blur} ${shs.color || dStyle.shadowStyle.color};`;
                }
                let ts = st.textStyle;
                if (ts) {
                    if (ts.align != void 0)
                        css += `text-align:${ts.align};`;
                    if (ts.font != void 0)
                        css += `font:${ts.font};`;
                }
                if (st.strokeStyle)
                    css +=
                        `text-stroke:${st.lineWidth || 1}px ${st.strokeStyle};
                -webkit-text-stroke:${st.lineWidth || 1}px ${st.strokeStyle};
                -moz-text-stroke:${st.lineWidth || 1}px ${st.strokeStyle};`;
                css += this._transformStyle(st);
                return css;
            }
            _transformStyle(st) {
                if (!st)
                    return '';
                let css = '';
                let ts = st.translate;
                if (ts != void 0)
                    css = `translate(${ts[0]}px,${ts[1]}px);`;
                let sc = st.scale;
                if (sc != void 0)
                    css += `scale(${sc[0]},${sc[1]});`;
                let ro = st.rotate;
                if (ro != void 0)
                    css += `scale(${Radians.rad2deg(ro, true)}deg);`;
                let tf = st.transform;
                if (tf != void 0)
                    css += `matrix(${tf[0]},${tf[1]},${tf[2]},${tf[3]},${tf[4]},${tf[5]});`;
                return css;
            }
            config(cfg) {
                if (!cfg)
                    return this._cfg;
                this._cfg = Jsons.union(this._cfg, cfg);
                return this;
            }
            setDrawStyle(style) {
                this._cfg.drawStyle = style || this._dStyle;
                if (this._cfg.mode == 'canvas')
                    this._applyDrawStyle(this._cfg.drawStyle);
                return this;
            }
            _drawLine(ctx, p1, p2) {
                ctx.moveTo(p1[0], p1[1]);
                ctx.lineTo(p2[0], p2[1]);
            }
            drawLine(line, style) {
                this._check('canvas');
                let ctx = this._ctx, p1, p2;
                if (Types.isArray(line)) {
                    p1 = line[0];
                    p2 = line[1];
                }
                else {
                    p1 = line.p1();
                    p2 = line.p2();
                }
                ctx.beginPath();
                this._applyDrawingStyle(style);
                this._drawLine(ctx, p1, p2);
                ctx.stroke();
                ctx.closePath();
            }
            drawCircle(arc, style) {
                this._check('canvas');
                let ctx = this._ctx, a;
                if (arc instanceof Circle) {
                    a = [arc.x, arc.y, arc.r, 0, 2 * Math.PI, false];
                }
                else {
                    a = [arc[0][0], arc[0][1], arc[1], 0, 2 * Math.PI, false];
                }
                ctx.beginPath();
                this._applyDrawingStyle(style);
                ctx.arc.apply(ctx, a);
                ctx.stroke();
                ctx.closePath();
            }
            drawArc(arc, style) {
                this._check('canvas');
                let ctx = this._ctx, a;
                if (arc instanceof CirArc) {
                    a = [arc.x, arc.y, arc.r, arc.sAngle, arc.eAngle, arc.dir === 0];
                }
                else {
                    a = [arc[0][0], arc[0][1], arc[1], arc[2], arc[3], arc[4]];
                }
                ctx.beginPath();
                this._applyDrawingStyle(style);
                ctx.arc.apply(ctx, a);
                ctx.stroke();
                ctx.closePath();
            }
            _fillStyle(ctx, fs, size) {
                if (Types.isString(fs)) {
                    ctx.fillStyle = fs;
                }
                else if (Jsons.hasKey(fs, 'image')) {
                    ctx.fillStyle = ctx.createPattern(fs.image, fs.repeat);
                }
                else {
                    ctx.fillStyle = this._canvasLG(fs, size);
                }
            }
            drawRect(rect, style) {
                this._check('canvas');
                let ctx = this._ctx, r = rect instanceof Rect ? [rect.x, rect.y, rect.w, rect.h] : rect;
                this._applyDrawingStyle(style);
                ctx.strokeRect.apply(ctx, r);
                if (style && style.fillStyle) {
                    this._fillStyle(ctx, style.fillStyle, { w: r[2], h: r[3] });
                    ctx.fillRect.apply(ctx, r);
                }
            }
            drawTri(tri, style) {
                this._check('canvas');
                let ctx = this._ctx, p1, p2, p3;
                if (tri instanceof Triangle) {
                    p1 = tri.p1();
                    p2 = tri.p2();
                    p3 = tri.p3();
                }
                else {
                    p1 = tri[0];
                    p2 = tri[1];
                    p3 = tri[2];
                }
                ctx.beginPath();
                this._applyDrawingStyle(style);
                this._drawLine(ctx, p1, p2);
                this._drawLine(ctx, p2, p3);
                this._drawLine(ctx, p3, p1);
                ctx.stroke();
                ctx.closePath();
            }
            drawPath(p, style) {
                this._check('canvas');
                let ctx = this._ctx, ps;
                ps = p instanceof Polygon ? p.vertexes() : p;
                ctx.beginPath();
                this._applyDrawingStyle(style);
                let size = ps.length;
                if (size < 2)
                    return;
                ps.forEach((pt, i) => {
                    if (i < size - 1) {
                        this._drawLine(ctx, pt, ps[i + 1]);
                    }
                });
                ctx.stroke();
                ctx.closePath();
            }
            _setAttrs(a) {
                let el = $1('#' + a.id);
                if (el) {
                    el.on('dragstart', (e) => {
                        e.dataTransfer.effectAllowed = 'move';
                    });
                    el.on('dragend', (e) => {
                        e.preventDefault();
                        let el = e.target, box = el.box(), ox = e.offsetX - box.w / 2, oy = e.offsetY - box.h / 2;
                        el.css({
                            left: ox > 0 ? `+=${ox}` : `-=${Math.abs(ox)}`,
                            top: oy > 0 ? `+=${oy}` : `-=${Math.abs(oy)}`
                        });
                    });
                }
            }
            drawText(t, style, a) {
                if (this._cfg.mode == 'canvas') {
                    let ctx = this._ctx, ta = [t[0], t[1][0], t[1][1]];
                    if (t.length > 2)
                        ta.push(t[2]);
                    this._applyDrawingStyle(style);
                    let ts = style.textStyle;
                    if (ts) {
                        if (ts.align != void 0)
                            ctx.textAlign = ts.align;
                        if (ts.font != void 0)
                            ctx.font = ts.font;
                    }
                    if (style && style.fillStyle) {
                        let ms = ctx.measureText(ta[0]);
                        this._fillStyle(ctx, style.fillStyle, { w: ms.width, h: ms.emHeightAscent });
                        ctx.fillText.apply(ctx, ta);
                    }
                    ctx.strokeText.apply(ctx, ta);
                }
                else {
                    let p = t[1], maxWidth = t.length > 2 ? `max-width:${t[2]}px;` : '', css = this._textDrawingStyle(style);
                    this._div.append(Strings.nodeHTML('div', {
                        id: (a && a.id) || '',
                        draggable: a && a.draggable ? "true" : "false",
                        style: `position:absolute;left:${p[0]}px;top:${p[1]}px;${maxWidth}${css}${a && a.opacity != void 0 ? `opacity:${a.opacity};` : ''}${a && a.zIndex != void 0 ? `z-index:${a.zIndex};` : ''}${a && a.style || ''}`
                    }, t[0]));
                    if (a)
                        this._setAttrs(a);
                }
            }
            changeText(id, text) {
                this._check('div');
                let el = $1('#' + id);
                if (el)
                    el.textContent = text;
            }
            drawImage(img, a) {
                let pic, url, sx, sy, sw, sh, dx, dy, dw, dh;
                if (img instanceof HTMLImageElement) {
                    pic = img;
                    sx = sy = 0;
                    sw = dw = pic.width;
                    sh = dh = pic.height;
                }
                else {
                    url = img.src instanceof HTMLImageElement ? img.src.src : img.src;
                    sx = img.x;
                    sy = img.y;
                    sw = dw = img.w;
                    sh = dh = img.h;
                }
                dx = a && a.x || 0;
                dy = a && a.y || 0;
                if (this._cfg.mode == 'canvas') {
                    this._ctx.drawImage(pic, sx, sy, sw, sh, dx, dy, dw, dh);
                }
                else {
                    this._div.append(Strings.nodeHTML('div', {
                        id: (a && a.id) || '',
                        draggable: a && a.draggable ? "true" : "false",
                        style: `position:absolute;overflow:hidden;left:${dx}px;top:${dy}px;width:${sw}px;height:${sh}px;${a && a.opacity != void 0 ? `opacity:${a.opacity};` : ''}background:url('${url}') -${sx}px -${sy}px no-repeat;${a && a.zIndex != void 0 ? `z-index:${a.zIndex};` : ''}${a && a.style || ''}`
                    }));
                    if (a)
                        this._setAttrs(a);
                }
            }
            changeImage(id, newImg) {
                this._check('div');
                let img = $1('#' + id);
                if (img) {
                    if (newImg instanceof HTMLImageElement) {
                        img.style.backgroundImage = `url("${newImg.src}")`;
                    }
                    else {
                        if (newImg.src != void 0)
                            img.style.backgroundImage = `url("${newImg.src.src}")`;
                        img.style.backgroundPosition = `-${newImg.x}px -${newImg.y}px`;
                        if (newImg.w != void 0)
                            img.style.width = newImg.w + 'px';
                        if (newImg.h != void 0)
                            img.style.height = newImg.h + 'px';
                    }
                }
            }
            updateChild(id, a) {
                this._check('div');
                let el = $1('#' + id);
                if (el) {
                    if (a.draggable != void 0)
                        el.draggable = a.draggable;
                    el.css({
                        left: a.x != void 0 ? a.x + 'px' : null,
                        top: a.y != void 0 ? a.y + 'px' : null,
                        opacity: a.opacity != void 0 ? a.opacity + '' : null,
                        zIndex: a.zIndex != void 0 ? a.zIndex + '' : null,
                        style: a.style || null
                    });
                }
            }
            removeChild(id) {
                this._check('div');
                let img = $1('#' + id);
                if (img)
                    img.remove();
            }
            appendChild(node) {
                this._check('div');
                this._div.append(node);
                return this;
            }
            find(selector) {
                return this._div.find(selector);
            }
            findAll(selector) {
                return this._div.findAll(selector);
            }
        }
        d2.Display = Display;
    })(d2 = JS.d2 || (JS.d2 = {}));
})(JS || (JS = {}));
var Display = JS.d2.Display;
