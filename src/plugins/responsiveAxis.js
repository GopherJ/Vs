import { hasOverlapX, hasOverlapY } from './hasOverlap';

/**
 *
 * make xAxis's number of ticks responsive to container size
 *
 * @param {d3.Selection} axisXLane
 * @param {d3.Axis} axis
 * @param {d3.ScaleBand | d3.ScalePoint} scale
 */
function responsiveAxisX(axisXLane, axis, scale) {
    let ticks = axisXLane.selectAll('.tick');
    let scaleDomain = scale.invert ? scale.ticks() : scale.domain();

    while (hasOverlapX(ticks)) {
        scaleDomain = scaleDomain.filter((d, i) => !(i % 2));
        axis.tickValues(scaleDomain);
        axisXLane.call(axis);
        ticks = axisXLane.selectAll('.tick');
    }
}


/**
 *
 * make yAxis's number of ticks responsive to container size
 *
 * @param {d3.Selection} axisYLane
 * @param {d3.Axis} axis
 * @param {d3.ScaleBand | d3.ScalePoint} scale
 */
function responsiveAxisY(axisYLane, axis, scale) {
    let ticks = axisYLane.selectAll('.tick');
    let scaleDomain = scale.invert ? scale.ticks() : scale.domain();

    while (hasOverlapY(ticks)) {
        scaleDomain = scaleDomain.filter((d, i) => !(i % 2));
        axis.tickValues(scaleDomain);
        axisYLane.call(axis);
        ticks = axisYLane.selectAll('.tick');
    }
}

export {
    responsiveAxisX,
    responsiveAxisY
};
