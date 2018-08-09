
import { isDate, first } from 'lodash';
import moment from 'moment';

/**
 *
 * time entry that represent a point
 *
 * @param {Date} at
 * @param {string} title
 * @param {string} symbol
 * @param {string} className
 * @param {any} payload
 * @constructor
 */
class Point {
    constructor(at, title, symbol, className, payload) {
        this.at = at;
        this.title = title;
        this.symbol = symbol;
        this.className = className;
        this.payload = payload;
    }
}

/**
 *
 * time entry that represent a period
 *
 * @param {Date} from
 * @param {Date} to
 * @param {string} label
 * @param {string} title
 * @param {string} className
 * @param {any} payload
 * @constructor
 */
class Interval {
    constructor (from, to, label, title, className, payload) {
        this.from = from;
        this.to = to;
        this.label = label;
        this.title = title;
        this.className = className;
        this.payload = payload;
    }
}


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
 * transform data to Interval or Point and calculate the dateTimeStart and dateTimeEnd
 *
 * @param {Array} data
 * @return {result, dateTimeStart, dateTimeEnd}
 */
const transform = (data) => {
    const result = [];
    let dateTimeStart, dateTimeEnd;

    for (let i = 0, l = data.length; i < l; i += 1) {
        const entry = data[i],
            { from , to, at, label, title, className, symbol, payload } = entry;

        if (isDate(from) && isDate(to) && from < to) {
            result.push(new Interval(from, to, label, title, className, payload));

            dateTimeStart = !dateTimeStart
                ? from
                : (dateTimeStart > from ? from : dateTimeStart);

            dateTimeEnd = !dateTimeEnd
                ? to
                : (dateTimeEnd < to ? to : dateTimeEnd);
        }


        if (isDate(at)) {
            result.push(new Point(at, title, symbol, className, payload));

            dateTimeStart = !dateTimeStart
                ? at
                : (dateTimeStart > at ? at : dateTimeStart);

            dateTimeEnd = !dateTimeEnd
                ? at
                : (dateTimeEnd < at ? at : dateTimeEnd);
        }
    }

    return {
        result,
        dateTimeStart,
        dateTimeEnd
    }
};


/**
 * check if two entries collide
 *
 * @param {Interval | Point} e1
 * @param {Interval | Point} e2
 * @return {boolean}
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
 * @param data
 * @return {Array}
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
 * chunk result that has been transformed into different lanes
 *
 * @param data
 * @return {Array}
 */
const chunk = (data) => {
    const lanes = [
        []
    ];

    sort(data);

    for (let i = 0, l = data.length; i < l; i += 1) {
        const entry = data[i];

        for (let j = 0, L = lanes.length; j < L; j += 1) {
            const lane = lanes[j];

            if (lane.length === 0) {
                lane.push(entry);
                break;
            }

            const lastEntry = lane[lane.length - 1];

            if (!isCollided(lastEntry, entry)) {
                lane.push(entry);
                break;
            }

            else {
                if (j === lanes.length - 1) {
                    lanes.push([entry]);
                } else {
                    continue;
                }
            }
        }
    }

    return lanes;
};


/**
 *
 * get tracker lanes and dateTimeRange
 *
 * @param data
 * @return {data, dateTimeStart, dateTimeEnd}
 */
const getTrackerLanes = (data) => {
    if (!data.length) {
        return {
            dateTimeStart: moment().startOf('year'),
            dateTimeEnd: moment(),
            lanes: [
                []
            ]
        };
    }

    if (data.length === 1) {
        const elem = first(data),
            { from , to, at, label, title, className, symbol, payload } = elem;

        if (isDate(from) && isDate(to) && from < to) {
            return {
                dateTimeStart: from,
                dateTimeEnd: to,
                lanes: [
                    [new Interval(from, to, label, title, className, payload)]
                ]
            }
        }

        if (isDate(at)) {
            return {
                dateTimeStart: moment(at).subtract(6, 'months'),
                dateTimeEnd: moment(at).add(6, 'months'),
                lanes: [
                    [new Point(at, title, symbol, className, payload)]
                ]
            };
        }

        return {
            dateTimeStart: moment().startOf('year'),
            dateTimeEnd: moment().endOf('year'),
            lanes: [
                []
            ]
        };
    }

    const { result, dateTimeStart, dateTimeEnd } = transform(data);
    if (!result.length) {
        return {
            dateTimeStart: moment().startOf('year'),
            dateTimeEnd: moment(),
            lanes: [
                []
            ]
        };
    }

    const lanes = chunk(result);

    if (dateTimeStart.getTime() === dateTimeEnd.getTime()) {
        return {
            lanes,
            dateTimeStart: moment(dateTimeStart).startOf('year'),
            dateTimeEnd: moment(dateTimeStart).endOf('year')
        };
    }

    return {
        lanes,
        dateTimeStart,
        dateTimeEnd
    };
};


export {
    Point,
    Interval,
    getTrackerLanes
};
