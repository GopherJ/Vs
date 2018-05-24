/**
 *
 * @param date
 * @returns {boolean}
 */
const isValidDate = (date) => {
    return Object.prototype.toString.call(date) === '[object Date]' && !Number.isNaN(date.getTime());
};

export default isValidDate;
