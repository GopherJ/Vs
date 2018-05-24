import _ from 'lodash';

/**
 *
 * @param data
 * @returns {*}
 */
const isAxisTime = (data) => {
    return data.every(el => _.isDate(el.key));
};

export default isAxisTime;
