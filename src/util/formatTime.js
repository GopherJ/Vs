import * as d3 from 'd3';

/**
 *
 * @type {{ms: string, s: string, m: string, h: string, w: string, d: string, M: string, y: string}}
 */
const INTERVAL = Object.freeze({
    'Millisecond' : "%H:%M:%S.%L", // 11
    'Second' : "%H:%M:%S", // 8
    'Minute' : "%H:%M", // 5
    'Hour' : "%Y-%m-%d %H:%M", // 16
    'Week' : "%Y-%m-%d", // 10
    'Day' : "%Y-%m-%d", // 10
    'Month' : "%Y-%m-%d", // 10
    'Year' : "%Y" // 4
});

/**
 *
 * @param date
 * @param interval
 */
const formatTime = (date, interval) => {
    return d3.timeFormat(INTERVAL[interval])(typeof date === 'number' ? new Date(date) : date);
};

export default formatTime;
