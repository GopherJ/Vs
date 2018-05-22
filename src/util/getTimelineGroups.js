/* eslint-disable */
/**
 * first type of time line entry
 *
 * @param group
 * @param at
 * @param title
 * @param symbol
 * @param className
 * @constructor
 */
function Point(group, at, title, symbol, className) {
    this.group = group;
    this.at = at;
    this.title = title;
    this.symbol = symbol;
    this.className = className;
}

/**
 * second type of time line entry
 *
 * @param group
 * @param from
 * @param to
 * @param label
 * @param title
 * @param className
 * @constructor
 */
function Interval(group, from, to, label, title, className) {
    this.group = group;
    this.from = from;
    this.to = to;
    this.label = label;
    this.title = title;
    this.className = className;
}

/**
 * get every group's data
 * @param data
 */
const classifyDataByGroup = (data) => {
    const results = {};
    let dateTimeStart, dateTimeEnd;

    for (let i = 0, l = data.length; i < l; i += 1) {
        const {group, from, to, label, at, title, className, symbol} = data[i];

        if ((from > 0) && (to > 0) && label) {
            dateTimeStart = i === 0 ? from : (dateTimeStart > from ? from : dateTimeStart);
            dateTimeEnd = i === 0 ? to : (dateTimeEnd < to ? to : dateTimeEnd);

            if (results[group]) {
                results[group].push(new Interval(group, from, to, label, title, className));
            }

            else {
                results[group] = [new Interval(group, from, to, label, title, className)];
            }
        }

        else if ((at > 0) && title) {
            dateTimeStart = i === 0 ? at : (dateTimeStart > at ? at : dateTimeStart);
            dateTimeEnd = i === 0 ? at : (dateTimeEnd < at ? at : dateTimeEnd);

            if (results[group]) {
                results[group].push(new Point(group, at, title, symbol, className));
            } else {
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
 * @param e1, e2
 */
const isCollided = (e1, e2) => {
    if (e1 === e2) {
        return false;
    }

    if (e1 instanceof Point && e2 instanceof Interval) {
        return e1.at >= e2.from && e1.at <= e2.to;
    }

    else if (e1 instanceof Interval && e2 instanceof Point) {
        return e2.at >= e1.from && e2.at <= e1.to;
    }

    else if (e1 instanceof Point && e2 instanceof Point) {
        return e1.at === e2.at;
    }

    else if (e1 instanceof Interval && e2 instanceof Interval) {
        return e2.from <= e1.to || e1.from <= e2.to;
    }
};


/**
 *
 * @param data
 * @returns {*}
 */
const sortDataByTimestamp = (data) => {
    return data.sort((a, b) => {
        if (a instanceof Point && b instanceof Interval) {
            return a.at > b.from ? 1 : -1;
        }

        else if (a instanceof Interval && b instanceof Point) {
            return a.from > b.at ? 1 : -1;
        }

        else if (a instanceof Interval && b instanceof Interval) {
            return a.from > b.from ? 1 : -1;
        }

        else if (a instanceof Point && b instanceof Point) {
            return a.at > b.at ? 1 : -1;
        }
    });
};

/**
 *
 * data is the array of time line entries
 *
 * @param data
 */
const chunkGroupData = (data) => {
    const results = [
        // to place the data of every lane
        []
    ];

    // sort change the data
    sortDataByTimestamp(data);

    for (let i = 0, l = data.length; i < l; i += 1) {
        const entry = data[i];

        for (let j = 0, L = results.length; j < L; j += 1) {
            // no data in current lane
            // add it directly
            if (results[j].length === 0) {
                results[j].push(entry);
                break;
            }

            // last item in current lane
            const lastItem = results[j][results[j].length - 1];

            // doesn't collide
            if (!isCollided(lastItem, entry)) {
                results[j].push(entry);
                break;
            }

            // collide
            else {
                // no other lane, so create a need lane
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
const getGroupsData = (data) => {
    const {results, dateTimeStart, dateTimeEnd} = classifyDataByGroup(data);

    return Object.keys(results).reduce((ite, cur) => {
        ite['data'][cur] = chunkGroupData(results[cur]);
        return ite;
    }, {
        dateTimeStart,
        dateTimeEnd,
        data: {},
        groups: Object.keys(results)
    });
};


export {
    Point,
    Interval,
    getGroupsData
};
