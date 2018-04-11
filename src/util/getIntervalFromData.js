/**
 * constants for time interval
 *
 * @type {number}
 */
const ms = 1,
      s = 1000 * ms,
      m = 60 * s,
      h = 60 * m,
      d = 24 * h,
      w =  7 * d,
      M =  30 * d,
      y = 365 * d;

/**
 *
 * @param data
 * @param mapFunction
 * @returns {string}
 */
const getIntervalFromData = (data, mapFunction) => {
    if (!Array.isArray(data)) {
        throw new Error('Invalid data');
    }

    if (data.length <= 1) {
        return 'Hour';
    }

    let dataSorted = data.map(mapFunction).sort((a, b) => {
        if (a>b) {
            return 1;
        }
        return -1;
    });

    // initialisation
    let interval;
    dataSorted
        .reduce((ite, cur, curIdx) => {
            interval = curIdx === 1 || cur - ite < interval  ? cur - ite : interval;
            return cur;
        });


    if (interval >= ms && interval < s) {
        return 'Millisecond';
    }

    if (interval >= s && interval < m) {
        return 'Second';
    }

    if (interval >= m && interval < h) {
        return 'Minute';
    }

    if (interval >= h && interval < d) {
        return 'Hour';
    }

    if (interval >= d && interval < w) {
        return 'Day';
    }

    if (interval >= w && interval < M) {
        return 'Week';
    }

    if (interval >= M && interval < y) {
        return 'Month';
    }

    return 'Year';
};

export default getIntervalFromData;
