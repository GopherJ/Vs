/**
 *
 * @param g
 * @param xScale
 */
const moveCurrentReferenceX = (g, xScale) => {
    const referenceSelection = g.select('.line--reference');
    if (referenceSelection.empty()) return;

    const date = new Date();

    referenceSelection
        .attr('x1', xScale(date))
        .attr('x2', xScale(date));
};

export {
    moveCurrentReferenceX
};
