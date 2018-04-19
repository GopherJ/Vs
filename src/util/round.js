/**
 *
 * @param a
 * @param arr
 * @returns {number}
 */
function round(a, arr) {
    return isNaN(a) ? a : arr.find(el => Math.abs(a - el) / el < 0.05);
}

export default round;
