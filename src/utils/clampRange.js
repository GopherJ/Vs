/**
 *
 * @param start
 * @param end
 * @param x
 * @return {*[]}
 */
const clampRange = (start, end, x) => {
    if (x < start) return [x, end];
    if (x > end) return [start, x];
    return [start, x];
};

export default clampRange;
