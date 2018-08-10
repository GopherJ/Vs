/**
 *
 * align g element to the center of the container
 *
 * @param container
 * @param g
 */
const alignCenter = (container, g) => {
    const SVGRect = g.node().getBBox();

    g.attr('transform', `translate(${(container.node().getBBox().width - SVGRect.width) / 2}, 0)`);
};

/**
 *
 * align g element to the right of the container
 *
 * @param container
 * @param g
 */
const alignRight = (container, g) => {
    const SVGRect = g.node().getBBox();

    g.attr('transform', `translate(${container.node().getBBox().width - SVGRect.width}, 0)`);
};



export  {
    alignCenter,
    alignRight
};
