/// <reference path='../../dist/jsdk.d.ts' /> 
JS.imports([
    '$jsinput'
]).then(() => {
    
    var dragChild = null,
        nodes = $1("#dragBox").childNodes;

    nodes.forEach((node: HTMLElement) => {
        node.ondragstart = function (this:HTMLElement, ev) {
            var dt = ev.dataTransfer;
            dt.effectAllowed = "move";
            dt.setData("text/plain", this.innerText);
            dragChild = this;
        };
        node.ondragend = function (ev) {
            dragChild = null;
        };
    })

    var rubbishBox = $1("#rubbishBox");
    rubbishBox.ondragover = function (ev) {
        ev.dataTransfer.dropEffect = "move";
    };
    rubbishBox.ondragenter = function (this:HTMLElement, ev) {
        this.style.color = "white";
    };
    rubbishBox.ondrop = function (this:HTMLElement, ev) {
        var dt = ev.dataTransfer;
        this.appendChild(document.createTextNode(dt.getData("text/plain")));
        this.appendChild(document.createElement("br"));
        $1("#dragBox").removeChild(dragChild);
    }
})
