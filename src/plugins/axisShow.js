import * as d3 from 'd3';

/**
 *
 * control the visibility of axis's path and line
 *
 * @param {d3.Selection} axisLane
 * @param {Boolean} isAxisPathShow
 * @param {Boolean} isAxisTickShow
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

        axisLane
            .selectAll('.tick text')
            .attr('y', function() {
                const text = d3.select(this),
                    y = text.attr('y');

                return y ? 0 : null;
            })
            .attr('x', function() {
                const text = d3.select(this),
                    x = text.attr('x');

                return x ? 0 : null;
            });
    }
}

export default axisShow;
