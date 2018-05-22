import * as d3 from 'd3';
import _ from 'lodash';
import INTERVAL from './interval';

/**
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
 * @param value
 * @param interval
 * @returns {*}
 */
const timeFormat = (value, interval) => {
    if (_.isNull(interval)) {
        return _.isNumber(value)
            ? d3.timeFormat(MAP['Hour'])(new Date(value))
            : d3.timeFormat(MAP['Hour'])(value);
    }

    if (interval >= INTERVAL['Year']) {
        return _.isNumber(value)
            ? d3.timeFormat(MAP['Year'])(new Date(value))
            : d3.timeFormat(MAP['Year'])(value);
    }

    if (interval >= INTERVAL['Month']) {
        return _.isNumber(value)
            ? d3.timeFormat(MAP['Month'])(new Date(value))
            : d3.timeFormat(MAP['Month'])(value);
    }

    if (interval >= INTERVAL['Week']) {
        return _.isNumber(value)
            ? d3.timeFormat(MAP['Week'])(new Date(value))
            : d3.timeFormat(MAP['Week'])(value);
    }

    if (interval >= INTERVAL['Day']) {
        return _.isNumber(value)
            ? d3.timeFormat(MAP['Day'])(new Date(value))
            : d3.timeFormat(MAP['Day'])(value);
    }

    if (interval >= INTERVAL['Hour']) {
        return _.isNumber(value)
            ? d3.timeFormat(MAP['Hour'])(new Date(value))
            : d3.timeFormat(MAP['Hour'])(value);
    }

    if (interval >= INTERVAL['Minute']) {
        return _.isNumber(value)
            ? d3.timeFormat(MAP['Minute'])(new Date(value))
            : d3.timeFormat(MAP['Minute'])(value);
    }

    if (interval >= INTERVAL['Second']) {
        return _.isNumber(value)
            ? d3.timeFormat(MAP['Second'])(new Date(value))
            : d3.timeFormat(MAP['Second'])(value);
    }

    return _.isNumber(value)
        ? d3.timeFormat(MAP['Millisecond'])(new Date(value))
        : d3.timeFormat(MAP['Millisecond'])(value);
};

export default timeFormat;
