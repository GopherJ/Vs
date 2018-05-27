/**
 *
 * generate svg path's d to simulate rounded rect
 *
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} r
 * @param {boolean} tl
 * @param {boolean} tr
 * @param {boolean} bl
 * @param {boolean} br
 * @returns {string}
 */
function roundedRect(x, y, w, h, r, tl, tr, bl, br) {
    let retval;
    retval = 'M' + (x + r) + ',' + y;
    retval += 'h' + (w - 2 * r);
    if (tr) {
        retval += 'a' + r + ',' + r + ' 0 0 1 ' + r + ',' + r;
    } else {
        retval += 'h' + r;
        retval += 'v' + r;
    }
    retval += 'v' + (h - 2 * r);
    if (br) {
        retval += 'a' + r + ',' + r + ' 0 0 1 ' + -r + ',' + r;
    } else {
        retval += 'v' + r;
        retval += 'h' + -r;
    }
    retval += 'h' + (2 * r - w);
    if (bl) {
        retval += 'a' + r + ',' + r + ' 0 0 1 ' + -r + ',' + -r;
    } else {
        retval += 'h' + -r;
        retval += 'v' + -r;
    }
    retval += 'v' + (2 * r - h);
    if (tl) {
        retval += 'a' + r + ',' + r + ' 0 0 1 ' + r + ',' + -r;
    } else {
        retval += 'v' + -r;
        retval += 'h' + r;
    }
    retval += 'z';
    return retval;
}

export default roundedRect;
