import * as d3 from 'd3';
import { isDate } from 'lodash';
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
 * @param {Date | string} key
 * @param {number} interval
 * @returns {string}
 */
const tickFormat = (key, interval) => {
    if (interval >= INTERVAL.Year) {
        return isDate(key)
            ? d3.timeFormat(MAP.Year)(key)
            : key;
    }

    if (interval >= INTERVAL.Month) {
        return isDate(key)
            ? d3.timeFormat(MAP.Month)(key)
            : key;

    }

    if (interval >= INTERVAL.Week) {
        return isDate(key)
            ? d3.timeFormat(MAP.Week)(key)
            : key;
    }

    if (interval >= INTERVAL.Day) {
        return isDate(key)
            ? d3.timeFormat(MAP.Day)(key)
            : key;
    }

    if (interval >= INTERVAL.Hour) {
        return isDate(key)
            ? d3.timeFormat(MAP.Hour)(key)
            : key;
    }

    if (interval >= INTERVAL.Minute) {
        return isDate(key)
            ? d3.timeFormat(MAP.Minute)(key)
            : key;
    }

    if (interval >= INTERVAL.Second) {
        return isDate(key)
            ? d3.timeFormat(MAP.Second)(key)
            : key;
    }

    return isDate(key)
        ? d3.timeFormat(MAP.Hour)(key)
        : key;
};

export default timeFormat;
