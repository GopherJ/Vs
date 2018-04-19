import INTERVAL from './interval';
/**
 *
 * @param interval {number}
 * @returns {string}
 */
function getIntervalString(interval) {
    if (Number.isNaN(interval)) {
        return 'Hour';
    }

    if (interval >= INTERVAL.Millisecond && interval < INTERVAL.Second) {
        return 'Millisecond';
    }

    if (interval >= INTERVAL.Second && interval < INTERVAL.Minute) {
        return 'Second';
    }

    if (interval >= INTERVAL.Minute && interval < INTERVAL.Hour) {
        return 'Minute';
    }

    if (interval >= INTERVAL.Hour && interval < INTERVAL.Day) {
        return 'Hour';
    }

    if (interval >= INTERVAL.Day && interval < INTERVAL.Week) {
        return 'Day';
    }

    if (interval >= INTERVAL.Week && interval < INTERVAL.Month) {
        return 'Week';
    }

    if (interval >= INTERVAL.Month && interval < INTERVAL.Year) {
        return 'Month';
    }

    return 'Year';
}

export default getIntervalString;

