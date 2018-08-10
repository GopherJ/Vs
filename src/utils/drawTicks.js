/**
 *
 * draw continious scale's ticks for axis x
 *
 * @param {d3.Selection} g
 * @param {d3.ScaleTime | d3.ScaleLinear} scale
 * @param {number} h
 * @param {string} clipPathId
 * @param {string} stroke
 * @param {number} strokeWidth
 * @return {void}
 */
function drawTicksX(g, scale, h, clipPathId, stroke, strokeWidth) {
    const ticks = scale.ticks(),
        ticksSelection = g.selectAll('.line--tick');

    if (!ticksSelection.empty()) ticksSelection.remove();

    g.selectAll('.line--tick')
        .data(ticks)
        .enter()
        .append('line')
        .attr('class', 'line--tick')
        .attr('x1', d => scale(d))
        .attr('x2', d => scale(d))
        .attr('y2', h)
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
 * @param {d3.ScaleTime} scale
 * @param {number} w
 * @param {string} clipPathId
 * @param {string} stroke
 * @param {number} strokeWidth
 * @return {void}
 */
function drawTicksY(g, scale, w, clipPathId, stroke, strokeWidth) {
    const ticks = scale.ticks(),
        ticksSelection = g.selectAll('.line--tick');

    if (!ticksSelection.empty()) ticksSelection.remove();

    g.selectAll('.line--tick')
        .data(ticks)
        .enter()
        .append('line')
        .attr('class', 'line--tick')
        .attr('y1', d => scale(d))
        .attr('y2', d => scale(d))
        .attr('x2', w)
        .attr('clip-path', `url(#${clipPathId})`)
        .attr('stroke', stroke)
        .attr('stroke-width', strokeWidth)
        .attr('pointer-events', 'none');
}

export {
    drawTicksX,
    drawTicksY
};
