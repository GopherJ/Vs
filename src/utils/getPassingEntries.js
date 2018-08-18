import { Point, Interval } from './getTrackerLanes';

/**
 *
 * @param a
 * @param x
 * @param isLTR
 * @return {number}
 */
const bisecRight = (a, x, isLTR) => {
    let lo = 0, hi = a.length;

    while (lo < hi) {
        const mid = lo + hi >>> 1;
        if ((a[mid] instanceof Point && a[mid].at.valueOf() > x) || (a[mid] instanceof Interval && (isLTR ? a[mid].from : a[mid].to) > x)) hi = mid;
        else lo = mid + 1;
    }

    return lo;
};

/**
 *
 * @param x
 * @param entry
 * @param tickLen
 * @param isLTR
 * @return {boolean}
 */
const isPassingPoint = (x, entry, tickLen, isLTR) => {
    const timestamp = entry.at.valueOf();

    const range = isLTR
        ?  [x.valueOf() - tickLen, x.valueOf()]
        : [x.valueOf(), x.valueOf() + tickLen];

    return isLTR
        ? (timestamp <= range[1] && timestamp > range[0])
        : (timestamp >= range[0] && timestamp < range[1]);
};

/**
 *
 * @param x
 * @param entry
 * @param tickLen
 * @param isLTR
 * @return {boolean}
 */
const isPassingInterval = (x, entry, tickLen, isLTR) => {
    const from = entry.from.valueOf(), to = entry.to.valueOf();

    const range = isLTR
        ? [x.valueOf() - tickLen, x.valueOf()]
        : [x.valueOf(), x.valueOf() + tickLen];

    return isLTR
        ? (range[1] >= from && range[1] <= to) || (range[1] > to && range[0] <= from)
        : (range[0] >= from && range[0] <= to) || (range[0] < from && range[1] >= to);
};

/**
 *
 * @param lane
 * @param reference
 * @param tickLen
 * @param isLTR
 * @return {*}
 */
const getPassingEntry = (lane, reference, tickLen, isLTR = true) => {
    const idx = bisecRight(lane, reference, isLTR), entry = isLTR ? lane[idx - 1] : lane[idx];

    if (entry instanceof Point && isPassingPoint(reference, entry, tickLen, isLTR))
        return entry;

    if (entry instanceof Interval && isPassingInterval(reference, entry, tickLen, isLTR))
        return entry;

    return undefined;
};

/**
 *
 * @param lanes
 * @param reference
 * @param tickLen
 * @param isLTR
 * @return {Array}
 */
const getPassingEntries = (lanes, reference, tickLen, isLTR = true) => {
    const entries = [];

    for (let i = 0, l = lanes.length; i < l; i += 1) {
        const lane = lanes[i], entry = getPassingEntry(lane, reference, tickLen, isLTR);

        if (entry !== undefined) entries.push(entry);
    }

    return entries;
};

export default getPassingEntries;

