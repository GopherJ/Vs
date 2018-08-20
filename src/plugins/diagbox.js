/**
 *
 * @param x
 * @param y
 * @param w
 * @param h
 * @param l
 * @param r
 * @param tl
 * @param tr
 * @param bl
 * @param br
 * @return {string}
 */
function diagbox(x, y, w, h, l, r, tl, tr, bl, br) {
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
    retval += 'h' + (r - (w - l) / 2);
    retval += 'l' + -l / 2 + ',' + Math.sqrt(3) / 2 * l;
    retval += 'l' + -l / 2 + ',' + -Math.sqrt(3) / 2 * l;
    retval += 'h' + (r - (w - l) / 2);
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

export default diagbox;
