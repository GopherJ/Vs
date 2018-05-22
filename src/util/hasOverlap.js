import * as d3 from 'd3';
import realBBox from './realBBox';

/**
 *
 * @param ticks
 * @returns {boolean}
 */
const hasOverlap = (ticks) => {
    let previousTickPos, overlapped = false;

    ticks.each(function () {
        const pos = realBBox(d3.select(this));
        if (previousTickPos && previousTickPos.x + previousTickPos.width > pos.x) {
            overlapped = true;
        }
        previousTickPos = pos;
    });

    return overlapped;
};

export default hasOverlap;
