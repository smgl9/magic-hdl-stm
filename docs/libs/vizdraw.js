"use strict";

var graph = null;
function update_graph(dot) {
    let viz = new Viz();
    viz.renderSVGElement(dot)
        .then(function (element) {
            if (graph !== null) {
                document.body.removeChild(graph);
            }
            document.body.appendChild(element);
            graph = element;

            panZoom = svgPanZoom(element, panConfig);
            panZoom.zoom(0.8);
            panZoom.center();
            panZoom.resize();
            trimZoomBtns();
        });
}
function clear() {
    if (graph !== null) {
        document.body.removeChild(graph);
        graph = null;
    }
}
function trimZoomBtns() {
    $('#svg-pan-zoom-zoom-in rect.svg-pan-zoom-control-background').attr('rx', 300);
    $('#svg-pan-zoom-zoom-out rect.svg-pan-zoom-control-background').attr('rx', 300);
    $('#svg-pan-zoom-reset-pan-zoom rect.svg-pan-zoom-control-background').attr('rx', 13);
}
let panConfig = {
    zoomEnabled: true,
    controlIconsEnabled: true,
    fit: true,
    center: true,
};
let panZoom;

