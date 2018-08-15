import { Point, Interval } from './getTrackerLanes';

/**
 *
 * @param a
 * @param x
 * @return {*}
 */
const bisecRight = (a, x) => {
    let lo = 0, hi = a.length;

    while (lo < hi) {
        const mid = lo + hi >>> 1;
        if ((a[mid] instanceof Point && a[mid].at > x) || (a[mid] instanceof Interval && a[mid].from > x)) hi = mid;
        else lo = mid + 1;
    }

    return a[lo]
        ? (a[lo] instanceof Point ? a[lo].at : a[lo].from)
        : undefined;
};

/**
 *
 * @param lanes
 * @param reference
 * @return {any}
 */
const getNextEntryPoint = (lanes, reference) => {
    const candidates = lanes.map(lane => bisecRight(lane, reference)).filter(x => x);

    return candidates.length > 0
        ? Math.min(...candidates)
        : undefined;
};

export default getNextEntryPoint;
