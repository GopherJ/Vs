/**
 *
 * @param g
 * @param xScale
 * @param g_h
 * @param clipPathId
 * @param currentTimeLineColor
 * @param currentTimeLineWidth
 */
const drawCurrentReferenceX = (g, xScale, g_h, clipPathId, currentTimeLineColor, currentTimeLineWidth) => {
    const referenceSelection = g.select('.line--reference');
    if (!referenceSelection.empty()) referenceSelection.remove();

    const date = new Date();

    g
        .append('line')
        .attr('class', 'line--reference')
        .attr('x1', xScale(date))
        .attr('x2', xScale(date))
        .attr('y1', 0)
        .attr('y2', g_h)
        .attr('stroke', currentTimeLineColor)
        .attr('stroke-width', currentTimeLineWidth)
        .attr('clip-path', `url(#${clipPathId})`)
        .attr('pointer-events', 'none');
};

export {
    drawCurrentReferenceX
};
