
/**
 *
 * @param {Date} date
 * @return {Date}
 */
function toUTC(date) {
    const date_utc =  Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
    );

    return new Date(date_utc);
}

export default toUTC;

