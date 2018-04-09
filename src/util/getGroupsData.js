/* eslint-disable */

/**
 * first type of time line entry
 *
 * @param group
 * @param at
 * @param title
 * @constructor
 */
function Point(group, at, title) {
    this.group = group;
    this.at = at;
    this.title = title;
}

/**
 * second type of time line entry
 *
 * @param group
 * @param from
 * @param to
 * @param label
 * @constructor
 */
function Interval(group, from, to, label) {
    this.group = group;
    this.from = from;
    this.to = to;
    this.label = label;
}

/**
 * get every group's data
 * @param data
 */
const classifyDataByGroup = (data) => {
   const results = {};

   for (let i = 0, l = data.length; i < l; i += 1) {
       // try to spread all props
       const { group, from, to, label, at, title } = data[i];
       if (results[group]) {
           // Interval
           if (from && to && label) {
               results[group].push(new Interval(group, from, to, label));
           }
           // Point
           else if (at && title) {
               results[group].push(new Point(group, at, title));
           }
       } else {
           results[group] = [];
       }
   }

   return results;
};


/**
 * check if two entries collide
 *
 * @param entry1, entry2
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
        return e2.from <= e1.to ||  e1.from <= e2.to;
    }
};


/**
 * to see if already exists collided entry
 *
 * @param arr
 * @param e
 */
const existCollisonInArray = (arr, e) => {
    return arr.some(el => isCollided(el, e));
};


/**
 *
 * data is the array of time line entries
 *
 * @param data
 */
const chunkGroupData = (data) => {
    const results = [[]];

    for (let i = 0, l = data.length; i < l; i += 1) {
        const entry = data[i];

        for (let j = 0, L = results.length; j < L; j += 1) {
            if (!existCollisonInArray(results[j], entry)) {
                results[j].push(entry);
                break;
            }

            if (j === L - 1) {
                results.push([]);
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
    const results = classifyDataByGroup(data);

    Object.keys(results).reduce((ite, cur) => {
        ite[cur] = chunkGroupData(results[cur]);
        return ite;
    }, {});
};


export default getGroupsData;
