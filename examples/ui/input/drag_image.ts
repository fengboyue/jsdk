/// <reference path='../../../dist/jsdk.d.ts' /> 
JS.imports([
    '$jsui'
]).then(() => {
    // hook up event handlers
    var cols = $L('#columns .column');
    cols.forEach(col => {
        col.on('dragstart', handleDragStart);
        col.on('dragenter', handleDragEnter)
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
            var dt: DataTransfer = e.dataTransfer;
            dt.effectAllowed = 'move';
            dt.setData('text', dragSrcEl.innerHTML);

            // customize drag image for draging x
            if (e.target.innerHTML.indexOf('X') > -1) {
                var img = new Image();
                img.src = 'dragimage.jpg';
                dt.setDragImage(img, img.width / 2, img.height / 2);
            }
        }
    }
    function handleDragOver(e: DragEvent) {
        if (dragSrcEl) {
            e.preventDefault();//BUGFIX: block default behavior for ondrop.
            e.dataTransfer.dropEffect = 'move';
        }
    }
    function handleDragEnter(e: DragEvent) {
        if (dragSrcEl) {
            (<HTMLElement>e.target).classList.add('over');
        }
    }
    function handleDragLeave(e) {
        if (dragSrcEl) {
            (<HTMLElement>e.target).classList.remove('over');
        }
    }
    function handleDragEnd(e: DragEvent) {
        dragSrcEl = null;
        [].forEach.call(cols, function (col) {
            col.style.opacity = '';
            col.classList.remove('over');
        });
    }
    function handleDrop(e: DragEvent) {
        if (dragSrcEl) {
            if (dragSrcEl != this) {
                dragSrcEl.innerHTML = (<HTMLElement>e.target).innerHTML;
                this.innerHTML = e.dataTransfer.getData('text');
            }
        }
    }
})
