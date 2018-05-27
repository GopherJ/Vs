import { isDate } from 'lodash';

/**
 *
 * @param data
 * @return {boolean}
 */
const isAxisTime = (data) => {
    return data.every(d => isDate(d.key));
};

export default isAxisTime;
