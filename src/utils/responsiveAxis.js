import {hasOverlapX, hasOverlapY} from './hasOverlap';

/**
 *
 * @param axisXLane
 * @param axis
 * @param scale
 */
function responsiveAxisX(axisXLane, axis, scale) {
    let ticks = axisXLane.selectAll('.tick');
    let scaleDomain = scale.domain();

    while (hasOverlapX(ticks)) {
        scaleDomain = scaleDomain.filter((d, i) => !(i % 2));
        axis.tickValues(scaleDomain);
        axisXLane.call(axis);
        ticks = axisXLane.selectAll('.tick');
    }
}

/**
 *
 * @param axisYLane
 * @param axis
 * @param scale
 */
function responsiveAxisY(axisYLane, axis, scale) {
    let ticks = axisYLane.selectAll('.tick');
    let scaleDomain = scale.domain();

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
