import { isNumber, first } from 'lodash';

/**
 *
 * check if axis ticks are all numbers and sort them
 *
 * @param data
 * @return {boolean}
 */
const isAxisNumber = (data) => {
    if (!data.length) return false;

    let __isAxisNumber__ = data.length === 1
        ? isNumber(first(data).key)
        : true;

    data.sort((a, b) => {
        if (isNumber(a.key) && isNumber(b.key)) {
            return a.key < b.key ? -1 : a.key > b.key ? 1 : a.key >= b.key ? 0 : NaN;
        } else {
            __isAxisNumber__ = false;
            return 0;
        }
    });

    return __isAxisNumber__;
};

export default isAxisNumber;
