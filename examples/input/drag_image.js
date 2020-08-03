JS.imports([
    '$jsinput'
]).then(() => {
    var cols = $L('#columns .column');
    cols.forEach(col => {
        col.on('dragstart', handleDragStart);
        col.on('dragenter', handleDragEnter);
        col.on('dragover', handleDragOver);
        col.on('dragleave', handleDragLeave);
        col.on('drop', handleDrop);
        col.on('dragend', handleDragEnd);
    });
    var dragSrcEl = null;
    function handleDragStart(e) {
        if (e.target.className.indexOf('column') > -1) {
            dragSrcEl = e.target;
            dragSrcEl.style.opacity = '0.6';
            var dt = e.dataTransfer;
            dt.effectAllowed = 'move';
            dt.setData('text', dragSrcEl.innerHTML);
            if (e.target.innerHTML.indexOf('X') > -1) {
                var img = new Image();
                img.src = 'dragimage.jpg';
                dt.setDragImage(img, img.width / 2, img.height / 2);
            }
        }
    }
    function handleDragOver(e) {
        if (dragSrcEl) {
            e.dataTransfer.dropEffect = 'move';
        }
    }
    function handleDragEnter(e) {
        if (dragSrcEl) {
            e.target.classList.add('over');
        }
    }
    function handleDragLeave(e) {
        if (dragSrcEl) {
            e.target.classList.remove('over');
        }
    }
    function handleDragEnd(e) {
        dragSrcEl = null;
        [].forEach.call(cols, function (col) {
            col.style.opacity = '';
            col.classList.remove('over');
        });
    }
    function handleDrop(e) {
        if (dragSrcEl) {
            if (dragSrcEl != this) {
                dragSrcEl.innerHTML = e.target.innerHTML;
                this.innerHTML = e.dataTransfer.getData('text');
            }
        }
    }
});
