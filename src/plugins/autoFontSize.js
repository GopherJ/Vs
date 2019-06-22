export default function autoFontSize(containerSelection) {
    return function(textSelection) {
        const bbox = textSelection.node().getBBox(),
            cbbox = containerSelection.node().getBoundingClientRect(),
            scale = Math.min(cbbox.width / bbox.width, cbbox.height / bbox.height);

        textSelection.style('font-size', `${scale}px`);
    };
}
