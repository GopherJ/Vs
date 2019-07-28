/**
 *
 * @param g
 * @param xScale
 * @param reference
 */
const moveReferenceX = (g, xScale, reference) => {
    try {
        const line        = g.select('.line--reference'),
            overlay       = g.select('.overlay'),
            overlayWidth  = +overlay.node().getBBox().width,
            x             = xScale(reference);

        overlay.attr('x', x - overlayWidth / 2);

        line.attr('x1', x).attr('x2', x);
    } catch(e) {
        console.log(e.message);
    }
};

export {
    moveReferenceX
};

