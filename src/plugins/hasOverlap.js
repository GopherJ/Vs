import * as d3 from 'd3';
import realBBox from './realBBox';

/**
 *
 * check if tick texts of axis x have overlaps
 *
 * @param ticks
 * @return {boolean}
 */
const hasOverlapX = (ticks) => {
    let previousTickRect, overlapped = false;

    ticks.each(function () {
        const rect = realBBox(d3.select(this));
        if (previousTickRect && previousTickRect.x + previousTickRect.width > rect.x) {
            overlapped = true;
        }
        previousTickRect = rect;
    });

    return overlapped;
};

/**
 *
 * check if tick texts of axis y have overlaps
 *
 * @param ticks
 * @return {boolean}
 */
const hasOverlapY = (ticks) => {
    let previousTickRect, overlapped = false;

    ticks.each(function () {
        const rect = realBBox(d3.select(this));
        if (previousTickRect && previousTickRect.y + previousTickRect.height > rect.y) {
            overlapped = true;
        }
        previousTickRect = rect;
    });

    return overlapped;
};

export {
    hasOverlapX,
    hasOverlapY
};
