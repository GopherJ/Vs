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
        case 's':
            size = fontSize * 6 + 2 * tickSizeInner;
            ticksNum = Math.round(width / size);

            for (let i = 0; i < ticksNum; i += 1) {
                arr.push(size/2 * (2*i+1));
            }
            return arr;
            break;
        case 'm':
            size = fontSize * 4 + 2 * tickSizeInner;
            ticksNum = Math.round(width / size);

            for (let i = 0; i < ticksNum; i += 1) {
                arr.push(size/2 * (2*i+1));
            }
            return arr;
            break;
        case 'h':
            size = fontSize * 12 + 2 * tickSizeInner;
            ticksNum = Math.round(width / size);

            for (let i = 0; i < ticksNum; i += 1) {
                arr.push(size/2 * (2*i+1));
            }
            return arr;
            break;
        case 'w':
        case 'd':
        case 'M':
            size = fontSize * 6  + 2 * tickSizeInner;
            ticksNum = Math.round(width / size);

            for (let i = 0; i < ticksNum; i += 1) {
                arr.push(size/2 * (2*i+1));
            }
            return arr;
            break;
        case 'y':
            size = fontSize * 3 + 2 * tickSizeInner;
            ticksNum = Math.round(width / size);

            for (let i = 0; i < ticksNum; i += 1) {
                arr.push(size/2 * (2*i+1));
            }
            return arr;
            break;
    }
};

export default getAxisXTicks;
