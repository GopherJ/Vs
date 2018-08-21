import { isDate, isString, isFunction } from 'lodash';
import moment from 'moment';

/**
 *
 * time entry that represent a point
 *
 * @param {string} group
 * @param {Date} at
 * @param {string} title
 * @param {string} symbol
 * @param {string} className
 * @constructor
 */
class Point {
    constructor(group, at, title, symbol, className) {
        this.group = group;
        this.at = at;
        this.title = title;
        this.symbol = symbol;
        this.className = className;
    }
}

/**
 *
 * time entry that represent a period
 *
 * @param {string} group
 * @param {Date} from
 * @param {Date} to
 * @param {string} label
 * @param {string} title
 * @param {string} className
 * @constructor
 */
class Interval {
    constructor (group, from, to, label, title, className) {
        this.group = group;
        this.from = from;
        this.to = to;
        this.label = label;
        this.title = title;
        this.className = className;
    }
}

/**
 *
 * get every group's data
 *
 * @param data
 */
const groupBy = (data) => {
    const results = {};
    let dateTimeStart, dateTimeEnd;

    for (let i = 0, l = data.length; i < l; i += 1) {
        const entry = data[i],
            { group, from, to, label, at, title, className, symbol } = entry;

        if (isDate(from) && isDate(to) && from < to && (isString(group) || isFunction(group.toString))) {
            dateTimeStart = !dateTimeStart
                ? from
                : (dateTimeStart > from ? from : dateTimeStart);

            dateTimeEnd = !dateTimeEnd
                ? to
                : (dateTimeEnd < to ? to : dateTimeEnd);

            if (results[group]) {
                results[group].push(new Interval(group, from, to, label, title, className));
            }

            else {
                results[group] = [new Interval(group, from, to, label, title, className)];
            }
        }

        else if (isDate(at) && (isString(group) || isFunction(group.toString))) {
            dateTimeStart = !dateTimeStart
                ? at
                : (dateTimeStart > at ? at : dateTimeStart);

            dateTimeEnd = !dateTimeEnd
                ? at
                : (dateTimeEnd < at ? at : dateTimeEnd);

            if (results[group]) {
                results[group].push(new Point(group, at, title, symbol, className));
            }

            else {
                results[group] = [new Point(group, at, title, symbol, className)];
            }
        }
    }

    return {
        dateTimeStart,
        dateTimeEnd,
        results
    };
};


/**
 * check if two entries collide
 *
 * @param e1
 * @param e2
 */
const isCollided = (e1, e2) => {
    if (e1 === e2) {
        return false;
    }

    if (e1 instanceof Point && e2 instanceof Interval) {
        return e1.at.valueOf() >= e2.from.valueOf() && e1.at.valueOf() <= e2.to.valueOf();
    }

    else if (e1 instanceof Interval && e2 instanceof Point) {
        return e2.at.valueOf() >= e1.from.valueOf() && e2.at.valueOf() <= e1.to.valueOf();
    }

    else if (e1 instanceof Point && e2 instanceof Point) {
        return e1.at.valueOf() === e2.at.valueOf();
    }

    else if (e1 instanceof Interval && e2 instanceof Interval) {
        return (e2.from.valueOf() <= e1.to.valueOf() && e2.to.valueOf() >= e1.to.valueOf())
            || (e1.from.valueOf() <= e2.to.valueOf() && e1.to.valueOf() >= e2.to.valueOf());
    }
};

/**
 *
 * asc sort order
 *
 * @param a
 * @param b
 * @returns {number}
 */
const ascending = (a, b) => a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;

/**
 *
 * @param data
 * @returns {*}
 */
const sort = (data) => {
    return data.sort((a, b) => {
        if (a instanceof Point && b instanceof Interval) {
            return ascending(a.at, b.from);
        }

        else if (a instanceof Interval && b instanceof Point) {
            return ascending(a.from, b.at);
        }

        else if (a instanceof Interval && b instanceof Interval) {
            return ascending(a.from, b.from);
        }

        else if (a instanceof Point && b instanceof Point) {
            return ascending(a.at, b.at);
        }
    });
};

/**
 *
 * data is the array of time line entries
 *
 * @param data
 */
const chunk = (data) => {
    const results = [
        []
    ];

    sort(data);

    for (let i = 0, l = data.length; i < l; i += 1) {
        const entry = data[i];

        for (let j = 0, L = results.length; j < L; j += 1) {
            if (results[j].length === 0) {
                results[j].push(entry);
                break;
            }

            const lastItem = results[j][results[j].length - 1];

            if (!isCollided(lastItem, entry)) {
                results[j].push(entry);
                break;
            }

            else {
                if (j === results.length - 1) {
                    results.push([entry]);
                } else {
                    continue;
                }
            }
        }
    }

    return results;
};


/**
 *
 * @param data
 */
const getTimelineGroups = (data) => {
    const {results, dateTimeStart, dateTimeEnd} = groupBy(data),
        groups = Object.keys(results);

    if (!groups.length) {
        return {
            dateTimeStart: moment().startOf('year'),
            dateTimeEnd: moment(),
            data: {},
            groups,
        }
    }

    if (dateTimeStart.valueOf() === dateTimeEnd.valueOf()) {
        return groups.reduce((ite, cur) => {
            ite.data[cur] = chunk(results[cur]);
            return ite;
        }, {
            dateTimeStart: moment(dateTimeStart).subtract(6, 'months'),
            dateTimeEnd: moment(dateTimeEnd).add(6, 'months'),
            data: {},
            groups
        });
    }

    return groups.reduce((ite, cur) => {
        ite.data[cur] = chunk(results[cur]);
        return ite;
    }, {
        dateTimeStart,
        dateTimeEnd,
        data: {},
        groups
    });
};


export {
    Point,
    Interval,
    getTimelineGroups
};
