/* eslint-disable */
const color_hex_regexp = /^#[0-9a-fA-F]{6}$/;

const isValidColor = (color) => {
    if (typeof color === 'string' && color_hex_regexp.test(color)) {
        return true;
    }

    if (typeof color === 'object' && color.constructor === Array) {
        return color.length === 3 && color.every(el => el >= 0 && el <= 255);
    }

    return false;
};

const normalizeColor = (color) => {
    if (typeof color === 'string') {
        const colorArr = [];
        for (let i = 1; i < 6; i += 2) {
            colorArr.push(Number.parseInt(color.substr(i, 2), 16));
        }
        return colorArr;
    }

    return color;
};

export default function (color, arr, val) {
    if (!isValidColor(color)) {
        throw new Error('color format invalid, color should be [r, g, b] or #ffffff');
    }

    const normalizedColor = normalizeColor(color);

    const max = Math.max(...arr);
    const min = Math.min(...arr);

    if (val > max || val < min) {
        throw new Error('val should be in the range of the arr');
    }

    return `rgba(${normalizedColor.toString()},${((val - min) / (max - min)).toFixed(2)})`;
};


