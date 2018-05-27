import * as d3 from 'd3';

/**
 *
 * set the first tick text text-anchor: start
 *
 * @param {d3.Selection} svg
 * @return {void}
 */
const transformFirstTickTextToTextAnchorStart = (svg) => {
    svg.select('.axis.axis--x .tick:first-of-type text')
        .attr('text-anchor', 'start');
};

/**
 *
 * set the last tick text text-anchor: end
 *
 * @param {d3.Selection} svg
 * @return {void}
 */
const transformLastTickTextToTextAnchorEnd = (svg) => {
    svg.select('.axis.axis--x .tick:last-child text')
        .attr('text-anchor', 'end');
};

export {
    transformFirstTickTextToTextAnchorStart,
    transformLastTickTextToTextAnchorEnd,
};
