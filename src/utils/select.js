/**
 *
 * select the correct paddingInner and paddingOuter for axis x
 *
 * @param {number} width
 * @return {[number, number]}
 */
const selectPaddingInnerOuterX = (width) => {
    let paddingInner = 0.5, paddingOuter = 0.1;

    if (width > 560) paddingInner = 0.4;
    if (width > 970) paddingInner = 0.3;

    return [paddingInner, paddingOuter];
};

/**
 *
 * select the correct paddingInner and paddingOuter for axis x
 *
 * @param {number} height
 * @return {[number, number]}
 */
const selectPaddingInnerOuterY = (height) => {
    let paddingInner = 0.2, paddingOuter = 0.1;

    if (height > 560) paddingInner = 0.15;
    if (height > 970) paddingInner = 0.1;

    return [paddingInner, paddingOuter];
};

/**
 *
 * select the correct number of ticks for axis y
 *
 * @param {number} height
 * @return {number}
 */
const selectTicksNumY = (height) => {
    let ticksY = 1;

    if (height > 50)  ticksY = 2;
    if (height > 100) ticksY = 3;
    if (height > 200) ticksY = 5;
    if (height > 400) ticksY = 10;

    return ticksY;
};

/**
 *
 * select the correct number of ticks for axis y
 *
 * @param {number} width
 * @return {number}
 */
const selectTicksNumX = (width) => {
    let ticksX = 2;

    if (width >= 560) ticksX = 5;
    if (width > 960)  ticksX = 10;

    return ticksX;
};

export {
    selectPaddingInnerOuterX,
    selectPaddingInnerOuterY,

    selectTicksNumX,
    selectTicksNumY
};
