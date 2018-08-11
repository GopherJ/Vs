/**
 *
 * @param g
 * @param x
 * @param overlayWidth
 */
const moveReferenceX = (g, x, overlayWidth) => {
    const line = g.select('.line--reference'),
        overlay = g.select('.overlay');

    overlay.attr('x', x - overlayWidth / 2);

    line.attr('x1', x).attr('x2', x);
};

export {
    moveReferenceX
};

