/**
 *
 * @param data
 * @returns {number, array}
 */
const getIntervalFromData = (data) => {
    // initialisation
    let interval,
        _data;

    _data = data.sort((a, b) => {
        if (a.key > b.key) {
            return 1;
        }
        return -1;
    });

    if (_data.length === 1) {
        return {
            interval: NaN,
            data: _data
        };
    }


    _data.reduce((ite, cur, curIdx) => {
        interval = curIdx === 1 || cur.key - ite.key < interval ? cur.key - ite.key : interval;
        return cur;
    });

    return {
        interval,
        data: _data
    };
};

export default getIntervalFromData;
