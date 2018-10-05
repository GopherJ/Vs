/**
 *
 * @param g
 * @param xScale
 * @param g_h
 * @param currentTimeLineColor
 * @param currentTimeLineWidth
 */
const drawCurrentReferenceX = (g, xScale, g_h, currentTimeLineColor, currentTimeLineWidth) => {
    const date = new Date(),
        referenceSelection = g.select('.line--reference');

    if (!referenceSelection.empty()) {
        referenceSelection
            .raise();

        referenceSelection
            .attr('x1', xScale(date))
            .attr('x2', xScale(date));
    } else {
        g.append('line')
            .attr('class', 'line--reference')
            .attr('x1', xScale(date))
            .attr('x2', xScale(date))
            .attr('y2', g_h)
            .attr('stroke', currentTimeLineColor)
            .attr('stroke-width', currentTimeLineWidth)
            .attr('pointer-events', 'none');
    }

    // if (!referenceSelection.empty()) referenceSelection.remove();
    //
    // g.append('line')
    //     .attr('class', 'line--reference')
    //     .attr('x1', xScale(date))
    //     .attr('x2', xScale(date))
    //     .attr('y1', 0)
    //     .attr('y2', g_h)
    //     .attr('stroke', currentTimeLineColor)
    //     .attr('stroke-width', currentTimeLineWidth)
    //     .attr('clip-path', `url(#${clipPathId})`)
    //     .attr('pointer-events', 'none');
};

export {
    drawCurrentReferenceX
};
