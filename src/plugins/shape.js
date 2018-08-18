/**
 *
 * @param w
 * @param h
 */
const pause = (w, h) => {
    const W = 1 / 6,
          H = 4 / 9,
          M = 1 / 12;

    const y1 = h * (1 - H) / 2,
          y2 = y1 + h * H;

    const x1 = w * (1 - M - 2 * W) / 2,
          x2 = x1 + W * w,
          x3 = x2 + M * w,
          x4 = x3 + W * w;

    return [
        `M${x1},${y1}`,
        `L${x2},${y1}`,
        `${x2},${y2}`,
        `${x1},${y2}`,
        `M${x3},${y1}`,
        `L${x4},${y1}`,
        `${x4},${y2}`,
        `${x3},${y2}`
    ].join(' ');
};


/**
 *
 * @param w
 * @param h
 * @return {string}
 */
const triangle = (w, h) => {
    const L = 4 / 9,
          W = 5 / 12;

    const y1 = h * (1 - L) / 2,
          y2 = y1 + (h * L) / 4,
          y3 = y1 + (h * L) / 2,
          y4 = y1 + (h * L) * 3 / 4,
          y5 = y1 + h * L;

    const x1 = w * (1 - W) / 2,
          x2 = x1 + w * W / 2,
          x3 = x1 + w * W;

    return [
        `M${x1},${y1}`,
        `L${x2},${y2}`,
        `${x2},${y4}`,
        `${x1},${y5}`,
        `M${x2},${y2}`,
        `L${x3},${y3}`,
        `${x3},${y3}`,
        `${x2},${y4}`
    ].join(' ');
};

export default {
    pause,
    triangle
};


