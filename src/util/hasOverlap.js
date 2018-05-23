import * as d3 from 'd3';
import realBBox from './realBBox';

/**
 *
 * @param ticks
 * @returns {boolean}
 */
const hasOverlapX = (ticks) => {
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

const hasOverlapY = (ticks) => {
    let previousTickPos, overlapped = false;

    ticks.each(function () {
        const pos = realBBox(d3.select(this));
        if (previousTickPos && previousTickPos.y + previousTickPos.height > pos.y) {
            overlapped = true;
        }
        previousTickPos = pos;
    });

    return overlapped;
};

export {
    hasOverlapX,
    hasOverlapY
};
