import * as d3 from 'd3';
import INTERVAL from './interval';

/**
 *
 * interval - format map
 *
 * @type {Readonly<{Millisecond: string, Second: string, Minute: string, Hour: string, Week: string, Day: string, Month: string, Year: string}>}
 */
const MAP = Object.freeze({
    'Millisecond': '%H:%M:%S.%L',
    'Second': '%H:%M:%S',
    'Minute': '%H:%M',
    'Hour': '%Y-%m-%d %H:%M',
    'Week': '%Y-%m-%d',
    'Day': '%Y-%m-%d',
    'Month': '%Y-%m-%d',
    'Year': '%Y'
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
        return d3.timeFormat(MAP.Year)(key);
    }

    if (interval >= INTERVAL.Month) {
        return d3.timeFormat(MAP.Month)(key);
    }

    if (interval >= INTERVAL.Week) {
        return d3.timeFormat(MAP.Week)(key);
    }

    if (interval >= INTERVAL.Day) {
        return d3.timeFormat(MAP.Day)(key);
    }

    if (interval >= INTERVAL.Hour) {
        return d3.timeFormat(MAP.Hour)(key);
    }

    if (interval >= INTERVAL.Minute) {
        return d3.timeFormat(MAP.Minute)(key);
    }

    if (interval >= INTERVAL.Second) {
        return d3.timeFormat(MAP.Second)(key);
    }

    return d3.timeFormat(MAP.Hour)(key);
};

export default tickFormat;
