/**
 *  interval decides which format of time we use
 *  the format of time and font size decides the width, just omit font-family
 *
 * @type {{ms: number, s: number, m: number, h: number, w: number, d: number, M: number, y: number}}
 */
const Maps = {
    'ms': 8,
    's': 6,
    'm': 4,
    'h': 9,
    'd': 6,
    'w': 6,
    'M': 6,
    'y': 4
};

/**
 *
 * @param fontSize
 * @param interval
 * @param tickSizeInner
 * @returns {number}
 */
const calculateTickSize = (fontSize, interval, tickSizeInner) => {
    return fontSize * Maps[interval] + 2 * tickSizeInner;
};


/**
 *
 * @param fontSize
 * @param width
 * @param interval
 * @param tickSizeInner
 * @returns {Array}
 */
const getAxisXTicks = (fontSize, width, interval, tickSizeInner, tickSizeOuter) => {
    let size, ticksNum, arr = [];
    size = calculateTickSize(fontSize, interval, tickSizeInner);
    ticksNum = Math.floor((width - 2 * tickSizeOuter) / size);

    for (let i = 0; i < ticksNum; i += 1) {
        arr.push(size / 2 * (2 * i + 1) + tickSizeOuter);
    }
    return arr;
};

export default getAxisXTicks;
