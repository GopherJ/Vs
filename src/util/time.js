import * as d3 from 'd3';

/**
 *
 * @type {{ms: string, s: string, m: string, h: string, w: string, d: string, M: string, y: string}}
 */
const INTERVAL = {
    'ms' : "%H:%M:%S", // 8
    's' : "%H:%M:%S", // 8
    'm' : "%H:%M", // 5
    'h' : "%Y-%m-%d %H:%M", // 16
    'w' : "%Y-%m-%d", // 10
    'd' : "%Y-%m-%d", // 10
    'M' : "%Y-%m-%d", // 10
    'y' : "%Y" // 4
};

/**
 *
 * @param date
 * @param interval
 */
const formatTime = (date, interval) => {
    return d3.timeFormat(INTERVAL[interval])(typeof date === 'number' ? new Date(date) : date);
};

export default formatTime;
