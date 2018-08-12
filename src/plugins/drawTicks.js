/**
 *
 * draw continious scale's ticks for axis x
 *
 * @param {d3.Selection} g
 * @param {d3.ScaleTime | d3.ScaleLinear} xScale
 * @param {number} g_h
 * @param {string} clipPathId
 * @param {string} stroke
 * @param {number} strokeWidth
 * @return {void}
 */
function drawTicksX(g, xScale, g_h, clipPathId, stroke, strokeWidth) {
    const ticks = xScale.ticks(),
        ticksSelection = g.selectAll('.line--tick');

    if (!ticksSelection.empty()) ticksSelection.remove();

    g.selectAll('.line--tick')
        .data(ticks)
        .enter()
        .append('line')
        .attr('class', 'line--tick')
        .attr('x1', d => xScale(d))
        .attr('x2', d => xScale(d))
        .attr('y2', g_h)
        .attr('clip-path', `url(#${clipPathId})`)
        .attr('stroke', stroke)
        .attr('stroke-width', strokeWidth)
        .attr('pointer-events', 'none');
}


/**
 *
 * draw continious scale's ticks for axis y
 *
 * @param {d3.Selection} g
 * @param {d3.ScaleTime} yScale
 * @param {number} g_w
 * @param {string} clipPathId
 * @param {string} stroke
 * @param {number} strokeWidth
 * @return {void}
 */
function drawTicksY(g, yScale, g_w, clipPathId, stroke, strokeWidth) {
    const ticks = yScale.ticks(),
        ticksSelection = g.selectAll('.line--tick');

    if (!ticksSelection.empty()) ticksSelection.remove();

    g.selectAll('.line--tick')
        .data(ticks)
        .enter()
        .append('line')
        .attr('class', 'line--tick')
        .attr('y1', d => yScale(d))
        .attr('y2', d => yScale(d))
        .attr('x2', g_w)
        .attr('clip-path', `url(#${clipPathId})`)
        .attr('stroke', stroke)
        .attr('stroke-width', strokeWidth)
        .attr('pointer-events', 'none');
}

export {
    drawTicksX,
    drawTicksY,
};
