/**
 *
 * @param start
 * @param end
 * @param x
 * @return {*[]}
 */
const clampRange = (start, end, x) => {
    return [
        x < start ? start: x,
        x > end ? end : x
    ];
};

export default clampRange;
