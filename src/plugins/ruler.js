import * as d3 from 'd3';

/**
 *
 * y axis tick ruler generator
 *
 * @param axisYLane
 * @param yScale
 * @param g_w
 * @param tickFormat
 * @param ticks
 * @param tickSize
 * @param tickPadding
 */
const yRuler = (axisYLane, yScale, g_w, tickFormat, ticks, tickSize, tickPadding) => {
    const ruler = d3
        .axisRight(yScale)
        .tickFormat(tickFormat)
        .ticks(ticks)
        .tickSize(g_w);

    axisYLane
        .call(ruler);

    axisYLane
        .select('.domain')
        .remove();

    axisYLane
        .select('.tick:first-of-type line')
        .remove();

    axisYLane
        .selectAll('.tick:not(:first-of-type) line')
        .attr('stroke', '#777')
        .attr('stroke-dasharray', '2,2');

    axisYLane
        .selectAll('.tick text').attr('x', -(tickSize + tickPadding));
};

export {
    yRuler
};
