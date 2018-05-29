/**
 *
 * draw time ticks
 *
 * @param {d3.Selection} g
 * @param {d3.ScaleTime} scale
 * @param {number} h
 * @param {string} stroke
 * @param {number} strokeWidth
 * @param {string} clipPath
 * @return {void}
 */
function drawTicks(g, scale, h, stroke, strokeWidth, clipPath) {
    const ticks = scale.ticks(),
        ticksSelection = g.selectAll('.line--tick');

    if (!ticksSelection.empty()) {
        ticksSelection.remove();
    }

    g.selectAll('.line--tick')
        .data(ticks)
        .enter()
        .append('line')
        .attr('class', 'line--tick')
        .attr('clip-path', `url(#${clipPath})`)
        .attr('x1', d => scale(d))
        .attr('x2', d => scale(d))
        .attr('y1', 0)
        .attr('y2', h)
        .attr('stroke', stroke)
        .attr('stroke-width', strokeWidth)
        .attr('pointer-events', 'none');
}

export default drawTicks;
