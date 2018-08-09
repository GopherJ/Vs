import { isDate, first } from 'lodash';

/**
 *
 * check if axis ticks are all dates and sort them
 *
 * @param data
 * @return {boolean}
 */
const isAxisTime = (data) => {
    if (!data.length) return false;

    let __isAxisTime__ = data.length === 1
        ? isDate(first(data).key)
        : true;

    data.sort((a, b) => {
        if (isDate(a.key) && isDate(b.key)) {
            return a.key < b.key ? -1 : a.key > b.key ? 1 : a.key.valueOf() >= b.key.valueOf() ? 0 : NaN;
        } else {
            __isAxisTime__ = false;
            return 0;
        }
    });

    return __isAxisTime__;
};

export default isAxisTime;
