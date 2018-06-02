/**
 *
 * control the visibility of axis's path and line
 *
 * @param {d3.Selection} axisLane
 * @param {Bolean} isAxisPathShow
 * @param {Bolean} isAxisTickShow
 * @return {void}
 */
function axisShow (axisLane, isAxisPathShow, isAxisTickShow) {
    if (!isAxisPathShow) {
        axisLane
            .select('.domain')
            .attr('display', 'none');
    }

    if (!isAxisTickShow) {
        axisLane
            .selectAll('.tick line')
            .attr('display', 'none');
    }
}

export default axisShow;
