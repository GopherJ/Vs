/**
 *
 * @param g
 * @param xScale
 * @param reference
 * @param overlayWidth
 */
const moveReferenceX = (g, xScale, reference, overlayWidth) => {
    const line = g.select('.line--reference'),
        overlay = g.select('.overlay'),
        x = xScale(reference);

    overlay.attr('x', x - overlayWidth / 2);

    line.attr('x1', x).attr('x2', x);
};

export {
    moveReferenceX
};

