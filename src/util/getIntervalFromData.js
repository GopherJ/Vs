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
        return 'h';
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
        return 'ms';
    }

    if (interval >= s && interval < m) {
        return 's';
    }

    if (interval >= m && interval < h) {
        return 'm';
    }

    if (interval >= h && interval < d) {
        return 'h';
    }

    if (interval >= d && interval < w) {
        return 'd';
    }

    if (interval >= w && interval < M) {
        return 'w';
    }

    if (interval >= M && interval < y) {
        return 'M';
    }

    return 'y';
};

export default getIntervalFromData;
