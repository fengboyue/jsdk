JS.imports([]).then(() => {
    var dragChild = null, nodes = $1("#dragBox").childNodes;
    nodes.forEach((node) => {
        if (node.getAttribute && node.getAttribute('draggable')) {
            node.ondragstart = function (ev) {
                var dt = ev.dataTransfer;
                dt.effectAllowed = "move";
                dt.setData("text/plain", this.innerText);
                dragChild = this;
            };
            node.ondragend = function (ev) {
                dragChild = null;
            };
        }
    });
    var rubbishBox = $1("#rubbishBox");
    rubbishBox.ondragover = function (ev) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move";
    };
    rubbishBox.ondragenter = function (ev) {
        this.style.color = "white";
    };
    rubbishBox.ondrop = function (ev) {
        var dt = ev.dataTransfer;
        this.appendChild(document.createTextNode(dt.getData("text/plain")));
        this.appendChild(document.createElement("br"));
        $1("#dragBox").removeChild(dragChild);
    };
});
