/**
 *
 * @param fontSize
 * @param width
 * @param interval
 * @param tickSizeInner
 * @returns {Array}
 */
const getAxisXTicks = (fontSize, width, interval, tickSizeInner) => {
    let size, ticksNum, arr = [];
    switch(interval) {
        case 'ms':
            size = fontSize * 10 + 2 * tickSizeInner;
            ticksNum = Math.round(width / size);

            for (let i = 0; i < ticksNum; i += 1) {
                arr.push(size/2 * (2*i+1));
            }
            return arr;
        case 's':
            size = fontSize * 8 + 2 * tickSizeInner;
            ticksNum = Math.round(width / size);

            for (let i = 0; i < ticksNum; i += 1) {
                arr.push(size/2 * (2*i+1));
            }
            return arr;
        case 'm':
            size = fontSize * 5 + 2 * tickSizeInner;
            ticksNum = Math.round(width / size);

            for (let i = 0; i < ticksNum; i += 1) {
                arr.push(size/2 * (2*i+1));
            }
            return arr;
        case 'h':
            size = fontSize * 18 + 2 * tickSizeInner;
            ticksNum = Math.round(width / size);

            for (let i = 0; i < ticksNum; i += 1) {
                arr.push(size/2 * (2*i+1));
            }
            return arr;
        case 'w':
        case 'd':
        case 'M':
            size = fontSize * 8  + 2 * tickSizeInner;
            ticksNum = Math.round(width / size);

            for (let i = 0; i < ticksNum; i += 1) {
                arr.push(size/2 * (2*i+1));
            }
            return arr;
        case 'y':
            size = fontSize * 4 + 2 * tickSizeInner;
            ticksNum = Math.round(width / size);

            for (let i = 0; i < ticksNum; i += 1) {
                arr.push(size/2 * (2*i+1));
            }
            return arr;
    }
};

export default getAxisXTicks;
