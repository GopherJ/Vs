
/**
 *
 * @param {d3.Selection} axisLane
 * @return {void}
 */
const lastTickTextAnchorEnd = (axisLane) => {
    axisLane
        .select('.tick:last-child text')
        .attr('text-anchor', 'end');
};

/**
 *
 * @param {3.Selection} axisLane
 * @return {void}
 */
const firstTickTextAnchorStart = (axisLane) => {
    axisLane
        .select('.tick:first-of-type text')
        .attr('text-anchor', 'start');
};

export {
    firstTickTextAnchorStart,
    lastTickTextAnchorEnd
}
