/**
 *
 * align g element to center of the container
 *
 * @param g
 * @param w
 */
const alignCenter = (g, w) => {
    const SVGRect = g.node().getBBox();

    g.attr('transform', `translate(${w - SVGRect.width / 2}, 0)`);
};

export  {
    alignCenter
};
