import hasOverlap from './hasOverlap';

/**
 *
 * @param scale
 * @param i
 */
const GetScaleDomain = (scale, i) => {
    let domain = scale.domain();
    while (i > 0) {
        domain = domain.filter((d, i) => !(i % 2));
        i -= 1;
    }

    return domain;
};

/**
 *
 * @param axisXLane
 * @param axis
 * @param scale
 */
function responsiveAxis(axisXLane, axis, scale) {
    let ticks = axisXLane.selectAll('.tick');
    let scaleDomain = scale.domain(), i = 0;

    while (hasOverlap(ticks)) {
        i += 1;
        scaleDomain = GetScaleDomain(scale, i);
        axis.tickValues(scaleDomain);
        axisXLane.call(axis);
        ticks = axisXLane.selectAll('.tick');
    }
}

export default responsiveAxis;
