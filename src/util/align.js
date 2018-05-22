const center = (container, g) => {
    const gPos = g.node().getBBox(),
        containerPos = container.node().getBBox();

    g.attr('transform', `translate(${(containerPos.width - gPos.width) / 2}, 0)`);
};

export default {
    center
};
