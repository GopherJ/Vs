import * as d3 from "d3";
import INTERVAL from "./interval";

/**
 *
 * interval - format map
 *
 * @type {Readonly<{Millisecond: string, Second: string, Minute: string, Hour: string, Week: string, Day: string, Month: string, Year: string}>}
 */
const MAP = Object.freeze({
    Millisecond: "%H:%M:%S.%L",
    Second: "%H:%M:%S",
    Minute: "%H:%M",
    Hour: "%m-%d %H:%M",
    Week: "%m-%d",
    Day: "%m-%d",
    Month: "%m-%d",
    Year: "%Y",
});

/**
 *
 * tick text format
 *
 * @param {Date} key
 * @param {number|null} interval
 * @returns {string}
 */
const tickFormat = (key, interval) => {
    if (interval >= INTERVAL.Year) {
        return d3.utcFormat(MAP.Year)(key);
    }

    if (interval >= INTERVAL.Month) {
        return d3.utcFormat(MAP.Month)(key);
    }

    if (interval >= INTERVAL.Week) {
        return d3.utcFormat(MAP.Week)(key);
    }

    if (interval >= INTERVAL.Day) {
        return d3.utcFormat(MAP.Day)(key);
    }

    if (interval >= INTERVAL.Hour) {
        return d3.utcFormat(MAP.Hour)(key);
    }

    if (interval >= INTERVAL.Minute) {
        return d3.utcFormat(MAP.Minute)(key);
    }

    if (interval >= INTERVAL.Second) {
        return d3.utcFormat(MAP.Second)(key);
    }

    return d3.utcFormat(MAP.Hour)(key);
};

export default tickFormat;
